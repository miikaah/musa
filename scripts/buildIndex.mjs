import handlebars from "handlebars";
import fs from "fs/promises";

const file = await fs.readFile("./handlebars/index.hbs", { encoding: "utf-8" });
const template = handlebars.compile(file);
const context = { apiBaseUrl: process.env.VITE_API_BASE_URL ?? "" };

export const buildIndex = async (outdir) => {
  const rendered = template(context);

  await fs.writeFile(`${outdir}/index.html`, rendered);
};
