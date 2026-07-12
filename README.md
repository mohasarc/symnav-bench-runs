# symnav-bench-runs

Workflow runner for `ghcr.io/mohasarc/symnav-bench`.

This repo runs immutable benchmark studies. Dispatch `study dispatcher` with a
declared study ID, configuration ID, and run mode. Normalized attempts land on
the `results` branch. Interactive dashboards deploy to GitHub Pages under the
stable `studies/<study-id>/` path.

## Dispatch

Use `study dispatcher`. Public dispatch accepts only `study`, `configuration`,
and `mode`. Study manifests pin task suite, model, effort, agent version, harness
image digest, DeepSWE SHA, and symnav SHA.

Dispatcher is asynchronous. A green dispatcher run means child batch workflows
were accepted. Study is finished only after every matching `study batch` run
publishes its report.

Required secrets:

- `CLAUDE_CODE_OAUTH_TOKEN` or `ANTHROPIC_API_KEY`
- `CODEX_AUTH_JSON_B64`

Keep the repo private before publishing result artifacts that should not be
public.

## Terra-medium PR #94 study

Production study ID: `deepswe-ts-codex-terra-medium-pr94`

Smoke study ID: `deepswe-ts-codex-terra-medium-pr94-smoke`

Configuration ID: `codex-gpt-5.6-terra-medium`

Run smoke before full dispatch:

```bash
gh workflow run study.yml \
  --repo mohasarc/symnav-bench-runs \
  --ref main \
  -f study=deepswe-ts-codex-terra-medium-pr94-smoke \
  -f configuration=codex-gpt-5.6-terra-medium \
  -f mode=run-all
```

Confirm smoke dispatcher and its two-cell child batch finish. Retry only
retryable infrastructure or provider failures. Context exhaustion, agent
timeout, and verifier failures stay scored failures.

Dispatch both 140-slot production batches after smoke:

```bash
gh workflow run study.yml \
  --repo mohasarc/symnav-bench-runs \
  --ref main \
  -f study=deepswe-ts-codex-terra-medium-pr94 \
  -f configuration=codex-gpt-5.6-terra-medium \
  -f mode=run-all
```

Use `resume` to dispatch only batches with unresolved retryable slots. Results
and dashboard data publish from serialized batch report jobs. Stable dashboard
paths are:

- `https://mohasarc.github.io/symnav-bench-runs/studies/deepswe-ts-codex-terra-medium-pr94-smoke/`
- `https://mohasarc.github.io/symnav-bench-runs/studies/deepswe-ts-codex-terra-medium-pr94/`
