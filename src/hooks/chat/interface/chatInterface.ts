import type { QueryClient } from "@tanstack/react-query";
import { createHttpAIGateway } from "../implementation/httpAIGatewayInstance";
import { createQueryChatCachePort } from "../implementation/queryChatCacheInstance";
import { createHttpChatRepository } from "../implementation/httpChatRepository";
import { createHttpStoragePort } from "../implementation/httpStorageInstance";
import type { ChatCacheInterface } from "./chatCacheInterface";
import { createChatQueryUseCases } from "./createChatQueryUseCases";
import type { ChatQueryUseCases } from "./ChatQueryUseCases";
import type { AIGatewayInterface } from "./aiGatewayInterface";
import type { StorageInterface } from "./storageInterface";

export interface ChatInterface {
    chatQueryUseCases: ChatQueryUseCases;
    aiGateway: AIGatewayInterface;
    storagePort: StorageInterface;
    createChatCachePort(
        queryClient: QueryClient,
        viewerUserId: string | null | undefined,
    ): ChatCacheInterface;
}

export const createChatInstance = (): ChatInterface => {
    const chatRepository = createHttpChatRepository();
    const aiGateway = createHttpAIGateway();
    const storagePort = createHttpStoragePort();

    return {
        chatQueryUseCases: createChatQueryUseCases(chatRepository, aiGateway),
        aiGateway,
        storagePort,
        createChatCachePort: (queryClient, viewerUserId) =>
            createQueryChatCachePort(queryClient, viewerUserId),
    };
};

export const chatInstance = createChatInstance();
