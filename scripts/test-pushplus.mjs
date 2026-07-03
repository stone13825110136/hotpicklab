#!/usr/bin/env node
/**
 * Local PushPlus test — run before relying on GitHub Actions.
 * Usage: set PUSHPLUS_TOKEN=your_token && node scripts/test-pushplus.mjs
 */

const token = process.env.PUSHPLUS_TOKEN;
if (!token) {
  console.error('Missing PUSHPLUS_TOKEN. Example:');
  console.error('  $env:PUSHPLUS_TOKEN="your_token"; node scripts/test-pushplus.mjs');
  process.exit(1);
}

const res = await fetch('https://www.pushplus.plus/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    token,
    title: 'HotPick Lab 测试',
    content: `测试消息 — ${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}\n收到说明 PushPlus 已打通。`,
    template: 'txt',
    channel: 'wechat',
  }),
});

const json = await res.json().catch(() => ({}));
console.log('HTTP status:', res.status);
console.log('Response:', JSON.stringify(json, null, 2));

if (json.code === 200) {
  console.log('\n✅ API 成功 — 请在微信「pushplus 推送加」公众号查看（可能在服务通知里）');
} else if (json.code === 905) {
  console.log('\n❌ 需要实名认证: https://www.pushplus.plus → 个人中心 → 实名认证');
} else if (json.code === 903) {
  console.log('\n❌ Token 无效 — 重新复制 PushPlus 首页 token');
} else if (json.msg?.includes('无用户')) {
  console.log('\n❌ 请关注「pushplus 推送加」公众号，并开启接收通知');
} else {
  console.log('\n❌ 发送失败 — 把上面 Response 发给我');
  process.exit(1);
}
