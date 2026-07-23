import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}", "tests/**/*.test.{ts,tsx}"],
    testTimeout: 10_000,
    pool: "forks",
    maxWorkers: process.env.CI ? 2 : undefined,
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov", "html"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.stories.{ts,tsx}",
        "src/**/*.test.{ts,tsx}",
        "src/**/index.ts",
        "src/**/*.fixtures.{ts,tsx}",
        "src/**/test-setup.ts",
        "src/docs/**",
        // Assistant is a styled assistant-ui skin; coverage tracked separately as tests expand.
        "src/assistant/**",
        // Interactive resize handle exercised in Storybook / browser, not jsdom.
        "src/components/drawer/drawer-resize-handle.tsx",
      ],
      thresholds: {
        lines: 90,
        branches: 80,
        functions: 90,
        statements: 90,
        "src/components/**/*.{ts,tsx}": {
          lines: 90,
          branches: 85,
          functions: 90,
          statements: 90,
        },
        "src/charts/**/*.{ts,tsx}": {
          lines: 95,
          branches: 90,
          functions: 95,
          statements: 95,
        },
      },
    },
  },
});
