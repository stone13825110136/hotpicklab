#!/usr/bin/env node
/** Export + sanitize Cursor transcript slice for docs/archive/. */

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = process.argv[2];
const startLine = Number(process.argv[3] || 1);
const outName = process.argv[4];

if (!src || !outName) {
  console.error('Usage: node archive-chat.mjs <source.jsonl> <startLine> <output-filename>');
  process.exit(1);
}

const lines = readFileSync(src, 'utf8').split(/\r?\n/).filter(Boolean);
const slice = lines.slice(startLine - 1);

const REDACT = [
  [/yy13825110136/g, '[REDACTED_PASSWORD]'],
  [/cfat_[A-Za-z0-9_]+/g, '[REDACTED_GITHUB_TOKEN]'],
  [/ghp_[A-Za-z0-9]+/g, '[REDACTED_GITHUB_TOKEN]'],
  [/github_pat_[A-Za-z0-9_]+/g, '[REDACTED_GITHUB_TOKEN]'],
  [/PUSHPLUS_TOKEN[=:\s"]+[A-Za-z0-9]+/gi, 'PUSHPLUS_TOKEN=[REDACTED]'],
  [/密码[：:]\s*\S+/g, '密码：[REDACTED]'],
  [/password[：:]\s*\S+/gi, 'password: [REDACTED]'],
];

function sanitizeLine(line) {
  let out = line;
  for (const [re, rep] of REDACT) out = out.replace(re, rep);

  try {
    const row = JSON.parse(out);
    if (row.role === 'assistant' && Array.isArray(row.message?.content)) {
      row.message.content = row.message.content.map((block) => {
        if (block.type === 'text') return block;
        if (block.type === 'tool_use' || block.type === 'tool_result') {
          return { type: 'text', text: '[REDACTED]' };
        }
        return block;
      });
    }
    return JSON.stringify(row);
  } catch {
    return out;
  }
}

const sanitized = slice.map(sanitizeLine).join('\n') + '\n';
const dest = join(root, 'docs', 'archive', outName);
writeFileSync(dest, sanitized, 'utf8');
console.log(`Wrote ${slice.length} lines → ${dest}`);
