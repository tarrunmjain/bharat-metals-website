const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const reportsDir = path.join(root, "reports");
const skipDirs = new Set([".git", "assets", "qa", "reports", "src", "scripts", "node_modules"]);

const genericPhrases = [
  "Common buyer groups for",
  "Products include",
  "Short answers for procurement teams",
  "Open SS 304 pages by stainless steel form",
  "Direct links for rods in common stainless steel grades",
  "enquiries can be reviewed when size, finish, quantity and application suit the grade",
  "Related city pages for buyers comparing dispatch options",
  "material enquiries should include application"
];

const samplePaths = new Set([
  "/",
  "/stainless-steel/",
  "/products/",
  "/ss-304/",
  "/ss-316/",
  "/ss-202/",
  "/stainless-steel-rods/",
  "/stainless-steel-bars/",
  "/stainless-steel-pipes/",
  "/stainless-steel-sheets/",
  "/stainless-steel-plates/",
  "/stainless-steel-suppliers-renigunta/",
  "/stainless-steel-suppliers-sricity/",
  "/stainless-steel-suppliers-tada/",
  "/stainless-steel-suppliers-coimbatore/",
  "/stainless-steel-suppliers-chennai/",
  "/industries/automobile-auto-components/",
  "/industries/food-processing/",
  "/aluminium/",
  "/brass/",
  "/copper/"
]);

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

function urlPath(file) {
  const relative = rel(file);
  return relative === "index.html" ? "/" : `/${relative.replace(/\/index\.html$/, "/")}`;
}

