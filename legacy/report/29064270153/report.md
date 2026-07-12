# symnav bench report

Costs are `cost_usd_imputed` from Pier output.

- Warning: claude-claude-sonnet-4-5-low-stock-prometheus-transactional-reload-status-rep13 has f2p=1.0 but p2p=0.9878048780487805
- Warning: codex-gpt-5.4-xhigh-symnav@7f45343f6e7e-dynamodb-toolbox-conditional-attribute-requirements-rep2 has f2p=1.0 but p2p=0.9984214680347278
- Warning: codex-gpt-5.4-xhigh-symnav@7f45343f6e7e-httpx-deterministic-cookie-store-rep2 has f2p=1.0 but p2p=0.9992193598750976
- Warning: codex-gpt-5.4-xhigh-symnav@7f45343f6e7e-prometheus-transactional-reload-status-rep2 has f2p=1.0 but p2p=0.9878048780487805
- Warning: codex-gpt-5.4-low-symnav@05dda73f3803-httpx-deterministic-cookie-store-rep14 has f2p=1.0 but p2p=0.9992193598750976
- Warning: codex-gpt-5.4-low-stock-query-persist-restored-query-state-rep14 has f2p=1.0 but p2p=0.9761904761904762
- Warning: codex-gpt-5.4-low-stock-meriyah-explicit-resource-declarations-rep14 has f2p=1.0 but p2p=0.9999805708290427
## claude:claude-opus-4-8:high:stock vs claude:claude-opus-4-8:high:symnav@7f45343f6e7e

| metric | left | right |
| --- | ---: | ---: |
| mean f2p | 0.000 | 0.000 |
| solved rate | 0.000 | 0.000 |
| paired tasks | 5 | 5 |
| matched solved tasks | 0 | 0 |
| matched cost_usd_imputed | n/a | n/a |
| matched tokens | n/a | n/a |
| matched steps | n/a | n/a |

Matched-set efficiency only includes tasks solved by both arms.

Holes:
- missing arm for anko-default-function-arguments
- missing arm for arcane-drift-detection-baselines
- claude-claude-opus-4-8-high-stock-abs-module-cache-flags-rep2 status=error
- claude-claude-opus-4-8-high-stock-abs-stepped-slices-rep2 status=error
- claude-claude-opus-4-8-high-stock-actionlint-action-pinning-lint-rep2 status=error
- claude-claude-opus-4-8-high-stock-adaptix-name-mapping-aliases-rep2 status=error
- claude-claude-opus-4-8-high-stock-aiomonitor-task-snapshots-diff-rep2 status=error
- claude-claude-opus-4-8-high-symnav@7f45343f6e7e-abs-module-cache-flags-rep2 status=error
- claude-claude-opus-4-8-high-symnav@7f45343f6e7e-abs-stepped-slices-rep2 status=error
- claude-claude-opus-4-8-high-symnav@7f45343f6e7e-actionlint-action-pinning-lint-rep2 status=error
- claude-claude-opus-4-8-high-symnav@7f45343f6e7e-adaptix-name-mapping-aliases-rep2 status=error
- claude-claude-opus-4-8-high-symnav@7f45343f6e7e-aiomonitor-task-snapshots-diff-rep2 status=error
- claude-claude-opus-4-8-high-symnav@7f45343f6e7e-anko-default-function-arguments-rep2 status=error
- claude-claude-opus-4-8-high-symnav@7f45343f6e7e-arcane-drift-detection-baselines-rep2 status=error

## claude:claude-sonnet-4-5:low:stock vs claude:claude-sonnet-4-5:low:symnav@05dda73f3803

| metric | left | right |
| --- | ---: | ---: |
| mean f2p | 0.525 | 0.573 |
| solved rate | 0.017 | 0.057 |
| paired tasks | 35 | 35 |
| matched solved tasks | 0 | 0 |
| matched cost_usd_imputed | n/a | n/a |
| matched tokens | n/a | n/a |
| matched steps | n/a | n/a |

Matched-set efficiency only includes tasks solved by both arms.

## claude:claude-sonnet-4-5:low:stock vs claude:claude-sonnet-4-5:low:symnav@5f9f93834c93

