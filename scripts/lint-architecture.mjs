import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const srcRoot = path.join(root, "src");

function collectFiles(dir, files = []) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (entry.name.startsWith(".")) continue;
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) collectFiles(full, files);
        else if (/\.(ts|tsx)$/.test(entry.name)) files.push(full);
    }
    return files;
}

function getImports(content) {
    const imports = [];
    const regex = /from\s+["']([^"']+)["']|import\s+["']([^"']+)["']/g;
    let m;
    while ((m = regex.exec(content))) imports.push(m[1] || m[2]);
    return imports;
}

function resolveImport(file, spec) {
    if (spec.startsWith("@hook/")) return path.join(srcRoot, "hook", spec.slice(6));
    if (spec.startsWith("@view/")) return path.join(srcRoot, "view", spec.slice(6));
    if (spec.startsWith(".")) return path.resolve(path.dirname(file), spec);
    return null;
}

const files = collectFiles(srcRoot);
const errors = [];

for (const file of files) {
    const rel = path.relative(srcRoot, file).replaceAll(path.sep, "/");
    const content = fs.readFileSync(file, "utf8");
    const imports = getImports(content);

    for (const spec of imports) {
        const resolved = resolveImport(file, spec);
        const resolvedRel = resolved
            ? path.relative(srcRoot, resolved).replaceAll(path.sep, "/")
            : null;

        if (rel.startsWith("hook/") && resolvedRel?.startsWith("view/")) {
            errors.push(`${rel}: hook -> view is forbidden (${spec})`);
        }

        if (rel.startsWith("view/")) {
            const viewFeature = rel.split("/")[1];
            if (resolvedRel?.startsWith("hook/")) {
                const hookFeature = resolvedRel.split("/")[1];
                const isBridge = hookFeature === "bridge" || hookFeature === "protocol";
                if (hookFeature !== viewFeature && !isBridge) {
                    errors.push(
                        `${rel}: cross-feature view -> hook is forbidden (${spec}); use bridge/protocol layer`,
                    );
                }
            }
        }
    }
}

if (errors.length) {
    console.error("Architecture lint failed:\n" + errors.map((e) => `- ${e}`).join("\n"));
    process.exit(1);
}

console.log("Architecture lint passed.");
