import * as esbuild from "esbuild";
import inlineImage from "esbuild-plugin-inline-image";
import { buildIndex } from "./buildIndex.mjs";

const {
  OUTDIR = "",
  VITE_ENV = "",
  VITE_API_BASE_URL = "",
  VITE_API_LAN_URL = "",
} = process.env;

if (!OUTDIR) {
  throw new Error("process.env.OUTDIR must be set");
}

buildIndex(OUTDIR);

const outfile = `./${OUTDIR}/app.js`;

await esbuild
  .build({
    entryPoints: ["./src/index.jsx"],
    outfile,
    minify: true,
    bundle: true,
    loader: {
      ".js": "jsx",
    },
    plugins: [inlineImage()],
    define: {
      "import.meta.env.VITE_ENV": JSON.stringify(VITE_ENV),
      "import.meta.env.VITE_API_BASE_URL": JSON.stringify(VITE_API_BASE_URL),
      "import.meta.env.VITE_API_LAN_URL": JSON.stringify(VITE_API_LAN_URL),
    },
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
