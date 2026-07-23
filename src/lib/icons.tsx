import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Bold,
  Calendar,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  ChevronUp,
  Circle,
  CircleDot,
  Code2,
  Copy,
  Eye,
  EyeOff,
  File,
  FileArchive,
  FileAudio,
  FileText,
  FileVideo,
  GripVertical,
  Image,
  Italic,
  LayoutList,
  Link2,
  List,
  ListOrdered,
  Loader2,
  MoreHorizontal,
  PanelLeft,
  Pencil,
  Quote,
  RefreshCw,
  Search,
  Send,
  Settings,
  Settings2,
  Sparkles,
  Square,
  Strikethrough,
  Table,
  ThumbsDown,
  ThumbsUp,
  Unlink,
  Upload,
  X,
} from "lucide-react";
import type { SVGAttributes } from "react";
import { cn } from "./cn";

export type IconProps = SVGAttributes<SVGSVGElement> & {
  /** Icon size utility class. @default "size-4" */
  iconClassName?: string;
};

const defaultIconClass = "size-4 shrink-0";

/**
 * Internal icon helpers for primitives — backed by lucide-react.
 * Consumers should import from `@nxgp/component-lib` instead.
 */
export function ChevronDownIcon({ className, iconClassName, ...props }: IconProps) {
  return (
    <ChevronDown
      aria-hidden
      className={cn(defaultIconClass, iconClassName, className)}
      {...props}
    />
  );
}

export function ChevronUpIcon({ className, iconClassName, ...props }: IconProps) {
  return (
    <ChevronUp aria-hidden className={cn(defaultIconClass, iconClassName, className)} {...props} />
  );
}

export function ChevronRightIcon({ className, iconClassName, ...props }: IconProps) {
  return (
    <ChevronRight
      aria-hidden
      className={cn(defaultIconClass, iconClassName, className)}
      {...props}
    />
  );
}

export function ChevronLeftIcon({ className, iconClassName, ...props }: IconProps) {
  return (
    <ChevronLeft
      aria-hidden
      className={cn(defaultIconClass, iconClassName, className)}
      {...props}
    />
  );
}

export function MoreHorizontalIcon({ className, iconClassName, ...props }: IconProps) {
  return (
    <MoreHorizontal
      aria-hidden
      className={cn(defaultIconClass, iconClassName, className)}
      {...props}
    />
  );
}

export function PanelLeftIcon({ className, iconClassName, ...props }: IconProps) {
  return (
    <PanelLeft aria-hidden className={cn(defaultIconClass, iconClassName, className)} {...props} />
  );
}

export function CalendarIcon({ className, iconClassName, ...props }: IconProps) {
  return (
    <Calendar aria-hidden className={cn(defaultIconClass, iconClassName, className)} {...props} />
  );
}

export function CheckIcon({ className, iconClassName, ...props }: IconProps) {
  return (
    <Check aria-hidden className={cn(defaultIconClass, iconClassName, className)} {...props} />
  );
}

export function XIcon({ className, iconClassName, ...props }: IconProps) {
  return <X aria-hidden className={cn(defaultIconClass, iconClassName, className)} {...props} />;
}

export function EyeIcon({ className, iconClassName, ...props }: IconProps) {
  return <Eye aria-hidden className={cn(defaultIconClass, iconClassName, className)} {...props} />;
}

export function EyeOffIcon({ className, iconClassName, ...props }: IconProps) {
  return (
    <EyeOff aria-hidden className={cn(defaultIconClass, iconClassName, className)} {...props} />
  );
}

export function CircleIcon({ className, iconClassName, ...props }: IconProps) {
  return (
    <Circle
      aria-hidden
      className={cn("size-2 fill-current", iconClassName, className)}
      {...props}
    />
  );
}

export function LoaderIcon({ className, iconClassName, ...props }: IconProps) {
  return (
    <Loader2
      aria-hidden
      className={cn(defaultIconClass, "animate-spin", iconClassName, className)}
      {...props}
    />
  );
}

export function UploadIcon({ className, iconClassName, ...props }: IconProps) {
  return (
    <Upload aria-hidden className={cn(defaultIconClass, iconClassName, className)} {...props} />
  );
}

export function SearchIcon({ className, iconClassName, ...props }: IconProps) {
  return (
    <Search aria-hidden className={cn(defaultIconClass, iconClassName, className)} {...props} />
  );
}

export function SettingsIcon({ className, iconClassName, ...props }: IconProps) {
  return (
    <Settings aria-hidden className={cn(defaultIconClass, iconClassName, className)} {...props} />
  );
}

export function LayoutListIcon({ className, iconClassName, ...props }: IconProps) {
  return (
    <LayoutList aria-hidden className={cn(defaultIconClass, iconClassName, className)} {...props} />
  );
}

export function CircleDotIcon({ className, iconClassName, ...props }: IconProps) {
  return (
    <CircleDot aria-hidden className={cn(defaultIconClass, iconClassName, className)} {...props} />
  );
}

export function ArrowLeftIcon({ className, iconClassName, ...props }: IconProps) {
  return (
    <ArrowLeft aria-hidden className={cn(defaultIconClass, iconClassName, className)} {...props} />
  );
}

export function ArrowRightIcon({ className, iconClassName, ...props }: IconProps) {
  return (
    <ArrowRight aria-hidden className={cn(defaultIconClass, iconClassName, className)} {...props} />
  );
}

export function ArrowDownIcon({ className, iconClassName, ...props }: IconProps) {
  return (
    <ArrowDown aria-hidden className={cn(defaultIconClass, iconClassName, className)} {...props} />
  );
}

