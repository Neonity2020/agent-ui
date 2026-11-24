"use client";

import { Toast } from "@base-ui/react/toast";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CircleAlertIcon,
  CircleCheckIcon,
  CopyIcon,
  InfoIcon,
  LoaderCircleIcon,
  TriangleAlertIcon,
  XIcon,
} from "lucide-react";
import {
  useState,
  type CSSProperties,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Tooltip, TooltipPopup, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export type AgentToastData = {
  leadingIcon?: ReactNode;
  tooltipStyle?: boolean;
  onClose?: (() => void) | undefined;
  hideCopyButton?: boolean;
  additionalActions?: ReadonlyArray<{
    id: string;
    props: ComponentPropsWithoutRef<"button">;
  }>;
  secondaryActionProps?: ComponentPropsWithoutRef<"button">;
  secondaryActionVariant?:
    | "default"
    | "destructive"
    | "destructive-outline"
    | "ghost"
    | "link"
    | "outline"
    | "secondary";
  expandableContent?: ReactNode;
  expandableLabels?: { expand?: string; collapse?: string };
  actionLayout?: "inline" | "stacked-end";
  actionVariant?:
    | "default"
    | "destructive"
    | "destructive-outline"
    | "ghost"
    | "link"
    | "outline"
    | "secondary";
};

const toastManager = Toast.createToastManager<AgentToastData>();
const anchoredToastManager = Toast.createToastManager<AgentToastData>();
type ToastId = ReturnType<typeof toastManager.add>;

const TOAST_ICONS = {
  error: CircleAlertIcon,
  info: InfoIcon,
  loading: LoaderCircleIcon,
  success: CircleCheckIcon,
  warning: TriangleAlertIcon,
} as const;

const ERROR_DESCRIPTION_CLAMP_MIN_CHARS = 180;
function errorDescriptionClampClass(type: unknown, description: unknown): string | undefined {
  if (type !== "error" || typeof description !== "string") return undefined;
  if (description.length < ERROR_DESCRIPTION_CLAMP_MIN_CHARS) return undefined;
  return "line-clamp-4";
}

function hasVisibleToastAction(actionProps: unknown): boolean {
  if (actionProps == null || typeof actionProps !== "object") return false;
  if (!("children" in actionProps)) return false;
  const children = (actionProps as { children?: unknown }).children;
  return children != null && children !== false && children !== "";
}

const toastCornerDismissClass = "absolute z-20 -top-1.5 -right-1.5";
const toastCornerOrbClass = cn(
  "inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border/60 bg-popover/92 text-muted-foreground shadow-sm outline-none backdrop-blur-sm",
  "transition-[color,background-color,box-shadow] hover:bg-popover hover:text-foreground",
  "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
);

function handleToastDismissClick(
  manager: typeof toastManager | typeof anchoredToastManager,
  toastId: ToastId,
  onClose: (() => void) | undefined,
) {
  onClose?.();
  manager.close(toastId);
}

function CopyErrorButton({ text }: { text: string }) {
  const [isCopied, setIsCopied] = useState(false);
  const label = isCopied ? "Copied error" : "Copy error";

  const handleCopy = () => {
    void navigator.clipboard?.writeText(text).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1600);
    });
  };

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            size="icon-micro"
            variant="ghost-muted"
            aria-label={label}
            className="[--control-icon-color:currentColor] rounded-md text-muted-foreground/80 hover:bg-transparent hover:text-muted-foreground"
            onClick={handleCopy}
          />
        }
      >
        {isCopied ? <CheckIcon className="size-3 text-success" /> : <CopyIcon className="size-3" />}
      </TooltipTrigger>
      <TooltipPopup side="top">{label}</TooltipPopup>
    </Tooltip>
  );
}

const toastExpandablePanelClassName =
  "mt-2 max-h-40 min-h-0 overflow-y-auto overscroll-contain pr-0.5 select-text";

