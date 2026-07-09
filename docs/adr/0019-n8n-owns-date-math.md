# 0019 — n8n owns all date math; Emma only speaks strings

Date: 2026-07-09
Status: accepted

## Context

Rescheduling needs constant conversion between machine dates and speech:
`2026-07-15T14:30` ↔ "next Wednesday at half past two", and patient phrases
("the Friday after next") ↔ concrete dates. LLM date arithmetic is a classic
silent-failure zone — a confidently spoken off-by-one weekday destroys
patient trust.

## Decision

**Emma never computes a date.**

- Every slot crossing the wire is **dual-form**:
  `{iso: "2026-07-15T14:30", spoken: "Wednesday, July 15th at 2:30 in the
  afternoon"}`. Emma speaks `spoken` verbatim; passes `iso` back verbatim
  when booking.
- Patient-named days go to `get_slot_offers` as **structured hints**
  (e.g., `{weekday: "Friday", week_offset: 1}`), resolved in the n8n Code
  node — deterministic and unit-testable, unlike free-text parsing or
  prompt-side math.
- `current_date` (+ timezone) is passed as a dynamic variable at call
  creation so Emma can converse naturally about "today"/"tomorrow" without
  calculating anything.

## Rationale

- Date logic lives where it can be tested (pinned n8n executions), not in
  the prompt.
- Less burden on the LLM = fewer live failure modes.

## Consequences

- The slots Code node gains hint-resolution logic and a spoken-form
  formatter (locale-aware: appointment language is English for the demo).
