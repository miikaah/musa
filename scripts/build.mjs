import * as esbuild from "esbuild";
import inlineImage from "esbuild-plugin-inline-image";
import { buildIndex } from "./buildIndex.mjs";

const define = {};

for (const k in process.env) {
  define[`process.env.${k}`] = JSON.stringify(process.env[k]);
}

const { OUTDIR = "" } = process.env;

if (!OUTDIR) {
  throw new Error("process.env.OUTDIR must be set");
}

buildIndex(OUTDIR);

const outfile = `./${OUTDIR}/app.js`;

await esbuild
  .build({
    entryPoints: ["./src/index.js"],
    outfile,
    minify: true,
    bundle: true,
    loader: {
      ".js": "jsx",
    },
    plugins: [inlineImage()],
    define,
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
