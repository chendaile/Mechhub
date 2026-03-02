import { useRef, type ChangeEvent } from "react";
import { Camera, Edit2 } from "lucide-react";

interface ProfileAvatarProps {
    avatar: string;
    isEditing: boolean;
    isUploading?: boolean;
    onUpload?: (file: File) => void;
}

export const ProfileAvatar = ({
    avatar,
    isEditing,
    isUploading = false,
    onUpload,
}: ProfileAvatarProps) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handlePick = () => {
        if (!isEditing) {
            return;
        }
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && onUpload) {
            onUpload(file);
        }
        event.target.value = "";
    };

    return (
        <div className="relative group cursor-pointer mb-8" onClick={handlePick}>
            <div
                className={`w-32 h-32 rounded-[9999px] overflow-hidden border-4 border-white shadow-xl ring-1 ring-slate-100 relative ${
                    isEditing ? "ring-blue-400 ring-4" : ""
                }`}
            >
                <img
                    src={avatar}
                    alt="Profile"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {isEditing && !isUploading && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <Camera className="text-white drop-shadow-md" size={32} />
                    </div>
                )}
                {isUploading && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="text-xs font-semibold text-white">上传中...</span>
                    </div>
                )}
            </div>
            {!isEditing && (
                <div className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-[9999px] shadow-lg border-2 border-white hover:bg-blue-700 transition-colors">
                    <Edit2 size={16} />
                </div>
            )}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
            />
        </div>
    );
};
