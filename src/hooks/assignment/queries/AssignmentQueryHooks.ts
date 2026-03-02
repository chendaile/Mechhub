import { useQuery } from "@tanstack/react-query";
import { useSessionQuery } from "../../auth";
import { assignmentInstance } from "../interface/assignmentInterface";
import type { AssignmentQueryOptions } from "../types";
import { assignmentKeys } from "./assignmentKeys";

export const MyAssignmentsQuery = (
    classId?: string,
    enabled = true,
    options?: AssignmentQueryOptions,
) => {
    const { data: session } = useSessionQuery();
    const viewerUserId = session?.user.id ?? null;

    return useQuery({
        queryKey: assignmentKeys.myAssignments(viewerUserId, classId),
        queryFn: () => assignmentInstance.listMyAssignments(classId),
        enabled: enabled && !!session,
        staleTime: options?.staleTime ?? 15_000,
        refetchInterval: options?.refetchInterval,
        refetchOnMount: options?.refetchOnMount,
    });
};

export const ClassAssignmentsQuery = (classId?: string, enabled = true) => {
    const { data: session } = useSessionQuery();
    const viewerUserId = session?.user.id ?? null;

    return useQuery({
        queryKey: assignmentKeys.classAssignments(viewerUserId, classId ?? "unknown"),
        queryFn: () => assignmentInstance.listClassAssignments(classId ?? ""),
        enabled: enabled && !!session && !!classId,
        staleTime: 15_000,
    });
};

export const ClassAssignmentDashboardQuery = (classId?: string) => {
    const { data: session } = useSessionQuery();
    const viewerUserId = session?.user.id ?? null;

    return useQuery({
        queryKey: assignmentKeys.dashboard(viewerUserId, classId ?? "unknown"),
        queryFn: () => assignmentInstance.listClassAssignmentDashboard(classId ?? ""),
        enabled: !!classId,
        staleTime: 10_000,
    });
};

export const AssignmentSubmissionsQuery = (
    assignmentId?: string,
    classId?: string,
    enabled = true,
) => {
    const { data: session } = useSessionQuery();
    const viewerUserId = session?.user.id ?? null;

    return useQuery({
        queryKey: assignmentKeys.assignmentSubmissions(viewerUserId, assignmentId ?? "unknown"),
        queryFn: () =>
            assignmentInstance.listAssignmentSubmissions({
                assignmentId: assignmentId ?? "",
                classId,
            }),
        enabled: enabled && !!session && !!assignmentId,
        staleTime: 5_000,
    });
};

export const MyFeedbackQuery = (
    classId?: string,
    enabled = true,
    options?: AssignmentQueryOptions,
) => {
    const { data: session } = useSessionQuery();
    const viewerUserId = session?.user.id ?? null;

    return useQuery({
        queryKey: assignmentKeys.myFeedback(viewerUserId, classId),
        queryFn: () => assignmentInstance.listMyFeedback(classId),
        enabled: enabled && !!session,
        staleTime: options?.staleTime ?? 15_000,
        refetchInterval: options?.refetchInterval,
        refetchOnMount: options?.refetchOnMount,
    });
};

export const FeedbackDetailQuery = (submissionId?: string, enabled = true) => {
    const { data: session } = useSessionQuery();
    const viewerUserId = session?.user.id ?? null;

    return useQuery({
        queryKey: assignmentKeys.feedbackDetail(viewerUserId, submissionId ?? "unknown"),
        queryFn: () => assignmentInstance.getFeedbackDetail(submissionId ?? ""),
        enabled: enabled && !!session && !!submissionId,
        staleTime: 5_000,
    });
};
