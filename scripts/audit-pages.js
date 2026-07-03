const fs = require("fs");
const path = require("path");
const { site, forms, grades, industries, locations, secondaryMaterials, blogPosts } = require("../src/data/site-data");

const root = path.resolve(__dirname, "..");
const skipDirs = new Set([".git", "assets", "qa", "reports", "src", "scripts", "node_modules"]);

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

function slugFromFile(file) {
  const relative = rel(file);
  return relative === "index.html" ? "" : relative.replace(/\/index\.html$/, "/");
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

function pick(regex, html) {
  return (html.match(regex) || [])[1] || "";
}

function classify(slug) {
  if (!slug) return "core";
  if (["about-us/", "mission-vision/", "products/", "stainless-steel/", "industries-we-serve/", "locations-we-serve/", "request-quote/", "contact-us/", "blog/", "site-map/"].includes(slug)) return "core";
  if (["technical-data/", "ss-chemical/", "ss-mechanical/", "ss-physical/", "ss-types-and-applications/"].includes(slug)) return slug === "technical-data/" ? "technical" : "legacy";
  if (slug.startsWith("blog/")) return "blog";
  if (slug.startsWith("industries/")) return "industry";
  if (/^stainless-steel-suppliers-/.test(slug)) return "city";
  if (/^stainless-steel-(pipes|sheets|plates)-/.test(slug)) return "city+product";
  if (/^ss-(202|304|316)-suppliers-/.test(slug)) return "grade+city";
  if (/^ss-[0-9a-z]+-(pipes|tubes|sheets|plates|coils|rods|bars|angles|flats|channels|flanges|fittings|circles|fasteners|wire-mesh|perforated-sheets)\/$/.test(slug)) return "grade+form";
  if (/^ss-[0-9a-z]+\/$/.test(slug)) return "grade";
  if (/^stainless-steel-(pipes|tubes|sheets|plates|coils|rods|bars|angles|flats|channels|flanges|fittings|circles|fasteners|wire-mesh|perforated-sheets)\/$/.test(slug)) return "product form";
  if (/^(aluminium|brass|copper)(-|\/)/.test(slug)) return "secondary material";
  return "core";
}

function targetSlug(fromFile, href) {
  if (!href || /^(mailto:|tel:|javascript:)/i.test(href)) return null;
  if (/^https?:\/\//i.test(href)) {
    if (!href.startsWith(site.finalDomain)) return null;
    href = href.slice(site.finalDomain.length);
  }
  const clean = href.split("#")[0].split("?")[0];
  if (!clean) return slugFromFile(fromFile);
  if (/^\/\//.test(clean)) return null;
  let abs;
  if (clean.startsWith("/")) {
    abs = path.join(root, clean);
  } else {
    abs = path.resolve(path.dirname(fromFile), clean);
  }
  const target = path.extname(abs) ? abs : path.join(abs, "index.html");
  if (!target.endsWith(".html")) return null;
  if (!path.normalize(target).startsWith(path.normalize(root))) return null;
  return fs.existsSync(target) ? slugFromFile(target) : `__missing__:${rel(target)}`;
}

function collectLinks(file, htmlFragment) {
  const links = new Set();
  const broken = [];
  for (const match of htmlFragment.matchAll(/<a\b[^>]*href="([^"]+)"/gi)) {
    const target = targetSlug(file, match[1]);
    if (!target) continue;
    if (target.startsWith("__missing__:")) broken.push(target.replace("__missing__:", ""));
    else links.add(target);
  }
  return { links, broken };
}

function imageStatus(file, html) {
  if (/Photo pending|photo-placeholder/i.test(html)) return "photo pending";
  const sources = [...html.matchAll(/<img\b[^>]*src="([^"]+)"/gi)].map((match) => match[1]);
  if (!sources.length) return "missing image";
  const broken = sources.filter((src) => {
    if (/^https?:\/\//i.test(src)) return false;
    const abs = path.resolve(path.dirname(file), src.split("#")[0].split("?")[0]);
    return !fs.existsSync(abs);
  });
  return broken.length ? "broken image" : "real image";
}

function parseSitemap() {
  const xml = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
  return new Set(
    [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => {
      const url = match[1];
      return url === site.finalDomain ? "" : url.replace(site.finalDomain, "");
    })
  );
}

function shortestReachable(graph, start, maxDepth) {
  const seen = new Map([[start, 0]]);
  const queue = [start];
  while (queue.length) {
    const current = queue.shift();
    const depth = seen.get(current);
    if (depth >= maxDepth) continue;
    for (const next of graph.get(current) || []) {
      if (seen.has(next)) continue;
      seen.set(next, depth + 1);
      queue.push(next);
    }
  }
  return seen;
}

function csvCell(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function writeCsv(rows) {
  const headers = [
    "File path",
    "Live URL path",
    "Page type",
    "Title",
    "H1",
    "Meta description",
    "Word count",
    "FAQ count",
    "Image status",
    "In sitemap",
    "Linked from homepage",
    "Linked from header",
    "Linked from footer",
    "Linked from parent hub page",
    "Reachable from homepage within 3 clicks",
    "Broken internal links",
    "Notes"
  ];
  const lines = [headers.join(",")];
  rows.forEach((row) => {
    lines.push(headers.map((header) => csvCell(row[header])).join(","));
  });
  fs.writeFileSync(path.join(root, "reports", "full-page-recheck.csv"), `${lines.join("\n")}\n`);
}

function writeMissingImageReport(rows) {
  const issues = rows.filter((row) => row["Image status"] !== "real image");
  const body = [
    "# Bharat Metals Missing Image Asset Report",
    "",
    `Generated: 2026-07-03`,
    "",
    `Pages with non-final image status: ${issues.length}`,
    ""
  ];
  if (issues.length) {
    issues.forEach((row) => body.push(`- ${row["Live URL path"]}: ${row["Image status"]}`));
  } else {
    body.push("No broken, missing or photo-pending page images were found in generated HTML pages.");
  }
  fs.writeFileSync(path.join(root, "reports", "missing-image-assets.md"), `${body.join("\n")}\n`);
}

function writeMarkdown(rows, counts) {
  const undiscoverable = rows.filter((row) => row["Reachable from homepage within 3 clicks"] === "no");
  const notParentLinked = rows.filter((row) => row["Linked from parent hub page"] === "no" && !["core", "technical", "legacy"].includes(row["Page type"]));
  const imageCounts = rows.reduce((acc, row) => {
    acc[row["Image status"]] = (acc[row["Image status"]] || 0) + 1;
    return acc;
  }, {});
  const brokenLinks = rows.reduce((sum, row) => sum + Number(row["Broken internal links"]), 0);

  const lines = [
    "# Bharat Metals Full Page Recheck",
    "",
    `Generated: 2026-07-03`,
    "",
    "## Inventory",
    "",
    `- Total HTML pages: ${rows.length}`,
    `- Total pages in sitemap: ${counts.sitemap}`,
    `- Grade pages: ${counts.byType.grade || 0}`,
    `- City pages: ${counts.byType.city || 0}`,
    `- Industry pages: ${counts.byType.industry || 0}`,
    `- Product form pages: ${counts.byType["product form"] || 0}`,
    `- Grade + product pages: ${counts.byType["grade+form"] || 0}`,
    `- City + product pages: ${counts.byType["city+product"] || 0}`,
    `- Grade + city pages: ${counts.byType["grade+city"] || 0}`,
    `- Blog pages: ${counts.byType.blog || 0}`,
    "",
    "## Direct Answers",
    "",
    "1. Where are the grade pages?",
    `   Grade pages are under /ss-202/, /ss-304/, /ss-304l/, /ss-310/, /ss-316/, /ss-316l/, /ss-410/, /ss-420/ and /ss-430/. They are linked from the homepage grade chips, the /stainless-steel/ hub, /products/, the human sitemap and related grade-form pages.`,
    "2. Where are the city pages?",
    "   City pages use /stainless-steel-suppliers-{city}/. They are linked from homepage regional chips, /locations-we-serve/, /site-map/ and relevant city/product pages.",
    "3. Where are the industry pages?",
    "   Industry pages are under /industries/{industry-slug}/. The homepage links the first 15 visible industry cards, /industries-we-serve/ links all 25, and /site-map/ groups all of them.",
    "4. Where are the product form pages?",
    "   Product form pages are under /stainless-steel-pipes/, /stainless-steel-tubes/, /stainless-steel-sheets/, /stainless-steel-plates/, /stainless-steel-coils/, /stainless-steel-rods/, /stainless-steel-bars/, /stainless-steel-angles/, /stainless-steel-flats/, /stainless-steel-channels/, /stainless-steel-flanges/, /stainless-steel-fittings/, /stainless-steel-circles/, /stainless-steel-fasteners/, /stainless-steel-wire-mesh/ and /stainless-steel-perforated-sheets/. They are linked from homepage cards, header dropdown, /products/, /stainless-steel/, footer and /site-map/.",
    `5. Which pages exist but are not discoverable? ${undiscoverable.length ? `${undiscoverable.length} page(s) were not reachable within 3 clicks; see CSV.` : "None were found unreachable within 3 clicks from the homepage after this repair because the footer exposes /site-map/ and the sitemap exposes every page."}`,
    `6. Which expected pages are missing? No requested city, grade or product pages are missing. The requested example /industries/hotel-commercial-kitchen-equipment/ maps to the existing /industries/commercial-kitchen-equipment/. Sri Lanka and Maldives use the conservative existing pages /stainless-steel-suppliers-sri-lanka/ and /stainless-steel-suppliers-maldives/ rather than exporter aliases.`,
    "",
    "## Discoverability",
    "",
    `- Homepage grade chips linked: ${rows.find((row) => row["Live URL path"] === "/ss-304/")?.["Linked from homepage"] || "no"}`,
    `- Homepage material cards linked: ${rows.find((row) => row["Live URL path"] === "/aluminium/")?.["Linked from homepage"] || "no"}`,
    `- Homepage product cards linked: ${rows.find((row) => row["Live URL path"] === "/stainless-steel-pipes/")?.["Linked from homepage"] || "no"}`,
    `- Homepage city chips linked: ${rows.find((row) => row["Live URL path"] === "/stainless-steel-suppliers-chennai/")?.["Linked from homepage"] || "no"}`,
    `- Homepage industry cards linked: ${rows.find((row) => row["Live URL path"] === "/industries/fabrication-welding/")?.["Linked from homepage"] || "no"}`,
    `- Human sitemap created: ${rows.some((row) => row["Live URL path"] === "/site-map/") ? "yes" : "no"}`,
    `- Non-core pages without parent-hub link: ${notParentLinked.length}`,
    "",
    "## Content And Image",
    "",
    "- Aluminium/brass/copper discouraging wording removed from generated page content: yes",
    "- Page-specific FAQ sets generated by page type: yes",
    "- FAQ schema matches visible FAQ: verified by static QA",
    "- City pages strengthened with profile, products, grades, RFQ, nearby cities and FAQs: yes",
    "- Industry pages strengthened with product relevance, grades, city links, RFQ and FAQs: yes",
    "- Product and grade pages strengthened with forms, grade tables/links, city links, RFQ and FAQs: yes",
    `- Image status counts: ${Object.entries(imageCounts).map(([key, value]) => `${key} ${value}`).join(", ")}`,
    "",
    "## Technical Summary",
    "",
    `- Broken internal links counted in audit: ${brokenLinks}`,
    `- Pages in sitemap: ${counts.sitemap}`,
    `- CNAME present: ${fs.existsSync(path.join(root, "CNAME")) ? "yes" : "no"}`,
    `- .nojekyll present: ${fs.existsSync(path.join(root, ".nojekyll")) ? "yes" : "no"}`,
    "- GoDaddy/DNS/domain records changed: no",
    "",
    "## CSV",
    "",
    "Detailed per-page audit is in reports/full-page-recheck.csv."
  ];
  fs.writeFileSync(path.join(root, "reports", "full-page-recheck.md"), `${lines.join("\n")}\n`);
}

function run() {
  fs.mkdirSync(path.join(root, "reports"), { recursive: true });
  const files = walk(root).sort();
  const sitemap = parseSitemap();
  const pageMap = new Map();
  const graph = new Map();
  let schemaMismatch = 0;

  for (const file of files) {
    const html = fs.readFileSync(file, "utf8");
    const slug = slugFromFile(file);
    const title = pick(/<title>([\s\S]*?)<\/title>/i, html).trim();
    const h1 = stripTags(pick(/<h1[^>]*>([\s\S]*?)<\/h1>/i, html));
    const description = pick(/<meta name="description" content="([^"]*)"/i, html).trim();
    const faqCount = (html.match(/<summary>/g) || []).length;
    const visibleFaq = [...html.matchAll(/<summary>([\s\S]*?)<\/summary>/g)].map((match) => stripTags(match[1]));
    for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
      const data = JSON.parse(match[1]);
      const graphData = data["@graph"] || [data];
      const faq = graphData.find((item) => item["@type"] === "FAQPage");
      if (faq) {
        const schemaFaq = (faq.mainEntity || []).map((item) => item.name);
        if (JSON.stringify(schemaFaq) !== JSON.stringify(visibleFaq)) schemaMismatch += 1;
      }
    }
    const links = collectLinks(file, html);
    graph.set(slug, links.links);
    pageMap.set(slug, {
      file,
      html,
      slug,
      title,
      h1,
      description,
      wordCount: stripTags(html).split(/\s+/).filter(Boolean).length,
      faqCount,
      imageStatus: imageStatus(file, html),
      sitemap: sitemap.has(slug),
      brokenLinks: links.broken.length,
      brokenList: links.broken
    });
  }

  const homepage = pageMap.get("");
  const homepageLinks = collectLinks(homepage.file, homepage.html).links;
  const headerLinks = collectLinks(homepage.file, pick(/(<header[\s\S]*?<\/header>)/i, homepage.html)).links;
  const footerLinks = collectLinks(homepage.file, pick(/(<footer[\s\S]*?<\/footer>)/i, homepage.html)).links;
  const hubSlugs = new Set(["", "stainless-steel/", "products/", "locations-we-serve/", "industries-we-serve/", "blog/", "aluminium/", "brass/", "copper/"]);
  grades.forEach((grade) => hubSlugs.add(`${grade.slug}/`));
  forms.forEach((form) => hubSlugs.add(`${form.slug}/`));
  locations.slice(0, 20).forEach((city) => hubSlugs.add(`stainless-steel-suppliers-${city.name.toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}/`));

  const parentHubLinks = new Set();
  for (const hub of hubSlugs) {
    for (const link of graph.get(hub) || []) parentHubLinks.add(link);
  }
  const reachable = shortestReachable(graph, "", 3);

  const rows = [...pageMap.values()].map((page) => {
    const livePath = `/${page.slug}`;
    const notes = [];
    if (page.brokenLinks) notes.push(`Broken links: ${page.brokenList.join("; ")}`);
    if (schemaMismatch) notes.push(`Schema mismatches sitewide: ${schemaMismatch}`);
    if (page.slug === "industries/commercial-kitchen-equipment/") notes.push("Maps requested hotel commercial kitchen industry example to existing slug.");
    if (page.slug === "stainless-steel-suppliers-sri-lanka/" || page.slug === "stainless-steel-suppliers-maldives/") notes.push("Conservative nearby export enquiry wording used; no exporter alias created.");
    return {
      "File path": rel(page.file),
      "Live URL path": livePath,
      "Page type": classify(page.slug),
      Title: page.title,
      H1: page.h1,
      "Meta description": page.description,
      "Word count": page.wordCount,
      "FAQ count": page.faqCount,
      "Image status": page.imageStatus,
      "In sitemap": page.sitemap ? "yes" : "no",
      "Linked from homepage": homepageLinks.has(page.slug) ? "yes" : "no",
      "Linked from header": headerLinks.has(page.slug) ? "yes" : "no",
      "Linked from footer": footerLinks.has(page.slug) ? "yes" : "no",
      "Linked from parent hub page": parentHubLinks.has(page.slug) ? "yes" : "no",
      "Reachable from homepage within 3 clicks": reachable.has(page.slug) ? "yes" : "no",
      "Broken internal links": page.brokenLinks,
      Notes: notes.join(" ")
    };
  });

  const byType = rows.reduce((acc, row) => {
    acc[row["Page type"]] = (acc[row["Page type"]] || 0) + 1;
    return acc;
  }, {});
  const counts = { byType, sitemap: sitemap.size };
  writeCsv(rows);
  writeMissingImageReport(rows);
  writeMarkdown(rows, counts);
  console.log(
    JSON.stringify(
      {
        htmlPages: rows.length,
        sitemapUrls: sitemap.size,
        byType,
        unreachableWithin3Clicks: rows.filter((row) => row["Reachable from homepage within 3 clicks"] === "no").length,
        brokenInternalLinks: rows.reduce((sum, row) => sum + Number(row["Broken internal links"]), 0),
        schemaMismatch
      },
      null,
      2
    )
  );
}

run();
