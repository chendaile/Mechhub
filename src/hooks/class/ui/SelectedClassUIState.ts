import { useState } from "react";
import { ClassActiveView } from "../types";
import { createClassThread } from "../queries/ClassMutationHooks";
import { getClassMembers, getClassThreads } from "../queries/ClassQueryHooks";

export const SelectedClassUIState = (classId: string, classActiveView: ClassActiveView) => {
    const [threadTitle, setThreadTitle] = useState<string>("");
    const [isCreatingThread, setIsCreatingThread] = useState(false);
    const membersQuery = getClassMembers(classId);
    const threadsQuery = getClassThreads(classId);
    const { teachers, students } = membersQuery?.data ?? { teachers: [], students: [] };
    const classThreads = threadsQuery?.data ?? [];

    const toggleNewClassThread = async () => {
        if (!threadTitle.trim()) {
            return;
        }
        setIsCreatingThread(true);
        try {
            const creatthread = await createClassThread();
            await creatthread?.mutateAsync({ classId, title: threadTitle.trim() });
            setThreadTitle("");
        } finally {
            setIsCreatingThread(false);
        }
    };

    return {
        toggleNewClassThread,
        threadTitle,
        setThreadTitle,
        teachers,
        students,
        classThreads,
        isCreatingThread,
        isLoadingMembers: membersQuery?.isLoading ?? false,
        isLoadingThreads: threadsQuery?.isLoading ?? false,
    };
};
