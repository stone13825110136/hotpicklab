# 一键上传到 GitHub
# 用法：在 PowerShell 里运行 .\push-to-github.ps1
# 会提示输入 GitHub 用户名和 Token

param(
    [string]$GitHubUser = "",
    [string]$Token = ""
)

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

if (-not $GitHubUser) {
    $GitHubUser = Read-Host "输入你的 GitHub 用户名"
}

if (-not $Token) {
    Write-Host ""
    Write-Host "需要 GitHub Token（不是登录密码）" -ForegroundColor Yellow
    Write-Host "创建地址: https://github.com/settings/tokens/new"
    Write-Host "勾选 repo 权限，生成后粘贴到下面（输入时不会显示）"
    Write-Host ""
    $Token = Read-Host "粘贴 Token" -AsSecureString
    $Token = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
        [Runtime.InteropServices.Marshal]::SecureStringToBSTR($Token)
    )
}

$repoUrl = "https://${Token}@github.com/${GitHubUser}/hotpicklab.git"

# 检查远程是否已设置
$remote = git remote get-url origin 2>$null
if ($LASTEXITCODE -ne 0) {
    git remote add origin "https://github.com/${GitHubUser}/hotpicklab.git"
} else {
    git remote set-url origin $repoUrl
}

# 确保在 main 分支
git branch -M main

# 推送
Write-Host "正在上传到 GitHub..." -ForegroundColor Cyan
$env:GIT_TERMINAL_PROMPT = "0"
git push -u $repoUrl main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "成功! 打开: https://github.com/${GitHubUser}/hotpicklab" -ForegroundColor Green
    git remote set-url origin "https://github.com/${GitHubUser}/hotpicklab.git"
} else {
    Write-Host ""
    Write-Host "上传失败。请确认:" -ForegroundColor Red
    Write-Host "1. 已在 GitHub 网站创建空仓库 hotpicklab (不要勾选 README)"
    Write-Host "2. Token 勾选了 repo 权限"
    Write-Host "3. 用户名拼写正确"
}