function classify(pagePath) {
  if (pagePath === "/") return "home";
  if (["/about-us/", "/mission-vision/", "/products/", "/stainless-steel/", "/industries-we-serve/", "/locations-we-serve/", "/request-quote/", "/contact-us/", "/blog/", "/site-map/"].includes(pagePath)) return "core";
  if (pagePath.startsWith("/blog/")) return "blog";
  if (pagePath.startsWith("/industries/")) return "industry";
  if (/^\/(technical-data|ss-chemical|ss-mechanical|ss-physical|ss-types-and-applications)\//.test(pagePath)) return "technical";
  if (/^\/stainless-steel-suppliers-/.test(pagePath)) return "city";
  if (/^\/stainless-steel-(pipes|sheets|plates|rods|bars)-/.test(pagePath)) return "city+product";
  if (/^\/ss-(202|304|316)-suppliers-/.test(pagePath)) return "grade+city";
  if (/^\/ss-[0-9a-z]+-(pipes|tubes|sheets|plates|coils|rods|bars|angles|flats|channels|flanges|fittings|circles|fasteners|wire-mesh|perforated-sheets)\/$/.test(pagePath)) return "grade+form";
  if (/^\/ss-(202|304|304l|310|316|316l|410|420|430)\/$/.test(pagePath)) return "grade";
  if (/^\/stainless-steel-(pipes|tubes|sheets|plates|coils|rods|bars|angles|flats|channels|flanges|fittings|circles|fasteners|wire-mesh|perforated-sheets)\/$/.test(pagePath)) return "product form";
  if (/^\/(aluminium|brass|copper)(-|\/)/.test(pagePath)) return "material";
  return "core";
}

function stripTags(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function mainHtml(html) {
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
  if (!main) return html;
  return main[1]
    .replace(/<nav\b[\s\S]*?<\/nav>/gi, " ")
    .replace(/<ol class="breadcrumb-list"[\s\S]*?<\/ol>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ");
}

function pick(regex, html) {
  return (html.match(regex) || [])[1] || "";
}

function wordCount(html) {
  const text = stripTags(mainHtml(html));
  if (!text) return 0;
  return text.split(/\s+/).filter(Boolean).length;
}

function searchSectionStatus(html) {
  const hasSearch = /Popular enquiry searches/i.test(html) || /enquiry-searches|search-chip-grid/i.test(html);
  if (!hasSearch) return { exists: "no", format: "missing" };
  if (/search-chip-grid|link-chip-grid|class="[^"]*chip/i.test(html)) return { exists: "yes", format: "chips/cards" };
  return { exists: "yes", format: "flat text" };
}

function faqStatus(type, pagePath, html) {
  const questions = [...html.matchAll(/<summary>([\s\S]*?)<\/summary>/gi)].map((match) => stripTags(match[1]));
  if (!questions.length) return "missing";
  const unique = new Set(questions.map((q) => q.toLowerCase())).size;
  const pathToken = pagePath
    .replace(/^\/|\/$/g, "")
    .replace(/stainless-steel-suppliers-|stainless-steel-|industries\//g, "")
    .split("-")
    .filter(Boolean)[0];
  const hasSpecificToken = pathToken ? questions.some((q) => q.toLowerCase().includes(pathToken.toLowerCase())) : true;
  if (unique < Math.min(questions.length, 5)) return "generic/repeated";
  if (["city", "industry", "grade", "product form", "grade+form", "city+product", "grade+city", "material"].includes(type) && !hasSpecificToken) return "likely generic";
  return "page-specific";
}

function finishStatus(type, pagePath, html) {
  if (!["product form", "grade+form"].includes(type)) return "not applicable";
  const badForRodsBars = ["2B Finish", "No. 1 Finish", "No. 8 Finish", "Satin Finish", "PVC Coated Sheets"];
  if (/stainless-steel-(rods|bars)|ss-[0-9a-z]+-(rods|bars)/.test(pagePath)) {
    const found = badForRodsBars.filter((term) => html.includes(term));
    return found.length ? `needs repair: ${found.join("; ")}` : "product-appropriate";
  }
  return /Finishes|Surface|finish/i.test(html) ? "present" : "missing";
}

function clickableStatus(type, html) {
  if (!["home", "core", "grade", "product form", "city", "industry", "grade+form", "city+product", "grade+city"].includes(type)) return "not applicable";
  if (/<a\b[^>]*class="[^"]*(page-card|material-card|product-card|industry-card|grade-card|anchor-card)/i.test(html)) return "likely full-card anchors";
  if (/<article class="page-card"><h3><a\b/i.test(html)) return "title-only cards found";
  return "not found";
}

function heroStatus(file, html) {
  const hero = html.match(/<section class="[^"]*hero[\s\S]*?<\/section>/i)?.[0] || "";
  const src = pick(/<img\b[^>]*src="([^"]+)"/i, hero);
  const exists = src ? "yes" : "no";
  const placeholder = /Photo pending|photo-placeholder|placeholder|background-image/i.test(hero) ? "yes" : "no";
  let asset = "n/a";
  if (src && !/^https?:/.test(src)) {
    const abs = path.resolve(path.dirname(file), src);
    asset = fs.existsSync(abs) ? "asset ok" : "asset missing";
  }
  return { exists, placeholder, asset };
}

function popularSearchRequired(type) {
  return ["home", "grade", "product form", "city", "industry", "grade+form", "city+product", "grade+city"].includes(type);
}

function urgent(row) {
  const type = row["Page type"];
  const checks = [
    /.+/.test(row["Generic repeated phrases found"]) && row["Generic repeated phrases found"] !== "none",
    row["Hero old placeholder/background"] === "yes",
    popularSearchRequired(type) && ["missing", "flat text"].includes(row["Popular searches format"]),
    /generic|repeated/i.test(row["FAQ quality"]),
    /needs repair|missing/i.test(row["Finish/service options"]),
    /title-only/i.test(row["Cards fully clickable"])
  ];
  return checks.some(Boolean) ? "yes" : "no";
}

