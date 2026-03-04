export interface AssignmentPushPayload {
    classId: string;
    assignmentId: string;
    dueTime: string;
    dueDate: string;
    assignmentName: string;
    assignmentInstructure: string;
    attachmentUrls: string[];
    enableAI: boolean;
}

export interface Assignment extends AssignmentPushPayload {}

export interface AssignmentInterface {
    assignmentPush: (assignmentPushPayload: AssignmentPushPayload) => Promise<void>;
    getAssignments: (
        viewerUserId: string,
        classId: string,
        assignementId: string,
    ) => Promise<Assignment>;
    submitAssignment: (submission: Submission) => Promise<void>;
    getSubmissions: (
        viewerUserId: string,
        classId: string,
        assignementId: string,
        studentId: string,
    ) => Promise<Submission>;
    feedbackPush: (feedback: Feedback) => Promise<void>;
    getFeedback: (
        viewerUserId: string,
        classId: string,
        assignementId: string,
    ) => Promise<Feedback>;
}

export interface Submission {
    classId: string;
    assignementId: string;
    studentId: string;
    submitTime: string;
    chatId: string;
    messageIds?: string[];
    introspection: string;
}

export interface Feedback {
    who: "teacher" | "AI";
    score: number;
    text: string;
}
