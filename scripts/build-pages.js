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
const generatedAt = "2026-07-03";
const pages = [];

const materialNames = {
  aluminium: "Aluminium",
  brass: "Brass",
  copper: "Copper"
};

const materialImages = {
  aluminium: "assets/images/photos/materials/aluminium.webp",
  brass: "assets/images/photos/materials/brass.webp",
  copper: "assets/images/photos/materials/copper.webp"
};

const materialIntros = {
  aluminium:
    "Bharat Metals also supplies aluminium sheets, plates, coils, pipes, flats, rods and bars for commercial, fabrication, engineering and trading requirements. Buyers can share size, grade/specification, quantity and delivery location for availability and quotation support.",
  brass:
    "Bharat Metals also supplies brass pipes, bush pipes, rods, bars and flats for machining, electrical, fabrication, fittings, repair and trading requirements. Buyers can share size, form, quantity and delivery location for quotation support.",
  copper:
    "Bharat Metals also supplies copper tubes, rods, bars, flats and plates for electrical, engineering, fabrication, heat-transfer, repair and trading requirements. Buyers can share size, form, quantity and delivery location for quotation support."
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
        `<article class="page-card"><h3><a href="${makeSlug(item)}">${escapeHtml(label(item))}</a></h3><p>${escapeHtml(
          text ? text(item) : "Share product form, grade, size, quantity and delivery location for a quotation."
        )}</p></article>`
    )
    .join("")}</div>`;
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
  return `<section class="section-pad"><div class="container faq-layout"><div><p class="eyebrow">Buyer answers</p><h2>Frequently asked questions</h2><p>Short answers for procurement teams, fabricators and project buyers.</p></div><div class="faq-list">${faq
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

function productIntro(form) {
  return `Bharat Metals supports ${form.name.toLowerCase()} enquiries for Chennai, Tamil Nadu and nearby South India buyers. Share ${form.specs}, quantity, delivery location and certificate needs so the team can review practical supply and dispatch options.`;
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
      a: `Send ${form.specs}, grade, quantity, finish, delivery location, certificate requirement and required date.`
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
      a: `Yes. Include cutting, polishing, PVC coating, packing or other service needs in the RFQ so they can be reviewed with the material requirement.`
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
      a: `Send ${form.specs}, quantity, finish, delivery location and certificate requirement.`
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
      a: `Send ${form.specs}, grade, quantity, finish, delivery location and certificate needs.`
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
    image: "assets/images/photos/materials/stainless-steel.webp",
    body:
      hubSection("Stainless steel forms", "Stainless Steel Product Forms", "Open product pages by form, size and quotation requirement.", cardGrid(forms, (form) => `${form.slug}/`, productIntro)) +
      hubSection("Stainless steel grades", "Stainless Steel Grades", "Open grade pages for common stainless steel enquiries.", cardGrid(grades, (grade) => `${grade.slug}/`, (grade) => grade.summary)) +
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
    image: "assets/images/photos/materials/stainless-steel.webp",
    body:
      pageSection("Stainless steel first", "Stainless steel remains the core supply focus. Bharat Metals supports regular enquiries for SS 202, SS 304, SS 316 and other grades across forms used by Chennai and Tamil Nadu industries.") +
      hubSection("Browse by product form", "Browse by Product Form", "Open product form pages for detailed RFQ guidance.", cardGrid(forms, (form) => `${form.slug}/`, productIntro)) +
      hubSection("Browse by grade", "Browse by Grade", "Open grade pages for common stainless steel buying questions.", cardGrid(grades, (grade) => `${grade.slug}/`, (grade) => grade.summary)) +
      hubSection("Browse by city", "Browse by City", "Open location pages for Chennai, Tamil Nadu and nearby markets.", cardGrid(locations.slice(0, 24), citySlug, (city) => `${city.region}: ${city.profile}.`)) +
      hubSection("Browse by industry", "Browse by Industry", "Open industry pages for product and grade relevance.", cardGrid(industries, (industry) => `industries/${industry.slug}/`, (industry) => `Common products: ${industry.products.join(", ")}.`)) +
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
    body: hubSection("Industry pages", "Browse All Industry Pages", "Every industry card opens a detailed page with products, grades, RFQ notes and FAQs.", cardGrid(industries, (industry) => `industries/${industry.slug}/`, (industry) => `Common products: ${industry.products.join(", ")}. Common grades: ${industry.grades.join(", ")}.`)) + ctaBlock(),
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
    image: "assets/images/photos/materials/stainless-steel.webp",
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
    image: "assets/images/photos/materials/stainless-steel.webp",
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
      image: "assets/images/photos/materials/stainless-steel.webp",
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
    const gradeRows = grades.map((grade) => [grade.name, `${form.short} enquiries can be reviewed when size, finish, quantity and application suit the grade.`]);
    addGeneratedPage({
      slug: `${form.slug}/`,
      type: "product-form",
      title: `${form.name} in Chennai | Bharat Metals`,
      description: `${form.name} suppliers in Chennai for Tamil Nadu buyers. Share ${form.specs}, grade, quantity and delivery location.`,
      h1: `${form.name} Suppliers in Chennai`,
      eyebrow: "Stainless steel product",
      intro: productIntro(form),
      image: formImage(form),
      imageAlt: `${form.name} stock for Bharat Metals buyers`,
      breadcrumbs: [{ name: "Products", slug: "products/" }],
      body:
        pageSection("Product overview", `${form.name} are requested by fabricators, contractors, traders and industrial buyers. Bharat Metals reviews enquiries with grade, size, finish, quantity and transport details before confirming availability.`) +
        pageSection("Applications", `${form.name} are commonly discussed for ${form.uses.join(", ")}. The exact grade and finish should be chosen based on exposure, fabrication method, hygiene needs and buyer specification.`) +
        pageSection("Grades commonly requested", `Common grades for ${form.name.toLowerCase()} include SS 202, SS 304, SS 316 and other grades based on specification.`, dataTable(["Grade", "How buyers discuss it"], gradeRows)) +
        pageSection("Finish and service options", "Finish and processing needs should be included in the RFQ.", `<h3>Common finish options</h3>${list(finishes.slice(0, 10))}<h3>Service support</h3>${list(services.slice(0, 10))}`) +
        hubSection("Grade and form pages", `Open ${form.short} by Grade`, `Direct links for ${form.short.toLowerCase()} in common stainless steel grades.`, cardGrid(grades, (grade) => `${grade.slug}-${form.formSlug}/`, (grade) => `${grade.name} ${form.short.toLowerCase()} enquiries by size, finish and quantity.`)) +
        hubSection(
          "City links",
          `Popular ${form.short} City Pages`,
          "Direct city-product pages where generated, otherwise location pages for the same supply markets.",
          chips(
            priorityCities.map(cityByName),
            (city) => (priorityForms.includes(form.formSlug) ? `${form.slug}-${slugify(city.name)}/` : citySlug(city)),
            (city) => city.name
          )
        ) +
        rfqBlock(form.short.toLowerCase()) +
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
      intro: `${grade.name} is ${grade.summary}. Bharat Metals reviews ${grade.name} requirements from Chennai with form, size, finish, quantity and certificate details.`,
      image: "assets/images/photos/materials/stainless-steel.webp",
      imageAlt: `${grade.name} stainless steel material stock`,
      breadcrumbs: [{ name: "Stainless Steel", slug: "stainless-steel/" }],
      body:
        pageSection("Grade overview", `${grade.name} material enquiries should include application, form, size, finish and quantity. ${grade.notes}`) +
        hubSection("Available forms", `${grade.name} Product Forms`, `Open ${grade.name} pages by stainless steel form.`, cardGrid(forms, (form) => `${grade.slug}-${form.formSlug}/`, (form) => `${grade.name} ${form.short.toLowerCase()} enquiry support.`)) +
        hubSection("Common industries", `Industries Discussing ${grade.name}`, `Common buyer groups for ${grade.name} enquiries.`, cardGrid(industries.slice(0, 12), (industry) => `industries/${industry.slug}/`, (industry) => `Products include ${industry.products.join(", ")}.`)) +
        hubSection(
          "City links",
          `${grade.name} City Pages`,
          `Open ${grade.name} grade-city pages where generated, otherwise the matching location pages.`,
          chips(
            gradeCityPriority.map(cityByName),
            (city) => (["202", "304", "316"].includes(grade.id) ? `${grade.slug}-suppliers-${slugify(city.name)}/` : citySlug(city)),
            (city) => city.name
          )
        ) +
        pageSection("Grade comparison note", "SS 202, SS 304, SS 316 and other grades should be compared by application, corrosion exposure, finish, fabrication and buyer specification. Critical applications should be checked with the project engineer or specification owner.") +
        rfqBlock(grade.name) +
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
        intro: `${subject} enquiries are reviewed by Bharat Metals from Chennai for fabricators, contractors, traders and industrial buyers. Share ${form.specs} for a practical response.`,
        image: formImage(form),
        imageAlt: `${subject} stock and material supply`,
        breadcrumbs: [
          { name: grade.name, slug: `${grade.slug}/` },
          { name: form.name, slug: `${form.slug}/` }
        ],
        body:
          pageSection(`${subject} overview`, `${grade.name} is ${grade.summary}. In ${form.short.toLowerCase()} form, buyers usually need clear size, finish, quantity and application details before availability can be reviewed.`) +
          pageSection("Applications and industries", `${subject} may be requested for ${form.uses.join(", ")}. Common buyer groups include fabricators, engineering companies, machine shops, contractors, traders and maintenance teams.`, `<h3>Related industries</h3>${chips(industries.slice(0, 8), (industry) => `industries/${industry.slug}/`)}`) +
          pageSection("Supply note", "Bharat Metals is Chennai-based and supports Tamil Nadu and nearby South India enquiries depending on product availability, quantity and transport feasibility.") +
          rfqBlock(subject) +
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
      intro: `Bharat Metals supports enquiries and dispatches from Chennai to buyers in ${city.name} based on product availability, quantity and logistics feasibility.`,
      image: cityImage(city),
      imageAlt: `Stainless steel supply and dispatch support for ${city.name}`,
      breadcrumbs: [{ name: "Locations", slug: "locations-we-serve/" }],
      body:
        pageSection(`${city.name} industrial profile`, `${city.name} has ${city.profile}. Buyers commonly ask for stainless steel by form, grade, size and finish rather than only by generic material name.`) +
        pageSection(`Popular stainless steel products for ${city.name}`, `For ${city.name}, Bharat Metals commonly reviews enquiries for ${city.products.join(", ")}.`, `<h3>Related products</h3>${chips(forms.filter((form) => city.products.some((product) => form.short.includes(product) || product.includes(form.short))).concat(forms.slice(0, 4)).slice(0, 8), (form) => `${form.slug}/`, (form) => form.short)}`) +
        pageSection(`Grades commonly discussed for ${city.name}`, `Grades often discussed for ${city.name} include ${city.grades.join(", ")}.`, `<h3>Grade pages</h3>${chips(grades.slice(0, 6), (grade) => `${grade.slug}/`, (grade) => grade.name)}`) +
        pageSection("Delivery and transport guidance", exportNote) +
        hubSection("Nearby cities", `Nearby ${city.region} Pages`, `Related city pages for buyers comparing dispatch options.`, chips(relatedCities(city), citySlug, (item) => item.name)) +
        rfqBlock(`stainless steel for ${city.name}`) +
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
      intro: `Bharat Metals reviews stainless steel enquiries for ${industry.name} buyers from Chennai with practical product, grade, finish and documentation guidance.`,
      image: industryImage(industry),
      imageAlt: `${industry.name} stainless steel supply visual`,
      breadcrumbs: [{ name: "Industries", slug: "industries-we-serve/" }],
      body:
        pageSection("Industry overview", `${industry.name} buyers may need stainless steel for fabrication, maintenance, equipment, installation or project supply. Bharat Metals helps buyers describe requirements clearly before checking availability.`) +
        pageSection("Product relevance", `Common products for ${industry.name} include ${industry.products.join(", ")}.`, `<h3>Related product forms</h3>${chips(forms.filter((form) => industry.products.some((product) => form.short.includes(product) || product.includes(form.short))).concat(forms.slice(0, 4)).slice(0, 8), (form) => `${form.slug}/`, (form) => form.short)}`) +
        pageSection("Grades commonly discussed", `Common grades for ${industry.name} include ${industry.grades.join(", ")}.`, `<h3>Grade pages</h3>${chips(grades.slice(0, 6), (grade) => `${grade.slug}/`, (grade) => grade.name)}`) +
        hubSection("City relevance", "Relevant Supply Regions", "Open common city pages for Chennai-led supply discussions.", chips(["Chennai", "Ambattur", "Sriperumbudur", "Oragadam", "Coimbatore", "Hosur", "Pondicherry", "Tiruppur"].map(cityByName), citySlug, (city) => city.name)) +
        rfqBlock(industry.name) +
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
          pageSection(`${city.name} relevance`, `${city.name} has ${city.profile}. ${form.name} may be requested by fabricators, contractors, industries, traders and project buyers depending on the application.`) +
          pageSection("Grades and RFQ notes", `Common grades discussed for ${city.name} include ${city.grades.join(", ")}. Send ${form.specs}, quantity, finish and delivery location for a practical quotation response.`) +
          rfqBlock(subject) +
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
        image: "assets/images/photos/materials/stainless-steel.webp",
        imageAlt: `${subject} stainless steel material`,
        breadcrumbs: [
          { name: grade.name, slug: `${grade.slug}/` },
          { name: city.name, slug: citySlug(city) }
        ],
        body:
          pageSection(`${grade.name} for ${city.name}`, `${city.name} has ${city.profile}. ${grade.name} is ${grade.summary}. Buyers should send the exact form, size and application so the enquiry can be reviewed responsibly.`) +
          pageSection("Forms available", `${grade.name} enquiries can be discussed for ${forms.slice(0, 10).map((form) => form.short).join(", ")} and other forms depending on availability.`, chips(forms.slice(0, 10), (form) => `${grade.slug}-${form.formSlug}/`, (form) => form.short)) +
          rfqBlock(subject) +
          ctaBlock(subject),
        faq: gradeCityFaq(grade, city)
      });
    });
  });
}

