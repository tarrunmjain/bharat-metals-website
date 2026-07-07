# Post-Launch Live URL Check - GoDaddy Takeover

Captured: 2026-07-07 17:28:29 +05:30

Status: **Pending DNS takeover**

Current state:

- GitHub custom domain is configured.
- GitHub preview redirects to `http://www.stainlesssteeldealers.com/`.
- `http://www.stainlesssteeldealers.com/` still serves the old WordPress/LiteSpeed site because DNS is still on Namecheap hosting.
- HTTPS on the final domain currently fails certificate validation because the old hosting certificate does not match the final domain state.

Run the full core and money-page live checks after GoDaddy nameserver and DNS records propagate.
