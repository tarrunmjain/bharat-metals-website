function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function attr(value) {
  return escapeHtml(value).replace(/'/g, "&#39;");
}

function relPrefix(slug) {
  if (!slug) return "";
  return slug.split("/").filter(Boolean).map(() => "..").join("/") + "/";
}

function joinUrl(base, slug) {
  return base.replace(/\/$/, "") + "/" + (slug || "");
}

function localHref(prefix, slug) {
  return slug ? `${prefix}${slug}` : prefix || "./";
}

const googleBusinessProfileHref = "https://share.google/VGih9aoStMPaRMMyz";
const googleMapsHref = "https://maps.app.goo.gl/oXEYZZnMaAN2kfSV6";
const indiaMartHref = "https://www.indiamart.com/bharatmetals-chennai/profile.html?srsltid=AfmBOoojZ-XWsb5imrtauCfOghab2gJsCDru3QvurY4SkTxle4LpoSsN";

function iconImage(prefix, src, width, height) {
  return `<img src="${prefix}${src}" alt="" width="${width}" height="${height}" loading="eager" decoding="async" aria-hidden="true">`;
}

function googleBusinessProfileIcon(prefix = "") {
  return iconImage(prefix, "assets/icons/google-business-profile.webp", 24, 24);
}

function googleMapsIcon(prefix = "") {
  return iconImage(prefix, "assets/icons/google-maps.webp", 24, 24);
}

function indiaMartIcon(prefix = "") {
  return iconImage(prefix, "assets/icons/indiamart.webp", 32, 24);
}

function footerUtilityLinks(site, prefix = "") {
  return `<div class="footer-utility-links" aria-label="External useful links">
    <a href="${googleMapsHref}" target="_blank" rel="noopener" aria-label="Open Bharat Metals location on Google Maps">${googleMapsIcon(prefix)}<span>Google Maps</span></a>
    <a href="${indiaMartHref}" target="_blank" rel="noopener" aria-label="Open Bharat Metals IndiaMART profile">${indiaMartIcon(prefix)}<span>IndiaMART</span></a>
  </div>`;
}

const portfolioMenu = [
  {
    label: "Stainless Steel",
    href: "stainless-steel/",
    items: [
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
      ["Stainless Steel Circles", "stainless-steel-circles/"],
      ["Stainless Steel Fasteners", "stainless-steel-fasteners/"],
      ["Stainless Steel Wire Mesh", "stainless-steel-wire-mesh/"],
      ["Stainless Steel Perforated Sheets", "stainless-steel-perforated-sheets/"]
    ]
  },
  {
    label: "Aluminium",
    href: "aluminium/",
    items: [
      ["Aluminium Sheets", "aluminium-sheets/"],
      ["Aluminium Plates", "aluminium-plates/"],
      ["Aluminium Coils", "aluminium-coils/"],
      ["Aluminium Pipes", "aluminium-pipes/"],
      ["Aluminium Flats", "aluminium-flats/"],
      ["Aluminium Rods", "aluminium-rods/"],
      ["Aluminium Bars", "aluminium-bars/"]
    ]
  },
  {
    label: "Brass",
    href: "brass/",
    items: [
      ["Brass Pipes", "brass-pipes/"],
      ["Brass Bush Pipes", "brass-bush-pipes/"],
      ["Brass Rods", "brass-rods/"],
      ["Brass Bars", "brass-bars/"],
      ["Brass Flats", "brass-flats/"]
    ]
  },
  {
    label: "Copper",
    href: "copper/",
    items: [
      ["Copper Tubes", "copper-tubes/"],
      ["Copper Flats", "copper-flats/"],
      ["Copper Rods", "copper-rods/"],
      ["Copper Bars", "copper-bars/"],
      ["Copper Plates", "copper-plates/"]
    ]
  }
];

function portfolioMenuHtml(prefix) {
  return portfolioMenu
    .map((group) => {
      const id = `portfolio-${group.href.replace(/\/$/, "")}-flyout`;
      return `<div class="portfolio-item has-flyout">
                <div class="portfolio-row">
                  <a class="portfolio-parent" href="${localHref(prefix, group.href)}">${escapeHtml(group.label)}</a>
                  <button class="flyout-toggle" type="button" aria-label="Toggle ${escapeHtml(group.label)} product links" aria-expanded="false" aria-controls="${id}"></button>
                </div>
                <div class="flyout-menu" id="${id}">
                  ${group.items.map(([label, href]) => `<a href="${localHref(prefix, href)}">${escapeHtml(label)}</a>`).join("")}
                </div>
              </div>`;
    })
    .join("");
}

function nav(site, prefix) {
  return `
    <div class="top-bar" aria-label="Bharat Metals quick contact">
      <div class="container top-bar-grid">
        <p class="top-bar-line">STAINLESS STEEL - STOCKIST | SUPPLIER | WHOLESALER</p>
        <div class="top-bar-spacer" aria-hidden="true"></div>
        <div class="top-icons" aria-label="Quick contact links">
          <a class="top-icon icon-call" href="${site.phoneHref}" aria-label="Call Bharat Metals"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M7.2 4.2 9.9 5.6c.7.4 1 1.2.7 2L9.8 9.7c-.2.5-.1 1.1.3 1.5l2.7 2.7c.4.4 1 .5 1.5.3l2.1-.8c.8-.3 1.6 0 2 .7l1.4 2.7c.4.8.1 1.8-.7 2.2-1.1.6-2.5.9-4.1.5-5.1-1.2-9.3-5.4-10.5-10.5-.4-1.6-.1-3 .5-4.1.4-.8 1.4-1.1 2.2-.7Z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></a>
          <a class="top-icon icon-whatsapp" href="${site.whatsappHref}" target="_blank" rel="noopener" aria-label="WhatsApp Bharat Metals"><svg viewBox="0 0 24 24" width="23" height="23" aria-hidden="true"><path d="M12 3.3a8.6 8.6 0 0 0-7.2 13.2L4 20.7l4.4-1a8.6 8.6 0 1 0 3.6-16.4Z" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linejoin="round"/><path d="M8.4 8.1c.2-.5.4-.6.8-.6h.5c.2 0 .4.1.5.4l.8 1.9c.1.3.1.5-.1.7l-.4.5c-.2.2-.2.4 0 .7.4.8 1.4 1.8 2.2 2.2.3.2.5.2.7 0l.6-.6c.2-.2.4-.2.7-.1l1.8.8c.3.1.5.3.4.6-.1.8-.7 1.6-1.4 1.7-1 .1-2.7-.4-4.4-1.6-1.8-1.3-3.2-3.4-3.6-4.9-.2-.7.1-1.3.4-1.7Z" fill="currentColor"/></svg></a>
          <a class="top-icon icon-mail" href="${site.mailto.replace(/&/g, "&amp;")}" aria-label="Email Bharat Metals"><svg viewBox="0 0 24 24" width="23" height="23" aria-hidden="true"><rect x="3.5" y="5.8" width="17" height="12.4" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="m4.6 7.4 7.4 5.3 7.4-5.3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></a>
          <a class="top-icon icon-google" href="${googleBusinessProfileHref}" target="_blank" rel="noopener" aria-label="Open Bharat Metals Google Business Profile">${googleBusinessProfileIcon(prefix)}</a>
          <a class="top-icon icon-indiamart" href="${indiaMartHref}" target="_blank" rel="noopener" aria-label="Open Bharat Metals IndiaMART profile">${indiaMartIcon(prefix)}</a>
        </div>
      </div>
    </div>
    <header class="site-header" data-header>
      <div class="container header-inner">
        <a class="brand" href="${localHref(prefix, "")}" aria-label="Bharat Metals home"><img src="${prefix}${site.logo}" alt="Bharat Metals" width="900" height="300"></a>
        <button class="nav-toggle" type="button" aria-label="Toggle navigation" aria-expanded="false" aria-controls="site-nav"><span class="nav-toggle-lines" aria-hidden="true"></span><span class="sr-only">Toggle navigation</span></button>
        <nav class="site-nav" id="site-nav" aria-label="Primary navigation">
          <a class="nav-link" href="${localHref(prefix, "")}">HOME</a>
          <div class="nav-group"><button class="nav-link nav-menu-button" type="button" aria-haspopup="true" aria-expanded="false" aria-controls="company-profile-menu">COMPANY PROFILE</button><div class="dropdown-menu" id="company-profile-menu"><a href="${localHref(prefix, "about-us/")}">About Us</a><a href="${localHref(prefix, "mission-vision/")}">Mission and Vision</a><a href="${localHref(prefix, "industries-we-serve/")}">Industries We Serve</a><a href="${localHref(prefix, "locations-we-serve/")}">Locations We Serve</a><a href="${localHref(prefix, "site-map/")}">Sitemap</a></div></div>
          <div class="nav-group portfolio-group"><button class="nav-link nav-menu-button" type="button" aria-haspopup="true" aria-expanded="false" aria-controls="product-portfolio-menu">PRODUCT PORTFOLIO</button><div class="dropdown-menu portfolio-menu" id="product-portfolio-menu">${portfolioMenuHtml(prefix)}</div></div>
          <a class="nav-link" href="${localHref(prefix, "request-quote/")}">REQUEST A QUOTE</a>
          <a class="nav-link" href="${localHref(prefix, "blog/")}">BLOG</a>
          <a class="nav-link" href="${localHref(prefix, "contact-us/")}">CONTACT US</a>
          <a class="button button-primary nav-quick" href="${site.whatsappHref}" target="_blank" rel="noopener">QUICK QUOTE</a>
        </nav>
      </div>
    </header>`;
}

function footer(site, prefix) {
  const mailto = site.mailto.replace(/&/g, "&amp;");
  const secondaryMailto = `mailto:${site.secondaryEmail}`;
  const topMoneyLinks = [
    ["Stainless Steel Suppliers in Chennai", "stainless-steel-suppliers-chennai/"],
    ["SS 304 Sheets Chennai", "ss-304-sheets-chennai/"],
    ["SS 316 Sheets Chennai", "ss-316-sheets-chennai/"],
    ["Stainless Steel Pipes Chennai", "stainless-steel-pipes-chennai/"],
    ["Jindal Make Stainless Steel Sheets Chennai", "jindal-stainless-steel-sheets-chennai/"],
    ["Jindal Make SS 304 Sheets Chennai", "jindal-ss-304-sheet-chennai/"],
    ["Jindal Make SS 316 Sheets Chennai", "jindal-ss-316-sheet-chennai/"],
    ["Jindal Make Stainless Steel Pipes Chennai", "jindal-stainless-steel-pipes-chennai/"],
    ["Jindal Make Polished Pipes Chennai", "jindal-polished-pipes-chennai/"],
    ["SS 304 Sheet Price Chennai", "ss-304-sheet-price-chennai/"],
    ["SS 316 Sheet Price Chennai", "ss-316-sheet-price-chennai/"],
    ["Polished Stainless Steel Pipes Chennai", "polished-stainless-steel-pipes-chennai/"],
    ["Stainless Steel Suppliers Ambattur", "stainless-steel-suppliers-ambattur/"],
    ["Stainless Steel Suppliers Coimbatore", "stainless-steel-suppliers-coimbatore/"],
    ["Stainless Steel Suppliers Sricity", "stainless-steel-suppliers-sricity/"],
    ["Stainless Steel Suppliers Tada", "stainless-steel-suppliers-tada/"]
  ];
  return `<footer class="site-footer" id="contact">
    <div class="container footer-grid footer-grid-compact">
      <div class="footer-brand footer-main">
        <img src="${prefix}${site.logo}" alt="Bharat Metals" width="900" height="300">
        <p>Bharat Metals is a Chennai stainless steel stockist, supplier and wholesaler established in 1986, focused on practical stainless steel supply across Tamil Nadu and nearby South India markets.</p>
        <div class="footer-contact">
          <p><a href="${site.phoneHref}">${escapeHtml(site.phone)}</a> / <a href="${site.whatsappHref}" target="_blank" rel="noopener">WhatsApp</a></p>
          <p><a href="${mailto}">${escapeHtml(site.email)}</a></p>
          <p><a href="${secondaryMailto}">${escapeHtml(site.secondaryEmail)}</a></p>
          <address>${site.addressLines.map(escapeHtml).join("<br>")}</address>
          <p>10:00 AM to 6:00 PM, Sunday holiday</p>
        </div>
        <h2>Useful Links</h2>
        ${footerUtilityLinks(site, prefix)}
      </div>
      <nav class="footer-column" aria-label="Footer navigation"><h2>Navigation</h2><ul><li><a href="${localHref(prefix, "")}">Home</a></li><li><a href="${localHref(prefix, "about-us/")}">About Us</a></li><li><a href="${localHref(prefix, "products/")}">Products</a></li><li><a href="${localHref(prefix, "stainless-steel/")}">Stainless Steel</a></li><li><a href="${localHref(prefix, "locations-we-serve/")}">Locations</a></li><li><a href="${localHref(prefix, "request-quote/")}">Request Quote</a></li><li><a href="${localHref(prefix, "contact-us/")}">Contact Us</a></li><li><a href="${localHref(prefix, "site-map/")}">Sitemap</a></li></ul></nav>
      <nav class="footer-column" aria-label="Footer product links"><h2>Products</h2><ul><li><a href="${localHref(prefix, "stainless-steel-pipes/")}">Stainless Steel Pipes</a></li><li><a href="${localHref(prefix, "stainless-steel-sheets/")}">Stainless Steel Sheets</a></li><li><a href="${localHref(prefix, "stainless-steel-plates/")}">Stainless Steel Plates</a></li><li><a href="${localHref(prefix, "stainless-steel-coils/")}">Stainless Steel Coils</a></li><li><a href="${localHref(prefix, "stainless-steel-rods/")}">Stainless Steel Rods</a></li><li><a href="${localHref(prefix, "stainless-steel-bars/")}">Stainless Steel Bars</a></li><li><a href="${localHref(prefix, "stainless-steel-flanges/")}">Flanges &amp; Fittings</a></li><li><a href="${localHref(prefix, "stainless-steel-wire-mesh/")}">Wire Mesh / Perforated Sheets</a></li></ul></nav>
      <nav class="footer-column" aria-label="Footer service regions"><h2>Service Regions</h2><ul><li><a href="${localHref(prefix, "stainless-steel-suppliers-chennai/")}">Chennai</a></li><li><a href="${localHref(prefix, "stainless-steel-suppliers-ambattur/")}">Ambattur</a></li><li><a href="${localHref(prefix, "stainless-steel-suppliers-coimbatore/")}">Coimbatore</a></li><li><a href="${localHref(prefix, "stainless-steel-suppliers-hosur/")}">Hosur</a></li><li><a href="${localHref(prefix, "stainless-steel-suppliers-pondicherry/")}">Pondicherry</a></li><li><a href="${localHref(prefix, "stainless-steel-suppliers-sricity/")}">Sricity</a></li><li><a href="${localHref(prefix, "stainless-steel-suppliers-tada/")}">Tada</a></li><li><a href="${localHref(prefix, "locations-we-serve/")}">Sri Lanka / Maldives</a></li></ul></nav>
      <nav class="footer-top-pages" aria-label="Top stainless steel pages"><h2>Top Stainless Steel Pages</h2><ul>${topMoneyLinks.map(([label, href]) => `<li><a href="${localHref(prefix, href)}">${escapeHtml(label)}</a></li>`).join("")}</ul></nav>
    </div>
    <div class="container footer-bottom"><p>Bharat Metals. Stainless steel stockist, supplier and wholesaler in Chennai since 1986.</p><a href="#top">Back to top</a></div>
  </footer>`;
}

function breadcrumbHtml(page, prefix) {
  const crumbs = [{ name: "Home", slug: "" }, ...(page.breadcrumbs || [])];
  return `<nav class="breadcrumbs" aria-label="Breadcrumb"><ol>${crumbs.map((c, i) => `<li>${i === crumbs.length - 1 ? `<span>${escapeHtml(c.name)}</span>` : `<a href="${localHref(prefix, c.slug)}">${escapeHtml(c.name)}</a>`}</li>`).join("")}</ol></nav>`;
}

function pageCanonical(site, page) {
  return page.canonicalUrl || joinUrl(site.finalDomain, page.canonicalSlug || page.slug);
}

function schema(site, page) {
  const url = pageCanonical(site, page);
  const graph = [
    { "@type": "Organization", "@id": `${site.finalDomain}#organization`, name: site.name, url: site.finalDomain, logo: joinUrl(site.finalDomain, site.ogLogo), foundingDate: "1986", telephone: site.phone, email: [site.email, site.secondaryEmail] },
    { "@type": "LocalBusiness", "@id": `${site.finalDomain}#localbusiness`, name: site.name, image: joinUrl(site.finalDomain, site.ogLogo), url: site.finalDomain, telephone: site.phone, email: site.email, foundingDate: "1986", priceRange: "$$", openingHours: "Mo-Sa 10:00-18:00", hasMap: site.maps, address: { "@type": "PostalAddress", streetAddress: "No. 19 (10), Shop No. G1 & S10, Majfa Towers, Mookernallamuthu Street", addressLocality: "Chennai", postalCode: "600001", addressRegion: "Tamil Nadu", addressCountry: "IN" } },
    { "@type": page.schemaType || "WebPage", "@id": `${url}#webpage`, name: page.h1, description: page.description, url, isPartOf: { "@id": site.finalDomain }, about: "Stainless steel supply, RFQ guidance and buyer enquiry support in Chennai" },
    { "@type": "BreadcrumbList", "@id": `${url}#breadcrumb`, itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: site.finalDomain }, ...(page.breadcrumbs || []).map((c, i) => ({ "@type": "ListItem", position: i + 2, name: c.name, item: joinUrl(site.finalDomain, c.slug) }))] }
  ];
  if (page.faq && page.faq.length) {
    graph.push({ "@type": "FAQPage", "@id": `${url}#faq`, mainEntity: page.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) });
  }
  if (page.type === "blog") {
    graph.push({ "@type": "BlogPosting", headline: page.h1, description: page.description, image: joinUrl(site.finalDomain, page.image || "assets/images/photos/materials/stainless-steel.webp"), author: { "@type": "Organization", name: site.name }, publisher: { "@type": "Organization", name: site.name, logo: { "@type": "ImageObject", url: joinUrl(site.finalDomain, site.ogLogo) } }, datePublished: "2026-07-03", dateModified: "2026-07-03", mainEntityOfPage: url });
  }
  if (page.serviceName) {
    graph.push({
      "@type": "Service",
      "@id": `${url}#service`,
      name: page.serviceName,
      description: page.description,
      areaServed: page.areaServed || "Chennai, Tamil Nadu and nearby South India markets",
      provider: { "@id": `${site.finalDomain}#localbusiness` },
      serviceType: "Stainless steel stockist, supplier, dealer and wholesaler enquiry support"
    });
  }
  if (page.itemList && page.itemList.length) {
    graph.push({
      "@type": "ItemList",
      "@id": `${url}#itemlist`,
      name: page.itemListName || `${page.h1} related pages`,
      itemListElement: page.itemList.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        url: joinUrl(site.finalDomain, item.slug)
      }))
    });
  }
  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph }, null, 2);
}

