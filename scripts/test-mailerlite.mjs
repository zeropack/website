import { mkdtemp, readFile, writeFile, mkdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { execFileSync } from "node:child_process";
import ts from "typescript";

const files = ["mailerlite/model.ts", "mailerlite/model.test.ts", "mailerlite/worker.ts", "mailerlite/worker.test.ts", "mailerlite/clients.ts", "mailerlite/clients.test.ts", "klaviyo-monday/config.ts"];
const temp = await mkdtemp(join(tmpdir(), "zp-mailerlite-tests-"));
try {
  for (const name of files) {
    const source = await readFile(join(process.cwd(), "src/lib/integrations", name), "utf8");
    const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText.replace(/from ["'](\.\.?\/[^"']+)["']/g, (_match, path) => `from "${path}.mjs"`);
    const output = join(temp, name.replace(/\.ts$/, ".mjs"));
    await mkdir(dirname(output), { recursive: true }); await writeFile(output, js);
  }
  execFileSync(process.execPath, ["--test", ...files.filter(x => x.endsWith(".test.ts")).map(x => join(temp, x.replace(/\.ts$/, ".mjs")))], { stdio: "inherit" });
} finally { await rm(temp, { recursive: true, force: true }); }
