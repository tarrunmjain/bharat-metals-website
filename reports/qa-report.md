# Bharat Metals Sprint 1A QA Report

Date: 2026-07-03

## Scope

Homepage redesign and polish for the Bharat Metals GitHub Pages preview.

## Results

| Check | Result | Notes |
| --- | --- | --- |
| Internal links and assets | PASS | 117 same-page links and local assets checked. No missing local references found. |
| Basic accessibility | PASS | One H1, `lang="en-IN"`, image alt text, labelled contact icons, labelled mobile nav button and keyboard-friendly dropdown controls checked. |
| Schema JSON-LD | PASS | Organization, LocalBusiness, BreadcrumbList and FAQPage JSON-LD parse successfully. |
| FAQ consistency | PASS | 10 visible FAQ questions and answers match the FAQPage schema entries. |
| Responsive smoke | PASS | Desktop 1440, tablet 768 and mobile 390 CSS-pixel screenshots show no horizontal overflow. |
| Mobile navigation | PASS | Mobile menu opens and updates `aria-expanded` to `true`. |
| Static styling guardrails | PASS | No viewport-scaled font sizing, no negative letter spacing and no broken local image references detected. |
| Content safety | PASS | Homepage/CSS/JS do not contain Rubinox branding, GST number, company registration details, owner/partner name or manufacturer claims. |
| Launch safety | PASS | `.nojekyll` exists, `CNAME` is absent and no DNS, GoDaddy, nameserver, hosting or live website changes were made. |

## Screenshot Artifacts

- `qa/desktop-1440.png`
- `qa/tablet-768.png`
- `qa/mobile-390.png`

## Notes

- GitHub Pages preview remains the only Sprint 1A publishing target.
- Canonical URL is still the future domain `https://www.stainlesssteeldealers.com/`; the domain is not connected.
- IndiaMART uses a placeholder link until the final business profile URL is available.
- Deeper About, product, location and technical pages remain planned for Sprint 2.
