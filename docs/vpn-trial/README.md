# HotPick Lab — VPS + WireGuard 一月试用

> 用途：Google Search Console、Google Trends、Reddit/Medium 推广  
> 预计费用：Vultr 洛杉矶 ~$6/月，按小时计费，不用可删

## 本机环境（已检查）

| 项 | 状态 |
|---|---|
| 系统 | Windows 10 |
| SSH | ✅ 已内置 OpenSSH |
| WireGuard 客户端 | 见下方安装步骤 |

## 第一步：买 Vultr VPS（需你在浏览器完成）

1. 打开 https://www.vultr.com → 注册 / 登录
2. **Billing** 充值至少 **$10**（支付宝/信用卡）
3. **Deploy** → **Cloud Compute** → **Regular**
4. 选择：

| 选项 | 值 |
|------|-----|
| Location | **Los Angeles**（或 Seattle） |
| Image | **Ubuntu 22.04 LTS** |
| Plan | **$6/mo**（1 vCPU / 1GB / 25GB） |
| SSH | 可选：Add SSH Key；新手用 **Password** 更简单 |

5. 点 **Deploy Now**，等 1～2 分钟
6. 记下：**IP 地址**、**Username: root**、**Password**

## 第二步：在 VPS 上装 WireGuard（复制到 SSH 里）

PowerShell 登录：

```powershell
ssh root@你的VPS_IP
```

登录后整段粘贴运行（来自 angristan/wireguard-install）：

```bash
curl -O https://raw.githubusercontent.com/angristan/wireguard-install/master/wireguard-install.sh
chmod +x wireguard-install.sh
./wireguard-install.sh
```

**交互回答（一路回车即可）：**

- IPv4/IPv6：默认
- 端口：`51820`
- 客户端名：`win-pc`
- DNS：`1.1.1.1`

完成后会打印 `[Interface]...` 整段配置 → **全选复制**。

## 第三步：Windows 导入配置

1. 把复制的内容保存为：`C:\Users\Administrator\wireguard-hotpicklab.conf`
2. 打开 **WireGuard** → **Import tunnel(s) from file** → 选该文件
3. 点 **Activate**

## 第四步：验证

PowerShell（VPN 已连接时）：

```powershell
(Invoke-WebRequest -Uri "https://api.ipify.org" -UseBasicParsing).Content
```

应显示 **VPS 的美国 IP**，不是你的宽带 IP。

浏览器测试：

- https://trends.google.com
- https://search.google.com/search-console
- https://www.reddit.com

## 第五步：HotPick 用上 VPN 后

```powershell
cd D:\国外网站挣钱\hotpicklab
# GSC 验证、sitemap 提交（浏览器）
npm run indexnow
npm run promote medium   # 若 Medium 能登
```

## 费用与续费

- Vultr 按小时扣费，$6/月方案约 **$0.009/小时**
- 试用结束：Vultr 控制台 **Destroy Instance** 停止扣费
- 满意再开新机或续用

## 安全

- 勿分享 `.conf` 文件（含 PrivateKey）
- VPS root 密码设强密码
- 仅个人使用，勿商用转售

---

*创建：2026-07-08 · HotPick Lab 流量试验*
