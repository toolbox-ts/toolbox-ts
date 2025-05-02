#!/usr/bin/env node

import { execSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";

interface ModuleDependency {
  dynamic: boolean;
  module: string;
  moduleSystem: string;
  exoticallyRequired: boolean;
  dependencyTypes: string[];
  resolved: string;
  coreModule: boolean;
  followable: boolean;
  couldNotResolve: boolean;
  matchesDoNotFollow: boolean;
  circular: boolean;
  valid: boolean;
}

interface Module {
  source: string;
  dependencies: ModuleDependency[];
}

interface Violation {
  type: string;
  from: string;
  to: string;
  rule: { severity: string; name: string };
}

interface Result {
  modules: Module[];
  violations: Violation[];
}

const formatViolations = (violations: Violation[]) => {
  const header = `[🚨] ${violations.length} Dependency Violations`;
  const violationsList = violations
    .map((v) => {
      const { type, from, to, rule } = v;
      const { severity, name } = rule;
      return `  [❌] ${type} from ${from} to ${to} (${severity}: ${name})`;
    })
    .join("\n");
  return `${header}\n${violationsList}`;
};

const SRC_PATTERN = "packages/**/src/*";
const CONFIG = ".dep-cruiser.cjs";
const DOCS_DIR = "./docs/dependencies";
const GRAPH_HTML = `${DOCS_DIR}/graph.html`;

function run(command: string) {
  console.log(`$ ${command}`);
  try {
    return execSync(command, { stdio: "pipe" }).toString();
  } catch (error) {
    console.error(`❌ Error executing command: ${command}`);
    process.exit(1);
  }
}

function validate() {
  console.log("🕵️ Validating dependencies...");
  const output = run(
    `pnpm execute depcruise ${SRC_PATTERN} --config ${CONFIG} --output-type json`,
  );
  const { violations } = JSON.parse(output) as Result;

  if (violations.length > 0) {
    console.error(formatViolations(violations));
    process.exit(1);
  } else {
    console.log("✅ No dependency violations found.");
  }
}

function generateGraph() {
  validate();
  console.log("📊 Generating dependency graph...");
  const graph = run(
    `pnpm execute depcruise ${SRC_PATTERN} --config ${CONFIG} --output-type dot | dot -T svg | depcruise-wrap-stream-in-html`,
  );

  writeFileSync(GRAPH_HTML, graph);
  console.log("✅ Dependency graph generated.");
}
const commands = { validate, generate: generateGraph } as const;

const input = process.argv[2];
if (!input || (input !== "validate" && input !== "generate")) {
  console.error('❌ No command provided. Use "validate" or "generate".');
  process.exit(1);
}
commands[input]();
