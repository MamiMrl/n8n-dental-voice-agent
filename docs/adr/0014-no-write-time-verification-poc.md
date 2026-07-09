# 0014 — No write-time slot verification (POC scope)

Date: 2026-07-09
Status: accepted

## Context

Even with sequential calls (ADR 0013), front-desk staff could book a slot
manually while Emma is offering it ("Emma-vs-staff race"), causing a double
booking on blind write. Verify-then-write (re-check slot before writing,
return `slot_taken` + fresh alternatives) would close this.

## Decision

**Skip verification for the POC.** Write endpoints (`reschedule`, `create`)
write the accepted slot directly.

## Rationale

- This is a proof-of-concept/portfolio project with no real front desk; the
  race cannot occur in demo conditions.
- Keeps the write lanes minimal for v1.

## Consequences

- **Production requirement, not optional:** before any real clinic use,
  add verify-then-write (cheap — the endpoints already read the calendar)
  or double bookings will occur.