function ToastExpandableSection({
  children,
  labels,
}: {
  children: ReactNode;
  labels: { expand?: string; collapse?: string };
}) {
  const [open, setOpen] = useState(false);
  const expandLabel = labels.expand ?? "Show details";
  const collapseLabel = labels.collapse ?? "Hide details";

  return (
    <div className="min-w-0">
      <button
        aria-expanded={open}
        className="inline-flex cursor-pointer items-center gap-1 rounded-md py-0.5 text-left text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        onClick={() => setOpen((prev) => !prev)}
        type="button"
      >
        {open ? (
          <ChevronUpIcon className="size-3.5 shrink-0 opacity-80" strokeWidth={2.25} />
        ) : (
          <ChevronDownIcon className="size-3.5 shrink-0 opacity-80" strokeWidth={2.25} />
        )}
        {open ? collapseLabel : expandLabel}
      </button>
      {open ? <div className={toastExpandablePanelClassName}>{children}</div> : null}
    </div>
  );
}

function ToastBodyContent({
  toast,
}: {
  toast: {
    readonly type?: string | undefined;
    readonly description?: unknown;
    readonly actionProps?: { readonly children?: ReactNode } | undefined;
    readonly data?: AgentToastData | undefined;
  };
}) {
  const Icon = toast.type ? TOAST_ICONS[toast.type as keyof typeof TOAST_ICONS] : null;
  const stackedActionLayout =
    hasVisibleToastAction(toast.actionProps) && toast.data?.actionLayout === "stacked-end";
  const actionVariant = toast.data?.actionVariant ?? "default";
  const secondaryActionVariant = toast.data?.secondaryActionVariant ?? "outline";
  const copyErrorText =
    toast.type === "error" && typeof toast.description === "string" && !toast.data?.hideCopyButton
      ? toast.description
      : null;
  const additionalActions = toast.data?.additionalActions ?? [];
  const secondaryActionProps = toast.data?.secondaryActionProps;
  const hasTrailingControls =
    copyErrorText !== null ||
    hasVisibleToastAction(toast.actionProps) ||
    additionalActions.length > 0 ||
    secondaryActionProps !== undefined;
  const { className: secondaryActionClassName, ...secondaryActionRest } =
    secondaryActionProps ?? {};

  return (
    <>
      <div className={cn("flex min-w-0 gap-2", !stackedActionLayout && "flex-1")}>
        {toast.data?.leadingIcon ? (
          <div
            className="flex h-lh w-4 shrink-0 items-center justify-center"
            data-slot="toast-icon"
          >
            {toast.data.leadingIcon}
          </div>
        ) : Icon ? (
          <div
            className="[&>svg]:h-lh [&>svg]:w-4 [&_svg]:pointer-events-none [&_svg]:shrink-0"
            data-slot="toast-icon"
          >
            <Icon className="in-data-[type=loading]:animate-spin in-data-[type=error]:text-destructive in-data-[type=info]:text-info in-data-[type=success]:text-success in-data-[type=warning]:text-warning in-data-[type=loading]:opacity-80" />
          </div>
        ) : null}
        <div
          className={cn(
            "flex min-h-0 min-w-0 flex-1 flex-col gap-0.5",
            stackedActionLayout && "pr-5",
          )}
        >
          <Toast.Title className="min-w-0 wrap-break-word font-medium" data-slot="toast-title" />
          <Toast.Description
            className={cn(
              "min-w-0 select-text wrap-break-word text-muted-foreground",
              errorDescriptionClampClass(toast.type, toast.description),
            )}
            data-slot="toast-description"
          />
          {toast.data?.expandableContent ? (
            <ToastExpandableSection labels={toast.data.expandableLabels ?? {}}>
              {toast.data.expandableContent}
            </ToastExpandableSection>
          ) : null}
        </div>
      </div>
      {hasTrailingControls ? (
        <div
          className={cn(
            "flex items-center gap-1.5",
            stackedActionLayout ? "w-full justify-end" : "shrink-0",
          )}
        >
          {copyErrorText !== null ? <CopyErrorButton text={copyErrorText} /> : null}
          {additionalActions.map(({ id, props: { className, ...props } }) => (
            <Button
              {...props}
              className={className}
              key={id}
              size="xs"
              type="button"
              variant={secondaryActionVariant}
            />
          ))}
          {secondaryActionProps ? (
            <Button
              {...secondaryActionRest}
              className={secondaryActionClassName}
              size="xs"
              type="button"
              variant={secondaryActionVariant}
            />
          ) : null}
          {hasVisibleToastAction(toast.actionProps) ? (
            <Toast.Action
              className={cn(buttonVariants({ size: "xs", variant: actionVariant }), "shrink-0")}
              data-slot="toast-action"
            >
              {toast.actionProps?.children}
            </Toast.Action>
          ) : null}
        </div>
      ) : null}
    </>
  );
}

