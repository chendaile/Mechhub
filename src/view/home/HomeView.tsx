import { motion } from "motion/react";
import { useState } from "react";
import { AIAvatar } from "../../components";
import { UnifiedInputBar } from "@features/chat";
import type { UploadImageHandler } from "@features/chat";
import {
    ChatMode,
    FileAttachment,
    SubmitMessage,
} from "@features/chat";

interface HomeViewProps {
    onStartChat: (
        message?: string,
        imageUrls?: string[],
        fileAttachments?: FileAttachment[],
        model?: string,
        mode?: ChatMode,
    ) => void;
    mode?: ChatMode;
    setMode?: (mode: ChatMode) => void;
    userName?: string;
    uploadImage: UploadImageHandler;
}

const TypewriterText = ({
    text,
    delay = 0,
}: {
    text: string;
    delay?: number;
}) => {
    const letters = text.split("");

    return (
        <span>
            {letters.map((letter, i) => (
                <motion.span
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                        duration: 0.1,
                        delay: delay + i * 0.05,
                        ease: "easeOut",
                    }}
                >
                    {letter}
                </motion.span>
            ))}
        </span>
    );
};

export const HomeView = ({
    onStartChat,
    mode = "study",
    setMode = () => {},
    userName = "同学",
    uploadImage,
}: HomeViewProps) => {
    const [model, setModel] = useState("qwen3-vl-235b-a22b-thinking");
    const handleSendMessage = (payload: SubmitMessage) => {
        onStartChat(
            payload.text,
            payload.imageUrls,
            payload.fileAttachments,
            payload.model,
            payload.mode,
        );
    };

    return (
        <div className="relative flex h-full flex-1 flex-col items-center justify-center bg-white p-8">
            <div className="ml-[50px] flex w-full max-w-6xl flex-col items-start">
                {/* Top Greeting Row */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center gap-3 mb-4"
                >
                    <AIAvatar isThinking={true} />
                    {/* Greeting */}
                    <span className="text-2xl font-semibold text-slate-900">
                        Hi, {userName}
                    </span>
                </motion.div>

                <div className="w-[90%] max-w-5xl">
                    <h1
                        className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-3 tracking-tight leading-tight min-h-[1.2em]"
                        style={{ fontFamily: "Courier New, monospace" }}
                    >
                        <TypewriterText
                            text="Where should we start?"
                            delay={0.3}
                        />
                    </h1>

                    {/* Bottom Search Bar */}
                    <UnifiedInputBar
                        onSendMessage={handleSendMessage}
                        uploadImage={uploadImage}
                        mode={mode}
                        setMode={setMode}
                        model={model}
                        setModel={setModel}
                    />
                </div>
            </div>
        </div>
    );
};
