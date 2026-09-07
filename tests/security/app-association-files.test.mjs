import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const APPLE_APP_ID = 'V5P5GK2HMF.com.baitedz.domani-app';
const ANDROID_PACKAGE = 'com.baitedz.domaniapp';
const ANDROID_CERTIFICATE =
  'C0:B6:E5:D1:D5:60:73:57:7D:8B:7E:96:7D:B8:6A:95:C6:7C:CE:11:1F:1E:8D:CC:D2:E6:23:0C:94:60:AE:C4';

test('Apple association delegates only the OAuth callback to Domani', async () => {
  const association = JSON.parse(
    await readFile('public/.well-known/apple-app-site-association', 'utf8')
  );
  const [details] = association.applinks.details;

  assert.deepEqual(details.appIDs, [APPLE_APP_ID]);
  assert.deepEqual(
    details.components.map((component) => component['/']),
    ['/auth/callback']
  );
});

test('Android association delegates the OAuth callback host to the signed app', async () => {
  const [statement] = JSON.parse(await readFile('public/.well-known/assetlinks.json', 'utf8'));

  assert.deepEqual(statement.relation, ['delegate_permission/common.handle_all_urls']);
  assert.equal(statement.target.namespace, 'android_app');
  assert.equal(statement.target.package_name, ANDROID_PACKAGE);
  assert.deepEqual(statement.target.sha256_cert_fingerprints, [ANDROID_CERTIFICATE]);
});

test('Netlify serves both association endpoints as JSON without content sniffing', async () => {
  const netlifyConfig = await readFile('netlify.toml', 'utf8');

  for (const endpoint of [
    '/.well-known/apple-app-site-association',
    '/.well-known/assetlinks.json',
  ]) {
    const escapedEndpoint = endpoint.replaceAll('.', '\\.');
    const headerBlock = new RegExp(
      `\\[\\[headers\\]\\]\\s+for = "${escapedEndpoint}"([\\s\\S]*?)(?=\\n\\[\\[headers\\]\\]|$)`
    ).exec(netlifyConfig)?.[1];

    assert.ok(headerBlock, `Missing Netlify header block for ${endpoint}`);
    assert.match(headerBlock, /Content-Type = "application\/json"/);
    assert.match(headerBlock, /X-Content-Type-Options = "nosniff"/);
  }
});
