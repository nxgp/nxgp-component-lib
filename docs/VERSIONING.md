# Versioning & releases

`@nxgp/component-lib` follows [Semantic Versioning](https://semver.org/).

## Version policy

| Bump | When |
|------|------|
| **Major** | Breaking public API, token renames, removed exports, React peer floor increase |
| **Minor** | New components, new optional props, new subpath exports |
| **Patch** | Bug fixes, docs, internal refactors with no API change |

## Public API surface

- Main entry `@nxgp/component-lib` — all `src/components` exports + theme utilities
- Subpaths: `@nxgp/component-lib/table`, `@nxgp/component-lib/charts`, `@nxgp/component-lib/icons`
- Styles: `@nxgp/component-lib/styles.css`, `@nxgp/component-lib/tailwind`

Breaking changes require a major version and a migration note in `CHANGELOG.md`.

## Pre-1.0 history

Development progressed through phased delivery (Phases 0–7). **1.0.0** is the first stable public release with the full component catalog documented in Storybook.

## Upgrading to 1.0

1. Install `@nxgp/component-lib@1.0.0` and peer dependencies.
2. Import `@nxgp/component-lib/styles.css` once at the app root.
3. Wrap the app in `ThemeProvider`.
4. For Tailwind v4 apps, add `@import "@nxgp/component-lib/tailwind"` to your CSS entry.

No codemods are required for greenfield consumers.

## Release process

1. Contributors add changesets: `pnpm changeset`
2. Merge to `main`
3. GitHub Actions **Release** workflow (Changesets) opens a Version Packages PR or publishes when configured
4. `pnpm version-packages` updates `package.json`, `CHANGELOG.md`, and `VERSION`
5. `pnpm release` builds and publishes to GitHub Packages (`publishConfig.registry`)

### Registry authentication

```bash
# ~/.npmrc
@nxgp:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

## Changelog

All user-facing changes are recorded in [CHANGELOG.md](../CHANGELOG.md) via Changesets.
