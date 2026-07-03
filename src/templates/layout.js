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
          <a class="top-icon icon-google" href="${site.maps}" target="_blank" rel="noopener" aria-label="Open Bharat Metals Google Profile"><svg viewBox="0 0 24 24" width="23" height="23" aria-hidden="true"><path d="M12 2.7a7.3 7.3 0 0 0-7.3 7.3c0 5.4 7.3 11.3 7.3 11.3s7.3-5.9 7.3-11.3A7.3 7.3 0 0 0 12 2.7Z" fill="#ea4335"/><path d="M12 2.7v5a2.4 2.4 0 0 1 2.4 2.4h4.9A7.3 7.3 0 0 0 12 2.7Z" fill="#4285f4"/><circle cx="12" cy="10" r="2.55" fill="#fbbc04"/></svg></a>
          <a class="top-icon icon-indiamart" href="https://www.indiamart.com/" target="_blank" rel="noopener" aria-label="Open IndiaMART placeholder"><svg viewBox="0 0 32 24" width="28" height="22" aria-hidden="true"><path d="M5 19V7l6.2 8.2L17.5 7v12h-3.4v-5.3l-2.9 3.8-2.9-3.8V19H5Z" fill="#c4212a"/><circle cx="6.5" cy="5" r="2" fill="#d9252e"/><circle cx="16.2" cy="5" r="2" fill="#d9252e"/><path d="M22 6h3.2v13H22zm4.8 0H30v13h-3.2z" fill="#f58220"/></svg></a>
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
          <div class="nav-group"><button class="nav-link nav-menu-button" type="button" aria-haspopup="true" aria-expanded="false" aria-controls="product-portfolio-menu">PRODUCT PORTFOLIO</button><div class="dropdown-menu" id="product-portfolio-menu"><a href="${localHref(prefix, "stainless-steel/")}">Stainless Steel</a><a href="${localHref(prefix, "stainless-steel-pipes/")}">Stainless Steel Pipes</a><a href="${localHref(prefix, "stainless-steel-sheets/")}">Stainless Steel Sheets</a><a href="${localHref(prefix, "stainless-steel-plates/")}">Stainless Steel Plates</a><a href="${localHref(prefix, "stainless-steel-coils/")}">Stainless Steel Coils</a><a href="${localHref(prefix, "stainless-steel-rods/")}">Stainless Steel Rods &amp; Bars</a><a href="${localHref(prefix, "stainless-steel-flanges/")}">Flanges &amp; Fittings</a><a href="${localHref(prefix, "aluminium/")}">Aluminium</a><a href="${localHref(prefix, "brass/")}">Brass</a><a href="${localHref(prefix, "copper/")}">Copper</a></div></div>
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
  return `<footer class="site-footer" id="contact">
    <div class="container footer-grid">
      <div class="footer-brand"><img src="${prefix}${site.logo}" alt="Bharat Metals" width="900" height="300"><p>Bharat Metals is a Chennai stainless steel stockist, supplier and wholesaler established in 1986, focused on practical stainless steel supply across Tamil Nadu and nearby South India markets.</p></div>
      <div><h2>Contact</h2><address>${site.addressLines.map(escapeHtml).join("<br>")}</address><p><a href="${site.phoneHref}">${escapeHtml(site.phone)}</a></p><p><a href="${mailto}">${escapeHtml(site.email)}</a></p><p><a href="mailto:${site.secondaryEmail}">${escapeHtml(site.secondaryEmail)}</a></p><p>Working hours: 10:00 AM to 6:00 PM</p><p>Weekly holiday: Sunday</p></div>
      <div><h2>Navigation</h2><ul><li><a href="${localHref(prefix, "")}">Home</a></li><li><a href="${localHref(prefix, "about-us/")}">Company Profile</a></li><li><a href="${localHref(prefix, "products/")}">Product Portfolio</a></li><li><a href="${localHref(prefix, "locations-we-serve/")}">Locations</a></li><li><a href="${localHref(prefix, "technical-data/")}">Technical Data</a></li><li><a href="${localHref(prefix, "request-quote/")}">Request a Quote</a></li><li><a href="${localHref(prefix, "blog/")}">Blog</a></li><li><a href="${localHref(prefix, "site-map/")}">Sitemap</a></li></ul></div>
      <div><h2>Products</h2><ul><li><a href="${localHref(prefix, "stainless-steel-pipes/")}">Stainless Steel Pipes</a></li><li><a href="${localHref(prefix, "stainless-steel-sheets/")}">Stainless Steel Sheets</a></li><li><a href="${localHref(prefix, "stainless-steel-plates/")}">Stainless Steel Plates</a></li><li><a href="${localHref(prefix, "stainless-steel-coils/")}">Stainless Steel Coils</a></li><li><a href="${localHref(prefix, "stainless-steel-rods/")}">Stainless Steel Rods</a></li><li><a href="${localHref(prefix, "stainless-steel-flanges/")}">Flanges</a></li></ul></div>
      <div><h2>Regions</h2><ul><li><a href="${localHref(prefix, "stainless-steel-suppliers-chennai/")}">Chennai</a></li><li><a href="${localHref(prefix, "stainless-steel-suppliers-coimbatore/")}">Coimbatore</a></li><li><a href="${localHref(prefix, "stainless-steel-suppliers-madurai/")}">Madurai</a></li><li><a href="${localHref(prefix, "stainless-steel-suppliers-trichy/")}">Trichy</a></li><li><a href="${localHref(prefix, "stainless-steel-suppliers-salem/")}">Salem</a></li><li><a href="${localHref(prefix, "stainless-steel-suppliers-hosur/")}">Hosur</a></li><li><a href="${localHref(prefix, "stainless-steel-suppliers-pondicherry/")}">Pondicherry</a></li></ul></div>
      <div><h2>Useful Links</h2><ul><li><a href="${site.maps}" target="_blank" rel="noopener">Google Maps</a></li><li><a href="https://www.indiamart.com/" target="_blank" rel="noopener">IndiaMART</a></li></ul><h2>Payment Modes</h2><p>UPI, Bank Transfer, Cheque, Cash</p></div>
    </div>
    <div class="container footer-bottom"><p>&copy; <span id="year">2026</span> Bharat Metals. All rights reserved.</p><a href="#top">Back to top</a></div>
  </footer>`;
}

