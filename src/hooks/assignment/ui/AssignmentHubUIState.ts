import { useEffect, useMemo, useState } from "react";
import type { ActiveView } from "../types";
import { submitUIState } from "./submitUIState";
import { publishUIState } from "./publishUIState";
import { feedbackUIState } from "./feedbackUIState";
import { gradeConsoleUIState } from "./gradeConsoleUIState";
import { gradeClassUIState } from "./gradeClassUIState";
import { gradeDetailUIState } from "./gradeDetailUIState";
import { getMyClass } from "../../class/queries/ClassQueryHooks";

type GradeMode = "classList" | "classDashboard" | "detail";

const resolveDefaultView = (
    teachingCount: number,
    joinedCount: number,
    fallback: ActiveView = "Submit",
): ActiveView => {
    if (teachingCount > 0) {
        return "Publish";
    }
    if (joinedCount > 0) {
        return "Submit";
    }
    return fallback;
};

const buildDueAt = (date?: string | null, time?: string | null) => {
    if (!date) {
        return null;
    }
    if (!time) {
        return date;
    }
    return `${date}T${time}`;
};

export const AssignmentHubUIState = (forcedView?: ActiveView) => {
    const { teachingClasses, joinedClasses } = getMyClass().data ?? {
        teachingClasses: [],
        joinedClasses: [],
    };
    const defaultView = useMemo(
        () => resolveDefaultView(teachingClasses.length, joinedClasses.length),
        [teachingClasses.length, joinedClasses.length],
    );
    const resolvedActiveView = forcedView ?? defaultView;

    const [studentClassId, setStudentClassId] = useState<string>("");
    const [teacherClassId, setTeacherClassId] = useState<string>("");
    const [gradeMode, setGradeMode] = useState<GradeMode>("classList");
    const [gradeAssignmentId, setGradeAssignmentId] = useState<string>("");
    const [gradeSubmissionId, setGradeSubmissionId] = useState<string>("");
    const [feedbackSubmissionId, setFeedbackSubmissionId] = useState<string | null>(null);

    useEffect(() => {
        if (!studentClassId && joinedClasses.length > 0) {
            setStudentClassId(joinedClasses[0].classId);
        }
        if (!teacherClassId && teachingClasses.length > 0) {
            setTeacherClassId(teachingClasses[0].classId);
        }
    }, [joinedClasses, studentClassId, teachingClasses, teacherClassId]);

    useEffect(() => {
        if (resolvedActiveView !== "Grade") {
            setGradeMode("classList");
            setGradeAssignmentId("");
            setGradeSubmissionId("");
        }
        if (resolvedActiveView !== "Feedback") {
            setFeedbackSubmissionId(null);
        }
    }, [resolvedActiveView]);

    const submitState = submitUIState(resolvedActiveView, studentClassId);
    const feedbackState = feedbackUIState(resolvedActiveView, studentClassId);
    const publishState = publishUIState(resolvedActiveView);
    const gradeConsoleState = gradeConsoleUIState(resolvedActiveView);
    const gradeClassState = gradeClassUIState(teacherClassId);
    const gradeDetailState = gradeDetailUIState(teacherClassId, gradeAssignmentId);

    return {
        activeView: resolvedActiveView,
        classes: {
            teaching: teachingClasses,
            joined: joinedClasses,
            studentClassId,
            setStudentClassId,
            teacherClassId,
            setTeacherClassId,
        },
        submitState,
        feedbackState,
        publishState,
        gradeState: {
            gradeMode,
            setGradeMode,
            gradeAssignmentId,
            setGradeAssignmentId,
            gradeSubmissionId,
            setGradeSubmissionId,
            gradeConsoleState,
            gradeClassState,
            gradeDetailState,
            buildDueAt,
        },
        feedbackSelection: {
            feedbackSubmissionId,
            setFeedbackSubmissionId,
        },
    };
};
