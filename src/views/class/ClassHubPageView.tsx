import { Input } from "@views/shared/ui/input";
import { Button } from "@views/shared/ui/button";
import { ClassHubView } from "./ClassHubView";
import { ClassThreadChatView } from "./ClassThreadChatView";
import { ClassMembershipNoticeView } from "./ClassMembershipNoticeView";
import { ClassHubUIState } from "@hooks/class/ui/ClassHubUIState";

type ClassHubPageViewProps = ReturnType<typeof ClassHubUIState>;

const createClassHubPageView = ({
    classActiveView,
    classHubProps,
    threadChatProps,
    threadInput,
    selectedClassId,
    selectedThreadId,
}: ClassHubPageViewProps) => {
    if (classActiveView === "thread") {
        if (!selectedClassId || !selectedThreadId) {
            return (
                <ClassMembershipNoticeView
                    title="请选择一个话题"
                    description="当前未选择班级话题，请返回班级面板选择一个话题进行讨论。"
                    actionLabel="返回班级面板"
                    onAction={classHubProps.onBackToCollection}
                />
            );
        }

        return (
            <ClassThreadChatView
                {...threadChatProps}
                inputBar={
                    <div className="flex flex-wrap items-center gap-2">
                        <Input
                            value={threadInput.typeMessage}
                            onChange={(event) => threadInput.setTypeMessage(event.target.value)}
                            placeholder="输入班级消息..."
                            className="flex-1 min-w-[220px]"
                        />
                        <Button
                            type="button"
                            variant="outline"
                            onClick={async () => {
                                const content = threadInput.typeMessage.trim();
                                if (!content || threadInput.isSending) {
                                    return;
                                }
                                await threadInput.sendMessage(content);
                                threadInput.setTypeMessage("");
                            }}
                            disabled={threadInput.isSending}
                        >
                            发送
                        </Button>
                    </div>
                }
            />
        );
    }

    if (classActiveView === "collection" && classHubProps.classOptions.length === 0) {
        return (
            <ClassMembershipNoticeView
                title="还没有班级"
                description="你还没有加入任何班级，可以使用邀请码加入班级，或者创建一个新的班级。"
                actionLabel="前往班级列表"
                onAction={classHubProps.onBackToCollection}
            />
        );
    }

    return <ClassHubView {...classHubProps} />;
};

export const ClassHubPageView = () => {
    const state = ClassHubUIState();
    return createClassHubPageView(state);
};
