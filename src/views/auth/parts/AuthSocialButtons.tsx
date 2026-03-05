import { Chrome, GraduationCap } from "lucide-react";
import { Button } from "../../shared/ui/button";

type AuthSocialButtonsProps = {
    onSocialLogin: () => void;
};

export const AuthSocialButtons = ({ onSocialLogin }: AuthSocialButtonsProps) => {
    return (
        <div className="flex gap-4 justify-center">
            <Button
                onClick={() => onSocialLogin()}
                variant="soft"
                size="icon"
                title="通过 Google 继续"
            >
                <Chrome size={24} className="text-[#334155]" />
            </Button>
            <Button variant="soft" size="icon" title="校园账号登录 (模拟)">
                <GraduationCap size={24} className="text-[#334155]" />
            </Button>
        </div>
    );
};
