# GSC First Optimisation Sprint Report

Date: 2026-07-23
Search Console period reviewed by request: 8-20 July 2026
Live domain: https://www.stainlesssteeldealers.com/

## Summary

Completed a targeted Search Console optimisation sprint without creating pages, changing DNS, changing GoDaddy, changing CNAME, changing hosting or modifying current contact details. Source generator/template files were updated and the static site was rebuilt.

## Pages Changed

CTR optimisation pages:

- `/stainless-steel-suppliers-sri-lanka/`
- `/stainless-steel-suppliers-pondicherry/`
- `/stainless-steel-suppliers-ambattur/`
- `/stainless-steel-suppliers-guindy/`
- `/stainless-steel-suppliers-kozhikode/`
- `/stainless-steel-suppliers-thrissur/`
- `/stainless-steel-suppliers-erode/`
- `/stainless-steel-suppliers-tirunelveli/`

Position-improvement pages with added internal-link support:

- `/ss-304-sheets-chennai/`
- `/stainless-steel-suppliers-coimbatore/`
- `/stainless-steel-suppliers-madurai/`
- `/ss-304/`
- `/industries/commercial-kitchen-equipment/`
- `/jindal-stainless-steel-pipes-chennai/`

Support surfaces changed:

- Homepage compact local trust block added inside the existing Chennai buyer coverage section.
- Hub pages received targeted money-page link support.
- Four selected blogs received more relevant useful links.

## Protected Pages

No title/H1 changes were made to these protected pages:

- Homepage
- Stainless Steel Suppliers Tirupati
- Stainless Steel Suppliers Hosur
- Stainless Steel Suppliers Rajapalayam
- SS 316 Sheets Chennai
- Stainless Steel Suppliers Parrys Chennai
- Stainless Steel Suppliers Sriperumbudur
- Stainless Steel Suppliers Oragadam
- MTC and Mill Certificate blog

Spot check confirmed one H1 on each protected page.

## Title Changes

- `/stainless-steel-suppliers-sri-lanka/` title changed to: `Stainless Steel Supply to Sri Lanka from Chennai | Bharat Metals`
- Other CTR target page titles kept their primary H1/location intent.

## Meta Description Changes

Meta descriptions were rewritten for all eight CTR optimisation pages. They include the city/country, SS 202/304/316 where relevant, core product forms, Chennai dispatch/source support and RFQ action language.

## First Paragraph Changes

The first visible opening copy was rewritten for all eight CTR pages. Final opening word counts:

| Page | Opening words |
| --- | ---: |
| Sri Lanka | 135 |
| Pondicherry | 130 |
| Ambattur | 130 |
| Guindy | 127 |
| Kozhikode | 126 |
| Thrissur | 124 |
| Erode | 126 |
| Tirunelveli | 126 |

All openings remain truthful: Bharat Metals is positioned as a Chennai-based dealer/supplier/source support business, with no branch claims outside Chennai and no manufacturer claim.

## Quick Answer and CTA

Each CTR page now has a compact quick-answer box covering:

- What Bharat Metals supplies
- Common grades
- Dispatch/source from Chennai
- What to send for quote

Call, WhatsApp and Email RFQ CTAs appear near the top on all eight CTR pages.

## Homepage Local Trust

Confirmed compact visible trust block:

- Bharat Metals
- Chennai address
- Open 10 AM-6 PM
- Call / WhatsApp `+91 99412 33888`
- Google Business Profile / Maps links
- Established in 1986

## Internal Links Added

See `reports/gsc-money-page-internal-link-map.md` for the full mapping. Main additions were made from:

- Homepage and existing hub sections
- Stainless Steel hub
- Products hub
- Related city pages
- SS 304 grade page
- Commercial kitchen industry page
- Jindal stainless steel pipes page
- Selected blogs

## HTTP Audit Result

See `reports/gsc-http-https-transition-audit.md`.

- 564 HTTP sitemap-equivalent URLs checked
- Direct HTTP to HTTPS redirect failures: 0
- Live HTTPS sample failures: 0
- Sitemap HTTPS only: Yes
- Robots blocks site: No

## Cannibalisation Audit Result

See `reports/ss202-ss304-cannibalisation-audit.md`.

- `/ss-202-vs-ss-304/` remains general technical/commercial comparison intent.
- `/blog/ss-202-vs-ss-304-railing-work/` remains railing/fabrication application intent.
- Both pages should be kept.

## QA Results

Build:

- `npm.cmd run build`: Pass
- Generated pages: 563 plus homepage
- Sitemap URLs: 564

Static QA:

- `npm.cmd run qa`: Pass
- HTML files: 564
- Links/assets checked: 64105
- JSON-LD blocks parsed: 564
- FAQ pages checked: 563
- Duplicate titles: 0
- Duplicate descriptions: 0
- Errors: 0
- CNAME present/correct: `www.stainlesssteeldealers.com`

Page audit:

- `npm.cmd run audit`: Pass
- Broken internal links: 0
- Schema mismatch: 0
- Unreachable within 3 clicks: 0

Responsive/browser:

- `npm.cmd run qa:browser`: Pass
- Viewports checked: 1440, 768, 390
- Horizontal overflow: No
- Mobile nav opens, dropdown opens, portfolio flyout opens, Escape closes nav.

Additional sanity checks:

- One H1 on all 564 HTML pages: Pass
- Old phone number occurrences in generated HTML: 0
- New tel link present: Yes
- New WhatsApp link present: Yes
- Refined HTTP canonical/internal-link scan: Pass

## DNS/GoDaddy

No DNS, GoDaddy, CNAME, hosting or GitHub Pages settings were changed in this sprint.

