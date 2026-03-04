import { useEffect, useRef, useState } from "react";
import { ClassActiveView } from "../types";
import { getClassThreadMessages } from "../queries/ClassQueryHooks";
import { postClassMessage } from "../queries/ClassMutationHooks";

export const ClassThreadChatUIState = (threadId: string, classActiveView: ClassActiveView) => {
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const threadMessages = getClassThreadMessages(threadId)?.data;
    const [typeMessage, setTypeMessage] = useState<string>("");

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "instant", block: "end" });
    }, [threadMessages?.length]);

    const toggleSendMessage = () => {
        postClassMessage()?.mutateAsync({ threadId, content: typeMessage });
    };

    return { threadMessages, scrollRef, setTypeMessage, typeMessage, toggleSendMessage };
};
