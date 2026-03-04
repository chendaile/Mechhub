import { useQuery } from "@tanstack/react-query";
import { assignmentKeys } from "./assignmentKeys";
import { getSession } from "../../auth/export";
import { assignmentInstance } from "../interface/assignmentInterface";
import type { Assignment, Feedback, Submission } from "../types";

export const getAssignment = (classId: string) => {
    const session = getSession();
    const viewerUserId = session?.userId ?? "";

    return useQuery({
        queryKey: assignmentKeys.studentReceiveAssignments(viewerUserId, classId),
        queryFn: (): Promise<Assignment[]> =>
            assignmentInstance.getAssignments(viewerUserId, classId),
        enabled: !!session && !!classId,
    });
};

export const getSubmissions = (classId: string, assignementId: string) => {
    const session = getSession();
    const viewerUserId = session?.userId ?? "";

    return useQuery({
        queryKey: assignmentKeys.teacherReceiveSubmissions(viewerUserId, classId, assignementId),
        queryFn: (): Promise<Submission[]> =>
            assignmentInstance.getSubmissions(viewerUserId, classId, assignementId),
        enabled: !!session && !!classId && !!assignementId,
    });
};

export const getFeedback = (classId: string, assignementId: string) => {
    const session = getSession();
    const viewerUserId = session?.userId ?? "";

    return useQuery({
        queryKey: assignmentKeys.studentReceiveFeedbacks(viewerUserId, classId, assignementId),
        queryFn: (): Promise<Feedback> =>
            assignmentInstance.getFeedback(viewerUserId, classId, assignementId),
        enabled: !!session && !!classId && !!assignementId,
    });
};
