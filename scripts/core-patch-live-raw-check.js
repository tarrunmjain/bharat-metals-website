const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const root = path.resolve(__dirname, "..");
const reportsDir = path.join(root, "reports");
const baseUrl = "https://tarrunmjain.github.io/bharat-metals-website";

const corePaths = ["/", "/about-us/", "/industries-we-serve/", "/stainless-steel/", "/request-quote/", "/blog/"];
const chipPaths = [...corePaths, "/ss-304/"];

const bannedPhrases = [
  "Share product form, grade, size, quantity and delivery location.",
  "enquiries by grade, size, finish, quantity and delivery location.",
  "About-specific answers",
  "Blog-index answers",
  "Industry-hub answers",
  "Stainless-steel-specific answers",
  "answers for buyers checking"
];

const requiredByPath = {
  "/": ["STAINLESS STEEL SUPPLIERS IN CHENNAI SINCE 1986"],
  "/about-us/": ["Answers to common questions about Bharat Metals, stainless steel grades, product forms, service regions and quotation support."],
  "/industries-we-serve/": [
    "Commercial kitchen fabricators usually discuss SS 304 sheets",
    "Auto-component and engineering buyers may ask for rods",
    "Marine and coastal enquiries often involve SS 316",
    "Answers to common questions about matching stainless steel grades, product forms, finishes and documents to industry applications."
  ],
  "/stainless-steel/": [
    "Welded and seamless pipe enquiries for fabrication",
    "Sheet enquiries for 2B, mirror, matt",
    "Round, square, hex or flat bar enquiries",
    "Answers to common stainless steel questions covering grades, forms, finishes, city enquiries and RFQ details."
  ],
  "/request-quote/": ["Answers to common RFQ questions for buyers sending stainless steel, aluminium, brass or copper requirements."],
  "/blog/": ["Answers to common questions about using Bharat Metals buyer guides before preparing a stainless steel RFQ."],
  "/ss-304/": ["SS 304 is one of the most commonly requested stainless steel grades"]
};

function expectedBuildMarker() {
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  return html.match(/<meta name="bharat-metals-build" content="([^"]+)">/)?.[1] || "";
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function urlFor(pagePath) {
  return `${baseUrl}${pagePath}`;
}

function fetchWithInvokeWebRequest(url) {
  const command = [
    "$ProgressPreference = 'SilentlyContinue'",
    "[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new()",
    `$response = Invoke-WebRequest -Uri ${JSON.stringify(url)} -UseBasicParsing -TimeoutSec 45`,
    "Write-Output ('STATUS:' + [int]$response.StatusCode)",
    "Write-Output 'BODY_BEGIN'",
    "Write-Output $response.Content"
  ].join("; ");

  const output = execFileSync("powershell.exe", ["-NoProfile", "-Command", command], {
    encoding: "utf8",
    maxBuffer: 30 * 1024 * 1024
  });

  const bodyMarker = "BODY_BEGIN";
  const markerIndex = output.indexOf(bodyMarker);
  const statusMatch = output.match(/STATUS:(\d+)/);
  return {
    status: statusMatch ? Number(statusMatch[1]) : 0,
    html: markerIndex >= 0 ? output.slice(markerIndex + bodyMarker.length).trimStart() : output
  };
}

function emptyResult(pagePath, error) {
  return {
    page: pagePath,
    url: urlFor(pagePath),
    status: 0,
    http200: false,
    buildMarkerFound: false,
    bannedPhrasesFound: bannedPhrases.filter(() => false),
    ulSearchChipGrid: false,
    liSearchChip: false,
    requiredReplacementText: requiredByPath[pagePath] || [],
    missingRequiredReplacementText: requiredByPath[pagePath] || [],
    error: error.message
  };
}

function checkPage(pagePath, marker) {
  try {
    const { status, html } = fetchWithInvokeWebRequest(urlFor(pagePath));
    const bannedPhrasesFound = bannedPhrases.filter((phrase) => html.includes(phrase));
    const requiredReplacementText = requiredByPath[pagePath] || [];
    const missingRequiredReplacementText = requiredReplacementText.filter((snippet) => !html.includes(snippet));
    return {
      page: pagePath,
      url: urlFor(pagePath),
      status,
      http200: status === 200,
      buildMarkerFound: Boolean(marker && html.includes(marker)),
      bannedPhrasesFound,
      ulSearchChipGrid: html.includes('<ul class="search-chip-grid">'),
      liSearchChip: html.includes('<li class="search-chip">'),
      requiredReplacementText,
      missingRequiredReplacementText,
      error: ""
    };
  } catch (error) {
    return emptyResult(pagePath, error);
  }
}

function rowStatus(result) {
  return result.http200 &&
    result.buildMarkerFound &&
    result.bannedPhrasesFound.length === 0 &&
    result.ulSearchChipGrid &&
    result.liSearchChip &&
    result.missingRequiredReplacementText.length === 0;
}

