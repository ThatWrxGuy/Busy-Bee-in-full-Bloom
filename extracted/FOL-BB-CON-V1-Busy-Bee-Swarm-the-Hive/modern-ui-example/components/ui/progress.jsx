import * as React from "react"
import { cn } from "../../src/lib/utils"

const Progress = React.forwardRef(({ className, value = 0, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative h-2 w-full overflow-hidden rounded-full bg-secondary",
      className
    )}
    {...props}
  >
    <div
      className="h-full bg-primary transition-all"
      style={{ width: `${value}%` }}
    />
  </div>
))
Progress.displayName = "Progress"

export { Progress }
