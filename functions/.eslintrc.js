module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "google",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["tsconfig.json", "tsconfig.dev.json"],
    tsconfigRootDir: __dirname,
    sourceType: "module",
  },
  ignorePatterns: [
    "/build/**/*", // Ignore built files.
    "/tests/**/*",
  ],
  plugins: [
    "@typescript-eslint",
    "import",
  ],
  rules: {
    "quotes": ["error", "double"],
    "semi": ["error", "always"],
    "import/no-unresolved": 0,
    "indent": ["error", 2, { "SwitchCase": 1 }],
    "require-jsdoc": "off",
    "object-curly-spacing": ["error", "always"],
    "prefer-destructuring": ["error", {
      "object": true,
    }],
    "max-len": "off",
  },
};
