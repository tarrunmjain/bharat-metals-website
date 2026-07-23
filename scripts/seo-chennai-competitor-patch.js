const fs = require("fs");
const path = require("path");
const { site } = require("../src/data/site-data");
const { googleBusinessProfileHref, googleMapsHref } = require("../src/templates/layout");

const root = path.resolve(__dirname, "..");
const DATE = "2026-07-22";
const DOMAIN = "https://www.stainlesssteeldealers.com/";
const MARKER = "<!-- chennai-competitor-seo-2026-07-22 -->";
const SAME_AS = [
  "https://share.google/VGih9aoStMPaRMMyz",
  "https://www.indiamart.com/bharatmetals-chennai/profile.html"
];

function esc(value) {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function attr(value) {
  return esc(value).replace(/"/g, "&quot;");
}
function regex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function canonical(html) {
  return (html.match(/<link rel="canonical" href="([^"]+)">/i) || [null, DOMAIN])[1];
}
function head(html, page) {
  return html
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${esc(page.title)}</title>`)
    .replace(/<meta name="description" content="[^"]*">/i, `<meta name="description" content="${attr(page.description)}">`)
    .replace(/<meta property="og:title" content="[^"]*">/i, `<meta property="og:title" content="${attr(page.title)}">`)
    .replace(/<meta property="og:description" content="[^"]*">/i, `<meta property="og:description" content="${attr(page.description)}">`);
}
function hero(html, page) {
  return html
    .replace(/<h1([^>]*)>[\s\S]*?<\/h1>/i, `<h1$1>${esc(page.h1)}</h1>`)
    .replace(/(<h1[^>]*>[\s\S]*?<\/h1>\s*)<p>[\s\S]*?<\/p>/i, `$1<p>${esc(page.intro || page.description)}</p>`);
}
function insert(html, section) {
  if (html.includes(MARKER)) {
    const markerAt = html.indexOf(MARKER);
    const sectionAt = html.indexOf("<section", markerAt + MARKER.length);
    const end = sectionAt < 0 ? -1 : html.indexOf("</section>", sectionAt);
    if (end >= 0) return `${html.slice(0, markerAt)}${MARKER}\n${section}${html.slice(end + 10)}`;
    return html;
  }
  const main = html.search(/<main\b/i);
  const end = main < 0 ? -1 : html.indexOf("</section>", main);
  if (end < 0) return html;
  const at = end + 10;
  return `${html.slice(0, at)}\n${MARKER}\n${section}\n${html.slice(at)}`;
}
function schema(html, page) {
  return html.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i, (all, source) => {
    let data;
    try { data = JSON.parse(source); } catch { return all; }
    const graph = Array.isArray(data["@graph"]) ? data["@graph"] : [data];
    const url = canonical(html);
    const orgId = `${DOMAIN}#organization`;
    const businessId = `${DOMAIN}#localbusiness`;
    const org = graph.find(x => x && (x["@id"] === orgId || x["@type"] === "Organization"));
    const business = graph.find(x => x && (x["@id"] === businessId || x["@type"] === "LocalBusiness"));
    const webPage = graph.find(x => x && ["WebPage", "CollectionPage"].includes(x["@type"]));
    if (org) {
      org.sameAs = SAME_AS;
      org.knowsAbout = ["Stainless steel dealers in Chennai", "SS 304 and SS 316", "ASTM A240 sheets", "ASTM A312 pipes", "Stainless steel rods and round bars"];
    }
    if (business) {
      business.sameAs = SAME_AS;
      business.areaServed = [{ "@type": "City", name: "Chennai" }, { "@type": "AdministrativeArea", name: "Tamil Nadu" }];
    }
    if (webPage) {
      webPage.name = page.h1;
      webPage.description = page.description;
      webPage.dateModified = DATE;
      webPage.about = page.keyword;
    }
    const service = {
      "@type": "Service",
      "@id": `${url}#service`,
      name: page.h1,
      description: page.description,
      serviceType: page.serviceType || "Stainless steel dealer, stockist, supplier and wholesaler enquiry support",
      areaServed: { "@type": "City", name: "Chennai" },
      provider: { "@id": businessId }
    };
    const serviceIndex = graph.findIndex(x => x && x["@id"] === service["@id"]);
    if (serviceIndex >= 0) graph[serviceIndex] = service; else graph.push(service);
    return `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": graph }, null, 2)}</script>`;
  });
}
function patch(relative, page, section, changed, skipped) {
  const file = path.join(root, relative);
  if (!fs.existsSync(file)) { skipped.push(relative); return; }
  const old = fs.readFileSync(file, "utf8");
  const next = schema(insert(hero(head(old, page), page), section), page);
  if (next !== old) { fs.writeFileSync(file, next, "utf8"); changed.push(relative); }
}
function links(items) {
  return `<div class="link-chip-grid">${items.map(([href, label]) => `<a href="${href}">${label}</a>`).join("")}</div>`;
}
function homeLocalTrustBlock() {
  const address = site.addressLines.join(" ").replace(/\s+/g, " ").replace(/,\s*,/g, ",").trim();
  return `<div class="local-trust-mini" aria-label="Bharat Metals Chennai local trust details"><span><strong>${esc(site.name)}</strong></span><span>${esc(address)}</span><span>Open 10 AM-6 PM</span><span><a href="${site.phoneHref}">Call ${esc(site.phone)}</a> / <a href="${site.whatsappHref}" target="_blank" rel="noopener">WhatsApp</a></span><span><a href="${googleBusinessProfileHref}" target="_blank" rel="noopener">Google Business Profile</a> / <a href="${googleMapsHref}" target="_blank" rel="noopener">Maps</a></span><span>Established in 1986</span></div>`;
}
function productSection(page) {
  return `<section class="section-pad compact-section section-silver" aria-labelledby="seo-${page.id}"><div class="container text-flow"><p class="eyebrow">Chennai specification coverage</p><h2 id="seo-${page.id}">${page.heading}</h2><p>${page.copy}</p><h3>Buyer terms to include</h3><ul>${page.terms.map(x => `<li>${x}</li>`).join("")}</ul>${links(page.links)}</div></section>`;
}

const homeSection = `<section class="section-pad compact-section section-silver" aria-labelledby="dealer-coverage-title"><div class="container text-flow"><p class="eyebrow">Chennai buyer coverage</p><h2 id="dealer-coverage-title">Stainless steel dealers in Chennai for products, grades and technical RFQs</h2><p>Bharat Metals is a Chennai-based stainless steel dealer, stockist, supplier and wholesaler established in 1986. Buyers from Parrys, Mannady, George Town, Ambattur, Guindy, Padi, Sriperumbudur, Oragadam, Gummidipoondi and Maraimalai Nagar can send requirements by product form, grade, size, finish, quantity and certificate need.</p>${homeLocalTrustBlock()}<p>Common RFQ terms include SS 304 and SS 316 sheets, plates and coils; seamless, welded, ERW and EFW pipes; polished tubes; bright, black, peeled and ground round bars; flat, hex and square bars; angles, channels, flanges, fittings, wire mesh and perforated sheets. Specialist forms and grades are reviewed only after specification, quantity and sourceability are confirmed.</p>${links([["stainless-steel-suppliers-chennai/","Stainless Steel Dealers Chennai"],["stainless-steel-pipes-chennai/","SS Pipe Dealers Chennai"],["stainless-steel-sheets-chennai/","SS Sheet Dealers Chennai"],["stainless-steel-rods-chennai/","SS Round Bar Dealers Chennai"],["stainless-steel-bars-chennai/","SS Bar Dealers Chennai"],["astm-a240-stainless-steel-sheets-chennai/","ASTM A240 Sheets"],["astm-a312-stainless-steel-pipes-chennai/","ASTM A312 Pipes"],["technical-data/","Equivalent Grades & Technical Data"]])}</div></section>`;

