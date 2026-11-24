import { CheckIcon, CopyIcon, DownloadIcon, EllipsisIcon } from "lucide-react";
import { Fragment, memo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Menu, MenuItem, MenuPopup, MenuTrigger } from "@/components/ui/menu";
import { cn } from "@/lib/utils";

function extractPlanTitle(planMarkdown: string): string | null {
  const heading = planMarkdown.match(/^\s{0,3}#{1,6}\s+(.+)$/m)?.[1]?.trim();
  return heading && heading.length > 0 ? heading : null;
}

function stripLeadingHeading(planMarkdown: string): string {
  const lines = planMarkdown.trimEnd().split(/\r?\n/);
  const sourceLines = lines[0] && /^\s{0,3}#{1,6}\s+/.test(lines[0]) ? lines.slice(1) : [...lines];
  while (sourceLines[0]?.trim().length === 0) {
    sourceLines.shift();
  }
  return sourceLines.join("\n");
}

function renderInlineMarkdown(text: string): React.ReactNode[] {
  const tokens = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return tokens.map((token, idx) => {
    if (token.startsWith("`") && token.endsWith("`") && token.length >= 2) {
      return (
        <code
          key={idx}
          className="rounded-md border border-border bg-muted px-1 py-0.5 font-mono text-[0.85em] text-foreground"
        >
          {token.slice(1, -1)}
        </code>
      );
    }
    if (token.startsWith("**") && token.endsWith("**") && token.length >= 4) {
      return (
        <strong key={idx} className="font-semibold text-foreground">
          {token.slice(2, -2)}
        </strong>
      );
    }
    return <Fragment key={idx}>{token}</Fragment>;
  });
}

function SimplePlanMarkdown({ markdown }: { markdown: string }) {
  const lines = markdown.split(/\r?\n/);
  const blocks: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i] ?? "";
    if (!line.trim()) {
      i += 1;
      continue;
    }

    if (line.trim().startsWith("```")) {
      const codeLines: string[] = [];
      i += 1;
      while (i < lines.length && !(lines[i] ?? "").trim().startsWith("```")) {
        codeLines.push(lines[i] ?? "");
        i += 1;
      }
      i += 1;
      blocks.push(
        <pre
          key={blocks.length}
          className="my-2.5 overflow-x-auto rounded-xl border border-border bg-muted p-3 font-mono text-xs text-foreground"
        >
          <code>{codeLines.join("\n")}</code>
        </pre>,
      );
      continue;
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1]?.length ?? 2;
      const content = headingMatch[2] ?? "";
      blocks.push(
        <h3
          key={blocks.length}
          className={cn(
            "mt-3.5 mb-1.5 font-semibold text-foreground first:mt-0",
            level <= 2 ? "text-sm" : "text-xs uppercase tracking-wide text-muted-foreground",
          )}
        >
          {renderInlineMarkdown(content)}
        </h3>,
      );
      i += 1;
      continue;
    }

    if (/^\s*[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i] ?? "")) {
        items.push((lines[i] ?? "").replace(/^\s*[-*]\s+/, ""));
        i += 1;
      }
      blocks.push(
        <ul key={blocks.length} className="my-2 list-disc space-y-1 pl-5 text-sm text-foreground/90">
          {items.map((item, idx) => (
            <li key={idx}>{renderInlineMarkdown(item)}</li>
          ))}
        </ul>,
      );
      continue;
    }

    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i] ?? "")) {
        items.push((lines[i] ?? "").replace(/^\s*\d+\.\s+/, ""));
        i += 1;
      }
      blocks.push(
        <ol
          key={blocks.length}
          className="my-2 list-decimal space-y-1 pl-5 text-sm text-foreground/90"
        >
          {items.map((item, idx) => (
            <li key={idx}>{renderInlineMarkdown(item)}</li>
          ))}
        </ol>,
      );
      continue;
    }

    blocks.push(
      <p key={blocks.length} className="my-2 text-sm leading-relaxed text-foreground/90">
        {renderInlineMarkdown(line)}
      </p>,
    );
    i += 1;
  }

  return <div className="space-y-1">{blocks}</div>;
}

export interface ProposedPlanCardProps {
  planMarkdown: string;
  title?: string;
  defaultExpanded?: boolean;
  onApprove?: () => void;
  onEdit?: () => void;
  className?: string;
}

export const ProposedPlanCard = memo(function ProposedPlanCard({
  planMarkdown,
  title: explicitTitle,
  defaultExpanded = false,
  onApprove,
  onEdit,
  className,
}: ProposedPlanCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [isCopied, setIsCopied] = useState(false);

  const title = explicitTitle ?? extractPlanTitle(planMarkdown) ?? "Proposed plan";
  const bodyMarkdown = stripLeadingHeading(planMarkdown);
  const lineCount = planMarkdown.split("\n").length;
  const canCollapse = planMarkdown.length > 520 || lineCount > 12;

  const handleCopy = () => {
    void navigator.clipboard?.writeText(planMarkdown.trimEnd() + "\n").then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1600);
    });
  };

  const handleDownload = () => {
    const filename = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "plan"}.md`;
    const blob = new Blob([`${planMarkdown.trimEnd()}\n`], {
      type: "text/markdown;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  };

  return (
    <div
      className={cn(
        "rounded-[24px] border border-border/80 bg-card/70 p-4 sm:p-5",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <Badge variant="secondary">Plan</Badge>
          <p className="truncate text-sm font-medium text-foreground">{title}</p>
        </div>
        <div className="flex items-center gap-1.5">
          {onEdit ? (
            <Button size="xs" variant="outline" onClick={onEdit}>
              Edit
            </Button>
          ) : null}
          {onApprove ? (
            <Button size="xs" onClick={onApprove}>
              Implement plan
            </Button>
          ) : null}
          <Menu>
            <MenuTrigger
              render={<Button aria-label="Plan actions" size="icon-xs" variant="outline" />}
            >
              <EllipsisIcon aria-hidden="true" className="size-4" />
            </MenuTrigger>
            <MenuPopup align="end">
              <MenuItem onClick={handleCopy}>
                {isCopied ? <CheckIcon className="text-success" /> : <CopyIcon />}
                {isCopied ? "Copied!" : "Copy to clipboard"}
              </MenuItem>
              <MenuItem onClick={handleDownload}>
                <DownloadIcon />
                Download as markdown
              </MenuItem>
            </MenuPopup>
          </Menu>
        </div>
      </div>

      <div className="mt-4">
        <div className={cn("relative", canCollapse && !expanded && "max-h-56 overflow-hidden")}>
          <SimplePlanMarkdown markdown={bodyMarkdown} />
          {canCollapse && !expanded ? (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-card/95 via-card/75 to-transparent" />
          ) : null}
        </div>
        {canCollapse ? (
          <div className="mt-4 flex justify-center">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setExpanded((value) => !value)}
            >
              {expanded ? "Collapse plan" : "Expand plan"}
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
});
