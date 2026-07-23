import { type ChangeEvent, forwardRef, useCallback, useState } from "react";
import { a11yLabels } from "../../lib/a11y-labels";
import { EyeIcon, EyeOffIcon, XIcon } from "../../lib/icons";
import { IconButton } from "../icon-button/icon-button";
import { InputGroup, InputGroupAddon, InputGroupInput, type InputProps } from "./input";

export type PasswordInputProps = Omit<InputProps, "type"> & {
  /** Accessible label for the visibility toggle. @default toggles between show/hide */
  toggleLabel?: { show: string; hide: string };
};

/**
 * Password field with a reveal/hide toggle.
 *
 * @example
 * ```tsx
 * <PasswordInput aria-label="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
 * ```
 */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      toggleLabel = { show: a11yLabels.showPassword, hide: a11yLabels.hidePassword },
      disabled,
      ...props
    },
    ref,
  ) => {
    const [visible, setVisible] = useState(false);

    return (
      <InputGroup data-slot="password-input">
        <InputGroupInput
          ref={ref}
          type={visible ? "text" : "password"}
          disabled={disabled}
          {...props}
        />
        <InputGroupAddon align="inline-end" className="px-1">
          <IconButton
            type="button"
            size="icon-sm"
            aria-label={visible ? toggleLabel.hide : toggleLabel.show}
            disabled={disabled}
            onClick={() => setVisible((current) => !current)}
          >
            {visible ? <EyeOffIcon /> : <EyeIcon />}
          </IconButton>
        </InputGroupAddon>
      </InputGroup>
    );
  },
);
PasswordInput.displayName = "PasswordInput";

export type ClearableInputProps = InputProps & {
  /** Called when the clear button is pressed — defaults to clearing via `onChange`. */
  onClear?: () => void;
};

/**
 * Text input with a clear button when the field has a value.
 *
 * @example
 * ```tsx
 * <ClearableInput aria-label="Search" value={query} onChange={(e) => setQuery(e.target.value)} />
 * ```
 */
export const ClearableInput = forwardRef<HTMLInputElement, ClearableInputProps>(
  ({ value, defaultValue, onClear, onChange, disabled, className, ...props }, ref) => {
    const [uncontrolledValue, setUncontrolledValue] = useState(
      () => (defaultValue as string | undefined) ?? "",
    );
    const isControlled = value !== undefined;
    const currentValue = isControlled ? String(value ?? "") : uncontrolledValue;
    const hasValue = currentValue.length > 0;

    const handleChange = useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
        if (!isControlled) {
          setUncontrolledValue(event.target.value);
        }
        onChange?.(event);
      },
      [isControlled, onChange],
    );

    const handleClear = useCallback(() => {
      if (onClear) {
        onClear();
        return;
      }

      if (!isControlled) {
        setUncontrolledValue("");
      }

      onChange?.({
        target: { value: "" },
        currentTarget: { value: "" },
      } as ChangeEvent<HTMLInputElement>);
    }, [isControlled, onChange, onClear]);

    const sharedInputProps = {
      ref,
      value: currentValue,
      onChange: handleChange,
      disabled,
      className,
      ...props,
    };

    return (
      <InputGroup data-slot="clearable-input">
        <InputGroupInput {...sharedInputProps} />
        {hasValue ? (
          <InputGroupAddon align="inline-end" className="px-1">
            <IconButton
              type="button"
              size="icon-sm"
              aria-label={a11yLabels.clearInput}
              disabled={disabled}
              onClick={handleClear}
            >
              <XIcon />
            </IconButton>
          </InputGroupAddon>
        ) : null}
      </InputGroup>
    );
  },
);
ClearableInput.displayName = "ClearableInput";