const chennaiSection = `<section class="section-pad compact-section section-silver" aria-labelledby="chennai-direct-answer"><div class="container text-flow"><p class="eyebrow">Direct answer for Chennai buyers</p><h2 id="chennai-direct-answer">Who is a stainless steel dealer, stockist and supplier in Chennai?</h2><p>Bharat Metals is based on Mookernallamuthu Street in Chennai's Parrys, Mannady and George Town metal market and has served stainless steel buyers since 1986. It supports retail, wholesale, fabrication, industrial, contractor, trader and project enquiries without claiming to manufacture the material.</p><h2>Product and search terminology covered</h2><p>Flat-product enquiries may include sheets, plates, coils, strips, slit coils, shim and cut sizes in 2B, BA, No. 1, No. 4, mirror, matt, hairline, brush, satin or PVC-coated finishes. Pipe and tube enquiries may use seamless, welded, ERW, EFW, round, square, rectangular, polished, hydraulic, instrumentation or heat-exchanger terminology where applicable. Long-product enquiries may use rod, round bar, bright bar, black bar, peeled bar, ground bar, precision bar, flat bar, hex bar or square bar.</p><h2>Grades, standards and documentation</h2><p>Regular enquiries commonly use SS 202, 304, 304L, 310, 316, 316L, 410, 420 and 430. Buyers may also mention 201, 303, 304H, 309S, 310S, 316Ti, 317L, 321, 347, 904L, 17-4PH, Duplex 2205 or Super Duplex 2507 when a drawing calls for them; these should not be assumed as regular stock until sourceability is confirmed.</p><p>Technical RFQs can reference ASTM A240, ASTM A312, ASTM A213, ASTM A269, ASME, EN or UNS equivalents, MTC, mill certificate, heat number, traceability and EN 10204 3.1 documentation where applicable.</p><h2>Chennai areas and industries</h2><p>Relevant local searches include stainless steel dealers near Parrys, Mannady, George Town, Linghi Chetty Street, Ambattur Industrial Estate, Guindy Industrial Estate, Padi, SIDCO, Sriperumbudur, Oragadam, Gummidipoondi, Avadi, Maraimalai Nagar, Manali and Ennore. Buyer sectors include fabrication, commercial kitchens, dairy and beverage, food processing, pharma, chemical and petrochemical, water treatment, marine and port work, automotive, architecture, construction and engineering workshops.</p>${links([["../stainless-steel-pipes-chennai/","Pipes: ERW, EFW, Welded &amp; Seamless"],["../stainless-steel-sheets-chennai/","Sheets: 2B, BA, Mirror &amp; Hairline"],["../stainless-steel-plates-chennai/","Plates: ASTM A240"],["../stainless-steel-rods-chennai/","Rods &amp; Round Bars"],["../stainless-steel-bars-chennai/","Round, Flat, Hex &amp; Square Bars"],["../stainless-steel-coils/","Coils &amp; Slit Coils"],["../stainless-steel-flanges/","Flanges"],["../stainless-steel-fittings/","Pipe Fittings"]])}<h2>Common buyer questions</h2><h3>Do you supply SS 304 and SS 316 in Chennai?</h3><p>Yes. Requirements are reviewed by product, size, finish, quantity, documentation and current availability.</p><h3>Can Jindal make be requested?</h3><p>Yes. Jindal make can be stated as a buyer preference, but availability is confirmed against the exact RFQ and is not presented as an automatic authorised-dealership claim.</p><h3>Can small retail and bulk wholesale requirements both be discussed?</h3><p>Yes. Bharat Metals serves home users, fabricators, contractors, traders and industrial buyers, subject to the exact product and quantity.</p></div></section>`;

const products = [
  {
    id: "pipes-chennai", file: "stainless-steel-pipes-chennai/index.html",
    title: "SS Pipe Dealers in Chennai | 304/316 ERW & Seamless",
    h1: "Stainless Steel Pipe Dealers in Chennai – ERW, EFW, Welded & Seamless",
    description: "Bharat Metals is a Chennai SS pipe dealer for 304/316 welded, seamless, ERW and EFW enquiries. Share ASTM A312, OD/NB, schedule, wall thickness, length, quantity and MTC needs.",
    keyword: "Stainless steel pipe dealers in Chennai", serviceType: "Stainless steel pipe dealer and supplier in Chennai",
    heading: "SS pipe types, standards and size terminology used by Chennai buyers",
    copy: "Pipe RFQs may use seamless, welded, ERW, EFW, fabricated, round, square, rectangular, polished, hydraulic, instrumentation or heat-exchanger terminology. Bharat Metals reviews these as dealer and supplier enquiries, subject to grade, size, quantity, documentation and sourceability.",
    terms: ["SS 304, 304L, 316 and 316L; other grades only when specified", "ASTM A312 / ASME SA312; ASTM A213, A249 or A269 for applicable tube enquiries", "OD, NB, wall thickness, gauge, SCH 5 to SCH 160 where applicable, random or cut length", "Plain, bevelled or threaded ends where applicable; mill, polished, mirror, matt or brush finish", "MTC, heat number, traceability and EN 10204 3.1 discussion where applicable"],
    links: [["../stainless-steel-pipes/","Stainless Steel Pipes"],["../ss-304-pipes/","SS 304 Pipes"],["../ss-316-pipes/","SS 316 Pipes"],["../astm-a312-stainless-steel-pipes-chennai/","ASTM A312 Pipes"]]
  },
  {
    id: "sheets-chennai", file: "stainless-steel-sheets-chennai/index.html",
    title: "SS Sheet Dealers in Chennai | 304/316, Jindal & Finishes",
    h1: "Stainless Steel Sheet Dealers in Chennai – SS 304, 316 & Finish Options",
    description: "Chennai stainless steel sheet dealer for SS 304/316, Jindal make preference, 2B, BA, No. 4, mirror, matt, hairline, brush and PVC-coated sheet enquiries.",
    keyword: "Stainless steel sheet dealers in Chennai", serviceType: "Stainless steel sheet dealer and supplier in Chennai",
    heading: "Sheet grades, finishes and specification terms for Chennai RFQs",
    copy: "Sheet buyers commonly search by grade, make, thickness, sheet size and finish. Bharat Metals reviews Jindal make preference where applicable without assuming every grade, size and finish combination is regular stock.",
    terms: ["ASTM A240 / ASME SA240 where applicable", "SS 202, 304, 304L, 316, 316L, 430 and other specified grades", "2B, BA, No. 1, No. 4, mirror / No. 8, matt, hairline, brush, satin and PVC coated", "Thickness, width, length, 4x8 or 5x10 reference, cut size and visible-side requirement", "Cutting, polishing, PVC coating, bending, packing and MTC discussion where suitable"],
    links: [["../stainless-steel-sheets/","Stainless Steel Sheets"],["../ss-304-sheets-chennai/","SS 304 Sheets Chennai"],["../ss-316-sheets-chennai/","SS 316 Sheets Chennai"],["../astm-a240-stainless-steel-sheets-chennai/","ASTM A240 Sheets"]]
  },
  {
    id: "plates-chennai", file: "stainless-steel-plates-chennai/index.html",
    title: "Stainless Steel Plate Dealers in Chennai | SS 304/316",
    h1: "Stainless Steel Plate Dealers in Chennai – SS 304, 316 & Cut Sizes",
    description: "Bharat Metals reviews Chennai stainless steel plate enquiries for SS 304/316, ASTM A240, thickness, size, cutting, finish, quantity, MTC and delivery requirements.",
    keyword: "Stainless steel plate dealers in Chennai", serviceType: "Stainless steel plate dealer and supplier in Chennai",
    heading: "Plate specification and processing terms used in Chennai",
    copy: "Plate enquiries should state whether the use is fabrication, base plates, machine parts, process equipment, marine, chemical or project work. Exact thickness, width, length, cut size, tolerance and certificate expectation are more useful than a generic request.",
    terms: ["ASTM A240 / ASME SA240 where applicable", "SS 304, 304L, 316, 316L, 310 and specified grades subject to availability", "No. 1 / mill finish, 2B where applicable, matt, brush or polished", "Cut-to-size, drilling and packing requirements where suitable", "Grade, thickness, plate size, quantity, MTC and delivery location"],
    links: [["../stainless-steel-plates/","Stainless Steel Plates"],["../ss-304-plates/","SS 304 Plates"],["../ss-316-plates/","SS 316 Plates"],["../astm-a240-stainless-steel-sheets-chennai/","ASTM A240 Reference"]]
  },
  {
    id: "rods-chennai", file: "stainless-steel-rods-chennai/index.html",
    title: "SS Round Bar & Rod Dealers in Chennai | 304, 316, 310",
    h1: "Stainless Steel Round Bar & Rod Dealers in Chennai – Bright, Black, Peeled & Ground",
    description: "Chennai SS round bar and rod dealer for 304, 316, 310, 410 and specified grades in bright, black, peeled, ground, precision and cut-length enquiries with MTC needs.",
    keyword: "Stainless steel round bar dealers in Chennai", serviceType: "Stainless steel round bar and rod dealer in Chennai",
    heading: "Round bar, rod and machining terminology used by Chennai buyers",
    copy: "Machine shops may describe the same need as stainless steel rod, round bar, bright bar, black bar, peeled bar, ground bar, precision shaft-quality bar or cut-length bar. Bharat Metals matches the terminology to grade, diameter, length, tolerance, finish, quantity and certificate need.",
    terms: ["SS 303, 304, 304L, 310, 316, 316L, 410, 420, 430 and specialist grades when specified", "Bright, black, hot rolled, cold drawn, peeled, ground or polished where applicable", "Diameter, length, H9/H11 or drawing tolerance where relevant", "MTC, chemical/mechanical documents or ultrasonic-test request where applicable", "Machining, shafts, fasteners, valves, jigs, fixtures, repair and fabrication"],
    links: [["../stainless-steel-rods/","Stainless Steel Rods"],["../stainless-steel-bars/","Stainless Steel Bars"],["../ss-304-rods/","SS 304 Rods"],["../ss-316-rods/","SS 316 Rods"]]
  },
  {
    id: "bars-chennai", file: "stainless-steel-bars-chennai/index.html",
    title: "Stainless Steel Bar Dealers in Chennai | Round, Flat, Hex & Square",
    h1: "Stainless Steel Bar Dealers in Chennai – Round, Flat, Hex & Square Bars",
    description: "Bharat Metals reviews Chennai stainless steel bar enquiries for round, flat, hex and square bars in SS 304, 316, 310, 410 and specified grades by size, finish and MTC need.",
    keyword: "Stainless steel bar dealers in Chennai", serviceType: "Stainless steel bar dealer and supplier in Chennai",
    heading: "Bar forms and buyer specification terms used in Chennai",
    copy: "Bar enquiries should distinguish round bar, flat bar, true flat, sheared-and-edged flat, hex bar, square bar, rectangular bar or forged bar. Send grade, section, size, length, finish, tolerance, quantity and certificate requirement.",
    terms: ["Round, flat, hex, square, rectangular and forged-bar enquiries", "SS 304, 304L, 316, 316L, 310, 410 and other specified grades", "Black, bright, cold drawn, hot rolled, peeled, ground or polished where applicable", "Diameter or section, width, thickness, across-flats dimension and length", "Machining, auto components, equipment, fasteners, supports and fabrication"],
    links: [["../stainless-steel-bars/","Stainless Steel Bars"],["../stainless-steel-rods/","Rods &amp; Round Bars"],["../stainless-steel-flats/","Flat Bars"],["../technical-data/","Technical Data"]]
  }
];

