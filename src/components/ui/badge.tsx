import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#1A73E8] focus:ring-offset-2 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#1A73E8] text-white hover:bg-[#1A73E8]/80",
        secondary:
          "border-transparent bg-[#F8F9FA] text-[#202124] hover:bg-[#E0E0E0]",
        outline: "text-[#202124] border-[#E0E0E0] hover:bg-[#F8F9FA]",
        selected: "border-[#1A73E8] bg-[#E8F0FE] text-[#1A73E8]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps extends React.ComponentProps<"div"> {
  variant?: "default" | "secondary" | "outline" | "selected" | null;
}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
