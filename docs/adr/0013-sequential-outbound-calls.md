# 0013 — Outbound calls are placed sequentially (Loop Over Items + Wait)

Date: 2026-07-09
Status: accepted

## Context

The morning pipeline currently fires one `create-phone-call` POST per
appointment within seconds — Retell dials all patients near-simultaneously.
With mid-call rescheduling (ADR 0006), parallel calls could compete for the
same free slots, and no clinic needs mass-parallel dialing anyway.

## Decision

Place calls **one at a time**: the pipeline loops over extracted
appointments (**Loop Over Items** node) with a **Wait** node between
iterations (a few minutes' spacing) instead of batch-firing all POSTs.

## Rationale

- Eliminates Emma-vs-Emma slot competition during reschedule negotiations.
- Matches real clinic behavior; call volume at dental scale makes total
  batch duration irrelevant.
- Simplest v1 mechanism; smarter sequencing (wait for call-ended webhook
  before dialing next) can replace the fixed Wait later.

## Consequences

- Fixed spacing is dumb: a 10-min call could overlap the next dial, and a
  no-answer wastes the full wait. Acceptable at v1 volumes; revisit with the
  post-call webhook.
- Does **not** eliminate the Emma-vs-staff race (front desk booking a slot
  mid-call) — consciously accepted for the POC (ADR 0014).
