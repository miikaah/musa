import * as esbuild from "esbuild";
import inlineImage from "esbuild-plugin-inline-image";
import { buildIndex } from "./buildIndex.mjs";

const {
  OUTDIR = "",
  REACT_APP_ENV = "",
  REACT_APP_API_BASE_URL = "",
} = process.env;

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
    define: {
      "process.env.REACT_APP_ENV": JSON.stringify(REACT_APP_ENV),
      "process.env.REACT_APP_API_BASE_URL": JSON.stringify(
        REACT_APP_API_BASE_URL,
      ),
    },
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
