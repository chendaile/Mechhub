const THINKING_MODEL_HINTS = ["thinking", "reason", "deep", "o1"];

export const isThinkingModel = (model?: string | null) => {
    if (!model) {
        return false;
    }
    const normalized = model.toLowerCase();
    return THINKING_MODEL_HINTS.some((hint) => normalized.includes(hint));
};
