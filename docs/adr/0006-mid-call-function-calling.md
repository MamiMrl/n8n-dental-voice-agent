# 0006 — Reschedule via mid-call function calling, not post-call webhook

Date: 2026-07-09
Status: accepted

## Context

The reschedule extension should let Emma handle appointment changes the way
human front-desk staff do. Two candidate architectures:

- **A. Mid-call function calling:** Retell Custom Functions call n8n webhooks
  *during* the conversation (check availability, book slot). The patient hangs
  up with the reschedule complete.
- **B. Post-call webhook:** Emma only collects intent; n8n processes it after
  the call and confirms via a later SMS/callback.

## Decision

**A — mid-call function calling.** Retell Custom Functions hit n8n
Webhook → Respond-to-Webhook endpoints in real time.

## Rationale

- Human staff resolve reschedules in the same call; a callback later fails
  that bar (and is what the current version already does).
- Post-call flow creates friction: if the desired slot is unavailable or
  something fails, the patient must be called again.
- Real-time availability lookup fits conversational latency (~1–2 s via n8n).
- Cheaper overall: ~1–2 extra minutes on one call vs. a whole second contact.

## Consequences

- n8n must be publicly reachable and reliable mid-call; a slow/down webhook
  stalls Emma live on the phone. Failure behavior needs an explicit design
  (later ADR).
- New n8n surface: webhook endpoints alongside the existing daily pipeline.
