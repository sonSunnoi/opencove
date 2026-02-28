import type { IpcRegistrationDisposable } from './types'
import { registerAgentIpcHandlers } from '../modules/agent/ipc/register'
import { registerPtyIpcHandlers } from '../modules/pty/ipc/register'
import { createPtyRuntime } from '../modules/pty/ipc/runtime'
import { registerTaskIpcHandlers } from '../modules/task/ipc/register'
import { registerWorkspaceIpcHandlers } from '../modules/workspace/ipc/register'
import { createApprovedWorkspaceStore } from '../modules/workspace/ApprovedWorkspaceStore'
import { resolve } from 'node:path'
import { registerWorktreeIpcHandlers } from '../modules/worktree/ipc/register'
import { app } from 'electron'
import type { PersistenceStore } from '../modules/persistence/PersistenceStore'
import { createPersistenceStore } from '../modules/persistence/PersistenceStore'
import { registerPersistenceIpcHandlers } from '../modules/persistence/ipc/register'

export type { IpcRegistrationDisposable } from './types'

export function registerIpcHandlers(): IpcRegistrationDisposable {
  const ptyRuntime = createPtyRuntime()
  const approvedWorkspaces = createApprovedWorkspaceStore()

  let persistenceStorePromise: Promise<PersistenceStore> | null = null
  const getPersistenceStore = async (): Promise<PersistenceStore> => {
    if (persistenceStorePromise) {
      return await persistenceStorePromise
    }

    const dbPath = resolve(app.getPath('userData'), 'cove.db')
    persistenceStorePromise = createPersistenceStore({ dbPath })
    return await persistenceStorePromise
  }

  if (process.env.NODE_ENV === 'test' && process.env.COVE_TEST_WORKSPACE) {
    void approvedWorkspaces.registerRoot(resolve(process.env.COVE_TEST_WORKSPACE))
  }

  const disposables: IpcRegistrationDisposable[] = [
    registerWorkspaceIpcHandlers(approvedWorkspaces),
    registerPersistenceIpcHandlers(getPersistenceStore),
    registerWorktreeIpcHandlers(approvedWorkspaces),
    registerPtyIpcHandlers(ptyRuntime, approvedWorkspaces),
    registerAgentIpcHandlers(ptyRuntime, approvedWorkspaces),
    registerTaskIpcHandlers(approvedWorkspaces),
  ]

  return {
    dispose: () => {
      for (let index = disposables.length - 1; index >= 0; index -= 1) {
        disposables[index]?.dispose()
      }

      const storePromise = persistenceStorePromise
      persistenceStorePromise = null
      storePromise
        ?.then(store => {
          store.dispose()
        })
        .catch(() => {
          // ignore
        })
    },
  }
}
