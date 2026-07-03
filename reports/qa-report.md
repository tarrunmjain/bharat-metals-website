# Bharat Metals Sprint 1C QA Report

Date: 2026-07-03

## Scope

Final visual correction round before Sprint 2: logo, top bar readability/icons, dropdown hover behavior, hero visual, product-form visuals, industry visuals and preview safety.

## Results

| Check | Result | Notes |
| --- | --- | --- |
| Logo assets | PASS | `assets/logo-bharat-metals.svg`, `.png` and `.webp` exist. PNG export has transparent corners. |
| Hero image | PASS | `assets/images/hero-stainless-steel-pipes-stockyard.webp` exists, is referenced by the hero and decodes in browser. |
| Product images | PASS | 16 product-form WebP assets exist, are referenced, use lazy loading and decode in browser. |
| Industry images | PASS | 15 industry WebP assets exist, are referenced, use lazy loading and decode in browser. |
| Top bar icons | PASS | 5 standalone icon links have correct hrefs and `aria-label`s; decorative SVGs are `aria-hidden`. |
| Top bar readability | PASS | Text weight reduced from heavy bold to a cleaner uppercase silver style. |
| Dropdown behavior | PASS | Desktop dropdown panel uses `top: 100%`; browser hover movement from parent item into dropdown keeps the menu visible. |
| Contact links | PASS | `tel`, WhatsApp and primary RFQ `mailto` links remain exact and correct. |
| Internal links/assets | PASS | 117 same-page links and local assets checked. No broken internal links found. |
| Browser image decode | PASS | 38 images decoded successfully; 32 are WebP assets including 16 product and 15 industry images. |
| Schema JSON-LD | PASS | Organization, LocalBusiness, BreadcrumbList and FAQPage parse successfully. |
| FAQ consistency | PASS | 10 visible FAQ questions and answers exactly match FAQPage schema entries. |
| Responsive smoke | PASS | Desktop 1440, tablet 768 and mobile 390 CSS-pixel checks show no horizontal overflow. |
| Mobile navigation | PASS | Mobile menu opens and updates `aria-expanded` to `true`. |
| Launch safety | PASS | `.nojekyll` exists, `CNAME` is absent and no DNS, GoDaddy, nameserver, hosting or live website changes were made. |

## Screenshot Artifacts

- `qa/desktop-1440.png`
- `qa/tablet-768.png`
- `qa/mobile-390.png`

## Notes

- GitHub Pages preview remains the only Sprint 1C publishing target.
- The future canonical domain remains `https://www.stainlesssteeldealers.com/`; it is not connected.
- New visual assets were generated locally as original WebP/PNG/SVG website assets. They are more realistic and metallic than the Sprint 1A/1B vector cards, but they are not true camera photographs.
- Deeper About, product, location and technical pages remain Sprint 2 work.
