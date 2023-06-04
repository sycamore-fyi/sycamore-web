import { useSearchParams } from "react-router-dom";

export function useQueryParams() {
  const [searchParams] = useSearchParams()
  const obj = Object.fromEntries(searchParams)

  return Object.entries(obj).reduce<{ [k: string]: string | undefined }>((params, [key, value]) => ({
    ...params,
    [key]: decodeURIComponent(value)
  }), {})
}