import { useEffect, useRef, useState, type ReactNode } from "react";
import { Button } from "../shared/ui/button";

interface GradeAssignmentItem {
    id: string;
    title: string;
    submissionCount: number;
}

interface GradeDashboardStudent {
    id: string;
    name: string;
    avatar?: string | null;
}

interface GradeDashboardAssignment {
    id: string;
    title: string;
    status: "draft" | "published" | "closed";
    dueAt: string | null;
    submittedCount: number;
    missingCount: number;
    aiCompletedCount: number;
    aiInProgressCount: number;
    teacherNotManualCount: number;
    teacherManualCompletedCount: number;
    submittedStudents: GradeDashboardStudent[];
    missingStudents: GradeDashboardStudent[];
}

interface GradeSubmissionItem {
    id: string;
    studentName: string;
    submittedAt: string;
    status: "draft" | "released";
    attemptNo: number;
}

interface GradeSubmissionDetail {
    submissionId: string;
    studentName: string;
    submittedAt: string;
    reflectionText: string | null;
    score: number;
    maxScore: number;
    teacherFeedback: string;
    releaseStatus: "draft" | "released";
}

interface GradeAssignmentSummary {
    publishedCount: number;
    closedCount: number;
    submissionCount: number;
}

interface GradeAssignmentViewProps {
    mode: "classList" | "classDashboard" | "detail";
    summary: GradeAssignmentSummary;
    dashboardAssignments: GradeDashboardAssignment[];
    isDashboardLoading: boolean;
    teacherClasses: Array<{
        id: string;
        name: string;
        studentCount: number;
        teacherCount: number;
    }>;
    activeClassName: string | null;
    onEnterClass: (classId: string) => void;
    onBackToClassList: () => void;
    onEnterDetail: (assignmentId: string) => void;
    onBackToClassDashboard: () => void;
    assignments: GradeAssignmentItem[];
    activeAssignmentId: string | null;
    onSelectAssignment: (assignmentId: string) => void;
    submissions: GradeSubmissionItem[];
    activeSubmissionId: string | null;
    onSelectSubmission: (submissionId: string) => void;
    detail: GradeSubmissionDetail | null;
    previewTitle: string;
    previewCapturedAt: string | null;
    previewContent: ReactNode;
    hasPreview: boolean;
    aiGradingEnabled: boolean;
    isLoading: boolean;
    isGeneratingDraft: boolean;
    isSavingReview: boolean;
    isReleasingGrade: boolean;
    onScoreChange: (score: number) => void;
    onMaxScoreChange: (score: number) => void;
    onTeacherFeedbackChange: (text: string) => void;
    onGenerateDraft: () => void;
    onReleaseGrade: () => void;
}

const statusLabel: Record<GradeDashboardAssignment["status"], string> = {
    draft: "草稿",
    published: "已发布",
    closed: "已关闭",
};

const statusClass: Record<GradeDashboardAssignment["status"], string> = {
    draft: "bg-amber-100 text-amber-700",
    published: "bg-emerald-100 text-emerald-700",
    closed: "bg-slate-200 text-slate-600",
};

const formatDateTime = (value?: string | null) => {
    if (!value) {
        return "未设置";
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return "未设置";
    }

    return date.toLocaleString();
};

const buildInitial = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) {
        return "?";
    }

    return trimmed.charAt(0).toUpperCase();
};

