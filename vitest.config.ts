import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./.vitest/setup.ts"],
    coverage: {
      exclude: ["src/img-palette", "src/apiClient*"],
    },
  },
});
