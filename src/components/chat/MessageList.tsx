import { MessageListUIState } from "../../hooks/chat/ui/MessageListUIState";
import { MessageListView } from "@views/chat/parts/MessageListView";
import type { Message } from "@views/chat/types";
import { GradingResult } from "./message/GradingResult";
import { ImageGradingPanel } from "./message/ImageGradingPanel";
import { TextMessage } from "./message/TextMessage";

interface MessageListProps {
    messages: Message[];
    isTyping: boolean;
    sessionId: string | null;
    onShareToClassMessage?: (messageId: string) => void;
    onSubmitToAssignmentMessage?: (messageId: string) => void;
    showActions?: boolean;
    className?: string;
    contentClassName?: string;
}

export const MessageList = ({
    messages,
    isTyping,
    sessionId,
    onShareToClassMessage,
    onSubmitToAssignmentMessage,
    showActions = true,
    className,
    contentClassName,
}: MessageListProps) => {
    const {
        contentRef,
        messagesEndRef,
        previewImage,
        openPreview,
        closePreview,
        handleScroll,
        messageRenderItems,
    } = MessageListUIState({
        messages,
        isTyping,
        sessionId,
    });

    const items = messageRenderItems.map((item) => {
        if (item.renderKind === "grading" && item.message.gradingResult) {
            return (
                <div key={item.message.id} className="w-full">
                    <GradingResult
                        gradingResult={item.message.gradingResult}
                        reply={item.message.text}
                        reasoning={item.message.reasoning}
                        ocrText={item.message.ocrText}
                        showThinking={item.showThinking}
                        renderImagePanel={(image) => <ImageGradingPanel imageGrading={image} />}
                    />
                </div>
            );
        }

        return (
            <div key={item.message.id} className="w-full">
                <TextMessage
                    messageId={item.message.id}
                    role={item.message.role}
                    text={item.message.text}
                    reasoning={item.message.reasoning}
                    showThinking={item.showThinking}
                    autoOpenThinking={item.shouldAutoOpenThinking}
                    autoScrollThinking={item.shouldAutoOpenThinking}
                    imageUrls={item.message.imageUrls}
                    fileAttachments={item.message.fileAttachments}
                    onImageClick={openPreview}
                    isGenerating={item.isGenerating}
                    onShareToClass={onShareToClassMessage}
                    onSubmitToAssignment={onSubmitToAssignmentMessage}
                    showActions={showActions}
                />
            </div>
        );
    });

    return (
        <MessageListView
            items={items}
            contentRef={contentRef}
            messagesEndRef={messagesEndRef}
            onScroll={handleScroll}
            previewImage={previewImage}
            onClosePreview={closePreview}
            className={className}
            contentClassName={contentClassName}
        />
    );
};
