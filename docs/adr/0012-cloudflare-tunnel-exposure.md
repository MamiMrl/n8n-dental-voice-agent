# 0012 — Expose local n8n via named Cloudflare Tunnel (free); hosted n8n is the production path

Date: 2026-07-09
Status: accepted

## Context

Mid-call function calling (ADR 0006) requires Retell's servers to reach the
n8n webhooks. n8n currently runs locally (`npx n8n`) on the developer Mac.
Options: tunnel (ngrok/Cloudflare), n8n's dev-only `--tunnel` flag, or
hosted n8n (VPS / n8n Cloud, ~€5–20/mo).

## Decision

**Named Cloudflare Tunnel** (free tier): stable public URL forwarding to
local n8n. Retell Custom Function URLs point at the tunnel hostname.

## Rationale

- Project is a portfolio showcase, not production: calls are triggered by
  the developer while the machine is awake. Zero cost matches that stage.
- *Named* tunnel ⇒ stable URL ⇒ Retell function configs never break from
  URL rotation (free ngrok's failure mode).
- n8n `--tunnel` is dev-only with unstable URLs — rejected.

## Consequences

- Mac asleep / tunnel down ⇒ Emma's tools fail mid-call. Acceptable for
  demos; failure behavior handled in a separate ADR.
- **Production path (documented, deferred):** hosted n8n (VPS or n8n Cloud)
  with always-on availability before any real clinic use.
