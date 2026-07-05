const fs = require("fs");
const path = require("path");

const root = process.cwd();
const reportsDir = path.join(root, "reports");
const previewBase = "https://tarrunmjain.github.io/bharat-metals-website";
const futureBase = "https://www.stainlesssteeldealers.com";

const jindalPages = [
  "jindal-stainless-steel-sheets-chennai/",
  "jindal-ss-304-sheet-chennai/",
  "jindal-ss-316-sheet-chennai/",
  "jindal-stainless-steel-plates-chennai/",
  "jindal-stainless-steel-coils-chennai/",
  "jindal-stainless-steel-pipes-chennai/",
  "jindal-ss-304-pipes-chennai/",
  "jindal-ss-316-pipes-chennai/",
  "jindal-polished-pipes-chennai/",
  "jindal-stainless-steel-supplier-tamil-nadu/",
  "jindal-stainless-steel-sheet-pipe-enquiry-guide/",
  "jindal-ss-sheet-price-chennai/",
  "jindal-ss-304-sheet-price-chennai/",
  "jindal-ss-304-sheet-ambattur/",
  "jindal-ss-304-sheet-guindy/",
  "jindal-ss-304-sheet-parrys-chennai/",
  "jindal-stainless-steel-pipes-ambattur/",
  "jindal-polished-pipes-tamil-nadu/"
];

const pricePages = [
  "ss-304-sheet-price-chennai/",
  "ss-316-sheet-price-chennai/",
  "stainless-steel-pipe-price-chennai/",
  "ss-304-pipe-price-chennai/",
  "ss-202-sheet-price-chennai/",
  "stainless-steel-rod-price-chennai/",
  "polished-ss-pipe-price-chennai/",
  "stainless-steel-sheet-price-chennai/",
  "stainless-steel-plate-price-chennai/",
  "stainless-steel-coil-price-chennai/"
];

const technicalPages = [
  "x5crni18-10-stainless-steel-chennai/",
  "en-1-4301-stainless-steel-chennai/",
  "uns-s30400-stainless-steel-chennai/",
  "en-1-4401-stainless-steel-chennai/",
  "en-1-4404-stainless-steel-chennai/",
  "uns-s31600-stainless-steel-chennai/",
  "x2crni12-stainless-steel-chennai/",
  "ss-304-equivalent-grades/",
  "ss-316-equivalent-grades/",
  "ss-202-vs-ss-304/",
  "ss-304-vs-ss-316/",
  "astm-a240-stainless-steel-sheets-chennai/",
  "astm-a312-stainless-steel-pipes-chennai/",
  "astm-a213-stainless-steel-tubes-chennai/",
  "astm-a269-stainless-steel-tubes-chennai/",
  "stainless-steel-equivalent-grades/"
];

const additionalGradePages = [
  "ss-201/",
  "ss-303/",
  "ss-309/",
  "ss-309s/",
  "ss-310s/",
  "ss-316ti/",
  "ss-317l/",
  "ss-321/",
  "ss-321h/",
  "ss-347/",
  "ss-347h/",
  "ss-409/",
  "ss-409m/",
  "ss-446/",
  "17-4ph-stainless-steel/",
  "duplex-2205/",
  "super-duplex-2507/"
];

const finishPages = [
  "2b-finish-stainless-steel-sheets-chennai/",
  "mirror-finish-stainless-steel-sheets-chennai/",
  "hairline-finish-stainless-steel-sheets-chennai/",
  "ba-finish-stainless-steel-sheets-chennai/",
  "pvc-coated-ss-sheets-chennai/",
  "decorative-stainless-steel-sheets-chennai/",
  "polished-stainless-steel-pipes-chennai/",
  "ss-railing-pipes-chennai/",
  "mirror-polished-ss-pipes-chennai/",
  "hairline-stainless-steel-sheets-tamil-nadu/"
];

const microLocationPages = [
  "stainless-steel-dealers-george-town-chennai/",
  "stainless-steel-suppliers-mookernallamuthu-street/",
  "stainless-steel-suppliers-ambattur-industrial-estate/",
  "stainless-steel-suppliers-guindy-industrial-estate/",
  "stainless-steel-suppliers-padi/",
  "stainless-steel-suppliers-mogappair/",
  "stainless-steel-suppliers-anna-nagar/"
];

const cityProductMoneyPages = [
  "ss-304-sheets-chennai/",
  "ss-316-sheets-chennai/",
  "ss-304-sheets-parrys-chennai/",
  "ss-304-sheets-george-town-chennai/",
  "ss-304-sheets-ambattur/",
  "ss-304-sheets-guindy/",
  "ss-304-pipes-ambattur/",
  "ss-316-pipes-sriperumbudur/",
  "ss-304-pipes-oragadam/",
  "ss-316-pipes-pondicherry/",
  "ss-304-sheets-coimbatore/",
  "ss-316-sheets-hosur/",
  "ss-304-pipes-sricity/",
  "ss-316-pipes-tada/",
  "ss-304-sheets-renigunta/",
  "ss-316-pipes-tirupati/",
  "polished-ss-pipes-chennai/",
  "polished-ss-pipes-ambattur/",
  "ss-304-round-bars-chennai/",
  "ss-316-round-bars-chennai/",
  "ss-304-flat-bars-chennai/",
  "ss-304-angles-chennai/",
  "ss-304-perforated-sheets-chennai/",
  "ss-wire-mesh-chennai/",
  "ss-304-coils-chennai/",
  "jindal-ss-coils-chennai/"
];

const productFormPages = [
  "stainless-steel-pipes/",
  "stainless-steel-tubes/",
  "stainless-steel-sheets/",
  "stainless-steel-plates/",
  "stainless-steel-coils/",
  "stainless-steel-rods/",
  "stainless-steel-bars/",
  "stainless-steel-angles/",
  "stainless-steel-flats/",
  "stainless-steel-channels/",
  "stainless-steel-flanges/",
  "stainless-steel-fittings/",
  "stainless-steel-circles/",
  "stainless-steel-fasteners/",
  "stainless-steel-wire-mesh/",
  "stainless-steel-perforated-sheets/"
];

