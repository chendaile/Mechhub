import { useMemo, useState } from "react";

interface AssignmentSubmitOption {
    id: string;
    title: string;
    className?: string;
    dueAt?: string | null;
}

interface AssignmentSubmitPopoverProps {
    open: boolean;
    intentKind: "chatSession" | "chatMessage" | null;
    options: AssignmentSubmitOption[];
    isSubmitting?: boolean;
    onConfirm: (assignmentId: string, reflectionText: string) => void;
    onClose: () => void;
}

const formatDueAt = (value?: string | null) => {
    if (!value) {
        return "无截止时间";
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return "无截止时间";
    }

    return date.toLocaleString();
};

export const AssignmentSubmitPopover = ({
    open,
    intentKind,
    options,
    isSubmitting = false,
    onConfirm,
    onClose,
}: AssignmentSubmitPopoverProps) => {
    const [selectedAssignmentId, setSelectedAssignmentId] = useState("");
    const [reflectionText, setReflectionText] = useState("");

    const sourceLabel = useMemo(() => {
        if (intentKind === "chatMessage") {
            return "当前私聊回答";
        }

        if (intentKind === "chatSession") {
            return "当前私聊会话";
        }

        return "聊天内容";
    }, [intentKind]);

    if (!open) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 p-4">
            <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-5 shadow-xl">
                <h2 className="text-lg font-bold text-slate-900">提交到作业</h2>
                <p className="mt-1 text-sm text-slate-600">
                    来源: {sourceLabel}。请选择一个作业并确认提交。
                </p>

                <div className="mt-4 max-h-64 space-y-2 overflow-y-auto">
                    {options.map((option) => {
                        const active = selectedAssignmentId === option.id;

                        return (
                            <button
                                key={option.id}
                                type="button"
                                onClick={() => setSelectedAssignmentId(option.id)}
                                disabled={isSubmitting}
                                className={`w-full rounded-xl border px-3 py-2 text-left transition ${
                                    active
                                        ? "border-slate-900 bg-slate-900/5"
                                        : "border-slate-200 hover:bg-slate-50"
                                } disabled:opacity-60`}
                            >
                                <p className="text-sm font-semibold text-slate-900">
                                    {option.title}
                                </p>
                                <p className="mt-0.5 text-xs text-slate-500">
                                    {option.className ?? "未命名班级"} · 截止:{" "}
                                    {formatDueAt(option.dueAt)}
                                </p>
                            </button>
                        );
                    })}

                    {options.length === 0 && (
                        <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-3 text-sm text-slate-500">
                            当前没有可提交作业。
                        </p>
                    )}
                </div>

                <label className="mt-4 block text-sm font-medium text-slate-700">
                    学习反思（可选）
                    <textarea
                        value={reflectionText}
                        onChange={(event) => setReflectionText(event.target.value)}
                        disabled={isSubmitting}
                        placeholder="例如：这次我在受力分析部分仍然不够稳定。"
                        className="mt-2 min-h-[6rem] w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-100"
                    />
                </label>

                <div className="mt-4 flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                    >
                        取消
                    </button>
                    <button
                        type="button"
                        onClick={() =>
                            selectedAssignmentId && onConfirm(selectedAssignmentId, reflectionText)
                        }
                        disabled={isSubmitting || options.length === 0 || !selectedAssignmentId}
                        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-black/85 disabled:opacity-60"
                    >
                        {isSubmitting ? "提交中..." : "确认提交"}
                    </button>
                </div>
            </div>
        </div>
    );
};
