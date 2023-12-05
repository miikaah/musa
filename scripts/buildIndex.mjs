import handlebars from "handlebars";
import fs from "fs/promises";

const { VITE_API_BASE_URL = "", VITE_API_LAN_URL = "" } = process.env;

const file = await fs.readFile("./handlebars/index.hbs", { encoding: "utf-8" });
const template = handlebars.compile(file);
const apiBaseUrl = `${VITE_API_BASE_URL} ${VITE_API_LAN_URL}`;
const context = { apiBaseUrl };

export const buildIndex = async (outdir) => {
  const rendered = template(context);

  await fs.writeFile(`${outdir}/index.html`, rendered);
};
