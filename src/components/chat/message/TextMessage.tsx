import { TextMessageUIState } from "../../../hooks/chat/ui/TextMessageUIState";
import { TextMessageView } from "@views/chat/message/TextMessageView";
import type { FileAttachment } from "@views/chat/types";

interface TextMessageProps {
    messageId: string;
    role: "user" | "assistant";
    text: string;
    reasoning?: string;
    showThinking?: boolean;
    autoOpenThinking?: boolean;
    autoScrollThinking?: boolean;
    imageUrls?: string[];
    fileAttachments?: FileAttachment[];
    onImageClick: (url: string) => void;
    isGenerating?: boolean;
    onShareToClass?: (messageId: string) => void;
    onSubmitToAssignment?: (messageId: string) => void;
    showActions?: boolean;
}

export const TextMessage = ({
    messageId,
    role,
    text,
    reasoning,
    showThinking,
    autoOpenThinking,
    autoScrollThinking,
    imageUrls,
    fileAttachments,
    onImageClick,
    isGenerating,
    onShareToClass,
    onSubmitToAssignment,
    showActions = true,
}: TextMessageProps) => {
    const {
        isCopied,
        handleCopyText,
        thinkingOpen,
        thinkingContentRef,
        handleToggleThinking,
        isAttachmentExpanded,
        handleToggleAttachment,
    } = TextMessageUIState(text, {
        autoOpenThinking,
        autoScrollThinking,
        reasoning,
    });

    return (
        <TextMessageView
            role={role}
            text={text}
            reasoning={reasoning}
            showThinking={showThinking}
            thinkingOpen={thinkingOpen}
            onToggleThinking={handleToggleThinking}
            thinkingContentRef={thinkingContentRef}
            imageUrls={imageUrls}
            fileAttachments={fileAttachments}
            isAttachmentExpanded={isAttachmentExpanded}
            onToggleAttachment={handleToggleAttachment}
            onImageClick={onImageClick}
            isGenerating={isGenerating}
            isCopied={isCopied}
            onCopy={handleCopyText}
            onShareToClass={onShareToClass ? () => onShareToClass(messageId) : undefined}
            onSubmitToAssignment={
                onSubmitToAssignment ? () => onSubmitToAssignment(messageId) : undefined
            }
            showActions={showActions}
        />
    );
};
