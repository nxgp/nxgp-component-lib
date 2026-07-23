import { createContext, type ReactNode, useContext } from "react";

export type PopoverTriggerMode = "click" | "hover";

const PopoverTriggerModeContext = createContext<PopoverTriggerMode>("click");

export function PopoverTriggerModeProvider({
  mode,
  children,
}: {
  mode: PopoverTriggerMode;
  children: ReactNode;
}) {
  return (
    <PopoverTriggerModeContext.Provider value={mode}>{children}</PopoverTriggerModeContext.Provider>
  );
}

/** Whether the surrounding {@link Popover} opens on click or hover. */
export function usePopoverTriggerMode(): PopoverTriggerMode {
  return useContext(PopoverTriggerModeContext);
}
