import { useEffect, useState } from "react";
import { getMyClass } from "../../class/queries/ClassQueryHooks";
import { getAssignment, getFeedback } from "../queries/assignmentQuery";
import { ActiveView } from "../types";

export const feedbackUIState = (activeView: ActiveView, classId: string) => {
    const { joinedClasses } = getMyClass().data ?? {
        teachingClasses: [],
        joinedClasses: [],
    };
    const assignments = getAssignment(classId).data ?? [];
    const [assignmentId, setAssignmentId] = useState<string>("");

    useEffect(() => {
        if (assignments.length === 0) {
            if (assignmentId) {
                setAssignmentId("");
            }

            return;
        }

        const hasActiveAssignment = assignments.some(
            (assignment) => assignment.assignmentId === assignmentId,
        );

        if (!hasActiveAssignment) {
            setAssignmentId(assignments[0].assignmentId);
        }
    }, [assignmentId, assignments]);

    const activeAssignment =
        assignments.find((assignment) => assignment.assignmentId === assignmentId) ?? null;
    const feedback = getFeedback(classId, assignmentId).data ?? null;

    if (activeView !== "Feedback") {
        return null;
    }

    return {
        joinedClasses,
        assignments,
        assignmentId,
        setAssignmentId,
        activeAssignment,
        feedback,
        hasFeedback: !!feedback,
    };
};
