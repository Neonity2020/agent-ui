import {
  ArrowRightIcon,
  ArrowUpIcon,
  BotIcon,
  CheckIcon,
  ChevronDownIcon,
  CopyIcon,
  CpuIcon,
  GitBranchIcon,
  LayersIcon,
  MoonIcon,
  PaletteIcon,
  PaperclipIcon,
  PlayIcon,
  RefreshCwIcon,
  SearchIcon,
  SparklesIcon,
  SunIcon,
  TerminalIcon,
} from "lucide-react";
import { useState } from "react";

import { ChangedFilesCard, type ChangedFileEntry } from "@/components/agent/changed-files-card";
import { ComposerBanner } from "@/components/agent/composer-banner";
import { ComposerSurface } from "@/components/agent/composer-surface";
import {
  ComposerTasksBadge,
  ComposerTasksDrawer,
  type ComposerTaskStep,
} from "@/components/agent/composer-tasks-badge";
import {
  ConnectionStatusDot,
  ThreadStatusPill,
  type ConnectionPhase,
  type ThreadStatusPhase,
} from "@/components/agent/connection-status-dot";
import { ContextWindowMeter } from "@/components/agent/context-window-meter";
import { DiffStatLabel } from "@/components/agent/diff-stat-label";
import { FileTagChip, SkillChip, TerminalContextChip } from "@/components/agent/inline-chip";
import { ModelListRow, type AgentModelOption } from "@/components/agent/model-list-row";
import {
  PendingApprovalPanel,
  type ApprovalDecision,
  type PendingApprovalItem,
} from "@/components/agent/pending-approval-panel";
import { ProposedPlanCard } from "@/components/agent/proposed-plan-card";
import { ThreadErrorBanner } from "@/components/agent/thread-error-banner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Menu,
  MenuPopup,
  MenuRadioGroup,
  MenuRadioItem,
  MenuTrigger,
} from "@/components/ui/menu";
import { Popover, PopoverPopup, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { toastManager } from "@/components/ui/toast";
import { REGISTRY_ITEMS } from "@/docs/registry-catalog";
import { THEME_PRESETS } from "@/docs/theme-presets";
import { cn } from "@/lib/utils";

const HERO_TASKS: ComposerTaskStep[] = [
  { step: "Extract Base UI glass primitives", status: "completed", durationMs: 1180 },
  { step: "Compose attached banner & context strip", status: "completed", durationMs: 2450 },
  { step: "Verify registry.json static output", status: "inProgress" },
  { step: "Ship interactive Landing Page", status: "pending" },
];

const HERO_APPROVALS: PendingApprovalItem[] = [
  {
    id: "hero-apr-1",
    requestKind: "command",
    detail: "pnpm registry:build && pnpm typecheck",
  },
  {
    id: "hero-apr-2",
    requestKind: "mcp-elicitation",
    appName: "GitHub MCP",
    detail: "open_pull_request on zion/agent-ui",
    options: [
      { decision: "decline", label: "Deny" },
      {
        decision: "acceptForSession",
        label: "Always Allow",
        warning: "Allows opening PRs for the rest of this session.",
      },
      { decision: "accept", label: "Approve" },
    ],
  },
];

const BENTO_MODELS: AgentModelOption[] = [
  {
    id: "claude-sonnet-4.6",
    name: "Claude Sonnet 4.6",
    provider: "Anthropic",
    contextLabel: "200k ctx",
    supportsReasoning: true,
    isNew: true,
    icon: <SparklesIcon />,
  },
  {
    id: "gpt-5.4-codex",
    name: "GPT-5.4 Codex",
    provider: "OpenAI",
    contextLabel: "256k ctx",
    supportsReasoning: true,
    icon: <CpuIcon />,
  },
  {
    id: "gemini-2.5-pro",
    name: "Gemini 2.5 Pro",
    provider: "Google",
    contextLabel: "1M ctx",
    icon: <BotIcon />,
  },
];

const BENTO_FILES: ChangedFileEntry[] = [
  { path: "src/styles/t3-theme.css", additions: 215, deletions: 14 },
  { path: "src/components/agent/composer-surface.tsx", additions: 99, deletions: 0 },
  { path: "src/components/agent/pending-approval-panel.tsx", additions: 118, deletions: 6 },
  { path: "src/components/ui/button.tsx", additions: 86, deletions: 2 },
  { path: "registry.json", additions: 312, deletions: 0 },
];

const BENTO_PLAN_MD = `# Decouple Agent Stream & Composer

Isolate tool-approval queues and context metrics into standalone Base UI primitives.

## Key Steps
1. Mount \`ComposerBanner.Dock\` seamlessly above \`ComposerSurface.Main\`.
2. Render \`ContextWindowMeter\` inside the composer toolbar with >90% warning threshold.
3. Export static JSON manifests via \`shadcn build\` for zero-friction CLI installs.`;

const CLI_INSTALL_CMD = "npx shadcn@latest add https://agent-ui.dev/r/t3-theme.json";

export interface LandingPageProps {
  isDark: boolean;
  onToggleDark: () => void;
  themeId: string;
  onSelectTheme: (id: string) => void;
  onOpenCommand: () => void;
  onNavigate: (route: string) => void;
}

export function LandingPage({
  isDark,
  onToggleDark,
  themeId,
  onSelectTheme,
  onOpenCommand,
  onNavigate,
}: LandingPageProps) {
  const [cliCopied, setCliCopied] = useState(false);

  // Hero stage interactive state
  const [heroTasksExpanded, setHeroTasksExpanded] = useState(false);
  const [heroApprovals, setHeroApprovals] = useState<PendingApprovalItem[]>(HERO_APPROVALS);
  const [heroPrompt, setHeroPrompt] = useState("");
  const [heroLastPrompt, setHeroLastPrompt] = useState(
    "Build a t3code-style Landing Page using our Base UI & Agent primitives.",
  );
  const [heroModelId, setHeroModelId] = useState("claude-sonnet-4.6");
  const [heroModelOpen, setHeroModelOpen] = useState(false);
  const [heroTokens, setHeroTokens] = useState(124_000);
  const [heroChips, setHeroChips] = useState<string[]>(["LandingPage.tsx", "t3-theme.css"]);

  // Bento interactive state
  const [bentoTokens, setBentoTokens] = useState(156_000);
  const [bentoModelId, setBentoModelId] = useState("claude-sonnet-4.6");
  const [bentoFavorites, setBentoFavorites] = useState<Set<string>>(
    () => new Set(["claude-sonnet-4.6"]),
  );
  const [bentoError, setBentoError] = useState<string | null>(
    "Worker stream interrupted (502 Bad Gateway). Click retry or switch provider.",
  );

  const agentComponents = REGISTRY_ITEMS.filter((item) => item.category === "agent");
  const uiComponents = REGISTRY_ITEMS.filter((item) => item.category === "ui");

  const activeHeroModel =
    BENTO_MODELS.find((m) => m.id === heroModelId) ?? BENTO_MODELS[0]!;
  const activeHeroApproval = heroApprovals[0];
  const heroStatus: ThreadStatusPhase = activeHeroApproval
    ? "pending-approval"
    : "plan-ready";

  const copyCli = () => {
    void navigator.clipboard?.writeText(CLI_INSTALL_CMD).then(() => {
      setCliCopied(true);
      toastManager.add({
        type: "success",
        title: "CLI command copied",
        description: CLI_INSTALL_CMD,
      });
      setTimeout(() => setCliCopied(false), 1600);
    });
  };

  const handleHeroDecision = (_id: string, decision: ApprovalDecision) => {
    setHeroApprovals((prev) => prev.slice(1));
    toastManager.add({
      type: decision === "decline" ? "warning" : "success",
      title: `Request ${decision === "decline" ? "denied" : "approved"}`,
    });
  };

  const handleHeroSend = () => {
    const trimmed = heroPrompt.trim();
    if (!trimmed) return;
    setHeroLastPrompt(trimmed);
    setHeroPrompt("");
    setHeroTokens((prev) => Math.min(194_000, prev + 12_000));
    toastManager.add({
      type: "info",
      title: `Dispatched to ${activeHeroModel.name}`,
      description: trimmed,
    });
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-dvh w-full bg-background text-foreground">
      {/* Sticky Glass Navbar */}
      <header className="surface-glass sticky top-0 z-30 border-b">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex cursor-pointer items-center gap-2.5 text-left"
            >
              <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
                <SparklesIcon className="size-4" />
              </span>
              <span className="text-sm font-semibold tracking-tight">agent-ui</span>
              <Badge variant="outline" size="sm" className="hidden sm:inline-flex">
                t3code
              </Badge>
            </button>

            <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
              <Button size="xs" variant="ghost-muted" onClick={() => onNavigate("overview")}>
                Docs
              </Button>
              <Button
                size="xs"
                variant="ghost-muted"
                onClick={() => onNavigate("composer-surface")}
              >
                Components
              </Button>
              <Button size="xs" variant="ghost-muted" onClick={() => onNavigate("playground")}>
                Playground
              </Button>
              <Button size="xs" variant="ghost-muted" onClick={() => scrollToSection("themes")}>
                Themes
              </Button>
            </nav>
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              size="xs"
              variant="outline"
              className="hidden gap-2 sm:inline-flex"
              onClick={onOpenCommand}
            >
              <SearchIcon className="size-3.5" />
              <span className="text-muted-foreground">Search 42 items...</span>
              <kbd className="rounded bg-muted px-1 font-sans text-[10px] text-muted-foreground">
                ⌘K
              </kbd>
            </Button>

            <Menu>
              <MenuTrigger
                render={
                  <Button size="xs" variant="outline" className="gap-1.5">
                    <PaletteIcon className="size-3.5" />
                    <span className="hidden sm:inline">
                      {THEME_PRESETS.find((t) => t.id === themeId)?.label ?? "Theme"}
                    </span>
                  </Button>
                }
              />
              <MenuPopup align="end" className="w-48">
                <MenuRadioGroup value={themeId} onValueChange={onSelectTheme}>
                  {THEME_PRESETS.map((preset) => (
                    <MenuRadioItem key={preset.id} value={preset.id}>
                      <span className="flex items-center gap-2">
                        <span className={cn("size-2.5 rounded-full", preset.swatch)} />
                        <span>{preset.label}</span>
                      </span>
                    </MenuRadioItem>
                  ))}
                </MenuRadioGroup>
              </MenuPopup>
            </Menu>

            <Button
              size="icon-sm"
              variant="outline"
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              onClick={onToggleDark}
            >
              {isDark ? <SunIcon /> : <MoonIcon />}
            </Button>

            <Button size="xs" onClick={() => onNavigate("overview")} className="ml-0.5">
              Browse Docs
              <ArrowRightIcon />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_55%_at_50%_0%,color-mix(in_oklab,var(--primary)_14%,transparent),transparent_70%),radial-gradient(ellipse_55%_45%_at_80%_25%,color-mix(in_oklab,var(--info)_10%,transparent),transparent_70%)]"
        />

        <div className="relative mx-auto max-w-6xl px-4 pt-14 pb-16 sm:px-6 sm:pt-20 sm:pb-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-5 flex flex-wrap items-center justify-center gap-2">
              <Badge variant="info">Base UI + Tailwind v4</Badge>
              <Badge variant="outline">42 Installable Items</Badge>
              <Badge variant="secondary">Distilled from t3code</Badge>
            </div>

            <h1 className="text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Build AI coding agent interfaces with{" "}
              <span className="text-primary">t3code</span> craft.
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              A shadcn/ui component registry featuring glassmorphic composers, tool-approval bars,
              context window meters, turn diff trees, and 28 Base UI primitives ready for your next
              agentic app.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" onClick={() => onNavigate("overview")}>
                <LayersIcon />
                Explore Components
              </Button>
              <Button size="lg" variant="glass" onClick={() => onNavigate("playground")}>
                <PlayIcon />
                Open Full Playground
              </Button>
            </div>

            <div className="mt-5 flex justify-center">
              <button
                type="button"
                onClick={copyCli}
                className="group inline-flex max-w-full cursor-pointer items-center gap-2.5 rounded-full border bg-card/80 px-4 py-1.5 font-mono text-xs text-muted-foreground shadow-xs transition-colors hover:border-primary/40 hover:text-foreground"
              >
                <TerminalIcon className="size-3.5 shrink-0 text-primary" />
                <span className="truncate">{CLI_INSTALL_CMD}</span>
                {cliCopied ? (
                  <CheckIcon className="size-3.5 shrink-0 text-success" />
                ) : (
                  <CopyIcon className="size-3.5 shrink-0 opacity-60 transition-opacity group-hover:opacity-100" />
                )}
              </button>
            </div>
          </div>

          {/* Live Interactive Hero Workbench Stage */}
          <div className="mx-auto mt-12 max-w-4xl">
            <div className="overflow-hidden rounded-[24px] border bg-card/65 shadow-[0_24px_70px_-30px_rgb(0_0_0/35%)] backdrop-blur-sm dark:shadow-[0_28px_80px_-28px_rgb(0_0_0/75%)]">
              {/* Mock Window Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b bg-background/60 px-4 py-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="hidden items-center gap-1.5 sm:flex" aria-hidden="true">
                    <span className="size-2.5 rounded-full bg-foreground/15" />
                    <span className="size-2.5 rounded-full bg-foreground/15" />
                    <span className="size-2.5 rounded-full bg-foreground/15" />
                  </div>
                  <Separator orientation="vertical" className="hidden h-3.5 sm:block" />
                  <ConnectionStatusDot
                    phase="connected"
                    tooltipText="Live interactive preview · local runtime"
                  />
                  <span className="font-mono text-xs font-medium text-foreground">
                    feat/landing-showcase
                  </span>
                  <ThreadStatusPill status={heroStatus} />
                </div>

                <div className="flex items-center gap-2">
                  <DiffStatLabel additions={830} deletions={22} layout="inline" className="text-xs" />
                  {heroApprovals.length === 0 ? (
                    <Button
                      size="micro"
                      variant="outline"
                      onClick={() => setHeroApprovals(HERO_APPROVALS)}
                    >
                      <RefreshCwIcon />
                      Refill approvals
                    </Button>
                  ) : null}
                </div>
              </div>

              {/* Interactive Thread Snippet + Docked Composer */}
              <div className="relative space-y-5 bg-[radial-gradient(circle_at_top,color-mix(in_oklab,var(--primary)_6%,transparent),transparent_65%)] px-4 pt-6 pb-5 sm:px-6">
                <div className="mx-auto flex max-w-3xl flex-col gap-3">
                  <div className="flex justify-end">
                    <div className="max-w-[85%] rounded-2xl border bg-message px-4 py-2.5 text-sm text-message-foreground">
                      <p>{heroLastPrompt}</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        <FileTagChip label="composer-surface.tsx" />
                        <TerminalContextChip label="pnpm shadcn build" />
                      </div>
                    </div>
                  </div>
                </div>

                <ComposerSurface.Shell contextStrip>
                  {heroTasksExpanded ? (
                    <ComposerTasksDrawer
                      onCollapse={() => setHeroTasksExpanded(false)}
                      progress={{
                        step: HERO_TASKS[2]!.step,
                        completedSteps: 2,
                        totalSteps: HERO_TASKS.length,
                      }}
                      steps={HERO_TASKS}
                    />
                  ) : (
                    <ComposerBanner.Dock>
                      <ComposerTasksBadge
                        expanded={false}
                        onToggle={() => setHeroTasksExpanded(true)}
                        progress={{
                          step: HERO_TASKS[2]!.step,
                          completedSteps: 2,
                          totalSteps: HERO_TASKS.length,
                        }}
                        steps={HERO_TASKS}
                      />
                    </ComposerBanner.Dock>
                  )}

                  {activeHeroApproval ? (
                    <ComposerBanner.Attachment>
                      <PendingApprovalPanel
                        approval={activeHeroApproval}
                        pendingCount={heroApprovals.length}
                        placement="attached"
                        onDecision={handleHeroDecision}
                      />
                    </ComposerBanner.Attachment>
                  ) : null}

                  <ComposerSurface.Host>
                    <ComposerSurface.Main>
                      <div className="flex flex-col gap-2 px-3.5 pt-3 pb-2.5">
                        {heroChips.length > 0 ? (
                          <div className="flex flex-wrap items-center gap-1.5">
                            {heroChips.map((chip) => (
                              <FileTagChip
                                key={chip}
                                label={chip}
                                scale="composer"
                                onDismiss={() =>
                                  setHeroChips((prev) => prev.filter((item) => item !== chip))
                                }
                              />
                            ))}
                            <SkillChip name="t3-ui" />
                          </div>
                        ) : null}

                        <textarea
                          value={heroPrompt}
                          onChange={(e) => setHeroPrompt(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleHeroSend();
                            }
                          }}
                          rows={2}
                          placeholder="Try typing a prompt, clicking Approve, or toggling Tasks above..."
                          className="w-full resize-none bg-transparent text-sm text-foreground outline-none placeholder:text-placeholder"
                        />

                        <div className="flex items-center justify-between gap-2 pt-1">
                          <div className="flex items-center gap-1">
                            <Button
                              size="icon-xs"
                              variant="ghost-muted"
                              aria-label="Attach context file"
                              onClick={() =>
                                setHeroChips((prev) =>
                                  prev.includes("registry.json") ? prev : [...prev, "registry.json"],
                                )
                              }
                            >
                              <PaperclipIcon />
                            </Button>

                            <Popover open={heroModelOpen} onOpenChange={setHeroModelOpen}>
                              <PopoverTrigger
                                render={
                                  <Button
                                    size="xs"
                                    variant="ghost-muted"
                                    className="gap-1.5 font-normal"
                                  />
                                }
                              >
                                <SparklesIcon className="size-3.5" />
                                <span>{activeHeroModel.name}</span>
                                <ChevronDownIcon className="size-3 opacity-60" />
                              </PopoverTrigger>
                              <PopoverPopup
                                align="start"
                                side="top"
                                className="w-80 p-1.5"
                                viewportClassName="p-0"
                              >
                                {BENTO_MODELS.map((model, idx) => (
                                  <ModelListRow
                                    key={model.id}
                                    model={model}
                                    isSelected={model.id === heroModelId}
                                    jumpLabel={`⌘${idx + 1}`}
                                    onSelect={(m) => {
                                      setHeroModelId(m.id);
                                      setHeroModelOpen(false);
                                    }}
                                  />
                                ))}
                              </PopoverPopup>
                            </Popover>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <ContextWindowMeter
                              usage={{
                                usedTokens: heroTokens,
                                maxTokens: 200_000,
                                totalProcessedTokens: heroTokens * 1.9,
                                compactsAutomatically: true,
                                autoCompactThreshold: 185_000,
                              }}
                              modelDisplayName={activeHeroModel.name}
                              onCompact={() => {
                                setHeroTokens(46_000);
                                toastManager.add({
                                  type: "success",
                                  title: "Context compacted",
                                  description: "Summarized context down to 46k tokens.",
                                });
                              }}
                            />
                            <Button
                              size="icon-sm"
                              disabled={!heroPrompt.trim()}
                              onClick={handleHeroSend}
                              aria-label="Send prompt"
                            >
                              <ArrowUpIcon />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </ComposerSurface.Main>
                  </ComposerSurface.Host>

                  <ComposerSurface.ContextStrip>
                    <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                      <GitBranchIcon className="size-3" />
                      <span className="font-mono">feat/landing-showcase</span>
                    </span>
                    <span className="ml-auto text-[11px] text-muted-foreground">
                      Interactive demo · Real registry components
                    </span>
                  </ComposerSurface.ContextStrip>
                </ComposerSurface.Shell>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Feature Grid */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <Badge variant="outline">Interactive Bento</Badge>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Distilled from real agent workflows
            </h2>
            <p className="max-w-xl text-sm text-muted-foreground">
              Every card below renders the actual registry components. Hover, toggle, expand, or
              click through to inspect source and CLI installation.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => onNavigate("playground")}>
            Launch Full Workspace
            <ArrowRightIcon />
          </Button>
        </div>

        <div className="grid gap-5 lg:grid-cols-12">
          {/* Card 1: Turn Diff Tree */}
          <div className="flex flex-col justify-between rounded-2xl border bg-card/55 p-5 lg:col-span-7">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold">Turn Diff Tree & Stats</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Compacted nested folder trees, container-query previews, and tabular diff counts.
                </p>
              </div>
              <Button
                size="xs"
                variant="ghost-muted"
                onClick={() => onNavigate("changed-files-card")}
              >
                Inspect
                <ArrowRightIcon />
              </Button>
            </div>
            <ChangedFilesCard
              files={BENTO_FILES}
              defaultExpanded
              onOpenDiff={(path) =>
                toastManager.add({
                  type: "info",
                  title: "Open file diff",
                  description: path ?? "All files",
                })
              }
            />
          </div>

          {/* Card 2: Context Meter & Model Picker */}
          <div className="flex flex-col justify-between rounded-2xl border bg-card/55 p-5 lg:col-span-5">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold">Context Meter & Model Picker</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Token budget ring with &gt;90% warning state plus favorite-aware model rows.
                </p>
              </div>
              <Button
                size="xs"
                variant="ghost-muted"
                onClick={() => onNavigate("context-window-meter")}
              >
                Inspect
                <ArrowRightIcon />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-xl border bg-background/70 px-3.5 py-2.5">
                <ContextWindowMeter
                  usage={{
                    usedTokens: bentoTokens,
                    maxTokens: 200_000,
                    totalProcessedTokens: bentoTokens * 2.1,
                    compactsAutomatically: true,
                    autoCompactThreshold: 185_000,
                  }}
                  modelDisplayName="Claude Sonnet 4.6"
                  onCompact={() => setBentoTokens(44_000)}
                />
                <input
                  type="range"
                  min={20_000}
                  max={198_000}
                  step={4_000}
                  value={bentoTokens}
                  onChange={(e) => setBentoTokens(Number(e.target.value))}
                  aria-label="Context token slider"
                  className="flex-1 accent-[var(--primary)]"
                />
                <span className="font-mono text-xs tabular-nums text-muted-foreground">
                  {Math.round(bentoTokens / 1000)}k/200k
                </span>
              </div>

              <div className="rounded-xl border bg-popover/90 p-1.5 shadow-xs">
                {BENTO_MODELS.map((model, idx) => (
                  <ModelListRow
                    key={model.id}
                    model={model}
                    isSelected={model.id === bentoModelId}
                    isFavorite={bentoFavorites.has(model.id)}
                    jumpLabel={`⌘${idx + 1}`}
                    onSelect={(m) => setBentoModelId(m.id)}
                    onToggleFavorite={(m) =>
                      setBentoFavorites((prev) => {
                        const next = new Set(prev);
                        if (next.has(m.id)) next.delete(m.id);
                        else next.add(m.id);
                        return next;
                      })
                    }
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Card 3: Proposed Plans */}
          <div className="flex flex-col justify-between rounded-2xl border bg-card/55 p-5 lg:col-span-6">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold">Proposed Plan Cards</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Built-in lightweight markdown preview with copy, export .md, and implement CTA.
                </p>
              </div>
              <Button
                size="xs"
                variant="ghost-muted"
                onClick={() => onNavigate("proposed-plan-card")}
              >
                Inspect
                <ArrowRightIcon />
              </Button>
            </div>
            <ProposedPlanCard
              planMarkdown={BENTO_PLAN_MD}
              onApprove={() =>
                toastManager.add({
                  type: "success",
                  title: "Plan approved",
                  description: "Starting implementation turn.",
                })
              }
            />
          </div>

          {/* Card 4: Live Telemetry, Glass Alerts & Toasts */}
          <div className="flex flex-col justify-between rounded-2xl border bg-card/55 p-5 lg:col-span-6">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold">Telemetry, Glass Alerts & Toasts</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Duty-cycled stepped animations, dismissible error banners, and stacked toasts.
                </p>
              </div>
              <Button
                size="xs"
                variant="ghost-muted"
                onClick={() => onNavigate("connection-status-dot")}
              >
                Inspect
                <ArrowRightIcon />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border bg-background/70 p-4 space-y-3">
                <div className="flex flex-wrap items-center gap-4">
                  {(["connected", "reconnecting", "error"] as ConnectionPhase[]).map((phase) => (
                    <div key={phase} className="flex items-center gap-1.5 text-xs">
                      <ConnectionStatusDot phase={phase} tooltipText={`Daemon: ${phase}`} />
                      <span className="capitalize text-muted-foreground">{phase}</span>
                    </div>
                  ))}
                </div>
                <Separator />
                <div className="flex flex-wrap items-center gap-3">
                  {(
                    ["working", "pending-approval", "plan-ready", "completed"] as ThreadStatusPhase[]
                  ).map((status) => (
                    <ThreadStatusPill key={status} status={status} />
                  ))}
                </div>
              </div>

              {bentoError ? (
                <ThreadErrorBanner error={bentoError} onDismiss={() => setBentoError(null)} />
              ) : (
                <div className="flex items-center justify-between rounded-xl border border-dashed px-4 py-3 text-xs text-muted-foreground">
                  <span>Error banner dismissed.</span>
                  <Button
                    size="xs"
                    variant="outline"
                    onClick={() =>
                      setBentoError(
                        "Worker stream interrupted (502 Bad Gateway). Click retry or switch provider.",
                      )
                    }
                  >
                    Restore Banner
                  </Button>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  size="xs"
                  variant="outline"
                  onClick={() =>
                    toastManager.add({
                      type: "success",
                      title: "Checkpoint saved",
                      description: "Snapshot recorded before applying agent edits.",
                    })
                  }
                >
                  Trigger Glass Toast
                </Button>
                <Button size="xs" variant="ghost-muted" onClick={() => onNavigate("toast")}>
                  Toast Docs
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live 6-Theme Showcase */}
      <section id="themes" className="border-y bg-card/35">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-2">
              <Badge variant="info">OKLCH Design System</Badge>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                6 curated t3code themes, Light & Dark
              </h2>
              <p className="max-w-xl text-sm text-muted-foreground">
                Click any palette below to switch the entire site live—contrast tokens and glass
                surfaces update automatically.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={onToggleDark}>
                {isDark ? <SunIcon /> : <MoonIcon />}
                {isDark ? "Switch to Light" : "Switch to Dark"}
              </Button>
              <Button size="sm" variant="ghost-muted" onClick={() => onNavigate("t3-theme")}>
                Inspect Tokens
                <ArrowRightIcon />
              </Button>
            </div>
          </div>

          <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            {THEME_PRESETS.map((preset) => {
              const active = themeId === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => onSelectTheme(preset.id)}
                  className={cn(
                    "group flex cursor-pointer flex-col justify-between rounded-2xl border bg-background/80 p-4 text-left transition-all hover:border-primary/50",
                    active && "border-primary ring-2 ring-ring/25",
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className={cn("size-3.5 rounded-full shadow-xs", preset.swatch)} />
                      <span className="text-sm font-semibold text-foreground">{preset.label}</span>
                    </div>
                    {active ? (
                      <Badge variant="info" size="sm">
                        Active
                      </Badge>
                    ) : null}
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {preset.description}
                  </p>
                  <div className={cn("mt-3.5 flex h-9 items-center gap-2 rounded-lg border px-2.5", preset.previewSurface)}>
                    <span className={cn("h-2 w-10 rounded-full", preset.swatch)} />
                    <span className="h-2 w-14 rounded-full bg-foreground/15" />
                    <span className="ml-auto h-2 w-6 rounded-full bg-foreground/10" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Component Directory + 3-Step Quickstart */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 space-y-14">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              step: "01",
              title: "Install t3-theme",
              desc: "Drop in Tailwind v4 glass utilities, OKLCH tokens, and contrast variables.",
              cmd: "npx shadcn@latest add .../r/t3-theme.json",
            },
            {
              step: "02",
              title: "Add Base UI & Agent items",
              desc: "Pick only what your app needs—each component resolves its own dependencies.",
              cmd: "npx shadcn@latest add .../r/composer-surface.json",
            },
            {
              step: "03",
              title: "Compose & customize",
              desc: "Zero backend lock-in. Wire props to your own agent runtime or streaming SDK.",
              cmd: "pnpm dev",
            },
          ].map((card) => (
            <div key={card.step} className="rounded-2xl border bg-card/50 p-5">
              <div className="font-mono text-xs font-semibold text-primary">{card.step}</div>
              <h3 className="mt-1.5 text-sm font-semibold text-foreground">{card.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{card.desc}</p>
              <code className="mt-3 block truncate rounded-lg border bg-background px-2.5 py-1.5 font-mono text-[11px] text-foreground">
                {card.cmd}
              </code>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-semibold">Full Registry Index</h2>
              <p className="text-xs text-muted-foreground">
                Jump directly into any of the {agentComponents.length} Agent components or{" "}
                {uiComponents.length} Base UI primitives.
              </p>
            </div>
            <Button size="xs" variant="outline" onClick={() => onNavigate("overview")}>
              View All in Docs
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <div className="mb-2 text-xs font-medium text-muted-foreground">
                Agent Domain ({agentComponents.length})
              </div>
              <div className="flex flex-wrap gap-2">
                {agentComponents.map((item) => (
                  <Button
                    key={item.name}
                    size="xs"
                    variant="outline"
                    onClick={() => onNavigate(item.name)}
                    className="font-normal"
                  >
                    {item.title}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-2 text-xs font-medium text-muted-foreground">
                Base UI Primitives ({uiComponents.length})
              </div>
              <div className="flex flex-wrap gap-1.5">
                {uiComponents.map((item) => (
                  <Button
                    key={item.name}
                    size="xs"
                    variant="secondary"
                    onClick={() => onNavigate(item.name)}
                    className="font-normal"
                  >
                    {item.title}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/30">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-4 py-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:px-6">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">agent-ui</span>
            <span>·</span>
            <span>Built on Base UI, Tailwind CSS v4, and t3code patterns.</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate("overview")}
              className="cursor-pointer hover:text-foreground"
            >
              Overview
            </button>
            <button
              type="button"
              onClick={() => onNavigate("playground")}
              className="cursor-pointer hover:text-foreground"
            >
              Playground
            </button>
            <button
              type="button"
              onClick={() => onNavigate("t3-theme")}
              className="cursor-pointer hover:text-foreground"
            >
              T3 Theme
            </button>
            <button
              type="button"
              onClick={() => onNavigate("button")}
              className="cursor-pointer hover:text-foreground"
            >
              Button
            </button>
            <button
              type="button"
              onClick={() => onNavigate("composer-surface")}
              className="cursor-pointer hover:text-foreground"
            >
              Composer Surface
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
