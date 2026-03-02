import { useMemo } from "react";
import type { Message } from "../types";
import { ImagePreviewUIState } from "./ImagePreviewUIState";
import { AutoScrollUIState } from "./AutoScrollUIState";
import { ThinkingAutoOpenUIState } from "./ThinkingAutoOpenUIState";
import { TypingNotificationUIState } from "./TypingNotificationUIState";
import { isThinkingModel } from "../implementation/ai/aiPromptBuilder";

interface UseMessageListUiStateProps {
    messages: Message[];
    isTyping: boolean;
    sessionId: string | null;
}

export interface MessageRenderItem {
    message: Message;
    renderKind: "grading" | "text";
    isGenerating: boolean;
    showThinking: boolean;
    shouldAutoOpenThinking: boolean;
}

export const MessageListUIState = ({
    messages,
    isTyping,
    sessionId,
}: UseMessageListUiStateProps) => {
    const { previewImage, openPreview, closePreview } = ImagePreviewUIState();
    const autoScrollState = AutoScrollUIState({
        messages,
        sessionId,
    });

    const thinkingAutoOpenState = ThinkingAutoOpenUIState({
        messages,
        isTyping,
        sessionId,
        scrollToBottom: autoScrollState.actions.scrollToBottom,
    });

    const typingNotificationState = TypingNotificationUIState({
        isTyping,
        contentRef: autoScrollState.state.contentRef,
        scrollToBottom: autoScrollState.actions.scrollToBottom,
    });

    const autoOpenThinkingMessageId = thinkingAutoOpenState.state.autoOpenThinkingMessageId;

    const messageRenderItems = useMemo<MessageRenderItem[]>(
        () =>
            messages.map((message, index) => {
                const isLastMessage = index === messages.length - 1;
                const isGenerating = isTyping && isLastMessage && message.role === "assistant";

                const shouldAutoOpenThinking =
                    message.id === autoOpenThinkingMessageId &&
                    message.role === "assistant" &&
                    message.mode === "study";
                const modelUsesThinking = isThinkingModel(message.model);

                return {
                    message,
                    renderKind: message.gradingResult ? "grading" : "text",
                    isGenerating,
                    showThinking: message.gradingResult
                        ? modelUsesThinking
                        : message.role === "assistant" && modelUsesThinking,
                    shouldAutoOpenThinking,
                };
            }),
        [autoOpenThinkingMessageId, isTyping, messages],
    );

    return {
        contentRef: autoScrollState.state.contentRef,
        messagesEndRef: autoScrollState.state.messagesEndRef,
        previewImage,
        openPreview,
        closePreview,
        handleScroll: typingNotificationState.actions.handleScroll,
        autoOpenThinkingMessageId,
        messageRenderItems,
    };
};
