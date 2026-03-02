import type { ReactNode } from "react";
import type { ActiveView, UserProfile } from "../shared/types";
import type { ChatSession, DeleteChatResult } from "../chat/types";

export interface SidebarClassThread {
    id: string;
    classId: string;
    title: string;
}

export interface SidebarClassGroup {
    classId: string;
    className: string;
    role: "teacher" | "student";
    threads: SidebarClassThread[];
}

export type SidebarAssignmentActionViewKey = Extract<
    ActiveView,
    "submitAssignment" | "viewFeedback" | "publishAssignment" | "gradeAssignment"
>;

export type SidebarActionAudience = "student" | "teacher";

export interface SidebarAssignmentAction {
    key: SidebarAssignmentActionViewKey;
    label: string;
    audience: SidebarActionAudience;
    onClick: () => void;
}

export interface SidebarViewProps {
    activeView: ActiveView;
    canAccessChat: boolean;
    sidebarWidth: number;
    user: UserProfile;
    sessions: ChatSession[];
    classGroups: SidebarClassGroup[];
    isClassAdmin?: boolean;
    activeClassThreadId?: string;
    currentSessionId: string | null;
    isLoading: boolean;
    onResizeMouseDown: (event: React.MouseEvent<HTMLDivElement>) => void;
    onLogoClick: () => void;
    onLogoIconClick: (event: React.MouseEvent) => void;
    onNewQuest?: () => void;
    onCreateClassThread?: (classId: string) => void;
    creatingClassThreadId?: string | null;
    onSelectClassThread?: (thread: SidebarClassThread) => void;
    onRenameClassThread?: (classId: string, threadId: string, title: string) => Promise<boolean>;
    onDeleteClassThread?: (classId: string, threadId: string) => Promise<boolean>;
    openGroupIds: Set<string>;
    onToggleGroup: (classId: string) => void;
    renderSession: (session: ChatSession, active: boolean) => ReactNode;
    renderClassThread?: (
        thread: SidebarClassThread,
        active: boolean,
        canManage: boolean,
    ) => ReactNode;
    assignmentActions: SidebarAssignmentAction[];
    assignmentsTitle: string;
    isAssignmentsOpen: boolean;
    isAssignmentsActive: boolean;
    onToggleAssignmentsOpen: () => void;
    onOpenProfile?: () => void;
    onOpenClassHub?: () => void;
    onSignOut?: () => void;
}

export interface SidebarHandlers {
    handleSelectSession?: (id: string) => boolean;
    handleStartNewQuest?: () => void;
    deleteChatSession?: (id: string) => Promise<DeleteChatResult>;
    onRenameSession?: (id: string, newTitle: string) => Promise<boolean>;
    handleSignOut?: () => void;
}
