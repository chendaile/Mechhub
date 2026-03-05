import type { AIGatewayInterface } from "../interface/aiGatewayInterface";
import type {
    AICompletionRequest,
    AICompletionResponse,
    GradingResult,
    Message,
    OcrResult,
} from "../types";
import { httpClient } from "../../shared/httpClient";

const tryParseGrading = (raw: string): GradingResult | undefined => {
    try {
        const parsed = JSON.parse(raw) as GradingResult;
        if (parsed && typeof parsed.summary === "string" && Array.isArray(parsed.imageGradingResult)) {
            return parsed;
        }
    } catch {
        return undefined;
    }
    return undefined;
};

export const createHttpAIGateway = (): AIGatewayInterface => {
    return {
        async getResponseStream(
            request: AICompletionRequest,
            onChunk: (chunk: { type: "content" | "reasoning"; content: string }) => void,
            _abortSignal?: AbortSignal,
        ): Promise<AICompletionResponse> {
            const response = await httpClient.post<AICompletionResponse>("/chat/ai/stream", request);
            if (response.reasoning) {
                onChunk({ type: "reasoning", content: response.reasoning });
            }
            onChunk({ type: "content", content: response.text });
            return response;
        },
        async getOcrResult(imageUrls: string[]): Promise<OcrResult[]> {
            return httpClient.post<OcrResult[]>("/chat/ai/ocr", { imageUrls });
        },
        parseGradingResult(aiReply: string, _userImageUrls: string[]) {
            return tryParseGrading(aiReply);
        },
        async generateTitle(messages: Message[]): Promise<string> {
            const result = await httpClient.post<{ title: string }>("/chat/ai/title", { messages });
            return result.title;
        },
    };
};
