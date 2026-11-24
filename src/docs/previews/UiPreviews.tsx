import {
  AlertTriangleIcon,
  BoldIcon,
  CheckCircle2Icon,
  ChevronDownIcon,
  CommandIcon,
  FolderOpenIcon,
  ItalicIcon,
  SearchIcon,
  SettingsIcon,
  SparklesIcon,
  TerminalIcon,
  Trash2Icon,
  UnderlineIcon,
} from "lucide-react";
import { type ReactNode, useState } from "react";

import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPopup,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Autocomplete,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
  AutocompletePopup,
} from "@/components/ui/autocomplete";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Command,
  CommandCollection,
  CommandDialog,
  CommandDialogPopup,
  CommandDialogTrigger,
  CommandEmpty,
  CommandFooter,
  CommandInput,
  CommandItem,
  CommandList,
  CommandPanel,
  CommandShortcut,
} from "@/components/ui/command";
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogPopup,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Label } from "@/components/ui/label";
import {
  Menu,
  MenuCheckboxItem,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuPopup,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuShortcut,
  MenuTrigger,
} from "@/components/ui/menu";
import {
  Popover,
  PopoverDescription,
  PopoverPopup,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toastManager } from "@/components/ui/toast";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipPopup, TooltipTrigger } from "@/components/ui/tooltip";

function ButtonPreview() {
  return (
    <div className="w-full space-y-5">
      <div className="flex flex-wrap items-center gap-2.5">
        <Button>Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="glass">Glass</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="ghost-muted">Ghost Muted</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="destructive-outline">Destructive Outline</Button>
        <Button variant="warning-outline">Warning Outline</Button>
        <Button variant="link">Link</Button>
      </div>
      <div className="flex flex-wrap items-center gap-2.5">
        <Button size="micro">Micro</Button>
        <Button size="xs">Extra Small</Button>
        <Button size="compact">Compact</Button>
        <Button size="sm">Small</Button>
        <Button size="default">Default</Button>
        <Button size="lg">Large</Button>
        <Button size="icon-sm" variant="outline" aria-label="Settings">
          <SettingsIcon />
        </Button>
      </div>
    </div>
  );
}

function BadgePreview() {
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="info">Info</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="error">Error</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge size="sm" variant="info">
        Small
      </Badge>
      <Badge size="control" variant="outline">
        Control
      </Badge>
    </div>
  );
}

function AlertPreview() {
  return (
    <div className="w-full max-w-xl space-y-3">
      <Alert variant="info" className="alert-glass">
        <SparklesIcon />
        <AlertTitle>Context auto-compaction enabled</AlertTitle>
        <AlertDescription>
          Long threads are summarized automatically before hitting the 200k limit.
        </AlertDescription>
      </Alert>
      <Alert variant="warning" controlAlignment="first-line">
        <AlertTriangleIcon />
        <AlertTitle>Uncommitted changes in worktree</AlertTitle>
        <AlertDescription>Commit or stash local edits before switching branches.</AlertDescription>
        <AlertAction>
          <Button size="xs" variant="warning-outline">
            Stash
          </Button>
        </AlertAction>
      </Alert>
      <Alert variant="error">
        <CheckCircle2Icon />
        <AlertTitle>RPC connection interrupted</AlertTitle>
        <AlertDescription>Local daemon exited with status code 1.</AlertDescription>
      </Alert>
    </div>
  );
}

function InputGroupPreview() {
  return (
    <div className="w-full max-w-md space-y-3">
      <InputGroup>
        <InputGroupAddon align="inline-start">
          <InputGroupText>
            <SearchIcon />
          </InputGroupText>
        </InputGroupAddon>
        <InputGroupInput placeholder="Search workspace symbols..." />
        <InputGroupAddon align="inline-end">
          <Kbd>⌘K</Kbd>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupAddon align="inline-start">
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput placeholder="agent-ui.dev/r/button.json" />
      </InputGroup>
    </div>
  );
}

