export function decode(jwt: string) {
  const [header, payload] = jwt
    .split(".")
    .slice(0, 2)
    .map((e) => JSON.parse(atob(e)))

  return { header, payload }
}
