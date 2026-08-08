# Resuming polybench r4

Everything is declared, pinned, and fixed. The run is blocked on one thing only:
the `CODEX_AUTH_JSON_B64` repository secret is stale.

## The blocker

The secret was last set 2026-07-12. A local `codex login` on 2026-08-04 rotated
the refresh token, which invalidates the one stored in the secret. Every stock
cell in the first r4 attempt died with:

```
Failed to refresh token: 401 Unauthorized: "code": "invalid_refresh_token"
failed to refresh available models: 401 ... "auth error code: token_expired"
```

This is not retryable and no harness change fixes it — the credential itself is dead.

## The fix, one command

```
gh secret set CODEX_AUTH_JSON_B64 --repo mohasarc/symnav-bench-runs \
  < <(base64 -i ~/.codex/auth.json)
```

The local credential at `~/.codex/auth.json` was valid as of 2026-08-07
(access token good through 2026-08-14).

**Side effect worth knowing:** CI will use and rotate that refresh token, which
will most likely log out your local `codex` CLI — that is exactly how the
current secret went stale, in reverse. Re-run `codex login` locally afterwards
if you need the CLI. This is why the secret was not updated automatically.

## Then launch

```
gh workflow run study.yml --repo mohasarc/symnav-bench-runs \
  -f study=swe-polybench-ts-himid-codex-terra-medium-pr94-r4 \
  -f configuration=codex-gpt-5.6-terra-medium \
  -f mode=run-all
```

Results land on the `results` branch and appear in the explorer automatically;
the Pages deploy is triggered by the batch workflow when it commits results.

## What r4 is

- 74 tasks (75 minus `angular__angular-37484`, excluded as ungradable), 2 arms,
  1 repetition = 148 slots. Same symnav revision as r3 (v0.2.0,
  `ef9fd76d`), so r3 → r4 isolates the harness grading fixes.
- Harness `ghcr.io/mohasarc/symnav-bench:sha-d859f23`
  (`sha256:7c756749017c5560ee66760d45f1cb39cf46d45b7363bf3796d2587964588e03`),
  which carries the apt fix, the test-command timeout, the three grading fixes,
  and the symnav sha fetch.
- Suite fingerprint `e586ce9d8c3da8d0…`, committed under
  `studies/swe-polybench-ts-himid-codex-terra-medium-pr94-r4/suite.json`.

## Harness re-pin span

The suite was resolved under `sha-fd9577e`; execution is pinned to
`sha-d859f23`. The only diff between them is `agents/install.py` and its test —
nothing under `benchmark_sources`, so task materialization is unchanged.
Confirmed empirically: `tailwindlabs__tailwindcss-116`,
`coder__code-server-3277` and `microsoft__vscode-158371` all re-materialize to
their declared checksums under the new pin.

## Fixed during the first r4 attempt

`git clone symnav && git checkout <sha>` stopped working when PR 94 merged and
its branch was deleted on 2026-08-07 — the pinned sha is not an ancestor of
main, so a fresh clone cannot reach it (`fatal: reference is not a tree`). The
install now does a shallow `git fetch origin <sha>`, which GitHub serves even
with no branch pointing at the commit. Verified in a clean container against
that exact sha.
