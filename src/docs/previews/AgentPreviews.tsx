import {
  ArrowUpIcon,
  BotIcon,
  CpuIcon,
  GitBranchIcon,
  PaperclipIcon,
  PlusIcon,
  RefreshCwIcon,
  RotateCcwIcon,
  SparklesIcon,
  Trash2Icon,
} from "lucide-react";
import { type ReactNode, useState } from "react";

import { AnimatedHeight } from "@/components/agent/animated-height";
import { ChangedFilesCard, type ChangedFileEntry } from "@/components/agent/changed-files-card";
import { ComposerBanner, type ComposerBannerVariant } from "@/components/agent/composer-banner";
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
import {
  FileTagChip,
  InlineChip,
  SkillChip,
  TerminalContextChip,
} from "@/components/agent/inline-chip";
import { ModelListRow, type AgentModelOption } from "@/components/agent/model-list-row";
import {
  PendingApprovalPanel,
  type PendingApprovalItem,
} from "@/components/agent/pending-approval-panel";
import { ProposedPlanCard } from "@/components/agent/proposed-plan-card";
import { ThreadErrorBanner } from "@/components/agent/thread-error-banner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { toastManager } from "@/components/ui/toast";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

function T3ThemePreview() {
  const tokens = [
    { name: "background", cls: "bg-background text-foreground border" },
    { name: "card", cls: "bg-card text-card-foreground border" },
    { name: "surface-raised", cls: "bg-surface-raised text-foreground border" },
    { name: "primary", cls: "bg-primary text-primary-foreground" },
    { name: "secondary", cls: "bg-secondary text-secondary-foreground border" },
    { name: "muted", cls: "bg-muted text-muted-foreground border" },
    { name: "accent", cls: "bg-accent text-accent-foreground border" },
    { name: "destructive", cls: "bg-destructive text-white" },
    { name: "info", cls: "bg-info text-white" },
    { name: "success", cls: "bg-success text-white" },
    { name: "warning", cls: "bg-warning text-white" },
    { name: "popover", cls: "bg-popover text-popover-foreground border" },
  ];

  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
        {tokens.map((t) => (
          <div
            key={t.name}
            className={`flex h-16 flex-col justify-between rounded-xl p-2.5 text-xs font-medium ${t.cls}`}
          >
            <span>{t.name}</span>
            <span className="font-mono text-[10px] opacity-70">--{t.name}</span>
          </div>
        ))}
      </div>

      <div className="relative overflow-hidden rounded-2xl border p-6">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,color-mix(in_oklab,var(--primary)_22%,transparent),transparent_55%),radial-gradient(circle_at_80%_75%,color-mix(in_oklab,var(--info)_20%,transparent),transparent_50%)]"
        />
        <div className="relative grid gap-3 sm:grid-cols-3">
          <div className="surface-glass rounded-xl border p-3.5 text-xs">
            <div className="font-semibold">.surface-glass</div>
            <p className="mt-1 text-muted-foreground">Frosted glass backdrop + saturation.</p>
          </div>
          <div className="dropdown-glass rounded-xl p-3.5 text-xs shadow-lg">
            <div className="font-semibold">.dropdown-glass</div>
            <p className="mt-1 text-muted-foreground">Popover & menu elevation layer.</p>
          </div>
          <div className="alert-glass rounded-xl border border-warning/30 p-3.5 text-xs" data-variant="warning">
            <div className="font-semibold">.alert-glass</div>
            <p className="mt-1 text-muted-foreground">Tinted semantic glass surface.</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-6 rounded-xl border bg-card/50 p-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="relative flex size-3 items-center justify-center">
            <span className="animate-status-ping absolute inline-flex size-full rounded-full bg-warning/70" />
            <span className="relative size-2 rounded-full bg-warning" />
          </span>
          <span className="font-mono text-muted-foreground">animate-status-ping</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="animate-status-pulse size-2 rounded-full bg-sky-500" />
          <span className="font-mono text-muted-foreground">animate-status-pulse</span>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-20" />
          <span className="font-mono text-muted-foreground">animate-skeleton</span>
        </div>
      </div>
    </div>
  );
}

