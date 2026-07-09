# 0007 — Availability = computed slot grid, not calendar placeholders

Date: 2026-07-09
Status: accepted

## Context

Google Calendar stores only booked events; it has no native notion of "the
clinic offers 30-min appointments Mon–Fri 09:00–17:00." Emma needs a
definition of "available slot" to recommend times. Candidates:

- **A. Computed grid:** clinic hours + slot length live as n8n config; free
  slots are generated in code at query time and busy events subtracted.
- **B. Gap-based:** any calendar gap ≥ duration counts (produces unnatural
  offers like "10:47").
- **C. Placeholder events:** pre-fill the calendar with "free slot" events
  that get replaced on booking.

## Decision

**A — computed grid.** Config: clinic hours + single fixed slot length
(30 min) for v1. Free = no overlapping booked event within configured hours,
computed fresh per request. Nothing extra is written to the calendar.

## Rationale

- One source of truth (real bookings); zero placeholder maintenance, no
  drift risk of offering slots that don't exist (C's failure mode).
- Matches receptionist mental model ("we do half-hour slots") and yields
  natural offers (B does not).
- Booking = one write (create event), not find-and-replace.

## Consequences

- Per-treatment durations (cleaning 30 min, root canal 90 min) deferred:
  would require a treatment-type taxonomy Emma must extract mid-call.
- Clinic hours/slot length must be editable config (Set node / JSON) so
  logic stays untouched per clinic.
