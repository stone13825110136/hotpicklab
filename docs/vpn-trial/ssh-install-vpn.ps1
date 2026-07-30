# HotPick Lab — SSH into new Vultr VPS and install WireGuard
# Usage: .\ssh-install-vpn.ps1 -VpsIp "123.45.67.89"
param(
  [Parameter(Mandatory = $true)]
  [string]$VpsIp
)

$scriptPath = Join-Path $PSScriptRoot "vps-install-wireguard.sh"
if (-not (Test-Path $scriptPath)) {
  Write-Error "Missing $scriptPath"
  exit 1
}

Write-Host "Connecting to root@$VpsIp ..." -ForegroundColor Cyan
Write-Host "You will be asked for the VPS root password." -ForegroundColor Yellow
Write-Host ""
Write-Host "After login, paste these commands one block at a time:" -ForegroundColor Green
Write-Host ""
Get-Content $scriptPath
Write-Host ""
Write-Host "Or run from this machine (requires password each time):" -ForegroundColor Gray
Write-Host "  scp `"$scriptPath`" root@${VpsIp}:/root/vps-install-wireguard.sh"
Write-Host "  ssh root@$VpsIp 'bash /root/vps-install-wireguard.sh'"
Write-Host ""
Write-Host "Then copy the [Interface] config to C:\Users\Administrator\wireguard-hotpicklab.conf"