function ComposerSurfacePreview() {
  const [showContextStrip, setShowContextStrip] = useState(true);
  const [prompt, setPrompt] = useState("Refactor the token parser to stream partial tool calls");

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground">
        <span>Bottom context strip</span>
        <Switch checked={showContextStrip} onCheckedChange={setShowContextStrip} size="sm" />
      </div>

      <ComposerSurface.Shell contextStrip={showContextStrip}>
        <ComposerSurface.Host>
          <ComposerSurface.Main>
            <div className="flex flex-col gap-2 p-3">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={2}
                placeholder="Ask anything or describe a task..."
                className="w-full resize-none bg-transparent text-sm text-foreground outline-none placeholder:text-placeholder"
              />
              <div className="flex items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-1.5">
                  <Button size="icon-xs" variant="ghost-muted" aria-label="Attach file">
                    <PaperclipIcon />
                  </Button>
                  <FileTagChip label="parser.ts" scale="composer" />
                  <SkillChip name="review" />
                </div>
                <Button
                  size="icon-sm"
                  onClick={() =>
                    toastManager.add({
                      type: "info",
                      title: "Prompt submitted",
                      description: prompt || "(empty prompt)",
                    })
                  }
                >
                  <ArrowUpIcon />
                </Button>
              </div>
            </div>
          </ComposerSurface.Main>
        </ComposerSurface.Host>
        {showContextStrip ? (
          <ComposerSurface.ContextStrip>
            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
              <GitBranchIcon className="size-3" />
              <span className="font-mono">feat/streaming-tools</span>
            </span>
            <span className="ml-auto text-[11px] text-muted-foreground">
              Local workspace · 2 files attached
            </span>
          </ComposerSurface.ContextStrip>
        ) : null}
      </ComposerSurface.Shell>
    </div>
  );
}

function ComposerBannerPreview() {
  const [variant, setVariant] = useState<ComposerBannerVariant>("default");
  const [showPeek, setShowPeek] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ToggleGroup
          variant="segmented"
          value={[variant]}
          onValueChange={(vals) => {
            const next = vals[0] as ComposerBannerVariant | undefined;
            if (next) {
              setVariant(next);
              setDismissed(false);
            }
          }}
        >
          <ToggleGroupItem value="default">Default</ToggleGroupItem>
          <ToggleGroupItem value="warning">Warning</ToggleGroupItem>
          <ToggleGroupItem value="error">Error</ToggleGroupItem>
        </ToggleGroup>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Show peek stack</span>
          <Switch checked={showPeek} onCheckedChange={setShowPeek} size="sm" />
          {dismissed ? (
            <Button size="xs" variant="outline" onClick={() => setDismissed(false)}>
              Restore
            </Button>
          ) : null}
        </div>
      </div>

      <ComposerSurface.Shell>
        {!dismissed ? (
          <ComposerBanner.Dock>
            <ComposerBanner.Column className="relative">
              {showPeek ? <ComposerBanner.Peek variant={variant} aria-label="Show queued notice" /> : null}
              <ComposerBanner.Attachment>
                <ComposerBanner.Root variant={variant} placement="attached">
                  <ComposerBanner.Row>
                    <ComposerBanner.Icon>
                      <SparklesIcon />
                    </ComposerBanner.Icon>
                    <ComposerBanner.Content>
                      <span className="font-medium text-foreground">
                        {variant === "error"
                          ? "Rate limit reached on fallback provider"
                          : variant === "warning"
                            ? "Worktree has uncommitted changes on main"
                            : "Connected to local runtime v0.38"}
                      </span>
                    </ComposerBanner.Content>
                    <ComposerBanner.Actions>
                      <ComposerBanner.Dismiss
                        aria-label="Dismiss banner"
                        onClick={() => setDismissed(true)}
                      />
                    </ComposerBanner.Actions>
                  </ComposerBanner.Row>
                </ComposerBanner.Root>
              </ComposerBanner.Attachment>
            </ComposerBanner.Column>
          </ComposerBanner.Dock>
        ) : null}

        <ComposerSurface.Host>
          <ComposerSurface.Main>
            <div className="flex items-center justify-between px-4 py-3 text-sm text-muted-foreground">
              <span>Attached banners seamlessly share the composer outline.</span>
              <Button size="xs" variant="secondary">
                Send
              </Button>
            </div>
          </ComposerSurface.Main>
        </ComposerSurface.Host>
      </ComposerSurface.Shell>
    </div>
  );
}

