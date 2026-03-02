import type { Message } from "../types";
import type { AIGatewayInterface } from "./aiGatewayInterface";
import type { ChatRepositoryInterface } from "./chatRepositoryInterface";
import type { ChatQueryUseCases } from "./ChatQueryUseCases";

export const createChatQueryUseCases = (
    chatRepository: ChatRepositoryInterface,
    aiGateway: AIGatewayInterface,
): ChatQueryUseCases => ({
    fetchChats: () => chatRepository.fetchChats(),
    saveChat: (id: string | null, messages: Message[], title: string) =>
        chatRepository.saveChat(id, messages, title),
    deleteChat: (id: string) => chatRepository.deleteChat(id),
    renameChat: (id: string, newTitle: string) => chatRepository.updateChatTitle(id, newTitle),
    generateTitle: (messages: Message[]) => aiGateway.generateTitle(messages),
});
