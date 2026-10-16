import { defineConfig } from '@playwright/test';
import { existsSync } from 'node:fs';

const chrome = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
export default defineConfig({
  testDir: './tests/browser',
  timeout: 20_000,
  expect: { timeout: 4000 },
  fullyParallel: true,
  workers: process.env.CI ? 2 : 3,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.TEST_BASE_URL || 'http://127.0.0.1:4321',
    headless: true,
    launchOptions: !process.env.CI && existsSync(chrome) ? { executablePath: chrome } : {},
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: process.env.TEST_BASE_URL ? undefined : {
    command: 'pnpm dev --port 4321',
    url: 'http://127.0.0.1:4321/brand/favicon.svg',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
