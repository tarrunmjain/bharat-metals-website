# GoDaddy Nameserver Takeover Launch Report

Captured: 2026-07-08 13:18:09 +05:30

## Launch Status

Website DNS launch is complete for HTTP. The final domain resolves through GoDaddy/domaincontrol nameservers, serves the Bharat Metals GitHub Pages site over HTTP, and the preserved mail records now resolve correctly. HTTPS remains pending GitHub Pages certificate provisioning.

## DNS Results

| Item | Result | Status |
| --- | --- | --- |
| Nameservers | `ns53.domaincontrol.com`, `ns54.domaincontrol.com` | PASS |
| Apex/root A records | `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` | PASS |
| `www` CNAME | `tarrunmjain.github.io` | PASS |
| MX | `mail.stainlesssteeldealers.com`, priority `0` | PASS |
| A `mail` | `199.188.200.143` | PASS |

## GitHub Pages

| Item | Result |
| --- | --- |
| Custom domain | `www.stainlesssteeldealers.com` |
| CNAME file | Present and correct |
| Pages status | `built` |
| HTTPS enforced | `false` |
| HTTPS attempt | Failed: `The certificate does not exist yet` |

## Live URL Checks

HTTP homepage returns 200 OK from GitHub Pages:

- `http://www.stainlesssteeldealers.com/`

HTTPS currently fails certificate trust until GitHub Pages certificate provisioning completes.

## Open Issues

1. Wait for GitHub Pages certificate provisioning.
2. Enable Enforce HTTPS once available.
3. Re-run HTTPS URL checks.
4. Then proceed with Search Console property/sitemap submission.

## Search Console Pending Tasks

- Add URL-prefix property: `https://www.stainlesssteeldealers.com/`.
- Add Domain property if possible: `stainlesssteeldealers.com`.
- Verify ownership.
- Submit `https://www.stainlesssteeldealers.com/sitemap.xml` after HTTPS is live.
- Request indexing for priority URLs.
