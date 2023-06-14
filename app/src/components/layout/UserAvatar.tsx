import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "./getInitials";

interface Props {
  name?: string | null,
  photoUrl?: string | null
}

const generateInteger = (name: string, max: number) => [...name].reduce((hash, char) => {
  return Math.abs(((hash << 5) - hash) + char.charCodeAt(0)) | 0;
}, 0) % (max - 1);

const colors = [
  "bg-purple-200 text-purple-600",
  "bg-blue-200 text-blue-600",
  "bg-green-200 text-green-600",
  "bg-red-200 text-red-600",
  "bg-orange-200 text-orange-600",
]

export default function UserAvatar(props: Props) {
  const name = props.name ?? "UN"
  const color = colors[generateInteger(name, colors.length)]

  return (
    <Avatar>
      <AvatarImage src={props.photoUrl ?? undefined} />
      <AvatarFallback className={color}>{getInitials(name)}</AvatarFallback>
    </Avatar>
  );
}
