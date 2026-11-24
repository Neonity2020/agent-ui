import { CircleAlertIcon, XIcon } from "lucide-react";
import { memo } from "react";

import { Alert, AlertAction, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipPopup, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export const ThreadErrorBanner = memo(function ThreadErrorBanner({
  error,
  onDismiss,
  className,
}: {
  error: string | null;
  onDismiss?: () => void;
  className?: string;
}) {
  if (!error) return null;

  return (
    <div
      className={cn(
        "pointer-events-auto mx-auto w-fit max-w-[min(48rem,calc(100%-2rem))]",
        className,
      )}
    >
      <Alert
        variant="error"
        controlAlignment="first-line"
        className="alert-glass"
      >
        <CircleAlertIcon />
        <AlertDescription>
          <Tooltip>
            <TooltipTrigger render={<div className="line-clamp-3 cursor-default" />}>
              {error}
            </TooltipTrigger>
            <TooltipPopup side="top" className="max-w-96 whitespace-pre-wrap">
              {error}
            </TooltipPopup>
          </Tooltip>
        </AlertDescription>
        {onDismiss && (
          <AlertAction>
            <Button variant="ghost" size="icon-xs" aria-label="Dismiss error" onClick={onDismiss}>
              <XIcon className="text-destructive" />
            </Button>
          </AlertAction>
        )}
      </Alert>
    </div>
  );
});
