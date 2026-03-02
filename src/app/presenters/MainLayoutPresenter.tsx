import { MainLayoutView } from "@views/layout/MainLayoutView";
import { HomePresenter } from "./HomePresenter";
import { ChatPresenter } from "./ChatPresenter";
import { SidebarPresenter } from "./SidebarPresenter";
import { ClassThreadChatPresenter } from "./ClassThreadChatPresenter";
import { ProfileView } from "@views/profile/ProfileView";
import { useProfileState } from "@hooks";
import type {
    ChatMode as HookChatMode,
    ChatSession as HookChatSession,
    DeleteChatResult,
    FileAttachment,
    Message as HookMessage,
    SubmitMessage,
    UploadImageHandler,
    UserProfile as HookUserProfile,
} from "@hooks";
import type { ActiveView } from "@views/shared/types";
import type { SidebarClassGroup, SidebarClassThread } from "@views/sidebar/types";
import { mapChatSession, mapMessage } from "../mappers/chat";
import { mapUserProfile } from "../mappers/user";

interface MainLayoutPresenterProps {
    activeView: ActiveView;
    setActiveView: (view: ActiveView) => void;
    canAccessChat: boolean;
    canAccessProfile: boolean;
    canAccessClassHub: boolean;
    canAccessStudentAssignments: boolean;
    canAccessTeacherAssignments: boolean;
    userProfile: HookUserProfile;
    chatSessions: HookChatSession[];
    classSessionGroups: SidebarClassGroup[];
    isClassAdmin?: boolean;
    activeClassThreadId?: string;
    currentSessionId: string | null;
    chatMode: HookChatMode;
    setChatMode: (mode: HookChatMode) => void;
    deleteChatSession: (id: string) => Promise<DeleteChatResult>;
    handleSelectSession: (id: string) => boolean;
    handleStartNewQuest: () => void;
    handleRenameSession: (id: string, newTitle: string) => Promise<boolean>;
    onCreateClassThread?: (classId: string) => void;
    creatingClassThreadId?: string | null;
    onSelectClassThread?: (thread: SidebarClassThread) => void;
    onRenameClassThread?: (classId: string, threadId: string, title: string) => Promise<boolean>;
    onDeleteClassThread?: (classId: string, threadId: string) => Promise<boolean>;
    onShareSessionToClass?: (sessionId: string) => void;
    onSubmitSessionToAssignment?: (sessionId: string) => void;
    handleSignOut: () => void;
    isLoadingSessions: boolean;
    messages: HookMessage[];
    onSendMessage: (submitMessage: SubmitMessage) => void;
    uploadImage: UploadImageHandler;
    isTyping: boolean;
    handleStopGeneration: () => void;
    onStartChat: (
        message?: string,
        imageUrls?: string[],
        fileAttachments?: FileAttachment[],
        model?: string,
        mode?: HookChatMode,
    ) => void;
    onShareChatMessageToClass?: (messageId: string) => void;
    onSubmitChatMessageToAssignment?: (messageId: string) => void;
    chatTargetType: "private" | "class";
    classChatTarget?: {
        threadId: string;
        className: string;
        threadTitle: string;
        currentUserId: string;
    };
    onCopySharedClassMessageToNewSession?: (content: Record<string, unknown>) => void;
    classHub?: React.ReactNode;
    submitAssignment?: React.ReactNode;
    viewFeedback?: React.ReactNode;
    publishAssignment?: React.ReactNode;
    gradeAssignment?: React.ReactNode;
}

