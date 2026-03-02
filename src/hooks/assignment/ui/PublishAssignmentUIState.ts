import { useState } from "react";
import type { PublishAssignmentPayload } from "../types";
import { toast } from "sonner";
import { assignmentInstance } from "../interface/assignmentInterface";

export const PublishAssignmentUIState = ({}) => {
    const [title, setTitle] = useState("");
    const [className, setClassName] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [dueTime, setDueTime] = useState("");
    const [instructions, setInstructions] = useState("");
    const [aiGradingEnabled, setAiGradingEnabled] = useState(true);
    const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    const addFile = (file: File) => {
        setAttachedFiles((previousFiles) => [...previousFiles, file]);
    };

    const removeFile = (index: number) => {
        setAttachedFiles((previousFiles) =>
            previousFiles.filter((_, itemIndex) => itemIndex !== index),
        );
    };

    const handlePublish = async () => {
        if (!className) {
            toast.error("班级名字不能为空");
            return;
        }
        if (!title.trim()) {
            toast.error("作业名字不能为空");
            return;
        }

        try {
            setIsUploading(true);
            const payload: PublishAssignmentPayload = {
                title: title.trim(),
                className: className.trim(),
                dueDate,
                dueTime,
                instructions: instructions.trim(),
                attachedFiles,
                aiGradingEnabled,
            };
            await assignmentInstance.handlePublish(payload);
        } finally {
            setIsUploading(false);
        }
    };

    return {
        title,
        setTitle,
        className,
        setClassName,
        dueDate,
        setDueDate,
        dueTime,
        setDueTime,
        instructions,
        setInstructions,
        attachedFiles,
        aiGradingEnabled,
        setAiGradingEnabled,
        isUploading,
        handlePublish,
        addFile,
        removeFile,
    };
};