function SelectionControlsPreview() {
  const [checked, setChecked] = useState(true);
  const [switched, setSwitched] = useState(true);
  const [radio, setRadio] = useState("worktree");
  const [seg, setSeg] = useState(["diff"]);

  return (
    <div className="grid w-full max-w-xl gap-5 sm:grid-cols-2">
      <div className="space-y-3 rounded-xl border bg-card p-4">
        <Label className="cursor-pointer justify-between w-full">
          <span>Auto-approve read-only tools</span>
          <Switch checked={switched} onCheckedChange={setSwitched} />
        </Label>
        <Label className="cursor-pointer">
          <Checkbox checked={checked} onCheckedChange={(v) => setChecked(Boolean(v))} />
          <span>Include untracked files in diff</span>
        </Label>
      </div>
      <div className="space-y-3 rounded-xl border bg-card p-4">
        <RadioGroup value={radio} onValueChange={setRadio}>
          <Label className="cursor-pointer">
            <RadioGroupItem value="local" />
            <span>Local directory</span>
          </Label>
          <Label className="cursor-pointer">
            <RadioGroupItem value="worktree" />
            <span>Isolated git worktree</span>
          </Label>
        </RadioGroup>
        <ToggleGroup variant="segmented" value={seg} onValueChange={setSeg}>
          <ToggleGroupItem value="chat">Chat</ToggleGroupItem>
          <ToggleGroupItem value="diff">Diff</ToggleGroupItem>
          <ToggleGroupItem value="terminal">Terminal</ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
}

function DialogPreview() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Dialog>
        <DialogTrigger render={<Button variant="outline" />}>Open Glass Dialog</DialogTrigger>
        <DialogPopup>
          <DialogHeader>
            <DialogTitle>Create isolated worktree</DialogTitle>
            <DialogDescription>
              Each agent thread can work in its own branch without touching your active checkout.
            </DialogDescription>
          </DialogHeader>
          <DialogPanel className="space-y-3">
            <Label htmlFor="branch-name">Branch name</Label>
            <Input id="branch-name" defaultValue="feat/t3code-registry" />
            <Dialog>
              <DialogTrigger render={<Button size="xs" variant="secondary" />}>
                Open nested dialog
              </DialogTrigger>
              <DialogPopup>
                <DialogHeader>
                  <DialogTitle>Nested Dialog</DialogTitle>
                  <DialogDescription>
                    Base UI automatically scales and translates the parent dialog behind this one.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose render={<Button size="sm" />}>Done</DialogClose>
                </DialogFooter>
              </DialogPopup>
            </Dialog>
          </DialogPanel>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" size="sm" />}>Cancel</DialogClose>
            <DialogClose render={<Button size="sm" />}>Create</DialogClose>
          </DialogFooter>
        </DialogPopup>
      </Dialog>

      <AlertDialog>
        <AlertDialogTrigger render={<Button variant="destructive-outline" />}>
          Delete Thread
        </AlertDialogTrigger>
        <AlertDialogPopup>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete thread permanently?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes all conversation history and discards the temporary worktree.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogClose render={<Button variant="outline" size="sm" />}>
              Cancel
            </AlertDialogClose>
            <AlertDialogClose render={<Button variant="destructive" size="sm" />}>
              Delete
            </AlertDialogClose>
          </AlertDialogFooter>
        </AlertDialogPopup>
      </AlertDialog>
    </div>
  );
}

function MenuAndSelectPreview() {
  const [autoSave, setAutoSave] = useState(true);
  const [mode, setMode] = useState("plan");
  const [provider, setProvider] = useState("anthropic");

  return (
    <div className="flex flex-wrap items-center gap-4">
      <Menu>
        <MenuTrigger render={<Button variant="outline" />}>
          Workspace Actions <ChevronDownIcon />
        </MenuTrigger>
        <MenuPopup align="start">
          <MenuGroup>
            <MenuGroupLabel>Session</MenuGroupLabel>
            <MenuItem>
              <TerminalIcon />
              Open Terminal
              <MenuShortcut>⌘J</MenuShortcut>
            </MenuItem>
            <MenuCheckboxItem variant="switch" checked={autoSave} onCheckedChange={setAutoSave}>
              Auto-save checkpoints
            </MenuCheckboxItem>
          </MenuGroup>
          <MenuSeparator />
          <MenuGroup>
            <MenuGroupLabel>Interaction Mode</MenuGroupLabel>
            <MenuRadioGroup value={mode} onValueChange={setMode}>
              <MenuRadioItem value="default">Build Mode</MenuRadioItem>
              <MenuRadioItem value="plan">Plan Mode</MenuRadioItem>
            </MenuRadioGroup>
          </MenuGroup>
          <MenuSeparator />
          <MenuItem variant="destructive">
            <Trash2Icon />
            Clear Thread
          </MenuItem>
        </MenuPopup>
      </Menu>

      <Select value={provider} onValueChange={(v) => v && setProvider(v)}>
        <SelectTrigger className="w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectPopup>
          <SelectItem value="anthropic" showCheck>
            Anthropic (Claude)
          </SelectItem>
          <SelectItem value="openai" showCheck>
            OpenAI (Codex)
          </SelectItem>
          <SelectItem value="google" showCheck>
            Google (Gemini)
          </SelectItem>
        </SelectPopup>
      </Select>
    </div>
  );
}

