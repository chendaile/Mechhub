import { motion } from "framer-motion";
import { TimelineNode } from "./TimelineNode";
import styles from "../../shared/scrollbar.module.css";

export const ProfileTimeline = () => {
    return (
        <>
            <h3 className="text-xl font-bold text-slate-900 mb-8">课程进度</h3>
            <div
                className={`relative w-full h-80 overflow-x-auto overflow-y-hidden ${styles.scrollbar}`}
            >
                <div className="relative flex h-full min-w-[900px] items-center">
                    <svg
                        className="absolute top-0 left-0 w-full h-full pointer-events-none"
                        style={{ overflow: "visible" }}
                    >
                        <defs>
                            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#3B82F6" />
                                <stop offset="50%" stopColor="#3B82F6" />
                                <stop offset="100%" stopColor="#CBD5E1" />
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
                    <TimelineNode x={250} y={158} title="动力学分析" status="current" delay={1.2} />
                    <TimelineNode
                        x={350}
                        y={236}
                        title="锁定关卡"
                        status="locked"
                        delay={1.4}
                        isTop={false}
                    />
                    <TimelineNode x={450} y={158} title="能量与动量" status="locked" delay={1.6} />
                    <TimelineNode
                        x={550}
                        y={80}
                        title="流体动力学"
                        status="locked"
                        delay={1.8}
                        isTop
                    />
                    <TimelineNode x={650} y={158} title="热力学基础" status="locked" delay={2.0} />
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
        </>
    );
};
