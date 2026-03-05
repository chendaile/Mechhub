import { motion, type Variants } from "framer-motion";
import { ProfileAvatar } from "./parts/ProfileAvatar";
import { ProfileFields } from "./parts/ProfileFields";
import { ProfileHeader } from "./parts/ProfileHeader";
import { ProfileSkills } from "./parts/ProfileSkills";
import { ProfileTimeline } from "./parts/ProfileTimeline";
import styles from "../shared/scrollbar.module.css";
import { ProfileUIState } from "@hooks/profile/ui/ProfileUIState";

type ProfileViewProps = ReturnType<typeof ProfileUIState>;

const createProfileView = ({
    name,
    setName,
    avatarUrl,
    isEditing,
    isUpdating,
    setIsEditing,
    handleAvatarSelect,
    handleSave,
    handleCancel,
}: ProfileViewProps) => {
    const containerVariants: Variants = {
        hidden: { opacity: 0, y: 18 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
        },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 12 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
        },
    };

    return (
        <div className={`flex-1 h-full overflow-y-auto bg-slate-50/50 ${styles.scrollbar}`}>
            <motion.div
                className="max-w-5xl mx-auto p-8 md:p-12 pb-24"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div
                    variants={itemVariants}
                    className="flex items-center justify-between mb-12"
                >
                    <ProfileHeader
                        isEditing={isEditing}
                        onStartEdit={() => setIsEditing(true)}
                        onCancel={handleCancel}
                        onSave={handleSave}
                    />
                </motion.div>

                <motion.div className="flex flex-col items-center mb-16" variants={itemVariants}>
                    <ProfileAvatar
                        avatar={avatarUrl ?? ""}
                        isEditing={isEditing}
                        isUploading={isUpdating}
                        onUpload={handleAvatarSelect}
                    />
                    <ProfileFields
                        name={name ?? ""}
                        isEditing={isEditing}
                        onNameChange={setName}
                    />
                </motion.div>

                <motion.div className="mb-16" variants={itemVariants}>
                    <ProfileSkills />
                </motion.div>

                <motion.div variants={itemVariants}>
                    <ProfileTimeline />
                </motion.div>
            </motion.div>
        </div>
    );
};

export const ProfileView = () => {
    const state = ProfileUIState();
    return createProfileView(state);
};
