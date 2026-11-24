import { ShieldAlertIcon, TriangleAlertIcon } from "lucide-react";
import { memo } from "react";

import { ComposerBanner } from "@/components/agent/composer-banner";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipPopup, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export type ApprovalRequestKind = "command" | "file-read" | "file-change" | "mcp-elicitation";

export type ApprovalDecision = "accept" | "acceptForSession" | "decline" | "cancel";

export interface ApprovalOption {
  readonly decision: ApprovalDecision;
  readonly label: string;
  readonly warning?: string;
}

export interface PendingApprovalItem {
  readonly id: string;
  readonly requestKind: ApprovalRequestKind;
  readonly detail: string;
  readonly appName?: string;
  readonly options?: ReadonlyArray<ApprovalOption>;
}

const DEFAULT_APPROVAL_OPTIONS: ReadonlyArray<ApprovalOption> = [
  { decision: "decline", label: "Deny" },
  { decision: "acceptForSession", label: "Always Allow" },
  { decision: "accept", label: "Approve" },
];

const REQUEST_KIND_LABELS: Record<
  ApprovalRequestKind,
  { fallback: string; detailAria: string }
> = {
  command: { fallback: "Command approval", detailAria: "Command" },
  "file-read": { fallback: "File read approval", detailAria: "File to read" },
  "file-change": { fallback: "File change approval", detailAria: "File change" },
  "mcp-elicitation": { fallback: "App access approval", detailAria: "App access request" },
};

export interface PendingApprovalPanelProps {
  approval: PendingApprovalItem;
  pendingCount?: number;
  isResponding?: boolean;
  onDecision: (requestId: string, decision: ApprovalDecision) => void;
  placement?: "attached" | "floating";
  className?: string;
}

/**
 * Interactive tool-call / command approval bar modeled after t3code's
 * ComposerPendingApprovalPanel + ComposerPendingApprovalActions.
 */
export const PendingApprovalPanel = memo(function PendingApprovalPanel({
  approval,
  pendingCount = 1,
  isResponding = false,
  onDecision,
  placement = "floating",
  className,
}: PendingApprovalPanelProps) {
  const labels = REQUEST_KIND_LABELS[approval.requestKind];
  const options = approval.options ?? DEFAULT_APPROVAL_OPTIONS;

  return (
    <ComposerBanner.Root
      placement={placement}
      variant="warning"
      className={cn("px-1.5", className)}
    >
      <ComposerBanner.Row layout="wrap-actions">
        <ComposerBanner.Icon className="text-warning">
          <ShieldAlertIcon />
        </ComposerBanner.Icon>
        <ComposerBanner.Content>
          <span
            aria-label={labels.fallback}
            className="flex min-w-0 flex-1 items-center gap-2"
            role="group"
          >
            {approval.appName ? (
              <span className="max-w-32 shrink truncate text-[11px] font-medium text-foreground">
                {approval.appName}
              </span>
            ) : null}
            <code
              aria-label={labels.detailAria}
              className="block max-h-20 min-w-0 flex-1 overflow-auto whitespace-pre font-mono text-[11px] text-foreground/85 [scrollbar-width:thin] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring/70 [&::-webkit-scrollbar]:h-1.5"
              data-approval-detail="complete"
              tabIndex={0}
            >
              {approval.detail || labels.fallback}
            </code>
            {pendingCount > 1 ? (
              <span className="shrink-0 text-[10px] font-medium text-muted-foreground tabular-nums">
                1/{pendingCount}
              </span>
            ) : null}
          </span>
        </ComposerBanner.Content>
        <ComposerBanner.Actions>
          {options.map((option) => {
            const button = (
              <Button
                key={option.decision}
                size="micro"
                variant="ghost-muted"
                className={cn(
                  "font-normal",
                  option.decision === "decline" &&
                    "text-destructive-foreground [:hover,[data-pressed]]:text-destructive-foreground",
                  option.decision === "accept" && "text-foreground font-medium",
                  option.warning && "text-warning",
                )}
                disabled={isResponding}
                aria-description={option.warning}
                onClick={() => onDecision(approval.id, option.decision)}
              >
                {option.warning ? <TriangleAlertIcon className="size-3 shrink-0" /> : null}
                <span className="max-w-40 truncate">{option.label}</span>
              </Button>
            );

            return option.warning ? (
              <Tooltip key={option.decision}>
                <TooltipTrigger render={button} />
                <TooltipPopup side="top" className="max-w-72 text-xs leading-snug">
                  {option.warning}
                </TooltipPopup>
              </Tooltip>
            ) : (
              button
            );
          })}
        </ComposerBanner.Actions>
      </ComposerBanner.Row>
    </ComposerBanner.Root>
  );
});
