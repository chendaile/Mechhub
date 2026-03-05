import { Mail } from "lucide-react";

type AuthVerificationProps = {
    email: string;
};

export const AuthVerification = ({ email }: AuthVerificationProps) => {
    return (
        <div className="flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="w-16 h-16 bg-[#dcfce7] rounded-[999px] flex items-center justify-center mb-6">
                <Mail className="text-[#16a34a] w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-[#0f172a] mb-2">请验证您的邮箱</h3>
            <p className="text-[#475569] mb-8">
                我们已向 <span className="font-semibold text-[#0f172a]">{email}</span>{" "}
                发送了一封验证邮件。
                <br />
                请点击邮件中的链接以激活您的账户。
            </p>
        </div>
    );
};
