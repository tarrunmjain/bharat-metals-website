const fs = require("fs");
const path = require("path");
const https = require("https");

const root = path.resolve(__dirname, "..");
const reportsDir = path.join(root, "reports");
const mode = process.argv.includes("--snapshot-before") ? "before" : process.argv.includes("--live") ? "live" : "final";
const checkedAt = new Date().toISOString();
const samplePaths = ["", "ss-304/", "stainless-steel-rods/", "stainless-steel-bars/", "stainless-steel-suppliers-renigunta/", "industries/automobile-auto-components/"];
const previewBase = "https://tarrunmjain.github.io/bharat-metals-website/";
const expectedCname = "www.stainlesssteeldealers.com";

function cnameStatus() {
  const cnamePath = path.join(root, "CNAME");
  const present = fs.existsSync(cnamePath);
  const value = present ? fs.readFileSync(cnamePath, "utf8").trim() : "";
  return { present, value, expected: expectedCname, correct: present && value === expectedCname };
}

const bannedPhrases = [
  "Open SS",
  "where generated",
  "supply notes for buyers specifying",
  "Direct city-product pages",
  "Short answers for procurement teams",
  "Common buyer groups for",
  "Related city pages for buyers comparing dispatch options",
  "Use nearby location pages when a buyer is comparing",
  "Practical answers for buyers checking this specific requirement",
  "These searches reflect how buyers usually describe"
];

const requiredSs304CityText = "SS 304 enquiries are commonly reviewed for Chennai, Ambattur, Sriperumbudur, Oragadam, Coimbatore, Hosur, Trichy, Madurai, Salem, Pondicherry, Sricity, Tada, Renigunta and Tirupati buyers. The links below help buyers open relevant city or grade-location pages before sending product form, size, finish, quantity and delivery details.";
const requiredReniguntaText = "Renigunta is closely connected to Tirupati, Sricity, Tada and Chennai-side industrial movement, making it a practical enquiry location for buyers who need stainless steel materials dispatched from Chennai. Bharat Metals can review stainless steel requirements for Renigunta fabricators, maintenance buyers, pharma and industrial users, traders and contractors when grade, size, quantity and delivery location are clear. Common enquiries may include SS 304 and SS 316 welded pipes, seamless pipe enquiries, sheets, plates, rods, fasteners, fittings and perforated sheets.";
const automobileTerms = ["Chennai", "Ambattur", "Sriperumbudur", "Oragadam", "Irungattukottai", "Hosur", "rods", "bars", "sheets", "plates", "fasteners", "fixtures", "auto-component suppliers"];

function ensureReportsDir() {
  fs.mkdirSync(reportsDir, { recursive: true });
}

function rel(file) {
  return path.relative(root, file).replace(/\\/g, "/");
}

function walkHtml(dir = root, out = []) {
  const skip = new Set([".git", "reports", "docs", "archive", "scripts", "node_modules"]);
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skip.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkHtml(full, out);
    if (entry.isFile() && entry.name.toLowerCase().endsWith(".html")) out.push(full);
  }
  return out;
}

