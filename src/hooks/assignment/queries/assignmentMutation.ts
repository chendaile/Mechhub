import { useMutation } from "@tanstack/react-query";
import { AssignmentPushPayload, Feedback, FeedbackPayload, SubmissionPayload } from "../types";
import { assignmentInstance } from "../interface/assignmentInterface";
import { toast } from "sonner";

//Push assignment to students.
export const assignmentPush = () => {
    return useMutation<void, Error, AssignmentPushPayload>({
        mutationFn: (payload) => assignmentInstance.assignmentPush(payload),
        onSuccess: () => {
            toast.success("成功发布作业");
            //toggle pull some query
        },
        onError: (error) => {
            toast.error(error.message || "未能成功发布作业");
        },
    });
};

//Push submissions
export const submitAssignment = () => {
    return useMutation<void, Error, SubmissionPayload>({
        mutationFn: (submission) => assignmentInstance.submitAssignment(submission),
        onSuccess: () => {
            toast.success("成功提交作业");
        },
        onError: (error) => {
            toast.error(error.message || "无法提交作业");
        },
    });
};

//Push feedback
export const feedbackPush = () => {
    return useMutation<void, Error, FeedbackPayload>({
        mutationFn: (feedback) => assignmentInstance.feedbackPush(feedback),
        onSuccess: () => {
            toast.success("成功发布批改结果");
        },
        onError: (error) => {
            toast.error(error.message || "无法发布批改结果");
        },
    });
};

//Make attachments to urls
export const uploadAttachments = () => {
    return useMutation<string[], Error, File[]>({
        mutationFn: (files) => assignmentInstance.uploadAttachments(files),
        onError: (error) => {
            toast.error(error.message || "无法上传附件");
        },
    });
};
