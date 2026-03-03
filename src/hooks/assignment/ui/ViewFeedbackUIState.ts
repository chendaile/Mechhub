import type {
    AssignmentClassNameMap,
    AssignmentFeedbackSummary,
    ViewFeedbackGroup,
    ViewFeedbackGroupItem,
} from "../types";

const DEFAULT_CLASS_NAME = "未命名班级";
const DEFAULT_ASSIGNMENT_NAME = "未命名作业";

const resolveFeedbackClassId = (feedback: AssignmentFeedbackSummary) =>
    feedback.assignment?.classId || feedback.submission.classId || "unknown";

export const buildViewFeedbackGroups = (
    feedbackList: AssignmentFeedbackSummary[],
    classNameById: AssignmentClassNameMap,
): ViewFeedbackGroup[] => {
    const groups = new Map<string, ViewFeedbackGroup>();

    feedbackList.forEach((feedback) => {
        const classId = resolveFeedbackClassId(feedback);
        const className = classNameById[classId] ?? DEFAULT_CLASS_NAME;
        const item: ViewFeedbackGroupItem = {
            submissionId: feedback.submission.id,
            assignmentTitle: feedback.assignment?.title ?? DEFAULT_ASSIGNMENT_NAME,
            classId,
            className,
        };

        const existingGroup = groups.get(classId);
        if (!existingGroup) {
            groups.set(classId, {
                classId,
                className,
                items: [item],
            });

            return;
        }

        existingGroup.items.push(item);
    });

    return Array.from(groups.values())
        .map((group) => ({
            ...group,
            items: group.items.slice().sort((left, right) =>
                left.assignmentTitle.localeCompare(right.assignmentTitle, "zh-CN"),
            ),
        }))
        .sort((left, right) => left.className.localeCompare(right.className, "zh-CN"));
};
