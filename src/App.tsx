import { useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { AppShellUIState as useAppShellState } from "./AppShellUIState";
import { resolveAssignmentPanelNode, shouldShowLandingPage } from "./appShellRenderModel";
import type {
    Assignment,
    AssignmentFeedbackSummary,
    GradeListViewClass,
    PublishAssignmentDraft,
    SaveGradeReviewPayload,
} from "./hooks/assignment/types";
import { useSessionQuery } from "./hooks/auth/export";
import { AuthPageUIState } from "./hooks/auth/ui/AuthPageUIState";
import { PermissionKeyList, type PermissionKeys, type PermissionMode } from "./hooks/authz/types";
import { AuthConsoleUIState } from "./hooks/authz/ui/AuthConsoleUIState";
import { chatUseCases } from "./hooks/chat";
import { ChatModelUIState } from "./hooks/chat/ui/ChatModelUIState";
import { MyClassUIState } from "./hooks/class/ui/ClassHubUIState";
import { ClassThreadChatUIState } from "./hooks/class/ui/ClassThreadChatUIState";
import { ProfileUIState } from "./hooks/profile/ui/ProfileUIState";
import { buildAssignmentClassNameMap } from "./hooks/assignment/ui/AssignmentClassNameMapUIState";
import { GradeAssignmentUIState } from "./hooks/assignment/ui/GradeAssignmentUIState";
import { PublishAssignmentUIState } from "./hooks/assignment/ui/PublishAssignmentUIState";
import { buildSnapshotPreview } from "./hooks/assignment/ui/SubmitSnapshotPreviewUIState";
import { buildSubmitAssignmentViewModel } from "./hooks/assignment/ui/SubmitAssignmentUIState";
import { buildViewFeedbackGroups } from "./hooks/assignment/ui/ViewFeedbackUIState";
import { AssignmentSubmitPopover, GradeAssignmentView } from "@views/assignment";
import { PublishAssignmentView } from "@views/assignment/PublishAssignmentView";
import { SubmitAssignmentView } from "@views/assignment/SubmitAssignmentView";
import { ViewFeedbackView } from "@views/assignment/ViewFeedbackView";
import { PermissionsConsoleView } from "@views/admin/PermissionsConsoleView";
import { AuthPageView } from "@views/auth/AuthPageView";
import { ClassMembershipNoticeView, ClassPickerPopover } from "@views/class";
import { ClassHubView } from "@views/class/ClassHubView";
import { ClassThreadChatView } from "@views/class/ClassThreadChatView";
import { ChatView } from "@views/chat/ChatView";
import { ChatInputView } from "@views/chat/parts/ChatInputView";
import type { ChatMode, SubmitMessage, UploadImageHandler } from "@views/chat/types";
import { HomeView } from "@views/home/HomeView";
import { LandingPageView } from "@views/landing/LandingPageView";
import { AppLoadingView } from "@views/layout/AppLoadingView";
import { AuthGateView } from "@views/layout/AuthGateView";
import { MainLayoutView } from "@views/layout/MainLayoutView";
import { ProfileView } from "@views/profile/ProfileView";
import type { ActiveView } from "@views/shared/types";
import { MessageList } from "./components/chat/MessageList";
import { UnifiedInputBar } from "./components/chat/UnifiedInputBar";
import { Sidebar } from "./components/sidebar/Sidebar";

const DEFAULT_PROFILE_NAME = "张同学";
const DEFAULT_PROFILE_AVATAR = "";

interface PublishAssignmentPanelProps {
    classOptions: Array<{
        id: string;
        name: string;
    }>;
    onPublish: (draft: PublishAssignmentDraft) => Promise<boolean>;
}

const PublishAssignmentPanel = ({ classOptions, onPublish }: PublishAssignmentPanelProps) => {
    const publishState = PublishAssignmentUIState({ onPublish });

    return (
        <PublishAssignmentView
            title={publishState.title}
            setTitle={publishState.setTitle}
            selectedClassId={publishState.classId}
            setSelectedClassId={publishState.setClassId}
            classOptions={classOptions}
            dueDate={publishState.dueDate}
            setDueDate={publishState.setDueDate}
            dueTime={publishState.dueTime}
            setDueTime={publishState.setDueTime}
            instructions={publishState.instructions}
            setInstructions={publishState.setInstructions}
            attachedFiles={publishState.attachedFiles}
            onFileUpload={publishState.handleFileUpload}
            onRemoveFile={publishState.handleRemoveFile}
            aiGradingEnabled={publishState.aiGradingEnabled}
            setAiGradingEnabled={publishState.setAiGradingEnabled}
            onPublish={publishState.handlePublish}
            isLoading={publishState.isLoading}
        />
    );
};

interface SubmitAssignmentPanelProps {
    assignments: Assignment[];
    classNameById: Record<string, string>;
    isSubmitting: boolean;
}

const SubmitAssignmentPanel = ({
    assignments,
    classNameById,
    isSubmitting,
}: SubmitAssignmentPanelProps) => {
    const assignmentCards = buildSubmitAssignmentViewModel(assignments, classNameById);

    return (
        <SubmitAssignmentView
            assignments={assignmentCards.map((assignment) => {
                if (!assignment.latestEvidenceSnapshot) {
                    return {
                        ...assignment,
                        hasPreview: false,
                    };
                }

                const preview = buildSnapshotPreview(assignment.latestEvidenceSnapshot);

                return {
                    ...assignment,
                    hasPreview: preview.messages.length > 0,
                    previewContent:
                        preview.messages.length > 0 ? (
                            <MessageList
                                messages={preview.messages}
                                isTyping={false}
                                sessionId={assignment.latestSubmissionId ?? assignment.id}
                                showActions={false}
                                className="h-full overflow-y-auto overflow-x-hidden bg-slate-50 px-4 py-3"
                                contentClassName="space-y-4"
                            />
                        ) : undefined,
                };
            })}
            isSubmitting={isSubmitting}
        />
    );
};

interface ViewFeedbackPanelProps {
    feedbackList: AssignmentFeedbackSummary[];
    classNameById: Record<string, string>;
}

const toDisplayScore = (summary: AssignmentFeedbackSummary) => {
    if (!summary.grade) {
        return "未发布";
    }

    return `${summary.grade.score}/${summary.grade.maxScore}`;
};

const ViewFeedbackPanel = ({ feedbackList, classNameById }: ViewFeedbackPanelProps) => {
    const [activeSubmissionId, setActiveSubmissionId] = useState<string | null>(
        feedbackList[0]?.submission.id ?? null,
    );

    const activeItem = useMemo(
        () => feedbackList.find((item) => item.submission.id === activeSubmissionId) ?? null,
        [activeSubmissionId, feedbackList],
    );

    const groupedItems = useMemo(
        () => buildViewFeedbackGroups(feedbackList, classNameById),
        [classNameById, feedbackList],
    );

    return (
        <ViewFeedbackView
            groups={groupedItems}
            activeSubmissionId={activeSubmissionId}
            onSelectSubmission={setActiveSubmissionId}
            detail={
                activeItem
                    ? {
                          assignmentTitle: activeItem.assignment?.title ?? "未命名作业",
                          dueAt: activeItem.assignment?.dueAt ?? null,
                          submittedAt: activeItem.submission.submittedAt,
                          reflectionText: activeItem.submission.reflectionText,
                          teacherFeedback: activeItem.grade?.teacherFeedback ?? "",
                          aiFeedbackDraft: activeItem.grade?.aiFeedbackDraft ?? null,
                          score: toDisplayScore(activeItem),
                          rubric: activeItem.grade?.rubric ?? [],
                      }
                    : null
            }
        />
    );
};

interface GradeAssignmentPanelProps {
    teacherClasses: GradeListViewClass[];
    generatingGradeDraftIds: Set<string>;
    onGenerateGradeDraft: (
        submissionId: string,
        model?: string,
        options?: { silent?: boolean },
    ) => Promise<boolean>;
    onSaveGradeReview: (payload: SaveGradeReviewPayload) => Promise<boolean>;
    onReleaseGrade: (submissionId: string) => Promise<boolean>;
    isGeneratingDraft: boolean;
    isSavingReview: boolean;
    isReleasingGrade: boolean;
}

const GradeAssignmentPanel = ({
    teacherClasses,
    generatingGradeDraftIds,
    onGenerateGradeDraft,
    onSaveGradeReview,
    onReleaseGrade,
    isGeneratingDraft,
    isSavingReview,
    isReleasingGrade,
}: GradeAssignmentPanelProps) => {
    const gradeState = GradeAssignmentUIState({
        teacherClasses,
        generatingGradeDraftIds,
        onGenerateGradeDraft,
        onSaveGradeReview,
        onReleaseGrade,
    });

    return (
        <GradeAssignmentView
            mode={gradeState.mode}
            summary={gradeState.summary}
            dashboardAssignments={gradeState.dashboardAssignments}
            isDashboardLoading={gradeState.isDashboardLoading}
            teacherClasses={gradeState.teacherClasses}
            activeClassName={gradeState.activeClassName}
            onEnterClass={gradeState.onEnterClass}
            onBackToClassList={gradeState.onBackToClassList}
            onEnterDetail={gradeState.onEnterDetail}
            onBackToClassDashboard={gradeState.onBackToClassDashboard}
            assignments={gradeState.assignments}
            activeAssignmentId={gradeState.activeAssignmentId}
            onSelectAssignment={gradeState.onSelectAssignment}
            submissions={gradeState.submissions}
            activeSubmissionId={gradeState.activeSubmissionId}
            onSelectSubmission={gradeState.onSelectSubmission}
            detail={gradeState.detail}
            previewTitle={gradeState.previewTitle}
            previewCapturedAt={gradeState.previewCapturedAt}
            previewContent={
                <MessageList
                    messages={gradeState.previewMessages}
                    isTyping={false}
                    sessionId={gradeState.activeSubmissionId ?? "preview"}
                    showActions={false}
                    className="h-full overflow-y-auto overflow-x-hidden bg-slate-50 px-6 py-4"
                    contentClassName="space-y-4"
                />
            }
            hasPreview={gradeState.hasPreview}
            aiGradingEnabled={gradeState.aiGradingEnabled}
            isLoading={gradeState.isLoading}
            isGeneratingDraft={isGeneratingDraft}
            isSavingReview={isSavingReview}
            isReleasingGrade={isReleasingGrade}
            onScoreChange={gradeState.onScoreChange}
            onMaxScoreChange={gradeState.onMaxScoreChange}
            onTeacherFeedbackChange={gradeState.onTeacherFeedbackChange}
            onGenerateDraft={gradeState.onGenerateDraft}
            onReleaseGrade={gradeState.onReleaseGrade}
        />
    );
};

interface HomePanelProps {
    onStartChat: (
        message?: string,
        imageUrls?: string[],
        fileAttachments?: SubmitMessage["fileAttachments"],
        model?: string,
        mode?: ChatMode,
    ) => void;
    mode: ChatMode;
    setMode: (mode: ChatMode) => void;
    userName: string;
    uploadImage: UploadImageHandler;
}

const HomePanel = ({ onStartChat, mode, setMode, userName, uploadImage }: HomePanelProps) => {
    const { model, setModel } = ChatModelUIState();

    return (
        <HomeView
            userName={userName}
            inputBar={
                <UnifiedInputBar
                    onSendMessage={(payload) =>
                        onStartChat(
                            payload.text,
                            payload.imageUrls,
                            payload.fileAttachments,
                            payload.model,
                            payload.mode,
                        )
                    }
                    uploadImage={uploadImage}
                    mode={mode}
                    setMode={setMode}
                    model={model}
                    setModel={setModel}
                />
            }
        />
    );
};

interface ChatPanelProps {
    messages: Parameters<typeof MessageList>[0]["messages"];
    isTyping: boolean;
    sessionId: string | null;
    onSendMessage: Parameters<typeof UnifiedInputBar>[0]["onSendMessage"];
    uploadImage: Parameters<typeof UnifiedInputBar>[0]["uploadImage"];
    mode: ChatMode;
    setMode: (mode: ChatMode) => void;
    onStop?: () => void;
    onShareToClassMessage?: (messageId: string) => void;
    onSubmitToAssignmentMessage?: (messageId: string) => void;
}

const ChatPanel = ({
    messages,
    isTyping,
    sessionId,
    onSendMessage,
    uploadImage,
    mode,
    setMode,
    onStop,
    onShareToClassMessage,
    onSubmitToAssignmentMessage,
}: ChatPanelProps) => {
    const { model, setModel } = ChatModelUIState();

    return (
        <ChatView
            messageList={
                <MessageList
                    messages={messages}
                    isTyping={isTyping}
                    sessionId={sessionId}
                    onShareToClassMessage={onShareToClassMessage}
                    onSubmitToAssignmentMessage={onSubmitToAssignmentMessage}
                />
            }
            chatInput={
                <ChatInputView
                    inputBar={
                        <UnifiedInputBar
                            onSendMessage={onSendMessage}
                            uploadImage={uploadImage}
                            mode={mode}
                            setMode={setMode}
                            model={model}
                            setModel={setModel}
                            isTyping={isTyping}
                            onStop={onStop}
                        />
                    }
                />
            }
        />
    );
};

interface ClassThreadChatPanelProps {
    threadId: string;
    className: string;
    threadTitle: string;
    currentUserId: string;
    onCopySharedChatToNewSession?: (content: Record<string, unknown>) => void;
}

const ClassThreadChatPanel = ({
    threadId,
    className,
    threadTitle,
    currentUserId,
    onCopySharedChatToNewSession,
}: ClassThreadChatPanelProps) => {
    const classThreadChatState = ClassThreadChatUIState(threadId);
    const [mode, setMode] = useState<ChatMode>("study");
    const { model, setModel } = ChatModelUIState();

    const handleSetMode = (nextMode: ChatMode) => {
        if (nextMode === "correct") {
            toast.warning("班级群聊不支持批改模式");
            setMode("study");

            return;
        }

        setMode(nextMode);
    };

    return (
        <ClassThreadChatView
            className={className}
            threadTitle={threadTitle}
            messages={classThreadChatState.threadMessages.map((message) => ({
                ...message,
                role: message.role === "assistant" ? "assistant" : "user",
            }))}
            currentUserId={currentUserId}
            isSending={classThreadChatState.isSending}
            isLoadingMessages={classThreadChatState.isLoadingMessages}
            renderMessageContent={(content) =>
                typeof content.content === "string" ? content.content : ""
            }
            scrollAnchorRef={classThreadChatState.scrollAnchorRef}
            inputBar={
                <UnifiedInputBar
                    onSendMessage={(payload) => void classThreadChatState.sendMessage(payload.text)}
                    uploadImage={chatUseCases.storagePort.uploadImage}
                    mode={mode}
                    setMode={handleSetMode}
                    model={model}
                    setModel={setModel}
                    placeholder="输入消息，使用 @ai 才会触发 AI 助教"
                    isTyping={classThreadChatState.isSending}
                />
            }
            onCopySharedChatToNewSession={onCopySharedChatToNewSession}
        />
    );
};

interface ClassHubPanelProps {
    requesterEmail?: string;
    canCreateClass: boolean;
    canJoinClass: boolean;
    selectedClassId: string | null;
    onSelectedClassIdChange: (classId: string | null) => void;
    onEnterClassChat?: (payload: {
        classId: string;
        className: string;
        threadId: string;
        threadTitle: string;
    }) => void;
}

const ClassHubPanel = ({
    requesterEmail,
    canCreateClass,
    canJoinClass,
    selectedClassId,
    onSelectedClassIdChange,
    onEnterClassChat,
}: ClassHubPanelProps) => {
    const classHubState = MyClassUIState();

    useEffect(() => {
        if (selectedClassId !== classHubState.selectedClassId) {
            classHubState.setSelectedClassId(selectedClassId);
        }
    }, [classHubState.selectedClassId, classHubState.setSelectedClassId, selectedClassId]);

    const classOptions = classHubState.myClasses.map((classItem) => ({
        id: classItem.classId,
        name: classItem.className,
        role: (classHubState.canManageClass ? "teacher" : "student") as "teacher" | "student",
        teacherCount: 0,
        studentCount: 0,
    }));

    const openThreadChat = (threadId: string) => {
        const thread = classHubState.selectedThreads.find((item) => item.id === threadId);
        const currentClass = classHubState.selectedClass;
        if (!thread || !currentClass) {
            return;
        }

        onEnterClassChat?.({
            classId: currentClass.classId,
            className: currentClass.className,
            threadId: thread.id,
            threadTitle: thread.title,
        });
    };

    return (
        <ClassHubView
            requesterEmail={requesterEmail}
            isAdmin={classHubState.canManageClass}
            screen={classHubState.activeView}
            classOptions={classOptions}
            selectedClassId={selectedClassId ?? undefined}
            onOpenClassDashboard={(classId) => {
                onSelectedClassIdChange(classId);
                classHubState.openClassDashboard(classId);
            }}
            onBackToCollection={classHubState.backToCollection}
            canCreateClass={canCreateClass}
            canJoinClass={canJoinClass}
            createClassName={classHubState.createClassName}
            onCreateClassNameChange={classHubState.setCreateClassName}
            createClassDescription={classHubState.createClassDescription}
            onCreateClassDescriptionChange={classHubState.setCreateClassDescription}
            onCreateClass={classHubState.createClass}
            isCreatingClass={classHubState.isCreatingClass}
            inviteCodeInput={classHubState.joinInviteCode}
            onInviteCodeInputChange={classHubState.setJoinInviteCode}
            onJoinByInviteCode={classHubState.joinClass}
            isJoiningClass={classHubState.isJoiningClass}
            teachers={classHubState.teachers.map((teacher) => ({
                ...teacher,
                role: "teacher" as const,
            }))}
            students={classHubState.students.map((student) => ({
                ...student,
                role: "student" as const,
            }))}
            threads={classHubState.selectedThreads.map((thread) => ({
                id: thread.id,
                title: thread.title,
            }))}
            onCreateThread={classHubState.createThread}
            threadTitleInput={classHubState.threadTitleInput}
            onThreadTitleChange={classHubState.setThreadTitleInput}
            canCreateThread={classHubState.canManageClass && !!classHubState.selectedClass}
            canManageThreads={classHubState.canManageClass}
            canDeleteClass={classHubState.canManageClass}
            canLeaveClass={!!classHubState.selectedClass}
            onRenameThread={(threadId) => void classHubState.renameThread(threadId)}
            onDeleteThread={(threadId) => void classHubState.removeThread(threadId)}
            onDeleteClass={() => void classHubState.deleteClass()}
            onLeaveClass={() => void classHubState.leaveClass()}
            isCreatingThread={classHubState.isCreatingThread}
            isLoadingMembers={classHubState.isLoadingMembers}
            onEnterThreadChat={openThreadChat}
            inviteCodeDisplayText={undefined}
            inviteCodeValue={undefined}
            onCopyInviteCode={() => undefined}
        />
    );
};

interface MainLayoutPanelProps {
    activeView: ActiveView;
    setActiveView: (view: ActiveView) => void;
    canAccessChat: boolean;
    canAccessProfile: boolean;
    canAccessClassHub: boolean;
    canAccessStudentAssignments: boolean;
    canAccessTeacherAssignments: boolean;
    userProfile: { name?: string | null; avatar?: string | null };
    chatSessions: Parameters<typeof Sidebar>[0]["sessions"];
    classSessionGroups: Parameters<typeof Sidebar>[0]["classGroups"];
    isClassAdmin?: boolean;
    activeClassThreadId?: string;
    currentSessionId: string | null;
    chatMode: ChatMode;
    setChatMode: (mode: ChatMode) => void;
    deleteChatSession: Parameters<typeof Sidebar>[0]["deleteChatSession"];
    handleSelectSession: Parameters<typeof Sidebar>[0]["handleSelectSession"];
    handleStartNewQuest: Parameters<typeof Sidebar>[0]["handleStartNewQuest"];
    handleRenameSession: Parameters<typeof Sidebar>[0]["handleRenameSession"];
    onCreateClassThread?: Parameters<typeof Sidebar>[0]["onCreateClassThread"];
    creatingClassThreadId?: string | null;
    onSelectClassThread?: Parameters<typeof Sidebar>[0]["onSelectClassThread"];
    onRenameClassThread?: Parameters<typeof Sidebar>[0]["onRenameClassThread"];
    onDeleteClassThread?: Parameters<typeof Sidebar>[0]["onDeleteClassThread"];
    onShareSessionToClass?: Parameters<typeof Sidebar>[0]["onShareSessionToClass"];
    onSubmitSessionToAssignment?: Parameters<typeof Sidebar>[0]["onSubmitSessionToAssignment"];
    handleSignOut: () => void;
    isLoadingSessions: boolean;
    messages: Parameters<typeof ChatPanel>[0]["messages"];
    onSendMessage: Parameters<typeof ChatPanel>[0]["onSendMessage"];
    uploadImage: Parameters<typeof ChatPanel>[0]["uploadImage"];
    isTyping: boolean;
    handleStopGeneration: () => void;
    onStartChat: Parameters<typeof HomePanel>[0]["onStartChat"];
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

const MainLayoutPanel = ({
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
}: MainLayoutPanelProps) => {
    const profileState = ProfileUIState();
    const sidebarUser = {
        name: userProfile?.name ?? DEFAULT_PROFILE_NAME,
        avatar: userProfile?.avatar ?? DEFAULT_PROFILE_AVATAR,
    };

    return (
        <MainLayoutView
            activeView={activeView}
            sidebar={
                <Sidebar
                    activeView={activeView}
                    canAccessChat={canAccessChat}
                    canAccessProfile={canAccessProfile}
                    canAccessClassHub={canAccessClassHub}
                    canAccessStudentAssignments={canAccessStudentAssignments}
                    canAccessTeacherAssignments={canAccessTeacherAssignments}
                    setActiveView={setActiveView}
                    userProfile={sidebarUser}
                    sessions={chatSessions}
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
                    <HomePanel
                        onStartChat={onStartChat}
                        mode={chatMode}
                        setMode={setChatMode}
                        userName={sidebarUser.name}
                        uploadImage={uploadImage}
                    />
                ) : undefined
            }
            chat={
                canAccessChat ? (
                    chatTargetType === "class" && classChatTarget ? (
                        <ClassThreadChatPanel
                            threadId={classChatTarget.threadId}
                            className={classChatTarget.className}
                            threadTitle={classChatTarget.threadTitle}
                            currentUserId={classChatTarget.currentUserId}
                            onCopySharedChatToNewSession={onCopySharedClassMessageToNewSession}
                        />
                    ) : (
                        <ChatPanel
                            messages={messages}
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
                        name={profileState.name ?? DEFAULT_PROFILE_NAME}
                        setName={profileState.setName}
                        avatar={profileState.avatarUrl ?? DEFAULT_PROFILE_AVATAR}
                        isEditing={profileState.isEditing}
                        isUploadingAvatar={profileState.isUpdating}
                        setIsEditing={profileState.setIsEditing}
                        handleSave={profileState.handleSave}
                        handleAvatarUpload={profileState.handleAvatarSelect}
                        handleCancel={profileState.handleCancel}
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

const renderAssignmentPanel = (
    panelNode: ReturnType<typeof resolveAssignmentPanelNode>,
    onOpenClassHub: () => void,
) => {
    if (panelNode.kind === "hidden") {
        return undefined;
    }

    if (panelNode.kind === "content") {
        return panelNode.content;
    }

    return (
        <ClassMembershipNoticeView
            title={panelNode.notice.title}
            description={panelNode.notice.description}
            actionLabel={panelNode.notice.actionLabel}
            onAction={onOpenClassHub}
        />
    );
};

const PermissionsConsoleRoute = () => {
    const { data: session } = useSessionQuery();
    const consoleState = AuthConsoleUIState();
    const [searchEmail, setSearchEmail] = useState("");

    const searchResults = useMemo(
        () =>
            consoleState.consoleUsers.filter((user) =>
                searchEmail.trim()
                    ? user.email.toLowerCase().includes(searchEmail.trim().toLowerCase())
                    : true,
            ),
        [consoleState.consoleUsers, searchEmail],
    );

    const permissionRows = PermissionKeyList.map((key) => ({
        key,
        label: key,
        effect: consoleState.permissionEffects[key],
    }));

    const effectivePermissions = PermissionKeyList.filter(
        (key) =>
            consoleState.permissionEffects[key] === "allow" ||
            (consoleState.permissionEffects[key] === "inherit" &&
                ((consoleState.baseRole === "teacher" &&
                    key === "chat.access") ||
                    (consoleState.baseRole === "teacher" &&
                        key === "profile.access") ||
                    (consoleState.baseRole === "teacher" &&
                        key === "assignment.teacher.access") ||
                    (consoleState.baseRole === "student" &&
                        key === "chat.access") ||
                    (consoleState.baseRole === "student" &&
                        key === "profile.access") ||
                    (consoleState.baseRole === "student" &&
                        key === "assignment.student.access"))),
    );

    return (
        <PermissionsConsoleView
            mode="ready"
            requesterEmail={session?.email}
            searchEmail={searchEmail}
            onSearchEmailChange={setSearchEmail}
            onSearch={() => undefined}
            isSearching={false}
            searchResults={searchResults}
            selectedUserId={consoleState.selectedUser?.id}
            selectedUserEmail={consoleState.selectedUser?.email}
            onSelectUser={(userId) => {
                const nextUser = consoleState.consoleUsers.find((user) => user.id === userId) ?? null;
                consoleState.setSelectedUser(nextUser);
                if (nextUser) {
                    void consoleState.selectUser(nextUser);
                }
            }}
            isAccessLoading={consoleState.loadingUserPermission}
            baseRole={consoleState.baseRole}
            onBaseRoleChange={consoleState.setBaseRole}
            permissionRows={permissionRows}
            onPermissionChange={(key, effect) =>
                consoleState.setPermissionMode(key as PermissionKeys, effect as PermissionMode)
            }
            effectivePermissions={effectivePermissions}
            isSaving={false}
            onSave={() => void consoleState.uploadPermission()}
            message={undefined}
        />
    );
};

const AppRoute = () => {
    const appShellState = useAppShellState();
    const authPageState = AuthPageUIState();
    const { state, actions, derived, meta } = appShellState;

    if (meta.isAppLoading) {
        return <AppLoadingView />;
    }

    const classNameById = buildAssignmentClassNameMap(derived.classOptions);
    const openClassHubView = () => actions.setActiveView("classHub");

    const classHubNode = derived.permissions.canAccessClassHub ? (
        <ClassHubPanel {...derived.classHubProps} />
    ) : undefined;

    const submitAssignmentNode = renderAssignmentPanel(
        resolveAssignmentPanelNode({
            canAccess: derived.permissions.canAccessStudentAssignments,
            hasMembership: derived.hasStudentClassMembership,
            notice: derived.classMembershipNotices.submitAssignment,
            content: (
                <SubmitAssignmentPanel
                    assignments={derived.studentAssignments}
                    classNameById={classNameById}
                    isSubmitting={meta.isSubmittingAssignment}
                />
            ),
        }),
        openClassHubView,
    );

    const viewFeedbackNode = renderAssignmentPanel(
        resolveAssignmentPanelNode({
            canAccess: derived.permissions.canAccessStudentAssignments,
            hasMembership: derived.hasStudentClassMembership,
            notice: derived.classMembershipNotices.viewFeedback,
            content: (
                <ViewFeedbackPanel
                    feedbackList={derived.feedbackSummaries}
                    classNameById={classNameById}
                />
            ),
        }),
        openClassHubView,
    );

    const publishAssignmentNode = renderAssignmentPanel(
        resolveAssignmentPanelNode({
            canAccess: derived.permissions.canAccessTeacherAssignments,
            hasMembership: derived.hasTeacherClassMembership,
            notice: derived.classMembershipNotices.publishAssignment,
            content: (
                <PublishAssignmentPanel
                    classOptions={derived.teacherClassOptions}
                    onPublish={actions.handlePublishAssignment}
                />
            ),
        }),
        openClassHubView,
    );

    const gradeAssignmentNode = renderAssignmentPanel(
        resolveAssignmentPanelNode({
            canAccess: derived.permissions.canAccessTeacherAssignments,
            hasMembership: derived.hasTeacherClassMembership,
            notice: derived.classMembershipNotices.gradeAssignment,
            content: (
                <GradeAssignmentPanel
                    teacherClasses={derived.teacherClassOptions}
                    onGenerateGradeDraft={actions.handleGenerateGradeDraft}
                    onSaveGradeReview={actions.handleSaveGradeReview}
                    onReleaseGrade={actions.handleReleaseGrade}
                    isGeneratingDraft={meta.isGeneratingGradeDraft}
                    isSavingReview={meta.isSavingGradeReview}
                    isReleasingGrade={meta.isReleasingGrade}
                    generatingGradeDraftIds={derived.generatingGradeDraftIds}
                />
            ),
        }),
        openClassHubView,
    );

    const mainNode = !state.session ? (
        <AuthGateView
            showAuth={state.showAuth}
            authView={
                <AuthPageView
                    mode={authPageState.mode}
                    toggleSigninMode={authPageState.toggleSigninMode}
                    toggleRegisterMode={authPageState.toggleRegisterMode}
                    email={authPageState.email}
                    setEmail={authPageState.setEmail}
                    password={authPageState.password}
                    setPassword={authPageState.setPassword}
                    isLoading={authPageState.isLoading}
                    showPassword={authPageState.showPassword}
                    toggleShowPassword={authPageState.toggleShowPassword}
                    toggleHidePassword={authPageState.toggleHidePassword}
                    handleSubmit={(event) => {
                        event.preventDefault();
                        void authPageState.handleSubmit();
                    }}
                    handleSocialLogin={() => {
                        void authPageState.handleSocialLogin();
                    }}
                    isVerificationPending={authPageState.isVerificationPending}
                    setIsVerificationPending={authPageState.setIsVerificationPending}
                />
            }
            landingView={
                <LandingPageView
                    onStart={() => actions.setShowAuth(true)}
                    onLogin={() => actions.setShowAuth(true)}
                />
            }
        />
    ) : shouldShowLandingPage(!!state.session, state.activeView) ? (
        <LandingPageView
            onStart={() => actions.setActiveView(derived.fallbackView)}
            onLogin={() => actions.setActiveView(derived.fallbackView)}
        />
    ) : (
        <>
            <MainLayoutPanel
                activeView={state.activeView}
                setActiveView={actions.setActiveView}
                canAccessChat={derived.permissions.canAccessChat}
                canAccessProfile={derived.permissions.canAccessProfile}
                canAccessClassHub={derived.permissions.canAccessClassHub}
                canAccessStudentAssignments={derived.permissions.canAccessStudentAssignments}
                canAccessTeacherAssignments={derived.permissions.canAccessTeacherAssignments}
                userProfile={derived.safeUserProfile}
                chatSessions={derived.chatSessions}
                classSessionGroups={derived.classSessionGroups}
                isClassAdmin={derived.isClassAdmin}
                activeClassThreadId={derived.activeClassThreadId}
                currentSessionId={derived.currentSessionId}
                chatMode={state.chatMode}
                setChatMode={actions.setChatMode}
                deleteChatSession={actions.deleteChatSession}
                handleSelectSession={actions.handleSelectSession}
                handleStartNewQuest={actions.handleStartNewQuest}
                handleRenameSession={actions.handleRenameSession}
                onCreateClassThread={actions.handleCreateClassThread}
                creatingClassThreadId={meta.creatingClassThreadId}
                onSelectClassThread={actions.handleSelectClassThread}
                onRenameClassThread={actions.handleRenameClassThread}
                onDeleteClassThread={actions.handleDeleteClassThread}
                onShareSessionToClass={actions.handleShareChatSessionToClass}
                onSubmitSessionToAssignment={
                    derived.permissions.canAccessStudentAssignments
                        ? actions.handleSubmitChatSessionToAssignment
                        : undefined
                }
                handleSignOut={actions.handleSignOut}
                isLoadingSessions={derived.isLoadingSessions}
                messages={derived.messages}
                onSendMessage={actions.onSendMessage}
                uploadImage={derived.uploadImage}
                isTyping={derived.isTyping}
                handleStopGeneration={actions.handleStopGeneration}
                onStartChat={actions.onStartChat}
                onShareChatMessageToClass={actions.handleShareChatMessageToClass}
                onSubmitChatMessageToAssignment={
                    derived.permissions.canAccessStudentAssignments
                        ? actions.handleSubmitChatMessageToAssignment
                        : undefined
                }
                chatTargetType={derived.chatTargetType}
                classChatTarget={derived.classChatTarget}
                onCopySharedClassMessageToNewSession={
                    actions.handleCopySharedClassMessageToNewSession
                }
                classHub={classHubNode}
                submitAssignment={submitAssignmentNode}
                viewFeedback={viewFeedbackNode}
                publishAssignment={publishAssignmentNode}
                gradeAssignment={gradeAssignmentNode}
            />

            <ClassPickerPopover
                open={!!state.shareIntent}
                title="Share to class thread"
                description={derived.sharePickerDescription}
                classOptions={derived.shareableThreadGroups.map((classItem) => ({
                    id: classItem.classId,
                    name: classItem.className,
                    role: classItem.role,
                    threads: classItem.threads.map((thread) => ({
                        id: thread.id,
                        title: thread.title,
                    })),
                }))}
                isSubmitting={meta.isSharing}
                onSelectThread={({ classId, threadId }) =>
                    actions.handleConfirmThreadShare(classId, threadId)
                }
                onClose={() => actions.setShareIntent(null)}
            />

            <AssignmentSubmitPopover
                open={!!state.submitToAssignmentIntent}
                intentKind={state.submitToAssignmentIntent?.kind ?? null}
                options={derived.submitTargetAssignments.map((assignment) => ({
                    id: assignment.id,
                    title: assignment.title,
                    className: classNameById[assignment.classId],
                    dueAt: assignment.dueAt,
                }))}
                isSubmitting={meta.isSubmittingAssignment}
                onConfirm={(assignmentId, reflectionText) =>
                    void actions.handleConfirmSubmitToAssignment(assignmentId, reflectionText)
                }
                onClose={() => actions.setSubmitToAssignmentIntent(null)}
            />
        </>
    );

    return mainNode;
};

export default function App() {
    return (
        <>
            <Toaster position="top-center" richColors />
            <Routes>
                <Route path="/" element={<AppRoute />} />
                <Route path="/_internal/permissions" element={<PermissionsConsoleRoute />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </>
    );
}
