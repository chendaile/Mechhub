export interface LandingFeatureItem {
    id: "systems" | "assignment" | "analytics";
    title: string;
    description: string;
}

export const ecosystemFeatures: LandingFeatureItem[] = [
    {
        id: "systems",
        title: "Student/Teacher Systems",
        description:
            "Comprehensive role-aware collaboration for students and teachers in a unified learning workspace.",
    },
    {
        id: "assignment",
        title: "Assignment Tracking",
        description:
            "Track assignment lifecycle from publishing to submission review with clear status and progress signals.",
    },
    {
        id: "analytics",
        title: "Performance Analytics",
        description:
            "Evaluate growth with concise analytics across students, classes, and mechanics learning milestones.",
    },
];

export const teachingContent = {
    title: "AI-Powered Teaching",
    description:
        "Structured lesson generation for Lagrangian mechanics, combining clear theory flow with practical class-ready activities.",
    teacherPrompt: "Can you generate a lesson plan on Lagrangian mechanics?",
    aiSummary: "Structured lesson plan for Lagrangian mechanics with objectives and resources.",
    objectives: [
        "Introduce generalized coordinates and degrees of freedom.",
        "Derive Euler-Lagrange equations from the principle of least action.",
    ],
    resources: [
        "Visualizing potential energy surfaces (interactive graph).",
        "Problem set: simple pendulum and double pendulum.",
    ],
};

export const gradingContent = {
    title: "Automated Grading",
    description:
        "AI-analyzed derivation review with immediate correction notes and scoring feedback for mechanics assignments.",
    annotations: [
        "Check sign convention in force direction.",
        "Define the coordinate system origin before substitution.",
        "Final period derivation is correct after correction.",
    ],
    corrections: [
        "Use clockwise moments as negative in line 3.",
        "Make the force direction explicit in step 2.",
        "Retain units through each simplification step.",
    ],
    gradeLabel: "Final grade",
    gradeValue: "4.0/4.0",
};
