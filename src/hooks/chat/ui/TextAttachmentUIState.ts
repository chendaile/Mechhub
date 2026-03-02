import { useState } from "react";
import type { TextAttachment } from "../types";

export const TextAttachmentUIState = () => {
    const [fileAttachments, setFileAttachments] = useState<TextAttachment[]>([]);

    const addAttachment = (attachment: TextAttachment) => {
        setFileAttachments((previous) => [...previous, attachment]);
    };

    const removeAttachment = (filename: string) => {
        setFileAttachments((previous) =>
            previous.filter((attachment) => attachment.filename !== filename),
        );
    };

    const resetAttachments = () => {
        setFileAttachments([]);
    };

    return {
        state: {
            fileAttachments,
        },
        actions: {
            addAttachment,
            removeAttachment,
            resetAttachments,
        },
    };
};
