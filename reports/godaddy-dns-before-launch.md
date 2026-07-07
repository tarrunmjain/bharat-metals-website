# DNS Before Actual Launch

Captured: 2026-07-07 13:43:10 +05:30

## Important Finding

The domain is not currently delegated to GoDaddy nameservers. Public DNS shows:

| Record | Current value |
| --- | --- |
| Nameservers | $ns |
| Apex/root A | $apexA |
| www CNAME | $wwwCname |
| MX | $mx |
| mail.stainlesssteeldealers.com A | $mailA |
| Public TXT/SPF | No public TXT answer observed in the resolver output; resolver returned authority data instead |

Because the active nameservers are Namecheap-hosting nameservers, changing only a GoDaddy DNS zone would not launch the website unless GoDaddy is also controlling those authoritative nameservers behind the scenes. Based on public DNS, the authoritative launch change must be made in the active DNS provider for these nameservers.

## GoDaddy Screenshot/Export Status

No GoDaddy DNS screenshot/export was captured from an authenticated panel in this session. No GoDaddy login or DNS edit was performed.

## Records To Preserve

- Do not touch MX records.
- Do not touch TXT/SPF/DKIM/DMARC/email records.
- Do not change nameservers.
- Do not create wildcard records.
- Keep old DNS records documented before replacing website records.

## Future Website DNS Records Needed In The Authoritative DNS Zone

Apex/root @ A records:

- 185.199.108.153
- 185.199.109.153
- 185.199.110.153
- 185.199.111.153

www CNAME:

- 	arrunmjain.github.io

Do not use https://, do not use /bharat-metals-website, and do not point www back to itself or to the root domain.
