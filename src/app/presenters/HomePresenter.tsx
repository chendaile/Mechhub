import { useChatModelState } from "@hooks";
import { UnifiedInputBarPresenter } from "./UnifiedInputBarPresenter";
import { HomeView } from "@views/home/HomeView";
import type { ChatMode, SubmitMessage, UploadImageHandler } from "@views/chat/types";

interface HomePresenterProps {
    onStartChat: (
        message?: string,
        imageUrls?: string[],
        fileAttachments?: SubmitMessage["fileAttachments"],
        model?: string,
        mode?: ChatMode,
    ) => void;
    mode: ChatMode;
    setMode: (mode: ChatMode) => void;
    userName: string;
    uploadImage: UploadImageHandler;
}

export const HomePresenter = ({
    onStartChat,
    mode,
    setMode,
    userName,
    uploadImage,
}: HomePresenterProps) => {
    const { model, setModel } = useChatModelState();

    const handleSendMessage = (payload: SubmitMessage) => {
        onStartChat(
            payload.text,
            payload.imageUrls,
            payload.fileAttachments,
            payload.model,
            payload.mode,
        );
    };

    return (
        <HomeView
            userName={userName}
            inputBar={
                <UnifiedInputBarPresenter
                    onSendMessage={handleSendMessage}
                    uploadImage={uploadImage}
                    mode={mode}
                    setMode={setMode}
                    model={model}
                    setModel={setModel}
                />
            }
        />
    );
};
