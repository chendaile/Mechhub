import { ClassHubView } from "@views/class";
import { useClassHubState } from "@hooks";

interface ClassHubPresenterProps {
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

export const ClassHubPresenter = ({
    requesterEmail,
    canCreateClass,
    canJoinClass,
    selectedClassId,
    onSelectedClassIdChange,
    onEnterClassChat,
}: ClassHubPresenterProps) => {
    const {
        screen,
        setScreen,
        isAdmin,
        classOptions,
        createClassName,
        setCreateClassName,
        createClassDescription,
        setCreateClassDescription,
        handleCreateClass,
        isCreatingClass,
        inviteCodeInput,
        setInviteCodeInput,
        handleJoinByInviteCode,
        isJoiningClass,
        teachers,
        students,
        threads,
        handleCreateThread,
        threadTitleInput,
        setThreadTitleInput,
        canCreateThread,
        canManageThreads,
        canDeleteClass,
        canLeaveClass,
        handleRenameThread,
        handleDeleteThread,
        handleDeleteClass,
        handleLeaveClass,
        isCreatingThread,
        isLoadingMembers,
        openThreadChat,
        inviteCodeDisplayText,
        inviteCodeValue,
        handleCopyInviteCode,
    } = useClassHubState({
        onEnterClassChat,
    });

    return (
        <ClassHubView
            requesterEmail={requesterEmail}
            isAdmin={isAdmin}
            screen={screen}
            classOptions={classOptions}
            selectedClassId={selectedClassId ?? undefined}
            onOpenClassDashboard={(classId) => {
                onSelectedClassIdChange(classId);
                setScreen("dashboard");
            }}
            onBackToCollection={() => setScreen("collection")}
            canCreateClass={canCreateClass}
            canJoinClass={canJoinClass}
            createClassName={createClassName}
            onCreateClassNameChange={setCreateClassName}
            createClassDescription={createClassDescription}
            onCreateClassDescriptionChange={setCreateClassDescription}
            onCreateClass={handleCreateClass}
            isCreatingClass={isCreatingClass}
            inviteCodeInput={inviteCodeInput}
            onInviteCodeInputChange={setInviteCodeInput}
            onJoinByInviteCode={handleJoinByInviteCode}
            isJoiningClass={isJoiningClass}
            teachers={teachers}
            students={students}
            threads={threads.map((thread) => ({
                id: thread.id,
                title: thread.title,
            }))}
            onCreateThread={handleCreateThread}
            threadTitleInput={threadTitleInput}
            onThreadTitleChange={setThreadTitleInput}
            canCreateThread={canCreateThread}
            canManageThreads={canManageThreads}
            canDeleteClass={canDeleteClass}
            canLeaveClass={canLeaveClass}
            onRenameThread={handleRenameThread}
            onDeleteThread={handleDeleteThread}
            onDeleteClass={handleDeleteClass}
            onLeaveClass={handleLeaveClass}
            isCreatingThread={isCreatingThread}
            isLoadingMembers={isLoadingMembers}
            onEnterThreadChat={openThreadChat}
            inviteCodeDisplayText={inviteCodeDisplayText}
            inviteCodeValue={inviteCodeValue ?? undefined}
            onCopyInviteCode={handleCopyInviteCode}
        />
    );
};
