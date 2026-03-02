import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils";

const inputVariants = cva(
    "flex w-full border text-slate-700 outline-none transition-all placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-70",
    {
        variants: {
            variant: {
                default:
                    "border-slate-200 bg-slate-50 focus:border-slate-900 focus:ring-1 focus:ring-slate-900",
                ghost: "border-slate-200 bg-white focus:border-slate-400 focus:ring-1 focus:ring-slate-300",
                search: "rounded-full border-slate-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
                panel: "border-slate-200 bg-white focus:border-slate-500 focus:ring-2 focus:ring-slate-100",
            },
            inputSize: {
                sm: "rounded-lg px-3 py-2 text-sm",
                md: "rounded-xl px-4 py-3 text-sm",
            },
        },
        defaultVariants: {
            variant: "default",
            inputSize: "md",
        },
    },
);

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type = "text", variant, inputSize, ...props }, ref) => (
        <input
            type={type}
            className={cn(inputVariants({ variant, inputSize }), className)}
            ref={ref}
            {...props}
        />
    ),
);

Input.displayName = "Input";

export { Input, inputVariants };
