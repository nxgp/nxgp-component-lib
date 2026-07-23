# Testing Standards — @nxgp/component-lib

> Every component ships with **heavy unit tests** covering edge cases, accessibility, and reliability.
> Tests are enforced locally via **Lefthook** (pre-push) and in **CI**.

---

## Tooling

| Tool | Role |
|------|------|
| **Vitest** | Test runner (jsdom environment) |
| **Testing Library** | User-centric queries (`getByRole`, etc.) |
| **user-event** | Realistic keyboard/pointer interactions |
| **vitest-axe** | Automated accessibility checks per component |
| **Biome** | Lint + format (pre-commit on staged files) |
| **Lefthook** | Git hooks orchestration |

---

## Git hooks (Lefthook)

Configured in [lefthook.yml](../lefthook.yml):

| Hook | Runs | Purpose |
|------|------|---------|
| **pre-commit** | `biome check --write` on staged files | Format + lint fixes before commit |
| **pre-push** | `pnpm lint` + `pnpm typecheck` + `pnpm test:coverage` | Block push if quality gates fail |

### Setup

```bash
pnpm install          # runs `lefthook install` via prepare script
lefthook install      # manual reinstall if needed
```

Requires a git repository. Run `git init` if hooks are not installed.

---

## Commands

```bash
pnpm test              # run all tests once
pnpm test:watch        # watch mode during development
pnpm test:coverage     # run with coverage report + thresholds
pnpm test:component    # run only src/components/**/*.test.tsx
```

---

## File placement

| Location | Purpose |
|----------|---------|
| `src/components/<name>/<name>.test.tsx` | **Component tests** (required, co-located) |
| `tests/smoke.test.tsx` | Cross-module integration smoke tests |
| `tests/utils/` | Shared render helpers, a11y utilities |

---

## Required test categories (every component)

Use `describe` blocks matching these categories. Skip only what genuinely does not apply (document why in a comment).

### 1. Rendering

- Default render (smoke)
- All variants / sizes / intents (CVA matrix)
- Custom `className` merge (does not drop base classes)
- Empty / undefined optional props
- Children rendering (if applicable)
- `asChild` renders correct element (interactive components)

### 2. Props & state edge cases

- `disabled` / `readOnly` / `aria-disabled` behavior
- Controlled vs uncontrolled value changes
- Invalid prop combinations (e.g. `disabled` + `loading`)
- `ref` forwarding (`ref` attaches to correct DOM node)
- Default prop values

### 3. Interactions (user-event)

- Click / tap
- Keyboard: `Enter`, `Space`, `Escape`, arrow keys, `Tab` focus
- Focus management (trap, restore, roving tabindex)
- Form submission / reset (form components)
- Callbacks: called with correct args; not called when disabled

### 4. Accessibility

- `expectNoA11yViolations(container)` — axe scan, zero violations
- Correct ARIA roles, labels, `aria-*` attributes
- `aria-labelledby` / `aria-describedby` wiring
- Visible focus indicator (`:focus-visible` — class or style present)
- `prefers-reduced-motion` respected where animations exist

### 5. Reliability

- Re-render with new props does not throw
- Multiple mount/unmount cycles (no leaks — use cleanup)
- Consistent output for same props (snapshot optional, prefer explicit assertions)
- Error boundaries: component does not throw on edge prop values

---

## Coverage targets

| Scope | Lines | Branches | Functions |
|-------|-------|----------|-----------|
| **Per component file** (`src/components/**`) | ≥ 95% | ≥ 90% | ≥ 95% |
| **Library overall** (`src/**`) | ≥ 80% | ≥ 75% | ≥ 80% |

Enforced via `vitest.config.ts` thresholds on `pnpm test:coverage`.

Stubs are excluded from coverage (`src/docs/**`, fixtures, index barrels).

---

## Test utilities

### `renderWithProviders`

```tsx
import { renderWithProviders, userEvent } from "../../../tests/utils";

const { getByRole } = renderWithProviders(<Button>Save</Button>);
await userEvent.click(getByRole("button", { name: "Save" }));
```

Extend `TestProviders` in [tests/utils/render.tsx](../tests/utils/render.tsx) — already wraps `ThemeProvider`.

### `expectNoA11yViolations`

```tsx
import { expectNoA11yViolations, renderWithProviders } from "../../../tests/utils";

it("has no axe violations", async () => {
  const { container } = renderWithProviders(<Button>Click</Button>);
  await expectNoA11yViolations(container);
});
```

---

## Example: reference implementation

See [src/components/button/button.test.tsx](../src/components/button/button.test.tsx) for the baseline pattern (rendering, a11y, reliability).

Phase 2 components (Button, Input, etc.) must exceed this baseline with full interaction + variant matrix tests.

---

## Component test checklist (copy for PRs / agent handoff)

```markdown
- [ ] Rendering: default + all variants
- [ ] className merge edge cases
- [ ] ref forwarding (if interactive)
- [ ] asChild (if supported)
- [ ] disabled / loading states
- [ ] keyboard interactions (user-event)
- [ ] axe: zero violations
- [ ] ARIA attributes asserted explicitly
- [ ] re-render / remount reliability
- [ ] coverage ≥ 95% lines on component file
```

---

## CI alignment

GitHub Actions runs the same gates as pre-push:

`pnpm lint → pnpm typecheck → pnpm test:coverage → pnpm build → pnpm build-storybook`
