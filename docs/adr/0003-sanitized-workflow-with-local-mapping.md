# ADR 0003: Publish sanitized workflow JSON, keep real values in gitignored local docs

Date: 2026-07-06
Status: Accepted

## Context

The n8n export contains no API keys, but does contain the Retell phone number,
Retell agent ID, private Google Calendar ID, n8n credential IDs, and instance ID.
Publishing them invites spam calls and leaks setup details. Pure sanitization,
however, loses the ability to trace errors back to the live configuration later.

## Decision

Three artifacts:

1. `n8n_dental_voice_agent.json` (tracked) — placeholders: `+1XXXXXXXXXX`,
   `YOUR_RETELL_AGENT_ID`, `YOUR_CALENDAR_ID@...`, `YOUR_*_CREDENTIAL_ID`,
   `instanceId: REDACTED`.
2. `n8n_dental_voice_agent.local.json` (gitignored) — untouched working export.
3. `LOCAL-CONFIG.md` (gitignored) — placeholder→real-value mapping table plus
   n8n start command.

## Consequences

- Re-exporting from n8n overwrites nothing tracked: export to `.local.json`,
  then re-apply placeholders to the tracked copy.
- Placeholder style doubles as import instructions for the future
  reusable-template audience (ADR 0001).
