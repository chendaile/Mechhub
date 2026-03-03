// 已废弃：请从 "../export" 统一导入。此文件保留以兼容现有引用。
export {
    StudentAssignmentsQuery,
    TeacherAssignmentsQuery,
    TeacherSubmissionOverviewQuery,
    TeacherAssignmentSubmissionsQuery,
    StudentFeedbackQuery,
    StudentFeedbackDetailQuery,
    MyAssignmentsQuery,
    ClassAssignmentsQuery,
    ClassGradingOverviewQuery,
    AssignmentSubmissionsQuery,
    MyFeedbackQuery,
    FeedbackDetailQuery,
} from "./AssignmentQueryHooks";
export {
    CreateAssignmentMutation,
    SubmitAssignmentFromChatMutation,
    GenerateGradeDraftMutation,
    SaveGradeReviewMutation,
    ReleaseGradeMutation,
} from "./AssignmentMutationHooks";
