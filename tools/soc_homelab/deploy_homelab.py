#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
=============================================================================
Cyber Defense & SOC HomeLab Automated Deployment & Attack Simulator v1.5
Author: Mohamed Fathi (Ft7y.Sec)
GitHub: https://github.com/FySouL22/cyber-defense-homelab
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

DOCKER_COMPOSE_TEMPLATE = """version: '3.8'

services:
  wazuh.indexer:
    image: wazuh/wazuh-indexer:4.8.0
    container_name: wazuh.indexer
    hostname: wazuh.indexer
    restart: always
    ports:
      # Lab-only indexer API: never publish this port to the LAN.
      - "127.0.0.1:9200:9200"
    environment:
      - "OPENSEARCH_JAVA_OPTS=-Xms1g -Xmx1g"
      - "bootstrap.memory_lock=true"
      - "discovery.type=single-node"
      - "DISABLE_INSTALL_DEMO_CONFIG=true"
      # This simplified demo disables indexer auth. Keep port 9200 loopback-only.
      - "DISABLE_SECURITY_PLUGIN=true"
    ulimits:
      memlock:
        soft: -1
        hard: -1
      nofile:
        soft: 65536
        hard: 65536

  wazuh.manager:
    image: wazuh/wazuh-manager:4.8.0
    container_name: wazuh.manager
    hostname: wazuh.manager
    restart: always
    ports:
      # Defaults to loopback. Set LAB_BIND_IP to a dedicated, firewalled lab IP only if remote agents need access.
      - "${LAB_BIND_IP:-127.0.0.1}:1514:1514/udp"
      - "${LAB_BIND_IP:-127.0.0.1}:1515:1515"
      - "${LAB_BIND_IP:-127.0.0.1}:514:514/udp"
      # Wazuh API is administrative; keep it loopback-only.
      - "127.0.0.1:55000:55000"
    environment:
      - INDEXER_URL=http://wazuh.indexer:9200
    depends_on:
      - wazuh.indexer

  wazuh.dashboard:
    image: wazuh/wazuh-dashboard:4.8.0
    container_name: wazuh.dashboard
    hostname: wazuh.dashboard
    restart: always
    ports:
      - "127.0.0.1:443:5601"
    environment:
      - INDEXER_URL=http://wazuh.indexer:9200
      - WAZUH_API_URL=https://wazuh.manager
    depends_on:
      - wazuh.indexer
      - wazuh.manager
"""


def check_prerequisites():
    """Verify Docker and Docker Compose are present."""
    print(f"{CYAN}[*] Verifying system prerequisites...{RESET}")
    docker_check = subprocess.run(["docker", "--version"], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    if docker_check.returncode != 0:
        print(f"{RED}[-] Error: Docker is not installed or not in PATH.{RESET}")
        return False
    print(f"{GREEN}[✓] Docker detected: {docker_check.stdout.strip()}{RESET}")
    compose_check = subprocess.run(["docker", "compose", "version"], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    if compose_check.returncode != 0:
        print(f"{RED}[-] Error: Docker Compose plugin is unavailable.{RESET}")
        return False
    print(f"{GREEN}[✓] Docker Compose detected: {compose_check.stdout.strip()}{RESET}")
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
    """Generate docker-compose.yml and start containers."""
    if not check_prerequisites():
        sys.exit(1)

    print(f"{CYAN}[*] Creating docker-compose.yml for Wazuh All-in-One SOC...{RESET}")
    with open("docker-compose.yml", "w", encoding="utf-8") as f:
        f.write(DOCKER_COMPOSE_TEMPLATE)
    print(f"{GREEN}[✓] docker-compose.yml generated successfully.{RESET}")

    print(f"{YELLOW}[*] Spawning containers (this might take a few minutes)...{RESET}")
    result = subprocess.run(["docker", "compose", "up", "-d"], check=False)
    if result.returncode != 0:
        print(f"{RED}[-] Docker Compose failed (exit {result.returncode}). Review the output above; deployment is not confirmed.{RESET}")
        return False
    print(f"\n{BOLD}{GREEN}[✓] Docker Compose returned success. Verify container health before using the lab.{RESET}")
    print("    Dashboard URL : https://localhost")
    print("    Indexer API   : loopback-only at http://localhost:9200 (demo security plugin is disabled)")
    print("    Credentials   : do not assume defaults; consult the matching Wazuh version documentation.\n")
    print(f"{YELLOW}[!] LAB ONLY: do not expose the indexer or dashboard to an untrusted network.{RESET}")
    return True


def main():
    print(BANNER)
    parser = argparse.ArgumentParser(
        description="Cyber Defense & SOC HomeLab Deployer and Attack Simulator by Ft7y.Sec",
        formatter_class=argparse.RawDescriptionHelpFormatter
    )
    parser.add_argument("--deploy", action="store_true", help="Deploy Wazuh SIEM & Elastic stack via Docker Compose")
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
        subprocess.run(["docker", "compose", "ps"], check=False)
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
