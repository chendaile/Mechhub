import { getClassMembers } from "../../class/queries/ClassQueryHooks";
import { getAssignment, getFeedback, getSubmissions } from "../queries/assignmentQuery";

export const gradeDetailUIState = (classId: string, assignmentId: string) => {
    const assignments = getAssignment(classId).data ?? [];
    const assignment =
        assignments.find((item) => item.assignmentId === assignmentId) ?? null;
    const submissions = getSubmissions(classId, assignmentId).data ?? [];
    const feedback = getFeedback(classId, assignmentId).data ?? null;
    const { teachers, students } = getClassMembers(classId).data ?? {
        teachers: [],
        students: [],
    };

    const submittedStudentIds = new Set(
        submissions.map((submission) => submission.studentId),
    );

    const submittedStudents = students.filter((student) =>
        submittedStudentIds.has(student.userId),
    );

    const pendingStudents = students.filter(
        (student) => !submittedStudentIds.has(student.userId),
    );

    return {
        assignment,
        feedback,
        teachers,
        students,
        submissions,
        submittedStudents,
        pendingStudents,
    };
};
