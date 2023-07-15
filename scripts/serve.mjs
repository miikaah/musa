import * as esbuild from "esbuild";
import http from "node:http";
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
  define,
});

const host = "localhost";
const port = Number(process.env.PORT || 3666);

await ctx.watch();
await ctx.serve({ servedir, host, port });

http
  .createServer((req, res) => {
    const options = {
      hostname: host,
      port: port,
      path: req.url,
      method: req.method,
      headers: req.headers,
    };

    // Forward each incoming request to esbuild
    const proxyReq = http.request(options, (proxyRes) => {
      // If esbuild returns "not found", send a custom 404 page
      if (proxyRes.statusCode === 404) {
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end("<h1>A custom 404 page</h1>");
        return;
      }

      // Otherwise, forward the response from esbuild to the client
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res, { end: true });
    });

    // Forward the body of the request to esbuild
    req.pipe(proxyReq, { end: true });
  })
  .listen(port);

console.log(`Serving http://${host}:${port}`);
