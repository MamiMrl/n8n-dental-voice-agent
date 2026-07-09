# 0008 — Slot offering policy: earliest-first, one at a time

Date: 2026-07-09
Status: accepted

## Context

Emma proactively recommends slots (patient approves/declines), like human
staff — she does not wait for the patient to name a day. Candidate policies:
earliest-first (A), anchor on original appointment's time-of-day (B),
randomized/load-spreading (C).

## Decision

**A — earliest-first**, with:

1. **Constraint filter:** if the patient voiced a constraint ("no mornings",
   "next week"), filter the grid first, then earliest within it.
2. **One slot per offer**, wait for accept/decline. Never enumerate lists
   ("sounds like Alexa").
3. **Escape hatch:** after 2 declined offers, stop enumerating and ask a
   preference question ("What day works best?"), then restart filtered.

## Rationale

- Mirrors real front-desk behavior ("the next opening I have is…").
- Clinic-load signal is free: a full calendar makes the earliest slot
  naturally distant ("I can only offer next Wednesday 15:30").
- C wastes early capacity and is artificial.

## Consequences

- **B archived, not rejected:** offering slots near the patient's original
  time-of-day is a personalization win for a later iteration (needs
  inference about whether original time was preference or coincidence).
- Serial rejection is bounded at 2 by the escape hatch.
