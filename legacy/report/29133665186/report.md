# symnav bench report

Costs are `cost_usd_imputed` from Pier output.

- Warning: claude-claude-sonnet-4-5-low-stock-prometheus-transactional-reload-status-rep13 has f2p=1.0 but p2p=0.9878048780487805
- Warning: codex-gpt-5.4-low-stock-meriyah-explicit-resource-declarations-rep14 has f2p=1.0 but p2p=0.9999805708290427
- Warning: codex-gpt-5.4-low-stock-query-persist-restored-query-state-rep14 has f2p=1.0 but p2p=0.9761904761904762
- Warning: codex-gpt-5.4-low-symnav@05dda73f3803-httpx-deterministic-cookie-store-rep14 has f2p=1.0 but p2p=0.9992193598750976
- Warning: codex-gpt-5.4-mini-low-stock-query-persist-restored-query-state-rep17 has f2p=1.0 but p2p=0.9523809523809523
- Warning: codex-gpt-5.4-mini-low-stock-query-persist-restored-query-state-rep20 has f2p=1.0 but p2p=0.9285714285714286
- Warning: codex-gpt-5.4-mini-low-symnav-def@53df2ac6b5dc-query-persist-restored-query-state-rep19 has f2p=1.0 but p2p=0.9761904761904762
- Warning: codex-gpt-5.4-mini-low-symnav-overview@53df2ac6b5dc-query-persist-restored-query-state-rep19 has f2p=1.0 but p2p=0.9761904761904762
- Warning: codex-gpt-5.4-xhigh-symnav@7f45343f6e7e-dynamodb-toolbox-conditional-attribute-requirements-rep2 has f2p=1.0 but p2p=0.9984214680347278
- Warning: codex-gpt-5.4-xhigh-symnav@7f45343f6e7e-httpx-deterministic-cookie-store-rep2 has f2p=1.0 but p2p=0.9992193598750976
- Warning: codex-gpt-5.4-xhigh-symnav@7f45343f6e7e-prometheus-transactional-reload-status-rep2 has f2p=1.0 but p2p=0.9878048780487805
- Warning: codex-gpt-5.4-mini-low-symnav-overview-def@8fa615582af5-prometheus-transactional-reload-status-rep24 has f2p=1.0 but p2p=0.9878048780487805
- Warning: codex-gpt-5.4-mini-low-symnav-overview-refs@8fa615582af5-sql-formatter-bigquery-pipe-formatting-rep24 has f2p=1.0 but p2p=0.999649675950254
- Warning: codex-gpt-5.4-mini-low-symnav-overview-def@8fa615582af5-vitest-duration-sharding-rep24 has f2p=1.0 but p2p=0.7916666666666666
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

## codex:gpt-5.4-mini:low:stock vs codex:gpt-5.4-mini:low:symnav-context@53df2ac6b5dc

| metric | left | right |
| --- | ---: | ---: |
| mean f2p | 0.484 | 0.410 |
| solved rate | 0.080 | 0.167 |
| paired tasks | 6 | 6 |
| matched solved tasks | 1 | 1 |
| matched cost_usd_imputed | 0.510 | 0.594 |
| matched tokens | 3754486.400 | 5240321.000 |
| matched steps | 49.800 | 70.000 |

Matched-set efficiency only includes tasks solved by both arms.

Holes:
- missing arm for arktype-json-schema-refs-dependencies
- missing arm for clack-async-autocomplete-options
- missing arm for claude-code-by-agents-recursive-delegation
- missing arm for cliffy-config-file-parsing
- missing arm for drizzle-orm-window-function-builders
- missing arm for dynamodb-toolbox-conditional-attribute-requirements
- missing arm for dynamodb-toolbox-lazy-recursive-schemas
- missing arm for eicrud-keyset-pagination-cursor
- missing arm for happy-dom-abort-pending-body-reads
- missing arm for happy-dom-deterministic-intersectionobserver
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
- missing arm for quill-shared-toolbar-focus
- missing arm for sql-formatter-bigquery-pipe-formatting
- missing arm for superjson-error-stack-serialization
- missing arm for true-myth-iterable-collection-combinators
- missing arm for vitest-duration-sharding

