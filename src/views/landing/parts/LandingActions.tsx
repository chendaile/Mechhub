import { Button } from "../../shared/ui/button";
import { cn } from "../../shared/utils";

interface LandingActionsProps {
    onLogin: () => void;
    className?: string;
}

export const LandingActions = ({ onLogin, className }: LandingActionsProps) => {
    return (
        <div className={cn("flex items-center", className)}>
            <Button onClick={onLogin} variant="outline" size="lg" className="font-['courier_new']">
                Login
            </Button>
        </div>
    );
};
