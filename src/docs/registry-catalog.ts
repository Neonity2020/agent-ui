import t3ThemeCssRaw from "@/styles/t3-theme.css?raw";
import utilsTsRaw from "@/lib/utils.ts?raw";

import alertDialogRaw from "@/components/ui/alert-dialog.tsx?raw";
import alertRaw from "@/components/ui/alert.tsx?raw";
import autocompleteRaw from "@/components/ui/autocomplete.tsx?raw";
import badgeRaw from "@/components/ui/badge.tsx?raw";
import buttonRaw from "@/components/ui/button.tsx?raw";
import checkboxRaw from "@/components/ui/checkbox.tsx?raw";
import collapsibleRaw from "@/components/ui/collapsible.tsx?raw";
import commandRaw from "@/components/ui/command.tsx?raw";
import dialogStylesRaw from "@/components/ui/dialog-styles.ts?raw";
import dialogRaw from "@/components/ui/dialog.tsx?raw";
import emptyRaw from "@/components/ui/empty.tsx?raw";
import inputGroupRaw from "@/components/ui/input-group.tsx?raw";
import inputRaw from "@/components/ui/input.tsx?raw";
import kbdRaw from "@/components/ui/kbd.tsx?raw";
import labelRaw from "@/components/ui/label.tsx?raw";
import menuRaw from "@/components/ui/menu.tsx?raw";
import popoverRaw from "@/components/ui/popover.tsx?raw";
import radioGroupRaw from "@/components/ui/radio-group.tsx?raw";
import scrollAreaRaw from "@/components/ui/scroll-area.tsx?raw";
import selectRaw from "@/components/ui/select.tsx?raw";
import separatorRaw from "@/components/ui/separator.tsx?raw";
import skeletonRaw from "@/components/ui/skeleton.tsx?raw";
import spinnerRaw from "@/components/ui/spinner.tsx?raw";
import switchRaw from "@/components/ui/switch.tsx?raw";
import textareaRaw from "@/components/ui/textarea.tsx?raw";
import toastRaw from "@/components/ui/toast.tsx?raw";
import toggleGroupRaw from "@/components/ui/toggle-group.tsx?raw";
import toggleRaw from "@/components/ui/toggle.tsx?raw";
import tooltipRaw from "@/components/ui/tooltip.tsx?raw";

import animatedHeightRaw from "@/components/agent/animated-height.tsx?raw";
import changedFilesCardRaw from "@/components/agent/changed-files-card.tsx?raw";
import composerBannerRaw from "@/components/agent/composer-banner.tsx?raw";
import composerSurfaceRaw from "@/components/agent/composer-surface.tsx?raw";
import composerTasksBadgeRaw from "@/components/agent/composer-tasks-badge.tsx?raw";
import connectionStatusDotRaw from "@/components/agent/connection-status-dot.tsx?raw";
import contextWindowMeterRaw from "@/components/agent/context-window-meter.tsx?raw";
import diffStatLabelRaw from "@/components/agent/diff-stat-label.tsx?raw";
import inlineChipRaw from "@/components/agent/inline-chip.tsx?raw";
import modelListRowRaw from "@/components/agent/model-list-row.tsx?raw";
import pendingApprovalPanelRaw from "@/components/agent/pending-approval-panel.tsx?raw";
import proposedPlanCardRaw from "@/components/agent/proposed-plan-card.tsx?raw";
import threadErrorBannerRaw from "@/components/agent/thread-error-banner.tsx?raw";

export type CatalogCategory = "theme" | "agent" | "ui";

export interface CatalogFile {
  readonly path: string;
  readonly code: string;
}

export interface CatalogItem {
  readonly name: string;
  readonly title: string;
  readonly category: CatalogCategory;
  readonly description: string;
  readonly dependencies?: ReadonlyArray<string>;
  readonly registryDependencies?: ReadonlyArray<string>;
  readonly files: ReadonlyArray<CatalogFile>;
}

