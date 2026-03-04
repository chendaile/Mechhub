import { useEffect, useState } from "react";
import { ClassActiveView } from "../types";
import { createClassThread } from "../queries/ClassMutationHooks";
import { getClassMembers, getClassThreads } from "../queries/ClassQueryHooks";

export const SelectedClassUIState = (classId: string, classActiveView: ClassActiveView) => {
    const [threadTitle, setThreadTitle] = useState<string>("");
    const { teachers, students } = getClassMembers(classId)?.data ?? { teachers: [], students: [] };
    const classThreads = getClassThreads(classId)?.data;

    const toggleNewClassThread = async () => {
        const creatthread = await createClassThread();
        await creatthread?.mutateAsync({ classId, title: threadTitle });
    };

    return { toggleNewClassThread, threadTitle, setThreadTitle, teachers, students, classThreads };
};
