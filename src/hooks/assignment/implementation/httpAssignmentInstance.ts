import type {
    Assignment,
    AssignmentInterface,
    AssignmentPushPayload,
    Feedback,
    FeedbackPayload,
    Submission,
    SubmissionPayload,
} from "../types";
import { httpClient } from "../../shared/httpClient";

export const HttpAssignmentInstance: AssignmentInterface = {
    async assignmentPush(payload: AssignmentPushPayload): Promise<void> {
        await httpClient.post("/assignments", payload);
    },
    async getAssignments(_viewerUserId: string, classId: string): Promise<Assignment[]> {
        return httpClient.get<Assignment[]>(`/assignments/${classId}`);
    },
    async submitAssignment(submission: SubmissionPayload): Promise<void> {
        await httpClient.post("/assignments/submit", submission);
    },
    async getSubmissions(
        _viewerUserId: string,
        classId: string,
        assignementId: string,
    ): Promise<Submission[]> {
        return httpClient.get<Submission[]>(
            `/assignments/${classId}/${assignementId}/submissions`,
        );
    },
    async feedbackPush(feedback: FeedbackPayload): Promise<void> {
        await httpClient.post("/assignments/feedback", feedback);
    },
    async getFeedback(
        _viewerUserId: string,
        classId: string,
        assignementId: string,
    ): Promise<Feedback[]> {
        return httpClient.get<Feedback[]>(`/assignments/${classId}/${assignementId}/feedback`);
    },
    async uploadAttachments(files: File[]): Promise<string[]> {
        const formData = new FormData();
        files.forEach((file) => formData.append("files", file));
        return httpClient.postForm<string[]>("/assignments/attachments", formData);
    },
};
