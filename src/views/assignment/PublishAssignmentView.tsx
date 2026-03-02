import type { ChangeEvent } from "react";
import { Button, buttonVariants } from "../shared/ui/button";
import { Input } from "../shared/ui/input";
import { ASSIGNMENT_PAGE_LAYOUT, ASSIGNMENT_PAGE_TITLE } from "./assignmentSharedStyles";

interface PublishAssignmentViewProps {
    title: string;
    setTitle: (value: string) => void;
    selectedClassId: string;
    setSelectedClassId: (value: string) => void;
    classOptions: Array<{
        id: string;
        name: string;
    }>;
    dueDate: string;
    setDueDate: (value: string) => void;
    dueTime: string;
    setDueTime: (value: string) => void;
    instructions: string;
    setInstructions: (value: string) => void;
    attachedFiles: File[];
    onFileUpload: (file: File) => void;
    onRemoveFile: (index: number) => void;
    aiGradingEnabled: boolean;
    setAiGradingEnabled: (value: boolean) => void;
    onPublish: () => void;
    isLoading: boolean;
}

export const PublishAssignmentView = ({
    title,
    setTitle,
    selectedClassId,
    setSelectedClassId,
    classOptions,
    dueDate,
    setDueDate,
    dueTime,
    setDueTime,
    instructions,
    setInstructions,
    attachedFiles,
    onFileUpload,
    onRemoveFile,
    aiGradingEnabled,
    setAiGradingEnabled,
    onPublish,
    isLoading,
}: PublishAssignmentViewProps) => {
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const nextFile = event.target.files?.[0];
        if (nextFile) {
            onFileUpload(nextFile);
        }
        event.target.value = "";
    };

    const canPublish = !!title.trim() && !!selectedClassId && !isLoading;

    return (
        <div className="flex-1 h-full overflow-y-auto ">
            <div className={ASSIGNMENT_PAGE_LAYOUT}>
                <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
                    <h1 className={ASSIGNMENT_PAGE_TITLE}>发布新作业</h1>
                </div>

                {/* Summary cards removed per request */}

                <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
                    <article className="p-4">
                        <h2 className="font-serif-heading text-2xl font-bold text-slate-900">
                            作业基础信息
                        </h2>

                        <div className="mt-5 grid gap-4 md:grid-cols-2">
                            <label className="block text-sm font-medium text-slate-700 md:col-span-2">
                                作业名称
                                <Input
                                    className="mt-2"
                                    value={title}
                                    onChange={(event) => setTitle(event.target.value)}
                                    placeholder="例如：理论力学 第三次作业"
                                />
                            </label>

                            <label className="block text-sm font-medium text-slate-700">
                                所属班级
                                <select
                                    className="mt-2 w-full px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-100"
                                    value={selectedClassId}
                                    onChange={(event) => setSelectedClassId(event.target.value)}
                                >
                                    <option value="">请选择班级</option>
                                    {classOptions.map((classOption) => (
                                        <option key={classOption.id} value={classOption.id}>
                                            {classOption.name}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label className="block text-sm font-medium text-slate-700">
                                截止日期
                                <Input
                                    className="mt-2"
                                    type="date"
                                    value={dueDate}
                                    onChange={(event) => setDueDate(event.target.value)}
                                />
                            </label>

                            <label className="block text-sm font-medium text-slate-700">
                                截止时间
                                <Input
                                    className="mt-2"
                                    type="time"
                                    value={dueTime}
                                    onChange={(event) => setDueTime(event.target.value)}
                                />
                            </label>

                            <label className="block text-sm font-medium text-slate-700">
                                发布选项
                                <div className="mt-2 flex items-center justify-between px-4 py-3">
                                    <div className="text-sm text-slate-600">启用 AI 辅助批改</div>
                                    <input
                                        type="checkbox"
                                        checked={aiGradingEnabled}
                                        onChange={(event) =>
                                            setAiGradingEnabled(event.target.checked)
                                        }
                                    />
                                </div>
                            </label>
                        </div>
                    </article>

                    <article className="p-4">
                        <h2 className="font-serif-heading text-2xl font-bold text-slate-900">
                            作业说明
                        </h2>

                        <textarea
                            className="mt-5 min-h-[16rem] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-100"
                            value={instructions}
                            onChange={(event) => setInstructions(event.target.value)}
                            placeholder="填写作业要求、提交格式、评分标准等。提示：建议明确“评分维度”和“常见扣分点”，便于学生理解。"
                        />
                    </article>
                </section>

                <section className="p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h2 className="font-serif-heading text-2xl font-bold text-slate-900">
                                附件与参考资料
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                可上传题目 PDF、模板文件、示例数据等。
                            </p>
                        </div>

                        <label
                            className={`${buttonVariants({
                                variant: "outline",
                                size: "sm",
                            })} cursor-pointer`}
                        >
                            添加附件
                            <input type="file" className="hidden" onChange={handleFileChange} />
                        </label>
                    </div>

                    <div className="mt-4 grid gap-2">
                        {attachedFiles.length > 0 ? (
                            attachedFiles.map((file, index) => (
                                <div
                                    key={`${file.name}-${index}`}
                                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-black bg-white px-4 py-3"
                                >
                                    <div>
                                        <p className="text-sm font-semibold text-slate-800">
                                            {file.name}
                                        </p>
                                        <p className="text-xs text-slate-500">附件 #{index + 1}</p>
                                    </div>

                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        onClick={() => onRemoveFile(index)}
                                    >
                                        移除
                                    </Button>
                                </div>
                            ))
                        ) : (
                            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-500">
                                暂无附件。可在发布前添加参考资料。
                            </div>
                        )}
                    </div>
                </section>
                <div className="flex items-center">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onPublish}
                        disabled={!canPublish}
                        className="w-full justify-center"
                    >
                        {isLoading ? "发布中..." : "发布作业"}
                    </Button>
                </div>
            </div>
        </div>
    );
};