Agent versions differ across compared arms.

## codex:gpt-5.4-mini:low:stock vs codex:gpt-5.4-mini:low:symnav-def@53df2ac6b5dc

| metric | left | right |
| --- | ---: | ---: |
| mean f2p | 0.484 | 0.346 |
| solved rate | 0.080 | 0.167 |
| paired tasks | 6 | 6 |
| matched solved tasks | 1 | 1 |
| matched cost_usd_imputed | 0.510 | 0.372 |
| matched tokens | 3754486.400 | 3177076.000 |
| matched steps | 49.800 | 46.000 |

Matched-set efficiency only includes tasks solved by both arms.

Holes:
- missing arm for arktype-json-schema-refs-dependencies
- missing arm for clack-async-autocomplete-options
- missing arm for claude-code-by-agents-recursive-delegation
- missing arm for cliffy-config-file-parsing
- missing arm for drizzle-orm-window-function-builders
- missing arm for dynamodb-toolbox-conditional-attribute-requirements
- missing arm for dynamodb-toolbox-lazy-recursive-schemas
- missing arm for eicrud-keyset-pagination-cursor
- missing arm for happy-dom-abort-pending-body-reads
- missing arm for happy-dom-deterministic-intersectionobserver
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
- missing arm for quill-shared-toolbar-focus
- missing arm for sql-formatter-bigquery-pipe-formatting
- missing arm for superjson-error-stack-serialization
- missing arm for true-myth-iterable-collection-combinators
- missing arm for vitest-duration-sharding

Agent versions differ across compared arms.

## codex:gpt-5.4-mini:low:stock vs codex:gpt-5.4-mini:low:symnav-graph@53df2ac6b5dc

| metric | left | right |
| --- | ---: | ---: |
| mean f2p | 0.484 | 0.179 |
| solved rate | 0.080 | 0.000 |
| paired tasks | 6 | 6 |
| matched solved tasks | 0 | 0 |
| matched cost_usd_imputed | n/a | n/a |
| matched tokens | n/a | n/a |
| matched steps | n/a | n/a |

Matched-set efficiency only includes tasks solved by both arms.

Holes:
- missing arm for arktype-json-schema-refs-dependencies
- missing arm for clack-async-autocomplete-options
- missing arm for claude-code-by-agents-recursive-delegation
- missing arm for cliffy-config-file-parsing
- missing arm for drizzle-orm-window-function-builders
- missing arm for dynamodb-toolbox-conditional-attribute-requirements
- missing arm for dynamodb-toolbox-lazy-recursive-schemas
- missing arm for eicrud-keyset-pagination-cursor
- missing arm for happy-dom-abort-pending-body-reads
- missing arm for happy-dom-deterministic-intersectionobserver
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
- missing arm for quill-shared-toolbar-focus
- missing arm for sql-formatter-bigquery-pipe-formatting
- missing arm for superjson-error-stack-serialization
- missing arm for true-myth-iterable-collection-combinators
- missing arm for vitest-duration-sharding

Agent versions differ across compared arms.

## codex:gpt-5.4-mini:low:stock vs codex:gpt-5.4-mini:low:symnav-overview-context@53df2ac6b5dc

| metric | left | right |
| --- | ---: | ---: |
| mean f2p | 0.484 | 0.399 |
| solved rate | 0.080 | 0.167 |
| paired tasks | 6 | 6 |
| matched solved tasks | 1 | 1 |
| matched cost_usd_imputed | 0.510 | 0.363 |
| matched tokens | 3754486.400 | 2958064.000 |
| matched steps | 49.800 | 39.000 |

Matched-set efficiency only includes tasks solved by both arms.

Holes:
- missing arm for arktype-json-schema-refs-dependencies
- missing arm for clack-async-autocomplete-options
- missing arm for claude-code-by-agents-recursive-delegation
- missing arm for cliffy-config-file-parsing
- missing arm for drizzle-orm-window-function-builders
- missing arm for dynamodb-toolbox-conditional-attribute-requirements
- missing arm for dynamodb-toolbox-lazy-recursive-schemas
- missing arm for eicrud-keyset-pagination-cursor
- missing arm for happy-dom-abort-pending-body-reads
- missing arm for happy-dom-deterministic-intersectionobserver
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
- missing arm for quill-shared-toolbar-focus
- missing arm for sql-formatter-bigquery-pipe-formatting
- missing arm for superjson-error-stack-serialization
- missing arm for true-myth-iterable-collection-combinators
- missing arm for vitest-duration-sharding

