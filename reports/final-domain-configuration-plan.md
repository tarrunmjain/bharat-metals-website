# Final Domain Configuration Plan

This is a preparation plan only. Do not execute these steps until a later LAUNCH NOW task.

## Preferred Final Setup

- Primary canonical domain: https://www.stainlesssteeldealers.com/
- Apex/root domain: https://stainlesssteeldealers.com/
- Apex should redirect to: https://www.stainlesssteeldealers.com/
- GitHub Pages custom domain to use later: www.stainlesssteeldealers.com
- Expected GitHub Pages default domain: tarrunmjain.github.io

## DNS Records To Prepare Later

Apex/root domain A records:
- Type: A | Name/Host: @ | Value: 185.199.108.153
- Type: A | Name/Host: @ | Value: 185.199.109.153
- Type: A | Name/Host: @ | Value: 185.199.110.153
- Type: A | Name/Host: @ | Value: 185.199.111.153

www CNAME record:
- Type: CNAME | Name/Host: www | Value: tarrunmjain.github.io

Optional IPv6 AAAA records, do not add unless approved later:
- 2606:50c0:8000::153
- 2606:50c0:8001::153
- 2606:50c0:8002::153
- 2606:50c0:8003::153

## DNS Safety

- Do not touch MX records.
- Do not touch TXT records unless GitHub domain verification requires one later.
- Do not touch SPF, DKIM or DMARC records.
- Do not touch email settings.
- Do not create wildcard records such as *.stainlesssteeldealers.com.
- Before changing DNS later, take screenshot/export of all current DNS records.
- Record all old A/CNAME values before changing them.
- Current observed old @ A value: 199.188.200.143.
- Current observed old www CNAME: stainlesssteeldealers.com.
- Current observed nameservers: dns1.namecheaphosting.com, dns2.namecheaphosting.com.

No DNS changes were made during this preparation task.
