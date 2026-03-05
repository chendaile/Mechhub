import type { ReactNode } from "react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AssignmentHubUIState } from "@hooks/assignment/ui/AssignmentHubUIState";
import type { ActiveView } from "@hooks/assignment/types";
import { SubmitAssignmentView } from "./SubmitAssignmentView";
import { PublishAssignmentView } from "./PublishAssignmentView";
import { GradeAssignmentView } from "./GradeAssignmentView";
import { ViewFeedbackView } from "./ViewFeedbackView";

type AssignmentHubViewProps = ReturnType<typeof AssignmentHubUIState> & {
    onFallbackToSubmit?: () => void;
};

const buildFileName = (url: string) => {
    try {
        const parsed = new URL(url);
        const lastSegment = parsed.pathname.split("/").filter(Boolean).pop();
        if (lastSegment) {
            return decodeURIComponent(lastSegment);
        }
    } catch {
        // ignore parse error
    }

    const fallback = url.split("/").filter(Boolean).pop();
    return fallback ? fallback : "附件";
};

const createAssignmentHubView = ({
    activeView,
    classes,
    submitState,
    feedbackState,
    publishState,
    gradeState,
    feedbackSelection,
    onFallbackToSubmit,
}: AssignmentHubViewProps) => {
    if (activeView === "Submit" && submitState) {
        const classNameLookup = new Map(
            classes.joined.map((item) => [item.classId, item.className]),
        );

        const assignmentItems = submitState.assignments.map((assignment) => ({
            id: assignment.assignmentId,
            title: assignment.assignmentName,
            className: classNameLookup.get(assignment.classId) ?? assignment.classId,
            dueAt: gradeState.buildDueAt(assignment.dueDate, assignment.dueTime),
            instructions: assignment.assignmentInstructure,
            attachments: assignment.attachmentUrls.map((url) => ({
                name: buildFileName(url),
                url,
            })),
            previewContent: null as ReactNode | null,
            hasPreview: false,
            status: "pending" as const,
            latestAttemptNo: 0,
            latestSubmittedAt: null,
            latestGrade: null,
        }));

        return (
            <SubmitAssignmentView
                assignments={assignmentItems}
                isSubmitting={submitState.isSubmitting}
            />
        );
    }

    if (activeView === "Publish" && publishState) {
        const classOptions = classes.teaching.map((item) => ({
            id: item.classId,
            name: item.className,
        }));

        return (
            <PublishAssignmentView
                title={publishState.assignmentName}
                setTitle={publishState.setAssignmentName}
                selectedClassId={publishState.classId}
                setSelectedClassId={publishState.setClassId}
                classOptions={classOptions}
                dueDate={publishState.dueDate}
                setDueDate={publishState.setDueDate}
                dueTime={publishState.dueTime}
                setDueTime={publishState.setDueTime}
                instructions={publishState.instructure}
                setInstructions={publishState.setInstructure}
                attachedFiles={publishState.attachments}
                onFileUpload={(file) =>
                    publishState.setAttachments([...publishState.attachments, file])
                }
                onRemoveFile={(index) =>
                    publishState.setAttachments(
                        publishState.attachments.filter((_, itemIndex) => itemIndex !== index),
                    )
                }
                aiGradingEnabled={publishState.enableAI}
                setAiGradingEnabled={publishState.setEnableAI}
                onPublish={publishState.togglePublishButton}
                isLoading={publishState.isPublishing}
            />
        );
    }

    if (activeView === "Feedback" && feedbackState) {
        const classNameLookup = new Map(
            classes.joined.map((item) => [item.classId, item.className]),
        );

        const classId = feedbackState.activeAssignment?.classId ?? classes.studentClassId;
        const className = classNameLookup.get(classId) ?? classId;
        const feedbackItems = (feedbackState.feedback ?? []).map((item) => ({
            submissionId: item.feedbackId,
            assignmentTitle:
                feedbackState.activeAssignment?.assignmentName ?? "作业反馈",
            classId,
            className,
        }));

        const groups =
            classId && className
                ? [
                      {
                          classId,
                          className,
                          items: feedbackItems,
                      },
                  ]
                : [];

        const activeFeedback =
            feedbackState.feedback?.find(
                (item) => item.feedbackId === feedbackSelection.feedbackSubmissionId,
            ) ?? null;

        const detail = activeFeedback
            ? {
                  assignmentTitle:
                      feedbackState.activeAssignment?.assignmentName ?? "作业反馈",
                  dueAt: gradeState.buildDueAt(
                      feedbackState.activeAssignment?.dueDate,
                      feedbackState.activeAssignment?.dueTime,
                  ),
                  submittedAt: new Date().toISOString(),
                  reflectionText: null,
                  teacherFeedback: activeFeedback.text,
                  aiFeedbackDraft: null,
                  score: `${activeFeedback.score}`,
                  rubric: null,
              }
            : null;

        return (
            <ViewFeedbackView
                groups={groups}
                activeSubmissionId={feedbackSelection.feedbackSubmissionId}
                onSelectSubmission={feedbackSelection.setFeedbackSubmissionId}
                detail={detail}
            />
        );
    }

    if (activeView === "Grade") {
        const teacherClasses = classes.teaching.map((item) => ({
            id: item.classId,
            name: item.className,
            studentCount: 0,
            teacherCount: 0,
        }));

        const assignments = gradeState.gradeClassState.assignments.map((assignment, index) => {
            const submissions = gradeState.gradeClassState.submissions[index] ?? [];
            return {
                id: assignment.assignmentId,
                title: assignment.assignmentName,
                submissionCount: submissions.length,
            };
        });

        const dashboardAssignments = gradeState.gradeClassState.assignments.map(
            (assignment, index) => {
                const submissions = gradeState.gradeClassState.submissions[index] ?? [];
                return {
                    id: assignment.assignmentId,
                    title: assignment.assignmentName,
                    status: "published" as const,
                    dueAt: gradeState.buildDueAt(assignment.dueDate, assignment.dueTime),
                    submittedCount: submissions.length,
                    missingCount: 0,
                    aiCompletedCount: 0,
                    aiInProgressCount: 0,
                    teacherNotManualCount: 0,
                    teacherManualCompletedCount: 0,
                    submittedStudents: [],
                    missingStudents: [],
                };
            },
        );

        const summary = {
            publishedCount: dashboardAssignments.length,
            closedCount: 0,
            submissionCount: assignments.reduce(
                (total, assignment) => total + assignment.submissionCount,
                0,
            ),
        };

        const activeAssignment =
            gradeState.gradeClassState.assignments.find(
                (assignment) => assignment.assignmentId === gradeState.gradeAssignmentId,
            ) ?? null;

        const submissions = gradeState.gradeDetailState.submissions.map((submission) => ({
            id: submission.studentId,
            studentName: submission.studentId,
            submittedAt: submission.submitTime,
            status: "draft" as const,
            attemptNo: 1,
        }));

        const selectedSubmission =
            gradeState.gradeDetailState.submissions.find(
                (submission) => submission.studentId === gradeState.gradeSubmissionId,
            ) ?? null;

        const selectedFeedback =
            gradeState.gradeDetailState.feedbacks.find(
                (feedback) =>
                    feedback.studentId === selectedSubmission?.studentId &&
                    feedback.who === "teacher",
            ) ?? null;

        const detail = selectedSubmission
            ? {
                  submissionId: selectedSubmission.studentId,
                  studentName: selectedSubmission.studentId,
                  submittedAt: selectedSubmission.submitTime,
                  reflectionText: selectedSubmission.introspection ?? null,
                  score: selectedFeedback?.score ?? gradeState.gradeDetailState.score,
                  teacherFeedback:
                      selectedFeedback?.text ?? gradeState.gradeDetailState.text,
                  releaseStatus: selectedFeedback ? ("released" as const) : ("draft" as const),
              }
            : null;

        const previewContent = (
            <div className="flex h-full items-center justify-center text-sm text-slate-500">
                暂无对话预览。
            </div>
        );

        return (
            <GradeAssignmentView
                mode={gradeState.gradeMode}
                summary={summary}
                dashboardAssignments={dashboardAssignments}
                isDashboardLoading={false}
                teacherClasses={teacherClasses}
                activeClassName={activeAssignment?.assignmentName ?? null}
                onEnterClass={(classId) => {
                    classes.setTeacherClassId(classId);
                    gradeState.setGradeMode("classDashboard");
                }}
                onBackToClassList={() => gradeState.setGradeMode("classList")}
                onEnterDetail={(assignmentId) => {
                    gradeState.setGradeAssignmentId(assignmentId);
                    gradeState.setGradeSubmissionId("");
                    gradeState.setGradeMode("detail");
                }}
                onBackToClassDashboard={() => {
                    gradeState.setGradeMode("classDashboard");
                    gradeState.setGradeSubmissionId("");
                }}
                assignments={assignments}
                activeAssignmentId={gradeState.gradeAssignmentId || null}
                onSelectAssignment={(assignmentId) => {
                    gradeState.setGradeAssignmentId(assignmentId);
                    gradeState.setGradeSubmissionId("");
                }}
                submissions={submissions}
                activeSubmissionId={gradeState.gradeSubmissionId || null}
                onSelectSubmission={gradeState.setGradeSubmissionId}
                detail={detail}
                previewTitle={activeAssignment?.assignmentName ?? "作业预览"}
                previewCapturedAt={null}
                previewContent={previewContent}
                hasPreview={false}
                aiGradingEnabled={activeAssignment?.enableAI ?? true}
                isLoading={false}
                isGeneratingDraft={false}
                isReleasingGrade={false}
                onScoreChange={gradeState.gradeDetailState.setScore}
                onTeacherFeedbackChange={gradeState.gradeDetailState.setText}
                onGenerateDraft={() => {
                    // placeholder for AI grading draft
                }}
                onReleaseGrade={async () => {
                    if (!selectedSubmission) {
                        return;
                    }
                    await gradeState.gradeDetailState.releaseFeedback(
                        selectedSubmission.studentId,
                    );
                }}
            />
        );
    }

    return (
        <div className="flex h-full items-center justify-center text-sm text-slate-500">
            当前模块未准备好。
            <button
                type="button"
                onClick={() => onFallbackToSubmit?.()}
                className="ml-3 rounded-full border border-slate-300 px-3 py-1 text-xs text-slate-600"
            >
                返回作业提交
            </button>
        </div>
    );
};

const resolveAssignmentPath = (view: ActiveView) => {
    switch (view) {
        case "Publish":
            return "/app/assignment/publish";
        case "Feedback":
            return "/app/assignment/feedback";
        case "Grade":
            return "/app/assignment/grade";
        case "Submit":
        default:
            return "/app/assignment/submit";
    }
};

export const AssignmentHubView = ({ forcedActiveView }: { forcedActiveView?: ActiveView }) => {
    const state = AssignmentHubUIState(forcedActiveView);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (forcedActiveView) {
            return;
        }
        const isRootAssignment =
            location.pathname === "/app/assignment" || location.pathname === "/app/assignment/";
        if (isRootAssignment) {
            navigate(resolveAssignmentPath(state.activeView), { replace: true });
        }
    }, [forcedActiveView, location.pathname, navigate, state.activeView]);

    return createAssignmentHubView({
        ...state,
        onFallbackToSubmit: () => navigate(resolveAssignmentPath("Submit")),
    });
};
