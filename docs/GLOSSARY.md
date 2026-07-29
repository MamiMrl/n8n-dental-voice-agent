# Glossary

Ubiquitous language for the dental voice agent project. Every doc, prompt, and
workflow node name should use these terms consistently.

| Term | Definition |
|------|------------|
| **Workflow** | The n8n automation (`n8n_dental_voice_agent.json`): schedule trigger → Google Calendar fetch → LLM extraction → Retell call creation. |
| **Emma** | The Retell AI voice agent persona that places reminder calls. |
| **Reminder call** | Outbound call informing a patient of an upcoming appointment and asking whether the time still works. |
| **Appointment** | A Google Calendar event on the clinic calendar containing patient name, phone number, reason, start/end time. |
| **Patient details** | Structured JSON extracted from an appointment by the LLM: `name`, `phone_number` (E.164), `reason`, `start_time`, `end_time`, `email`. |
| **Dynamic variables** | Key/value strings injected per-call into Emma's prompt via `retell_llm_dynamic_variables`. |
| **E.164** | International phone number format: `+` country code + number, no spaces (e.g. `+4915123456789`). |
| **Call outcome** | Result of a reminder call: confirmed / reschedule requested / cancelled / no answer / wrong number. Written back to the calendar as a status prefix by lane 5. |
| **Slot** | A bookable time unit on the fixed grid: 30 minutes within configured clinic hours (ADR 0007). |
| **Slot grid** | The set of theoretical slots generated in code from clinic-hours config; never stored in the calendar. |
| **Available slot** | A grid slot with no overlapping booked event (excluding `[CANCELLED]` events). Computed fresh per request. |
| **Availability check** | `get_slot_offers` webhook call: resolve constraints/hints → compute grid → subtract busy → return 3 earliest slots. |
| **Offer loop** | Emma offers ONE slot, waits for accept/decline, reveals the next only on decline (ADR 0008/0010). |
| **Escape hatch** | After 2 declined offers Emma stops enumerating and asks a preference question, then re-queries filtered (ADR 0008). |
| **Emma Tools workflow** | Second n8n workflow with the webhook lanes Retell calls mid-call and post-call (ADR 0011). |
| **Lane** | One Webhook → logic → Respond-to-Webhook chain: `/emma/slots`, `/emma/reschedule`, `/emma/cancel`, `/emma/create`, plus lane 5 (post-call outcome). |
| **Custom Function** | Retell mechanism letting Emma call an HTTP endpoint mid-conversation; maps 1:1 to a lane (ADR 0006/0011). |
| **Status prefix** | Title convention marking outcome on the event: `[CANCELLED]`, `[CONFIRMED]`, `[NO ANSWER]`. Prefixed events are skipped by the morning pipeline (dedupe, ADR 0015/0018). |
| **Booking horizon** | Config: how far ahead Emma may book (e.g., 8 weeks). Beyond it she politely declines (ADR 0009). |
| **Dual-form date** | Every slot on the wire carries `iso` (machines) + `spoken` (read verbatim by Emma); Emma never computes dates (ADR 0019). |
| **Structured hint** | How Emma forwards patient-named days: `{weekday, week_offset}` etc., resolved to dates in n8n (ADR 0019). |
| **Fallback script** | On tool failure Emma degrades to v1 behavior: "the clinic will call you back" (ADR 0016). |
| **Repeated Calls bypass** | iOS Focus/DND allowance: a second call from the same number within ~3 minutes rings through even while blocked. Motivates firing the no-answer retry immediately, not hours later (ADR 0020). |
| **`[RETRY]` prefix** | Status prefix stamped after a first true no-answer; a second no-answer replaces it with the final `[NO ANSWER]` (ADR 0020). Excludes voicemail, which finalizes immediately with no retry. |
