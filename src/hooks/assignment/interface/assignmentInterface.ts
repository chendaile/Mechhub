import type {
    AssignmentInterface,
    AssignmentAttachmentInterface,
    AssignmentAttachment,
} from "../types";

export const createAssignmentInterface = (instance: AssignmentInterface): AssignmentInterface => ({
    listMyAssignments: instance.listMyAssignments,
    listClassAssignments: instance.listClassAssignments,
    listClassAssignmentDashboard: instance.listClassAssignmentDashboard,
    listAssignmentSubmissions: instance.listAssignmentSubmissions,
    listMyFeedback: instance.listMyFeedback,
    getFeedbackDetail: instance.getFeedbackDetail,
    createAssignment: instance.createAssignment,
    submitAssignmentFromChat: instance.submitAssignmentFromChat,
    generateGradeDraft: instance.generateGradeDraft,
    saveGradeReview: instance.saveGradeReview,
    releaseGrade: instance.releaseGrade,
});

export const createAssignmentAttachmentInterface = (
    instance: AssignmentAttachmentInterface,
): AssignmentAttachmentInterface => ({
    uploadAssignmentAttachments: instance.uploadAssignmentAttachments,
});

export const assignmentInstance = createAssignmentInterface();

export const assignmentAttachmentInstance = createAssignmentAttachmentInterface();

export const uploadAssignmentAttachments = (files: File[]): Promise<AssignmentAttachment[]> =>
    assignmentAttachmentInstance.uploadAssignmentAttachments(files);
