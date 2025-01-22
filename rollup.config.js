import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import css from "rollup-plugin-import-css";

export default {
  input: "src/server.ts",
  output: {
    dir: "dist",
  },
  external: [/node_modules/],
  plugins: [css(), typescript(), json(), commonjs(), resolve()],
};
