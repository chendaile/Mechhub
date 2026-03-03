import { useState } from "react";
import { toast } from "sonner";
import type { PublishAssignmentDraft, PublishAssignmentUIStateParams } from "../types";

const createDraft = (
    title: string,
    classId: string,
    dueDate: string,
    dueTime: string,
    instructions: string,
    files: File[],
    aiGradingEnabled: boolean,
): PublishAssignmentDraft => ({
    title: title.trim(),
    classId: classId.trim(),
    dueDate,
    dueTime,
    instructions: instructions.trim(),
    files,
    aiGradingEnabled,
});

export const PublishAssignmentUIState = ({ onPublish }: PublishAssignmentUIStateParams) => {
    const [title, setTitle] = useState("");
    const [classId, setClassId] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [dueTime, setDueTime] = useState("");
    const [instructions, setInstructions] = useState("");
    const [aiGradingEnabled, setAiGradingEnabled] = useState(true);
    const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleFileUpload = (file: File) => {
        setAttachedFiles((previousFiles) => [...previousFiles, file]);
    };

    const handleRemoveFile = (index: number) => {
        setAttachedFiles((previousFiles) =>
            previousFiles.filter((_, itemIndex) => itemIndex !== index),
        );
    };

    const resetForm = () => {
        setTitle("");
        setClassId("");
        setDueDate("");
        setDueTime("");
        setInstructions("");
        setAttachedFiles([]);
        setAiGradingEnabled(true);
    };

    const handlePublish = async () => {
        const draft = createDraft(
            title,
            classId,
            dueDate,
            dueTime,
            instructions,
            attachedFiles,
            aiGradingEnabled,
        );

        if (!draft.classId) {
            toast.error("请选择班级");

            return;
        }

        if (!draft.title) {
            toast.error("作业名字不能为空");

            return;
        }

        setIsLoading(true);
        try {
            const didPublish = await onPublish(draft);
            if (didPublish) {
                resetForm();
            }
        } finally {
            setIsLoading(false);
        }
    };

    return {
        title,
        setTitle,
        classId,
        setClassId,
        dueDate,
        setDueDate,
        dueTime,
        setDueTime,
        instructions,
        setInstructions,
        attachedFiles,
        aiGradingEnabled,
        setAiGradingEnabled,
        isLoading,
        handlePublish,
        handleFileUpload,
        handleRemoveFile,
    };
};