const INITIAL_TASK_STEPS: ComposerTaskStep[] = [
  { step: "Inspect component registry schema", status: "completed", durationMs: 1420 },
  { step: "Port Base UI glass primitives", status: "completed", durationMs: 3810 },
  { step: "Distill Agent composer & approval panels", status: "inProgress" },
  { step: "Build static registry JSON artifacts", status: "pending" },
];

function ComposerTasksBadgePreview() {
  const [expanded, setExpanded] = useState(true);
  const [steps, setSteps] = useState<ComposerTaskStep[]>(INITIAL_TASK_STEPS);

  const completedCount = steps.filter((s) => s.status === "completed").length;
  const activeStep = steps.find((s) => s.status === "inProgress") ?? steps.at(-1)!;

  const advanceStep = () => {
    setSteps((prev) => {
      const idx = prev.findIndex((s) => s.status === "inProgress");
      if (idx === -1) return INITIAL_TASK_STEPS;
      return prev.map((s, i) => {
        if (i === idx) return { ...s, status: "completed", durationMs: 1850 };
        if (i === idx + 1) return { ...s, status: "inProgress" };
        return s;
      });
    });
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-end gap-2">
        <Button size="xs" variant="outline" onClick={advanceStep}>
          Advance step
        </Button>
        <Button size="xs" variant="ghost-muted" onClick={() => setSteps(INITIAL_TASK_STEPS)}>
          <RotateCcwIcon />
          Reset
        </Button>
      </div>

      <ComposerSurface.Shell>
        {expanded ? (
          <ComposerTasksDrawer
            onCollapse={() => setExpanded(false)}
            progress={{
              step: activeStep.step,
              completedSteps: completedCount,
              totalSteps: steps.length,
            }}
            steps={steps}
          />
        ) : (
          <ComposerBanner.Dock>
            <ComposerTasksBadge
              expanded={false}
              onToggle={() => setExpanded(true)}
              progress={{
                step: activeStep.step,
                completedSteps: completedCount,
                totalSteps: steps.length,
              }}
              steps={steps}
            />
          </ComposerBanner.Dock>
        )}
        <ComposerSurface.Host>
          <ComposerSurface.Main>
            <div className="px-4 py-3 text-sm text-muted-foreground">
              Click the tasks shoulder tab or header above to toggle the checklist drawer.
            </div>
          </ComposerSurface.Main>
        </ComposerSurface.Host>
      </ComposerSurface.Shell>
    </div>
  );
}

const SAMPLE_APPROVALS: PendingApprovalItem[] = [
  {
    id: "apr-1",
    requestKind: "command",
    detail: "pnpm test --filter @agent-ui/registry",
  },
  {
    id: "apr-2",
    requestKind: "file-change",
    detail: "src/styles/t3-theme.css (+42 / -8)",
  },
  {
    id: "apr-3",
    requestKind: "mcp-elicitation",
    appName: "GitHub MCP",
    detail: "create_pull_request on zion/agent-ui",
    options: [
      { decision: "decline", label: "Deny" },
      {
        decision: "acceptForSession",
        label: "Always Allow",
        warning: "Allows creating PRs on your behalf for the rest of this session.",
      },
      { decision: "accept", label: "Approve" },
    ],
  },
];

