import type { CSSProperties } from "react";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import { LoaderIcon } from "../../lib/icons";
import { useThemeOptional } from "../../lib/theme";
import { toasterLoadingIconVariants, toasterVariants } from "./toast.variants";

/**
 * Theme-aware toast host. Mount once near the app root and call {@link toast} anywhere.
 * Works without {@link ThemeProvider} — falls back to `theme="system"`.
 *
 * @example
 * ```tsx
 * <ThemeProvider>
 *   <App />
 *   <Toaster closeButton richColors />
 * </ThemeProvider>
 * ```
 *
 * Per-toast dismiss: `toast("Saved", { dismissible: true })` or swipe to dismiss.
 */
export function Toaster({
  theme: themeProp,
  style,
  richColors = true,
  closeButton = true,
  toastOptions,
  ...props
}: ToasterProps) {
  const themeContext = useThemeOptional();

  return (
    <Sonner
      theme={themeProp ?? themeContext?.resolvedMode ?? "system"}
      richColors={richColors}
      closeButton={closeButton}
      toastOptions={
        {
          ...toastOptions,
          dismissible: true,
        } as NonNullable<ToasterProps["toastOptions"]>
      }
      className={toasterVariants()}
      icons={{
        loading: <LoaderIcon className={toasterLoadingIconVariants()} />,
      }}
      style={
        {
          "--normal-bg": "var(--color-card)",
          "--normal-text": "var(--color-card-foreground)",
          "--normal-border": "var(--color-border)",
          "--border-radius": "var(--radius-md)",
          ...style,
        } as CSSProperties
      }
      {...props}
    />
  );
}
