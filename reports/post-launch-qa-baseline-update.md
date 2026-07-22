# Post-Launch QA Baseline Update

- Checked at: 2026-07-23 00:25 IST
- Live domain: https://www.stainlesssteeldealers.com/
- Scope: QA script/report baseline only. No DNS, GoDaddy, GitHub Pages setting, CNAME value, content, or page-creation changes were made.

## CNAME Baseline

- Expected post-launch CNAME file: present
- Expected CNAME value: `www.stainlesssteeldealers.com`
- Local CNAME result: present and correct
- GitHub Pages custom domain: `www.stainlesssteeldealers.com`
- GitHub Pages source: `main` branch, `/` root
- GitHub Pages status: `built`
- HTTPS enforced: yes

Updated active QA/generator files:

- `scripts/qa-static.js`
- `scripts/core-patch-hard-check.js`
- `scripts/acceptance-qa.js`
- `scripts/acceptance-hard-check.js`
- `scripts/competitor-launch-readiness-audit.js`
- `scripts/build-pages.js`

Active script search for old pre-launch CNAME-failure rules returned no matches.

Historical pre-launch reports may still mention the old pre-launch expectation. They were intentionally left unchanged unless an active baseline report needed correction.

## Local QA Results

- JavaScript syntax checks: pass
- `npm.cmd run qa`: pass
  - HTML files: 564
  - Sitemap URLs: 564
  - Internal links/assets checked: 64,017
  - JSON-LD blocks parsed: 564
  - FAQ pages checked for schema consistency: 563
  - Errors: 0
- `npm.cmd run audit`: pass
  - Static HTML pages: 564
  - Sitemap URLs: 564
  - Broken internal links: 0
  - Schema mismatches: 0
  - Unreachable within 3 clicks: 0
- One H1 check: pass
  - Site HTML pages checked: 564
  - Pages with invalid H1 count: 0
- Old phone number outside reports: 0
- New phone number outside reports: 4,526
- `.nojekyll`: present

Additional active report checks:

- `npm.cmd run qa:core-patch-hard`: pass, CNAME present and correct
- `node scripts/acceptance-hard-check.js`: pass, errors 0
- `node scripts/acceptance-qa.js`: pass, CNAME present and correct, errors 0
- `node scripts/competitor-launch-readiness-audit.js`: pass, live sample pass, CNAME present and correct

## Live HTTPS Checks

All checked URLs returned HTTP 200 over HTTPS with no certificate error from `Invoke-WebRequest`:

- https://www.stainlesssteeldealers.com/
- https://www.stainlesssteeldealers.com/sitemap.xml
- https://www.stainlesssteeldealers.com/robots.txt
- https://www.stainlesssteeldealers.com/site-map/
- https://www.stainlesssteeldealers.com/stainless-steel-suppliers-chennai/
- https://www.stainlesssteeldealers.com/stainless-steel-pipes/
- https://www.stainlesssteeldealers.com/stainless-steel-sheets/
- https://www.stainlesssteeldealers.com/ss-304/
- https://www.stainlesssteeldealers.com/ss-316/
- https://www.stainlesssteeldealers.com/jindal-stainless-steel-sheets-chennai/
- https://www.stainlesssteeldealers.com/ss-304-sheet-price-chennai/
- https://www.stainlesssteeldealers.com/request-quote/
- https://www.stainlesssteeldealers.com/contact-us/

Critical live assets returned HTTP 200:

- https://www.stainlesssteeldealers.com/assets/css/styles.css
- https://www.stainlesssteeldealers.com/assets/js/main.js
- https://www.stainlesssteeldealers.com/assets/brand/bharat-metals-header-logo-centered-left-transparent.png
- https://www.stainlesssteeldealers.com/assets/images/photos/hero/stainless-steel-pipes-stockyard.webp

Canonical checks:

- HTML pages checked in the live sample use `https://www.stainlesssteeldealers.com/` canonical URLs.
- `sitemap.xml` contains 564 URLs.
- Sitemap URLs all use `https://www.stainlesssteeldealers.com/`.
- `robots.txt` allows the site and references final-domain sitemaps.

## DNS / GoDaddy

Read-only DNS verification showed:

- `www.stainlesssteeldealers.com` CNAME resolves to `tarrunmjain.github.io`
- Apex/root resolves to GitHub Pages A records:
  - `185.199.108.153`
  - `185.199.109.153`
  - `185.199.110.153`
  - `185.199.111.153`

No DNS, GoDaddy, GitHub Pages setting, or CNAME value changes were made.
