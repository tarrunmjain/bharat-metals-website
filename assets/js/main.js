(function () {
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector("#site-nav");
  const navGroups = Array.from(document.querySelectorAll(".nav-group"));
  const portfolioItems = Array.from(document.querySelectorAll(".portfolio-item"));

  function closeGroups(except) {
    navGroups.forEach(function (group) {
      if (group !== except) {
        group.classList.remove("is-open");
        const button = group.querySelector(".nav-menu-button");
        if (button) {
          button.setAttribute("aria-expanded", "false");
        }
      }
    });
  }

  function closePortfolioItems(except) {
    portfolioItems.forEach(function (item) {
      if (item !== except) {
        item.classList.remove("is-open");
        const button = item.querySelector(".flyout-toggle");
        if (button) {
          button.setAttribute("aria-expanded", "false");
        }
      }
    });
  }

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      const isOpen = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      if (!isOpen) {
        closeGroups();
        closePortfolioItems();
      }
    });

    nav.addEventListener("click", function (event) {
      const target = event.target;
      if (target instanceof HTMLAnchorElement) {
        nav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        closeGroups();
        closePortfolioItems();
      }
    });
  }

  navGroups.forEach(function (group) {
    const button = group.querySelector(".nav-menu-button");
    if (!button) {
      return;
    }

    button.addEventListener("click", function () {
      const isOpen = group.classList.toggle("is-open");
      button.setAttribute("aria-expanded", String(isOpen));
      closeGroups(group);
      if (!isOpen) {
        closePortfolioItems();
      }
    });
  });

  portfolioItems.forEach(function (item) {
    const button = item.querySelector(".flyout-toggle");
    if (!button) {
      return;
    }

    button.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      const isOpen = item.classList.toggle("is-open");
      button.setAttribute("aria-expanded", String(isOpen));
      closePortfolioItems(item);
    });
  });

  document.addEventListener("click", function (event) {
    const target = event.target;
    if (!(target instanceof Node)) {
      return;
    }

    const clickedInsideNav = nav && nav.contains(target);
    const clickedToggle = navToggle && navToggle.contains(target);
    if (!clickedInsideNav && !clickedToggle) {
      if (nav && navToggle) {
        nav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
      closeGroups();
      closePortfolioItems();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      if (nav && navToggle) {
        nav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
      closeGroups();
      closePortfolioItems();
    }
  });

  const year = document.querySelector("#year");
  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  const seoPages = {
    "/": {
      markerId: "chennai-competitor-seo-home",
      sectionHeadingId: "dealer-coverage-title",
      title: "Stainless Steel Dealers in Chennai | Bharat Metals Since 1986",
      description: "Bharat Metals is a Chennai stainless steel dealer, stockist, supplier and wholesaler since 1986 for SS 304/316 sheets, pipes, plates, coils, rods, bars and fittings.",
      h1: "STAINLESS STEEL DEALERS & SUPPLIERS IN CHENNAI SINCE 1986",
      intro: "Established in 1986, Bharat Metals is a Chennai-based stainless steel dealer, stockist, supplier and wholesaler serving fabricators, industries, traders, contractors, home users and project procurement teams. Send SS 304, SS 316 and other stainless steel requirements by product form, size, finish, quantity, make preference, certificate need and delivery location.",
      keyword: "Stainless steel dealers in Chennai",
      serviceType: "Stainless steel dealer, stockist, supplier and wholesaler in Chennai",
      type: "home"
    },
    "/stainless-steel-suppliers-chennai/": {
      markerId: "chennai-competitor-seo",
      sectionHeadingId: "chennai-direct-answer",
      title: "Stainless Steel Dealers & Suppliers in Chennai | Bharat Metals",
      description: "Bharat Metals is a Chennai stainless steel dealer, stockist, supplier and wholesaler since 1986 for SS 304/316 sheets, pipes, plates, coils, rods, bars and fittings.",
      h1: "Stainless Steel Dealers, Stockists & Suppliers in Chennai",
      intro: "Bharat Metals is a Chennai-based stainless steel dealer, stockist, supplier and wholesaler established in 1986. Buyers from Parrys, Mannady, George Town and Chennai industrial areas can send requirements by product, grade, size, finish, quantity and certificate need.",
      keyword: "Stainless steel dealers in Chennai",
      serviceType: "Stainless steel dealer, stockist, supplier and wholesaler in Chennai",
      breadcrumb: "Stainless Steel Dealers & Suppliers in Chennai",
      type: "chennai"
    },
    "/stainless-steel-pipes-chennai/": {
      markerId: "chennai-competitor-seo-pipes",
      sectionHeadingId: "seo-pipes-chennai",
      title: "SS Pipe Dealers in Chennai | 304/316 ERW & Seamless",
      description: "Bharat Metals is a Chennai SS pipe dealer for 304/316 welded, seamless, ERW and EFW enquiries. Share ASTM A312, OD/NB, schedule, wall thickness, length, quantity and MTC needs.",
      h1: "Stainless Steel Pipe Dealers in Chennai – ERW, EFW, Welded & Seamless",
      intro: "Bharat Metals reviews Chennai stainless steel pipe enquiries for SS 304, 304L, 316 and 316L in welded, seamless, ERW, EFW and polished requirements. Send the standard, OD or NB, schedule or wall thickness, length, finish, quantity, certificate need and delivery location.",
      keyword: "Stainless steel pipe dealers in Chennai",
      serviceType: "Stainless steel pipe dealer and supplier in Chennai",
      breadcrumb: "Stainless Steel Pipe Dealers in Chennai",
      sectionHeading: "SS pipe types, standards and size terminology used by Chennai buyers",
      sectionCopy: "Pipe RFQs may use seamless, welded, ERW, EFW, fabricated, round, square, rectangular, polished, hydraulic, instrumentation or heat-exchanger terminology. Bharat Metals reviews these as dealer and supplier enquiries, subject to grade, size, quantity, documentation and sourceability.",
      terms: [
        "SS 304, 304L, 316 and 316L; other grades only when the specification calls for them",
        "ASTM A312 / ASME SA312; ASTM A213, A249 or A269 for applicable tube enquiries",
        "OD, NB, wall thickness, gauge, SCH 5 to SCH 160 where applicable, random or cut length",
        "Plain, bevelled or threaded ends where applicable; mill, polished, mirror, matt or brush finish",
        "MTC, heat number, traceability and EN 10204 3.1 discussion where applicable"
      ],
      links: [
        ["../stainless-steel-pipes/", "Stainless Steel Pipes"],
        ["../ss-304-pipes/", "SS 304 Pipes"],
        ["../ss-316-pipes/", "SS 316 Pipes"],
        ["../astm-a312-stainless-steel-pipes-chennai/", "ASTM A312 Pipes"]
      ],
      type: "product"
    },
    "/stainless-steel-sheets-chennai/": {
      markerId: "chennai-competitor-seo-sheets",
      sectionHeadingId: "seo-sheets-chennai",
      title: "SS Sheet Dealers in Chennai | 304/316, Jindal & Finishes",
      description: "Chennai stainless steel sheet dealer for SS 304/316, Jindal make preference, 2B, BA, No. 4, mirror, matt, hairline, brush and PVC-coated sheet enquiries.",
      h1: "Stainless Steel Sheet Dealers in Chennai – SS 304, 316 & Finish Options",
      intro: "Bharat Metals reviews Chennai stainless steel sheet enquiries by grade, make preference, thickness, sheet size, finish, quantity, processing and certificate need. Common requests include SS 202, 304, 304L, 316, 316L and 430 in 2B, BA, No. 4, mirror, matt, hairline, brush and PVC-coated finishes.",
      keyword: "Stainless steel sheet dealers in Chennai",
      serviceType: "Stainless steel sheet dealer and supplier in Chennai",
      breadcrumb: "Stainless Steel Sheet Dealers in Chennai",
      sectionHeading: "Sheet grades, finishes and specification terms for Chennai RFQs",
      sectionCopy: "Sheet buyers commonly search by grade, make, thickness, sheet size and finish. Bharat Metals reviews Jindal make preference where applicable without assuming every grade, size and finish combination is regular stock.",
      terms: [
        "ASTM A240 / ASME SA240 where applicable",
        "SS 202, 304, 304L, 316, 316L, 430 and other specified grades",
        "2B, BA, No. 1, No. 4, mirror / No. 8, matt, hairline, brush, satin and PVC coated",
        "Thickness, width, length, 4x8 or 5x10 reference, cut size and visible-side requirement",
        "Cutting, polishing, PVC coating, bending, packing and MTC discussion where suitable"
      ],
      links: [
        ["../stainless-steel-sheets/", "Stainless Steel Sheets"],
        ["../ss-304-sheets-chennai/", "SS 304 Sheets Chennai"],
        ["../ss-316-sheets-chennai/", "SS 316 Sheets Chennai"],
        ["../astm-a240-stainless-steel-sheets-chennai/", "ASTM A240 Sheets"]
      ],
      type: "product"
    },
    "/stainless-steel-plates-chennai/": {
      markerId: "chennai-competitor-seo-plates",
      sectionHeadingId: "seo-plates-chennai",
      title: "Stainless Steel Plate Dealers in Chennai | SS 304/316",
      description: "Bharat Metals reviews Chennai stainless steel plate enquiries for SS 304/316, ASTM A240, thickness, size, cutting, finish, quantity, MTC and delivery requirements.",
      h1: "Stainless Steel Plate Dealers in Chennai – SS 304, 316 & Cut Sizes",
      intro: "Bharat Metals reviews Chennai stainless steel plate enquiries for SS 304, 304L, 316, 316L, 310 and other specified grades. Send ASTM or project standard, thickness, width, length, cut size, finish, quantity, MTC requirement and delivery location.",
      keyword: "Stainless steel plate dealers in Chennai",
      serviceType: "Stainless steel plate dealer and supplier in Chennai",
      breadcrumb: "Stainless Steel Plate Dealers in Chennai",
      sectionHeading: "Plate specification and processing terms used in Chennai",
      sectionCopy: "Plate enquiries should state whether the use is fabrication, base plates, machine parts, process equipment, marine, chemical or project work. Exact thickness, width, length, cut size, tolerance and certificate expectation are more useful than a generic request.",
      terms: [
        "ASTM A240 / ASME SA240 where applicable",
        "SS 304, 304L, 316, 316L, 310 and specified grades subject to availability",
        "No. 1 / mill finish, 2B where applicable, matt, brush or polished",
        "Cut-to-size, drilling and packing requirements where suitable",
        "Grade, thickness, plate size, quantity, MTC and delivery location"
      ],
      links: [
        ["../stainless-steel-plates/", "Stainless Steel Plates"],
        ["../ss-304-plates/", "SS 304 Plates"],
        ["../ss-316-plates/", "SS 316 Plates"],
        ["../astm-a240-stainless-steel-sheets-chennai/", "ASTM A240 Reference"]
      ],
      type: "product"
    },
    "/stainless-steel-rods-chennai/": {
      markerId: "chennai-competitor-seo-rods",
      sectionHeadingId: "seo-rods-chennai",
      title: "SS Round Bar & Rod Dealers in Chennai | 304, 316, 310",
      description: "Chennai SS round bar and rod dealer for 304, 316, 310, 410 and specified grades in bright, black, peeled, ground, precision and cut-length enquiries with MTC needs.",
      h1: "Stainless Steel Round Bar & Rod Dealers in Chennai – Bright, Black, Peeled & Ground",
      intro: "Bharat Metals reviews Chennai stainless steel rod and round-bar enquiries by grade, diameter, length, finish, tolerance, machining use, quantity and certificate need. Buyer terms may include bright, black, hot-rolled, cold-drawn, peeled, ground, polished or precision bars.",
      keyword: "Stainless steel round bar dealers in Chennai",
      serviceType: "Stainless steel round bar and rod dealer in Chennai",
      breadcrumb: "Stainless Steel Round Bar & Rod Dealers in Chennai",
      sectionHeading: "Round bar, rod and machining terminology used by Chennai buyers",
      sectionCopy: "Machine shops may describe the same need as stainless steel rod, round bar, bright bar, black bar, peeled bar, ground bar, precision shaft-quality bar or cut-length bar. Bharat Metals matches the terminology to grade, diameter, length, tolerance, finish, quantity and certificate need.",
      terms: [
        "SS 303, 304, 304L, 310, 316, 316L, 410, 420, 430 and specialist grades when specified",
        "Bright, black, hot rolled, cold drawn, peeled, ground or polished where applicable",
        "Diameter, length, H9/H11 or drawing tolerance where relevant",
        "MTC, chemical/mechanical documents or ultrasonic-test request where applicable",
        "Machining, shafts, fasteners, valves, jigs, fixtures, repair and fabrication"
      ],
      links: [
        ["../stainless-steel-rods/", "Stainless Steel Rods"],
        ["../stainless-steel-bars/", "Stainless Steel Bars"],
        ["../ss-304-rods/", "SS 304 Rods"],
        ["../ss-316-rods/", "SS 316 Rods"]
      ],
      type: "product"
    },
    "/stainless-steel-bars-chennai/": {
      markerId: "chennai-competitor-seo-bars",
      sectionHeadingId: "seo-bars-chennai",
      title: "Stainless Steel Bar Dealers in Chennai | Round, Flat, Hex & Square",
      description: "Bharat Metals reviews Chennai stainless steel bar enquiries for round, flat, hex and square bars in SS 304, 316, 310, 410 and specified grades by size, finish and MTC need.",
      h1: "Stainless Steel Bar Dealers in Chennai – Round, Flat, Hex & Square Bars",
      intro: "Bharat Metals reviews Chennai stainless steel bar enquiries for round, flat, hex, square, rectangular and forged forms. Send the grade, diameter or section, width, thickness, across-flats size, length, finish, tolerance, quantity and certificate requirement.",
      keyword: "Stainless steel bar dealers in Chennai",
      serviceType: "Stainless steel bar dealer and supplier in Chennai",
      breadcrumb: "Stainless Steel Bar Dealers in Chennai",
      sectionHeading: "Bar forms and buyer specification terms used in Chennai",
      sectionCopy: "Bar enquiries should distinguish round bar, flat bar, true flat, sheared-and-edged flat, hex bar, square bar, rectangular bar or forged bar. Send grade, section, size, length, finish, tolerance, quantity and certificate requirement.",
      terms: [
        "Round, flat, hex, square, rectangular and forged-bar enquiries",
        "SS 304, 304L, 316, 316L, 310, 410 and other specified grades",
        "Black, bright, cold drawn, hot rolled, peeled, ground or polished where applicable",
        "Diameter or section, width, thickness, across-flats dimension and length",
        "Machining, auto components, equipment, fasteners, supports and fabrication"
      ],
      links: [
        ["../stainless-steel-bars/", "Stainless Steel Bars"],
        ["../stainless-steel-rods/", "Rods & Round Bars"],
        ["../stainless-steel-flats/", "Flat Bars"],
        ["../technical-data/", "Technical Data"]
      ],
      type: "product"
    }
  };

  function normalizePath(pathname) {
    const clean = pathname.replace(/\/index\.html$/i, "").replace(/\/+$/, "");
    return clean ? clean + "/" : "/";
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function linkGrid(links) {
    return '<div class="link-chip-grid">' + links.map(function (link) {
      return '<a href="' + escapeHtml(link[0]) + '">' + escapeHtml(link[1]) + "</a>";
    }).join("") + "</div>";
  }

  function homeSection(config) {
    return '<section id="' + config.markerId + '" class="section-pad compact-section section-silver" aria-labelledby="' + config.sectionHeadingId + '">' +
      '<div class="container text-flow">' +
      '<p class="eyebrow">Chennai buyer coverage</p>' +
      '<h2 id="' + config.sectionHeadingId + '">Stainless steel dealers in Chennai for retail, wholesale and industrial requirements</h2>' +
      '<p>Bharat Metals is a Chennai-based stainless steel dealer, stockist, supplier and wholesaler established in 1986. Buyers from Parrys, Mannady, George Town, Ambattur, Guindy, Padi, Sriperumbudur, Oragadam, Gummidipoondi and Maraimalai Nagar can send requirements by product form, grade, size, finish, quantity and certificate need.</p>' +
      '<p>Common RFQ terms include SS 304 and SS 316 sheets, plates and coils; seamless, welded, ERW and EFW pipes; polished tubes; bright, black, peeled and ground round bars; flat, hex and square bars; angles, channels, flanges, fittings, wire mesh and perforated sheets. Specialist forms and grades are reviewed only after specification, quantity and sourceability are confirmed.</p>' +
      linkGrid([
        ["stainless-steel-suppliers-chennai/", "Stainless Steel Dealers Chennai"],
        ["stainless-steel-pipes-chennai/", "SS Pipe Dealers Chennai"],
        ["stainless-steel-sheets-chennai/", "SS Sheet Dealers Chennai"],
        ["stainless-steel-rods-chennai/", "SS Round Bar Dealers Chennai"],
        ["stainless-steel-bars-chennai/", "SS Bar Dealers Chennai"],
        ["astm-a240-stainless-steel-sheets-chennai/", "ASTM A240 Sheets"],
        ["astm-a312-stainless-steel-pipes-chennai/", "ASTM A312 Pipes"],
        ["technical-data/", "Equivalent Grades & Technical Data"]
      ]) +
      "</div></section>";
  }

  function chennaiSection(config) {
    return '<section id="' + config.markerId + '" class="section-pad compact-section section-silver" aria-labelledby="' + config.sectionHeadingId + '">' +
      '<div class="container text-flow">' +
      '<p class="eyebrow">Direct answer for Chennai buyers</p>' +
      '<h2 id="' + config.sectionHeadingId + '">Who is a stainless steel dealer, stockist and supplier in Chennai?</h2>' +
      '<p>Bharat Metals is located on Mookernallamuthu Street, Chennai 600001, and has served stainless steel buyers since 1986. It supports retail, wholesale, fabrication, industrial, contractor, trader and project enquiries for buyers searching around Parrys, Mannady, George Town and Chennai industrial areas. Bharat Metals is a dealer, stockist, supplier and wholesaler; it does not claim to manufacture the material.</p>' +
      '<h2>Products and enquiry terminology covered</h2>' +
      '<p>Flat-product enquiries may include sheets, plates, coils, strips, slit coils, shim and cut sizes in 2B, BA, No. 1, No. 4, mirror, matt, hairline, brush, satin or PVC-coated finishes. Pipe and tube enquiries may use seamless, welded, ERW, EFW, round, square, rectangular, polished, hydraulic, instrumentation or heat-exchanger terminology where applicable. Long-product enquiries may use rod, round bar, bright bar, black bar, peeled bar, ground bar, precision bar, flat bar, hex bar or square bar.</p>' +
      '<h2>Grades, standards and documentation</h2>' +
      '<p>Regular enquiries commonly use SS 202, 304, 304L, 310, 316, 316L, 410, 420 and 430. Buyers may also mention 201, 303, 304H, 309S, 310S, 316Ti, 317L, 321, 347, 904L, 17-4PH, Duplex 2205 or Super Duplex 2507 when a drawing calls for them; these should not be assumed as regular stock until the exact product, specification, size, quantity and sourceability are confirmed.</p>' +
      '<p>Technical RFQs can reference ASTM A240, ASTM A312, ASTM A213, ASTM A249, ASTM A269, ASME, EN or UNS equivalents, MTC, mill certificate, heat number, traceability and EN 10204 3.1 documentation where applicable.</p>' +
      '<h2>Chennai areas and buyer industries</h2>' +
      '<p>Relevant local searches include stainless steel dealers near Parrys, Mannady, George Town, Linghi Chetty Street, Ambattur Industrial Estate, Guindy Industrial Estate, Padi, SIDCO, Sriperumbudur, Oragadam, Gummidipoondi, Avadi, Maraimalai Nagar, Manali and Ennore. Buyer sectors include fabrication, commercial kitchens, dairy and beverage, food processing, pharma, chemical and petrochemical, water treatment, marine and port work, automotive, architecture, construction and engineering workshops.</p>' +
      linkGrid([
        ["../stainless-steel-pipes-chennai/", "Pipes: ERW, EFW, Welded & Seamless"],
        ["../stainless-steel-sheets-chennai/", "Sheets: 2B, BA, Mirror & Hairline"],
        ["../stainless-steel-plates-chennai/", "Plates: ASTM A240"],
        ["../stainless-steel-rods-chennai/", "Rods & Round Bars"],
        ["../stainless-steel-bars-chennai/", "Round, Flat, Hex & Square Bars"],
        ["../stainless-steel-coils/", "Coils & Slit Coils"],
        ["../stainless-steel-flanges/", "Flanges"],
        ["../stainless-steel-fittings/", "Pipe Fittings"]
      ]) +
      '<h2>Practical buyer answers</h2>' +
      '<h3>Do you supply SS 304 and SS 316 in Chennai?</h3>' +
      '<p>Yes. Requirements are reviewed by product form, size, finish, quantity, documentation, make preference and current availability.</p>' +
      '<h3>Can Jindal make be requested?</h3>' +
      '<p>Yes. Jindal make can be stated as a buyer preference, but availability is confirmed against the exact RFQ and is not presented as an automatic authorised-dealership claim.</p>' +
      '<h3>Can small retail and bulk wholesale requirements both be discussed?</h3>' +
      '<p>Yes. Bharat Metals serves home users, fabricators, contractors, traders and industrial buyers, subject to the exact product, size and quantity.</p>' +
      "</div></section>";
  }

  function productSection(config) {
    const terms = config.terms.map(function (term) {
      return "<li>" + escapeHtml(term) + "</li>";
    }).join("");
    return '<section id="' + config.markerId + '" class="section-pad compact-section section-silver" aria-labelledby="' + config.sectionHeadingId + '">' +
      '<div class="container text-flow">' +
      '<p class="eyebrow">Chennai specification coverage</p>' +
      '<h2 id="' + config.sectionHeadingId + '">' + escapeHtml(config.sectionHeading) + "</h2>" +
      "<p>" + escapeHtml(config.sectionCopy) + "</p>" +
      "<h3>Buyer terms to include</h3><ul>" + terms + "</ul>" +
      linkGrid(config.links) +
      "</div></section>";
  }

  function updateMeta(selector, value) {
    const element = document.querySelector(selector);
    if (element) {
      element.setAttribute("content", value);
    }
  }

  function asArray(value) {
    if (Array.isArray(value)) {
      return value;
    }
    if (value === undefined || value === null || value === "") {
      return [];
    }
    return [value];
  }

  function typeMatches(item, type) {
    return item && asArray(item["@type"]).indexOf(type) !== -1;
  }

  function patchStructuredData(config, canonicalUrl) {
    const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
    const schemaScript = scripts.find(function (script) {
      try {
        const parsed = JSON.parse(script.textContent);
        const graph = Array.isArray(parsed["@graph"]) ? parsed["@graph"] : [parsed];
        return graph.some(function (item) {
          return typeMatches(item, "Organization") || typeMatches(item, "LocalBusiness");
        });
      } catch (error) {
        return false;
      }
    });

    if (!schemaScript) {
      return;
    }

    let data;
    try {
      data = JSON.parse(schemaScript.textContent);
    } catch (error) {
      return;
    }

    const graph = Array.isArray(data["@graph"]) ? data["@graph"] : [data];
    const organizationId = "https://www.stainlesssteeldealers.com/#organization";
    const businessId = "https://www.stainlesssteeldealers.com/#localbusiness";
    const pageUrl = canonicalUrl.href.split("#")[0];
    const sameAs = [
      "https://share.google/VGih9aoStMPaRMMyz",
      "https://www.indiamart.com/bharatmetals-chennai/profile.html"
    ];
    const knowsAbout = [
      "Stainless steel dealers in Chennai",
      "SS 304 and SS 316",
      "ASTM A240 stainless steel sheets and plates",
      "ASTM A312 stainless steel pipes",
      "Stainless steel rods, round bars and bright bars",
      "MTC, mill certificate and traceability"
    ];

    const organization = graph.find(function (item) {
      return item && (item["@id"] === organizationId || typeMatches(item, "Organization"));
    });
    if (organization) {
      organization.sameAs = Array.from(new Set(asArray(organization.sameAs).concat(sameAs)));
      organization.knowsAbout = Array.from(new Set(asArray(organization.knowsAbout).concat(knowsAbout)));
    }

    const business = graph.find(function (item) {
      return item && (item["@id"] === businessId || typeMatches(item, "LocalBusiness"));
    });
    if (business) {
      business.sameAs = Array.from(new Set(asArray(business.sameAs).concat(sameAs)));
      const areas = asArray(business.areaServed);
      const areaText = JSON.stringify(areas);
      if (areaText.indexOf('"Chennai"') === -1) {
        areas.unshift({ "@type": "City", "name": "Chennai" });
      }
      if (areaText.indexOf('"Tamil Nadu"') === -1) {
        areas.push({ "@type": "AdministrativeArea", "name": "Tamil Nadu" });
      }
      business.areaServed = areas;
    }

    let webPage = graph.find(function (item) {
      return typeMatches(item, "WebPage") || typeMatches(item, "CollectionPage");
    });
    if (!webPage) {
      webPage = {
        "@type": "WebPage",
        "@id": pageUrl + "#webpage",
        "isPartOf": { "@id": "https://www.stainlesssteeldealers.com/" }
      };
      graph.push(webPage);
    }
    webPage.name = config.h1;
    webPage.description = config.description;
    webPage.url = pageUrl;
    webPage.about = config.keyword;
    webPage.dateModified = "2026-07-22";

    const breadcrumb = graph.find(function (item) {
      return typeMatches(item, "BreadcrumbList");
    });
    if (breadcrumb && Array.isArray(breadcrumb.itemListElement) && breadcrumb.itemListElement.length) {
      breadcrumb.itemListElement[breadcrumb.itemListElement.length - 1].name = config.breadcrumb || config.h1;
    }

    const service = {
      "@type": "Service",
      "@id": pageUrl + "#service",
      "name": config.h1,
      "description": config.description,
      "serviceType": config.serviceType,
      "areaServed": { "@type": "City", "name": "Chennai" },
      "provider": { "@id": businessId }
    };
    const serviceIndex = graph.findIndex(function (item) {
      return item && item["@id"] === service["@id"];
    });
    if (serviceIndex >= 0) {
      graph[serviceIndex] = service;
    } else {
      graph.push(service);
    }

    schemaScript.textContent = JSON.stringify({ "@context": "https://schema.org", "@graph": graph }, null, 2);
  }

  const canonicalElement = document.querySelector('link[rel="canonical"]');
  if (!canonicalElement) {
    return;
  }

  let canonicalUrl;
  try {
    canonicalUrl = new URL(canonicalElement.href, window.location.href);
  } catch (error) {
    return;
  }

  const config = seoPages[normalizePath(canonicalUrl.pathname)];
  if (!config) {
    return;
  }

  document.title = config.title;
  updateMeta('meta[name="description"]', config.description);
  updateMeta('meta[property="og:title"]', config.title);
  updateMeta('meta[property="og:description"]', config.description);

  const hero = config.type === "home" ? document.querySelector(".hero") : document.querySelector(".page-hero");
  const h1 = hero && hero.querySelector("h1");
  if (h1) {
    h1.textContent = config.h1;
    const intro = h1.nextElementSibling;
    if (intro && intro.tagName === "P") {
      intro.textContent = config.intro;
    }
  }

  if (config.breadcrumb) {
    const breadcrumbLabel = document.querySelector(".breadcrumbs li:last-child span");
    if (breadcrumbLabel) {
      breadcrumbLabel.textContent = config.breadcrumb;
    }
  }

  if (hero && !document.getElementById(config.markerId)) {
    let sectionHtml = "";
    if (config.type === "home") {
      sectionHtml = homeSection(config);
    } else if (config.type === "chennai") {
      sectionHtml = chennaiSection(config);
    } else {
      sectionHtml = productSection(config);
    }
    hero.insertAdjacentHTML("afterend", sectionHtml);
  }

  patchStructuredData(config, canonicalUrl);
})();