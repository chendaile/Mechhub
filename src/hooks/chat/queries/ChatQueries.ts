import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Message, ChatSession } from "../types";
import { chatInstance } from "../interface/chatInterface";
import { useSessionQuery } from "../../auth/export";
import {
    mergeChatSessions,
    removeChatSession,
    updateChatTitle,
    upsertSavedChatSession,
} from "./chatCache";
import { chatKeys } from "./chatKeys";

export const ChatsQuery = (enabled = true) => {
    const queryClient = useQueryClient();
    const { data: session } = useSessionQuery();
    const viewerUserId = session?.userId ?? null;

    return useQuery({
        queryKey: chatKeys.lists(viewerUserId),
        queryFn: chatInstance.chatQueryUseCases.fetchChats,
        enabled,
        select: (remoteChats) =>
            mergeChatSessions(
                queryClient.getQueryData<ChatSession[]>(chatKeys.lists(viewerUserId)) || [],
                remoteChats || [],
            ),
    });
};

export const SaveChatMutation = () => {
    const queryClient = useQueryClient();
    const { data: session } = useSessionQuery();
    const viewerUserId = session?.userId ?? null;

    return useMutation({
        mutationFn: async ({
            id,
            messages,
            title,
        }: {
            id: string | null;
            messages: Message[];
            title: string;
        }) => {
            return chatInstance.chatQueryUseCases.saveChat(id, messages, title);
        },
        onSuccess: async (savedChat) => {
            upsertSavedChatSession(queryClient, viewerUserId, savedChat);
            await queryClient.invalidateQueries({
                queryKey: chatKeys.lists(viewerUserId),
                refetchType: "inactive",
            });
        },
    });
};

export const DeleteChatMutation = () => {
    const queryClient = useQueryClient();
    const { data: session } = useSessionQuery();
    const viewerUserId = session?.userId ?? null;

    return useMutation({
        mutationFn: chatInstance.chatQueryUseCases.deleteChat,
        onSuccess: async (_, deletedId) => {
            removeChatSession(queryClient, viewerUserId, deletedId);
            await queryClient.invalidateQueries({
                queryKey: chatKeys.lists(viewerUserId),
            });
        },
    });
};

export const RenameChatMutation = () => {
    const queryClient = useQueryClient();
    const { data: session } = useSessionQuery();
    const viewerUserId = session?.userId ?? null;

    return useMutation({
        mutationFn: async ({ id, newTitle }: { id: string; newTitle: string }) => {
            return chatInstance.chatQueryUseCases.renameChat(id, newTitle);
        },
        onSuccess: async (_, { id, newTitle }) => {
            updateChatTitle(queryClient, viewerUserId, id, newTitle);
            await queryClient.invalidateQueries({
                queryKey: chatKeys.lists(viewerUserId),
            });
        },
    });
};

export const GenerateTitleMutation = () => {
    return useMutation({
        mutationFn: async (messages: Message[]) => {
            return chatInstance.chatQueryUseCases.generateTitle(messages);
        },
    });
};