function stripVisibleText(html) {
  return html
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<svg\b[\s\S]*?<\/svg>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function countOccurrences(haystack, needle) {
  if (!needle) return 0;
  let count = 0;
  let index = 0;
  while ((index = haystack.indexOf(needle, index)) !== -1) {
    count += 1;
    index += needle.length;
  }
  return count;
}

function phraseScan(files) {
  const rows = [];
  for (const phrase of bannedPhrases) {
    let count = 0;
    const sampleFiles = [];
    for (const file of files) {
      const html = fs.readFileSync(file, "utf8");
      const visible = stripVisibleText(html);
      const hits = countOccurrences(visible, phrase);
      if (hits) {
        count += hits;
        if (sampleFiles.length < 5) sampleFiles.push(rel(file));
      }
    }
    rows.push({ phrase, count, sampleFiles });
  }
  return rows;
}

function readBeforeRows() {
  const beforePath = path.join(reportsDir, "hard-fail-phrase-before.json");
  if (!fs.existsSync(beforePath)) return null;
  return JSON.parse(fs.readFileSync(beforePath, "utf8"));
}

function writeHardFailPhraseReport(beforeRows, afterRows) {
  const beforeMap = new Map((beforeRows || []).map((row) => [row.phrase, row]));
  const lines = [
    "# Hard Fail Phrase Check",
    "",
    `Checked: ${checkedAt}`,
    "",
    "Generated HTML only. Reports, docs, archive and scripts are excluded.",
    "",
    "| Phrase | Count before | Sample files before | Count after | Pass/fail |",
    "|---|---:|---|---:|---|"
  ];
  for (const row of afterRows) {
    const before = beforeMap.get(row.phrase) || { count: row.count, sampleFiles: row.sampleFiles };
    lines.push(`| ${row.phrase} | ${before.count} | ${(before.sampleFiles || []).join("<br>") || "-"} | ${row.count} | ${row.count === 0 ? "PASS" : "FAIL"} |`);
  }
  fs.writeFileSync(path.join(reportsDir, "hard-fail-phrase-check.md"), lines.join("\n") + "\n");
}

function popularSections(html) {
  return [...html.matchAll(/<section\b[^>]*class="[^"]*popular-searches[^"]*"[\s\S]*?<\/section>/gi)].map((match) => match[0]);
}

function checkPopular(files) {
  const rows = [];
  const failures = [];
  for (const file of files) {
    const html = fs.readFileSync(file, "utf8");
    const sections = popularSections(html);
    if (!sections.length) continue;
    sections.forEach((section, index) => {
      const hasGrid = /class="[^"]*search-chip-grid[^"]*"/i.test(section);
      const chipCount = [...section.matchAll(/class="[^"]*search-chip[^"]*"/gi)].length;
      const paragraphText = [...section.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)].map((m) => stripVisibleText(m[1])).join(" ");
      const flatParagraphLikely = chipCount < 4 && paragraphText.split(/,|\s{2,}|\|/).filter(Boolean).length >= 4;
      const pass = hasGrid && chipCount >= 4 && !flatParagraphLikely;
      const row = { file: rel(file), section: index + 1, hasGrid, chipCount, flatParagraphLikely, pass };
      rows.push(row);
      if (!pass) failures.push(row);
    });
  }
  return { rows, failures };
}

function writePopularReport(popular) {
  const lines = [
    "# Popular Search DOM Check",
    "",
    `Checked: ${checkedAt}`,
    "",
    `Popular search sections checked: ${popular.rows.length}`,
    `Failures: ${popular.failures.length}`,
    "",
    "| File | Section | Grid found | Search chips | Flat paragraph risk | Result |",
    "|---|---:|---|---:|---|---|"
  ];
  for (const row of popular.rows) {
    lines.push(`| ${row.file} | ${row.section} | ${row.hasGrid ? "yes" : "no"} | ${row.chipCount} | ${row.flatParagraphLikely ? "yes" : "no"} | ${row.pass ? "PASS" : "FAIL"} |`);
  }
  fs.writeFileSync(path.join(reportsDir, "popular-search-dom-check.md"), lines.join("\n") + "\n");
}

