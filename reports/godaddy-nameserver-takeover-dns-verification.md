# GoDaddy Nameserver Takeover DNS Verification

Captured: 2026-07-08 13:18:09 +05:30

## Summary

DNS takeover verification passes. Website records point to GitHub Pages and the preserved mail records now resolve correctly.

| Check | Expected | Current result | Status |
| --- | --- | --- | --- |
| Nameservers | GoDaddy/domaincontrol nameservers | `ns53.domaincontrol.com`, `ns54.domaincontrol.com` | PASS |
| Apex/root A | GitHub Pages A records | `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` | PASS |
| `www` CNAME | `tarrunmjain.github.io` | `tarrunmjain.github.io` | PASS |
| MX | `mail.stainlesssteeldealers.com`, priority `0` | `mail.stainlesssteeldealers.com`, priority `0` | PASS |
| `mail` A | `199.188.200.143` | `199.188.200.143` | PASS |

## Verification Commands Used

```powershell
Resolve-DnsName stainlesssteeldealers.com -Type NS
Resolve-DnsName stainlesssteeldealers.com -Type A
Resolve-DnsName www.stainlesssteeldealers.com -Type CNAME
Resolve-DnsName stainlesssteeldealers.com -Type MX
Resolve-DnsName mail.stainlesssteeldealers.com -Type A
```

## Notes

- Website DNS is live at GoDaddy/domaincontrol DNS.
- Mail routing record preservation is now complete from public DNS.
- HTTPS is still pending GitHub Pages certificate provisioning.
