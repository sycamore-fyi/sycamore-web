module.exports = {
  moduleFileExtensions: ["js", "json", "jsx", "ts", "tsx", "node"],
  roots: ["<rootDir>/functions/tests"],
  // Jest transformations -- this adds support for TypeScript
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  // Test spec file resolution pattern
  testRegex: "(/tests/.*|(\\.|/)(test|spec))\\.tsx?$",
  // Setup for node environment
  testEnvironment: "node",
}
