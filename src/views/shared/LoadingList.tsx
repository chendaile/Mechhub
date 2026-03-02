import type { HTMLAttributes } from "react";

interface LoadingListProps extends HTMLAttributes<HTMLDivElement> {
    lines?: number;
    lineClassName?: string;
}

export const LoadingList = ({ lines = 3, className, lineClassName, ...rest }: LoadingListProps) => {
    const totalLines = Number.isFinite(lines) ? Math.max(1, Math.floor(lines)) : 3;

    return (
        <div className={`animate-pulse space-y-3 ${className ?? ""}`.trim()} {...rest}>
            {Array.from({ length: totalLines }).map((_, index) => (
                <div
                    key={`loading-line-${index}`}
                    className={`h-5 w-full rounded-[1rem] bg-[#e1e6ea] ${lineClassName ?? ""}`.trim()}
                />
            ))}
        </div>
    );
};
