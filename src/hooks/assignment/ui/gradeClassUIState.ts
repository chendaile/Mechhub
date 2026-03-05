import { getAssignment, getSubmissions } from "../queries/assignmentQuery";

export const gradeClassUIState = (classId: string) => {
    const assignments = getAssignment(classId).data ?? [];
    const submissions = assignments.map(
        (item) => getSubmissions(classId, item.assignmentId).data ?? [],
    );

    return {
        assignments,
        submissions,
    };
};