function CommandPreview() {
  const [open, setOpen] = useState(false);
  const items = [
    { id: "new-thread", label: "New Agent Thread", shortcut: "⌘N" },
    { id: "switch-model", label: "Switch Active Model", shortcut: "⌘M" },
    { id: "open-diff", label: "Toggle Diff Panel", shortcut: "⌘D" },
    { id: "compact", label: "Compact Context Window", shortcut: "⌘⇧C" },
  ];

  return (
    <div>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandDialogTrigger render={<Button variant="outline" />}>
          <CommandIcon />
          Open Command Palette
          <Kbd className="ml-1">⌘K</Kbd>
        </CommandDialogTrigger>
        <CommandDialogPopup>
          <Command
            items={items}
            itemToStringValue={(item) => (item as (typeof items)[number]).label}
          >
            <CommandInput placeholder="Type a command or search..." />
            <CommandPanel>
              <CommandEmpty>No matching commands.</CommandEmpty>
              <CommandList>
                <CommandCollection>
                  {(item: (typeof items)[number]) => (
                    <CommandItem
                      key={item.id}
                      value={item.label}
                      onClick={() => {
                        setOpen(false);
                        toastManager.add({ type: "info", title: item.label });
                      }}
                    >
                      <span>{item.label}</span>
                      <CommandShortcut>{item.shortcut}</CommandShortcut>
                    </CommandItem>
                  )}
                </CommandCollection>
              </CommandList>
            </CommandPanel>
            <CommandFooter>
              <span>Navigate with ↑↓</span>
              <KbdGroup>
                <Kbd>↵</Kbd>
                <span>Select</span>
              </KbdGroup>
            </CommandFooter>
          </Command>
        </CommandDialogPopup>
      </CommandDialog>
    </div>
  );
}

function AutocompletePreview() {
  const branches = ["main", "feat/agent-ui", "fix/stream-parser", "chore/deps-update"];
  return (
    <div className="w-full max-w-xs">
      <Autocomplete items={branches}>
        <AutocompleteInput placeholder="Filter branch..." showTrigger showClear />
        <AutocompletePopup>
          <AutocompleteEmpty>No branch found.</AutocompleteEmpty>
          <AutocompleteList>
            {(branch: string) => (
              <AutocompleteItem key={branch} value={branch}>
                {branch}
              </AutocompleteItem>
            )}
          </AutocompleteList>
        </AutocompletePopup>
      </Autocomplete>
    </div>
  );
}

function ToastPreview() {
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <Button
        size="sm"
        variant="outline"
        onClick={() =>
          toastManager.add({
            type: "success",
            title: "Registry build complete",
            description: "42 components emitted to public/r/.",
          })
        }
      >
        Success Toast
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() =>
          toastManager.add({
            type: "error",
            title: "Tool invocation failed",
            description:
              "Process exited with code 1 while running vitest on apps/web/src/components/ui/toast.test.ts. Inspect stderr details below.",
            data: {
              expandableContent: (
                <pre className="rounded-md bg-muted p-2 font-mono text-[11px]">
                  Error: ENOENT: no such file or directory
                </pre>
              ),
            },
          })
        }
      >
        Error + Details Toast
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() =>
          toastManager.add({
            type: "info",
            title: "Update ready",
            description: "Restart desktop shell to apply v0.39.0.",
            actionProps: { children: "Restart" },
          })
        }
      >
        Action Toast
      </Button>
    </div>
  );
}

