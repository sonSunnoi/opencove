import { expect, type Locator, type Page } from '@playwright/test'

export async function dragMouse(
  window: Page,
  options: {
    start: { x: number; y: number }
    end: { x: number; y: number }
    steps?: number
    triggerDistance?: number
    settleAfterPressMs?: number
    modifiers?: Array<'Shift'>
    draft?: Locator
    draftTimeoutMs?: number
  },
): Promise<void> {
  const steps = options.steps ?? 12
  const triggerDistance = options.triggerDistance ?? 8
  const settleAfterPressMs = options.settleAfterPressMs ?? 24
  const deltaX = options.end.x - options.start.x
  const deltaY = options.end.y - options.start.y
  const totalDistance = Math.hypot(deltaX, deltaY)
  const triggerRatio =
    totalDistance > 0 ? Math.min(1, triggerDistance / Math.max(totalDistance, 1)) : 0
  const triggerPoint = {
    x: options.start.x + deltaX * triggerRatio,
    y: options.start.y + deltaY * triggerRatio,
  }
  const holdsShift = (options.modifiers ?? []).includes('Shift')

  if (holdsShift) {
    await window.keyboard.down('Shift')
  }

  try {
    await window.mouse.move(options.start.x, options.start.y)
    await window.mouse.down()

    if (triggerRatio > 0) {
      await window.mouse.move(triggerPoint.x, triggerPoint.y, {
        steps: Math.max(2, Math.min(steps, 4)),
      })
    }

    if (options.draft) {
      await expect(options.draft).toBeVisible({ timeout: options.draftTimeoutMs ?? 5_000 })
    }

    if (settleAfterPressMs > 0) {
      await window.waitForTimeout(settleAfterPressMs)
    }

    await window.mouse.move(options.end.x, options.end.y, { steps })
    await window.mouse.up()
  } finally {
    if (holdsShift) {
      await window.keyboard.up('Shift')
    }
  }
}

export async function dragLocatorTo(
  window: Page,
  source: Locator,
  target: Locator,
  options: {
    sourcePosition?: { x: number; y: number }
    targetPosition?: { x: number; y: number }
    steps?: number
  } = {},
): Promise<void> {
  const sourceBox = await source.boundingBox()
  if (!sourceBox) {
    throw new Error('source locator bounding box unavailable')
  }

  const targetBox = await target.boundingBox()
  if (!targetBox) {
    throw new Error('target locator bounding box unavailable')
  }

  const startX = sourceBox.x + (options.sourcePosition?.x ?? sourceBox.width / 2)
  const startY = sourceBox.y + (options.sourcePosition?.y ?? sourceBox.height / 2)
  const endX = targetBox.x + (options.targetPosition?.x ?? targetBox.width / 2)
  const endY = targetBox.y + (options.targetPosition?.y ?? targetBox.height / 2)

  await dragMouse(window, {
    start: { x: startX, y: startY },
    end: { x: endX, y: endY },
    steps: options.steps,
  })
}
