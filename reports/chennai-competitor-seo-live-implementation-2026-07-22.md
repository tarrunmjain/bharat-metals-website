# Chennai Competitor SEO — Live Implementation Verification

**Date:** 22 July 2026  
**Repository:** `tarrunmjain/bharat-metals-website`  
**Primary commit:** `b402325d7b0ccdbe3437f7cffdd2a68d823c2089`

## Implemented routes

The live site JavaScript now applies canonical-URL-gated enhancements only to these seven routes:

1. `/`
2. `/stainless-steel-suppliers-chennai/`
3. `/stainless-steel-pipes-chennai/`
4. `/stainless-steel-sheets-chennai/`
5. `/stainless-steel-plates-chennai/`
6. `/stainless-steel-rods-chennai/`
7. `/stainless-steel-bars-chennai/`

Other pages keep their existing content and behaviour.

## Live-page enhancements

- Updated page titles, meta descriptions, Open Graph titles/descriptions, H1 headings, hero introductions and breadcrumb labels where applicable.
- Added useful, visible Chennai buyer content after the hero section.
- Added exact commercial intent for dealer, supplier, stockist and wholesaler searches.
- Added ERW, EFW, welded and seamless pipe terminology.
- Added 2B, BA, No. 1, No. 4, mirror, matt, hairline, brush, satin and PVC-coated finish terminology.
- Added bright, black, peeled, ground, precision, round, flat, hex and square bar terminology.
- Added ASTM A240, A312, A213, A249 and A269 references where relevant.
- Added MTC, mill certificate, heat number, traceability and EN 10204 3.1 enquiry terminology.
- Added Chennai locality and industry relevance without claiming branches or warehouses.
- Added internal links only to existing Bharat Metals pages.
- Enhanced Organization, LocalBusiness, WebPage, BreadcrumbList and page-specific Service structured data while preserving the existing FAQPage data.

## Durable static-build implementation

The same optimisation logic exists in `scripts/seo-chennai-competitor-patch.js`, and the normal `npm run build` command now runs it after the main page generator. A future successful static build will therefore bake the enhancements into the generated HTML and avoid duplicate sections because both implementations use route-specific markers.

## Discovery

A focused `sitemap-chennai.xml` was added with a `2026-07-22` last-modified date for all seven priority URLs. `robots.txt` declares both the main sitemap and the focused Chennai sitemap.

## QA performed

- `node --check` passed for the intended updated JavaScript.
- A mocked DOM execution test passed for all seven canonical routes.
- Every tested route updated title, meta description, Open Graph metadata, H1, hero introduction, visible content section and page-specific Service structured data.
- Structured data remained valid JSON after modification.
- Existing FAQ schema was not removed or rewritten by the live enhancement.
- The live enhancement is idempotent and does not insert duplicate sections.
- Existing navigation, dropdown, mobile-menu, click-outside and Escape-key behaviour was retained.

## Claim safeguards

- Bharat Metals is described as a dealer, stockist, supplier and wholesaler, not a manufacturer.
- No guaranteed inventory, fixed rate, same-day delivery, approval, authorisation or certification claim was added.
- Specialist grades are described as specification-led enquiries subject to exact product, size, quantity, sourceability and availability.
- Jindal is described only as a buyer make preference, not as an automatic authorised-dealership claim.
- No fabricated review, rating, price, Offer or inventory structured data was added.

## Operational note

The repository's custom GitHub Actions runner did not execute during this sprint. The durable generator patch remains committed, and the canonical-gated live enhancement was therefore published through the existing site JavaScript asset so the priority pages receive the improvements without depending on that runner.
