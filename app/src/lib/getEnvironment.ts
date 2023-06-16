import { Environment } from "@sycamore-fyi/shared";

export function getEnvironment() {
  const envName = import.meta.env.VITE_ENV_NAME
  if (!Object.keys(Environment).includes(envName)) {
    throw new Error("invalid environment")
  }

  return envName as Environment
}