# Gmail enquiry delivery

Straty and the contact form submit to the same Node.js endpoint, `/api/enquiry`.
WhatsApp remains available separately. There is no AI provider or chat transcript storage.

Both sources send the shared Strategy Experts HTML template (black/graphite, silver text, lavender accents, source badge, customer details and a reply button) with a plain-text alternative. Customer content is HTML-escaped. Tables and inline styles provide broad email-client compatibility; no remote images or fonts are needed. Clients that disable HTML will display the plain-text alternative. Existing emails are not updated retroactively.

## Setup

1. Enable 2-Step Verification on the sending Google account and create an App Password: https://support.google.com/accounts/answer/185833
2. Set these **server-only** values in `.env.local` and your deployment's secret settings:
   - `GMAIL_SMTP_USER`: the sending Gmail/Google Workspace address.
   - `GMAIL_SMTP_APP_PASSWORD`: its App Password, never the normal account password.
3. Restart the development server or redeploy. Never commit credentials or add a `NEXT_PUBLIC_` prefix.
4. Recipients use `NEXT_PUBLIC_CONTACT_EMAIL` (comma-separated), with the existing Strategy Experts addresses as defaults. This is not visitor-controlled. Replies go to the visitor's validated email, not the sending account.
5. Send one real enquiry from each interface and verify receipt and Reply-To. Tests do not send real email. Gmail acceptance is not a guarantee of inbox placement; check spam filters.

SMTP uses `smtp.gmail.com:465` over TLS. Your host must support Node.js route handlers and outbound SMTP; static-only hosting cannot send mail. Google may restrict App Passwords on managed accounts. See https://nodemailer.com/guides/using-gmail.

The endpoint reuses a small SMTP connection pool within a warm process (up to two connections). Idle sockets expire after 20 seconds. This avoids repeating authentication for nearby enquiries, but a first send, expired connection or serverless cold start still needs the full handshake. A successful response waits for Gmail to accept the message; it is not a background-delivery promise. Development route compilation adds latency that production builds do not have. Restart/redeploy after changing SMTP credentials.

## Abuse controls and deployment limits

The endpoint checks origin, consent, honeypot, field lengths and email shape; caps the request stream at 16 KB; sends plain text to fixed recipients; and uses bounded SMTP timeouts. It does not echo SMTP errors or log enquiry contents. Missing credentials return an error, not a fake success.

In-memory limits are **per process**, reset on restart, and are not a distributed spam solution. They allow 3 attempts per reply email per 15 minutes, 30 SMTP attempts per hour, and 100 POST requests per 15 minutes. Before exposing a busy/multi-instance deployment, configure shared per-IP rate limits at your hosting edge/WAF and consider a challenge if spam appears. Origin and honeypot checks alone do not stop bots. Gmail also has provider sending quotas and is intended here for low-volume enquiries.
