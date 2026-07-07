# Final Domain Pre-Launch QA

Date: 2026-07-07

Scope: preparation-only QA for launching Bharat Metals from GitHub Pages preview to the future custom domain https://www.stainlesssteeldealers.com/. No DNS, GoDaddy, CNAME, email, nameserver, or final-domain connection changes were made.

## Result

Overall status: **PASS for launch preparation**

The site is ready for the later launch sequence, subject to the pending custom-domain and DNS steps documented in the launch plans.

## Build And Crawl

| Check | Result |
| --- | --- |
| Build/regenerate pages | PASS - 563 generated pages plus homepage |
| Sitemap URL count | PASS - 564 URLs |
| Static crawl | PASS |
| Broken internal links | PASS - none found |
| Broken image/assets | PASS - none found |
| sitemap.xml exists | PASS |
| Sitemap includes generated URLs | PASS |
| Human sitemap /site-map/ | PASS |
| obots.txt exists | PASS |
| .nojekyll exists | PASS |
| CNAME absent | PASS |

## SEO And Structured Data

| Check | Result |
| --- | --- |
| Canonicals use final domain | PASS |
| Sitemap URLs use final domain | PASS |
| JSON-LD parses | PASS |
| FAQ schema matches visible FAQs | PASS |
| One H1 per page | PASS |
| Duplicate titles | PASS - 0 duplicates |
| Duplicate meta descriptions | PASS - 0 duplicates |

## Navigation, Links And CTAs

| Check | Result |
| --- | --- |
| Header links | PASS |
| Footer links | PASS |
| Top bar call link | PASS |
| Top bar WhatsApp link | PASS |
| Top bar email link | PASS |
| Google Business Profile / Maps link | PASS |
| IndiaMART final URL sitewide | PASS |
| IndiaMART placeholder removed | PASS |
| Footer useful links | PASS |

IndiaMART URL verified sitewide:
https://www.indiamart.com/bharatmetals-chennai/profile.html?srsltid=AfmBOoojZ-XWsb5imrtauCfOghab2gJsCDru3QvurY4SkTxle4LpoSsN

## Claim Safety

| Check | Result |
| --- | --- |
| No manufacturer claim | PASS |
| No authorized/official Jindal dealer claim | PASS |
| No unsupported distributor/authorized stockist claim | PASS |
| No fake fixed prices | PASS |
| No invented rate table | PASS |
| No branch office outside Chennai | PASS |
| No GST number | PASS |
| No registration details | PASS |
| No owner/partner name | PASS |
| No fake review/rating schema | PASS |
| No Payment Modes text | PASS |
| No old 2026 footer copyright line | PASS |

Note: the phrase scan is interpreted with the dedicated safety scripts. Buyer-education wording such as "no fixed price" or "not a rate table" is safe and does not indicate a pricing claim.

## Responsive And Browser QA

| Viewport / Behavior | Result |
| --- | --- |
| Desktop 1440 | PASS |
| Tablet 768 | PASS |
| Mobile 390 | PASS |
| Horizontal overflow | PASS - none found |
| Mobile menu open/close | PASS |
| Header Product Portfolio flyout | PASS |
| Escape closes navigation/flyout | PASS |

## Live Preview And Domain State

| Check | Result |
| --- | --- |
| GitHub Pages status | Built |
| GitHub Pages source | main branch, root / |
| Preview URL | https://tarrunmjain.github.io/bharat-metals-website/ |
| Custom domain | Not connected |
| CNAME file | Absent |
| GoDaddy/DNS changes | None made |

## QA Commands Run

- 
ode scripts/build-pages.js
- 
ode scripts/qa-static.js
- 
ode scripts/audit-pages.js
- 
ode scripts/acceptance-qa.js
- 
ode scripts/core-patch-hard-check.js
- 
ode scripts/search-chip-semantic-audit.js
- 
ode scripts/acceptance-hard-check.js
- 
ode scripts/competitor-launch-readiness-audit.js
- 
ode scripts/qa-browser-cdp.js
- 
ode scripts/acceptance-browser-qa.js

## Launch Blockers

No site-code blocker was found for a later launch.

Remaining external launch prerequisites:

1. Add the GitHub Pages custom domain only during the later launch task.
2. Update DNS only during the later launch task.
3. Verify/enable HTTPS after DNS propagation.
4. Submit sitemap and priority URLs in Google Search Console after the final domain resolves.
