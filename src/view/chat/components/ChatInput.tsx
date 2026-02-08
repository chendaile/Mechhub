import React from "react";
import { UnifiedInputBar } from "./UnifiedInputBar";
import { ChatMode, SubmitMessage } from "@features/chat/types/message";
import type { UploadImageHandler } from "@hook/chat/ui/useAttachmentUploadState";

interface ChatInputProps {
    onSendMessage: (payload: SubmitMessage) => void;
    uploadImage: UploadImageHandler;
    mode: ChatMode;
    setMode: (mode: ChatMode) => void;
    model: string;
    setModel: (model: string) => void;

    isTyping: boolean;
    onStop?: () => void;
}

export const ChatInput = ({
    onSendMessage,
    uploadImage,
    mode,
    setMode,
    model,
    setModel,

    isTyping,
    onStop,
}: ChatInputProps) => {
    return (
        <div className="z-20 w-full bg-fill-muted p-4">
            <UnifiedInputBar
                onSendMessage={onSendMessage}
                uploadImage={uploadImage}
                mode={mode}
                setMode={setMode}
                model={model}
                setModel={setModel}
                isTyping={isTyping}
                onStop={onStop}
            />
            <div className="text-center mt-3 text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                AI can make mistakes.
            </div>
        </div>
    );
};

