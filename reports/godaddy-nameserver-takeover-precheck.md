# GoDaddy Nameserver Takeover Precheck

Captured: 2026-07-07 17:15:12 +05:30

Scope: public DNS and email-safety check before any GoDaddy nameserver takeover for `stainlesssteeldealers.com`.

## Current Public DNS

| Record | Current value | TTL |
| --- | --- | --- |
| NS | `dns1.namecheaphosting.com` | 864000 |
| NS | `dns2.namecheaphosting.com` | 864000 |
| Apex/root A | `199.188.200.143` | 1189-1200 |
| `www` CNAME | `stainlesssteeldealers.com` | 1189-1200 |
| MX | Priority `0`, `mail.stainlesssteeldealers.com` | 1200 |
| `mail.stainlesssteeldealers.com` A | `199.188.200.143` | 1200 |
| TXT at root | No public TXT/SPF value observed from the requested root TXT check; resolver returned authority/SOA data only | 3600 |

## Email Safety Finding

Domain email appears **active or at least configured** because an MX record exists:

- `stainlesssteeldealers.com MX 0 mail.stainlesssteeldealers.com`
- `mail.stainlesssteeldealers.com A 199.188.200.143`

If GoDaddy nameservers take over, these email-related DNS records must be recreated in GoDaddy DNS if the business still uses domain email through the old hosting mail server.

Minimum records to preserve in GoDaddy DNS before or immediately after takeover:

| Type | Host | Value | Notes |
| --- | --- | --- | --- |
| MX | `@` | `mail.stainlesssteeldealers.com` priority `0` | Preserves current mail routing |
| A | `mail` | `199.188.200.143` | Keeps the current mail host resolving |

No root TXT/SPF/DKIM/DMARC value was observed from the requested public root TXT lookup. If email sending depends on SPF/DKIM/DMARC records in the old DNS zone, those records may not be visible from this root TXT-only check and should be reviewed in any available DNS/email documentation.

## Website Launch Records Needed In GoDaddy DNS

After GoDaddy nameservers are active, add or replace only website records:

Apex/root `@` A records:

- `185.199.108.153`
- `185.199.109.153`
- `185.199.110.153`
- `185.199.111.153`

`www` CNAME:

- `tarrunmjain.github.io`

Do not use `https://`, do not use `tarrunmjain.github.io/bharat-metals-website`, do not point `www` to itself, and do not use forwarding/masking.

## Safety Assessment

Nameserver takeover is technically possible because the domain is owned in GoDaddy, but it is **not safe to proceed silently** because an MX record exists. The user must confirm whether the current mail routing must be preserved.

Recommended safe path:

1. Before changing nameservers, confirm that domain email must be preserved.
2. In GoDaddy DNS, be ready to recreate the MX record and `mail` A record exactly.
3. Change nameservers to GoDaddy nameservers only after explicit confirmation.
4. Add GitHub Pages website records.
5. Recreate/preserve mail records if confirmed.
6. Do not touch unrelated TXT/email/security records unless specifically required.

## Confirmation Gate

Do not change nameservers until the user replies with the required phrase:

`USER CONFIRMS GODADDY NAMESERVER TAKEOVER`

Also confirm whether to preserve the current mail records:

- MX `@` -> `mail.stainlesssteeldealers.com`, priority `0`
- A `mail` -> `199.188.200.143`
