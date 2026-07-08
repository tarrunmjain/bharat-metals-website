# Live Domain Verification - 2026-07-08

Captured: 2026-07-08 13:18:09 +05:30

## Result

Bharat Metals is now resolving to GitHub Pages over HTTP at the final domain. DNS and mail preservation checks pass. HTTPS is pending GitHub certificate provisioning.

## Pass

- GoDaddy/domaincontrol nameservers are active.
- Apex/root A records point to all four GitHub Pages IPs.
- `www` CNAME points to `tarrunmjain.github.io`.
- GitHub Pages custom domain is `www.stainlesssteeldealers.com`.
- MX `@` points to `mail.stainlesssteeldealers.com`, priority `0`.
- A `mail` points to `199.188.200.143`.
- HTTP final domain returns 200 OK from GitHub Pages.

## Pending

- GitHub Pages HTTPS certificate does not exist yet; Enforce HTTPS is not available yet.

## Next Check

```powershell
curl.exe -I https://www.stainlesssteeldealers.com/
gh api repos/tarrunmjain/bharat-metals-website/pages --jq '{cname:.cname, https_enforced:.https_enforced, status:.status}'
```