| metric | left | right |
| --- | ---: | ---: |
| mean f2p | 0.525 | 0.376 |
| solved rate | 0.017 | 0.000 |
| paired tasks | 6 | 6 |
| matched solved tasks | 0 | 0 |
| matched cost_usd_imputed | n/a | n/a |
| matched tokens | n/a | n/a |
| matched steps | n/a | n/a |

Matched-set efficiency only includes tasks solved by both arms.

Holes:
- missing arm for arktype-json-schema-refs-dependencies
- missing arm for awilix-async-container-initialization
- missing arm for clack-async-autocomplete-options
- missing arm for claude-code-by-agents-recursive-delegation
- missing arm for cliffy-config-file-parsing
- missing arm for drizzle-orm-window-function-builders
- missing arm for dynamodb-toolbox-conditional-attribute-requirements
- missing arm for dynamodb-toolbox-lazy-recursive-schemas
- missing arm for effect-sse-httpapi-streaming
- missing arm for happy-dom-abort-pending-body-reads
- missing arm for httpx-deterministic-cookie-store
- missing arm for ink-grid-box-layout
- missing arm for koota-composite-trait-aspects
- missing arm for koota-deferred-mutation-buffer
- missing arm for koota-pair-relation-tracking
- missing arm for kysely-window-grouping-helpers
- missing arm for meriyah-explicit-resource-declarations
- missing arm for obsidian-linter-auto-table-of-contents
- missing arm for obsidian-linter-link-format-conversion
- missing arm for obsidian-linter-scoped-ignore-markers
- missing arm for ofetch-per-origin-circuit-breaker
- missing arm for optique-conditional-option-dependencies
- missing arm for prometheus-transactional-reload-status
- missing arm for query-persist-restored-query-state
- missing arm for quill-shared-toolbar-focus
- missing arm for sql-formatter-bigquery-pipe-formatting
- missing arm for superjson-error-stack-serialization
- missing arm for true-myth-iterable-collection-combinators
- missing arm for vitest-duration-sharding

Agent versions differ across compared arms.

## codex:gpt-5.4-mini:low:stock vs codex:gpt-5.4-mini:low:symnav@05dda73f3803

| metric | left | right |
| --- | ---: | ---: |
| mean f2p | 0.500 | 0.520 |
| solved rate | 0.081 | 0.057 |
| paired tasks | 35 | 35 |
| matched solved tasks | 1 | 1 |
| matched cost_usd_imputed | 0.863 | 0.585 |
| matched tokens | 8020353.000 | 4804696.000 |
| matched steps | 93.000 | 64.000 |

Matched-set efficiency only includes tasks solved by both arms.

Agent versions differ across compared arms.

## codex:gpt-5.4-mini:low:stock vs codex:gpt-5.4-mini:low:symnav@09a0006447bc

| metric | left | right |
| --- | ---: | ---: |
| mean f2p | 0.500 | 0.524 |
| solved rate | 0.081 | 0.333 |
| paired tasks | 3 | 3 |
| matched solved tasks | 1 | 1 |
| matched cost_usd_imputed | 0.179 | 0.241 |
| matched tokens | 1016764.000 | 1402094.000 |
| matched steps | 32.000 | 42.000 |

Matched-set efficiency only includes tasks solved by both arms.

Holes:
- missing arm for arktype-json-schema-refs-dependencies
- missing arm for awilix-async-container-initialization
- missing arm for clack-async-autocomplete-options
- missing arm for claude-code-by-agents-recursive-delegation
- missing arm for cliffy-config-file-parsing
- missing arm for drizzle-orm-window-function-builders
- missing arm for dynamodb-toolbox-conditional-attribute-requirements
- missing arm for dynamodb-toolbox-lazy-recursive-schemas
- missing arm for effect-sse-httpapi-streaming
- missing arm for happy-dom-abort-pending-body-reads
- missing arm for httpx-deterministic-cookie-store
- missing arm for ink-grid-box-layout
- missing arm for koota-composite-trait-aspects
- missing arm for koota-deferred-mutation-buffer
- missing arm for koota-pair-relation-tracking
- missing arm for koota-query-predicates
- missing arm for kysely-window-grouping-helpers
- missing arm for meriyah-explicit-resource-declarations
- missing arm for obsidian-linter-auto-table-of-contents
- missing arm for obsidian-linter-link-format-conversion
- missing arm for obsidian-linter-scoped-ignore-markers
- missing arm for ofetch-per-origin-circuit-breaker
- missing arm for optique-conditional-option-dependencies
- missing arm for prometheus-transactional-reload-status
- missing arm for query-persist-restored-query-state
- missing arm for quill-shared-toolbar-focus
- missing arm for sql-formatter-bigquery-pipe-formatting
- missing arm for superjson-error-stack-serialization
- missing arm for true-myth-iterable-collection-combinators
- missing arm for ts-pattern-match-each
- missing arm for valibot-recursive-schema-composition
- missing arm for vitest-duration-sharding

