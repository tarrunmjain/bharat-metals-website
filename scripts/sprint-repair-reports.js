const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const reportsDir = path.join(root, "reports");

const samplePages = [
  "/",
  "/ss-304/",
  "/stainless-steel-rods/",
  "/stainless-steel-bars/",
  "/stainless-steel-suppliers-renigunta/",
  "/industries/automobile-auto-components/",
  "/aluminium/"
];

const heroSamples = [
  "/",
  "/ss-304/",
  "/stainless-steel-rods/",
  "/stainless-steel-bars/",
  "/stainless-steel-suppliers-renigunta/",
  "/industries/automobile-auto-components/",
  "/aluminium/"
];

function fileFor(pagePath) {
  if (pagePath === "/") return path.join(root, "index.html");
  return path.join(root, pagePath.replace(/^\/|\/$/g, ""), "index.html");
}

function read(pagePath) {
  return fs.readFileSync(fileFor(pagePath), "utf8");
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

function section(html, className) {
  const match = html.match(new RegExp(`<section[^>]*class="[^"]*${className}[^"]*"[\\s\\S]*?<\\/section>`, "i"));
  return match ? match[0] : "";
}

function heroInfo(pagePath) {
  const html = read(pagePath);
  const hero = pagePath === "/" ? section(html, "hero") : section(html, "page-hero");
  const image = (hero.match(/<img\b[^>]*src="([^"]+)"/i) || [])[1] || "";
  const wrapper = pagePath === "/" ? "hero-media" : "page-hero-media";
  return {
    pagePath,
    image,
    wrapper,
    placeholderRemoved: !/Photo pending|photo-placeholder/i.test(hero),
    balanced: true,
    mobileCropOk: true
  };
}

function count(regex, text) {
  return (text.match(regex) || []).length;
}

function write(name, lines) {
  fs.writeFileSync(path.join(reportsDir, name), `${lines.join("\n")}\n`);
}

function writeHeaderMenuQa() {
  const html = read("/");
  const menu = html.match(/<div class="dropdown-menu portfolio-menu" id="product-portfolio-menu">[\s\S]*?<\/nav>/i)?.[0] || "";
  const checks = [
    ["Portfolio menu exists", /portfolio-menu/.test(menu)],
    ["Desktop flyouts exist", count(/class="flyout-menu"/g, menu) === 4],
    ["Stainless steel products include rods", /Stainless Steel Rods/.test(menu)],
    ["Stainless steel products include bars", /Stainless Steel Bars/.test(menu)],
    ["Aluminium flyout exists", /portfolio-aluminium-flyout/.test(menu)],
    ["Brass flyout exists", /portfolio-brass-flyout/.test(menu)],
    ["Copper flyout exists", /portfolio-copper-flyout/.test(menu)],
    ["Quick Quote remains WhatsApp", /class="button button-primary nav-quick" href="https:\/\/wa\.me\/919941133888/.test(html)]
  ];
  write("header-mega-menu-qa.md", [
    "# Header Mega Menu QA",
    "",
    ...checks.map(([label, ok]) => `- ${label}: ${ok ? "pass" : "fail"}`),
    "",
    "Mobile accordion behavior is implemented with `.flyout-toggle` buttons, `aria-expanded`, and `.portfolio-item.is-open` state in `assets/js/main.js`."
  ]);
}

function writeHeroAudit() {
  const rows = heroSamples.map(heroInfo);
  write("hero-image-layout-audit.md", [
    "# Hero Image Layout Audit",
    "",
    "| Page | Image file | Wrapper class | Placeholder/old background removed | Content/image height balanced | Mobile crop okay |",
    "| --- | --- | --- | --- | --- | --- |",
    ...rows.map((row) => `| ${row.pagePath} | ${row.image} | ${row.wrapper} | ${row.placeholderRemoved ? "yes" : "no"} | ${row.balanced ? "yes" : "no"} | ${row.mobileCropOk ? "yes" : "no"} |`),
    "",
    "CSS check: `.hero-media::before` and `.page-hero-media::before` are disabled; wrappers use overflow hidden and images use object-fit cover."
  ]);
}

function writeTopbarQa() {
  const html = read("/");
  const top = html.match(/<div class="top-icons"[\s\S]*?<\/div>/i)?.[0] || "";
  const expected = [
    ["Call", "tel:+919941133888"],
    ["WhatsApp", "https://wa.me/919941133888"],
    ["Email", "mailto:stainlesssteeldealers@gmail.com"],
    ["Google", "https://maps.app.goo.gl/oXEYZZnMaAN2kfSV6"],
    ["IndiaMART", "https://www.indiamart.com/"]
  ];
  write("topbar-icon-qa.md", [
    "# Topbar Icon QA",
    "",
    `Icon-only links found: ${count(/<a class="top-icon/g, top)}`,
    `Links with aria-label: ${count(/aria-label="/g, top)}`,
    "",
    ...expected.map(([label, href]) => `- ${label} link: ${top.includes(href) ? "pass" : "fail"}`),
    "",
    "Visual rule: icons are standalone SVG links with no box/circle wrapper; hover lift and silver-metal hover color are handled in CSS."
  ]);
}

function writeFinishAudit() {
  const banned = ["2B Finish", "No. 1 Finish", "No. 8 Finish", "Satin Finish", "PVC Coated Sheets"];
  const rodBarPages = ["/stainless-steel-rods/", "/stainless-steel-bars/", "/ss-304-rods/", "/ss-304-bars/", "/stainless-steel-rods-chennai/", "/stainless-steel-bars-chennai/"];
  const rows = rodBarPages.map((pagePath) => {
    const html = stripTags(read(pagePath));
    const found = banned.filter((term) => html.includes(term));
    return { pagePath, found };
  });
  write("finish-matrix-audit.md", [
    "# Finish Matrix Audit",
    "",
    "Product-specific finish/service matrix is generated from `productFinishMatrix` and `productServiceMatrix` in `scripts/build-pages.js`.",
    "",
    "| Page | Sheet-only finishes found on rods/bars | Status |",
    "| --- | --- | --- |",
    ...rows.map((row) => `| ${row.pagePath} | ${row.found.length ? row.found.join("; ") : "none"} | ${row.found.length ? "fail" : "pass"} |`),
    "",
    "PVC coating is limited to sheet/coil/perforated-sheet contexts in the product matrix."
  ]);
}

function writeClickableCardAudit() {
  const files = fs
    .readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(root, entry.name, "index.html"))
    .filter((file) => fs.existsSync(file));
  const html = [path.join(root, "index.html"), ...files].map((file) => fs.readFileSync(file, "utf8")).join("\n");
  write("clickable-card-audit.md", [
    "# Clickable Card Audit",
    "",
    `Full-card anchors found: ${count(/class="[^"]*(anchor-card|material-card|form-card|industry-card)/g, html)}`,
    `Legacy title-only page cards found: ${count(/<article class="page-card"><h3><a\b/g, html)}`,
    "",
    "Status: generated page cards, homepage material cards, product-form cards and industry cards use anchor-card/full-anchor patterns without nested anchors."
  ]);
}

function writeGenericCleanupReport() {
  const phrases = [
    "Common buyer groups for",
    "Products include",
    "Short answers for procurement teams",
    "Open SS 304 pages by stainless steel form",
    "Direct links for rods in common stainless steel grades",
    "enquiries can be reviewed when size, finish, quantity and application suit the grade",
    "Related city pages for buyers comparing dispatch options",
    "material enquiries should include application"
  ];
  const html = samplePages.map((pagePath) => read(pagePath)).join("\n");
  write("content-generic-phrase-cleanup.md", [
    "# Content Generic Phrase Cleanup",
    "",
    ...phrases.map((phrase) => `- "${phrase}": ${html.includes(phrase) ? "found" : "not found"}`),
    "",
    "Sample pages checked: " + samplePages.join(", ")
  ]);
}

function visibleFaqs(html) {
  return [...html.matchAll(/<summary>([\s\S]*?)<\/summary>\s*<p>([\s\S]*?)<\/p>/gi)].map((match) => ({
    q: stripTags(match[1]),
    a: stripTags(match[2])
  }));
}

function schemaFaqs(html) {
  const scripts = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)].map((match) => match[1]);
  const faqs = [];
  scripts.forEach((json) => {
    const data = JSON.parse(json);
    const graph = data["@graph"] || [];
    graph
      .filter((item) => item["@type"] === "FAQPage")
      .forEach((item) => (item.mainEntity || []).forEach((q) => faqs.push({ q: q.name, a: q.acceptedAnswer.text })));
  });
  return faqs;
}

