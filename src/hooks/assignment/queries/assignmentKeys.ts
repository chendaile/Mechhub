export const ASSIGNMENT_ALL_CLASSES_QUERY_ID = "__all_classes__";
export const ASSIGNMENT_UNKNOWN_CLASS_QUERY_ID = "__unknown_class__";
export const ASSIGNMENT_UNKNOWN_ASSIGNMENT_QUERY_ID = "__unknown_assignment__";
export const ASSIGNMENT_UNKNOWN_SUBMISSION_QUERY_ID = "__unknown_submission__";

export const assignmentKeys = {
    viewer: (viewerUserId: string) => ["assignment", viewerUserId] as const,

    studentAssignmentsRoot: (viewerUserId: string) =>
        [...assignmentKeys.viewer(viewerUserId), "student-assignments"] as const,
    studentAssignments: (viewerUserId: string, classId: string) =>
        [...assignmentKeys.studentAssignmentsRoot(viewerUserId), classId] as const,

    teacherAssignments: (viewerUserId: string, classId: string) =>
        [...assignmentKeys.viewer(viewerUserId), "teacher-assignments", classId] as const,

    teacherSubmissionsRoot: (viewerUserId: string) =>
        [...assignmentKeys.viewer(viewerUserId), "teacher-submissions"] as const,
    teacherSubmissionOverview: (viewerUserId: string, classId: string) =>
        [...assignmentKeys.teacherSubmissionsRoot(viewerUserId), classId] as const,
    teacherAssignmentSubmissions: (
        viewerUserId: string,
        classId: string,
        assignmentId: string,
    ) => [...assignmentKeys.teacherSubmissionOverview(viewerUserId, classId), assignmentId] as const,

    studentFeedbackRoot: (viewerUserId: string) =>
        [...assignmentKeys.viewer(viewerUserId), "student-feedback"] as const,
    studentFeedback: (viewerUserId: string, classId: string) =>
        [...assignmentKeys.studentFeedbackRoot(viewerUserId), classId] as const,
    studentFeedbackDetail: (viewerUserId: string, classId: string, submissionId: string) =>
        [...assignmentKeys.studentFeedback(viewerUserId, classId), submissionId] as const,

    teacherFeedbackRoot: (viewerUserId: string) =>
        [...assignmentKeys.viewer(viewerUserId), "teacher-feedback"] as const,
};
