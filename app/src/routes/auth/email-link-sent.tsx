import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { DetailedHTMLProps, HTMLAttributes } from "react";

function Center({ children, className, ...props }: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) {
  return (
    <div className="relative h-full" {...props}>
      <div className={cn("absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2", className)}>
        {children}
      </div>
    </div>
  )
}

export default function EmailLinkSentPage() {
  return (
    <Center className="text-center space-y-4 -translate-y-[80%]">
      <div className="w-32 h-32 rounded-full bg-slate-100 flex items-center justify-center m-auto">
        <Check size={80} />
      </div>
      <h2>We sent you an email link</h2>
      <p>Open it to access your account</p>
    </Center>
  )
}