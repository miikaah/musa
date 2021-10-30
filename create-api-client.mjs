import fs from "fs/promises";
import path from "path";

const [, , type] = process.argv;

const start = async () => {
  if (type === "server") {
    await fs.copyFile(
      path.join("src", "server.api-client.js"),
      path.join("src", "api-client.js")
    );
  } else {
    await fs.copyFile(
      path.join("src", "electron.api-client.js"),
      path.join("src", "api-client.js")
    );
  }
};

start();
