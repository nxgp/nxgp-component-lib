import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getSystemPrefersDark, readStoredTheme, ThemeProvider } from "./theme-provider";
import { DEFAULT_STORAGE_KEY, DEFAULT_THEME_ID } from "./theme-registry";
import { useTheme, useThemeOptional } from "./use-theme";

function ThemeConsumer() {
  const { theme, resolvedTheme, resolvedMode, setTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <span data-testid="resolved-theme">{resolvedTheme}</span>
      <span data-testid="resolved-mode">{resolvedMode}</span>
      <button type="button" onClick={() => setTheme("dark-midnight")}>
        Set dark midnight
      </button>
      <button type="button" onClick={() => setTheme("system")}>
        Set system
      </button>
    </div>
  );
}

describe("ThemeProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
    document.documentElement.classList.remove("dark");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("rendering", () => {
    it("sets data-theme on mount", async () => {
      render(
        <ThemeProvider defaultTheme="light-warm">
          <ThemeConsumer />
        </ThemeProvider>,
      );
      await waitFor(() => {
        expect(document.documentElement.getAttribute("data-theme")).toBe("light-warm");
      });
    });

    it("does not add dark class for light themes", async () => {
      render(
        <ThemeProvider defaultTheme="light-default">
          <ThemeConsumer />
        </ThemeProvider>,
      );
      await waitFor(() => {
        expect(document.documentElement.classList.contains("dark")).toBe(false);
      });
    });

    it("adds dark class for dark themes", async () => {
      render(
        <ThemeProvider defaultTheme="dark-default">
          <ThemeConsumer />
        </ThemeProvider>,
      );
      await waitFor(() => {
        expect(document.documentElement.classList.contains("dark")).toBe(true);
      });
    });
  });

  describe("persistence", () => {
    it("reads theme from localStorage on mount", async () => {
      localStorage.setItem(DEFAULT_STORAGE_KEY, "dark-midnight");
      render(
        <ThemeProvider>
          <ThemeConsumer />
        </ThemeProvider>,
      );
      expect(await screen.findByTestId("theme")).toHaveTextContent("dark-midnight");
    });

    it("persists theme to localStorage on change", async () => {
      const user = userEvent.setup();
      render(
        <ThemeProvider defaultTheme="light-default">
          <ThemeConsumer />
        </ThemeProvider>,
      );
      await user.click(screen.getByRole("button", { name: "Set dark midnight" }));
      expect(localStorage.getItem(DEFAULT_STORAGE_KEY)).toBe("dark-midnight");
    });

    it("falls back when localStorage read throws", async () => {
      vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
        throw new Error("blocked");
      });

      render(
        <ThemeProvider defaultTheme="light-warm">
          <ThemeConsumer />
        </ThemeProvider>,
      );
      expect(await screen.findByTestId("theme")).toHaveTextContent("light-warm");
    });

    it("ignores invalid stored theme values", async () => {
      localStorage.setItem(DEFAULT_STORAGE_KEY, "not-a-theme");
      render(
        <ThemeProvider defaultTheme="light-warm">
          <ThemeConsumer />
        </ThemeProvider>,
      );
      expect(await screen.findByTestId("theme")).toHaveTextContent("light-warm");
    });

    it("updates theme state when localStorage write throws", async () => {
      const user = userEvent.setup();
      vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
        throw new Error("quota exceeded");
      });

      render(
        <ThemeProvider defaultTheme="light-default">
          <ThemeConsumer />
        </ThemeProvider>,
      );
      await user.click(screen.getByRole("button", { name: "Set dark midnight" }));
      expect(await screen.findByTestId("theme")).toHaveTextContent("dark-midnight");
    });
  });

  describe("system preference", () => {
    it("resolves system to kiotel-theme when prefers light", async () => {
      vi.spyOn(window, "matchMedia").mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      render(
        <ThemeProvider defaultTheme="system" enableSystem>
          <ThemeConsumer />
        </ThemeProvider>,
      );
      expect(await screen.findByTestId("resolved-theme")).toHaveTextContent("kiotel-theme");
    });

    it("resolves system to dark-default when prefers dark", async () => {
      vi.spyOn(window, "matchMedia").mockImplementation((query: string) => ({
        matches: query === "(prefers-color-scheme: dark)",
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      render(
        <ThemeProvider defaultTheme="system" enableSystem>
          <ThemeConsumer />
        </ThemeProvider>,
      );
      expect(await screen.findByTestId("resolved-theme")).toHaveTextContent("dark-default");
    });

    it("reacts to system preference changes when theme is system", async () => {
      let changeHandler: ((event: MediaQueryListEvent) => void) | undefined;
      vi.spyOn(window, "matchMedia").mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: (event: string, handler: EventListenerOrEventListenerObject) => {
          if (event === "change" && typeof handler === "function") {
            changeHandler = handler as (event: MediaQueryListEvent) => void;
          }
        },
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      render(
        <ThemeProvider defaultTheme="system" enableSystem>
          <ThemeConsumer />
        </ThemeProvider>,
      );
      expect(await screen.findByTestId("resolved-theme")).toHaveTextContent("kiotel-theme");

      changeHandler?.({ matches: true } as MediaQueryListEvent);
      await waitFor(() => {
        expect(screen.getByTestId("resolved-theme")).toHaveTextContent("dark-default");
      });
    });

    it("does not subscribe to system preference when enableSystem is false", () => {
      const addEventListener = vi.fn();
      vi.spyOn(window, "matchMedia").mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener,
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      render(
        <ThemeProvider defaultTheme="light-default" enableSystem={false}>
          <ThemeConsumer />
        </ThemeProvider>,
      );
      expect(addEventListener).not.toHaveBeenCalled();
    });

    it("maps system default to concrete theme when enableSystem is false", async () => {
      render(
        <ThemeProvider defaultTheme="system" enableSystem={false}>
          <ThemeConsumer />
        </ThemeProvider>,
      );
      expect(await screen.findByTestId("theme")).toHaveTextContent(DEFAULT_THEME_ID);
      expect(screen.getByTestId("resolved-theme")).toHaveTextContent(DEFAULT_THEME_ID);
    });

    it("resolves system selection to default theme when enableSystem is false", async () => {
      const user = userEvent.setup();
      render(
        <ThemeProvider defaultTheme="light-default" enableSystem={false}>
          <ThemeConsumer />
        </ThemeProvider>,
      );
      await user.click(screen.getByRole("button", { name: "Set system" }));
      expect(await screen.findByTestId("theme")).toHaveTextContent("system");
      expect(screen.getByTestId("resolved-theme")).toHaveTextContent(DEFAULT_THEME_ID);
    });
  });

  describe("forced theme", () => {
    it("uses forcedTheme instead of localStorage", async () => {
      localStorage.setItem(DEFAULT_STORAGE_KEY, "dark-midnight");
      render(
        <ThemeProvider forcedTheme="light-warm">
          <ThemeConsumer />
        </ThemeProvider>,
      );
      expect(await screen.findByTestId("theme")).toHaveTextContent("light-warm");
    });

    it("updates when forcedTheme changes", async () => {
      const { rerender } = render(
        <ThemeProvider forcedTheme="light-default">
          <ThemeConsumer />
        </ThemeProvider>,
      );
      expect(await screen.findByTestId("resolved-theme")).toHaveTextContent("light-default");

      rerender(
        <ThemeProvider forcedTheme="dark-midnight">
          <ThemeConsumer />
        </ThemeProvider>,
      );
      await waitFor(() => {
        expect(screen.getByTestId("resolved-theme")).toHaveTextContent("dark-midnight");
        expect(document.documentElement.getAttribute("data-theme")).toBe("dark-midnight");
      });
    });

    it("does not persist theme changes to localStorage", async () => {
      const user = userEvent.setup();
      render(
        <ThemeProvider forcedTheme="light-default">
          <ThemeConsumer />
        </ThemeProvider>,
      );
      await user.click(screen.getByRole("button", { name: "Set dark midnight" }));
      expect(await screen.findByTestId("theme")).toHaveTextContent("dark-midnight");
      expect(localStorage.getItem(DEFAULT_STORAGE_KEY)).toBeNull();
    });
  });

  describe("reliability", () => {
    it("useTheme throws outside provider", () => {
      const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
      expect(() => render(<ThemeConsumer />)).toThrow(
        "useTheme must be used within a ThemeProvider",
      );
      consoleError.mockRestore();
    });

    it("updates DOM when theme changes via setTheme", async () => {
      const user = userEvent.setup();
      render(
        <ThemeProvider defaultTheme="light-default">
          <ThemeConsumer />
        </ThemeProvider>,
      );
      await user.click(screen.getByRole("button", { name: "Set dark midnight" }));
      await waitFor(() => {
        expect(document.documentElement.getAttribute("data-theme")).toBe("dark-midnight");
        expect(document.documentElement.classList.contains("dark")).toBe(true);
      });
    });

    it("applies theme attributes to a custom attributeTarget", async () => {
      const target = document.createElement("div");
      document.body.appendChild(target);

      render(
        <ThemeProvider defaultTheme="dark-default" attributeTarget={target}>
          <ThemeConsumer />
        </ThemeProvider>,
      );

      await waitFor(() => {
        expect(target.getAttribute("data-theme")).toBe("dark-default");
        expect(target.classList.contains("dark")).toBe(true);
      });

      target.remove();
    });
  });
});

describe("theme-registry", () => {
  it("validates theme settings", async () => {
    const { getThemeById, isValidThemeSetting } = await import("./theme-registry");
    expect(isValidThemeSetting("light-warm")).toBe(true);
    expect(isValidThemeSetting("light-sage")).toBe(true);
    expect(isValidThemeSetting("dark-violet")).toBe(true);
    expect(isValidThemeSetting("system")).toBe(true);
    expect(isValidThemeSetting("invalid")).toBe(false);
    expect(getThemeById("light-warm").id).toBe("light-warm");
    expect(() => getThemeById("invalid" as "light-warm")).toThrow("Unknown theme id: invalid");
  });
});

describe("useThemeOptional", () => {
  it("returns null outside ThemeProvider", () => {
    function Probe() {
      const theme = useThemeOptional();
      return <span data-testid="optional">{theme ? "set" : "null"}</span>;
    }
    render(<Probe />);
    expect(screen.getByTestId("optional")).toHaveTextContent("null");
  });
});

describe("theme-provider helpers", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("readStoredTheme returns fallback when window is undefined", () => {
    vi.stubGlobal("window", undefined);
    expect(readStoredTheme(DEFAULT_STORAGE_KEY, "light-warm")).toBe("light-warm");
  });

  it("getSystemPrefersDark returns false when window is undefined", () => {
    vi.stubGlobal("window", undefined);
    expect(getSystemPrefersDark()).toBe(false);
  });
});
