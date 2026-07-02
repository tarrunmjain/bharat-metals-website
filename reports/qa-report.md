# Bharat Metals Sprint 1 QA Report

Date: 2026-07-02

## Scope

Homepage and global static website foundation for Bharat Metals.

## Results

| Check | Result | Notes |
| --- | --- | --- |
| Internal links and assets | PASS | 43 links/assets checked. Same-page anchors and local assets resolve. |
| Basic accessibility | PASS | One H1, `lang="en-IN"`, image alt text, labelled RFQ inputs, skip link, focus styling and mobile menu button checked. |
| Schema JSON-LD | PASS | Organization, LocalBusiness, FAQPage and BreadcrumbList JSON-LD parse successfully. |
| FAQ consistency | PASS | 9 visible FAQ items match 9 FAQPage schema entries. |
| Responsive smoke | PASS | Desktop 1366x900 and mobile 390x844 render with no horizontal overflow and no missing images. |
| Mobile navigation | PASS | Mobile menu button resolves uniquely and opens the navigation. |
| HTML validation | LIMITED | No dedicated local validator was available (`tidy`, `html-validate`, `vnu` not installed). Static parser and browser render checks passed. |
| Content safety | PASS | Public homepage/assets do not contain Rubinox branding, GST number, company registration details, owner/partner name, GoDaddy or DNS instructions. README contains only project safety notes. |
| Launch safety | PASS | No DNS, GoDaddy, nameserver, hosting or live website changes were made. |

## Screenshot Artifacts

- `qa/screenshots/desktop-home.png`
- `qa/screenshots/mobile-home.png`

## Notes

- GitHub Pages preview is the intended Sprint 1 publishing target.
- Canonical URL is set to the future domain `https://www.stainlesssteeldealers.com/`, but the domain is not connected in Sprint 1.
- Deeper pages for About, Products, Locations and Technical Data are planned for Sprint 2.
