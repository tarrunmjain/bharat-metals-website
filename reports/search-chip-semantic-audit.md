# Search Chip Semantic Audit

Generated: 2026-07-05T10:54:09.865Z

## Summary

- HTML files checked: 564
- Pages with popular search sections: 484
- Popular search sections checked: 484
- Semantic failures: 0

## Sample Pages

| Page | Popular sections | li.search-chip count | Status |
| --- | ---: | ---: | --- |
| / | 1 | 22 | PASS |
| /about-us/ | 1 | 10 | PASS |
| /request-quote/ | 1 | 10 | PASS |
| /blog/ | 1 | 10 | PASS |
| /ss-304/ | 1 | 16 | PASS |
| /stainless-steel/ | 1 | 10 | PASS |
| /industries-we-serve/ | 1 | 10 | PASS |
| /stainless-steel-suppliers-renigunta/ | 1 | 10 | PASS |

## Rules Checked

- Every `.popular-searches` section contains `ul.search-chip-grid`.
- Every `.search-chip-grid` uses `li.search-chip` elements.
- No popular search chip grid uses `span` or `div` chip elements.
- No popular search section uses a long keyword-like paragraph as the chip list.

## Failures

None.
