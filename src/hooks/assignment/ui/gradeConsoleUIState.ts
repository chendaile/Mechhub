import { ActiveView } from "../types";
import { getMyClass } from "../../class/queries/ClassQueryHooks";

export const gradeConsoleUIState = (activeView: ActiveView) => {
    if (activeView !== "Grade") {
        return null;
    }
    const { teachingClasses, joinedClasses } = getMyClass()?.data ?? {
        teachingClasses: [],
        joinedClasses: [],
    };

    return { teachingClasses, joinedClasses };
};