function markerValues(html) {
  return [...html.matchAll(/bharat-metals-build" content="([^"]+)"/gi)].map((m) => m[1]);
}

function sectionAfterHeading(html, heading) {
  const headingIndex = html.indexOf(heading);
  if (headingIndex === -1) return "";
  const sectionStart = html.lastIndexOf("<section", headingIndex);
  const sectionEnd = html.indexOf("</section>", headingIndex);
  if (sectionStart === -1 || sectionEnd === -1) return "";
  return html.slice(sectionStart, sectionEnd + "</section>".length);
}

function duplicateHrefs(sectionHtml) {
  const hrefs = [...sectionHtml.matchAll(/<a\b[^>]*href="([^"]+)"/gi)].map((m) => m[1]);
  const seen = new Set();
  const duplicates = [];
  for (const href of hrefs) {
    if (seen.has(href) && !duplicates.includes(href)) duplicates.push(href);
    seen.add(href);
  }
  return duplicates;
}

function localSpecificChecks() {
  const checks = [];
  function page(slug) {
    return fs.readFileSync(path.join(root, slug, "index.html"), "utf8");
  }
  const home = fs.readFileSync(path.join(root, "index.html"), "utf8");
  const ss304 = page("ss-304");
  const rods = page("stainless-steel-rods");
  const bars = page("stainless-steel-bars");
  const renigunta = page("stainless-steel-suppliers-renigunta");
  const automobile = page(path.join("industries", "automobile-auto-components"));
  const sampleHtml = { "index.html": home, "ss-304/index.html": ss304, "stainless-steel-rods/index.html": rods, "stainless-steel-bars/index.html": bars, "stainless-steel-suppliers-renigunta/index.html": renigunta, "industries/automobile-auto-components/index.html": automobile };

  for (const [name, html] of Object.entries(sampleHtml)) {
    checks.push({ name: `${name} has build marker`, pass: markerValues(html).length > 0 });
  }
  checks.push({ name: "SS 304 exact city paragraph present", pass: ss304.includes(requiredSs304CityText) });
  checks.push({ name: "SS 304 no Open SS 304", pass: !stripVisibleText(ss304).includes("Open SS 304") });
  checks.push({ name: "Rods no supply notes phrase", pass: !stripVisibleText(rods).includes("supply notes for buyers specifying") });
  checks.push({ name: "Rods no Direct city-product pages", pass: !stripVisibleText(rods).includes("Direct city-product pages") });
  checks.push({ name: "Bars no supply notes phrase", pass: !stripVisibleText(bars).includes("supply notes for buyers specifying") });
  checks.push({ name: "Renigunta exact paragraph present", pass: renigunta.includes(requiredReniguntaText) });
  const reniguntaRelated = sectionAfterHeading(renigunta, "Popular stainless steel products for Renigunta");
  const reniguntaDuplicates = duplicateHrefs(reniguntaRelated);
  checks.push({ name: "Renigunta related products no duplicate hrefs", pass: reniguntaDuplicates.length === 0, details: reniguntaDuplicates });
  const footer = renigunta.match(/<footer\b[\s\S]*?<\/footer>/i)?.[0] || "";
  const sitemapFooterCount = [...footer.matchAll(/>Sitemap<\/a>/g)].length;
  checks.push({ name: "Footer has Sitemap only once", pass: sitemapFooterCount === 1, details: { sitemapFooterCount } });
  for (const term of automobileTerms) {
    checks.push({ name: `Automobile page contains ${term}`, pass: stripVisibleText(automobile).includes(term) });
  }
  const cname = cnameStatus();
  checks.push({ name: "CNAME present and correct", pass: cname.correct, details: cname });
  return checks;
}

function writeAcceptanceReports(result) {
  fs.writeFileSync(path.join(reportsDir, "acceptance-hard-check.json"), JSON.stringify(result, null, 2) + "\n");
  const lines = [
    "# Acceptance Hard Check",
    "",
    `Checked: ${checkedAt}`,
    "",
    `HTML files checked: ${result.htmlFiles}`,
    `Build markers found: ${result.buildMarkers.join(", ") || "none"}`,
    `Errors: ${result.errors.length}`,
    "",
    "## Specific Checks",
    "",
    "| Check | Result | Details |",
    "|---|---|---|"
  ];
  for (const check of result.specificChecks) {
    lines.push(`| ${check.name} | ${check.pass ? "PASS" : "FAIL"} | ${check.details ? JSON.stringify(check.details) : "-"} |`);
  }
  lines.push("", "## Banned Phrase Counts", "", "| Phrase | Count | Samples |", "|---|---:|---|");
  for (const row of result.bannedPhrases) {
    lines.push(`| ${row.phrase} | ${row.count} | ${row.sampleFiles.join("<br>") || "-"} |`);
  }
  lines.push("", "## Popular Search DOM", "", `Sections checked: ${result.popularSearch.sectionsChecked}`, `Failures: ${result.popularSearch.failures.length}`);
  fs.writeFileSync(path.join(reportsDir, "acceptance-hard-check.md"), lines.join("\n") + "\n");
}

function runLocalFinal() {
  ensureReportsDir();
  const files = walkHtml();
  const phrases = phraseScan(files);
  const beforeRows = readBeforeRows() || phrases;
  writeHardFailPhraseReport(beforeRows, phrases);
  const popular = checkPopular(files);
  writePopularReport(popular);
  const allMarkers = new Set();
  for (const file of files) {
    for (const marker of markerValues(fs.readFileSync(file, "utf8"))) allMarkers.add(marker);
  }
  const specificChecks = localSpecificChecks();
  const errors = [];
  for (const row of phrases) if (row.count > 0) errors.push(`Banned phrase present: ${row.phrase}`);
  for (const failure of popular.failures) errors.push(`Popular search DOM failure: ${failure.file} section ${failure.section}`);
  for (const check of specificChecks) if (!check.pass) errors.push(`Specific check failed: ${check.name}`);
  if (!allMarkers.size) errors.push("No build markers found in generated HTML");
  const result = {
    checkedAt,
    htmlFiles: files.length,
    buildMarkers: [...allMarkers].sort(),
    bannedPhrases: phrases,
    popularSearch: { sectionsChecked: popular.rows.length, failures: popular.failures },
    specificChecks,
    errors
  };
  writeAcceptanceReports(result);
  if (errors.length) {
    console.error(JSON.stringify(result, null, 2));
    process.exit(1);
  }
  console.log(JSON.stringify({ htmlFiles: files.length, buildMarkers: result.buildMarkers, errors: [] }, null, 2));
}

function runBeforeSnapshot() {
  ensureReportsDir();
  const files = walkHtml();
  const rows = phraseScan(files);
  fs.writeFileSync(path.join(reportsDir, "hard-fail-phrase-before.json"), JSON.stringify(rows, null, 2) + "\n");
  writeHardFailPhraseReport(rows, rows);
  console.log(JSON.stringify({ mode: "before", htmlFiles: files.length, rows }, null, 2));
}

function fetchUrl(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { "User-Agent": "BharatMetalsAcceptanceCheck/1.0" } }, (res) => {
      let body = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => resolve({ url, status: res.statusCode, body }));
    }).on("error", (error) => resolve({ url, status: "ERROR", body: "", error: error.message }));
  });
}

