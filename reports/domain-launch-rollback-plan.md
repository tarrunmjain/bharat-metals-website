# Domain Launch Rollback Plan

If domain launch fails:
1. Do not panic.
2. Keep old DNS screenshot/export available.
3. Restore old @ A record(s) from backup.
4. Restore old www CNAME/A record from backup.
5. Remove custom domain from GitHub Pages if needed.
6. Wait for DNS propagation.
7. Recheck old website.
8. Document the issue.

Important:
- Do not delete the GitHub repo.
- Do not delete the generated site.
- Do not delete the old DNS backup.
- Do not modify MX/email records.
- Do not modify SPF, DKIM or DMARC records.

Current old DNS values observed read-only:
- @ A: 199.188.200.143
- www CNAME: stainlesssteeldealers.com
- Nameservers observed: dns1.namecheaphosting.com, dns2.namecheaphosting.com
