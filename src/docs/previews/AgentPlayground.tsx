import {
  ArrowUpIcon,
  BotIcon,
  ChevronDownIcon,
  CpuIcon,
  GitBranchIcon,
  PaperclipIcon,
  RotateCcwIcon,
  SparklesIcon,
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
  type ThreadStatusPhase,
} from "@/components/agent/connection-status-dot";
import { ContextWindowMeter } from "@/components/agent/context-window-meter";
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
import { Popover, PopoverPopup, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toastManager } from "@/components/ui/toast";

const PLAYGROUND_MODELS: AgentModelOption[] = [
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

const INITIAL_APPROVALS: PendingApprovalItem[] = [
  {
    id: "pg-apr-1",
    requestKind: "command",
    detail: "pnpm registry:build && pnpm typecheck",
  },
  {
    id: "pg-apr-2",
    requestKind: "file-change",
    detail: "src/components/agent/composer-surface.tsx",
  },
];

const INITIAL_TASKS: ComposerTaskStep[] = [
  { step: "Extract t3-theme.css glass tokens", status: "completed", durationMs: 1200 },
  { step: "Port Base UI primitives to @/components/ui", status: "completed", durationMs: 4100 },
  { step: "Verify registry.json build output", status: "inProgress" },
  { step: "Run final production Vite bundle", status: "pending" },
];

const PLAYGROUND_FILES: ChangedFileEntry[] = [
  { path: "src/styles/t3-theme.css", additions: 215, deletions: 18 },
  { path: "src/components/ui/button.tsx", additions: 88, deletions: 4 },
  { path: "src/components/agent/composer-surface.tsx", additions: 96, deletions: 0 },
  { path: "src/components/agent/context-window-meter.tsx", additions: 145, deletions: 6 },
  { path: "registry.json", additions: 310, deletions: 0 },
];

const PLAYGROUND_PLAN = `# Build t3code-style shadcn/ui Registry

Compose Base UI primitives with glassmorphic agent workflow components.

## Architecture
1. Port Tailwind v4 semantic tokens and \`surface-glass\` / \`dropdown-glass\` utilities into \`src/styles/t3-theme.css\`.
2. Ship zero-backend-dependency components under \`src/components/agent/\` and \`src/components/ui/\`.
3. Compile static installable registry JSONs into \`public/r/\` via \`shadcn build\`.`;

export function AgentPlayground() {
  const [tasksExpanded, setTasksExpanded] = useState(false);
  const [approvals, setApprovals] = useState<PendingApprovalItem[]>(INITIAL_APPROVALS);
  const [threadError, setThreadError] = useState<string | null>(null);
  const [selectedModelId, setSelectedModelId] = useState("claude-sonnet-4.6");
  const [favorites, setFavorites] = useState<Set<string>>(() => new Set(["claude-sonnet-4.6"]));
  const [usedTokens, setUsedTokens] = useState(118_000);
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<string[]>([
    "Audit our composer components and build a reusable shadcn registry collection.",
  ]);
  const [attachedChips, setAttachedChips] = useState<string[]>([
    "src/styles/t3-theme.css",
    "registry.json",
  ]);
  const [modelPopoverOpen, setModelPopoverOpen] = useState(false);

  const activeApproval = approvals[0];
  const selectedModel =
    PLAYGROUND_MODELS.find((m) => m.id === selectedModelId) ?? PLAYGROUND_MODELS[0]!;
  const threadStatus: ThreadStatusPhase = activeApproval
    ? "pending-approval"
    : messages.length > 1
      ? "completed"
      : "working";

  const handleDecision = (_id: string, decision: ApprovalDecision) => {
    setApprovals((prev) => prev.slice(1));
    toastManager.add({
      type: decision === "decline" ? "warning" : "success",
      title: `Tool request ${decision === "decline" ? "denied" : "approved"}`,
    });
  };

  const handleSend = () => {
    const trimmed = prompt.trim();
    if (!trimmed) return;
    setMessages((prev) => [...prev, trimmed]);
    setPrompt("");
    setUsedTokens((prev) => Math.min(196_000, prev + 14_000));
    toastManager.add({
      type: "info",
      title: `Dispatched to ${selectedModel.name}`,
      description: trimmed,
    });
  };

  const resetPlayground = () => {
    setApprovals(INITIAL_APPROVALS);
    setThreadError(null);
    setUsedTokens(118_000);
    setTasksExpanded(false);
    setAttachedChips(["src/styles/t3-theme.css", "registry.json"]);
    setMessages(["Audit our composer components and build a reusable shadcn registry collection."]);
  };

  return (
    <div className="flex h-[680px] flex-col overflow-hidden rounded-2xl border bg-background shadow-sm">
      {/* Header chrome */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b bg-card/50 px-4 py-2.5">
        <div className="flex items-center gap-2.5">
          <ConnectionStatusDot
            phase="connected"
            tooltipText="Local agent daemon connected (latency 8ms)"
          />
          <span className="text-sm font-medium text-foreground">
            feat/t3code-component-registry
          </span>
          <ThreadStatusPill status={threadStatus} />
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            size="xs"
            variant="outline"
            onClick={() =>
              setThreadError(
                "WebSocket heartbeat timed out after 10,000ms while streaming tool output from mcp-server.",
              )
            }
          >
            Simulate Error
          </Button>
          <Button size="xs" variant="ghost-muted" onClick={resetPlayground}>
            <RotateCcwIcon />
            Reset
          </Button>
        </div>
      </div>

      {/* Scrollable Timeline */}
      <ScrollArea scrollFade className="min-h-0 flex-1">
        <div className="mx-auto max-w-3xl space-y-5 px-4 py-5">
          {messages.map((msg, idx) => (
            <div key={idx} className="flex justify-end">
              <div className="max-w-[85%] rounded-2xl border bg-message px-4 py-2.5 text-sm text-message-foreground">
                <p>{msg}</p>
                {idx === 0 ? (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <FileTagChip label="index.css" path="apps/web/src/index.css" />
                    <TerminalContextChip label="shadcn build" />
                  </div>
                ) : null}
              </div>
            </div>
          ))}

          <ProposedPlanCard
            planMarkdown={PLAYGROUND_PLAN}
            onApprove={() =>
              toastManager.add({
                type: "success",
                title: "Plan execution started",
                description: "Queued remaining steps in thread.",
              })
            }
          />

          <ChangedFilesCard
            files={PLAYGROUND_FILES}
            onOpenDiff={(path) =>
              toastManager.add({
                type: "info",
                title: "Previewing diff",
                description: path ?? "All changed files",
              })
            }
          />

          <ThreadErrorBanner error={threadError} onDismiss={() => setThreadError(null)} />
        </div>
      </ScrollArea>

      {/* Docked Bottom Composer */}
      <div className="px-3 pt-2 pb-3 sm:px-5">
        <ComposerSurface.Shell contextStrip>
          {tasksExpanded ? (
            <ComposerTasksDrawer
              onCollapse={() => setTasksExpanded(false)}
              progress={{
                step: INITIAL_TASKS[2]!.step,
                completedSteps: 2,
                totalSteps: INITIAL_TASKS.length,
              }}
              steps={INITIAL_TASKS}
            />
          ) : (
            <ComposerBanner.Dock>
              <ComposerTasksBadge
                expanded={false}
                onToggle={() => setTasksExpanded(true)}
                progress={{
                  step: INITIAL_TASKS[2]!.step,
                  completedSteps: 2,
                  totalSteps: INITIAL_TASKS.length,
                }}
                steps={INITIAL_TASKS}
              />
            </ComposerBanner.Dock>
          )}

          {activeApproval ? (
            <ComposerBanner.Attachment>
              <PendingApprovalPanel
                approval={activeApproval}
                pendingCount={approvals.length}
                placement="attached"
                onDecision={handleDecision}
              />
            </ComposerBanner.Attachment>
          ) : null}

          <ComposerSurface.Host>
            <ComposerSurface.Main>
              <div className="flex flex-col gap-2 px-3.5 pt-3 pb-2.5">
                {attachedChips.length > 0 ? (
                  <div className="flex flex-wrap items-center gap-1.5">
                    {attachedChips.map((file) => (
                      <FileTagChip
                        key={file}
                        label={file.split("/").pop() ?? file}
                        path={file}
                        scale="composer"
                        onDismiss={() =>
                          setAttachedChips((prev) => prev.filter((item) => item !== file))
                        }
                      />
                    ))}
                    <SkillChip name="agent-ui" />
                  </div>
                ) : null}

                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  rows={2}
                  placeholder="Ask the agent to refine a component or run checks... (Enter to send)"
                  className="w-full resize-none bg-transparent text-sm text-foreground outline-none placeholder:text-placeholder"
                />

                <div className="flex items-center justify-between gap-2 pt-1">
                  <div className="flex items-center gap-1">
                    <Button
                      size="icon-xs"
                      variant="ghost-muted"
                      aria-label="Attach file"
                      onClick={() =>
                        setAttachedChips((prev) =>
                          prev.includes("package.json") ? prev : [...prev, "package.json"],
                        )
                      }
                    >
                      <PaperclipIcon />
                    </Button>

                    <Popover open={modelPopoverOpen} onOpenChange={setModelPopoverOpen}>
                      <PopoverTrigger
                        render={
                          <Button size="xs" variant="ghost-muted" className="gap-1.5 font-normal" />
                        }
                      >
                        <SparklesIcon className="size-3.5" />
                        <span>{selectedModel.name}</span>
                        <ChevronDownIcon className="size-3 opacity-60" />
                      </PopoverTrigger>
                      <PopoverPopup align="start" side="top" className="w-80 p-1.5" viewportClassName="p-0">
                        {PLAYGROUND_MODELS.map((model, idx) => (
                          <ModelListRow
                            key={model.id}
                            model={model}
                            isSelected={model.id === selectedModelId}
                            isFavorite={favorites.has(model.id)}
                            jumpLabel={`⌘${idx + 1}`}
                            onSelect={(m) => {
                              setSelectedModelId(m.id);
                              setModelPopoverOpen(false);
                            }}
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
                      </PopoverPopup>
                    </Popover>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <ContextWindowMeter
                      usage={{
                        usedTokens,
                        maxTokens: 200_000,
                        totalProcessedTokens: usedTokens * 1.8,
                        compactsAutomatically: true,
                        autoCompactThreshold: 185_000,
                      }}
                      modelDisplayName={selectedModel.name}
                      onCompact={() => {
                        setUsedTokens(42_000);
                        toastManager.add({
                          type: "success",
                          title: "Context compacted",
                          description: "Reduced active context to 42k tokens.",
                        });
                      }}
                    />
                    <Button
                      size="icon-sm"
                      disabled={!prompt.trim()}
                      onClick={handleSend}
                      aria-label="Send message"
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
              <span className="font-mono">feat/t3code-component-registry</span>
            </span>
            <Badge variant="outline" size="sm" className="ml-auto">
              Base UI + Tailwind v4
            </Badge>
          </ComposerSurface.ContextStrip>
        </ComposerSurface.Shell>
      </div>
    </div>
  );
}
