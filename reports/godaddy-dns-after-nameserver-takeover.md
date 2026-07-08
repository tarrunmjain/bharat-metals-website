# GoDaddy DNS After Nameserver Takeover

Captured: 2026-07-08 13:18:09 +05:30

## Current DNS State

| Record | Expected | Current result | Status |
| --- | --- | --- | --- |
| NS | GoDaddy/domaincontrol nameservers | `ns53.domaincontrol.com`, `ns54.domaincontrol.com` | PASS |
| A `@` | `185.199.108.153` | Present | PASS |
| A `@` | `185.199.109.153` | Present | PASS |
| A `@` | `185.199.110.153` | Present | PASS |
| A `@` | `185.199.111.153` | Present | PASS |
| CNAME `www` | `tarrunmjain.github.io` | Present | PASS |
| MX `@` | `mail.stainlesssteeldealers.com`, priority `0` | Present | PASS |
| A `mail` | `199.188.200.143` | Present | PASS |

## Safety Confirmation

- No wildcard DNS observed.
- `www` points to `tarrunmjain.github.io`, not a repository URL.
- Mail preservation is now complete from public DNS.
- HTTPS certificate provisioning remains pending in GitHub Pages.
