import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { SharePrivateChatToClassMutation } from "../class";
import type { ShareIntent } from "./types/share";

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

    const sharePrivateChatToClassMutation = SharePrivateChatToClassMutation();

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
        async (classId: string, threadId: string) => {
            if (!shareIntent) {
                return;
            }

            if (!sharePrivateChatToClassMutation) {
                toast.error("请先登录后再分享。");

                return;
            }

            try {
                if (shareIntent.kind === "chatMessage") {
                    if (!currentSessionId) {
                        toast.error("Open a private chat session before sharing.");

                        return;
                    }
                    await sharePrivateChatToClassMutation.mutateAsync({
                        classId,
                        threadId,
                        chatId: currentSessionId,
                        messageIds: [shareIntent.messageId],
                    });
                } else {
                    await sharePrivateChatToClassMutation.mutateAsync({
                        classId,
                        threadId,
                        chatId: shareIntent.sessionId,
                    });
                }
                setShareIntent(null);
                toast.success("Shared successfully to class thread.");
            } catch {
                // error handled by mutation
            }
        },
        [currentSessionId, shareIntent, sharePrivateChatToClassMutation],
    );

    return {
        shareIntent,
        setShareIntent,
        handleShareChatMessageToClass,
        handleShareChatSessionToClass,
        handleConfirmThreadShare,
        isSharing: sharePrivateChatToClassMutation?.isPending ?? false,
    };
};
