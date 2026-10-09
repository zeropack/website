import { mkdtemp, readFile, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import ts from "typescript";

const files = ["model.ts", "model.test.ts", "preview.ts", "preview.test.ts", "monday-replay.ts", "monday-replay.test.ts", "activity-types.ts", "activity-types.test.ts", "outlook-source.ts", "outlook-source.test.ts"];
const root = join(process.cwd(), "src/lib/integrations/activity-intelligence");
const temp = await mkdtemp(join(tmpdir(), "zp-activity-tests-"));
try {
  for (const name of files) {
    const source = await readFile(join(root, name), "utf8");
    const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText
      .replace(/from ["'](\.\/[^"']+)["']/g, (_match, p) => `from "${p}.mjs"`);
    await writeFile(join(temp, name.replace(/\.ts$/, ".mjs")), js);
  }
  execFileSync(process.execPath, ["--test", ...files.filter(x => x.endsWith(".test.ts")).map(x => join(temp, x.replace(/\.ts$/, ".mjs")))], { stdio: "inherit" });
} finally {
  await rm(temp, { recursive: true, force: true });
}
