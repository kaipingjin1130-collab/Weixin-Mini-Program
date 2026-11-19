# Platform signup and temporary inspections — development version 1.0.7

Application source: `623c3ddb2e0151115117edbb305f52be5fad6ba2`.
Source was pushed to `codex/ab-fusion-integration` before cloud deployment and
WeChat upload. Deployment and development upload completed on 2026-11-19.

Published inspection tasks accept applications from authenticated platform users
without requiring project membership configuration. The task creator or project
manager confirms the final roster and can remove applicants before confirmation.
This does not create project memberships or give applicants editing access to
inspection records. Existing project permissions for legacy workflows remain.

Task creation supports a manually entered project name. Temporary inspection
starts with the current user as leader and confirmed inspector, then follows the
same checklist, report, signature, publication and work recognition workflow.
Designated leaders can still start alone; tasks requesting more than one person
require an explanation for early solo start.

Validation and delivery:

- 96 backend test executions passed locally and in a separate PostgreSQL test
  database on the server, including participation without memberships and a
  complete temporary inspection, photo, report, signature and recognition flow.
- 82 client tests passed before the source push.
- Cloud deployment replaced six backend code files after backup and baseline
  checks, without schema changes. Contents of all 95 existing database tables
  matched before and after service startup; existing attachments were preserved.
  No production test task, actual signature or project role grant was created.
- Public assets returned HTTP 200. Task/state/report API requests without a
  session returned HTTP 401 as expected, maintaining login protection.
- WeChat Developer Tools compiled and explicitly displayed upload success for
  development version **1.0.7**, with source `623c3dd` in the version description.

Review and publication were not submitted. Device acceptance with the owner's
real account remains with the owner before submitting review. The development
upload result was verified in Developer Tools; no claim is made that review or
production mini-program publication has occurred.
