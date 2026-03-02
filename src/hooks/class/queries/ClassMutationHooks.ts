import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getSession } from "../../auth/export";
import { getProfile } from "../../profile/export";
import { classInstance } from "../interface/classInterface";
import type {
    ClassThreadMessage,
    PostClassMessagePayload,
    PostClassMessageContext,
    rawMessage,
    ClassThread,
    Class,
    CreateClassPayload,
    RenameClassThreadPayload,
    DeleteClassThreadPayload,
} from "../types";
import { classKeys } from "./classKeys";

const getMessage = (raw: rawMessage, fallback: string) => raw?.message ?? fallback;

export const CreateClassMutation = () => {
    const session = getSession();
    if (!session) {
        return;
    }
    const queryClient = useQueryClient();
    const viewerUserId = session.userId;

    return useMutation<Class, rawMessage, CreateClassPayload>({
        mutationFn: (payload) => classInstance.createClass(payload),
        onSuccess: async () => {
            toast.success("班级创建成功");
            await queryClient.invalidateQueries({
                queryKey: classKeys.myClasses(viewerUserId),
            });
        },
        onError: (error) => {
            toast.error(getMessage(error, "创建班级失败"));
        },
    });
};

export const DeleteClassMutation = () => {
    const session = getSession();
    if (!session) {
        return;
    }
    const queryClient = useQueryClient();
    const viewerUserId = session.userId;

    return useMutation({
        mutationFn: (classId: string) => classInstance.deleteClass(classId),
        onSuccess: async () => {
            toast.success("班级已删除");
            await queryClient.invalidateQueries({
                queryKey: classKeys.myClasses(viewerUserId),
            });
        },
        onError: (error) => {
            toast.error(getMessage(error, "删除班级失败"));
        },
    });
};

export const LeaveClassMutation = () => {
    const session = getSession();
    if (!session) {
        return;
    }
    const queryClient = useQueryClient();
    const viewerUserId = session.userId;

    return useMutation({
        mutationFn: (classId: string) => classInstance.leaveClass(classId),
        onSuccess: async () => {
            toast.success("已退出班级");
            await queryClient.invalidateQueries({
                queryKey: classKeys.myClasses(viewerUserId),
            });
        },
        onError: (error) => {
            toast.error(getMessage(error, "退出班级失败"));
        },
    });
};

export const JoinClassByInviteCodeMutation = () => {
    const session = getSession();
    if (!session) {
        return;
    }
    const queryClient = useQueryClient();
    const viewerUserId = session.userId;

    return useMutation<Class, rawMessage, string>({
        mutationFn: (inviteCode) => classInstance.joinClassByInviteCode(inviteCode),
        onSuccess: async () => {
            toast.success("加入班级成功");
            await queryClient.invalidateQueries({
                queryKey: classKeys.myClasses(viewerUserId),
            });
        },
        onError: (error) => {
            toast.error(getMessage(error, "加入班级失败"));
        },
    });
};

export const CreateGroupThreadMutation = () => {
    const session = getSession();
    if (!session) {
        return;
    }
    const queryClient = useQueryClient();
    const viewerUserId = session.userId;

    return useMutation<ClassThread, rawMessage, { classId: string; title: string }>({
        mutationFn: (payload) => classInstance.createGroupThread(payload.classId, payload.title),
        onSuccess: async (_, payload) => {
            toast.success("话题已创建");
            await queryClient.invalidateQueries({
                queryKey: classKeys.threads(viewerUserId, payload.classId),
            });
        },
        onError: (error) => {
            toast.error(getMessage(error, "创建话题失败"));
        },
    });
};

export const RenameClassThreadMutation = () => {
    const session = getSession();
    if (!session) {
        return;
    }
    const queryClient = useQueryClient();
    const viewerUserId = session.userId;

    return useMutation({
        mutationFn: (payload: RenameClassThreadPayload) => classInstance.renameClassThread(payload),
        onSuccess: async (_, payload) => {
            toast.success("话题已重命名");
            await queryClient.invalidateQueries({
                queryKey: classKeys.threads(viewerUserId, payload.classId),
            });
        },
        onError: (error) => {
            toast.error(getMessage(error, "重命名话题失败"));
        },
    });
};

export const DeleteClassThreadMutation = () => {
    const session = getSession();
    if (!session) {
        return;
    }
    const queryClient = useQueryClient();
    const viewerUserId = session.userId;

    return useMutation({
        mutationFn: (payload: DeleteClassThreadPayload) => classInstance.deleteClassThread(payload),
        onSuccess: async (_, payload) => {
            toast.success("话题已删除");
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: classKeys.threads(viewerUserId, payload.classId),
                }),
            ]);
        },
        onError: (error) => {
            toast.error(getMessage(error, "删除话题失败"));
        },
    });
};

export const PostClassMessageMutation = () => {
    const session = getSession();
    if (!session) {
        return;
    }
    const queryClient = useQueryClient();
    const viewerUserId = session.userId;
    const { avatarUrl: viewerAvatar, name: viewerName } = getProfile();

    return useMutation<
        ClassThreadMessage[],
        rawMessage,
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
                    senderName: "mechhubAI",
                    senderAvatar: null,
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
                toast.error(getMessage(error, "对话分享失败"));
            } else {
                toast.error(getMessage(error, "发送消息失败"));
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
