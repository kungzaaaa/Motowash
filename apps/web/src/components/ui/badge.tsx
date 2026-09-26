import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "pending" | "active" | "success" | "error" | "neutral"
}

function Badge({ className, variant = "neutral", ...props }: BadgeProps) {
  const variants = {
    pending: "bg-[#FFC107]/20 text-[#B38705]", // Amber
    active: "bg-[#0056B3]/10 text-[#0056B3]", // Blue
    success: "bg-[#28A745]/10 text-[#28A745]", // Green
    error: "bg-[#DC3545]/10 text-[#DC3545]", // Red
    neutral: "bg-gray-100 text-[#6C757D]", // Gray
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }
