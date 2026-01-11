#!/usr/bin/env node

/**
 * Git Pre-Push Hook - Deployment Tracking
 *
 * This script runs before each git push to:
 * 1. Read deployment_summary.md
 * 2. Send deployment data to your API
 * 3. Reset the file to template on success
 * 4. Block push on failure
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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

function logError(message) { log(`❌ ${message}`, 'red'); }
function logSuccess(message) { log(`✅ ${message}`, 'green'); }
function logWarning(message) { log(`⚠️  ${message}`, 'yellow'); }
function logInfo(message) { log(`ℹ️  ${message}`, 'cyan'); }

function loadEnvFile() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (!fs.existsSync(envPath)) {
    logError('.env.local file not found');
    return {};
  }

  const envContent = fs.readFileSync(envPath, 'utf-8');
  const envVars = {};

  envContent.split('\n').forEach((line) => {
    if (line.trim().startsWith('#') || !line.trim()) return;
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      envVars[key.trim()] = valueParts.join('=').trim();
    }
  });

  return envVars;
}

function parseDeploymentSummary() {
  const summaryPath = path.join(__dirname, '..', 'docs', 'deployment_summary.md');

  if (!fs.existsSync(summaryPath)) {
    logError('deployment_summary.md not found');
    return null;
  }

  const content = fs.readFileSync(summaryPath, 'utf-8');

  const deploySummaryMatch = content.match(/## Latest deploy summary\s*\n([\s\S]*?)(?=\n## |$)/);
  const internalNotesMatch = content.match(/## Notes for internal team\s*\n([\s\S]*?)(?=\n## |$)/);
  const changedUrlsMatch = content.match(/## Changed URLs\s*\n([\s\S]*?)(?=\n## |$)/);

  if (!deploySummaryMatch) {
    logError('Could not find "Latest deploy summary" section');
    return null;
  }

  const deploySummary = deploySummaryMatch[1].trim();
  const internalNotes = internalNotesMatch ? internalNotesMatch[1].trim() : '';
  const changedUrlsText = changedUrlsMatch ? changedUrlsMatch[1].trim() : '';

  const changedUrls = changedUrlsText
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('-') || line.startsWith('http'))
    .map((line) => line.replace(/^-\s*/, '').trim())
    .filter((url) => url.length > 0);

  if (!deploySummary || deploySummary === '-' || deploySummary.replace(/-/g, '').trim() === '') {
    logWarning('Deploy summary is empty - skipping deployment tracking');
    return { skip: true };
  }

  if (changedUrls.length === 0) {
    logWarning('No changed URLs found - skipping deployment tracking');
    return { skip: true };
  }

  return {
    deploy_summary: deploySummary,
    internal_notes: internalNotes || null,
    changed_urls: changedUrls,
    skip: false,
  };
}

async function sendDeployment(data, env) {
  const websiteId = env.PVS_WEBSITE_ID;
  const apiUrl = env.PVS_API_URL;

  if (!websiteId || !apiUrl) {
    logError('Missing required environment variables: PVS_WEBSITE_ID or PVS_API_URL');
    return false;
  }

  const endpoint = `${apiUrl}/api/deployments`;

  logInfo('Sending deployment to API...');
  logInfo(`Endpoint: ${endpoint}`);
  logInfo(`Website ID: ${websiteId}`);
  logInfo(`Changed URLs: ${data.changed_urls.length} URLs`);

  const payload = {
    website_id: websiteId,
    deploy_summary: data.deploy_summary,
    internal_notes: data.internal_notes,
    changed_urls: data.changed_urls,
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      logError(`API request failed: ${response.status} ${response.statusText}`);
      console.error(errorData);
      return false;
    }

    const result = await response.json();
    logSuccess('Deployment created successfully!');
    logInfo(`Deployment ID: ${result.id}`);
    return true;
  } catch (error) {
    logError(`Failed to send deployment: ${error.message}`);
    return false;
  }
}

function resetDeploymentSummary() {
  const summaryPath = path.join(__dirname, '..', 'docs', 'deployment_summary.md');

  const template = `# Deployment Summary

<!-- This file is automatically sent via email on successful deployment, then reset for the next cycle -->

## Latest deploy summary
-

## Notes for internal team
-

## Changed URLs
-
`;

  fs.writeFileSync(summaryPath, template, 'utf-8');
  logSuccess('deployment_summary.md reset to template');
}

function getCurrentBranch() {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' }).trim();
  } catch {
    return null;
  }
}

async function main() {
  log('\n🚀 Running pre-push deployment tracking hook...\n', 'bold');

  const currentBranch = getCurrentBranch();
  if (currentBranch !== 'main') {
    logInfo(`Current branch: ${currentBranch}`);
    logInfo('Skipping deployment tracking (only runs on main branch)');
    log('\n✅ Push allowed\n', 'green');
    process.exit(0);
  }

  logInfo('Pushing to main branch - running deployment tracking...');

  const env = loadEnvFile();
  const data = parseDeploymentSummary();

  if (!data) {
    logError('Failed to parse deployment_summary.md');
    log('\n❌ Push blocked due to errors\n', 'red');
    process.exit(1);
  }

  if (data.skip) {
    logInfo('Skipping deployment tracking (empty summary or no URLs)');
    log('\n✅ Push allowed\n', 'green');
    process.exit(0);
  }

  const success = await sendDeployment(data, env);

  if (!success) {
    logError('Failed to create deployment record');
    log('\n❌ Push blocked - fix the error and try again\n', 'red');
    process.exit(1);
  }

  resetDeploymentSummary();
  log('\n✅ Deployment tracked successfully - push allowed\n', 'green');
  process.exit(0);
}

main().catch((error) => {
  logError(`Unexpected error: ${error.message}`);
  console.error(error);
  process.exit(1);
});
