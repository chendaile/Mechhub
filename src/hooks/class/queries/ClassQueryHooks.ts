import { useQuery } from "@tanstack/react-query";
import { getSession } from "../../auth/export";
import { classInstance } from "../interface/classInterface";
import type { ClassMembers, ClassThread, ClassThreadMessage, MyClassContext } from "../types";
import { classKeys } from "./classKeys";

export const getMyClass = () => {
    const session = getSession();
    const viewerUserId = session?.userId ?? "";

    return useQuery({
        queryKey: classKeys.myClasses(viewerUserId),
        queryFn: (): Promise<MyClassContext> => classInstance.getMyClass(),
        enabled: !!session,
        refetchInterval: 2_000,
    });
};

export const getClassMembers = (classId: string) => {
    const session = getSession();
    const viewerUserId = session?.userId ?? "";

    return useQuery({
        queryKey: classKeys.members(viewerUserId, classId),
        queryFn: (): Promise<ClassMembers> => classInstance.getClassMembers(classId),
        enabled: !!session && !!classId,
        refetchInterval: 2_000,
    });
};

export const getClassThreads = (classId: string) => {
    const session = getSession();
    const viewerUserId = session?.userId ?? "";

    return useQuery({
        queryKey: classKeys.threads(viewerUserId, classId),
        queryFn: (): Promise<ClassThread[]> => classInstance.getClassThreads(classId),
        enabled: !!session && !!classId,
        refetchInterval: 2_000,
    });
};

export const getClassThreadMessages = (threadId: string) => {
    const session = getSession();
    const viewerUserId = session?.userId ?? "";

    return useQuery({
        queryKey: classKeys.threadMessages(viewerUserId, threadId),
        queryFn: (): Promise<ClassThreadMessage[]> =>
            classInstance.getClassThreadMessages(threadId),
        enabled: !!session && !!threadId,
        refetchInterval: 2_000,
    });
};
