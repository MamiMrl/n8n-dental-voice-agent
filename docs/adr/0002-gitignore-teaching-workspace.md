# ADR 0002: Keep teaching workspace local via .gitignore

Date: 2026-07-06
Status: Accepted

## Context

The project directory doubles as a learning workspace (`lessons/`, `assets/`,
`MISSION.md`, `RESOURCES.md`, learning records) created during teaching sessions.
A portfolio reviewer seeing quiz lessons and learning notes would read the repo as
a sandbox rather than a product. Old workflow variants (`n8n_automations.zip`,
`_unzipped/`) add noise.

Alternatives considered: moving the teaching workspace to a sibling directory
(clean but separates learning context from the project), or publishing everything
(authentic but noisy).

## Decision

Single directory, single repo. `.gitignore` excludes the teaching workspace,
archives, `.env`, and internal notes (`notion-demo.md`). Only product files are
tracked: workflow JSON, agent prompt, `docs/`, README.

## Consequences

- Local dir and published repo diverge by design; small repo keeps the risk low.
- Before any `git add -A`, check `git status` — new teaching files must be
  covered by the ignore patterns.