async function runLive() {
  ensureReportsDir();
  const rows = [];
  for (const samplePath of samplePaths) {
    const url = previewBase + samplePath;
    const response = await fetchUrl(url);
    const html = response.body || "";
    const visible = stripVisibleText(html);
    const markers = markerValues(html);
    const bannedHits = bannedPhrases.filter((phrase) => visible.includes(phrase));
    const sections = popularSections(html);
    const popularOk = sections.length > 0 && sections.every((section) => /class="[^"]*search-chip-grid[^"]*"/i.test(section) && [...section.matchAll(/class="[^"]*search-chip[^"]*"/gi)].length >= 4);
    const pass = response.status === 200 && markers.length > 0 && bannedHits.length === 0 && popularOk;
    rows.push({ url, status: response.status, buildMarkerFound: markers.length > 0, deployedBuildMarkers: markers, bannedPhrasesFound: bannedHits, popularSearchChipMarkupFound: popularOk, pass, error: response.error || null });
  }
  const markerLines = [
    "# Live Deployment Marker Check",
    "",
    `Checked: ${checkedAt}`,
    "",
    "| URL | HTTP status | Build marker found | Deployed build marker |",
    "|---|---:|---|---|"
  ];
  for (const row of rows) markerLines.push(`| ${row.url} | ${row.status} | ${row.buildMarkerFound ? "yes" : "no"} | ${row.deployedBuildMarkers.join(", ") || "-"} |`);
  fs.writeFileSync(path.join(reportsDir, "live-deployment-marker-check.md"), markerLines.join("\n") + "\n");

  const postLines = [
    "# Live Post Deploy Acceptance Check",
    "",
    `Checked: ${checkedAt}`,
    "",
    "| URL | HTTP status | Build marker found | Banned phrases found | Popular search chip markup found | Pass/fail |",
    "|---|---:|---|---|---|---|"
  ];
  for (const row of rows) {
    postLines.push(`| ${row.url} | ${row.status} | ${row.buildMarkerFound ? "yes" : "no"} | ${row.bannedPhrasesFound.join("<br>") || "no"} | ${row.popularSearchChipMarkupFound ? "yes" : "no"} | ${row.pass ? "PASS" : "FAIL"} |`);
  }
  fs.writeFileSync(path.join(reportsDir, "live-post-deploy-acceptance-check.md"), postLines.join("\n") + "\n");
  fs.writeFileSync(path.join(reportsDir, "live-post-deploy-acceptance-check.json"), JSON.stringify({ checkedAt, rows, errors: rows.filter((row) => !row.pass) }, null, 2) + "\n");
  const failed = rows.filter((row) => !row.pass);
  if (failed.length) {
    console.error(JSON.stringify({ errors: failed }, null, 2));
    process.exit(1);
  }
  console.log(JSON.stringify({ checkedAt, rows }, null, 2));
}

if (mode === "before") runBeforeSnapshot();
else if (mode === "live") runLive();
else runLocalFinal();
