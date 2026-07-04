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
  return `<section class="section-pad compact-section popular-searches enquiry-searches"><div class="container"><div class="section-heading tight"><p class="eyebrow">Popular enquiry searches</p><h2>${escapeHtml(
    title
  )}</h2><p>${escapeHtml(intro)}</p></div><div class="search-chip-grid" aria-label="${escapeHtml(title)}">${cleanPhrases
    .map((phrase) => `<span class="search-chip">${escapeHtml(phrase)}</span>`)
    .join("")}</div></div></section>`;
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

function faqHtml(faq) {
  return `<section class="section-pad"><div class="container faq-layout"><div><p class="eyebrow">Buyer answers</p><h2>Frequently asked questions</h2><p>Answers to common RFQ questions for this page.</p></div><div class="faq-list">${faq
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
      {
        q: "Is Bharat Metals a stainless steel dealer in Chennai?",
        a: "Yes. Bharat Metals is a Chennai stainless steel dealer, stockist, supplier and wholesaler established in 1986."
      },
      {
        q: "Does Bharat Metals manufacture stainless steel?",
        a: "No. Bharat Metals uses dealer, stockist, supplier and wholesaler language and does not claim manufacturer status."
      },
      {
        q: "Which products does Bharat Metals focus on?",
        a: "The core focus is stainless steel pipes, tubes, sheets, plates, coils, rods, bars, angles, flats, channels, flanges, fittings and related forms."
      },
      {
        q: "Which regions does Bharat Metals support?",
        a: "Bharat Metals is Chennai-based and reviews enquiries for Tamil Nadu, nearby South India markets, Andaman and Nicobar Islands, Sri Lanka and Maldives."
      },
      {
        q: "What should buyers send for a quotation?",
        a: "Send product form, grade, size, finish, quantity, delivery location, certificate needs and required date."
      },
      {
        q: "Can Bharat Metals discuss MTC or mill certificate?",
        a: "MTC, mill certificate and inspection support can be discussed for applicable stainless steel supplies."
      }
    ];
  }
  if (slug === "products/" || slug === "stainless-steel/") return productFaq(forms[0]).slice(0, 6);
  if (slug === "locations-we-serve/") return cityFaq(cityByName("Chennai"));
  if (slug === "industries-we-serve/") return industryFaq(industries[0]);
  if (slug === "request-quote/") {
    return [
      { q: "What is the fastest way to request a quotation?", a: "Send product form, grade, size, quantity, finish, delivery location and certificate requirement by WhatsApp or email." },
      { q: "Can I send a photo or drawing with the RFQ?", a: "Yes. Photos, drawings or sample references can help clarify size, finish and processing expectations." },
      { q: "Should I mention MTC or mill certificate in the first message?", a: "Yes. Mention certificate needs at RFQ stage so they can be checked with the material requirement." },
      { q: "Can transport booking be discussed?", a: "Transport booking, door delivery or courier for small items can be discussed based on location, quantity and packing." },
      { q: "Which payment modes are supported?", a: "UPI, Bank Transfer, Cheque and Cash are listed payment modes." },
      { q: "What are Bharat Metals working hours?", a: "Working hours are 10:00 AM to 6:00 PM, with Sunday as the weekly holiday." }
    ];
  }
  if (slug === "contact-us/" || slug === "contacts-us/") {
    return [
      { q: "How can I call Bharat Metals?", a: `Call ${site.phone} for stainless steel enquiries during working hours.` },
      { q: "Can I send a WhatsApp enquiry?", a: "Yes. Send product form, grade, size, quantity, finish and delivery location through WhatsApp." },
      { q: "Which email should I use for RFQ?", a: `${site.email} is the primary email for Bharat Metals enquiries.` },
      { q: "Where is Bharat Metals located?", a: site.addressLines.join(" ") },
      { q: "Can I open the Google Maps profile?", a: "Yes. The website links to the Bharat Metals Google Maps profile for location reference." },
      { q: "What details should I bring before visiting or calling?", a: "Keep product form, grade, size, quantity, finish, delivery location and certificate needs ready." }
    ];
  }
  return [
    { q: `What is covered on the ${h1} page?`, a: `This page gives buyer-focused information about ${h1} for Bharat Metals enquiries.` },
    { q: "How should buyers use this page?", a: "Use it to shortlist product form, grade, city, industry and RFQ details before contacting Bharat Metals." },
    { q: "Can Bharat Metals discuss documentation needs?", a: "MTC, mill certificate and inspection support can be discussed for applicable stainless steel supplies." },
    { q: "What details are needed for a quotation?", a: "Send product form, grade, size, quantity, finish, delivery location and required date." },
    { q: "Can Chennai dispatch and transport be discussed?", a: "Yes. Delivery and transport options can be reviewed after material availability and quantity are clear." },
    { q: "Is the content a substitute for engineering design advice?", a: "No. Critical applications should be checked with the project engineer or specification owner." }
  ];
}

function addGeneratedPage({ slug, type, title, description, h1, intro, eyebrow, image, imageAlt, breadcrumbs = [], body, faq }) {
  addPage({
    slug,
    type,
    title,
    description,
    h1,
    intro,
    eyebrow,
    image,
    imageAlt,
    breadcrumbs: [...breadcrumbs, { name: h1, slug }],
    body: body + faqHtml(faq),
    faq
  });
}

function buildCorePages() {
  addGeneratedPage({
    slug: "about-us/",
    type: "core",
    title: "About Bharat Metals | Stainless Steel Dealers in Chennai",
    description: "About Bharat Metals, a Chennai stainless steel dealer, stockist, supplier and wholesaler established in 1986.",
    h1: "About Bharat Metals",
    intro: "Bharat Metals is a Chennai stainless steel stockist, supplier, dealer and wholesaler established in 1986.",
    eyebrow: "Company profile",
    image: "assets/images/photos/locations/chennai-industrial.webp",
    imageAlt: "Bharat Metals Chennai stainless steel stock and warehouse supply",
    breadcrumbs: [],
    body:
      pageSection(
        "Chennai stainless steel supplier since 1986",
        "Bharat Metals works with fabricators, industries, contractors, traders and project buyers who need practical stainless steel supply from Chennai. The business focus remains stainless steel first, especially for Tamil Nadu and nearby South India markets."
      ) +
      pageSection(
        "How we work",
        "Buyers can send grade, form, size, finish, quantity, certificate and delivery details. Bharat Metals reviews availability, processing support, packing, transport booking and documentation needs without claiming manufacturer status."
      ) +
      pageSection(
        "Buyer-focused quotation process",
        "The team prefers clear RFQs because stainless steel supply depends on the exact form, size, grade, finish, quantity, certificate need and delivery location. Chennai buyers can discuss local delivery, while Tamil Nadu and nearby South India buyers can share transport or dispatch expectations before quotation review."
      ) +
      hubSection("Useful pages", "Explore Bharat Metals pages", "Use these hub pages to browse products, locations and industries.", cardGrid(["stainless-steel/", "products/", "locations-we-serve/", "industries-we-serve/"], (item) => item)) +
      ctaBlock(),
    faq: coreFaq("about-us/", "About Bharat Metals")
  });

  addGeneratedPage({
    slug: "mission-vision/",
    type: "core",
    title: "Mission and Vision | Bharat Metals Chennai",
    description: "Mission and vision of Bharat Metals for practical stainless steel supply support in Chennai and Tamil Nadu.",
    h1: "Mission and Vision",
    intro: "Bharat Metals focuses on practical stainless steel supply support for Chennai, Tamil Nadu and nearby markets.",
    eyebrow: "Company profile",
    image: "assets/images/photos/locations/chennai-industrial.webp",
    body:
      pageSection("Mission", "To help stainless steel buyers send clear requirements, choose suitable forms and grades, and receive practical supply guidance from an established Chennai market source.") +
      pageSection("Vision", "To keep Bharat Metals recognized as an established stainless steel dealer and stockist in Chennai with modern RFQ-first communication and responsible market coverage.") +
      ctaBlock(),
    faq: coreFaq("mission-vision/", "Mission and Vision")
  });

  addGeneratedPage({
    slug: "products/",
    type: "core",
    title: "Product Portfolio | Bharat Metals Chennai Stainless Steel Suppliers",
    description: "Browse Bharat Metals stainless steel product forms, grades, aluminium, brass, copper and popular stainless steel searches.",
    h1: "Product Portfolio",
    intro: "Browse stainless steel product forms, grades and commercial aluminium, brass and copper product enquiries at Bharat Metals.",
    eyebrow: "Product portfolio",
    image: stainlessMaterialImage,
    body:
      hubSection("Stainless steel forms", "Stainless Steel Product Forms", "Open product pages by form, size and quotation requirement.", cardGrid(forms, (form) => `${form.slug}/`, productIntro)) +
      hubSection("Stainless steel grades", "Stainless Steel Grades", "Browse grade pages for common stainless steel enquiries.", cardGrid(grades, (grade) => `${grade.slug}/`, (grade) => grade.summary)) +
      hubSection("Aluminium products", "Aluminium Products", "Commercial aluminium enquiries by form.", cardGrid(secondaryMaterials.aluminium, (item) => `aluminium-${slugify(item)}/`, (item) => `Aluminium ${item.toLowerCase()} enquiries by size, specification, quantity and delivery location.`)) +
      hubSection("Brass products", "Brass Products", "Commercial brass enquiries by form.", cardGrid(secondaryMaterials.brass, (item) => `brass-${slugify(item)}/`, (item) => `Brass ${item.toLowerCase()} enquiries by size, form, quantity and delivery location.`)) +
      hubSection("Copper products", "Copper Products", "Commercial copper enquiries by form.", cardGrid(secondaryMaterials.copper, (item) => `copper-${slugify(item)}/`, (item) => `Copper ${item.toLowerCase()} enquiries by size, form, quantity and delivery location.`)) +
      hubSection("Popular searches", "Popular Stainless Steel Searches", "Direct links to common grade, city and product combinations.", chips([...forms.slice(0, 8), ...grades.slice(0, 5), cityByName("Chennai"), cityByName("Coimbatore")], (item) => (item.formSlug ? `${item.slug}/` : item.id ? `${item.slug}/` : citySlug(item)))) +
      ctaBlock(),
    faq: coreFaq("products/", "Product Portfolio")
  });

  addGeneratedPage({
    slug: "stainless-steel/",
    type: "core",
    title: "Stainless Steel Product Forms and Grades | Bharat Metals Chennai",
    description: "Stainless steel products, grades, cities, industries and popular combinations from Bharat Metals in Chennai.",
    h1: "Stainless Steel Products",
    intro: "Bharat Metals focuses on stainless steel pipes, tubes, sheets, plates, coils, rods, bars, flanges, fittings and related forms.",
    eyebrow: "Stainless steel",
    image: stainlessMaterialImage,
    body:
      pageSection("Stainless steel first", "Stainless steel remains the core supply focus. Bharat Metals supports regular enquiries for SS 202, SS 304, SS 316 and other grades across forms used by Chennai and Tamil Nadu industries.") +
      hubSection("Browse by product form", "Browse by Product Form", "Open product form pages for detailed RFQ guidance.", cardGrid(forms, (form) => `${form.slug}/`, productIntro)) +
      hubSection("Browse by grade", "Browse by Grade", "Browse grade pages for common stainless steel buying questions.", cardGrid(grades, (grade) => `${grade.slug}/`, (grade) => grade.summary)) +
      hubSection("Browse by city", "Browse by City", "Open location pages for Chennai, Tamil Nadu and nearby markets.", cardGrid(locations.slice(0, 24), citySlug, (city) => `${city.region}: ${city.profile}.`)) +
      hubSection("Browse by industry", "Browse by Industry", "Open industry pages for product and grade relevance.", cardGrid(industries, (industry) => `industries/${industry.slug}/`, (industry) => `Typical enquiries: ${industry.products.join(", ")}.`)) +
      hubSection("Popular combinations", "Browse Popular Combinations", "Useful grade-form, city-product and grade-city entry points.", chips([`${grades[1].slug}-pipes/`, `${grades[4].slug}-pipes/`, `${grades[1].slug}-sheets/`, `stainless-steel-pipes-chennai/`, `stainless-steel-sheets-coimbatore/`, `ss-304-suppliers-chennai/`, `ss-316-suppliers-hosur/`], (item) => item)) +
      ctaBlock(),
    faq: coreFaq("stainless-steel/", "Stainless Steel Products")
  });

  addGeneratedPage({
    slug: "industries-we-serve/",
    type: "core",
    title: "Industries We Serve | Bharat Metals Stainless Steel Chennai",
    description: "Industries served by Bharat Metals for stainless steel supply in Chennai, Tamil Nadu and nearby South India.",
    h1: "Industries We Serve",
    intro: "Bharat Metals supports stainless steel enquiries for fabrication, engineering, kitchen equipment, pharma, food processing, marine and other industries.",
    eyebrow: "Industries",
    image: "assets/images/photos/industries/industrial-plant.webp",
    body: hubSection("Industry pages", "Browse All Industry Pages", "Every industry card opens a detailed page with products, grades, RFQ notes and FAQs.", cardGrid(industries, (industry) => `industries/${industry.slug}/`, (industry) => `Typical enquiries: ${industry.products.join(", ")}. Common grades: ${industry.grades.join(", ")}.`)) + ctaBlock(),
    faq: coreFaq("industries-we-serve/", "Industries We Serve")
  });

  const byRegion = (region) => locations.filter((city) => city.region === region);
  const chennaiAreas = ["Chennai", "George Town Chennai", "Parrys Chennai", "Mookernallamuthu Street Chennai", "Armenian Street Chennai", "Ambattur", "Guindy", "Manali", "Ennore", "Sriperumbudur", "Oragadam", "Irungattukottai"].map(cityByName);
  addGeneratedPage({
    slug: "locations-we-serve/",
    type: "core",
    title: "Locations We Serve | Stainless Steel Suppliers Tamil Nadu",
    description: "Bharat Metals Chennai supports stainless steel enquiries across Tamil Nadu, nearby South India, Andaman and nearby export markets.",
    h1: "Locations We Serve",
    intro: "Bharat Metals is Chennai-based and supports stainless steel enquiries across Tamil Nadu and nearby South India markets.",
    eyebrow: "Locations",
    image: "assets/images/photos/locations/tamil-nadu-logistics.webp",
    body:
      pageSection("Supply support from Chennai", "Bharat Metals does not claim branch offices in other cities. Enquiries are reviewed from Chennai based on product availability, quantity and logistics feasibility.") +
      hubSection("Tamil Nadu", "Tamil Nadu City Grid", "Browse Tamil Nadu stainless steel supply pages.", chips(byRegion("Tamil Nadu"), citySlug, (city) => city.name)) +
      hubSection("Chennai", "Chennai Industrial Areas Grid", "Direct links to Chennai and nearby industrial procurement areas.", chips(chennaiAreas, citySlug, (city) => city.name)) +
      hubSection("Pondicherry", "Pondicherry Region", "Pondicherry and Puducherry pages for coastal and industrial buyers.", chips([...byRegion("Pondicherry"), ...byRegion("Puducherry")], citySlug, (city) => city.name)) +
      hubSection("Kerala", "Kerala Grid", "Nearby South India enquiries from Kerala can be reviewed from Chennai.", chips(byRegion("Kerala"), citySlug, (city) => city.name)) +
      hubSection("Karnataka", "Karnataka Grid", "Karnataka enquiries can be reviewed from Chennai based on availability and logistics.", chips(byRegion("Karnataka"), citySlug, (city) => city.name)) +
      hubSection("Andhra Pradesh", "Andhra Pradesh Near Tamil Nadu Grid", "Sricity, Tada, Renigunta, Tirupati and nearby Andhra Pradesh supply pages.", chips(byRegion("Andhra Pradesh"), citySlug, (city) => city.name)) +
      hubSection("Andaman", "Andaman and Nicobar", "Island enquiries can be reviewed with packing and logistics details.", chips(byRegion("Andaman and Nicobar Islands"), citySlug, (city) => city.name)) +
      hubSection("Nearby export", "Sri Lanka and Maldives Export Enquiries", "Nearby export enquiries can be reviewed without overstating export volume.", chips(byRegion("Nearby export"), citySlug, (city) => city.name)) +
      ctaBlock(),
    faq: coreFaq("locations-we-serve/", "Locations We Serve")
  });

  addGeneratedPage({
    slug: "request-quote/",
    type: "core",
    title: "Request a Stainless Steel Quote | Bharat Metals Chennai",
    description: "Send product form, grade, size, finish, quantity and delivery location to Bharat Metals for a stainless steel quotation.",
    h1: "Request a Stainless Steel Quote",
    intro: "Send product form, grade, size, finish, quantity and delivery location to Bharat Metals for a stainless steel quotation.",
    eyebrow: "RFQ",
    image: stainlessMaterialImage,
    body: rfqBlock() + ctaBlock(),
    faq: coreFaq("request-quote/", "Request a Stainless Steel Quote")
  });

  addGeneratedPage({
    slug: "contact-us/",
    type: "core",
    title: "Contact Bharat Metals | Stainless Steel Dealers Chennai",
    description: "Contact Bharat Metals in Chennai for stainless steel pipes, sheets, plates, rods, bars, flanges and fittings.",
    h1: "Contact Bharat Metals",
    intro: "Contact Bharat Metals in Chennai for stainless steel pipes, sheets, plates, rods, bars, flanges and fittings.",
    eyebrow: "Contact",
    image: "assets/images/photos/locations/chennai-industrial.webp",
    body: pageSection("Chennai address", site.addressLines.join(" ")) + ctaBlock(),
    faq: coreFaq("contact-us/", "Contact Bharat Metals")
  });

  addGeneratedPage({
    slug: "technical-data/",
    type: "technical",
    title: "Technical Data | Stainless Steel Buyer Reference",
    description: "Technical reference hub for stainless steel grades, finishes, RFQ details and buyer checklist pages.",
    h1: "Technical Data",
    intro: "Technical reference hub for stainless steel grades, finishes, RFQ details and buyer checklist pages.",
    eyebrow: "Technical data",
    image: stainlessMaterialImage,
    body:
      pageSection(
        "Technical notes",
        "This section gives buyer-friendly reference content. It avoids unsupported engineering claims and asks buyers to share application, grade, size and certificate needs.",
        dataTable(
          ["Reference", "Use"],
          [
            ["Grades", "Compare SS 202, SS 304, SS 316 and other common grades."],
            ["Finishes", "Describe 2B, No. 1, BA, mirror, matt, hairline, brush and PVC coated sheet needs."],
            ["Certificates", "Ask for MTC, mill certificate or inspection where applicable."]
          ]
        )
      ) +
      hubSection("Grade links", "Open Grade Pages", "Use these for grade-specific buying notes.", chips(grades, (grade) => `${grade.slug}/`)) +
      ctaBlock(),
    faq: coreFaq("technical-data/", "Technical Data")
  });

  addGeneratedPage({
    slug: "blog/",
    type: "core",
    title: "Bharat Metals Blog | Stainless Steel Buyer Guides",
    description: "Buyer guides for stainless steel grades, product forms, finishes, certificates and city supply support.",
    h1: "Bharat Metals Blog",
    intro: "Buyer guides for stainless steel grades, product forms, finishes, certificates and city supply support.",
    eyebrow: "Blog",
    image: "assets/images/photos/locations/blog-stainless-steel-stockyard.webp",
    body: hubSection("Blog articles", "Buyer Guides", "Open practical stainless steel buying notes.", cardGrid(blogPosts, (post) => `blog/${post.slug}/`, (post) => post.summary, (post) => post.title)) + ctaBlock(),
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
      pageSection(`${title} supply support`, materialIntros[material]) +
      hubSection(`${title} products`, `Browse ${title} Products`, `Open ${title.toLowerCase()} product enquiry pages by form.`, cardGrid(secondaryMaterials[material], (item) => `${material}-${slugify(item)}/`, (item) => `${title} ${item.toLowerCase()} enquiries by size, specification, quantity and delivery location.`)) +
      rfqBlock(title.toLowerCase()) +
      ctaBlock(title.toLowerCase()),
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
        pageSection("Grade comparison note", "SS 202, SS 304, SS 316 and other grades should be compared by application, corrosion exposure, finish, fabrication and buyer specification. Critical applications should be checked with the project engineer or specification owner.") +
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
      { q: "Is this a substitute for engineering design advice?", a: "No. Critical applications should be checked with the project engineer or specification owner." },
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
          "Grade suitability should not be decided only from a keyword search. SS 202, SS 304, SS 316, SS 316L, SS 310, SS 410 and SS 430 each have different commercial use cases, availability patterns and application considerations. Critical applications should always be checked with the project engineer, consultant or specification owner."
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
          <div class="search-chip-grid" aria-label="Relevant stainless steel search phrases">
            ${phrases.map((phrase) => `<span class="search-chip">${escapeHtml(phrase)}</span>`).join("\n            ")}
          </div>
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
