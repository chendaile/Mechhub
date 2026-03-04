import { useState } from "react";
import { ActiveView } from "../types";
import { assignmentPush, uploadAttachments } from "../queries/assignmentMutation";
import { toast } from "sonner";

export const publishUIState = (activeView: ActiveView) => {
    if (activeView !== "Publish") {
        return null;
    }

    const [assignmentName, setAssignmentName] = useState<string>("");
    const [classId, setClassId] = useState<string>("");
    const [dueDate, setDueDate] = useState<string>("");
    const [dueTime, setDueTime] = useState<string>("");
    const [enableAI, setEnableAI] = useState<boolean>(true);
    const [attachments, setAttachments] = useState<File[]>([]);
    const [instructure, setInstructure] = useState<string>("");

    const togglePublishButton = async () => {
        if (attachments.length === 0) {
            return null;
        }
        const attachmentUrls = await uploadAttachments().mutateAsync(attachments);
        if (!assignmentName) {
            toast.warning("作业名称不能为空");
        }
        if (!classId) {
            toast.warning("需要所属班级");
        }
        const payload = {
            classId,
            dueTime,
            dueDate,
            assignmentName,
            assignmentInstructure: instructure,
            attachmentUrls: attachmentUrls,
            enableAI,
        };
        await assignmentPush().mutateAsync(payload);
    };

    return {
        assignmentName,
        setAssignmentName,
        classId,
        setClassId,
        dueDate,
        setDueDate,
        dueTime,
        setDueTime,
        enableAI,
        setEnableAI,
        attachments,
        setAttachments,
        instructure,
        setInstructure,
        togglePublishButton,
    };
};
