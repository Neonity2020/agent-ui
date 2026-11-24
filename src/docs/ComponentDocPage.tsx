import { CheckIcon, CopyIcon, TerminalIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { AGENT_PREVIEW_MAP } from "@/docs/previews/AgentPreviews";
import { UI_PREVIEW_MAP } from "@/docs/previews/UiPreviews";
import type { CatalogItem } from "@/docs/registry-catalog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toastManager } from "@/components/ui/toast";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    void navigator.clipboard?.writeText(text).then(() => {
      setCopied(true);
      toastManager.add({ type: "success", title: "Copied to clipboard" });
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <Button size="xs" variant="outline" onClick={handleCopy} aria-label={label}>
      {copied ? <CheckIcon className="text-success" /> : <CopyIcon />}
      <span>{copied ? "Copied" : label}</span>
    </Button>
  );
}

export function ComponentDocPage({
  item,
  onSelectComponent,
}: {
  item: CatalogItem;
  onSelectComponent: (name: string) => void;
}) {
  const [tab, setTab] = useState<"preview" | "code">("preview");
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);

  useEffect(() => {
    setSelectedFileIndex(0);
  }, [item.name]);

  const activeFile = item.files[selectedFileIndex] ?? item.files[0];
  const installCmd = `npx shadcn@latest add https://agent-ui.dev/r/${item.name}.json`;
  const renderPreview = AGENT_PREVIEW_MAP[item.name] ?? UI_PREVIEW_MAP[item.name];

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      {/* Header */}
      <div className="space-y-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={item.category === "agent" ? "info" : "secondary"}>
            {item.category === "theme"
              ? "Design System"
              : item.category === "agent"
                ? "Agent Component"
                : "Base UI Primitive"}
          </Badge>
          <span className="font-mono text-xs text-muted-foreground">{item.name}</span>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{item.title}</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {item.description}
        </p>

        {(item.dependencies?.length || item.registryDependencies?.length) ? (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {item.dependencies?.map((dep) => (
              <Badge key={dep} variant="outline" size="sm" className="font-mono">
                {dep}
              </Badge>
            ))}
            {item.registryDependencies?.map((dep) => (
              <button
                key={dep}
                type="button"
                onClick={() => onSelectComponent(dep)}
                className="cursor-pointer"
              >
                <Badge variant="secondary" size="sm" className="font-mono hover:bg-accent">
                  @{dep}
                </Badge>
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {/* CLI Install Command */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border bg-card px-3.5 py-2.5">
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <TerminalIcon className="size-4 shrink-0 text-muted-foreground" />
          <code className="truncate font-mono text-xs text-foreground">{installCmd}</code>
        </div>
        <CopyButton text={installCmd} label="Copy CLI" />
      </div>

      {/* Preview / Code Tabs */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <ToggleGroup
            variant="segmented"
            value={[tab]}
            onValueChange={(vals) => {
              const next = vals[0] as "preview" | "code" | undefined;
              if (next) setTab(next);
            }}
          >
            <ToggleGroupItem value="preview">Preview</ToggleGroupItem>
            <ToggleGroupItem value="code">Source Code</ToggleGroupItem>
          </ToggleGroup>

          {tab === "code" && activeFile ? (
            <CopyButton text={activeFile.code} label="Copy Source" />
          ) : null}
        </div>

        {tab === "preview" ? (
          <div className="relative flex min-h-64 items-center justify-center rounded-2xl border bg-background/60 p-6 sm:p-10">
            {renderPreview ? (
              renderPreview()
            ) : (
              <p className="text-sm text-muted-foreground">Preview not available.</p>
            )}
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border bg-card">
            {item.files.length > 1 ? (
              <div className="flex items-center gap-1 border-b bg-muted/40 px-3 py-2">
                {item.files.map((file, idx) => (
                  <Button
                    key={file.path}
                    size="xs"
                    variant={idx === selectedFileIndex ? "secondary" : "ghost-muted"}
                    onClick={() => setSelectedFileIndex(idx)}
                    className="font-mono"
                  >
                    {file.path.split("/").pop()}
                  </Button>
                ))}
              </div>
            ) : activeFile ? (
              <div className="border-b bg-muted/40 px-4 py-2 font-mono text-xs text-muted-foreground">
                {activeFile.path}
              </div>
            ) : null}
            <ScrollArea className="max-h-[540px]">
              <pre className="p-4 font-mono text-xs leading-relaxed text-foreground">
                <code>{activeFile?.code ?? ""}</code>
              </pre>
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
}
