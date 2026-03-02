import { useMemo, useState } from "react";
import type { AssignmentFeedbackSummary } from "../../hooks/assignment/types";
import { buildViewFeedbackGroups } from "../../hooks/assignment/ui/ViewFeedbackUIState";
import { ViewFeedbackView } from "@views/assignment";

interface ViewFeedbackPresenterProps {
    feedbackList: AssignmentFeedbackSummary[];
    classNameById: Record<string, string>;
}

const toDisplayScore = (summary: AssignmentFeedbackSummary) => {
    if (!summary.grade) {
        return "未发布";
    }

    return `${summary.grade.score}/${summary.grade.maxScore}`;
};

export const ViewFeedbackPresenter = ({
    feedbackList,
    classNameById,
}: ViewFeedbackPresenterProps) => {
    const [activeSubmissionId, setActiveSubmissionId] = useState<string | null>(
        feedbackList[0]?.submission.id ?? null,
    );

    const activeItem = useMemo(
        () => feedbackList.find((item) => item.submission.id === activeSubmissionId) ?? null,
        [activeSubmissionId, feedbackList],
    );

    const groupedItems = useMemo(
        () => buildViewFeedbackGroups(feedbackList, classNameById),
        [classNameById, feedbackList],
    );

    return (
        <ViewFeedbackView
            groups={groupedItems}
            activeSubmissionId={activeSubmissionId}
            onSelectSubmission={setActiveSubmissionId}
            detail={
                activeItem
                    ? {
                          assignmentTitle: activeItem.assignment?.title ?? "未命名作业",
                          dueAt: activeItem.assignment?.dueAt ?? null,
                          submittedAt: activeItem.submission.submittedAt,
                          reflectionText: activeItem.submission.reflectionText,
                          teacherFeedback: activeItem.grade?.teacherFeedback ?? "",
                          aiFeedbackDraft: activeItem.grade?.aiFeedbackDraft ?? null,
                          score: toDisplayScore(activeItem),
                          rubric: activeItem.grade?.rubric ?? [],
                      }
                    : null
            }
        />
    );
};
