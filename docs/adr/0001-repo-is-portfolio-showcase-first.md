# ADR 0001: Repo is a portfolio showcase first, reusable template later

Date: 2026-07-06
Status: Accepted

## Context

The dental voice agent (n8n + Google Calendar + Gemini + Retell AI) works end-to-end:
scheduled trigger → calendar fetch → LLM extraction → outbound reminder call. The owner
wants it public on GitHub, featured in a portfolio, with a demo video.

Two possible audiences pull the repo in different directions:

- **Portfolio showcase**: recruiters/clients skimming ~2 minutes. Needs README with
  architecture diagram, demo video, clear "what/why".
- **Reusable template**: developers importing and running it. Needs setup docs,
  placeholder configs, troubleshooting.

## Decision

Optimize for **portfolio showcase (A)** now. Reusable-template packaging (B) is
explicitly deferred — keep it in mind (sanitized JSON, included agent prompt make the
later switch cheap), but do not invest in template polish (troubleshooting guides,
issue templates, contribution docs) yet.

## Consequences

- README is written for a skimming evaluator: demo video top, diagram, feature list.
- Workflow JSON is sanitized with placeholders anyway (cheap, enables B later).
- Template-grade docs are out of scope until B is picked up.