export const GradeAssignmentView = ({
    mode,
    summary,
    dashboardAssignments,
    isDashboardLoading,
    teacherClasses,
    activeClassName,
    onEnterClass,
    onBackToClassList,
    onEnterDetail,
    onBackToClassDashboard,
    assignments,
    activeAssignmentId,
    onSelectAssignment,
    submissions,
    activeSubmissionId,
    onSelectSubmission,
    detail,
    previewTitle,
    previewCapturedAt,
    previewContent,
    hasPreview,
    aiGradingEnabled,
    isLoading,
    isGeneratingDraft,
    isSavingReview,
    isReleasingGrade,
    onScoreChange,
    onMaxScoreChange,
    onTeacherFeedbackChange,
    onGenerateDraft,
    onReleaseGrade,
}: GradeAssignmentViewProps) => {
    const [expandedSubmitted, setExpandedSubmitted] = useState<Record<string, boolean>>({});

    const [expandedMissing, setExpandedMissing] = useState<Record<string, boolean>>({});

    const [dashboardFilter, setDashboardFilter] = useState<"all" | "published" | "closed">("all");
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    const detailSectionRef = useRef<HTMLElement | null>(null);
    const filteredAssignments =
        dashboardFilter === "all"
            ? dashboardAssignments
            : dashboardAssignments.filter((assignment) => assignment.status === dashboardFilter);
    const hasDashboardAssignments = dashboardAssignments.length > 0;
    const hasFilteredAssignments = filteredAssignments.length > 0;

    const toggleSubmitted = (assignmentId: string) => {
        setExpandedSubmitted((prev) => ({
            ...prev,
            [assignmentId]: !prev[assignmentId],
        }));
    };

    const toggleMissing = (assignmentId: string) => {
        setExpandedMissing((prev) => ({
            ...prev,
            [assignmentId]: !prev[assignmentId],
        }));
    };
    useEffect(() => {
        if (mode !== "detail") {
            return;
        }
        const container = scrollContainerRef.current;
        const target = detailSectionRef.current;
        if (!container || !target) {
            return;
        }
        requestAnimationFrame(() => {
            const offset = target.offsetTop - container.offsetTop;
            container.scrollTop = offset;
        });
    }, [mode, activeAssignmentId, activeSubmissionId]);

    return (
        <div ref={scrollContainerRef} className="flex-1 h-full overflow-y-auto bg-slate-50">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-8 lg:px-10">
                <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h1 className="font-serif-heading text-4xl font-bold text-slate-900">
                            批改工作台
                        </h1>
                        <p className="mt-2 text-sm text-slate-600">
                            {mode === "detail"
                                ? aiGradingEnabled
                                    ? "AI 草稿会自动生成，确认后直接发布给学生。"
                                    : "直接填写分数与理由并发布反馈给学生。"
                                : mode === "classDashboard"
                                  ? `当前班级：${activeClassName ?? "未选择班级"}`
                                  : "请选择一个班级进入批改。"}
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        {mode === "classDashboard" && (
                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={onBackToClassList}
                            >
                                返回班级列表
                            </Button>
                        )}
                        {mode === "detail" && (
                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={onBackToClassDashboard}
                            >
                                返回
                            </Button>
                        )}
                    </div>
                </div>

                {mode === "classList" ? (
                    <section>
                        <h2 className="font-serif-heading text-3xl font-bold text-slate-900">
                            班级列表
                        </h2>
                        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {teacherClasses.map((classItem) => (
                                <article key={classItem.id} className="p-4">
                                    <p className="text-base font-semibold text-slate-900">
                                        {classItem.name}
                                    </p>
                                    <div className="mt-2 text-sm text-slate-600">
                                        <p>学生: {classItem.studentCount}</p>
                                        <p>老师: {classItem.teacherCount}</p>
                                        <p>
                                            总人数:{" "}
                                            {classItem.studentCount + classItem.teacherCount}
                                        </p>
                                    </div>
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        className="mt-4"
                                        onClick={() => onEnterClass(classItem.id)}
                                    >
                                        进入班级
                                    </Button>
                                </article>
                            ))}

                            {teacherClasses.length === 0 && (
                                <p className=" px-4 py-6 text-center text-sm text-slate-500">
                                    暂无可批改班级。
                                </p>
                            )}
                        </div>
                    </section>
                ) : mode === "classDashboard" ? (
                    <>
                        <section className="grid gap-4 md:grid-cols-3">
                            {(
                                [
                                    {
                                        key: "all",
                                        label: "全部作业",
                                        count: dashboardAssignments.length,
                                        tone: "text-slate-900",
                                    },
                                    {
                                        key: "published",
                                        label: "已发布作业",
                                        count: summary.publishedCount,
                                        tone: "text-emerald-600",
                                    },
                                    {
                                        key: "closed",
                                        label: "已关闭作业",
                                        count: summary.closedCount,
                                        tone: "text-slate-600",
                                    },
                                ] as const
                            ).map((filter) => {
                                const active = dashboardFilter === filter.key;

                                return (
                                    <Button
                                        key={filter.key}
                                        type="button"
                                        variant="outline"
                                        size="md"
                                        onClick={() => setDashboardFilter(filter.key)}
                                        className={`h-full w-full flex-col items-start justify-between rounded-2xl p-4 text-left shadow-sm transition ${
                                            active
                                                ? "border-slate-900 bg-slate-900 text-white hover:bg-slate-900 hover:text-white"
                                                : "border-slate-900 text-slate-900"
                                        }`}
                                    >
                                        <span
                                            className={`text-xs uppercase tracking-wide ${
                                                active ? "text-white/80" : "text-slate-500"
                                            }`}
                                        >
                                            {filter.label}
                                        </span>
                                        <span
                                            className={`mt-2 text-3xl font-bold ${
                                                active ? "text-white" : filter.tone
                                            }`}
                                        >
                                            {filter.count}
                                        </span>
                                    </Button>
                                );
                            })}
                        </section>

                        <section className="p-4">
                            <h2 className="font-serif-heading text-2xl font-bold text-slate-900">
                                作业概览
                            </h2>
                            <div className="mt-4 space-y-4">
                                {isDashboardLoading && dashboardAssignments.length === 0 ? (
                                    <p className="text-sm text-slate-500">加载中...</p>
                                ) : null}

                                {filteredAssignments.map((assignment) => (
                                    <article
                                        key={assignment.id}
                                        className="rounded-2xl border-2 border-black bg-white p-4"
                                    >
                                        <div className="flex flex-wrap items-start justify-between gap-4">
                                            <div>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span
                                                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass[assignment.status]}`}
                                                    >
                                                        {statusLabel[assignment.status]}
                                                    </span>
                                                    <p className="text-sm font-semibold text-slate-900">
                                                        {assignment.title}
                                                    </p>
                                                </div>
                                                <p className="mt-1 text-xs text-slate-500">
                                                    截止: {formatDateTime(assignment.dueAt)}
                                                </p>
                                            </div>
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="outline"
                                                onClick={() => onEnterDetail(assignment.id)}
                                            >
                                                进入批改
                                            </Button>
                                        </div>

                                        <div className="mt-4 grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
                                            <div className="px-3 py-2">
                                                AI 批注完成 {assignment.aiCompletedCount}
                                            </div>
                                            <div className="px-3 py-2">
                                                AI 正在标注 {assignment.aiInProgressCount}
                                            </div>
                                            <div className="px-3 py-2">
                                                未手动批改 {assignment.teacherNotManualCount}
                                            </div>
                                            <div className="px-3 py-2">
                                                手动已标注 {assignment.teacherManualCompletedCount}
                                            </div>
                                        </div>

                                        <div className="grid gap-4 lg:grid-cols-2">
                                            <section className="px-3 py-3">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => toggleSubmitted(assignment.id)}
                                                    className="w-full justify-between text-left"
                                                >
                                                    <span className="text-xs font-semibold uppercase tracking-wide">
                                                        已交名单
                                                    </span>
                                                    <span className="flex items-center gap-2 text-xs text-slate-500">
                                                        <span>
                                                            共 {assignment.submittedCount} 人
                                                        </span>
                                                        <span
                                                            className={`transition-transform ${
                                                                expandedSubmitted[assignment.id]
                                                                    ? "rotate-180"
                                                                    : ""
                                                            }`}
                                                        >
                                                            ▾
                                                        </span>
                                                    </span>
                                                </Button>
                                                <div
                                                    className={`mt-2 overflow-hidden transition-[max-height,opacity] duration-200 ease-out ${
                                                        expandedSubmitted[assignment.id]
                                                            ? "max-h-[240px] opacity-100"
                                                            : "max-h-0 opacity-0 pointer-events-none"
                                                    }`}
                                                >
                                                    <div className="flex flex-wrap gap-2">
                                                        {assignment.submittedStudents.length > 0 ? (
                                                            assignment.submittedStudents.map(
                                                                (student) => (
                                                                    <div
                                                                        key={student.id}
                                                                        className="flex items-center gap-2 rounded-full px-3 py-1 text-xs text-slate-700"
                                                                    >
                                                                        <div className="h-5 w-5 overflow-hidden rounded-full ">
                                                                            {student.avatar ? (
                                                                                <img
                                                                                    src={
                                                                                        student.avatar
                                                                                    }
                                                                                    alt={
                                                                                        student.name
                                                                                    }
                                                                                    className="h-full w-full object-cover"
                                                                                />
                                                                            ) : (
                                                                                <div className="flex h-full w-full items-center justify-center text-[10px] font-bold text-slate-600">
                                                                                    {buildInitial(
                                                                                        student.name,
                                                                                    )}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        <span className="max-w-[120px] truncate">
                                                                            {student.name}
                                                                        </span>
                                                                    </div>
                                                                ),
                                                            )
                                                        ) : (
                                                            <span className="text-xs text-slate-500">
                                                                暂无
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </section>

                                            <section className=" px-3 py-3">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => toggleMissing(assignment.id)}
                                                    className="w-full justify-between text-left"
                                                >
                                                    <span className="text-xs font-semibold uppercase tracking-wide">
                                                        未交名单
                                                    </span>
                                                    <span className="flex items-center gap-2 text-xs text-slate-500">
                                                        <span>共 {assignment.missingCount} 人</span>
                                                        <span
                                                            className={`transition-transform ${
                                                                expandedMissing[assignment.id]
                                                                    ? "rotate-180"
                                                                    : ""
                                                            }`}
                                                        >
                                                            ▾
                                                        </span>
                                                    </span>
                                                </Button>
                                                <div
                                                    className={`mt-2 overflow-hidden transition-[max-height,opacity] duration-200 ease-out ${
                                                        expandedMissing[assignment.id]
                                                            ? "max-h-[240px] opacity-100"
                                                            : "max-h-0 opacity-0 pointer-events-none"
                                                    }`}
                                                >
                                                    <div className="flex flex-wrap gap-2">
                                                        {assignment.missingStudents.length > 0 ? (
                                                            assignment.missingStudents.map(
                                                                (student) => (
                                                                    <div
                                                                        key={student.id}
                                                                        className="flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1 text-xs text-rose-700"
                                                                    >
                                                                        <div className="h-5 w-5 overflow-hidden rounded-full bg-rose-100">
                                                                            {student.avatar ? (
                                                                                <img
                                                                                    src={
                                                                                        student.avatar
                                                                                    }
                                                                                    alt={
                                                                                        student.name
                                                                                    }
                                                                                    className="h-full w-full object-cover"
                                                                                />
                                                                            ) : (
                                                                                <div className="flex h-full w-full items-center justify-center text-[10px] font-bold text-rose-700">
                                                                                    {buildInitial(
                                                                                        student.name,
                                                                                    )}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        <span className="max-w-[120px] truncate">
                                                                            {student.name}
                                                                        </span>
                                                                    </div>
                                                                ),
                                                            )
                                                        ) : (
                                                            <span className="text-xs text-slate-500">
                                                                暂无
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </section>
                                        </div>
                                    </article>
                                ))}

                                {!isDashboardLoading && !hasDashboardAssignments && (
                                    <p className="px-4 py-6 text-center text-sm text-slate-500">
                                        当前没有可批改的作业。
                                    </p>
                                )}
                                {!isDashboardLoading &&
                                    hasDashboardAssignments &&
                                    !hasFilteredAssignments && (
                                        <p className=" px-4 py-6 text-center text-sm text-slate-500">
                                            当前筛选下没有作业。
                                        </p>
                                    )}
                            </div>
                        </section>
                    </>
                ) : (
                    <>
                        <section className="p-4">
                            <h2 className="font-serif-heading text-2xl font-bold text-slate-900">
                                作业列表
                            </h2>
                            <div className="mt-3 flex flex-wrap gap-2">
                                {assignments.map((assignment) => (
                                    <Button
                                        key={assignment.id}
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onSelectAssignment(assignment.id)}
                                        className={`rounded-full border-2 px-3 py-1.5 text-sm transition ${
                                            assignment.id === activeAssignmentId
                                                ? "border-black bg-black text-white"
                                                : "border-black bg-white text-slate-700 hover:bg-slate-50"
                                        }`}
                                    >
                                        {assignment.title} · {assignment.submissionCount}
                                    </Button>
                                ))}
                                {assignments.length === 0 && (
                                    <p className="text-sm text-slate-500">暂无作业。</p>
                                )}
                            </div>
                        </section>
                        <section
                            ref={detailSectionRef}
                            className="grid gap-4 lg:grid-cols-[2fr_8fr]"
                        >
                            <article className="p-4">
                                <h2 className="text-xs font-bold text-[#94a3b8] uppercase tracking-wider">
                                    提交列表
                                </h2>
                                <div className="mt-3 space-y-1">
                                    {isLoading ? (
                                        <p className="text-sm text-slate-500">加载中...</p>
                                    ) : (
                                        submissions.map((submission) => (
                                            <button
                                                key={submission.id}
                                                type="button"
                                                onClick={() => onSelectSubmission(submission.id)}
                                                className={`w-full group flex items-start gap-3 px-2 py-1 rounded-[1rem] text-xs font-medium transition-colors cursor-pointer text-left ${
                                                    submission.id === activeSubmissionId
                                                        ? "bg-[#ffffff] text-[#334155]"
                                                        : "text-[#64748b] hover:bg-[#ffffff] hover:text-[#334155]"
                                                }`}
                                            >
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate font-medium">
                                                        {submission.studentName}
                                                    </p>
                                                    <p className="text-[10px] text-slate-500">
                                                        提交:{" "}
                                                        {formatDateTime(submission.submittedAt)}
                                                        {" · "}第 {submission.attemptNo} 次
                                                    </p>
                                                </div>
                                            </button>
                                        ))
                                    )}

                                    {!isLoading && submissions.length === 0 && (
                                        <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-4 text-sm text-slate-500">
                                            当前作业暂无提交。
                                        </p>
                                    )}
                                </div>
                            </article>

                            <div className="flex flex-col gap-4">
                                <article className="p-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <h2 className="font-serif-heading text-2xl font-bold text-slate-900">
                                                对话预览
                                            </h2>
                                            <p className="mt-1 text-xs text-slate-500">
                                                {previewTitle}
                                                {previewCapturedAt
                                                    ? ` · 抓取时间 ${formatDateTime(previewCapturedAt)}`
                                                    : ""}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-3 h-[360px] overflow-hidden rounded-2xl border border-black/20 bg-slate-50">
                                        {hasPreview ? (
                                            previewContent
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-sm text-slate-500">
                                                暂无可预览对话。
                                            </div>
                                        )}
                                    </div>
                                </article>

                                <article className="p-4">
                                    {detail ? (
                                        <>
                                            <h2 className="font-serif-heading text-2xl font-bold text-slate-900">
                                                {detail.studentName}
                                            </h2>
                                            <p className="mt-1 text-xs text-slate-500">
                                                提交时间: {formatDateTime(detail.submittedAt)}
                                            </p>

                                            <div className="mt-4 grid gap-3 md:grid-cols-2">
                                                <label className="text-sm font-medium text-slate-700">
                                                    分数
                                                    <input
                                                        type="number"
                                                        value={detail.score}
                                                        onChange={(event) =>
                                                            onScoreChange(
                                                                Number(event.target.value),
                                                            )
                                                        }
                                                        className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                                                    />
                                                </label>
                                                <label className="text-sm font-medium text-slate-700">
                                                    满分
                                                    <input
                                                        type="number"
                                                        value={detail.maxScore}
                                                        onChange={(event) =>
                                                            onMaxScoreChange(
                                                                Number(event.target.value),
                                                            )
                                                        }
                                                        className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                                                    />
                                                </label>
                                            </div>

                                            <label className="mt-3 block text-sm font-medium text-slate-700">
                                                老师反馈
                                                <textarea
                                                    value={detail.teacherFeedback}
                                                    onChange={(event) =>
                                                        onTeacherFeedbackChange(event.target.value)
                                                    }
                                                    className="mt-1 min-h-[8rem] w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                                                />
                                            </label>

                                            {detail.reflectionText && (
                                                <section className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                                    <h3 className="text-sm font-semibold text-slate-800">
                                                        学生反思
                                                    </h3>
                                                    <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                                                        {detail.reflectionText}
                                                    </p>
                                                </section>
                                            )}

                                            <div className="mt-4 flex flex-wrap justify-end gap-2">
                                                {aiGradingEnabled && (
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="outline"
                                                        disabled={isGeneratingDraft}
                                                        onClick={onGenerateDraft}
                                                    >
                                                        {isGeneratingDraft
                                                            ? "生成中..."
                                                            : "重新生成 AI 草稿"}
                                                    </Button>
                                                )}
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="primary"
                                                    disabled={
                                                        isSavingReview ||
                                                        isReleasingGrade ||
                                                        detail.releaseStatus === "released"
                                                    }
                                                    onClick={onReleaseGrade}
                                                >
                                                    {detail.releaseStatus === "released"
                                                        ? "已发布"
                                                        : isSavingReview
                                                          ? "保存中..."
                                                          : isReleasingGrade
                                                            ? "发布中..."
                                                            : "发布反馈"}
                                                </Button>
                                            </div>
                                        </>
                                    ) : (
                                        <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-8 text-center text-sm text-slate-500">
                                            请选择一条提交进行批改。
                                        </p>
                                    )}
                                </article>
                            </div>
                        </section>
                    </>
                )}
            </div>
        </div>
    );
};
