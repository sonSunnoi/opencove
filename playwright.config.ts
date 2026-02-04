import { defineConfig } from '@playwright/test'
import path from 'path'

/**
 * Playwright 配置 - Electron E2E 测试
 *
 * 使用 Electron 的 Playwright 集成来测试桌面应用。
 * 运行: npm run test:e2e
 */
export default defineConfig({
  // 测试目录
  testDir: './tests/e2e',

  // 测试文件匹配模式
  testMatch: '**/*.spec.ts',

  // 全局超时：每个测试 60 秒
  timeout: 60_000,

  // expect 超时
  expect: {
    timeout: 10_000,
  },

  // 重试配置：CI 中重试 2 次，本地不重试
  retries: process.env.CI ? 2 : 0,

  // 并行 worker 数量
  workers: 1, // Electron 测试建议串行运行

  // 报告器
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],

  // 输出目录（截图、视频等）
  outputDir: './test-results',

  // 全局设置/清理
  globalSetup: undefined,
  globalTeardown: undefined,

  // 项目配置
  projects: [
    {
      name: 'electron',
      use: {
        // 截图配置
        screenshot: 'only-on-failure',
        // 视频录制
        video: 'retain-on-failure',
        // Trace 配置
        trace: 'retain-on-failure',
      },
    },
  ],
})
