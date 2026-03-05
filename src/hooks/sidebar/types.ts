export interface SidebarClassThread {
    id: string;
    classId: string;
    title: string;
}

export interface SidebarClassGroup {
    classId: string;
    className: string;
    role: "teacher" | "student";
    threads: SidebarClassThread[];
}

export type SidebarAssignmentActionViewKey =
    | "submitAssignment"
    | "viewFeedback"
    | "publishAssignment"
    | "gradeAssignment";

export type SidebarActionAudience = "student" | "teacher";

export interface SidebarAssignmentAction {
    key: SidebarAssignmentActionViewKey;
    label: string;
    audience: SidebarActionAudience;
    onClick: () => void;
}

export interface SidebarWidthConfig {
    min: number;
    max: number;
    fallback: number;
}
