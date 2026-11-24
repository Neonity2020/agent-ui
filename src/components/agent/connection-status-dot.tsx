import { Tooltip, TooltipPopup, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export type ConnectionPhase = "connected" | "connecting" | "reconnecting" | "error" | "disconnected";

export function connectionPhaseDotClassName(phase: ConnectionPhase): string {
  switch (phase) {
    case "connected":
      return "bg-success";
    case "connecting":
    case "reconnecting":
      return "bg-warning";
    case "error":
      return "bg-destructive";
    default:
      return "bg-muted-foreground/40";
  }
}

export function connectionPhasePingClassName(phase: ConnectionPhase): string | null {
  return phase === "connecting" || phase === "reconnecting" ? "bg-warning/60 duration-2000" : null;
}

export function ConnectionStatusDot({
  phase = "connected",
  tooltipText,
  dotClassName,
  pingClassName,
}: {
  phase?: ConnectionPhase;
  tooltipText?: string | null;
  dotClassName?: string;
  pingClassName?: string | null;
}) {
  const resolvedDotClass = dotClassName ?? connectionPhaseDotClassName(phase);
  const resolvedPingClass =
    pingClassName !== undefined ? pingClassName : connectionPhasePingClassName(phase);

  const dotContent = (
    <>
      {resolvedPingClass ? (
        <span
          className={cn(
            "absolute inline-flex h-full w-full animate-status-ping rounded-full",
            resolvedPingClass,
          )}
        />
      ) : null}
      <span className={cn("relative inline-flex size-2 rounded-full", resolvedDotClass)} />
    </>
  );

  if (!tooltipText) {
    return (
      <span className="relative flex size-3 shrink-0 items-center justify-center">
        {dotContent}
      </span>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <button
            type="button"
            aria-label={tooltipText}
            className="relative flex size-3 shrink-0 cursor-help items-center justify-center rounded-full outline-hidden"
          />
        }
      >
        {dotContent}
      </TooltipTrigger>
      <TooltipPopup side="top" className="max-w-80 whitespace-pre-wrap leading-tight">
        {tooltipText}
      </TooltipPopup>
    </Tooltip>
  );
}

export type ThreadStatusPhase =
  | "pending-approval"
  | "awaiting-input"
  | "working"
  | "connecting"
  | "plan-ready"
  | "monitoring"
  | "completed";

const THREAD_STATUS_CONFIG: Record<
  ThreadStatusPhase,
  { label: string; colorClass: string; dotClass: string; pulse: boolean }
> = {
  "pending-approval": {
    label: "Pending Approval",
    colorClass: "text-amber-600 dark:text-amber-300/90",
    dotClass: "bg-amber-500 dark:bg-amber-300/90",
    pulse: false,
  },
  "awaiting-input": {
    label: "Awaiting Input",
    colorClass: "text-indigo-600 dark:text-indigo-300/90",
    dotClass: "bg-indigo-500 dark:bg-indigo-300/90",
    pulse: false,
  },
  working: {
    label: "Working",
    colorClass: "text-sky-600 dark:text-sky-300/80",
    dotClass: "bg-sky-500 dark:bg-sky-300/80",
    pulse: true,
  },
  connecting: {
    label: "Connecting",
    colorClass: "text-sky-600 dark:text-sky-300/80",
    dotClass: "bg-sky-500 dark:bg-sky-300/80",
    pulse: true,
  },
  "plan-ready": {
    label: "Plan Ready",
    colorClass: "text-violet-600 dark:text-violet-300/90",
    dotClass: "bg-violet-500 dark:bg-violet-300/90",
    pulse: false,
  },
  monitoring: {
    label: "Monitoring",
    colorClass: "text-sky-600 dark:text-sky-300/80",
    dotClass: "bg-sky-500 dark:bg-sky-300/80",
    pulse: false,
  },
  completed: {
    label: "Completed",
    colorClass: "text-emerald-600 dark:text-emerald-300/90",
    dotClass: "bg-emerald-500 dark:bg-emerald-300/90",
    pulse: false,
  },
};

export function ThreadStatusPill({
  status,
  compact = false,
  showLabelAlways = true,
  className,
}: {
  status: ThreadStatusPhase;
  compact?: boolean;
  showLabelAlways?: boolean;
  className?: string;
}) {
  const config = THREAD_STATUS_CONFIG[status];

  if (compact) {
    return (
      <Tooltip>
        <TooltipTrigger
          render={
            <span
              aria-label={config.label}
              className={cn(
                "inline-flex size-3.5 shrink-0 items-center justify-center",
                config.colorClass,
                className,
              )}
            />
          }
        >
          <span
            className={cn(
              "size-[9px] rounded-full",
              config.dotClass,
              config.pulse && "animate-status-pulse",
            )}
          />
        </TooltipTrigger>
        <TooltipPopup side="top">{config.label}</TooltipPopup>
      </Tooltip>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <span
            aria-label={config.label}
            className={cn(
              "inline-flex items-center gap-1.5 text-[11px] font-medium",
              config.colorClass,
              className,
            )}
          />
        }
      >
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            config.dotClass,
            config.pulse && "animate-status-pulse",
          )}
        />
        <span className={showLabelAlways ? "inline" : "hidden md:inline"}>{config.label}</span>
      </TooltipTrigger>
      <TooltipPopup side="top">{config.label}</TooltipPopup>
    </Tooltip>
  );
}
