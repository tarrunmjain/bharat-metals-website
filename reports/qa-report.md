# Bharat Metals Sprint 1B QA Report

Date: 2026-07-03

## Scope

Final homepage lock pass for functional links, CTA behavior, accessibility labels, schema consistency, spelling, responsive polish and GitHub Pages preview safety.

## Results

| Check | Result | Notes |
| --- | --- | --- |
| Contact and enquiry links | PASS | Confirmed 4 `tel:+919941133888` links, 4 exact WhatsApp links and 5 exact primary RFQ mailto links. Footer secondary email is also clickable. |
| Google Maps and IndiaMART | PASS | Google Maps/Profile links use the provided map URL. IndiaMART remains a safe external placeholder with TODO comments. |
| Internal links and assets | PASS | 117 same-page links and local assets checked. No broken internal links or missing local references found. |
| Icon-only accessibility | PASS | 5 top-bar icon-only links have accessible names and decorative inline SVGs are `aria-hidden`. |
| Basic accessibility | PASS | One H1, `lang="en-IN"`, visible focus styling, labelled mobile nav button and dropdown `aria-haspopup`/`aria-controls` checked. |
| Mobile navigation | PASS | Mobile menu opens and updates `aria-expanded` to `true`. |
| Schema JSON-LD | PASS | Organization, LocalBusiness, BreadcrumbList and FAQPage JSON-LD parse successfully. |
| FAQ consistency | PASS | 10 visible FAQ questions and answers exactly match FAQPage schema entries. |
| Responsive smoke | PASS | Desktop 1440, tablet 768 and mobile 390 CSS-pixel checks show no horizontal overflow. |
| Spelling/content safety | PASS | Checked key spellings and confirmed no manufacturer claim, GST number, registration details, owner/partner name or Rubinox branding in public homepage files. |
| Launch safety | PASS | `.nojekyll` exists, `CNAME` is absent and no DNS, GoDaddy, nameserver, hosting or live website changes were made. |

## Screenshot Artifacts

- `qa/desktop-1440.png`
- `qa/tablet-768.png`
- `qa/mobile-390.png`

## Notes

- GitHub Pages preview remains the only Sprint 1B publishing target.
- The future canonical domain remains `https://www.stainlesssteeldealers.com/`; it is not connected.
- Deeper About, product, location and technical pages remain Sprint 2 work.
