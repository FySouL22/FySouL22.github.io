# SubDomain Reckoner v2.0

> **Passive OSINT Subdomain Enumerator & Live HTTP Prober**  
> Developed by **Mohamed Fathi (Ft7y.Sec)** — [GitHub Profile](https://github.com/FySouL22)

![Ft7y.Sec](https://img.shields.io/badge/Author-Mohamed%20Fathi-00ff66?style=for-the-badge&logo=python)
![OSINT](https://img.shields.io/badge/Category-OSINT%20Recon-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

---

## ⚡ Features
- 🌐 **100% Passive Reconnaissance**: Queries public Certificate Transparency (crt.sh) logs and HackerTarget API without touching the target.
- 📡 **Multi-threaded HTTP Probing**: Resolves IP addresses, extracts HTTP status codes, web server headers, and webpage titles.
- 🚀 **Zero External Dependencies**: Pure Python 3 standard library implementation.
- 📑 **Export Formats**: Outputs clean subdomain wordlists (`.txt`) or structured vulnerability intelligence (`.json`).

---

## 🛠️ Installation
```bash
git clone https://github.com/FySouL22/subdomain-reckoner.git
cd subdomain-reckoner
python subdomain_reckoner.py -h
```

---

## 💻 Usage & Examples

### 1. Basic passive discovery:
```bash
python subdomain_reckoner.py -d tesla.com
```

### 2. Full enumeration with live HTTP probing (30 threads):
```bash
python subdomain_reckoner.py -d example.com --probe -t 30
```

### 3. Save discovered subdomains to JSON:
```bash
python subdomain_reckoner.py -d target.com -o subdomains_report.json
```

---

## 📄 License
This project is licensed under the MIT License - intended for ethical bug bounty reconnaissance and authorized assessments.
