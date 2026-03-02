import { Edit2, Save, X } from "lucide-react";

interface ProfileHeaderProps {
    isEditing: boolean;
    onStartEdit: () => void;
    onCancel: () => void;
    onSave: () => void;
}

export const ProfileHeader = ({ isEditing, onStartEdit, onCancel, onSave }: ProfileHeaderProps) => {
    return (
        <>
            <div className="w-10" />
            <h2 className="text-3xl font-bold text-slate-900 text-center tracking-tight">
                账号设置
            </h2>
            {isEditing ? (
                <div className="flex gap-2">
                    <button
                        onClick={onCancel}
                        className="p-2 rounded-[9999px] hover:bg-slate-200 text-slate-500 transition-colors"
                    >
                        <X size={20} />
                    </button>
                    <button
                        onClick={onSave}
                        className="p-2 rounded-[9999px] bg-blue-600 text-white hover:bg-blue-700 shadow-md transition-all hover:scale-105"
                    >
                        <Save size={20} />
                    </button>
                </div>
            ) : (
                <button
                    onClick={onStartEdit}
                    className="p-2 rounded-[9999px] hover:bg-slate-200 text-slate-500 transition-colors"
                >
                    <Edit2 size={20} />
                </button>
            )}
        </>
    );
};
