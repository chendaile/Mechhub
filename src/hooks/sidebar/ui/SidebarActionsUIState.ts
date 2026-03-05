import { toast } from "sonner";

interface SidebarHandlers {
    handleSelectSession?: (id: string) => boolean;
    handleStartNewQuest?: () => void;
    deleteChatSession?: (id: string) => Promise<{
        success: boolean;
        wasCurrentSession: boolean;
    }>;
}

interface UseSidebarActionsParams extends SidebarHandlers {
    navigateToHome: () => void;
    navigateToChat: () => void;
}

export const SidebarActionsUIState = ({
    navigateToHome,
    navigateToChat,
    handleSelectSession,
    handleStartNewQuest,
    deleteChatSession,
}: UseSidebarActionsParams) => {
    const onNewQuest = () => {
        handleStartNewQuest?.();
        navigateToHome();
    };

    const onSelectSession = (id: string) => {
        if (handleSelectSession?.(id)) {
            navigateToChat();
        }
    };

    const handleDeleteSession = async (id: string) => {
        if (!deleteChatSession) return;

        const result = await deleteChatSession(id);
        if (result.success) {
            toast.success("?????");
            if (result.wasCurrentSession) {
                navigateToHome();
            }

            return;
        }

        toast.error("????");
    };

    return {
        onNewQuest,
        onSelectSession,
        handleDeleteSession,
    };
};
