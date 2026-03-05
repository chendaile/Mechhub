import { useEffect, useMemo, useState } from "react";
import type { Permission } from "../../admin/types";
import { getPermission } from "../../admin/export";
import { getSession } from "../../auth/export";
import type { ClassThread, ClassThreadMessage } from "../types";
import { getMyClass } from "../queries/ClassQueryHooks";
import {
    deleteClass,
    deleteClassThread,
    joinClass,
    leaveClass,
    renameClassThread,
} from "../queries/ClassMutationHooks";
import { classUIState } from "./ClassUIState";
import { ClassThreadChatUIState } from "./ClassThreadChatUIState";
import { SelectedClassUIState } from "./SelectedClassUIState";

const normalizeMessageContent = (content: Record<string, unknown> | null | undefined) => {
    if (!content) {
        return "";
    }
    if (typeof content.content === "string") {
        return content.content;
    }
    if (typeof content.message === "string") {
        return content.message;
    }
    return JSON.stringify(content);
};

const safeCopyToClipboard = async (value: string) => {
    if (!value) {
        return;
    }
    try {
        await navigator.clipboard.writeText(value);
    } catch {
        // ignore clipboard failures
    }
};

export const ClassHubUIState = () => {
    const session = getSession();
    const viewerUserId = session?.userId ?? "";
    const requesterEmail = session?.email;

    const [permission, setPermission] = useState<Permission | null>(null);
    const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
    const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
    const [isCreatingClass, setIsCreatingClass] = useState(false);

    const {
        classActiveView,
        setClassActiveView,
        classInviteCode,
        setClassInviteCode,
        className,
        setClassName,
        classDescription,
        setClassDescription,
        toggleNewClass,
    } = classUIState();

    const myClassQuery = getMyClass();
    const teachingClasses = myClassQuery?.data?.teachingClasses ?? [];
    const joinedClasses = myClassQuery?.data?.joinedClasses ?? [];

    const selectedClassState = SelectedClassUIState(selectedClassId ?? "", classActiveView);
    const threadChatState = ClassThreadChatUIState(selectedThreadId ?? "");

    const classOptions = useMemo(() => {
        const selectedCounts = {
            teachers: selectedClassState.teachers.length,
            students: selectedClassState.students.length,
        };

        const mapClasses = (
            items: { classId: string; className: string }[],
            role: "teacher" | "student",
        ) =>
            items.map((item) => ({
                id: item.classId,
                name: item.className,
                role,
                teacherCount: item.classId === selectedClassId ? selectedCounts.teachers : 0,
                studentCount: item.classId === selectedClassId ? selectedCounts.students : 0,
            }));

        return [...mapClasses(teachingClasses, "teacher"), ...mapClasses(joinedClasses, "student")];
    }, [
        teachingClasses,
        joinedClasses,
        selectedClassId,
        selectedClassState.teachers.length,
        selectedClassState.students.length,
    ]);

    const selectedClass =
        teachingClasses.find((item) => item.classId === selectedClassId) ??
        joinedClasses.find((item) => item.classId === selectedClassId) ??
        null;

    const selectedThread: ClassThread | null =
        selectedClassState.classThreads.find((thread) => thread.threadId === selectedThreadId) ??
        null;

    useEffect(() => {
        if (!selectedClassId && classOptions.length > 0) {
            setSelectedClassId(classOptions[0].id);
        }
    }, [classOptions, selectedClassId]);

    useEffect(() => {
        void (async () => {
            try {
                const nextPermission = await getPermission();
                setPermission(nextPermission);
            } catch {
                setPermission(null);
            }
        })();
    }, []);

    const canCreateClass = !!permission?.["class.new"];
    const canDeleteClass = !!permission?.["class.delete"];
    const canCreateThread = !!permission?.["class.threat.new"];
    const canManageThreads =
        !!permission?.["class.threat.rename"] || !!permission?.["class.threat.delete"];
    const isAdmin = permission?.baseRole === "teacher";
    const canJoinClass = true;
    const canLeaveClass = !!selectedClassId;

    const joinClassMutation = joinClass();
    const leaveClassMutation = leaveClass();

    const handleCreateClass = async () => {
        if (!className.trim()) {
            return;
        }
        setIsCreatingClass(true);
        try {
            await toggleNewClass();
        } finally {
            setIsCreatingClass(false);
        }
    };

    const handleJoinByInviteCode = async () => {
        const invite = classInviteCode.trim();
        if (!invite) {
            return;
        }
        await joinClassMutation?.mutateAsync(invite);
        setClassInviteCode("");
    };

    const handleOpenClassDashboard = (classId: string) => {
        setSelectedClassId(classId);
        setSelectedThreadId(null);
        setClassActiveView("dashboard");
    };

    const handleBackToCollection = () => {
        setClassActiveView("collection");
        setSelectedThreadId(null);
    };

    const handleEnterThreadChat = (threadId: string) => {
        setSelectedThreadId(threadId);
        setClassActiveView("thread");
    };

    const handleDeleteClass = async () => {
        if (!selectedClassId) {
            return;
        }
        const deleteMutation = await deleteClass();
        await deleteMutation?.mutateAsync(selectedClassId);
        setClassActiveView("collection");
    };

    const handleLeaveClass = async () => {
        if (!selectedClassId) {
            return;
        }
        await leaveClassMutation?.mutateAsync(selectedClassId);
        setClassActiveView("collection");
    };

    const handleRenameThread = async (threadId: string) => {
        if (!selectedClassId) {
            return;
        }
        const nextTitle = window.prompt("新的话题名称", "");
        if (!nextTitle?.trim()) {
            return;
        }
        const renameMutation = await renameClassThread();
        await renameMutation?.mutateAsync({
            classId: selectedClassId,
            threadId,
            title: nextTitle.trim(),
        });
    };

    const handleDeleteThread = async (threadId: string) => {
        if (!selectedClassId) {
            return;
        }
        const deleteMutation = await deleteClassThread();
        await deleteMutation?.mutateAsync({ classId: selectedClassId, threadId });
    };

    const classHubProps = {
        requesterEmail,
        isAdmin,
        screen:
            classActiveView === "collection"
                ? ("collection" as const)
                : ("dashboard" as const),
        classOptions,
        selectedClassId: selectedClassId ?? undefined,
        onOpenClassDashboard: handleOpenClassDashboard,
        onBackToCollection: handleBackToCollection,
        canCreateClass,
        canJoinClass,
        createClassName: className,
        onCreateClassNameChange: setClassName,
        createClassDescription: classDescription,
        onCreateClassDescriptionChange: setClassDescription,
        onCreateClass: handleCreateClass,
        isCreatingClass,
        inviteCodeInput: classInviteCode,
        onInviteCodeInputChange: setClassInviteCode,
        onJoinByInviteCode: handleJoinByInviteCode,
        isJoiningClass: joinClassMutation?.isPending ?? false,
        teachers: selectedClassState.teachers.map((teacher) => ({
            userId: teacher.userId,
            name: teacher.name,
            email: teacher.email,
            avatar: teacher.avatar,
            role: "teacher" as const,
        })),
        students: selectedClassState.students.map((student) => ({
            userId: student.userId,
            name: student.name,
            email: student.email,
            avatar: student.avatar,
            role: "student" as const,
        })),
        threads: selectedClassState.classThreads.map((thread) => ({
            id: thread.threadId,
            title: thread.title,
        })),
        onCreateThread: selectedClassState.toggleNewClassThread,
        threadTitleInput: selectedClassState.threadTitle,
        onThreadTitleChange: selectedClassState.setThreadTitle,
        canCreateThread,
        canManageThreads,
        canDeleteClass,
        canLeaveClass,
        onRenameThread: handleRenameThread,
        onDeleteThread: handleDeleteThread,
        onDeleteClass: handleDeleteClass,
        onLeaveClass: handleLeaveClass,
        isCreatingThread: selectedClassState.isCreatingThread,
        isLoadingMembers: selectedClassState.isLoadingMembers,
        onEnterThreadChat: handleEnterThreadChat,
        inviteCodeDisplayText: selectedClass?.inviteCode ?? "",
        inviteCodeValue: selectedClass?.inviteCode ?? "",
        onCopyInviteCode: () => void safeCopyToClipboard(selectedClass?.inviteCode ?? ""),
    };

    const threadMessages = threadChatState.threadMessages.map((message: ClassThreadMessage) => ({
        id: message.id,
        senderUserId: message.senderUserId,
        senderName: message.senderName,
        senderAvatar: message.senderAvatar,
        role: message.role as "user" | "assistant" | "system",
        content: message.content ?? {},
        createdAt: message.createdAt,
    }));

    const threadChatProps = {
        className: selectedClass?.className ?? "班级群聊",
        threadTitle: selectedThread?.title ?? "话题讨论",
        messages: threadMessages,
        currentUserId: viewerUserId,
        isSending: threadChatState.isSending,
        isLoadingMessages: threadChatState.isLoadingMessages,
        renderMessageContent: normalizeMessageContent,
        scrollAnchorRef: threadChatState.scrollAnchorRef,
    };

    return {
        classActiveView,
        classHubProps,
        threadChatProps,
        threadInput: {
            typeMessage: threadChatState.typeMessage,
            setTypeMessage: threadChatState.setTypeMessage,
            sendMessage: threadChatState.sendMessage,
            toggleSendMessage: threadChatState.toggleSendMessage,
            isSending: threadChatState.isSending,
        },
        selectedClassId,
        selectedThreadId,
    };
};
