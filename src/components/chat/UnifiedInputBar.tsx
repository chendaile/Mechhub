import {
    AttachmentUploadUIState,
    type UploadImageHandler,
} from "../../hooks/chat/ui/AttachmentUploadUIState";
import { SendUIState } from "../../hooks/chat/ui/SendUIState";
import { UnifiedInputBarView } from "@views/chat/parts/UnifiedInputBarView";
import type { ChatMode, SubmitMessage } from "@views/chat/types";

interface UnifiedInputBarProps {
    onSendMessage: (payload: SubmitMessage) => void;
    uploadImage: UploadImageHandler;
    mode: ChatMode;
    setMode: (mode: ChatMode) => void;
    model: string;
    setModel: (model: string) => void;
    placeholder?: string;
    isTyping?: boolean;
    onStop?: () => void;
}

export const UnifiedInputBar = ({
    onSendMessage,
    uploadImage,
    mode,
    setMode,
    model,
    setModel,
    placeholder,
    isTyping,
    onStop,
}: UnifiedInputBarProps) => {
    const {
        fileInputRef,
        imageAttachments,
        fileAttachments,
        isUploading,
        uploadedImageUrls,
        handleUploadClick,
        handleFileChange,
        removeImageAttachment,
        removeFileAttachment,
        resetAttachments,
    } = AttachmentUploadUIState({ uploadImage });

    const { inputValue, setInputValue, submitDraft } = SendUIState({
        mode,
        model,
        isUploading,
        uploadedImageUrls,
        fileAttachments,
        resetAttachments,
    });

    const handleSubmit = () => {
        const payload = submitDraft();
        if (payload) {
            onSendMessage(payload);
        }
    };

    return (
        <UnifiedInputBarView
            fileInputRef={fileInputRef}
            imageAttachments={imageAttachments.map((att) => ({
                id: att.id,
                previewUrl: att.previewUrl,
                uploading: att.uploading,
            }))}
            fileAttachments={fileAttachments}
            isUploading={isUploading}
            onUploadClick={handleUploadClick}
            onFileChange={handleFileChange}
            onRemoveImage={removeImageAttachment}
            onRemoveFile={removeFileAttachment}
            inputValue={inputValue}
            onInputChange={setInputValue}
            onSubmit={handleSubmit}
            mode={mode}
            setMode={setMode}
            model={model}
            setModel={setModel}
            placeholder={placeholder}
            isTyping={isTyping}
            onStop={onStop}
        />
    );
};
