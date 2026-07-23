import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { expectNoA11yViolations, renderWithProviders, userEvent } from "../../../tests/utils";
import { Checkbox } from "../checkbox";
import { Input } from "../input";
import {
  Field,
  FieldContent,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldTitle,
} from "./field";
import { FieldGroup, FieldLegend, FieldSeparator, FieldSet } from "./field-layout";

function BasicField({ invalid = false }: { invalid?: boolean }) {
  return (
    <Field invalid={invalid}>
      <FieldLabel required>Email</FieldLabel>
      <FieldControl asChild>
        <Input type="email" invalid={invalid || undefined} placeholder="you@example.com" />
      </FieldControl>
      <FieldDescription>Helper text</FieldDescription>
      {invalid ? <FieldError>Email is required</FieldError> : null}
    </Field>
  );
}

describe("Field", () => {
  describe("rendering", () => {
    it("renders label, control, description, and error", () => {
      const { getByText, getByRole } = renderWithProviders(<BasicField invalid />);
      expect(getByText("Email")).toBeInTheDocument();
      expect(getByRole("textbox")).toBeInTheDocument();
      expect(getByText("Helper text")).toBeInTheDocument();
      expect(getByText("Email is required")).toBeInTheDocument();
    });

    it("merges custom className on Field root", () => {
      const { container } = renderWithProviders(
        <Field className="custom-field">
          <FieldLabel>Name</FieldLabel>
        </Field>,
      );
      expect(container.querySelector("[data-slot=field]")).toHaveClass("custom-field", "grid");
    });

    it("renders horizontal orientation", () => {
      const { container } = renderWithProviders(
        <Field orientation="horizontal">
          <FieldLabel>Name</FieldLabel>
        </Field>,
      );
      expect(container.querySelector("[data-slot=field]")).toHaveClass(
        "grid-cols-[minmax(0,1fr)_auto]",
      );
    });

    it("uses compact meta typography for description and error", () => {
      const { getByText } = renderWithProviders(<BasicField invalid />);
      expect(getByText("Helper text")).toHaveClass("text-meta");
      expect(getByText("Email is required")).toHaveClass("text-meta");
    });
  });

  describe("props and edge cases", () => {
    it("associates label with control via htmlFor and id", () => {
      const { getByLabelText } = renderWithProviders(<BasicField />);
      expect(getByLabelText(/^Email/)).toBeInTheDocument();
    });

    it("wires aria-describedby to description and error", () => {
      const { getByRole } = renderWithProviders(<BasicField invalid />);
      const input = getByRole("textbox");
      const describedBy = input.getAttribute("aria-describedby");
      expect(describedBy).toBeTruthy();
      expect(describedBy?.split(" ")).toHaveLength(2);
    });

    it("sets aria-invalid on control when Field is invalid", () => {
      const { getByRole } = renderWithProviders(<BasicField invalid />);
      expect(getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
    });

    it("does not render FieldError when children are empty", () => {
      const { queryByRole } = renderWithProviders(
        <Field>
          <FieldLabel>Name</FieldLabel>
          <FieldError />
        </Field>,
      );
      expect(queryByRole("alert")).not.toBeInTheDocument();
    });

    it("renders FieldError from errors array", () => {
      const { getByRole, getByText } = renderWithProviders(
        <Field invalid>
          <FieldLabel>Email</FieldLabel>
          <FieldError errors={[{ message: "Required" }, { message: "Invalid format" }]} />
        </Field>,
      );
      expect(getByRole("alert")).toBeInTheDocument();
      expect(getByText("Required")).toBeInTheDocument();
      expect(getByText("Invalid format")).toBeInTheDocument();
    });

    it("renders FieldContent and FieldTitle", () => {
      const { getByText } = renderWithProviders(
        <Field orientation="horizontal">
          <Checkbox id="field-content-checkbox" />
          <FieldContent>
            <FieldTitle>Marketing emails</FieldTitle>
            <FieldDescription>Receive product updates.</FieldDescription>
          </FieldContent>
        </Field>,
      );
      expect(getByText("Marketing emails")).toBeInTheDocument();
      expect(getByText("Receive product updates.")).toBeInTheDocument();
    });

    it("forwards ref on Field root", () => {
      const ref = createRef<HTMLDivElement>();
      renderWithProviders(
        <Field ref={ref}>
          <FieldLabel>Name</FieldLabel>
        </Field>,
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("forwards ref on FieldLabel", () => {
      const ref = createRef<HTMLLabelElement>();
      renderWithProviders(
        <Field>
          <FieldLabel ref={ref}>Name</FieldLabel>
        </Field>,
      );
      expect(ref.current).toBeInstanceOf(HTMLLabelElement);
    });

    it("renders FieldLabel with asChild", () => {
      const { getByText } = renderWithProviders(
        <Field>
          <FieldLabel asChild>
            <label htmlFor="custom-input">Custom label</label>
          </FieldLabel>
          <FieldControl asChild>
            <input id="custom-input" type="text" />
          </FieldControl>
        </Field>,
      );
      expect(getByText("Custom label")).toBeInTheDocument();
    });

    it("renders FieldControl wrapper when asChild is false", () => {
      const { container } = renderWithProviders(
        <Field>
          <FieldLabel>Name</FieldLabel>
          <FieldControl asChild={false} className="control-wrapper">
            <input type="text" />
          </FieldControl>
        </Field>,
      );
      const control = container.querySelector("[data-slot=field-control]");
      expect(control).toHaveClass("control-wrapper", "w-full");
      expect(control?.tagName).toBe("DIV");
    });
  });

  describe("interactions", () => {
    it("focuses control when label is clicked", async () => {
      const user = userEvent.setup();
      const { getByLabelText, getByRole } = renderWithProviders(<BasicField />);
      await user.click(getByLabelText(/^Email/));
      expect(getByRole("textbox")).toHaveFocus();
    });
  });

  describe("accessibility", () => {
    it("has no axe violations", async () => {
      const { container } = renderWithProviders(<BasicField />);
      await expectNoA11yViolations(container);
    });

    it("exposes error with role alert", () => {
      const { getByRole } = renderWithProviders(<BasicField invalid />);
      expect(getByRole("alert")).toHaveTextContent("Email is required");
    });
  });

  describe("reliability", () => {
    it("re-renders without throwing", () => {
      const { rerender, getByText } = renderWithProviders(<BasicField />);
      rerender(<BasicField invalid />);
      expect(getByText("Email is required")).toBeInTheDocument();
    });

    it("throws when FieldLabel is used outside Field", () => {
      expect(() => renderWithProviders(<FieldLabel>Name</FieldLabel>)).toThrow(
        "FieldLabel must be used within Field",
      );
    });

    it("sets data-invalid on Field root when invalid", () => {
      const { container } = renderWithProviders(<BasicField invalid />);
      expect(container.querySelector("[data-slot=field]")).toHaveAttribute("data-invalid", "true");
    });
  });
});

describe("Field layout", () => {
  describe("rendering", () => {
    it("renders FieldGroup, FieldSet, and FieldLegend", () => {
      const { getByText } = renderWithProviders(
        <FieldGroup>
          <FieldSet>
            <FieldLegend>Billing</FieldLegend>
            <Field>
              <FieldLabel>Name</FieldLabel>
            </Field>
          </FieldSet>
        </FieldGroup>,
      );
      expect(getByText("Billing")).toBeInTheDocument();
    });

    it("renders FieldSeparator with label", () => {
      const { getByText } = renderWithProviders(<FieldSeparator>Or continue</FieldSeparator>);
      expect(getByText("Or continue")).toBeInTheDocument();
    });

    it("renders FieldSeparator without label", () => {
      const { container, queryByText } = renderWithProviders(<FieldSeparator />);
      expect(container.querySelector('[data-slot="field-separator"]')).toBeInTheDocument();
      expect(queryByText("Or continue")).not.toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("has no axe violations for grouped form", async () => {
      const { container } = renderWithProviders(
        <FieldGroup>
          <FieldSet>
            <FieldLegend>Section</FieldLegend>
            <Field>
              <FieldLabel htmlFor="grouped-input">Email</FieldLabel>
              <FieldControl asChild>
                <Input id="grouped-input" type="email" />
              </FieldControl>
            </Field>
          </FieldSet>
        </FieldGroup>,
      );
      await expectNoA11yViolations(container);
    });
  });
});
