import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { PostClassMessageMutation } from "./hooks/class/queries/ClassMutationHooks";
import type { ShareIntent } from "./appShareTypes";

interface ShareThreadGroup {
    classId: string;
    className: string;
    threads: Array<{
        id: string;
        title: string;
    }>;
}

interface UseAppShareFlowProps {
    classThreadGroups: ShareThreadGroup[];
    currentSessionId: string | null;
}

export const AppShareFlow = ({ classThreadGroups, currentSessionId }: UseAppShareFlowProps) => {
    const [shareIntent, setShareIntent] = useState<ShareIntent | null>(null);
    const postClassMessageMutation = PostClassMessageMutation();

    const shareableThreadCount = useMemo(
        () => classThreadGroups.reduce((count, group) => count + group.threads.length, 0),
        [classThreadGroups],
    );

    const openSharePicker = useCallback(
        (intent: ShareIntent) => {
            if (shareableThreadCount === 0) {
                toast.error("无可分享线程，请联系老师创建。");

                return;
            }

            setShareIntent(intent);
        },
        [shareableThreadCount],
    );

    const handleShareChatMessageToClass = useCallback(
        (messageId: string) => {
            openSharePicker({ kind: "chatMessage", messageId });
        },
        [openSharePicker],
    );

    const handleShareChatSessionToClass = useCallback(
        (sessionId: string) => {
            openSharePicker({ kind: "chatSession", sessionId });
        },
        [openSharePicker],
    );

    const handleConfirmThreadShare = useCallback(
        async (_classId: string, threadId: string) => {
            if (!shareIntent) {
                return;
            }

            if (!postClassMessageMutation) {
                toast.error("请先登录后再分享。");

                return;
            }

            if (shareIntent.kind === "chatMessage") {
                toast.error("当前结构只支持分享整个私聊会话，不支持单条消息分享。");

                return;
            }

            const sourceChatId =
                shareIntent.kind === "chatSession" ? shareIntent.sessionId : currentSessionId;

            if (!sourceChatId) {
                toast.error("Open a private chat session before sharing.");

                return;
            }

            try {
                await postClassMessageMutation.mutateAsync({
                    threadId,
                    chatId: sourceChatId,
                });
                setShareIntent(null);
            } catch {
                // error handled by mutation
            }
        },
        [currentSessionId, postClassMessageMutation, shareIntent],
    );

    return {
        shareIntent,
        setShareIntent,
        handleShareChatMessageToClass,
        handleShareChatSessionToClass,
        handleConfirmThreadShare,
        isSharing: postClassMessageMutation?.isPending ?? false,
    };
};
