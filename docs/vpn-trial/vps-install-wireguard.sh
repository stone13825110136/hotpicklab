#!/usr/bin/env bash
# Run on Ubuntu 22.04 VPS as root after: ssh root@YOUR_VPS_IP
set -euo pipefail

echo "==> HotPick Lab WireGuard one-click install"
echo "    Client name will be: win-pc"
echo ""

export AUTO_INSTALL=y
export APPROVE_IP=y
export ENDPOINT=$(curl -4 -s ifconfig.me || hostname -I | awk '{print $1}')
export CLIENT_NAME=win-pc
export CLIENT_DNS_1=1.1.1.1
export CLIENT_DNS_2=1.0.0.1

curl -fsSL -o /tmp/wireguard-install.sh \
  https://raw.githubusercontent.com/angristan/wireguard-install/master/wireguard-install.sh
chmod +x /tmp/wireguard-install.sh

# Non-interactive defaults where supported; script may still prompt on some versions.
printf '\n' | /tmp/wireguard-install.sh || /tmp/wireguard-install.sh

echo ""
echo "==> DONE. Copy the [Interface]...[Peer] block above to Windows."
echo "    Save as: C:\\Users\\Administrator\\wireguard-hotpicklab.conf"
