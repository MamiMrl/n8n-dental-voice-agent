# 0011 — One webhook endpoint per tool; event_id via dynamic variables

Date: 2026-07-09
Status: accepted

## Context

Emma gets 4 Retell Custom Functions: `get_slot_offers`,
`reschedule_appointment`, `cancel_appointment`, `create_appointment`.
They could share one n8n endpoint with an `action` discriminator + Switch
node, or each get its own webhook path.

## Decision

**Four webhook paths** in one new "Emma Tools" n8n workflow:

- `/emma/slots` → get_slot_offers
- `/emma/reschedule` → reschedule_appointment
- `/emma/cancel` → cancel_appointment
- `/emma/create` → create_appointment

Each lane: Webhook → logic → Respond to Webhook. Shared slot computation /
clinic config reused across lanes (Code node or sub-workflow).

**Appointment identity:** the morning pipeline passes `event_id` and
`calendar_id` into `retell_llm_dynamic_variables` when creating the call.
Custom Function schemas declare `event_id` as a required parameter, so
reschedule/cancel always target exactly the event that triggered the call —
never a fuzzy name/date lookup.

## Rationale

- Retell Custom Functions map 1:1 to URLs; no `action` field the LLM could
  get wrong.
- n8n canvas visually documents the API (four labeled lanes) — also good for
  the portfolio showcase.
- A dispatcher saves nothing; webhook nodes are free.
