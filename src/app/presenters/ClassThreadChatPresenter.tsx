import { useState } from "react";
import { toast } from "sonner";
import { chatUseCases, useClassThreadChatState, useChatModelState, type ChatMode } from "@hooks";
import { ClassThreadChatView } from "@views/class";
import { UnifiedInputBarPresenter } from "./UnifiedInputBarPresenter";

interface ClassThreadChatPresenterProps {
    threadId: string;
    className: string;
    threadTitle: string;
    currentUserId: string;
    onCopySharedChatToNewSession?: (content: Record<string, unknown>) => void;
}

export const ClassThreadChatPresenter = ({
    threadId,
    className,
    threadTitle,
    currentUserId,
    onCopySharedChatToNewSession,
}: ClassThreadChatPresenterProps) => {
    const classThreadChatState = useClassThreadChatState(threadId);
    const [mode, setMode] = useState<ChatMode>("study");
    const { model, setModel } = useChatModelState();
    const handleSetMode = (nextMode: ChatMode) => {
        if (nextMode === "correct") {
            toast.warning("班级群聊不支持批改模式");
            setMode("study");

            return;
        }
        setMode(nextMode);
    };

    return (
        <ClassThreadChatView
            className={className}
            threadTitle={threadTitle}
            messages={classThreadChatState.state.messages}
            currentUserId={currentUserId}
            isSending={classThreadChatState.meta.isSending}
            isLoadingMessages={classThreadChatState.meta.isLoadingMessages}
            renderMessageContent={classThreadChatState.derived.renderMessageContent}
            scrollAnchorRef={classThreadChatState.state.scrollAnchorRef}
            inputBar={
                <UnifiedInputBarPresenter
                    onSendMessage={classThreadChatState.actions.handleSendDraft}
                    uploadImage={chatUseCases.storagePort.uploadImage}
                    mode={mode}
                    setMode={handleSetMode}
                    model={model}
                    setModel={setModel}
                    placeholder="输入消息，使用 @ai 才会触发 AI 助教"
                    isTyping={classThreadChatState.meta.isSending}
                />
            }
            onCopySharedChatToNewSession={onCopySharedChatToNewSession}
        />
    );
};
