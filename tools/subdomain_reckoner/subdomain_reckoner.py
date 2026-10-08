#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
=============================================================================
SubDomain Reckoner v2.0
Author: Mohamed Fathi (Ft7y.Sec)
GitHub: https://github.com/FySouL22/subdomain-reckoner
Description: Passive OSINT Subdomain Enumerator & Live HTTP Prober using
             Certificate Transparency Logs, HackerTarget, and DNS resolution.
=============================================================================
"""

import sys
import re
import json
import socket
import argparse
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime
import urllib.request
import urllib.error

# Configure Windows UTF-8 stdout
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

# ANSI Colors
CYAN = "\033[96m"
GREEN = "\033[92m"
YELLOW = "\033[93m"
RED = "\033[91m"
BOLD = "\033[1m"
RESET = "\033[0m"

BANNER = f"""{CYAN}{BOLD}
  ███████╗██╗   ██╗██████╗ ██████╗  ██████╗ ███╗   ███╗ █████╗ ██╗███╗   ██╗
  ██╔════╝██║   ██║██╔══██╗██╔══██╗██╔═══██╗████╗ ████║██╔══██╗██║████╗  ██║
  ███████╗██║   ██║██████╔╝██║  ██║██║   ██║██╔████╔██║███████║██║██╔██╗ ██║
  ╚════██║██║   ██║██╔══██╗██║  ██║██║   ██║██║╚██╔╝██║██╔══██║██║██║╚██╗██║
  ███████║╚██████╔╝██████╔╝██████╔╝╚██████╔╝██║ ╚═╝ ██║██║  ██║██║██║ ╚████║
  ╚══════╝ ╚═════╝ ╚═════╝ ╚═════╝  ╚═════╝ ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝
          -- SubDomain Reckoner v2.0 by Mohamed Fathi (Ft7y.Sec) --
                    GitHub: https://github.com/FySouL22
{RESET}"""

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36"
}


def query_crtsh(domain):
    """Query crt.sh Certificate Transparency logs."""
    subdomains = set()
    url = f"https://crt.sh/?q=%.{domain}&output=json"
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=12) as response:
            if response.status == 200:
                data = json.loads(response.read().decode("utf-8", errors="ignore"))
                for entry in data:
                    name_value = entry.get("name_value", "")
                    for sub in name_value.splitlines():
                        sub = sub.strip().lower()
                        if "*" in sub:
                            sub = sub.replace("*.", "")
                        if sub.endswith(domain) and sub != domain:
                            subdomains.add(sub)
    except Exception:
        pass
    return subdomains


def query_hackertarget(domain):
    """Query HackerTarget public host search API."""
    subdomains = set()
    url = f"https://api.hackertarget.com/hostsearch/?q={domain}"
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=10) as response:
            if response.status == 200:
                text = response.read().decode("utf-8", errors="ignore")
                for line in text.splitlines():
                    if "," in line:
                        host, _ = line.split(",", 1)
                        host = host.strip().lower()
                        if host.endswith(domain):
                            subdomains.add(host)
    except Exception:
        pass
    return subdomains


def probe_http(subdomain):
    """Probe live HTTP/HTTPS status, web server header, and title."""
    result = {
        "subdomain": subdomain,
        "ip": "Unresolved",
        "live": False,
        "status_code": 0,
        "title": "N/A",
        "server": "N/A"
    }

    # DNS check
    try:
        ip = socket.gethostbyname(subdomain)
        result["ip"] = ip
    except socket.gaierror:
        return result

    # HTTP probe
    for proto in ["https", "http"]:
        url = f"{proto}://{subdomain}"
        try:
            req = urllib.request.Request(url, headers=HEADERS)
            with urllib.request.urlopen(req, timeout=4) as response:
                result["live"] = True
                result["status_code"] = response.status
                result["server"] = response.headers.get("Server", "Unknown")
                
                # Title extraction
                html = response.read(4096).decode("utf-8", errors="ignore")
                match = re.search(r"<title>(.*?)</title>", html, re.IGNORECASE)
                if match:
                    result["title"] = match.group(1).strip()[:50]
                break
        except urllib.error.HTTPError as e:
            result["live"] = True
            result["status_code"] = e.code
            result["server"] = e.headers.get("Server", "Unknown")
            break
        except Exception:
            continue

    return result


def main():
    print(BANNER)
    parser = argparse.ArgumentParser(
        description="SubDomain Reckoner - Passive OSINT Subdomain Enumerator by Ft7y.Sec",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python subdomain_reckoner.py -d target.com
  python subdomain_reckoner.py -d target.com --probe -t 30
  python subdomain_reckoner.py -d target.com -o subdomains.json
        """
    )
    parser.add_argument("-d", "--domain", required=True, help="Target root domain (e.g., example.com)")
    parser.add_argument("--probe", action="store_true", default=True, help="Probe discovered subdomains for live HTTP/S response")
    parser.add_argument("-t", "--threads", type=int, default=30, help="Concurrent probe threads (default: 30)")
    parser.add_argument("-o", "--output", help="Save results to JSON or TXT file")

    args = parser.parse_args()
    domain = args.domain.strip().lower()

    print(f"{CYAN}[*] Target Domain : {BOLD}{domain}{RESET}")
    print(f"{CYAN}[*] Mode          : {BOLD}Passive OSINT (crt.sh + HackerTarget){RESET}")
    print(f"{CYAN}[*] Started At    : {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}{RESET}")
    print("-" * 65)

    print(f"{YELLOW}[*] Querying Certificate Transparency logs (crt.sh)...{RESET}")
    subs_crt = query_crtsh(domain)
    print(f"{GREEN}[+] crt.sh discovered: {len(subs_crt)} subdomains{RESET}")

    print(f"{YELLOW}[*] Querying HackerTarget DNS database...{RESET}")
    subs_ht = query_hackertarget(domain)
    print(f"{GREEN}[+] HackerTarget discovered: {len(subs_ht)} subdomains{RESET}")

    all_subs = sorted(list(subs_crt.union(subs_ht)))
    print("-" * 65)
    print(f"{BOLD}{GREEN}[✓] Total Unique Subdomains Identified: {len(all_subs)}{RESET}")

    if not all_subs:
        print(f"{RED}[-] No subdomains found for {domain}. Exiting.{RESET}")
        sys.exit(0)

    live_results = []
    if args.probe:
        print(f"\n{CYAN}[*] Probing {len(all_subs)} subdomains for live HTTP/DNS status (Threads: {args.threads})...{RESET}")
        print("-" * 75)

        with ThreadPoolExecutor(max_workers=args.threads) as executor:
            futures = {executor.submit(probe_http, sub): sub for sub in all_subs}
            for future in as_completed(futures):
                res = future.result()
                live_results.append(res)
                if res["live"]:
                    code_color = GREEN if res["status_code"] in [200, 301, 302] else YELLOW
                    print(f"{GREEN}[+] {res['subdomain']:35s} | IP: {res['ip']:15s} | {code_color}[{res['status_code']}]{RESET} | {res['title']}")
                else:
                    if res["ip"] != "Unresolved":
                        print(f"{YELLOW}[?] {res['subdomain']:35s} | IP: {res['ip']:15s} | [No HTTP Response]{RESET}")

    # Output Saving
    if args.output:
        if args.output.endswith(".json"):
            report = {
                "tool": "SubDomain Reckoner v2.0",
                "author": "Mohamed Fathi (Ft7y.Sec)",
                "target_domain": domain,
                "timestamp": datetime.now().isoformat(),
                "total_subdomains": len(all_subs),
                "results": live_results if args.probe else all_subs
            }
            with open(args.output, "w", encoding="utf-8") as f:
                json.dump(report, f, indent=4, ensure_ascii=False)
            print(f"\n{GREEN}[✓] JSON report saved to: {args.output}{RESET}")
        else:
            with open(args.output, "w", encoding="utf-8") as f:
                for sub in all_subs:
                    f.write(f"{sub}\n")
            print(f"\n{GREEN}[✓] TXT wordlist saved to: {args.output}{RESET}")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print(f"\n{YELLOW}[!] Operation canceled by user.{RESET}")
        sys.exit(0)
