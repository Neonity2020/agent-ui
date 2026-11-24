import {
  ChevronRightIcon,
  ChevronsDownUpIcon,
  ChevronsUpDownIcon,
  FileCode2Icon,
  FileDiffIcon,
  FileIcon,
  FileJsonIcon,
  FileTextIcon,
  FolderClosedIcon,
  FolderIcon,
} from "lucide-react";
import { memo, useCallback, useMemo, useState } from "react";

import { DiffStatLabel, hasNonZeroStat } from "@/components/agent/diff-stat-label";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipPopup, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export interface ChangedFileEntry {
  readonly path: string;
  readonly additions?: number;
  readonly deletions?: number;
}

export interface ChangedFileStat {
  readonly additions: number;
  readonly deletions: number;
}

export interface ChangedFilesTreeDirectoryNode {
  readonly kind: "directory";
  readonly name: string;
  readonly path: string;
  readonly stat: ChangedFileStat;
  readonly children: ChangedFilesTreeNode[];
}

export interface ChangedFilesTreeFileNode {
  readonly kind: "file";
  readonly name: string;
  readonly path: string;
  readonly stat: ChangedFileStat | null;
}

export type ChangedFilesTreeNode = ChangedFilesTreeDirectoryNode | ChangedFilesTreeFileNode;

interface MutableDirectoryNode {
  name: string;
  path: string;
  stat: { additions: number; deletions: number };
  directories: Map<string, MutableDirectoryNode>;
  files: ChangedFilesTreeFileNode[];
}

const EMPTY_DIRECTORY_OVERRIDES: Record<string, boolean> = {};
const SORT_LOCALE_OPTIONS: Intl.CollatorOptions = { numeric: true, sensitivity: "base" };

function normalizePathSegments(pathValue: string): string[] {
  return pathValue
    .replaceAll("\\", "/")
    .split("/")
    .filter((segment) => segment.length > 0);
}

function changedFileName(pathValue: string): string {
  return normalizePathSegments(pathValue).at(-1) ?? pathValue;
}

function changedFileScope(pathValue: string): string {
  const segments = normalizePathSegments(pathValue);
  return segments.length > 1 ? (segments[0] ?? "root") : "root";
}

function readStat(file: ChangedFileEntry): ChangedFileStat | null {
  if (typeof file.additions !== "number" || typeof file.deletions !== "number") {
    return null;
  }
  return { additions: file.additions, deletions: file.deletions };
}

export function summarizeChangedFilesStats(
  files: ReadonlyArray<ChangedFileEntry>,
): ChangedFileStat {
  return files.reduce(
    (acc, file) => {
      const stat = readStat(file);
      if (!stat) return acc;
      return {
        additions: acc.additions + stat.additions,
        deletions: acc.deletions + stat.deletions,
      };
    },
    { additions: 0, deletions: 0 },
  );
}

function compactDirectoryNode(node: ChangedFilesTreeDirectoryNode): ChangedFilesTreeDirectoryNode {
  const compactedChildren = node.children.map((child) =>
    child.kind === "directory" ? compactDirectoryNode(child) : child,
  );

  let compactedNode: ChangedFilesTreeDirectoryNode = {
    ...node,
    children: compactedChildren,
  };

  while (compactedNode.children.length === 1 && compactedNode.children[0]?.kind === "directory") {
    const onlyChild = compactedNode.children[0];
    compactedNode = {
      kind: "directory",
      name: `${compactedNode.name}/${onlyChild.name}`,
      path: onlyChild.path,
      stat: onlyChild.stat,
      children: onlyChild.children,
    };
  }

  return compactedNode;
}

function toTreeNodes(directory: MutableDirectoryNode): ChangedFilesTreeNode[] {
  const subdirectories: ChangedFilesTreeDirectoryNode[] = Array.from(directory.directories.values())
    .sort((a, b) => a.name.localeCompare(b.name, undefined, SORT_LOCALE_OPTIONS))
    .map<ChangedFilesTreeDirectoryNode>((sub) => ({
      kind: "directory",
      name: sub.name,
      path: sub.path,
      stat: { additions: sub.stat.additions, deletions: sub.stat.deletions },
      children: toTreeNodes(sub),
    }))
    .map(compactDirectoryNode);

  const files = [...directory.files].sort((a, b) =>
    a.name.localeCompare(b.name, undefined, SORT_LOCALE_OPTIONS),
  );
  return [...subdirectories, ...files];
}

