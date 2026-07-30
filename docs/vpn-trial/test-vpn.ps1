# Test WireGuard / outbound IP after connecting
Write-Host "=== Public IP (should be US VPS when VPN is on) ===" -ForegroundColor Cyan
try {
  $ip = (Invoke-WebRequest -Uri "https://api.ipify.org" -UseBasicParsing -TimeoutSec 15).Content.Trim()
  Write-Host "IP: $ip"
} catch {
  Write-Host "Failed to get IP: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== Site reachability ===" -ForegroundColor Cyan
$sites = @(
  "https://www.reddit.com",
  "https://trends.google.com",
  "https://search.google.com/search-console"
)
foreach ($url in $sites) {
  try {
    $r = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 20 -MaximumRedirection 0 -ErrorAction Stop
    Write-Host "[OK] $url -> $($r.StatusCode)" -ForegroundColor Green
  } catch {
    $code = $_.Exception.Response.StatusCode.value__
    if ($code) {
      Write-Host "[OK] $url -> $code (redirect/block page)" -ForegroundColor Yellow
    } else {
      Write-Host "[FAIL] $url -> $($_.Exception.Message)" -ForegroundColor Red
    }
  }
}

Write-Host "`nTip: Connect WireGuard first, then run this script again." -ForegroundColor Gray
