export interface ThemePreset {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly swatch: string;
  readonly previewSurface: string;
}

export const THEME_PRESETS: ReadonlyArray<ThemePreset> = [
  {
    id: "default",
    label: "Default (Zinc)",
    description: "Neutral zinc & crisp cobalt accents with pure light/dark contrast.",
    swatch: "bg-[oklch(0.488_0.217_264)]",
    previewSurface: "bg-zinc-100 dark:bg-neutral-900",
  },
  {
    id: "t3-chat",
    label: "T3 Chat",
    description: "Rose vellum & plum ink signature palette from T3 Chat.",
    swatch: "bg-[oklch(0.591_0.218_0.58)]",
    previewSurface: "bg-[oklch(0.94_0.025_322)] dark:bg-[oklch(0.26_0.024_310)]",
  },
  {
    id: "grove",
    label: "Grove",
    description: "Forest drafting paper with calm botanical emerald highlights.",
    swatch: "bg-[oklch(0.523_0.112_158)]",
    previewSurface: "bg-[oklch(0.94_0.015_163)] dark:bg-[oklch(0.26_0.022_162)]",
  },
  {
    id: "ocean",
    label: "Ocean",
    description: "Marine cyanotype tones tuned for focused code review.",
    swatch: "bg-[oklch(0.537_0.12_247)]",
    previewSurface: "bg-[oklch(0.94_0.012_242)] dark:bg-[oklch(0.24_0.024_250)]",
  },
  {
    id: "ember",
    label: "Ember",
    description: "Warm copper drafting ink with soft amber highlights.",
    swatch: "bg-[oklch(0.553_0.129_44.6)]",
    previewSurface: "bg-[oklch(0.94_0.012_50)] dark:bg-[oklch(0.25_0.02_42)]",
  },
  {
    id: "iris",
    label: "Iris",
    description: "Violet archival paper balanced for deep night sessions.",
    swatch: "bg-[oklch(0.525_0.154_294)]",
    previewSurface: "bg-[oklch(0.94_0.015_300)] dark:bg-[oklch(0.24_0.03_294)]",
  },
];
