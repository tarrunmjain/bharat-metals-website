# GoDaddy Nameserver Takeover Rollback Plan

Captured: 2026-07-07 17:28:29 +05:30

Use rollback only if launch fails badly and cannot be corrected quickly.

## If Nameserver Takeover Was Applied

1. In GoDaddy, change nameservers back to:
   - `dns1.namecheaphosting.com`
   - `dns2.namecheaphosting.com`
2. Wait for propagation.
3. Confirm the old site resolves to `199.188.200.143`.
4. Confirm `www.stainlesssteeldealers.com` points back through the root domain.
5. Preserve mail records and do not touch unrelated MX/TXT/email records.

## If Only GitHub Custom Domain Was Applied

Current Codex-applied state added GitHub Pages custom domain and a root `CNAME` file. If the launch is cancelled before DNS takeover:

1. Remove the custom domain from GitHub Pages Settings.
2. Remove the root `CNAME` file in a follow-up commit.
3. Confirm GitHub preview behavior returns to the Pages preview URL.

## Do Not

- Do not delete the GitHub repository.
- Do not delete the generated site.
- Do not delete old DNS screenshots or notes.
- Do not delete old Namecheap hosting.
- Do not change MX/TXT/SPF/DKIM/DMARC/email records unless correcting a documented mail issue.
