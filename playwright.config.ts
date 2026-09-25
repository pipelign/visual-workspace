import { defineConfig, devices } from '@playwright/test';

const reportName = process.env.QUALITY_REPORT_NAME ?? 'browser';
if (reportName !== 'browser' && reportName !== 'visual') {
  throw new Error('QUALITY_REPORT_NAME must be browser or visual');
}
const reportRoot = 'artifacts/' + reportName;

export default defineConfig({
  testDir: './tests/browser',
  outputDir: reportRoot + '/results',
  fullyParallel: true,
  forbidOnly: true,
  retries: 0,
  updateSnapshots: 'none',
  metadata: {
    purpose: 'development fixture',
    node: process.versions.node,
    platform: process.platform,
  },
  workers: 2,
  reporter: [
    ['list'],
    ['html', { outputFolder: reportRoot + '/report', open: 'never' }],
    ['json', { outputFile: reportRoot + '/results.json' }],
  ],
  use: {
    baseURL: 'http://127.0.0.1:4173',
    locale: 'en-US',
    timezoneId: 'UTC',
    reducedMotion: 'reduce',
    deviceScaleFactor: 1,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'node scripts/tasks.mjs preview',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: false,
    timeout: 60_000,
  },
  projects: [
    {
      name: 'chromium',
      testIgnore: '**/*.visual.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      testIgnore: '**/*.visual.spec.ts',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      testIgnore: '**/*.visual.spec.ts',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'visual',
      testMatch: '**/*.visual.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
