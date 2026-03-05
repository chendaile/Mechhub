import { ImageGradingPanelUIState } from "@hooks/chat/ui/ImageGradingPanelUIState";
import { ImageGradingPanelView } from "@views/chat/message/ImageGradingPanelView";
import type { ImageGradingResult } from "@views/chat/types";

interface ImageGradingPanelProps {
    imageGrading: ImageGradingResult;
}

export const ImageGradingPanel = ({ imageGrading }: ImageGradingPanelProps) => {
    const {
        showDetail,
        openDetail,
        closeDetail,
        isSidebarOpen,
        toggleSidebar,
        activeStepIndex,
        handleSelectStep,
        stepRefs,
        stepListContainerRef,
        scale,
        position,
        isDragging,
        handleZoomIn,
        handleZoomOut,
        handleReset,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
    } = ImageGradingPanelUIState();

    return (
        <ImageGradingPanelView
            imageGrading={imageGrading}
            showDetail={showDetail}
            openDetail={openDetail}
            closeDetail={closeDetail}
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
            activeStepIndex={activeStepIndex}
            onSelectStep={handleSelectStep}
            stepRefs={stepRefs}
            stepListContainerRef={stepListContainerRef}
            scale={scale}
            position={position}
            isDragging={isDragging}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onReset={handleReset}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        />
    );
};
