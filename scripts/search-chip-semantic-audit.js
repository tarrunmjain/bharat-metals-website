const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const reportsDir = path.join(root, "reports");
const skipDirs = new Set([".git", "assets", "node_modules", "qa", "reports", "src"]);
const samplePages = [
  "/",
  "/about-us/",
  "/request-quote/",
  "/blog/",
  "/ss-304/",
  "/stainless-steel/",
  "/industries-we-serve/",
  "/stainless-steel-suppliers-renigunta/"
];

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!skipDirs.has(entry.name)) walk(path.join(dir, entry.name), out);
    } else if (entry.name.endsWith(".html")) {
      out.push(path.join(dir, entry.name));
    }
  }
  return out;
}

function rel(file) {
  return path.relative(root, file).replace(/\\/g, "/");
}

function pageFile(pagePath) {
  if (pagePath === "/") return path.join(root, "index.html");
  return path.join(root, pagePath.replace(/^\//, "").replace(/\/$/, ""), "index.html");
}

function stripTags(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function hasClass(classValue, className) {
  return classValue.split(/\s+/).includes(className);
}

function elementsWithClass(html, className) {
  return [...html.matchAll(/<([a-z0-9]+)\b[^>]*class="([^"]*)"[^>]*>/gi)].filter((match) => hasClass(match[2], className));
}

function findPopularSections(html) {
  return [...html.matchAll(/<section\b[^>]*class="[^"]*\bpopular-searches\b[^"]*"[^>]*>[\s\S]*?<\/section>/gi)].map((match) => match[0]);
}

function auditSection(section) {
  const ulMatch = section.match(/<ul\b[^>]*class="[^"]*\bsearch-chip-grid\b[^"]*"[^>]*>([\s\S]*?)<\/ul>/i);
  const wrongGridTag = /<(div|ol)\b[^>]*class="[^"]*\bsearch-chip-grid\b[^"]*"/i.test(section);
  const chipTagMatches = elementsWithClass(section, "search-chip");
  const liCount = chipTagMatches.filter((match) => match[1].toLowerCase() === "li").length;
  const nonLiChipCount = chipTagMatches.length - liCount;
  const paragraphRuns = [...section.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)]
    .map((match) => stripTags(match[1]))
    .filter((text) => text.length > 220 && /(stainless|SS|Bharat|Jindal|aluminium|brass|copper)/i.test(text));

  const failures = [];
  if (!ulMatch) failures.push("missing ul.search-chip-grid");
  if (wrongGridTag) failures.push("search-chip-grid uses non-ul tag");
  if (liCount === 0) failures.push("missing li.search-chip elements");
  if (nonLiChipCount > 0) failures.push("search chips use non-li elements");
  if (paragraphRuns.length > 0) failures.push("long keyword-like paragraph in popular-searches");

  return {
    hasUlGrid: Boolean(ulMatch),
    liCount,
    nonLiChipCount,
    paragraphRuns: paragraphRuns.length,
    pass: failures.length === 0,
    failures
  };
}

function auditFile(file) {
  const html = fs.readFileSync(file, "utf8");
  const sections = findPopularSections(html);
  const sectionAudits = sections.map(auditSection);
  const failures = [];
  if (sections.length === 0) return { file: rel(file), sections: 0, liCount: 0, pass: true, failures };
  sectionAudits.forEach((audit, index) => {
    if (!audit.pass) failures.push(`section ${index + 1}: ${audit.failures.join(", ")}`);
  });
  return {
    file: rel(file),
    sections: sections.length,
    liCount: sectionAudits.reduce((sum, audit) => sum + audit.liCount, 0),
    pass: failures.length === 0,
    failures
  };
}

function auditAllGrids(files) {
  const failures = [];
  for (const file of files) {
    const html = fs.readFileSync(file, "utf8");
    const grids = [...html.matchAll(/<([a-z0-9]+)\b[^>]*class="[^"]*\bsearch-chip-grid\b[^"]*"[^>]*>([\s\S]*?)<\/\1>/gi)];
    grids.forEach((grid, index) => {
      const tag = grid[1].toLowerCase();
      const liCount = elementsWithClass(grid[2], "search-chip").filter((match) => match[1].toLowerCase() === "li").length;
      if (tag !== "ul") failures.push(`${rel(file)} grid ${index + 1}: expected ul, found ${tag}`);
      if (liCount === 0) failures.push(`${rel(file)} grid ${index + 1}: missing li.search-chip`);
    });
  }
  return failures;
}

function main() {
  fs.mkdirSync(reportsDir, { recursive: true });
  const files = walk(root);
  const pageRows = files.map(auditFile);
  const failures = pageRows.flatMap((row) => row.failures.map((failure) => `${row.file}: ${failure}`));
  failures.push(...auditAllGrids(files));

  const sampleRows = samplePages.map((pagePath) => {
    const file = pageFile(pagePath);
    if (!fs.existsSync(file)) return { pagePath, sections: 0, liCount: 0, pass: false, failures: ["file missing"] };
    const audit = auditFile(file);
    return { pagePath, sections: audit.sections, liCount: audit.liCount, pass: audit.pass && audit.sections > 0, failures: audit.failures };
  });
  sampleRows.forEach((row) => {
    if (!row.pass) failures.push(`${row.pagePath}: ${row.failures.join(", ") || "missing popular-searches section"}`);
  });

  const popularRows = pageRows.filter((row) => row.sections > 0);
  const lines = [
    "# Search Chip Semantic Audit",
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
    "## Summary",
    "",
    `- HTML files checked: ${files.length}`,
    `- Pages with popular search sections: ${popularRows.length}`,
    `- Popular search sections checked: ${popularRows.reduce((sum, row) => sum + row.sections, 0)}`,
    `- Semantic failures: ${failures.length}`,
    "",
    "## Sample Pages",
    "",
    "| Page | Popular sections | li.search-chip count | Status |",
    "| --- | ---: | ---: | --- |",
    ...sampleRows.map((row) => `| ${row.pagePath} | ${row.sections} | ${row.liCount} | ${row.pass ? "PASS" : "FAIL"} |`),
    "",
    "## Rules Checked",
    "",
    "- Every `.popular-searches` section contains `ul.search-chip-grid`.",
    "- Every `.search-chip-grid` uses `li.search-chip` elements.",
    "- No popular search chip grid uses `span` or `div` chip elements.",
    "- No popular search section uses a long keyword-like paragraph as the chip list.",
    "",
    "## Failures",
    "",
    failures.length ? failures.map((failure) => `- ${failure}`).join("\n") : "None."
  ];

  fs.writeFileSync(path.join(reportsDir, "search-chip-semantic-audit.md"), `${lines.join("\n")}\n`);
  console.log(JSON.stringify({ files: files.length, popularPages: popularRows.length, failures }, null, 2));
  if (failures.length) process.exit(1);
}

main();
