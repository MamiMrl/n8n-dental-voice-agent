# 0017 — Webhook security: shared-secret header auth on all Emma tool lanes

Date: 2026-07-09
Status: accepted

## Context

The tunnel (ADR 0012) makes four calendar-writing endpoints publicly
reachable. Webhook URLs leak easily for a portfolio project (screenshots,
demo videos, Retell dashboard), so URL obscurity alone is insufficient.

## Decision

**Shared secret header:** Retell Custom Functions attach a custom header
(e.g., `X-Emma-Key: <secret>`); each n8n Webhook node uses built-in
**Header Auth** and rejects non-matching requests with 403.

## Rationale

- Standard n8n pattern, ~5 min setup, zero infrastructure.
- Closes the real threat model: random internet + leaked URL.
- Visible in the sanitized published JSON — signals security thinking.

## Consequences

- Secret lives in gitignored `LOCAL-CONFIG.md` alongside other real values;
  sanitized JSON ships a placeholder.
- Production upgrade (documented, deferred): cryptographic Retell signature
  verification (HMAC in a Code node per lane).