Agent versions differ across compared arms.

## codex:gpt-5.4-mini:low:stock vs codex:gpt-5.4-mini:low:symnav-overview-context@8fa615582af5

| metric | left | right |
| --- | ---: | ---: |
| mean f2p | 0.484 | 0.586 |
| solved rate | 0.080 | 0.086 |
| paired tasks | 35 | 35 |
| matched solved tasks | 3 | 3 |
| matched cost_usd_imputed | 0.430 | 0.489 |
| matched tokens | 3288155.200 | 3815035.000 |
| matched steps | 48.000 | 53.250 |

Matched-set efficiency only includes tasks solved by both arms.

Agent versions differ across compared arms.

## codex:gpt-5.4-mini:low:stock vs codex:gpt-5.4-mini:low:symnav-overview-def@53df2ac6b5dc

| metric | left | right |
| --- | ---: | ---: |
| mean f2p | 0.484 | 0.422 |
| solved rate | 0.080 | 0.000 |
| paired tasks | 6 | 6 |
| matched solved tasks | 0 | 0 |
| matched cost_usd_imputed | n/a | n/a |
| matched tokens | n/a | n/a |
| matched steps | n/a | n/a |

Matched-set efficiency only includes tasks solved by both arms.

Holes:
- missing arm for arktype-json-schema-refs-dependencies
- missing arm for clack-async-autocomplete-options
- missing arm for claude-code-by-agents-recursive-delegation
- missing arm for cliffy-config-file-parsing
- missing arm for drizzle-orm-window-function-builders
- missing arm for dynamodb-toolbox-conditional-attribute-requirements
- missing arm for dynamodb-toolbox-lazy-recursive-schemas
- missing arm for eicrud-keyset-pagination-cursor
- missing arm for happy-dom-abort-pending-body-reads
- missing arm for happy-dom-deterministic-intersectionobserver
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
- missing arm for quill-shared-toolbar-focus
- missing arm for sql-formatter-bigquery-pipe-formatting
- missing arm for superjson-error-stack-serialization
- missing arm for true-myth-iterable-collection-combinators
- missing arm for vitest-duration-sharding

Agent versions differ across compared arms.

## codex:gpt-5.4-mini:low:stock vs codex:gpt-5.4-mini:low:symnav-overview-def@8fa615582af5

| metric | left | right |
| --- | ---: | ---: |
| mean f2p | 0.484 | 0.498 |
| solved rate | 0.080 | 0.071 |
| paired tasks | 35 | 35 |
| matched solved tasks | 1 | 1 |
| matched cost_usd_imputed | 0.510 | 0.312 |
| matched tokens | 3754486.400 | 2500043.000 |
| matched steps | 49.800 | 43.000 |

Matched-set efficiency only includes tasks solved by both arms.

Agent versions differ across compared arms.

## codex:gpt-5.4-mini:low:stock vs codex:gpt-5.4-mini:low:symnav-overview-graph@53df2ac6b5dc

| metric | left | right |
| --- | ---: | ---: |
| mean f2p | 0.484 | 0.360 |
| solved rate | 0.080 | 0.167 |
| paired tasks | 6 | 6 |
| matched solved tasks | 1 | 1 |
| matched cost_usd_imputed | 0.510 | 0.602 |
| matched tokens | 3754486.400 | 4922741.000 |
| matched steps | 49.800 | 59.000 |

Matched-set efficiency only includes tasks solved by both arms.

