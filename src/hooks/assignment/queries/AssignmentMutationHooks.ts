import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getSession } from "../../auth/export";
import { assignmentInstance } from "../interface/assignmentInterface";
import type {
    Assignment,
    AssignmentGrade,
    AssignmentSubmission,
    CreateAssignmentPayload,
    GenerateGradeDraftPayload,
    ReleaseGradePayload,
    SaveGradeReviewPayload,
    SubmitAssignmentFromChatPayload,
    rawMessage,
} from "../types";
import { assignmentKeys } from "./assignmentKeys";

const getMessage = (raw: rawMessage, fallback: string) => raw?.message ?? fallback;

export const CreateAssignmentMutation = () => {
    const session = getSession();
    if (!session) {
        return;
    }
    const queryClient = useQueryClient();
    const viewerUserId = session.userId;

    return useMutation<Assignment, rawMessage, CreateAssignmentPayload>({
        mutationFn: (payload) => assignmentInstance.createAssignment(payload),
        onSuccess: async (assignment) => {
            toast.success("作业已创建");
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: assignmentKeys.teacherAssignments(viewerUserId, assignment.classId),
                }),
                queryClient.invalidateQueries({
                    queryKey: assignmentKeys.studentAssignmentsRoot(viewerUserId),
                }),
                queryClient.invalidateQueries({
                    queryKey: assignmentKeys.teacherSubmissionOverview(
                        viewerUserId,
                        assignment.classId,
                    ),
                }),
            ]);
        },
        onError: (error) => {
            toast.error(getMessage(error, "创建作业失败"));
        },
    });
};

export const SubmitAssignmentFromChatMutation = () => {
    const session = getSession();
    if (!session) {
        return;
    }
    const queryClient = useQueryClient();
    const viewerUserId = session.userId;

    return useMutation<AssignmentSubmission, rawMessage, SubmitAssignmentFromChatPayload>({
        mutationFn: (payload) => assignmentInstance.submitAssignmentFromChat(payload),
        onSuccess: async (submission) => {
            toast.success("作业提交成功");
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: assignmentKeys.studentAssignmentsRoot(viewerUserId),
                }),
                queryClient.invalidateQueries({
                    queryKey: assignmentKeys.studentFeedbackRoot(viewerUserId),
                }),
                queryClient.invalidateQueries({
                    queryKey: assignmentKeys.teacherAssignmentSubmissions(
                        viewerUserId,
                        submission.classId,
                        submission.assignmentId,
                    ),
                }),
                queryClient.invalidateQueries({
                    queryKey: assignmentKeys.teacherSubmissionOverview(
                        viewerUserId,
                        submission.classId,
                    ),
                }),
            ]);
        },
        onError: (error) => {
            toast.error(getMessage(error, "提交作业失败"));
        },
    });
};

export const GenerateGradeDraftMutation = () => {
    const session = getSession();
    if (!session) {
        return;
    }
    const queryClient = useQueryClient();
    const viewerUserId = session.userId;

    return useMutation<AssignmentGrade, rawMessage, GenerateGradeDraftPayload>({
        mutationFn: (payload) => assignmentInstance.generateGradeDraft(payload),
        onSuccess: async () => {
            toast.success("AI 批改草稿已生成");
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: assignmentKeys.teacherSubmissionsRoot(viewerUserId),
                }),
                queryClient.invalidateQueries({
                    queryKey: assignmentKeys.teacherFeedbackRoot(viewerUserId),
                }),
            ]);
        },
        onError: (error) => {
            toast.error(getMessage(error, "生成草稿失败"));
        },
    });
};

export const SaveGradeReviewMutation = () => {
    const session = getSession();
    if (!session) {
        return;
    }
    const queryClient = useQueryClient();
    const viewerUserId = session.userId;

    return useMutation<AssignmentGrade, rawMessage, SaveGradeReviewPayload>({
        mutationFn: (payload) => assignmentInstance.saveGradeReview(payload),
        onSuccess: async () => {
            toast.success("评分草稿已保存");
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: assignmentKeys.teacherSubmissionsRoot(viewerUserId),
                }),
                queryClient.invalidateQueries({
                    queryKey: assignmentKeys.teacherFeedbackRoot(viewerUserId),
                }),
            ]);
        },
        onError: (error) => {
            toast.error(getMessage(error, "保存评分失败"));
        },
    });
};

export const ReleaseGradeMutation = () => {
    const session = getSession();
    if (!session) {
        return;
    }
    const queryClient = useQueryClient();
    const viewerUserId = session.userId;

    return useMutation<AssignmentGrade, rawMessage, ReleaseGradePayload>({
        mutationFn: (payload) => assignmentInstance.releaseGrade(payload),
        onSuccess: async () => {
            toast.success("反馈已发布给学生");
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: assignmentKeys.teacherSubmissionsRoot(viewerUserId),
                }),
                queryClient.invalidateQueries({
                    queryKey: assignmentKeys.teacherFeedbackRoot(viewerUserId),
                }),
                queryClient.invalidateQueries({
                    queryKey: assignmentKeys.studentFeedbackRoot(viewerUserId),
                }),
                queryClient.invalidateQueries({
                    queryKey: assignmentKeys.studentAssignmentsRoot(viewerUserId),
                }),
            ]);
        },
        onError: (error) => {
            toast.error(getMessage(error, "发布反馈失败"));
        },
    });
};
