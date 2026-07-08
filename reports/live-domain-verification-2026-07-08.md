# Live Domain Verification - 2026-07-08

Captured: 2026-07-08 12:51:21 +05:30

## Result

Bharat Metals is now resolving to GitHub Pages over HTTP at the final domain. HTTPS is pending GitHub certificate provisioning, and the `mail` A record still needs to be added in GoDaddy DNS.

## Pass

- GoDaddy/domaincontrol nameservers are active.
- Apex/root A records point to all four GitHub Pages IPs.
- `www` CNAME points to `tarrunmjain.github.io`.
- GitHub Pages custom domain is `www.stainlesssteeldealers.com`.
- HTTP live URLs return 200 OK from GitHub Pages.
- Canonicals and sitemap use `https://www.stainlesssteeldealers.com/`.

## Needs Fix / Wait

- Add A `mail` -> `199.188.200.143` in GoDaddy DNS.
- GitHub Pages HTTPS certificate does not exist yet; Enforce HTTPS is not available yet.

## Next Check After Fix

```powershell
Resolve-DnsName mail.stainlesssteeldealers.com -Type A
curl.exe -I https://www.stainlesssteeldealers.com/
curl.exe -I https://www.stainlesssteeldealers.com/sitemap.xml
```
