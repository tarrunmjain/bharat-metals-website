const fs = require("fs");
const path = require("path");
const { applyGoogleAnalytics, MEASUREMENT_ID } = require("../src/templates/analytics");

const root = path.resolve(__dirname, "..");
const domain = "https://www.stainlesssteeldealers.com";

function publishedFiles() {
  const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  return urls.map((url) => {
    const parsed = new URL(url);
    if (parsed.origin !== domain) throw new Error(`Unexpected sitemap origin: ${url}`);
    const relativePath = decodeURIComponent(parsed.pathname).replace(/^\/|\/$/g, "");
    return path.join(root, relativePath, "index.html");
  });
}

const files = publishedFiles();
let changed = 0;

for (const file of files) {
  if (!fs.existsSync(file)) throw new Error(`Published HTML file is missing: ${path.relative(root, file)}`);
  const current = fs.readFileSync(file, "utf8");
  const next = applyGoogleAnalytics(current);
  if (next !== current) {
    fs.writeFileSync(file, next, "utf8");
    changed += 1;
  }
}

console.log(`Applied ${MEASUREMENT_ID} and enquiry tracking to ${files.length} published pages. Files changed: ${changed}.`);
