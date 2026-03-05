import { MessageSquare, Share2, Upload } from "lucide-react";
import {
    SidebarActionsUIState,
} from "@hooks/sidebar/ui/SidebarActionsUIState";
import { SidebarFooterUIState } from "@hooks/sidebar/ui/SidebarFooterUIState";
import { SidebarResizeUIState } from "@hooks/sidebar/ui/SidebarResizeUIState";
import { SidebarSessionsUIState } from "@hooks/sidebar/ui/SidebarSessionsUIState";
import { SidebarView } from "@views/sidebar/SidebarView";
import type { UserProfile } from "@views/shared/types";
import type { ChatSession, DeleteChatResult } from "@views/chat/types";
import type {
    SidebarAssignmentActionViewKey,
    SidebarClassGroup,
    SidebarClassThread,
} from "@views/sidebar/types";
import { SessionItem } from "./SessionItem";

interface SidebarProps {
    isChatActive: boolean;
    isProfileActive: boolean;
    isClassHubActive: boolean;
    activeAssignmentKey: SidebarAssignmentActionViewKey | null;
    canAccessChat: boolean;
    canAccessProfile: boolean;
    canAccessClassHub: boolean;
    canAccessStudentAssignments: boolean;
    canAccessTeacherAssignments: boolean;
    userProfile: UserProfile;
    sessions: ChatSession[];
    classGroups: SidebarClassGroup[];
    isClassAdmin?: boolean;
    activeClassThreadId?: string;
    currentSessionId: string | null;
    isLoading: boolean;
    handleSelectSession: (id: string) => boolean;
    handleStartNewQuest: () => void;
    deleteChatSession: (id: string) => Promise<DeleteChatResult>;
    handleRenameSession: (id: string, newTitle: string) => Promise<boolean>;
    onCreateClassThread?: (classId: string) => void;
    creatingClassThreadId?: string | null;
    onSelectClassThread?: (thread: SidebarClassThread) => void;
    onRenameClassThread?: (classId: string, threadId: string, title: string) => Promise<boolean>;
    onDeleteClassThread?: (classId: string, threadId: string) => Promise<boolean>;
    onShareSessionToClass?: (sessionId: string) => void;
    onSubmitSessionToAssignment?: (sessionId: string) => void;
    handleSignOut?: () => void;
    navigateToChat: () => void;
    navigateToProfile: () => void;
    navigateToClassHub: () => void;
    navigateToLanding: () => void;
    navigateToSubmitAssignment: () => void;
    navigateToViewFeedback: () => void;
    navigateToPublishAssignment: () => void;
    navigateToGradeAssignment: () => void;
}

