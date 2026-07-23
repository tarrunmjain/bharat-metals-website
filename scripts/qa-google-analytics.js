const fs = require("fs");
const path = require("path");
const {
  APPROVED_EVENTS,
  MEASUREMENT_ID,
  annotateAnalyticsLinks,
  linkDestination
} = require("../src/templates/analytics");

const root = path.resolve(__dirname, "..");
const reportsDir = path.join(root, "reports");
const domain = "https://www.stainlesssteeldealers.com";
const approvedEvents = new Set(APPROVED_EVENTS);
const tagUrl = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
const configCall = `gtag('config', '${MEASUREMENT_ID}')`;
const correctPhoneHref = "tel:+919941233888";
const correctWhatsAppBase = "https://wa.me/919941233888";
const oldPhonePatterns = ["99411 33888", "9941133888", "919941133888", "+919941133888", "+91 99411 33888"];

function count(input, needle) {
  return input.split(needle).length - 1;
}

function attribute(openingTag, name) {
  const match = openingTag.match(new RegExp(`\\s${name}=(["'])(.*?)\\1`, "i"));
  return match ? match[2] : "";
}

function publishedPages() {
  const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
  return [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => {
    const url = match[1];
    const parsed = new URL(url);
    if (parsed.origin !== domain) throw new Error(`Unexpected sitemap origin: ${url}`);
    const relativePath = decodeURIComponent(parsed.pathname).replace(/^\/|\/$/g, "");
    return {
      url,
      relativePath,
      file: path.join(root, relativePath, "index.html")
    };
  });
}

function sourceFiles(directory) {
  if (!fs.existsSync(directory)) return [];
  const output = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) output.push(...sourceFiles(fullPath));
    else if (/\.(?:js|json|html)$/i.test(entry.name)) output.push(fullPath);
  }
  return output;
}

function destinationType(href) {
  const destination = linkDestination(href);
  return destination.type || "unknown";
}

function interpretation(eventName) {
  return {
    click_call: "Buyer initiated a phone-call action.",
    click_whatsapp: "Buyer opened a general WhatsApp contact action.",
    click_email: "Buyer opened a general email contact action.",
    click_request_quote: "Buyer initiated a quote- or RFQ-focused action.",
    click_google_business_profile: "Visitor opened the Bharat Metals Google Business Profile.",
    click_google_maps: "Visitor opened the Bharat Metals Google Maps location.",
    click_indiamart: "Visitor opened the Bharat Metals IndiaMART profile."
  }[eventName];
}

const pages = publishedPages();
const errors = [];
const warnings = [];
const eventTotals = Object.fromEntries(APPROVED_EVENTS.map((eventName) => [eventName, 0]));
const eventMap = new Map();
const pagesWithoutTag = [];
const duplicateTagPages = [];
const duplicateConfigPages = [];
let trackedElements = 0;
let contactLinks = 0;

