import type { Message } from "../chat/types";

// 核心领域模型：作业与提交流程
export interface AssignmentAttachment {
    name: string;
    url: string;
    size?: number;
    contentType?: string;
    storagePath?: string;
}

export type SubmissionSourceKind = "chat_session_snapshot" | "chat_response_snapshot";

export type AssignmentStatus = "draft" | "published" | "closed";
export type AssignmentSubmissionRecordStatus = "submitted" | "graded" | "returned";
export type AssignmentGradeStatus = "draft" | "released";

export interface Assignment {
    id: string;
    classId: string;
    title: string;
    instructions: string | null;
    dueAt: string | null;
    attachments?: AssignmentAttachment[];
    createdByUserId: string;
    aiGradingEnabled: boolean;
    status: AssignmentStatus;
    createdAt: string;
    updatedAt: string;
    submissionCount?: number;
    latestSubmission?: AssignmentSubmission | null;
    latestGrade?: AssignmentGrade | null;
}

export interface AssignmentSubmission {
    id: string;
    assignmentId: string;
    classId: string;
    studentUserId: string;
    attemptNo: number;
    sourceKind: SubmissionSourceKind;
    sourceChatId: string | null;
    sourceMessageId: string | null;
    evidenceSnapshot: Record<string, unknown>;
    reflectionText: string | null;
    submittedAt: string;
    status: AssignmentSubmissionRecordStatus;
    createdAt?: string;
    updatedAt?: string;
    studentName?: string;
    studentEmail?: string;
    studentAvatar?: string | null;
    grade?: AssignmentGrade | null;
}

export interface AssignmentGrade {
    id: string;
    submissionId: string;
    graderUserId: string;
    score: number;
    maxScore: number;
    rubric: unknown;
    teacherFeedback: string;
    aiFeedbackDraft: string | null;
    status: AssignmentGradeStatus;
    gradedAt: string;
    releasedAt: string | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface AssignmentDashboardSubmission {
    submissionId: string;
    assignmentId: string;
    studentUserId: string;
    studentName: string;
    submittedAt: string;
    gradeStatus: AssignmentGradeStatus | null;
    aiFeedbackDraft: string | null;
}

export interface AssignmentDashboardItem {
    assignment: Assignment;
    submissions: AssignmentDashboardSubmission[];
}

export interface AssignmentFeedbackSummary {
    assignment: Assignment | null;
    submission: AssignmentSubmission;
    grade: AssignmentGrade | null;
}

// 请求载荷：给 mutation 与流程层使用
export interface CreateAssignmentPayload {
    classId: string;
    title: string;
    instructions?: string;
    dueAt?: string | null;
    aiGradingEnabled?: boolean;
    status?: AssignmentStatus;
    attachments?: AssignmentAttachment[];
}

export interface SubmitAssignmentFromChatPayload {
    assignmentId: string;
    classId: string;
    sourceKind: SubmissionSourceKind;
    sourceChatId: string;
    sourceMessageId?: string;
    reflectionText?: string;
}

export interface GenerateGradeDraftPayload {
    submissionId: string;
    model?: string;
}

export interface SaveGradeReviewPayload {
    submissionId: string;
    score: number;
    maxScore: number;
    teacherFeedback: string;
    rubric?: unknown;
    aiFeedbackDraft?: string | null;
}

export interface ReleaseGradePayload {
    submissionId: string;
}

// 发布作业：保留两套字段，兼容当前 UI 与已有流程
export interface PublishAssignmentPayload {
    title: string;
    className: string;
    dueDate: string;
    dueTime: string;
    instructions: string;
    attachedFiles: File[];
    aiGradingEnabled: boolean;
}

export interface PublishAssignmentDraft {
    title: string;
    classId: string;
    dueDate: string;
    dueTime: string;
    instructions: string;
    files: File[];
    aiGradingEnabled: boolean;
}

// UI 组合类型：统一放这里，避免散落在各个文件
export interface AssignmentClassNameMap {
    [classId: string]: string;
}

export interface AssignmentClassOption {
    id: string;
    name: string;
}

export type SubmitAssignmentStatus = "pending" | "submitted" | "overdue";

export interface SubmitAssignmentViewModel {
    id: string;
    title: string;
    className: string;
    dueAt: string | null;
    instructions: string | null;
    attachments: AssignmentAttachment[];
    status: SubmitAssignmentStatus;
    latestAttemptNo: number;
    latestSubmittedAt: string | null;
    latestGrade: string | null;
    latestEvidenceSnapshot?: Record<string, unknown>;
    latestSubmissionId?: string;
}

export interface AssignmentSnapshotPreview {
    title: string;
    capturedAt: string | null;
    messages: Message[];
}

export interface ViewFeedbackGroupItem {
    submissionId: string;
    assignmentTitle: string;
    classId: string;
    className: string;
}

export interface ViewFeedbackGroup {
    classId: string;
    className: string;
    items: ViewFeedbackGroupItem[];
}

export type GradeActiveView = "classList" | "classDashboard" | "detail";

export interface GradeListViewClass {
    classId: string;
    name: string;
    studentCount: number;
    teacherCount: number;
}

export interface GradeAssignmentUIStateParams {
    teacherClasses: GradeListViewClass[];
    generatingGradeDraftIds: Set<string>;
    onGenerateGradeDraft: (
        submissionId: string,
        model?: string,
        options?: { silent?: boolean },
    ) => Promise<boolean>;
    onSaveGradeReview: (payload: SaveGradeReviewPayload) => Promise<boolean>;
    onReleaseGrade: (submissionId: string) => Promise<boolean>;
}

export interface AssignmentQueryOptions {
    staleTime?: number;
    refetchInterval?: number | false;
    refetchOnMount?: boolean | "always";
}
