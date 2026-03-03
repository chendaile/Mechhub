import { useQuery } from "@tanstack/react-query";
import type { UseQueryResult } from "@tanstack/react-query";
import { getSession } from "../../auth/export";
import { assignmentInstance } from "../interface/assignmentInterface";
import type {
    Assignment,
    AssignmentDashboardItem,
    AssignmentFeedbackSummary,
    AssignmentQueryOptions,
    AssignmentSubmission,
} from "../types";
import {
    assignmentKeys,
    ASSIGNMENT_ALL_CLASSES_QUERY_ID,
    ASSIGNMENT_UNKNOWN_ASSIGNMENT_QUERY_ID,
    ASSIGNMENT_UNKNOWN_CLASS_QUERY_ID,
    ASSIGNMENT_UNKNOWN_SUBMISSION_QUERY_ID,
} from "./assignmentKeys";

const DEFAULT_STALE_TIME = 15_000;
const DISABLED_VIEWER_USER_ID = "__assignment_query_disabled__";

const resolveStudentClassId = (classId?: string) => classId ?? ASSIGNMENT_ALL_CLASSES_QUERY_ID;

const resolveTeacherClassId = (classId?: string) => classId ?? ASSIGNMENT_UNKNOWN_CLASS_QUERY_ID;

export const StudentAssignmentsQuery = (
    classId?: string,
    enabled = true,
    options?: AssignmentQueryOptions,
): UseQueryResult<Assignment[]> => {
    const session = getSession();
    const viewerUserId = session?.userId ?? DISABLED_VIEWER_USER_ID;

    return useQuery({
        queryKey: assignmentKeys.studentAssignments(viewerUserId, resolveStudentClassId(classId)),
        queryFn: () => assignmentInstance.listMyAssignments(classId),
        enabled: enabled && !!session,
        staleTime: options?.staleTime ?? DEFAULT_STALE_TIME,
        refetchInterval: options?.refetchInterval,
        refetchOnMount: options?.refetchOnMount,
    });
};

export const TeacherAssignmentsQuery = (
    classId?: string,
    enabled = true,
): UseQueryResult<Assignment[]> => {
    const session = getSession();
    const viewerUserId = session?.userId ?? DISABLED_VIEWER_USER_ID;

    return useQuery({
        queryKey: assignmentKeys.teacherAssignments(viewerUserId, resolveTeacherClassId(classId)),
        queryFn: () => assignmentInstance.listClassAssignments(classId ?? ""),
        enabled: enabled && !!session && !!classId,
        staleTime: DEFAULT_STALE_TIME,
    });
};

export const TeacherSubmissionOverviewQuery = (
    classId?: string,
    enabled = true,
): UseQueryResult<AssignmentDashboardItem[]> => {
    const session = getSession();
    const viewerUserId = session?.userId ?? DISABLED_VIEWER_USER_ID;

    return useQuery({
        queryKey: assignmentKeys.teacherSubmissionOverview(
            viewerUserId,
            resolveTeacherClassId(classId),
        ),
        queryFn: () => assignmentInstance.listClassAssignmentDashboard(classId ?? ""),
        enabled: enabled && !!session && !!classId,
        staleTime: 10_000,
    });
};

export const TeacherAssignmentSubmissionsQuery = (
    assignmentId?: string,
    classId?: string,
    enabled = true,
): UseQueryResult<AssignmentSubmission[]> => {
    const session = getSession();
    const viewerUserId = session?.userId ?? DISABLED_VIEWER_USER_ID;

    return useQuery({
        queryKey: assignmentKeys.teacherAssignmentSubmissions(
            viewerUserId,
            resolveTeacherClassId(classId),
            assignmentId ?? ASSIGNMENT_UNKNOWN_ASSIGNMENT_QUERY_ID,
        ),
        queryFn: () =>
            assignmentInstance.listAssignmentSubmissions({
                assignmentId: assignmentId ?? "",
                ...(classId ? { classId } : {}),
            }),
        enabled: enabled && !!session && !!assignmentId,
        staleTime: 5_000,
    });
};

export const StudentFeedbackQuery = (
    classId?: string,
    enabled = true,
    options?: AssignmentQueryOptions,
): UseQueryResult<AssignmentFeedbackSummary[]> => {
    const session = getSession();
    const viewerUserId = session?.userId ?? DISABLED_VIEWER_USER_ID;

    return useQuery({
        queryKey: assignmentKeys.studentFeedback(viewerUserId, resolveStudentClassId(classId)),
        queryFn: () => assignmentInstance.listMyFeedback(classId),
        enabled: enabled && !!session,
        staleTime: options?.staleTime ?? DEFAULT_STALE_TIME,
        refetchInterval: options?.refetchInterval,
        refetchOnMount: options?.refetchOnMount,
    });
};

export const StudentFeedbackDetailQuery = (
    submissionId?: string,
    classId?: string,
    enabled = true,
): UseQueryResult<AssignmentFeedbackSummary> => {
    const session = getSession();
    const viewerUserId = session?.userId ?? DISABLED_VIEWER_USER_ID;

    return useQuery({
        queryKey: assignmentKeys.studentFeedbackDetail(
            viewerUserId,
            resolveStudentClassId(classId),
            submissionId ?? ASSIGNMENT_UNKNOWN_SUBMISSION_QUERY_ID,
        ),
        queryFn: () => assignmentInstance.getFeedbackDetail(submissionId ?? ""),
        enabled: enabled && !!session && !!submissionId,
        staleTime: 5_000,
    });
};

export const MyAssignmentsQuery = StudentAssignmentsQuery;
export const ClassAssignmentsQuery = TeacherAssignmentsQuery;
export const ClassGradingOverviewQuery = TeacherSubmissionOverviewQuery;
export const AssignmentSubmissionsQuery = TeacherAssignmentSubmissionsQuery;
export const MyFeedbackQuery = StudentFeedbackQuery;
export const FeedbackDetailQuery = (submissionId?: string, enabled = true) =>
    StudentFeedbackDetailQuery(submissionId, undefined, enabled);
