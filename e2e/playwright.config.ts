import { defineConfig } from '@playwright/test'

const liveBaseURL = process.env.PLAYWRIGHT_BASE_URL
const localBaseURL = 'http://localhost:5173'

export default defineConfig({
  testDir: '.',
  timeout: 30_000,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never' }]],

  webServer: liveBaseURL
    ? undefined
    : {
        command: 'npm run dev',
        port: 5173,
        reuseExistingServer: true,
        cwd: '..',
      },

  projects: [
    {
      name: 'offline',
      testDir: './offline',
    },
    {
      name: 'online',
      testDir: './online',
    },
    {
      name: 'protocol',
      testDir: './protocol',
    },
    {
      name: 'signet-webkit',
      testDir: './protocol',
      testMatch: /signet-.*\.spec\.ts/,
      use: {
        browserName: 'webkit',
        viewport: { width: 390, height: 844 },
      },
    },
    {
      name: 'hybrid',
      testDir: './hybrid',
    },
    {
      name: 'smoke',
      testDir: './smoke',
    },
    {
      name: 'real-relay',
      testDir: './real-relay',
    },
  ],

  use: {
    baseURL: liveBaseURL ?? localBaseURL,
    bypassCSP: true,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
})
