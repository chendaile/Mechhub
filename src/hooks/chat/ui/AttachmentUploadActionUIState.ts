import type { ChangeEvent, RefObject } from "react";
import type { AttachmentNotifier } from "../types";
import type { ImageAttachmentUIState } from "./ImageAttachmentUIState";
import type { TextAttachmentUIState } from "./TextAttachmentUIState";

export interface UploadImageResult {
    publicUrl: string;
    storagePath?: string;
}

export type UploadImageHandler = (file: File) => Promise<UploadImageResult>;

type ImageAttachmentState = ReturnType<typeof ImageAttachmentUIState>;
type TextAttachmentState = ReturnType<typeof TextAttachmentUIState>;

interface UseAttachmentUploadActionStateParams {
    uploadImage: UploadImageHandler;
    imageState: ImageAttachmentState;
    textState: TextAttachmentState;
    fileInputRef: RefObject<HTMLInputElement | null>;
    notifier: AttachmentNotifier;
}

const clearInputValue = (fileInputRef: RefObject<HTMLInputElement | null>) => {
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
};

export const AttachmentUploadActionUIState = ({
    uploadImage,
    imageState,
    textState,
    fileInputRef,
    notifier,
}: UseAttachmentUploadActionStateParams) => {
    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const fileList = event.target.files;
        if (!fileList || fileList.length === 0) {
            return;
        }

        const selectedFiles = Array.from(fileList);
        const imagesToUpload: File[] = [];
        const textFilesToRead: File[] = [];

        for (const file of selectedFiles) {
            if (file.type.startsWith("image/")) {
                imagesToUpload.push(file);
                continue;
            }

            if (isTextFile(file.name)) {
                textFilesToRead.push(file);
                continue;
            }

            notifier.error(`不支持的文件类型: ${file.name}`);
        }

        if (imagesToUpload.length > 0) {
            const newImageBytes = imagesToUpload.reduce((total, file) => total + file.size, 0);

            const nextTotalBytes = imageState.derived.totalImageBytes + newImageBytes;

            if (nextTotalBytes > MAX_TOTAL_IMAGE_BYTES) {
                notifier.error("图片总大小不能超过 10MB");
                imagesToUpload.length = 0;
            }
        }

        if (imagesToUpload.length > 0) {
            const pendingAttachments = imageState.actions.addPendingAttachments(imagesToUpload);

            for (const pendingAttachment of pendingAttachments) {
                try {
                    const { publicUrl } = await uploadImage(pendingAttachment.file);
                    imageState.actions.markAttachmentUploaded(pendingAttachment.id, publicUrl);
                } catch (error: unknown) {
                    notifier.error(`图片上传失败: ${toErrorMessage(error, "未知错误")}`);
                    imageState.actions.removeAttachment(pendingAttachment.id);
                }
            }
        }

        if (textFilesToRead.length > 0) {
            for (const file of textFilesToRead) {
                try {
                    const content = await file.text();
                    textState.actions.addAttachment({
                        filename: file.name,
                        content,
                        language: getLanguageFromFilename(file.name),
                    });
                } catch {
                    notifier.error(`读取文件失败: ${file.name}`);
                }
            }
        }

        clearInputValue(fileInputRef);
    };

    return {
        handleUploadClick,
        handleFileChange,
    };
};
