import { useQuery } from "@tanstack/react-query";
import { assignmentKeys } from "./assignmentKeys";
import { getSession } from "../../auth/export";
import { assignmentInstance } from "../interface/assignmentInterface";

export const getAssignment = (classId: string, assignementId: string) => {
    const session = getSession();
    if (!session) {
        return null;
    }
    const viewerUserId = session.userId;

    return useQuery({
        queryKey: assignmentKeys.studentReceiveAssignments(viewerUserId, classId, assignementId),
        queryFn: () => {
            return assignmentInstance.getAssignments(viewerUserId, classId, assignementId);
        },
    });
};

export const getSubmissions = (classId: string, assignementId: string, studentId: string) => {
    const session = getSession();
    if (!session) {
        return null;
    }
    const viewerUserId = session.userId;

    return useQuery({
        queryKey: assignmentKeys.teacherReceiveSubmissions(
            viewerUserId,
            classId,
            assignementId,
            studentId,
        ),
        queryFn: () => {
            return assignmentInstance.getSubmissions(
                viewerUserId,
                classId,
                assignementId,
                studentId,
            );
        },
    });
};

export const getFeedback = (classId: string, assignementId: string) => {
    const session = getSession();
    if (!session) {
        return null;
    }
    const viewerUserId = session.userId;

    return useQuery({
        queryKey: assignmentKeys.studentReceiveFeedbacks(viewerUserId, classId, assignementId),
        queryFn: () => {
            return assignmentInstance.getFeedback(viewerUserId, classId, assignementId);
        },
    });
};
