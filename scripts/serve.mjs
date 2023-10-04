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

const servedir = `./${OUTDIR}`;
const outfile = `./${servedir}/app.js`;

let ctx = await esbuild.context({
  entryPoints: ["./src/index.js"],
  outfile,
  minify: false,
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
});

const host = "localhost";
const port = Number(process.env.PORT || 3666);

await ctx.watch();
await ctx.serve({ servedir, host, port });

console.log(`Serving http://${host}:${port}`);
