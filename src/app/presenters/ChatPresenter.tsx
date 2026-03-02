import { useChatModelState } from "@hooks";
import { ChatView } from "@views/chat/ChatView";
import { ChatInputView } from "@views/chat/parts/ChatInputView";
import { MessageListPresenter } from "./MessageListPresenter";
import { UnifiedInputBarPresenter } from "./UnifiedInputBarPresenter";
import type { ChatMode, Message, SubmitMessage, UploadImageHandler } from "@views/chat/types";

interface ChatPresenterProps {
    messages: Message[];
    isTyping: boolean;
    sessionId: string | null;
    onSendMessage: (payload: SubmitMessage) => void;
    uploadImage: UploadImageHandler;
    mode: ChatMode;
    setMode: (mode: ChatMode) => void;
    onStop?: () => void;
    onShareToClassMessage?: (messageId: string) => void;
    onSubmitToAssignmentMessage?: (messageId: string) => void;
}

export const ChatPresenter = ({
    messages,
    isTyping,
    sessionId,
    onSendMessage,
    uploadImage,
    mode,
    setMode,
    onStop,
    onShareToClassMessage,
    onSubmitToAssignmentMessage,
}: ChatPresenterProps) => {
    const { model, setModel } = useChatModelState();

    return (
        <ChatView
            messageList={
                <MessageListPresenter
                    messages={messages}
                    isTyping={isTyping}
                    sessionId={sessionId}
                    onShareToClassMessage={onShareToClassMessage}
                    onSubmitToAssignmentMessage={onSubmitToAssignmentMessage}
                />
            }
            chatInput={
                <ChatInputView
                    inputBar={
                        <UnifiedInputBarPresenter
                            onSendMessage={onSendMessage}
                            uploadImage={uploadImage}
                            mode={mode}
                            setMode={setMode}
                            model={model}
                            setModel={setModel}
                            isTyping={isTyping}
                            onStop={onStop}
                        />
                    }
                />
            }
        />
    );
};
