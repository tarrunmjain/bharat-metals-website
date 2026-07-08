# GoDaddy Nameserver Takeover Launch Report

Captured: 2026-07-08 12:51:21 +05:30

## Launch Status

Website DNS launch is mostly complete. The final domain now resolves through GoDaddy/domaincontrol nameservers and serves the Bharat Metals GitHub Pages site over HTTP. HTTPS and one mail-preservation record remain open.

## DNS Results

| Item | Result | Status |
| --- | --- | --- |
| Nameservers | `ns53.domaincontrol.com`, `ns54.domaincontrol.com` | PASS |
| Apex/root A records | `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` | PASS |
| `www` CNAME | `tarrunmjain.github.io` | PASS |
| MX | `mail.stainlesssteeldealers.com`, priority `0` | PASS |
| A `mail` | Missing / NXDOMAIN | FAIL - add `mail -> 199.188.200.143` |

## GitHub Pages

| Item | Result |
| --- | --- |
| Custom domain | `www.stainlesssteeldealers.com` |
| CNAME file | Present and correct |
| Pages status | `built` |
| HTTPS enforced | `false` |
| HTTPS attempt | Failed: `The certificate does not exist yet` |

## Live URL Checks

HTTP versions of requested URLs return 200 OK from GitHub Pages:

- `/`
- `/sitemap.xml`
- `/robots.txt`
- `/jindal-stainless-steel-sheets-chennai/`
- `/ss-304-sheet-price-chennai/`
- `/stainless-steel-pipes/`

HTTPS versions currently fail certificate trust until GitHub Pages certificate provisioning completes.

## Canonical And Sitemap

- Sample canonicals point to `https://www.stainlesssteeldealers.com/`.
- Sitemap has 564 final-domain URLs.
- Sitemap does not contain GitHub preview URLs.

## Open Issues

1. Add missing GoDaddy DNS record: A `mail` -> `199.188.200.143`.
2. Wait for GitHub Pages certificate provisioning.
3. Enable Enforce HTTPS once available.
4. Re-run HTTPS URL checks.
5. Then proceed with Search Console property/sitemap submission.

## Search Console Pending Tasks

- Add URL-prefix property: `https://www.stainlesssteeldealers.com/`.
- Add Domain property if possible: `stainlesssteeldealers.com`.
- Verify ownership.
- Submit `https://www.stainlesssteeldealers.com/sitemap.xml` after HTTPS is live.
- Request indexing for priority URLs.