export const REGISTRY_ITEMS: ReadonlyArray<CatalogItem> = [
  {
    name: "t3-theme",
    title: "T3 Theme & Glass Utilities",
    category: "theme",
    description:
      "t3code Tailwind v4 design tokens, contrast variables, glassmorphism utilities, stepped animations, and 6 theme presets.",
    dependencies: ["class-variance-authority", "tailwind-merge"],
    files: [
      { path: "src/styles/t3-theme.css", code: t3ThemeCssRaw },
      { path: "src/lib/utils.ts", code: utilsTsRaw },
    ],
  },
  // Agent Domain Components
  {
    name: "composer-surface",
    title: "Composer Surface",
    category: "agent",
    description:
      "Glassmorphic AI chat composer shell with seamless notched bottom context strip.",
    files: [{ path: "src/components/agent/composer-surface.tsx", code: composerSurfaceRaw }],
  },
  {
    name: "composer-banner",
    title: "Composer Banner",
    category: "agent",
    description:
      "Composable attached or floating glass banner system with severity variants, peek stack, and scroll container.",
    dependencies: ["@base-ui/react", "lucide-react"],
    registryDependencies: ["button", "scroll-area"],
    files: [{ path: "src/components/agent/composer-banner.tsx", code: composerBannerRaw }],
  },
  {
    name: "composer-tasks-badge",
    title: "Composer Tasks Badge",
    category: "agent",
    description:
      "Segmented agent task progress pill and expandable step-by-step execution checklist.",
    dependencies: ["lucide-react"],
    registryDependencies: ["composer-banner"],
    files: [{ path: "src/components/agent/composer-tasks-badge.tsx", code: composerTasksBadgeRaw }],
  },
  {
    name: "pending-approval-panel",
    title: "Pending Approval Panel",
    category: "agent",
    description:
      "Interactive tool/command execution approval banner with queue count, mono payload preview, and decision actions.",
    dependencies: ["lucide-react"],
    registryDependencies: ["composer-banner", "button", "tooltip"],
    files: [
      { path: "src/components/agent/pending-approval-panel.tsx", code: pendingApprovalPanelRaw },
    ],
  },
  {
    name: "context-window-meter",
    title: "Context Window Meter",
    category: "agent",
    description:
      "Circular SVG token-usage ring with hover popover breakdown, overload threshold alert, and compact action.",
    dependencies: ["lucide-react"],
    registryDependencies: ["button", "popover"],
    files: [{ path: "src/components/agent/context-window-meter.tsx", code: contextWindowMeterRaw }],
  },
  {
    name: "changed-files-card",
    title: "Changed Files Card",
    category: "agent",
    description:
      "Container-responsive turn diff summary card with compact file pills and compacted directory tree.",
    dependencies: ["lucide-react"],
    registryDependencies: ["button", "tooltip", "diff-stat-label"],
    files: [{ path: "src/components/agent/changed-files-card.tsx", code: changedFilesCardRaw }],
  },
  {
    name: "proposed-plan-card",
    title: "Proposed Plan Card",
    category: "agent",
    description:
      "Collapsible agent implementation plan card with markdown preview, copy/export menu, and approval CTA.",
    dependencies: ["lucide-react"],
    registryDependencies: ["badge", "button", "menu"],
    files: [{ path: "src/components/agent/proposed-plan-card.tsx", code: proposedPlanCardRaw }],
  },
  {
    name: "connection-status-dot",
    title: "Connection Status & Thread Pill",
    category: "agent",
    description:
      "Duty-cycled status ping dot and semantic thread lifecycle pill indicators.",
    registryDependencies: ["tooltip"],
    files: [
      { path: "src/components/agent/connection-status-dot.tsx", code: connectionStatusDotRaw },
    ],
  },
  {
    name: "diff-stat-label",
    title: "Diff Stat Label",
    category: "agent",
    description: "Tabular monospace additions/deletions counter with compact k/m formatting.",
    files: [{ path: "src/components/agent/diff-stat-label.tsx", code: diffStatLabelRaw }],
  },
  {
    name: "inline-chip",
    title: "Inline Chip",
    category: "agent",
    description:
      "Em-scaled inline file, terminal, and skill mention pills for prompts and messages.",
    dependencies: ["lucide-react"],
    files: [{ path: "src/components/agent/inline-chip.tsx", code: inlineChipRaw }],
  },
  {
    name: "thread-error-banner",
    title: "Thread Error Banner",
    category: "agent",
    description:
      "Glassmorphic thread-level error alert with line-clamped full-message tooltip and dismiss control.",
    dependencies: ["lucide-react"],
    registryDependencies: ["alert", "button", "tooltip"],
    files: [{ path: "src/components/agent/thread-error-banner.tsx", code: threadErrorBannerRaw }],
  },
  {
    name: "model-list-row",
    title: "Model List Row",
    category: "agent",
    description:
      "Rich model picker row with provider badge, context length, reasoning/new tags, jump keycap, and favorite toggle.",
    dependencies: ["lucide-react"],
    registryDependencies: ["badge", "button", "kbd", "tooltip"],
    files: [{ path: "src/components/agent/model-list-row.tsx", code: modelListRowRaw }],
  },
  {
    name: "animated-height",
    title: "Animated Height",
    category: "agent",
    description:
      "ResizeObserver-driven smooth height wrapper for expanding composer drawers and banners.",
    files: [{ path: "src/components/agent/animated-height.tsx", code: animatedHeightRaw }],
  },
  // Base UI Primitives
  {
    name: "button",
    title: "Button",
    category: "ui",
    description:
      "Base UI button with t3code tactile bevels, glass variant, micro/compact/icon sizes, and render prop.",
    dependencies: ["@base-ui/react", "class-variance-authority"],
    files: [{ path: "src/components/ui/button.tsx", code: buttonRaw }],
  },
  {
    name: "badge",
    title: "Badge",
    category: "ui",
    description: "Compact semantic badge supporting status variants and control/sm/lg sizes.",
    dependencies: ["@base-ui/react", "class-variance-authority"],
    files: [{ path: "src/components/ui/badge.tsx", code: badgeRaw }],
  },
  {
    name: "alert",
    title: "Alert",
    category: "ui",
    description:
      "Slot-aware alert container with error/warning/info/success tints and glass utility support.",
    dependencies: ["class-variance-authority"],
    files: [{ path: "src/components/ui/alert.tsx", code: alertRaw }],
  },
  {
    name: "input",
    title: "Input",
    category: "ui",
    description: "Base UI text input with compact/sm/default/lg sizes and tactile focus rings.",
    dependencies: ["@base-ui/react"],
    files: [{ path: "src/components/ui/input.tsx", code: inputRaw }],
  },
  {
    name: "textarea",
    title: "Textarea",
    category: "ui",
    description: "Auto-sizing Base UI textarea with field-sizing-content and tactile bevels.",
    dependencies: ["@base-ui/react"],
    files: [{ path: "src/components/ui/textarea.tsx", code: textareaRaw }],
  },
  {
    name: "input-group",
    title: "Input Group",
    category: "ui",
    description: "Composite input container with inline/block addons and unified focus rings.",
    dependencies: ["class-variance-authority"],
    registryDependencies: ["input", "textarea"],
    files: [{ path: "src/components/ui/input-group.tsx", code: inputGroupRaw }],
  },
  {
    name: "kbd",
    title: "Kbd",
    category: "ui",
    description: "Keyboard shortcut keycap and keycap group.",
    files: [{ path: "src/components/ui/kbd.tsx", code: kbdRaw }],
  },
  {
    name: "label",
    title: "Label",
    category: "ui",
    description: "Base UI render-prop form label.",
    dependencies: ["@base-ui/react"],
    files: [{ path: "src/components/ui/label.tsx", code: labelRaw }],
  },
  {
    name: "separator",
    title: "Separator",
    category: "ui",
    description: "Base UI horizontal and vertical divider.",
    dependencies: ["@base-ui/react"],
    files: [{ path: "src/components/ui/separator.tsx", code: separatorRaw }],
  },
  {
    name: "skeleton",
    title: "Skeleton",
    category: "ui",
    description: "Duty-cycled stepped breathing loading placeholder.",
    files: [{ path: "src/components/ui/skeleton.tsx", code: skeletonRaw }],
  },
  {
    name: "spinner",
    title: "Spinner",
    category: "ui",
    description: "Accessible loading indicator powered by Lucide.",
    dependencies: ["lucide-react"],
    files: [{ path: "src/components/ui/spinner.tsx", code: spinnerRaw }],
  },
  {
    name: "switch",
    title: "Switch",
    category: "ui",
    description: "Base UI toggle switch with elastic thumb squishing transition.",
    dependencies: ["@base-ui/react"],
    files: [{ path: "src/components/ui/switch.tsx", code: switchRaw }],
  },
  {
    name: "checkbox",
    title: "Checkbox",
    category: "ui",
    description: "Base UI checkbox supporting checked and indeterminate states.",
    dependencies: ["@base-ui/react"],
    files: [{ path: "src/components/ui/checkbox.tsx", code: checkboxRaw }],
  },
  {
    name: "radio-group",
    title: "Radio Group",
    category: "ui",
    description: "Base UI radio group and radio item primitives.",
    dependencies: ["@base-ui/react"],
    files: [{ path: "src/components/ui/radio-group.tsx", code: radioGroupRaw }],
  },
  {
    name: "toggle",
    title: "Toggle",
    category: "ui",
    description: "Base UI toggle button with default, ghost, outline, and segmented variants.",
    dependencies: ["@base-ui/react", "class-variance-authority"],
    files: [{ path: "src/components/ui/toggle.tsx", code: toggleRaw }],
  },
  {
    name: "toggle-group",
    title: "Toggle Group",
    category: "ui",
    description: "Segmented and connected toggle group built on Base UI.",
    dependencies: ["@base-ui/react", "class-variance-authority"],
    registryDependencies: ["toggle", "separator"],
    files: [{ path: "src/components/ui/toggle-group.tsx", code: toggleGroupRaw }],
  },
  {
    name: "collapsible",
    title: "Collapsible",
    category: "ui",
    description: "Smooth height-animated Base UI disclosure panel.",
    dependencies: ["@base-ui/react"],
    files: [{ path: "src/components/ui/collapsible.tsx", code: collapsibleRaw }],
  },
  {
    name: "scroll-area",
    title: "Scroll Area",
    category: "ui",
    description: "Base UI custom scrollbar area with optional edge scroll fade masks.",
    dependencies: ["@base-ui/react"],
    files: [{ path: "src/components/ui/scroll-area.tsx", code: scrollAreaRaw }],
  },
  {
    name: "tooltip",
    title: "Tooltip",
    category: "ui",
    description: "Base UI tooltip with viewport transition and default/glass variants.",
    dependencies: ["@base-ui/react"],
    files: [{ path: "src/components/ui/tooltip.tsx", code: tooltipRaw }],
  },
  {
    name: "popover",
    title: "Popover",
    category: "ui",
    description: "Glassmorphic Base UI popover with tooltip-style compact mode.",
    dependencies: ["@base-ui/react"],
    files: [{ path: "src/components/ui/popover.tsx", code: popoverRaw }],
  },
  {
    name: "dialog",
    title: "Dialog",
    category: "ui",
    description:
      "Nested-aware glassmorphic Base UI dialog with mobile sheet support and scrollable panel.",
    dependencies: ["@base-ui/react", "lucide-react"],
    registryDependencies: ["button", "scroll-area"],
    files: [
      { path: "src/components/ui/dialog.tsx", code: dialogRaw },
      { path: "src/components/ui/dialog-styles.ts", code: dialogStylesRaw },
    ],
  },
  {
    name: "alert-dialog",
    title: "Alert Dialog",
    category: "ui",
    description: "Confirmation modal dialog with glass backdrop and nested scaling.",
    dependencies: ["@base-ui/react"],
    files: [
      { path: "src/components/ui/alert-dialog.tsx", code: alertDialogRaw },
      { path: "src/components/ui/dialog-styles.ts", code: dialogStylesRaw },
    ],
  },
  {
    name: "menu",
    title: "Menu",
    category: "ui",
    description:
      "Glassmorphic Base UI dropdown menu with checkbox, switch, radio, and submenu support.",
    dependencies: ["@base-ui/react", "lucide-react"],
    files: [{ path: "src/components/ui/menu.tsx", code: menuRaw }],
  },
  {
    name: "select",
    title: "Select",
    category: "ui",
    description:
      "Glassmorphic Base UI select dropdown with scroll arrows and ghost/default triggers.",
    dependencies: ["@base-ui/react", "class-variance-authority", "lucide-react"],
    files: [{ path: "src/components/ui/select.tsx", code: selectRaw }],
  },
  {
    name: "empty",
    title: "Empty",
    category: "ui",
    description: "Empty state layout with layered fanned icon cards.",
    dependencies: ["class-variance-authority"],
    files: [{ path: "src/components/ui/empty.tsx", code: emptyRaw }],
  },
  {
    name: "autocomplete",
    title: "Autocomplete",
    category: "ui",
    description: "Base UI filterable autocomplete input and scrollable popup list.",
    dependencies: ["@base-ui/react", "lucide-react"],
    registryDependencies: ["input", "scroll-area"],
    files: [{ path: "src/components/ui/autocomplete.tsx", code: autocompleteRaw }],
  },
  {
    name: "command",
    title: "Command",
    category: "ui",
    description: "Command palette dialog built on Base UI Dialog and Autocomplete.",
    dependencies: ["@base-ui/react", "lucide-react"],
    registryDependencies: ["autocomplete", "button"],
    files: [
      { path: "src/components/ui/command.tsx", code: commandRaw },
      { path: "src/components/ui/dialog-styles.ts", code: dialogStylesRaw },
    ],
  },
  {
    name: "toast",
    title: "Toast",
    category: "ui",
    description:
      "Stacked glassmorphic notifications with corner dismiss orb, expandable details, and anchored toasts.",
    dependencies: ["@base-ui/react", "lucide-react"],
    registryDependencies: ["button", "tooltip"],
    files: [{ path: "src/components/ui/toast.tsx", code: toastRaw }],
  },
];

export const REGISTRY_ITEM_MAP = new Map(REGISTRY_ITEMS.map((item) => [item.name, item]));
