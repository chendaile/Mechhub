import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getSession } from "../../auth/export";
import { getMyClass } from "../../class/queries/ClassQueryHooks";
import { submitAssignment } from "../queries/assignmentMutation";
import { getAssignment } from "../queries/assignmentQuery";
import { ActiveView } from "../types";

export const submitUIState = (activeView: ActiveView, classId: string) => {
    const { joinedClasses } = getMyClass().data ?? {
        teachingClasses: [],
        joinedClasses: [],
    };
    const assignments = getAssignment(classId).data ?? [];
    const [assignmentId, setAssignmentId] = useState<string>("");
    const [chatId, setChatId] = useState<string>("");
    const [messageIds, setMessageIds] = useState<string[]>([]);
    const [introspection, setIntrospection] = useState<string>("");

    useEffect(() => {
        if (assignments.length === 0) {
            if (assignmentId) {
                setAssignmentId("");
            }

            return;
        }

        const hasActiveAssignment = assignments.some(
            (assignment) => assignment.assignmentId === assignmentId,
        );

        if (!hasActiveAssignment) {
            setAssignmentId(assignments[0].assignmentId);
        }
    }, [assignmentId, assignments]);

    const activeAssignment =
        assignments.find((assignment) => assignment.assignmentId === assignmentId) ?? null;
    const submitAssignmentMutation = submitAssignment();

    const toggleSubmitButton = async () => {
        const session = getSession();

        if (!session) {
            toast.warning("需要先登录");

            return;
        }

        if (!classId) {
            toast.warning("需要所属班级");

            return;
        }

        if (!assignmentId) {
            toast.warning("需要选择作业");

            return;
        }

        if (!chatId) {
            toast.warning("需要提交的聊天记录");

            return;
        }

        await submitAssignmentMutation.mutateAsync({
            classId,
            studentId: session.userId,
            submitTime: new Date().toISOString(),
            chatId,
            messageIds: messageIds.length > 0 ? messageIds : undefined,
            introspection,
        });
    };

    if (activeView !== "Submit") {
        return null;
    }

    return {
        joinedClasses,
        assignments,
        assignmentId,
        setAssignmentId,
        activeAssignment,
        chatId,
        setChatId,
        messageIds,
        setMessageIds,
        introspection,
        setIntrospection,
        toggleSubmitButton,
        isSubmitting: submitAssignmentMutation.isPending,
    };
};
