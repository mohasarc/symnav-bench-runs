# symnav-bench-runs

Workflow runner for `ghcr.io/mohasarc/symnav-bench`.

This repo runs immutable benchmark studies. Dispatch `study coordinator` with a
declared study ID, configuration ID, and run mode. Normalized attempts land on
the `results` branch. Interactive dashboards deploy to GitHub Pages under the
stable `studies/<study-id>/` path.

## Dispatch

Use `study coordinator`. Public dispatch accepts only `study`, `configuration`,
and `mode`. Study manifests pin task suite, model, effort, agent version, harness
image digest, DeepSWE SHA, and symnav SHA.

Required secrets:

- `CLAUDE_CODE_OAUTH_TOKEN` or `ANTHROPIC_API_KEY`
- `CODEX_AUTH_JSON_B64`

Keep the repo private before publishing result artifacts that should not be
public.