type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

interface ToastProviderProps extends Toast.Provider.Props {
  position?: ToastPosition;
}

function ToastProvider({ children, position = "bottom-right", ...props }: ToastProviderProps) {
  return (
    <Toast.Provider toastManager={toastManager} {...props}>
      {children}
      <Toasts position={position} />
    </Toast.Provider>
  );
}

function Toasts({ position }: { position: ToastPosition }) {
  const { toasts } = Toast.useToastManager<AgentToastData>();
  const isTop = position.startsWith("top");

  let frontmostHeight = 0;
  let offsetY = 0;
  const items = toasts.map((toast, idx) => {
    const height =
      typeof toast.height === "number" && Number.isFinite(toast.height) && toast.height > 0
        ? toast.height
        : 0;
    if (idx === 0) frontmostHeight = height;
    const item = { toast, visibleIndex: idx, offsetY };
    offsetY += height;
    return item;
  });

  return (
    <Toast.Portal data-slot="toast-portal">
      <Toast.Viewport
        className={cn(
          "fixed z-100 mx-auto flex w-[calc(100%-var(--toast-inset)*2)] max-w-90 [--toast-header-offset:52px] [--toast-inset:--spacing(4)] sm:[--toast-inset:--spacing(8)]",
          "data-[position*=top]:top-[calc(var(--toast-inset)+var(--toast-header-offset))]",
          "data-[position*=bottom]:bottom-(--toast-inset)",
          "data-[position*=left]:left-(--toast-inset)",
          "data-[position*=right]:right-(--toast-inset)",
          "data-[position*=center]:-translate-x-1/2 data-[position*=center]:left-1/2",
        )}
        data-position={position}
        data-slot="toast-viewport"
        style={{ "--toast-frontmost-height": `${frontmostHeight}px` } as CSSProperties}
      >
        {items.map(({ toast, visibleIndex, offsetY: itemOffsetY }) => {
          const hideCollapsedContent = items.length > 1 && visibleIndex > 0;
          const stackedActionLayout =
            hasVisibleToastAction(toast.actionProps) && toast.data?.actionLayout === "stacked-end";
          const hasTrailingControls =
            (toast.type === "error" &&
              typeof toast.description === "string" &&
              !toast.data?.hideCopyButton) ||
            hasVisibleToastAction(toast.actionProps) ||
            (toast.data?.additionalActions?.length ?? 0) > 0 ||
            toast.data?.secondaryActionProps !== undefined;
          const inlineContentEndPad = hasTrailingControls ? "pr-6" : "pr-10";

          return (
            <Toast.Root
              className={cn(
                "dropdown-glass absolute z-[calc(9999-var(--toast-index))] w-full overflow-visible select-none rounded-lg text-popover-foreground shadow-xl shadow-black/25 [transition:transform_.5s_cubic-bezier(.22,1,.36,1),opacity_.5s,height_.15s]",
                "data-[position*=right]:right-0 data-[position*=right]:left-auto",
                "data-[position*=left]:right-auto data-[position*=left]:left-0",
                "data-[position*=center]:right-0 data-[position*=center]:left-0",
                "data-[position*=top]:top-0 data-[position*=top]:bottom-auto data-[position*=top]:origin-top",
                "data-[position*=bottom]:top-auto data-[position*=bottom]:bottom-0 data-[position*=bottom]:origin-bottom",
                "after:absolute after:left-0 after:h-[calc(var(--toast-gap)+1px)] after:w-full",
                "data-[position*=top]:after:top-full",
                "data-[position*=bottom]:after:bottom-full",
                visibleIndex > 0
                  ? "not-data-expanded:[--toast-calc-height:var(--toast-frontmost-height)] data-expanded:[--toast-calc-height:max(var(--toast-frontmost-height,var(--toast-height)),var(--toast-height))]"
                  : "[--toast-calc-height:max(var(--toast-frontmost-height,var(--toast-height)),var(--toast-height))]",
                "[--toast-gap:--spacing(3)] [--toast-peek:--spacing(3)] [--toast-scale:calc(max(0,1-(var(--toast-index)*.1)))] [--toast-shrink:calc(1-var(--toast-scale))]",
                visibleIndex > 0
                  ? "not-data-expanded:h-(--toast-calc-height) data-expanded:h-auto"
                  : "h-auto",
                "data-[position*=top]:[--toast-calc-offset-y:calc(var(--toast-offset-y)+var(--toast-index)*var(--toast-gap)+var(--toast-swipe-movement-y))]",
                "data-[position*=bottom]:[--toast-calc-offset-y:calc(var(--toast-offset-y)*-1+var(--toast-index)*var(--toast-gap)*-1+var(--toast-swipe-movement-y))]",
                "data-[position*=top]:transform-[translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)+(var(--toast-index)*var(--toast-peek))+(var(--toast-shrink)*var(--toast-calc-height))))_scale(var(--toast-scale))]",
                "data-[position*=bottom]:transform-[translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)-(var(--toast-index)*var(--toast-peek))-(var(--toast-shrink)*var(--toast-calc-height))))_scale(var(--toast-scale))]",
                "data-limited:opacity-0",
                "data-position:data-expanded:transform-[translateX(var(--toast-swipe-movement-x))_translateY(var(--toast-calc-offset-y))]",
                "data-[position*=top]:data-starting-style:transform-[translateY(calc(-100%-var(--toast-inset)))]",
                "data-[position*=bottom]:data-starting-style:transform-[translateY(calc(100%+var(--toast-inset)))]",
                "data-[position*=top]:data-[position*=right]:data-starting-style:transform-[translateX(calc(100%+var(--toast-inset)))_translateY(var(--toast-calc-offset-y))]",
                "data-ending-style:opacity-0",
                "data-ending-style:not-data-limited:not-data-swipe-direction:transform-[translateY(calc(100%+var(--toast-inset)))]",
                "data-[position*=top]:data-[position*=right]:data-ending-style:not-data-limited:not-data-swipe-direction:transform-[translateX(calc(100%+var(--toast-inset)))_translateY(var(--toast-calc-offset-y))]",
                "data-ending-style:data-[swipe-direction=left]:transform-[translateX(calc(var(--toast-swipe-movement-x)-100%-var(--toast-inset)))_translateY(var(--toast-calc-offset-y))]",
                "data-ending-style:data-[swipe-direction=right]:transform-[translateX(calc(var(--toast-swipe-movement-x)+100%+var(--toast-inset)))_translateY(var(--toast-calc-offset-y))]",
                "data-ending-style:data-[swipe-direction=up]:transform-[translateY(calc(var(--toast-swipe-movement-y)-100%-var(--toast-inset)))]",
                "data-ending-style:data-[swipe-direction=down]:transform-[translateY(calc(var(--toast-swipe-movement-y)+100%+var(--toast-inset)))]",
              )}
              data-position={position}
              key={toast.id}
              style={
                {
                  "--toast-index": visibleIndex,
                  "--toast-offset-y": `${itemOffsetY}px`,
                } as CSSProperties
              }
              swipeDirection={
                position.includes("center")
                  ? [isTop ? "up" : "down"]
                  : position.includes("left")
                    ? ["left", isTop ? "up" : "down"]
                    : ["right", isTop ? "up" : "down"]
              }
              toast={toast}
            >
              <div className={toastCornerDismissClass}>
                <button
                  aria-label="Dismiss notification"
                  className={toastCornerOrbClass}
                  data-slot="toast-close"
                  onClick={() =>
                    handleToastDismissClick(toastManager, toast.id, toast.data?.onClose)
                  }
                  type="button"
                >
                  <XIcon className="size-3" strokeWidth={2.25} />
                </button>
              </div>
              <Toast.Content
                className={cn(
                  "pointer-events-auto min-h-0 overflow-y-visible pl-3.5 text-sm transition-opacity duration-250 [overflow-x:clip] data-expanded:opacity-100",
                  stackedActionLayout
                    ? "flex flex-col gap-2 py-2.5 pr-3.5"
                    : cn("py-3", "flex items-center justify-between gap-1.5", inlineContentEndPad),
                  hideCollapsedContent &&
                    "not-data-expanded:pointer-events-none not-data-expanded:opacity-0",
                )}
              >
                <ToastBodyContent toast={toast} />
              </Toast.Content>
            </Toast.Root>
          );
        })}
      </Toast.Viewport>
    </Toast.Portal>
  );
}