Holes:
- missing arm for arktype-json-schema-refs-dependencies
- missing arm for clack-async-autocomplete-options
- missing arm for claude-code-by-agents-recursive-delegation
- missing arm for cliffy-config-file-parsing
- missing arm for drizzle-orm-window-function-builders
- missing arm for dynamodb-toolbox-conditional-attribute-requirements
- missing arm for dynamodb-toolbox-lazy-recursive-schemas
- missing arm for eicrud-keyset-pagination-cursor
- missing arm for happy-dom-abort-pending-body-reads
- missing arm for happy-dom-deterministic-intersectionobserver
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
- missing arm for quill-shared-toolbar-focus
- missing arm for sql-formatter-bigquery-pipe-formatting
- missing arm for superjson-error-stack-serialization
- missing arm for true-myth-iterable-collection-combinators
- missing arm for vitest-duration-sharding

Agent versions differ across compared arms.

## codex:gpt-5.4-mini:low:stock vs codex:gpt-5.4-mini:low:symnav-overview-graph@8fa615582af5

| metric | left | right |
| --- | ---: | ---: |
| mean f2p | 0.484 | 0.492 |
| solved rate | 0.080 | 0.100 |
| paired tasks | 35 | 35 |
| matched solved tasks | 3 | 3 |
| matched cost_usd_imputed | 0.402 | 0.462 |
| matched tokens | 3042201.200 | 3822642.250 |
| matched steps | 45.400 | 52.000 |

Matched-set efficiency only includes tasks solved by both arms.

Agent versions differ across compared arms.

## codex:gpt-5.4-mini:low:stock vs codex:gpt-5.4-mini:low:symnav-overview-refs@53df2ac6b5dc

| metric | left | right |
| --- | ---: | ---: |
| mean f2p | 0.484 | 0.353 |
| solved rate | 0.080 | 0.167 |
| paired tasks | 6 | 6 |
| matched solved tasks | 1 | 1 |
| matched cost_usd_imputed | 0.510 | 0.546 |
| matched tokens | 3754486.400 | 4727669.000 |
| matched steps | 49.800 | 58.000 |

Matched-set efficiency only includes tasks solved by both arms.

Holes:
- missing arm for arktype-json-schema-refs-dependencies
- missing arm for clack-async-autocomplete-options
- missing arm for claude-code-by-agents-recursive-delegation
- missing arm for cliffy-config-file-parsing
- missing arm for drizzle-orm-window-function-builders
- missing arm for dynamodb-toolbox-conditional-attribute-requirements
- missing arm for dynamodb-toolbox-lazy-recursive-schemas
- missing arm for eicrud-keyset-pagination-cursor
- missing arm for happy-dom-abort-pending-body-reads
- missing arm for happy-dom-deterministic-intersectionobserver
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
- missing arm for quill-shared-toolbar-focus
- missing arm for sql-formatter-bigquery-pipe-formatting
- missing arm for superjson-error-stack-serialization
- missing arm for true-myth-iterable-collection-combinators
- missing arm for vitest-duration-sharding

Agent versions differ across compared arms.

## codex:gpt-5.4-mini:low:stock vs codex:gpt-5.4-mini:low:symnav-overview-refs@8fa615582af5

| metric | left | right |
| --- | ---: | ---: |
| mean f2p | 0.484 | 0.463 |
| solved rate | 0.080 | 0.071 |
| paired tasks | 35 | 35 |
| matched solved tasks | 3 | 3 |
| matched cost_usd_imputed | 0.402 | 0.494 |
| matched tokens | 3042201.200 | 4267178.333 |
| matched steps | 45.400 | 55.000 |

Matched-set efficiency only includes tasks solved by both arms.

Agent versions differ across compared arms.

## codex:gpt-5.4-mini:low:stock vs codex:gpt-5.4-mini:low:symnav-overview@53df2ac6b5dc

| metric | left | right |
| --- | ---: | ---: |
| mean f2p | 0.484 | 0.465 |
| solved rate | 0.080 | 0.333 |
| paired tasks | 6 | 6 |
| matched solved tasks | 2 | 2 |
| matched cost_usd_imputed | 0.452 | 0.382 |
| matched tokens | 3300041.667 | 2693220.500 |
| matched steps | 46.833 | 39.000 |

Matched-set efficiency only includes tasks solved by both arms.