export function buildChangedFilesTree(
  files: ReadonlyArray<ChangedFileEntry>,
): ChangedFilesTreeNode[] {
  const root: MutableDirectoryNode = {
    name: "",
    path: "",
    stat: { additions: 0, deletions: 0 },
    directories: new Map(),
    files: [],
  };

  for (const file of files) {
    const segments = normalizePathSegments(file.path);
    const fileName = segments.at(-1);
    if (!fileName) continue;

    const filePath = segments.join("/");
    const stat = readStat(file);
    const ancestors: MutableDirectoryNode[] = [root];
    let currentDirectory = root;

    for (const segment of segments.slice(0, -1)) {
      const nextPath = currentDirectory.path ? `${currentDirectory.path}/${segment}` : segment;
      const existing = currentDirectory.directories.get(segment);
      if (existing) {
        currentDirectory = existing;
      } else {
        const created: MutableDirectoryNode = {
          name: segment,
          path: nextPath,
          stat: { additions: 0, deletions: 0 },
          directories: new Map(),
          files: [],
        };
        currentDirectory.directories.set(segment, created);
        currentDirectory = created;
      }
      ancestors.push(currentDirectory);
    }

    currentDirectory.files.push({
      kind: "file",
      name: fileName,
      path: filePath,
      stat,
    });

    if (stat) {
      for (const ancestor of ancestors) {
        ancestor.stat.additions += stat.additions;
        ancestor.stat.deletions += stat.deletions;
      }
    }
  }

  return toTreeNodes(root);
}

function FileEntryIcon({ pathValue, className }: { pathValue: string; className?: string }) {
  const ext = pathValue.split(".").pop()?.toLowerCase();
  if (ext === "json" || ext === "yaml" || ext === "yml" || ext === "toml") {
    return <FileJsonIcon aria-hidden="true" className={className} />;
  }
  if (ext === "md" || ext === "mdx" || ext === "txt") {
    return <FileTextIcon aria-hidden="true" className={className} />;
  }
  if (ext === "ts" || ext === "tsx" || ext === "js" || ext === "jsx" || ext === "css") {
    return <FileCode2Icon aria-hidden="true" className={className} />;
  }
  return <FileIcon aria-hidden="true" className={className} />;
}

function collectDirectoryPaths(nodes: ReadonlyArray<ChangedFilesTreeNode>): string[] {
  const paths: string[] = [];
  for (const node of nodes) {
    if (node.kind !== "directory") continue;
    paths.push(node.path);
    paths.push(...collectDirectoryPaths(node.children));
  }
  return paths;
}

