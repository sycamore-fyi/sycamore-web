import { Environment } from "@sycamore-fyi/shared";
import { projectID } from "firebase-functions/params";

export function getEnvironment(): Environment {
  if (process.env.FUNCTIONS_EMULATOR === "true") return Environment.LOCAL;

  const projectId = projectID.value();

  switch (projectId) {
    case "sycamore-staging": return Environment.STAGING;
    case "sycamore-ce2fe": return Environment.PROD;
    default: throw new Error("Unrecognised project id");
  }
}