Holes:
- missing arm for arktype-json-schema-refs-dependencies
- missing arm for clack-async-autocomplete-options
- missing arm for claude-code-by-agents-recursive-delegation
- missing arm for cliffy-config-file-parsing
- missing arm for drizzle-orm-window-function-builders
- missing arm for dynamodb-toolbox-conditional-attribute-requirements
- missing arm for dynamodb-toolbox-lazy-recursive-schemas
- missing arm for eicrud-keyset-pagination-cursor
- missing arm for happy-dom-abort-pending-body-reads
- missing arm for happy-dom-deterministic-intersectionobserver
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
- missing arm for quill-shared-toolbar-focus
- missing arm for sql-formatter-bigquery-pipe-formatting
- missing arm for superjson-error-stack-serialization
- missing arm for true-myth-iterable-collection-combinators
- missing arm for vitest-duration-sharding

Agent versions differ across compared arms.

## codex:gpt-5.4-mini:low:stock vs codex:gpt-5.4-mini:low:symnav-refs@53df2ac6b5dc

| metric | left | right |
| --- | ---: | ---: |
| mean f2p | 0.484 | 0.496 |
| solved rate | 0.080 | 0.000 |
| paired tasks | 6 | 6 |
| matched solved tasks | 0 | 0 |
| matched cost_usd_imputed | n/a | n/a |
| matched tokens | n/a | n/a |
| matched steps | n/a | n/a |

Matched-set efficiency only includes tasks solved by both arms.

Holes:
- missing arm for arktype-json-schema-refs-dependencies
- missing arm for clack-async-autocomplete-options
- missing arm for claude-code-by-agents-recursive-delegation
- missing arm for cliffy-config-file-parsing
- missing arm for drizzle-orm-window-function-builders
- missing arm for dynamodb-toolbox-conditional-attribute-requirements
- missing arm for dynamodb-toolbox-lazy-recursive-schemas
- missing arm for eicrud-keyset-pagination-cursor
- missing arm for happy-dom-abort-pending-body-reads
- missing arm for happy-dom-deterministic-intersectionobserver
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
- missing arm for quill-shared-toolbar-focus
- missing arm for sql-formatter-bigquery-pipe-formatting
- missing arm for superjson-error-stack-serialization
- missing arm for true-myth-iterable-collection-combinators
- missing arm for vitest-duration-sharding

Agent versions differ across compared arms.

## codex:gpt-5.4-mini:low:stock vs codex:gpt-5.4-mini:low:symnav-resolve-graph@53df2ac6b5dc

| metric | left | right |
| --- | ---: | ---: |
| mean f2p | 0.484 | 0.353 |
| solved rate | 0.080 | 0.000 |
| paired tasks | 6 | 6 |
| matched solved tasks | 0 | 0 |
| matched cost_usd_imputed | n/a | n/a |
| matched tokens | n/a | n/a |
| matched steps | n/a | n/a |

Matched-set efficiency only includes tasks solved by both arms.

Holes:
- missing arm for arktype-json-schema-refs-dependencies
- missing arm for clack-async-autocomplete-options
- missing arm for claude-code-by-agents-recursive-delegation
- missing arm for cliffy-config-file-parsing
- missing arm for drizzle-orm-window-function-builders
- missing arm for dynamodb-toolbox-conditional-attribute-requirements
- missing arm for dynamodb-toolbox-lazy-recursive-schemas
- missing arm for eicrud-keyset-pagination-cursor
- missing arm for happy-dom-abort-pending-body-reads
- missing arm for happy-dom-deterministic-intersectionobserver
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
- missing arm for quill-shared-toolbar-focus
- missing arm for sql-formatter-bigquery-pipe-formatting
- missing arm for superjson-error-stack-serialization
- missing arm for true-myth-iterable-collection-combinators
- missing arm for vitest-duration-sharding

Agent versions differ across compared arms.

## codex:gpt-5.4-mini:low:stock vs codex:gpt-5.4-mini:low:symnav-resolve-graph@8fa615582af5

| metric | left | right |
| --- | ---: | ---: |
| mean f2p | 0.484 | 0.604 |
| solved rate | 0.080 | 0.157 |
| paired tasks | 35 | 35 |
| matched solved tasks | 5 | 5 |
| matched cost_usd_imputed | 0.396 | 0.431 |
| matched tokens | 3340298.250 | 3672505.833 |
| matched steps | 50.125 | 50.667 |

