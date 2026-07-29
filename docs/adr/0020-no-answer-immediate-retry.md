# 0020 — No-answer retry: exactly one immediate callback, then stop

Date: 2026-07-14
Status: accepted

## Context

ADR 0018 deferred the no-answer retry policy ("staff would try again
tomorrow; a real retry needs count + spacing rules"), so today a true
no-answer is called about exactly once, forever. But a common real-world
cause of "no answer" isn't unreachability — it's a phone in Do Not Disturb or
a Focus mode silently blocking the call. iOS bypasses exactly this if the
same caller rings again within roughly three minutes (the built-in
"Repeated Calls" allowance).

## Decision

On a **true no-answer** (rang out / rejected — not voicemail), Lane 5 (the
post-call outcome webhook) immediately places one retry call to the same
patient, running the identical script — no reference to a prior attempt. If
the retry also results in no-answer, the appointment is finalized as
`[NO ANSWER]` and never called again.

- **Voicemail is excluded.** If Emma reached voicemail and left the
  appointment message, that's a completed contact — stamped `[NO ANSWER]`
  immediately, no retry. Retell's post-call analysis already emits
  `no_answer` and `voicemail` as separate values; the existing Code node
  just needs its OR-condition split to treat them differently.
- **Retry state rides the existing title-prefix convention**
  (ADR 0015/0018): first no-answer stamps `[RETRY]`; a second no-answer
  replaces it with the final `[NO ANSWER]`. The morning pipeline's existing
  skip-if-prefixed filter (ADR 0018) already prevents any further calls once
  either prefix is set — no change needed there.
- **Hard cap: 2 attempts total, ever, per appointment.**

## Rationale

- Immediate retry (not delayed by hours) is the whole point — it targets a
  phone-level notification block that a same-day-later retry would just as
  easily hit again, whereas back-to-back calls have a documented OS-level
  bypass.
- Reusing the title-prefix mechanism costs nothing new: no database, no n8n
  static data, same pattern already trusted for `[CANCELLED]`/`[CONFIRMED]`.
- Capping at 2 keeps "how many times does the clinic call me" bounded and
  human — matches what real front-desk staff would do (try twice, then note
  it and stop).

## Consequences

- Lane 5's node order changes: it now needs the event's **current** title
  before deciding retry-vs-finalize (to detect an existing `[RETRY]`
  prefix), so the calendar `Get Event` step must run *before* the prefix
  decision, not after.
- Lane 5 gains a new outbound leg: an HTTP Request node re-invoking Retell's
  `create-phone-call`, reusing the same `retell_llm_dynamic_variables`
  already echoed back in the `call_analyzed` payload — no new data needed.
- Resolves ADR 0018's deferred "no-answer retry policy" open item.
