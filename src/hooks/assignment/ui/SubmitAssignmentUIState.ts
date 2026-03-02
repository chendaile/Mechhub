import type {
    Assignment,
    AssignmentClassNameMap,
    AssignmentGrade,
    SubmitAssignmentStatus,
    SubmitAssignmentViewModel,
} from "../types";

const DEFAULT_CLASS_NAME = "未命名班级";

const resolveAssignmentStatus = (assignment: Assignment): SubmitAssignmentStatus => {
    // 仅保留三态：未交、已交、逾期未交
    const dueAt = assignment.dueAt ? new Date(assignment.dueAt) : null;
    const isOverdue = !!dueAt && dueAt.getTime() < Date.now();
    const hasSubmission = !!assignment.latestSubmission;

    if (isOverdue && !hasSubmission) {
        return "overdue";
    }

    return hasSubmission ? "submitted" : "pending";
};

const toDisplayGrade = (grade: AssignmentGrade | null | undefined) => {
    if (!grade) {
        return null;
    }

    return `${grade.score}/${grade.maxScore}`;
};

export const buildSubmitAssignmentViewModel = (
    assignments: Assignment[],
    classNameById: AssignmentClassNameMap,
): SubmitAssignmentViewModel[] =>
    assignments.map((assignment) => ({
        id: assignment.id,
        title: assignment.title,
        className: classNameById[assignment.classId] ?? DEFAULT_CLASS_NAME,
        dueAt: assignment.dueAt,
        instructions: assignment.instructions,
        attachments: assignment.attachments ?? [],
        status: resolveAssignmentStatus(assignment),
        latestAttemptNo: assignment.latestSubmission?.attemptNo ?? 0,
        latestSubmittedAt: assignment.latestSubmission?.submittedAt ?? null,
        latestGrade: toDisplayGrade(assignment.latestGrade),
        latestEvidenceSnapshot: assignment.latestSubmission?.evidenceSnapshot ?? undefined,
        latestSubmissionId: assignment.latestSubmission?.id,
    }));
