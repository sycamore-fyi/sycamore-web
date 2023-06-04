import { useNavigate } from "react-router-dom";

interface To {
  path: string,
  query?: Record<string, string>,
  hash?: Record<string, string>,
}

export function useComplexNavigate() {
  const navigate = useNavigate()

  return ({
    path,
    query = {},
    hash = {},
  }: To) => {
    const queryString = Object.entries(query).reduce((h, [key, value], index) => {
      if (index === 0) return h + `${key}=${encodeURIComponent(value)}`
      return h + `&${key}=${encodeURIComponent(value)}`
    }, "?")


    const hashString = Object.entries(hash).reduce((h, [key, value], index) => {
      if (index === 0) return h + `${key}=${encodeURIComponent(value)}`
      return h + `&${key}=${encodeURIComponent(value)}`
    }, "#")

    return navigate({
      pathname: path,
      search: queryString,
      hash: hashString
    })
  }
}