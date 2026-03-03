import type { LucideIcon } from "lucide-react";
import { SessionItemUIState } from "../../hooks/sidebar/ui/SessionItemUIState";
import { SessionItem as SessionItemView } from "@views/sidebar/parts/SessionItem";

interface SessionItemMenuAction {
    key: string;
    label: string;
    icon: LucideIcon;
    variant?: "default" | "danger";
    onClick: () => void;
}

interface SessionItemProps {
    label: string;
    icon: LucideIcon;
    active: boolean;
    onClick: () => void;
    onDelete?: () => void;
    onRename?: (newTitle: string) => Promise<boolean>;
    isGeneratingTitle?: boolean;
    menuActions?: SessionItemMenuAction[];
}

export const SessionItem = ({
    label,
    icon,
    active,
    onClick,
    onDelete,
    onRename,
    isGeneratingTitle = false,
    menuActions = [],
}: SessionItemProps) => {
    const {
        isEditing,
        editTitle,
        isMenuOpen,
        inputRef,
        menuRef,
        handleSaveRename,
        handleCancelRename,
        handleStartEdit,
        handleToggleMenu,
        handleDelete,
        closeMenu,
        setEditTitle,
        canRename,
    } = SessionItemUIState({
        label,
        onRename,
        onDelete,
    });

    return (
        <SessionItemView
            label={label}
            icon={icon}
            active={active}
            onClick={onClick}
            isGeneratingTitle={isGeneratingTitle}
            isEditing={isEditing}
            editTitle={editTitle}
            isMenuOpen={isMenuOpen}
            inputRef={inputRef}
            menuRef={menuRef}
            onStartEdit={canRename ? handleStartEdit : undefined}
            onChangeTitle={setEditTitle}
            onSave={handleSaveRename}
            onCancel={handleCancelRename}
            onToggleMenu={handleToggleMenu}
            onCloseMenu={closeMenu}
            onDelete={onDelete ? handleDelete : undefined}
            menuActions={menuActions}
        />
    );
};