function buildBlogPages() {
  blogPosts.forEach((post) => {
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
        pageSection("Practical guidance", "Start with the application and environment, then confirm product form, grade, size, finish, quantity, certificate requirement and delivery location. For Jindal make or other reputed mill material, availability can be discussed based on requirement; no authorized dealer claim is made.") +
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

function homepageMaterialCards() {
  const cards = [
    {
      href: "stainless-steel/",
      className: "material-card material-primary",
      image: "assets/images/photos/materials/stainless-steel.webp",
      alt: "Stainless steel pipes sheets and material stock",
      title: "Stainless Steel",
      text: "Core focus: pipes, tubes, sheets, plates, coils, rods, bars, angles, flanges, fittings and related forms in regular grades."
    },
    {
      href: "aluminium/",
      className: "material-card",
      image: materialImages.aluminium,
      alt: "Aluminium sheets plates and rods in a warehouse",
      title: "Aluminium",
      text: "Aluminium sheets, plates, coils, pipes, flats, rods and bars for commercial, fabrication, engineering and trading requirements."
    },
    {
      href: "brass/",
      className: "material-card",
      image: materialImages.brass,
      alt: "Brass rods flats and pipes in a stockyard",
      title: "Brass",
      text: "Brass pipes, bush pipes, rods, bars and flats for machining, electrical, fabrication, fittings, repair and trading requirements."
    },
    {
      href: "copper/",
      className: "material-card",
      image: materialImages.copper,
      alt: "Copper tubes rods flats and plates in a warehouse",
      title: "Copper",
      text: "Copper tubes, rods, bars, flats and plates for electrical, engineering, fabrication, heat-transfer, repair and trading requirements."
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
        `<a class="industry-card" href="industries/${industry.slug}/"><img src="${industryImage(industry)}" alt="${escapeHtml(industry.name)} stainless steel supply photo" width="500" height="313" loading="lazy"><h3>${escapeHtml(industry.name.replace(/ and /g, " & "))}</h3><p>${escapeHtml(`Common products: ${industry.products.join(", ")}.`)}</p></a>`
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
    /<div class="dropdown-menu" id="product-portfolio-menu">[\s\S]*?<\/div>/,
    `<div class="dropdown-menu" id="product-portfolio-menu">
              <a href="stainless-steel/">Stainless Steel</a>
              <a href="stainless-steel-pipes/">Stainless Steel Pipes</a>
              <a href="stainless-steel-sheets/">Stainless Steel Sheets</a>
              <a href="stainless-steel-plates/">Stainless Steel Plates</a>
              <a href="stainless-steel-coils/">Stainless Steel Coils</a>
              <a href="stainless-steel-rods/">Stainless Steel Rods &amp; Bars</a>
              <a href="stainless-steel-flanges/">Flanges &amp; Fittings</a>
              <a href="aluminium/">Aluminium</a>
              <a href="brass/">Brass</a>
              <a href="copper/">Copper</a>
            </div>`
  );
  html = html.replace(
    /<ul class="grade-chips" aria-label="Popular stainless steel grades">[\s\S]*?<\/ul>/,
    `<ul class="grade-chips" aria-label="Popular stainless steel grades">
              ${grades.map((grade) => `<li><a href="${grade.slug}/">${escapeHtml(grade.name.replace(/^SS /, ""))}</a></li>`).join("\n              ")}
            </ul>`
  );

  html = html.replace(
    /<section class="section-pad" id="materials" aria-labelledby="materials-title">[\s\S]*?<\/section>/,
    `<section class="section-pad" id="materials" aria-labelledby="materials-title">
        <div class="container">
          <div class="section-heading tight">
            <p class="eyebrow">Materials we supply</p>
            <h2 id="materials-title">Stainless steel first, with aluminium, brass and copper supply support.</h2>
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
  html = html.replace(`</ul>\n        </div>\n        <div>\n          <h2>Products</h2>`, `<li><a href="site-map/">Sitemap</a></li></ul>\n        </div>\n        <div>\n          <h2>Products</h2>`);

  fs.writeFileSync(file, html);
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
  const urls = writeSitemap(unique);
  const byType = writeGenerationReport(unique, urls);
  console.log(`Generated ${unique.length} pages plus homepage. Sitemap URLs: ${urls.length}`);
  console.log(JSON.stringify(byType, null, 2));
}

generate();
