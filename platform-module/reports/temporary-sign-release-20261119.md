# Temporary inspection signatures — development delivery

Application source: `f15027cbe23b1cd6fbd0a3dc6514a6a6c79d9240`.
Source was pushed to `codex/ab-fusion-integration` before deployment.

Temporary inspections now take all saved inspection records directly into a
signing draft after the inspector confirms the checklist. They no longer wait
for a project manager to select the checklist or configure a manager signature.
The inspector and inspected parties can sign using their platform accounts;
inspected parties without accounts can sign onsite. After all required signatures
are present, the initiator can generate the final report and preview/share Word.
The draft is identified as a signing copy until finalized; report contents and
signatures are locked after finalization. Assigned inspection tasks retain their
existing leader review and publication flow.

Existing temporary tasks waiting in review can enter signing directly without
bulk migration. Existing signed reports and signatures are not rewritten.

Verification on 2026-11-19:

- 98 backend test executions passed locally and in a separate PostgreSQL test
  database on the server. Coverage includes account and multiple onsite signatures,
  missing signatures blocking finalization, duplicate request handling, Word
  generation, existing temporary review tasks, and absence of manager handoff
  notifications for the direct temporary flow.
- 84 client tests passed before the source push.
- Cloud deployment completed after backup and baseline checks, replacing two
  backend code files without schema changes. All 95 existing database tables
  matched before and after startup; existing attachments were preserved.
- Public assets returned HTTP 200, and unauthenticated task/report API requests
  returned HTTP 401 as expected. No production test tasks or real signatures were
  created during verification.

WeChat development upload is pending. Review and publication remain with the owner.
