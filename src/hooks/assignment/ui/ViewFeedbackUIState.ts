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
    // 反馈列表按班级分组，供左侧导航直接渲染
    const groups = new Map<string, ViewFeedbackGroup>();

    feedbackList.forEach((feedback) => {
        const classId = resolveFeedbackClassId(feedback);
        const className = classNameById[classId] ?? DEFAULT_CLASS_NAME;

        const currentGroup = groups.get(classId);
        const nextItem: ViewFeedbackGroupItem = {
            submissionId: feedback.submission.id,
            assignmentTitle: feedback.assignment?.title ?? DEFAULT_ASSIGNMENT_NAME,
            classId,
            className,
        };

        if (!currentGroup) {
            groups.set(classId, {
                classId,
                className,
                items: [nextItem],
            });
            return;
        }

        currentGroup.items.push(nextItem);
    });

    return Array.from(groups.values());
};
