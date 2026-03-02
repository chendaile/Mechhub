import { MessageSquare, Share2, Upload } from "lucide-react";
import {
    useSidebarFooterState,
    useSidebarActionsState,
    useSidebarResizeState,
    useSidebarSessionsState,
    type DeleteChatResult,
} from "@hooks";
import { SidebarView } from "@views/sidebar/SidebarView";
import type { ActiveView, UserProfile } from "@views/shared/types";
import type { ChatSession } from "@views/chat/types";
import type { SidebarClassGroup, SidebarClassThread } from "@views/sidebar/types";
import { SessionItemPresenter } from "./SessionItemPresenter";

interface SidebarPresenterProps {
    activeView: ActiveView;
    canAccessChat: boolean;
    canAccessProfile: boolean;
    canAccessClassHub: boolean;
    canAccessStudentAssignments: boolean;
    canAccessTeacherAssignments: boolean;
    setActiveView: (view: ActiveView) => void;
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
}

export const SidebarPresenter = ({
    activeView,
    canAccessChat,
    canAccessProfile,
    canAccessClassHub,
    canAccessStudentAssignments,
    canAccessTeacherAssignments,
    setActiveView,
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
}: SidebarPresenterProps) => {
    const { sidebarWidth, handleMouseDown } = useSidebarResizeState();
    const { openGroupIds, handleToggleGroup } = useSidebarSessionsState(classGroups);

    const onSubmitAssignment = canAccessStudentAssignments
        ? () => setActiveView("submitAssignment")
        : undefined;

    const onViewFeedback = canAccessStudentAssignments
        ? () => setActiveView("viewFeedback")
        : undefined;

    const onPublishAssignment = canAccessTeacherAssignments
        ? () => setActiveView("publishAssignment")
        : undefined;

    const onGradeAssignment = canAccessTeacherAssignments
        ? () => setActiveView("gradeAssignment")
        : undefined;

    const {
        assignmentActions,
        assignmentsTitle,
        isAssignmentsOpen,
        isAssignmentsActive,
        handleToggleAssignmentsOpen,
    } = useSidebarFooterState({
        activeView,
        onSubmitAssignment,
        onViewFeedback,
        onPublishAssignment,
        onGradeAssignment,
    });

    const { onNewQuest, handleDeleteSession } = useSidebarActionsState({
        setActiveView,
        handleSelectSession,
        handleStartNewQuest,
        deleteChatSession,
    });

    const handleSessionSelect = (id: string) => {
        setActiveView("chat");
        handleSelectSession(id);
    };

    const renderSession = (session: ChatSession, active: boolean) => (
        <SessionItemPresenter
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
            <SessionItemPresenter
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
            activeView={activeView}
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
            onLogoClick={() => setActiveView("home")}
            onLogoIconClick={(event) => {
                event.stopPropagation();
                setActiveView("landing");
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
            onOpenProfile={canAccessProfile ? () => setActiveView("profile") : undefined}
            onOpenClassHub={canAccessClassHub ? () => setActiveView("classHub") : undefined}
            onSignOut={handleSignOut}
            assignmentActions={assignmentActions}
            assignmentsTitle={assignmentsTitle}
            isAssignmentsOpen={isAssignmentsOpen}
            isAssignmentsActive={isAssignmentsActive}
            onToggleAssignmentsOpen={handleToggleAssignmentsOpen}
        />
    );
};