function AnchoredToastProvider({ children, ...props }: Toast.Provider.Props) {
  return (
    <Toast.Provider toastManager={anchoredToastManager} {...props}>
      {children}
      <AnchoredToasts />
    </Toast.Provider>
  );
}

function AnchoredToasts() {
  const { toasts } = Toast.useToastManager<AgentToastData>();

  return (
    <Toast.Portal data-slot="toast-portal-anchored">
      <Toast.Viewport className="outline-none" data-slot="toast-viewport-anchored">
        {toasts.map((toast) => {
          const tooltipStyle = toast.data?.tooltipStyle ?? false;
          const positionerProps = toast.positionerProps;
          if (!positionerProps?.anchor) return null;

          return (
            <Toast.Positioner
              className="z-100 max-w-[min(--spacing(64),var(--available-width))]"
              data-slot="toast-positioner"
              key={toast.id}
              sideOffset={positionerProps.sideOffset ?? 4}
              toast={toast}
            >
              <Toast.Root
                className={cn(
                  "dropdown-glass relative overflow-visible text-balance text-popover-foreground text-xs shadow-xl shadow-black/25 transition-[scale,opacity] data-ending-style:scale-98 data-starting-style:scale-98 data-ending-style:opacity-0 data-starting-style:opacity-0",
                  tooltipStyle ? "rounded-md" : "rounded-lg",
                )}
                data-slot="toast-popup"
                toast={toast}
              >
                {tooltipStyle ? (
                  <Toast.Content className="pointer-events-auto px-2 py-1">
                    <Toast.Title data-slot="toast-title" />
                  </Toast.Content>
                ) : (
                  <>
                    <div className={toastCornerDismissClass}>
                      <button
                        aria-label="Dismiss notification"
                        className={toastCornerOrbClass}
                        data-slot="toast-close"
                        onClick={() =>
                          handleToastDismissClick(
                            anchoredToastManager,
                            toast.id,
                            toast.data?.onClose,
                          )
                        }
                        type="button"
                      >
                        <XIcon className="size-3" strokeWidth={2.25} />
                      </button>
                    </div>
                    <Toast.Content className="pointer-events-auto flex items-center justify-between gap-1.5 py-3 pr-10 pl-3.5 text-sm">
                      <ToastBodyContent toast={toast} />
                    </Toast.Content>
                  </>
                )}
              </Toast.Root>
            </Toast.Positioner>
          );
        })}
      </Toast.Viewport>
    </Toast.Portal>
  );
}

export { ToastProvider, AnchoredToastProvider, toastManager, anchoredToastManager };
