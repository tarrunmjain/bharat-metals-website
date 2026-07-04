const fs = require("fs");
const path = require("path");
const {
  site,
  forms,
  grades,
  finishes,
  services,
  rfqFields,
  industries,
  secondaryMaterials,
  locations,
  blogPosts,
  priorityCities,
  priorityForms,
  gradeCityPriority
} = require("../src/data/site-data");
const { renderPage, escapeHtml } = require("../src/templates/layout");

const root = path.resolve(__dirname, "..");
const generatedAt = "2026-07-04";
const buildMarker = process.env.BHARAT_METALS_BUILD_MARKER || "ACCEPTANCE-FIX-2026-07-04-HARDPASS";
const pages = [];

const materialNames = {
  aluminium: "Aluminium",
  brass: "Brass",
  copper: "Copper"
};

const heroImage = "assets/images/photos/hero/bharat-metals-stainless-steel-pipes-hero-v3.webp";
const stainlessMaterialImage = "assets/images/photos/materials/stainless-steel-mixed-stock-v3.webp";

const materialImages = {
  aluminium: "assets/images/photos/materials/aluminium.webp",
  brass: "assets/images/photos/materials/brass.webp",
  copper: "assets/images/photos/materials/copper.webp"
};

const materialIntros = {
  aluminium:
    "Bharat Metals also supplies aluminium sheets, plates, coils, pipes, flats, rods and bars for commercial, fabrication, engineering, repair and trading requirements. Buyers can share form, size, grade/specification, quantity and delivery location for quotation support.",
  brass:
    "Bharat Metals also supplies brass pipes, bush pipes, rods, bars and flats for machining, electrical, fabrication, repair, fittings and trading requirements. Buyers can share size, form, quantity and delivery location for quotation support.",
  copper:
    "Bharat Metals also supplies copper tubes, rods, bars, flats and plates for electrical, engineering, heat-transfer, fabrication, repair and trading requirements. Buyers can share size, form, quantity and delivery location for quotation support."
};

const productCardCopy = {
  pipes:
    "Welded and seamless pipe enquiries for fabrication, utility lines, food/pharma equipment, commercial kitchens, marine repair and industrial maintenance. Buyers should mention OD, wall thickness or schedule, length, grade and finish.",
  tubes:
    "Round, square and rectangular tube enquiries for fabrication, interiors, railings, frames, equipment and decorative work. Tube profile, size, gauge, finish and quantity are important.",
  sheets:
    "Sheet enquiries for 2B, mirror, matt, BA, hairline, brush and PVC coated requirements used in kitchen equipment, interiors, panels, fabrication and food processing.",
  plates:
    "Plate enquiries for fabrication, base plates, machine parts, process equipment, industrial repair and project work. Thickness, size, cutting and certificate expectations should be mentioned.",
  coils:
    "Coil and slit coil enquiries for downstream sheet use, fabrication, trading and processing requirements. Buyers should mention width, thickness, finish, grade and quantity.",
  rods:
    "Rod enquiries for machining, fabrication, repairs, engineering work and workshop use. Diameter, length, finish, quantity and certificate expectations are important.",
  bars:
    "Round, square, hex or flat bar enquiries for machine shops, auto-component work, industrial maintenance and fabrication. Section, size, length and grade should be clear.",
  angles:
    "Angle enquiries for frames, supports, brackets, fabrication, construction and industrial structures. Buyers should mention leg size, thickness, length, grade and quantity.",
  flats:
    "Flat bar enquiries for bracing, frames, repair work, architectural use and general fabrication. Width, thickness, length, finish and grade help quote accurately.",
  channels:
    "Channel enquiries for structural supports, frames, industrial fabrication and site work. Channel size, thickness, length, grade and quantity should be included.",
  flanges:
    "Flange enquiries for piping, process lines, maintenance and engineering requirements. Buyers should mention grade, size, class, type, standard and quantity.",
  fittings:
    "Fitting enquiries such as elbows, tees, reducers and matching pipe fittings should include grade, size, type, schedule, quantity and certificate requirement.",
  circles:
    "Circle enquiries for vessel, equipment, fabrication and component needs should mention diameter, thickness, grade, finish and cutting tolerance where applicable.",
  fasteners:
    "Fastener enquiries for bolts, nuts, washers and industrial fastening should include grade, type, size, thread details, quantity and certificate requirement.",
  "wire-mesh":
    "Wire mesh enquiries for guards, filters, partitions, screens and industrial use should mention mesh type, aperture, wire diameter, grade, size and quantity.",
  "perforated-sheets":
    "Perforated sheet enquiries should include grade, thickness, sheet size, hole diameter, hole pattern, pitch, finish and quantity."
};

const industryCardCopy = {
  "fabrication-welding":
    "Fabricators often enquire for pipes, sheets, plates, rods, flats, angles and channels for frames, supports, repair work and custom stainless steel fabrication. SS 202, SS 304 and SS 316 may be discussed based on application and exposure.",
  "railing-contractors":
    "Railing buyers commonly discuss polished pipes, tubes, flats and sheets for residential, commercial and interior work. SS 202 and SS 304 are frequent enquiry grades, with finish and gauge details important for quotation.",
  "automobile-auto-components":
    "Auto-component and engineering buyers may ask for rods, bars, sheets, plates and fasteners for fixtures, shopfloor work, machining and maintenance. Chennai, Sriperumbudur, Oragadam, Ambattur and Hosur are important related markets.",
  "commercial-kitchen-equipment":
    "Commercial kitchen fabricators usually discuss SS 304 sheets, tubes, pipes, plates and polished finish requirements for counters, tables, exhaust systems, sinks, food-prep areas and hotel equipment.",
  "food-processing":
    "Food processing buyers often ask for SS 304 or SS 316 sheets, pipes, fittings, wire mesh and perforated sheets where cleanability, finish and certificate discussions matter.",
  "pharma-healthcare-equipment":
    "Pharma and healthcare equipment enquiries often involve SS 304, SS 316 or SS 316L sheets, tubes, pipes and fittings, with attention to finish, documentation and cleanable surfaces.",
  "engineering-machine-shops":
    "Engineering buyers commonly discuss rods, bars, plates and flats for machining, repairs, brackets, components and workshop use. Size, length, tolerance and certificate expectations should be shared early.",
  "builders-construction":
    "Construction and project buyers may enquire for angles, channels, plates, sheets and fasteners for frames, supports, cladding, railing and site fabrication.",
  "interior-architectural-contractors":
    "Interior buyers often discuss decorative stainless steel sheets, tubes, flats, polished pipes, mirror finish, hairline finish and brush finish requirements for visible applications.",
  "marine-ship-repair":
    "Marine and coastal enquiries often involve SS 316 or SS 316L pipes, plates, fasteners, fittings and flanges where corrosion exposure and packing requirements need clear discussion.",
  "railways-metro-projects":
    "Railway and metro project enquiries may include sheets, plates, pipes, fasteners and fabricated sections for fixtures, maintenance, panels and infrastructure support. Grade, certificate and inspection expectations should be clear.",
  "oil-gas":
    "Oil and gas buyers usually discuss pipes, flanges, fittings and plates for maintenance, fabrication and process-line support. Grade, class, standard, certificate and packing details matter at RFQ stage.",
  "chemical-petrochemical":
    "Chemical and petrochemical enquiries often compare SS 304, SS 316 and SS 316L pipes, fittings, flanges and plates. Corrosion exposure, fluid contact, documentation and inspection needs should be mentioned early.",
  "textile-machinery":
    "Textile machinery buyers may ask for rods, bars, sheets and flats for machine guards, brackets, shafts, repair work and fabrication. Size, finish and workshop machining needs help quote accurately.",
  "water-treatment-utilities":
    "Water treatment and utility buyers commonly discuss pipes, fittings, plates, wire mesh and fabricated supports. SS 304 and SS 316 may be reviewed based on water exposure and application.",
  "electrical-control-panel-fabrication":
    "Electrical and control panel fabricators may enquire for sheets, angles, channels and fasteners for enclosures, frames, supports and site installation. Thickness, finish and size should be specified.",
  "dairy-beverage-processing":
    "Dairy and beverage buyers often discuss SS 304 or SS 316 pipes, tubes, sheets and fittings where cleanable surfaces, polishing and certificate support are important.",
  "sugar-mills-agro-processing":
    "Sugar mill and agro-processing enquiries can include plates, sheets, pipes, wire mesh and perforated sheets for equipment repair, screens, guards and processing-area fabrication.",
  "paper-mills":
    "Paper mill buyers may ask for sheets, plates, pipes and fittings for maintenance, fabrication and process-area repairs. Grade, thickness, size and corrosion exposure should be described.",
  "ports-shipping-coastal-infrastructure":
    "Ports, shipping and coastal infrastructure enquiries often involve SS 316 or SS 316L pipes, plates, fasteners and flanges. Packing, exposure and transport details are important for review.",
  "institutional-fabrication":
    "Educational and institutional fabrication buyers often discuss sheets, pipes, tubes and fasteners for furniture, lab areas, railings, kitchens and maintenance work. Finish, grade and size should be clear.",
  "public-works-infrastructure":
    "Public works and infrastructure contractors may enquire for angles, channels, plates, fasteners and sheets for supports, frames, site fabrication and maintenance requirements.",
  "textile-dyeing-processing":
    "Textile dyeing and processing units often ask for pipes, fittings, perforated sheets, wire mesh and plates where moisture, chemicals and cleaning requirements affect grade discussion.",
  "boiler-heat-exchanger-fabricators":
    "Boiler and heat-exchanger fabricators may discuss tubes, pipes, plates and flanges for repair, fabrication and thermal equipment support. Temperature, grade, size and certificate needs should be stated.",
  "pump-valve-equipment-manufacturers":
    "Pump, valve and equipment manufacturers commonly enquire for rods, bars, flanges, fittings and plates for machining, components and assembly support. Section, size, grade and certificate expectations help the quote."
};

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function outPath(slug) {
  return path.join(root, ...slug.split("/").filter(Boolean), "index.html");
}

function finalUrl(slug) {
  return site.finalDomain.replace(/\/$/, "/") + (slug || "");
}

function addPage(page) {
  pages.push(page);
}

function labelOf(item) {
  if (typeof item === "string") return item.replace(/\//g, "").replace(/-/g, " ");
  return item.name || item.title || item.short || item.slug || "";
}

function list(items) {
  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function chips(items, makeSlug, label = labelOf) {
  return `<div class="link-chip-grid">${items
    .map((item) => `<a href="${makeSlug(item)}">${escapeHtml(label(item))}</a>`)
    .join("")}</div>`;
}

function cardGrid(items, makeSlug, text, label = labelOf) {
  return `<div class="page-card-grid">${items
    .map(
      (item) =>
        `<a class="page-card anchor-card" href="${makeSlug(item)}"><h3>${escapeHtml(label(item))}</h3><p>${escapeHtml(
          text ? text(item) : "Share product form, grade, size, quantity and delivery location for a quotation."
        )}</p></a>`
    )
    .join("")}</div>`;
}

function linkedCardGrid(items) {
  return `<div class="page-card-grid">${items
    .map(
      (item) =>
        `<a class="page-card anchor-card" href="${item.href}"><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.text)}</p></a>`
    )
    .join("")}</div>`;
}

function infoCardGrid(items) {
  return `<div class="page-card-grid">${items
    .map((item) => `<article class="page-card"><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.text)}</p></article>`)
    .join("")}</div>`;
}

function industryImageCardGrid(items = industries) {
  return `<div class="core-industry-grid">${items
    .map(
      (industry) =>
        `<a class="industry-card core-industry-card" href="industries/${industry.slug}/"><img src="${industryImage(industry)}" alt="${escapeHtml(
          industry.name
        )} stainless steel supply photo" width="500" height="313" loading="lazy"><h3>${escapeHtml(
          industry.name
        )}</h3><p>${escapeHtml(industryIndustryText(industry))}</p><p><strong>Typical enquiries:</strong> ${escapeHtml(
          industry.products.join(", ")
        )}</p><p><strong>Common grades:</strong> ${escapeHtml(industry.grades.join(", "))}</p></a>`
    )
    .join("")}</div>`;
}

function productImageCardGrid(items = forms) {
  return `<div class="forms-grid core-product-grid">${items
    .map(
      (form) =>
        `<a class="form-card" href="${form.slug}/"><img src="${formImage(form)}" alt="${escapeHtml(
          form.name
        )} stainless steel stock photo" width="500" height="313" loading="lazy"><h3>${escapeHtml(form.name)}</h3><p>${escapeHtml(
          productCardCopy[form.formSlug] || `${form.short} enquiries should include grade, size, finish, quantity and delivery location.`
        )}</p></a>`
    )
    .join("")}</div>`;
}

function compactCardGrid(items, makeSlug, label = labelOf) {
  return `<div class="page-card-grid compact-card-grid">${items
    .map((item) => `<a class="page-card anchor-card compact-card" href="${makeSlug(item)}"><h3>${escapeHtml(label(item))}</h3></a>`)
    .join("")}</div>`;
}

