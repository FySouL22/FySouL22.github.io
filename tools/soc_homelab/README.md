# Cyber Defense & SOC HomeLab Suite v1.5

> **Wazuh SIEM Automated Deployment & Adversary Emulation Framework**  
> Developed by **Mohamed Fathi (Ft7y.Sec)** — [GitHub Profile](https://github.com/FySouL22)

![Ft7y.Sec](https://img.shields.io/badge/Author-Mohamed%20Fathi-00ff66?style=for-the-badge&logo=linux)
![Wazuh](https://img.shields.io/badge/SIEM-Wazuh%204.8-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

---

## ⚡ Features
- 🐳 **1-Command Deployment**: Launches Wazuh Manager, Indexer, and Dashboard via Docker Compose in under 5 minutes.
- 🎯 **Integrated Adversary Attack Simulator**: Simulates SSH brute force, Mimikatz behavior, and SUID recon to validate SIEM alerts.
- 🛡️ **Sysmon & Event Log Mapping**: Correlates Windows Event IDs (4625, 4624, 7045) and Linux `auth.log` in real time.
- 📊 **Unified Dashboard**: Web console for threat detection, regulatory compliance, and active response.

---

## 🛠️ Quick Start

```bash
git clone https://github.com/FySouL22/cyber-defense-homelab.git
cd cyber-defense-homelab
python deploy_homelab.py --deploy
```

Once running, navigate to `https://localhost` to open the Wazuh Security Dashboard.

### Run Detection Tests:
```bash
# Test brute-force detection
python deploy_homelab.py --simulate-bruteforce 127.0.0.1

# Test suspicious privilege escalation commands
python deploy_homelab.py --simulate-recon
```
