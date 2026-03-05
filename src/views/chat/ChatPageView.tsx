import { ChatPageUIState } from "@hooks/chat/ui/ChatPageUIState";
import { ChatView } from "./ChatView";
import { HomeView } from "./home/HomeView";
import { MessageList } from "./containers/MessageList";
import { UnifiedInputBar } from "./containers/UnifiedInputBar";
import { ChatInputView } from "./parts/ChatInputView";

type ChatPageViewProps = ReturnType<typeof ChatPageUIState>;

const createChatPageView = ({
    userName,
    messages,
    isTyping,
    currentSessionId,
    chatMode,
    setChatMode,
    model,
    setModel,
    handleSendMessage,
    handleStopGeneration,
    uploadImage,
}: ChatPageViewProps) => {
    const inputBar = (
        <UnifiedInputBar
            onSendMessage={handleSendMessage}
            uploadImage={uploadImage}
            mode={chatMode}
            setMode={setChatMode}
            model={model}
            setModel={setModel}
            placeholder="输入你的问题..."
            isTyping={isTyping}
            onStop={handleStopGeneration}
        />
    );

    const chatInput = <ChatInputView inputBar={inputBar} />;

    if (!currentSessionId && messages.length === 0) {
        return <HomeView userName={userName} inputBar={chatInput} />;
    }

    return (
        <ChatView
            messageList={
                <MessageList
                    messages={messages}
                    isTyping={isTyping}
                    sessionId={currentSessionId}
                />
            }
            chatInput={chatInput}
        />
    );
};

export const ChatPageView = () => {
    const state = ChatPageUIState();
    return createChatPageView(state);
};
