import { createContext, type ReactNode, useContext } from "react";

export type DrawerDirection = "top" | "bottom" | "left" | "right";

const DrawerDirectionContext = createContext<DrawerDirection>("bottom");

export function DrawerDirectionProvider({
  direction,
  children,
}: {
  direction: DrawerDirection;
  children: ReactNode;
}) {
  return (
    <DrawerDirectionContext.Provider value={direction}>{children}</DrawerDirectionContext.Provider>
  );
}

/** Current drawer slide direction — set on {@link Drawer} root. */
export function useDrawerDirection(): DrawerDirection {
  return useContext(DrawerDirectionContext);
}
