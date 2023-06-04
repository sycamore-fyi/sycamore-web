import { cn } from "@/lib/utils";
import { DetailedHTMLProps, HTMLAttributes } from "react";

export function Caption({ children, className, ...props }: DetailedHTMLProps<HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>) {
  return <p className={cn("text-sm text-gray-500", className)} {...props}>{children}</p>
}