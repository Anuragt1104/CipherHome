# 🚀 Deployment Guide for DAWN Black Box

This guide explains how to deploy CipherHome on your DAWN Black Box in production.

## Prerequisites

- DAWN Black Box with Docker support
- 8GB+ RAM recommended
- 50GB+ storage for media and files
- (Optional) NVIDIA GPU for faster AI inference

---

## Quick Deploy (Recommended)

### 1. SSH into your Black Box

```bash
ssh user@your-black-box-ip
```

### 2. Clone CipherHome

```bash
cd /opt
sudo git clone https://github.com/your-username/cipherhome.git
cd cipherhome
```

### 3. Configure Environment

```bash
sudo cp apps/backend/.env.example apps/backend/.env
sudo nano apps/backend/.env  # Edit with your settings
```

**Important environment variables:**
- `JWT_SECRET` - Change to a strong random string
- `POSTGRES_PASSWORD` - Set a strong database password
- `MINIO_ACCESS_KEY` / `MINIO_SECRET_KEY` - Change default credentials

### 4. Start All Services

```bash
sudo docker-compose up -d
```

### 5. Pull AI Model

```bash
sudo docker exec -it cipherhome-ollama-1 ollama pull llama3
```

### 6. Verify Services

```bash
sudo docker-compose ps
```

All services should show "Up" status.

### 7. Access CipherHome

- **Web Dashboard:** `http://your-black-box-ip:3000`
- **API:** `http://your-black-box-ip:3001`
- **MinIO Console:** `http://your-black-box-ip:9001`
- **Jellyfin:** `http://your-black-box-ip:8096`

---

## Linux Container (LXC) Deployment

If your Black Box uses LXC instead of Docker:

### 1. Create LXC Container

```bash
lxc launch ubuntu:22.04 cipherhome
lxc exec cipherhome -- bash
```

### 2. Install Dependencies

```bash
apt update && apt upgrade -y
apt install -y docker.io docker-compose git
systemctl enable --now docker
```

### 3. Deploy CipherHome

```bash
cd /opt
git clone https://github.com/your-username/cipherhome.git
cd cipherhome
docker-compose up -d
```

### 4. Configure Port Forwarding

```bash
exit  # Exit LXC container
lxc config device add cipherhome web proxy listen=tcp:0.0.0.0:3000 connect=tcp:127.0.0.1:3000
lxc config device add cipherhome api proxy listen=tcp:0.0.0.0:3001 connect=tcp:127.0.0.1:3001
```

---

## Security Hardening

### 1. Enable HTTPS (with Traefik)

Uncomment the Traefik service in `docker-compose.yml`:

```yaml
traefik:
  image: traefik:v2.10
  command:
    - --providers.docker=true
    - --entrypoints.web.address=:80
    - --entrypoints.websecure.address=:443
    - --certificatesresolvers.letsencrypt.acme.email=your-email@example.com
    - --certificatesresolvers.letsencrypt.acme.storage=/acme.json
    - --certificatesresolvers.letsencrypt.acme.httpchallenge.entrypoint=web
  ports:
    - "80:80"
    - "443:443"
  volumes:
    - /var/run/docker.sock:/var/run/docker.sock:ro
    - ./acme.json:/acme.json
  restart: unless-stopped
```

### 2. Firewall Configuration

```bash
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw allow 22/tcp   # SSH
sudo ufw enable
```

### 3. Change Default Passwords

```bash
# Update .env file
sudo nano apps/backend/.env

# Change:
# - JWT_SECRET
# - POSTGRES_PASSWORD  
# - MINIO_ACCESS_KEY
# - MINIO_SECRET_KEY

# Restart services
sudo docker-compose down
sudo docker-compose up -d
```

---

## Backup & Recovery

### Backup Data

```bash
# Backup all volumes
sudo docker run --rm \
  -v cipherhome_postgres-data:/data/postgres \
  -v cipherhome_minio-data:/data/minio \
  -v cipherhome_ollama-data:/data/ollama \
  -v $(pwd)/backups:/backup \
  alpine tar czf /backup/cipherhome-backup-$(date +%Y%m%d).tar.gz /data
```

### Restore Data

```bash
# Restore from backup
sudo docker run --rm \
  -v cipherhome_postgres-data:/data/postgres \
  -v cipherhome_minio-data:/data/minio \
  -v cipherhome_ollama-data:/data/ollama \
  -v $(pwd)/backups:/backup \
  alpine tar xzf /backup/cipherhome-backup-YYYYMMDD.tar.gz -C /
```

---

## Monitoring

### View Logs

```bash
# All services
sudo docker-compose logs -f

# Specific service
sudo docker-compose logs -f backend
sudo docker-compose logs -f frontend
```

### Health Checks

```bash
# Backend API
curl http://localhost:3001/health

# Frontend
curl http://localhost:3000

# Ollama
curl http://localhost:11434/api/tags
```

### Resource Usage

```bash
sudo docker stats
```

---

## Troubleshooting

### Service Won't Start

```bash
# Check logs
sudo docker-compose logs <service-name>

# Restart specific service
sudo docker-compose restart <service-name>

# Rebuild and restart
sudo docker-compose up -d --build <service-name>
```

### Out of Memory

```bash
# Check memory usage
free -h

# Increase swap (if needed)
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

### Database Connection Issues

```bash
# Reset database
sudo docker-compose down
sudo docker volume rm cipherhome_postgres-data
sudo docker-compose up -d postgres
# Wait 30 seconds for initialization
sudo docker-compose up -d
```

---

## Updating CipherHome

```bash
cd /opt/cipherhome
sudo git pull
sudo docker-compose down
sudo docker-compose build
sudo docker-compose up -d
```

---

## Uninstalling

```bash
cd /opt/cipherhome
sudo docker-compose down -v  # -v removes volumes (data)
cd ..
sudo rm -rf cipherhome
```

---

## Support

For issues, please:
1. Check logs: `sudo docker-compose logs`
2. Visit GitHub Issues: https://github.com/your-username/cipherhome/issues
3. Join Discord: [link]

---

## Performance Tuning

### For AI Inference (with GPU)

Edit `docker-compose.yml`:

```yaml
ollama:
  image: ollama/ollama:latest
  deploy:
    resources:
      reservations:
        devices:
          - driver: nvidia
            count: 1
            capabilities: [gpu]
```

### For Media Transcoding

Jellyfin supports hardware acceleration. See: https://jellyfin.org/docs/general/administration/hardware-acceleration

---

**Your Black Box, Your Digital Kingdom** 🔐

Deployed with CipherHome for DAWN
