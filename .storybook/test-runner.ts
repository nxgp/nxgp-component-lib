import type { TestRunnerConfig } from "@storybook/test-runner";

const config: TestRunnerConfig = {
  tags: {
    include: ["autodocs"],
    exclude: ["skip-a11y"],
  },
};

export default config;
