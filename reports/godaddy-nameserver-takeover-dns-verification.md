# GoDaddy Nameserver Takeover DNS Verification

Captured: 2026-07-07 17:28:29 +05:30

Status: **Pending DNS changes**

Current verification before GoDaddy takeover is complete:

| Check | Current value | Expected after launch |
| --- | --- | --- |
| Nameservers | `dns1.namecheaphosting.com`, `dns2.namecheaphosting.com` | GoDaddy/domaincontrol.com nameservers |
| Apex/root A | `199.188.200.143` | GitHub Pages A records |
| `www` CNAME | `stainlesssteeldealers.com` | `tarrunmjain.github.io` |
| MX | `mail.stainlesssteeldealers.com`, priority `0` | Preserve same value in GoDaddy DNS |
| `mail` A | `199.188.200.143` | Preserve same value in GoDaddy DNS |

Run after GoDaddy changes:

```powershell
Resolve-DnsName stainlesssteeldealers.com -Type NS
Resolve-DnsName www.stainlesssteeldealers.com -Type CNAME
Resolve-DnsName stainlesssteeldealers.com -Type A
Resolve-DnsName stainlesssteeldealers.com -Type MX
Resolve-DnsName mail.stainlesssteeldealers.com -Type A
curl.exe -I http://www.stainlesssteeldealers.com/
curl.exe -I http://stainlesssteeldealers.com/
curl.exe -I https://www.stainlesssteeldealers.com/
curl.exe -I https://stainlesssteeldealers.com/
```
