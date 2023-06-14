
export function getInitials(name: string) {
  return name.split(" ")
    .filter(n => n.length > 0)
    .map(n => n[0].toUpperCase())
    .join("");
}