const changed = [];
const skipped = [];
patch("index.html", {
  title: "Stainless Steel Dealers in Chennai | Bharat Metals Since 1986",
  h1: "STAINLESS STEEL DEALERS & SUPPLIERS IN CHENNAI SINCE 1986",
  description: "Bharat Metals is a Chennai stainless steel dealer, stockist, supplier and wholesaler since 1986 for SS 304/316 sheets, plates, coils, pipes, tubes, rods, bars, angles, flanges and fittings.",
  keyword: "Stainless steel dealers in Chennai",
  intro: "Established in 1986, Bharat Metals is a Chennai-based stainless steel dealer, stockist, supplier and wholesaler serving fabricators, industries, traders, contractors, home users and project procurement teams. Send SS 304, SS 316 and other stainless steel requirements by product form, size, finish, quantity, make preference, certificate need and delivery location."
}, homeSection, changed, skipped);
patch("stainless-steel-suppliers-chennai/index.html", {
  title: "Stainless Steel Dealers & Suppliers in Chennai | Bharat Metals",
  h1: "Stainless Steel Dealers, Stockists & Suppliers in Chennai",
  description: "Bharat Metals is a stainless steel dealer, stockist, supplier and wholesaler in Chennai since 1986 for SS 304/316 sheets, plates, coils, pipes, tubes, rods, bars, angles, flanges and fittings.",
  keyword: "Stainless steel dealers in Chennai",
  intro: "Bharat Metals is a Chennai-based stainless steel dealer, stockist, supplier and wholesaler established in 1986. Buyers from Parrys, Mannady, George Town and Chennai industrial areas can send requirements by product, grade, size, finish, quantity and certificate need."
}, chennaiSection, changed, skipped);
for (const page of products) patch(page.file, page, productSection(page), changed, skipped);

