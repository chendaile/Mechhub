import { useMemo } from "react";
import { clearSession, useSessionQuery, authInstance } from "../../auth/export";
import { useProfileQuery } from "../../profile/export";
import { ChatSessionsUIState } from "../../chat/ui/ChatSessionsUIState";
import type { UserProfile } from "../../../views/shared/types";
import type { ChatSession, DeleteChatResult } from "../../../views/chat/types";
import type { SidebarClassGroup, SidebarClassThread } from "../../../views/sidebar/types";
import type { SidebarAssignmentActionViewKey } from "../types";

const resolveAssignmentKey = (pathname: string): SidebarAssignmentActionViewKey | null => {
    if (pathname.includes("/assignment/submit")) return "submitAssignment";
    if (pathname.includes("/assignment/feedback")) return "viewFeedback";
    if (pathname.includes("/assignment/publish")) return "publishAssignment";
    if (pathname.includes("/assignment/grade")) return "gradeAssignment";
    if (pathname.includes("/assignment")) return "submitAssignment";
    return null;
};

export const SidebarPageUIState = (options: {
    pathname: string;
    navigate: (path: string) => void;
}) => {
    const { data: session } = useSessionQuery();
    const { data: profile } = useProfileQuery();
    const { pathname, navigate } = options;

    const isChatActive = pathname.startsWith("/app/chat");
    const isProfileActive = pathname.startsWith("/app/profile");
    const isClassHubActive = pathname.startsWith("/app/class");
    const activeAssignmentKey = resolveAssignmentKey(pathname);

    const canAccessChat = !!session;
    const canAccessProfile = !!session;
    const canAccessClassHub = !!session;
    const canAccessStudentAssignments = !!session;
    const canAccessTeacherAssignments = !!session;

    const {
        chatSessions,
        isLoadingSessions,
        currentSessionId,
        setCurrentSessionId,
        handleSelectSession,
        handleStartNewQuest,
        deleteChatSession,
        handleRenameSession,
    } = ChatSessionsUIState(session, canAccessChat);

    const userProfile: UserProfile = useMemo(
        () => ({
            name: profile?.name ?? session?.email ?? "MechHub",
            avatar: profile?.avatarUrl ?? "",
        }),
        [profile?.name, profile?.avatarUrl, session?.email],
    );

    const handleSignOut = async () => {
        try {
            await authInstance.signOut();
        } finally {
            clearSession();
        }
    };

    const navigateToChat = () => navigate("/app/chat");
    const navigateToProfile = () => navigate("/app/profile");
    const navigateToClassHub = () => navigate("/app/class");
    const navigateToLanding = () => navigate("/landing");
    const navigateToSubmitAssignment = () => navigate("/app/assignment/submit");
    const navigateToViewFeedback = () => navigate("/app/assignment/feedback");
    const navigateToPublishAssignment = () => navigate("/app/assignment/publish");
    const navigateToGradeAssignment = () => navigate("/app/assignment/grade");

    return {
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
        sessions: chatSessions as ChatSession[],
        classGroups: [] as SidebarClassGroup[],
        isClassAdmin: false,
        activeClassThreadId: undefined,
        currentSessionId,
        isLoading: isLoadingSessions,
        handleSelectSession: (id: string) => {
            const didSelect = handleSelectSession(id);
            if (didSelect) {
                setCurrentSessionId(id);
            }
            return didSelect;
        },
        handleStartNewQuest: () => {
            handleStartNewQuest();
            setCurrentSessionId(null);
        },
        deleteChatSession: (id: string) => deleteChatSession(id) as Promise<DeleteChatResult>,
        handleRenameSession,
        onCreateClassThread: undefined,
        creatingClassThreadId: null,
        onSelectClassThread: undefined as ((thread: SidebarClassThread) => void) | undefined,
        onRenameClassThread: undefined as
            | ((classId: string, threadId: string, title: string) => Promise<boolean>)
            | undefined,
        onDeleteClassThread: undefined as
            | ((classId: string, threadId: string) => Promise<boolean>)
            | undefined,
        onShareSessionToClass: undefined,
        onSubmitSessionToAssignment: undefined,
        handleSignOut,
        navigateToChat,
        navigateToProfile,
        navigateToClassHub,
        navigateToLanding,
        navigateToSubmitAssignment,
        navigateToViewFeedback,
        navigateToPublishAssignment,
        navigateToGradeAssignment,
    };
};
