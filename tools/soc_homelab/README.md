# Cyber Defense & SOC HomeLab Suite v1.5

> **Wazuh SIEM Automated Deployment & Adversary Emulation Framework**  
> Developed by **Mohamed Fathi (Ft7y.Sec)** — [GitHub Profile](https://github.com/FySouL22)

![Ft7y.Sec](https://img.shields.io/badge/Author-Mohamed%20Fathi-00ff66?style=for-the-badge&logo=linux)
![Wazuh](https://img.shields.io/badge/SIEM-Wazuh%204.14.8-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

> **Safety:** This helper uses the official Wazuh Docker single-node stack (v4.14.8), keeps the indexer security plugin enabled, generates TLS certificates, and binds all published ports to `127.0.0.1`. It is for a local lab, not production. The upstream template includes demo credentials: change them before any non-local exposure and never commit secrets or generated private keys.

---

## ⚡ Features
- 🐳 **Official deployment**: Clones the pinned Wazuh Docker release, validates loopback-only port bindings, generates TLS certificates, and starts the official single-node stack.
- 🎯 **Telemetry exercises**: Sends SSH TCP/banner probes (not login attempts) and runs limited local discovery commands. Whether alerts appear depends on endpoint telemetry, agents, and SIEM rules.
- 🛡️ **Detection references**: Documents example Windows Event IDs (4625, 4624, 7045) and Linux `auth.log` sources; actual collection depends on endpoint agents and rule configuration.
- 📊 **Unified Dashboard**: Web console for threat detection, regulatory compliance, and active response.

---

## 🛠️ Quick Start

```bash
git clone https://github.com/FySouL22/ft7.cv.github.io.git
cd ft7.cv.github.io/tools/soc_homelab
python deploy_homelab.py --deploy
```

The dashboard is bound to `https://localhost` by default. The official stack keeps indexer security enabled and uses TLS certificates. Verify container health with `python deploy_homelab.py --status` and inspect logs before assuming the stack is ready. The upstream stack starts with documented demo credentials; rotate the admin, dashboard-service, and Wazuh API passwords before exposing any service beyond loopback. Never publish generated certificates/private keys or local `.env` files.

### Run Detection Tests:
```bash
# Send SSH TCP/banner probes only (does not submit credentials or guarantee failed-login events)
python deploy_homelab.py --simulate-bruteforce 127.0.0.1

# Run limited local discovery commands (review source before execution)
python deploy_homelab.py --simulate-recon
```
