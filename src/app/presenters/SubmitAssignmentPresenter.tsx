import type { Assignment } from "../../hooks/assignment/types";
import { buildSubmitAssignmentViewModel } from "../../hooks/assignment/ui/SubmitAssignmentUIState";
import { buildSnapshotPreview } from "../../hooks/assignment/ui/SubmitSnapshotPreviewUIState";
import { MessageListPresenter } from "./MessageListPresenter";
import { SubmitAssignmentView } from "@views/assignment";

interface SubmitAssignmentPresenterProps {
    assignments: Assignment[];
    classNameById: Record<string, string>;
    isSubmitting: boolean;
}

export const SubmitAssignmentPresenter = ({
    assignments,
    classNameById,
    isSubmitting,
}: SubmitAssignmentPresenterProps) => {
    const assignmentCards = buildSubmitAssignmentViewModel(assignments, classNameById);

    return (
        <SubmitAssignmentView
            assignments={assignmentCards.map((assignment) => ({
                ...assignment,
                ...(assignment.latestEvidenceSnapshot
                    ? (() => {
                          const preview = buildSnapshotPreview(assignment.latestEvidenceSnapshot);

                          return {
                              hasPreview: preview.messages.length > 0,
                              previewContent:
                                  preview.messages.length > 0 ? (
                                      <MessageListPresenter
                                          messages={preview.messages}
                                          isTyping={false}
                                          sessionId={assignment.latestSubmissionId ?? assignment.id}
                                          showActions={false}
                                          className="h-full overflow-y-auto overflow-x-hidden bg-slate-50 px-4 py-3"
                                          contentClassName="space-y-4"
                                      />
                                  ) : undefined,
                          };
                      })()
                    : { hasPreview: false }),
            }))}
            isSubmitting={isSubmitting}
        />
    );
};
