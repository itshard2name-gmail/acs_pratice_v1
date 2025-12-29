# OCI Deployment Guide for APCS Practice Platform

Hello! Acting as your SRE (Site Reliability Engineer), I have prepared this guide to help you deploy your application to Oracle Cloud Infrastructure (OCI) once your VM is ready.

This guide assumes you will be using a **standard Linux VM** (Ubuntu 22.04 or Oracle Linux 9) and **Docker Compose**.

---

## 🏗️ Phase 1: OCI Infrastructure Setup

Before dealing with code, we need to prepare the "Hardware" and Network.

### 1. Create Compute Instance
- **Image**: Ubuntu 22.04 Minimal (recommended for beginners) or Oracle Linux 9.
- **Shape**:
    - **Free Tier**: `VM.Standard.A1.Flex` (ARM, up to 4 OCPUs, 24GB RAM) - *Highly recommended if available.*
    - **Standard**: `VM.Standard.E2.1.Micro` (AMD, very weak, only for testing).
- **SSH Keys**: **SAVE YOUR SPECIFIC PRIVATE KEY**. You cannot recover it later.

### 2. Configure VCN (Virtual Cloud Network)
By default, OCI blocks all incoming traffic.
1. Go to **Networking** > **Virtual Cloud Networks**.
2. Click your VCN > **Security Lists** > **Default Security List**.
3. **Add Ingress Rules**:
    - **Source CIDR**: `0.0.0.0/0` (All traffic)
    - **Destination Port Range**:
        - `22` (SSH - should already be there)
        - `80` (HTTP)
        - `443` (HTTPS)

---

## 🛠️ Phase 2: Server Configuration

Once the VM is running, SSH into it:
```bash
ssh -i /path/to/your-key.key ubuntu@<YOUR_PUBLIC_IP>
```

### 1. OS Updates & Firewall (Crucial Step!)
OCI VMs have a host-level firewall (iptables/netfilter) distinct from the VCN Security List. You must open ports here too.

**For Ubuntu:**
```bash
sudo apt update && sudo apt upgrade -y
# Ubuntu uses iptables by default. To make it easy, install UFW:
sudo apt install ufw
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

**For Oracle Linux:**
```bash
sudo dnf update -y
sudo firewall-cmd --permanent --add-port=80/tcp
sudo firewall-cmd --permanent --add-port=443/tcp
sudo firewall-cmd --reload
```

### 2. Install Docker & Docker Compose
```bash
# Ubuntu
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
# Add user to docker group (avoid using sudo for docker)
sudo usermod -aG docker $USER
# Activate group changes (or logout and login again)
newgrp docker
```

---

## 🚀 Phase 3: Application Deployment

### 1. Clone & Prepare
```bash
# Clone your repo (you might need to generate an SSH key on the server and add to GitHub first)
git clone https://github.com/Start-Boutique/acs_pratice_v1.git
cd acs_pratice_v1
```

### 2. Security Configuration (SRE Recommended)
**Do not** use the default passwords in `docker-compose.yml` for production.

1. **Create a `.env` file**:
   ```bash
   cp .env.example .env  # If you have one, or create new
   nano .env
   ```
2. **Populate Secrets**:
   ```env
   POSTGRES_USER=my_secure_user
   POSTGRES_PASSWORD=my_extremely_secure_password_123
   JWT_SECRET=complex_random_string_for_tokens
   GEMINI_API_KEY=your_google_api_key
   # Set Node to production
   NODE_ENV=production
   ```
   *Note: You may need to update `docker-compose.yml` to read these from `${VARIABLE}` if they are hardcoded.*

### 3. Modify `docker-compose.yml` for Production
Before running, verify a few things:
- **Database Port**: In your current file, you expose `5433:5432`. **Close this**. Do not expose DB ports to the public internet unless necessary. Remove the `ports` section for `db` or bind to localhost only (`127.0.0.1:5433:5432`).
- **Restart Policy**: Ensure `restart: always` is set (it is).

### 4. Launch
```bash
docker compose up -d --build
```
Your app should now be live at `http://<YOUR_PUBLIC_IP>`.

---

## 🛡️ Phase 4: SRE Best Practices (The "Pre-Flight" Check)

### 1. HTTPS is Mandatory (SSL)
Your current setup runs on HTTP (Port 80). Usage of HTTP is insecure and browsers will flag it.
**Solution**: Use a Reverse Proxy container to handle SSL automatically.
- **Option A (Easiest)**: **Cloudflare Tunnel**. No open ports needed. Connects your local Docker container to a public domain via Cloudflare.
- **Option B (Standard)**: **Caddy** or **Nginx Proxy Manager**.
    - Add a Caddy service to `docker-compose.yml` that handles automatic Let's Encrypt certificates and reverse proxies to your `frontend` container.

### 2. Database Backups
Don't trust the `postgres_data` volume to last forever.
**Action**: Set up a cron job to dump the database daily.
```bash
# Example Cron Job
0 3 * * * docker exec apcs-db pg_dump -U postgres apcs_db > /home/ubuntu/backups/db_$(date +\%F).sql
```

### 3. Monitoring
Since resources are limited (especially on free tier):
- Usage: `docker stats`
- Logs: `docker compose logs -f --tail=100`

### 4. Application Architecture
Currently, your generic `nginx.conf` proxies `/api` to `backend`. This is good. Ensure your frontend is building with the correct API base URL. If your Vue app uses a hardcoded `http://localhost:3000` for API calls, it will failing in production.
**Ensure**: Vue uses relative paths (e.g., `/api/login`) or an environment variable `VITE_API_URL` that points to the production domain.

---

## 🎯 Next Steps While Waiting
1. **Audit your code**: Check for hardcoded IPs or URLs.
2. **Containerize Configuration**: Ensure all "magic strings" are in `.env`.
3. **Prepare the Repository**: Ensure your latest code is pushed to `main` branch.

Let me know if you need help generating a Production Docker Compose file!