const sitemap = path.join(root, "sitemap.xml");
if (fs.existsSync(sitemap)) {
  const old = fs.readFileSync(sitemap, "utf8");
  let next = old;
  const urls = [DOMAIN, `${DOMAIN}stainless-steel-suppliers-chennai/`, ...products.map(x => `${DOMAIN}${x.file.replace(/index\.html$/, "")}`)];
  for (const url of urls) next = next.replace(new RegExp(`(<loc>${regex(url)}</loc>[\\s\\S]*?<lastmod>)[^<]+(</lastmod>)`), `$1${DATE}$2`);
  if (next !== old) { fs.writeFileSync(sitemap, next, "utf8"); changed.push("sitemap.xml lastmod"); }
}
const report = {
  implementedAt: DATE,
  changedFiles: changed,
  skippedMissingTargets: skipped,
  keywordClusters: ["dealers, suppliers, stockists and wholesalers in Chennai", "ERW, EFW, welded and seamless pipes", "2B, BA, mirror, hairline and PVC-coated sheets", "bright, black, peeled and ground round bars", "ASTM A240, A312, A213 and A269", "MTC, EN 10204 3.1, heat number and traceability", "Parrys, Mannady, George Town, Ambattur, Guindy, Sriperumbudur and Oragadam"],
  safeguards: ["No Bharat Metals manufacturer claim", "No guaranteed stock, price, delivery or certification claim", "Specialist grades are subject to exact specification, sourceability and availability", "Jindal is a buyer make preference, not an authorised-dealership claim"]
};
fs.mkdirSync(path.join(root, "reports"), { recursive: true });
fs.writeFileSync(path.join(root, "reports/chennai-competitor-seo-implementation.json"), JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify(report, null, 2));
