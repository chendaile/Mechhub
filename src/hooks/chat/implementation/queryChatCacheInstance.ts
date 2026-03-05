import type { QueryClient } from "@tanstack/react-query";
import type { ChatCacheInterface } from "../interface/chatCacheInterface";
import type { Message } from "../types";
import {
    findChatById,
    prependChatSession,
    removeChatSession,
    updateChatMessages,
    updateChatTitle,
    setChatTitleGenerating,
} from "../queries/chatCache";

export const createQueryChatCachePort = (
    queryClient: QueryClient,
    viewerUserId: string | null | undefined,
): ChatCacheInterface => {
    return {
        findChatById: (sessionId: string) => findChatById(queryClient, viewerUserId, sessionId),
        prependChatSession: (session) => prependChatSession(queryClient, viewerUserId, session),
        removeChatSession: (sessionId: string) =>
            removeChatSession(queryClient, viewerUserId, sessionId),
        updateChatTitle: (sessionId: string, title: string) =>
            updateChatTitle(queryClient, viewerUserId, sessionId, title),
        setChatTitleGenerating: (sessionId: string, isGeneratingTitle: boolean) =>
            setChatTitleGenerating(queryClient, viewerUserId, sessionId, isGeneratingTitle),
        updateChatMessages: (sessionId: string, updater: (messages: Message[]) => Message[]) =>
            updateChatMessages(queryClient, viewerUserId, sessionId, updater),
    };
};
