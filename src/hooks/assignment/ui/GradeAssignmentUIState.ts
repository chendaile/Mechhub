import { useEffect, useRef, useState } from "react";
import { ClassMembersQuery } from "../../class/queries/ClassQueryHooks";
import {
    AssignmentSubmissionsQuery,
    ClassAssignmentDashboardQuery,
} from "../queries/AssignmentQueryHooks";
import type { GradeAssignmentUIStateParams, GradeActiveView } from "../types";
import { buildSnapshotPreview } from "./SubmitSnapshotPreviewUIState";

export const GradeAssignmentUIState = ({
    teacherClasses,
    generatingGradeDraftIds,
    onGenerateGradeDraft,
    onSaveGradeReview,
    onReleaseGrade,
}: GradeAssignmentUIStateParams) => {
    const [viewMode, setViewMode] = useState<GradeActiveView>("classList");
    const [activeClassId, setActiveClassId] = useState<string | null>(null);
    const [activeAssignmentId, setActiveAssignmentId] = useState<string | null>(null);
    const [activeSubmissionId, setActiveSubmissionId] = useState<string | null>(null);
    const [score, setScore] = useState(0);
    const [teacherFeedback, setTeacherFeedback] = useState("");
    // const autoDraftedRef = useRef<Set<string>>(new Set());

    const dashboardQuery = ClassAssignmentDashboardQuery(activeClassId ?? undefined);
    const classMembersQuery = ClassMembersQuery(activeClassId ?? undefined);

    const activeClass = teacherClasses.find((item) => item.classId === activeClassId) ?? null;

    const assignmentOptions = dashboardItems.map((item) => item.assignment);

    useEffect(() => {
        if (!teacherClasses.length) {
            setActiveClassId(null);
            setViewMode("classList");
            setActiveAssignmentId(null);
            setActiveSubmissionId(null);

            return;
        }

        if (activeClassId && !teacherClasses.some((item) => item.classId === activeClassId)) {
            setActiveClassId(null);
            setViewMode("classList");
            setActiveAssignmentId(null);
            setActiveSubmissionId(null);
        }
    }, [activeClassId, teacherClasses]);

    useEffect(() => {
        if (viewMode !== "detail") {
            return;
        }

        if (!assignmentOptions.length) {
            setActiveAssignmentId(null);

            return;
        }

        if (
            !activeAssignmentId ||
            !assignmentOptions.some((assignment) => assignment.id === activeAssignmentId)
        ) {
            setActiveAssignmentId(assignmentOptions[0].id);
        }
    }, [activeAssignmentId, assignmentOptions, viewMode]);

    const submissionsQuery = AssignmentSubmissionsQuery(
        activeAssignmentId ?? undefined,
        activeClassId ?? undefined,
        viewMode === "detail" && !!activeAssignmentId && !!activeClassId,
    );
    const submissions = submissionsQuery.data?.submissions ?? [];

    useEffect(() => {
        if (!submissions.length) {
            setActiveSubmissionId(null);

            return;
        }

        if (
            !activeSubmissionId ||
            !submissions.some((submission) => submission.id === activeSubmissionId)
        ) {
            setActiveSubmissionId(submissions[0].id);
        }
    }, [activeSubmissionId, submissions]);

    const activeSubmission =
        submissions.find((submission) => submission.id === activeSubmissionId) ?? null;

    const activeAssignment =
        assignmentOptions.find((assignment) => assignment.id === activeAssignmentId) ?? null;
    const aiGradingEnabled = activeAssignment?.aiGradingEnabled ?? false;

    const summary = (() => {
        const publishedCount = assignmentOptions.filter(
            (assignment) => assignment.status === "published",
        ).length;

        const closedCount = assignmentOptions.filter(
            (assignment) => assignment.status === "closed",
        ).length;

        const submissionCount = dashboardItems.reduce(
            (total, item) => total + item.submissions.length,
            0,
        );

        return { publishedCount, closedCount, submissionCount };
    })();

    const activeStudents = (() => {
        const students = classMembersQuery.data?.students ?? [];

        return students.filter((student) => student.status !== "removed");
    })();

    const dashboardCards = (() => {
        const activeStudentMap = new Map(
            activeStudents.map((student) => [student.userId, student]),
        );

        return dashboardItems.map((item) => {
            const submissionByStudent = new Map<string, (typeof item.submissions)[number]>();
            item.submissions.forEach((submission) => {
                if (!submission.studentUserId) {
                    return;
                }
                if (!submissionByStudent.has(submission.studentUserId)) {
                    submissionByStudent.set(submission.studentUserId, submission);
                }
            });

            const submittedStudents = Array.from(submissionByStudent.values()).map((submission) => {
                const studentMeta = activeStudentMap.get(submission.studentUserId);

                return {
                    id: submission.studentUserId,
                    name: studentMeta?.name || submission.studentName || "Unknown User",
                    avatar: studentMeta?.avatar ?? null,
                };
            });

            const missingStudents = activeStudents
                .filter((student) => !submissionByStudent.has(student.userId))
                .map((student) => ({
                    id: student.userId,
                    name: student.name || student.email || "Unknown User",
                    avatar: student.avatar ?? null,
                }));

            const uniqueSubmissions = Array.from(submissionByStudent.values());

            const aiCompletedCount = uniqueSubmissions.filter(
                (submission) => !!submission.aiFeedbackDraft?.trim(),
            ).length;

            const teacherNotManualCount = uniqueSubmissions.filter(
                (submission) =>
                    !!submission.aiFeedbackDraft?.trim() && submission.gradeStatus === "draft",
            ).length;

            const aiInProgressCount = uniqueSubmissions.filter((submission) =>
                generatingGradeDraftIds.has(submission.submissionId),
            ).length;

            const teacherManualCompletedCount = uniqueSubmissions.filter(
                (submission) => submission.gradeStatus === "released",
            ).length;

            return {
                id: item.assignment.id,
                title: item.assignment.title,
                status: item.assignment.status,
                dueAt: item.assignment.dueAt,
                submittedCount: submittedStudents.length,
                missingCount: missingStudents.length,
                aiCompletedCount,
                aiInProgressCount,
                teacherNotManualCount,
                teacherManualCompletedCount,
                submittedStudents,
                missingStudents,
            };
        });
    })();

    // 复用提交页的快照解析，减少重复逻辑
    const previewData = buildSnapshotPreview(activeSubmission?.evidenceSnapshot);

    useEffect(() => {
        if (!activeSubmission) {
            setScore(0);
            setMaxScore(100);
            setTeacherFeedback("");

            return;
        }

        setScore(activeSubmission.grade?.score ?? 0);
        setMaxScore(activeSubmission.grade?.maxScore ?? 100);
        setTeacherFeedback(activeSubmission.grade?.teacherFeedback ?? "");
    }, [activeSubmission]);

    useEffect(() => {
        if (viewMode !== "detail" || !activeSubmission || !aiGradingEnabled) {
            return;
        }

        if (activeSubmission.grade) {
            return;
        }

        if (autoDraftedRef.current.has(activeSubmission.id)) {
            return;
        }

        autoDraftedRef.current.add(activeSubmission.id);
        void (async () => {
            const success = await onGenerateGradeDraft(activeSubmission.id, undefined, {
                silent: true,
            });
            if (success) {
                await submissionsQuery.refetch();
            }
        })();
    }, [activeSubmission, aiGradingEnabled, onGenerateGradeDraft, submissionsQuery, viewMode]);

    const handleEnterClass = (classId: string) => {
        setActiveClassId(classId);
        setActiveAssignmentId(null);
        setActiveSubmissionId(null);
        setViewMode("classDashboard");
    };

    const handleBackToClassList = () => {
        setViewMode("classList");
        setActiveClassId(null);
        setActiveAssignmentId(null);
        setActiveSubmissionId(null);
    };

    const handleEnterDetail = (assignmentId: string) => {
        setActiveAssignmentId(assignmentId);
        setActiveSubmissionId(null);
        setViewMode("detail");
    };

    const handleBackToClassDashboard = () => {
        setViewMode("classDashboard");
        setActiveAssignmentId(null);
        setActiveSubmissionId(null);
    };

    const handleGenerateDraft = async () => {
        if (!activeSubmission) {
            return;
        }

        const success = await onGenerateGradeDraft(activeSubmission.id);
        if (success) {
            await submissionsQuery.refetch();
        }
    };

    const handleReleaseGrade = async () => {
        if (!activeSubmission) {
            return;
        }

        const saved = await onSaveGradeReview({
            submissionId: activeSubmission.id,
            score,
            maxScore,
            teacherFeedback,
            rubric: activeSubmission.grade?.rubric ?? [],
            aiFeedbackDraft: activeSubmission.grade?.aiFeedbackDraft,
        });

        if (!saved) {
            return;
        }

        const success = await onReleaseGrade(activeSubmission.id);
        if (success) {
            await submissionsQuery.refetch();
        }
    };

    return {
        mode: viewMode,
        summary,
        dashboardAssignments: dashboardCards,
        isDashboardLoading: dashboardQuery.isLoading,
        teacherClasses: teacherClasses.map((classItem) => ({
            id: classItem.classId,
            name: classItem.name,
            studentCount: classItem.studentCount,
            teacherCount: classItem.teacherCount,
        })),
        activeClassName: activeClass?.name ?? null,
        onEnterClass: handleEnterClass,
        onBackToClassList: handleBackToClassList,
        onEnterDetail: handleEnterDetail,
        onBackToClassDashboard: handleBackToClassDashboard,
        assignments: assignmentOptions.map((assignment) => ({
            id: assignment.id,
            title: assignment.title,
            submissionCount:
                dashboardItems.find((item) => item.assignment.id === assignment.id)?.submissions
                    .length ?? 0,
        })),
        activeAssignmentId,
        onSelectAssignment: setActiveAssignmentId,
        submissions: submissions.map((submission) => ({
            id: submission.id,
            studentName: submission.studentName ?? "Unknown User",
            submittedAt: submission.submittedAt,
            status: submission.grade?.status === "released" ? "released" : "draft",
            attemptNo: submission.attemptNo,
        })),
        activeSubmissionId,
        onSelectSubmission: setActiveSubmissionId,
        detail: activeSubmission
            ? {
                  submissionId: activeSubmission.id,
                  studentName: activeSubmission.studentName ?? "Unknown User",
                  submittedAt: activeSubmission.submittedAt,
                  reflectionText: activeSubmission.reflectionText,
                  score,
                  maxScore,
                  teacherFeedback,
                  releaseStatus: activeSubmission.grade?.status ?? "draft",
              }
            : null,
        previewTitle: previewData.title,
        previewCapturedAt: previewData.capturedAt,
        previewMessages: previewData.messages,
        hasPreview: previewData.messages.length > 0,
        aiGradingEnabled,
        isLoading: submissionsQuery.isLoading,
        onScoreChange: setScore,
        onMaxScoreChange: setMaxScore,
        onTeacherFeedbackChange: setTeacherFeedback,
        onGenerateDraft: handleGenerateDraft,
        onReleaseGrade: handleReleaseGrade,
    };
};
