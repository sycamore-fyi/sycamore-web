import { getEnvironment } from "./clients/firebase/Environment";
import { Environment } from "@sycamore-fyi/shared";

enum Constant {
  CLIENT_URL = "CLIENT_URL",
  SERVER_URL = "SERVER_URL",
}

const allConstants: { [e in Environment]: { [c in Constant]: string } } = {
  LOCAL: {
    CLIENT_URL: "http://localhost:3000",
    SERVER_URL: "http://127.0.0.1:5001/sycamore-staging/europe-west1/onExternalHttpRequest",
  },
  STAGING: {
    CLIENT_URL: "http://localhost:3000",
    SERVER_URL: "https://onexternalhttprequest-cxjciu7frq-ew.a.run.app",
  },
  PROD: {
    CLIENT_URL: "http://localhost:3000",
    SERVER_URL: "https://onexternalhttprequest-2yuhotj4nq-ew.a.run.app",
  },
};

export const config = () => allConstants[getEnvironment()];
