import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getSession } from "../../auth/export";
import { useProfileQuery } from "../../profile/export";
import { classInstance } from "../interface/classInterface";
import { getPermission } from "../../admin/export";
import type {
    ClassThreadMessage,
    PostClassMessagePayload,
    PostClassMessageContext,
    ClassThread,
    Class,
    CreateClassPayload,
    RenameClassThreadPayload,
    DeleteClassThreadPayload,
} from "../types";
import { classKeys } from "./classKeys";

export const createClass = async () => {
    const session = getSession();
    if (!session) {
        return;
    }
    const permission = await getPermission();
    if (!permission["class.new"]) {
        toast.error("权限不足");
        return;
    }
    return useMutation<Class, Error, CreateClassPayload>({
        mutationFn: (payload) => classInstance.createClass(payload),
        onSuccess: async () => {
            toast.success("班级创建成功");
            const client = useQueryClient();
            client.cancelQueries({ queryKey: classKeys.myClasses(session.userId) });
        },
        onError: (error) => {
            toast.error(error.message || "创建班级失败");
        },
    });
};

export const deleteClass = async () => {
    const session = getSession();
    if (!session) {
        return;
    }
    const permission = await getPermission();
    if (!permission["class.delete"]) {
        toast.error("权限不足");
        return;
    }

    return useMutation({
        mutationFn: (classId: string) => classInstance.deleteClass(classId),
        onSuccess: async () => {
            toast.success("班级已删除");
        },
        onError: (error) => {
            toast.error(error.message || "删除班级失败");
        },
    });
};

export const leaveClass = () => {
    const session = getSession();
    if (!session) {
        return;
    }

    return useMutation({
        mutationFn: (classId: string) => classInstance.leaveClass(classId),
        onSuccess: async () => {
            toast.success("已退出班级");
        },
        onError: (error) => {
            toast.error(error.message || "退出班级失败");
        },
    });
};

export const joinClass = () => {
    const session = getSession();
    if (!session) {
        return;
    }

    return useMutation<Class, Error, string>({
        mutationFn: (inviteCode) => classInstance.joinClass(inviteCode),
        onSuccess: async () => {
            toast.success("加入班级成功");
        },
        onError: (error) => {
            toast.error(error.message || "加入班级失败");
        },
    });
};

export const createClassThread = async () => {
    const session = getSession();
    if (!session) {
        return;
    }
    const permission = await getPermission();
    if (!permission["class.threat.new"]) {
        toast.error("权限不足");
        return;
    }
    return useMutation<ClassThread, Error, { classId: string; title: string }>({
        mutationFn: (payload) => classInstance.createClassThread(payload.classId, payload.title),
        onSuccess: async () => {
            toast.success("话题已创建");
        },
        onError: (error) => {
            toast.error(error.message || "创建话题失败");
        },
    });
};

export const renameClassThread = async () => {
    const session = getSession();
    if (!session) {
        return;
    }
    const permission = await getPermission();
    if (!permission["class.threat.rename"]) {
        toast.error("权限不足");
        return;
    }

    return useMutation({
        mutationFn: (payload: RenameClassThreadPayload) => classInstance.renameClassThread(payload),
        onSuccess: async () => {
            toast.success("话题已重命名");
        },
        onError: (error) => {
            toast.error(error.message || "重命名话题失败");
        },
    });
};

export const deleteClassThread = async () => {
    const session = getSession();
    if (!session) {
        return;
    }
    const permission = await getPermission();
    if (!permission["class.threat.delete"]) {
        toast.error("权限不足");
        return;
    }

    return useMutation({
        mutationFn: (payload: DeleteClassThreadPayload) => classInstance.deleteClassThread(payload),
        onSuccess: async () => {
            toast.success("话题已删除");
        },
        onError: (error) => {
            toast.error(error.message || "删除话题失败");
        },
    });
};

export const postClassMessage = () => {
    const session = getSession();
    if (!session) {
        return;
    }
    const queryClient = useQueryClient();
    const viewerUserId = session.userId;
    const { data: profile } = useProfileQuery();
    const viewerAvatar = profile?.avatarUrl ?? "";
    const viewerName = profile?.name ?? "";

    return useMutation<
        ClassThreadMessage[],
        Error,
        PostClassMessagePayload,
        PostClassMessageContext
    >({
        mutationFn: (payload) => classInstance.postClassMessage(payload),
        onMutate: async (payload) => {
            const queryKey = classKeys.threadMessages(viewerUserId, payload.threadId);
            await queryClient.cancelQueries({ queryKey });
            const previousMessages = queryClient.getQueryData<ClassThreadMessage[]>(queryKey) ?? [];
            const isMentionAi = !!payload.content && /@ai\b/i.test(payload.content);
            const isSharing = !!payload.chatId;
            const now = new Date().toISOString();

            const optimisticMessages = isSharing
                ? [
                      ...previousMessages,
                      {
                          id: "optimistic-" + now,
                          threadId: payload.threadId,
                          senderUserId: viewerUserId,
                          senderName: viewerName,
                          senderEmail: session.email,
                          senderAvatar: viewerAvatar,
                          role: "user",
                          content: { kind: "share", content: payload.chatId },
                          isMentionAi,
                          createdAt: now,
                      },
                  ]
                : [
                      ...previousMessages,
                      {
                          id: "optimistic-" + now,
                          threadId: payload.threadId,
                          senderUserId: viewerUserId,
                          senderName: viewerName,
                          senderEmail: session.email,
                          senderAvatar: viewerAvatar,
                          role: "user",
                          content: { kind: "text", content: payload.content },
                          isMentionAi,
                          createdAt: now,
                      },
                  ];

            if (isMentionAi) {
                optimisticMessages.push({
                    id: "optimistic-" + now,
                    threadId: payload.threadId,
                    senderUserId: "mechhubAI",
                    senderName: "mechhubAI",
                    senderEmail: "mechhubAI",
                    senderAvatar: "", //tobecomfirm
                    role: "assistant",
                    content: { kind: "ai_typing", content: "AI generating..." },
                    isMentionsAi: false,
                    createdAt: now,
                });
            }
            queryClient.setQueryData(queryKey, optimisticMessages);

            return { previousMessages, isSharing };
        },
        onSuccess: async (result, payload, context) => {
            if (context?.isSharing) {
                toast.success("对话分享成功");
            }
            const queryKey = classKeys.threadMessages(viewerUserId, payload.threadId);
            const currentMessages = queryClient.getQueryData<ClassThreadMessage[]>(queryKey) ?? [];

            let nextMessages = currentMessages;
            nextMessages = upsertMessage(nextMessages, result);
            queryClient.setQueryData(queryKey, nextMessages);

            await queryClient.invalidateQueries({
                queryKey,
            });
        },
        onError: (error, payload, context) => {
            const queryKey = classKeys.threadMessages(viewerUserId, payload.threadId);
            if (context?.previousMessages) {
                queryClient.setQueryData(queryKey, context.previousMessages);
            }
            if (context?.isSharing) {
                toast.error(error.message || "对话分享失败");
            } else {
                toast.error(error.message || "发送消息失败");
            }
        },
    });
};

const upsertMessage = (messages: ClassThreadMessage[], messagesToUpsert: ClassThreadMessage[]) => {
    const next = messages.slice();
    for (const message of messagesToUpsert) {
        const index = messages.findIndex((item) => item.id === message.id);
        if (index === -1) {
            return [...messages, message];
        }
        next[index] = message;
    }
    return next;
};