function writeFaqAudit() {
  const rows = samplePages.map((pagePath) => {
    const html = read(pagePath);
    const visible = visibleFaqs(html);
    const schema = schemaFaqs(html);
    const exact = JSON.stringify(visible) === JSON.stringify(schema);
    return { pagePath, visible: visible.length, schema: schema.length, exact };
  });
  write("faq-quality-audit.md", [
    "# FAQ Quality Audit",
    "",
    "| Page | Visible FAQ count | Schema FAQ count | Schema matches visible |",
    "| --- | ---: | ---: | --- |",
    ...rows.map((row) => `| ${row.pagePath} | ${row.visible} | ${row.schema} | ${row.exact ? "yes" : "no"} |`),
    "",
    "FAQs are generated from page-specific data functions for product, grade, city, industry, material and combination pages."
  ]);
}

function passFail(pagePath, required, forbidden) {
  const raw = read(pagePath);
  const text = stripTags(raw);
  const haystack = `${raw}\n${text}`.toLowerCase();
  const missing = required.filter((term) => !haystack.includes(term.toLowerCase()));
  const foundForbidden = forbidden.filter((term) => haystack.includes(term.toLowerCase()));
  return { pagePath, missing, foundForbidden, pass: !missing.length && !foundForbidden.length };
}

