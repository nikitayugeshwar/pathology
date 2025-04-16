import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node", // Force Node.js environment
    deps: {
      inline: ["@testing-library/react"], // Include only necessary dependencies
    },
    testEnvironment: "jest-environment-jsdom",
  },
});