export const MainLayoutPresenter = ({
    activeView,
    setActiveView,
    canAccessChat,
    canAccessProfile,
    canAccessClassHub,
    canAccessStudentAssignments,
    canAccessTeacherAssignments,
    userProfile,
    chatSessions,
    classSessionGroups,
    isClassAdmin,
    activeClassThreadId,
    currentSessionId,
    chatMode,
    setChatMode,
    deleteChatSession,
    handleSelectSession,
    handleStartNewQuest,
    handleRenameSession,
    onCreateClassThread,
    creatingClassThreadId,
    onSelectClassThread,
    onRenameClassThread,
    onDeleteClassThread,
    onShareSessionToClass,
    onSubmitSessionToAssignment,
    handleSignOut,
    isLoadingSessions,
    messages,
    onSendMessage,
    uploadImage,
    isTyping,
    handleStopGeneration,
    onStartChat,
    onShareChatMessageToClass,
    onSubmitChatMessageToAssignment,
    chatTargetType,
    classChatTarget,
    onCopySharedClassMessageToNewSession,
    classHub,
    submitAssignment,
    viewFeedback,
    publishAssignment,
    gradeAssignment,
}: MainLayoutPresenterProps) => {
    const viewUserProfile = mapUserProfile(userProfile);
    const viewSessions = chatSessions.map(mapChatSession);
    const viewMessages = messages.map(mapMessage);
    const profileState = useProfileState();

    return (
        <MainLayoutView
            activeView={activeView}
            sidebar={
                <SidebarPresenter
                    activeView={activeView}
                    canAccessChat={canAccessChat}
                    canAccessProfile={canAccessProfile}
                    canAccessClassHub={canAccessClassHub}
                    canAccessStudentAssignments={canAccessStudentAssignments}
                    canAccessTeacherAssignments={canAccessTeacherAssignments}
                    setActiveView={setActiveView}
                    userProfile={viewUserProfile}
                    sessions={viewSessions}
                    classGroups={classSessionGroups}
                    isClassAdmin={isClassAdmin}
                    activeClassThreadId={activeClassThreadId}
                    currentSessionId={currentSessionId}
                    isLoading={isLoadingSessions}
                    handleSelectSession={handleSelectSession}
                    handleStartNewQuest={handleStartNewQuest}
                    deleteChatSession={deleteChatSession}
                    handleRenameSession={handleRenameSession}
                    onCreateClassThread={onCreateClassThread}
                    creatingClassThreadId={creatingClassThreadId}
                    onSelectClassThread={onSelectClassThread}
                    onRenameClassThread={onRenameClassThread}
                    onDeleteClassThread={onDeleteClassThread}
                    onShareSessionToClass={onShareSessionToClass}
                    onSubmitSessionToAssignment={onSubmitSessionToAssignment}
                    handleSignOut={handleSignOut}
                />
            }
            home={
                canAccessChat ? (
                    <HomePresenter
                        onStartChat={onStartChat}
                        mode={chatMode}
                        setMode={setChatMode}
                        userName={viewUserProfile.name}
                        uploadImage={uploadImage}
                    />
                ) : undefined
            }
            chat={
                canAccessChat ? (
                    chatTargetType === "class" && classChatTarget ? (
                        <ClassThreadChatPresenter
                            threadId={classChatTarget.threadId}
                            className={classChatTarget.className}
                            threadTitle={classChatTarget.threadTitle}
                            currentUserId={classChatTarget.currentUserId}
                            onCopySharedChatToNewSession={onCopySharedClassMessageToNewSession}
                        />
                    ) : (
                        <ChatPresenter
                            messages={viewMessages}
                            onSendMessage={onSendMessage}
                            uploadImage={uploadImage}
                            isTyping={isTyping}
                            onStop={handleStopGeneration}
                            mode={chatMode}
                            setMode={setChatMode}
                            sessionId={currentSessionId}
                            onShareToClassMessage={onShareChatMessageToClass}
                            onSubmitToAssignmentMessage={onSubmitChatMessageToAssignment}
                        />
                    )
                ) : undefined
            }
            profile={
                canAccessProfile ? (
                    <ProfileView
                        {...profileState}
                        isUploadingAvatar={profileState.isSaving}
                        handleSave={profileState.handleSave}
                        handleAvatarUpload={profileState.handleAvatarSelect}
                    />
                ) : undefined
            }
            classHub={classHub}
            submitAssignment={submitAssignment}
            viewFeedback={viewFeedback}
            publishAssignment={publishAssignment}
            gradeAssignment={gradeAssignment}
        />
    );
};
