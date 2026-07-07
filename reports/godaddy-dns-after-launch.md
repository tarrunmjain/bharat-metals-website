# DNS After Actual Launch

Captured: 2026-07-07 13:43:10 +05:30

Status: **Not executed**

No DNS records were changed because the pre-launch DNS check found that the live domain is delegated to Namecheap-hosting nameservers, while the launch instructions specify GoDaddy DNS changes and prohibit nameserver changes.

Current live DNS remains:

| Record | Value |
| --- | --- |
| Nameservers | $ns |
| Apex/root A | $apexA |
| www CNAME | $wwwCname |
| MX | $mx |

No MX/TXT/SPF/DKIM/DMARC/email/nameserver/wildcard records were changed.
