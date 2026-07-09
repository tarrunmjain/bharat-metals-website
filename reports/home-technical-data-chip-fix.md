# Homepage Technical Data Chip Visibility Fix

Captured: 2026-07-09 14:41:45 +05:30

## Scope

Fixed the homepage Technical Data teaser chips so the three quick links are visible and clickable on desktop and mobile.

## Fixed Chips

| Label | Link | Local target | Browser visibility |
| --- | --- | --- | --- |
| SS 304 Equivalent Grades | `/ss-304-equivalent-grades/` | Present | PASS |
| ASTM A240 Stainless Steel Sheets | `/astm-a240-stainless-steel-sheets-chennai/` | Present | PASS |
| ASTM A312 Stainless Steel Pipes | `/astm-a312-stainless-steel-pipes-chennai/` | Present | PASS |

## CSS Change

Updated `.technical-chip-row a` to use a dedicated visible pill style:

- Graphite text: `#20242B` via `var(--graphite)`
- White background
- Visible graphite-tinted border
- Rounded pill shape
- Slight lift and red accent on hover/focus
- Full-width centered chips on small mobile screens

The CTA button `VIEW TECHNICAL DATA` was preserved.

## Local Browser Verification

Headless Edge rendered the homepage at desktop and mobile widths.

| Viewport | Screenshot | Result |
| --- | --- | --- |
| 1440 desktop | `qa/screenshots/fix-home-technical-chips-desktop.png` | PASS |
| 390 mobile | `qa/screenshots/fix-home-technical-chips-mobile.png` | PASS |

Computed chip styles showed visible text for all three chips:

- color: `rgb(32, 36, 43)`
- background: `rgb(255, 255, 255)`
- visible: `true`

## Static QA

- `npm.cmd run audit`: PASS, 0 broken internal links, 0 schema mismatches.
- `npm.cmd run qa`: link/assets/schema checks passed, but the legacy pre-launch assertion reports `CNAME must be absent`. This is expected after launch because the final domain requires `CNAME`.

## DNS / CNAME Safety

- No DNS changes were made.
- No GoDaddy changes were made.
- GitHub Pages `CNAME` was not changed.