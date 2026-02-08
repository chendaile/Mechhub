import React from "react";
import { motion } from "motion/react";
import {
    Settings,
    Wind,
    Anchor,
    Waves,
    Thermometer,
    Activity,
    Lock,
    Check,
    Camera,
    Edit2,
    Save,
    X,
} from "lucide-react";

import { UserProfile } from "@features/auth";
import { useProfileState } from "@hook/profile/ui/useProfileState";

interface ProfileViewProps {
    user?: UserProfile;
    onUpdateProfile?: (name: string, role: string, avatar: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
    user,
    onUpdateProfile,
}) => {
    const {
        name,
        setName,
        role,
        setRole,
        avatar,
        isEditing,
        setIsEditing,
        handleSave,
        handleCancel,
        containerVariants,
        itemVariants,
    } = useProfileState(user, onUpdateProfile);

    return (
        <div className="flex-1 h-full overflow-y-auto bg-slate-50/50">
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
                    <div className="w-10" /> {/* Spacer */}
                    <h2 className="text-3xl font-bold text-slate-900 text-center tracking-tight">
                        账号设置
                    </h2>
                    {isEditing ? (
                        <div className="flex gap-2">
                            <button
                                onClick={handleCancel}
                                className="p-2 rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
                            >
                                <X size={20} />
                            </button>
                            <button
                                onClick={handleSave}
                                className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 shadow-md transition-all hover:scale-105"
                            >
                                <Save size={20} />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="p-2 rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
                        >
                            <Edit2 size={20} />
                        </button>
                    )}
                </motion.div>

                {/* Profile Header Section */}
                <motion.div
                    className="flex flex-col items-center mb-16"
                    variants={itemVariants}
                >
                    {/* Avatar */}
                    <div className="relative group cursor-pointer mb-8">
                        <div
                            className={`w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl ring-1 ring-slate-100 relative ${isEditing ? "ring-blue-400 ring-4" : ""}`}
                        >
                            <img
                                src={avatar}
                                alt="Profile"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            {isEditing && (
                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                    <Camera
                                        className="text-white drop-shadow-md"
                                        size={32}
                                    />
                                </div>
                            )}
                        </div>
                        {!isEditing && (
                            <div className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-lg border-2 border-white hover:bg-blue-700 transition-colors">
                                <Edit2 size={16} />
                            </div>
                        )}
                    </div>

                    {/* Input Fields */}
                    <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 ml-1">
                                姓名
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={!isEditing}
                                className={`w-full px-4 py-3 rounded-xl border bg-white text-slate-900 transition-all shadow-sm font-medium ${
                                    isEditing
                                        ? "border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                        : "border-slate-200 bg-slate-50 text-slate-600"
                                }`}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 ml-1">
                                职业 / 学位
                            </label>
                            <input
                                type="text"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                disabled={!isEditing}
                                className={`w-full px-4 py-3 rounded-xl border bg-white text-slate-900 transition-all shadow-sm font-medium ${
                                    isEditing
                                        ? "border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                        : "border-slate-200 bg-slate-50 text-slate-600"
                                }`}
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Certifications & Skills Section */}
                <motion.div className="mb-16" variants={itemVariants}>
                    <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        证书与技能
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <SkillCard
                            icon={<Settings strokeWidth={1.5} />}
                            title="静力学"
                            status="earned"
                            delay={0}
                        />
                        <SkillCard
                            icon={<Wind strokeWidth={1.5} />}
                            title="运动学"
                            status="earned"
                            delay={0.1}
                        />
                        <SkillCard
                            icon={<Anchor strokeWidth={1.5} />}
                            title="动力学"
                            status="earned"
                            delay={0.2}
                        />
                        <SkillCard
                            icon={<Waves strokeWidth={1.5} />}
                            title="流体力学"
                            status="earned"
                            delay={0.3}
                        />
                        <SkillCard
                            icon={<Thermometer strokeWidth={1.5} />}
                            title="热力学"
                            status="locked"
                            delay={0.4}
                        />
                        <SkillCard
                            icon={<Activity strokeWidth={1.5} />}
                            title="振动理论"
                            status="locked"
                            delay={0.5}
                        />
                    </div>
                </motion.div>

                {/* Curriculum Progress Section */}
                <motion.div variants={itemVariants}>
                    <h3 className="text-xl font-bold text-slate-900 mb-8">
                        课程进度
                    </h3>
                    <div className="relative w-full h-80 overflow-x-auto overflow-y-hidden hide-scrollbar">
                        <div className="relative flex h-full min-w-[900px] items-center">
                            {/* SVG Path Background */}
                            <svg
                                className="absolute top-0 left-0 w-full h-full pointer-events-none"
                                style={{ overflow: "visible" }}
                            >
                                <defs>
                                    <linearGradient
                                        id="lineGradient"
                                        x1="0%"
                                        y1="0%"
                                        x2="100%"
                                        y2="0%"
                                    >
                                        <stop offset="0%" stopColor="#3B82F6" />
                                        <stop
                                            offset="50%"
                                            stopColor="#3B82F6"
                                        />
                                        <stop
                                            offset="100%"
                                            stopColor="#CBD5E1"
                                        />
                                    </linearGradient>
                                </defs>
                                <g transform="translate(0, 30)">
                                    <motion.path
                                        d="M 50 128 C 150 20, 150 20, 250 128 C 350 236, 350 236, 450 128 C 550 20, 550 20, 650 128 C 750 236, 750 236, 850 128"
                                        fill="none"
                                        stroke="url(#lineGradient)"
                                        strokeWidth="4"
                                        strokeLinecap="round"
                                        initial={{ pathLength: 0, opacity: 0 }}
                                        animate={{ pathLength: 1, opacity: 1 }}
                                        transition={{
                                            duration: 2,
                                            ease: "easeInOut",
                                            delay: 0.5,
                                        }}
                                    />
                                </g>
                            </svg>

                            {/* Nodes */}
                            <TimelineNode
                                x={50}
                                y={158}
                                title="静力学与平衡"
                                status="completed"
                                delay={0.8}
                            />
                            <TimelineNode
                                x={150}
                                y={80}
                                title="运动学基础"
                                status="completed"
                                delay={1.0}
                                isTop
                            />
                            <TimelineNode
                                x={250}
                                y={158}
                                title="动力学分析"
                                status="current"
                                delay={1.2}
                            />
                            <TimelineNode
                                x={350}
                                y={236}
                                title="锁定关卡"
                                status="locked"
                                delay={1.4}
                                isTop={false}
                            />
                            <TimelineNode
                                x={450}
                                y={158}
                                title="能量与动量"
                                status="locked"
                                delay={1.6}
                            />
                            <TimelineNode
                                x={550}
                                y={80}
                                title="流体动力学"
                                status="locked"
                                delay={1.8}
                                isTop
                            />
                            <TimelineNode
                                x={650}
                                y={158}
                                title="热力学基础"
                                status="locked"
                                delay={2.0}
                            />
                            <TimelineNode
                                x={750}
                                y={236}
                                title="振动与波"
                                status="locked"
                                delay={2.2}
                                isTop={false}
                            />
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

// Sub-components

const SkillCard = ({
    icon,
    title,
    status,
    delay,
}: {
    icon: React.ReactNode;
    title: string;
    status: "earned" | "locked";
    delay: number;
}) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.5 }}
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
        className={`group relative p-6 rounded-2xl border flex items-center gap-6 cursor-pointer overflow-hidden ${
            status === "earned"
                ? "bg-white border-slate-200 hover:border-slate-300 hover:shadow-lg"
                : "bg-slate-50 border-slate-100 opacity-70 grayscale"
        }`}
    >
        {/* Background Pattern */}
        <div className="absolute -right-8 -bottom-8 h-32 w-32 rounded-full bg-slate-50 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        <div
            className={`relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-3xl transition-colors ${
                status === "earned"
                    ? "bg-slate-50 text-slate-800 group-hover:bg-blue-50 group-hover:text-blue-600"
                    : "bg-slate-100 text-slate-400"
            }`}
        >
            {icon}
        </div>

        <div className="flex-1 relative z-10">
            <h4 className="text-lg font-bold text-slate-800 mb-1">{title}</h4>
            <div className="flex items-center gap-1.5 text-sm font-medium text-slate-400">
                {status === "earned" ? (
                    <>
                        <Check
                            size={14}
                            className="text-green-500"
                            strokeWidth={3}
                        />
                        <span className="text-slate-500">已获得</span>
                    </>
                ) : (
                    <>
                        <Lock size={14} />
                        未解锁
                    </>
                )}
            </div>
        </div>

        {status === "locked" && (
            <div className="absolute top-4 right-4">
                <Lock size={16} className="text-slate-300" />
            </div>
        )}
    </motion.div>
);

