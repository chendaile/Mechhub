import { AssignmentInterface } from "../types";
import { HttpAssignmentInstance } from "../implementation/httpAssignmentInstance";

const createAssignmentInstance = (
    assignmentInstance: AssignmentInterface,
): AssignmentInterface => ({
    assignmentPush: assignmentInstance.assignmentPush,
    getAssignments: assignmentInstance.getAssignments,
    submitAssignment: assignmentInstance.submitAssignment,
    getSubmissions: assignmentInstance.getSubmissions,
    feedbackPush: assignmentInstance.feedbackPush,
    getFeedback: assignmentInstance.getFeedback,
    uploadAttachments: assignmentInstance.uploadAttachments,
});

export const assignmentInstance = createAssignmentInstance(HttpAssignmentInstance);