function PendingApprovalPanelPreview() {
  const [queue, setQueue] = useState<PendingApprovalItem[]>(SAMPLE_APPROVALS);
  const current = queue[0];

  const handleDecision = (id: string, decision: string) => {
    toastManager.add({
      type: decision === "decline" ? "warning" : "success",
      title: `Approval ${decision}`,
      description: `Handled request ${id}`,
    });
    setQueue((prev) => prev.slice(1));
  };

  return (
    <div className="w-full space-y-3">
      {current ? (
        <PendingApprovalPanel
          approval={current}
          pendingCount={queue.length}
          placement="floating"
          onDecision={handleDecision}
        />
      ) : (
        <div className="flex items-center justify-between rounded-xl border bg-card px-4 py-3 text-sm">
          <span className="text-muted-foreground">All queued approvals resolved.</span>
          <Button size="xs" variant="outline" onClick={() => setQueue(SAMPLE_APPROVALS)}>
            <RefreshCwIcon />
            Refill Queue
          </Button>
        </div>
      )}
    </div>
  );
}

function ContextWindowMeterPreview() {
  const [usedTokens, setUsedTokens] = useState(142_000);
  const maxTokens = 200_000;

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="flex items-center gap-4 rounded-xl border bg-card px-4 py-2.5">
        <span className="text-xs text-muted-foreground">Hover or click meter:</span>
        <ContextWindowMeter
          usage={{
            usedTokens,
            maxTokens,
            totalProcessedTokens: usedTokens * 2.4,
            compactsAutomatically: true,
            autoCompactThreshold: 185_000,
          }}
          modelDisplayName="Claude Sonnet 4.6"
          onCompact={() => {
            setUsedTokens(48_000);
            toastManager.add({
              type: "success",
              title: "Context compacted",
              description: "Summarized history down to 48k tokens.",
            });
          }}
        />
        <span className="font-mono text-xs tabular-nums text-foreground">
          {Math.round((usedTokens / maxTokens) * 100)}% ({Math.round(usedTokens / 1000)}k / 200k)
        </span>
      </div>

      <div className="flex w-full max-w-sm items-center gap-3 text-xs">
        <span className="text-muted-foreground">Usage</span>
        <input
          type="range"
          min={10_000}
          max={198_000}
          step={2_000}
          value={usedTokens}
          onChange={(e) => setUsedTokens(Number(e.target.value))}
          className="flex-1 accent-[var(--primary)]"
        />
        <Button size="xs" variant="outline" onClick={() => setUsedTokens(188_000)}>
          Test &gt;90%
        </Button>
      </div>
    </div>
  );
}

const SAMPLE_CHANGED_FILES: ChangedFileEntry[] = [
  { path: "src/styles/t3-theme.css", additions: 148, deletions: 12 },
  { path: "src/components/ui/button.tsx", additions: 64, deletions: 4 },
  { path: "src/components/agent/composer-surface.tsx", additions: 88, deletions: 15 },
  { path: "src/components/agent/context-window-meter.tsx", additions: 112, deletions: 0 },
  { path: "registry.json", additions: 34, deletions: 2 },
];

function ChangedFilesCardPreview() {
  return (
    <div className="w-full max-w-2xl">
      <ChangedFilesCard
        files={SAMPLE_CHANGED_FILES}
        defaultExpanded
        onOpenDiff={(filePath) =>
          toastManager.add({
            type: "info",
            title: "Open diff requested",
            description: filePath ?? "All files",
          })
        }
      />
    </div>
  );
}

const SAMPLE_PLAN_MD = `# Refactor Agent Streaming Pipeline

Isolate token parsing from React state updates so high-frequency deltas never stall the composer.

## Implementation Steps
1. Move SSE framing into \`src/lib/stream-decoder.ts\` with \`TextDecoder\` buffering.
2. Batch timeline item commits via \`requestAnimationFrame\` when delta rate exceeds 60Hz.
3. Surface \`ContextWindowMeter\` snapshots at turn boundaries without re-rendering message bodies.

\`\`\`ts
export function flushStreamBatch(deltas: StreamDelta[]): void {
  // Commit coalesced deltas atomically
}
\`\`\`

- Keep \`PendingApprovalPanel\` interactive during active streams
- Emit \`ThreadErrorBanner\` only for non-recoverable transport errors`;

