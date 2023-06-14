import { decode } from "./decode"

export function isExpired(jwt: string) {
  let jwtPayload: any

  try {
    const { payload } = decode(jwt)
    jwtPayload = payload
  } catch (err) {
    console.log(err)
    return true
  }

  const expirySecondsSinceEpoch = jwtPayload.exp

  if (!expirySecondsSinceEpoch) return false

  const expiryDate = new Date(expirySecondsSinceEpoch * 1000)
  const currDate = new Date(Date.now())

  return currDate > expiryDate
}