function chipStatus(result) {
  return result.http200 && result.buildMarkerFound && result.ulSearchChipGrid && result.liSearchChip;
}

function writeReports(marker, results) {
  fs.mkdirSync(reportsDir, { recursive: true });
  const checkedAt = new Date().toISOString();
  const byPath = Object.fromEntries(results.map((result) => [result.page, result]));
  const coreResults = corePaths.map((pagePath) => byPath[pagePath]);
  const chipResults = chipPaths.map((pagePath) => byPath[pagePath]);

  const rawLines = [
    "# Core Patch Live Raw Check",
    "",
    `- Checked at: ${checkedAt}`,
    `- Preview base: ${baseUrl}/`,
    `- Expected build marker: ${marker || "missing"}`,
    `- Result: ${coreResults.every(rowStatus) ? "PASS" : "FAIL"}`,
    "",
    "| URL | HTTP 200 | Build marker found | Banned phrases found | `<ul class=\"search-chip-grid\">` | `<li class=\"search-chip\">` | Required replacement text found |",
    "| --- | --- | --- | --- | --- | --- | --- |",
    ...coreResults.map((result) => {
      const requiredOk = result.missingRequiredReplacementText.length === 0;
      const banned = result.bannedPhrasesFound.length ? result.bannedPhrasesFound.join("<br>") : "no";
      return `| ${result.url} | ${result.http200 ? "yes" : "no"} | ${result.buildMarkerFound ? "yes" : "no"} | ${banned} | ${result.ulSearchChipGrid ? "yes" : "no"} | ${result.liSearchChip ? "yes" : "no"} | ${requiredOk ? "yes" : `no: ${result.missingRequiredReplacementText.join("<br>")}`} |`;
    }),
    "",
    "## Errors",
    "",
    ...coreResults.filter((result) => result.error).map((result) => `- ${result.url}: ${result.error}`),
    ...(coreResults.some((result) => result.error) ? [] : ["None."])
  ];
  fs.writeFileSync(path.join(reportsDir, "core-patch-live-raw-check.md"), `${rawLines.join("\n")}\n`);

  const markerLines = [
    "# Core Patch Live Build Marker Check",
    "",
    `- Checked at: ${checkedAt}`,
    `- Expected build marker: ${marker || "missing"}`,
    `- Result: ${coreResults.every((result) => result.http200 && result.buildMarkerFound) ? "PASS" : "FAIL"}`,
    "",
    "| URL | HTTP 200 | Build marker found |",
    "| --- | --- | --- |",
    ...coreResults.map((result) => `| ${result.url} | ${result.http200 ? "yes" : "no"} | ${result.buildMarkerFound ? "yes" : "no"} |`)
  ];
  fs.writeFileSync(path.join(reportsDir, "core-patch-live-build-marker-check.md"), `${markerLines.join("\n")}\n`);

  const chipLines = [
    "# Raw Search Chip HTML Check",
    "",
    `- Checked at: ${checkedAt}`,
    `- Expected build marker: ${marker || "missing"}`,
    `- Result: ${chipResults.every(chipStatus) ? "PASS" : "FAIL"}`,
    "",
    "| URL | HTTP 200 | Build marker found | `<ul class=\"search-chip-grid\">` | `<li class=\"search-chip\">` |",
    "| --- | --- | --- | --- | --- |",
    ...chipResults.map((result) => `| ${result.url} | ${result.http200 ? "yes" : "no"} | ${result.buildMarkerFound ? "yes" : "no"} | ${result.ulSearchChipGrid ? "yes" : "no"} | ${result.liSearchChip ? "yes" : "no"} |`)
  ];
  fs.writeFileSync(path.join(reportsDir, "raw-search-chip-html-check.md"), `${chipLines.join("\n")}\n`);

  return {
    checkedAt,
    marker,
    coreResults,
    chipResults,
    rawPass: coreResults.every(rowStatus),
    chipPass: chipResults.every(chipStatus),
    markerPass: coreResults.every((result) => result.http200 && result.buildMarkerFound)
  };
}

async function run() {
  const marker = process.env.BHARAT_METALS_BUILD_MARKER || expectedBuildMarker();
  const attempts = Number(process.env.BHARAT_METALS_LIVE_ATTEMPTS || 1);
  const delayMs = Number(process.env.BHARAT_METALS_LIVE_DELAY_MS || 15000);
  let summary;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const results = [];
    for (const pagePath of chipPaths) {
      results.push(checkPage(pagePath, marker));
    }
    summary = writeReports(marker, results);
    if (summary.rawPass && summary.chipPass && summary.markerPass) break;
    if (attempt < attempts) await delay(delayMs);
  }

  console.log(JSON.stringify(summary, null, 2));
  if (!summary.rawPass || !summary.chipPass || !summary.markerPass) process.exit(1);
}

run();
