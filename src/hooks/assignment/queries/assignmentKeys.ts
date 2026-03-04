export const assignmentKeys = {
    all: (viewerUserId: string) => ["assignment", viewerUserId] as const,
    studentReceiveAssignments: (viewerUserId: string, classId: string, assignementId: string) =>
        [...assignmentKeys.all(viewerUserId), classId, assignementId] as const,
    teacherReceiveSubmissions: (
        viewerUserId: string,
        classId: string,
        assignementId: string,
        studentId: string,
    ) =>
        [
            ...assignmentKeys.all(viewerUserId),
            classId,
            assignementId,
            studentId,
            "submission",
        ] as const,
    studentReceiveFeedbacks: (viewerUserId: string, classId: string, assignementId: string) =>
        [...assignmentKeys.all(viewerUserId), classId, assignementId, "feedback"] as const,
};