function uniqueBy(items, keyFn) {
  const seen = new Set();
  return items.filter((item) => {
    const key = keyFn(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function dataTable(headers, rows) {
  return `<div class="data-table"><table><thead><tr>${headers
    .map((h) => `<th>${escapeHtml(h)}</th>`)
    .join("")}</tr></thead><tbody>${rows
    .map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`)
    .join("")}</tbody></table></div>`;
}

function paragraphText(paragraphs) {
  return paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("");
}

function pageSection(title, text, extra = "") {
  return `<section class="section-pad compact-section"><div class="container text-flow"><h2>${escapeHtml(title)}</h2><p>${escapeHtml(
    text
  )}</p>${extra}</div></section>`;
}

function hubSection(eyebrow, title, intro, content) {
  return `<section class="section-pad compact-section"><div class="container"><div class="section-heading tight"><p class="eyebrow">${escapeHtml(
    eyebrow
  )}</p><h2>${escapeHtml(title)}</h2><p>${escapeHtml(intro)}</p></div>${content}</div></section>`;
}

function proseSection(title, paragraphs, extra = "") {
  const text = paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("");
  return `<section class="section-pad compact-section"><div class="container text-flow"><h2>${escapeHtml(title)}</h2>${text}${extra}</div></section>`;
}

function searchSection(title, intro, phrases) {
  const cleanPhrases = uniqueBy(phrases, (phrase) => phrase).slice(0, 16);
  const titleId = `popular-${slugify(title)}-title`;
  return `<section class="section-pad compact-section popular-searches enquiry-searches" aria-labelledby="${titleId}"><div class="container"><div class="section-heading tight"><p class="eyebrow">Popular enquiry searches</p><h2 id="${titleId}">${escapeHtml(
    title
  )}</h2><p>${escapeHtml(intro)}</p></div><ul class="search-chip-grid" role="list" aria-label="${escapeHtml(title)}">${cleanPhrases
    .map((phrase) => `<li class="search-chip">${escapeHtml(phrase)}</li>`)
    .join("")}</ul></div></section>`;
}

function rfqBlock(subject = "stainless steel") {
  return `<section class="section-pad compact-section"><div class="container two-column"><div><p class="eyebrow">RFQ checklist</p><h2>What to send for a quick ${escapeHtml(
    subject
  )} quotation</h2><p>Clear details help Bharat Metals review availability, processing, documentation and transport options faster.</p></div><div class="info-panel">${list(
    rfqFields
  )}</div></div></section>`;
}

function ctaBlock(subject = "stainless steel") {
  return `<section class="quote-section"><div class="container quote-grid"><div><p class="eyebrow eyebrow-light">Request a quote</p><h2>Send your ${escapeHtml(
    subject
  )} requirement to Bharat Metals.</h2><p>Call, WhatsApp or email the product form, grade/specification, size, quantity, finish and delivery location.</p></div><div class="button-row"><a class="button button-primary button-on-dark" href="${
    site.phoneHref
  }">CALL NOW</a><a class="button button-primary button-on-dark" href="${
    site.whatsappHref
  }" target="_blank" rel="noopener">WHATSAPP</a><a class="button button-primary button-on-dark" href="${site.mailto.replace(
    /&/g,
    "&amp;"
  )}">EMAIL RFQ</a></div></div></section>`;
}

function faqHtml(faq, intro = "Practical answers for Bharat Metals buyers reviewing stainless steel, material, location and quotation requirements.") {
  return `<section class="section-pad"><div class="container faq-layout"><div><p class="eyebrow">Buyer answers</p><h2>Frequently asked questions</h2><p>${escapeHtml(intro)}</p></div><div class="faq-list">${faq
    .map((item) => `<details><summary>${escapeHtml(item.q)}</summary><p>${escapeHtml(item.a)}</p></details>`)
    .join("")}</div></div></section>`;
}

function citySlug(city) {
  return `stainless-steel-suppliers-${slugify(city.name)}/`;
}

function formBySlug(slug) {
  return forms.find((form) => form.formSlug === slug || form.slug === slug) || forms[0];
}

function gradeById(id) {
  return grades.find((grade) => grade.id === id || grade.slug === id) || grades[0];
}

function cityByName(name) {
  return locations.find((city) => city.name === name) || locations[0];
}

function formImage(form) {
  return `assets/images/photos/product-forms/${form.formSlug}.webp`;
}

function industryImage(industry) {
  const rel = `assets/images/photos/industries/${industry.slug}.webp`;
  return fs.existsSync(path.join(root, rel)) ? rel : "assets/images/photos/industries/industrial-plant.webp";
}

function industryIndustryText(industry) {
  return (
    industryCardCopy[industry.slug] ||
    `${industry.name} buyers can share product form, grade, size, quantity, certificate requirement and delivery location for a clearer stainless steel quotation.`
  );
}

function cityImage(city) {
  if (city.region === "Nearby export") {
    if (/maldives|male/i.test(city.name)) return "assets/images/photos/locations/maldives-export-packing.webp";
    return "assets/images/photos/locations/sri-lanka-export-packing.webp";
  }
  if (city.region === "Tamil Nadu" || city.name.includes("Chennai")) return "assets/images/photos/locations/tamil-nadu-logistics.webp";
  if (city.region === "Pondicherry" || city.region === "Puducherry") return "assets/images/photos/locations/south-india-logistics.webp";
  return "assets/images/photos/locations/south-india-logistics.webp";
}

const homepageSearchPhrases = [
  "Stainless steel 304 welded pipe suppliers in Chennai",
  "Stainless steel 316 welded pipe dealers in Chennai",
  "SS 304 seamless pipe dealers in Chennai",
  "SS 316 seamless pipe suppliers for industrial buyers",
  "SS 202 sheet suppliers in Chennai",
  "Stainless steel 304 sheet dealers in Chennai",
  "Stainless steel 316 plate suppliers in Tamil Nadu",
  "Jindal stainless steel pipe dealers in Chennai",
  "Jindal polished pipe dealers in Chennai",
  "Jindal make stainless steel pipe enquiries",
  "SS rod stockist in Chennai",
  "Stainless steel angle suppliers in Pondicherry",
  "SS flat dealers in Chennai",
  "Stainless steel coil suppliers in Chennai",
  "SS perforated sheet dealers in Chennai",
  "Stainless steel wire mesh suppliers in Chennai",
  "SS 304 suppliers in Coimbatore",
  "SS 316 suppliers in Hosur",
  "Stainless steel suppliers in Madurai",
  "Stainless steel suppliers in Trichy",
  "Stainless steel suppliers in Salem",
  "Stainless steel suppliers in Sricity",
  "Stainless steel suppliers in Renigunta",
  "Stainless steel suppliers in Tirupati",
  "Stainless steel supply enquiries for Sri Lanka",
  "Stainless steel export enquiries for Maldives"
];

const productSearchMap = {
  pipes: [
    "Stainless steel pipe suppliers in Chennai",
    "SS pipe dealers in Chennai",
    "Stainless steel 304 welded pipe suppliers in Chennai",
    "SS 316 welded pipe dealers in Chennai",
    "SS 304 seamless pipe dealers in Chennai",
    "SS 316 seamless pipe suppliers",
    "Jindal stainless steel pipe dealers in Chennai",
    "Jindal polished pipe dealers in Chennai",
    "SS pipe suppliers in Coimbatore",
    "Stainless steel pipe suppliers in Hosur",
    "SS pipe suppliers in Trichy",
    "Stainless steel pipe suppliers in Pondicherry",
    "SS 316 pipe suppliers in Tuticorin",
    "SS pipe suppliers in Sricity",
    "Stainless steel pipe suppliers in Renigunta"
  ],
  sheets: [
    "Stainless steel sheet suppliers in Chennai",
    "SS 304 sheet dealers in Chennai",
    "SS 202 sheet suppliers in Chennai",
    "SS 316 sheet suppliers in Tamil Nadu",
    "Mirror finish stainless steel sheet dealers",
    "Hairline finish stainless steel sheet suppliers",
    "PVC coated stainless steel sheets Chennai",
    "SS sheet suppliers in Coimbatore",
    "Stainless steel sheets in Erode",
    "SS sheets suppliers in Pondicherry",
    "SS sheets for commercial kitchen fabrication"
  ],
  plates: [
    "Stainless steel plate suppliers in Chennai",
    "SS 304 plate dealers Chennai",
    "SS 316 plate suppliers Tamil Nadu",
    "Stainless steel plates in Hosur",
    "SS plates suppliers in Trichy",
    "Stainless steel plate suppliers in Cuddalore",
    "SS 316 plates for coastal applications"
  ],
  rods: [
    "SS rod stockist in Chennai",
    "Stainless steel rod dealers Chennai",
    "SS 304 rod suppliers Chennai",
    "SS 316 rod suppliers Hosur",
    "SS rods Coimbatore machine shops",
    "SS rods for machining and workshop use"
  ],
  bars: [
    "Stainless steel bar stockist Chennai",
    "SS bar dealers in Chennai",
    "SS 304 bar suppliers Chennai",
    "SS bars for auto component manufacturers",
    "SS round bar suppliers Hosur",
    "Stainless steel bars for machine shops"
  ],
  angles: [
    "Stainless steel angle suppliers in Chennai",
    "Stainless steel angle suppliers in Pondicherry",
    "SS angles for fabrication",
    "Stainless steel angles for industrial frames",
    "SS 304 angle dealers Chennai"
  ],
  flats: [
    "SS flat dealers in Chennai",
    "SS flats for fabrication",
    "Stainless steel flat bar suppliers Chennai",
    "SS 304 flats suppliers Tamil Nadu",
    "SS flats for architectural work"
  ],
  channels: [
    "SS channel suppliers Chennai",
    "Stainless steel channels for industrial frames",
    "SS 304 channel suppliers Tamil Nadu",
    "SS channels for fabrication support",
    "Stainless steel channel dealers Chennai"
  ],
  coils: [
    "Stainless steel coil suppliers in Chennai",
    "SS 304 coil suppliers Chennai",
    "SS 316 coil suppliers Tamil Nadu",
    "Stainless steel slit coil enquiries",
    "SS coils for sheet processing"
  ],
  flanges: [
    "Stainless steel flanges suppliers in Chennai",
    "SS 316 flanges dealers in Chennai",
    "SS 304 flanges suppliers Tamil Nadu",
    "Stainless steel flanges for piping maintenance",
    "SS flanges suppliers Cuddalore"
  ],
  fittings: [
    "Stainless steel fittings suppliers in Chennai",
    "SS 316 fittings suppliers in Chennai",
    "SS elbows tees reducers Chennai",
    "Stainless steel pipe fittings Tamil Nadu",
    "SS fittings for food and chemical equipment"
  ],
  circles: [
    "Stainless steel circle suppliers in Chennai",
    "SS 304 circles for fabrication",
    "SS circles for vessels and equipment",
    "Stainless steel circle cutting enquiries",
    "SS circles Tamil Nadu suppliers"
  ],
  fasteners: [
    "Stainless steel fasteners suppliers in Chennai",
    "SS fasteners suppliers Hosur",
    "SS 304 bolts nuts washers Chennai",
    "SS 316 fasteners for marine applications",
    "Stainless steel fasteners for construction"
  ],
  "wire-mesh": [
    "Stainless steel wire mesh suppliers in Chennai",
    "SS 304 wire mesh dealers Chennai",
    "SS 316 wire mesh for filters",
    "Stainless steel mesh for industrial screening",
    "SS wire mesh suppliers Tamil Nadu"
  ],
  "perforated-sheets": [
    "SS perforated sheet dealers in Chennai",
    "Stainless steel perforated sheet suppliers Tamil Nadu",
    "SS 304 perforated sheets Chennai",
    "Stainless steel perforated sheets for guards",
    "Perforated stainless steel sheets Tiruppur"
  ],
  tubes: [
    "Stainless steel tube suppliers in Chennai",
    "SS 304 tube dealers Chennai",
    "SS square tube suppliers Chennai",
    "Polished stainless steel tube enquiries",
    "SS tubes for railing and interiors"
  ]
};

const productDirection = {
  pipes: {
    application:
      "Stainless steel pipes are commonly used in fabrication work, railings, commercial kitchens, process lines, utility lines, water treatment, marine repair, food processing, pharma equipment, chemical handling, structural supports and maintenance work. SS 304 pipes are widely discussed for general fabrication and clean environments, while SS 316 pipes are often reviewed for coastal, chemical, marine or higher corrosion-exposure use."
  },
  sheets: {
    application:
      "Stainless steel sheets are commonly discussed for commercial kitchen fabrication, interior panels, cabinets, ducting, cladding, food processing equipment, elevator or decorative work and general fabrication. Buyers usually compare 2B, BA, mirror, matt, hairline, brush and PVC coated sheet options before confirming grade, thickness and sheet size."
  },
  plates: {
    application:
      "Stainless steel plates are requested for industrial fabrication, base plates, machine parts, process equipment, supports, repair jobs and project work. SS 304 plates are common for general engineering and fabrication, while SS 316 plates are reviewed for coastal, chemical or higher corrosion-exposure requirements."
  },
  rods: {
    application:
      "Stainless steel rods are common in machining, shafts, repair work, fabrication, jigs, fixtures and engineering workshop requirements. Buyers from Coimbatore, Hosur and Chennai machine-shop clusters often specify diameter, length, grade and finish clearly to reduce quotation back-and-forth."
  },
  bars: {
    application:
      "Stainless steel bars are requested for machining, auto-component work, fastener production, maintenance, shopfloor fabrication and industrial repair. Round bars, square bars and hex bars should be specified with grade, diameter or section, length, tolerance expectation and certificate need where applicable."
  },
  angles: {
    application:
      "Stainless steel angles are used for frames, supports, edge protection, industrial structures, construction-related fabrication and maintenance work. Buyers should share leg size, thickness, length, grade, quantity and whether cutting or packing support is needed."
  },
  flats: {
    application:
      "Stainless steel flats are used for bracing, frames, trim, architectural work, equipment fabrication, repair and general fabrication. Width, thickness, length, grade and finish should be included in the RFQ, especially when SS 304 or SS 316 is required."
  },
  channels: {
    application:
      "Stainless steel channels are discussed for industrial frames, support structures, fabrication, construction-related work, equipment bases and repair jobs. Buyers should share channel size, thickness, length, grade, quantity and dispatch location."
  },
  coils: {
    application:
      "Stainless steel coils are requested for sheet conversion, fabrication, commercial processing, trading and downstream production. Coil width, thickness, finish, grade, slit coil requirement and packing expectation should be shared before quote review."
  },
  flanges: {
    application:
      "Stainless steel flanges are common in piping, maintenance, process equipment, marine repair, chemical handling and utility line requirements. Buyers should share flange type, class, size, standard, grade, quantity and certificate requirement."
  },
  fittings: {
    application:
      "Stainless steel fittings such as elbows, tees, reducers and couplings are used for pipe connections, plant maintenance, food equipment, chemical handling, water treatment and industrial repair. Schedule, size, grade and matching pipe details are important for accurate review."
  },
  circles: {
    application:
      "Stainless steel circles are requested for vessels, kitchenware, equipment fabrication, cut components and custom fabrication work. Buyers should specify diameter, thickness, grade, finish, edge expectation, quantity and whether cutting support is needed."
  },
  fasteners: {
    application:
      "Stainless steel fasteners are used in construction, machinery, marine repair, equipment assembly, site installation and maintenance work. Bolt, nut, washer or screw type, size, grade, thread details and quantity should be sent clearly."
  },
  "wire-mesh": {
    application:
      "Stainless steel wire mesh is used for filters, guards, partitions, screens, enclosures, strainers and industrial separation work. Buyers should share mesh opening, wire diameter, roll or sheet size, grade, edge treatment and quantity."
  },
  "perforated-sheets": {
    application:
      "Stainless steel perforated sheets are used for guards, screens, acoustic panels, machine protection, filtration, architecture and industrial panels. Hole pattern, pitch, open area, sheet size, thickness, finish and grade should be included in the RFQ."
  },
  tubes: {
    application:
      "Stainless steel tubes are requested for railings, interiors, frames, equipment fabrication, furniture, utility work and architectural applications. Buyers should specify round, square or rectangular profile, size, thickness, finish, grade and length."
  }
};

const productFinishMatrix = {
  sheets: ["2B Finish", "No. 1 Finish", "BA Finish", "Mirror Finish", "No. 8 Finish", "Matt Finish", "Hairline Finish", "Brush Finish", "Satin Finish", "PVC Coated Sheets"],
  plates: ["No. 1 Finish", "2B Finish where applicable", "Matt Finish", "Brush Finish", "Polished Finish where applicable", "Cut-to-size support"],
  coils: ["2B Finish", "BA Finish", "Matt Finish", "Hairline Finish", "Brush Finish", "Slit coil enquiry support", "PVC coating where applicable"],
  pipes: ["Mill Finish", "Polished Finish", "Matt Finish", "Mirror Polished / Decorative where applicable", "Brush Finish where applicable", "Welded / Seamless enquiry preference"],
  tubes: ["Mill Finish", "Polished Finish", "Matt Finish", "Mirror Polished / Decorative where applicable", "Round / Square / Rectangular options"],
  rods: ["Bright / BA Finish where applicable", "Polished Finish", "Mirror / Bright Polished where applicable", "Matt Finish", "Hairline Finish where applicable", "Brush Finish where applicable", "Ground / peeled / machined finish if applicable"],
  bars: ["Bright / BA Finish where applicable", "Polished Finish", "Mirror / Bright Polished where applicable", "Matt Finish", "Hairline Finish where applicable", "Brush Finish where applicable", "Round / square / hex bar options"],
  angles: ["Mill Finish", "Matt Finish", "Brush Finish", "Polished Finish where applicable"],
  flats: ["Mill Finish", "Matt Finish", "Brush Finish", "Polished Finish where applicable", "Cut-to-size support"],
  channels: ["Mill Finish", "Matt Finish", "Brush Finish", "Polished Finish where applicable"],
  flanges: ["Machined Finish", "Mill Finish", "Pickled / passivated where applicable", "Polished Finish where applicable", "MTC / mill certificate discussion where applicable"],
  fittings: ["Mill Finish", "Pickled / passivated where applicable", "Polished Finish where applicable", "Welded / seamless fitting preference where applicable"],
  circles: ["2B / No. 1 base material finish depending on sheet/plate source", "Polished Finish where applicable", "Cut circle enquiry support"],
  fasteners: ["Bright Finish", "Passivated Finish where applicable", "Polished Finish where applicable", "Thread/specification details"],
  "wire-mesh": ["Woven / welded mesh style", "Aperture / wire diameter details", "Mill / bright finish depending on availability"],
  "perforated-sheets": ["2B Finish", "No. 1 Finish", "Matt Finish", "Brush Finish", "Hole pattern / pitch / thickness", "PVC coating where applicable"]
};

const productServiceMatrix = {
  sheets: ["Cutting", "Polishing", "PVC coating", "Bending where suitable", "Packing", "Local delivery", "Transport booking", "MTC / mill certificate discussion"],
  plates: ["Cutting", "Drilling where suitable", "Polishing where applicable", "Packing", "Transport booking", "Door delivery discussion", "MTC / mill certificate discussion"],
  coils: ["Slitting enquiry support", "PVC coating where applicable", "Packing", "Transport booking", "MTC / mill certificate discussion"],
  pipes: ["Cutting to length discussion", "Polishing", "Packing", "Local delivery", "Transport booking", "Courier for small items where practical", "MTC / mill certificate discussion"],
  tubes: ["Cutting to length discussion", "Polishing", "Packing", "Local delivery", "Transport booking", "MTC / mill certificate discussion"],
  rods: ["Cutting to length discussion", "Polishing", "Packing", "Local delivery", "Transport booking", "Courier for small items where practical", "MTC / mill certificate discussion"],
  bars: ["Cutting to length discussion", "Polishing", "Packing", "Local delivery", "Transport booking", "Courier for small items where practical", "MTC / mill certificate discussion"],
  angles: ["Cutting", "Drilling where suitable", "Polishing where applicable", "Packing", "Transport booking"],
  flats: ["Cutting", "Drilling where suitable", "Polishing where applicable", "Packing", "Transport booking"],
  channels: ["Cutting", "Drilling where suitable", "Polishing where applicable", "Packing", "Transport booking"],
  flanges: ["Machining details review", "Drilling pattern confirmation", "Packing", "Transport booking", "MTC / mill certificate discussion", "Third party inspection discussion"],
  fittings: ["Matching pipe details review", "Packing", "Transport booking", "MTC / mill certificate discussion"],
  circles: ["Cut circle enquiry support", "Polishing where applicable", "Packing", "Transport booking"],
  fasteners: ["Thread/specification review", "Packing", "Courier for small items", "MTC / mill certificate discussion where applicable"],
  "wire-mesh": ["Cut size discussion", "Packing", "Courier for small items where practical", "Transport booking"],
  "perforated-sheets": ["Cutting", "PVC coating where applicable", "Packing", "Transport booking", "Hole pattern review"]
};

function finishesFor(form) {
  return productFinishMatrix[form.formSlug] || finishes;
}

function servicesFor(form) {
  return productServiceMatrix[form.formSlug] || services;
}

function gradeChipsForForm(form) {
  return chips(grades, (grade) => `${grade.slug}-${form.formSlug}/`, (grade) => grade.name);
}

function finishMatrixSection(form) {
  return pageSection(
    "Finish, service and documentation options",
    `${form.short} enquiries should use finish and processing terms that fit the product form. Share the expected surface, size, quantity, packing and documentation requirement before quote review.`,
    `<h3>${escapeHtml(form.short)} finish options</h3>${list(finishesFor(form))}<h3>${escapeHtml(form.short)} service support</h3>${list(servicesFor(form))}<h3>Documentation</h3>${list(["Material Test Certificate / MTC where applicable", "Mill certificate discussion where applicable", "Third party inspection where applicable"])}`
  );
}

function buyerSpec(form) {
  const custom = {
    rods: "diameter, length, machining use and tolerance expectation if any",
    bars: "round, square or hex section, size, length and tolerance expectation if any",
    sheets: "thickness, sheet size, finish, PVC coating need and visible-surface expectation",
    plates: "plate thickness, width, length, cutting need and certificate requirement",
    coils: "coil width, thickness, finish, grade and slit coil requirement",
    circles: "circle diameter, thickness, grade, finish and edge expectation"
  };
  return custom[form.formSlug] || form.specs;
}

function productIntro(form) {
  if (form.formSlug === "pipes") {
    return "Stainless steel pipes are requested by fabricators, contractors, industrial maintenance teams, commercial kitchen fabricators, process equipment buyers and traders for both welded and seamless requirements. Bharat Metals supports stainless steel pipe enquiries from Chennai by reviewing grade, outside diameter, wall thickness, schedule, length, finish, quantity, make preference, certificate requirement and delivery location. Common pipe enquiries include SS 202, SS 304 and SS 316, with 304L, 316L, 310, 410, 420 and 430 reviewed where specification and availability match.";
  }
  return `${form.name} are requested by Chennai and Tamil Nadu buyers for ${form.uses.join(", ")} and related commercial supply needs. Bharat Metals reviews ${form.short.toLowerCase()} enquiries by grade, ${buyerSpec(form)}, quantity, make preference, certificate requirement and delivery location. Common enquiries include SS 202, SS 304 and SS 316, with 304L, 316L, 310, 410, 420 and 430 reviewed where the specification and availability match the buyer's application.`;
}

function productApplications(form) {
  return productDirection[form.formSlug]?.application || `${form.name} are commonly discussed for ${form.uses.join(", ")}. Buyers should confirm grade, finish, size, quantity and application before finalizing the enquiry.`;
}

function productSearches(form) {
  return productSearchMap[form.formSlug] || [
    `${form.name} suppliers in Chennai`,
    `${form.short} dealers in Chennai`,
    `SS 304 ${form.short.toLowerCase()} suppliers Chennai`,
    `SS 316 ${form.short.toLowerCase()} suppliers Tamil Nadu`,
    `${form.short} suppliers in Coimbatore`,
    `${form.short} suppliers in Hosur`,
    `${form.short} suppliers in Pondicherry`
  ];
}

function gradeSearches(grade) {
  const common = {
    "202": [
      "SS 202 suppliers in Chennai",
      "SS 202 sheet suppliers in Chennai",
      "SS 202 pipe dealers in Chennai",
      "SS 202 polished pipe dealers",
      "SS 202 railing pipe suppliers",
      "SS 202 sheet dealers in Trichy",
      "SS 202 suppliers in Madurai",
      "SS 202 suppliers in Salem",
      "SS 202 pipe enquiries in Pondicherry"
    ],
    "304": [
      "SS 304 suppliers in Chennai",
      "SS 304 pipe dealers in Chennai",
      "SS 304 welded pipe suppliers in Chennai",
      "SS 304 seamless pipe dealers in Chennai",
      "SS 304 sheet dealers in Chennai",
      "SS 304 plate suppliers in Tamil Nadu",
      "SS 304 rod stockist in Chennai",
      "SS 304 flat dealers in Chennai",
      "SS 304 angle suppliers in Pondicherry",
      "SS 304 suppliers in Coimbatore",
      "SS 304 pipe suppliers in Hosur",
      "SS 304 sheet suppliers in Trichy",
      "SS 304 plate dealers in Madurai",
      "SS 304 polished pipe enquiries in Chennai",
      "Jindal SS 304 pipe dealers in Chennai",
      "Jindal make SS 304 pipe enquiries"
    ],
    "316": [
      "SS 316 suppliers in Chennai",
      "SS 316 pipe dealers in Chennai",
      "SS 316 welded pipe suppliers",
      "SS 316 seamless pipe suppliers",
      "SS 316 plate suppliers in Tamil Nadu",
      "SS 316 fittings suppliers in Chennai",
      "SS 316 flanges dealers in Chennai",
      "SS 316 suppliers in Hosur",
      "SS 316 pipe suppliers in Tuticorin",
      "SS 316 suppliers in Pondicherry",
      "SS 316 suppliers in Port Blair",
      "SS 316 stainless steel supply to Sri Lanka",
      "SS 316 export enquiries for Maldives"
    ]
  };
  if (common[grade.id]) return common[grade.id];
  const focus = {
    "304l": ["SS 304L suppliers in Chennai", "SS 304L welded fabrication enquiries", "SS 304L pipe suppliers Chennai", "SS 304L sheet suppliers Tamil Nadu", "SS 304L MTC material enquiries", "SS 304L for welding-sensitive fabrication"],
    "310": ["SS 310 suppliers in Chennai", "SS 310 heat resistant stainless steel", "SS 310 plates suppliers Tamil Nadu", "SS 310 rods and bars enquiries", "SS 310 high temperature application material", "SS 310 industrial stainless steel enquiries"],
    "316l": ["SS 316L suppliers in Chennai", "SS 316L pipe suppliers Tamil Nadu", "SS 316L sheet and plate enquiries", "SS 316L welded fabrication material", "SS 316L corrosion exposure enquiries", "SS 316L pharma equipment stainless steel"],
    "410": ["SS 410 suppliers in Chennai", "SS 410 rods suppliers Chennai", "SS 410 bars for machining", "SS 410 industrial stainless steel enquiries", "SS 410 material with certificate", "SS 410 suppliers for workshops"],
    "420": ["SS 420 suppliers in Chennai", "SS 420 rods and bars enquiries", "SS 420 machining stainless steel", "SS 420 industrial applications", "SS 420 material suppliers Tamil Nadu", "SS 420 hardness-related enquiries"],
    "430": ["SS 430 suppliers in Chennai", "SS 430 sheet suppliers Chennai", "SS 430 decorative stainless steel sheets", "SS 430 kitchen equipment sheet enquiries", "SS 430 ferritic stainless steel", "SS 430 sheets Tamil Nadu"]
  };
  return focus[grade.id] || [`${grade.name} suppliers in Chennai`, `${grade.name} pipe suppliers`, `${grade.name} sheet suppliers`, `${grade.name} material enquiries Tamil Nadu`];
}

function gradeOverview(grade) {
  const copy = {
    "202": "SS 202 is often discussed for cost-sensitive fabrication, railing, interior and commercial stainless steel work where the environment and application are suitable. Buyers commonly ask for SS 202 pipes, polished pipes, tubes and sheets when appearance and budget are important. Bharat Metals reviews SS 202 requirements by product form, thickness, finish, size, quantity, delivery location and whether the material is intended for indoor, outdoor or moisture-exposed use.",
    "304": "Buyers usually choose SS 304 when they need a practical stainless steel grade with good general corrosion resistance, clean appearance and wide fabrication suitability. For commercial kitchens, food-contact equipment, architectural work, general fabrication and many industrial uses, SS 304 is often discussed before moving to higher alloy options such as SS 316 for more corrosive or coastal exposure.",
    "316": "SS 316 is commonly discussed where corrosion exposure is higher, especially for coastal, marine, chemical, pharma, food processing, water treatment and port-side maintenance requirements. Buyers from Chennai, Tuticorin, Pondicherry, Cuddalore, Port Blair, Sri Lanka and Maldives often ask about SS 316 when chloride or coastal exposure is part of the application conversation.",
    "304l": "SS 304L is a low-carbon 304 variant often discussed when welding, fabrication or documentation expectations call for a lower carbon grade. It may be reviewed for fabricated equipment, process components, sheets, plates, pipes and fittings when the buyer needs to match a drawing, tender or project specification.",
    "310": "SS 310 is discussed for selected heat-resistant and high-temperature industrial applications. Buyers should share the expected operating temperature, product form, size, certificate need and application environment because grade suitability is more specification-led than general commercial stainless steel enquiries.",
    "316l": "SS 316L is a low-carbon 316 variant often discussed for welding-sensitive corrosion exposure requirements. Pharma, food processing, chemical, marine and process equipment buyers may ask for SS 316L pipes, sheets, plates, fittings or flanges when drawings or specifications call for this grade.",
    "410": "SS 410 is a martensitic stainless steel grade discussed for selected mechanical, wear, machining and industrial applications. Rods and bars are common enquiry forms, and buyers should mention hardness, machining, certificate and end-use expectations before quotation review.",
    "420": "SS 420 is a martensitic stainless grade considered for selected hardness, wear and machining-related uses. It is best discussed with exact form, size, quantity, application and any heat-treatment or certificate expectation clearly mentioned at RFQ stage.",
    "430": "SS 430 is a ferritic stainless steel grade often discussed for sheets, kitchen equipment, decorative work, appliance-related fabrication and selected interior applications. Finish, thickness, sheet size and environment should be shared clearly, especially when buyers compare SS 430 with SS 304."
  };
  return copy[grade.id] || `${grade.name} enquiries should include application, form, size, finish and quantity. ${grade.notes}`;
}

function gradeIntro(grade) {
  if (grade.id === "304") {
    return "SS 304 is one of the most commonly requested stainless steel grades for fabrication, commercial kitchen work, food handling, interiors, general engineering and industrial maintenance. Bharat Metals reviews SS 304 enquiries from Chennai for pipes, sheets, plates, coils, rods, bars, angles, flats, flanges, fittings, wire mesh and perforated sheets based on size, finish, quantity, certificate requirement and delivery location. Buyers across Chennai, Ambattur, Guindy, Sriperumbudur, Oragadam, Coimbatore, Hosur, Trichy and Pondicherry commonly discuss SS 304 because it offers a practical balance of corrosion resistance, fabrication suitability and commercial availability.";
  }
  if (grade.id === "316") {
    return "SS 316 stainless steel is commonly discussed for coastal, chemical, marine, pharma, food processing, water treatment and port-side maintenance requirements. Bharat Metals reviews SS 316 enquiries from Chennai for buyers in Chennai, Cuddalore, Pondicherry, Tuticorin, Port Blair and nearby Sri Lanka or Maldives enquiry contexts when product form, size, quantity, packing and documentation needs are clear.";
  }
  if (grade.id === "202") {
    return "SS 202 stainless steel is commonly discussed for railing, fabrication, interiors, decorative work, polished pipes, sheets and cost-conscious commercial applications where the environment and usage are suitable. Bharat Metals reviews SS 202 enquiries from Chennai by checking form, finish, thickness or diameter, quantity, delivery location and whether SS 202 is appropriate for the intended use.";
  }
  return `${grade.name} stainless steel enquiries are reviewed by Bharat Metals from Chennai for buyers who need practical guidance on product form, size, finish, quantity, certificate requirement and delivery location. ${gradeOverview(grade)}`;
}


function gradeFormCardText(grade, form) {
  if (grade.id === "304") {
    const ss304 = {
      pipes: "Pipe enquiries usually mention welded or seamless preference, outside diameter, wall thickness or schedule, length, finish, make preference, quantity and certificate requirement.",
      sheets: "Sheet enquiries usually mention thickness, finish such as 2B, mirror, matt, hairline or BA, sheet size, PVC coating requirement and quantity.",
      plates: "Plate enquiries usually mention thickness, width, length, cutting requirement, quantity and certificate expectation.",
      rods: "Rod enquiries usually mention diameter, length, machining or fabrication use, finish, quantity and certificate requirement.",
      bars: "Bar enquiries usually mention round, square or hex section, size, length, tolerance expectation, quantity and application."
    };
    if (ss304[form.formSlug]) return ss304[form.formSlug];
  }
  const starts = {
    pipes: "Pipe enquiries usually mention welded or seamless preference, outside diameter, wall thickness, schedule, length, finish and certificate need.",
    tubes: "Tube enquiries usually mention round, square or rectangular profile, size, wall thickness, finish, length and grade.",
    sheets: "Sheet enquiries usually mention thickness, sheet size, finish, PVC protection if needed, quantity and visible-side expectation.",
    plates: "Plate enquiries usually mention thickness, width, length, cutting need, quantity and certificate expectation.",
    coils: "Coil enquiries usually mention width, thickness, finish, slit coil requirement, packing and quantity.",
    rods: "Rod enquiries usually mention diameter, length, machining use, finish, tolerance expectation and certificate requirement.",
    bars: "Bar enquiries usually mention round, square or hex section, size, length, tolerance expectation and application.",
    flanges: "Flange enquiries usually mention type, class, standard, size, grade, quantity and certificate requirement.",
    fittings: "Fitting enquiries usually mention elbow, tee, reducer or coupling type, size, schedule, grade and matching pipe details.",
    fasteners: "Fastener enquiries usually mention bolt, nut, washer or screw type, size, thread, grade and quantity.",
    "wire-mesh": "Wire mesh enquiries usually mention mesh opening, wire diameter, roll or sheet size, grade and edge expectation.",
    "perforated-sheets": "Perforated sheet enquiries usually mention hole pattern, pitch, thickness, sheet size, open area, finish and grade."
  };
  return starts[form.formSlug] || `${grade.name} ${form.short.toLowerCase()} enquiries should mention ${buyerSpec(form)}, quantity, finish and delivery location.`;
}

function gradeCityNames(grade) {
  if (grade.id === "316") return ["Chennai", "Pondicherry", "Cuddalore", "Tuticorin", "Port Blair", "Coimbatore", "Hosur", "Sricity", "Tada", "Renigunta", "Sri Lanka", "Maldives"];
  if (grade.id === "202") return ["Chennai", "Ambattur", "Guindy", "Madurai", "Trichy", "Salem", "Pondicherry", "Coimbatore", "Hosur", "Tiruppur"];
  return ["Chennai", "Ambattur", "Sriperumbudur", "Oragadam", "Coimbatore", "Hosur", "Trichy", "Madurai", "Salem", "Pondicherry", "Sricity", "Tada", "Renigunta", "Tirupati"];
}

function gradeCityHref(grade, city) {
  const hasGradeCityPage = ["202", "304", "316"].includes(grade.id) && gradeCityPriority.includes(city.name);
  return hasGradeCityPage ? `${grade.slug}-suppliers-${slugify(city.name)}/` : citySlug(city);
}

function gradeCityIntro(grade) {
  if (grade.id === "304") {
    return "SS 304 enquiries are commonly reviewed for Chennai, Ambattur, Sriperumbudur, Oragadam, Coimbatore, Hosur, Trichy, Madurai, Salem, Pondicherry, Sricity, Tada, Renigunta and Tirupati buyers. The links below help buyers open relevant city or grade-location pages before sending product form, size, finish, quantity and delivery details.";
  }
  if (grade.id === "316") {
    return "SS 316 enquiries are often reviewed for coastal, chemical, pharma, food processing, water treatment, marine and port-linked buyers. Use these city links when corrosion exposure, packing, certificate or dispatch planning is part of the RFQ.";
  }
  if (grade.id === "202") {
    return "SS 202 enquiries are often reviewed for railing, interior, decorative, polished-pipe and commercial fabrication buyers. Use these city links when budget, finish, size and application suitability need to be discussed clearly.";
  }
  return `Use these city links when ${grade.name} buyers need to discuss form, size, finish, quantity, certificate needs and Chennai-side dispatch planning.`;
}

function formFromProductName(product) {
  const normalized = product.toLowerCase();
  const alias = {
    "polished pipes": "pipes",
    "decorative stainless steel": "sheets"
  };
  const target = alias[normalized];
  if (target) return formBySlug(target);
  return forms.find((form) => form.short.toLowerCase() === normalized || form.name.toLowerCase().includes(normalized) || normalized.includes(form.short.toLowerCase()));
}

function relatedProductForms(products, fallbackCount = 4) {
  const direct = products.map(formFromProductName).filter(Boolean);
  return uniqueBy([...direct, ...forms.slice(0, fallbackCount)], (form) => form.formSlug).slice(0, 8);
}

function relatedProductFormsForCity(city) {
  if (city.name === "Renigunta") {
    return ["pipes", "sheets", "plates", "rods", "fasteners", "fittings", "perforated-sheets"].map(formBySlug);
  }
  return relatedProductForms(city.products, 4);
}

function relatedProductFormsForIndustry(industry) {
  return relatedProductForms(industry.products, 4);
}

function cityProductIntro(city) {
  if (city.name === "Renigunta") {
    return "Renigunta buyers commonly discuss pipes, sheets, plates, rods, fasteners, fittings and perforated sheets by grade, size, certificate expectation and dispatch plan from Chennai.";
  }
  return `For ${city.name}, Bharat Metals commonly reviews stainless steel enquiries for ${city.products.join(", ")} and closely related forms when grade, size, quantity and application are clear.`;
}

function nearbyCityIntro(city) {
  if (city.name === "Renigunta") return "Nearby buyers often compare Renigunta, Tirupati, Sricity, Tada and Chittoor dispatch options when planning stainless steel procurement from Chennai.";
  return `Nearby buyers often compare ${city.name} and surrounding ${city.region} dispatch options when planning stainless steel procurement from Chennai.`;
}
function cityIntro(city) {
  const special = {
    Chennai:
      "Chennai buyers include fabricators, traders, commercial kitchen fabricators, pharma equipment makers, engineering workshops, automobile suppliers, builders, marine repair teams, port-related contractors and project procurement teams. Bharat Metals supports stainless steel enquiries from its Chennai base for pipes, sheets, plates, rods, bars, coils, flanges, fittings, angles, flats, wire mesh and perforated sheets. Buyers can send grade, size, thickness, finish, quantity, certificate needs and delivery details for practical quotation support.",
    Renigunta:
      "Renigunta is closely connected to Tirupati, Sricity, Tada and Chennai-side industrial movement, making it a practical enquiry location for buyers who need stainless steel materials dispatched from Chennai. Bharat Metals can review stainless steel requirements for Renigunta fabricators, maintenance buyers, pharma and industrial users, traders and contractors when grade, size, quantity and delivery location are clear. Common enquiries may include SS 304 and SS 316 welded pipes, seamless pipe enquiries, sheets, plates, rods, fasteners, fittings and perforated sheets.",
    Sricity:
      "Sricity buyers often represent manufacturing units, factories, contractors, utility teams, fabrication vendors and procurement teams that need stainless steel material movement from Chennai-side supply channels. Bharat Metals reviews Sricity enquiries for pipes, tubes, sheets, plates, rods, bars, fasteners and fittings, especially in SS 304 and SS 316 where the application and documentation requirement are clear.",
    Tada:
      "Tada is part of a practical Chennai-accessible industrial belt where stainless steel enquiries may come from factories, fabrication contractors, maintenance teams, engineering vendors and traders. Bharat Metals reviews Tada requirements for pipes, tubes, sheets, plates, rods, bars, fasteners and fittings based on grade, size, finish, quantity, certificate need and delivery location.",
    Pondicherry:
      "Pondicherry buyers include pharma, food processing, hotel, engineering, fabrication and coastal maintenance users. Bharat Metals reviews enquiries from Chennai for SS 304 and SS 316 pipes, sheets, polished pipes, plates, rods, fittings and related stainless steel forms, with extra attention to finish, corrosion exposure, packing and transport planning.",
    Coimbatore:
      "Coimbatore stainless steel enquiries commonly come from pump, motor, textile machinery, machine shop, fabrication, food equipment and engineering buyers. Bharat Metals reviews rods, bars, flats, plates, sheets and pipes from Chennai with practical attention to diameter, thickness, grade, machining use, finish, certificate requirement and transport planning.",
    Hosur:
      "Hosur buyers often represent industrial manufacturing, automotive, engineering, fabrication and maintenance requirements. Bharat Metals supports enquiries for rods, bars, sheets, pipes, plates and fasteners where SS 304, SS 316 or SS 202 is specified along with size, quantity, finish, delivery location and documentation needs.",
    Trichy:
      "Trichy buyers include engineering, boiler, fabrication, infrastructure, institutional and maintenance teams. Bharat Metals reviews stainless steel plate, pipe, fitting, flange and rod enquiries from Chennai with grade, size, finish, certificate and transport details clearly included in the RFQ.",
    Madurai:
      "Madurai stainless steel enquiries commonly come from commercial fabrication, food processing, hotel kitchen equipment, builders, traders and repair buyers. Bharat Metals reviews sheets, pipes, rods and decorative stainless steel requirements based on grade, finish, size, quantity, certificate needs and delivery planning from Chennai.",
    Salem:
      "Salem buyers often discuss stainless steel for steel-linked trading, engineering, fabrication, construction, workshop and maintenance requirements. Bharat Metals reviews sheet, plate, rod, angle and channel enquiries from Chennai based on grade, dimensions, finish, quantity and transport feasibility.",
    Tiruppur:
      "Tiruppur enquiries can come from textile, dyeing, processing, fabrication and utility buyers. Bharat Metals reviews pipes, sheets, plates, perforated sheets and fittings where SS 304 or SS 316 may be discussed for wet processing, utility, maintenance or fabrication requirements.",
    Tuticorin:
      "Tuticorin and Thoothukudi enquiries often relate to port, marine, chemical, logistics, salt and coastal exposure requirements. Bharat Metals reviews SS 316, SS 316L and SS 304 pipes, plates, flanges, fittings and fasteners from Chennai where corrosion exposure, packing, certificate and transport details are clear.",
    "Sri Lanka":
      "Sri Lanka enquiries are handled as nearby export enquiries, not as a claim of regular export volume. Bharat Metals can review stainless steel pipes, sheets, plates and fasteners for construction, marine, fabrication and commercial kitchen requirements when product specification, quantity, packing, documentation and destination details are clear.",
    Maldives:
      "Maldives enquiries are handled as nearby export enquiries for hospitality, marine, construction, commercial kitchen and coastal stainless steel needs. Bharat Metals can review SS 304 and SS 316 pipes, sheets, plates and fasteners when the buyer shares grade, size, quantity, packing, certificate and destination details."
  };
  if (special[city.name]) return special[city.name];
  const exportTone = city.region === "Nearby export" ? "nearby export enquiry" : `${city.region} supply enquiry`;
  return `${city.name} stainless steel buyers may include fabricators, traders, contractors, workshops, maintenance teams, project procurement teams and industry users connected with ${city.profile}. Bharat Metals reviews ${exportTone.toLowerCase()} requirements from Chennai for ${city.products.join(", ")} and related stainless steel forms. Buyers should share grade, size, thickness or schedule, finish, quantity, certificate requirement, packing expectation and delivery location so availability and dispatch planning can be discussed responsibly.`;
}

function citySearches(city) {
  const map = {
    Chennai: ["Stainless steel suppliers in Chennai", "Stainless steel dealers in Chennai", "SS dealers in Chennai", "Stainless steel stockist Chennai", "Stainless steel wholesalers in Chennai", "SS 304 pipe suppliers in Chennai", "SS 316 welded pipe dealers in Chennai", "SS 202 sheet suppliers in Chennai", "SS rod stockist in Chennai", "Jindal stainless steel pipe dealers in Chennai"],
    Renigunta: ["Stainless steel suppliers in Renigunta", "SS 304 pipe suppliers in Renigunta", "SS 316 welded pipe suppliers Renigunta", "Stainless steel sheet suppliers in Renigunta", "SS plate dealers near Renigunta", "Stainless steel suppliers near Tirupati and Renigunta", "SS fasteners suppliers Renigunta", "Stainless steel material dispatch from Chennai to Renigunta", "SS 304 sheet dealers Renigunta", "SS 316 pipe enquiries Renigunta"],
    Sricity: ["Stainless steel suppliers in Sricity", "SS 304 suppliers in Sricity", "Stainless steel sheet suppliers Sricity", "SS fasteners suppliers Sricity", "Stainless steel material from Chennai to Sricity", "SS 316 pipe suppliers Sricity"],
    Tada: ["Stainless steel suppliers in Tada", "SS 316 pipe suppliers in Tada", "SS 304 suppliers in Tada", "Stainless steel sheet suppliers Tada", "SS fasteners suppliers Tada", "Stainless steel material from Chennai to Tada"],
    Cuddalore: ["Stainless steel suppliers in Cuddalore", "SS 316 pipe suppliers Cuddalore", "SS fittings suppliers Cuddalore", "SS flanges suppliers Cuddalore", "Stainless steel plate suppliers Cuddalore"],
    Neyveli: ["Stainless steel plate suppliers Neyveli", "SS pipe suppliers Neyveli", "SS fittings suppliers Neyveli", "SS 316 plate suppliers Neyveli", "Stainless steel suppliers near Neyveli"],
    Pondicherry: ["Stainless steel suppliers in Pondicherry", "Stainless steel angle suppliers in Pondicherry", "SS 304 pipe suppliers Pondicherry", "SS 316 sheet suppliers Pondicherry", "Polished pipe dealers Pondicherry", "Stainless steel suppliers in Puducherry"],
    Coimbatore: ["Stainless steel suppliers in Coimbatore", "SS 304 suppliers in Coimbatore", "SS rod dealers Coimbatore", "Stainless steel bar suppliers Coimbatore", "SS sheet suppliers Coimbatore", "Stainless steel pipes Coimbatore", "SS flats for machine shops Coimbatore"],
    Hosur: ["Stainless steel suppliers in Hosur", "SS 316 suppliers in Hosur", "SS 304 rod suppliers Hosur", "Stainless steel sheet suppliers Hosur", "SS fasteners suppliers Hosur", "Stainless steel pipes Hosur"],
    Trichy: ["Stainless steel suppliers in Trichy", "SS plates suppliers Trichy", "SS pipe suppliers Trichy", "SS 304 sheet suppliers Trichy", "SS fittings suppliers Trichy"],
    Madurai: ["Stainless steel suppliers in Madurai", "SS sheet dealers Madurai", "SS pipe suppliers Madurai", "Polished stainless steel pipe dealers Madurai", "SS 304 suppliers Madurai"],
    Salem: ["Stainless steel suppliers in Salem", "SS sheet dealers Salem", "SS rods suppliers Salem", "Stainless steel angles Salem", "SS 304 suppliers Salem"],
    Tiruppur: ["Stainless steel suppliers in Tiruppur", "SS 316 welded pipe suppliers Tiruppur", "SS sheets Tiruppur", "Stainless steel perforated sheet Tiruppur", "SS fittings Tiruppur"],
    Tuticorin: ["Stainless steel suppliers in Tuticorin", "SS 316 pipe suppliers Tuticorin", "Stainless steel flanges Tuticorin", "SS fasteners Tuticorin", "Stainless steel suppliers Thoothukudi"],
    "Sri Lanka": ["Stainless steel supply to Sri Lanka", "Stainless steel pipe export enquiries Sri Lanka", "SS 304 sheet supply to Sri Lanka", "Stainless steel commercial kitchen material Sri Lanka", "SS 316 marine stainless steel enquiries Sri Lanka"],
    Maldives: ["Stainless steel export enquiries Maldives", "SS 316 marine stainless steel enquiries Maldives", "Stainless steel commercial kitchen material Maldives", "SS 304 sheet supply to Maldives", "Stainless steel pipe export enquiries Maldives"]
  };
  if (map[city.name]) return map[city.name];
  return [
    `Stainless steel suppliers in ${city.name}`,
    `SS 304 suppliers in ${city.name}`,
    `SS 316 suppliers in ${city.name}`,
    `Stainless steel pipe suppliers ${city.name}`,
    `Stainless steel sheet suppliers ${city.name}`,
    `SS material dispatch from Chennai to ${city.name}`
  ];
}

function industryIntro(industry) {
  if (industry.slug === "automobile-auto-components") {
    return "Automobile and auto component buyers often require stainless steel for fabrication, machine components, maintenance work, fixtures, shopfloor equipment, fasteners, panels, brackets and project-related supply. Bharat Metals reviews enquiries from Chennai for rods, bars, sheets, plates, flats, fasteners, pipes and tubes used by fabricators, auto-component suppliers, engineering workshops and contractors serving manufacturing corridors such as Ambattur, Sriperumbudur, Oragadam, Irungattukottai and Hosur.";
  }
  return `${industry.name} buyers often need stainless steel for fabrication, maintenance, equipment work, utility support, repair, installation or project supply. Bharat Metals reviews ${industry.products.join(", ")} enquiries from Chennai for procurement teams, contractors, fabricators, workshops and traders serving Chennai, Tamil Nadu and nearby South India markets. Buyers should share grade, size, finish, drawing or sample details where available, certificate expectations, quantity and delivery location so the requirement can be reviewed clearly.`;
}

function industryProductRelevance(industry) {
  if (industry.slug === "automobile-auto-components") {
    return "Rods and bars are commonly discussed for machining and component work; sheets and plates for panels, guards, trays and fabrication; fasteners for assembly and maintenance; pipes and tubes for fabrication, supports and utility requirements. Buyers should share grade, size, length, quantity, finish and certificate requirement.";
  }
  return `${industry.products.join(", ")} are commonly discussed for ${industry.name.toLowerCase()} requirements. SS 304 is often reviewed for general fabrication and clean industrial use, SS 316 for corrosion or coastal exposure, and other grades such as SS 202, SS 410, SS 430 or SS 310 where the application or drawing calls for them.`;
}

function industrySearches(industry) {
  if (industry.slug === "automobile-auto-components") {
    return ["Stainless steel suppliers for automobile industries", "SS rod suppliers for auto components Chennai", "SS bar stockist Chennai", "Stainless steel fasteners for auto component suppliers", "SS 304 sheet suppliers Sriperumbudur", "Stainless steel suppliers Oragadam", "SS rods Hosur auto industry", "Stainless steel suppliers Ambattur"];
  }
  const base = industry.name.replace(/ and /gi, " ").replace(/,/g, "");
  return [
    `Stainless steel suppliers for ${base}`,
    `SS 304 suppliers for ${base}`,
    `SS 316 suppliers for ${base}`,
    `${industry.products[0]} suppliers for ${base}`,
    `${industry.products[1] || "Stainless steel material"} enquiries Chennai`,
    `Stainless steel suppliers for ${base} Tamil Nadu`,
    `${industry.grades[0]} material for ${base}`,
    `Bharat Metals ${base} stainless steel enquiries`
  ];
}

function gradeFormSearches(grade, form) {
  return [
    `${grade.name} ${form.short.toLowerCase()} suppliers in Chennai`,
    `${grade.name} ${form.short.toLowerCase()} dealers Chennai`,
    `${grade.name} ${form.short.toLowerCase()} suppliers Tamil Nadu`,
    `${grade.name} ${form.short.toLowerCase()} enquiries Coimbatore`,
    `${grade.name} ${form.short.toLowerCase()} suppliers Hosur`,
    `${grade.name} ${form.short.toLowerCase()} with MTC`
  ];
}

function cityProductSearches(city, form) {
  return [
    `${form.name} suppliers in ${city.name}`,
    `${form.short} dealers in ${city.name}`,
    `SS 304 ${form.short.toLowerCase()} suppliers ${city.name}`,
    `SS 316 ${form.short.toLowerCase()} enquiries ${city.name}`,
    `${form.short} dispatch from Chennai to ${city.name}`,
    `Stainless steel ${form.short.toLowerCase()} suppliers near ${city.name}`
  ];
}

function gradeCitySearches(grade, city) {
  return [
    `${grade.name} suppliers in ${city.name}`,
    `${grade.name} pipe suppliers ${city.name}`,
    `${grade.name} sheet suppliers ${city.name}`,
    `${grade.name} plate dealers ${city.name}`,
    `${grade.name} material dispatch from Chennai to ${city.name}`,
    `${grade.name} stainless steel enquiries ${city.name}`
  ];
}

function productFaq(form) {
  const short = form.short.toLowerCase();
  return [
    {
      q: `Which stainless steel grades are commonly requested for ${short}?`,
      a: `Common ${short} enquiries include SS 202, SS 304 and SS 316, with SS 304L, SS 316L, SS 310, SS 410, SS 420 and SS 430 reviewed when the requirement suits those grades.`
    },
    {
      q: `Do you supply SS 304 and SS 316 ${short} in Chennai?`,
      a: `Bharat Metals can review SS 304 and SS 316 ${short} requirements from Chennai based on size, quantity, finish, documentation and dispatch needs.`
    },
    {
      q: `What details are needed for a ${short} quote?`,
      a: `Send grade, ${buyerSpec(form)}, quantity, finish where relevant, delivery location, certificate requirement and required date.`
    },
    {
      q: `Can MTC or mill certificate be discussed for ${short}?`,
      a: `MTC, mill certificate and third party inspection can be discussed for applicable stainless steel ${short} supplies.`
    },
    {
      q: `Do you supply ${short} to Coimbatore, Hosur, Trichy and Pondicherry?`,
      a: `Yes. Bharat Metals can review dispatch or transport booking for these locations from Chennai after availability, quantity and packing details are clear.`
    },
    {
      q: `Which uses are common for ${form.name.toLowerCase()}?`,
      a: `${form.name} are commonly discussed for ${form.uses.join(", ")} depending on grade, finish and application.`
    },
    {
      q: `Can finish or processing requirements be included for ${short}?`,
      a: `Yes. Include relevant service needs such as ${servicesFor(form).slice(0, 5).join(", ")} in the RFQ so they can be reviewed with the material requirement.`
    }
  ];
}

function gradeFaq(grade) {
  return [
    {
      q: `What is ${grade.name} commonly used for?`,
      a: `${grade.name} is ${grade.summary}. Buyers should confirm application, exposure and fabrication requirements before finalizing grade selection.`
    },
    {
      q: `Which ${grade.name} forms can Bharat Metals supply?`,
      a: `${grade.name} enquiries can be reviewed for pipes, tubes, sheets, plates, coils, rods, bars, angles, flats, channels, flanges, fittings and other forms.`
    },
    {
      q: `Do you supply ${grade.name} sheets, pipes and rods in Chennai?`,
      a: `Bharat Metals can review ${grade.name} sheets, pipes, rods and other forms from Chennai based on size, quantity and current availability.`
    },
    {
      q: `Which industries commonly ask for ${grade.name}?`,
      a: `Common buyer groups include fabricators, engineering companies, contractors, commercial kitchen fabricators, machine shops, traders and project buyers.`
    },
    {
      q: `Can ${grade.name} be supplied with MTC or mill certificate?`,
      a: `Certificate requirements can be discussed for applicable ${grade.name} material. Send the certificate need at RFQ stage.`
    },
    {
      q: `What details are needed for a ${grade.name} quote?`,
      a: `Send form, size, thickness or diameter, finish, quantity, delivery location, packing and certificate requirements.`
    },
    {
      q: `Can ${grade.name} enquiries be reviewed for Tamil Nadu cities?`,
      a: `Yes. Chennai-based dispatch and transport booking can be discussed for Tamil Nadu and nearby South India locations after order details are clear.`
    }
  ];
}

function cityFaq(city) {
  const exportText =
    city.region === "Nearby export"
      ? `Nearby export enquiries for ${city.name} can be reviewed from Chennai with packing, quantity and documentation details.`
      : `Dispatch, door delivery or transport booking for ${city.name} can be discussed from Chennai after product details are clear.`;
  return [
    {
      q: `Is Bharat Metals a stainless steel supplier for ${city.name}?`,
      a: `Bharat Metals is based in Chennai and can review stainless steel enquiries for ${city.name} depending on product availability, quantity and logistics.`
    },
    {
      q: `Which stainless steel products are commonly required by ${city.name} buyers?`,
      a: `Common ${city.name} enquiries include ${city.products.join(", ")}.`
    },
    {
      q: `Which grades are commonly discussed for ${city.name}?`,
      a: `Common grades for ${city.name} enquiries include ${city.grades.join(", ")} based on application, exposure and buyer specification.`
    },
    {
      q: `Can Bharat Metals support ${city.name} industries and contractors?`,
      a: `${city.name} has ${city.profile}. Bharat Metals helps buyers describe the material clearly before quotation review.`
    },
    {
      q: `What should ${city.name} buyers send for quotation?`,
      a: `Send product form, grade, size, finish, quantity, delivery location, certificate need and expected dispatch date.`
    },
    {
      q: `Can logistics be discussed for ${city.name}?`,
      a: exportText
    }
  ];
}

function industryFaq(industry) {
  return [
    {
      q: `Which stainless steel products are used by ${industry.name} buyers?`,
      a: `${industry.name} enquiries commonly include ${industry.products.join(", ")}.`
    },
    {
      q: `Which grades are commonly discussed for ${industry.name}?`,
      a: `Common grades include ${industry.grades.join(", ")} depending on application, exposure and buyer specification.`
    },
    {
      q: `Can Bharat Metals support ${industry.name} buyers around Chennai and Tamil Nadu?`,
      a: `Yes. Requirements can be reviewed from Chennai for local buyers and nearby South India locations based on availability and logistics.`
    },
    {
      q: `What should ${industry.name} buyers include in an RFQ?`,
      a: `Send product form, grade, size, quantity, finish, drawing or sample details if available, certificate needs and delivery location.`
    },
    {
      q: `Can processing or packing be discussed for ${industry.name}?`,
      a: `Cutting, polishing, PVC coating, packing, transport booking and inspection needs can be discussed where applicable.`
    },
    {
      q: `Are SS 304 and SS 316 relevant for ${industry.name}?`,
      a: `SS 304 and SS 316 are commonly discussed grades for many industrial and fabrication requirements, but suitability depends on exposure and specification.`
    }
  ];
}

function materialFaq(material) {
  const title = materialNames[material];
  const items = secondaryMaterials[material];
  return [
    {
      q: `Which ${material} products does Bharat Metals supply?`,
      a: `Bharat Metals can review ${title.toLowerCase()} enquiries for ${items.join(", ")}.`
    },
    {
      q: `Do you supply ${material} materials in Chennai?`,
      a: `${title} requirements can be reviewed from Chennai based on form, size, grade/specification, quantity and current stock/procurement cycle.`
    },
    {
      q: `What details are needed for a ${material} quote?`,
      a: `Send form, grade or specification if known, size, thickness or diameter, quantity, delivery location and required date.`
    },
    {
      q: `Can ${material} requirements be supplied to Tamil Nadu cities?`,
      a: `Tamil Nadu enquiries can be reviewed from Chennai once product details, quantity and dispatch expectations are clear.`
    },
    {
      q: `Is ${material} availability based on size, form and quantity?`,
      a: `Yes. Availability depends on size, grade/specification, form, quantity and the current stock/procurement cycle.`
    },
    {
      q: `Can traders and fabricators send ${material} enquiries?`,
      a: `Yes. Traders, fabricators, machine shops, repair teams and project buyers can send clear requirements for quotation support.`
    }
  ];
}

function materialItemFaq(material, item) {
  const title = materialNames[material];
  return [
    {
      q: `Can Bharat Metals quote ${title} ${item.toLowerCase()} in Chennai?`,
      a: `Yes. ${title} ${item.toLowerCase()} enquiries can be reviewed from Chennai based on size, specification, quantity and delivery location.`
    },
    {
      q: `What details are needed for ${title} ${item.toLowerCase()}?`,
      a: `Send size, thickness or diameter, grade/specification if known, quantity, delivery location and required date.`
    },
    {
      q: `Can ${title} ${item.toLowerCase()} be supplied to Tamil Nadu buyers?`,
      a: `Tamil Nadu supply and dispatch can be discussed once availability, quantity and packing details are clear.`
    },
    {
      q: `Who commonly asks for ${title} ${item.toLowerCase()}?`,
      a: `Common buyers include fabricators, traders, engineering workshops, repair teams and commercial procurement teams.`
    },
    {
      q: `Is quotation subject to current availability?`,
      a: `Yes. Availability depends on size, form, specification, quantity and the current stock/procurement cycle.`
    }
  ];
}

function gradeFormFaq(grade, form) {
  const subject = `${grade.name} ${form.short}`;
  return [
    {
      q: `Can Bharat Metals quote ${subject} in Chennai?`,
      a: `Bharat Metals can review ${subject} enquiries from Chennai based on size, finish, quantity, documentation and dispatch needs.`
    },
    {
      q: `What details are needed for ${subject}?`,
      a: `Send ${buyerSpec(form)}, quantity, finish where relevant, delivery location and certificate requirement.`
    },
    {
      q: `Where is ${subject} commonly used?`,
      a: `${subject} is commonly discussed for ${form.uses.join(", ")} depending on application suitability.`
    },
    {
      q: `Can ${subject} be supplied outside Chennai?`,
      a: `Tamil Nadu and nearby South India dispatch can be discussed after availability, quantity and packing details are clear.`
    },
    {
      q: `Can MTC or mill certificate be discussed for ${subject}?`,
      a: `Certificate needs can be reviewed for applicable ${subject} supplies when requested at quotation stage.`
    }
  ];
}

function cityProductFaq(city, form) {
  const subject = `${form.name} in ${city.name}`;
  return [
    {
      q: `Can Bharat Metals support ${subject}?`,
      a: `Yes. Bharat Metals can review ${form.short.toLowerCase()} enquiries for ${city.name} from Chennai based on availability and logistics.`
    },
    {
      q: `Which grades are common for ${city.name} ${form.short.toLowerCase()} enquiries?`,
      a: `Common grades include ${city.grades.join(", ")} depending on application and buyer specification.`
    },
    {
      q: `What details should ${city.name} buyers send?`,
      a: `Send grade, ${buyerSpec(form)}, quantity, finish where relevant, delivery location and certificate needs.`
    },
    {
      q: `Can transport booking be discussed for ${city.name}?`,
      a: `Transport booking, door delivery or courier for small items can be discussed after order details are clear.`
    },
    {
      q: `Which buyers in ${city.name} may need ${form.short.toLowerCase()}?`,
      a: `${city.name} has ${city.profile}, so enquiries may come from fabricators, industries, contractors, workshops and traders.`
    }
  ];
}

function gradeCityFaq(grade, city) {
  return [
    {
      q: `Can Bharat Metals review ${grade.name} enquiries for ${city.name}?`,
      a: `Yes. ${grade.name} enquiries for ${city.name} can be reviewed from Chennai based on form, size, quantity and logistics.`
    },
    {
      q: `Which ${grade.name} forms are common for ${city.name}?`,
      a: `${grade.name} can be discussed in forms such as ${city.products.join(", ")} depending on availability.`
    },
    {
      q: `Why do ${city.name} buyers ask for ${grade.name}?`,
      a: `${grade.name} is ${grade.summary}. Buyers should confirm exposure, fabrication and specification needs.`
    },
    {
      q: `What RFQ details are needed for ${grade.name} in ${city.name}?`,
      a: `Send product form, grade, size, quantity, finish, certificate requirement and delivery location.`
    },
    {
      q: `Can certificates be discussed for ${grade.name} ${city.name} enquiries?`,
      a: `MTC, mill certificate and inspection support can be discussed for applicable stainless steel supplies.`
    }
  ];
}

function coreFaq(slug, h1) {
  if (slug === "about-us/") {
    return [
      { q: "Is Bharat Metals a stainless steel supplier in Chennai?", a: "Yes. Bharat Metals is a Chennai-based stainless steel dealer, stockist, supplier and wholesaler serving practical stainless steel enquiries from buyers in Chennai, Tamil Nadu and nearby markets." },
      { q: "Since when has Bharat Metals been operating?", a: "Bharat Metals has been associated with the Chennai stainless steel supply market since 1986." },
      { q: "Which stainless steel grades does Bharat Metals supply?", a: "Buyers commonly enquire for SS 202, SS 304, SS 304L, SS 310, SS 316, SS 316L, SS 410, SS 420 and SS 430 depending on product form, size and application." },
      { q: "Which product forms can buyers enquire for?", a: "Enquiries can include stainless steel pipes, tubes, sheets, plates, coils, rods, bars, angles, flats, channels, flanges, fittings, fasteners, wire mesh and perforated sheets." },
      { q: "Does Bharat Metals supply aluminium, brass and copper also?", a: "Yes. Bharat Metals also supplies aluminium, brass and copper products such as sheets, plates, pipes, rods, bars, flats, tubes and related commercial forms." },
      { q: "Does Bharat Metals manufacture stainless steel?", a: "No. Bharat Metals uses dealer, stockist, supplier and wholesaler language and does not claim manufacturer status." },
      { q: "Which regions does Bharat Metals support?", a: "Bharat Metals is Chennai-based and reviews enquiries for Chennai, Tamil Nadu, nearby South India markets, Andaman and Nicobar Islands, Sri Lanka and Maldives based on requirement and logistics feasibility." },
      { q: "What details should buyers send for a quotation?", a: "Buyers should send product form, grade, size, thickness or diameter, finish, quantity, delivery location, certificate requirement and expected timeline." },
      { q: "Can MTC or mill certificate be discussed?", a: "MTC, mill certificate and third party inspection can be discussed for applicable materials when the buyer mentions the need at RFQ stage." },
      { q: "Can transport or delivery be discussed?", a: "Local delivery, transport booking, door delivery discussion, courier for small items and export packing can be reviewed based on material, quantity and location." }
    ];
  }
  if (slug === "mission-vision/") {
    return [
      { q: "What is Bharat Metals' mission?", a: "The mission is to support stainless steel buyers with clear, practical and responsive supply communication before quotation." },
      { q: "What is Bharat Metals' vision?", a: "The vision is to remain a trusted Chennai stainless steel supply source for Tamil Nadu and nearby South India buyers while keeping RFQ communication simple and buyer-friendly." },
      { q: "Why does Bharat Metals ask for detailed RFQ information?", a: "Grade, form, size, finish, quantity, certificate need and delivery location help Bharat Metals review availability and dispatch expectations without confusion." },
      { q: "Does the mission include manufacturer claims?", a: "No. Bharat Metals positions itself as a dealer, stockist, supplier and wholesaler, not as a manufacturer." },
      { q: "Which buyers does the mission support?", a: "Fabricators, industries, traders, contractors, project buyers, repair teams and commercial procurement teams can share clear stainless steel requirements." },
      { q: "Which grades are central to Bharat Metals' product focus?", a: "SS 202, SS 304 and SS 316 are commonly discussed, with SS 304L, SS 310, SS 316L, SS 410, SS 420 and SS 430 reviewed where suitable." },
      { q: "Can buyers send one RFQ covering multiple products?", a: "Yes. A buyer can send one RFQ covering pipes, sheets, plates, rods, bars, fittings, flanges or other forms if details are clear." },
      { q: "How does Bharat Metals approach long-term buyer relationships?", a: "The focus is on clear communication, honest positioning, practical grade discussion and dependable follow-through for repeat enquiry conversations." }
    ];
  }
  if (slug === "products/") {
    return [
      { q: "Which stainless steel product forms are listed in the Bharat Metals portfolio?", a: "The portfolio includes pipes, tubes, sheets, plates, coils, rods, bars, angles, flats, channels, flanges, fittings, fasteners, wire mesh and perforated sheets." },
      { q: "Can buyers browse products by grade?", a: "Yes. Buyers can open grade pages for SS 202, SS 304, SS 304L, SS 310, SS 316, SS 316L, SS 410, SS 420 and SS 430." },
      { q: "Does Bharat Metals also supply aluminium, brass and copper?", a: "Yes. Bharat Metals also supplies aluminium, brass and copper product forms for commercial, fabrication, engineering, repair and trading requirements." },
      { q: "What details help with product quotation?", a: "Product form, grade, size, finish, quantity, certificate need and delivery location are the most useful details for quotation review." },
      { q: "Are all product cards linked to detailed pages?", a: "Yes. Product cards link to detailed pages where buyers can review form-specific RFQ guidance and related grade pages." },
      { q: "Can Jindal make enquiries be mentioned?", a: "Buyers can mention a make preference such as Jindal make pipes as a requirement preference, while keeping it as a buyer preference only." },
      { q: "Which buyers use the product portfolio page?", a: "Fabricators, traders, contractors, industrial buyers, commercial kitchen fabricators, engineering companies and project teams can use it to shortlist material forms." },
      { q: "Can product availability change by size and quantity?", a: "Yes. Availability depends on form, grade, size, finish, quantity and current stock or sourceability." },
      { q: "Can certificates be discussed for product enquiries?", a: "MTC, mill certificate and third party inspection can be discussed for applicable product enquiries at RFQ stage." }
    ];
  }
  if (slug === "stainless-steel/") {
    return [
      { q: "Is stainless steel the main focus of Bharat Metals?", a: "Yes. Stainless steel remains the core supply focus, especially for Chennai, Tamil Nadu and nearby South India buyer requirements." },
      { q: "Which stainless steel grades are commonly discussed?", a: "Common grades include SS 202, SS 304, SS 304L, SS 310, SS 316, SS 316L, SS 410, SS 420 and SS 430." },
      { q: "Which stainless steel product forms can buyers browse?", a: "Buyers can browse pipes, tubes, sheets, plates, coils, rods, bars, angles, flats, channels, flanges, fittings, fasteners, wire mesh and perforated sheets." },
      { q: "Can SS 304 and SS 316 be compared for enquiries?", a: "Yes. SS 304 and SS 316 are often compared by corrosion exposure, hygiene need, finish, application and project specification." },
      { q: "What finish options should buyers mention?", a: "Buyers may mention 2B, No. 1, BA, mirror, matt, hairline, brush, satin, PVC coated, polished pipe or decorative stainless steel requirements where applicable." },
      { q: "Can Bharat Metals support city and industry enquiries?", a: "Yes. The stainless steel hub links buyers to city pages, industry pages, grade pages and product form pages for clearer RFQ discussion." },
      { q: "Does Bharat Metals provide engineering design advice?", a: "No. Technical suitability should be checked against project specifications, standards and engineering requirements." },
      { q: "What should a stainless steel RFQ include?", a: "Send form, grade, size, thickness or schedule, finish, quantity, certificate requirement and delivery location." },
      { q: "Can stainless steel be supplied outside Chennai?", a: "Tamil Nadu, nearby South India, Andaman and nearby export enquiries can be reviewed based on material, quantity, packing and logistics." },
      { q: "Does Bharat Metals claim to manufacture stainless steel?", a: "No. Bharat Metals is positioned as a dealer, stockist, supplier and wholesaler." }
    ];
  }
  if (slug === "locations-we-serve/") {
    return [
      { q: "Does Bharat Metals have offices outside Chennai?", a: "No separate city office claim is made. Enquiries for other cities are reviewed from Chennai based on availability, quantity and logistics feasibility." },
      { q: "Which Tamil Nadu cities are commonly supported?", a: "Common location-led enquiries include Chennai, Coimbatore, Hosur, Trichy, Madurai, Salem, Tiruppur, Tuticorin, Tirunelveli and nearby industrial belts." },
      { q: "Can Bharat Metals discuss Chennai industrial-area enquiries?", a: "Yes. Buyers from Ambattur, Guindy, Sriperumbudur, Oragadam, Manali, Ennore and other Chennai-area markets can send detailed requirements." },
      { q: "Can Pondicherry, Sricity, Tada, Renigunta and Tirupati enquiries be reviewed?", a: "Yes. These nearby markets can be reviewed from Chennai based on product form, quantity, packing and transport feasibility." },
      { q: "Can Kerala and Karnataka enquiries be discussed?", a: "Nearby South India enquiries from Kerala and Karnataka can be reviewed when size, grade, quantity and dispatch details are clear." },
      { q: "Can Andaman and Nicobar enquiries be reviewed?", a: "Yes. Island enquiries can be discussed with packing, transport, documentation and product details." },
      { q: "Can Sri Lanka and Maldives export enquiries be reviewed?", a: "Nearby export enquiries can be reviewed carefully based on product, quantity, packing, documentation and logistics feasibility." },
      { q: "What should location-based RFQs include?", a: "Include product form, grade, size, quantity, delivery city, unloading or transport expectations and required date." },
      { q: "Are all location cards clickable?", a: "Yes. The location page links to detailed city and region pages for buyer-focused supply guidance." }
    ];
  }
  if (slug === "industries-we-serve/") {
    return [
      { q: "Which industries does Bharat Metals support?", a: "Bharat Metals supports enquiries from fabrication, railing, automobile, commercial kitchen, food processing, pharma, engineering, construction, marine, water treatment, textile and other industrial buyers." },
      { q: "Do different industries need different stainless steel forms?", a: "Yes. For example, commercial kitchens often discuss sheets and tubes, machine shops discuss rods and bars, and process industries discuss pipes, fittings and plates." },
      { q: "Which grades are common across industries?", a: "SS 202, SS 304 and SS 316 are common, with SS 304L, SS 310, SS 316L, SS 410, SS 420 and SS 430 reviewed by application." },
      { q: "Can industry buyers ask for MTC or mill certificate?", a: "Yes. Documentation requirements should be mentioned in the first RFQ so they can be reviewed with the material." },
      { q: "Are the industry cards linked to detailed pages?", a: "Yes. Each industry card links to a detailed page with product forms, grades, RFQ notes and FAQs." },
      { q: "Can Bharat Metals support industries outside Chennai?", a: "Tamil Nadu and nearby South India industry enquiries can be reviewed from Chennai based on availability and logistics." },
      { q: "What should an industrial buyer include in an RFQ?", a: "Send product form, grade, size, quantity, finish, drawing or sample reference, certificate need and delivery location." },
      { q: "Does Bharat Metals replace engineering material selection advice?", a: "No. Grade suitability should be checked by the buyer, project engineer or specification authority." },
      { q: "Can one RFQ cover multiple industry product forms?", a: "Yes. Buyers can send one consolidated RFQ for sheets, pipes, rods, fittings, fasteners or other products if each line item is clear." }
    ];
  }
  if (slug === "request-quote/") {
    return [
      { q: "What is the fastest way to request a stainless steel quotation?", a: "Send product form, grade, size, quantity, finish, delivery location and certificate requirement by WhatsApp or email." },
      { q: "Which product forms can be included in one RFQ?", a: "A single RFQ can include pipes, tubes, sheets, plates, coils, rods, bars, angles, flats, flanges, fittings, fasteners, wire mesh or perforated sheets if each item is clear." },
      { q: "What details are needed for pipe and tube enquiries?", a: "Mention grade, welded or seamless preference, outside diameter, schedule or wall thickness, length, finish and quantity." },
      { q: "What details are needed for sheet and plate enquiries?", a: "Mention grade, thickness, sheet or plate size, finish, PVC coating requirement, quantity and certificate need." },
      { q: "Can I send a photo or drawing with the RFQ?", a: "Yes. Photos, drawings or sample references can help clarify size, finish, hole pattern, bend, drilling and processing expectations." },
      { q: "Should I mention MTC or mill certificate in the first message?", a: "Yes. Mention certificate needs at RFQ stage so documentation can be reviewed with the material." },
      { q: "Can transport booking be discussed?", a: "Transport booking, door delivery, courier for small items and export packing can be discussed based on location, quantity and packing suitability." },
      { q: "Can aluminium, brass or copper be included in an RFQ?", a: "Yes. Aluminium, brass and copper requirements can be sent with form, size, quantity and delivery location." },
      { q: "Which payment modes are supported?", a: "UPI, Bank Transfer, Cheque and Cash are listed payment modes." },
      { q: "What are Bharat Metals working hours?", a: "Working hours are 10:00 AM to 6:00 PM, with Sunday as the weekly holiday." }
    ];
  }
  if (slug === "contact-us/" || slug === "contacts-us/") {
    return [
      { q: "How can I call Bharat Metals?", a: `Call ${site.phone} for stainless steel enquiries during working hours.` },
      { q: "Can I send a WhatsApp enquiry?", a: "Yes. Send product form, grade, size, quantity, finish and delivery location through WhatsApp." },
      { q: "Which email should I use for RFQ?", a: `${site.email} is the primary email for Bharat Metals enquiries, and ${site.secondaryEmail} is also listed for contact.` },
      { q: "Where is Bharat Metals located?", a: site.addressLines.join(" ") },
      { q: "Can I open the Google Maps profile?", a: "Yes. The contact page links to the Bharat Metals Google Maps profile for location reference." },
      { q: "What details should I keep ready before calling?", a: "Keep product form, grade, size, quantity, finish, delivery location and certificate needs ready." },
      { q: "What are the working hours?", a: "Working hours are 10:00 AM to 6:00 PM, and Sunday is the weekly holiday." },
      { q: "Which payment modes are listed?", a: "UPI, Bank Transfer, Cheque and Cash are listed payment modes." }
    ];
  }
  if (slug === "technical-data/") {
    return [
      { q: "Is the technical data page engineering advice?", a: "No. Technical data should be checked against project specifications, standards and engineering requirements." },
      { q: "Which grades are covered in the technical guide?", a: "The guide covers SS 202, SS 304, SS 304L, SS 310, SS 316, SS 316L, SS 410, SS 420 and SS 430 at a buyer-friendly level." },
      { q: "How should buyers use grade guidance?", a: "Use it to frame a clearer RFQ, then confirm suitability with the drawing, project engineer or specification authority." },
      { q: "Which finishes are explained?", a: "The page explains how buyers can mention 2B, No. 1, BA, mirror, matt, hairline, brush, satin, PVC coated and polished requirements." },
      { q: "Can MTC or mill certificate be requested?", a: "Yes. MTC, mill certificate and third party inspection should be mentioned at RFQ stage where applicable." },
      { q: "Does Bharat Metals publish exact chemical composition values?", a: "The core technical page gives practical teaser guidance and links to safer detailed reference pages instead of overclaiming values." },
      { q: "What application details help grade selection?", a: "Exposure, hygiene need, temperature, fabrication method, corrosion environment, finish and certificate requirement all help frame the discussion." },
      { q: "Can technical terms be sent by WhatsApp?", a: "Yes. Buyers can send grade, standard, finish, schedule, thickness, drawing notes and certificate requirements by WhatsApp or email." },
      { q: "Can Bharat Metals compare SS 304 and SS 316?", a: "Bharat Metals can help buyers discuss common commercial differences, but final suitability should follow project specifications." }
    ];
  }
  if (slug === "blog/") {
    return [
      { q: "What does the Bharat Metals blog cover?", a: "The blog covers practical buyer guides for stainless steel grades, product forms, finishes, certificates, RFQs, locations and industries." },
      { q: "Are the blog articles written for stainless steel buyers?", a: "Yes. Articles are written for fabricators, traders, contractors, industrial buyers and procurement teams preparing clearer RFQs." },
      { q: "Can blog guides replace technical specifications?", a: "No. Blog guides are practical buying notes and should be checked against project specifications and engineering requirements." },
      { q: "Which grade guides are available?", a: "The blog includes guides such as SS 304 vs SS 316 and SS 202 vs SS 304 for railing and fabrication work." },
      { q: "Which product form guides are available?", a: "Blog topics include welded versus seamless pipes, sheet finishes, stainless steel plates, perforated sheets and wire mesh." },
      { q: "Are RFQ and certificate topics covered?", a: "Yes. Articles explain fast quote details, MTC and mill certificate requests." },
      { q: "Are city and industry buying guides included?", a: "Yes. The blog includes Tamil Nadu, Sricity-Tada-Tirupati and industry-specific buying notes." }
    ];
  }
  return [
    { q: `How can buyers use the ${h1} page?`, a: `Use the ${h1} page to shortlist relevant products, grades, locations and RFQ details before contacting Bharat Metals.` },
    { q: "Can Bharat Metals discuss documentation needs?", a: "MTC, mill certificate and inspection support can be discussed for applicable stainless steel supplies." },
    { q: "What details are needed for a quotation?", a: "Send product form, grade, size, quantity, finish, delivery location and required date." },
    { q: "Can Chennai dispatch and transport be discussed?", a: "Yes. Delivery and transport options can be reviewed after material availability and quantity are clear." },
    { q: "Is the content a substitute for engineering design advice?", a: "No. Critical applications should be checked with the project engineer or specification authority." }
  ];
}

function addGeneratedPage({ slug, type, title, description, h1, intro, eyebrow, image, imageAlt, breadcrumbs = [], body, faq, faqIntro, canonicalSlug, canonicalUrl, robots }) {
  addPage({
    slug,
    type,
    title,
    description,
    canonicalSlug,
    canonicalUrl,
    robots,
    h1,
    intro,
    eyebrow,
    image,
    imageAlt,
    breadcrumbs: [...breadcrumbs, { name: h1, slug }],
    body: body + faqHtml(faq, faqIntro),
    faq
  });
}

function buildCorePages() {
  const gradeCardLinks = compactCardGrid(grades, (grade) => `${grade.slug}/`, (grade) => grade.name);
  const primaryCityNames = ["Chennai", "Ambattur", "Guindy", "Sriperumbudur", "Oragadam", "Coimbatore", "Hosur", "Trichy", "Madurai", "Salem", "Tiruppur", "Pondicherry", "Sricity", "Tada", "Renigunta", "Tirupati"];
  const primaryCityCards = compactCardGrid(primaryCityNames.map(cityByName), citySlug, (city) => city.name);
  const byRegion = (region) => locations.filter((city) => city.region === region);
  const chennaiAreas = ["Chennai", "George Town Chennai", "Parrys Chennai", "Mookernallamuthu Street Chennai", "Armenian Street Chennai", "Ambattur", "Guindy", "Manali", "Ennore", "Sriperumbudur", "Oragadam", "Irungattukottai"].map(cityByName);

  addGeneratedPage({
    slug: "about-us/",
    type: "core",
    title: "About Bharat Metals | Stainless Steel Dealers in Chennai Since 1986",
    description: "Learn about Bharat Metals, a Chennai-based stainless steel stockist, supplier, dealer and wholesaler established in 1986, serving stainless steel buyers across Tamil Nadu and nearby South India markets.",
    h1: "About Bharat Metals",
    intro: "Bharat Metals is a Chennai-based stainless steel stockist, supplier, dealer and wholesaler established in 1986. From its Chennai market base, Bharat Metals supports enquiries for stainless steel pipes, tubes, sheets, plates, coils, rods, bars, angles, flats, flanges, fittings, fasteners, wire mesh and perforated sheets in commonly requested grades such as SS 202, SS 304, SS 304L, SS 310, SS 316, SS 316L, SS 410, SS 420 and SS 430. The company serves fabricators, traders, contractors, industrial buyers and project procurement teams across Chennai, Tamil Nadu and nearby South India markets.",
    eyebrow: "Company profile",
    image: "assets/images/photos/locations/chennai-industrial.webp",
    imageAlt: "Bharat Metals Chennai stainless steel stock and warehouse supply",
    breadcrumbs: [],
    body:
      proseSection("Chennai stainless steel market presence since 1986", [
        "Bharat Metals has been associated with Chennai's stainless steel supply market since 1986, supporting practical material enquiries from fabricators, contractors, traders, industrial buyers and project procurement teams. The business is built around understanding how buyers actually specify stainless steel: product form, grade, size, finish, quantity, documentation requirement and delivery location. Instead of treating every enquiry as a generic metal requirement, Bharat Metals focuses on matching the requested product form and grade with the application, timeline and dispatch requirement."
      ]) +
      proseSection("Stainless steel is our core strength", [
        "Stainless steel remains the main focus of Bharat Metals. Buyers regularly discuss SS 202, SS 304 and SS 316 requirements, along with SS 304L, SS 310, SS 316L, SS 410, SS 420 and SS 430 where the specification or application calls for it. Enquiries may include stainless steel pipes, welded pipes, seamless pipe requirements, polished pipes, tubes, sheets, plates, coils, rods, bars, angles, flats, channels, flanges, fittings, fasteners, wire mesh and perforated sheets.",
        "Bharat Metals helps buyers share the right RFQ details so availability, finish, certificate and dispatch expectations can be reviewed clearly. Grade selection depends on application, exposure, finish, fabrication method, certificate requirement and buyer specification. Bharat Metals does not replace engineering advice, but helps buyers communicate their grade and form requirement clearly for quotation."
      ]) +
      hubSection(
        "Product focus",
        "Products supplied for fabrication, industry and trade",
        "Use these product groups to open relevant pages and prepare a clearer stainless steel enquiry before calling or sending an RFQ.",
        linkedCardGrid([
          { title: "Pipes, Tubes and Fittings", href: "../stainless-steel-pipes/", text: "Stainless steel pipes, tubes and fittings are commonly discussed for utility lines, railings, equipment fabrication, commercial kitchens, food processing, pharma equipment, marine repair and maintenance. Buyers should mention welded or seamless preference, tube profile, fitting type, size, schedule, finish, grade, quantity and certificate requirement." },
          { title: "Sheets, Plates and Coils", href: "../stainless-steel-sheets/", text: "Sheets, plates and coils are requested for commercial kitchen work, panels, cladding, fabrication, base plates, machine parts, industrial repair and downstream processing. Useful RFQ details include thickness, sheet or plate size, finish, PVC coating need, cutting requirement, coil width, grade, quantity and delivery location." },
          { title: "Rods, Bars, Flats, Angles and Channels", href: "../stainless-steel-rods/", text: "Rods, bars, flats, angles and channels support machining, frames, supports, bracing, construction-related work, machine shops, automobile component work and general fabrication. Buyers should share diameter or section, width, thickness, leg size, channel size, length, grade, finish, quantity and application." },
          { title: "Fasteners, Wire Mesh and Perforated Sheets", href: "../stainless-steel-fasteners/", text: "Fasteners, wire mesh and perforated sheets are used for site installation, machinery, filters, guards, screens, panels and industrial protection. RFQs should mention bolt or nut type, mesh opening, wire diameter, hole pattern, pitch, sheet size, grade, quantity and certificate or packing requirements." }
        ])
      ) +
      hubSection("Grades", "Grades buyers commonly discuss", "Use these grade pages when the enquiry already mentions stainless steel grade or when the buyer wants a grade-specific quotation conversation.", gradeCardLinks) +
      proseSection("Serving Chennai, Tamil Nadu and nearby markets", [
        "Bharat Metals is Chennai-based and supports enquiries for Chennai industrial areas, Tamil Nadu cities and nearby South India procurement markets. Regular location-led enquiries may come from Chennai, Ambattur, Guindy, Sriperumbudur, Oragadam, Coimbatore, Hosur, Trichy, Madurai, Salem, Tiruppur, Cuddalore, Pondicherry, Sricity, Tada, Renigunta and Tirupati.",
        "Export enquiries for nearby markets such as Sri Lanka and Maldives can be reviewed based on product, quantity, packing, documentation and logistics feasibility. Bharat Metals discusses location support from Chennai based on availability, order size, packing and transport practicality."
      ]) +
      hubSection(
        "Service support",
        "Services and documentation support",
        "The following support items can be discussed based on material, product form, order quantity, processing suitability and documentation requirement.",
        infoCardGrid([
          { title: "Processing discussion", text: "Cutting, polishing, PVC coating, bending and drilling can be discussed where the material form, size and order quantity make the service suitable. Buyers should mention drawing, finish, tolerance and edge expectation early." },
          { title: "Packing and delivery", text: "Packing, local delivery, transport booking, door delivery discussion, courier for small items and export packing can be reviewed after the product, quantity, delivery location and handling requirement are clear." },
          { title: "Certificate support", text: "Material Test Certificate / MTC, mill certificate and third party inspection can be discussed for applicable stainless steel supplies when the buyer mentions the certificate requirement at RFQ stage." }
        ])
      ) +
      hubSection(
        "Buyer reasons",
        "Why buyers contact Bharat Metals",
        "Bharat Metals is built for practical stainless steel enquiry handling, not broad unsupported claims.",
        infoCardGrid([
          { title: "Established Chennai presence", text: "Established in 1986, Bharat Metals brings old Chennai market familiarity to modern stainless steel enquiry handling for buyers who need practical communication." },
          { title: "Stainless steel focused", text: "The business keeps stainless steel as the main conversation, with clear product form, grade, finish, quantity and documentation review." },
          { title: "Wide form coverage", text: "Buyers can discuss pipes, tubes, sheets, plates, coils, rods, bars, angles, flats, flanges, fittings and more in one RFQ." },
          { title: "Practical RFQ guidance", text: "The team encourages clear details before quotation so buyers avoid vague pricing conversations and repeated clarifications." },
          { title: "Tamil Nadu dispatch support", text: "Chennai-led enquiries for Tamil Nadu and nearby South India markets can be reviewed based on material availability and logistics." },
          { title: "Documentation discussion", text: "MTC, mill certificate and inspection requirements can be discussed where applicable, before the buyer finalizes the order." }
        ])
      ) +
      searchSection("Popular Bharat Metals enquiry searches", "Use these chips to describe company, product, grade, city and industry context before sending an RFQ.", [
        "Stainless steel dealers in Chennai since 1986",
        "Stainless steel suppliers in Chennai",
        "SS 304 pipe suppliers in Chennai",
        "SS 316 plate suppliers in Tamil Nadu",
        "Stainless steel sheet dealers Chennai",
        "Stainless steel rod stockist Chennai",
        "Stainless steel suppliers for fabricators",
        "Stainless steel suppliers for commercial kitchen equipment",
        "Stainless steel suppliers for Tamil Nadu industries",
        "Stainless steel suppliers in Coimbatore and Hosur"
      ]) +
      ctaBlock(),
    faqIntro: "Answers to common questions about Bharat Metals, stainless steel grades, product forms, service regions and quotation support.",
    faq: coreFaq("about-us/", "About Bharat Metals")
  });

  addGeneratedPage({
    slug: "mission-vision/",
    type: "core",
    title: "Mission and Vision | Bharat Metals Stainless Steel Suppliers Chennai",
    description: "Read the mission, vision and values of Bharat Metals, a Chennai stainless steel supplier focused on practical RFQ support, stainless steel grades, product forms and Tamil Nadu supply requirements.",
    h1: "Mission and Vision",
    intro: "Bharat Metals' mission and vision are built around practical stainless steel supply support for Chennai, Tamil Nadu and nearby markets. The company focuses on helping buyers communicate grade, form, size, finish, quantity, certificate and delivery details clearly so quotations can be reviewed without confusion. As a stainless steel dealer, stockist, supplier and wholesaler established in 1986, Bharat Metals aims to combine old Chennai market trust with modern enquiry-first communication for fabricators, industries, traders, contractors and project buyers.",
    eyebrow: "Company profile",
    image: "assets/images/photos/locations/chennai-industrial.webp",
    body:
      proseSection("Mission", [
        "Bharat Metals' mission is to support stainless steel buyers with clear, practical and responsive supply communication. Whether the enquiry is for SS 202 polished pipes, SS 304 sheets, SS 316 plates, stainless steel rods, bars, flats, angles, fittings, wire mesh or perforated sheets, the goal is to understand the buyer's exact requirement before quoting. The company encourages buyers to send product form, grade, size, quantity, finish, certificate requirement and delivery location so that availability and dispatch planning can be reviewed properly.",
        "The mission is also about honest positioning. Bharat Metals does not claim manufacturer status or unsupported certifications. It works as a Chennai stainless steel dealer, stockist, supplier and wholesaler, helping buyers translate practical material needs into clear RFQ lines that can be checked for availability, sourceability, processing suitability, packing and dispatch."
      ]) +
      proseSection("Vision", [
        "Bharat Metals' vision is to remain a trusted Chennai stainless steel supply source for Tamil Nadu and nearby South India buyers while keeping the enquiry process simple, transparent and buyer-friendly. The company aims to be remembered for stainless steel product knowledge, practical grade discussions, reliable communication and dispatch support for Chennai, Coimbatore, Hosur, Trichy, Madurai, Salem, Pondicherry, Sricity, Tada, Renigunta, Tirupati and other key procurement markets.",
        "As buyer behaviour moves toward faster WhatsApp, email and search-led RFQs, Bharat Metals wants its website and enquiry flow to help buyers send better information the first time. Clear product form, grade, size and finish details create better conversations for fabricators, traders, contractors and project buyers."
      ]) +
      hubSection("Values", "Values that guide enquiry handling", "These values keep the business focused on useful stainless steel communication instead of vague claims.", infoCardGrid([
        { title: "Clarity before quotation", text: "Bharat Metals prefers clear RFQs because stainless steel pricing and availability depend on grade, form, size, finish, quantity, certificate need and delivery location. Clarity reduces confusion for both buyer and supplier." },
        { title: "Stainless steel product focus", text: "The company keeps stainless steel at the centre of the conversation, especially pipes, tubes, sheets, plates, coils, rods, bars, angles, flats, flanges, fittings, fasteners, wire mesh and perforated sheets." },
        { title: "Honest business positioning", text: "Bharat Metals uses dealer, stockist, supplier and wholesaler language. It does not claim manufacturer status, special brand-dealership status or unsupported approvals." },
        { title: "Practical grade discussion", text: "Grade conversations are handled by application, exposure, finish, fabrication method and buyer specification. SS 202, SS 304 and SS 316 needs are discussed with practical limitations in mind." },
        { title: "Documentation awareness", text: "MTC, mill certificate and third party inspection requirements can affect sourcing and quotation. Buyers are encouraged to mention documentation needs at the first enquiry stage." },
        { title: "Long-term buyer relationships", text: "Repeat buyers value communication that is steady, clear and realistic. Bharat Metals aims to support fabricators, traders and industries with dependable enquiry follow-through." }
      ])) +
      proseSection("Our RFQ-first promise to buyers", [
        "Bharat Metals does not encourage vague quotes without product form, size, grade and quantity. A stainless steel requirement can change completely when a buyer moves from SS 304 to SS 316, from sheet to plate, from mill finish to mirror finish, or from local pickup to packed dispatch outside Chennai. The RFQ-first promise is to discuss the details that matter before treating the enquiry as ready for quotation.",
        "The company does not make manufacturer claims or unsupported promises. Buyers can send one RFQ covering multiple products, but each line should mention form, grade, size, finish, quantity, delivery location and certificate requirement where applicable. This keeps the quotation conversation practical and traceable."
      ]) +
      hubSection("Grade and product focus", "Grades and product forms in our daily conversations", "Bharat Metals regularly discusses these stainless steel grades and product forms for Chennai, Tamil Nadu and nearby South India buyers.", gradeCardLinks + compactCardGrid(forms.slice(0, 8), (form) => `${form.slug}/`, (form) => form.short)) +
      searchSection("Popular mission and RFQ searches", "These phrases reflect how buyers look for practical stainless steel enquiry support.", [
        "Bharat Metals mission and vision",
        "stainless steel suppliers in Chennai since 1986",
        "stainless steel RFQ support Chennai",
        "SS 304 suppliers Chennai",
        "SS 316 plate suppliers Tamil Nadu",
        "stainless steel stockist Chennai",
        "stainless steel wholesaler Chennai",
        "stainless steel dealers in Chennai",
        "stainless steel suppliers for Tamil Nadu industries",
        "Bharat Metals quotation support"
      ]) +
      ctaBlock(),
    faqIntro: "Answers to common questions about Bharat Metals' mission, RFQ-first approach, stainless steel focus and practical business positioning.",
    faq: coreFaq("mission-vision/", "Mission and Vision")
  });

  addGeneratedPage({
    slug: "products/",
    type: "core",
    title: "Product Portfolio | Bharat Metals Chennai Stainless Steel Suppliers",
    description: "Browse Bharat Metals stainless steel product forms, grades, aluminium, brass, copper and popular stainless steel searches.",
    h1: "Product Portfolio",
    intro: "The Bharat Metals product portfolio is built around stainless steel first, with clear pages for pipes, tubes, sheets, plates, coils, rods, bars, angles, flats, channels, flanges, fittings, fasteners, wire mesh and perforated sheets. Buyers can also browse grade-led pages for SS 202, SS 304, SS 304L, SS 310, SS 316, SS 316L, SS 410, SS 420 and SS 430. Bharat Metals also supplies aluminium, brass and copper product forms for commercial, fabrication, engineering, repair and trading enquiries from Chennai, Tamil Nadu and nearby markets.",
    eyebrow: "Product portfolio",
    image: stainlessMaterialImage,
    body:
      proseSection("Stainless steel product portfolio overview", [
        "Bharat Metals helps buyers shortlist stainless steel by product form before moving into size, finish, quantity and certificate details. A pipe enquiry is different from a tube enquiry; a sheet requirement is different from a plate or coil requirement; rods and bars need different size language from angles, flats and channels. The product portfolio page is therefore organized for RFQ clarity rather than as a broad all-metals catalogue.",
        "Fabricators, industrial buyers, traders, contractors and project teams can use this hub to move from general product browsing to specific pages. Each product page explains common applications, grade links, finish options, service support, city pages and what to send for quotation."
      ]) +
      hubSection("Stainless steel forms", "Stainless Steel Product Form Card Grid", "Open product pages by form, size, grade, finish and quotation requirement.", productImageCardGrid()) +
      hubSection("Browse by grade", "Stainless Steel Grades", "Use these grade pages when the RFQ already mentions SS 202, SS 304, SS 316 or another grade.", gradeCardLinks) +
      proseSection("Aluminium, brass and copper product sections", [
        "Bharat Metals also supplies aluminium sheets, plates, coils, pipes, flats, rods and bars for fabrication, panels, structures, engineering, repairs and trading. Buyers can mention size, thickness, alloy or specification if known, quantity and delivery location.",
        "Bharat Metals also supplies brass pipes, bush pipes, rods, bars and flats for machining, electrical, fittings, repair, fabrication and trading requirements. Copper tubes, flats, rods, bars and plates can be discussed for electrical, engineering, heat-transfer, repair, fabrication and trading uses."
      ]) +
      hubSection("Aluminium products", "Aluminium Products", "Browse aluminium product enquiry pages by form.", cardGrid(secondaryMaterials.aluminium, (item) => `aluminium-${slugify(item)}/`, (item) => `Aluminium ${item.toLowerCase()} enquiries for fabrication, panels, structures, engineering, repairs and trading.`)) +
      hubSection("Brass products", "Brass Products", "Browse brass product enquiry pages by form.", cardGrid(secondaryMaterials.brass, (item) => `brass-${slugify(item)}/`, (item) => `Brass ${item.toLowerCase()} enquiries for machining, electrical, fittings, repair, fabrication and trading.`)) +
      hubSection("Copper products", "Copper Products", "Browse copper product enquiry pages by form.", cardGrid(secondaryMaterials.copper, (item) => `copper-${slugify(item)}/`, (item) => `Copper ${item.toLowerCase()} enquiries for electrical, engineering, heat-transfer, repair, fabrication and trading.`)) +
      pageSection("Product comparison and enquiry guidance", "Compare product forms by how they are specified. Pipes and tubes need OD, schedule or wall thickness and length; sheets and plates need thickness, size, finish and PVC coating details; rods and bars need diameter or section and length; fittings and flanges need type, size, class or standard. Add grade, quantity, certificate requirement and delivery location to every RFQ.", dataTable(["Product group", "Common details to send", "Useful links"], [
        ["Pipes and tubes", "Grade, welded or seamless, OD, wall thickness or schedule, finish, length, quantity", "Open pipe and tube pages"],
        ["Sheets, plates and coils", "Grade, thickness, size, finish, PVC coating, coil width, cutting or slitting need", "Open sheet, plate and coil pages"],
        ["Rods, bars and sections", "Grade, diameter or section, length, finish, tolerance expectation and quantity", "Open rod, bar, flat, angle and channel pages"],
        ["Flanges, fittings and fasteners", "Grade, type, size, class, standard, thread or matching pipe details", "Open flange, fitting and fastener pages"]
      ])) +
      searchSection("Popular product portfolio searches", "Use these chips to describe product form, grade, city, make preference and RFQ context.", [
        "stainless steel product portfolio Chennai",
        "stainless steel pipes suppliers Chennai",
        "stainless steel sheets dealers Chennai",
        "SS 304 rods stockist Chennai",
        "SS 316 plates suppliers Tamil Nadu",
        "stainless steel flanges fittings Chennai",
        "stainless steel wire mesh suppliers",
        "stainless steel perforated sheets Chennai",
        "aluminium brass copper suppliers Chennai",
        "Jindal stainless steel pipe quotation Chennai"
      ]) +
      ctaBlock(),
    faqIntro: "Answers to common questions about stainless steel product forms, grades and related aluminium, brass and copper enquiries.",
    faq: coreFaq("products/", "Product Portfolio")
  });

  addGeneratedPage({
    slug: "stainless-steel/",
    type: "core",
    title: "Stainless Steel Product Forms and Grades | Bharat Metals Chennai",
    description: "Stainless steel products, grades, cities, industries and popular combinations from Bharat Metals in Chennai.",
    h1: "Stainless Steel Products",
    intro: "Bharat Metals is a stainless steel focused Chennai dealer, stockist, supplier and wholesaler established in 1986. Buyers use this hub to browse stainless steel grades, product forms, finish options, applications, city pages and industry pages before sending a clear RFQ. Common enquiries include stainless steel pipes, tubes, sheets, plates, coils, rods, bars, angles, flats, channels, flanges, fittings, fasteners, wire mesh and perforated sheets in grades such as SS 202, SS 304, SS 304L, SS 310, SS 316, SS 316L, SS 410, SS 420 and SS 430.",
    eyebrow: "Stainless steel",
    image: stainlessMaterialImage,
    body:
      proseSection("Stainless steel grades supplied", [
        "Buyers commonly discuss SS 202, SS 304 and SS 316 for fabrication, railing, commercial kitchen, industrial, coastal and general engineering requirements. SS 304L, SS 310, SS 316L, SS 410, SS 420 and SS 430 can be reviewed when the drawing, application, temperature, corrosion exposure, finish or buyer specification calls for them.",
        "Grade selection should be connected to application and exposure. SS 304 is widely discussed for general fabrication and clean industrial work, SS 316 for coastal, marine, chemical or higher corrosion exposure, SS 202 for suitable cost-sensitive work, and martensitic or ferritic grades for selected mechanical or sheet applications. Final suitability should follow project specifications and engineering requirements."
      ]) +
      hubSection("Grades", "Browse Stainless Steel by Grade", "Open grade-specific pages for buyer notes, product form links, city links and RFQ guidance.", gradeCardLinks) +
      hubSection("Product forms", "Browse Stainless Steel by Product Form", "Open product form pages for size, finish, application, grade and quotation guidance.", productImageCardGrid()) +
      pageSection("Common applications", "Stainless steel is discussed for fabrication, railing work, commercial kitchen equipment, food processing, pharma equipment, machine shops, automobile support, water treatment, marine repair, construction, interiors, ports, textile machinery and general maintenance. Each application changes the product form and grade conversation. A kitchen fabricator may focus on SS 304 sheets and tubes; a coastal buyer may compare SS 304 and SS 316; a machine shop may need rods, bars or plates with certificate discussion.", industryImageCardGrid(industries.slice(0, 8))) +
      pageSection("Finish and surface options", "Surface finish affects appearance, fabrication, cleaning, protection and quotation. Buyers may mention 2B Finish, No. 1 Finish, BA Finish, Mirror Finish, No. 8 Finish, Matt Finish, Hairline Finish, Brush Finish, Satin Finish, PVC Coated Sheets, Polished Pipes, Polished Rods, Polished Bars or Decorative Stainless Steel where applicable.", dataTable(["Finish or surface term", "Where buyers commonly discuss it"], [
        ["2B / BA / No. 1", "Sheets, coils and plates depending on grade and application"],
        ["Mirror / No. 8 / hairline / brush", "Visible architectural, interior and commercial kitchen work"],
        ["Polished pipes, rods and bars", "Railings, decorative work, fabrication, machining or clean finish needs"],
        ["PVC coated sheets", "Visible sheets needing temporary surface protection during fabrication"]
      ])) +
      hubSection("Cities", "City and industry enquiry support", "Open key city pages for Chennai-led stainless steel supply conversations.", primaryCityCards) +
      proseSection("How to send a stainless steel RFQ", [
        "A good stainless steel RFQ mentions product form, grade, size, thickness or schedule, diameter, length, finish, quantity, certificate requirement and delivery location. If the buyer has a make preference such as Jindal make pipes, it can be mentioned as a preference without implying special dealership status.",
        "For fast review, separate each line item clearly. Example: SS 304 welded pipe with OD and thickness, SS 316 plate with thickness and size, SS 202 polished pipe with gauge and finish, or SS 304 sheet with 2B or mirror finish. Add MTC, mill certificate, packing, transport or delivery needs where relevant."
      ]) +
      searchSection("Popular stainless steel hub searches", "Use these chips to describe grade, product, finish, location and application context before sending the RFQ.", [
        "stainless steel suppliers in Chennai",
        "stainless steel dealers in Chennai",
        "stainless steel stockist Chennai",
        "SS 304 pipe suppliers Chennai",
        "SS 316 plate suppliers Tamil Nadu",
        "stainless steel sheet dealers Chennai",
        "stainless steel rod stockist Chennai",
        "stainless steel suppliers Coimbatore",
        "stainless steel suppliers Hosur",
        "stainless steel suppliers Sricity Tada Tirupati"
      ]) +
      ctaBlock(),
    faqIntro: "Answers to common questions about stainless steel grades, product forms, finishes, city supply support and RFQ details.",
    faq: coreFaq("stainless-steel/", "Stainless Steel Products")
  });

  addGeneratedPage({
    slug: "industries-we-serve/",
    type: "core",
    title: "Industries We Serve | Bharat Metals Stainless Steel Chennai",
    description: "Industries served by Bharat Metals for stainless steel supply in Chennai, Tamil Nadu and nearby South India.",
    h1: "Industries We Serve",
    intro: "Bharat Metals supplies stainless steel materials for fabrication, engineering, commercial kitchen equipment, food processing, pharma equipment, automobile support, marine repair, construction, interiors, water treatment and other South India industries. Buyers usually approach with a product form, grade, size, finish, quantity and delivery location. Bharat Metals helps industry buyers review requirements for SS 202, SS 304, SS 316 and related grades across pipes, sheets, plates, coils, rods, bars, fasteners, fittings, wire mesh and perforated sheets.",
    eyebrow: "Industries",
    image: "assets/images/photos/industries/industrial-plant.webp",
    body:
      proseSection("Industries using stainless steel across Tamil Nadu and South India", [
        "Chennai and nearby industrial belts create many different stainless steel enquiries. Ambattur, Guindy, Sriperumbudur, Oragadam, Hosur, Coimbatore, Trichy, Madurai, Pondicherry, Sricity and Tada may each discuss different product forms, grades and dispatch expectations. Fabrication shops may ask for pipes, sheets, angles and flats; machine shops may ask for rods, bars and plates; commercial kitchen fabricators may focus on sheets, tubes and polished finishes.",
        "Different industries need different grades and documentation conversations. Food, pharma and dairy buyers often discuss SS 304, SS 316 and SS 316L with finish and hygiene notes. Marine and coastal buyers often compare SS 304 and SS 316. Automobile, pump, valve and engineering buyers may discuss rods, bars, fasteners and plates with certificate expectations."
      ]) +
      hubSection("Industry pages", "Browse All Industry Pages", "Every industry card opens a detailed page with products, grades, RFQ notes and FAQs.", industryImageCardGrid()) +
      pageSection("Common product demand by industry", "Use this table to frame an industry-led RFQ before calling or sending a WhatsApp enquiry.", dataTable(["Industry group", "Common products", "Common grades", "Common RFQ details"], [
        ["Commercial kitchens", "Sheets, tubes, pipes, plates", "SS 304, SS 316", "Finish, thickness, size, polishing, hygiene expectation"],
        ["Automobile and engineering", "Rods, bars, sheets, fasteners, plates", "SS 304, SS 316, SS 410", "Size, length, quantity, tolerance, certificate"],
        ["Food, pharma and dairy", "Pipes, sheets, fittings, wire mesh", "SS 304, SS 316, SS 316L", "Finish, certificate, hygiene requirement, packing"],
        ["Marine and coastal repair", "Pipes, plates, fasteners, flanges", "SS 316, SS 316L, SS 304", "Corrosion exposure, packing, certificate, location"],
        ["Construction and interiors", "Angles, channels, sheets, tubes, fasteners", "SS 202, SS 304, SS 316, SS 430", "Finish, size, site location, delivery timing"]
      ])) +
      searchSection("Popular industry supply searches", "Use these chips to describe the industry and product context in your RFQ.", [
        "stainless steel suppliers for fabrication industries",
        "stainless steel suppliers for automobile industries Chennai",
        "SS 304 sheets for commercial kitchen equipment",
        "SS 316 pipes for food processing",
        "stainless steel suppliers for pharma equipment",
        "stainless steel rods for engineering machine shops",
        "stainless steel fasteners for industrial buyers",
        "stainless steel suppliers for marine repair",
        "stainless steel suppliers for water treatment",
        "stainless steel suppliers for textile machinery"
      ]) +
      ctaBlock(),
    faqIntro: "Answers to common questions about matching stainless steel product forms, grades and certificates to different industry applications.",
    faq: coreFaq("industries-we-serve/", "Industries We Serve")
  });

  addGeneratedPage({
    slug: "locations-we-serve/",
    type: "core",
    title: "Locations We Serve | Stainless Steel Suppliers Tamil Nadu",
    description: "Bharat Metals Chennai supports stainless steel enquiries across Tamil Nadu, nearby South India, Andaman and nearby export markets.",
    h1: "Locations We Serve",
    intro: "Bharat Metals is Chennai-based and supports stainless steel enquiries across Chennai, Tamil Nadu and nearby South India procurement markets. Buyers from Coimbatore, Hosur, Trichy, Madurai, Salem, Pondicherry, Sricity, Tada, Renigunta, Tirupati and other locations can send product form, grade, size, finish, quantity, certificate requirement and delivery details. Dispatch, transport booking, door delivery discussion and packing support are reviewed from Chennai based on material availability, quantity and logistics feasibility. Clear dispatch instructions also reduce repeat clarification.",
    eyebrow: "Locations",
    image: "assets/images/photos/locations/tamil-nadu-logistics.webp",
    body:
      proseSection("Chennai and Tamil Nadu supply focus", [
        "Bharat Metals reviews stainless steel enquiries from Chennai for Tamil Nadu buyers who need practical supply conversations around product, grade, finish, certificate and delivery. Chennai remains the business base, with regular enquiries from industrial areas, trading markets, fabrication workshops, engineering companies, commercial kitchen fabricators and project buyers.",
        "Location-based quotation depends on product form, size, quantity, packing and dispatch feasibility. A small fastener enquiry, a bundle of pipes, a stack of sheets and a plate-cutting requirement have different transport and handling expectations. Buyers should mention delivery city, site or transporter preference, unloading constraints and required timeline.",
        "For city enquiries, Bharat Metals asks buyers to keep the material conversation practical: grade, form, size and quantity first, then finish, certificate and logistics. This is especially useful when material needs to move from Chennai to Coimbatore, Hosur, Trichy, Madurai, Salem, Pondicherry, Sricity, Tada, Renigunta or Tirupati. Clear location notes also help with packing, transport and delivery timing discussions before dispatch review."
      ]) +
      hubSection("Chennai", "Chennai Industrial Areas", "Direct links to Chennai and nearby industrial procurement areas.", compactCardGrid(chennaiAreas, citySlug, (city) => city.name)) +
      hubSection("Tamil Nadu", "Tamil Nadu City Grid", "Browse Tamil Nadu stainless steel supply pages for location-led enquiries.", compactCardGrid(byRegion("Tamil Nadu"), citySlug, (city) => city.name)) +
      hubSection("Nearby South India", "Kerala, Karnataka, Andhra Pradesh and Pondicherry", "Nearby South India enquiries can be reviewed from Chennai when product and logistics details are clear.", compactCardGrid([...byRegion("Kerala"), ...byRegion("Karnataka"), ...byRegion("Andhra Pradesh"), ...byRegion("Pondicherry"), ...byRegion("Puducherry")], citySlug, (city) => city.name)) +
      hubSection("Island and nearby export", "Andaman, Sri Lanka and Maldives Enquiries", "Island and nearby export enquiries can be reviewed with packing, documentation, quantity and logistics details, without overstating export business.", compactCardGrid([...byRegion("Andaman and Nicobar Islands"), ...byRegion("Nearby export")], citySlug, (city) => city.name)) +
      pageSection("Location-based RFQ guidance", "Location-led RFQs should include product form, grade, size, finish, quantity, delivery city, certificate need, packing expectation, transport preference and required date. For Sri Lanka, Maldives and island enquiries, mention packing, documentation and logistics requirements early so feasibility can be reviewed.", dataTable(["Location type", "What to mention", "Examples"], [
        ["Chennai local", "Area, delivery or pickup preference, product size and urgency", "George Town, Ambattur, Guindy, Manali"],
        ["Tamil Nadu city", "Transport booking, packing, delivery city and unloading expectation", "Coimbatore, Hosur, Trichy, Madurai, Salem"],
        ["Nearby South India", "Quantity, packing, dispatch location and transporter preference", "Pondicherry, Sricity, Tada, Renigunta, Tirupati"],
        ["Island or export enquiry", "Packing, documentation, product details and logistics feasibility", "Andaman, Sri Lanka, Maldives"]
      ])) +
      searchSection("Popular location supply searches", "Use these chips to describe city, product and grade context in the RFQ.", [
        "stainless steel suppliers in Chennai",
        "stainless steel suppliers Coimbatore",
        "stainless steel suppliers Hosur",
        "stainless steel suppliers Trichy",
        "stainless steel suppliers Madurai",
        "stainless steel suppliers Pondicherry",
        "SS pipe suppliers Sricity",
        "stainless steel suppliers Tada",
        "stainless steel suppliers Renigunta",
        "stainless steel suppliers Sri Lanka Maldives"
      ]) +
      ctaBlock(),
    faqIntro: "Answers to common questions about Chennai-led stainless steel enquiries for Tamil Nadu, nearby South India, island and nearby export markets.",
    faq: coreFaq("locations-we-serve/", "Locations We Serve")
  });

  addGeneratedPage({
    slug: "request-quote/",
    type: "core",
    title: "Request a Stainless Steel Quote | Bharat Metals Chennai",
    description: "Send product form, grade, size, finish, quantity and delivery location to Bharat Metals for a stainless steel quotation.",
    h1: "Request a Stainless Steel Quote",
    intro: "Bharat Metals can respond faster when buyers send clear stainless steel RFQ details. Whether the requirement is for stainless steel pipes, sheets, plates, coils, rods, bars, angles, flats, flanges, fittings, fasteners, wire mesh or perforated sheets, the quotation depends on grade, size, thickness, schedule, diameter, finish, quantity, certificate requirement and delivery location. This page explains what to send by WhatsApp or email so Chennai, Tamil Nadu and nearby South India buyers can reduce back-and-forth.",
    eyebrow: "RFQ",
    image: stainlessMaterialImage,
    body:
      hubSection("RFQ details", "RFQ details that matter most", "Send these details in the first message so Bharat Metals can review the enquiry clearly.", infoCardGrid([
        { title: "Product form", text: "Mention whether the requirement is pipe, tube, sheet, plate, coil, rod, bar, angle, flat, flange, fitting, fastener, wire mesh, perforated sheet or another material form." },
        { title: "Grade", text: "Mention SS 202, SS 304, SS 304L, SS 310, SS 316, SS 316L, SS 410, SS 420, SS 430 or another grade/specification if known." },
        { title: "Size / thickness / schedule", text: "Pipes need OD and schedule or wall thickness; sheets and plates need thickness and size; rods and bars need diameter or section and length." },
        { title: "Quantity", text: "Share approximate or final quantity in pieces, lengths, sheets, kilograms, bundles, coils or number of line items so availability can be reviewed." },
        { title: "Finish", text: "Mention 2B, No. 1, BA, mirror, matt, hairline, brush, PVC coated, polished or other finish expectations where applicable." },
        { title: "Certificate requirement", text: "Mention MTC, mill certificate or third party inspection requirement early because documentation can affect quotation and sourcing discussion." },
        { title: "Delivery location", text: "Share Chennai area, Tamil Nadu city, South India location, island destination or nearby export destination with transport expectations." },
        { title: "Required timeline", text: "Mention required date, urgency, packing needs and whether transport booking, door delivery or courier for small items should be discussed." }
      ])) +
      pageSection("Example RFQ formats", "These examples show the level of detail that helps reduce back-and-forth before quotation.", dataTable(["Example", "Message format"], [
        ["SS 304 welded pipe", "SS 304 welded pipe, 1 inch OD, schedule/thickness if known, 6 metre length, polished finish, quantity 50 lengths, delivery Chennai, MTC required."],
        ["SS 316 plate", "SS 316 plate, thickness 6 mm, size 1250 x 2500 mm, quantity 5 sheets/plates, delivery Pondicherry, mill certificate required."],
        ["SS 202 polished pipe", "SS 202 polished pipe for railing work, size and gauge as per requirement, quantity approximate, delivery Madurai, finish requirement mirror/polished."],
        ["Aluminium sheet", "Aluminium sheet, thickness, size, quantity and delivery location."]
      ])) +
      pageSection("Quote checklist by product type", "Different product forms need different technical details. Use this table before sending a WhatsApp or email RFQ.", dataTable(["Product type", "Details to send"], [
        ["Pipes / tubes", "Grade, welded/seamless, OD, schedule/thickness, length, finish, quantity"],
        ["Sheets / plates", "Grade, thickness, size, finish, PVC coating, quantity"],
        ["Rods / bars", "Grade, diameter/section, length, finish, quantity"],
        ["Angles / flats / channels", "Grade, size, thickness, length, quantity"],
        ["Flanges / fittings", "Grade, standard/type, size, pressure/class, quantity"],
        ["Wire mesh / perforated sheets", "Grade, thickness/wire dia, aperture/hole pattern, sheet size, quantity"]
      ])) +
      proseSection("Where we support enquiries", [
        "Bharat Metals reviews stainless steel quotation enquiries from Chennai for buyers across Tamil Nadu, including Coimbatore, Hosur, Trichy, Madurai, Salem, Tiruppur and Pondicherry. Nearby industrial markets such as Sricity, Tada, Renigunta and Tirupati can also send clear RFQs with product, quantity, packing and transport details.",
        "Andaman and Nicobar, Sri Lanka and Maldives export enquiries can be reviewed based on product, quantity, packing, documentation and logistics feasibility. Bharat Metals does not overstate export business, but can review nearby enquiries carefully when details are complete."
      ]) +
      searchSection("Popular RFQ searches", "Use these chips to frame your quotation request by product, grade and location.", [
        "stainless steel quote Chennai",
        "SS 304 pipe quotation Chennai",
        "SS 316 plate quotation Tamil Nadu",
        "stainless steel sheet quote Chennai",
        "stainless steel rod quotation Coimbatore",
        "SS pipe quote for Sricity",
        "SS 316 pipe quote Pondicherry",
        "stainless steel RFQ for fabrication",
        "stainless steel MTC quote Chennai",
        "Jindal stainless steel pipe quotation Chennai"
      ]) +
      rfqBlock() +
      ctaBlock(),
    faqIntro: "Answers to common RFQ questions for buyers sending stainless steel, aluminium, brass or copper requirements.",
    faq: coreFaq("request-quote/", "Request a Stainless Steel Quote")
  });

  addGeneratedPage({
    slug: "contact-us/",
    type: "core",
    title: "Contact Bharat Metals | Stainless Steel Dealers Chennai",
    description: "Contact Bharat Metals in Chennai for stainless steel pipes, sheets, plates, rods, bars, flanges and fittings.",
    h1: "Contact Bharat Metals",
    intro: "Contact Bharat Metals for stainless steel enquiries from Chennai, Tamil Nadu and nearby South India markets. Buyers can call, send a WhatsApp requirement, email an RFQ or open the Google Maps profile before visiting. For faster response, share product form, grade, size, finish, quantity, certificate need and delivery location. Bharat Metals handles enquiries as a Chennai stainless steel dealer, stockist, supplier and wholesaler established in 1986 with practical RFQ communication.",
    eyebrow: "Contact",
    image: "assets/images/photos/locations/chennai-industrial.webp",
    body:
      hubSection("Contact options", "Call, WhatsApp, email or visit", "Use the contact route that matches your enquiry stage. Keep product details ready before contacting.", linkedCardGrid([
        { title: "Call / WhatsApp", href: site.whatsappHref, text: `Call or WhatsApp ${site.phone} for stainless steel enquiries during working hours. WhatsApp is useful when sending product lists, photos, drawings or delivery details.` },
        { title: "Email RFQ", href: site.mailto.replace(/&/g, "&amp;"), text: `Send detailed RFQs to ${site.email}. Mention product form, grade, size, quantity, finish, delivery location and certificate requirement.` },
        { title: "Visit / Google Maps", href: site.maps, text: `Bharat Metals is located at ${site.addressLines.join(" ")} Open the Google Maps profile before visiting.` },
        { title: "Working hours", href: "contact-us/", text: "Working hours are 10:00 AM to 6:00 PM, and Sunday is the weekly holiday. Calling during working hours helps the enquiry move faster." }
      ])) +
      proseSection("What to send before visiting or calling", [
        "Before calling or visiting, keep the product form, grade, size, thickness, schedule, diameter, finish, quantity, certificate requirement, delivery location and required date ready. If you have a drawing, sample reference, photo or old bill description, mention it in the enquiry so the requirement is easier to understand.",
        "For mixed requirements, list each item separately. Example: SS 304 sheet, 2B finish, thickness and size; SS 316 plate with certificate; SS 202 polished pipe for railing; stainless steel fasteners by size and quantity. Clear line items make review easier than a broad request for stainless steel rate."
      ]) +
      hubSection("Materials", "Materials buyers usually enquire for", "Open the main hubs before sending a detailed RFQ.", linkedCardGrid([
        { title: "Stainless Steel", href: "../stainless-steel/", text: "Pipes, tubes, sheets, plates, coils, rods, bars, angles, flats, channels, flanges, fittings, fasteners, wire mesh and perforated sheets." },
        { title: "Aluminium", href: "../aluminium/", text: "Aluminium sheets, plates, coils, pipes, flats, rods and bars for fabrication, panels, structures, engineering, repairs and trading." },
        { title: "Brass", href: "../brass/", text: "Brass pipes, bush pipes, rods, bars and flats for machining, electrical, fittings, repair, fabrication and trading." },
        { title: "Copper", href: "../copper/", text: "Copper tubes, rods, bars, flats and plates for electrical, engineering, heat-transfer, repair, fabrication and trading." }
      ])) +
      proseSection("For Tamil Nadu and nearby buyers", [
        "Bharat Metals is Chennai-based and can review enquiries for Chennai, Coimbatore, Hosur, Trichy, Madurai, Salem, Pondicherry, Sricity, Tada, Renigunta, Tirupati and nearby markets. Share the delivery location, transport preference and urgency while contacting the team.",
        "Payment modes listed for Bharat Metals are UPI, Bank Transfer, Cheque and Cash. Google Maps should be used for visit planning, and buyers are encouraged to call before visiting when they need a specific product form, grade, size or certificate."
      ]) +
      searchSection("Popular contact searches", "Use these chips to describe the contact or enquiry context.", [
        "contact Bharat Metals Chennai",
        "stainless steel dealers Chennai phone number",
        "stainless steel suppliers Chennai WhatsApp",
        "SS 304 pipe enquiry Chennai",
        "stainless steel sheet quote email",
        "Bharat Metals Google Maps",
        "stainless steel supplier near Parrys Chennai",
        "stainless steel stockist Chennai contact",
        "stainless steel RFQ Chennai",
        "Bharat Metals working hours"
      ]) +
      ctaBlock(),
    faqIntro: "Answers to common questions about calling, emailing, visiting or sending material RFQs to Bharat Metals.",
    faq: coreFaq("contact-us/", "Contact Bharat Metals")
  });

  addGeneratedPage({
    slug: "technical-data/",
    type: "technical",
    title: "Technical Data | Stainless Steel Buyer Reference",
    description: "Technical reference hub for stainless steel grades, finishes, RFQ details and buyer checklist pages.",
    h1: "Technical Data",
    intro: "The Bharat Metals technical data hub gives buyer-friendly stainless steel reference notes for grades, finishes, application discussions, certificates and RFQ preparation. Buyers can use this page to understand how SS 202, SS 304, SS 304L, SS 310, SS 316, SS 316L, SS 410, SS 420 and SS 430 are commonly discussed before sending a requirement. Technical data should be checked against project specifications, standards and engineering requirements. Bharat Metals helps buyers communicate the grade, form, size, finish, quantity and documentation need clearly, but does not replace engineering design advice.",
    eyebrow: "Technical data",
    image: stainlessMaterialImage,
    body:
      proseSection("Grade guidance overview", [
        "Stainless steel grade selection depends on corrosion exposure, application, fabrication method, surface finish, temperature, hygiene requirement, drawing specification and certificate expectation. SS 304 is commonly discussed for general fabrication and clean industrial use, while SS 316 is often reviewed for marine, coastal, chemical and higher corrosion exposure. SS 202 is usually discussed for suitable cost-sensitive fabrication work, and grades such as SS 410, SS 420 or SS 430 may appear in selected mechanical or sheet applications.",
        "The purpose of this technical data page is to help buyers ask better questions. Before asking for a quote, buyers should confirm whether the project needs a specific standard, grade, heat number, MTC, mill certificate, inspection, finish, tolerance or application approval."
      ]) +
      pageSection("Stainless steel grade table", "Use this table as a buyer-friendly starting point before checking project specifications and engineering requirements.", dataTable(["Grade", "Buyer discussion note", "Common enquiry context"], grades.map((grade) => [grade.name, grade.summary, grade.notes]))) +
      pageSection("Finish selection guide", "Finish terms should match the product form. A sheet finish conversation is different from a polished pipe or machined flange conversation.", dataTable(["Finish", "Typical buyer note"], [
        ["2B Finish", "Common sheet and coil finish language for general fabrication and clean visible surfaces"],
        ["No. 1 Finish", "Often discussed for hot rolled plate or industrial surface requirements"],
        ["BA / Mirror / No. 8", "Used where bright, reflective or decorative surfaces matter"],
        ["Matt / Hairline / Brush / Satin", "Architectural, interior, commercial kitchen and visible sheet applications"],
        ["PVC coated sheets", "Temporary protection for visible sheet surfaces during fabrication"],
        ["Polished pipes, rods and bars", "Railing, interior, decorative, machining or clean finish requirements"]
      ])) +
      proseSection("Mechanical, chemical and physical data teaser", [
        "Exact chemical composition, mechanical properties and physical properties should be checked against relevant standards, mill documents, project specifications and engineering requirements. Bharat Metals can help buyers mention whether they need MTC, mill certificate, grade confirmation, make preference, inspection or traceability discussion for applicable materials.",
        "For practical RFQs, buyers should not rely only on a grade name. A good request includes product form, grade, size, thickness, schedule, diameter, length, finish, quantity, certificate requirement and delivery location. If the enquiry is for food, pharma, marine, chemical, heat, machining or structural use, mention the application clearly."
      ]) +
      pageSection("Application-based selection notes", "Different applications require different conversations. Commercial kitchen fabricators often discuss SS 304 sheets, tubes and polished finishes. Coastal and marine buyers often compare SS 304 and SS 316. Food, pharma and dairy equipment buyers may discuss SS 304, SS 316 and SS 316L with hygiene and certificate expectations. Machine shops may ask for rods, bars or plates with size, finish and machining details.") +
      pageSection("Certificate and documentation note", "MTC, mill certificate and third party inspection should be requested at RFQ stage, not after quotation assumptions are made. Documentation availability depends on product form, grade, source, quantity and current material availability. Technical data should be checked against project specifications, standards and engineering requirements.") +
      hubSection("Grade links", "Grade Pages for Buyer Notes", "Use these grade pages for buyer notes before sending a technical RFQ.", gradeCardLinks) +
      searchSection("Popular technical searches", "Use these chips to frame grade, finish, certificate and application questions.", [
        "SS 304 technical data Chennai",
        "SS 316 grade guidance",
        "stainless steel finish guide 2B mirror hairline",
        "stainless steel MTC mill certificate",
        "SS 304 vs SS 316 for marine use",
        "SS 202 vs SS 304 railing work",
        "stainless steel chemical composition notes",
        "stainless steel mechanical property notes",
        "stainless steel physical property notes",
        "stainless steel grade selection Chennai"
      ]) +
      ctaBlock(),
    faqIntro: "Answers to common questions about stainless steel grades, finishes, certificates and application notes before sending an RFQ.",
    faq: coreFaq("technical-data/", "Technical Data")
  });

  addGeneratedPage({
    slug: "blog/",
    type: "core",
    title: "Bharat Metals Blog | Stainless Steel Buyer Guides",
    description: "Buyer guides for stainless steel grades, product forms, finishes, certificates and city supply support.",
    h1: "Bharat Metals Blog",
    intro: "The Bharat Metals blog is a buyer guide hub for stainless steel procurement decisions. Articles explain grade comparisons, product form differences, finish terms, quotation details, MTC and mill certificate discussion, Tamil Nadu supply notes and industry-specific buying questions for buyers preparing clearer RFQs before contacting Bharat Metals.",
    eyebrow: "Blog",
    image: "assets/images/photos/locations/blog-stainless-steel-stockyard.webp",
    body:
      proseSection("Buyer guides for stainless steel procurement", [
        "Good stainless steel buying starts with clear language. Buyers often know the application but not the exact grade, finish or product-form details needed for quotation. The blog helps translate common questions into practical RFQ language: SS 304 or SS 316, welded or seamless pipe, sheet finish, plate thickness, certificate request, city dispatch, commercial kitchen use, food and pharma equipment, automobile industries and coastal requirements."
      ]) +
      hubSection("Blog articles", "Buyer Guides", "Open practical stainless steel buying notes.", cardGrid(blogPosts, (post) => `blog/${post.slug}/`, (post) => post.summary, (post) => post.title)) +
      pageSection("Browse articles by buying topic", "Use these groups to find the right guide before preparing a quotation message.", dataTable(["Topic group", "Useful blog guides"], [
        ["Grades", "SS 304 vs SS 316, SS 202 vs SS 304, coastal and marine grade notes"],
        ["Product forms", "Welded vs seamless pipes, sheet finishes, plates, perforated sheets and wire mesh"],
        ["RFQ and documentation", "Fast quote checklist, MTC and mill certificate buyer notes"],
        ["City and industry guides", "Tamil Nadu supply, Sricity-Tada-Tirupati, commercial kitchens, food and pharma, automobile industries"]
      ])) +
      searchSection("Popular blog and guide searches", "Use these chips to open the type of buyer guidance you need.", [
        "SS 304 vs SS 316 buyer guide",
        "stainless steel welded pipe vs seamless pipe",
        "stainless steel sheet finishes 2B mirror hairline",
        "how to send stainless steel RFQ",
        "MTC mill certificate stainless steel",
        "stainless steel for commercial kitchens",
        "stainless steel for food pharma equipment",
        "stainless steel suppliers Tamil Nadu guide",
        "stainless steel for automobile industries Tamil Nadu",
        "stainless steel supply Sricity Tada Tirupati"
      ]) +
      ctaBlock(),
    faqIntro: "Answers to common questions about using Bharat Metals buyer guides before preparing a stainless steel RFQ.",
    faq: coreFaq("blog/", "Bharat Metals Blog")
  });

  Object.keys(secondaryMaterials).forEach((material) => buildMaterialHub(material));

  [
    ["contacts-us/", "Legacy Contact Bharat Metals", "Legacy contact URL for Bharat Metals stainless steel enquiries in Chennai."],
    ["ss-chemical/", "Stainless Steel Chemical Composition Notes", "Legacy stainless steel chemical reference page with safe buyer guidance."],
    ["ss-mechanical/", "Stainless Steel Mechanical Property Notes", "Legacy stainless steel mechanical reference page for buyer discussions."],
    ["ss-physical/", "Stainless Steel Physical Property Notes", "Legacy stainless steel physical property page for buyer reference."],
    ["ss-types-and-applications/", "Stainless Steel Types and Applications", "Legacy stainless steel type and application guide for Bharat Metals buyers."]
  ].forEach(([slug, h1, description]) =>
    addGeneratedPage({
      slug,
      type: "legacy",
      title: `${h1} | Bharat Metals`,
      description,
      h1,
      intro: description,
      eyebrow: "Legacy reference",
      image: stainlessMaterialImage,
      body:
        pageSection("Legacy SEO compatibility", "This page preserves an older stainless steel reference path while pointing buyers to current Bharat Metals product, grade and RFQ pages.") +
        hubSection("Useful current pages", "Continue Browsing", "Open current Bharat Metals pages.", chips(["stainless-steel/", "technical-data/", "request-quote/", "contact-us/"], (item) => item)) +
        ctaBlock(),
      faq: coreFaq(slug, h1)
    })
  );
}

function buildMaterialHub(material) {
  const title = materialNames[material];
  const materialApplications = {
    aluminium:
      "Aluminium enquiries are common for fabrication, panels, light structures, engineering work, repairs, maintenance and trading. Buyers may ask for sheets, plates, coils, pipes, flats, rods or bars depending on whether the requirement is for panel work, support members, machined parts, replacement material or general commercial supply.",
    brass:
      "Brass enquiries are common for machining, electrical work, fittings, repair, fabrication and trading. Buyers may discuss pipes, bush pipes, rods, bars and flats where machinability, conductivity, fittings work, workshop repair or component fabrication is relevant.",
    copper:
      "Copper enquiries are common for electrical, engineering, heat-transfer, repair, fabrication and trading requirements. Buyers may discuss tubes, flats, rods, bars and plates where conductivity, heat-transfer use, workshop fabrication or maintenance work is part of the requirement."
  };
  const materialRfq = {
    aluminium:
      "For aluminium RFQs, mention form, thickness or diameter, width, length, grade or alloy/specification if known, quantity, finish, cutting need, delivery location and required date. If the requirement is for panels, structures, fabrication or repairs, mention application so the enquiry can be reviewed clearly.",
    brass:
      "For brass RFQs, mention whether the requirement is pipe, bush pipe, rod, bar or flat, then add size, length, diameter or section, quantity, specification if known, machining or fitting use, delivery location and required date. Electrical or repair enquiries should mention application and tolerance expectation where applicable.",
    copper:
      "For copper RFQs, mention whether the requirement is tube, flat, rod, bar or plate, then add size, thickness or diameter, length, quantity, specification if known, electrical or heat-transfer use, delivery location and required date. Certificate or packing expectations should be included early where applicable. Share urgency clearly."
  };
  const materialSearches = {
    aluminium: [
      "aluminium sheet suppliers Chennai",
      "aluminium plate suppliers Tamil Nadu",
      "aluminium rods bars Chennai",
      "aluminium coils suppliers Chennai",
      "aluminium pipes flats suppliers",
      "aluminium suppliers for fabrication",
      "aluminium material quote Chennai",
      "aluminium suppliers Coimbatore Hosur",
      "aluminium sheets for panels Chennai",
      "aluminium suppliers Bharat Metals"
    ],
    brass: [
      "brass rod suppliers Chennai",
      "brass bar suppliers Tamil Nadu",
      "brass pipe suppliers Chennai",
      "brass bush pipe suppliers",
      "brass flats for machining",
      "brass suppliers for electrical work",
      "brass material quote Chennai",
      "brass suppliers Coimbatore Hosur",
      "brass fittings repair material",
      "brass suppliers Bharat Metals"
    ],
    copper: [
      "copper tube suppliers Chennai",
      "copper rod suppliers Tamil Nadu",
      "copper bar suppliers Chennai",
      "copper flats and plates",
      "copper suppliers for electrical work",
      "copper suppliers for heat transfer",
      "copper material quote Chennai",
      "copper suppliers Coimbatore Hosur",
      "copper repair fabrication material",
      "copper suppliers Bharat Metals"
    ]
  };
  const materialCityCards = compactCardGrid(["Chennai", "Coimbatore", "Hosur", "Trichy", "Madurai", "Salem", "Pondicherry", "Sricity"].map(cityByName), citySlug, (city) => city.name);
  addGeneratedPage({
    slug: `${material}/`,
    type: "secondary-material",
    title: `${title} Suppliers in Chennai | Bharat Metals`,
    description: `${title} suppliers in Chennai for commercial ${title.toLowerCase()} ${secondaryMaterials[material].join(", ").toLowerCase()} enquiries through Bharat Metals.`,
    h1: `${title} Suppliers in Chennai`,
    intro: materialIntros[material],
    eyebrow: `${title} supply`,
    image: materialImages[material],
    imageAlt: `${title} material stock for Bharat Metals Chennai buyers`,
    body:
      proseSection(`${title} supply support from Chennai`, [
        materialIntros[material],
        materialApplications[material],
        `Bharat Metals keeps these ${title.toLowerCase()} enquiries commercially practical. Buyers should not send only a broad material name; the product form, size, quantity, specification and delivery location decide whether the requirement can be reviewed properly. Chennai, Tamil Nadu and nearby South India buyers can send a clear RFQ by WhatsApp or email.`,
        `For faster review, mention whether the material is for fabrication, machining, electrical work, panels, heat-transfer use, repair, maintenance or trading. If cutting, packing, transport booking or certificate discussion is needed, include that requirement in the first message. Application details help Bharat Metals understand commercial use and dispatch urgency.`
      ]) +
      hubSection(`${title} products`, `Browse ${title} Products`, `Open ${title.toLowerCase()} product enquiry pages by form before sending size, quantity and delivery details.`, cardGrid(secondaryMaterials[material], (item) => `${material}-${slugify(item)}/`, (item) => `${title} ${item.toLowerCase()} enquiries can be reviewed by size, specification, quantity, application and delivery location.`)) +
      proseSection(`What to mention in ${material === "aluminium" ? "an" : "a"} ${title.toLowerCase()} RFQ`, [
        materialRfq[material],
        `If the enquiry combines ${title.toLowerCase()} with stainless steel, separate each line item clearly. For example, list stainless steel grade and form separately from ${title.toLowerCase()} product form and specification. This helps Bharat Metals review availability, sourceability, packing and dispatch expectations without mixing requirements.`
      ]) +
      hubSection("City support", `${title} enquiry support for Tamil Nadu buyers`, `Bharat Metals is Chennai-based and can review ${title.toLowerCase()} enquiries for nearby cities when product details and logistics expectations are clear.`, materialCityCards) +
      searchSection(`Popular ${title.toLowerCase()} searches`, `Use these chips to describe ${title.toLowerCase()} form, city, application and quotation context.`, materialSearches[material]) +
      rfqBlock(title.toLowerCase()) +
      ctaBlock(title.toLowerCase()),
    faqIntro: `Answers to common questions about ${title.toLowerCase()} product forms, RFQ details, availability checks and Chennai-led supply support.`,
    faq: materialFaq(material)
  });
}

function buildProductPages() {
  forms.forEach((form) => {
    addGeneratedPage({
      slug: `${form.slug}/`,
      type: "product-form",
      title: `${form.name} in Chennai | Bharat Metals`,
      description: `${form.name} suppliers in Chennai for Tamil Nadu buyers. Share grade, ${buyerSpec(form)}, quantity and delivery location.`,
      h1: `${form.name} Suppliers in Chennai`,
      eyebrow: "Stainless steel product",
      intro: productIntro(form),
      image: formImage(form),
      imageAlt: `${form.name} stock for Bharat Metals buyers`,
      breadcrumbs: [{ name: "Products", slug: "products/" }],
      body:
        proseSection("Product overview", [
          productIntro(form),
          `Bharat Metals does not manufacture material; it supports dealer, stockist, supplier and wholesaler enquiries by matching buyer requirements with available stock, sourceability, order size and dispatch feasibility from Chennai. For ${form.short.toLowerCase()}, useful RFQ details include grade, ${buyerSpec(form)}, quantity, certificate requirement and delivery location.`
        ]) +
        proseSection("How buyers usually specify this product", [
          `Most ${form.short.toLowerCase()} enquiries are specified by grade, ${buyerSpec(form)}, quantity, certificate requirement and packing or transport expectation. If a make preference such as Jindal make pipes is important, buyers can mention it clearly as a preference without treating it as a brand dealership claim.`
        ]) +
        pageSection("Common applications", productApplications(form)) +
        pageSection("Grades available for this form", "Buyers can mention the required stainless steel grade directly in the RFQ. Commonly discussed grades include the options below, subject to product form, size, finish, quantity and availability.", gradeChipsForForm(form)) +
        finishMatrixSection(form) +
        hubSection("Grade and form pages", `${form.short} by Grade`, `Choose a grade-specific ${form.short.toLowerCase()} page when the RFQ already mentions grade, size, finish, quantity or certificate expectations.`, compactCardGrid(grades, (grade) => `${grade.slug}-${form.formSlug}/`, (grade) => `${grade.name} ${form.short}`)) +
        hubSection(
          "City links",
          `Popular ${form.short} City Pages`,
          "Use these city links to open product-location pages for priority supply markets, or the main location page when a product-location page is not needed.",
          chips(
            priorityCities.map(cityByName),
            (city) => (priorityForms.includes(form.formSlug) ? `${form.slug}-${slugify(city.name)}/` : citySlug(city)),
            (city) => city.name
          )
        ) +
        rfqBlock(form.short.toLowerCase()) +
        searchSection(`Popular stainless steel ${form.short.toLowerCase()} searches`, `Use these search chips to frame ${form.short.toLowerCase()} enquiries by grade, city, finish, make preference and application before sending the RFQ.`, productSearches(form)) +
        ctaBlock(form.short.toLowerCase()),
      faq: productFaq(form)
    });
  });
}

function buildGradePages() {
  grades.forEach((grade) => {
    addGeneratedPage({
      slug: `${grade.slug}/`,
      type: "grade",
      title: `${grade.name} Suppliers in Chennai | Bharat Metals`,
      description: `${grade.name} stainless steel suppliers in Chennai for pipes, sheets, plates, rods, bars and fittings.`,
      h1: `${grade.name} Stainless Steel Suppliers in Chennai`,
      eyebrow: "Stainless steel grade",
      intro: gradeIntro(grade),
      image: stainlessMaterialImage,
      imageAlt: `${grade.name} stainless steel material stock`,
      breadcrumbs: [{ name: "Stainless Steel", slug: "stainless-steel/" }],
      body:
        proseSection("Where this grade is commonly discussed", [
          gradeOverview(grade),
          `${grade.name} enquiries should include application, exposure, fabrication method, product form, finish, quantity and certificate expectation. ${grade.notes} Bharat Metals reviews these details as a Chennai-based dealer, stockist, supplier and wholesaler, not as a manufacturer.`
        ]) +
        proseSection("Available product forms", [
          `${grade.name} requirements can be reviewed across welded pipes, seamless pipe enquiries, polished pipes, tubes, sheets, plates, coils, flats, angles, rods, bars, channels, fittings, flanges, fasteners, wire mesh and perforated sheets. Buyers should share exact size, thickness, schedule, diameter, finish and quantity for accurate quotation support.`
        ]) +
        pageSection("Popular industries", `${grade.name} enquiries are common from fabricators, railing contractors, commercial kitchen fabricators, food processing equipment makers, pharma equipment buyers, engineering workshops, traders, interior contractors, maintenance teams and project procurement teams depending on application and specification.`) +
        pageSection("Common finishes and processing", "Surface finish, cutting, polishing, PVC coating, bending, drilling, packing, MTC, mill certificate and third-party inspection requirements should be mentioned at RFQ stage so they can be checked against the product form and order size.") +
        hubSection("Available forms", `${grade.name} Product Forms`, `${grade.name} enquiries can be narrowed by product form before sending size, finish, quantity and certificate details.`, cardGrid(forms, (form) => `${grade.slug}-${form.formSlug}/`, (form) => gradeFormCardText(grade, form))) +
        hubSection("Industry relevance", `Industries Discussing ${grade.name}`, `${grade.name} demand changes by exposure, fabrication method, hygiene need and project specification.`, cardGrid(industries.slice(0, 12), (industry) => `industries/${industry.slug}/`, (industry) => `${industry.name} buyers often discuss ${industry.products.join(", ")} with grades such as ${industry.grades.join(", ")}.`)) +
        hubSection(
          "City links",
          `${grade.name} City Pages`,
          gradeCityIntro(grade),
          chips(
            gradeCityNames(grade).map(cityByName),
            (city) => gradeCityHref(grade, city),
            (city) => city.name
          )
        ) +
        pageSection("Tamil Nadu and South India enquiry support", "From Chennai, Bharat Metals reviews grade-specific stainless steel enquiries for Chennai, Coimbatore, Madurai, Trichy, Salem, Hosur, Pondicherry, Sricity, Tada, Renigunta, Tirupati and nearby South India markets based on availability, quantity, packing and transport feasibility.") +
        pageSection("Grade comparison note", "SS 202, SS 304, SS 316 and other grades should be compared by application, corrosion exposure, finish, fabrication and buyer specification. Critical applications should be checked with the project engineer or specification authority.") +
        rfqBlock(grade.name) +
        searchSection(`Popular ${grade.name} enquiry searches`, `Buyers often search ${grade.name} by product form, city, finish, make preference and application. Bharat Metals uses these details to keep the quotation conversation practical.`, gradeSearches(grade)) +
        ctaBlock(grade.name),
      faq: gradeFaq(grade)
    });
  });
}

function buildGradeFormPages() {
  grades.forEach((grade) => {
    forms.forEach((form) => {
      const subject = `${grade.name} ${form.short}`;
      addGeneratedPage({
        slug: `${grade.slug}-${form.formSlug}/`,
        type: "grade-form",
        title: `${subject} Suppliers in Chennai | Bharat Metals`,
        description: `${subject} suppliers in Chennai with grade, size, finish, quantity, certificate and transport details.`,
        h1: `${subject} Suppliers in Chennai`,
        eyebrow: "Grade and product form",
        intro: `${subject} enquiries are reviewed by Bharat Metals from Chennai for fabricators, contractors, traders and industrial buyers. Share ${buyerSpec(form)} for a practical response.`,
        image: formImage(form),
        imageAlt: `${subject} stock and material supply`,
        breadcrumbs: [
          { name: grade.name, slug: `${grade.slug}/` },
          { name: form.name, slug: `${form.slug}/` }
        ],
        body:
          proseSection(`${subject} overview`, [
            `${grade.name} is ${grade.summary}. In ${form.short.toLowerCase()} form, buyers usually need clear size, finish, quantity, certificate and application details before availability can be reviewed.`,
            `${subject} enquiries should include ${buyerSpec(form)}, quantity, delivery location and any MTC, mill certificate or third-party inspection requirement. For make-sensitive pipe enquiries, mention make preference at RFQ stage without treating it as a brand dealership claim.`
          ]) +
          pageSection("Applications and industries", `${subject} may be requested for ${form.uses.join(", ")}. Common buyer groups include fabricators, engineering companies, machine shops, contractors, traders, maintenance teams and project procurement buyers.`, `<h3>Related industries</h3>${chips(industries.slice(0, 8), (industry) => `industries/${industry.slug}/`)}`) +
          finishMatrixSection(form) +
          pageSection("Supply note", "Bharat Metals is Chennai-based and supports Tamil Nadu and nearby South India enquiries depending on product availability, quantity, packing and transport feasibility.") +
          rfqBlock(subject) +
          searchSection(`Popular ${subject} searches`, `${subject} buyers often search by grade, form, city, finish, make preference and certificate requirement before sending an RFQ.`, gradeFormSearches(grade, form)) +
          ctaBlock(subject),
        faq: gradeFormFaq(grade, form)
      });
    });
  });
}

function relatedCities(city) {
  const sameRegion = locations.filter((item) => item.region === city.region && item.name !== city.name).slice(0, 8);
  if (city.name === "Chennai") return ["Ambattur", "Guindy", "Manali", "Ennore", "Sriperumbudur", "Oragadam", "Parrys Chennai", "George Town Chennai"].map(cityByName);
  return sameRegion.length ? sameRegion : locations.slice(0, 8);
}

function buildLocationPages() {
  locations.forEach((city) => {
    const slug = citySlug(city);
    const exportNote =
      city.region === "Nearby export"
        ? `Nearby export enquiries for ${city.name} can be reviewed from Chennai with product, packing, documentation, quantity and destination details.`
        : `For ${city.name}, dispatch, door delivery, transport booking or courier for small items can be discussed after product availability, quantity, packing and required date are clear.`;
    addGeneratedPage({
      slug,
      type: "city",
      title: `Stainless Steel Suppliers in ${city.name} | Bharat Metals`,
      description: `Stainless steel suppliers for ${city.name}. Bharat Metals Chennai supports enquiries for ${city.products.slice(0, 5).join(", ")} and grades such as ${city.grades.join(", ")}.`,
      h1: `Stainless Steel Suppliers in ${city.name}`,
      eyebrow: `${city.region} supply support`,
      intro: cityIntro(city),
      image: cityImage(city),
      imageAlt: `Stainless steel supply and dispatch support for ${city.name}`,
      breadcrumbs: [{ name: "Locations", slug: "locations-we-serve/" }],
      body:
        proseSection("Industrial and buyer profile", [
          `${city.name} has ${city.profile}. Buyers commonly ask for stainless steel by form, grade, size and finish rather than only by generic material name.`,
          `Typical enquiries may come from fabricators, traders, contractors, maintenance teams, project buyers, engineering workshops and industry users who need product availability, certificate expectations and dispatch feasibility reviewed from Chennai.`
        ]) +
        pageSection(`Popular stainless steel products for ${city.name}`, cityProductIntro(city), `<h3>Related products</h3>${chips(relatedProductFormsForCity(city), (form) => `${form.slug}/`, (form) => form.short)}`) +
        pageSection(`Grades commonly discussed for ${city.name}`, `Grades often discussed for ${city.name} include ${city.grades.join(", ")}. Grade choice should be based on corrosion exposure, fabrication method, finish, hygiene requirement, drawing specification and buyer application.`, `<h3>Grade pages</h3>${chips(grades.slice(0, 6), (grade) => `${grade.slug}/`, (grade) => grade.name)}`) +
        pageSection("Delivery and transport guidance", exportNote) +
        hubSection("Nearby cities", `Nearby ${city.region} Pages`, nearbyCityIntro(city), chips(relatedCities(city), citySlug, (item) => item.name)) +
        rfqBlock(`stainless steel for ${city.name}`) +
        searchSection(`Popular stainless steel enquiries for ${city.name}`, `Use these search chips to describe ${city.name} enquiries by product, grade, make, certificate need and dispatch location.`, citySearches(city)) +
        ctaBlock(`stainless steel for ${city.name}`),
      faq: cityFaq(city)
    });
  });
}

function buildIndustryPages() {
  industries.forEach((industry) => {
    addGeneratedPage({
      slug: `industries/${industry.slug}/`,
      type: "industry",
      title: `${industry.name} Stainless Steel Suppliers | Bharat Metals`,
      description: `Stainless steel suppliers for ${industry.name}: ${industry.products.join(", ")} and grades such as ${industry.grades.join(", ")}.`,
      h1: `Stainless Steel for ${industry.name}`,
      eyebrow: "Industry supply",
      intro: industryIntro(industry),
      image: industryImage(industry),
      imageAlt: `${industry.name} stainless steel supply visual`,
      breadcrumbs: [{ name: "Industries", slug: "industries-we-serve/" }],
      body:
        proseSection("Industry overview", [
          industryIntro(industry),
          "Bharat Metals helps buyers describe stainless steel requirements clearly before checking availability. Exact grade, form, size, finish, quantity, drawing or sample reference, certificate expectation and delivery location make the RFQ easier to review."
        ]) +
        pageSection("Specific stainless steel product relevance", industryProductRelevance(industry), `<h3>Related product forms</h3>${chips(relatedProductFormsForIndustry(industry), (form) => `${form.slug}/`, (form) => form.short)}`) +
        pageSection("Common grades", `Common grades for ${industry.name} include ${industry.grades.join(", ")}. Grade suitability should be confirmed by application, exposure, fabrication method, hygiene requirement, operating environment and project specification.`, `<h3>Grade pages</h3>${chips(grades.slice(0, 6), (grade) => `${grade.slug}/`, (grade) => grade.name)}`) +
        pageSection("Finishes, services and documentation", `Finish and processing details for ${industry.name} should match the product form. Sheets, coils and perforated sheets may involve 2B, No. 1, BA, mirror, hairline, brush or PVC-coated options where suitable; rods and bars are normally discussed with bright, polished, machined or cut-length expectations; flanges and fittings need machined, mill, pickled/passivated or certificate-led details where applicable. Cutting, polishing, drilling, packing, MTC, mill certificate and inspection requirements should be shared before quotation.`) +
        hubSection("City relevance", "Relevant Supply Regions", "Open common city pages for Chennai-led supply discussions.", chips(["Chennai", "Ambattur", "Sriperumbudur", "Oragadam", "Coimbatore", "Hosur", "Pondicherry", "Tiruppur"].map(cityByName), citySlug, (city) => city.name)) +
        rfqBlock(industry.name) +
        searchSection(`Popular ${industry.name.toLowerCase()} stainless steel supply searches`, `Use these search chips to describe product form, grade, city, certificate need and application before sending a detailed RFQ.`, industrySearches(industry)) +
        ctaBlock(industry.name),
      faq: industryFaq(industry)
    });
  });

  addGeneratedPage({
    slug: "industries/hotel-commercial-kitchen-equipment/",
    type: "industry",
    title: "Hotel Kitchen Equipment Stainless Steel Supply Link | Bharat Metals Chennai",
    description: "Alias page for hotel and commercial kitchen equipment stainless steel enquiries. Continue to the main Commercial Kitchen Equipment page from Bharat Metals Chennai.",
    h1: "Hotel and Commercial Kitchen Equipment Stainless Steel Suppliers",
    eyebrow: "Industry alias",
    intro: "This page supports hotel commercial kitchen equipment enquiries and continues at the main Commercial Kitchen Equipment stainless steel supply page.",
    canonicalSlug: "industries/commercial-kitchen-equipment/",
    robots: "index,follow",
    image: industryImage({ slug: "commercial-kitchen-equipment" }),
    imageAlt: "Hotel and commercial kitchen equipment stainless steel supply visual",
    breadcrumbs: [{ name: "Industries", slug: "industries-we-serve/" }],
    body:
      pageSection(
        "Continue to the main commercial kitchen equipment page",
        "Bharat Metals keeps detailed hotel and commercial kitchen equipment stainless steel guidance on the main Commercial Kitchen Equipment page. Use the link below for product forms, grades, finishes, RFQ details and enquiry support.",
        `<div class="page-card-grid"><a class="page-card anchor-card" href="../commercial-kitchen-equipment/"><h3>Open Commercial Kitchen Equipment Page</h3><p>View stainless steel sheets, tubes, pipes, plates, SS 304, SS 316, finish notes and quotation guidance for hotel and commercial kitchen equipment buyers.</p></a></div>`
      ) +
      rfqBlock("hotel and commercial kitchen equipment stainless steel") +
      ctaBlock("hotel and commercial kitchen equipment stainless steel"),
    faq: []
  });
}

function buildSecondaryPages() {
  Object.entries(secondaryMaterials).forEach(([material, items]) => {
    const title = materialNames[material];
    items.forEach((item) => {
      const slug = `${material}-${slugify(item)}/`;
      const h1 = `${title} ${item} Suppliers in Chennai`;
      addGeneratedPage({
        slug,
        type: "secondary-material",
        title: `${title} ${item} in Chennai | Bharat Metals`,
        description: `${title} ${item.toLowerCase()} suppliers in Chennai for commercial, fabrication, engineering and trading enquiries.`,
        h1,
        eyebrow: `${title} product`,
        intro: `${title} ${item.toLowerCase()} enquiries can be reviewed by Bharat Metals from Chennai based on size, specification, quantity, delivery location and current availability.`,
        image: materialImages[material],
        imageAlt: `${title} ${item.toLowerCase()} material stock`,
        breadcrumbs: [{ name: title, slug: `${material}/` }],
        body:
          pageSection(`${title} ${item} overview`, `${title} ${item.toLowerCase()} may be required by fabricators, machine shops, traders, repair teams and commercial procurement buyers. Share size, grade/specification if known, quantity and delivery location.`) +
          rfqBlock(`${title} ${item.toLowerCase()}`) +
          ctaBlock(`${title} ${item.toLowerCase()}`),
        faq: materialItemFaq(material, item)
      });
    });
  });
}

function buildCityProductPages() {
  priorityCities.forEach((name) => {
    priorityForms.forEach((formSlugValue) => {
      const city = cityByName(name);
      const form = formBySlug(formSlugValue);
      const slug = `${form.slug}-${slugify(city.name)}/`;
      const subject = `${form.name} in ${city.name}`;
      addGeneratedPage({
        slug,
        type: "city-product",
        title: `${form.short} ${city.name} Supply | Bharat Metals Chennai`,
        description: `${subject} suppliers from Chennai for ${city.profile}.`,
        h1: subject,
        eyebrow: "City and product",
        intro: `Bharat Metals supports ${form.short.toLowerCase()} enquiries for ${city.name} buyers from Chennai based on availability, quantity and logistics feasibility.`,
        image: formImage(form),
        imageAlt: `${subject} supply visual`,
        breadcrumbs: [
          { name: city.name, slug: citySlug(city) },
          { name: form.name, slug: `${form.slug}/` }
        ],
        body:
          proseSection(`${city.name} relevance`, [
            `${city.name} has ${city.profile}. ${form.name} may be requested by fabricators, contractors, industries, traders, workshops and project buyers depending on the application.`,
            `Bharat Metals reviews ${form.short.toLowerCase()} enquiries for ${city.name} from Chennai by checking grade, ${buyerSpec(form)}, quantity, certificate needs, packing expectation and delivery location before confirming practical supply options.`
          ]) +
          pageSection("Grades and RFQ notes", `Common grades discussed for ${city.name} include ${city.grades.join(", ")}. Send ${buyerSpec(form)}, quantity, finish where relevant and delivery location for a practical quotation response.`) +
          finishMatrixSection(form) +
          rfqBlock(subject) +
          searchSection(`Popular ${form.short.toLowerCase()} searches for ${city.name}`, `Buyers often search city and product together before sending exact grade, size and quantity details.`, cityProductSearches(city, form)) +
          ctaBlock(subject),
        faq: cityProductFaq(city, form)
      });
    });
  });
}

function buildGradeCityPages() {
  ["202", "304", "316"].forEach((gradeId) => {
    gradeCityPriority.forEach((name) => {
      const grade = gradeById(gradeId);
      const city = cityByName(name);
      const slug = `${grade.slug}-suppliers-${slugify(city.name)}/`;
      const subject = `${grade.name} Suppliers in ${city.name}`;
      addGeneratedPage({
        slug,
        type: "grade-city",
        title: `${grade.name} ${city.name} Suppliers | Bharat Metals`,
        description: `${grade.name} stainless steel suppliers for ${city.name} from Chennai with product form, size, finish and quantity details.`,
        h1: subject,
        eyebrow: "Grade and city",
        intro: `Bharat Metals reviews ${grade.name} stainless steel enquiries for ${city.name} buyers from Chennai based on stock, procurement cycle, quantity and logistics feasibility.`,
        image: stainlessMaterialImage,
        imageAlt: `${subject} stainless steel material`,
        breadcrumbs: [
          { name: grade.name, slug: `${grade.slug}/` },
          { name: city.name, slug: citySlug(city) }
        ],
        body:
          proseSection(`${grade.name} for ${city.name}`, [
            `${city.name} has ${city.profile}. ${grade.name} is ${grade.summary}. Buyers should send the exact form, size and application so the enquiry can be reviewed responsibly.`,
            `For ${city.name}, ${grade.name} enquiries may include pipes, sheets, plates, rods, bars, fittings, flanges, fasteners or other forms based on industry use, corrosion exposure, fabrication requirement, finish and delivery planning from Chennai.`
          ]) +
          pageSection("Forms available", `${grade.name} enquiries can be discussed for ${forms.slice(0, 10).map((form) => form.short).join(", ")} and other forms depending on availability.`, chips(forms.slice(0, 10), (form) => `${grade.slug}-${form.formSlug}/`, (form) => form.short)) +
          rfqBlock(subject) +
          searchSection(`Popular ${grade.name} searches for ${city.name}`, `Use these grade-city search chips before sharing exact form, size, quantity and certificate needs.`, gradeCitySearches(grade, city)) +
          ctaBlock(subject),
        faq: gradeCityFaq(grade, city)
      });
    });
  });
}

function blogFocus(post) {
  const map = {
    "ss-304-vs-ss-316": {
      products: "pipes, sheets, plates, fittings, flanges, rods and bars",
      grades: "SS 304 and SS 316",
      cities: "Chennai, Pondicherry, Tuticorin, Port Blair and other coastal or industrial locations",
      angle: "corrosion exposure, fabrication environment, hygiene requirements and project specification"
    },
    "stainless-steel-pipes-welded-vs-seamless": {
      products: "welded pipes, seamless pipe enquiries, polished pipes and pipe fittings",
      grades: "SS 202, SS 304 and SS 316",
      cities: "Chennai, Coimbatore, Hosur, Trichy, Sricity and Renigunta",
      angle: "outside diameter, wall thickness, schedule, length, finish, make preference and certificate requirement"
    },
    "ss-202-vs-ss-304-railing-work": {
      products: "polished pipes, tubes, sheets, flats and decorative stainless steel",
      grades: "SS 202 and SS 304",
      cities: "Chennai, Madurai, Salem, Trichy and Pondicherry",
      angle: "railing location, exposure to moisture, finish expectation, budget and long-term appearance"
    },
    "stainless-steel-sheet-finishes": {
      products: "2B sheets, BA sheets, mirror sheets, matt sheets, hairline sheets, brush finish sheets and PVC coated sheets",
      grades: "SS 202, SS 304, SS 316 and SS 430",
      cities: "Chennai, Coimbatore, Erode, Pondicherry and Madurai",
      angle: "finish sample, thickness, sheet size, PVC protection, fabrication process and visible surface requirement"
    },
    "how-to-send-stainless-steel-rfq": {
      products: "pipes, sheets, plates, rods, bars, coils, fittings and flanges",
      grades: "SS 202, SS 304, SS 316 and other grades where specified",
      cities: "Chennai, Tamil Nadu and nearby South India markets",
      angle: "clear product form, grade, size, quantity, finish, certificate need and delivery location"
    },
    "stainless-steel-for-commercial-kitchens": {
      products: "sheets, tubes, pipes, plates and fittings",
      grades: "SS 304 and SS 316",
      cities: "Chennai, Madurai, Pondicherry and hotel procurement markets",
      angle: "food contact use, cleanability, finish, fabrication method, welding and certificate expectation"
    },
    "stainless-steel-for-food-and-pharma": {
      products: "sheets, tubes, pipes, fittings, wire mesh and plates",
      grades: "SS 304, SS 316 and SS 316L",
      cities: "Chennai, Pondicherry, Cuddalore, Coimbatore and pharma or food processing belts",
      angle: "hygiene, corrosion exposure, welding, documentation, MTC and inspection expectations"
    },
    "stainless-steel-plates-buyer-guide": {
      products: "stainless steel plates, cut plates, base plates and industrial fabrication plates",
      grades: "SS 304 and SS 316",
      cities: "Chennai, Hosur, Trichy, Cuddalore and Tuticorin",
      angle: "plate thickness, size, cutting requirement, application, certificate need and transport planning"
    },
    "polished-stainless-steel-pipes-chennai": {
      products: "polished pipes, railing pipes, tubes and decorative stainless steel",
      grades: "SS 202, SS 304 and SS 316",
      cities: "Chennai, Pondicherry, Madurai and Salem",
      angle: "pipe diameter, thickness, polish quality, grade, length, quantity and installation environment"
    },
    "stainless-steel-perforated-sheets-wire-mesh": {
      products: "perforated sheets, wire mesh, filters, screens and guards",
      grades: "SS 304 and SS 316",
      cities: "Chennai, Tiruppur, Coimbatore and industrial processing locations",
      angle: "hole pattern, mesh opening, wire diameter, sheet size, finish, open area and application"
    },
    "stainless-steel-supply-tamil-nadu-cities": {
      products: "pipes, sheets, plates, rods, bars, fittings, fasteners and coils",
      grades: "SS 202, SS 304 and SS 316",
      cities: "Chennai, Coimbatore, Hosur, Trichy, Madurai, Salem, Tiruppur and Pondicherry",
      angle: "city, delivery route, product form, size, quantity, packing and transport booking"
    },
    "stainless-steel-material-test-certificate": {
      products: "pipes, sheets, plates, rods, bars, flanges and fittings",
      grades: "SS 304, SS 316, SS 316L and other certificate-led grades",
      cities: "Chennai, Tamil Nadu and nearby South India industrial buyers",
      angle: "MTC, mill certificate, third-party inspection, heat number and project documentation"
    },
    "stainless-steel-for-automobile-industries-tamil-nadu": {
      products: "rods, bars, sheets, plates, flats, fasteners, pipes and tubes",
      grades: "SS 304, SS 316 and SS 410",
      cities: "Ambattur, Sriperumbudur, Oragadam, Irungattukottai and Hosur",
      angle: "machining use, fixtures, maintenance, shopfloor equipment, fasteners and certificate needs"
    },
    "stainless-steel-supply-to-sricity-tada-tirupati": {
      products: "pipes, tubes, sheets, plates, rods, bars, fasteners and fittings",
      grades: "SS 304 and SS 316",
      cities: "Sricity, Tada, Renigunta and Tirupati",
      angle: "Chennai-side dispatch, factory procurement, maintenance needs, packing and delivery planning"
    },
    "stainless-steel-for-coastal-and-marine-use": {
      products: "pipes, plates, fasteners, fittings, flanges and sheets",
      grades: "SS 304, SS 316 and SS 316L",
      cities: "Chennai, Tuticorin, Pondicherry, Port Blair, Sri Lanka and Maldives",
      angle: "coastal exposure, marine maintenance, chloride environment, packing, documentation and grade selection"
    }
  };
  return map[post.slug] || {
    products: "pipes, sheets, plates, rods, bars and fittings",
    grades: "SS 202, SS 304 and SS 316",
    cities: "Chennai and Tamil Nadu",
    angle: "product form, grade, size, finish, quantity and delivery location"
  };
}

function buildBlogPages() {
  blogPosts.forEach((post) => {
    const focus = blogFocus(post);
    const faq = [
      { q: `How does this guide help stainless steel buyers?`, a: "It gives practical RFQ and material discussion points before contacting Bharat Metals." },
      { q: "Is this a substitute for engineering design advice?", a: "No. Critical applications should be checked with the project engineer or specification authority." },
      { q: "Can Bharat Metals review an enquiry related to this topic?", a: "Yes. Send product form, grade, size, quantity and delivery location for review." },
      { q: "Should certificate requirements be mentioned early?", a: "Yes. MTC, mill certificate or inspection requirements should be mentioned at quotation stage." }
    ];
    addGeneratedPage({
      slug: `blog/${post.slug}/`,
      type: "blog",
      title: `${post.title} | Bharat Metals Blog`,
      description: post.summary,
      h1: post.title,
      eyebrow: "Buyer guide",
      intro: post.summary,
      image: "assets/images/photos/locations/blog-stainless-steel-stockyard.webp",
      imageAlt: post.title,
      breadcrumbs: [{ name: "Blog", slug: "blog/" }],
      body:
        pageSection("Buyer summary", `${post.summary} Bharat Metals writes these notes for fabricators, contractors, traders, industrial buyers and project teams who want clearer stainless steel quotation conversations.`) +
        proseSection("What buyers should clarify first", [
          `Before asking for a quote, buyers should identify the actual application, exposure, product form and size details. For this topic, common discussion points include ${focus.angle}. When these details are missing, the quotation conversation usually slows down because the supplier must first clarify grade, dimension, finish, quantity and delivery expectation.`,
          `A useful RFQ should mention the required stainless steel products, likely grades, size or thickness, finish, quantity, certificate need and destination. If the buyer has a drawing, sample, schedule, make preference or previous purchase reference, that detail should be shared at the first stage.`
        ]) +
        proseSection("Product and grade context", [
          `This guide is most relevant to enquiries involving ${focus.products}. Buyers often compare ${focus.grades} depending on corrosion exposure, fabrication process, hygiene requirement, machining need, visible finish and project specification. Bharat Metals can review these details from Chennai and respond more practically when the buyer sends exact form and size information.`,
          "Grade suitability should not be decided only from a keyword search. SS 202, SS 304, SS 316, SS 316L, SS 310, SS 410 and SS 430 each have different commercial use cases, availability patterns and application considerations. Critical applications should always be checked with the project engineer, consultant or specification authority."
        ]) +
        proseSection("Chennai and dispatch relevance", [
          `Bharat Metals is based in Chennai and reviews enquiries connected with ${focus.cities}. For city-based requirements, transport planning depends on product length, weight, packing, urgency, certificate expectation and whether local delivery, door delivery, courier for small items or transport booking is suitable.`,
          "For nearby export enquiries such as Sri Lanka or Maldives, buyers should share destination, packing expectation, documentation requirement and quantity early. The website uses cautious export-enquiry wording and does not overstate export volume."
        ]) +
        pageSection("Practical guidance", "Start with the application and environment, then confirm product form, grade, size, finish, quantity, certificate requirement and delivery location. For Jindal make or other reputed mill material, buyers can mention make preference clearly; Bharat Metals treats it as a supply preference and does not make a brand dealership claim.") +
        proseSection("Final RFQ check before contacting Bharat Metals", [
          `Before sending the enquiry, convert the requirement into a short checklist: product form, grade, size, finish, quantity, delivery city, certificate requirement, packing need and required date. For ${focus.products}, even one missing dimension can change availability review, transport planning or processing discussion.`,
          "A clear first message helps Bharat Metals respond with fewer clarification calls. It also helps buyers compare quotations responsibly because grade, finish, certificate and delivery assumptions are visible from the beginning."
        ]) +
        pageSection("How to use this guide", "Use the article as a checklist before contacting a supplier. The better the RFQ details, the easier it is to review availability, packing, transport and documentation.", `<h3>Useful links</h3>${chips(["request-quote/", "stainless-steel/", "ss-304/", "ss-316/"], (item) => item)}`) +
        rfqBlock("stainless steel") +
        ctaBlock("stainless steel"),
      faq
    });
  });
}

function buildSiteMapPage(existingPages) {
  const groups = [
    ["Core Pages", ["core"]],
    ["Stainless Steel Product Forms", ["product-form"]],
    ["Stainless Steel Grades", ["grade"]],
    ["Grade + Product Pages", ["grade-form"]],
    ["City / Location Pages", ["city"]],
    ["City + Product Pages", ["city-product"]],
    ["Grade + City Pages", ["grade-city"]],
    ["Industry Pages", ["industry"]],
    ["Aluminium Pages", ["secondary-material"], (page) => page.slug.startsWith("aluminium")],
    ["Brass Pages", ["secondary-material"], (page) => page.slug.startsWith("brass")],
    ["Copper Pages", ["secondary-material"], (page) => page.slug.startsWith("copper")],
    ["Blog Pages", ["blog"]],
    ["Technical / Legacy Pages", ["technical", "legacy"]]
  ];
  const sectionHtml = groups
    .map(([title, types, filter]) => {
      const groupPages = existingPages.filter((page) => types.includes(page.type) && (!filter || filter(page)));
      if (!groupPages.length) return "";
      return hubSection("Sitemap", title, `${groupPages.length} published page${groupPages.length === 1 ? "" : "s"} in this group.`, chips(groupPages, (page) => page.slug, (page) => page.h1));
    })
    .join("");
  addGeneratedPage({
    slug: "site-map/",
    type: "core",
    title: "Sitemap | Bharat Metals",
    description: "Human-readable sitemap for Bharat Metals pages including products, grades, cities, industries, blog and technical pages.",
    h1: "Sitemap",
    intro: "Browse every published Bharat Metals page from one human-readable sitemap.",
    eyebrow: "Sitemap",
    image: "assets/images/photos/locations/blog-stainless-steel-stockyard.webp",
    body: sectionHtml + ctaBlock(),
    faq: [
      { q: "What is this sitemap for?", a: "This human sitemap helps visitors browse Bharat Metals product, grade, city, industry, blog and technical pages." },
      { q: "Is this different from sitemap.xml?", a: "Yes. This page is for people. sitemap.xml is kept separately for search engines." },
      { q: "Can I find grade pages here?", a: "Yes. Stainless steel grade pages are grouped under Stainless Steel Grades." },
      { q: "Can I find city and industry pages here?", a: "Yes. City, city-product, grade-city and industry pages are grouped separately." }
    ]
  });
}

function homepagePortfolioMenuHtml() {
  const groups = [
    { label: "Stainless Steel", href: "stainless-steel/", items: forms.map((form) => [form.name, `${form.slug}/`]) },
    { label: "Aluminium", href: "aluminium/", items: secondaryMaterials.aluminium.map((item) => [`Aluminium ${item}`, `aluminium-${slugify(item)}/`]) },
    { label: "Brass", href: "brass/", items: secondaryMaterials.brass.map((item) => [`Brass ${item}`, `brass-${slugify(item)}/`]) },
    { label: "Copper", href: "copper/", items: secondaryMaterials.copper.map((item) => [`Copper ${item}`, `copper-${slugify(item)}/`]) }
  ];
  return groups
    .map((group) => {
      const id = `portfolio-${slugify(group.label)}-flyout`;
      return `<div class="portfolio-item has-flyout">
                <div class="portfolio-row">
                  <a class="portfolio-parent" href="${group.href}">${escapeHtml(group.label)}</a>
                  <button class="flyout-toggle" type="button" aria-label="Toggle ${escapeHtml(group.label)} product links" aria-expanded="false" aria-controls="${id}"></button>
                </div>
                <div class="flyout-menu" id="${id}">
                  ${group.items.map(([label, href]) => `<a href="${href}">${escapeHtml(label)}</a>`).join("")}
                </div>
              </div>`;
    })
    .join("");
}

function homepageFooterProductLinks() {
  const links = [
    ["Stainless Steel Pipes", "stainless-steel-pipes/"],
    ["Stainless Steel Tubes", "stainless-steel-tubes/"],
    ["Stainless Steel Sheets", "stainless-steel-sheets/"],
    ["Stainless Steel Plates", "stainless-steel-plates/"],
    ["Stainless Steel Coils", "stainless-steel-coils/"],
    ["Stainless Steel Rods", "stainless-steel-rods/"],
    ["Stainless Steel Bars", "stainless-steel-bars/"],
    ["Stainless Steel Angles", "stainless-steel-angles/"],
    ["Stainless Steel Flats", "stainless-steel-flats/"],
    ["Stainless Steel Channels", "stainless-steel-channels/"],
    ["Stainless Steel Flanges", "stainless-steel-flanges/"],
    ["Stainless Steel Fittings", "stainless-steel-fittings/"],
    ["Stainless Steel Fasteners", "stainless-steel-fasteners/"],
    ["Wire Mesh", "stainless-steel-wire-mesh/"],
    ["Perforated Sheets", "stainless-steel-perforated-sheets/"]
  ];
  return `<ul>${links.map(([label, href]) => `<li><a href="${href}">${escapeHtml(label)}</a></li>`).join("")}</ul>`;
}

function homepageMaterialCards() {
  const cards = [
    {
      href: "stainless-steel/",
      className: "material-card material-primary",
      image: stainlessMaterialImage,
      alt: "Stainless steel pipes sheets and material stock",
      title: "Stainless Steel",
      text: "Stainless steel pipes, tubes, sheets, plates, coils, rods, bars, angles, flats, channels, flanges, fittings, fasteners, wire mesh and perforated sheets in regular commercial and industrial grades."
    },
    {
      href: "aluminium/",
      className: "material-card",
      image: materialImages.aluminium,
      alt: "Aluminium sheets plates and rods in a warehouse",
      title: "Aluminium",
      text: "Aluminium sheets, plates, coils, pipes, flats, rods and bars for fabrication, engineering, trading and commercial supply requirements. Share size, form, quantity and delivery location for quote support."
    },
    {
      href: "brass/",
      className: "material-card",
      image: materialImages.brass,
      alt: "Brass rods flats and pipes in a stockyard",
      title: "Brass",
      text: "Brass pipes, bush pipes, rods, bars and flats for machining, electrical, repair, fittings and fabrication enquiries. Availability can be reviewed based on size, form and quantity."
    },
    {
      href: "copper/",
      className: "material-card",
      image: materialImages.copper,
      alt: "Copper tubes rods flats and plates in a warehouse",
      title: "Copper",
      text: "Copper tubes, rods, bars, flats and plates for electrical, engineering, heat-transfer, fabrication and maintenance requirements. Send size, form, quantity and delivery location for review."
    }
  ];
  return cards
    .map(
      (card) =>
        `<a class="${card.className}" href="${card.href}"><img src="${card.image}" alt="${escapeHtml(card.alt)}" width="500" height="313" loading="lazy"><h3>${escapeHtml(card.title)}</h3><p>${escapeHtml(card.text)}</p></a>`
    )
    .join("\n            ");
}

function homepageFormCards() {
  const blurbs = {
    pipes: "Welded and seamless pipe enquiries by grade, size, schedule and quantity.",
    tubes: "Round, square and rectangular tube needs for fabrication and interiors.",
    sheets: "2B, mirror, matt, hairline and PVC coated sheet enquiries.",
    plates: "Plate supply for engineering, base plates, machinery and fabrication.",
    coils: "Coil and slit coil enquiries for commercial and downstream sheet use.",
    rods: "SS rod stock for machining, repair, fabrication and workshop use.",
    bars: "Round bars and bar stock for industrial and project requirements.",
    angles: "Angles for supports, frames, structures and general fabrication.",
    flats: "Flat bars for bracing, architectural work, repair and fabrication.",
    channels: "Channel sections for industrial frames and stainless structures.",
    flanges: "Flange requirements for piping, maintenance and engineering work.",
    fittings: "Elbows, tees, reducers and matching fittings by grade and size.",
    circles: "Circle requirements for vessels, fabrication and equipment makers.",
    fasteners: "Bolts, nuts and fastening needs for commercial supply.",
    "wire-mesh": "Mesh enquiries for guards, filters, partitions and industrial use.",
    "perforated-sheets": "Perforated sheet needs by hole pattern, thickness, grade and quantity."
  };
  return forms
    .map(
      (form) =>
        `<a class="form-card" href="${form.slug}/"><img src="${formImage(form)}" alt="${escapeHtml(form.name)} stock photo" width="500" height="313" loading="lazy"><h3>${escapeHtml(form.short)}</h3><p>${escapeHtml(blurbs[form.formSlug])}</p></a>`
    )
    .join("\n            ");
}

function homepageIndustryCards() {
  return industries
    .slice(0, 15)
    .map(
      (industry) =>
        `<a class="industry-card" href="industries/${industry.slug}/"><img src="${industryImage(industry)}" alt="${escapeHtml(industry.name)} stainless steel supply photo" width="500" height="313" loading="lazy"><h3>${escapeHtml(industry.name.replace(/ and /g, " & "))}</h3><p>${escapeHtml(`Typical enquiries: ${industry.products.join(", ")}.`)}</p></a>`
    )
    .join("\n            ");
}

function regionChips(names) {
  return names
    .map((name) => {
      const city = cityByName(name);
      return `<a href="${citySlug(city)}">${escapeHtml(name)}</a>`;
    })
    .join("");
}


function homepageSearchSectionHtml() {
  const phrases = homepageSearchPhrases.slice(0, 16);
  return `<section class="section-pad section-silver compact-section popular-searches" id="seo-searches" aria-labelledby="seo-title">
        <div class="container seo-grid">
          <div>
            <p class="eyebrow">Buyer search support</p>
            <h2 id="seo-title">Popular stainless steel enquiries we handle</h2>
            <p>Use these search chips to describe grade, product form, make, finish and delivery city before sending a stainless steel RFQ to Bharat Metals.</p>
          </div>
          <ul class="search-chip-grid" role="list" aria-label="Relevant stainless steel search phrases">
            ${phrases.map((phrase) => `<li class="search-chip">${escapeHtml(phrase)}</li>`).join("\n            ")}
          </ul>
        </div>
      </section>`;
}
function updateHomepageLinks() {
  const file = path.join(root, "index.html");
  let html = fs.readFileSync(file, "utf8");

  html = html.replace(
    /<div class="dropdown-menu" id="company-profile-menu">[\s\S]*?<\/div>/,
    `<div class="dropdown-menu" id="company-profile-menu">
              <a href="about-us/">About Us</a>
              <a href="mission-vision/">Mission and Vision</a>
              <a href="industries-we-serve/">Industries We Serve</a>
              <a href="locations-we-serve/">Locations We Serve</a>
              <a href="site-map/">Sitemap</a>
            </div>`
  );
  html = html.replace(
    /<div class="nav-group(?: portfolio-group)?">\s*<button class="nav-link nav-menu-button" type="button" aria-haspopup="true" aria-expanded="false" aria-controls="product-portfolio-menu">PRODUCT PORTFOLIO<\/button>[\s\S]*?<\/div>\s*<a class="nav-link" href="request-quote\/">/,
    `<div class="nav-group portfolio-group">
            <button class="nav-link nav-menu-button" type="button" aria-haspopup="true" aria-expanded="false" aria-controls="product-portfolio-menu">PRODUCT PORTFOLIO</button>
            <div class="dropdown-menu portfolio-menu" id="product-portfolio-menu">
              ${homepagePortfolioMenuHtml()}
            </div>
          </div>
          <a class="nav-link" href="request-quote/">`
  );
  html = html.replace(
    /<img src="assets\/images\/photos\/hero\/[^"]+" alt="Stainless steel pipes stockyard for Bharat Metals Chennai" width="[^"]+" height="[^"]+" fetchpriority="high">/,
    `<img src="${heroImage}" alt="Stainless steel pipes stockyard for Bharat Metals Chennai" width="1586" height="992" fetchpriority="high">`
  );
  html = html.replace(
    /<ul class="grade-chips" aria-label="Popular stainless steel grades">[\s\S]*?<\/ul>/,
    `<ul class="grade-chips" aria-label="Popular stainless steel grades">
              ${grades.map((grade) => `<li><a href="${grade.slug}/">${escapeHtml(grade.name.replace(/^SS /, ""))}</a></li>`).join("\n              ")}
            </ul>`
  );
  html = html.replace(
    /<div class="finish-grid">[\s\S]*?<\/div>/,
    `<div class="finish-grid">
            ${finishes.map((finish) => `<span>${escapeHtml(finish)}</span>`).join("")}
          </div>`
  );
  html = html.replace(
    /<section class="section-pad section-silver compact-section(?: popular-searches)?" id="seo-searches"[\s\S]*?<\/section>/,
    homepageSearchSectionHtml()
  );

  html = html.replace(
    /<section class="section-pad" id="materials" aria-labelledby="materials-title">[\s\S]*?<\/section>/,
    `<section class="section-pad" id="materials" aria-labelledby="materials-title">
        <div class="container">
          <div class="section-heading tight">
            <p class="eyebrow">Materials we supply</p>
            <h2 id="materials-title">Materials supplied by Bharat Metals</h2>
            <p>Stainless steel is the core strength of Bharat Metals, and buyers can also send enquiries for aluminium, brass and copper products used in commercial, fabrication, engineering, repair and trading requirements.</p>
          </div>
          <div class="materials-grid">
            ${homepageMaterialCards()}
          </div>
        </div>
      </section>`
  );

  html = html.replace(
    /<section class="section-pad section-silver" id="product-forms" aria-labelledby="forms-title">[\s\S]*?<\/section>/,
    `<section class="section-pad section-silver" id="product-forms" aria-labelledby="forms-title">
        <div class="container">
          <div class="section-heading tight">
            <p class="eyebrow">Product forms</p>
            <h2 id="forms-title">Stainless steel forms for Chennai fabrication and industry buyers.</h2>
          </div>
          <div class="forms-grid">
            ${homepageFormCards()}
          </div>
        </div>
      </section>`
  );

  html = html.replace(
    /<section class="section-pad section-graphite" id="regional-support"[\s\S]*?(?=\n\s*<section class="section-pad" id="industries")/,
    `<section class="section-pad section-graphite" id="regional-support" aria-labelledby="regions-title">
        <div class="container">
          <div class="section-heading tight section-heading-light">
            <p class="eyebrow eyebrow-light">Regional supply support</p>
            <h2 id="regions-title">Chennai, Tamil Nadu, nearby South India and selected nearby export enquiries.</h2>
          </div>
          <div class="region-groups">
            <section aria-label="Tamil Nadu and nearby cities">
              <h3>Tamil Nadu / Nearby</h3>
              <div class="chip-grid">${regionChips(["Chennai", "Coimbatore", "Madurai", "Trichy", "Salem", "Hosur", "Erode", "Tiruppur", "Vellore", "Tuticorin", "Tirunelveli", "Sriperumbudur", "Oragadam", "Ambattur", "Guindy", "Cuddalore", "Karur", "Ranipet", "Kanchipuram", "Pondicherry"])}</div>
            </section>
            <section aria-label="Kerala service locations">
              <h3>Kerala</h3>
              <div class="chip-grid">${regionChips(["Kochi", "Ernakulam", "Thrissur", "Kozhikode", "Trivandrum", "Palakkad"])}</div>
            </section>
            <section aria-label="Karnataka service locations">
              <h3>Karnataka</h3>
              <div class="chip-grid">${regionChips(["Bengaluru", "Mysuru", "Mangalore", "Hubballi", "Belagavi"])}</div>
            </section>
            <section aria-label="Andhra Pradesh and nearby service locations">
              <h3>Andhra Pradesh / Near Tamil Nadu</h3>
              <div class="chip-grid">${regionChips(["Tirupati", "Renigunta", "Chittoor", "Nellore", "Sricity", "Tada"])}</div>
            </section>
            <section aria-label="Andaman and nearby export enquiries">
              <h3>Andaman / Nearby Export</h3>
              <div class="chip-grid">${regionChips(["Port Blair", "Andaman and Nicobar Islands", "Sri Lanka", "Maldives"])}</div>
            </section>
          </div>
        </div>
      </section>
`
  );

  html = html.replace(
    /<section class="section-pad" id="industries" aria-labelledby="industries-title">[\s\S]*?<\/section>/,
    `<section class="section-pad" id="industries" aria-labelledby="industries-title">
        <div class="container">
          <div class="section-heading tight">
            <p class="eyebrow">Industries we serve</p>
            <h2 id="industries-title">Practical stainless steel supply for South India industries.</h2>
          </div>
          <div class="industry-grid">
            ${homepageIndustryCards()}
          </div>
        </div>
      </section>`
  );

  html = html.replace(`href="#technical-data">Technical Data`, `href="technical-data/">Technical Data`);
  html = html.replace(`href="#request-quote">Request a Quote`, `href="request-quote/">Request a Quote`);
  html = html.replace(`href="#seo-searches">Blog`, `href="blog/">Blog`);
  html = html.replace(
    /<ul>\s*<li><a href="#top">Home<\/a><\/li>[\s\S]*?<\/ul>\s*<\/div>\s*<div>\s*<h2>Products<\/h2>/,
    `<ul>
            <li><a href="#top">Home</a></li>
            <li><a href="#why-choose">Company Profile</a></li>
            <li><a href="#materials">Product Portfolio</a></li>
            <li><a href="#regional-support">Locations</a></li>
            <li><a href="technical-data/">Technical Data</a></li>
            <li><a href="request-quote/">Request a Quote</a></li>
            <li><a href="blog/">Blog</a></li>
            <li><a href="site-map/">Sitemap</a></li>
          </ul>
        </div>
        <div>
          <h2>Products</h2>`
  );
  html = html.replace(
    /<div>\s*<h2>Products<\/h2>\s*<ul>[\s\S]*?<\/ul>\s*<\/div>\s*<div>\s*<h2>Regions<\/h2>/,
    `<div>
          <h2>Products</h2>
          ${homepageFooterProductLinks()}
        </div>
        <div>
          <h2>Regions</h2>`
  );

  fs.writeFileSync(file, html);
}

