import { Environment } from "@sycamore-fyi/shared";
import { projectID } from "firebase-functions/params";

export function getEnvironment(): Environment {
  if (process.env.ENVIRONMENT_NAME) {
    console.log(process.env.ENVIRONMENT_NAME);
    return process.env.ENVIRONMENT_NAME as Environment;
  }
  if (process.env.FUNCTIONS_EMULATOR === "true") return Environment.LOCAL;

  const projectId = projectID.value();

  switch (projectId) {
    case "sycamore-staging": return Environment.STAGING;
    case "sycamore-ce2fe": return Environment.PROD;
    default: throw new Error("Unrecognised project id");
  }
}
