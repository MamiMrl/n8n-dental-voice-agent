# ADR 0004: Demo video uploaded to GitHub, embedded inline in README

Date: 2026-07-06
Status: Accepted

## Context

The portfolio showcase (ADR 0001) needs a demo video. Options: upload the mp4
directly to GitHub (inline player, ~10 MB practical limit) or host on YouTube
(no limit, but one click away and an external dependency).

## Decision

Record ≤90 s on iPhone (screen recording with call audio audible), keep it
≤10 MB, drag into the README on GitHub so it plays inline. The same file is
reused on the Notion showcase page. YouTube only if search discoverability
becomes a goal later.

## Consequences

- Recruiters see the agent working without leaving the repo.
- Video must be compressed (e.g. HandBrake/ffmpeg) if the raw recording
  exceeds ~10 MB.
