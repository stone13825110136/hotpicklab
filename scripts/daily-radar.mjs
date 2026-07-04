#!/usr/bin/env node
import { runRadarScan } from './scan-trends.mjs';
import { sendPushPlus, formatRadarText } from './send-pushplus.mjs';

const payload = await runRadarScan();
const text = formatRadarText(payload);

const result = await sendPushPlus({
  title: `HotPick Lab 雷达 ${payload.date} · ${payload.candidates.length}条`,
  content: text,
  template: 'txt',
});

console.log('WeChat push:', result.ok ? 'sent' : result.skipped ? 'skipped (no token)' : 'failed');
console.log(
  JSON.stringify(
    {
      date: payload.date,
      count: payload.candidates.length,
      push: result,
      pushplusData: result.data?.data ?? null,
    },
    null,
    2,
  ),
);

if (process.env.GITHUB_ACTIONS === 'true') {
  if (result.skipped) {
    console.error('ERROR: PUSHPLUS_TOKEN secret missing — WeChat push was skipped.');
    process.exit(1);
  }
  if (!result.ok) {
    console.error('ERROR: WeChat push failed.');
    process.exit(1);
  }
}
