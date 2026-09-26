import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, helperText, required, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="mb-2 block text-sm font-medium text-[#212529]">
            {label} {required && <span className="text-[#DC3545]">*</span>}
          </label>
        )}
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-[#212529] placeholder:text-[#6C757D] focus:outline-none focus:ring-2 focus:ring-[#0056B3] disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
            error && "border-[#DC3545] focus:ring-[#DC3545]",
            className
          )}
          ref={ref}
          required={required}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-[#DC3545]">{error}</p>}
        {helperText && !error && <p className="mt-1 text-sm text-[#6C757D]">{helperText}</p>}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
