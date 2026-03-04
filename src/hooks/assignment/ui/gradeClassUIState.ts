import { getAssignment, getSubmissions } from "../queries/assignmentQuery";

export const gradeClassUIState = (classId: string) => {
    const assignments = getAssignment(classId).data ?? [];
    const activeAssignmentId = assignments[0]?.assignmentId ?? "";
    const activeAssignment =
        assignments.find((assignment) => assignment.assignmentId === activeAssignmentId) ?? null;
    const submissions = getSubmissions(classId, activeAssignmentId).data ?? [];

    return {
        assignments,
        activeAssignmentId,
        activeAssignment,
        submissions,
    };
};
