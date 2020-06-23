// const typescript = require("@rollup/plugin-typescript");
const typescript2 = require("rollup-plugin-typescript2");

const generalConfig = (moduleSystem) => ({
  input: "src/index.ts",
  output: {
    dir: `dist/${moduleSystem}`,
    format: `${moduleSystem}`,
    sourcemap: true,
  },
  external: [],
  plugins: [
    typescript2({
      rootDir: "./",
      // tsconfig: `tsconfig.${moduleSystem}.json`,
      tsconfig: `tsconfig.es.json`,
      // typescript: require("ttypescript"),
      // plugins: [
      //   { transform: "typescript-transform-paths" },
      //   { transform: "typescript-transform-paths", afterDeclarations: true },
      // ],
    }),
  ],
});

export default [generalConfig("es"), generalConfig("cjs")];
