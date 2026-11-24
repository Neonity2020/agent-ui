import {
  BotIcon,
  HomeIcon,
  LayersIcon,
  MenuIcon,
  MoonIcon,
  PaletteIcon,
  PlayIcon,
  SearchIcon,
  SparklesIcon,
  SunIcon,
  TerminalIcon,
  XIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandCollection,
  CommandDialog,
  CommandDialogPopup,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  CommandPanel,
  CommandShortcut,
} from "@/components/ui/command";
import {
  Menu,
  MenuPopup,
  MenuRadioGroup,
  MenuRadioItem,
  MenuTrigger,
} from "@/components/ui/menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { AnchoredToastProvider, ToastProvider } from "@/components/ui/toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ComponentDocPage } from "@/docs/ComponentDocPage";
import { LandingPage } from "@/docs/LandingPage";
import { AgentPlayground } from "@/docs/previews/AgentPlayground";
import { REGISTRY_ITEM_MAP, REGISTRY_ITEMS } from "@/docs/registry-catalog";
import { THEME_PRESETS } from "@/docs/theme-presets";
import { cn } from "@/lib/utils";

type ActiveRoute = "home" | "overview" | "playground" | string;

export function App() {
  const [route, setRoute] = useState<ActiveRoute>("home");
  const [sidebarFilter, setSidebarFilter] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof document === "undefined") return true;
    return document.documentElement.classList.contains("dark");
  });
  const [themeId, setThemeId] = useState<string>(() => {
    if (typeof document === "undefined") return "default";
    return document.documentElement.getAttribute("data-theme-id") ?? "default";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    try {
      localStorage.setItem("agent-ui-mode", isDark ? "dark" : "light");
    } catch {
      // Ignore storage failures
    }
  }, [isDark]);

  useEffect(() => {
    if (themeId === "default") {
      document.documentElement.removeAttribute("data-theme-id");
    } else {
      document.documentElement.setAttribute("data-theme-id", themeId);
    }
    try {
      localStorage.setItem("agent-ui-theme", themeId);
    } catch {
      // Ignore storage failures
    }
  }, [themeId]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCmdOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const filteredItems = useMemo(() => {
    const q = sidebarFilter.trim().toLowerCase();
    if (!q) return REGISTRY_ITEMS;
    return REGISTRY_ITEMS.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q),
    );
  }, [sidebarFilter]);

  const themeItems = filteredItems.filter((i) => i.category === "theme");
  const agentItems = filteredItems.filter((i) => i.category === "agent");
  const uiItems = filteredItems.filter((i) => i.category === "ui");

  const activeCatalogItem =
    route !== "home" && route !== "overview" && route !== "playground"
      ? REGISTRY_ITEM_MAP.get(route)
      : undefined;

  const navigate = (next: ActiveRoute) => {
    setRoute(next);
    setMobileNavOpen(false);
    if (next === "home") {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  };

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-2 px-3 pt-3.5 pb-2">
        <button
          type="button"
          onClick={() => navigate("home")}
          className="flex cursor-pointer items-center gap-2 text-left"
        >
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
            <SparklesIcon className="size-4" />
          </span>
          <div>
            <div className="text-sm font-semibold leading-none text-foreground">agent-ui</div>
            <div className="mt-0.5 text-[11px] text-muted-foreground">t3code registry</div>
          </div>
        </button>
        <Badge variant="outline" size="sm">
          {REGISTRY_ITEMS.length}
        </Badge>
      </div>

      <div className="px-3 py-2">
        <div className="relative flex items-center rounded-lg border border-input bg-background/70 px-2.5 py-1.5 text-xs">
          <SearchIcon className="mr-2 size-3.5 shrink-0 text-muted-foreground" />
          <input
            value={sidebarFilter}
            onChange={(e) => setSidebarFilter(e.target.value)}
            placeholder="Filter components..."
            className="w-full bg-transparent text-foreground outline-none placeholder:text-placeholder"
          />
          {sidebarFilter ? (
            <button
              type="button"
              onClick={() => setSidebarFilter("")}
              className="cursor-pointer text-muted-foreground hover:text-foreground"
            >
              <XIcon className="size-3" />
            </button>
          ) : null}
        </div>
      </div>

      <ScrollArea className="min-h-0 flex-1 px-2 pb-4">
        <div className="space-y-4 py-1">
          <div className="space-y-0.5">
            <button
              type="button"
              onClick={() => navigate("home")}
              className={cn(
                "flex w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-medium transition-colors",
                "text-sidebar-muted-foreground hover:bg-sidebar-row-hover hover:text-foreground",
              )}
            >
              <HomeIcon className="size-3.5" />
              Home
            </button>
            <button
              type="button"
              onClick={() => navigate("overview")}
              className={cn(
                "flex w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-medium transition-colors",
                route === "overview"
                  ? "bg-sidebar-row-selected text-foreground shadow-xs/5"
                  : "text-sidebar-muted-foreground hover:bg-sidebar-row-hover hover:text-foreground",
              )}
            >
              <LayersIcon className="size-3.5" />
              Overview
            </button>
            <button
              type="button"
              onClick={() => navigate("playground")}
              className={cn(
                "flex w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-medium transition-colors",
                route === "playground"
                  ? "bg-sidebar-row-selected text-foreground shadow-xs/5"
                  : "text-sidebar-muted-foreground hover:bg-sidebar-row-hover hover:text-foreground",
              )}
            >
              <PlayIcon className="size-3.5" />
              Agent Playground
              <Badge variant="info" size="sm" className="ml-auto">
                Live
              </Badge>
            </button>
          </div>

          {themeItems.length > 0 ? (
            <div>
              <div className="px-2.5 pb-1 text-[11px] font-medium text-muted-foreground">
                Design System
              </div>
              <div className="space-y-0.5">
                {themeItems.map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => navigate(item.name)}
                    className={cn(
                      "flex w-full cursor-pointer items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors",
                      route === item.name
                        ? "bg-sidebar-row-selected font-medium text-foreground shadow-xs/5"
                        : "text-sidebar-muted-foreground hover:bg-sidebar-row-hover hover:text-foreground",
                    )}
                  >
                    <span className="truncate">{item.title}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {agentItems.length > 0 ? (
            <div>
              <div className="flex items-center justify-between px-2.5 pb-1 text-[11px] font-medium text-muted-foreground">
                <span>Agent Components</span>
                <span>{agentItems.length}</span>
              </div>
              <div className="space-y-0.5">
                {agentItems.map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => navigate(item.name)}
                    className={cn(
                      "flex w-full cursor-pointer items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors",
                      route === item.name
                        ? "bg-sidebar-row-selected font-medium text-foreground shadow-xs/5"
                        : "text-sidebar-muted-foreground hover:bg-sidebar-row-hover hover:text-foreground",
                    )}
                  >
                    <span className="truncate">{item.title}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {uiItems.length > 0 ? (
            <div>
              <div className="flex items-center justify-between px-2.5 pb-1 text-[11px] font-medium text-muted-foreground">
                <span>Base UI Primitives</span>
                <span>{uiItems.length}</span>
              </div>
              <div className="space-y-0.5">
                {uiItems.map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => navigate(item.name)}
                    className={cn(
                      "flex w-full cursor-pointer items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors",
                      route === item.name
                        ? "bg-sidebar-row-selected font-medium text-foreground shadow-xs/5"
                        : "text-sidebar-muted-foreground hover:bg-sidebar-row-hover hover:text-foreground",
                    )}
                  >
                    <span className="truncate">{item.title}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </ScrollArea>
    </div>
  );

  return (
    <TooltipProvider>
      <ToastProvider position="bottom-right">
        <AnchoredToastProvider>
          {route === "home" ? (
            <LandingPage
              isDark={isDark}
              onToggleDark={() => setIsDark((v) => !v)}
              themeId={themeId}
              onSelectTheme={setThemeId}
              onOpenCommand={() => setCmdOpen(true)}
              onNavigate={(next) => navigate(next)}
            />
          ) : (
            <div className="flex h-dvh w-full overflow-hidden bg-background text-foreground">
              {/* Desktop Sidebar */}
              <aside className="hidden w-64 shrink-0 border-r border-sidebar-border bg-sidebar md:block">
                {sidebarContent}
              </aside>

              {/* Mobile Drawer */}
              {mobileNavOpen ? (
                <div className="fixed inset-0 z-50 flex md:hidden">
                  <div
                    className="dialog-backdrop fixed inset-0"
                    onClick={() => setMobileNavOpen(false)}
                  />
                  <aside className="relative z-10 h-full w-64 border-r border-sidebar-border bg-sidebar shadow-xl">
                    {sidebarContent}
                  </aside>
                </div>
              ) : null}

              {/* Main Content Column */}
              <div className="flex min-w-0 flex-1 flex-col">
                {/* Top Toolbar */}
                <header className="surface-glass sticky top-0 z-20 flex h-13 shrink-0 items-center justify-between gap-3 border-b px-4 sm:px-6">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      className="md:hidden"
                      aria-label="Open navigation"
                      onClick={() => setMobileNavOpen(true)}
                    >
                      <MenuIcon />
                    </Button>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <button
                        type="button"
                        onClick={() => navigate("home")}
                        className="cursor-pointer hover:text-foreground"
                      >
                        agent-ui
                      </button>
                      <span>/</span>
                      <span className="truncate font-medium text-foreground">
                        {route === "overview"
                          ? "Overview"
                          : route === "playground"
                            ? "Agent Playground"
                            : activeCatalogItem?.title ?? route}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Button
                      size="xs"
                      variant="outline"
                      className="hidden gap-2 sm:inline-flex"
                      onClick={() => setCmdOpen(true)}
                    >
                      <SearchIcon className="size-3.5" />
                      <span className="text-muted-foreground">Jump to...</span>
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
                        <MenuRadioGroup value={themeId} onValueChange={setThemeId}>
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
                      onClick={() => setIsDark((v) => !v)}
                    >
                      {isDark ? <SunIcon /> : <MoonIcon />}
                    </Button>
                  </div>
                </header>

                {/* Scrollable Main Area */}
                <ScrollArea className="min-h-0 flex-1">
                  <main className="px-4 py-8 sm:px-8">
                    {route === "overview" ? (
                      <OverviewPage onNavigate={navigate} />
                    ) : route === "playground" ? (
                      <div className="mx-auto max-w-5xl space-y-5">
                        <div className="space-y-1.5">
                          <Badge variant="info">Interactive Composition</Badge>
                          <h1 className="text-2xl font-semibold tracking-tight">
                            Agent Workspace Playground
                          </h1>
                          <p className="text-sm text-muted-foreground">
                            All 13 Agent components working together in a realistic coding-agent
                            thread: try approving queued commands, expanding tasks, compacting
                            context, or sending a prompt.
                          </p>
                        </div>
                        <AgentPlayground />
                      </div>
                    ) : activeCatalogItem ? (
                      <ComponentDocPage
                        item={activeCatalogItem}
                        onSelectComponent={(name) => navigate(name)}
                      />
                    ) : null}
                  </main>
                </ScrollArea>
              </div>
            </div>
          )}

          <CommandDialog open={cmdOpen} onOpenChange={setCmdOpen}>
            <CommandDialogPopup>
              <Command
                items={REGISTRY_ITEMS}
                itemToStringValue={(item) =>
                  `${(item as (typeof REGISTRY_ITEMS)[number]).title} ${(item as (typeof REGISTRY_ITEMS)[number]).name}`
                }
              >
                <CommandInput placeholder="Search all 42 components..." />
                <CommandPanel>
                  <CommandEmpty>No matching components.</CommandEmpty>
                  <CommandList>
                    <CommandCollection>
                      {(item: (typeof REGISTRY_ITEMS)[number]) => (
                        <CommandItem
                          key={item.name}
                          value={`${item.title} ${item.name}`}
                          onClick={() => {
                            navigate(item.name);
                            setCmdOpen(false);
                          }}
                        >
                          <span>{item.title}</span>
                          <CommandShortcut>{item.category}</CommandShortcut>
                        </CommandItem>
                      )}
                    </CommandCollection>
                  </CommandList>
                </CommandPanel>
              </Command>
            </CommandDialogPopup>
          </CommandDialog>
        </AnchoredToastProvider>
      </ToastProvider>
    </TooltipProvider>
  );
}

function OverviewPage({ onNavigate }: { onNavigate: (route: ActiveRoute) => void }) {
  const agentComponents = REGISTRY_ITEMS.filter((i) => i.category === "agent");
  const uiComponents = REGISTRY_ITEMS.filter((i) => i.category === "ui");

  return (
    <div className="mx-auto max-w-4xl space-y-10">
      {/* Hero */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="info">Base UI + Tailwind v4</Badge>
          <Badge variant="outline">t3code Design System</Badge>
          <Badge variant="secondary">42 Registry Items</Badge>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          t3code-inspired shadcn/ui Collection
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
          A complete, copy-paste and CLI-installable component registry distilled from{" "}
          <span className="font-medium text-foreground">t3code</span>. Built on{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">@base-ui/react</code>, Tailwind
          CSS v4 glass utilities, OKLCH theme palettes, and specialized AI coding agent workflows.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <Button onClick={() => onNavigate("playground")}>
            <PlayIcon />
            Open Agent Playground
          </Button>
          <Button variant="outline" onClick={() => onNavigate("t3-theme")}>
            <PaletteIcon />
            Explore T3 Theme & Tokens
          </Button>
        </div>
      </section>

      {/* Quickstart */}
      <section className="space-y-3 rounded-2xl border bg-card/60 p-5">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <TerminalIcon className="size-4 text-primary" />
          Install via shadcn CLI
        </div>
        <div className="space-y-2 font-mono text-xs">
          <div className="rounded-lg border bg-background px-3 py-2 text-foreground">
            npx shadcn@latest add https://agent-ui.dev/r/t3-theme.json
          </div>
          <div className="rounded-lg border bg-background px-3 py-2 text-foreground">
            npx shadcn@latest add https://agent-ui.dev/r/composer-surface.json
            https://agent-ui.dev/r/pending-approval-panel.json
          </div>
        </div>
      </section>

      <Separator />

      {/* Agent Components Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BotIcon className="size-4 text-primary" />
            <h2 className="text-lg font-semibold">Agent Domain Components</h2>
          </div>
          <span className="text-xs text-muted-foreground">{agentComponents.length} components</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {agentComponents.map((item) => (
            <button
              key={item.name}
              type="button"
              onClick={() => onNavigate(item.name)}
              className="group flex cursor-pointer flex-col justify-between rounded-xl border bg-card/60 p-4 text-left transition-colors hover:border-primary/40 hover:bg-accent/40"
            >
              <div>
                <div className="font-medium text-sm text-foreground group-hover:text-primary">
                  {item.title}
                </div>
                <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
              <div className="mt-3 font-mono text-[10px] text-muted-foreground/80">
                {item.name}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Base UI Primitives Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LayersIcon className="size-4 text-primary" />
            <h2 className="text-lg font-semibold">Base UI Primitives</h2>
          </div>
          <span className="text-xs text-muted-foreground">{uiComponents.length} primitives</span>
        </div>
        <div className="grid gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
          {uiComponents.map((item) => (
            <button
              key={item.name}
              type="button"
              onClick={() => onNavigate(item.name)}
              className="group flex cursor-pointer items-center justify-between rounded-xl border bg-card/40 px-3.5 py-2.5 text-left transition-colors hover:border-primary/40 hover:bg-accent/40"
            >
              <span className="truncate text-xs font-medium text-foreground group-hover:text-primary">
                {item.title}
              </span>
              <span className="font-mono text-[10px] text-muted-foreground/70">{item.name}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
