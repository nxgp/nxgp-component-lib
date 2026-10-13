import type { Preview } from "@storybook/react";
import { withThemeProvider } from "./decorators/with-theme-provider";
import { ComponentDocsPage } from "./docs/component-docs-page";
import { ThemedDocsContainer } from "./docs/themed-docs-container";
import "../src/styles/index.css";
import "../src/assistant/assistant.css";
import "./storybook-theme.css";

const preview: Preview = {
  decorators: [withThemeProvider],
  initialGlobals: {
    theme: "kiotel-theme",
  },
  globalTypes: {
    theme: {
      name: "Theme",
      description: "Active color theme",
      toolbar: {
        icon: "paintbrush",
        items: [
          { value: "kiotel-theme", title: "Kiotel" },
          { value: "light-default", title: "Light Default" },
          { value: "light-warm", title: "Light Warm" },
          { value: "light-sage", title: "Light Sage" },
          { value: "dark-default", title: "Dark Default" },
          { value: "dark-midnight", title: "Dark Midnight" },
          { value: "dark-violet", title: "Dark Violet" },
          { value: "system", title: "System" },
        ],
        dynamicTitle: true,
      },
    },
  },
  parameters: {
    a11y: {
      test: "error",
    },
    docs: {
      container: ThemedDocsContainer,
      toc: true,
      page: ComponentDocsPage,
      canvas: {
        sourceState: "hidden",
      },
    },
    controls: {
      expanded: true,
      sort: "requiredFirst",
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  tags: ["autodocs"],
};

export default preview;
