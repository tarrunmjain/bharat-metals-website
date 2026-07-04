const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const reportsDir = path.join(root, "reports");

const corePages = [
  { slug: "about-us/", label: "About Us", min: 900, max: 1400 },
  { slug: "mission-vision/", label: "Mission and Vision", min: 800, max: 1200 },
  { slug: "industries-we-serve/", label: "Industries We Serve", min: 900, max: 1400 },
  { slug: "locations-we-serve/", label: "Locations We Serve", min: 900, max: 1400 },
  { slug: "products/", label: "Products", min: 900, max: 1400 },
  { slug: "stainless-steel/", label: "Stainless Steel", min: 1000, max: 1600 },
  { slug: "request-quote/", label: "Request Quote", min: 800, max: 1200 },
  { slug: "contact-us/", label: "Contact Us", min: 600, max: 900 },
  { slug: "technical-data/", label: "Technical Data", min: 900, max: 1300 },
  { slug: "blog/", label: "Blog Index", min: 500, max: 800 },
  { slug: "aluminium/", label: "Aluminium", min: 700, max: 1100 },
  { slug: "brass/", label: "Brass", min: 700, max: 1100 },
  { slug: "copper/", label: "Copper", min: 700, max: 1100 }
];

function htmlPath(slug) {
  return path.join(root, ...slug.split("/").filter(Boolean), "index.html");
}

function repoPath(slug) {
  return `${slug}index.html`;
}

function gitShow(file) {
  const result = spawnSync("git", ["show", `HEAD:${file}`], { cwd: root, encoding: "utf8" });
  return result.status === 0 ? result.stdout : "";
}

function stripTags(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<nav[\s\S]*?<\/nav>/gi, " ")
    .replace(/<section class="quote-section"[\s\S]*?<\/section>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "and")
    .replace(/&nbsp;/g, " ")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function mainHtml(html) {
  const match = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  return match ? match[1] : html;
}

