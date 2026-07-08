# 🦷 Dental Voice Agent — AI that calls patients about their appointments

## 🎥 See it in action

> **[Demo video — a real call from Emma, the AI voice agent]**
> *(90-second screen recording with audible call — coming soon)*

---

## What it does

Every morning at 8:00, the system reads a dental clinic's calendar and finds every appointment in the next three days. Then **Emma** — an AI voice agent — picks up the phone and calls each patient.

Emma sounds like a friendly member of the front-desk staff. She:

- reminds the patient of their appointment in natural, spoken language
- asks whether the time still works
- handles **"yes"**, **"I need to reschedule"**, and **"please cancel"** gracefully
- leaves a short voicemail if nobody answers
- apologizes and hangs up if she reached the wrong number

No one at the clinic has to do anything. It runs by itself, every day.

## Why this matters

Missed appointments are one of the biggest silent costs in a dental practice — an empty chair still costs staff, rent, and time. The usual fix is having front-desk staff spend hours on reminder calls.

This system does those calls automatically, for cents per call, and never forgets, never gets tired, and never sounds annoyed on the twentieth call of the morning.

## What I built

- **The automation pipeline** — a workflow that connects the clinic's Google Calendar to the phone system, running on a daily schedule
- **AI-powered data extraction** — appointment entries are free text written by humans; an LLM turns them into clean, structured data (name, phone number, reason, time) reliably enough to place real calls
- **Emma's conversation design** — a carefully scoped voice prompt: short sentences, no medical advice, no rambling, graceful exits, voicemail handling
- **Real international calling** — configured and tested live with real calls to a German mobile number from a US line

## What's next

- Emma reports each call's outcome back to the calendar automatically (confirmed / reschedule / cancelled)
- Emma offers new appointment slots directly during the call — one at a time, the way a human receptionist would

---

## 🔗 The code

Full technical write-up, workflow file, and voice-agent prompt:
**[github.com/MamiMrl/n8n-dental-voice-agent](https://github.com/MamiMrl/n8n-dental-voice-agent)**