Agent versions differ across compared arms.

## codex:gpt-5.4-mini:low:stock vs codex:gpt-5.4-mini:low:symnav@4e64b558fd51

| metric | left | right |
| --- | ---: | ---: |
| mean f2p | 0.500 | 0.404 |
| solved rate | 0.081 | 0.167 |
| paired tasks | 6 | 6 |
| matched solved tasks | 1 | 1 |
| matched cost_usd_imputed | 0.179 | 0.171 |
| matched tokens | 1016764.000 | 974756.000 |
| matched steps | 32.000 | 30.000 |

Matched-set efficiency only includes tasks solved by both arms.

Holes:
- missing arm for arktype-json-schema-refs-dependencies
- missing arm for awilix-async-container-initialization
- missing arm for clack-async-autocomplete-options
- missing arm for claude-code-by-agents-recursive-delegation
- missing arm for cliffy-config-file-parsing
- missing arm for drizzle-orm-window-function-builders
- missing arm for dynamodb-toolbox-conditional-attribute-requirements
- missing arm for dynamodb-toolbox-lazy-recursive-schemas
- missing arm for effect-sse-httpapi-streaming
- missing arm for happy-dom-abort-pending-body-reads
- missing arm for httpx-deterministic-cookie-store
- missing arm for ink-grid-box-layout
- missing arm for koota-composite-trait-aspects
- missing arm for koota-deferred-mutation-buffer
- missing arm for koota-pair-relation-tracking
- missing arm for kysely-window-grouping-helpers
- missing arm for meriyah-explicit-resource-declarations
- missing arm for obsidian-linter-auto-table-of-contents
- missing arm for obsidian-linter-link-format-conversion
- missing arm for obsidian-linter-scoped-ignore-markers
- missing arm for ofetch-per-origin-circuit-breaker
- missing arm for optique-conditional-option-dependencies
- missing arm for prometheus-transactional-reload-status
- missing arm for query-persist-restored-query-state
- missing arm for quill-shared-toolbar-focus
- missing arm for sql-formatter-bigquery-pipe-formatting
- missing arm for superjson-error-stack-serialization
- missing arm for true-myth-iterable-collection-combinators
- missing arm for vitest-duration-sharding

Agent versions differ across compared arms.

## codex:gpt-5.4-mini:low:stock vs codex:gpt-5.4-mini:low:symnav@5ae32c2a55c0

| metric | left | right |
| --- | ---: | ---: |
| mean f2p | 0.500 | 0.442 |
| solved rate | 0.081 | 0.167 |
| paired tasks | 6 | 6 |
| matched solved tasks | 1 | 1 |
| matched cost_usd_imputed | 0.161 | 0.223 |
| matched tokens | 1027818.000 | 1707625.000 |
| matched steps | 32.000 | 41.000 |

Matched-set efficiency only includes tasks solved by both arms.

