import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils";

const buttonVariants = cva(
    "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap font-semibold transition-all focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-70",
    {
        variants: {
            variant: {
                primary: "bg-slate-900 text-white shadow-sm hover:bg-black/85",
                pill_primary:
                    "rounded-full bg-slate-900 px-5 py-2.5 text-white shadow-sm hover:bg-black/85",
                pill_secondary:
                    "rounded-full border border-slate-200 bg-white px-5 py-2.5 text-slate-700 shadow-sm hover:bg-slate-50",
                outline:
                    "border-2 border-[#000000] text-[#000000] hover:bg-[#000000] hover:text-[#ffffff]",
                soft: "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                ghost: "text-slate-600 hover:bg-slate-100",
                tab: "rounded-lg border border-transparent text-slate-600 hover:bg-slate-100",
            },
            size: {
                sm: "rounded-lg px-3 py-1.5 text-sm",
                md: "rounded-xl px-4 py-2 text-sm",
                lg: "rounded-full px-6 py-3 text-base",
                xl: "rounded-full px-8 py-4 text-2xl",
                icon: "h-10 w-10 rounded-xl",
            },
        },
        defaultVariants: {
            variant: "primary",
            size: "md",
        },
    },
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, ...props }, ref) => (
        <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
    ),
);

Button.displayName = "Button";

export { Button, buttonVariants };
