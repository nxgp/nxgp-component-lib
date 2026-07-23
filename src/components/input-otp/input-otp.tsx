import { unstable_OneTimePasswordField as OneTimePasswordFieldPrimitive } from "radix-ui";
import {
  type ComponentPropsWithoutRef,
  createContext,
  forwardRef,
  type HTMLAttributes,
  useContext,
} from "react";
import { cn } from "../../lib/cn";
import { type InputOtpSlotVariantProps, inputOtpSlotVariants } from "./input-otp.variants";

type InputOtpContextValue = {
  size?: InputOtpSlotVariantProps["size"];
  disabled?: boolean;
};

const InputOtpContext = createContext<InputOtpContextValue>({});

function useInputOtpContext() {
  return useContext(InputOtpContext);
}

export type InputOTPProps = ComponentPropsWithoutRef<typeof OneTimePasswordFieldPrimitive.Root> &
  InputOtpSlotVariantProps;

/**
 * One-time password field root — renders grouped character slots.
 *
 * @example
 * ```tsx
 * <InputOTP value={value} onValueChange={setValue}>
 *   <InputOTPGroup>
 *     <InputOTPSlot index={0} />
 *     <InputOTPSlot index={1} />
 *   </InputOTPGroup>
 * </InputOTP>
 * ```
 */
export const InputOTP = forwardRef<HTMLDivElement, InputOTPProps>(
  ({ className, size, disabled, children, ...props }, ref) => (
    <InputOtpContext.Provider value={{ size, disabled }}>
      <OneTimePasswordFieldPrimitive.Root
        ref={ref}
        data-slot="input-otp"
        disabled={disabled}
        className={cn("flex items-center gap-2 has-disabled:opacity-50", className)}
        {...props}
      >
        {children}
        <OneTimePasswordFieldPrimitive.HiddenInput />
      </OneTimePasswordFieldPrimitive.Root>
    </InputOtpContext.Provider>
  ),
);
InputOTP.displayName = "InputOTP";

export type InputOTPGroupProps = HTMLAttributes<HTMLDivElement>;

/** Groups OTP slots in a horizontal row. */
export const InputOTPGroup = forwardRef<HTMLDivElement, InputOTPGroupProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="input-otp-group"
      className={cn("flex items-center gap-1", className)}
      {...props}
    />
  ),
);
InputOTPGroup.displayName = "InputOTPGroup";

export type InputOTPSlotProps = ComponentPropsWithoutRef<
  typeof OneTimePasswordFieldPrimitive.Input
> &
  InputOtpSlotVariantProps;

/** Single character slot inside the OTP field. */
export const InputOTPSlot = forwardRef<HTMLInputElement, InputOTPSlotProps>(
  ({ className, size, index, ...props }, ref) => {
    const context = useInputOtpContext();

    return (
      <OneTimePasswordFieldPrimitive.Input
        ref={ref}
        index={index}
        data-slot="input-otp-slot"
        className={cn(inputOtpSlotVariants({ size: size ?? context.size }), className)}
        {...props}
      />
    );
  },
);
InputOTPSlot.displayName = "InputOTPSlot";

export type InputOTPSeparatorProps = HTMLAttributes<HTMLDivElement>;

/** Visual separator between OTP slot groups. */
export const InputOTPSeparator = forwardRef<HTMLDivElement, InputOTPSeparatorProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      aria-hidden="true"
      data-slot="input-otp-separator"
      className={cn("text-muted-foreground", className)}
      {...props}
    >
      {children ?? "–"}
    </div>
  ),
);
InputOTPSeparator.displayName = "InputOTPSeparator";
