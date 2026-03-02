import type { AssignmentClassNameMap, AssignmentClassOption } from "../types";

export const buildAssignmentClassNameMap = (
    classOptions: AssignmentClassOption[],
): AssignmentClassNameMap =>
    Object.fromEntries(classOptions.map((classItem) => [classItem.id, classItem.name]));
