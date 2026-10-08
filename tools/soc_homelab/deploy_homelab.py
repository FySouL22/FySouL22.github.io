#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
=============================================================================
Cyber Defense & SOC HomeLab Automated Deployment & Attack Simulator v1.5
Author: Mohamed Fathi (Ft7y.Sec)
GitHub: https://github.com/FySouL22/ft7.cv.github.io/tree/main/tools/soc_homelab
Description: Automated deployment helper for Wazuh SIEM + Elastic Indexer,
             health verification, and integrated adversary attack simulator.
=============================================================================
"""

import sys
import os
import time
import subprocess
import argparse
import socket

# Configure Windows UTF-8 stdout
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

CYAN = "\033[96m"
GREEN = "\033[92m"
YELLOW = "\033[93m"
RED = "\033[91m"
BOLD = "\033[1m"
RESET = "\033[0m"

BANNER = f"""{GREEN}{BOLD}
  ███████╗ ██████╗  ██████╗    ███████╗██╗███████╗███╗   ███╗
  ██╔════╝██╔═══██╗██╔════╝    ██╔════╝██║██╔════╝████╗ ████║
  ███████╗██║   ██║██║         ███████╗██║█████╗  ██╔████╔██║
  ╚════██║██║   ██║██║         ╚════██║██║██╔══╝  ██║╚██╔╝██║
  ███████║╚██████╔╝╚██████╗    ███████║██║███████╗██║ ╚═╝ ██║
  ╚══════╝ ╚═════╝  ╚═════╝    ╚══════╝╚═╝╚══════╝╚═╝     ╚═╝
     -- Cyber Defense & SOC HomeLab Suite by Mohamed Fathi --
                  GitHub: https://github.com/FySouL22
{RESET}"""

WAZUH_VERSION = "v4.14.8"
WAZUH_REPOSITORY = "https://github.com/wazuh/wazuh-docker.git"
WAZUH_DIRECTORY = f"wazuh-docker-{WAZUH_VERSION}"
SINGLE_NODE_DIRECTORY = os.path.join(WAZUH_DIRECTORY, "single-node")

# The official upstream Compose file publishes these ports on all interfaces.
# This lab helper deliberately restricts every published port to loopback.
LOOPBACK_PORT_BINDINGS = [
    ('- "1514:1514"', '- "127.0.0.1:1514:1514"'),
    ('- "1515:1515"', '- "127.0.0.1:1515:1515"'),
    ('- "514:514/udp"', '- "127.0.0.1:514:514/udp"'),
    ('- "55000:55000"', '- "127.0.0.1:55000:55000"'),
    ('- "9200:9200"', '- "127.0.0.1:9200:9200"'),
    ('- 443:5601', '- "127.0.0.1:443:5601"'),
]


def patch_compose_loopback(compose_path):
    """Fail closed unless every expected upstream port mapping is safely bound."""
    with open(compose_path, "r", encoding="utf-8") as f:
        content = f.read()

    if "DISABLE_SECURITY_PLUGIN=true" in content:
        print(f"{RED}[-] Refusing to run: the indexer security plugin is disabled.{RESET}")
        return False

    for original, hardened in LOOPBACK_PORT_BINDINGS:
        if hardened in content:
            continue
        count = content.count(original)
        if count != 1:
            print(f"{RED}[-] Cannot safely patch expected port mapping {original!r} (matches: {count}).{RESET}")
            print(f"{YELLOW}[i] Review the upstream Compose file for version {WAZUH_VERSION}; no deployment was started.{RESET}")
            return False
        content = content.replace(original, hardened, 1)

    required = [hardened for _, hardened in LOOPBACK_PORT_BINDINGS]
    if any(mapping not in content for mapping in required):
        print(f"{RED}[-] Loopback binding validation failed; no deployment was started.{RESET}")
        return False

    with open(compose_path, "w", encoding="utf-8") as f:
        f.write(content)
    return True



def check_prerequisites():
    """Verify Docker, Docker Compose, and Git are present."""
    print(f"{CYAN}[*] Verifying system prerequisites...{RESET}")
    checks = [
        (["docker", "--version"], "Docker"),
        (["docker", "compose", "version"], "Docker Compose"),
        (["git", "--version"], "Git"),
    ]
    for command, label in checks:
        result = subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, check=False)
        if result.returncode != 0:
            print(f"{RED}[-] Error: {label} is unavailable or not in PATH.{RESET}")
            return False
        print(f"{GREEN}[✓] {label} detected: {result.stdout.strip()}{RESET}")
    return True


def simulate_bruteforce(target_ip, port=22, attempts=5):
    """Send harmless SSH TCP/banner probes; this does not attempt authentication."""
    print(f"\n{YELLOW}[*] Sending SSH TCP/banner probes to {target_ip}:{port} (no login attempts)...{RESET}")
    for i in range(1, attempts + 1):
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.settimeout(1.5)
                s.connect((target_ip, port))
                s.sendall(b"SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.1\r\n")
                time.sleep(0.3)
                print(f"    [!] SSH banner probe sent #{i}; no credentials were submitted.")
        except (OSError, TimeoutError) as exc:
            print(f"    [!] TCP probe #{i} did not connect: {exc.__class__.__name__}")
    print(f"{YELLOW}[i] These probes do not generate failed-login events by themselves; alerting depends on the target and installed rules.{RESET}")


def simulate_privesc_recon():
    """Run limited local discovery commands; this is not a guaranteed alert generator."""
    print(f"\n{YELLOW}[*] Running local discovery commands (review before use)...{RESET}")
    if os.name == "nt":
        recon_cmds = [
            ["whoami", "/priv"],
            ["net", "user", "Administrator"],
        ]
    else:
        recon_cmds = [
            ["whoami"],
            ["id"],
            ["find", "/usr/bin", "/usr/local/bin", "-perm", "-4000", "-type", "f"],
        ]

    for command in recon_cmds:
        print(f"    [!] Executing: {' '.join(command)}")
        try:
            result = subprocess.run(
                command,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
                timeout=10,
                check=False,
            )
            print(f"        exit status: {result.returncode}")
        except (OSError, subprocess.TimeoutExpired) as exc:
            print(f"        skipped/failed: {exc.__class__.__name__}")
    print(f"{YELLOW}[i] Alert generation depends on endpoint telemetry, agent configuration, and SIEM rules.{RESET}")


def deploy_lab():
    """Deploy the official Wazuh single-node stack with TLS/auth and loopback-only ports."""
    if not check_prerequisites():
        return False

    compose_path = os.path.join(SINGLE_NODE_DIRECTORY, "docker-compose.yml")
    if not os.path.isdir(WAZUH_DIRECTORY):
        print(f"{CYAN}[*] Cloning official Wazuh Docker stack ({WAZUH_VERSION})...{RESET}")
        clone = subprocess.run(
            ["git", "clone", "--depth", "1", "--branch", WAZUH_VERSION, WAZUH_REPOSITORY, WAZUH_DIRECTORY],
            check=False,
        )
        if clone.returncode != 0:
            print(f"{RED}[-] Could not clone the official Wazuh repository. No deployment was started.{RESET}")
            return False
    elif not os.path.isfile(compose_path):
        print(f"{RED}[-] {WAZUH_DIRECTORY} exists but is incomplete. Move it aside and rerun; it was not overwritten.{RESET}")
        return False

    if not os.path.isfile(compose_path):
        print(f"{RED}[-] Official Compose file not found: {compose_path}{RESET}")
        return False

    if not patch_compose_loopback(compose_path):
        return False

    print(f"{GREEN}[✓] Official Compose file validated: indexer security remains enabled and published ports bind to 127.0.0.1.{RESET}")
    print(f"{YELLOW}[!] Self-signed TLS certificates and the upstream demo credentials are used by the official lab template. Change all default passwords before any non-local exposure.{RESET}")

    print(f"{CYAN}[*] Generating the official Wazuh TLS certificates...{RESET}")
    certs = subprocess.run(
        ["docker", "compose", "-f", "generate-indexer-certs.yml", "run", "--rm", "generator"],
        cwd=SINGLE_NODE_DIRECTORY,
        check=False,
    )
    if certs.returncode != 0:
        print(f"{RED}[-] Certificate generation failed (exit {certs.returncode}); stack startup was skipped.{RESET}")
        return False

    print(f"{CYAN}[*] Starting the official Wazuh stack...{RESET}")
    result = subprocess.run(["docker", "compose", "up", "-d"], cwd=SINGLE_NODE_DIRECTORY, check=False)
    if result.returncode != 0:
        print(f"{RED}[-] Docker Compose failed (exit {result.returncode}). Review logs; deployment is not confirmed.{RESET}")
        return False

    print(f"\n{BOLD}{GREEN}[✓] Docker Compose returned success. Check container health before use.{RESET}")
    print("    Dashboard URL : https://localhost")
    print("    Indexer API   : https://localhost:9200 (loopback-only, TLS/auth enabled)")
    print(f"    Compose path  : {SINGLE_NODE_DIRECTORY}")
    print(f"{YELLOW}[!] LAB ONLY: default credentials must be changed and ports must remain firewalled.{RESET}")
    return True


def main():
    print(BANNER)
    parser = argparse.ArgumentParser(
        description="Cyber Defense & SOC HomeLab Deployer and Attack Simulator by Ft7y.Sec",
        formatter_class=argparse.RawDescriptionHelpFormatter
    )
    parser.add_argument("--deploy", action="store_true", help="Deploy official Wazuh Docker stack with TLS/auth and loopback-only ports")
    parser.add_argument("--simulate-bruteforce", help="Send SSH TCP/banner probes only; does not attempt logins")
    parser.add_argument("--simulate-recon", action="store_true", help="Run limited local discovery commands for telemetry testing")
    parser.add_argument("--status", action="store_true", help="Check status of running HomeLab containers")

    args = parser.parse_args()

    if args.deploy:
        deploy_lab()
    elif args.simulate_bruteforce:
        simulate_bruteforce(args.simulate_bruteforce)
    elif args.simulate_recon:
        simulate_privesc_recon()
    elif args.status:
        if os.path.isfile(os.path.join(SINGLE_NODE_DIRECTORY, "docker-compose.yml")):\n            subprocess.run(["docker", "compose", "ps"], cwd=SINGLE_NODE_DIRECTORY, check=False)\n        else:\n            print(f"{YELLOW}[i] Wazuh stack not found. Run with --deploy first.{RESET}")
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
