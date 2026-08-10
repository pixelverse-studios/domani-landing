import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const headerSource = await readFile(
  new URL('../../src/components/Header.tsx', import.meta.url),
  'utf8'
);
const footerSource = await readFile(
  new URL('../../src/components/Footer.tsx', import.meta.url),
  'utf8'
);

test('desktop navigation promotes Coming Soon and groups secondary resources', () => {
  const primaryLinks = headerSource.slice(
    headerSource.indexOf('const primaryNavLinks'),
    headerSource.indexOf('const resourceLinks')
  );
  const resourceLinks = headerSource.slice(
    headerSource.indexOf('const resourceLinks'),
    headerSource.indexOf('interface NavLinkProps')
  );

  assert.match(primaryLinks, /href: '\/coming-soon'/);
  assert.doesNotMatch(primaryLinks, /href: '\/(?:blog|faq|changelog|support)'/);

  for (const route of ['/blog', '/faq', '/changelog', '/support']) {
    assert.match(resourceLinks, new RegExp(`href: '${route}'`));
  }
});

test('Resources dropdown exposes keyboard-accessible disclosure semantics', () => {
  assert.match(headerSource, /aria-expanded=\{isResourcesOpen\}/);
  assert.match(headerSource, /aria-controls="resources-navigation-menu"/);
  assert.match(headerSource, /event\.key !== 'Escape'/);
  assert.match(headerSource, /resourcesButtonRef\.current\?\.focus\(\)/);
});

test('mobile navigation renders both primary and resource groups', () => {
  assert.match(headerSource, /primaryNavLinks\.map/);
  assert.match(headerSource, /resourceLinks\.map/);
  assert.match(headerSource, /Mobile navigation/);
});

test('navigation clicks use the established analytics helper', () => {
  assert.match(headerSource, /trackAnalyticsEvent\('navigation_click'/);
  assert.match(headerSource, /nav_location: location/);
  assert.match(headerSource, /destination_url: href/);
});

test('footer matches the Product and Resources targets', () => {
  const productSection = footerSource.slice(
    footerSource.indexOf("title: 'Product'"),
    footerSource.indexOf("title: 'Resources'")
  );
  const resourcesSection = footerSource.slice(
    footerSource.indexOf("title: 'Resources'"),
    footerSource.indexOf("title: 'Legal'")
  );

  for (const route of ['/#features', '/pricing', '/coming-soon', '/changelog']) {
    assert.match(productSection, new RegExp(`href: '${route.replace('/', '\\/')}'`));
  }

  for (const route of ['/blog', '/compare', '/faq', '/support']) {
    assert.match(resourcesSection, new RegExp(`href: '${route}'`));
  }
});
