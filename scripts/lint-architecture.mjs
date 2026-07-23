#!/usr/bin/env node
/**
 * Architecture guardrails for @nxgp/component-lib component code.
 * Run via: pnpm lint:architecture
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { exit } from "node:process";

const ROOT = join(import.meta.dirname, "..");
const SCAN_DIRS = ["src/components"];
const ARBITRARY_CLASS = /\b(min-h|min-w|max-h|max-w|w|h|text|px)-\[/;
const ALLOWED_INLINE = [/var\(--radix-/, /var\(--sidebar-/];
const LUCIDE_IMPORT = /from ["']lucide-react["']/;
const LUCIDE_ALLOW = ["src/lib/icons.tsx", "src/components/icons/", "src/assistant/"];
const OVERLAY_IMPORT =
  /from ["']\.\.\/(dialog|drawer|popover|alert-dialog|dropdown-menu|context-menu|tooltip|command)\//;
const PRIMITIVE_DIRS = new Set([
  "alert",
  "avatar",
  "badge",
  "breadcrumb",
  "button",
  "button-group",
  "checkbox",
  "collapsible",
  "input",
  "label",
  "progress",
  "radio-group",
  "separator",
  "skeleton",
  "switch",
  "textarea",
  "typography",
]);
const RAW_COLOR = /#[0-9a-fA-F]{3,8}|oklch\(/;
const APP_VAR_IN_TSX = /var\(--app-/;

const errors = [];

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      walk(full, files);
    } else if (
      /\.(tsx|ts)$/.test(entry) &&
      !entry.endsWith(".stories.tsx") &&
      !entry.endsWith(".stories.ts")
    ) {
      files.push(full);
    }
  }
  return files;
}

function rel(path) {
  return relative(ROOT, path);
}

function lineAllowed(line) {
  return ALLOWED_INLINE.some((pattern) => pattern.test(line));
}

for (const dir of SCAN_DIRS) {
  const fullDir = join(ROOT, dir);
  for (const file of walk(fullDir)) {
    const content = readFileSync(file, "utf8");
    const lines = content.split("\n");
    for (const line of lines) {
      if (ARBITRARY_CLASS.test(line) && !lineAllowed(line)) {
        errors.push(`arbitrary class in ${rel(file)}: ${line.trim()}`);
        break;
      }
      if (RAW_COLOR.test(line) && file.endsWith(".tsx")) {
        errors.push(`raw color in ${rel(file)}: ${line.trim()}`);
        break;
      }
      if (APP_VAR_IN_TSX.test(line) && file.endsWith(".tsx")) {
        errors.push(`var(--app-*) in ${rel(file)}: ${line.trim()}`);
        break;
      }
    }
  }
}

for (const dir of ["src"]) {
  const fullDir = join(ROOT, dir);
  for (const file of walk(fullDir)) {
    if (!LUCIDE_IMPORT.test(readFileSync(file, "utf8"))) {
      continue;
    }
    const path = rel(file);
    if (!LUCIDE_ALLOW.some((allowed) => path.startsWith(allowed))) {
      errors.push(`lucide-react import in ${path}`);
    }
  }
}

for (const file of walk(join(ROOT, "src/components"))) {
  const path = rel(file);
  const componentDir = path.split("/")[2];
  if (!componentDir || !PRIMITIVE_DIRS.has(componentDir)) {
    continue;
  }
  const content = readFileSync(file, "utf8");
  if (OVERLAY_IMPORT.test(content)) {
    errors.push(`primitive ${componentDir} imports overlay module in ${path}`);
  }
}

if (errors.length) {
  process.stderr.write(
    `Architecture lint failed:\n\n${errors.map((error) => `  ✗ ${error}`).join("\n")}\n`,
  );
  exit(1);
}

process.stdout.write("Architecture lint passed.\n");