export const Sidebar = ({
    isChatActive,
    isProfileActive,
    isClassHubActive,
    activeAssignmentKey,
    canAccessChat,
    canAccessProfile,
    canAccessClassHub,
    canAccessStudentAssignments,
    canAccessTeacherAssignments,
    userProfile,
    sessions,
    classGroups,
    isClassAdmin,
    activeClassThreadId,
    currentSessionId,
    isLoading,
    handleSelectSession,
    handleStartNewQuest,
    deleteChatSession,
    handleRenameSession,
    onCreateClassThread,
    creatingClassThreadId,
    onSelectClassThread,
    onRenameClassThread,
    onDeleteClassThread,
    onShareSessionToClass,
    onSubmitSessionToAssignment,
    handleSignOut,
    navigateToChat,
    navigateToProfile,
    navigateToClassHub,
    navigateToLanding,
    navigateToSubmitAssignment,
    navigateToViewFeedback,
    navigateToPublishAssignment,
    navigateToGradeAssignment,
}: SidebarProps) => {
    const { sidebarWidth, handleMouseDown } = SidebarResizeUIState();
    const { openGroupIds, handleToggleGroup } = SidebarSessionsUIState(classGroups);

    const onSubmitAssignment = canAccessStudentAssignments
        ? () => navigateToSubmitAssignment()
        : undefined;

    const onViewFeedback = canAccessStudentAssignments
        ? () => navigateToViewFeedback()
        : undefined;

    const onPublishAssignment = canAccessTeacherAssignments
        ? () => navigateToPublishAssignment()
        : undefined;

    const onGradeAssignment = canAccessTeacherAssignments
        ? () => navigateToGradeAssignment()
        : undefined;

    const {
        assignmentActions,
        assignmentsTitle,
        isAssignmentsOpen,
        isAssignmentsActive,
        handleToggleAssignmentsOpen,
    } = SidebarFooterUIState({
        activeAssignmentKey,
        onSubmitAssignment,
        onViewFeedback,
        onPublishAssignment,
        onGradeAssignment,
    });

    const { onNewQuest, handleDeleteSession } = SidebarActionsUIState({
        navigateToHome: navigateToChat,
        navigateToChat,
        handleSelectSession,
        handleStartNewQuest,
        deleteChatSession,
    });

    const handleSessionSelect = (id: string) => {
        navigateToChat();
        handleSelectSession(id);
    };

    const renderSession = (session: ChatSession, active: boolean) => (
        <SessionItem
            label={session.title}
            icon={MessageSquare}
            active={active}
            onClick={() => handleSessionSelect(session.id)}
            onDelete={() => handleDeleteSession(session.id)}
            onRename={(newTitle) => handleRenameSession(session.id, newTitle)}
            isGeneratingTitle={session.isGeneratingTitle}
            menuActions={[
                ...(onSubmitSessionToAssignment
                    ? [
                          {
                              key: "submit_to_assignment",
                              label: "提交到作业",
                              icon: Upload,
                              onClick: () => onSubmitSessionToAssignment(session.id),
                          },
                      ]
                    : []),
                ...(onShareSessionToClass
                    ? [
                          {
                              key: "share_to_class",
                              label: "分享到班级",
                              icon: Share2,
                              onClick: () => onShareSessionToClass(session.id),
                          },
                      ]
                    : []),
            ]}
        />
    );

    const renderClassThread = (thread: SidebarClassThread, active: boolean, canManage: boolean) => {
        const canManageThread = canManage;

        return (
            <SessionItem
                label={thread.title}
                icon={MessageSquare}
                active={active}
                onClick={() => onSelectClassThread?.(thread)}
                onRename={
                    canManageThread && onRenameClassThread
                        ? (newTitle) => onRenameClassThread(thread.classId, thread.id, newTitle)
                        : undefined
                }
                onDelete={
                    canManageThread && onDeleteClassThread
                        ? () => {
                              void onDeleteClassThread(thread.classId, thread.id);
                          }
                        : undefined
                }
            />
        );
    };

    return (
        <SidebarView
            isChatActive={isChatActive}
            isProfileActive={isProfileActive}
            isClassHubActive={isClassHubActive}
            activeAssignmentKey={activeAssignmentKey}
            canAccessChat={canAccessChat}
            sidebarWidth={sidebarWidth}
            user={userProfile}
            sessions={sessions}
            classGroups={classGroups}
            isClassAdmin={isClassAdmin}
            activeClassThreadId={activeClassThreadId}
            currentSessionId={currentSessionId}
            isLoading={isLoading}
            onResizeMouseDown={handleMouseDown}
            onLogoClick={navigateToLanding}
            onLogoIconClick={(event) => {
                event.stopPropagation();
                navigateToLanding();
            }}
            onNewQuest={canAccessChat ? onNewQuest : undefined}
            onCreateClassThread={onCreateClassThread}
            creatingClassThreadId={creatingClassThreadId}
            onSelectClassThread={onSelectClassThread}
            onRenameClassThread={onRenameClassThread}
            onDeleteClassThread={onDeleteClassThread}
            openGroupIds={openGroupIds}
            onToggleGroup={handleToggleGroup}
            renderSession={renderSession}
            renderClassThread={renderClassThread}
            onOpenProfile={canAccessProfile ? navigateToProfile : undefined}
            onOpenClassHub={canAccessClassHub ? navigateToClassHub : undefined}
            onSignOut={handleSignOut}
            assignmentActions={assignmentActions}
            assignmentsTitle={assignmentsTitle}
            isAssignmentsOpen={isAssignmentsOpen}
            isAssignmentsActive={isAssignmentsActive}
            onToggleAssignmentsOpen={handleToggleAssignmentsOpen}
        />
    );
};
