# 0016 — Mid-call tool failure: fail fast, retry reads only, degrade to v1

Date: 2026-07-09
Status: accepted

## Context

With mid-call function calling (ADR 0006) over a laptop tunnel (ADR 0012),
tool failures *will* happen while Emma is live with a patient. Undefined
behavior means dead air or LLM improvisation — the worst outcomes.

## Decision

1. **Timeout ~6 s** per Custom Function; fail fast rather than hold silence.
   Emma's prompt announces waits naturally before slow tools ("One moment
   while I check the calendar…").
2. **Retry: reads only.** `get_slot_offers` gets one silent retry.
   Write functions (`reschedule`, `cancel`, `create`) are **never retried**:
   a timed-out write may have succeeded (event written, response lost), so
   a retry risks double-writes — the double-booking risk returning through
   the error path.
3. **Fallback script:** on final failure Emma apologizes once and degrades
   to exactly the published v1 behavior: "I'm having trouble reaching the
   calendar right now — the clinic will call you back to arrange it."
   No technical vocabulary; wrap up politely.

## Rationale

- >6 s of silence feels broken on a phone call; talking beats waiting.
- Reads are idempotent, writes are not.
- v2's failure mode being v1's normal behavior means failure never looks
  broken to the patient.
