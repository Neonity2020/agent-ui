import { CheckIcon, CpuIcon, SparklesIcon, StarIcon } from "lucide-react";
import { memo, type ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { Tooltip, TooltipPopup, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export interface AgentModelOption {
  readonly id: string;
  readonly name: string;
  readonly provider: string;
  readonly contextLabel?: string;
  readonly isNew?: boolean;
  readonly supportsReasoning?: boolean;
  readonly unavailable?: boolean;
  readonly disabledReason?: string | null;
  readonly icon?: ReactNode;
}

export interface ModelListRowProps {
  model: AgentModelOption;
  isSelected?: boolean;
  isFavorite?: boolean;
  showProvider?: boolean;
  jumpLabel?: string | null;
  onSelect?: (model: AgentModelOption) => void;
  onToggleFavorite?: (model: AgentModelOption) => void;
  className?: string;
}

export const ModelListRow = memo(function ModelListRow({
  model,
  isSelected = false,
  isFavorite = false,
  showProvider = true,
  jumpLabel,
  onSelect,
  onToggleFavorite,
  className,
}: ModelListRowProps) {
  const isDisabled = Boolean(model.disabledReason || model.unavailable);

  const row = (
    <div
      role="option"
      aria-selected={isSelected}
      aria-disabled={isDisabled}
      tabIndex={isDisabled ? -1 : 0}
      onClick={() => {
        if (!isDisabled) onSelect?.(model);
      }}
      onKeyDown={(event) => {
        if (!isDisabled && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          onSelect?.(model);
        }
      }}
      className={cn(
        "group relative flex w-full min-w-0 max-w-full cursor-pointer items-center gap-3 rounded-md px-2.5 py-2 outline-none transition-[background-color,box-shadow,color]",
        "hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring",
        isSelected && "bg-foreground/[0.08] text-foreground",
        isDisabled && "cursor-not-allowed opacity-60 hover:bg-transparent",
        className,
      )}
    >
      <div className="min-w-0 flex-1 text-left">
        <div className="flex min-w-0 items-center gap-2">
          <div className="min-w-0 truncate text-xs font-medium leading-snug">{model.name}</div>
          {model.isNew ? (
            <span
              className="shrink-0 rounded border border-update/35 bg-update/15 px-1 py-px text-[10px] font-bold uppercase leading-none tracking-wide text-update-foreground"
              aria-label="New model"
            >
              New
            </span>
          ) : null}
          {model.supportsReasoning ? (
            <Badge variant="info" size="sm" className="gap-0.5">
              <SparklesIcon className="size-2.5" />
              Reasoning
            </Badge>
          ) : null}
          {model.unavailable ? (
            <Badge variant="outline" size="sm">
              Unavailable
            </Badge>
          ) : null}
        </div>
        {showProvider && (
          <div className="mt-1 flex items-center gap-1.5 text-muted-foreground/75">
            <span className="flex size-3 shrink-0 items-center justify-center [&>svg]:size-3">
              {model.icon ?? <CpuIcon />}
            </span>
            <span className="truncate text-xs font-normal leading-snug">
              {model.provider}
              {model.contextLabel ? ` · ${model.contextLabel}` : ""}
            </span>
          </div>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        {isSelected ? <CheckIcon className="size-3.5 text-primary" aria-hidden="true" /> : null}
        {jumpLabel ? (
          <Kbd className="h-4 min-w-0 rounded-sm px-1.5 text-[10px]">{jumpLabel}</Kbd>
        ) : null}
        {onToggleFavorite ? (
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  size="icon-xs"
                  variant="ghost"
                  className={cn(
                    "-mr-1 shrink-0 text-muted-foreground/70 opacity-64 transition-[color,opacity] hover:text-foreground hover:opacity-100 group-hover:opacity-100",
                    isFavorite && "text-foreground opacity-100",
                  )}
                  onClick={(event) => {
                    event.stopPropagation();
                    onToggleFavorite(model);
                  }}
                  onKeyDown={(event) => event.stopPropagation()}
                  disabled={isDisabled}
                  aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                  <StarIcon
                    className={cn(
                      "size-3.5 sm:size-3",
                      isFavorite && "fill-current text-amber-500",
                    )}
                  />
                </Button>
              }
            />
            <TooltipPopup side="top" align="center">
              {isFavorite ? "Remove from favorites" : "Add to favorites"}
            </TooltipPopup>
          </Tooltip>
        ) : null}
      </div>
    </div>
  );

  if (!model.disabledReason) {
    return row;
  }

  return (
    <Tooltip>
      <TooltipTrigger render={row} />
      <TooltipPopup side="left" align="center" className="max-w-64 text-balance leading-snug">
        {model.disabledReason}
      </TooltipPopup>
    </Tooltip>
  );
});
