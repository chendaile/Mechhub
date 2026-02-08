import React from "react";
import { Message } from "@features/chat/types/message";
import { TextMessage, GradingResultView, ImagePreviewModal } from "./message";
import { useMessageListUiState } from "@hook/chat/ui/useMessageListUiState";

interface MessageListProps {
    messages: Message[];
    isTyping: boolean;
    messagesEndRef: React.RefObject<HTMLDivElement | null>;
    sessionId: string | null;
    isGradingMode?: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({
    messages,
    isTyping,
    messagesEndRef,
    sessionId,
}) => {
    const isThinkingModel = (model?: string) =>
        typeof model === "string" && model.includes("thinking");

    const {
        contentRef,
        previewImage,
        openPreview,
        closePreview,
        handleScroll,
    } = useMessageListUiState({ messages, isTyping, messagesEndRef, sessionId });

    const renderMessage = (msg: Message, index: number) => {
        const isLastMessage = index === messages.length - 1;
        const isGenerating =
            isTyping && isLastMessage && msg.role === "assistant";

        if (msg.gradingResult) {
            return (
                <GradingResultView
                    gradingResult={msg.gradingResult}
                    reply={msg.text}
                    reasoning={msg.reasoning}
                    showThinking={isThinkingModel(msg.model)}
                />
            );
        }
        return (
            <TextMessage
                role={msg.role}
                text={msg.text}
                reasoning={msg.reasoning}
                showThinking={
                    msg.role === "assistant" && isThinkingModel(msg.model)
                }
                imageUrls={msg.imageUrls}
                fileAttachments={msg.fileAttachments}
                onImageClick={openPreview}
                isGenerating={isGenerating}
            />
        );
    };

    return (
        <div
            className="flex-1 overflow-y-auto px-20 py-8 overflow-x-hidden bg-surface-muted"
            style={{ overflowAnchor: "none" }}
            onScroll={handleScroll}
        >
            <div ref={contentRef} className="space-y-6">
                {/* Main Messages */}
                {messages.map((msg, index) => {
                    return (
                        <div key={msg.id} className="w-full">
                            {renderMessage(msg, index)}
                        </div>
                    );
                })}
            </div>

            <div ref={messagesEndRef} className="h-4" />

            <ImagePreviewModal
                previewImage={previewImage}
                onClose={closePreview}
            />
        </div>
    );
};

