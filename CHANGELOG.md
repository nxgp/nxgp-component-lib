# @nxgp/component-lib

## 1.0.0

### Major

First stable release of the themeable React component library.

### Added

- **Core** — 40+ components: forms, layout, overlays, navigation, feedback (Radix + Tailwind v4)
- **Theming** — `ThemeProvider`, 4 built-in themes, semantic token architecture
- **@nxgp/component-lib/table** — `Table` primitives + `DataTable` (TanStack Table v8): sorting, filtering, pagination, selection, virtualization
- **@nxgp/component-lib/charts** — `ChartContainer`, tooltip/legend helpers (Recharts v3 composition)
- **@nxgp/component-lib/icons** — `Icon` wrapper + curated Lucide re-exports
- **Storybook docs** — Getting Started, Theming, Accessibility, Contributing, Theme Playground with CSS export
- **Quality** — 570+ tests, coverage thresholds, Lefthook hooks, CI + release workflows

### Dependencies

- Peer: `react`, `react-dom` `>=18`
- Runtime: `radix-ui`, `class-variance-authority`, `tailwind-merge`, `lucide-react`, `sonner`, `cmdk`, `react-day-picker`, `date-fns`
- Optional subpaths: `@tanstack/react-table`, `@tanstack/react-virtual`, `recharts`
