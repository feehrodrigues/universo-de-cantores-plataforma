Brevo DNS setup — SPF / DKIM / Return-Path

Purpose
- Provide ready-to-add DNS record templates and verification steps so Brevo-sent emails authenticate properly and reduce spam classification.

Important
- Brevo (Sendinblue) will show the exact record values in its Domain Authentication / Senders UI. Use those exact values when available — the entries below are templates/examples you should replace with values shown by Brevo.

Steps
1. Open Brevo dashboard
   - Settings → Senders & domains (or Deliverability / Domain Authentication)
   - Add your domain (e.g., universodecantores.com.br) and request authentication.
   - Brevo will show the exact DNS records to add (copy/paste them). If Brevo gives CNAME targets use those; if it shows TXT values use TXT.

2. Typical DNS records to add (templates)

- SPF (TXT)
  - Host / Name: @
  - Type: TXT
  - Value (example): v=spf1 include:spf.brevo.com ~all
  - Note: Replace the `include:` value with the exact string Brevo shows if it differs.

- DKIM (often CNAME or TXT depending on provider)
  - Host / Name (example): <selector>._domainkey
  - Type: CNAME OR TXT (use the type Brevo specifies)
  - Value (example for CNAME): <selector>.dkim.brevo.com.
  - Value (example for TXT): "v=DKIM1; k=rsa; p=<public_key_from_brevo>"
  - Note: Brevo will give the DKIM selector and target. Don't guess — copy the value from Brevo.

- Return-Path / MAIL FROM (optional; sometimes required for DMARC)
  - Host / Name (example): mail._domainkey or mailfrom.yourdomain (Brevo will specify)
  - Type: CNAME or TXT as instructed
  - Value: Provided by Brevo (example target: mx.brevo.com)

3. Common DNS provider UI mappings
  - Cloudflare: name = the left-hand field, content = the right-hand field (choose TXT or CNAME appropriately).
  - GoDaddy / Namecheap / Registro.br: similar fields (Name, Type, Value). For root TXT use `@` as name.

4. How to test after adding

- Wait for DNS propagation (minutes → 48 hours). Then test with these commands:

  - Windows (PowerShell):

    nslookup -type=txt yourdomain.com
    nslookup -type=cname <selector>._domainkey.yourdomain.com

  - Linux / macOS (terminal):

    dig TXT yourdomain.com +short
    dig CNAME <selector>._domainkey.yourdomain.com +short

- Brevo also provides a verification button in the domain setup panel; use it after DNS records are in place.

5. Example (fill with Brevo-provided values)

- SPF
  - Name: @
  - Type: TXT
  - Value: "v=spf1 include:spf.brevo.com ~all"

- DKIM (example using selector `s1`)
  - Name: s1._domainkey
  - Type: CNAME
  - Value: s1.dkim.brevo.com

- Return-Path (example)
  - Name: mailfrom
  - Type: CNAME
  - Value: mail.brevo.com

6. After verification
- In Brevo, the domain should show as "Verified" for DKIM and SPF.
- Optionally set the `BREVO_FROM_EMAIL` to an address at that domain (e.g., noreply@universodecantores.com.br), update your app `web/.env.local`, and re-test with `GET /api/test-email?email=you@domain`.

7. If verification fails
- Double-check there are no extra quotes or stray whitespace in TXT values.
- Ensure you added the record for the exact host Brevo gave (some panels require the full name, others require only the left-hand name).
- Provide the exact record values from Brevo and I can validate them for you.

8. Want me to switch `BREVO_FROM_EMAIL` to `noreply@universodecantores.com.br` and re-test?
- Reply "yes" and I will update `web/.env.local` and trigger the test instructions.