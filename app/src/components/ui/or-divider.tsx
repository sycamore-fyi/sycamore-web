import { Caption } from "../typography/Caption";
import { Separator } from "./separator";

interface Props {
  text?: string
}

export function OrDivider({ text = "or" }: Props) {
  return (
    <div className="flex items-center gap-3 w-full">
      <Separator className="flex-shrink flex-grow w-auto" />
      <Caption>{text.toUpperCase()}</Caption>
      <Separator className="flex-shrink flex-grow w-auto" />
    </div>
  )
}