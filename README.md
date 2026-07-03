# Bharat Metals Website

Static GitHub Pages preview project for Bharat Metals, a Chennai stainless steel dealer, stockist, supplier and wholesaler established in 1986.

## Current Scope

- Homepage and global website foundation
- Static generated SEO/GEO/AEO page system
- 428 total HTML pages including the homepage
- Stainless steel product, grade, grade-form, location, industry, secondary material and blog pages
- Generated sitemap and robots.txt
- Organization, LocalBusiness, BreadcrumbList and FAQPage JSON-LD schema
- Responsive red, silver and graphite Bharat Metals visual system
- RFQ-focused call, WhatsApp and email actions
- Static QA reports in `reports/`

## Build And QA

This is a static site. No framework build step or package install is required.

```powershell
node scripts\build-pages.js
node scripts\qa-static.js
node scripts\qa-browser-cdp.js
```

Available npm scripts:

```powershell
npm run build
npm run qa
npm run qa:browser
```

The browser QA script uses the local Microsoft Edge executable through Chrome DevTools Protocol and writes screenshots to `qa/` plus `reports/qa-browser-cdp.json`.

## Generated Page Counts

- Core pages: 18
- Stainless steel product pages: 16
- Grade pages: 9
- Grade and product form pages: 144
- Location pages: 120
- Industry pages: 25
- Secondary material pages: 17
- City and product pages: 33
- Grade and city pages: 30
- Blog pages: 15

## Photo Asset Status

Only supplied approved realistic photo assets should be used. Do not add SVG drawings, CSS/canvas-generated artwork, clipart, cartoon imagery, random stock images, hotlinked files, Google image downloads or Rubinox assets as final material/product/industry photos.

Temporary `Photo pending` placeholders remain where approved final photos have not yet been supplied, especially aluminium/brass/copper material cards, stainless product-form cards, industry cards and secondary material detail pages.

The expected file naming system is documented in `assets/images/photos/README.md`.

## Business Positioning

Bharat Metals is positioned as an old trusted Chennai stainless steel dealer and modern wholesale supplier. Stainless steel remains the primary focus, with selected aluminium, brass and copper sourcing handled only as secondary commercial categories based on stock, sourceability, size and quantity.

## Safety Notes

- This project is separate from Rubinox.
- No Rubinox branding, wording, colors, layout or assets are used.
- No DNS, GoDaddy, nameserver, hosting or email records are changed here.
- No CNAME file is used.
- The future canonical domain is `https://www.stainlesssteeldealers.com/`, but preview publishing stays on GitHub Pages until launch is explicitly approved.
