import { useEffect, useRef, useState } from "react";
import { ClassMembersQuery } from "../../class/queries/ClassQueryHooks";
import {
    TeacherAssignmentSubmissionsQuery,
    TeacherSubmissionOverviewQuery,
} from "../queries/AssignmentQueryHooks";
import type {
    AssignmentDashboardItem,
    AssignmentDashboardSubmission,
    AssignmentSubmission,
    GradeAssignmentUIStateParams,
    GradeActiveView,
    GradeListViewClass,
} from "../types";
import { buildSnapshotPreview } from "./SubmitSnapshotPreviewUIState";

const EMPTY_SUMMARY = {
    publishedCount: 0,
    closedCount: 0,
    submissionCount: 0,
};

const getAssignmentSubmissionCount = (dashboardItems: AssignmentDashboardItem[], assignmentId: string) =>
    dashboardItems.find((item) => item.assignment.id === assignmentId)?.submissions.length ?? 0;

const buildDashboardStudents = (
    submissions: AssignmentDashboardSubmission[],
    activeStudents: Array<{
        userId: string;
        name: string;
        email: string;
        avatar?: string | null;
    }>,
) => {
    const activeStudentMap = new Map(activeStudents.map((student) => [student.userId, student]));
    const submissionByStudent = new Map<string, AssignmentDashboardSubmission>();

    submissions.forEach((submission) => {
        if (!submission.studentUserId || submissionByStudent.has(submission.studentUserId)) {
            return;
        }

        submissionByStudent.set(submission.studentUserId, submission);
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

    return {
        uniqueSubmissions: Array.from(submissionByStudent.values()),
        submittedStudents,
        missingStudents,
    };
};

const getDetailReleaseStatus = (
    submission: AssignmentSubmission | null,
): "draft" | "released" => (submission?.grade?.status === "released" ? "released" : "draft");

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
    const [maxScore, setMaxScore] = useState(100);
    const [teacherFeedback, setTeacherFeedback] = useState("");
    const autoDraftedRef = useRef<Set<string>>(new Set());

    const dashboardQuery = TeacherSubmissionOverviewQuery(
        activeClassId ?? undefined,
        viewMode !== "classList",
    );
    const classMembersQuery = ClassMembersQuery(activeClassId);
    const dashboardItems = dashboardQuery?.data ?? [];
    const activeClass = teacherClasses.find((item) => item.id === activeClassId) ?? null;
    const assignmentOptions = dashboardItems.map((item) => item.assignment);

    useEffect(() => {
        if (!teacherClasses.length) {
            setActiveClassId(null);
            setActiveAssignmentId(null);
            setActiveSubmissionId(null);
            setViewMode("classList");

            return;
        }

        if (activeClassId && !teacherClasses.some((item) => item.id === activeClassId)) {
            setActiveClassId(null);
            setActiveAssignmentId(null);
            setActiveSubmissionId(null);
            setViewMode("classList");
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

        if (!activeAssignmentId || !assignmentOptions.some((item) => item.id === activeAssignmentId)) {
            setActiveAssignmentId(assignmentOptions[0].id);
        }
    }, [activeAssignmentId, assignmentOptions, viewMode]);

    const submissionsQuery = TeacherAssignmentSubmissionsQuery(
        activeAssignmentId ?? undefined,
        activeClassId ?? undefined,
        viewMode === "detail" && !!activeAssignmentId && !!activeClassId,
    );
    const submissions = submissionsQuery?.data ?? [];

    useEffect(() => {
        if (!submissions.length) {
            setActiveSubmissionId(null);

            return;
        }

        if (!activeSubmissionId || !submissions.some((item) => item.id === activeSubmissionId)) {
            setActiveSubmissionId(submissions[0].id);
        }
    }, [activeSubmissionId, submissions]);

    const activeSubmission = submissions.find((item) => item.id === activeSubmissionId) ?? null;
    const activeAssignment =
        assignmentOptions.find((assignment) => assignment.id === activeAssignmentId) ?? null;
    const aiGradingEnabled = activeAssignment?.aiGradingEnabled ?? false;

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
        if (!activeSubmission || !aiGradingEnabled || viewMode !== "detail") {
            return;
        }

        if (activeSubmission.grade || generatingGradeDraftIds.has(activeSubmission.id)) {
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
                await submissionsQuery?.refetch();
            }
        })();
    }, [
        activeSubmission,
        aiGradingEnabled,
        generatingGradeDraftIds,
        onGenerateGradeDraft,
        submissionsQuery,
        viewMode,
    ]);

    const summary =
        dashboardItems.length === 0
            ? EMPTY_SUMMARY
            : {
                  publishedCount: assignmentOptions.filter(
                      (assignment) => assignment.status === "published",
                  ).length,
                  closedCount: assignmentOptions.filter(
                      (assignment) => assignment.status === "closed",
                  ).length,
                  submissionCount: dashboardItems.reduce(
                      (total, item) => total + item.submissions.length,
                      0,
                  ),
              };

    const activeStudents = classMembersQuery?.data?.students ?? [];
    const dashboardAssignments = dashboardItems.map((item) => {
        const { uniqueSubmissions, submittedStudents, missingStudents } = buildDashboardStudents(
            item.submissions,
            activeStudents,
        );

        return {
            id: item.assignment.id,
            title: item.assignment.title,
            status: item.assignment.status,
            dueAt: item.assignment.dueAt,
            submittedCount: submittedStudents.length,
            missingCount: missingStudents.length,
            aiCompletedCount: uniqueSubmissions.filter((submission) =>
                !!submission.aiFeedbackDraft?.trim(),
            ).length,
            aiInProgressCount: uniqueSubmissions.filter((submission) =>
                generatingGradeDraftIds.has(submission.submissionId),
            ).length,
            teacherNotManualCount: uniqueSubmissions.filter(
                (submission) =>
                    !!submission.aiFeedbackDraft?.trim() && submission.gradeStatus === "draft",
            ).length,
            teacherManualCompletedCount: uniqueSubmissions.filter(
                (submission) => submission.gradeStatus === "released",
            ).length,
            submittedStudents,
            missingStudents,
        };
    });

    const previewData = buildSnapshotPreview(activeSubmission?.evidenceSnapshot);

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
            await submissionsQuery?.refetch();
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
            aiFeedbackDraft: activeSubmission.grade?.aiFeedbackDraft ?? null,
        });

        if (!saved) {
            return;
        }

        const released = await onReleaseGrade(activeSubmission.id);
        if (released) {
            await submissionsQuery?.refetch();
        }
    };

    return {
        mode: viewMode,
        summary,
        dashboardAssignments,
        isDashboardLoading: dashboardQuery?.isLoading ?? false,
        teacherClasses: teacherClasses.map((classItem: GradeListViewClass) => ({
            id: classItem.id,
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
            submissionCount: getAssignmentSubmissionCount(dashboardItems, assignment.id),
        })),
        activeAssignmentId,
        onSelectAssignment: setActiveAssignmentId,
        submissions: submissions.map((submission) => ({
            id: submission.id,
            studentName: submission.studentName ?? "Unknown User",
            submittedAt: submission.submittedAt,
            status:
                submission.grade?.status === "released"
                    ? ("released" as const)
                    : ("draft" as const),
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
                  releaseStatus: getDetailReleaseStatus(activeSubmission),
              }
            : null,
        previewTitle: previewData.title,
        previewCapturedAt: previewData.capturedAt,
        previewMessages: previewData.messages,
        hasPreview: previewData.messages.length > 0,
        aiGradingEnabled,
        isLoading: submissionsQuery?.isLoading ?? false,
        onScoreChange: setScore,
        onMaxScoreChange: setMaxScore,
        onTeacherFeedbackChange: setTeacherFeedback,
        onGenerateDraft: handleGenerateDraft,
        onReleaseGrade: handleReleaseGrade,
    };
};
