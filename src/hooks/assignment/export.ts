// Assignment Interface
export {
    assignmentInstance,
    assignmentAttachmentInstance,
    uploadAssignmentAttachments,
} from "./interface/assignmentInterface";

// Assignment Query Keys
export { assignmentKeys } from "./queries/assignmentKeys";

// Assignment Query Hooks
export {
    StudentAssignmentsQuery,
    TeacherSubmissionOverviewQuery,
    TeacherAssignmentSubmissionsQuery,
    StudentFeedbackQuery,
    StudentFeedbackDetailQuery,
} from "./queries/AssignmentQueryHooks";

// Assignment Mutation Hooks
export {
    CreateAssignmentMutation,
    SubmitAssignmentFromChatMutation,
    GenerateGradeDraftMutation,
    ReleaseGradeMutation,
} from "./queries/AssignmentMutationHooks";

// Assignment UI State
export { buildAssignmentClassNameMap } from "./ui/AssignmentClassNameMapUIState";
export { GradeAssignmentUIState } from "./ui/GradeAssignmentUIState";
export { PublishAssignmentUIState } from "./ui/PublishAssignmentUIState";
export { PublishAssignmentCreationFlow } from "./ui/PublishAssignmentCreationFlow";
export { buildSubmitAssignmentViewModel } from "./ui/SubmitAssignmentUIState";
export { buildSnapshotPreview } from "./ui/SubmitSnapshotPreviewUIState";
export { buildViewFeedbackGroups } from "./ui/ViewFeedbackUIState";

// Assignment Types
export type {
    Assignment,
    AssignmentAttachment,
    AssignmentClassNameMap,
    AssignmentClassOption,
    AssignmentFeedbackSummary,
    AssignmentQueryOptions,
    AssignmentSnapshotPreview,
    AssignmentSubmission,
    AssignmentGrade,
    CreateAssignmentPayload,
    GenerateGradeDraftPayload,
    GradeListViewClass,
    PublishAssignmentDraft,
    ReleaseGradePayload,
    StudentAssignmentSummary,
    SubmitAssignmentViewModel,
    SubmitAssignmentFromChatPayload,
    ViewFeedbackGroup,
    ViewFeedbackGroupItem,
} from "./types";
