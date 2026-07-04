const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const reportsDir = path.join(root, "reports");

const generatedHardFailPhrases = [
  "About-specific answers",
  "Blog-index answers",
  "Industry-hub answers",
  "Stainless-steel-specific answers",
  "answers for buyers checking"
];

const industriesBannedPhrase = "Share product form, grade, size, quantity and delivery location.";
const stainlessBannedPhrase = "enquiries by grade, size, finish, quantity and delivery location.";

const requiredIndustrySnippets = [
  "Commercial kitchen fabricators usually discuss SS 304 sheets",
  "Auto-component and engineering buyers may ask for rods",
  "Marine and coastal enquiries often involve SS 316"
];

const requiredStainlessSnippets = [
  "Welded and seamless pipe enquiries for fabrication",
  "Sheet enquiries for 2B, mirror, matt",
  "Round, square, hex or flat bar enquiries"
];

const requiredFaqIntros = {
  "about-us/index.html": "Answers to common questions about Bharat Metals, stainless steel grades, product forms, service regions and quotation support.",
  "industries-we-serve/index.html": "Answers to common questions about matching stainless steel grades, product forms, finishes and documents to industry applications.",
  "stainless-steel/index.html": "Answers to common stainless steel questions covering grades, forms, finishes, city enquiries and RFQ details.",
  "blog/index.html": "Answers to common questions about using Bharat Metals buyer guides before preparing a stainless steel RFQ.",
  "request-quote/index.html": "Answers to common RFQ questions for buyers sending stainless steel, aluminium, brass or copper requirements."
};

const popularSearchPages = [
  "index.html",
  "about-us/index.html",
  "request-quote/index.html",
  "blog/index.html",
  "stainless-steel/index.html",
  "industries-we-serve/index.html",
  "ss-304/index.html"
];

function rel(file) {
  return path.relative(root, file).replace(/\\/g, "/");
}

function readRel(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function htmlFiles() {
  const files = [];
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if ([".git", "node_modules", "reports", "qa", "archive", "docs"].includes(entry.name)) continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      if (entry.isFile() && entry.name.toLowerCase() === "index.html") files.push(full);
    }
  }
  walk(root);
  return files;
}

function popularSections(html) {
  return [...html.matchAll(/<section\b[^>]*class="[^"]*\bpopular-searches\b[^"]*"[^>]*>[\s\S]*?<\/section>/gi)].map((match) => match[0]);
}

function markerFromHome() {
  const html = readRel("index.html");
  return html.match(/<meta name="bharat-metals-build" content="([^"]+)">/)?.[1] || "";
}

function addError(errors, page, issue) {
  errors.push({ page, issue });
}

function run() {
  fs.mkdirSync(reportsDir, { recursive: true });
  const errors = [];
  const chipRows = [];

  const industryHtml = readRel("industries-we-serve/index.html");
  if (industryHtml.includes(industriesBannedPhrase)) addError(errors, "/industries-we-serve/", `contains banned phrase: ${industriesBannedPhrase}`);
  for (const snippet of requiredIndustrySnippets) {
    if (!industryHtml.includes(snippet)) addError(errors, "/industries-we-serve/", `missing required snippet: ${snippet}`);
  }

  const stainlessHtml = readRel("stainless-steel/index.html");
  if (stainlessHtml.includes(stainlessBannedPhrase)) addError(errors, "/stainless-steel/", `contains banned phrase: ${stainlessBannedPhrase}`);
  for (const snippet of requiredStainlessSnippets) {
    if (!stainlessHtml.includes(snippet)) addError(errors, "/stainless-steel/", `missing required snippet: ${snippet}`);
  }

  for (const file of htmlFiles()) {
    const html = fs.readFileSync(file, "utf8");
    for (const phrase of generatedHardFailPhrases) {
      if (html.includes(phrase)) addError(errors, `/${rel(file).replace(/index\.html$/, "")}`, `contains generated FAQ hard-fail phrase: ${phrase}`);
    }
    if (!/<meta name="bharat-metals-build" content="CORE-PATCH-HARDPASS-[^"]+">/.test(html)) {
      addError(errors, `/${rel(file).replace(/index\.html$/, "")}`, "missing CORE-PATCH-HARDPASS build meta marker");
    }
    if (!/<!-- Bharat Metals build: CORE-PATCH-HARDPASS-[\s\S]*? -->/.test(html)) {
      addError(errors, `/${rel(file).replace(/index\.html$/, "")}`, "missing CORE-PATCH-HARDPASS build comment marker");
    }
  }

  for (const [relativePath, intro] of Object.entries(requiredFaqIntros)) {
    const html = readRel(relativePath);
    if (!html.includes(intro)) addError(errors, `/${relativePath.replace(/index\.html$/, "")}`, `missing FAQ intro: ${intro}`);
  }

  for (const relativePath of popularSearchPages) {
    const html = readRel(relativePath);
    const sections = popularSections(html);
    const page = `/${relativePath.replace(/index\.html$/, "")}`;
    const row = {
      page,
      sections: sections.length,
      ulSearchChipGrid: html.includes('<ul class="search-chip-grid">'),
      liSearchChip: html.includes('<li class="search-chip">')
    };
    chipRows.push(row);
    if (sections.length === 0) addError(errors, page, "missing popular-searches section");
    sections.forEach((section, index) => {
      if (!section.includes('<ul class="search-chip-grid">')) addError(errors, page, `popular-searches section ${index + 1} missing literal ul.search-chip-grid`);
      if (!section.includes('<li class="search-chip">')) addError(errors, page, `popular-searches section ${index + 1} missing literal li.search-chip`);
    });
  }

  const cnamePath = path.join(root, "CNAME");
  if (fs.existsSync(cnamePath)) addError(errors, "/CNAME", "CNAME exists");

  const result = {
    checkedAt: new Date().toISOString(),
    buildMarker: markerFromHome(),
    totalHtmlFiles: htmlFiles().length,
    errors,
    chipRows,
    cnameAbsent: !fs.existsSync(cnamePath),
    noJekyllPresent: fs.existsSync(path.join(root, ".nojekyll"))
  };

  fs.writeFileSync(path.join(reportsDir, "core-patch-hard-check.json"), JSON.stringify(result, null, 2));

  const lines = [
    "# Core Patch Hard Check",
    "",
    `- Checked at: ${result.checkedAt}`,
    `- Build marker: ${result.buildMarker || "missing"}`,
    `- HTML files checked: ${result.totalHtmlFiles}`,
    `- CNAME absent: ${result.cnameAbsent ? "yes" : "no"}`,
    `- .nojekyll present: ${result.noJekyllPresent ? "yes" : "no"}`,
    `- Result: ${errors.length ? "FAIL" : "PASS"}`,
    "",
    "## Popular Search Raw HTML",
    "",
    "| Page | Sections | `<ul class=\"search-chip-grid\">` | `<li class=\"search-chip\">` |",
    "| --- | ---: | --- | --- |",
    ...chipRows.map((row) => `| ${row.page} | ${row.sections} | ${row.ulSearchChipGrid ? "yes" : "no"} | ${row.liSearchChip ? "yes" : "no"} |`),
    "",
    "## Errors",
    "",
    ...(errors.length ? errors.map((error) => `- ${error.page}: ${error.issue}`) : ["None."])
  ];
  fs.writeFileSync(path.join(reportsDir, "core-patch-hard-check.md"), `${lines.join("\n")}\n`);

  if (errors.length) {
    console.error(JSON.stringify(result, null, 2));
    process.exit(1);
  }
  console.log(JSON.stringify(result, null, 2));
}

run();
