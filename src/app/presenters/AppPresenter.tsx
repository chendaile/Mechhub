import { Toaster } from "sonner";
import {
    resolveAssignmentPanelNode,
    shouldShowLandingPage,
    useAuthPageState,
    useAppShellState,
} from "@hooks";
import { buildAssignmentClassNameMap } from "../../hooks/assignment/ui/AssignmentClassNameMapUIState";
import { AssignmentSubmitPopover } from "@views/assignment";
import { AuthPageView } from "@views/auth/AuthPageView";
import { AppLoadingView } from "@views/layout/AppLoadingView";
import { AuthGateView } from "@views/layout/AuthGateView";
import { ClassMembershipNoticeView, ClassPickerPopover } from "@views/class";
import { ClassHubPresenter } from "./ClassHubPresenter";
import { GradeAssignmentPresenter } from "./GradeAssignmentPresenter";
import { LandingPagePresenter } from "./LandingPagePresenter";
import { MainLayoutPresenter } from "./MainLayoutPresenter";
import { PublishAssignmentPresenter } from "./PublishAssignmentPresenter";
import { SubmitAssignmentPresenter } from "./SubmitAssignmentPresenter";
import { ViewFeedbackPresenter } from "./ViewFeedbackPresenter";

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

export const AppPresenter = () => {
    const appShellState = useAppShellState();
    const authPageState = useAuthPageState();
    const { state, actions, derived, meta } = appShellState;

    if (meta.isAppLoading) {
        return <AppLoadingView />;
    }

    const classNameById = buildAssignmentClassNameMap(derived.classOptions);
    const openClassHubView = () => actions.setActiveView("classHub");

    const classHubNode = derived.permissions.canAccessClassHub ? (
        <ClassHubPresenter {...derived.classHubProps} />
    ) : undefined;

    const submitAssignmentNode = renderAssignmentPanel(
        resolveAssignmentPanelNode({
            canAccess: derived.permissions.canAccessStudentAssignments,
            hasMembership: derived.hasStudentClassMembership,
            notice: derived.classMembershipNotices.submitAssignment,
            content: (
                <SubmitAssignmentPresenter
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
                <ViewFeedbackPresenter
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
                <PublishAssignmentPresenter
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
                <GradeAssignmentPresenter
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
            authView={<AuthPageView {...authPageState} />}
            landingView={
                <LandingPagePresenter
                    onStart={() => actions.setShowAuth(true)}
                    onLogin={() => actions.setShowAuth(true)}
                />
            }
        />
    ) : shouldShowLandingPage(!!state.session, state.activeView) ? (
        <LandingPagePresenter
            onStart={() => actions.setActiveView(derived.fallbackView)}
            onLogin={() => actions.setActiveView(derived.fallbackView)}
        />
    ) : (
        <>
            <MainLayoutPresenter
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

    return (
        <>
            <Toaster position="top-center" richColors />
            {mainNode}
        </>
    );
};
