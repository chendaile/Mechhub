import type { PublishAssignmentDraft } from "../../hooks/assignment/types";
import { PublishAssignmentUIState } from "../../hooks/assignment/ui/PublishAssignmentUIState";
import { PublishAssignmentView } from "@views/assignment";

interface PublishAssignmentPresenterProps {
    classOptions: Array<{
        id: string;
        name: string;
    }>;
    onPublish: (draft: PublishAssignmentDraft) => Promise<void>;
}

export const PublishAssignmentPresenter = ({
    classOptions,
    onPublish,
}: PublishAssignmentPresenterProps) => {
    const publishState = PublishAssignmentUIState({ onPublish });

    return (
        <PublishAssignmentView
            title={publishState.title}
            setTitle={publishState.setTitle}
            selectedClassId={publishState.classId}
            setSelectedClassId={publishState.setClassId}
            classOptions={classOptions}
            dueDate={publishState.dueDate}
            setDueDate={publishState.setDueDate}
            dueTime={publishState.dueTime}
            setDueTime={publishState.setDueTime}
            instructions={publishState.instructions}
            setInstructions={publishState.setInstructions}
            attachedFiles={publishState.attachedFiles}
            onFileUpload={publishState.handleFileUpload}
            onRemoveFile={publishState.handleRemoveFile}
            aiGradingEnabled={publishState.aiGradingEnabled}
            setAiGradingEnabled={publishState.setAiGradingEnabled}
            onPublish={publishState.handlePublish}
            isLoading={publishState.isLoading}
        />
    );
};