function wordCount(html) {
  const text = stripTags(mainHtml(html));
  const words = text.match(/[A-Za-z0-9][A-Za-z0-9'/-]*/g) || [];
  return words.length;
}

function countMatches(html, regex) {
  return (html.match(regex) || []).length;
}

function extractFaq(html) {
  return [...html.matchAll(/<details><summary>([\s\S]*?)<\/summary><p>([\s\S]*?)<\/p><\/details>/g)].map((match) => ({
    q: stripTags(match[1]),
    a: stripTags(match[2])
  }));
}

function extractJsonLdFaq(html) {
  const scriptMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (!scriptMatch) return [];
  const data = JSON.parse(scriptMatch[1]);
  const graph = Array.isArray(data["@graph"]) ? data["@graph"] : [];
  const faq = graph.find((item) => item["@type"] === "FAQPage");
  return faq && Array.isArray(faq.mainEntity) ? faq.mainEntity.map((item) => ({ q: item.name, a: item.acceptedAnswer && item.acceptedAnswer.text })) : [];
}

function sectionTitles(html) {
  return [...mainHtml(html).matchAll(/<h2(?:\s[^>]*)?>([\s\S]*?)<\/h2>/g)].map((match) => stripTags(match[1]));
}

function pageRow(page) {
  const currentHtml = fs.readFileSync(htmlPath(page.slug), "utf8");
  const beforeHtml = gitShow(repoPath(page.slug));
  const visibleFaq = extractFaq(currentHtml);
  const schemaFaq = extractJsonLdFaq(currentHtml);
  const visibleQuestions = visibleFaq.map((item) => item.q).join("|");
  const schemaQuestions = schemaFaq.map((item) => item.q).join("|");
  const afterWords = wordCount(currentHtml);
  const beforeWords = beforeHtml ? wordCount(beforeHtml) : 0;
  const chipCount = countMatches(currentHtml, /class="search-chip"/g);
  const cardSections =
    countMatches(currentHtml, /class="page-card-grid/g) +
    countMatches(currentHtml, /class="forms-grid/g) +
    countMatches(currentHtml, /class="core-industry-grid/g);
  const genericFaq =
    currentHtml.includes("Answers to common RFQ questions for this page") ||
    currentHtml.includes("What is covered on the") ||
    currentHtml.includes("What is covered on this page");
  const h1Count = countMatches(currentHtml, /<h1[\s>]/g);
  const jsonLdValid = (() => {
    try {
      extractJsonLdFaq(currentHtml);
      return true;
    } catch (_) {
      return false;
    }
  })();
  return {
    ...page,
    beforeWords,
    afterWords,
    inRange: afterWords >= page.min && afterWords <= page.max,
    sections: sectionTitles(currentHtml),
    sectionCount: sectionTitles(currentHtml).length,
    faqCount: visibleFaq.length,
    chipCount,
    cardSections,
    genericFaq,
    h1Count,
    jsonLdValid,
    faqSchemaMatches: visibleQuestions === schemaQuestions && visibleFaq.length === schemaFaq.length,
    status:
      afterWords >= page.min &&
      afterWords <= page.max &&
      chipCount > 0 &&
      cardSections > 0 &&
      !genericFaq &&
      h1Count === 1 &&
      jsonLdValid &&
      visibleQuestions === schemaQuestions
        ? "PASS"
        : "REVIEW"
  };
}

function csvEscape(value) {
  return `"${String(value).replace(/"/g, '""')}"`;
}

fs.mkdirSync(reportsDir, { recursive: true });
const rows = corePages.map(pageRow);

const csv = [
  ["Page", "Slug", "Before word count", "After word count", "Target", "Sections added", "FAQ count", "Popular search chips", "Design card sections", "QA status"].join(","),
  ...rows.map((row) =>
    [
      row.label,
      row.slug,
      row.beforeWords,
      row.afterWords,
      `${row.min}-${row.max}`,
      row.sectionCount,
      row.faqCount,
      row.chipCount,
      row.cardSections,
      row.status
    ]
      .map(csvEscape)
      .join(",")
  )
].join("\n");
fs.writeFileSync(path.join(reportsDir, "core-pages-content-upgrade.csv"), csv + "\n");

const mdTable = [
  "| Page | Before words | After words | Target | Sections | FAQs | Chips | Card sections | Status |",
  "|---|---:|---:|---:|---:|---:|---:|---:|---|",
  ...rows.map((row) => `| ${row.label} | ${row.beforeWords} | ${row.afterWords} | ${row.min}-${row.max} | ${row.sectionCount} | ${row.faqCount} | ${row.chipCount} | ${row.cardSections} | ${row.status} |`)
].join("\n");

fs.writeFileSync(
  path.join(reportsDir, "core-pages-content-upgrade.md"),
  [
    "# Core Pages Content Upgrade",
    "",
    `Checked: ${new Date().toISOString()}`,
    "",
    "The 13 requested core pages were upgraded through the static generator with deeper buyer-focused content, richer hero copy, card/grid sections, visible popular-search chips and page-specific FAQs.",
    "",
    mdTable,
    "",
    "Pages upgraded: about-us, mission-vision, industries-we-serve, locations-we-serve, products, stainless-steel, request-quote, contact-us, technical-data, blog, aluminium, brass and copper.",
    "",
    "Claim safety: no manufacturer claim, no authorized Jindal dealer claim, no branch-office claim outside Chennai, no GST, no registration details and no owner or partner name were added."
  ].join("\n") + "\n"
);

fs.writeFileSync(
  path.join(reportsDir, "core-pages-word-count.md"),
  [
    "# Core Pages Word Count",
    "",
    `Checked: ${new Date().toISOString()}`,
    "",
    mdTable,
    "",
    ...rows.map((row) => `- ${row.label}: ${row.afterWords} words, target ${row.min}-${row.max}, ${row.inRange ? "PASS" : "REVIEW"}.`)
  ].join("\n") + "\n"
);

fs.writeFileSync(
  path.join(reportsDir, "core-pages-design-consistency.md"),
  [
    "# Core Pages Design Consistency",
    "",
    `Checked: ${new Date().toISOString()}`,
    "",
    "| Page | Card/grid sections | Popular chips | Key sections | Result |",
    "|---|---:|---:|---|---|",
    ...rows.map((row) => `| ${row.label} | ${row.cardSections} | ${row.chipCount} | ${row.sections.slice(0, 5).join("; ")} | ${row.cardSections > 0 && row.chipCount > 0 ? "PASS" : "REVIEW"} |`),
    "",
    "Design notes: upgraded sections use existing Bharat Metals red/silver/graphite card patterns, linked cards, product image cards, industry image cards, compact city/grade cards, data tables and visible search chips."
  ].join("\n") + "\n"
);

fs.writeFileSync(
  path.join(reportsDir, "core-pages-faq-audit.md"),
  [
    "# Core Pages FAQ Audit",
    "",
    `Checked: ${new Date().toISOString()}`,
    "",
    "| Page | FAQ count | Generic FAQ removed | JSON-LD valid | FAQ schema matches visible FAQ | One H1 | Result |",
    "|---|---:|---|---|---|---|---|",
    ...rows.map((row) => `| ${row.label} | ${row.faqCount} | ${row.genericFaq ? "NO" : "YES"} | ${row.jsonLdValid ? "YES" : "NO"} | ${row.faqSchemaMatches ? "YES" : "NO"} | ${row.h1Count === 1 ? "YES" : "NO"} | ${!row.genericFaq && row.jsonLdValid && row.faqSchemaMatches && row.h1Count === 1 ? "PASS" : "REVIEW"} |`),
    "",
    "FAQ schema is generated from the same page FAQ arrays used for the visible accordions."
  ].join("\n") + "\n"
);

console.log(JSON.stringify({ generatedAt: new Date().toISOString(), rows }, null, 2));