Matched-set efficiency only includes tasks solved by both arms.

Agent versions differ across compared arms.

## codex:gpt-5.4-mini:low:stock vs codex:gpt-5.4-mini:low:symnav-resolve@53df2ac6b5dc

| metric | left | right |
| --- | ---: | ---: |
| mean f2p | 0.484 | 0.160 |
| solved rate | 0.080 | 0.000 |
| paired tasks | 6 | 6 |
| matched solved tasks | 0 | 0 |
| matched cost_usd_imputed | n/a | n/a |
| matched tokens | n/a | n/a |
| matched steps | n/a | n/a |

Matched-set efficiency only includes tasks solved by both arms.

Holes:
- missing arm for arktype-json-schema-refs-dependencies
- missing arm for clack-async-autocomplete-options
- missing arm for claude-code-by-agents-recursive-delegation
- missing arm for cliffy-config-file-parsing
- missing arm for drizzle-orm-window-function-builders
- missing arm for dynamodb-toolbox-conditional-attribute-requirements
- missing arm for dynamodb-toolbox-lazy-recursive-schemas
- missing arm for eicrud-keyset-pagination-cursor
- missing arm for happy-dom-abort-pending-body-reads
- missing arm for happy-dom-deterministic-intersectionobserver
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
- missing arm for quill-shared-toolbar-focus
- missing arm for sql-formatter-bigquery-pipe-formatting
- missing arm for superjson-error-stack-serialization
- missing arm for true-myth-iterable-collection-combinators
- missing arm for vitest-duration-sharding

Agent versions differ across compared arms.

## codex:gpt-5.4-mini:low:stock vs codex:gpt-5.4-mini:low:symnav@05dda73f3803

| metric | left | right |
| --- | ---: | ---: |
| mean f2p | 0.484 | 0.470 |
| solved rate | 0.080 | 0.049 |
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
| mean f2p | 0.484 | 0.524 |
| solved rate | 0.080 | 0.333 |
| paired tasks | 3 | 3 |
| matched solved tasks | 1 | 1 |
| matched cost_usd_imputed | 0.221 | 0.241 |
| matched tokens | 1522191.750 | 1402094.000 |
| matched steps | 34.500 | 42.000 |

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
| mean f2p | 0.484 | 0.404 |
| solved rate | 0.080 | 0.167 |
| paired tasks | 6 | 6 |
| matched solved tasks | 1 | 1 |
| matched cost_usd_imputed | 0.221 | 0.171 |
| matched tokens | 1522191.750 | 974756.000 |
| matched steps | 34.500 | 30.000 |

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

## codex:gpt-5.4-mini:low:stock vs codex:gpt-5.4-mini:low:symnav@53df2ac6b5dc

| metric | left | right |
| --- | ---: | ---: |
| mean f2p | 0.484 | 0.438 |
| solved rate | 0.080 | 0.125 |
| paired tasks | 6 | 6 |
| matched solved tasks | 1 | 1 |
| matched cost_usd_imputed | 0.510 | 0.545 |
| matched tokens | 3754486.400 | 4222189.000 |
| matched steps | 49.800 | 59.667 |

Matched-set efficiency only includes tasks solved by both arms.

Holes:
- missing arm for arktype-json-schema-refs-dependencies
- missing arm for clack-async-autocomplete-options
- missing arm for claude-code-by-agents-recursive-delegation
- missing arm for cliffy-config-file-parsing
- missing arm for drizzle-orm-window-function-builders
- missing arm for dynamodb-toolbox-conditional-attribute-requirements
- missing arm for dynamodb-toolbox-lazy-recursive-schemas
- missing arm for eicrud-keyset-pagination-cursor
- missing arm for happy-dom-abort-pending-body-reads
- missing arm for happy-dom-deterministic-intersectionobserver
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
- missing arm for quill-shared-toolbar-focus
- missing arm for sql-formatter-bigquery-pipe-formatting
- missing arm for superjson-error-stack-serialization
- missing arm for true-myth-iterable-collection-combinators
- missing arm for vitest-duration-sharding

Agent versions differ across compared arms.

