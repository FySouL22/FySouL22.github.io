# PyPort-Scanner Pro v2.5

> **Fast, Multi-threaded Network Reconnaissance & Port Scanner**  
> Developed by **Mohamed Fathi (Ft7y.Sec)** — [GitHub Profile](https://github.com/FySouL22)

![Ft7y.Sec](https://img.shields.io/badge/Author-Mohamed%20Fathi-00ff66?style=for-the-badge&logo=python)
![Version](https://img.shields.io/badge/Version-2.5-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

---

## ⚡ Features
- 🚀 **High-Speed Multi-threading**: Powered by Python's `concurrent.futures.ThreadPoolExecutor`.
- 🔍 **Banner Grabbing**: Automatically probes open ports to identify running web servers, SSH versions, and daemon names.
- 🎯 **Flexible Port Ranges**: Supports syntax like `80,443,8080`, `1-1000`, `top20`, or `all`.
- 📊 **Multi-format Export**: Generates clean `.json` or `.txt` reports ready for CTF writeups or pentest reporting.
- 🛡️ **Zero External Dependencies**: Runs on standard Python 3 libraries (`socket`, `sys`, `json`).

---

## 🛠️ Installation
```bash
git clone https://github.com/FySouL22/ft7.cv.github.io.git
cd ft7.cv.github.io/tools/pyport_scanner
python pyport_scanner.py -h
```

---

## 💻 Usage & Examples

### 1. Fast scan of standard top ports:
```bash
python pyport_scanner.py -t scanme.nmap.org -p top20
```

### 2. Custom port range with 80 threads and banner grabbing:
```bash
python pyport_scanner.py -t 10.10.10.x -p 1-1000 -w 80 -b
```

### 3. Full scan with JSON report output:
```bash
python pyport_scanner.py -t 192.168.1.1 -p 80,443,8080,8443,3306 -o results.json
```

---

## 📄 License
This project is licensed under the MIT License - developed for educational and authorized penetration testing purposes.
