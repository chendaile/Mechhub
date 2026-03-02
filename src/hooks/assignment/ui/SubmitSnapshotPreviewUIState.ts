import type { Message } from "../../chat/types";
import type { AssignmentSnapshotPreview } from "../types";

const DEFAULT_IMPORTED_MODEL = "qwen3.5-plus";

const normalizeSnapshotMessage = (value: unknown): Message | null => {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
        return null;
    }

    const record = value as Record<string, unknown>;
    const role = record.role === "assistant" ? "assistant" : "user";
    const text =
        typeof record.text === "string"
            ? record.text
            : typeof record.content === "string"
              ? record.content
              : "";

    const imageUrls = Array.isArray(record.imageUrls)
        ? record.imageUrls.filter((item): item is string => typeof item === "string")
        : undefined;

    const fileAttachments = Array.isArray(record.fileAttachments)
        ? record.fileAttachments
              .map((item) => {
                  if (!item || typeof item !== "object" || Array.isArray(item)) {
                      return null;
                  }

                  const attachment = item as Record<string, unknown>;
                  const filename =
                      typeof attachment.filename === "string" ? attachment.filename : "";
                  const content = typeof attachment.content === "string" ? attachment.content : "";
                  const language =
                      typeof attachment.language === "string" ? attachment.language : undefined;

                  if (!filename || !content) {
                      return null;
                  }

                  return {
                      filename,
                      content,
                      ...(language ? { language } : {}),
                  };
              })
              .filter((item): item is NonNullable<typeof item> => !!item)
        : undefined;

    const mode = record.mode === "correct" ? "correct" : "study";
    const model =
        typeof record.model === "string" && record.model.trim()
            ? record.model
            : DEFAULT_IMPORTED_MODEL;
    const type = record.type === "grading" ? "grading" : "text";

    const generatedId =
        typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : `snapshot-${Date.now()}-${Math.random().toString(36).slice(2)}`;

    return {
        id:
            typeof record.id === "string" && record.id
                ? record.id
                : typeof record.messageId === "string" && record.messageId
                  ? record.messageId
                  : generatedId,
        role,
        type,
        text,
        mode,
        model,
        ...(imageUrls && imageUrls.length > 0 ? { imageUrls } : {}),
        ...(fileAttachments && fileAttachments.length > 0 ? { fileAttachments } : {}),
        ...(typeof record.reasoning === "string" ? { reasoning: record.reasoning } : {}),
        ...(typeof record.ocrText === "string" ? { ocrText: record.ocrText } : {}),
        ...(typeof record.createdAt === "string" ? { createdAt: record.createdAt } : {}),
        ...(record.gradingResult &&
        typeof record.gradingResult === "object" &&
        !Array.isArray(record.gradingResult)
            ? {
                  gradingResult: record.gradingResult as NonNullable<Message["gradingResult"]>,
              }
            : {}),
    };
};

const normalizeSnapshotMessages = (value: unknown): Message[] => {
    if (Array.isArray(value)) {
        return value
            .map(normalizeSnapshotMessage)
            .filter((message): message is Message => !!message);
    }

    const message = normalizeSnapshotMessage(value);
    return message ? [message] : [];
};

const emptySnapshotPreview = (): AssignmentSnapshotPreview => ({
    title: "私聊会话",
    capturedAt: null,
    messages: [],
});

export const buildSnapshotPreview = (
    snapshot: Record<string, unknown> | null | undefined,
): AssignmentSnapshotPreview => {
    if (!snapshot || typeof snapshot !== "object" || Array.isArray(snapshot)) {
        return emptySnapshotPreview();
    }

    const record = snapshot as Record<string, unknown>;
    const title =
        typeof record.sourceTitle === "string" && record.sourceTitle.trim()
            ? record.sourceTitle
            : "私聊会话";

    const capturedAt = typeof record.capturedAt === "string" ? record.capturedAt : null;

    const kind = typeof record.kind === "string" ? record.kind : "chat_session_snapshot";

    if (kind === "chat_response_snapshot") {
        const message = normalizeSnapshotMessage(record.targetMessage);

        return {
            title,
            capturedAt,
            messages: message ? [message] : [],
        };
    }

    return {
        title,
        capturedAt,
        messages: normalizeSnapshotMessages(record.messages),
    };
};