export function ArrowUpIcon({ className, iconClassName, ...props }: IconProps) {
  return (
    <ArrowUp aria-hidden className={cn(defaultIconClass, iconClassName, className)} {...props} />
  );
}

export function ChevronsUpDownIcon({ className, iconClassName, ...props }: IconProps) {
  return (
    <ChevronsUpDown
      aria-hidden
      className={cn(defaultIconClass, iconClassName, className)}
      {...props}
    />
  );
}

export function GripVerticalIcon({ className, iconClassName, ...props }: IconProps) {
  return (
    <GripVertical
      aria-hidden
      className={cn(defaultIconClass, iconClassName, className)}
      {...props}
    />
  );
}

export function Settings2Icon({ className, iconClassName, ...props }: IconProps) {
  return (
    <Settings2 aria-hidden className={cn(defaultIconClass, iconClassName, className)} {...props} />
  );
}

export function BoldIcon({ className, iconClassName, ...props }: IconProps) {
  return <Bold aria-hidden className={cn(defaultIconClass, iconClassName, className)} {...props} />;
}

export function ItalicIcon({ className, iconClassName, ...props }: IconProps) {
  return (
    <Italic aria-hidden className={cn(defaultIconClass, iconClassName, className)} {...props} />
  );
}

export function StrikethroughIcon({ className, iconClassName, ...props }: IconProps) {
  return (
    <Strikethrough
      aria-hidden
      className={cn(defaultIconClass, iconClassName, className)}
      {...props}
    />
  );
}

export function ListIcon({ className, iconClassName, ...props }: IconProps) {
  return <List aria-hidden className={cn(defaultIconClass, iconClassName, className)} {...props} />;
}

export function ListOrderedIcon({ className, iconClassName, ...props }: IconProps) {
  return (
    <ListOrdered
      aria-hidden
      className={cn(defaultIconClass, iconClassName, className)}
      {...props}
    />
  );
}

export function QuoteIcon({ className, iconClassName, ...props }: IconProps) {
  return (
    <Quote aria-hidden className={cn(defaultIconClass, iconClassName, className)} {...props} />
  );
}

export function Code2Icon({ className, iconClassName, ...props }: IconProps) {
  return (
    <Code2 aria-hidden className={cn(defaultIconClass, iconClassName, className)} {...props} />
  );
}

export function TableIcon({ className, iconClassName, ...props }: IconProps) {
  return (
    <Table aria-hidden className={cn(defaultIconClass, iconClassName, className)} {...props} />
  );
}

export function UnlinkIcon({ className, iconClassName, ...props }: IconProps) {
  return (
    <Unlink aria-hidden className={cn(defaultIconClass, iconClassName, className)} {...props} />
  );
}

export function ImageIcon({ className, iconClassName, ...props }: IconProps) {
  return (
    <Image aria-hidden className={cn(defaultIconClass, iconClassName, className)} {...props} />
  );
}

export function Link2Icon({ className, iconClassName, ...props }: IconProps) {
  return (
    <Link2 aria-hidden className={cn(defaultIconClass, iconClassName, className)} {...props} />
  );
}

export function CopyIcon({ className, iconClassName, ...props }: IconProps) {
  return <Copy aria-hidden className={cn(defaultIconClass, iconClassName, className)} {...props} />;
}

export function RefreshCwIcon({ className, iconClassName, ...props }: IconProps) {
  return (
    <RefreshCw aria-hidden className={cn(defaultIconClass, iconClassName, className)} {...props} />
  );
}

export function SquareIcon({ className, iconClassName, ...props }: IconProps) {
  return (
    <Square
      aria-hidden
      fill="currentColor"
      stroke="currentColor"
      strokeWidth={0}
      className={cn("size-3.5", iconClassName, className)}
      {...props}
    />
  );
}

export function PencilIcon({ className, iconClassName, ...props }: IconProps) {
  return (
    <Pencil aria-hidden className={cn(defaultIconClass, iconClassName, className)} {...props} />
  );
}

export function ThumbsUpIcon({ className, iconClassName, ...props }: IconProps) {
  return (
    <ThumbsUp aria-hidden className={cn(defaultIconClass, iconClassName, className)} {...props} />
  );
}

export function ThumbsDownIcon({ className, iconClassName, ...props }: IconProps) {
  return (
    <ThumbsDown aria-hidden className={cn(defaultIconClass, iconClassName, className)} {...props} />
  );
}

export function SparklesIcon({ className, iconClassName, ...props }: IconProps) {
  return (
    <Sparkles aria-hidden className={cn(defaultIconClass, iconClassName, className)} {...props} />
  );
}

export function SendIcon({ className, iconClassName, ...props }: IconProps) {
  return <Send aria-hidden className={cn(defaultIconClass, iconClassName, className)} {...props} />;
}

export function FileIcon({ className, iconClassName, ...props }: IconProps) {
  return <File aria-hidden className={cn(defaultIconClass, iconClassName, className)} {...props} />;
}

export function FileTextIcon({ className, iconClassName, ...props }: IconProps) {
  return (
    <FileText aria-hidden className={cn(defaultIconClass, iconClassName, className)} {...props} />
  );
}

export function FileVideoIcon({ className, iconClassName, ...props }: IconProps) {
  return (
    <FileVideo aria-hidden className={cn(defaultIconClass, iconClassName, className)} {...props} />
  );
}

export function FileAudioIcon({ className, iconClassName, ...props }: IconProps) {
  return (
    <FileAudio aria-hidden className={cn(defaultIconClass, iconClassName, className)} {...props} />
  );
}

export function FileArchiveIcon({ className, iconClassName, ...props }: IconProps) {
  return (
    <FileArchive
      aria-hidden
      className={cn(defaultIconClass, iconClassName, className)}
      {...props}
    />
  );
}
