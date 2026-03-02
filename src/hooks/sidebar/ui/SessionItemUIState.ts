import { toast } from "sonner";
import { SessionMenuUIState } from "./SessionMenuUIState";
import { SessionRenameUIState } from "./SessionRenameUIState";

interface SessionItemUIStateParams {
    label: string;
    onRename?: (newTitle: string) => Promise<boolean>;
    onDelete?: () => void;
}

export const SessionItemUIState = ({ label, onRename, onDelete }: SessionItemUIStateParams) => {
    const menu = SessionMenuUIState({ onDelete });
    const rename = SessionRenameUIState({
        label,
        onRename,
        onRenameSuccess: () => toast.success("重命名成功"),
    });

    const handleStartEdit = () => {
        menu.actions.closeMenu();
        rename.actions.handleStartEdit();
    };

    return {
        isEditing: rename.state.isEditing,
        editTitle: rename.state.editTitle,
        isMenuOpen: menu.state.isMenuOpen,
        inputRef: rename.state.inputRef,
        menuRef: menu.state.menuRef,
        handleSaveRename: rename.actions.handleSaveRename,
        handleCancelRename: rename.actions.handleCancelRename,
        handleStartEdit,
        handleToggleMenu: menu.actions.handleToggleMenu,
        handleDelete: menu.actions.handleDelete,
        closeMenu: menu.actions.closeMenu,
        setEditTitle: rename.actions.setEditTitle,
        canRename: rename.state.canRename,
    };
};
