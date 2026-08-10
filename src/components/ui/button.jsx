import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97] [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-foreground text-background shadow-sm hover:bg-foreground/90",
        primary:
          "gradient-brand-accent text-white shadow-sm hover:brightness-105",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-transparent shadow-sm hover:bg-accent/10 hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent/10 hover:text-accent-foreground rounded-xl",
        link: "text-primary underline-offset-4 hover:underline font-medium",
        sand: "bg-[#A1846B]/10 text-[#A1846B] hover:bg-[#A1846B]/20",
      },
      size: {
        // Primary CTA — 48px, 16px text, extra-bold
        default: "h-12 px-6 text-base font-extrabold [&_svg]:size-5",
        // Secondary action — 44px, 15px text, bold
        md: "h-11 px-5 text-base font-bold [&_svg]:size-4",
        // Compact action — 40px, 14px text, semibold
        sm: "h-10 px-4 text-sm font-semibold [&_svg]:size-4",
        // Tiny — 36px, 13px text
        xs: "h-9 px-3 text-sm font-semibold [&_svg]:size-3.5",
        // Square icon buttons
        icon: "h-12 w-12 [&_svg]:size-5",
        "icon-md": "h-11 w-11 [&_svg]:size-4",
        "icon-sm": "h-10 w-10 [&_svg]:size-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    (<Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props} />)
  );
})
Button.displayName = "Button"

export { Button, buttonVariants }
