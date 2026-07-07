# GoDaddy DNS After Nameserver Takeover

Captured: 2026-07-07 17:28:29 +05:30

Status: **Pending manual GoDaddy DNS setup**

After switching to GoDaddy/default nameservers, add or edit only these DNS records.

## Website Records

| Type | Host | Value | TTL |
| --- | --- | --- | --- |
| A | `@` | `185.199.108.153` | Default or 1 hour |
| A | `@` | `185.199.109.153` | Default or 1 hour |
| A | `@` | `185.199.110.153` | Default or 1 hour |
| A | `@` | `185.199.111.153` | Default or 1 hour |
| CNAME | `www` | `tarrunmjain.github.io` | Default or 1 hour |

## Mail Records To Preserve

| Type | Host | Value | Priority | TTL |
| --- | --- | --- | --- | --- |
| MX | `@` | `mail.stainlesssteeldealers.com` | `0` | Default or 1 hour |
| A | `mail` | `199.188.200.143` | n/a | Default or 1 hour |

## Do Not Add

- No wildcard DNS.
- No forwarding or masking.
- No `www` target containing `https://`.
- No `www` target containing `/bharat-metals-website`.
- No `www` pointing to `www.stainlesssteeldealers.com` or `stainlesssteeldealers.com`.

Correct `www` CNAME target is exactly:

`tarrunmjain.github.io`