function ProposedPlanCardPreview() {
  return (
    <div className="w-full max-w-2xl">
      <ProposedPlanCard
        planMarkdown={SAMPLE_PLAN_MD}
        onEdit={() =>
          toastManager.add({ type: "info", title: "Editing plan", description: "Opened plan editor." })
        }
        onApprove={() =>
          toastManager.add({
            type: "success",
            title: "Implementing plan",
            description: "Sent plan prompt to agent thread.",
          })
        }
      />
    </div>
  );
}

function ConnectionStatusDotPreview() {
  const phases: ConnectionPhase[] = [
    "connected",
    "connecting",
    "reconnecting",
    "error",
    "disconnected",
  ];
  const threadStatuses: ThreadStatusPhase[] = [
    "pending-approval",
    "awaiting-input",
    "working",
    "connecting",
    "plan-ready",
    "monitoring",
    "completed",
  ];

  return (
    <div className="w-full space-y-5">
      <div>
        <div className="mb-2 text-xs font-medium text-muted-foreground">Connection Phases</div>
        <div className="flex flex-wrap items-center gap-4 rounded-xl border bg-card p-4">
          {phases.map((phase) => (
            <div key={phase} className="flex items-center gap-2 text-xs">
              <ConnectionStatusDot phase={phase} tooltipText={`Connection: ${phase}`} />
              <span className="capitalize">{phase}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-2 text-xs font-medium text-muted-foreground">Thread Status Pills</div>
        <div className="flex flex-wrap items-center gap-4 rounded-xl border bg-card p-4">
          {threadStatuses.map((status) => (
            <ThreadStatusPill key={status} status={status} />
          ))}
        </div>
      </div>
    </div>
  );
}

function DiffStatLabelPreview() {
  return (
    <div className="flex flex-wrap items-center gap-6 rounded-xl border bg-card p-5 text-xs">
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">Inline:</span>
        <DiffStatLabel additions={148} deletions={23} layout="inline" />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">Parentheses:</span>
        <DiffStatLabel additions={42} deletions={9} layout="inline" showParentheses />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">Compact k/m:</span>
        <DiffStatLabel additions={12400} deletions={3400} layout="inline" />
      </div>
    </div>
  );
}

function InlineChipPreview() {
  const [chips, setChips] = useState([
    { id: "1", kind: "file" as const, label: "composer-surface.tsx" },
    { id: "2", kind: "terminal" as const, label: "pnpm typecheck (exit 1)" },
    { id: "3", kind: "skill" as const, label: "frontend-design" },
  ]);

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-wrap items-center gap-2 rounded-xl border bg-card p-4">
        {chips.map((chip) => {
          const onDismiss = () => setChips((prev) => prev.filter((c) => c.id !== chip.id));
          if (chip.kind === "file") {
            return <FileTagChip key={chip.id} label={chip.label} onDismiss={onDismiss} />;
          }
          if (chip.kind === "terminal") {
            return <TerminalContextChip key={chip.id} label={chip.label} onDismiss={onDismiss} />;
          }
          return <SkillChip key={chip.id} name={chip.label} onDismiss={onDismiss} />;
        })}
        <InlineChip icon={<BotIcon />} scale="chat">
          agent-ui/subagent
        </InlineChip>
        {chips.length < 3 ? (
          <Button
            size="xs"
            variant="outline"
            onClick={() =>
              setChips([
                { id: "1", kind: "file", label: "composer-surface.tsx" },
                { id: "2", kind: "terminal", label: "pnpm typecheck (exit 1)" },
                { id: "3", kind: "skill", label: "frontend-design" },
              ])
            }
          >
            Restore chips
          </Button>
        ) : null}
      </div>
    </div>
  );
}

function ThreadErrorBannerPreview() {
  const [error, setError] = useState<string | null>(
    "Provider stream disconnected unexpectedly (HTTP 502 Bad Gateway from upstream runner on wss://localhost:4310/rpc). Retry or switch to another model instance.",
  );

  return (
    <div className="w-full space-y-3">
      {error ? (
        <ThreadErrorBanner error={error} onDismiss={() => setError(null)} />
      ) : (
        <div className="flex justify-center">
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              setError(
                "Provider stream disconnected unexpectedly (HTTP 502 Bad Gateway from upstream runner).",
              )
            }
          >
            Trigger Thread Error Banner
          </Button>
        </div>
      )}
    </div>
  );
}

const SAMPLE_MODELS: AgentModelOption[] = [
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
    disabledReason: "API key not configured in local environment",
    unavailable: true,
    icon: <BotIcon />,
  },
];

