import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { PostClassMessageMutation } from "../queries/ClassMutationHooks";
import { ClassThreadMessagesQuery } from "../queries/ClassQueryHooks";

export const ClassThreadChatUIState = (threadId: string) => {
    const scrollAnchorRef = useRef<HTMLDivElement | null>(null);
    const threadMessagesQuery = ClassThreadMessagesQuery(threadId);
    const postClassMessageMutation = PostClassMessageMutation();
    const threadMessages = threadMessagesQuery?.data ?? [];
    const isSending = postClassMessageMutation?.isPending ?? false;
    const isLoadingMessages = threadMessagesQuery?.isLoading ?? false;

    useEffect(() => {
        scrollAnchorRef.current?.scrollIntoView({
            behavior: "auto",
            block: "end",
        });
    }, [threadMessages.length]);

    const sendMessage = async (text: string) => {
        if (!text) {
            toast.warning("请输入消息文本。");

            return;
        }

        if (!postClassMessageMutation) {
            toast.warning("请先登录后再发送消息。");

            return;
        }

        await postClassMessageMutation.mutateAsync({
            threadId,
            content: text,
        });
    };

    return {
        threadMessages,
        scrollAnchorRef,
        sendMessage,
        isSending,
        isLoadingMessages,
    };
};
