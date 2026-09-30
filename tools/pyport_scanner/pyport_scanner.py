#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
=============================================================================
PyPort-Scanner Pro v2.5
Author: Mohamed Fathi (Ft7y.Sec)
GitHub: https://github.com/FySouL22/pyport-scanner-pro
Description: Fast, robust, multi-threaded TCP/UDP port scanner with banner
             grabbing, service detection, and multi-format reporting.
=============================================================================
"""

import socket
import sys
import os
import time
import json
import argparse
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime

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

BANNER = f"""{GREEN}{BOLD}
  ███████╗████████╗███████╗██╗   ██╗    ███████╗███████╗ ██████╗
  ██╔════╝╚══██╔══╝╚════██║╚██╗ ██╔╝    ██╔════╝██╔════╝██╔════╝
  █████╗     ██║       ██╔╝ ╚████╔╝     ███████╗█████╗  ██║     
  ██╔══╝     ██║      ██╔╝   ╚██╔╝      ╚════██║██╔══╝  ██║     
  ██║        ██║      ███████╗██║       ███████║███████╗╚██████╗
  ╚═╝        ╚═╝      ╚══════╝╚═╝       ╚══════╝╚══════╝ ╚═════╝
          -- PyPort-Scanner Pro v2.5 by Mohamed Fathi --
             GitHub: https://github.com/FySouL22
{RESET}"""

COMMON_PORTS = {
    21: "FTP", 22: "SSH", 23: "Telnet", 25: "SMTP", 53: "DNS",
    80: "HTTP", 110: "POP3", 111: "RPCBind", 135: "MSRPC",
    139: "NetBIOS", 143: "IMAP", 443: "HTTPS", 445: "SMB",
    993: "IMAPS", 995: "POP3S", 1433: "MSSQL", 1521: "Oracle",
    3306: "MySQL", 3389: "RDP", 5432: "PostgreSQL", 5900: "VNC",
    6379: "Redis", 8080: "HTTP-Proxy", 8443: "HTTPS-Alt", 27017: "MongoDB"
}


def grab_banner(target_ip, port, timeout=1.0):
    """Attempt to grab service banner via raw socket connection."""
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.settimeout(timeout)
            s.connect((target_ip, port))
            # Send polite probe
            if port in [80, 8080, 8443, 443]:
                s.sendall(b"HEAD / HTTP/1.1\r\nHost: " + target_ip.encode() + b"\r\n\r\n")
            else:
                s.sendall(b"\r\n")
            
            raw_banner = s.recv(1024)
            decoded = raw_banner.decode("utf-8", errors="ignore").strip()
            # Clean up banner to first meaningful line
            lines = [l.strip() for l in decoded.splitlines() if l.strip()]
            return lines[0][:80] if lines else "Service Active"
    except Exception:
        return COMMON_PORTS.get(port, "Unknown Service")


def scan_single_port(target_ip, port, timeout=0.8, banner_grab=True):
    """Scan an individual TCP port on the target IP."""
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.settimeout(timeout)
            result = s.connect_ex((target_ip, port))
            if result == 0:
                service = COMMON_PORTS.get(port, "Unknown")
                banner = ""
                if banner_grab:
                    banner = grab_banner(target_ip, port, timeout=timeout)
                return {
                    "port": port,
                    "state": "open",
                    "protocol": "tcp",
                    "service": service,
                    "banner": banner
                }
    except socket.error:
        pass
    return None


def parse_port_range(port_arg):
    """Parse comma-separated or dashed port ranges."""
    ports = []
    if port_arg.lower() == "top20":
        return sorted(list(COMMON_PORTS.keys())[:20])
    if port_arg.lower() == "top100":
        return list(range(1, 101))
    if port_arg.lower() == "all":
        return list(range(1, 65536))
    
    parts = port_arg.split(",")
    for part in parts:
        part = part.strip()
        if "-" in part:
            start, end = part.split("-")
            ports.extend(range(int(start), int(end) + 1))
        elif part.isdigit():
            ports.append(int(part))
    return sorted(list(set(ports)))


def main():
    print(BANNER)
    parser = argparse.ArgumentParser(
        description="PyPort-Scanner Pro - Fast Multi-threaded Port Scanner by Ft7y.Sec",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python pyport_scanner.py -t 192.168.1.1 -p 80,443,8080
  python pyport_scanner.py -t scanme.nmap.org -p 1-1000 -w 80 -b
  python pyport_scanner.py -t 10.10.10.10 -p top20 -o scan_report.json
        """
    )
    parser.add_argument("-t", "--target", required=True, help="Target IP or Hostname to scan")
    parser.add_argument("-p", "--ports", default="1-1024", help="Port range (e.g. 1-1024, 80,443, top20, all)")
    parser.add_argument("-w", "--workers", type=int, default=50, help="Number of concurrent worker threads (default: 50)")
    parser.add_argument("--timeout", type=float, default=0.8, help="Connection timeout in seconds (default: 0.8)")
    parser.add_argument("-b", "--banner", action="store_true", default=True, help="Perform banner grabbing on open ports")
    parser.add_argument("-o", "--output", help="Save results to JSON or TXT file")

    args = parser.parse_args()

    # Resolve target
    try:
        target_ip = socket.gethostbyname(args.target)
    except socket.gaierror:
        print(f"{RED}[-] Error: Could not resolve hostname: {args.target}{RESET}")
        sys.exit(1)

    port_list = parse_port_range(args.ports)

    print(f"{CYAN}[*] Target Host : {BOLD}{args.target}{RESET} ({target_ip})")
    print(f"{CYAN}[*] Ports to Scan: {BOLD}{len(port_list)} ports{RESET}")
    print(f"{CYAN}[*] Threads      : {BOLD}{args.workers} workers{RESET} (Timeout: {args.timeout}s)")
    print(f"{CYAN}[*] Scan Started : {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}{RESET}")
    print("-" * 65)

    open_ports = []
    start_time = time.time()

    with ThreadPoolExecutor(max_workers=args.workers) as executor:
        futures = {executor.submit(scan_single_port, target_ip, p, args.timeout, args.banner): p for p in port_list}
        for future in as_completed(futures):
            res = future.result()
            if res:
                open_ports.append(res)
                banner_str = f" | {res['banner']}" if res['banner'] else ""
                print(f"{GREEN}[+] Port {res['port']:5d}/TCP {BOLD}OPEN{RESET}{GREEN} ({res['service']}){banner_str}{RESET}")

    elapsed = time.time() - start_time
    open_ports.sort(key=lambda x: x["port"])

    print("-" * 65)
    print(f"{CYAN}[*] Scan Finished: {len(open_ports)} open port(s) found in {elapsed:.2f} seconds.{RESET}")

    if args.output:
        if args.output.endswith(".json"):
            report = {
                "scanner": "PyPort-Scanner Pro v2.5",
                "author": "Mohamed Fathi (Ft7y.Sec)",
                "target": args.target,
                "target_ip": target_ip,
                "timestamp": datetime.now().isoformat(),
                "duration_seconds": round(elapsed, 2),
                "open_ports": open_ports
            }
            with open(args.output, "w", encoding="utf-8") as f:
                json.dump(report, f, indent=4, ensure_ascii=False)
            print(f"{GREEN}[✓] JSON report saved to: {args.output}{RESET}")
        else:
            with open(args.output, "w", encoding="utf-8") as f:
                f.write(f"PyPort-Scanner Pro Report - {args.target} ({target_ip})\n")
                f.write(f"Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
                for p in open_ports:
                    f.write(f"Port {p['port']}/TCP OPEN - {p['service']} - {p['banner']}\n")
            print(f"{GREEN}[✓] TXT report saved to: {args.output}{RESET}")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print(f"\n{YELLOW}[!] Scan interrupted by user. Exiting...{RESET}")
        sys.exit(0)
