import { useState, type ReactNode } from "react";
import { Button, buttonVariants } from "../shared/ui/button";
import { ASSIGNMENT_PAGE_LAYOUT, ASSIGNMENT_PAGE_TITLE } from "./assignmentSharedStyles";

interface SubmitAssignmentAttachment {
    name: string;
    url: string;
    size?: number;
    contentType?: string;
}

interface SubmitAssignmentItem {
    id: string;
    title: string;
    className: string;
    dueAt: string | null;
    instructions: string | null;
    attachments: SubmitAssignmentAttachment[];
    previewContent?: ReactNode;
    hasPreview?: boolean;
    status: "pending" | "submitted" | "overdue";
    latestAttemptNo: number;
    latestSubmittedAt: string | null;
    latestGrade: string | null;
}

interface SubmitAssignmentViewProps {
    assignments: SubmitAssignmentItem[];
    isSubmitting: boolean;
}

type SubmitFilter = "all" | SubmitAssignmentItem["status"];

const statusLabel: Record<SubmitAssignmentItem["status"], string> = {
    pending: "待提交",
    submitted: "已提交",
    overdue: "已逾期",
};

const statusClass: Record<SubmitAssignmentItem["status"], string> = {
    pending: "bg-amber-100 text-amber-700",
    submitted: "bg-emerald-100 text-emerald-700",
    overdue: "bg-rose-100 text-rose-700",
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

const formatFileSize = (bytes?: number) => {
    if (bytes === undefined || Number.isNaN(bytes)) {
        return "未知大小";
    }
    if (bytes < 1024) {
        return `${bytes} B`;
    }
    const kb = bytes / 1024;
    if (kb < 1024) {
        return `${kb.toFixed(1)} KB`;
    }
    const mb = kb / 1024;

    return `${mb.toFixed(1)} MB`;
};

export const SubmitAssignmentView = ({ assignments, isSubmitting }: SubmitAssignmentViewProps) => {
    const [activeFilter, setActiveFilter] = useState<SubmitFilter>("all");
    const [expandedPreview, setExpandedPreview] = useState<Record<string, boolean>>({});

    const [expandedDetails, setExpandedDetails] = useState<Record<string, boolean>>({});
    const pending = assignments.filter((item) => item.status === "pending");
    const submitted = assignments.filter((item) => item.status === "submitted");
    const overdue = assignments.filter((item) => item.status === "overdue");
    const filteredAssignments =
        activeFilter === "all"
            ? assignments
            : assignments.filter((item) => item.status === activeFilter);

    const togglePreview = (assignmentId: string) => {
        setExpandedPreview((prev) => ({
            ...prev,
            [assignmentId]: !prev[assignmentId],
        }));
    };

    const toggleDetails = (assignmentId: string) => {
        setExpandedDetails((prev) => ({
            ...prev,
            [assignmentId]: !prev[assignmentId],
        }));
    };

    return (
        <div className="flex-1 h-full overflow-y-auto bg-slate-50">
            <div className={ASSIGNMENT_PAGE_LAYOUT}>
                <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h1 className={ASSIGNMENT_PAGE_TITLE}>作业提交 Dashboard</h1>
                    </div>
                </div>

                <section className="grid gap-4 md:grid-cols-4">
                    {(
                        [
                            {
                                key: "all",
                                label: "全部",
                                count: assignments.length,
                                tone: "text-slate-900",
                            },
                            {
                                key: "pending",
                                label: "待提交",
                                count: pending.length,
                                tone: "text-amber-600",
                            },
                            {
                                key: "submitted",
                                label: "已提交",
                                count: submitted.length,
                                tone: "text-emerald-600",
                            },
                            {
                                key: "overdue",
                                label: "已逾期",
                                count: overdue.length,
                                tone: "text-rose-600",
                            },
                        ] as const
                    ).map((filter) => {
                        const active = activeFilter === filter.key;

                        return (
                            <Button
                                key={filter.key}
                                type="button"
                                variant="outline"
                                size="md"
                                onClick={() => setActiveFilter(filter.key)}
                                disabled={isSubmitting}
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

                <section>
                    <h2 className="font-serif-heading text-3xl font-bold text-slate-900">
                        作业列表
                    </h2>
                    <div className="mt-4 space-y-3">
                        {filteredAssignments.map((item) => {
                            const previewExpanded = !!expandedPreview[item.id];
                            const detailsExpanded = !!expandedDetails[item.id];

                            return (
                                <article
                                    key={item.id}
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => toggleDetails(item.id)}
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter" || event.key === " ") {
                                            event.preventDefault();
                                            toggleDetails(item.id);
                                        }
                                    }}
                                    className="rounded-2xl border-2 border-black bg-white p-4 text-left shadow-sm transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40"
                                >
                                    <div className="flex w-full flex-wrap items-start justify-between gap-3">
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900">
                                                {item.title}
                                            </p>
                                            <p className="mt-0.5 text-xs text-slate-500">
                                                {item.className} · 截止:{" "}
                                                {formatDateTime(item.dueAt)}
                                            </p>
                                        </div>
                                        <span
                                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass[item.status]}`}
                                        >
                                            {statusLabel[item.status]}
                                        </span>
                                    </div>

                                    <div className="mt-3 grid w-full gap-2 text-xs text-slate-600 md:grid-cols-3">
                                        <p>最近提交: {formatDateTime(item.latestSubmittedAt)}</p>
                                        <p>已提交次数: {item.latestAttemptNo}</p>
                                        <p>得分: {item.latestGrade ?? "未发布"}</p>
                                    </div>

                                    <span className="mt-3 block text-xs font-semibold text-slate-600">
                                        {detailsExpanded ? "收起详情" : "展开详情"}
                                    </span>

                                    <div
                                        className={`overflow-hidden transition-[max-height,opacity] duration-200 ease-out ${
                                            detailsExpanded
                                                ? "max-h-[1000px] opacity-100"
                                                : "max-h-0 opacity-0 pointer-events-none"
                                        }`}
                                    >
                                        <div
                                            className="mt-3 border-t border-slate-200 pt-3"
                                            onClick={(event) => event.stopPropagation()}
                                            onKeyDown={(event) => event.stopPropagation()}
                                        >
                                            <div className="px-1">
                                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                    作业说明
                                                </p>
                                                <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">
                                                    {item.instructions?.trim() || "暂无作业说明。"}
                                                </p>
                                            </div>

                                            <div className="mt-3 rounded-xl px-1">
                                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                    附件
                                                </p>
                                                {item.attachments.length > 0 ? (
                                                    <div className="mt-2 space-y-2">
                                                        {item.attachments.map(
                                                            (attachment, index) => (
                                                                <a
                                                                    key={`${attachment.name}-${index}`}
                                                                    href={attachment.url}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    onClick={(event) =>
                                                                        event.stopPropagation()
                                                                    }
                                                                    onKeyDown={(event) =>
                                                                        event.stopPropagation()
                                                                    }
                                                                    className={`${buttonVariants({ variant: "outline", size: "sm" })} w-full justify-between`}
                                                                >
                                                                    <span className="font-medium">
                                                                        {attachment.name}
                                                                    </span>
                                                                    <span className="text-xs text-slate-500">
                                                                        {formatFileSize(
                                                                            attachment.size,
                                                                        )}
                                                                    </span>
                                                                </a>
                                                            ),
                                                        )}
                                                    </div>
                                                ) : (
                                                    <p className="mt-2 text-sm text-slate-500">
                                                        暂无附件。
                                                    </p>
                                                )}
                                            </div>

                                            {item.hasPreview ? (
                                                <div className="mt-3 px-1">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={(event) => {
                                                            event.stopPropagation();
                                                            togglePreview(item.id);
                                                        }}
                                                        onKeyDown={(event) =>
                                                            event.stopPropagation()
                                                        }
                                                        disabled={isSubmitting}
                                                        className="w-full justify-between"
                                                    >
                                                        <span>提交预览</span>
                                                        <span>
                                                            {previewExpanded ? "收起" : "展开"}
                                                        </span>
                                                    </Button>
                                                    {previewExpanded && (
                                                        <div className="mt-2 h-[280px] overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                                                            {item.previewContent}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="mt-3 px-1 text-sm text-slate-500">
                                                    暂无提交预览。
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </article>
                            );
                        })}

                        {assignments.length === 0 && (
                            <p className=" px-4 text-center text-sm text-slate-500">
                                当前没有可提交作业。
                            </p>
                        )}

                        {assignments.length > 0 && filteredAssignments.length === 0 && (
                            <p className=" px-4 text-center text-sm text-slate-500">
                                当前筛选下没有作业。
                            </p>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};
