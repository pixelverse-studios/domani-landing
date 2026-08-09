import assert from 'node:assert/strict';
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
