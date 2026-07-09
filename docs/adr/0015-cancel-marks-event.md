# 0015 — Cancel marks the event, never deletes it

Date: 2026-07-09
Status: accepted

## Context

When a patient cancels, the calendar event could be deleted (slot reopens,
but no trace), renamed in place, or moved to a second "cancelled" calendar.

## Decision

**Rename in place:** `cancel_appointment` prefixes the event title with
`[CANCELLED]` (e.g., `[CANCELLED] Cleaning — Maria M.`). The slot-grid
computation (ADR 0007) **excludes** `[CANCELLED]`-prefixed events from
"busy", so the slot is immediately offerable again.

## Rationale

- Audit trail: clinic sees who cancelled and can re-book by phone.
- Demo value: a visible state change on the calendar proves the loop works;
  deletion shows nothing.
- The title-prefix convention extends to a full status vocabulary later
  (`[CONFIRMED]`, `[NO ANSWER]` via the post-call webhook) with zero extra
  infrastructure.

## Consequences

- Slot computation gains one filter (skip `[CANCELLED]` titles) — mandatory,
  or cancelled slots stay blocked forever.
- Calendar accumulates dead events / visual clutter; acceptable at POC
  scale. A second-calendar archive is the production-grade alternative.
