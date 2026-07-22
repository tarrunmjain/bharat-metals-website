# Hosting Performance Audit

- Live domain: https://www.stainlesssteeldealers.com/
- Checked: 2026-07-23
- Scope: audit only. No DNS, GoDaddy, GitHub Pages settings, hosting, pages or content were changed.
- Current hosting: GitHub Pages
- GitHub Pages status: `built`
- Source: `main` branch, `/` root
- Custom domain: `www.stainlesssteeldealers.com`
- HTTPS enforced: yes

## Recommendation

Stay on GitHub Pages short-term for the indexing phase. The current setup is fast enough, HTTPS is healthy, top money pages return 200, assets load correctly, and the homepage has low lab layout risk.

Migration is not urgent. Reconsider Cloudflare Pages later if Bharat Metals needs stronger edge caching, custom headers, redirect control, Web Analytics, or if Search Console / CrUX field data later shows Core Web Vitals issues. Netlify is also workable, but Cloudflare Pages is the better later candidate if DNS/CDN control becomes the main requirement.

## Live Response Checks

Each page was fetched 3 times over HTTPS. Median response times are from this local connection and should be treated as directional, not universal field data.

| URL | HTTP | HTML bytes | Median response |
| --- | ---: | ---: | ---: |
| `/` | 200 | 58,680 | 99 ms |
| `/stainless-steel/` | 200 | 50,347 | 84 ms |
| `/stainless-steel-pipes/` | 200 | 38,910 | 67 ms |
| `/stainless-steel-sheets/` | 200 | 38,754 | 56 ms |
| `/ss-304/` | 200 | 42,806 | 58 ms |
| `/ss-316/` | 200 | 42,091 | 51 ms |
| `/jindal-stainless-steel-sheets-chennai/` | 200 | 36,189 | 54 ms |
| `/ss-304-sheet-price-chennai/` | 200 | 32,525 | 43 ms |
| `/stainless-steel-suppliers-chennai/` | 200 | 36,006 | 43 ms |
| `/stainless-steel-suppliers-coimbatore/` | 200 | 30,821 | 33 ms |

System files:

| URL | HTTP | Bytes | Median response |
| --- | ---: | ---: | ---: |
| `/sitemap.xml` | 200 | 110,814 | 168 ms |
| `/robots.txt` | 200 | 83 | 30 ms |

All checked canonical URLs use `https://www.stainlesssteeldealers.com/`.

## Asset Status

Homepage CSS, JS, logo, icons and images returned HTTP 200. Largest homepage assets observed:

| Asset | Type | Bytes |
| --- | --- | ---: |
| Hero pipes image | WebP | 207,224 |
| Stainless steel material image | WebP | 198,244 |
| Copper material image | WebP | 119,928 |
| Brass material image | WebP | 111,298 |
| Aluminium material image | WebP | 84,658 |
| BM map icon | PNG | 60,412 |
| Main CSS | CSS | 33,950 |
| Header logo | PNG | 32,634 |
| Main JS | JS | 3,298 |

Homepage HTML size is about 58.7 KB decoded. There are 42 image tags, all with width and height attributes. The hero image has `fetchpriority="high"`. No image-dimension CLS issue was found.

## Lab Metrics

Lighthouse CLI was not installed locally. Google PageSpeed Insights was attempted but returned HTTP 429, so no PageSpeed score is included. A headless Microsoft Edge CDP check was run with an unthrottled network.

| Metric | Desktop 1440 | Mobile 390 |
| --- | ---: | ---: |
| TTFB | 220 ms | 5 ms |
| DOMContentLoaded | 1,105 ms | 109 ms |
| Load event | 1,129 ms | 149 ms |
| First Contentful Paint | 1,256 ms | 216 ms |
| Largest Contentful Paint | 1,440 ms | 248 ms |
| CLS | 0 | 0 |
| Loaded resource transfer | 990,872 bytes | 347,640 bytes |
| Image transfer | 922,258 bytes | 279,026 bytes |
| Horizontal overflow | no | no |

LCP element on both desktop and mobile:

`assets/images/photos/hero/bharat-metals-stainless-steel-pipes-hero-v3.webp`

The header, top bar, hero image and footer all rendered with CSS/JS loaded. Header/footer are static HTML, so they are not dependent on heavy client-side rendering.

## Risks

GitHub Pages risks:

- Limited custom HTTP header control compared with Cloudflare Pages or Netlify.
- No built-in image optimization pipeline.
- No edge functions or advanced redirect/header rules.
- Less operational visibility than a dedicated web hosting/CDN platform.

Current performance risks:

- Desktop homepage image transfer is close to 0.9 MB because several below-the-fold images load during the lab viewport window.
- Hero image is the LCP element at about 207 KB. It is acceptable now, but it is the first asset to optimize if field LCP becomes weak.
- No CLS problem was observed, and all homepage images have dimensions.

## Migration Options

Cloudflare Pages pros:

- Strong CDN and edge controls.
- Better header/cache/redirect control.
- Good Web Analytics and DNS/CDN integration.
- Better long-term fit if traffic grows or field Core Web Vitals need tuning.

Cloudflare Pages cons:

- Migration can involve DNS or nameserver changes.
- Email records must be preserved exactly.
- Adds avoidable risk while Google indexing is just starting.

Netlify pros:

- Easy static deployment and deploy previews.
- Good redirect/header features.
- Straightforward for a static SEO site.

Netlify cons:

- DNS/custom-domain changes still need care.
- Free-tier bandwidth/build limits should be watched.
- Less attractive than Cloudflare if the main need is edge/CDN/DNS control.

## DNS And Email Caution

If hosting is migrated later, preserve and verify all email records before and after any DNS change:

- MX for `@`
- `mail` A record
- SPF
- DKIM
- DMARC
- Any provider verification TXT records

Use a DNS inventory, low-TTL window and rollback plan. Do not migrate hosting during the early indexing phase unless there is a clear failure.

## Decision

Recommendation: stay on GitHub Pages now, migrate later if needed.

Urgency: not urgent.

Current setup is acceptable for indexing and basic business enquiries.