Holes:
- missing arm for arktype-json-schema-refs-dependencies
- missing arm for awilix-async-container-initialization
- missing arm for clack-async-autocomplete-options
- missing arm for claude-code-by-agents-recursive-delegation
- missing arm for cliffy-config-file-parsing
- missing arm for drizzle-orm-window-function-builders
- missing arm for dynamodb-toolbox-conditional-attribute-requirements
- missing arm for dynamodb-toolbox-lazy-recursive-schemas
- missing arm for effect-sse-httpapi-streaming
- missing arm for happy-dom-abort-pending-body-reads
- missing arm for httpx-deterministic-cookie-store
- missing arm for ink-grid-box-layout
- missing arm for koota-composite-trait-aspects
- missing arm for koota-deferred-mutation-buffer
- missing arm for koota-pair-relation-tracking
- missing arm for kysely-window-grouping-helpers
- missing arm for meriyah-explicit-resource-declarations
- missing arm for obsidian-linter-auto-table-of-contents
- missing arm for obsidian-linter-link-format-conversion
- missing arm for obsidian-linter-scoped-ignore-markers
- missing arm for ofetch-per-origin-circuit-breaker
- missing arm for optique-conditional-option-dependencies
- missing arm for prometheus-transactional-reload-status
- missing arm for query-persist-restored-query-state
- missing arm for quill-shared-toolbar-focus
- missing arm for sql-formatter-bigquery-pipe-formatting
- missing arm for superjson-error-stack-serialization
- missing arm for true-myth-iterable-collection-combinators
- missing arm for vitest-duration-sharding

Agent versions differ across compared arms.

## codex:gpt-5.4-mini:low:stock vs codex:gpt-5.4-mini:low:symnav@5f9f93834c93

| metric | left | right |
| --- | ---: | ---: |
| mean f2p | 0.500 | 0.579 |
| solved rate | 0.081 | 0.083 |
| paired tasks | 6 | 6 |
| matched solved tasks | 1 | 1 |
| matched cost_usd_imputed | 0.179 | 0.148 |
| matched tokens | 1016764.000 | 695358.000 |
| matched steps | 32.000 | 21.000 |

Matched-set efficiency only includes tasks solved by both arms.

Holes:
- missing arm for arktype-json-schema-refs-dependencies
- missing arm for awilix-async-container-initialization
- missing arm for clack-async-autocomplete-options
- missing arm for claude-code-by-agents-recursive-delegation
- missing arm for cliffy-config-file-parsing
- missing arm for drizzle-orm-window-function-builders
- missing arm for dynamodb-toolbox-conditional-attribute-requirements
- missing arm for dynamodb-toolbox-lazy-recursive-schemas
- missing arm for effect-sse-httpapi-streaming
- missing arm for happy-dom-abort-pending-body-reads
- missing arm for httpx-deterministic-cookie-store
- missing arm for ink-grid-box-layout
- missing arm for koota-composite-trait-aspects
- missing arm for koota-deferred-mutation-buffer
- missing arm for koota-pair-relation-tracking
- missing arm for kysely-window-grouping-helpers
- missing arm for meriyah-explicit-resource-declarations
- missing arm for obsidian-linter-auto-table-of-contents
- missing arm for obsidian-linter-link-format-conversion
- missing arm for obsidian-linter-scoped-ignore-markers
- missing arm for ofetch-per-origin-circuit-breaker
- missing arm for optique-conditional-option-dependencies
- missing arm for prometheus-transactional-reload-status
- missing arm for query-persist-restored-query-state
- missing arm for quill-shared-toolbar-focus
- missing arm for sql-formatter-bigquery-pipe-formatting
- missing arm for superjson-error-stack-serialization
- missing arm for true-myth-iterable-collection-combinators
- missing arm for vitest-duration-sharding

Agent versions differ across compared arms.

## codex:gpt-5.4:xhigh:stock vs codex:gpt-5.4:xhigh:symnav@7f45343f6e7e

| metric | left | right |
| --- | ---: | ---: |
| mean f2p | 0.657 | 0.737 |
| solved rate | 0.395 | 0.389 |
| paired tasks | 33 | 33 |
| matched solved tasks | 9 | 9 |
| matched cost_usd_imputed | 3.975 | 3.966 |
| matched tokens | 10170881.500 | 8820125.889 |
| matched steps | 79.000 | 85.556 |

Matched-set efficiency only includes tasks solved by both arms.

