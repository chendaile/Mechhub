import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils";

const cardVariants = cva("border", {
    variants: {
        variant: {
            surface: "border-slate-200 bg-white",
            panel: "border-slate-200 bg-white shadow-sm",
            table: "border-slate-200 bg-white shadow-sm overflow-hidden",
            glass: "border-white/50 bg-[rgb(255_255_255_/_0.3)]",
        },
        radius: {
            lg: "rounded-xl",
            xl: "rounded-2xl",
            "3xl": "rounded-3xl",
            hero: "rounded-[2.5rem]",
        },
        shadow: {
            sm: "shadow-sm",
            lg: "shadow-lg",
            xl: "shadow-2xl",
        },
        padding: {
            none: "",
            sm: "p-4",
            md: "p-6",
            lg: "p-8",
        },
    },
    defaultVariants: {
        variant: "surface",
        radius: "xl",
        shadow: "sm",
        padding: "none",
    },
});

export interface CardProps
    extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant, radius, shadow, padding, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(cardVariants({ variant, radius, shadow, padding }), className)}
            {...props}
        />
    ),
);

Card.displayName = "Card";

export { Card, cardVariants };
