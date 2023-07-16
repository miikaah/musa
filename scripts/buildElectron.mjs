import { readFile } from "fs/promises";
import { execSync } from "child_process";

const build = () => {
  const output = execSync("npm run build:electron", {
    encoding: "utf-8",
  });

  console.log(output);
};

try {
  const version = await readFile("version", { encoding: "utf-8" });
  const latestCommitHash = execSync("git rev-parse HEAD", {
    encoding: "utf-8",
  });

  if (version === latestCommitHash) {
    console.log("Skipping frontend build as there are no changes\n");

    process.exit(0);
  } else {
    build();
  }
} catch (e) {
  // The version file does not exist so it has been deleted or this is the first build
  if (e.message.includes("no such file or directory")) {
    build();
  } else {
    console.error(e);

    process.exit(1);
  }
}
