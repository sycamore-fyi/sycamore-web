import { Environment } from "@sycamore-fyi/shared"
import { getEnvironment } from "./getEnvironment";

enum Constant {
  SERVER_URL = "SERVER_URL",
  FIREBASE_CONFIG = "FIREBASE_CONFIG"
}

const allConstants: { [e in Environment]: { [c in Constant]: any } } = {
  LOCAL: {
    SERVER_URL: "http://127.0.0.1:5001/sycamore-staging/europe-west1/onExternalHttpRequest",
    FIREBASE_CONFIG: {
      apiKey: "AIzaSyA4c7hJOhHiWdEbmRVrSiKa7XI47-0bRn0",
      authDomain: "sycamore-staging.firebaseapp.com",
      projectId: "sycamore-staging",
      storageBucket: "sycamore-staging.appspot.com",
      messagingSenderId: "76556239915",
      appId: "1:76556239915:web:ad86edc7d899fb9636566e"
    }
  },
  STAGING: {
    SERVER_URL: "https://onexternalhttprequest-cxjciu7frq-ew.a.run.app",
    FIREBASE_CONFIG: {
      apiKey: "AIzaSyA4c7hJOhHiWdEbmRVrSiKa7XI47-0bRn0",
      authDomain: "sycamore-staging.firebaseapp.com",
      projectId: "sycamore-staging",
      storageBucket: "sycamore-staging.appspot.com",
      messagingSenderId: "76556239915",
      appId: "1:76556239915:web:ad86edc7d899fb9636566e"
    }
  },
  PROD: {
    SERVER_URL: "https://onexternalhttprequest-2yuhotj4nq-ew.a.run.app",
    FIREBASE_CONFIG: {
      apiKey: "AIzaSyA4c7hJOhHiWdEbmRVrSiKa7XI47-0bRn0",
      authDomain: "sycamore-staging.firebaseapp.com",
      projectId: "sycamore-staging",
      storageBucket: "sycamore-staging.appspot.com",
      messagingSenderId: "76556239915",
      appId: "1:76556239915:web:ad86edc7d899fb9636566e"
    }
  },
};

export const config = () => allConstants[getEnvironment()];