function applyBuildMarker(html) {
  const escaped = escapeHtml(buildMarker);
  const meta = `    <meta name="bharat-metals-build" content="${escaped}">`;
  let next = html.replace(/\n\s*<meta name="bharat-metals-build" content="[^"]*">/g, "");
  next = next.replace(/\n\s*<!-- Bharat Metals build: [\s\S]*? -->/g, "");
  if (next.includes("</head>")) {
    next = next.replace("</head>", `${meta}\n  </head>`);
  }
  const comment = `    <!-- Bharat Metals build: ${escaped} -->`;
  if (next.includes("</body>")) {
    next = next.replace("</body>", `${comment}\n  </body>`);
  } else {
    next += `\n<!-- Bharat Metals build: ${escaped} -->\n`;
  }
  return next;
}

function applyBuildMarkersToFiles() {
  const htmlFiles = [];
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === ".git" || entry.name === "reports" || entry.name === "scripts" || entry.name === "archive" || entry.name === "docs") continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      if (entry.isFile() && entry.name.toLowerCase() === "index.html") htmlFiles.push(full);
    }
  }
  walk(root);
  for (const file of htmlFiles) {
    fs.writeFileSync(file, applyBuildMarker(fs.readFileSync(file, "utf8")));
  }
  return htmlFiles.length;
}
function writeSitemap(uniquePages) {
  const urls = [{ slug: "", priority: "1.0" }, ...uniquePages.map((page) => ({ slug: page.slug, priority: page.type === "core" ? "0.9" : page.type === "city" ? "0.7" : "0.8" }))];
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map(
      (item) =>
        `  <url>\n    <loc>${finalUrl(item.slug)}</loc>\n    <lastmod>${generatedAt}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${item.priority}</priority>\n  </url>`
    )
    .join("\n")}\n</urlset>\n`;
  fs.writeFileSync(path.join(root, "sitemap.xml"), sitemap);
  fs.writeFileSync(path.join(root, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${site.finalDomain}sitemap.xml\n`);
  return urls;
}

