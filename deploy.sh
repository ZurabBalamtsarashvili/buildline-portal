#!/bin/bash

# Exit on error
set -e

echo "BuildLine Portal Deployment Script"
echo "================================="

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "Please run as root (use sudo)"
    exit 1
fi

# Prompt for configuration
read -p "Enter domain name (e.g., buildline.example.com): " DOMAIN
read -p "Enter MySQL root password: " MYSQL_ROOT_PASS
read -p "Enter new MySQL user password: " MYSQL_USER_PASS
read -p "Enter JWT secret key: " JWT_SECRET

echo "Installing dependencies..."
apt update
apt install -y nginx python3.10 python3.10-venv python3-pip mysql-server nodejs npm certbot python3-certbot-nginx

echo "Configuring MySQL..."
mysql -u root -p"$MYSQL_ROOT_PASS" << EOF
CREATE DATABASE IF NOT EXISTS buildline2;
CREATE USER IF NOT EXISTS 'buildlineportal2'@'localhost' IDENTIFIED BY '$MYSQL_USER_PASS';
GRANT ALL PRIVILEGES ON buildline2.* TO 'buildlineportal2'@'localhost';
FLUSH PRIVILEGES;
EOF

echo "Setting up application directory..."
mkdir -p /var/www/buildline
cd /var/www/buildline

echo "Setting up backend..."
cd backend
python3.10 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Create environment file
cat > .env << EOF
DATABASE_URL=mysql+aiomysql://buildlineportal2:${MYSQL_USER_PASS}@localhost/buildline2
JWT_SECRET=${JWT_SECRET}
JWT_ALGORITHM=HS256
JWT_EXPIRATION=3600
EOF

# Create systemd service
cat > /etc/systemd/system/buildline.service << EOF
[Unit]
Description=BuildLine Portal Backend
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/buildline/backend
Environment="PATH=/var/www/buildline/backend/venv/bin"
ExecStart=/var/www/buildline/backend/venv/bin/uvicorn main:app --host 127.0.0.1 --port 8000

[Install]
WantedBy=multi-user.target
EOF

echo "Setting up frontend..."
cd ../frontend
npm install
npm run build

echo "Configuring Nginx..."
# Replace domain in Nginx config
sed "s/buildline.example.com/$DOMAIN/g" nginx/buildline.conf > /etc/nginx/sites-available/buildline

# Enable site
ln -sf /etc/nginx/sites-available/buildline /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
nginx -t

echo "Setting up SSL..."
certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN

echo "Starting services..."
systemctl daemon-reload
systemctl enable buildline
systemctl start buildline
systemctl restart nginx

echo "Setting up firewall..."
ufw allow 'Nginx Full'
ufw allow OpenSSH
ufw --force enable

echo "Deployment complete!"
echo "==================="
echo "Your application is now available at: https://$DOMAIN"
echo ""
echo "Important next steps:"
echo "1. Test the application by visiting https://$DOMAIN"
echo "2. Set up monitoring (see deployment_guide.md)"
echo "3. Configure backup system"
echo "4. Review security settings"
echo ""
echo "For more information, please refer to deployment_guide.md"
