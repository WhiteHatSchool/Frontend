#!/bin/bash

# Build the application
npm run build

# Transfer built files to EC2 instance
scp -i "Sspringserverdemo.pem" -r dist/ ubuntu@3.34.224.138:/home/ubuntu/

# Restart Nginx on EC2
ssh -i "Sspringserverdemo.pem" ubuntu@3.34.224.138 << 'EOF'
sudo systemctl restart nginx
exit
EOF

