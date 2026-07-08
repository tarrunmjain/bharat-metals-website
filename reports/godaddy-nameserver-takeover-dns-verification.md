# GoDaddy Nameserver Takeover DNS Verification

Captured: 2026-07-08 12:51:21 +05:30

## Summary

DNS takeover is mostly successful. Website DNS is now pointing to GitHub Pages, but the preserved mail A record is missing.

| Check | Expected | Current result | Status |
| --- | --- | --- | --- |
| Nameservers | GoDaddy/domaincontrol nameservers | `ns53.domaincontrol.com`, `ns54.domaincontrol.com` | PASS |
| Apex/root A | GitHub Pages A records | `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` | PASS |
| `www` CNAME | `tarrunmjain.github.io` | `tarrunmjain.github.io` | PASS |
| MX | `mail.stainlesssteeldealers.com`, priority `0` | `mail.stainlesssteeldealers.com`, priority `0` | PASS |
| `mail` A | `199.188.200.143` | DNS name does not exist / NXDOMAIN | FAIL - needs GoDaddy fix |

## Required Fix

Add this record in GoDaddy DNS:

| Type | Host | Value | TTL |
| --- | --- | --- | --- |
| A | `mail` | `199.188.200.143` | Default or 1 hour |

Do not change the existing MX record. Do not touch TXT/SPF/DKIM/DMARC/email records unless separately required and documented.

## Verification Commands Used

```powershell
Resolve-DnsName stainlesssteeldealers.com -Type NS
Resolve-DnsName stainlesssteeldealers.com -Type A
Resolve-DnsName www.stainlesssteeldealers.com -Type CNAME
Resolve-DnsName stainlesssteeldealers.com -Type MX
Resolve-DnsName mail.stainlesssteeldealers.com -Type A
Resolve-DnsName mail.stainlesssteeldealers.com -Type A -Server ns53.domaincontrol.com
Resolve-DnsName mail.stainlesssteeldealers.com -Type A -Server ns54.domaincontrol.com
```

## Notes

- Website records are live at GoDaddy/domaincontrol DNS.
- Mail routing is not fully preserved until `mail.stainlesssteeldealers.com` resolves to `199.188.200.143`.
