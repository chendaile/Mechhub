import type { ReactNode } from "react";
import { GradingResultUIState } from "../../../hooks/chat/ui/GradingResultUIState";
import { GradingResultView } from "@views/chat/message/GradingResultView";
import type { GradingResult as GradingResultModel, ImageGradingResult } from "@views/chat/types";

interface GradingResultProps {
    gradingResult: GradingResultModel;
    reply?: string;
    reasoning?: string;
    ocrText?: string;
    showThinking?: boolean;
    renderImagePanel?: (image: ImageGradingResult) => ReactNode;
}

export const GradingResult = ({
    gradingResult,
    reply,
    reasoning,
    ocrText,
    showThinking = false,
    renderImagePanel,
}: GradingResultProps) => {
    const images = gradingResult.imageGradingResult || [];
    const {
        currentImageIndex,
        thinkingOpen,
        bodyOpen,
        ocrOpen,
        handlePrevImage,
        handleNextImage,
        handleToggleThinking,
        handleToggleBody,
        handleToggleOcr,
    } = GradingResultUIState(images);

    return (
        <GradingResultView
            gradingResult={gradingResult}
            body={reply}
            reasoning={reasoning}
            ocrText={ocrText}
            showThinking={showThinking}
            renderImagePanel={renderImagePanel}
            currentImageIndex={currentImageIndex}
            onPrevImage={handlePrevImage}
            onNextImage={handleNextImage}
            thinkingOpen={thinkingOpen}
            onToggleThinking={handleToggleThinking}
            bodyOpen={bodyOpen}
            onToggleBody={handleToggleBody}
            ocrOpen={ocrOpen}
            onToggleOcr={handleToggleOcr}
        />
    );
};
