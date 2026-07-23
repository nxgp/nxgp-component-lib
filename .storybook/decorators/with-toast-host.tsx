import type { Decorator } from "@storybook/react";
import { type ReactNode, useEffect } from "react";
import { Toaster, type ToasterProps, toast } from "../../src/components/toast";

type ToastStoryHostProps = {
  children: ReactNode;
  toasterProps?: ToasterProps;
};

/**
 * One Toaster per story canvas. Remount via `key={context.id}` dismisses stale toasts.
 */
function ToastStoryHost({ children, toasterProps }: ToastStoryHostProps) {
  useEffect(() => {
    return () => {
      toast.dismiss();
    };
  }, []);

  return (
    <>
      {children}
      <Toaster richColors closeButton {...toasterProps} />
    </>
  );
}

export const withToastHost: Decorator = (Story, context) => (
  <ToastStoryHost key={context.id} toasterProps={context.args as ToasterProps}>
    <Story />
  </ToastStoryHost>
);
