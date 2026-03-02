import { ChevronDown, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import styles from "../shared/scrollbar.module.css";
import { ASSIGNMENT_PAGE_LAYOUT, ASSIGNMENT_PAGE_TITLE } from "./assignmentSharedStyles";

interface FeedbackListItem {
    submissionId: string;
    assignmentTitle: string;
    classId: string;
    className: string;
}

interface FeedbackClassGroup {
    classId: string;
    className: string;
    items: FeedbackListItem[];
}

interface FeedbackDetail {
    assignmentTitle: string;
    dueAt: string | null;
    submittedAt: string;
    reflectionText: string | null;
    teacherFeedback: string;
    aiFeedbackDraft: string | null;
    score: string;
    rubric: unknown;
}

interface ViewFeedbackViewProps {
    groups: FeedbackClassGroup[];
    activeSubmissionId: string | null;
    onSelectSubmission: (submissionId: string) => void;
    detail: FeedbackDetail | null;
}

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

export const ViewFeedbackView = ({
    groups,
    activeSubmissionId,
    onSelectSubmission,
    detail,
}: ViewFeedbackViewProps) => {
    const [openGroupIds, setOpenGroupIds] = useState<Set<string>>(
        new Set(groups.map((group) => group.classId)),
    );

    useEffect(() => {
        setOpenGroupIds((prev) => {
            const next = new Set(prev);
            groups.forEach((group) => next.add(group.classId));

            return next;
        });
    }, [groups]);

    useEffect(() => {
        if (!activeSubmissionId) {
            return;
        }

        const activeGroup = groups.find((group) =>
            group.items.some((item) => item.submissionId === activeSubmissionId),
        );

        if (!activeGroup) {
            return;
        }

        setOpenGroupIds((prev) => {
            if (prev.has(activeGroup.classId)) {
                return prev;
            }
            const next = new Set(prev);
            next.add(activeGroup.classId);

            return next;
        });
    }, [activeSubmissionId, groups]);

    const toggleGroup = (classId: string) => {
        setOpenGroupIds((prev) => {
            const next = new Set(prev);
            if (next.has(classId)) {
                next.delete(classId);
            } else {
                next.add(classId);
            }

            return next;
        });
    };

    return (
        <div className="flex-1 h-full overflow-y-auto bg-slate-50">
            <div className={ASSIGNMENT_PAGE_LAYOUT}>
                <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h1 className={ASSIGNMENT_PAGE_TITLE}>作业反馈 Dashboard</h1>
                    </div>
                </div>

                <section className="grid gap-4 lg:grid-cols-[260px_1fr]">
                    <aside className="">
                        <div className={`flex-1 overflow-y-auto px-6 py-4 ${styles.scrollbar}`}>
                            <h3 className="text-xs font-bold text-[#94a3b8] uppercase tracking-wider mb-3">
                                作业列表
                            </h3>
                            <div className="space-y-2 pb-2">
                                {groups.length === 0 ? (
                                    <div className="rounded-xl border border-dashed border-slate-300 bg-white/60 px-3 py-3 text-xs text-slate-500">
                                        暂无反馈记录。
                                    </div>
                                ) : (
                                    groups.map((group) => {
                                        const isOpen = openGroupIds.has(group.classId);

                                        return (
                                            <div key={group.classId} className="rounded-[1rem] p-2">
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleGroup(group.classId)}
                                                        className="flex min-w-0 flex-1 items-center gap-2 rounded-xl px-2 py-1.5 text-left text-xs font-semibold text-slate-700 hover:bg-slate-100"
                                                    >
                                                        {isOpen ? (
                                                            <ChevronDown size={14} />
                                                        ) : (
                                                            <ChevronRight size={14} />
                                                        )}
                                                        <span className="truncate">
                                                            {group.className}
                                                        </span>
                                                    </button>
                                                </div>

                                                {isOpen && (
                                                    <div className="ml-4 mt-1 grid gap-1">
                                                        {group.items.map((item) => {
                                                            const active =
                                                                item.submissionId ===
                                                                activeSubmissionId;

                                                            return (
                                                                <button
                                                                    key={item.submissionId}
                                                                    type="button"
                                                                    onClick={() =>
                                                                        onSelectSubmission(
                                                                            item.submissionId,
                                                                        )
                                                                    }
                                                                    className={`rounded-[1rem] px-2 py-2 text-left text-xs transition ${
                                                                        active
                                                                            ? "bg-[#ffffff] text-[#334155]"
                                                                            : "text-[#64748b] hover:bg-[#ffffff] hover:text-[#334155]"
                                                                    }`}
                                                                >
                                                                    <p className="truncate font-medium">
                                                                        {item.assignmentTitle}
                                                                    </p>
                                                                </button>
                                                            );
                                                        })}
                                                        {group.items.length === 0 && (
                                                            <p className="px-2 py-1 text-[11px] text-slate-500">
                                                                暂无作业
                                                            </p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </aside>

                    <article className="p-4">
                        {detail ? (
                            <>
                                <h2 className="font-serif-heading text-2xl font-bold text-slate-900">
                                    {detail.assignmentTitle}
                                </h2>
                                <div className="mt-2 grid gap-2 text-xs text-slate-500 ">
                                    <p>截止: {formatDateTime(detail.dueAt)}</p>
                                    <p>提交: {formatDateTime(detail.submittedAt)}</p>
                                    <p>最终得分: {detail.score}</p>
                                </div>

                                <section className="mt-3 p-2">
                                    <h3 className="text-sm font-semibold text-slate-800">
                                        老师反馈
                                    </h3>
                                    <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                                        {detail.teacherFeedback || "老师尚未发布反馈。"}
                                    </p>
                                </section>

                                {detail.aiFeedbackDraft && (
                                    <section className="mt-3 p-2">
                                        <h3 className="text-sm font-semibold">
                                            AI 草稿（仅作参考）
                                        </h3>
                                        <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                                            {detail.aiFeedbackDraft}
                                        </p>
                                    </section>
                                )}

                                {detail.reflectionText && (
                                    <section className="mt-3 p-2">
                                        <h3 className="text-sm font-semibold text-slate-800">
                                            你的反思
                                        </h3>
                                        <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                                            {detail.reflectionText}
                                        </p>
                                    </section>
                                )}
                            </>
                        ) : (
                            <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-8 text-center text-sm text-slate-500">
                                请选择一条作业查看详情。
                            </p>
                        )}
                    </article>
                </section>
            </div>
        </div>
    );
};
