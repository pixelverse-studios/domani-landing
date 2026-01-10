#!/usr/bin/env node

/**
 * Git Hooks Installer - Deployment Tracking
 *
 * Run this script once after cloning to set up the pre-push hook
 * for deployment tracking.
 *
 * Usage: node scripts/install-hooks.js
 */

const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function installPrePushHook() {
  const gitHooksDir = path.join(__dirname, '..', '.git', 'hooks');
  const prePushHookPath = path.join(gitHooksDir, 'pre-push');

  if (!fs.existsSync(path.join(__dirname, '..', '.git'))) {
    log('❌ Not a git repository', 'red');
    return false;
  }

  if (!fs.existsSync(gitHooksDir)) {
    fs.mkdirSync(gitHooksDir, { recursive: true });
  }

  if (fs.existsSync(prePushHookPath)) {
    const existing = fs.readFileSync(prePushHookPath, 'utf-8');
    if (!existing.includes('pre-push.js')) {
      fs.writeFileSync(`${prePushHookPath}.backup`, existing, 'utf-8');
      log('⚠️  Backed up existing hook to pre-push.backup', 'yellow');
    }
  }

  const hookContent = `#!/bin/sh
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
node "$PROJECT_ROOT/scripts/pre-push.js"
exit $?
`;

  fs.writeFileSync(prePushHookPath, hookContent, 'utf-8');
  fs.chmodSync(prePushHookPath, '755');
  log('✅ pre-push hook installed successfully!', 'green');
  return true;
}

function main() {
  log('\n🔧 Installing Git hooks for deployment tracking...\n', 'bold');

  if (installPrePushHook()) {
    log('\n✅ Setup complete!\n', 'green');
    log('📚 How it works:', 'cyan');
    log('  1. Update docs/deployment_summary.md with your changes');
    log('  2. Commit your code');
    log('  3. Run `git push` to main - hook tracks the deployment');
    log('  4. deployment_summary.md resets after successful tracking\n');
  }
}

main();
