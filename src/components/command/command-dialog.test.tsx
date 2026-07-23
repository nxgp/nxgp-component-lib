import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { expectNoA11yViolations, renderWithProviders, userEvent } from "../../../tests/utils";
import {
  CommandDialog,
  CommandDialogProvider,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  useCommandDialog,
} from "./command-dialog";

function BadConsumer() {
  useCommandDialog();
  return null;
}

function OpenButton() {
  const { setOpen } = useCommandDialog();
  return (
    <button type="button" onClick={() => setOpen(true)}>
      Open palette
    </button>
  );
}

describe("CommandDialog", () => {
  describe("rendering", () => {
    it("renders command palette inside dialog", async () => {
      const user = userEvent.setup();
      const { getByRole, getByPlaceholderText } = renderWithProviders(
        <CommandDialog open title="Search">
          <CommandInput placeholder="Search commands..." />
          <CommandList>
            <CommandEmpty>No results.</CommandEmpty>
            <CommandGroup heading="Actions">
              <CommandItem value="copy">Copy</CommandItem>
            </CommandGroup>
          </CommandList>
        </CommandDialog>,
      );

      expect(getByRole("dialog")).toBeInTheDocument();
      expect(getByPlaceholderText("Search commands...")).toBeInTheDocument();
      await user.click(getByRole("option", { name: "Copy" }));
    });

    it("renders optional description for screen readers", () => {
      const { getByText } = renderWithProviders(
        <CommandDialog open description="Filter app commands">
          <CommandInput placeholder="Search" />
          <CommandList>
            <CommandItem value="home">Home</CommandItem>
          </CommandList>
        </CommandDialog>,
      );
      expect(getByText("Filter app commands")).toBeInTheDocument();
    });

    it("renders inside provider when open", () => {
      const { getByRole } = renderWithProviders(
        <CommandDialogProvider open>
          <CommandDialog>
            <CommandInput placeholder="Search app" />
            <CommandList>
              <CommandItem value="home">Home</CommandItem>
            </CommandList>
          </CommandDialog>
        </CommandDialogProvider>,
      );
      expect(getByRole("dialog")).toBeInTheDocument();
    });
  });

  describe("interactions", () => {
    it("opens from controlled state", async () => {
      function Demo() {
        const [open, setOpen] = useState(false);
        return (
          <>
            <button type="button" onClick={() => setOpen(true)}>
              Open palette
            </button>
            <CommandDialog open={open} onOpenChange={setOpen}>
              <CommandInput placeholder="Filter..." />
              <CommandList>
                <CommandItem value="settings">Settings</CommandItem>
              </CommandList>
            </CommandDialog>
          </>
        );
      }

      const user = userEvent.setup();
      const { getByRole } = renderWithProviders(<Demo />);
      await user.click(getByRole("button", { name: "Open palette" }));
      expect(getByRole("dialog")).toBeInTheDocument();
    });

    it("toggles via keyboard shortcut", async () => {
      const user = userEvent.setup();
      const { getByRole, queryByRole } = renderWithProviders(
        <CommandDialogProvider>
          <CommandDialog>
            <CommandInput placeholder="Search" />
            <CommandList>
              <CommandItem value="home">Home</CommandItem>
            </CommandList>
          </CommandDialog>
        </CommandDialogProvider>,
      );

      expect(queryByRole("dialog")).not.toBeInTheDocument();
      await user.keyboard("{Meta>}k{/Meta}");
      expect(getByRole("dialog")).toBeInTheDocument();
      await user.keyboard("{Meta>}k{/Meta}");
      expect(queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("calls onOpenChange from provider", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      const { getByRole } = renderWithProviders(
        <CommandDialogProvider onOpenChange={onOpenChange}>
          <OpenButton />
          <CommandDialog>
            <CommandInput placeholder="Search" />
            <CommandList>
              <CommandItem value="home">Home</CommandItem>
            </CommandList>
          </CommandDialog>
        </CommandDialogProvider>,
      );

      await user.click(getByRole("button", { name: "Open palette" }));
      expect(onOpenChange).toHaveBeenCalledWith(true);
    });

    it("supports local open state without provider", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      const { getByRole } = renderWithProviders(
        <CommandDialog open onOpenChange={onOpenChange}>
          <CommandInput placeholder="Search" />
          <CommandList>
            <CommandItem value="home">Home</CommandItem>
          </CommandList>
        </CommandDialog>,
      );

      expect(getByRole("dialog")).toBeInTheDocument();
      await user.keyboard("{Escape}");
      expect(onOpenChange).toHaveBeenCalled();
    });

    it("skips shortcut when keyboardShortcut is false", async () => {
      const user = userEvent.setup();
      const { queryByRole } = renderWithProviders(
        <CommandDialogProvider keyboardShortcut={false}>
          <CommandDialog>
            <CommandInput placeholder="Search" />
            <CommandList>
              <CommandItem value="home">Home</CommandItem>
            </CommandList>
          </CommandDialog>
        </CommandDialogProvider>,
      );

      await user.keyboard("{Meta>}k{/Meta}");
      expect(queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("skips shortcut when focus is in an external text field", async () => {
      const user = userEvent.setup();
      const { getByRole, queryByRole } = renderWithProviders(
        <CommandDialogProvider>
          <input aria-label="Search page" />
          <CommandDialog>
            <CommandInput placeholder="Search" />
            <CommandList>
              <CommandItem value="home">Home</CommandItem>
            </CommandList>
          </CommandDialog>
        </CommandDialogProvider>,
      );

      await user.click(getByRole("textbox", { name: "Search page" }));
      await user.keyboard("{Meta>}k{/Meta}");
      expect(queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("opens via Ctrl+K shortcut", async () => {
      const user = userEvent.setup();
      const { getByRole } = renderWithProviders(
        <CommandDialogProvider>
          <CommandDialog>
            <CommandInput placeholder="Search" />
            <CommandList>
              <CommandItem value="home">Home</CommandItem>
            </CommandList>
          </CommandDialog>
        </CommandDialogProvider>,
      );

      await user.keyboard("{Control>}k{/Control}");
      expect(getByRole("dialog")).toBeInTheDocument();
    });

    it("skips shortcut when focus is in textarea", async () => {
      const user = userEvent.setup();
      const { getByRole, queryByRole } = renderWithProviders(
        <CommandDialogProvider>
          <textarea aria-label="Notes" />
          <CommandDialog>
            <CommandInput placeholder="Search" />
            <CommandList>
              <CommandItem value="home">Home</CommandItem>
            </CommandList>
          </CommandDialog>
        </CommandDialogProvider>,
      );

      await user.click(getByRole("textbox", { name: "Notes" }));
      await user.keyboard("{Meta>}k{/Meta}");
      expect(queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("has no axe violations when open", async () => {
      const { container } = renderWithProviders(
        <CommandDialog open>
          <CommandInput placeholder="Search" />
          <CommandList>
            <CommandItem value="home">Home</CommandItem>
          </CommandList>
        </CommandDialog>,
      );
      await expectNoA11yViolations(container);
    });
  });

  describe("reliability", () => {
    it("throws useCommandDialog outside provider", () => {
      expect(() => renderWithProviders(<BadConsumer />)).toThrow(
        "useCommandDialog must be used within CommandDialogProvider",
      );
    });
  });
});
