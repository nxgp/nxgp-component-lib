import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ["meta"],
    },
  },
});

/**
 * Merge Tailwind class names with conflict resolution.
 *
 * @param inputs - Class values to merge (strings, arrays, objects).
 * @returns A single deduplicated class string.
 *
 * @example
 * ```ts
 * cn("px-2 py-1", isActive && "bg-primary", className)
 * ```
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
