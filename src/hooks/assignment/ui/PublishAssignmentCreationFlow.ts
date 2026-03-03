import { useCallback } from "react";
import { toast } from "sonner";
import {
    uploadAssignmentAttachments,
    type AssignmentAttachment,
    type CreateAssignmentPayload,
    type PublishAssignmentDraft,
} from "../../assignment";
import type { ClassRole } from "../../class/types";

interface UsePublishAssignmentCreationFlowParams {
    classOptions: Array<{
        id: string;
        name: string;
        role: ClassRole;
    }>;
    onCreateAssignment: (payload: CreateAssignmentPayload) => Promise<boolean>;
    onPublished?: () => void;
}

const findTeacherClassById = (
    classOptions: UsePublishAssignmentCreationFlowParams["classOptions"],
    classId: string,
) => classOptions.find((classItem) => classItem.role === "teacher" && classItem.id === classId);

const buildDueAtIsoString = (dueDate: string, dueTime: string) => {
    if (!dueDate) {
        return null;
    }

    const date = dueTime ? new Date(`${dueDate}T${dueTime}`) : new Date(dueDate);

    return Number.isNaN(date.getTime()) ? null : date.toISOString();
};

const tryUploadAttachments = async (files: File[]) => {
    if (files.length === 0) {
        return [] as AssignmentAttachment[];
    }

    try {
        return await uploadAssignmentAttachments(files);
    } catch (error) {
        const message = error instanceof Error ? error.message : "附件上传失败";
        toast.error(message);

        return null;
    }
};

export const PublishAssignmentCreationFlow = ({
    classOptions,
    onCreateAssignment,
    onPublished,
}: UsePublishAssignmentCreationFlowParams) => {
    const handlePublishAssignment = useCallback(
        async (draft: PublishAssignmentDraft) => {
            const targetClass = findTeacherClassById(classOptions, draft.classId);
            if (!targetClass) {
                toast.error("请选择可发布作业的班级");

                return false;
            }

            const dueAt = buildDueAtIsoString(draft.dueDate, draft.dueTime);
            const attachments = await tryUploadAttachments(draft.files);
            if (!attachments) {
                return false;
            }

            const success = await onCreateAssignment({
                classId: targetClass.id,
                title: draft.title,
                instructions: draft.instructions,
                dueAt,
                aiGradingEnabled: draft.aiGradingEnabled,
                status: "published",
                attachments,
            });

            if (success) {
                onPublished?.();
            }

            return success;
        },
        [classOptions, onCreateAssignment, onPublished],
    );

    return {
        handlePublishAssignment,
    };
};
