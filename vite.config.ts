import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import babel from "vite-plugin-babel";

const sourceDirectory = fileURLToPath(new URL("./src", import.meta.url));

export default defineConfig({
  plugins: [
    tailwindcss(),
    reactRouter(),
    babel({
      include: /\/src\/.*\.[jt]sx?$/,
      exclude: /node_modules/,
      babelConfig: {
        presets: ["@babel/preset-typescript"],
        plugins: ["babel-plugin-react-compiler"],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": sourceDirectory,
    },
  },
});
