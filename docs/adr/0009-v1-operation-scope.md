# 0009 — v1 operation scope: confirm, reschedule, cancel, create

Date: 2026-07-09
Status: accepted

## Context

Goal is staff parity for appointment editing, but every operation Emma can
perform is one she can perform wrong on a live call. Candidates: confirm,
reschedule, cancel, book new appointment, edit appointment details,
third-party edits ("also move my husband's").

## Decision

v1 write surface:

| Operation | Mechanism | Calendar effect |
|---|---|---|
| Confirm | post-call outcome (no mid-call function) | status update |
| Reschedule | `get_slot_offers` + `reschedule_appointment` | move event |
| Cancel | `cancel_appointment` | remove/mark event |
| Book new | `create_appointment` (same patient only) | new event |

- **Book new** is safe in v1 *because calls are outbound*: patient identity
  (name, phone, email) is already known from the triggering calendar event.
  Emma only asks the reason, then runs the same slot-offer loop.
- **Booking horizon** is config (e.g., max N weeks ahead); requests beyond it
  ("in 6 months") are politely declined per clinic policy.

## Out of scope

- **Edit appointment details** — archived; the only editable field is the
  free-text reason, which rides along as an optional `reason` param on
  reschedule/create. No standalone write path for an edge case.
- **Third-party edits** — identity/authorization minefield; Emma deflects
  ("the clinic will call you about that").
- **New unknown patients** — cannot occur in an outbound flow.

## Rationale

Reschedule + cancel + follow-up booking covers ~80%+ of what reminder calls
trigger; the rest is deflected, not mishandled.
