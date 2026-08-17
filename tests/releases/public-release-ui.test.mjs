import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ReactMarkdown from 'react-markdown';
import ts from 'typescript';

const helperSource = await readFile(
  new URL('../../src/components/releases/public-release-display.ts', import.meta.url),
  'utf8'
);
const releaseRouteSources = await Promise.all(
  ['coming-soon', 'changelog'].map((route) =>
    readFile(new URL(`../../src/app/${route}/page.tsx`, import.meta.url), 'utf8')
  )
);
const transpiledHelper = ts.transpileModule(helperSource, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  fileName: 'public-release-display.ts',
});
const helperModule = await import(
  `data:text/javascript;base64,${Buffer.from(transpiledHelper.outputText).toString('base64')}`
);
const revalidationSource = await readFile(
  new URL('../../src/lib/releases/revalidation.ts', import.meta.url),
  'utf8'
);
const transpiledRevalidation = ts.transpileModule(revalidationSource, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  fileName: 'revalidation.ts',
});
const revalidationModule = await import(
  `data:text/javascript;base64,${Buffer.from(transpiledRevalidation.outputText).toString('base64')}`
);
const {
  parseReleaseInvalidationPayload,
  releasePageForInvalidationTarget,
  verifyReleaseInvalidationSignature,
} = revalidationModule;
const {
  filterReleaseNotes,
  PUBLIC_MARKDOWN_ELEMENTS,
  publicMarkdownLinkRel,
  publicMarkdownUrlTransform,
  timelineSummary,
} = helperModule;

const renderMarkdown = (body) =>
  renderToStaticMarkup(
    React.createElement(
      ReactMarkdown,
      {
        allowedElements: PUBLIC_MARKDOWN_ELEMENTS,
        skipHtml: true,
        urlTransform: publicMarkdownUrlTransform,
        components: {
          a: ({ children, href }) =>
            React.createElement('a', { href, rel: publicMarkdownLinkRel(href) }, children),
        },
      },
      body
    )
  );

test('public Markdown renders only the contract allowlist', () => {
  const html = renderMarkdown(`
# Heading

![tracking](https://example.com/pixel.png)

> Blockquote

| A | B |
|---|---|
| 1 | 2 |

Paragraph with **strong**, *emphasis*, and \`code\`.

- First
- Second
`);

  assert.doesNotMatch(html, /<(?:h1|img|blockquote|table|pre)\b/);
  assert.match(html, /<strong>strong<\/strong>/);
  assert.match(html, /<em>emphasis<\/em>/);
  assert.match(html, /<code>code<\/code>/);
  assert.match(html, /<ul>/);
});

test('public Markdown rejects forbidden destinations and protects external links', () => {
  const html = renderMarkdown(
    '[external](HTTPS://example.com) [internal](/support) [fragment](#details) ' +
      '[xmpp](xmpp:user@example.com) [irc](irc://example.com/room) ' +
      '[protocol relative](//tracker.example/p) [encoded](%6a%61vascript:alert(1))'
  );

  assert.match(html, /href="HTTPS:\/\/example\.com" rel="noopener noreferrer"/);
  assert.match(html, /href="\/support"/);
  assert.match(html, /href="#details"/);
  assert.doesNotMatch(html, /href="(?:xmpp:|irc:|\/\/|%6a%61)/i);
});

test('platform filters remove notes for other platforms', () => {
  const notes = [
    { id: 'both', type: 'feature', platforms: ['ios', 'android'] },
    { id: 'ios', type: 'improvement', platforms: ['ios'] },
    { id: 'android', type: 'fix', platforms: ['android'] },
  ];

  assert.deepEqual(
    filterReleaseNotes(notes, 'android').map((note) => note.id),
    ['both', 'android']
  );
  assert.deepEqual(
    filterReleaseNotes(notes, 'ios').map((note) => note.id),
    ['both', 'ios']
  );
});

test('timeline summaries preserve confidence semantics', () => {
  assert.deepEqual(timelineSummary({ kind: 'released', value: '2026-06-05T12:00:00.000Z' }), {
    value: 'Jun 5',
    label: 'Released',
  });
  assert.deepEqual(timelineSummary({ kind: 'confirmed_date', value: '2026-09-15' }), {
    value: 'Sep 15',
    label: 'Scheduled date',
  });
  assert.deepEqual(timelineSummary({ kind: 'target_date', value: '2026-10-20' }), {
    value: 'Oct 20',
    label: 'Target date',
  });
  assert.deepEqual(timelineSummary({ kind: 'target_month', value: '2026-11' }), {
    value: 'Nov',
    label: 'Target month',
  });
  assert.deepEqual(timelineSummary({ kind: 'tbd', value: null }), {
    value: 'TBD',
    label: 'Timing',
  });
});

test('public release routes use the contract cache lifetime', () => {
  for (const source of releaseRouteSources) {
    assert.match(source, /export const revalidate = 300;/);
    assert.doesNotMatch(source, /force-dynamic/);
  }
});

test('release invalidation requires a valid HMAC and accepted payload', () => {
  const secret = 'test-release-invalidation-secret';
  const body = JSON.stringify({
    jobId: 'a1000000-0000-4000-8000-000000000010',
    releaseId: 'a1000000-0000-4000-8000-000000000001',
    target: '/api/domani/releases/coming-soon',
  });
  const signature = `sha256=${createHmac('sha256', secret).update(body).digest('hex')}`;

  assert.equal(verifyReleaseInvalidationSignature(body, signature, secret), true);
  assert.equal(verifyReleaseInvalidationSignature(body, `${signature}0`, secret), false);
  assert.equal(
    parseReleaseInvalidationPayload(body)?.releaseId,
    'a1000000-0000-4000-8000-000000000001'
  );
  assert.equal(
    releasePageForInvalidationTarget('/api/domani/releases/coming-soon'),
    '/coming-soon'
  );
});

test('release invalidation rejects unknown targets and malformed identifiers', () => {
  assert.equal(
    parseReleaseInvalidationPayload(
      JSON.stringify({
        jobId: 'not-a-uuid',
        releaseId: 'a1000000-0000-4000-8000-000000000001',
        target: '/admin',
      })
    ),
    null
  );
});
