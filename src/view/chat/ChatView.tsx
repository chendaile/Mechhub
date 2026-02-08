import React, { useRef, useState } from "react";
import { ChatInput } from "./components/ChatInput";
import { MessageList } from "./components/MessageList";
import { Message, SubmitMessage } from "@features/chat/types/message";
import { ChatMode } from "@features/chat/types/message";
import type { UploadImageHandler } from "@hook/chat/ui/useAttachmentUploadState";

export type { Message };

interface ChatInterfaceProps {
    messages: Message[];
    onSendMessage: (submitMessage: SubmitMessage) => void;
    uploadImage: UploadImageHandler;
    onStop?: () => void;
    isTyping: boolean;
    mode: ChatMode;
    setMode: (mode: ChatMode) => void;
    sessionId: string | null;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
    messages,
    onSendMessage,
    uploadImage,
    onStop,
    isTyping,
    mode,
    setMode,
    sessionId,
}) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [model, setModel] = useState("qwen3-vl-235b-a22b-thinking");

    const lastMessage = messages[messages.length - 1];
    const hasGradingResult = lastMessage?.gradingResult !== undefined;
    const isGradingMode = mode === "correct" && hasGradingResult;

    return (
        <div className="absolute inset-0 z-0 flex flex-col bg-white">
            <MessageList
                messages={messages}
                isTyping={isTyping}
                messagesEndRef={messagesEndRef}
                sessionId={sessionId}
                isGradingMode={isGradingMode}
            />

            <ChatInput
                onSendMessage={onSendMessage}
                uploadImage={uploadImage}
                mode={mode}
                setMode={setMode}
                model={model}
                setModel={setModel}
                isTyping={isTyping}
                onStop={onStop}
            />
        </div>
    );
};

