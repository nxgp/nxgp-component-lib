# Contributing to @nxgp/component-lib

## Development setup

```bash
pnpm install
pnpm storybook   # http://localhost:6006
pnpm test
pnpm build
```

## Versioning

New features use changesets per [docs/VERSIONING.md](docs/VERSIONING.md).

Registry setup: copy `.npmrc.example` to `~/.npmrc` or project `.npmrc` and set `GITHUB_TOKEN`.

## Releases

1. `pnpm changeset` — describe your change
2. Merge to main
3. `pnpm version-packages` — bumps version + CHANGELOG
4. `pnpm release` — build + publish to private registry

## Code style

- Biome for lint + format (`pnpm lint`, `pnpm lint:fix`) — strict rules, a11y lint on JSX
- TypeScript strict mode
- Conventional Commits recommended

## Testing

Every component requires heavy unit tests. See [docs/TESTING.md](docs/TESTING.md).

```bash
pnpm test              # all tests
pnpm test:coverage     # with coverage thresholds
pnpm test:component    # component tests only
```

## Git hooks (Lefthook)

Hooks run automatically after `pnpm install` (requires git repo):

| Hook | Action |
|------|--------|
| pre-commit | Biome check + format on staged files |
| pre-push | `pnpm lint` + `pnpm typecheck` + `pnpm test:coverage` |

Manual install: `lefthook install`
