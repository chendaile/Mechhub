import { useQueries, useQuery } from "@tanstack/react-query";
import type { UseQueryResult } from "@tanstack/react-query";
import { getSession } from "../../auth/export";
import { classInstance } from "../interface/classInterface";
import type { ClassMembers, ClassThread, ClassThreadMessage, MyClassContext } from "../types";
import { classKeys } from "./classKeys";

export const MyClassContextQuery = (): UseQueryResult<MyClassContext> | undefined => {
    const session = getSession();
    if (!session) {
        return;
    }
    const viewerUserId = session.userId;

    return useQuery({
        queryKey: classKeys.myClasses(viewerUserId),
        queryFn: (): Promise<MyClassContext> => classInstance.getMyClassContext(),
        refetchInterval: 2_000,
    });
};

export const ClassMembersQuery = (
    classId: string | null,
): UseQueryResult<ClassMembers> | undefined => {
    const session = getSession();
    if (!session || !classId) {
        return;
    }
    const viewerUserId = session.userId;

    return useQuery({
        queryKey: classKeys.members(viewerUserId, classId),
        queryFn: (): Promise<ClassMembers> => classInstance.listClassMembers(classId),
        refetchInterval: 2_000,
    });
};

export const ClassThreadsQuery = (
    classId: string | null,
): UseQueryResult<ClassThread[]> | undefined => {
    const session = getSession();
    if (!session || !classId) {
        return;
    }
    const viewerUserId = session.userId;

    return useQuery({
        queryKey: classKeys.threads(viewerUserId, classId),
        queryFn: (): Promise<ClassThread[]> => classInstance.listClassThreads(classId),
        refetchInterval: 2_000,
    });
};

export const ClassThreadsBatchQuery = (classIds: string[], enabled = true) => {
    const session = getSession();
    if (!session || !enabled) {
        return {
            threadQueries: [],
            isFetching: false,
            isLoading: false,
            dataByClassId: {},
        };
    }
    const viewerUserId = session.userId;

    const threadQueries = useQueries({
        queries: classIds.map((classId) => ({
            queryKey: classKeys.threads(viewerUserId, classId),
            queryFn: (): Promise<ClassThread[]> => classInstance.listClassThreads(classId),
            staleTime: 2_000,
        })),
    });

    return {
        threadQueries,
        isFetching: threadQueries.some((query) => query.isFetching),
        isLoading: threadQueries.some((query) => query.isLoading),
        dataByClassId: classIds.reduce<Record<string, ClassThread[]>>((accumulator, classId, index) => {
            accumulator[classId] = threadQueries[index]?.data ?? [];

            return accumulator;
        }, {}),
    };
};

export const ClassThreadMessagesQuery = (
    threadId: string,
): UseQueryResult<ClassThreadMessage[]> | undefined => {
    const session = getSession();
    if (!session) {
        return;
    }
    const viewerUserId = session.userId;

    return useQuery({
        queryKey: classKeys.threadMessages(viewerUserId, threadId),
        queryFn: (): Promise<ClassThreadMessage[]> =>
            classInstance.getClassThreadMessages(threadId),
        refetchInterval: 2_000,
    });
};
