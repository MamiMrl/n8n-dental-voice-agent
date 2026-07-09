# 0010 — Slot delivery: batch of 3 over the wire, one at a time in speech

Date: 2026-07-09
Status: accepted

## Context

When Emma offers slots mid-call, the webhook can return one slot per round
trip (structurally safe but a 1–2 s pause after every decline) or a batch
that Emma reveals incrementally (one round trip, prompt-enforced pacing).
Declines are the *common* path in a reschedule negotiation.

## Decision

`get_slot_offers` returns an **ordered list of 3** free slots (earliest-first
per ADR 0008). The Retell prompt enforces: offer **only the first**; reveal
the next **only after an explicit decline**; never read the list out.

3 is exactly the budget ADR 0008 allows: offer 1, offer 2, then the
escape-hatch preference question triggers a *new* filtered webhook call.

## Rationale

- Repeated mid-call silences hurt the "sounds human" goal more than anything
  else; the decline path must not stall.
- List-dumping is the canonical voice-assistant failure (Siri/Alexa reading
  lists non-stop) and explicitly disliked.
- Fewer webhook invocations = fewer live failure opportunities.

## Consequences

- The one-at-a-time guardrail is prompt-level, not structural. Mitigations:
  existing max-2-sentences-per-turn rule, and the function response is
  framed as structured JSON with `offer_only_first: true`.
- Prompt regression must be checked in test calls (does Emma ever enumerate?).
