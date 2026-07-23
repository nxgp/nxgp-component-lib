import { cva, type VariantProps } from "class-variance-authority";

export const commandVariants = cva(
  "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
);

export const commandInputWrapperVariants = cva("flex items-center border-b border-border px-3");

export const commandSearchIconVariants = cva("size-4 shrink-0 opacity-50");

export const commandInputVariants = cva(
  "flex h-10 w-full rounded-md bg-transparent py-3 pl-2 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
);

export const commandListVariants = cva("max-h-72 overflow-y-auto overflow-x-hidden p-1");

export const commandEmptyVariants = cva("py-6 text-center text-sm text-muted-foreground");

export const commandGroupVariants = cva(
  "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
);

export const commandSeparatorVariants = cva("-mx-1 h-px bg-border");

export const commandItemVariants = cva(
  "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
);

export type CommandVariantProps = VariantProps<typeof commandVariants>;