Holes:
- missing arm for anko-default-function-arguments
- missing arm for arcane-drift-detection-baselines
- missing arm for query-persist-restored-query-state
- codex-gpt-5.4-xhigh-stock-abs-module-cache-flags-rep2 status=error
- codex-gpt-5.4-xhigh-stock-abs-module-cache-flags-rep999 status=error
- codex-gpt-5.4-xhigh-stock-abs-stepped-slices-rep2 status=error
- codex-gpt-5.4-xhigh-stock-actionlint-action-pinning-lint-rep2 status=error
- codex-gpt-5.4-xhigh-stock-adaptix-name-mapping-aliases-rep2 status=error
- codex-gpt-5.4-xhigh-stock-aiomonitor-task-snapshots-diff-rep2 status=error
- codex-gpt-5.4-xhigh-stock-kysely-window-grouping-helpers-rep1000 status=error
- codex-gpt-5.4-xhigh-stock-kysely-window-grouping-helpers-rep1001 status=error
- codex-gpt-5.4-xhigh-symnav@7f45343f6e7e-abs-module-cache-flags-rep2 status=error
- codex-gpt-5.4-xhigh-symnav@7f45343f6e7e-abs-stepped-slices-rep2 status=error
- codex-gpt-5.4-xhigh-symnav@7f45343f6e7e-actionlint-action-pinning-lint-rep2 status=error
- codex-gpt-5.4-xhigh-symnav@7f45343f6e7e-adaptix-name-mapping-aliases-rep2 status=error
- codex-gpt-5.4-xhigh-symnav@7f45343f6e7e-aiomonitor-task-snapshots-diff-rep2 status=error
- codex-gpt-5.4-xhigh-symnav@7f45343f6e7e-anko-default-function-arguments-rep2 status=error
- codex-gpt-5.4-xhigh-symnav@7f45343f6e7e-arcane-drift-detection-baselines-rep2 status=error

## codex:gpt-5.4:low:stock vs codex:gpt-5.4:low:symnav@05dda73f3803

| metric | left | right |
| --- | ---: | ---: |
| mean f2p | 0.806 | 0.753 |
| solved rate | 0.286 | 0.257 |
| paired tasks | 35 | 35 |
| matched solved tasks | 4 | 4 |
| matched cost_usd_imputed | 1.733 | 1.635 |
| matched tokens | 4571422.500 | 3815329.500 |
| matched steps | 53.250 | 47.500 |

Matched-set efficiency only includes tasks solved by both arms.

## claude:claude-sonnet-4-5:medium:stock vs claude:claude-sonnet-4-5:medium:symnav@05dda73f3803

| metric | left | right |
| --- | ---: | ---: |
| mean f2p | 0.574 | 0.522 |
| solved rate | 0.057 | 0.000 |
| paired tasks | 35 | 35 |
| matched solved tasks | 0 | 0 |
| matched cost_usd_imputed | n/a | n/a |
| matched tokens | n/a | n/a |
| matched steps | n/a | n/a |

Matched-set efficiency only includes tasks solved by both arms.

![paired-f2p-0](charts/paired-f2p-0.png)
![efficiency-0](charts/efficiency-0.png)
![substitution-0](charts/substitution-0.png)
![paired-f2p-1](charts/paired-f2p-1.png)
![efficiency-1](charts/efficiency-1.png)
![substitution-1](charts/substitution-1.png)
![paired-f2p-2](charts/paired-f2p-2.png)
![efficiency-2](charts/efficiency-2.png)
![substitution-2](charts/substitution-2.png)
![paired-f2p-3](charts/paired-f2p-3.png)
![efficiency-3](charts/efficiency-3.png)
![substitution-3](charts/substitution-3.png)
![paired-f2p-4](charts/paired-f2p-4.png)
![efficiency-4](charts/efficiency-4.png)
![substitution-4](charts/substitution-4.png)
![paired-f2p-5](charts/paired-f2p-5.png)
![efficiency-5](charts/efficiency-5.png)
![substitution-5](charts/substitution-5.png)
![paired-f2p-6](charts/paired-f2p-6.png)
![efficiency-6](charts/efficiency-6.png)
![substitution-6](charts/substitution-6.png)
![paired-f2p-7](charts/paired-f2p-7.png)
![efficiency-7](charts/efficiency-7.png)
![substitution-7](charts/substitution-7.png)
![paired-f2p-8](charts/paired-f2p-8.png)
![efficiency-8](charts/efficiency-8.png)
![substitution-8](charts/substitution-8.png)
![paired-f2p-9](charts/paired-f2p-9.png)
![efficiency-9](charts/efficiency-9.png)
![substitution-9](charts/substitution-9.png)
![paired-f2p-10](charts/paired-f2p-10.png)
![efficiency-10](charts/efficiency-10.png)
![substitution-10](charts/substitution-10.png)
![progression](charts/progression.png)
