import { expect, test } from '@playwright/test'
import { clearAndSeedWorkspace, launchApp } from './workspace-canvas.helpers'

test.describe('Workspace Canvas - Terminal Shift Enter', () => {
  test('writes escape-enter bytes for Shift+Enter inside terminal input', async () => {
    const { electronApp, window } = await launchApp()

    try {
      await clearAndSeedWorkspace(window, [
        {
          id: 'node-shift-enter',
          title: 'terminal-shift-enter',
          position: { x: 120, y: 120 },
          width: 460,
          height: 300,
        },
      ])

      const terminal = window.locator('.terminal-node').first()
      await expect(terminal).toBeVisible()
      const xterm = terminal.locator('.xterm')
      await expect(xterm).toBeVisible()

      await xterm.click()
      const terminalInput = terminal.locator('.xterm-helper-textarea')
      await expect(terminalInput).toBeFocused()

      await window.keyboard.type(
        `node -e 'process.stdin.setRawMode(true);process.stdin.resume();const bytes=[];const finish=()=>{console.log("COVE_SHIFT_ENTER_CODES:"+bytes.join(","));process.exit(0)};process.stdin.on("data",d=>{for(const b of d)bytes.push(b);if(bytes.length>=2){finish()}});setTimeout(finish,800)'`,
      )
      await window.keyboard.press('Enter')
      await expect(terminal).toContainText('COVE_SHIFT_ENTER_CODES')

      await window.keyboard.down('Shift')
      await window.keyboard.press('Enter')
      await window.keyboard.up('Shift')

      await expect(terminal).toContainText('COVE_SHIFT_ENTER_CODES:27,10')
    } finally {
      await electronApp.close()
    }
  })
})
