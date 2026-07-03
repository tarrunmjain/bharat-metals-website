# Bharat Metals Sprint 1D QA Report

Date: 2026-07-03

## Scope

Final correction round to use supplied logo assets and stop using fake/drawn product, material and industry imagery as live homepage images.

## Results

| Check | Result | Notes |
| --- | --- | --- |
| Header logo | PASS | Header and footer use `assets/brand/bharat-metals-header-logo-clean-transparent.png`. Schema and OG image use supplied brand PNG assets. |
| Generated image archive | PASS | Generated/drawn material, product, industry, hero and generated logo assets were moved to `assets/archive/generated-illustrations/`. |
| Photo-ready structure | PASS | `assets/images/photos/hero/`, `materials/`, `product-forms/` and `industries/` exist with documented expected filenames. |
| Temporary image slots | PASS | Homepage material, product, industry and hero image slots now use text-based photo-pending placeholders with TODO comments for real approved photos. |
| Real photo status | PENDING | Current generated card images are temporary. Final realistic photo assets are pending. |
| Top bar readability | PASS | Top bar text is compact, readable and no longer heavy bold or glowing. |
| Top bar icons | PASS | 5 standalone icon links keep correct hrefs and `aria-label`s; decorative SVGs are `aria-hidden`. |
| Dropdown behavior | PASS | Desktop dropdown panel keeps the Sprint 1C no-gap behavior and remains keyboard/focus accessible. |
| Contact links | PASS | `tel`, WhatsApp and primary RFQ `mailto` links remain exact and correct. |
| Internal links/assets | PASS | Same-page links and local assets checked. No broken internal links found. |
| Schema JSON-LD | PASS | Organization, LocalBusiness, BreadcrumbList and FAQPage parse successfully. |
| FAQ consistency | PASS | Visible FAQ questions and answers exactly match FAQPage schema entries. |
| Responsive smoke | PASS | Desktop 1440, tablet 768 and mobile 390 CSS-pixel checks show no horizontal overflow. |
| Mobile navigation | PASS | Mobile menu opens and updates `aria-expanded` to `true`. |
| Launch safety | PASS | `.nojekyll` exists, `CNAME` is absent and no DNS, GoDaddy, nameserver, hosting or live website changes were made. |

## Screenshot Artifacts

- `qa/desktop-1440.png`
- `qa/tablet-768.png`
- `qa/mobile-390.png`

## Archived Assets

- `assets/archive/generated-illustrations/assets/images/materials/`
- `assets/archive/generated-illustrations/assets/images/products/`
- `assets/archive/generated-illustrations/assets/images/industries/`
- `assets/archive/generated-illustrations/assets/images/hero-*`
- `assets/archive/generated-illustrations/assets/images/visual-*`
- `assets/archive/generated-illustrations/assets/logo-bharat-metals.*`

## Notes

- GitHub Pages preview remains the only Sprint 1D publishing target.
- The future canonical domain remains `https://www.stainlesssteeldealers.com/`; it is not connected.
- Real photo assets are still pending for hero, material cards, product form cards and industry cards.
- Deeper About, product, location and technical pages remain Sprint 2 work.
