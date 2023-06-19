import { Environment } from "@sycamore-fyi/shared"
import { getEnvironment } from "./getEnvironment";

enum Constant {
  FIREBASE_CONFIG = "FIREBASE_CONFIG",
}

const allConstants: { [e in Environment]: { [c in Constant]: any } } = {
  LOCAL: {
    FIREBASE_CONFIG: {
      apiKey: "AIzaSyA4c7hJOhHiWdEbmRVrSiKa7XI47-0bRn0",
      authDomain: "sycamore-staging.firebaseapp.com",
      projectId: "sycamore-staging",
      storageBucket: "sycamore-staging.appspot.com",
      messagingSenderId: "76556239915",
      appId: "1:76556239915:web:ad86edc7d899fb9636566e"
    },
  },
  STAGING: {
    FIREBASE_CONFIG: {
      apiKey: "AIzaSyA4c7hJOhHiWdEbmRVrSiKa7XI47-0bRn0",
      authDomain: "sycamore-staging.firebaseapp.com",
      projectId: "sycamore-staging",
      storageBucket: "sycamore-staging.appspot.com",
      messagingSenderId: "76556239915",
      appId: "1:76556239915:web:ad86edc7d899fb9636566e"
    },
  },
  PROD: {
    FIREBASE_CONFIG: {
      apiKey: "AIzaSyDdEdb-3_yQQdAPKg1AvWCkUhTx_bal57A",
      authDomain: "sycamore-ce2fe.firebaseapp.com",
      projectId: "sycamore-ce2fe",
      storageBucket: "sycamore-ce2fe.appspot.com",
      messagingSenderId: "301957710713",
      appId: "1:301957710713:web:ac0599a348393be09aa5a8"
    },
  },
};

export const config = () => allConstants[getEnvironment()];