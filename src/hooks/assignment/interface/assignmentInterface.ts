import { AssignmentInterface } from "../types";

const createAssignmentInstance = (
    assignmentInstance: AssignmentInterface,
): AssignmentInterface => ({
    assignmentPush: assignmentInstance.assignmentPush,
    getAssignments: assignmentInstance.getAssignments,
    submitAssignment: assignmentInstance.submitAssignment,
    getSubmissions: assignmentInstance.getSubmissions,
    feedbackPush: assignmentInstance.feedbackPush,
    getFeedback: assignmentInstance.getFeedback,
});

export const assignmentInstance = createAssignmentInstance();
