# Cloud workflow deployment — 2026-11-19

The cloud API was missing the mobile workflow implementation and returned 404
for authenticated `/quality/api/work/mobile-state` requests. The matching
backend from source commit `9021c22a0aa4332b9cab3b95ac1d60f0049e6e08` is now deployed.

## Deployment evidence

- Existing services restarted successfully.
- Database and affected code backed up; backup checked before cutover.
- Original business data checked unchanged after startup.
- Attachments verified unchanged. Unrelated storage was not modified.
- Added only empty workflow tables needed by this release.
- Original authentication configuration retained; local UAT role mirroring is
  disabled. No demo account seeds, role overrides or new notification workers
  were deployed.

## Verification

- 29 backend tests passed in a separate PostgreSQL database on the same server,
  using synthetic identities and separate schema per test. Coverage includes
  dispatch, open signup, applicant removal, final roster, hazard list submission,
  report generation, signatures, publication, idempotency and denied access.
- Cloud mini-program with the user's authenticated account successfully loaded
  the task workbench and project permissions after deployment; no missing
  workflow/404 message remained.
- Dispatch form opened, with the real project leader available. No task was
  submitted during production verification.
- Report page loaded historical reports and the separate new-workflow section.
  No production report was signed, published, merged or modified.
- A restart also exposed a client bug: logout's expected 401 aborted account
  switching. Both task and home logout now treat 401 as already logged out,
  clear local session state and return to login; other errors remain visible.
- 36 client tests passed, including four session-expiry regressions and the
  task/report/signature tests.

## Release boundary

Mini-program development version 1.0.5 is prepared for upload. WeChat review and
publication remain with the owner. Actual two-person device acceptance with
real signatures is still for the users to perform; the automated full flow
used only the isolated test database. The cloud checks above are read-only
business checks, not a claim that real users have completed those transactions.
