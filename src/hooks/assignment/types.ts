export interface AssignmentPushPayload {
    classId: string;
    dueTime: string;
    dueDate: string;
    assignmentName: string;
    assignmentInstructure: string;
    attachmentUrls: string[];
    enableAI: boolean;
}

export interface Assignment {
    classId: string;
    assignmentId: string;
    dueTime: string;
    dueDate: string;
    assignmentName: string;
    assignmentInstructure: string;
    attachmentUrls: string[];
    enableAI: boolean;
}

export interface AssignmentInterface {
    assignmentPush: (assignmentPushPayload: AssignmentPushPayload) => Promise<void>;
    getAssignments: (viewerUserId: string, classId: string) => Promise<Assignment[]>;
    submitAssignment: (submission: SubmissionPayload) => Promise<void>;
    getSubmissions: (
        viewerUserId: string,
        classId: string,
        assignementId: string,
    ) => Promise<Submission[]>;
    feedbackPush: (feedback: FeedbackPayload) => Promise<void>;
    getFeedback: (
        viewerUserId: string,
        classId: string,
        assignementId: string,
    ) => Promise<Feedback[]>;
    uploadAttachments: (files: File[]) => Promise<string[]>;
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

export interface SubmissionPayload {
    classId: string;
    studentId: string;
    submitTime: string;
    chatId: string;
    messageIds?: string[];
    introspection: string;
}

export interface Feedback {
    classId: string;
    feedbackId: string;
    studentId: string;
    assignementId: string;
    who: "teacher" | "AI";
    score: number;
    text: string;
}

export interface FeedbackPayload {
    classId: string;
    assignmentId: string;
    studentId: string;
    who: "teacher" | "AI";
    score: number;
    text: string;
}

export type ActiveView = "Publish" | "Grade" | "Submit" | "Feedback";
