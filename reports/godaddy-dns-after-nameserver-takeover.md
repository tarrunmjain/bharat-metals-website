# GoDaddy DNS After Nameserver Takeover

Captured: 2026-07-08 12:51:21 +05:30

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
| A `mail` | `199.188.200.143` | Missing / NXDOMAIN | FAIL |

## Required Mail Fix

Add this record in GoDaddy DNS:

- Type: `A`
- Host/Name: `mail`
- Value: `199.188.200.143`
- TTL: default or 1 hour

This is needed because the preserved MX points to `mail.stainlesssteeldealers.com`. Without the `mail` A record, domain mail delivery may fail.

## Do Not Change

- Do not remove the MX record.
- Do not touch TXT/SPF/DKIM/DMARC/email records unless specifically required.
- Do not create wildcard DNS.
- Do not use forwarding/masking.
- Do not change `www` away from `tarrunmjain.github.io`.
