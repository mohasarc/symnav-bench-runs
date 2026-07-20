from __future__ import annotations

import json
import re
import unittest
from pathlib import Path


ROOT = Path(__file__).parents[1]
WORKFLOWS = ROOT / ".github" / "workflows"


class WorkflowContractTest(unittest.TestCase):
    def workflow(self, name: str) -> str:
        return (WORKFLOWS / name).read_text(encoding="utf-8")

    def test_coordinator_only_accepts_study_configuration_and_mode(self) -> None:
        workflow = self.workflow("study.yml")
        self.assertIn("study:", workflow)
        self.assertIn("configuration:", workflow)
        self.assertIn("mode:", workflow)
        for forbidden in ("tasks:", "conditions:", "agents:", "model:", "symnav_ref:"):
            self.assertNotIn(forbidden, workflow)

    def test_coordinator_dispatches_selected_batches(self) -> None:
        workflow = self.workflow("study.yml")
        self.assertIn("name: study dispatcher", workflow)
        self.assertIn("This run finishes after dispatch", workflow)
        self.assertIn("batch-matrix", workflow)
        self.assertIn("slot_ids", workflow)
        self.assertIn("bench-batch.yml", workflow)
        self.assertIn('--ref "$GITHUB_REF_NAME"', workflow)
        self.assertNotIn('--ref "$GITHUB_SHA"', workflow)
        self.assertIn("run-next", workflow)
        self.assertIn("run-all", workflow)
        self.assertIn("resume", workflow)
        self.assertIn('study="$STUDY"', workflow)
        self.assertIn('configuration="$CONFIGURATION"', workflow)

    def test_child_matrix_is_bounded_and_pinned(self) -> None:
        workflow = self.workflow("bench-batch.yml")
        self.assertIn("256", workflow)
        self.assertIn("image_digest", workflow)
        self.assertIn("agent_version", workflow)
        self.assertIn("source_revision", workflow)
        self.assertIn("symnav_sha", workflow)
        self.assertIn("protocol_fingerprint", workflow)
        self.assertIn("suite_fingerprint", workflow)
        self.assertIn("requested_slot_ids", workflow)
        self.assertIn("slot_ids must be unique strings", workflow)

    def test_setup_reads_metadata_via_study_metadata_command(self) -> None:
        workflow = self.workflow("bench-batch.yml")
        self.assertIn("study-metadata", workflow)
        self.assertNotIn("--entrypoint python", workflow)
        self.assertNotIn('manifest["protocol"]', workflow)
        self.assertNotIn("deep_swe_sha", workflow)

    def test_cell_passes_source_revision_and_no_benchmark_flags(self) -> None:
        workflow = self.workflow("bench-batch.yml")
        self.assertIn("--deep-swe-ref '${{ needs.setup.outputs.source_revision }}'", workflow)
        self.assertIn('-v "$PWD/studies/${{ inputs.study }}:/study:ro"', workflow)
        self.assertIn('-v "$PWD/symnav-product:/symnav-product:ro"', workflow)
        self.assertIn("SYMNAV_BENCH_STUDY_MANIFEST='/study/manifest.yml'", workflow)
        self.assertIn("SYMNAV_BENCH_SUITE_MANIFEST='/study/suite.json'", workflow)
        self.assertIn("SYMNAV_BENCH_SYMNAV_CHECKOUT='/symnav-product'", workflow)
        secrets = set(re.findall(r"secrets\.([A-Za-z0-9_]+)", workflow))
        self.assertEqual(
            secrets,
            {"CLAUDE_CODE_OAUTH_TOKEN", "ANTHROPIC_API_KEY", "CODEX_AUTH_JSON_B64"},
        )

    def test_dispatch_and_report_workflows_are_benchmark_agnostic(self) -> None:
        for name in ("study.yml", "recover-report.yml", "pages.yml"):
            workflow = self.workflow(name)
            for literal in ("deepswe", "deep_swe", "deep-swe", "polybench", "multi-swe"):
                self.assertNotIn(literal, workflow, f"{name} hardcodes {literal}")

    def test_retryable_cell_is_red_but_evidence_and_report_always_run(self) -> None:
        workflow = self.workflow("bench-batch.yml")
        self.assertIn("if: always()", workflow)
        self.assertIn("actions/upload-artifact@v4", workflow)
        self.assertIn("if-no-files-found: error", workflow)
        self.assertIn("needs: [setup, cell]", workflow)

    def test_publication_is_serial_and_release_assets_are_immutable(self) -> None:
        workflow = self.workflow("bench-batch.yml")
        self.assertIn("cancel-in-progress: false", workflow)
        self.assertIn("git fetch origin results", workflow)
        self.assertIn("validate-batch-evidence.py", workflow)
        self.assertIn("select-merge-artifacts.py", workflow)
        self.assertIn("merge-results", workflow)
        self.assertIn('sudo chown -R "$(id -u):$(id -g)" "$study_dir"', workflow)
        self.assertIn("raw-archive", workflow)
        self.assertIn("gh release view", workflow)
        self.assertNotIn("--clobber", workflow)
        self.assertLess(workflow.index("validate-batch-evidence.py"), workflow.index("merge-results"))
        self.assertLess(workflow.index("merge-results"), workflow.index("raw-archive"))
        self.assertLess(workflow.index("raw-archive"), workflow.index("study-report"))
        self.assertLess(workflow.index("study-report"), workflow.index("Commit normalized results"))

    def test_pages_deploys_stable_study_tree(self) -> None:
        workflow = self.workflow("pages.yml")
        batch_workflow = self.workflow("bench-batch.yml")
        self.assertIn("actions/upload-pages-artifact", workflow)
        self.assertIn("actions/deploy-pages", workflow)
        self.assertIn("studies", workflow)
        self.assertIn('pathlib.Path("_site/studies.json")', workflow)
        self.assertIn("actions: write", batch_workflow)
        self.assertIn("gh workflow run pages.yml", batch_workflow)
        self.assertIn("results_sha", batch_workflow)
        self.assertLess(batch_workflow.index("git push origin results"), batch_workflow.index("gh workflow run pages.yml"))
        self.assertIn("ref: results", workflow)
        self.assertIn("Check out requested results revision", workflow)
        self.assertIn('git checkout --detach "${{ inputs.results_sha }}"', workflow)

    def test_pages_includes_provisional_dashboards_even_without_attempts(self) -> None:
        workflow = self.workflow("pages.yml")
        self.assertNotIn('if not payload.get("attempts"):', workflow)
        self.assertIn('provisional = not configurations', workflow)
        self.assertIn('status = "provisional"', workflow)

    def test_report_recovery_reuses_existing_artifacts_without_cells(self) -> None:
        workflow = self.workflow("recover-report.yml")
        self.assertIn("source_run_id", workflow)
        self.assertIn("run-id: ${{ inputs.source_run_id }}", workflow)
        self.assertIn("validate-batch-evidence.py", workflow)
        self.assertIn("select-merge-artifacts.py", workflow)
        self.assertIn("study-report", workflow)
        self.assertNotIn("Run declared slot", workflow)

    def test_fixture_suite_never_exceeds_github_matrix_limit(self) -> None:
        suite = json.loads((ROOT / "tests/fixtures/studies/dry-run/suite.json").read_text())
        self.assertLessEqual(len(suite["tasks"]) * 2 * 4, 256)


class ReadmeDeclarationTest(unittest.TestCase):
    def readme(self) -> str:
        return (ROOT / "README.md").read_text(encoding="utf-8")

    def test_declaration_procedure_is_documented_in_order(self) -> None:
        readme = self.readme()
        self.assertIn("publish.yml", readme)
        self.assertIn("resolve-suite", readme)
        self.assertIn("execution.json", readme)
        self.assertIn("image_digest", readme)
        self.assertIn("manifest.yml", readme)
        self.assertIn("suite.json", readme)
        self.assertLess(readme.index("publish.yml"), readme.index("image_digest"))
        self.assertLess(readme.index("image_digest"), readme.index("resolve-suite"))

    def test_study_ids_follow_benchmark_first_naming(self) -> None:
        readme = self.readme()
        self.assertIn("swe-polybench-ts-himid-codex-terra-medium-pr94", readme)
        self.assertIn("swe-polybench-ts-all-", readme)
        self.assertIn("multi-swe-bench-ts-", readme)


if __name__ == "__main__":
    unittest.main()
