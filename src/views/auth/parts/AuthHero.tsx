import { GraduationCap } from "lucide-react";
import { Card } from "../../shared/ui/card";

export const AuthHero = () => {
    return (
        <div className="hidden md:flex flex-1 bg-[#f8fafc] relative items-center justify-center overflow-hidden">
            <img
                src="https://images.unsplash.com/photo-1692889783742-7d99b124c402?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMG1pbmltYWwlMjB3aGl0ZSUyMGdlb21ldHJpYyUyMDNkJTIwc2hhcGVzfGVufDF8fHx8MTc2ODgxNDQxNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Abstract"
                className="absolute inset-0 w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-linear-to-tr from-white/40 to-transparent" />

            <Card variant="glass" radius="xl" shadow="lg" padding="lg" className=" z-10 max-w-xs">
                <div className="w-12 h-12 bg-[#000000] rounded-[0.75rem] flex items-center justify-center mb-4">
                    <GraduationCap className="text-white" />
                </div>
                <h3 className="font-bold text-xl text-[#334155] mb-2">精通力学</h3>
                <p className="text-sm text-[#475569]">
                    加入数万名通过 AI 辅助掌握理论力学的学生行列。
                </p>
            </Card>
        </div>
    );
};
