# Leader direct start — development version 1.0.6

Implemented and deployed from source commit
`218017e338bdb84ce166f2f80656bdeba5280df2` on 2026-11-19.

The designated task leader can start an inspection without waiting for another
person to apply. The operation adds the leader once to the accepted and final
rosters, counts one inspector, and locks the roster. For a task requesting more
than one person, an explanation is required and recorded in the task audit log.
Other applications remain in the history but are not selected into the final
roster. Starting again, stale requests, non-leaders, revoked project roles and
previously removed applicants cannot bypass the workflow restrictions.

Existing waiting tasks can use this action without migration. Finalized rosters,
existing reports and signatures are unchanged. Later reporting, signing,
publication and work recognition still follow the existing workflow. A leader
who is also the inspector is counted once.

Validation:

- 34 backend tests passed locally and in a separate PostgreSQL test database on
  the server, including a complete solo-leader report/sign/publish/recognize flow.
- 38 client tests passed, covering confirmation, required explanation, cancellation,
  report signing and expired-session handling.
- Cloud update replaced two backend code files after verified backup. Original
  table contents and attachments matched before and after startup; no schema
  migration, production test task, real signature or role grant was performed.
- WeChat Developer Tools compiled the cloud project and explicitly displayed
  upload success for development version 1.0.6. Review and publication remain
  with the owner. Actual device acceptance of the new button remains for the
  designated task leader; no real task was started on their behalf.
