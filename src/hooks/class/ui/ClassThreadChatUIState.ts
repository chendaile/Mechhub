import { useEffect, useRef, useState } from "react";
import { getClassThreadMessages } from "../queries/ClassQueryHooks";
import { postClassMessage } from "../queries/ClassMutationHooks";

export const ClassThreadChatUIState = (threadId: string) => {
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const threadMessagesQuery = getClassThreadMessages(threadId);
    const threadMessages = threadMessagesQuery?.data;
    const [typeMessage, setTypeMessage] = useState<string>("");

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "instant", block: "end" });
    }, [threadMessages?.length]);

    const toggleSendMessage = () => {
        postClassMessage()?.mutateAsync({ threadId, content: typeMessage });
    };

    return {
        threadMessages: threadMessages ?? [],
        isSending: false,
        isLoadingMessages: threadMessagesQuery?.isLoading ?? false,
        scrollAnchorRef: scrollRef,
        sendMessage: async (content: string) => {
            await postClassMessage()?.mutateAsync({ threadId, content });
        },
        toggleSendMessage,
        scrollRef,
        setTypeMessage,
        typeMessage,
    };
};
