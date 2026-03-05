import { useRef } from "react";
import { toast } from "sonner";
import type { AttachmentNotifier } from "../types";
import {
    AttachmentUploadActionUIState,
    type UploadImageHandler,
} from "./AttachmentUploadActionUIState";
import { ImageAttachmentUIState } from "./ImageAttachmentUIState";
import { TextAttachmentUIState } from "./TextAttachmentUIState";

export type { UploadImageHandler, UploadImageResult } from "./AttachmentUploadActionUIState";

interface UseAttachmentUploadStateParams {
    uploadImage: UploadImageHandler;
    notifier?: AttachmentNotifier;
}

const defaultNotifier: AttachmentNotifier = {
    error: (message: string) => {
        toast.error(message);
    },
};

export const AttachmentUploadUIState = ({
    uploadImage,
    notifier = defaultNotifier,
}: UseAttachmentUploadStateParams) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const imageState = ImageAttachmentUIState();
    const textState = TextAttachmentUIState();

    const flow = AttachmentUploadActionUIState({
        uploadImage,
        imageState,
        textState,
        fileInputRef,
        notifier,
    });

    const resetAttachments = () => {
        imageState.actions.resetAttachments();
        textState.actions.resetAttachments();
    };

    const state = {
        fileInputRef,
        imageAttachments: imageState.state.imageAttachments,
        fileAttachments: textState.state.fileAttachments,
    };

    const actions = {
        handleUploadClick: flow.handleUploadClick,
        handleFileChange: flow.handleFileChange,
        removeImageAttachment: imageState.actions.removeAttachment,
        removeFileAttachment: textState.actions.removeAttachment,
        resetAttachments,
    };

    const derived = {
        isUploading: imageState.derived.isUploading,
        uploadedImageUrls: imageState.derived.uploadedImageUrls,
    };

    return {
        state,
        actions,
        derived,
        fileInputRef: state.fileInputRef,
        imageAttachments: state.imageAttachments,
        fileAttachments: state.fileAttachments,
        isUploading: derived.isUploading,
        uploadedImageUrls: derived.uploadedImageUrls,
        handleUploadClick: actions.handleUploadClick,
        handleFileChange: actions.handleFileChange,
        removeImageAttachment: actions.removeImageAttachment,
        removeFileAttachment: actions.removeFileAttachment,
        resetAttachments: actions.resetAttachments,
    };
};