export const UI_PREVIEW_MAP: Record<string, () => ReactNode> = {
  button: () => <ButtonPreview />,
  badge: () => <BadgePreview />,
  alert: () => <AlertPreview />,
  input: () => (
    <div className="w-full max-w-sm space-y-2.5">
      <Input size="compact" placeholder="Compact input..." />
      <Input placeholder="Default input..." />
      <Input size="lg" placeholder="Large input..." />
    </div>
  ),
  textarea: () => (
    <div className="w-full max-w-md">
      <Textarea placeholder="Describe what the agent should build..." />
    </div>
  ),
  "input-group": () => <InputGroupPreview />,
  kbd: () => (
    <div className="flex items-center gap-4 text-sm">
      <KbdGroup>
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>
      <KbdGroup>
        <Kbd>⇧</Kbd>
        <Kbd>⌘</Kbd>
        <Kbd>P</Kbd>
      </KbdGroup>
    </div>
  ),
  label: () => (
    <div className="flex flex-col gap-2">
      <Label htmlFor="demo-label">Workspace Root</Label>
      <Input id="demo-label" defaultValue="~/Documents/GitHub/agent-ui" />
    </div>
  ),
  separator: () => (
    <div className="flex h-6 items-center gap-3 text-xs text-muted-foreground">
      <span>Chat</span>
      <Separator orientation="vertical" />
      <span>Diff</span>
      <Separator orientation="vertical" />
      <span>Preview</span>
    </div>
  ),
  skeleton: () => (
    <div className="w-full max-w-sm space-y-2.5">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  ),
  spinner: () => (
    <div className="flex items-center gap-4">
      <Spinner className="size-4" />
      <Spinner className="size-5 text-primary" />
      <Spinner className="size-6 text-muted-foreground" />
    </div>
  ),
  switch: () => <SelectionControlsPreview />,
  checkbox: () => <SelectionControlsPreview />,
  "radio-group": () => <SelectionControlsPreview />,
  toggle: () => (
    <div className="flex items-center gap-2">
      <Toggle variant="outline" aria-label="Bold">
        <BoldIcon />
      </Toggle>
      <Toggle variant="outline" aria-label="Italic">
        <ItalicIcon />
      </Toggle>
      <Toggle variant="ghost" aria-label="Underline">
        <UnderlineIcon />
      </Toggle>
    </div>
  ),
  "toggle-group": () => <SelectionControlsPreview />,
  collapsible: () => (
    <Collapsible defaultOpen className="w-full max-w-md rounded-xl border bg-card p-3">
      <CollapsibleTrigger render={<Button size="sm" variant="ghost" className="w-full justify-between" />}>
        <span>Tool execution trace (3 steps)</span>
        <ChevronDownIcon />
      </CollapsibleTrigger>
      <CollapsiblePanel>
        <div className="space-y-1.5 pt-2 text-xs text-muted-foreground">
          <div>1. Read src/components/ui/button.tsx</div>
          <div>2. Updated variant styles for glass surface</div>
          <div>3. Verified pnpm typecheck (0 errors)</div>
        </div>
      </CollapsiblePanel>
    </Collapsible>
  ),
  "scroll-area": () => (
    <ScrollArea scrollFade className="h-40 w-full max-w-sm rounded-xl border bg-card">
      <div className="space-y-2 p-3 text-xs">
        {Array.from({ length: 16 }, (_, idx) => (
          <div key={idx} className="rounded-md bg-muted/50 px-2.5 py-1.5">
            Event log entry #{idx + 1} · stream delta committed
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
  tooltip: () => (
    <div className="flex items-center gap-3">
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline" size="sm" />}>
          Hover default
        </TooltipTrigger>
        <TooltipPopup>Tooltip content</TooltipPopup>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger render={<Button variant="glass" size="sm" />}>
          Hover glass
        </TooltipTrigger>
        <TooltipPopup variant="glass">Glassmorphic tooltip</TooltipPopup>
      </Tooltip>
    </div>
  ),
  popover: () => (
    <Popover>
      <PopoverTrigger render={<Button variant="outline" />}>Open Glass Popover</PopoverTrigger>
      <PopoverPopup className="w-72 space-y-1.5">
        <PopoverTitle className="text-sm">Workspace Environment</PopoverTitle>
        <PopoverDescription className="text-xs">
          Connected to local daemon on port 4310 with auto-compaction enabled.
        </PopoverDescription>
      </PopoverPopup>
    </Popover>
  ),
  dialog: () => <DialogPreview />,
  "alert-dialog": () => <DialogPreview />,
  menu: () => <MenuAndSelectPreview />,
  select: () => <MenuAndSelectPreview />,
  empty: () => (
    <Empty className="w-full max-w-md rounded-2xl border bg-card/50 py-8">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FolderOpenIcon />
        </EmptyMedia>
        <EmptyTitle className="text-base">No active thread</EmptyTitle>
        <EmptyDescription>
          Select a repository or start a new agent session to begin coding.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button size="sm">New Thread</Button>
      </EmptyContent>
    </Empty>
  ),
  autocomplete: () => <AutocompletePreview />,
  command: () => <CommandPreview />,
  toast: () => <ToastPreview />,
};