export const ChangedFilesTree = memo(function ChangedFilesTree({
  files,
  allDirectoriesExpanded = true,
  onSelectFile,
}: {
  files: ReadonlyArray<ChangedFileEntry>;
  allDirectoriesExpanded?: boolean;
  onSelectFile?: (filePath: string) => void;
}) {
  const treeNodes = useMemo(() => buildChangedFilesTree(files), [files]);
  const directoryPathsKey = useMemo(
    () => collectDirectoryPaths(treeNodes).join("\u0000"),
    [treeNodes],
  );
  const hasDirectoryNodes = directoryPathsKey.length > 0;
  const expansionStateKey = `${allDirectoriesExpanded ? "expanded" : "collapsed"}\u0000${directoryPathsKey}`;
  const [directoryExpansionState, setDirectoryExpansionState] = useState<{
    key: string;
    overrides: Record<string, boolean>;
  }>(() => ({
    key: expansionStateKey,
    overrides: {},
  }));
  const expandedDirectories =
    directoryExpansionState.key === expansionStateKey
      ? directoryExpansionState.overrides
      : EMPTY_DIRECTORY_OVERRIDES;

  const toggleDirectory = useCallback(
    (pathValue: string) => {
      setDirectoryExpansionState((current) => {
        const nextOverrides = current.key === expansionStateKey ? current.overrides : {};
        return {
          key: expansionStateKey,
          overrides: {
            ...nextOverrides,
            [pathValue]: !(nextOverrides[pathValue] ?? allDirectoriesExpanded),
          },
        };
      });
    },
    [allDirectoriesExpanded, expansionStateKey],
  );

  const renderTreeNode = (node: ChangedFilesTreeNode, depth: number) => {
    const leftPadding = 8 + depth * 14;
    if (node.kind === "directory") {
      const isExpanded = expandedDirectories[node.path] ?? allDirectoriesExpanded;
      return (
        <div key={`dir:${node.path}`}>
          <button
            type="button"
            className="group flex w-full cursor-pointer items-center gap-1.5 rounded-xl py-1 pr-3 text-left transition-colors hover:bg-accent/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background"
            style={{ paddingLeft: `${leftPadding}px` }}
            onClick={() => toggleDirectory(node.path)}
          >
            <ChevronRightIcon
              aria-hidden="true"
              className={cn(
                "size-3.5 shrink-0 text-muted-foreground/70 transition-transform group-hover:text-foreground/80",
                isExpanded && "rotate-90",
              )}
            />
            {isExpanded ? (
              <FolderIcon className="size-3.5 shrink-0 text-muted-foreground/75" />
            ) : (
              <FolderClosedIcon className="size-3.5 shrink-0 text-muted-foreground/75" />
            )}
            <span className="truncate font-mono text-[11px] text-muted-foreground/90 group-hover:text-foreground/90">
              {node.name}
            </span>
            {hasNonZeroStat(node.stat) && (
              <span className="ml-auto shrink-0 font-mono text-[10px] tabular-nums">
                <DiffStatLabel additions={node.stat.additions} deletions={node.stat.deletions} />
              </span>
            )}
          </button>
          {isExpanded && (
            <div className="space-y-0.5">
              {node.children.map((childNode) => renderTreeNode(childNode, depth + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <button
        key={`file:${node.path}`}
        type="button"
        className="group flex w-full cursor-pointer items-center gap-1.5 rounded-xl py-1 pr-3 text-left transition-colors hover:bg-accent/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background"
        style={{ paddingLeft: `${leftPadding}px` }}
        onClick={() => onSelectFile?.(node.path)}
      >
        {hasDirectoryNodes || depth > 0 ? (
          <span aria-hidden="true" className="size-3.5 shrink-0" />
        ) : null}
        <FileEntryIcon
          pathValue={node.path}
          className="size-3.5 shrink-0 text-muted-foreground/70"
        />
        <span className="truncate font-mono text-[11px] text-muted-foreground/80 group-hover:text-foreground/90">
          {node.name}
        </span>
        {node.stat && (
          <span className="ml-auto shrink-0 font-mono text-[10px] tabular-nums">
            <DiffStatLabel additions={node.stat.additions} deletions={node.stat.deletions} />
          </span>
        )}
      </button>
    );
  };

  return <div className="space-y-0.5">{treeNodes.map((node) => renderTreeNode(node, 0))}</div>;
});

export interface ChangedFilesCardProps {
  files: ReadonlyArray<ChangedFileEntry>;
  expanded?: boolean;
  defaultExpanded?: boolean;
  showCompactPreview?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  onOpenDiff?: (filePath?: string) => void;
  className?: string;
}

export const ChangedFilesCard = memo(function ChangedFilesCard({
  files,
  expanded: controlledExpanded,
  defaultExpanded = false,
  showCompactPreview = true,
  onExpandedChange,
  onOpenDiff,
  className,
}: ChangedFilesCardProps) {
  const [uncontrolledExpanded, setUncontrolledExpanded] = useState(defaultExpanded);
  const [allDirectoriesExpanded, setAllDirectoriesExpanded] = useState(true);
  const expanded = controlledExpanded ?? uncontrolledExpanded;

  const setExpanded = (next: boolean) => {
    if (controlledExpanded === undefined) {
      setUncontrolledExpanded(next);
    }
    onExpandedChange?.(next);
  };

  const summaryStat = useMemo(() => summarizeChangedFilesStats(files), [files]);
  const scopeSummary = useMemo(() => {
    const scopes = new Map<string, number>();
    for (const file of files) {
      const label = changedFileScope(file.path);
      scopes.set(label, (scopes.get(label) ?? 0) + 1);
    }
    return Array.from(scopes, ([label, fileCount]) => ({ label, fileCount })).slice(0, 4);
  }, [files]);
  const previewFiles = useMemo(() => files.slice(0, 3), [files]);
  const compactPreviewVisible = showCompactPreview && !expanded;

  return (
    <div
      className={cn(
        "@container/changed-files rounded-2xl border border-border/70 bg-secondary p-2 dark:border-transparent dark:bg-input/32",
        className,
      )}
      data-changed-files-state={
        expanded ? "expanded" : compactPreviewVisible ? "preview" : "collapsed"
      }
    >
      <div
        data-changed-files-header=""
        className={cn(
          "flex items-center justify-between gap-2 rounded-xl",
          expanded &&
            "mb-2 bg-secondary dark:bg-[color-mix(in_srgb,var(--contrast-foreground)_2.5%,var(--background))]",
        )}
      >
        <button
          type="button"
          aria-expanded={expanded}
          className="group flex min-w-0 flex-1 cursor-pointer items-center rounded-xl px-2 py-1.5 text-left transition-colors hover:bg-accent/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onClick={() => setExpanded(!expanded)}
        >
          <span className="flex min-w-0 flex-1 items-center gap-1.5 overflow-hidden">
            <ChevronRightIcon
              aria-hidden="true"
              className={cn(
                "size-3.5 shrink-0 text-muted-foreground transition-transform",
                expanded && "rotate-90",
              )}
            />
            <span className="flex shrink-0 items-center gap-1 whitespace-nowrap font-medium text-foreground text-xs leading-4">
              <span>
                {files.length} changed file{files.length === 1 ? "" : "s"}
              </span>
              {hasNonZeroStat(summaryStat) && (
                <DiffStatLabel
                  additions={summaryStat.additions}
                  className="text-xs leading-4"
                  deletions={summaryStat.deletions}
                  layout="inline"
                />
              )}
            </span>
            <span className="ml-1 hidden min-w-0 flex-1 truncate text-[11px] text-muted-foreground group-hover:text-foreground/80 @[24rem]/changed-files:inline">
              {expanded ? "Hide files" : "Show files"}
            </span>
          </span>
        </button>
        <div className="flex shrink-0 items-center gap-1.5 pr-1">
          {expanded ? (
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    type="button"
                    size="icon-xs"
                    variant="outline"
                    className="!size-[22px]"
                    aria-label={
                      allDirectoriesExpanded ? "Collapse all folders" : "Expand all folders"
                    }
                    onClick={() => setAllDirectoriesExpanded((v) => !v)}
                  />
                }
              >
                {allDirectoriesExpanded ? (
                  <ChevronsDownUpIcon className="size-3" />
                ) : (
                  <ChevronsUpDownIcon className="size-3" />
                )}
              </TooltipTrigger>
              <TooltipPopup side="top">
                {allDirectoriesExpanded ? "Collapse all folders" : "Expand all folders"}
              </TooltipPopup>
            </Tooltip>
          ) : null}
          {onOpenDiff ? (
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    type="button"
                    size="xs"
                    variant="outline"
                    aria-label="Open diff"
                    onClick={() => onOpenDiff(files[0]?.path)}
                  />
                }
              >
                <FileDiffIcon className="size-3" />
                <span className="hidden @[24rem]/changed-files:inline">Open diff</span>
              </TooltipTrigger>
              <TooltipPopup side="top">Open the full diff</TooltipPopup>
            </Tooltip>
          ) : null}
        </div>
      </div>

      {expanded ? (
        <ChangedFilesTree
          files={files}
          allDirectoriesExpanded={allDirectoriesExpanded}
          onSelectFile={onOpenDiff}
        />
      ) : compactPreviewVisible ? (
        <div className="px-2 pb-1.5 pt-1">
          <p className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[11px] text-muted-foreground">
            {scopeSummary.map((scope, index) => (
              <span key={scope.label} className="inline-flex items-center gap-1">
                {index > 0 ? <span aria-hidden="true">·</span> : null}
                <span className="font-mono text-foreground/75">{scope.label}</span>
                <span>
                  {scope.fileCount} file{scope.fileCount === 1 ? "" : "s"}
                </span>
              </span>
            ))}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {previewFiles.map((file) => (
              <Tooltip key={file.path}>
                <TooltipTrigger
                  render={
                    <button
                      type="button"
                      className="inline-flex max-w-48 cursor-pointer items-center gap-1 rounded-md border border-border/70 bg-background/45 px-1.5 py-1 font-mono text-[10px] text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      onClick={() => onOpenDiff?.(file.path)}
                    />
                  }
                >
                  <FileEntryIcon
                    pathValue={file.path}
                    className="size-3 shrink-0 text-muted-foreground/70"
                  />
                  <span className="truncate">{changedFileName(file.path)}</span>
                </TooltipTrigger>
                <TooltipPopup side="top">{file.path}</TooltipPopup>
              </Tooltip>
            ))}
            {files.length > previewFiles.length ? (
              <button
                type="button"
                className="cursor-pointer rounded-md px-1.5 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                onClick={() => setExpanded(true)}
              >
                Show all {files.length} files
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
});
