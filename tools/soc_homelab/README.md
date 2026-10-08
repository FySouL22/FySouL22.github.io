# Cyber Defense & SOC HomeLab Suite v1.5

> **Wazuh SIEM Automated Deployment & Adversary Emulation Framework**  
> Developed by **Mohamed Fathi (Ft7y.Sec)** — [GitHub Profile](https://github.com/FySouL22)

![Ft7y.Sec](https://img.shields.io/badge/Author-Mohamed%20Fathi-00ff66?style=for-the-badge&logo=linux)
![Wazuh](https://img.shields.io/badge/SIEM-Wazuh%204.8-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

> **Safety:** This is a lab-only prototype. The sample indexer configuration disables its security plugin and must remain bound to loopback. Do not expose the indexer/dashboard to the internet or an untrusted LAN. Remote-agent ports default to loopback; only bind them to a dedicated, firewalled lab IP when needed.

---

## ⚡ Features
- 🐳 **1-Command Deployment**: Launches Wazuh Manager, Indexer, and Dashboard via Docker Compose in under 5 minutes.
- 🎯 **Telemetry exercises**: Sends SSH TCP/banner probes (not login attempts) and runs limited local discovery commands. Whether alerts appear depends on endpoint telemetry, agents, and SIEM rules.
- 🛡️ **Sysmon & Event Log Mapping**: Correlates Windows Event IDs (4625, 4624, 7045) and Linux `auth.log` in real time.
- 📊 **Unified Dashboard**: Web console for threat detection, regulatory compliance, and active response.

---

## 🛠️ Quick Start

```bash
git clone https://github.com/FySouL22/ft7.cv.github.io.git
cd ft7.cv.github.io/tools/soc_homelab
python deploy_homelab.py --deploy
```

The dashboard is bound to `https://localhost` by default. Verify the health and logs of every container before assuming the stack is ready. This simplified sample disables indexer authentication and is not production-ready.

### Run Detection Tests:
```bash
# Send SSH TCP/banner probes only (does not submit credentials or guarantee failed-login events)
python deploy_homelab.py --simulate-bruteforce 127.0.0.1

# Run limited local discovery commands (review source before execution)
python deploy_homelab.py --simulate-recon
```