function breadcrumbHtml(page, prefix) {
  const crumbs = [{ name: "Home", slug: "" }, ...(page.breadcrumbs || [])];
  return `<nav class="breadcrumbs" aria-label="Breadcrumb"><ol>${crumbs.map((c, i) => `<li>${i === crumbs.length - 1 ? `<span>${escapeHtml(c.name)}</span>` : `<a href="${localHref(prefix, c.slug)}">${escapeHtml(c.name)}</a>`}</li>`).join("")}</ol></nav>`;
}

function schema(site, page) {
  const url = joinUrl(site.finalDomain, page.slug);
  const graph = [
    { "@type": "Organization", "@id": `${site.finalDomain}#organization`, name: site.name, url: site.finalDomain, logo: joinUrl(site.finalDomain, site.ogLogo), foundingDate: "1986", telephone: site.phone, email: [site.email, site.secondaryEmail] },
    { "@type": "LocalBusiness", "@id": `${site.finalDomain}#localbusiness`, name: site.name, image: joinUrl(site.finalDomain, site.ogLogo), url: site.finalDomain, telephone: site.phone, email: site.email, foundingDate: "1986", priceRange: "$$", paymentAccepted: "UPI, Bank Transfer, Cheque, Cash", openingHours: "Mo-Sa 10:00-18:00", hasMap: site.maps, address: { "@type": "PostalAddress", streetAddress: "No. 19 (10), Shop No. G1 & S10, Majfa Towers, Mookernallamuthu Street", addressLocality: "Chennai", postalCode: "600001", addressRegion: "Tamil Nadu", addressCountry: "IN" } },
    { "@type": "BreadcrumbList", "@id": `${url}#breadcrumb`, itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: site.finalDomain }, ...(page.breadcrumbs || []).map((c, i) => ({ "@type": "ListItem", position: i + 2, name: c.name, item: joinUrl(site.finalDomain, c.slug) }))] }
  ];
  if (page.faq && page.faq.length) {
    graph.push({ "@type": "FAQPage", "@id": `${url}#faq`, mainEntity: page.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) });
  }
  if (page.type === "blog") {
    graph.push({ "@type": "BlogPosting", headline: page.h1, description: page.description, image: joinUrl(site.finalDomain, page.image || "assets/images/photos/materials/stainless-steel.webp"), author: { "@type": "Organization", name: site.name }, publisher: { "@type": "Organization", name: site.name, logo: { "@type": "ImageObject", url: joinUrl(site.finalDomain, site.ogLogo) } }, datePublished: "2026-07-03", dateModified: "2026-07-03", mainEntityOfPage: url });
  }
  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph }, null, 2);
}

function renderPage(site, page) {
  const prefix = relPrefix(page.slug);
  const canonical = joinUrl(site.finalDomain, page.slug);
  const title = page.title;
  return `<!doctype html>
<html lang="en-IN">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${attr(page.description)}">
    <meta name="robots" content="index, follow">
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
      ${page.body.replace(/href="(?!https?:|mailto:|tel:|#|\/|\.\/|\.\.\/)([^"]+)"/g, `href="${prefix}$1"`)}
    </main>
    ${footer(site, prefix)}
    <script src="${prefix}assets/js/main.js" defer></script>
  </body>
</html>`;
}

module.exports = { renderPage, escapeHtml, localHref, relPrefix };
