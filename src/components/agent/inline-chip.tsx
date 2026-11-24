import { BoxIcon, FileCode2Icon, TerminalIcon, XIcon } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

const INLINE_CHIP_GEOMETRY =
  "inline-flex h-[1.41em] max-w-full items-center gap-[0.33em] rounded-[0.5em] px-[0.5em] font-medium leading-none align-middle";

export const INLINE_CHIP_BASE_CLASS = `${INLINE_CHIP_GEOMETRY} border border-border/70 bg-accent/40 text-foreground`;
export const CHAT_INLINE_CHIP_CLASS = `${INLINE_CHIP_BASE_CLASS} text-[12px]`;
export const COMPOSER_INLINE_CHIP_CLASS = `${INLINE_CHIP_BASE_CLASS} text-[0.86em] select-none`;
export const COMPOSER_SKILL_CHIP_CLASS = `${INLINE_CHIP_GEOMETRY} select-none border border-fuchsia-500/25 bg-fuchsia-500/12 text-[0.86em] text-fuchsia-700 dark:text-fuchsia-300`;

export interface InlineChipProps extends ComponentProps<"span"> {
  icon?: ReactNode;
  variant?: "default" | "skill";
  scale?: "chat" | "composer";
  onDismiss?: () => void;
  dismissLabel?: string;
}

export function InlineChip({
  icon,
  variant = "default",
  scale = "chat",
  onDismiss,
  dismissLabel = "Remove",
  className,
  children,
  ...props
}: InlineChipProps) {
  return (
    <span
      data-slot="inline-chip"
      className={cn(
        variant === "skill"
          ? COMPOSER_SKILL_CHIP_CLASS
          : scale === "composer"
            ? COMPOSER_INLINE_CHIP_CLASS
            : CHAT_INLINE_CHIP_CLASS,
        className,
      )}
      {...props}
    >
      {icon ? (
        <span className="flex size-[1.1em] shrink-0 items-center justify-center opacity-85 [&>svg]:size-full">
          {icon}
        </span>
      ) : null}
      <span className="truncate leading-tight">{children}</span>
      {onDismiss ? (
        <button
          type="button"
          aria-label={dismissLabel}
          onClick={onDismiss}
          className="ml-[0.17em] inline-flex size-[1.17em] shrink-0 cursor-pointer items-center justify-center rounded-sm text-muted-foreground/72 transition-colors hover:bg-foreground/6 hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <XIcon className="size-[0.85em]" />
        </button>
      ) : null}
    </span>
  );
}

export function FileTagChip({
  label,
  path,
  scale = "chat",
  onDismiss,
  className,
}: {
  label: string;
  path?: string;
  scale?: "chat" | "composer";
  onDismiss?: () => void;
  className?: string;
}) {
  return (
    <InlineChip
      icon={<FileCode2Icon />}
      scale={scale}
      title={path ?? label}
      onDismiss={onDismiss}
      dismissLabel={`Remove ${label}`}
      className={className}
    >
      {label}
    </InlineChip>
  );
}

export function TerminalContextChip({
  label,
  scale = "chat",
  onDismiss,
  className,
}: {
  label: string;
  scale?: "chat" | "composer";
  onDismiss?: () => void;
  className?: string;
}) {
  return (
    <InlineChip
      icon={<TerminalIcon />}
      scale={scale}
      onDismiss={onDismiss}
      dismissLabel={`Remove ${label}`}
      className={cn("font-mono", className)}
    >
      {label}
    </InlineChip>
  );
}

export function SkillChip({
  name,
  onDismiss,
  className,
}: {
  name: string;
  onDismiss?: () => void;
  className?: string;
}) {
  return (
    <InlineChip
      icon={<BoxIcon />}
      variant="skill"
      scale="composer"
      onDismiss={onDismiss}
      dismissLabel={`Remove skill ${name}`}
      className={className}
    >
      /{name}
    </InlineChip>
  );
}
