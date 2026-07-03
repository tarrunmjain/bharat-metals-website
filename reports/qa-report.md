# Bharat Metals Logo Hotfix v6 QA Report

Date: 2026-07-03

## Scope

Logo hotfix to replace all live logo usage with supplied v6 centered-left Bharat Metals logo assets while preserving the Sprint 1D homepage layout, content, CTA buttons, menu, footer and photo-pending placeholders.

## Results

| Check | Result | Notes |
| --- | --- | --- |
| Header logo | PASS | Header and footer use `assets/brand/bharat-metals-header-logo-centered-left-transparent.png` with matching `900x300` intrinsic dimensions. Schema and OG image use supplied v6 centered-left horizontal PNG assets. |
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
| Header visual smoke | PASS | Desktop 1440 and mobile 390 screenshots show the supplied v6 logo rendering without distortion. |
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
- `assets/archive/brand-logo-revisions/` for older v4/v5 logo files no longer used live

## Notes

- GitHub Pages preview remains the only publishing target for this logo hotfix.
- The future canonical domain remains `https://www.stainlesssteeldealers.com/`; it is not connected.
- Real photo assets are still pending for hero, material cards, product form cards and industry cards.
- Deeper About, product, location and technical pages remain Sprint 2 work.
