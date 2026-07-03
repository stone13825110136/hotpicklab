#!/usr/bin/env node
import { runRadarScan } from './scan-trends.mjs';
import { sendPushPlus, formatRadarHtml } from './send-pushplus.mjs';

const payload = await runRadarScan();
const html = formatRadarHtml(payload);

const result = await sendPushPlus({
  title: `🔥 HotPick Lab 雷达 ${payload.date} · ${payload.candidates.length}条`,
  content: html,
});

console.log('WeChat push:', result.ok ? 'sent' : 'skipped');
console.log(JSON.stringify({ date: payload.date, count: payload.candidates.length, push: result }, null, 2));
