import { cn } from "@/lib/utils";
import { DetailedHTMLProps, HTMLAttributes } from "react";

export function CenterPage({ children, className, ...props }: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) {
  return (
    <div className="h-auto min-h-screen flex justify-center items-center p-4" {...props}>
      <div className={cn("", className)}>
        {children}
      </div>
    </div>
  );
}
