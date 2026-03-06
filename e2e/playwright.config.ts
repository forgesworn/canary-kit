import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: '.',
  timeout: 30_000,
  retries: 0,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never' }]],

  webServer: {
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
      name: 'hybrid',
      testDir: './hybrid',
    },
  ],

  use: {
    baseURL: 'http://localhost:5173',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
})