function renderPage(site, page) {
  const prefix = relPrefix(page.slug);
  const canonical = pageCanonical(site, page);
  const robots = page.robots || "index, follow";
  const title = page.title;
  const bodyHtml = page.body
    .replace(/href="(?!https?:|mailto:|tel:|#|\/|\.\/|\.\.\/)([^"]+)"/g, `href="${prefix}$1"`)
    .replace(/src="assets\//g, `src="${prefix}assets/`);
  return `<!doctype html>
<html lang="en-IN">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${attr(page.description)}">
    <meta name="robots" content="${attr(robots)}">
    <link rel="canonical" href="${canonical}">
    <link rel="icon" type="image/png" href="${prefix}${site.icon}">
    <meta property="og:title" content="${attr(page.title)}">
    <meta property="og:description" content="${attr(page.description)}">
    <meta property="og:type" content="${page.type === "blog" ? "article" : "website"}">
    <meta property="og:url" content="${canonical}">
    <meta property="og:image" content="${joinUrl(site.finalDomain, page.image || site.ogLogo)}">
    <meta name="theme-color" content="#D9252E">
    <link rel="stylesheet" href="${prefix}assets/css/styles.css">
    <script type="application/ld+json">${schema(site, page)}</script>
  </head>
  <body id="top">
    <a class="skip-link" href="#main">Skip to content</a>${nav(site, prefix)}
    <main id="main" class="generated-page">
      <section class="page-hero section-pad">
        <div class="container page-hero-grid">
          <div>
            ${breadcrumbHtml(page, prefix)}
            <p class="eyebrow">${escapeHtml(page.eyebrow || "Bharat Metals")}</p>
            <h1>${escapeHtml(page.h1)}</h1>
            <p>${escapeHtml(page.intro || page.description)}</p>
            <div class="button-row"><a class="button button-primary" href="${site.phoneHref}">CALL</a><a class="button button-primary" href="${site.whatsappHref}" target="_blank" rel="noopener">WHATSAPP</a><a class="button button-primary" href="${site.mailto.replace(/&/g, "&amp;")}">EMAIL RFQ</a></div>
          </div>
          <div class="page-hero-media">${page.image ? `<img src="${prefix}${page.image}" alt="${attr(page.imageAlt || page.h1)}" width="500" height="312" loading="eager">` : `<div class="photo-placeholder"><span>Photo pending</span></div>`}</div>
        </div>
      </section>
      ${bodyHtml}
    </main>
    ${footer(site, prefix)}
    <script src="${prefix}assets/js/main.js" defer></script>
  </body>
</html>`;
}

module.exports = { renderPage, escapeHtml, localHref, relPrefix, googleBusinessProfileIcon, googleMapsIcon, indiaMartIcon, footerUtilityLinks, googleBusinessProfileHref, googleMapsHref, indiaMartHref };
