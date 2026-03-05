import { useMemo } from "react";
import { useSessionQuery } from "../../auth/export";
import { useProfileQuery } from "../../profile/export";
import { chatInstance } from "../interface/chatInterface";
import { ChatSessionsUIState } from "./ChatSessionsUIState";
import { ChatRuntimeUIState } from "./ChatRuntimeUIState";
import { ChatModelUIState } from "./ChatModelUIState";

export const ChatPageUIState = () => {
    const { data: session } = useSessionQuery();
    const { data: profile } = useProfileQuery();
    const {
        chatSessions,
        isLoadingSessions,
        currentSessionId,
        setCurrentSessionId,
        messages,
        chatMode,
        setChatMode,
        handleSelectSession,
        handleStartNewQuest,
        handleClearCurrentSessionSelection,
        deleteChatSession,
        handleRenameSession,
    } = ChatSessionsUIState(session, !!session);
    const { isTyping, handleSendMessage, handleStopGeneration } = ChatRuntimeUIState({
        currentSessionId,
        setCurrentSessionId,
    });
    const { model, setModel } = ChatModelUIState();

    const userName = useMemo(() => {
        return profile?.name ?? session?.email ?? "MechHub";
    }, [profile?.name, session?.email]);

    return {
        userName,
        chatSessions,
        isLoadingSessions,
        currentSessionId,
        messages,
        chatMode,
        setChatMode,
        model,
        setModel,
        isTyping,
        handleSendMessage,
        handleStopGeneration,
        handleSelectSession,
        handleStartNewQuest,
        handleClearCurrentSessionSelection,
        deleteChatSession,
        handleRenameSession,
        uploadImage: chatInstance.storagePort.uploadImage,
    };
};
