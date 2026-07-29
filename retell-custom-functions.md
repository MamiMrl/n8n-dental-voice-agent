# Retell Custom Functions — Emma Tools

Paste these into Retell dashboard → your agent → **Functions → Add → Custom Function**.
Replace `YOUR_TUNNEL_DOMAIN` with your Cloudflare Tunnel hostname and set the
shared secret header on every function (ADR 0017).

Common settings for all four functions:

- **Method:** POST
- **Headers:** `X-Emma-Key: YOUR_WEBHOOK_SECRET`
- **Timeout:** 6000 ms (ADR 0016)
- **Speak during execution:** ON — e.g. "One moment while I check the calendar."

n8n production webhook URLs use the `/webhook/` prefix (the workflow must be
**active**; `/webhook-test/` only works while listening in the editor).

---

## 1. get_slot_offers

- **URL:** `https://YOUR_TUNNEL_DOMAIN/webhook/emma/slots`
- **Description:** Get up to 3 free appointment slots, earliest first. Call
  this before offering any time. If the patient named a day or a time of day,
  pass it as a hint. Offer ONLY the first slot; reveal the next only if the
  patient declines.

```json
{
  "type": "object",
  "properties": {
    "weekday": {
      "type": "string",
      "description": "English weekday the patient asked for, lowercase (e.g. 'tuesday'). Omit if the patient named no day."
    },
    "week_offset": {
      "type": "integer",
      "description": "With weekday: 0 = the next occurrence, 1 = one week after that. Without weekday: how many weeks ahead to start searching (patient says 'in two weeks' -> 2). Omit if the patient gave no timing."
    },
    "day_part": {
      "type": "string",
      "enum": ["morning", "afternoon"],
      "description": "Only if the patient stated a morning/afternoon preference."
    }
  },
  "required": []
}
```

## 2. reschedule_appointment

- **URL:** `https://YOUR_TUNNEL_DOMAIN/webhook/emma/reschedule`
- **Description:** Move the patient's existing appointment to an accepted
  slot. Only call after the patient clearly accepted a specific offered slot.

```json
{
  "type": "object",
  "properties": {
    "event_id": {
      "type": "string",
      "description": "Always pass the value of {{event_id}} exactly as given."
    },
    "slot_iso": {
      "type": "string",
      "description": "The iso value of the accepted slot, copied unchanged from get_slot_offers."
    },
    "reason": {
      "type": "string",
      "description": "Only if the patient mentioned new information about the reason for the visit."
    }
  },
  "required": ["event_id", "slot_iso"]
}
```

## 3. cancel_appointment

- **URL:** `https://YOUR_TUNNEL_DOMAIN/webhook/emma/cancel`
- **Description:** Cancel the patient's appointment. Only call after the
  patient clearly confirmed they want to cancel.

```json
{
  "type": "object",
  "properties": {
    "event_id": {
      "type": "string",
      "description": "Always pass the value of {{event_id}} exactly as given."
    }
  },
  "required": ["event_id"]
}
```

## 4. create_appointment

- **URL:** `https://YOUR_TUNNEL_DOMAIN/webhook/emma/create`
- **Description:** Book an additional appointment for this same patient in an
  accepted slot. Only call after the patient accepted a specific offered slot
  and stated what the appointment is for.

```json
{
  "type": "object",
  "properties": {
    "slot_iso": {
      "type": "string",
      "description": "The iso value of the accepted slot, copied unchanged from get_slot_offers."
    },
    "reason": {
      "type": "string",
      "description": "What the appointment is for, in the patient's words."
    }
  },
  "required": ["slot_iso", "reason"]
}
```

---

## Post-call webhook (lane 5, ADR 0018/0020)

Retell dashboard → agent → **Webhook settings**:

- **Webhook URL:** `https://YOUR_TUNNEL_DOMAIN/webhook/emma/outcome`
- n8n reacts only to the `call_analyzed` event; others are ignored.
- Post-call analysis must keep the custom field **`appointment_status`** with
  values: `confirmed`, `rescheduled`, `cancelled`, `no_answer`, `voicemail`,
  `wrong_number`. **`voicemail` must be distinct from `no_answer`** — a true
  no-answer gets one immediate retry (ADR 0020), voicemail does not, since
  Emma already left the appointment message.

Note: this endpoint has no header auth (Retell's call webhooks don't send
custom headers) — it relies on the unguessable path plus the fact that it
only stamps status prefixes. Documented deviation from ADR 0017.