function ModelListRowPreview() {
  const [selectedId, setSelectedId] = useState("claude-sonnet-4.6");
  const [favorites, setFavorites] = useState<Set<string>>(() => new Set(["claude-sonnet-4.6"]));

  return (
    <div className="w-full max-w-md rounded-xl border bg-popover p-1.5 shadow-sm">
      {SAMPLE_MODELS.map((model, idx) => (
        <ModelListRow
          key={model.id}
          model={model}
          isSelected={selectedId === model.id}
          isFavorite={favorites.has(model.id)}
          jumpLabel={`⌘${idx + 1}`}
          onSelect={(m) => setSelectedId(m.id)}
          onToggleFavorite={(m) =>
            setFavorites((prev) => {
              const next = new Set(prev);
              if (next.has(m.id)) next.delete(m.id);
              else next.add(m.id);
              return next;
            })
          }
        />
      ))}
    </div>
  );
}

function AnimatedHeightPreview() {
  const [items, setItems] = useState(["Initialize workspace context", "Load design tokens"]);

  return (
    <div className="w-full max-w-md space-y-3">
      <div className="flex items-center gap-2">
        <Button
          size="xs"
          variant="outline"
          onClick={() => setItems((prev) => [...prev, `Step ${prev.length + 1}: Verify delta`])}
        >
          <PlusIcon />
          Add item
        </Button>
        <Button
          size="xs"
          variant="outline"
          disabled={items.length <= 1}
          onClick={() => setItems((prev) => prev.slice(0, -1))}
        >
          <Trash2Icon />
          Remove item
        </Button>
        <Badge variant="secondary" className="ml-auto">
          {items.length} items
        </Badge>
      </div>

      <div className="overflow-hidden rounded-xl border bg-card">
        <AnimatedHeight>
          <div className="divide-y p-2">
            {items.map((item, idx) => (
              <div key={idx} className="px-2 py-2 text-xs text-foreground">
                {item}
              </div>
            ))}
          </div>
        </AnimatedHeight>
      </div>
    </div>
  );
}

export const AGENT_PREVIEW_MAP: Record<string, () => ReactNode> = {
  "t3-theme": () => <T3ThemePreview />,
  "composer-surface": () => <ComposerSurfacePreview />,
  "composer-banner": () => <ComposerBannerPreview />,
  "composer-tasks-badge": () => <ComposerTasksBadgePreview />,
  "pending-approval-panel": () => <PendingApprovalPanelPreview />,
  "context-window-meter": () => <ContextWindowMeterPreview />,
  "changed-files-card": () => <ChangedFilesCardPreview />,
  "proposed-plan-card": () => <ProposedPlanCardPreview />,
  "connection-status-dot": () => <ConnectionStatusDotPreview />,
  "diff-stat-label": () => <DiffStatLabelPreview />,
  "inline-chip": () => <InlineChipPreview />,
  "thread-error-banner": () => <ThreadErrorBannerPreview />,
  "model-list-row": () => <ModelListRowPreview />,
  "animated-height": () => <AnimatedHeightPreview />,
};