## codex:gpt-5.4-mini:low:stock vs codex:gpt-5.4-mini:low:symnav@5ae32c2a55c0

| metric | left | right |
| --- | ---: | ---: |
| mean f2p | 0.484 | 0.442 |
| solved rate | 0.080 | 0.167 |
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
| mean f2p | 0.484 | 0.579 |
| solved rate | 0.080 | 0.083 |
| paired tasks | 6 | 6 |
| matched solved tasks | 1 | 1 |
| matched cost_usd_imputed | 0.221 | 0.148 |
| matched tokens | 1522191.750 | 695358.000 |
| matched steps | 34.500 | 21.000 |

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

## codex:gpt-5.4-mini:low:stock vs codex:gpt-5.4-mini:low:symnav@8fa615582af5

| metric | left | right |
| --- | ---: | ---: |
| mean f2p | 0.484 | 0.532 |
| solved rate | 0.080 | 0.071 |
| paired tasks | 35 | 35 |
| matched solved tasks | 3 | 3 |
| matched cost_usd_imputed | 0.430 | 0.490 |
| matched tokens | 3288155.200 | 4168891.000 |
| matched steps | 48.000 | 55.000 |

Matched-set efficiency only includes tasks solved by both arms.

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
![paired-f2p-11](charts/paired-f2p-11.png)
![efficiency-11](charts/efficiency-11.png)
![substitution-11](charts/substitution-11.png)
![paired-f2p-12](charts/paired-f2p-12.png)
![efficiency-12](charts/efficiency-12.png)
![substitution-12](charts/substitution-12.png)
![paired-f2p-13](charts/paired-f2p-13.png)
![efficiency-13](charts/efficiency-13.png)
![substitution-13](charts/substitution-13.png)
![paired-f2p-14](charts/paired-f2p-14.png)
![efficiency-14](charts/efficiency-14.png)
![substitution-14](charts/substitution-14.png)
![paired-f2p-15](charts/paired-f2p-15.png)
![efficiency-15](charts/efficiency-15.png)
![substitution-15](charts/substitution-15.png)
![paired-f2p-16](charts/paired-f2p-16.png)
![efficiency-16](charts/efficiency-16.png)
![substitution-16](charts/substitution-16.png)
![paired-f2p-17](charts/paired-f2p-17.png)
![efficiency-17](charts/efficiency-17.png)
![substitution-17](charts/substitution-17.png)
![paired-f2p-18](charts/paired-f2p-18.png)
![efficiency-18](charts/efficiency-18.png)
![substitution-18](charts/substitution-18.png)
![paired-f2p-19](charts/paired-f2p-19.png)
![efficiency-19](charts/efficiency-19.png)
![substitution-19](charts/substitution-19.png)
![paired-f2p-20](charts/paired-f2p-20.png)
![efficiency-20](charts/efficiency-20.png)
![substitution-20](charts/substitution-20.png)
![paired-f2p-21](charts/paired-f2p-21.png)
![efficiency-21](charts/efficiency-21.png)
![substitution-21](charts/substitution-21.png)
![paired-f2p-22](charts/paired-f2p-22.png)
![efficiency-22](charts/efficiency-22.png)
![substitution-22](charts/substitution-22.png)
![paired-f2p-23](charts/paired-f2p-23.png)
![efficiency-23](charts/efficiency-23.png)
![substitution-23](charts/substitution-23.png)
![paired-f2p-24](charts/paired-f2p-24.png)
![efficiency-24](charts/efficiency-24.png)
![substitution-24](charts/substitution-24.png)
![paired-f2p-25](charts/paired-f2p-25.png)
![efficiency-25](charts/efficiency-25.png)
![substitution-25](charts/substitution-25.png)
![paired-f2p-26](charts/paired-f2p-26.png)
![efficiency-26](charts/efficiency-26.png)
![substitution-26](charts/substitution-26.png)
![paired-f2p-27](charts/paired-f2p-27.png)
![efficiency-27](charts/efficiency-27.png)
![substitution-27](charts/substitution-27.png)
![paired-f2p-28](charts/paired-f2p-28.png)
![efficiency-28](charts/efficiency-28.png)
![substitution-28](charts/substitution-28.png)
![progression](charts/progression.png)
