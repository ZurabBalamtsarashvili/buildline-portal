# Deployment Guide for BuildLine Portal

## System Requirements

- Ubuntu 20.04 LTS or newer
- Nginx 1.18+
- Python 3.10+
- Node.js 16+
- MySQL 8.0+

## 1. System Preparation

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y nginx python3.10 python3.10-venv python3-pip mysql-server nodejs npm
```

## 2. Database Setup

```bash
# Secure MySQL installation
sudo mysql_secure_installation

# Create database and user
sudo mysql -u root -p
```

```sql
CREATE DATABASE buildline2;
CREATE USER 'buildlineportal2'@'localhost' IDENTIFIED BY 'Buildline2025';
GRANT ALL PRIVILEGES ON buildline2.* TO 'buildlineportal2'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## 3. Backend Setup

```bash
# Create application directory
sudo mkdir -p /var/www/buildline
sudo chown -R $USER:$USER /var/www/buildline

# Clone or extract project files
cd /var/www/buildline
# Extract your project files here

# Setup Python environment
cd backend
python3.10 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Create environment file
cat > .env << EOL
DATABASE_URL=mysql+aiomysql://buildlineportal2:Buildline2025@localhost/buildline2
JWT_SECRET=your-secure-secret-key
JWT_ALGORITHM=HS256
JWT_EXPIRATION=3600
EOL

# Setup systemd service
sudo tee /etc/systemd/system/buildline.service << EOL
[Unit]
Description=BuildLine Portal Backend
After=network.target

[Service]
User=$USER
Group=$USER
WorkingDirectory=/var/www/buildline/backend
Environment="PATH=/var/www/buildline/backend/venv/bin"
ExecStart=/var/www/buildline/backend/venv/bin/uvicorn main:app --host 127.0.0.1 --port 8000

[Install]
WantedBy=multi-user.target
EOL

# Start backend service
sudo systemctl daemon-reload
sudo systemctl enable buildline
sudo systemctl start buildline
```

## 4. Frontend Setup

```bash
# Install dependencies and build
cd /var/www/buildline/frontend
npm install
npm run build
```

## 5. Nginx Setup

```bash
# Remove default configuration
sudo rm /etc/nginx/sites-enabled/default

# Copy Nginx configuration
sudo cp nginx/buildline.conf /etc/nginx/sites-available/buildline
sudo ln -s /etc/nginx/sites-available/buildline /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

## 6. SSL Setup (Optional but Recommended)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d buildline.example.com

# Certbot will automatically modify the Nginx configuration
```

## 7. Firewall Setup

```bash
# Allow HTTP, HTTPS, and SSH
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
```

## Maintenance

### Logs
- Backend logs: `sudo journalctl -u buildline.service`
- Nginx access logs: `sudo tail -f /var/log/nginx/access.log`
- Nginx error logs: `sudo tail -f /var/log/nginx/error.log`

### Updates
```bash
# Backend updates
cd /var/www/buildline/backend
source venv/bin/activate
git pull  # if using git
pip install -r requirements.txt
sudo systemctl restart buildline

# Frontend updates
cd /var/www/buildline/frontend
git pull  # if using git
npm install
npm run build
```

### Backup
```bash
# Database backup
mysqldump -u buildlineportal2 -p buildline2 > backup.sql

# Files backup
tar -czf buildline_backup.tar.gz /var/www/buildline
```

## Troubleshooting

1. If the backend service fails to start:
   - Check logs: `sudo journalctl -u buildline.service -n 50`
   - Verify database connection
   - Check environment variables

2. If Nginx shows 502 Bad Gateway:
   - Ensure backend service is running
   - Check Nginx configuration
   - Verify port settings

3. If frontend doesn't load:
   - Check browser console for errors
   - Verify build files in /var/www/buildline/frontend/build
   - Check Nginx logs

## Security Considerations

1. Keep system packages updated
2. Use strong passwords
3. Enable and configure firewall
4. Install and maintain SSL certificates
5. Regularly backup data
6. Monitor system logs
7. Set up fail2ban for brute force protection

## Monitoring

Consider setting up:
1. Server monitoring (e.g., Netdata, Prometheus)
2. Application monitoring (e.g., Sentry)
3. Log aggregation (e.g., ELK Stack)
4. Uptime monitoring (e.g., UptimeRobot)
