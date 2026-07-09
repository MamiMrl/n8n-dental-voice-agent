# 0018 — Post-call outcome lane closes the loop and provides dedupe

Date: 2026-07-09
Status: accepted

## Context

The morning pipeline calls about every event in the next 72 h, daily — so an
appointment 3 days out triggers three calls even after the patient confirmed.
Independently, call outcomes never reach the calendar. Retell's post-call
analysis already extracts `appointment_status` and fires a `call_analyzed`
webhook.

## Decision

**Lane 5:** an n8n webhook receives Retell's `call_analyzed` event and
prefixes the calendar event title per outcome, extending the ADR 0015
vocabulary:

- confirmed → `[CONFIRMED] …`
- no answer / voicemail → `[NO ANSWER] …`
- cancelled → already `[CANCELLED]` from the mid-call function
- rescheduled → the moved event gets `[CONFIRMED]` (patient just approved
  that slot live; re-calling to confirm it would be absurd)

**Morning pipeline gains one filter:** skip events whose title starts with
`[`. Each appointment is called about exactly once.

## Rationale

- Fixes the triple-call bug with one filter, riding the existing title
  convention — no extra state store.
- Outcome-on-calendar is the most demo-worthy visual in the project.

## Consequences

- `[NO ANSWER]` **retry policy deferred**: staff would try again tomorrow;
  a real retry needs count + spacing rules. v1 = one call per appointment.
- Lane 5 uses the same header auth as the tool lanes (ADR 0017).
