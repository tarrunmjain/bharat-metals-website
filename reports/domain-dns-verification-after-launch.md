# Domain DNS Verification After Launch

Captured: 2026-07-07 13:43:43 +05:30

Status: **Launch blocked before DNS changes**

The requested launch records were not applied because the live domain is delegated to Namecheap-hosting nameservers, while the launch brief specifies GoDaddy DNS and forbids nameserver changes.

## Current Verification

| Check | Current result | Expected for launch |
| --- | --- | --- |
| www CNAME | stainlesssteeldealers.com | tarrunmjain.github.io |
| Apex/root A | 199.188.200.143 | GitHub Pages A records |
| Nameservers | dns1.namecheaphosting.com, dns2.namecheaphosting.com | No nameserver change requested/allowed |

## Records Still Needed At The Authoritative DNS Provider

Apex/root A records:

- 185.199.108.153
- 185.199.109.153
- 185.199.110.153
- 185.199.111.153

www CNAME:

- tarrunmjain.github.io

No DNS records were changed in this attempt.