function csvCell(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function run() {
  fs.mkdirSync(reportsDir, { recursive: true });
  const rows = walk(root)
    .sort()
    .map((file) => {
      const html = fs.readFileSync(file, "utf8");
      const pagePath = urlPath(file);
      const type = classify(pagePath);
      const search = searchSectionStatus(html);
      const hero = heroStatus(file, html);
      const phrases = genericPhrases.filter((phrase) => html.includes(phrase));
      const row = {
        Path: pagePath,
        "Page type": type,
        H1: stripTags(pick(/<h1[^>]*>([\s\S]*?)<\/h1>/i, html)),
        Title: stripTags(pick(/<title>([\s\S]*?)<\/title>/i, html)),
        "Meta description": stripTags(pick(/<meta name="description" content="([^"]*)"/i, html)),
        "True main content word count": wordCount(html),
        "Generic repeated phrases found": phrases.length ? phrases.join(" | ") : "none",
        "Hero image exists": hero.exists,
        "Hero old placeholder/background": hero.placeholder,
        "Hero asset": hero.asset,
        "Popular enquiry search section exists": search.exists,
        "Popular searches format": search.format,
        "FAQ quality": faqStatus(type, pagePath, html),
        "RFQ checklist exists": /RFQ checklist/i.test(html) ? "yes" : "no",
        "Cards fully clickable": clickableStatus(type, html),
        "Finish/service options": finishStatus(type, pagePath, html)
      };
      row["Needs urgent manual/content repair"] = urgent(row);
      return row;
    });

  const headers = Object.keys(rows[0]);
  const csv = [headers.join(","), ...rows.map((row) => headers.map((header) => csvCell(row[header])).join(","))].join("\n");
  fs.writeFileSync(path.join(reportsDir, "sitewide-live-content-check.csv"), `${csv}\n`);

  const byType = rows.reduce((acc, row) => {
    acc[row["Page type"]] = (acc[row["Page type"]] || 0) + 1;
    return acc;
  }, {});
  const needs = rows.filter((row) => row["Needs urgent manual/content repair"] === "yes");
  const flat = rows.filter((row) => row["Popular searches format"] === "flat text");
  const titleOnly = rows.filter((row) => row["Cards fully clickable"] === "title-only cards found");
  const generic = rows.filter((row) => row["Generic repeated phrases found"] !== "none");
  const sampleRows = rows.filter((row) => samplePaths.has(row.Path));

  const md = [
    "# Bharat Metals Sitewide Live Content Check",
    "",
    "Generated from the current static HTML build for the site-wide repair sprint. A pre-fix snapshot was created before template edits during the work session; this file is refreshed after the final build so the checked values match the delivered site.",
    "",
    `Pages audited: ${rows.length}`,
    `Pages needing urgent repair: ${needs.length}`,
    `Pages with generic repeated phrases: ${generic.length}`,
    `Pages with flat popular search text: ${flat.length}`,
    `Pages with title-only card click pattern: ${titleOnly.length}`,
    "",
    "## Page Type Counts",
    "",
    ...Object.entries(byType)
      .sort()
      .map(([type, count]) => `- ${type}: ${count}`),
    "",
    "## Manual Sample Findings",
    "",
    "| Path | Type | Words | Hero | Search format | FAQ quality | Cards | Finish/services | Repair needed |",
    "| --- | --- | ---: | --- | --- | --- | --- | --- | --- |",
    ...sampleRows.map(
      (row) =>
        `| ${row.Path} | ${row["Page type"]} | ${row["True main content word count"]} | ${row["Hero image exists"]}/${row["Hero old placeholder/background"]} | ${row["Popular searches format"]} | ${row["FAQ quality"]} | ${row["Cards fully clickable"]} | ${row["Finish/service options"]} | ${row["Needs urgent manual/content repair"]} |`
    ),
    "",
    "## Repair Themes Found",
    "",
    "- Product Portfolio menu needed material-level flyouts instead of a flat product list.",
    "- Several generated card grids used title-only anchors rather than full-card anchor patterns.",
    "- Product-form grade sections still used repeated explanatory text and needed compact linked chips.",
    "- Rods/bars finish sections needed exclusion of sheet-only finishes.",
    "- Popular enquiry searches needed chip/card formatting checks across page types.",
    "- FAQ blocks needed more page-specific wording for city, grade, product, industry and material pages."
  ];
  fs.writeFileSync(path.join(reportsDir, "sitewide-live-content-check.md"), `${md.join("\n")}\n`);
  console.log(JSON.stringify({ pages: rows.length, needsRepair: needs.length, generic: generic.length, flatSearches: flat.length, titleOnlyCards: titleOnly.length }, null, 2));
}

run();
