import type { ChatRepositoryInterface } from "../interface/chatRepositoryInterface";
import type { ChatSession, Message } from "../types";
import { httpClient } from "../../shared/httpClient";

export const createHttpChatRepository = (): ChatRepositoryInterface => {
    return {
        async fetchChats(): Promise<ChatSession[]> {
            return httpClient.get<ChatSession[]>("/chat/sessions");
        },
        async saveChat(id: string | null, messages: Message[], title: string): Promise<ChatSession> {
            return httpClient.post<ChatSession>("/chat/sessions", {
                id,
                messages,
                title,
            });
        },
        async updateChatTitle(id: string, newTitle: string): Promise<void> {
            await httpClient.patch(`/chat/sessions/${id}/title`, { title: newTitle });
        },
        async deleteChat(id: string): Promise<void> {
            await httpClient.del(`/chat/sessions/${id}`);
        },
    };
};
