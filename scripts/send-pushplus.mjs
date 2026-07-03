#!/usr/bin/env node
/**
 * Send radar digest to WeChat via PushPlus (https://www.pushplus.plus)
 * Requires env: PUSHPLUS_TOKEN
 */

export async function sendPushPlus({ title, content, token, template = 'txt' }) {
  const pushToken = token || process.env.PUSHPLUS_TOKEN;
  if (!pushToken) {
    console.warn('PUSHPLUS_TOKEN not set — skip WeChat push');
    return { ok: false, skipped: true };
  }

  const res = await fetch('https://www.pushplus.plus/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      token: pushToken,
      title,
      content,
      template,
      channel: 'wechat',
    }),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.code !== 200) {
    const hint =
      json.code === 905
        ? ' (PushPlus 需要实名认证才能发微信消息)'
        : json.msg?.includes('无用户')
          ? ' (请关注「pushplus 推送加」公众号并开启接收通知)'
          : '';
    throw new Error(`PushPlus failed: ${JSON.stringify(json)}${hint}`);
  }
  return { ok: true, data: json };
}

export function formatRadarText(payload) {
  const lines = payload.candidates.map(
    (c) =>
      `${c.id}. [${c.score}分] ${c.title}\n来源：${c.source}\n类目：${c.category} · ${c.commissionHint}\n${c.reason}`,
  );

  const list = lines.length
    ? lines.join('\n\n')
    : '今日数据源暂不可用，请稍后重试或在 Cursor 手动扫热点。';

  return [
    `HotPick Lab 每日热点雷达`,
    `日期：${payload.date}`,
    `站点：${payload.site}`,
    '',
    list,
    '',
    '确认发布（任选一种）：',
    `1. Cursor：发布雷达 ${payload.date} 第1,3条`,
    `2. GitHub Issue 评论：approve 1,3`,
  ].join('\n');
}

export function formatRadarHtml(payload) {
  const lines = payload.candidates.map(
    (c) =>
      `<p><b>${c.id}. [${c.score}分] ${c.title}</b><br/>
      来源：${c.source}<br/>
      类目：${c.category} · ${c.commissionHint}<br/>
      ${c.reason}</p>`,
  );

  return `
<h2>🔥 HotPick Lab 每日热点雷达</h2>
<p>日期：${payload.date} · <a href="${payload.site}">hotpicklab.com</a></p>
<hr/>
${lines.length ? lines.join('\n') : '<p><i>今日数据源暂不可用，请稍后重试或在 Cursor 手动扫热点。</i></p>'}
<hr/>
<p><b>✅ 确认发布（任选一种）：</b></p>
<ol>
<li><b>Cursor</b>：对 AI 说「<b>发布雷达 ${payload.date} 第1,3条</b>」（改成你要的编号）</li>
<li><b>GitHub</b>：在今日 Radar Issue 评论 <b>approve 1,3</b></li>
</ol>
<p>确认后我会更新网站并自动部署。</p>
`.trim();
}

if (import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}`) {
  const { readFile } = await import('node:fs/promises');
  const path = process.argv[2] || 'radar/latest.json';
  const payload = JSON.parse(await readFile(path, 'utf8'));
  const html = formatRadarHtml(payload);
  sendPushPlus({
    title: `HotPick Lab 雷达 ${payload.date} (${payload.candidates.length}条)`,
    content: html,
  })
    .then((r) => console.log('PushPlus:', r))
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}
