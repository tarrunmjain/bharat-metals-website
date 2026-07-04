# Popular Search Chip Visual Fix

Checked: 2026-07-04T07:42:18.472Z

Popular search sections were regenerated with `.search-chip-grid` using `role="list"` and each `.search-chip` using `role="listitem"`. CSS now forces visible flex-wrapped pill chips with spacing, border and background.

| Page | Viewport | Screenshot | Chips | Grid display | Wrap | Result |
|---|---:|---|---:|---|---|---|
| / | 1440px | qa/screenshots/popular-search-home-desktop.png | 16 | flex | wrap | PASS |
| / | 390px | qa/screenshots/popular-search-home-mobile.png | 16 | flex | wrap | PASS |
| /ss-304/ | 1440px | qa/screenshots/popular-search-ss304-desktop.png | 16 | flex | wrap | PASS |
| /industries/commercial-kitchen-equipment/ | 1440px | qa/screenshots/popular-search-commercial-kitchen-desktop.png | 8 | flex | wrap | PASS |

Overall result: PASS
