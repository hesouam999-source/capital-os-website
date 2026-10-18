# Capital OS private beta feedback worker

This Worker is an intake service, not a public issue tracker. It accepts only
explicitly consented beta feedback from `https://mycapitalos.com`, verifies a
Turnstile token, rate-limits each salted IP hash to three reports per hour,
stores the raw report privately in D1, and stores an optional screenshot in a
private R2 bucket. Raw D1/R2 data is removed after 90 days.

The Worker creates a minimal card in a **private** GitHub triage repository.
The card never contains the feedback text, contact email, attachment path, or
an attachment URL. GitHub is therefore a private workflow queue, not a public
data store.

## Owner setup before deployment

1. Create a private GitHub repository named `capital-os-feedback`.
2. Create labels exactly as follows:
   - `status: new`, `status: verified`, `status: duplicate`, `status: resolved`
   - `verification: unverified`, `verification: verified`
   - `priority: untriaged`, `priority: critical`, `priority: high`, `priority: normal`, `priority: low`
   - `type: bug`, `type: ux`, `type: feature`, `type: question`
3. Create a GitHub App, install it only on that repository, and grant only
   `Metadata: Read` and `Issues: Read & Write`. Do not grant Contents,
   Actions, Administration, or organization permissions.
4. In Cloudflare create the D1 database `capital-os-feedback`, private R2
   bucket `capital-os-feedback-screenshots`, and a Turnstile widget for
   `mycapitalos.com`. The Worker uses its existing `workers.dev` URL; no
   custom domain is required.
5. The configured D1 database, GitHub App ID, and installation ID are public
   identifiers, not credentials. Set these Worker secrets with `wrangler secret
   put`: `TURNSTILE_SECRET_KEY`, `GITHUB_APP_PRIVATE_KEY`, and
   `IP_HASH_PEPPER`. Never place their values in a repository or GitHub Pages
   variable.
6. Run `wrangler d1 execute capital-os-feedback --file=migrations/0001_feedback.sql` against the new remote D1 database, then deploy the Worker.
7. Set GitHub Pages variables `FEEDBACK_ENDPOINT` to
   `https://capital-os-feedback.hesouam999.workers.dev/v1/feedback` and
   `TURNSTILE_SITE_KEY` to `0x4AAAAAAFaj57TEqV5urBoS`. The Pages workflow then
   enables the form.

## Private triage process

New GitHub cards have `status: new`, `verification: unverified`,
`priority: untriaged`, and a type label. Triage staff review the raw item in
D1 using the Submission ID, assign a priority label, and group duplicates by
adding `status: duplicate` and a comment linking the canonical private issue.
Nothing should be copied to a public issue without removing personal and
financial details first.
