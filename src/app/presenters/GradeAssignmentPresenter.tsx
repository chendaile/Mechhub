import type { ClassSummary } from "../../hooks/class/types";
import type { SaveGradeReviewPayload } from "../../hooks/assignment/types";
import { GradeAssignmentUIState } from "../../hooks/assignment/ui/GradeAssignmentUIState";
import { GradeAssignmentView } from "@views/assignment";
import { MessageListPresenter } from "./MessageListPresenter";

interface GradeAssignmentPresenterProps {
    teacherClasses: ClassSummary[];
    generatingGradeDraftIds: Set<string>;
    onGenerateGradeDraft: (
        submissionId: string,
        model?: string,
        options?: { silent?: boolean },
    ) => Promise<boolean>;
    onSaveGradeReview: (payload: SaveGradeReviewPayload) => Promise<boolean>;
    onReleaseGrade: (submissionId: string) => Promise<boolean>;
    isGeneratingDraft: boolean;
    isSavingReview: boolean;
    isReleasingGrade: boolean;
}

export const GradeAssignmentPresenter = ({
    teacherClasses,
    generatingGradeDraftIds,
    onGenerateGradeDraft,
    onSaveGradeReview,
    onReleaseGrade,
    isGeneratingDraft,
    isSavingReview,
    isReleasingGrade,
}: GradeAssignmentPresenterProps) => {
    const state = GradeAssignmentUIState({
        teacherClasses,
        generatingGradeDraftIds,
        onGenerateGradeDraft,
        onSaveGradeReview,
        onReleaseGrade,
    });

    return (
        <GradeAssignmentView
            mode={state.mode}
            summary={state.summary}
            dashboardAssignments={state.dashboardAssignments}
            isDashboardLoading={state.isDashboardLoading}
            teacherClasses={state.teacherClasses}
            activeClassName={state.activeClassName}
            onEnterClass={state.onEnterClass}
            onBackToClassList={state.onBackToClassList}
            onEnterDetail={state.onEnterDetail}
            onBackToClassDashboard={state.onBackToClassDashboard}
            assignments={state.assignments}
            activeAssignmentId={state.activeAssignmentId}
            onSelectAssignment={state.onSelectAssignment}
            submissions={state.submissions}
            activeSubmissionId={state.activeSubmissionId}
            onSelectSubmission={state.onSelectSubmission}
            detail={state.detail}
            previewTitle={state.previewTitle}
            previewCapturedAt={state.previewCapturedAt}
            previewContent={
                <MessageListPresenter
                    messages={state.previewMessages}
                    isTyping={false}
                    sessionId={state.activeSubmissionId ?? "preview"}
                    showActions={false}
                    className="h-full overflow-y-auto overflow-x-hidden bg-slate-50 px-6 py-4"
                    contentClassName="space-y-4"
                />
            }
            hasPreview={state.hasPreview}
            aiGradingEnabled={state.aiGradingEnabled}
            isLoading={state.isLoading}
            isGeneratingDraft={isGeneratingDraft}
            isSavingReview={isSavingReview}
            isReleasingGrade={isReleasingGrade}
            onScoreChange={state.onScoreChange}
            onMaxScoreChange={state.onMaxScoreChange}
            onTeacherFeedbackChange={state.onTeacherFeedbackChange}
            onGenerateDraft={state.onGenerateDraft}
            onReleaseGrade={state.onReleaseGrade}
        />
    );
};
