# symnav-bench-runs

Workflow runner for `ghcr.io/mohasarc/symnav-bench`.

This repo runs immutable benchmark studies. Dispatch `study dispatcher` with a
declared study ID, configuration ID, and run mode. Normalized attempts land on
the `results` branch. Interactive dashboards deploy to GitHub Pages under the
stable `studies/<study-id>/` path.

## Dispatch

Use `study dispatcher`. Public dispatch accepts only `study`, `configuration`,
and `mode`. Study manifests pin task suite, model, effort, agent version, harness
image digest, benchmark source revision, and symnav SHA.

Dispatcher is asynchronous. A green dispatcher run means child batch workflows
were accepted. Study is finished only after every matching `study batch` run
publishes its report.

Required secrets:

- `CLAUDE_CODE_OAUTH_TOKEN` or `ANTHROPIC_API_KEY`
- `CODEX_AUTH_JSON_B64`

Keep the repo private before publishing result artifacts that should not be
public.

## Declaring a study

Studies are immutable. Declare a new ID instead of editing a committed one.
Supported benchmarks: `deepswe`, `swe-polybench` (TypeScript, fit-tier
filtered), `multi-swe-bench` (whole TypeScript set).

1. Publish the harness image: dispatch `publish.yml` in `symnav-bench`
   (workflow_dispatch on the ref you want). It pushes
   `ghcr.io/mohasarc/symnav-bench:sha-<short-sha>`.
2. Pin execution: resolve the tag to its digest and write
   `studies/<id>/execution.json` with `image_reference`, `image_digest`
   (immutable digest, never the tag alone), and `symnav_bench_sha`.
3. Write `studies/<id>/manifest.yml` as schema v2 with a `protocol.benchmark`
   block: `name` plus `source.revision` (deep-swe repo SHA for `deepswe`,
   HF dataset revision otherwise). `swe-polybench` also declares `tiers`
   (`high`/`mid`/`low`). v2 forbids top-level `deep_swe_sha`.
4. Resolve the suite inside the pinned image:

   ```bash
   docker run --rm -v "$PWD:/workspace" \
     "$image_reference@$image_digest" resolve-suite \
       --study /workspace/studies/<id>/manifest.yml \
       --out /workspace/studies/<id>/suite.json
   ```

   Deterministic: same revision and tiers produce identical bytes. Stdout
   prints planned task and slot counts — check cost before committing.
5. Commit `manifest.yml`, `suite.json`, and `execution.json` under
   `studies/<id>/` with declaration tests, then dispatch through
   `study dispatcher` as usual.

Study IDs are benchmark-first and, for `swe-polybench`, name the tier set:
`swe-polybench-ts-himid-codex-terra-medium-pr94`,
`swe-polybench-ts-all-<agent>-<model>-<effort>-<tag>`,
`multi-swe-bench-ts-<agent>-<model>-<effort>-<tag>`,
`deepswe-ts-codex-terra-medium-pr94`. Smoke studies add a `-smoke` suffix.

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
