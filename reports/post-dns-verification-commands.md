# Post-DNS Verification Commands

Run these in Windows PowerShell after the later DNS launch step.

Check www CNAME:
Resolve-DnsName www.stainlesssteeldealers.com -Type CNAME

Check apex A records:
Resolve-DnsName stainlesssteeldealers.com -Type A

Check HTTP:
curl.exe -I https://www.stainlesssteeldealers.com/

Check apex redirect:
curl.exe -I https://stainlesssteeldealers.com/

Check sitemap:
curl.exe -I https://www.stainlesssteeldealers.com/sitemap.xml

Check robots:
curl.exe -I https://www.stainlesssteeldealers.com/robots.txt

Check sample pages:
curl.exe -I https://www.stainlesssteeldealers.com/jindal-stainless-steel-sheets-chennai/
curl.exe -I https://www.stainlesssteeldealers.com/ss-304-sheet-price-chennai/
curl.exe -I https://www.stainlesssteeldealers.com/stainless-steel-pipes/
curl.exe -I https://www.stainlesssteeldealers.com/stainless-steel-suppliers-chennai/