for (const page of pages) {
  if (!fs.existsSync(page.file)) {
    errors.push(`Missing published file: ${path.relative(root, page.file)}`);
    continue;
  }

  const html = fs.readFileSync(page.file, "utf8");
  const requestCount = count(html, tagUrl);
  const configCount = count(html, configCall);
  if (requestCount === 0) pagesWithoutTag.push(page.relativePath || "/");
  if (requestCount !== 1) {
    errors.push(`${page.relativePath || "/"} has ${requestCount} gtag.js requests; expected 1.`);
    if (requestCount > 1) duplicateTagPages.push(page.relativePath || "/");
  }
  if (configCount !== 1) {
    errors.push(`${page.relativePath || "/"} has ${configCount} GA4 config calls; expected 1.`);
    if (configCount > 1) duplicateConfigPages.push(page.relativePath || "/");
  }
  if (!/<head>\s*<!-- Google tag \(gtag\.js\) -->/i.test(html)) {
    errors.push(`${page.relativePath || "/"} does not place the Google tag immediately after <head>.`);
  }
  if (/googletagmanager\.com\/gtm\.js/i.test(html) || /\bGTM-[A-Z0-9]+\b/i.test(html)) {
    errors.push(`${page.relativePath || "/"} contains an unapproved Google Tag Manager container.`);
  }
  if (/google-analytics\.com\/analytics\.js|(?:^|[^\w])ga\s*\(/i.test(html)) {
    errors.push(`${page.relativePath || "/"} contains a legacy Analytics tag.`);
  }
  for (const oldPhone of oldPhonePatterns) {
    if (html.includes(oldPhone)) errors.push(`${page.relativePath || "/"} contains old phone value ${oldPhone}.`);
  }

  const anchors = [...html.matchAll(/<a\b[^>]*>[\s\S]*?<\/a>/gi)];
  for (const match of anchors) {
    const anchor = match[0];
    const openingTag = anchor.slice(0, anchor.indexOf(">") + 1);
    const href = attribute(openingTag, "href").replace(/&amp;/gi, "&");
    const eventName = attribute(openingTag, "data-ga-event");
    const location = attribute(openingTag, "data-ga-location");
    const label = attribute(openingTag, "data-ga-label");
    const contactDestination = linkDestination(href);
    const isContactLink =
      Boolean(contactDestination.type) ||
      /^tel:/i.test(href) ||
      /^mailto:/i.test(href) ||
      /^https?:\/\/wa\.me\//i.test(href);

    if (/^tel:/i.test(href) && href !== correctPhoneHref) {
      errors.push(`${page.relativePath || "/"} contains incorrect phone link: ${href}`);
    }
    if (/^https?:\/\/wa\.me\//i.test(href) && !href.startsWith(correctWhatsAppBase)) {
      errors.push(`${page.relativePath || "/"} contains incorrect WhatsApp link: ${href}`);
    }

    if (isContactLink) {
      contactLinks += 1;
      if (!eventName || !location || !label) {
        errors.push(`${page.relativePath || "/"} has an untracked or incompletely tracked contact link: ${href}`);
      }
    }

    if (!eventName) continue;
    trackedElements += 1;
    if (!approvedEvents.has(eventName)) {
      errors.push(`${page.relativePath || "/"} uses unapproved event ${eventName}.`);
      continue;
    }
    if (count(openingTag, "data-ga-event=") !== 1) {
      errors.push(`${page.relativePath || "/"} has duplicate data-ga-event attributes.`);
    }
    if (!location || !label) {
      errors.push(`${page.relativePath || "/"} has incomplete GA attributes for ${eventName}.`);
    }
    if (/99412|919941233888|stainlesssteeldealers|gmail|yahoo/i.test(label)) {
      errors.push(`${page.relativePath || "/"} exposes contact details in data-ga-label: ${label}`);
    }

    eventTotals[eventName] += 1;
    const type = destinationType(href);
    const key = [eventName, location, label, type].join("|");
    const existing = eventMap.get(key) || {
      eventName,
      section: location,
      location,
      label,
      count: 0,
      destinationType: type,
      interpretation: interpretation(eventName)
    };
    existing.count += 1;
    eventMap.set(key, existing);
  }

  if (annotateAnalyticsLinks(html) !== html) {
    errors.push(`${page.relativePath || "/"} does not match the canonical analytics link annotation rules.`);
  }
}

const sourceScanFiles = [
  ...sourceFiles(path.join(root, "src")),
  ...sourceFiles(path.join(root, "scripts")),
  ...sourceFiles(path.join(root, "assets", "js")),
  path.join(root, "package.json"),
  ...pages.map((page) => page.file)
].filter((file, index, list) => fs.existsSync(file) && list.indexOf(file) === index);

const measurementIds = new Set();
const gtmContainerIds = new Set();
for (const file of sourceScanFiles) {
  const input = fs.readFileSync(file, "utf8");
  for (const match of input.matchAll(/\bG-[A-Z0-9]{4,}\b/g)) measurementIds.add(match[0]);
  for (const match of input.matchAll(/\bGTM-[A-Z0-9]+\b/g)) gtmContainerIds.add(match[0]);
}

const otherMeasurementIds = [...measurementIds].filter((id) => id !== MEASUREMENT_ID);
if (otherMeasurementIds.length) errors.push(`Other GA4 Measurement IDs found: ${otherMeasurementIds.join(", ")}`);
if (gtmContainerIds.size) errors.push(`Unapproved GTM containers found: ${[...gtmContainerIds].join(", ")}`);

const mainJs = fs.readFileSync(path.join(root, "assets", "js", "main.js"), "utf8");
if (count(mainJs, 'closest("[data-ga-event]")') !== 1) errors.push("Delegated analytics listener selector must appear exactly once.");
if (count(mainJs, 'window.gtag("event"') !== 1) errors.push("GA4 event dispatch must appear exactly once in main.js.");
if (/preventDefault\s*\(\)/.test(mainJs.slice(mainJs.indexOf('closest("[data-ga-event]")')))) {
  errors.push("Analytics listener must not prevent navigation.");
}
if (/FormData|\.value\b|querySelector(?:All)?\([^)]*(?:input|textarea|form)|dataset\.(?:phone|email|message)|getAttribute\(["'](?:value|data-(?:phone|email|message))/i.test(mainJs)) {
  errors.push("Analytics event code appears to read form fields or visitor-entered information.");
}

const cnamePath = path.join(root, "CNAME");
const cnameValue = fs.existsSync(cnamePath) ? fs.readFileSync(cnamePath, "utf8").trim() : "";
if (cnameValue !== "www.stainlesssteeldealers.com") errors.push(`CNAME is missing or incorrect: ${cnameValue || "missing"}`);
if (!fs.existsSync(path.join(root, ".nojekyll"))) errors.push(".nojekyll is missing.");

const requiredHomepageLabels = [
  "topbar_call",
  "topbar_whatsapp",
  "topbar_email",
  "topbar_google_business_profile",
  "topbar_indiamart",
  "header_quick_quote",
  "hero_call",
  "hero_whatsapp",
  "hero_email",
  "fast_rfq_mail_requirement",
  "final_quote_call",
  "final_quote_whatsapp",
  "final_quote_email_rfq",
  "footer_call",
  "footer_whatsapp",
  "footer_email",
  "footer_google_maps",
  "footer_indiamart"
];
const homepage = fs.readFileSync(path.join(root, "index.html"), "utf8");
for (const label of requiredHomepageLabels) {
  if (!homepage.includes(`data-ga-label="${label}"`)) errors.push(`Homepage is missing required tracked element ${label}.`);
}

const report = {
  generatedAt: new Date().toISOString(),
  measurementId: MEASUREMENT_ID,
  result: errors.length ? "FAIL" : "PASS",
  publishedPages: pages.length,
  pagesTagged: pages.length - pagesWithoutTag.length,
  pagesWithoutTag,
  duplicateTagPages,
  duplicateConfigPages,
  duplicateTagCount: duplicateTagPages.length,
  measurementIdsFound: [...measurementIds].sort(),
  otherMeasurementIdsFound: otherMeasurementIds.sort(),
  gtmContainerIdsFound: [...gtmContainerIds].sort(),
  legacyAnalyticsFound: false,
  trackedElements,
  contactLinks,
  eventTotals,
  cname: cnameValue,
  noJekyllPresent: fs.existsSync(path.join(root, ".nojekyll")),
  delegatedListenerPresent: count(mainJs, 'closest("[data-ga-event]")') === 1,
  errors,
  warnings
};

fs.mkdirSync(reportsDir, { recursive: true });
fs.writeFileSync(path.join(reportsDir, "google-analytics-installation-audit.json"), `${JSON.stringify(report, null, 2)}\n`);

const summaryLines = [
  "# Google Analytics Installation Audit",
  "",
  `- Result: ${report.result}`,
  `- Measurement ID: \`${MEASUREMENT_ID}\``,
  `- Published pages checked: ${report.publishedPages}`,
  `- Pages tagged exactly once: ${report.pagesTagged}`,
  `- Duplicate tag pages: ${report.duplicateTagCount}`,
  `- Other Measurement IDs found: ${report.otherMeasurementIdsFound.length ? report.otherMeasurementIdsFound.join(", ") : "none"}`,
  `- GTM containers found: ${report.gtmContainerIdsFound.length ? report.gtmContainerIdsFound.join(", ") : "none"}`,
  `- Tracked contact and quote elements: ${report.trackedElements}`,
  `- CNAME: \`${report.cname}\``,
  `- .nojekyll present: ${report.noJekyllPresent ? "yes" : "no"}`,
  `- Delegated listener present once: ${report.delegatedListenerPresent ? "yes" : "no"}`,
  "",
  "## Event Totals",
  "",
  ...APPROVED_EVENTS.map((eventName) => `- ${eventName}: ${eventTotals[eventName]}`),
  "",
  "## Critical Errors",
  "",
  ...(errors.length ? errors.map((error) => `- ${error}`) : ["- None."])
];
fs.writeFileSync(path.join(reportsDir, "google-analytics-installation-audit.md"), `${summaryLines.join("\n")}\n`);

const eventRows = [...eventMap.values()].sort((a, b) =>
  [a.eventName, a.location, a.label, a.destinationType].join("|").localeCompare(
    [b.eventName, b.location, b.label, b.destinationType].join("|")
  )
);
const eventMapLines = [
  "# Google Analytics Event Map",
  "",
  `Measurement ID: \`${MEASUREMENT_ID}\``,
  "",
  "| Event name | Page/section | data-ga-location | data-ga-label | Tracked count | Destination type | Business interpretation |",
  "|---|---|---|---|---:|---|---|",
  ...eventRows.map((row) =>
    `| ${row.eventName} | ${row.section} | ${row.location} | ${row.label} | ${row.count} | ${row.destinationType} | ${row.interpretation} |`
  ),
  "",
  "Each element carries one primary event only. Event parameters exclude phone numbers, email addresses, message text, RFQ fields and other visitor-entered information."
];
fs.writeFileSync(path.join(reportsDir, "google-analytics-event-map.md"), `${eventMapLines.join("\n")}\n`);

console.log(JSON.stringify(report, null, 2));
if (errors.length) process.exit(1);
