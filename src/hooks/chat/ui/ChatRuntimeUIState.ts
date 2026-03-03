import { useEffect, useMemo, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSessionQuery } from "../../auth/export";
import { createChatMessagingUseCases } from "../interface/chatMessagingUseCases";
import { chatInstance } from "../interface/chatInterface";
import { GenerateTitleMutation, SaveChatMutation } from "../queries/ChatQueries";
import { ChatMessagingUIState } from "./ChatMessagingUIState";

interface UseChatRuntimeStateParams {
    currentSessionId: string | null;
    setCurrentSessionId: (id: string | null) => void;
}

export const ChatRuntimeUIState = ({
    currentSessionId,
    setCurrentSessionId,
}: UseChatRuntimeStateParams) => {
    const queryClient = useQueryClient();
    const { data: session } = useSessionQuery();
    const viewerUserId = session?.userId ?? null;
    const saveChatMutation = SaveChatMutation();
    const generateTitleMutation = GenerateTitleMutation();
    const currentSessionIdRef = useRef<string | null>(null);

    const chatMessagingUseCases = useMemo(() => {
        const cache = chatInstance.createChatCachePort(queryClient, viewerUserId);

        return createChatMessagingUseCases({
            cache,
            aiGateway: chatInstance.aiGateway,
        });
    }, [queryClient, viewerUserId]);

    useEffect(() => {
        currentSessionIdRef.current = currentSessionId;
    }, [currentSessionId]);

    const { typingSessionIds, handleSendMessage, handleStopGeneration } = ChatMessagingUIState({
        currentSessionId,
        currentSessionIdRef,
        setCurrentSessionId,
        chatMessagingUseCases,
        saveChat: (payload) => saveChatMutation.mutateAsync(payload),
        generateTitle: (messages) => generateTitleMutation.mutateAsync(messages),
    });

    return {
        isTyping: !!currentSessionId && typingSessionIds.has(currentSessionId),
        handleSendMessage,
        handleStopGeneration,
    };
};