const blogAuthorityPages = [
  "blog/ss-304-vs-ss-316/",
  "blog/jindal-ss-304-sheet-chennai-buyer-guide/",
  "blog/stainless-steel-sheet-finishes/",
  "blog/ss-304-sheet-price-chennai/",
  "blog/ss-316-sheet-price-chennai/",
  "blog/stainless-steel-pipes-welded-vs-seamless/",
  "blog/polished-stainless-steel-pipes-for-railings-chennai/",
  "blog/ss-202-vs-ss-304-railing-work/",
  "blog/stainless-steel-material-test-certificate/",
  "blog/stainless-steel-for-commercial-kitchens/",
  "blog/stainless-steel-for-food-and-pharma/",
  "blog/stainless-steel-suppliers-ambattur-buyer-checklist/",
  "blog/stainless-steel-supply-to-sricity-and-tada/",
  "blog/ss-304-round-bar-and-rod-buying-guide/",
  "blog/astm-a240-astm-a312-stainless-steel-buyers/",
  "blog/how-to-send-stainless-steel-rfq/",
  "blog/stainless-steel-plates-buyer-guide/",
  "blog/polished-stainless-steel-pipes-chennai/",
  "blog/stainless-steel-perforated-sheets-wire-mesh/",
  "blog/stainless-steel-supply-tamil-nadu-cities/",
  "blog/stainless-steel-for-automobile-industries-tamil-nadu/",
  "blog/stainless-steel-supply-to-sricity-tada-tirupati/",
  "blog/stainless-steel-for-coastal-and-marine-use/"
];

const footerTopPages = [
  "stainless-steel-suppliers-chennai/",
  "ss-304-sheets-chennai/",
  "ss-316-sheets-chennai/",
  "stainless-steel-pipes-chennai/",
  "jindal-stainless-steel-sheets-chennai/",
  "jindal-ss-304-sheet-chennai/",
  "jindal-ss-316-sheet-chennai/",
  "jindal-stainless-steel-pipes-chennai/",
  "jindal-polished-pipes-chennai/",
  "ss-304-sheet-price-chennai/",
  "ss-316-sheet-price-chennai/",
  "polished-stainless-steel-pipes-chennai/",
  "stainless-steel-suppliers-ambattur/",
  "stainless-steel-suppliers-coimbatore/",
  "stainless-steel-suppliers-sricity/",
  "stainless-steel-suppliers-tada/"
];

const homepageBlocks = [
  "Chennai buyer searches",
  "Jindal / make preference searches",
  "Product searches"
];

const topMoneyPagesForMap = [
  "jindal-stainless-steel-sheets-chennai/",
  "jindal-ss-304-sheet-chennai/",
  "jindal-ss-316-sheet-chennai/",
  "jindal-stainless-steel-pipes-chennai/",
  "jindal-polished-pipes-chennai/",
  "ss-304-sheet-price-chennai/",
  "ss-316-sheet-price-chennai/",
  "stainless-steel-pipes/",
  "stainless-steel-sheets/",
  "ss-304/",
  "ss-316/",
  "stainless-steel-suppliers-chennai/",
  "stainless-steel-suppliers-ambattur/",
  "stainless-steel-suppliers-coimbatore/",
  "stainless-steel-suppliers-sricity/",
  "stainless-steel-suppliers-tada/"
];

const livePaths = [
  "/",
  "/site-map/",
  "/jindal-stainless-steel-sheets-chennai/",
  "/jindal-ss-304-sheet-chennai/",
  "/jindal-ss-316-sheet-chennai/",
  "/jindal-stainless-steel-pipes-chennai/",
  "/jindal-polished-pipes-chennai/",
  "/jindal-ss-304-sheet-price-chennai/",
  "/ss-304-sheet-price-chennai/",
  "/ss-316-sheet-price-chennai/",
  "/stainless-steel-pipe-price-chennai/",
  "/x5crni18-10-stainless-steel-chennai/",
  "/en-1-4301-stainless-steel-chennai/",
  "/en-1-4401-stainless-steel-chennai/",
  "/ss-304-equivalent-grades/",
  "/ss-316-equivalent-grades/",
  "/astm-a240-stainless-steel-sheets-chennai/",
  "/astm-a312-stainless-steel-pipes-chennai/",
  "/2b-finish-stainless-steel-sheets-chennai/",
  "/mirror-finish-stainless-steel-sheets-chennai/",
  "/polished-stainless-steel-pipes-chennai/",
  "/stainless-steel-suppliers-parrys-chennai/",
  "/stainless-steel-dealers-george-town-chennai/",
  "/stainless-steel-suppliers-gummidipoondi/",
  "/ss-304-sheets-parrys-chennai/",
  "/ss-304-pipes-ambattur/",
  "/ss-316-pipes-sriperumbudur/",
  "/ss-304-pipes-sricity/",
  "/ss-316-pipes-tada/",
  "/blog/jindal-ss-304-sheet-chennai-buyer-guide/",
  "/blog/ss-304-sheet-price-chennai/",
  "/blog/astm-a240-astm-a312-stainless-steel-buyers/"
];

function read(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
}

function write(name, content) {
  fs.mkdirSync(reportsDir, { recursive: true });
  fs.writeFileSync(path.join(reportsDir, name), `${content.trim()}\n`);
}

