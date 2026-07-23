import { exit, stderr, stdout } from "node:process";
import { createParser } from "@openuidev/react-lang";
import { kitOpenUILibrary } from "../src/openui/library";
import { openUIFixtures } from "../src/openui/openui.fixtures";

const parser = createParser(kitOpenUILibrary.toJSONSchema());
let failed = 0;

for (const [id, { source }] of Object.entries(openUIFixtures)) {
  const result = parser.parse(source);
  const { errors, unresolved, orphaned, incomplete, statementCount } = result.meta;
  const ok = errors.length === 0 && unresolved.length === 0 && orphaned.length === 0 && !incomplete;
  stdout.write(
    `${ok ? "OK  " : "FAIL"} ${id} — ${statementCount} statements${
      ok
        ? ""
        : `\n     errors=${JSON.stringify(errors)}\n     unresolved=${JSON.stringify(unresolved)}\n     orphaned=${JSON.stringify(orphaned)}\n     incomplete=${incomplete}`
    }\n`,
  );
  if (!ok) failed += 1;
}

if (failed > 0) {
  stderr.write(`\n${failed} fixture(s) failed\n`);
  exit(1);
}
stdout.write("\nAll fixtures parse cleanly.\n");