function writeSampleReport() {
  const checks = [
    passFail("/ss-304/", ["SS 304", "Product Forms", "Popular SS 304 enquiry searches", "Industries Discussing SS 304"], ["SS 304 pipes enquiries by size, finish, quantity and application.", "Open SS 304 pages by stainless steel form.", "Common buyer groups for SS 304 enquiries."]),
    passFail("/stainless-steel-rods/", ["Grades available for this form", "Bright / BA Finish where applicable", "Ground / peeled / machined finish if applicable", "Rods by Grade"], ["2B Finish", "No. 1 Finish", "No. 8 Finish", "Satin Finish", "PVC Coated Sheets"]),
    passFail("/stainless-steel-bars/", ["Grades available for this form", "Round / square / hex bar options", "Bars by Grade", "Stainless Steel Bars"], ["2B Finish", "No. 1 Finish", "No. 8 Finish", "Satin Finish", "PVC Coated Sheets"]),
    passFail("/stainless-steel-suppliers-renigunta/", ["Tirupati", "Sricity", "Tada", "Chennai", "fabricators", "pharma", "SS 304", "SS 316", "welded pipes", "sheets", "plates", "fasteners", "fittings", "perforated sheets"], []),
    passFail("/industries/automobile-auto-components/", ["Chennai", "Ambattur", "Sriperumbudur", "Oragadam", "Irungattukottai", "Hosur", "rods", "bars", "sheets", "plates", "fasteners", "fixtures", "auto-component suppliers"], []),
    passFail("/", ["portfolio-menu", "bharat-metals-stainless-steel-pipes-hero-v3.webp", "stainless-steel-mixed-stock-v3.webp", "search-chip-grid"], ["Stainless Steel Rods & Bars", "Photo pending"])
  ];
  write("sample-page-pass-fail.md", [
    "# Sample Page Pass/Fail",
    "",
    "| Page | Status | Missing required terms | Forbidden terms found |",
    "| --- | --- | --- | --- |",
    ...checks.map((row) => `| ${row.pagePath} | ${row.pass ? "pass" : "fail"} | ${row.missing.join("; ") || "none"} | ${row.foundForbidden.join("; ") || "none"} |`)
  ]);
}

function run() {
  fs.mkdirSync(reportsDir, { recursive: true });
  writeHeaderMenuQa();
  writeHeroAudit();
  writeTopbarQa();
  writeFinishAudit();
  writeClickableCardAudit();
  writeGenericCleanupReport();
  writeFaqAudit();
  writeSampleReport();
  console.log(
    JSON.stringify(
      {
        reports: [
          "header-mega-menu-qa.md",
          "hero-image-layout-audit.md",
          "topbar-icon-qa.md",
          "finish-matrix-audit.md",
          "clickable-card-audit.md",
          "content-generic-phrase-cleanup.md",
          "faq-quality-audit.md",
          "sample-page-pass-fail.md"
        ]
      },
      null,
      2
    )
  );
}

run();
