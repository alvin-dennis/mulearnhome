import * as React from "react";
import { cn } from "@/lib/utils";

type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
};

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        type="checkbox"
        ref={ref}
        className={cn(
          "w-4 h-4 rounded-sm border bg-mulearn-whitish text-mulearn-trusty-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mulearn-trusty-blue/50",
          className,
        )}
        {...props}
      />
    );
  },
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