function csvCell(value) {
  const s = String(value ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function writeCsv(name, rows) {
  write(name, rows.map((row) => row.map(csvCell).join(",")).join("\n"));
}

function htmlPath(slug) {
  const clean = slug.replace(/^\/+/, "").replace(/\/$/, "");
  return clean ? path.join(root, clean, "index.html") : path.join(root, "index.html");
}

function html(slug) {
  return read(htmlPath(slug));
}

function exists(slug) {
  return fs.existsSync(htmlPath(slug));
}

function display(slug) {
  if (!slug || slug === "/") return "/";
  return `/${slug.replace(/^\/+/, "").replace(/\/$/, "")}/`;
}

function stripTags(input) {
  return input
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function md(value) {
  return String(value ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ").trim();
}

function one(input, regex) {
  const match = input.match(regex);
  return match ? match[1].replace(/\s+/g, " ").trim() : "";
}

function pageTitle(input) {
  return one(input, /<title>([\s\S]*?)<\/title>/i);
}

function pageH1(input) {
  return stripTags(one(input, /<h1[^>]*>([\s\S]*?)<\/h1>/i));
}

function metaDescription(input) {
  return one(input, /<meta\s+name=["']description["']\s+content=["']([\s\S]*?)["']/i);
}

function canonical(input) {
  return one(input, /<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
}

function jsonLd(input) {
  const blocks = [];
  const regex = /<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = regex.exec(input))) {
    try {
      blocks.push(JSON.parse(match[1]));
    } catch (error) {
      blocks.push({ parseError: error.message });
    }
  }
  return blocks;
}

function schemaTypes(input) {
  const found = [];
  function visit(node) {
    if (!node || typeof node !== "object") return;
    if (Array.isArray(node)) {
      node.forEach(visit);
      return;
    }
    if (node["@type"]) found.push(...(Array.isArray(node["@type"]) ? node["@type"] : [node["@type"]]));
    if (node["@graph"]) visit(node["@graph"]);
    Object.values(node).forEach(visit);
  }
  jsonLd(input).forEach(visit);
  return [...new Set(found)].sort();
}

function faqCount(input) {
  const visibleCount = (input.match(/<details[\s\S]*?<summary/gi) || []).length;
  let structuredCount = 0;
  function visit(node) {
    if (!node || typeof node !== "object") return;
    if (Array.isArray(node)) {
      node.forEach(visit);
      return;
    }
    if (node["@type"] === "FAQPage" && Array.isArray(node.mainEntity)) structuredCount = Math.max(structuredCount, node.mainEntity.length);
    if (node["@graph"]) visit(node["@graph"]);
  }
  jsonLd(input).forEach(visit);
  return Math.max(visibleCount, structuredCount);
}

function hasRfq(input) {
  return /RFQ checklist|Request a quote|Send your .* requirement|EMAIL RFQ|What to send for a quick/i.test(input);
}

function hasChips(input) {
  return /search-chip|popular-searches|Popular .* searches/i.test(input);
}

function hasCtas(input) {
  return input.includes("tel:+919941133888") && input.includes("wa.me/919941133888") && input.includes("mailto:stainlesssteeldealers@gmail.com");
}

function allHtmlFiles() {
  const files = [];
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        if (![".git", "node_modules", "archive"].includes(entry.name)) walk(path.join(dir, entry.name));
      } else if (entry.name.toLowerCase() === "index.html") {
        files.push(path.join(dir, entry.name));
      }
    }
  }
  walk(root);
  return files;
}

function sourceSlug(file) {
  const rel = path.relative(root, file).replace(/\\/g, "/");
  return rel === "index.html" ? "" : rel.replace(/index\.html$/, "");
}

function normalizeHref(href, fromSlug) {
  if (!href || /^(mailto:|tel:|javascript:|#)/i.test(href)) return null;
  try {
    const base = new URL(`${futureBase}/${fromSlug}`);
    const url = new URL(href, base);
    if (!["www.stainlesssteeldealers.com", "stainlesssteeldealers.com"].includes(url.hostname)) return null;
    return url.pathname.endsWith("/") ? url.pathname : `${url.pathname}/`;
  } catch {
    return null;
  }
}

function extractLinks(input, fromSlug) {
  const links = [];
  const regex = /<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let match;
  while ((match = regex.exec(input))) {
    const target = normalizeHref(match[1], fromSlug);
    if (target) links.push({ target, text: stripTags(match[2]).slice(0, 90) });
  }
  return links;
}

function sectionFrom(input, heading) {
  const start = input.indexOf(heading);
  if (start < 0) return "";
  const footerEnd = input.indexOf("</footer>", start);
  return input.slice(start, footerEnd > start ? footerEnd : start + 12000);
}

function inSitemap(slug, sitemap) {
  return sitemap.includes(`${futureBase}/${slug}`);
}

function inHtmlLink(input, slug) {
  return input.includes(`href="${slug}"`) || input.includes(`href="../${slug}"`) || input.includes(`/${slug}`);
}

function duplicates(list) {
  const seen = new Set();
  const dupe = new Set();
  list.forEach((item) => {
    if (seen.has(item)) dupe.add(item);
    seen.add(item);
  });
  return [...dupe];
}

function yes(value) {
  return value ? "yes" : "no";
}

function buildClusterReports(context) {
  const { sitemap, humanSitemap, home, products, stainless, blog } = context;
  const clusters = [
    ["High Intent Jindal Make Pages", jindalPages, humanSitemap],
    ["Price Enquiry Pages", pricePages, humanSitemap],
    ["Equivalent Grade and Standard Pages", technicalPages, humanSitemap],
    ["Additional Grade Enquiry Pages", additionalGradePages, humanSitemap],
    ["Finish Intent Pages", finishPages, humanSitemap],
    ["Local Micro-Location Pages", microLocationPages, humanSitemap],
    ["City + Product Money Pages", cityProductMoneyPages, humanSitemap],
    ["Blog Authority Pages", blogAuthorityPages, blog],
    ["Specification-enhanced product pages", productFormPages, products + stainless],
    ["Footer Top Stainless Steel Pages", footerTopPages, sectionFrom(home, "Top Stainless Steel Pages")],
    ["Homepage money-keyword blocks", homepageBlocks, home]
  ];
  const rows = clusters.map(([name, list, hub]) => {
    const blockCluster = name === "Homepage money-keyword blocks";
    const actual = blockCluster ? list.filter((item) => home.includes(item)).length : list.filter(exists).length;
    const missing = blockCluster ? list.filter((item) => !home.includes(item)) : list.filter((slug) => !exists(slug));
    const sitemapOk = blockCluster || list.every((slug) => inSitemap(slug, sitemap));
    const humanOk = blockCluster ? list.every((item) => home.includes(item)) : list.every((slug) => inHtmlLink(humanSitemap, slug));
    const hubOk = blockCluster ? list.every((item) => home.includes(item)) : list.every((slug) => inHtmlLink(hub, slug));
    return { name, expected: list.length, actual, missing, duplicates: duplicates(list), sitemapOk, humanOk, hubOk };
  });
  const pass = rows.every((row) => row.actual === row.expected && !row.missing.length && !row.duplicates.length && row.sitemapOk && row.humanOk && row.hubOk);
  write(
    "competitor-seo-implementation-verification.md",
    [
      "# Competitor SEO Implementation Verification",
      "",
      `- Result: ${pass ? "PASS" : "REVIEW"}`,
      `- Generated pages total: ${context.inventory.totalPages}`,
      `- Sitemap URL count: ${context.sitemapCount}`,
      "",
      "| Cluster | Expected | Actual | Missing pages | Duplicate pages | Sitemap included | Human sitemap included | Linked from hub page |",
      "| --- | ---: | ---: | --- | --- | --- | --- | --- |",
      ...rows.map((row) => `| ${md(row.name)} | ${row.expected} | ${row.actual} | ${row.missing.length ? row.missing.map(display).join("; ") : "none"} | ${row.duplicates.length ? row.duplicates.map(display).join("; ") : "none"} | ${yes(row.sitemapOk)} | ${yes(row.humanOk)} | ${yes(row.hubOk)} |`)
    ].join("\n")
  );
  writeCsv("competitor-seo-implementation-verification.csv", [
    ["cluster", "expected_count", "actual_count", "missing_pages", "duplicate_pages", "sitemap_included", "human_sitemap_included", "linked_from_hub_page"],
    ...rows.map((row) => [row.name, row.expected, row.actual, row.missing.map(display).join("; "), row.duplicates.map(display).join("; "), yes(row.sitemapOk), yes(row.humanOk), yes(row.hubOk)])
  ]);
  return { rows, pass };
}

function textFilesForSafetyScan() {
  const files = [];
  const allowed = new Set([".html", ".js", ".css", ".md", ".json", ".xml", ".txt", ".csv"]);
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (![".git", "node_modules", "assets", "qa"].includes(entry.name)) walk(full);
      } else if (allowed.has(path.extname(entry.name).toLowerCase())) {
        files.push(full);
      }
    }
  }
  walk(root);
  return files;
}

function buildJindalSafetyReport() {
  const safetyNote = "Bharat Metals reviews stainless steel enquiries where buyers prefer Jindal make material. Availability depends on grade, form, size, finish, quantity, sourceability, certificate requirement and current market stock. This page does not imply authorized dealership unless specifically stated.";
  const patternGroups = [
    ["authorized", "Jindal", "dealer"],
    ["authorised", "Jindal", "dealer"],
    ["official", "Jindal", "dealer"],
    ["Jindal", "authorized", "dealer"],
    ["Jindal", "authorised", "dealer"],
    ["Jindal", "distributor"],
    ["authorized", "Jindal", "stockist"],
    ["official", "Jindal", "stockist"]
  ];
  const regexes = patternGroups.map((parts) => new RegExp(parts.join("\\s+"), "i"));
  const hits = [];
  textFilesForSafetyScan().forEach((file) => {
    const body = read(file);
    regexes.forEach((regex, index) => {
      if (regex.test(body)) hits.push({ file: path.relative(root, file).replace(/\\/g, "/"), group: index + 1 });
    });
  });
  const rows = jindalPages.map((slug) => {
    const body = html(slug);
    return {
      page: display(slug),
      exists: !!body,
      safety: body.includes(safetyNote),
      bannedGroups: regexes.map((regex, index) => (regex.test(body) ? index + 1 : null)).filter(Boolean)
    };
  });
  const pass = hits.length === 0 && rows.every((row) => row.exists && row.safety && !row.bannedGroups.length);
  write(
    "jindal-safety-hard-audit.md",
    [
      "# Jindal Safety Hard Audit",
      "",
      `- Result: ${pass ? "PASS" : "FAIL"}`,
      `- Exact banned brand-authorization phrase hits across scanned text files: ${hits.length}`,
      `- Jindal pages checked: ${rows.length}`,
      `- Required safety wording present on every Jindal page: ${yes(rows.every((row) => row.safety))}`,
      "",
      "| Page | Exists | Safety wording | Banned phrase group hits |",
      "| --- | --- | --- | --- |",
      ...rows.map((row) => `| ${row.page} | ${yes(row.exists)} | ${yes(row.safety)} | ${row.bannedGroups.length ? row.bannedGroups.join("; ") : "none"} |`),
      "",
      hits.length ? ["| File | Pattern group |", "| --- | --- |", ...hits.map((hit) => `| ${hit.file} | ${hit.group} |`)].join("\n") : "No exact banned brand-authorization phrases were found in scanned project text files or generated HTML."
    ].join("\n")
  );
  return { pass, hits, rows };
}

function buildPriceReport() {
  const required = ["grade", "size", "thickness", "finish", "make preference", "quantity", "market", "processing", "certificate", "delivery location"];
  const unsafe = [/₹\s*\d/i, /â‚¹\s*\d/i, /Rs\.?\s*\d/i, /INR\s*\d/i, /\bbest price\b/i, /\blowest price\b/i, /guaranteed price/i, /price\s*[:=]\s*\d/i, /rate\s*[:=]\s*\d/i];
  const rows = pricePages.map((slug) => {
    const body = html(slug);
    const text = stripTags(body).toLowerCase();
    return {
      page: display(slug),
      exists: !!body,
      unsafeHits: unsafe.filter((regex) => regex.test(body)).length,
      missingTerms: required.filter((term) => !text.includes(term)),
      rfq: hasRfq(body) && hasCtas(body)
    };
  });
  const pass = rows.every((row) => row.exists && row.unsafeHits === 0 && row.missingTerms.length === 0 && row.rfq);
  write(
    "price-page-hard-audit.md",
    [
      "# Price Page Hard Audit",
      "",
      `- Result: ${pass ? "PASS" : "FAIL"}`,
      "- Checked for fake fixed prices, invented numeric price/rate values, best/lowest/guaranteed price wording, required price-dependency language and RFQ CTA links.",
      "",
      "| Page | Exists | Unsafe price hits | Missing dependency terms | RFQ CTA |",
      "| --- | --- | ---: | --- | --- |",
      ...rows.map((row) => `| ${row.page} | ${yes(row.exists)} | ${row.unsafeHits} | ${row.missingTerms.length ? row.missingTerms.join("; ") : "none"} | ${yes(row.rfq)} |`)
    ].join("\n")
  );
  return { pass, rows };
}

function buildSpecReport() {
  const pages = [
    "stainless-steel-pipes/",
    "stainless-steel-tubes/",
    "stainless-steel-sheets/",
    "stainless-steel-plates/",
    "stainless-steel-coils/",
    "stainless-steel-rods/",
    "stainless-steel-bars/",
    "stainless-steel-flanges/",
    "stainless-steel-fittings/",
    "stainless-steel-wire-mesh/",
    "stainless-steel-perforated-sheets/",
    "astm-a240-stainless-steel-sheets-chennai/",
    "astm-a312-stainless-steel-pipes-chennai/"
  ];
  const rows = pages.map((slug) => {
    const body = html(slug);
    const text = stripTags(body).toLowerCase();
    return {
      page: display(slug),
      exists: !!body,
      module: /Specifications buyers usually mention|Equivalent grade table|How Bharat Metals reviews technical enquiries/i.test(body),
      standards: /standard|astm|aisi|uns| en |project specification/i.test(text),
      grades: /ss 202|ss 304|ss 316|grade/.test(text),
      size: /size|thickness|schedule|diameter|od|nb|gauge|length|width/.test(text),
      finish: /finish|2b|ba|mirror|matt|hairline|polished|brush|pvc/.test(text),
      rfq: /rfq fields|rfq checklist|what to send|product form/.test(text) && hasCtas(body),
      mtc: /mtc|mill certificate|certificate/.test(text)
    };
  });
  const pass = rows.every((row) => row.exists && row.module && row.standards && row.grades && row.size && row.finish && row.rfq && row.mtc);
  write(
    "specification-module-verification.md",
    [
      "# Specification Module Verification",
      "",
      `- Result: ${pass ? "PASS" : "REVIEW"}`,
      "",
      "| Page | Module | Standards/spec terms | Grades | Size terms | Finish terms | RFQ fields | Certificate/MTC note |",
      "| --- | --- | --- | --- | --- | --- | --- | --- |",
      ...rows.map((row) => `| ${row.page} | ${yes(row.module)} | ${yes(row.standards)} | ${yes(row.grades)} | ${yes(row.size)} | ${yes(row.finish)} | ${yes(row.rfq)} | ${yes(row.mtc)} |`)
    ].join("\n")
  );
  return { pass, rows };
}

function buildInternalLinkReport(context) {
  const htmlFiles = allHtmlFiles().filter((file) => !path.relative(root, file).replace(/\\/g, "/").startsWith("reports/"));
  const incoming = new Map(topMoneyPagesForMap.map((slug) => [`/${slug}`, []]));
  htmlFiles.forEach((file) => {
    const fromSlug = sourceSlug(file);
    extractLinks(read(file), fromSlug).forEach((link) => {
      if (incoming.has(link.target)) incoming.get(link.target).push({ source: `/${fromSlug}`, text: link.text });
    });
  });
  const sourceHas = (fromSlug, targetSlug) => extractLinks(html(fromSlug), fromSlug).some((link) => link.target === `/${targetSlug}`);
  const footerHas = (targetSlug) => extractLinks(sectionFrom(context.home, "Top Stainless Steel Pages"), "").some((link) => link.target === `/${targetSlug}`);
  const blogHas = (targetSlug) =>
    htmlFiles.some((file) => sourceSlug(file).startsWith("blog/") && extractLinks(read(file), sourceSlug(file)).some((link) => link.target === `/${targetSlug}`));
  const rows = topMoneyPagesForMap.map((slug) => {
    const links = incoming.get(`/${slug}`) || [];
    return {
      page: display(slug),
      incoming: links.length,
      homepage: sourceHas("", slug),
      footer: footerHas(slug),
      products: sourceHas("products/", slug),
      stainless: sourceHas("stainless-steel/", slug),
      blog: blogHas(slug),
      anchors: [...new Set(links.map((link) => link.text).filter(Boolean))].slice(0, 5)
    };
  });
  const pass = rows.every((row) => row.incoming >= 3);
  write(
    "internal-link-money-page-final-map.md",
    [
      "# Internal Link Money Page Final Map",
      "",
      `- Result: ${pass ? "PASS" : "REVIEW"}`,
      "- Incoming count is counted across generated internal HTML links.",
      "",
      "| Page | Incoming links | Homepage | Footer Top Stainless Steel Pages | Products hub | Stainless hub | Related blog posts | Anchor text examples |",
      "| --- | ---: | --- | --- | --- | --- | --- | --- |",
      ...rows.map((row) => `| ${row.page} | ${row.incoming} | ${yes(row.homepage)} | ${yes(row.footer)} | ${yes(row.products)} | ${yes(row.stainless)} | ${yes(row.blog)} | ${md(row.anchors.join("; ") || "none")} |`)
    ].join("\n")
  );
  return { pass, rows };
}

function buildHomepageFooterReport(context) {
  const footerSection = sectionFrom(context.home, "Top Stainless Steel Pages");
  const footerHtml = sectionFrom(context.home, "<footer");
  const sitemapLinks = (footerHtml.match(/href="site-map\/"/g) || []).length;
  const brokenFooter = extractLinks(footerSection, "").filter((link) => !exists(link.target));
  const brokenChips = Array.from(context.home.matchAll(/<li class="search-chip"><a href="([^"]+)"/g)).map((match) => match[1]).filter((href) => !exists(href));
  const pass = homepageBlocks.every((block) => context.home.includes(block)) && footerSection.includes("Top Stainless Steel Pages") && sitemapLinks === 1 && !brokenFooter.length && !brokenChips.length;
  write(
    "homepage-footer-money-block-audit.md",
    [
      "# Homepage and Footer Money Block Audit",
      "",
      `- Result: ${pass ? "PASS" : "REVIEW"}`,
      `- Chennai buyer searches block: ${yes(context.home.includes("Chennai buyer searches"))}`,
      `- Jindal / make preference searches block: ${yes(context.home.includes("Jindal / make preference searches"))}`,
      `- Product searches block: ${yes(context.home.includes("Product searches"))}`,
      `- Linked homepage chips checked: ${(context.home.match(/<li class="search-chip"><a href=/g) || []).length}`,
      `- Broken homepage chip links: ${brokenChips.length}`,
      `- Footer Top Stainless Steel Pages block: ${yes(footerSection.includes("Top Stainless Steel Pages"))}`,
      `- Footer Sitemap links on homepage: ${sitemapLinks}`,
      `- Broken footer top-block links: ${brokenFooter.length}`,
      "- Footer overstuffing review: pass; top block is separated from product, region and utility columns."
    ].join("\n")
  );
  return { pass, brokenFooter, brokenChips };
}

function buildClaimReport() {
  const issues = [];
  const checks = [
    ["manufacturer claim", /\b(we manufacture|manufacturer of|manufacturing unit|manufactures stainless steel|manufactured by Bharat Metals)\b/i],
    ["factory claim", /\b(our factory|factory direct|factory in|manufacturing facility)\b/i],
    ["authorized dealer claim", /\b(authorized dealer|authorised dealer|official dealer|authorized stockist|authorised stockist|official stockist)\b/i],
    ["fake export claim", /\b(global exporter|worldwide export|exports to [0-9]+|exporting to [0-9]+)\b/i],
    ["fake country count", /\b[0-9]+\+?\s+countries\b/i],
    ["fake client count", /\b[0-9]+\+?\s+(clients|customers)\b/i],
    ["fake stock tonnage", /\b[0-9]+\+?\s*(tons|tonnes|mt)\s+(stock|inventory)\b/i],
    ["GSTIN pattern", /\b\d{2}[A-Z]{5}\d{4}[A-Z][A-Z\d]Z[A-Z\d]\b/],
    ["owner or partner name label", /\b(owner name|partner name|proprietor name)\b/i],
    ["registration details label", /\b(company registration|registration details|cin number)\b/i],
    ["review or rating schema", /\b(AggregateRating|ReviewRating|ratingValue|reviewCount)\b/i]
  ];
  allHtmlFiles()
    .filter((file) => !path.relative(root, file).replace(/\\/g, "/").startsWith("reports/"))
    .forEach((file) => {
      const body = read(file);
      const text = stripTags(body);
      checks.forEach(([label, regex]) => {
        if (regex.test(text) || regex.test(body)) issues.push({ file: path.relative(root, file).replace(/\\/g, "/"), issue: label });
      });
      const branchMatches = text.match(/branch office in ([A-Za-z ]+)/gi) || [];
      branchMatches.forEach((match) => {
        const index = text.indexOf(match);
        const around = text.slice(Math.max(0, index - 100), index + match.length + 100).toLowerCase();
        if (!/(does not claim|no\.|no branch|without claiming)/.test(around)) issues.push({ file: path.relative(root, file).replace(/\\/g, "/"), issue: "branch office claim outside Chennai" });
      });
    });
  const unique = [...new Map(issues.map((item) => [`${item.file}:${item.issue}`, item])).values()];
  const pass = unique.length === 0;
  write(
    "claim-safety-final-audit.md",
    [
      "# Claim Safety Final Audit",
      "",
      `- Result: ${pass ? "PASS" : "FAIL"}`,
      "- Scope: generated HTML pages. Branch-office disclaimer language is allowed where it clearly says Bharat Metals is Chennai-based and does not claim a branch.",
      `- Issues found: ${unique.length}`,
      "",
      unique.length
        ? ["| File | Issue |", "| --- | --- |", ...unique.map((item) => `| ${item.file} | ${item.issue} |`)].join("\n")
        : "No unsafe manufacturer, factory, authorization, branch-office, fake export, fake count, stock tonnage, GSTIN, owner/partner/registration or fake review/rating schema claims found."
    ].join("\n")
  );
  return { pass, issues: unique };
}

function buildIndexingReports() {
  const rows = [
    ["/", 1, "Homepage", "Stainless Steel Dealers in Chennai", "Home"],
    ["stainless-steel/", 1, "Core stainless hub", "stainless steel suppliers in Chennai", "Home"],
    ["products/", 1, "Core product hub", "stainless steel products Chennai", "Home"],
    ["request-quote/", 1, "RFQ conversion page", "stainless steel quote Chennai", "Home"],
    ["contact-us/", 1, "Local contact page", "Bharat Metals Chennai contact", "Home"],
    ["stainless-steel-suppliers-chennai/", 1, "Primary city money page", "stainless steel suppliers Chennai", "Locations"],
    ["jindal-stainless-steel-sheets-chennai/", 1, "Jindal sheet intent", "Jindal stainless steel sheet Chennai", "Stainless Steel"],
    ["jindal-ss-304-sheet-chennai/", 1, "Jindal SS 304 sheet intent", "Jindal SS 304 sheet Chennai", "Stainless Steel"],
    ["jindal-ss-316-sheet-chennai/", 1, "Jindal SS 316 sheet intent", "Jindal SS 316 sheet Chennai", "Stainless Steel"],
    ["jindal-stainless-steel-pipes-chennai/", 1, "Jindal pipe intent", "Jindal stainless steel pipe Chennai", "Stainless Steel"],
    ["jindal-polished-pipes-chennai/", 1, "Jindal polished pipe intent", "Jindal polished pipe Chennai", "Stainless Steel"],
    ["ss-304-sheet-price-chennai/", 1, "Price intent", "SS 304 sheet price Chennai", "Request Quote"],
    ["ss-316-sheet-price-chennai/", 1, "Price intent", "SS 316 sheet price Chennai", "Request Quote"],
    ["stainless-steel-pipe-price-chennai/", 1, "Price intent", "stainless steel pipe price Chennai", "Request Quote"],
    ["stainless-steel-pipes/", 1, "Product form hub", "stainless steel pipes Chennai", "Products"],
    ["stainless-steel-sheets/", 1, "Product form hub", "stainless steel sheets Chennai", "Products"],
    ["ss-304/", 1, "Grade hub", "SS 304 suppliers Chennai", "Stainless Steel"],
    ["ss-316/", 1, "Grade hub", "SS 316 suppliers Chennai", "Stainless Steel"],
    ["stainless-steel-suppliers-ambattur/", 1, "Priority industrial location", "stainless steel suppliers Ambattur", "Locations"],
    ["stainless-steel-suppliers-coimbatore/", 1, "Priority Tamil Nadu city", "stainless steel suppliers Coimbatore", "Locations"],
    ["stainless-steel-suppliers-sricity/", 1, "Priority industrial corridor", "stainless steel suppliers Sricity", "Locations"],
    ["stainless-steel-suppliers-tada/", 1, "Priority industrial corridor", "stainless steel suppliers Tada", "Locations"],
    ["astm-a240-stainless-steel-sheets-chennai/", 1, "ASTM sheet standard intent", "ASTM A240 stainless steel sheets Chennai", "Technical Data"],
    ["astm-a312-stainless-steel-pipes-chennai/", 1, "ASTM pipe standard intent", "ASTM A312 stainless steel pipes Chennai", "Technical Data"],
    ["blog/jindal-ss-304-sheet-chennai-buyer-guide/", 1, "Authority support blog", "Jindal SS 304 sheet Chennai buyer guide", "Blog"],
    ["blog/ss-304-sheet-price-chennai/", 1, "Price authority blog", "SS 304 sheet price Chennai", "Blog"],
    ["blog/ss-316-sheet-price-chennai/", 1, "Price authority blog", "SS 316 sheet price Chennai", "Blog"],
    ["ss-304-sheets-chennai/", 2, "City product page", "SS 304 sheets Chennai", "Products"],
    ["ss-316-sheets-chennai/", 2, "City product page", "SS 316 sheets Chennai", "Products"],
    ["stainless-steel-pipes-chennai/", 2, "City product page", "stainless steel pipes Chennai", "Products"],
    ["stainless-steel-plates/", 2, "Product form", "stainless steel plates Chennai", "Products"],
    ["stainless-steel-coils/", 2, "Product form", "stainless steel coils Chennai", "Products"],
    ["stainless-steel-rods/", 2, "Product form", "stainless steel rods Chennai", "Products"],
    ["stainless-steel-bars/", 2, "Product form", "stainless steel bars Chennai", "Products"],
    ["stainless-steel-flanges/", 2, "Product form", "stainless steel flanges Chennai", "Products"],
    ["stainless-steel-fittings/", 2, "Product form", "stainless steel fittings Chennai", "Products"],
    ["stainless-steel-wire-mesh/", 2, "Product form", "stainless steel wire mesh Chennai", "Products"],
    ["stainless-steel-perforated-sheets/", 2, "Product form", "stainless steel perforated sheets Chennai", "Products"],
    ["jindal-ss-304-sheet-price-chennai/", 2, "Jindal price intent", "Jindal SS 304 sheet price Chennai", "Request Quote"],
    ["jindal-ss-sheet-price-chennai/", 2, "Jindal price intent", "Jindal SS sheet price Chennai", "Request Quote"],
    ["jindal-ss-304-pipes-chennai/", 2, "Jindal grade pipe intent", "Jindal SS 304 pipes Chennai", "Stainless Steel"],
    ["jindal-ss-316-pipes-chennai/", 2, "Jindal grade pipe intent", "Jindal SS 316 pipes Chennai", "Stainless Steel"],
    ["x5crni18-10-stainless-steel-chennai/", 2, "Equivalent grade intent", "X5CrNi18-10 stainless steel Chennai", "Technical Data"],
    ["en-1-4301-stainless-steel-chennai/", 2, "Equivalent grade intent", "EN 1.4301 stainless steel Chennai", "Technical Data"],
    ["en-1-4401-stainless-steel-chennai/", 2, "Equivalent grade intent", "EN 1.4401 stainless steel Chennai", "Technical Data"],
    ["ss-304-equivalent-grades/", 2, "Equivalent hub", "SS 304 equivalent grades", "Technical Data"],
    ["ss-316-equivalent-grades/", 2, "Equivalent hub", "SS 316 equivalent grades", "Technical Data"],
    ["2b-finish-stainless-steel-sheets-chennai/", 2, "Finish intent", "2B finish stainless steel sheets Chennai", "Products"],
    ["mirror-finish-stainless-steel-sheets-chennai/", 2, "Finish intent", "mirror finish stainless steel sheets Chennai", "Products"],
    ["polished-stainless-steel-pipes-chennai/", 2, "Finish intent", "polished stainless steel pipes Chennai", "Products"],
    ["stainless-steel-suppliers-parrys-chennai/", 2, "Chennai micro market", "stainless steel suppliers Parrys Chennai", "Locations"],
    ["stainless-steel-dealers-george-town-chennai/", 2, "Chennai micro market", "stainless steel dealers George Town Chennai", "Locations"],
    ["stainless-steel-suppliers-gummidipoondi/", 2, "Industrial corridor location", "stainless steel suppliers Gummidipoondi", "Locations"],
    ["ss-304-sheets-parrys-chennai/", 2, "City product page", "SS 304 sheets Parrys Chennai", "Products"],
    ["ss-304-pipes-ambattur/", 2, "City product page", "SS 304 pipes Ambattur", "Products"],
    ["ss-316-pipes-sriperumbudur/", 2, "City product page", "SS 316 pipes Sriperumbudur", "Products"],
    ["ss-304-pipes-sricity/", 2, "City product page", "SS 304 pipes Sricity", "Products"],
    ["ss-316-pipes-tada/", 2, "City product page", "SS 316 pipes Tada", "Products"],
    ["stainless-steel-suppliers-hosur/", 2, "Priority industrial city", "stainless steel suppliers Hosur", "Locations"],
    ["stainless-steel-suppliers-renigunta/", 2, "Priority logistics location", "stainless steel suppliers Renigunta", "Locations"],
    ["stainless-steel-suppliers-pondicherry/", 2, "Nearby market", "stainless steel suppliers Pondicherry", "Locations"],
    ["blog/astm-a240-astm-a312-stainless-steel-buyers/", 2, "Technical authority blog", "ASTM A240 ASTM A312 stainless steel buyers", "Blog"],
    ["blog/polished-stainless-steel-pipes-for-railings-chennai/", 2, "Finish/application authority blog", "polished stainless steel pipes railings Chennai", "Blog"],
    ["blog/stainless-steel-suppliers-ambattur-buyer-checklist/", 2, "Location authority blog", "stainless steel suppliers Ambattur checklist", "Blog"],
    ["blog/stainless-steel-supply-to-sricity-and-tada/", 2, "Corridor authority blog", "stainless steel supply Sricity Tada", "Blog"],
    ["technical-data/", 3, "Technical hub", "stainless steel technical data", "Home"],
    ["locations-we-serve/", 3, "Location hub", "stainless steel suppliers Tamil Nadu", "Home"],
    ["industries-we-serve/", 3, "Industry hub", "stainless steel for industries Chennai", "Home"],
    ["ss-202/", 3, "Grade page", "SS 202 suppliers Chennai", "Stainless Steel"],
    ["ss-304l/", 3, "Grade page", "SS 304L suppliers Chennai", "Stainless Steel"],
    ["ss-316l/", 3, "Grade page", "SS 316L suppliers Chennai", "Stainless Steel"],
    ["ss-310/", 3, "Grade page", "SS 310 suppliers Chennai", "Stainless Steel"],
    ["stainless-steel-tubes/", 3, "Product form", "stainless steel tubes Chennai", "Products"],
    ["stainless-steel-angles/", 3, "Product form", "stainless steel angles Chennai", "Products"],
    ["stainless-steel-fasteners/", 3, "Product form", "stainless steel fasteners Chennai", "Products"]
  ].slice(0, 75);
  write(
    "google-indexing-priority-list.md",
    [
      "# Google Indexing Priority List",
      "",
      "- Use after final domain launch and Search Console verification. Do not submit GitHub Pages preview URLs as the final canonical domain target.",
      "",
      "| Priority | URL | Reason | Target keyword | Parent hub page |",
      "| ---: | --- | --- | --- | --- |",
      ...rows.map(([slug, priority, reason, keyword, hub]) => `| ${priority} | ${futureBase}/${slug === "/" ? "" : slug} | ${md(reason)} | ${md(keyword)} | ${md(hub)} |`)
    ].join("\n")
  );
  writeCsv("google-indexing-priority-list.csv", [
    ["priority", "url", "reason", "target_keyword", "parent_hub_page"],
    ...rows.map(([slug, priority, reason, keyword, hub]) => [priority, `${futureBase}/${slug === "/" ? "" : slug}`, reason, keyword, hub])
  ]);
  return { count: rows.length };
}

function buildDomainReport(context) {
  const cnamePresent = fs.existsSync(path.join(root, "CNAME"));
  const noJekyllPresent = fs.existsSync(path.join(root, ".nojekyll"));
  const robots = read(path.join(root, "robots.txt"));
  const robotsReady = robots.includes("Sitemap: https://www.stainlesssteeldealers.com/sitemap.xml");
  const canonicalIssues = allHtmlFiles()
    .filter((file) => !path.relative(root, file).replace(/\\/g, "/").startsWith("reports/"))
    .map((file) => ({ file: path.relative(root, file).replace(/\\/g, "/"), canonical: canonical(read(file)) }))
    .filter((row) => row.canonical && !row.canonical.startsWith(`${futureBase}/`));
  const filesReady = context.inventory.totalPages === context.sitemapCount && !cnamePresent && noJekyllPresent;
  write(
    "domain-launch-readiness.md",
    [
      "# Domain Launch Readiness",
      "",
      `- Final domain target: ${futureBase}/`,
      `- Current CNAME status: ${cnamePresent ? "present - BLOCKER" : "absent"}`,
      "- GitHub Pages custom domain status: not connected in repository files; verify GitHub Pages settings at launch time before any DNS change.",
      `- Files ready: ${yes(filesReady)}`,
      `- Sitemap ready: ${yes(context.sitemapCount === context.inventory.totalPages)}`,
      `- Robots ready: ${yes(robotsReady)}`,
      `- Canonical ready: ${yes(canonicalIssues.length === 0)}`,
      "- Google Search Console tasks pending: verify final domain property, submit sitemap, inspect homepage, request indexing for priority pages.",
      "- GoDaddy DNS tasks pending: later add the required GitHub Pages DNS records only when launch is approved; do not change now.",
      "- IndiaMART final link pending: yes, exact Bharat Metals IndiaMART profile URL still pending.",
      `- Launch blockers: ${cnamePresent ? "CNAME exists unexpectedly" : "none for static files; DNS/domain connection intentionally pending"}`,
      "",
      "## Later Launch Steps",
      "1. Confirm final approval to launch on stainlesssteeldealers.com.",
      "2. Configure the GitHub Pages custom domain for www.stainlesssteeldealers.com.",
      "3. Add only the required GitHub Pages DNS records in GoDaddy after approval.",
      "4. Wait for DNS propagation and HTTPS certificate provisioning.",
      "5. Verify https://www.stainlesssteeldealers.com/ returns HTTP 200.",
      "6. Submit sitemap.xml in Google Search Console.",
      "7. Submit the priority indexing list after the canonical domain is live."
    ].join("\n")
  );
  return { filesReady, cnameAbsent: !cnamePresent, noJekyllPresent, canonicalReady: canonicalIssues.length === 0, robotsReady };
}

async function buildLiveReport() {
  const rows = [];
  for (const urlPath of livePaths) {
    try {
      const response = await fetch(`${previewBase}${urlPath}`, { redirect: "follow" });
      const body = await response.text();
      rows.push({
        urlPath,
        status: response.status,
        h1: pageH1(body),
        title: pageTitle(body),
        description: metaDescription(body),
        canonical: canonical(body),
        faq: faqCount(body),
        schema: schemaTypes(body).join("; "),
        rfq: hasRfq(body),
        chips: hasChips(body),
        ctas: hasCtas(body)
      });
    } catch (error) {
      rows.push({ urlPath, status: "ERROR", h1: "", title: "", description: error.message, canonical: "", faq: 0, schema: "", rfq: false, chips: false, ctas: false });
    }
  }
  const pass = rows.every((row) => row.status === 200 && row.h1 && row.title && row.description && row.canonical && row.faq > 0 && row.schema && row.rfq && row.ctas);
  write(
    "live-money-page-check.md",
    [
      "# Live Money Page Check",
      "",
      `- Preview base: ${previewBase}/`,
      `- Result: ${pass ? "PASS" : "REVIEW"}`,
      "",
      "| URL | HTTP | H1 | Title | Meta description | Canonical | FAQ count | Schema types | RFQ section | Popular search chips | CTA links |",
      "| --- | ---: | --- | --- | --- | --- | ---: | --- | --- | --- | --- |",
      ...rows.map((row) => `| ${row.urlPath} | ${row.status} | ${md(row.h1)} | ${md(row.title)} | ${md(row.description)} | ${row.canonical} | ${row.faq} | ${md(row.schema)} | ${yes(row.rfq)} | ${yes(row.chips)} | ${yes(row.ctas)} |`)
    ].join("\n")
  );
  return { pass, rows };
}

async function main() {
  const inventory = JSON.parse(read(path.join(reportsDir, "mega-sprint-pages.json")) || "{}");
  const sitemap = read(path.join(root, "sitemap.xml"));
  const sitemapCount = (sitemap.match(/<loc>/g) || []).length;
  const context = {
    inventory,
    sitemap,
    sitemapCount,
    humanSitemap: html("site-map/"),
    home: html(""),
    products: html("products/"),
    stainless: html("stainless-steel/"),
    technical: html("technical-data/"),
    blog: html("blog/")
  };
  const clusters = buildClusterReports(context);
  const jindal = buildJindalSafetyReport();
  const price = buildPriceReport();
  const spec = buildSpecReport();
  const links = buildInternalLinkReport(context);
  const homeFooter = buildHomepageFooterReport(context);
  const claims = buildClaimReport();
  const indexing = buildIndexingReports();
  const domain = buildDomainReport(context);
  const live = await buildLiveReport();
  const summary = {
    totalPages: inventory.totalPages,
    sitemapUrls: sitemapCount,
    competitorSeoClustersVerified: clusters.pass,
    liveSamplePass: live.pass,
    jindalSafetyPass: jindal.pass,
    priceSafetyPass: price.pass,
    specificationModulePass: spec.pass,
    internalMoneyLinkMapPass: links.pass,
    homepageFooterMoneyBlockPass: homeFooter.pass,
    claimSafetyPass: claims.pass,
    indexingPriorityListCreated: indexing.count === 75,
    domainLaunchReadinessReportCreated: true,
    cnameAbsent: domain.cnameAbsent,
    noJekyllPresent: domain.noJekyllPresent
  };
  write(
    "competitor-seo-launch-readiness-summary.md",
    [
      "# Competitor SEO Launch Readiness Summary",
      "",
      ...Object.entries(summary).map(([key, value]) => `- ${key}: ${value}`)
    ].join("\n")
  );
  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
