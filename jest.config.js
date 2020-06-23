module.exports = {
  testMatch: ["**/test/?(*-)+(spec|test).[jt]s?(x)"],
  // https://jestjs.io/docs/en/configuration#transform-objectstring-pathtotransformer--pathtotransformer-object
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  // https://jestjs.io/docs/en/configuration#transformignorepatterns-arraystring
  // regexp which, when matched, block transforms; by default it blocks all node_modules
  transformIgnorePatterns: ["<rootDir>/node_modules/(?!lodash-es)"],
  // https://jestjs.io/docs/en/configuration#modulenamemapper-objectstring-string--arraystring
  moduleNameMapper: {
    // map lodash-es to lodash (aka, CJS implementation)
    "^lodash-es$": "<rootDir>/node_modules/lodash/lodash.js",
  },
  setupFilesAfterEnv: ["jest-extended"],
  testEnvironment: "node",
};
