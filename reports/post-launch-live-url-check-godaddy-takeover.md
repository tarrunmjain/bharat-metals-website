# Post-Launch Live URL Check - GoDaddy Takeover

Captured: 2026-07-08 12:51:21 +05:30

## Summary

The site is live on GitHub Pages over HTTP. HTTPS is pending certificate provisioning.

## HTTP URL Checks

| URL | Status | Server |
| --- | --- | --- |
| `http://www.stainlesssteeldealers.com/` | 200 OK | GitHub.com |
| `http://www.stainlesssteeldealers.com/sitemap.xml` | 200 OK | GitHub.com |
| `http://www.stainlesssteeldealers.com/robots.txt` | 200 OK | GitHub.com |
| `http://www.stainlesssteeldealers.com/jindal-stainless-steel-sheets-chennai/` | 200 OK | GitHub.com |
| `http://www.stainlesssteeldealers.com/ss-304-sheet-price-chennai/` | 200 OK | GitHub.com |
| `http://www.stainlesssteeldealers.com/stainless-steel-pipes/` | 200 OK | GitHub.com |
| `http://stainlesssteeldealers.com/` | 200 OK, resolves to `http://www.stainlesssteeldealers.com/` | GitHub.com |

## HTTPS URL Checks

| URL | Current status |
| --- | --- |
| `https://www.stainlesssteeldealers.com/` | TLS/certificate trust failure |
| `https://www.stainlesssteeldealers.com/sitemap.xml` | TLS/certificate trust failure |
| `https://www.stainlesssteeldealers.com/robots.txt` | TLS/certificate trust failure |
| `https://www.stainlesssteeldealers.com/jindal-stainless-steel-sheets-chennai/` | TLS/certificate trust failure |
| `https://www.stainlesssteeldealers.com/ss-304-sheet-price-chennai/` | TLS/certificate trust failure |
| `https://www.stainlesssteeldealers.com/stainless-steel-pipes/` | TLS/certificate trust failure |

## Interpretation

DNS is now routing the website to GitHub Pages, but HTTPS is not ready because GitHub has not issued the custom-domain certificate yet. Recheck after certificate provisioning and then enable Enforce HTTPS.
