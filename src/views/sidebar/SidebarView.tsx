import { SidebarFooter } from "./parts/SidebarFooter";
import { SidebarHeader } from "./parts/SidebarHeader";
import { SidebarResizeHandle } from "./parts/SidebarResizeHandle";
import { SidebarSessions } from "./parts/SidebarSessions";
import type { SidebarViewProps } from "./types";

export const SidebarView = ({
    isChatActive,
    isProfileActive,
    isClassHubActive,
    activeAssignmentKey,
    canAccessChat,
    sidebarWidth,
    user,
    sessions,
    classGroups,
    isClassAdmin,
    activeClassThreadId,
    currentSessionId,
    isLoading,
    onResizeMouseDown,
    onLogoClick,
    onLogoIconClick,
    onNewQuest,
    onCreateClassThread,
    creatingClassThreadId,
    onSelectClassThread,
    onRenameClassThread,
    onDeleteClassThread,
    openGroupIds,
    onToggleGroup,
    renderSession,
    renderClassThread,
    assignmentActions,
    assignmentsTitle,
    isAssignmentsOpen,
    isAssignmentsActive,
    onToggleAssignmentsOpen,
    onOpenProfile,
    onOpenClassHub,
    onSignOut,
}: SidebarViewProps) => {
    return (
        <div
            className="relative flex flex-col border-r border-[#f0f4f9] bg-[#f0f4f9]"
            style={{ width: `${sidebarWidth}px` }}
        >
            <SidebarResizeHandle onMouseDown={onResizeMouseDown} />

            <SidebarHeader
                onLogoClick={onLogoClick}
                onLogoIconClick={onLogoIconClick}
                onNewQuest={canAccessChat ? onNewQuest : undefined}
            />

            {canAccessChat ? (
                <SidebarSessions
                    sessions={sessions}
                    classGroups={classGroups}
                    isClassAdmin={isClassAdmin}
                    isChatActive={isChatActive}
                    currentSessionId={currentSessionId}
                    activeClassThreadId={activeClassThreadId}
                    isLoading={isLoading}
                    onCreateClassThread={onCreateClassThread}
                    creatingClassThreadId={creatingClassThreadId}
                    onSelectClassThread={onSelectClassThread}
                    onRenameClassThread={onRenameClassThread}
                    onDeleteClassThread={onDeleteClassThread}
                    openGroupIds={openGroupIds}
                    onToggleGroup={onToggleGroup}
                    renderSession={renderSession}
                    renderClassThread={renderClassThread}
                />
            ) : (
                <div className="flex-1 px-6 py-2">
                    <div className="rounded-2xl border border-dashed p-4 text-xs text-slate-500">
                        Chat access is not enabled for this account.
                    </div>
                </div>
            )}

            <SidebarFooter
                user={user}
                isProfileActive={isProfileActive}
                isClassHubActive={isClassHubActive}
                activeAssignmentKey={activeAssignmentKey}
                onOpenProfile={onOpenProfile}
                onOpenClassHub={onOpenClassHub}
                assignmentActions={assignmentActions}
                assignmentsTitle={assignmentsTitle}
                isAssignmentsOpen={isAssignmentsOpen}
                isAssignmentsActive={isAssignmentsActive}
                onToggleAssignmentsOpen={onToggleAssignmentsOpen}
                onSignOut={onSignOut}
            />
        </div>
    );
};
