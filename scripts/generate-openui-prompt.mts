/**
 * Regenerate the committed OpenUI LLM artifacts from the kit library:
 *   - src/openui/generated/system-prompt.txt  (drop into an LLM system message)
 *   - src/openui/generated/component-spec.json (library JSON schema)
 *
 * Run with: pnpm openui:generate
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { stdout } from "node:process";
import { fileURLToPath } from "node:url";
import { kitOpenUILibrary } from "../src/openui/library";
import { buildOpenUISystemPrompt } from "../src/openui/prompt";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(here, "../src/openui/generated");
mkdirSync(outDir, { recursive: true });

const systemPrompt = buildOpenUISystemPrompt();
const componentSpec = kitOpenUILibrary.toJSONSchema();

writeFileSync(resolve(outDir, "system-prompt.txt"), `${systemPrompt}\n`, "utf8");
writeFileSync(
  resolve(outDir, "component-spec.json"),
  `${JSON.stringify(componentSpec, null, 2)}\n`,
  "utf8",
);

stdout.write(`Wrote system-prompt.txt (${systemPrompt.length} chars)\n`);
stdout.write(
  `Wrote component-spec.json (${Object.keys(componentSpec.properties ?? {}).length} components)\n`,
);
