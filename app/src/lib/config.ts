import { Environment } from "@sycamore-fyi/shared"
import { getEnvironment } from "./getEnvironment";

enum Constant {
  SERVER_URL = "SERVER_URL",
  FIREBASE_CONFIG = "FIREBASE_CONFIG",
  AMPLITUDE_API_KEY = "AMPLITUDE_API_KEY",
  SMARTLOOK_KEY = "SMARTLOOK_KEY",
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
    },
    AMPLITUDE_API_KEY: "none",
    SMARTLOOK_KEY: "990f83621da99e331be4a5b6117b49adba53e83e",
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
    },
    AMPLITUDE_API_KEY: "61702236795b975dbdd4e1979328aaa8",
    SMARTLOOK_KEY: "990f83621da99e331be4a5b6117b49adba53e83e",
  },
  PROD: {
    SERVER_URL: "https://onexternalhttprequest-2yuhotj4nq-ew.a.run.app",
    FIREBASE_CONFIG: {
      apiKey: "AIzaSyDdEdb-3_yQQdAPKg1AvWCkUhTx_bal57A",
      authDomain: "sycamore-ce2fe.firebaseapp.com",
      projectId: "sycamore-ce2fe",
      storageBucket: "sycamore-ce2fe.appspot.com",
      messagingSenderId: "301957710713",
      appId: "1:301957710713:web:ac0599a348393be09aa5a8"
    },
    AMPLITUDE_API_KEY: "89d105e6219d3b695f71ac21cd887f55",
    SMARTLOOK_KEY: "40fc574aed4765bcd022c79b4ad5ebe3249a8dd3",
  },
};

export const config = () => allConstants[getEnvironment()];