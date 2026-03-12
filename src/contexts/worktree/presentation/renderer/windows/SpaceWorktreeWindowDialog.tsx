import React from 'react'
import { GitBranch, X } from 'lucide-react'
import type { GitWorktreeInfo } from '@shared/contracts/dto'
import type { WorkspaceSpaceState } from '@contexts/workspace/presentation/renderer/types'
import { SpaceWorktreePanels } from './SpaceWorktreePanels'
import type { BranchMode, SpaceWorktreeViewMode } from './spaceWorktree.shared'

export function SpaceWorktreeWindowDialog({
  space,
  isSpaceOnWorkspaceRoot,
  currentWorktree,
  viewMode,
  isBusy,
  isMutating,
  isSuggesting,
  branches,
  currentBranch,
  branchMode,
  newBranchName,
  startPoint,
  existingBranchName,
  deleteBranchOnArchive,
  archiveSpaceOnArchive,
  error,
  guardIsBusy,
  onBackdropClose,
  onClose,
  onBranchModeChange,
  onNewBranchNameChange,
  onStartPointChange,
  onExistingBranchNameChange,
  onSuggestNames,
  onCreate,
  onDeleteBranchOnArchiveChange,
  onArchiveSpaceOnArchiveChange,
  onArchive,
}: {
  space: WorkspaceSpaceState
  isSpaceOnWorkspaceRoot: boolean
  currentWorktree: GitWorktreeInfo | null
  viewMode: SpaceWorktreeViewMode
  isBusy: boolean
  isMutating: boolean
  isSuggesting: boolean
  branches: string[]
  currentBranch: string | null
  branchMode: BranchMode
  newBranchName: string
  startPoint: string
  existingBranchName: string
  deleteBranchOnArchive: boolean
  archiveSpaceOnArchive: boolean
  error: string | null
  guardIsBusy: boolean
  onBackdropClose: () => void
  onClose: () => void
  onBranchModeChange: (mode: BranchMode) => void
  onNewBranchNameChange: (value: string) => void
  onStartPointChange: (value: string) => void
  onExistingBranchNameChange: (value: string) => void
  onSuggestNames: () => void
  onCreate: () => void
  onDeleteBranchOnArchiveChange: (checked: boolean) => void
  onArchiveSpaceOnArchiveChange: (checked: boolean) => void
  onArchive: () => void
}): React.JSX.Element {
  const statusLabel = currentWorktree?.branch?.trim()
    ? currentWorktree.branch
    : isSpaceOnWorkspaceRoot
      ? 'Workspace root'
      : currentWorktree?.head?.trim()
        ? currentWorktree.head.slice(0, 7)
        : 'Detached HEAD'
  const statusContext = isSpaceOnWorkspaceRoot ? 'root' : 'worktree'

  return (
    <div
      className="cove-window-backdrop workspace-space-worktree-backdrop"
      onClick={() => {
        if (isBusy || guardIsBusy) {
          return
        }

        onBackdropClose()
      }}
    >
      <section
        className="cove-window workspace-space-worktree"
        data-testid="space-worktree-window"
        onClick={event => {
          event.stopPropagation()
        }}
      >
        <header className="workspace-space-worktree__header">
          <div className="workspace-space-worktree__header-main">
            <h3>{space.name}</h3>
            <div
              className="workspace-space-worktree__status-line"
              data-testid="space-worktree-status"
            >
              <GitBranch size={14} aria-hidden="true" />
              <span>{statusLabel}</span>
              <span className="workspace-space-worktree__status-separator" aria-hidden="true">
                /
              </span>
              <span className="workspace-space-worktree__status-context">{statusContext}</span>
            </div>
            <button
              type="button"
              className="workspace-space-worktree__close"
              data-testid="space-worktree-close"
              aria-label="Close worktree window"
              disabled={isBusy || guardIsBusy}
              onClick={onClose}
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>
        </header>

        <SpaceWorktreePanels
          space={space}
          viewMode={viewMode}
          isBusy={isBusy}
          isMutating={isMutating}
          isSuggesting={isSuggesting}
          isSpaceOnWorkspaceRoot={isSpaceOnWorkspaceRoot}
          branches={branches}
          currentBranch={currentBranch}
          branchMode={branchMode}
          newBranchName={newBranchName}
          startPoint={startPoint}
          existingBranchName={existingBranchName}
          deleteBranchOnArchive={deleteBranchOnArchive}
          archiveSpaceOnArchive={archiveSpaceOnArchive}
          onBranchModeChange={onBranchModeChange}
          onNewBranchNameChange={onNewBranchNameChange}
          onStartPointChange={onStartPointChange}
          onExistingBranchNameChange={onExistingBranchNameChange}
          onSuggestNames={onSuggestNames}
          onCreate={onCreate}
          onDeleteBranchOnArchiveChange={onDeleteBranchOnArchiveChange}
          onArchiveSpaceOnArchiveChange={onArchiveSpaceOnArchiveChange}
          onArchive={onArchive}
        />

        {error ? (
          <p className="cove-window__error workspace-space-worktree__error">{error}</p>
        ) : null}
      </section>
    </div>
  )
}