const TimelineNode = ({
    x,
    y,
    title,
    status,
    delay,
    isTop,
}: {
    x: number;
    y: number;
    title: string;
    status: "completed" | "current" | "locked";
    delay: number;
    isTop?: boolean;
}) => {
    // SVG coordinate adjustments for absolute positioning in the container
    // The path roughly goes through the center y=128, then up/down.
    // We need to position these divs absolutely based on the approximate path coordinates.

    return (
        <motion.div
            className="absolute flex flex-col items-center"
            style={{ left: x - 20, top: y - 20 }} // Center the 40px node
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay, type: "spring", stiffness: 200 }}
        >
            <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-[4px] z-10 shadow-sm relative ${
                    status === "completed"
                        ? "bg-white border-blue-500"
                        : status === "current"
                          ? "bg-blue-600 border-blue-200 ring-4 ring-blue-100"
                          : "bg-slate-100 border-slate-200"
                }`}
            >
                {status === "completed" && (
                    <div className="w-3 h-3 bg-blue-500 rounded-full" />
                )}
                {status === "current" && (
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                )}
                {status === "locked" && (
                    <Lock size={14} className="text-slate-300" />
                )}
            </div>

            <motion.div
                className={`absolute w-32 text-center text-xs font-bold leading-tight ${
                    status === "locked" ? "text-slate-400" : "text-slate-800"
                }`}
                style={{ top: isTop ? -45 : 50 }}
                initial={{ opacity: 0, y: isTop ? 10 : -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: delay + 0.2 }}
            >
                {title}
            </motion.div>
        </motion.div>
    );
};
