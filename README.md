# symnav-bench-runs

Workflow runner for `ghcr.io/mohasarc/symnav-bench`.

This repo is meant for controlled benchmark dispatches. The workflow runs one
cell per matrix job, uploads each normalized cell as an artifact, then a single
report job writes accumulated cells and regenerated reports to the orphan
`results` branch.

## Dispatch

Inputs:

| Input | Default | Meaning |
| --- | --- | --- |
| `image_tag` | `main` | symnav-bench image tag. |
| `agents` | `codex:gpt-5.4:xhigh,claude:claude-opus-4-8:high` | Comma-separated run specs. |
| `conditions` | `symnav,stock` | `symnav`, `stock`, or both. |
| `tasks` | empty | Empty means all tasks in image. |
| `rep` | `0` | Rep index for this dispatch. |
| `symnav_ref` | `main` | Ref resolved by the harness. |
| `deep_swe_ref` | `main` | DeepSWE ref checked out by each cell. |
| `max_parallel` | `8` | GitHub Actions matrix concurrency. |

Required secrets:

- `CLAUDE_CODE_OAUTH_TOKEN` or `ANTHROPIC_API_KEY`
- `CODEX_AUTH_JSON_B64`

Keep the repo private before publishing result artifacts that should not be
public.
