import * as esbuild from "esbuild";
import inlineImage from "esbuild-plugin-inline-image";

const define = {};

for (const k in process.env) {
  define[`process.env.${k}`] = JSON.stringify(process.env[k]);
}

esbuild
  .build({
    entryPoints: ["./src/index.js"],
    outfile: "./build/app.js",
    minify: true,
    bundle: true,
    loader: {
      ".js": "jsx",
    },
    plugins: [inlineImage()],
    define,
  })
  .catch(() => process.exit(1));
