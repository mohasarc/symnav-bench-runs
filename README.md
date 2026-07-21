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

   `multi-swe-bench` resolution probes ~200 Docker Hub manifests; anonymous
   probing from one IP hits Hub rate limits (429). Run it in CI instead:
   dispatch `resolve suite` with the study ID and download the `suite-<id>`
   artifact. GitHub-hosted runners pass. Set `DOCKER_HUB_USERNAME` /
   `DOCKER_HUB_TOKEN` for authenticated local probing.

   Smoke studies pin a hand-picked subset of the resolved suite: keep the
   chosen task entries, recompute `fingerprint` over
   `{benchmark, source_revision, tasks}` (canonical JSON, sha256).
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

## Multi-benchmark smoke studies

2-task smoke per new benchmark, same configuration ID
(`codex-gpt-5.6-terra-medium`), 4 slots each (2 tasks x stock/symnav x 1 rep):

- `swe-polybench-ts-smoke` — `angular__angular-37484` (mid),
  `coder__code-server-3277` (high). Full suite at this revision: 75 tasks.
- `multi-swe-bench-ts-smoke` — `darkreader__darkreader-6747`,
  `vuejs__core-10004`. Full suite: 201 tasks (23 of 224 excluded for empty
  fail-to-pass sets).

Both smokes resolved all 4 slots end-to-end. Outcomes: vuejs passed both
arms (F2P 2/2, P2P 2829/2829), darkreader/angular/code-server scored
`apply_failed` under the pre-fix test-patch-first grading order. Smoke runs
span harness pins `sha-a3ff57f`..`sha-0c974d6` (fixes landed between
attempts); treat them as pipeline validation, not benchmark data.

## Full studies (multi-benchmark)

Pinned to `sha-ea3fed2` (model-patch-first grading), suites resolved in CI:

- `swe-polybench-ts-himid-codex-terra-medium-pr94` — 75 tasks, 150 slots.
- `multi-swe-bench-ts-codex-terra-medium-pr94` — 201 tasks, 402 slots.

Dashboards:

- `https://mohasarc.github.io/symnav-bench-runs/studies/swe-polybench-ts-smoke/`
- `https://mohasarc.github.io/symnav-bench-runs/studies/multi-swe-bench-ts-smoke/`
- `https://mohasarc.github.io/symnav-bench-runs/studies/swe-polybench-ts-himid-codex-terra-medium-pr94/`
- `https://mohasarc.github.io/symnav-bench-runs/studies/multi-swe-bench-ts-codex-terra-medium-pr94/`
