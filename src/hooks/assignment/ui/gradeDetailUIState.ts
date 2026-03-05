import { useState } from "react";
import { feedbackPush } from "../queries/assignmentMutation";
import { getFeedback, getSubmissions } from "../queries/assignmentQuery";

export const gradeDetailUIState = (classId: string, assignmentId: string) => {
    const submissions = getSubmissions(classId, assignmentId).data ?? [];
    const feedbacks = getFeedback(classId, assignmentId).data ?? [];

    const [score, setScore] = useState<number>(60);
    const [text, setText] = useState<string>("");
    const releaseFeedback = async (studentId: string) => {
        await feedbackPush().mutateAsync({
            who: "teacher",
            classId,
            studentId,
            score,
            assignmentId,
            text,
        });
    };

    return { submissions, feedbacks, releaseFeedback, score, setScore, text, setText };
};
