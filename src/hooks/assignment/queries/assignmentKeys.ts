export const assignmentKeys = {
    all: (viewerUserId: string) => ["assignment", viewerUserId] as const,
    studentReceiveAssignments: (viewerUserId: string, classId: string) =>
        [...assignmentKeys.all(viewerUserId), classId] as const,
    teacherReceiveSubmissions: (viewerUserId: string, classId: string, assignementId: string) =>
        [...assignmentKeys.all(viewerUserId), classId, assignementId, "submission"] as const,
    studentReceiveFeedbacks: (viewerUserId: string, classId: string, assignementId: string) =>
        [...assignmentKeys.all(viewerUserId), classId, assignementId, "feedback"] as const,
};
