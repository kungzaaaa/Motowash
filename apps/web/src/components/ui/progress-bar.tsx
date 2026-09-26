import * as React from "react"
import { cn } from "@/lib/utils"

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0-100
  label?: string;
  showPercentage?: boolean;
  color?: string;
}

export function ProgressBar({ 
  value, 
  label, 
  showPercentage = false, 
  color = "bg-[#0056B3]",
  className,
  ...props 
}: ProgressBarProps) {
  const safeValue = Math.min(Math.max(value, 0), 100);

  return (
    <div className={cn("w-full", className)} {...props}>
      {(label || showPercentage) && (
        <div className="flex justify-between mb-1.5 items-center">
          {label && <span className="text-sm font-medium text-[#212529]">{label}</span>}
          {showPercentage && <span className="text-sm font-medium text-[#0056B3]">{Math.round(safeValue)}%</span>}
        </div>
      )}
      <div className="w-full bg-[#E5E7EB] rounded-full h-2.5 overflow-hidden">
        <div 
          className={cn("h-2.5 rounded-full transition-all duration-500 ease-in-out", color)} 
          style={{ width: `${safeValue}%` }}
        ></div>
      </div>
    </div>
  )
}
