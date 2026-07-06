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
| **Call outcome** | Result of a reminder call: confirmed / reschedule requested / cancelled / no answer / wrong number. |
