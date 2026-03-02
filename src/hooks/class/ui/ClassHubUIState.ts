import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getPermission } from "../../authz/export";
import {
    ClassMembersQuery,
    ClassThreadsQuery,
    MyClassContextQuery,
} from "../queries/ClassQueryHooks";
import {
    CreateClassMutation,
    CreateGroupThreadMutation,
    DeleteClassMutation,
    DeleteClassThreadMutation,
    JoinClassByInviteCodeMutation,
    LeaveClassMutation,
    RenameClassThreadMutation,
} from "../queries/ClassMutationHooks";
import type { ClassActiveView } from "../types";

export const MyClassUIState = () => {
    // State
    const [activeView, setActiveView] = useState<ClassActiveView>("collection");
    const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
    const [createClassName, setCreateClassName] = useState("");
    const [createClassDescription, setCreateClassDescription] = useState("");
    const [joinInviteCode, setJoinInviteCode] = useState("");
    const [threadTitleInput, setThreadTitleInput] = useState("");

    // Queries
    const classContextQuery = MyClassContextQuery();
    const createClassMutation = CreateClassMutation();
    const joinClassMutation = JoinClassByInviteCodeMutation();
    const createGroupThreadMutation = CreateGroupThreadMutation();
    const renameClassThreadMutation = RenameClassThreadMutation();
    const deleteClassThreadMutation = DeleteClassThreadMutation();
    const deleteClassMutation = DeleteClassMutation();
    const leaveClassMutation = LeaveClassMutation();
    const permission = getPermission();
    const canManageClass = permission["assignment.teacher.access"] === "allow";

    const classContext = classContextQuery?.data;
    const teachingClasses = classContext?.teachingClasses ?? [];
    const joinedClasses = classContext?.joinedClasses ?? [];
    const myClasses = [...teachingClasses, ...joinedClasses];
    const selectedClass = myClasses.find((item) => item.classId === selectedClassId) ?? null;

    const classMembersQuery = ClassMembersQuery(selectedClassId);
    const classThreadsQuery = ClassThreadsQuery(selectedClassId);

    const classMembers = classMembersQuery?.data;
    const selectedThreads = classThreadsQuery?.data ?? [];
    const teachers = classMembers?.teachers ?? [];
    const students = classMembers?.students ?? [];
    const isLoadingMembers = classMembersQuery?.isLoading ?? false;
    const isCreatingThread = createGroupThreadMutation?.isPending ?? false;
    const isRenamingThread = renameClassThreadMutation?.isPending ?? false;
    const isRemovingThread = deleteClassThreadMutation?.isPending ?? false;
    const isDeletingClass = deleteClassMutation?.isPending ?? false;
    const isLeavingClass = leaveClassMutation?.isPending ?? false;
    const isCreatingClass = createClassMutation?.isPending ?? false;
    const isJoiningClass = joinClassMutation?.isPending ?? false;

    useEffect(() => {
        setThreadTitleInput("");
    }, [selectedClassId]);

    // Actions
    const openClassDashboard = (classId: string) => {
        setSelectedClassId(classId);
        setActiveView("dashboard");
    };

    const backToCollection = () => {
        setSelectedClassId(null);
        setActiveView("collection");
    };

    const createClass = async () => {
        if (!canManageClass) {
            toast.error("只有教师可以创建班级。");

            return;
        }

        const normalizedName = createClassName.trim();
        if (!normalizedName) {
            toast.error("请输入班级名称");
            return;
        }

        if (!createClassMutation) {
            toast.error("请先登录后再创建班级。");
            return;
        }

        const createdClass = await createClassMutation.mutateAsync({
            name: normalizedName,
            description: createClassDescription.trim(),
        });

        openClassDashboard(createdClass.classId);
        setCreateClassName("");
        setCreateClassDescription("");
    };

    const joinClass = async () => {
        const normalizedInviteCode = joinInviteCode.trim();
        if (!normalizedInviteCode) {
            toast.error("请输入邀请码");

            return;
        }

        if (!joinClassMutation) {
            toast.error("请先登录后再加入班级。");

            return;
        }

        const result = await joinClassMutation.mutateAsync(normalizedInviteCode);
        const joinedClassId = result.classId;

        openClassDashboard(joinedClassId);
        setJoinInviteCode("");
    };

    const createThread = async () => {
        if (!selectedClass || !canManageClass) {
            toast.error("只有教师可以创建话题。");

            return;
        }

        if (!createGroupThreadMutation) {
            toast.error("请先登录后再创建话题。");

            return;
        }

        const normalizedTitle = threadTitleInput.trim();
        if (!normalizedTitle) {
            toast.error("请输入话题名称");

            return;
        }

        if (normalizedTitle.length > 20) {
            toast.error("话题名称最多 20 个字符。");

            return;
        }

        await createGroupThreadMutation.mutateAsync({
            classId: selectedClass.classId,
            title: normalizedTitle,
        });

        setThreadTitleInput("");
    };

    const renameThread = async (threadId: string) => {
        if (!selectedClass || !canManageClass || !renameClassThreadMutation) {
            return;
        }

        const thread = selectedThreads?.find((item) => item.id === threadId);
        if (!thread) {
            toast.error("未找到对应话题。");

            return;
        }

        const nextTitle = window.prompt("请输入新的话题名称", thread.title);
        if (nextTitle === null) {
            return;
        }

        const normalizedTitle = nextTitle.trim();
        if (!normalizedTitle) {
            toast.error("请输入有效的话题名称。");

            return;
        }

        if (normalizedTitle.length > 20) {
            toast.error("话题名称最多 20 个字符。");

            return;
        }

        if (normalizedTitle === thread.title) {
            return;
        }

        await renameClassThreadMutation.mutateAsync({
            classId: selectedClass.classId,
            threadId,
            title: normalizedTitle,
        });
    };

    const removeThread = async (threadId: string) => {
        if (!selectedClass || !canManageClass || !deleteClassThreadMutation) {
            return;
        }

        const thread = selectedThreads?.find((item) => item.id === threadId);
        if (!thread) {
            toast.error("未找到对应话题。");

            return;
        }

        const confirmed = window.confirm(`确认删除话题「${thread.title}」吗？该操作不可恢复。`);
        if (!confirmed) {
            return;
        }

        await deleteClassThreadMutation.mutateAsync({
            classId: selectedClass.classId,
            threadId,
        });
    };

    const deleteClass = async () => {
        if (!selectedClass || !canManageClass) {
            toast.error("只有老师可以删除班级。");

            return;
        }

        if (!deleteClassMutation) {
            toast.error("删除班级功能不可用。");

            return;
        }

        const confirmed = window.confirm(
            `确认删除班级「${selectedClass.className}」吗？该操作不可恢复。`,
        );
        if (!confirmed) {
            return;
        }

        try {
            await deleteClassMutation.mutateAsync(selectedClass.classId);
            backToCollection();
        } catch {}
    };

    const leaveClass = async () => {
        if (!selectedClass) {
            toast.error("无法退出当前班级。");

            return;
        }

        if (!leaveClassMutation) {
            toast.error("退出班级功能不可用。");

            return;
        }

        const confirmed = window.confirm(`确认退出班级「${selectedClass.className}」吗？`);
        if (!confirmed) {
            return;
        }

        await leaveClassMutation.mutateAsync(selectedClass.classId);
        backToCollection();
    };

    return {
        // View
        activeView,
        setActiveView,
        selectedClassId,
        setSelectedClassId,
        openClassDashboard,
        backToCollection,

        // Data
        myClasses,
        selectedClass,
        teachers,
        students,
        isLoadingMembers,
        selectedThreads,

        // Thread state and actions
        threadTitleInput,
        setThreadTitleInput,
        createThread,
        renameThread,
        removeThread,
        isCreatingThread,
        isRenamingThread,
        isRemovingThread,

        // Class actions
        canManageClass,
        deleteClass,
        leaveClass,
        isDeletingClass,
        isLeavingClass,

        // Create class form
        createClassName,
        setCreateClassName,
        createClassDescription,
        setCreateClassDescription,
        createClass,
        isCreatingClass,

        // Join class form
        joinInviteCode,
        setJoinInviteCode,
        joinClass,
        isJoiningClass,
    };
};
