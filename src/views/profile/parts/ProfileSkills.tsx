import { Settings, Wind, Anchor, Waves, Thermometer, Activity } from "lucide-react";
import { SkillCard } from "./SkillCard";

export const ProfileSkills = () => {
    return (
        <>
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
        </>
    );
};
