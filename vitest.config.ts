import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vitest/config";

export default defineConfig({
  // @ts-expect-error Vitest needs to release v3 to get vite v6 support
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./.vitest/setup.ts"],
    coverage: {
      exclude: [
        "src/img-palette",
        "src/apiClient*",
        "src/**/index.ts",
        "src/*.d.ts",
        "src/store.ts",
        "src/types.ts",
        "*.config.mjs",
        "*.config.ts",
        "build/**/*",
        "build-server/**/*",
        "scripts/**/*",
        "test/**/*",
      ],
    },
  },
});