function writeGenerationReport(uniquePages, urls) {
  const byType = uniquePages.reduce((acc, page) => {
    acc[page.type] = (acc[page.type] || 0) + 1;
    return acc;
  }, {});
  fs.mkdirSync(path.join(root, "reports"), { recursive: true });
  fs.writeFileSync(
    path.join(root, "reports", "mega-sprint-pages.json"),
    JSON.stringify(
      {
        generatedAt,
        totalPages: uniquePages.length + 1,
        generatedPages: uniquePages.length,
        byType,
        urls: urls.map((item) => finalUrl(item.slug))
      },
      null,
      2
    )
  );
  return byType;
}

function generate() {
  buildCorePages();
  buildProductPages();
  buildGradePages();
  buildGradeFormPages();
  buildLocationPages();
  buildIndustryPages();
  buildSecondaryPages();
  buildCityProductPages();
  buildGradeCityPages();
  buildBlogPages();
  buildSiteMapPage(pages);

  const seen = new Set();
  const unique = [];
  for (const page of pages) {
    if (seen.has(page.slug)) throw new Error(`Duplicate page slug: ${page.slug}`);
    seen.add(page.slug);
    unique.push(page);
  }

  unique.forEach((page) => {
    const html = renderPage(site, page);
    const target = outPath(page.slug);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, html);
  });
  updateHomepageLinks();
  const markedFiles = applyBuildMarkersToFiles();
  const urls = writeSitemap(unique);
  const byType = writeGenerationReport(unique, urls);
  console.log(`Generated ${unique.length} pages plus homepage. Sitemap URLs: ${urls.length}. Build markers applied: ${markedFiles}`);
  console.log(JSON.stringify(byType, null, 2));
}

generate();
