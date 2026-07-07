# DNS Change Plan For Later

Do not log into or change DNS during this prep task.

Note: read-only DNS lookup currently shows Namecheap hosting nameservers, not GoDaddy nameservers. Before launch, confirm where DNS is actually managed for stainlesssteeldealers.com.

## Before Changing

1. Login to the account that manages DNS for stainlesssteeldealers.com.
2. Confirm domain is stainlesssteeldealers.com.
3. Confirm domain expiry date.
4. Confirm auto-renew status.
5. Confirm active nameservers and DNS manager.
6. Take screenshots/export of all current DNS records.
7. Identify current A records for @.
8. Identify current CNAME record for www.
9. Identify MX records and email/TXT records.
10. Mark MX/TXT/email records as DO NOT TOUCH.

## Later DNS Changes

A. For @ root, replace old website A records with:
- 185.199.108.153
- 185.199.109.153
- 185.199.110.153
- 185.199.111.153

B. For www, add or edit CNAME:
- Host: www
- Points to: tarrunmjain.github.io

C. TTL:
- Use default or 1 hour.

## Do Not Add

- wildcard DNS
- random forwarding
- masking
- extra CNAME to repository URL
- CNAME pointing to tarrunmjain.github.io/bharat-metals-website
- CNAME pointing to https://tarrunmjain.github.io/bharat-metals-website/
- CNAME pointing to www.stainlesssteeldealers.com itself

Correct CNAME target: tarrunmjain.github.io

No DNS, GoDaddy, MX, TXT, SPF, DKIM or DMARC changes were made.
