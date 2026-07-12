from __future__ import annotations

import json
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
        self.assertIn("batch-matrix", workflow)
        self.assertIn("bench-batch.yml", workflow)
        self.assertIn("run-next", workflow)
        self.assertIn("run-all", workflow)
        self.assertIn("resume", workflow)

    def test_child_matrix_is_bounded_and_pinned(self) -> None:
        workflow = self.workflow("bench-batch.yml")
        self.assertIn("256", workflow)
        self.assertIn("image_digest", workflow)
        self.assertIn("agent_version", workflow)
        self.assertIn("deep_swe_sha", workflow)
        self.assertIn("symnav_sha", workflow)
        self.assertIn("protocol_fingerprint", workflow)
        self.assertIn("suite_fingerprint", workflow)

    def test_retryable_cell_is_red_but_evidence_and_report_always_run(self) -> None:
        workflow = self.workflow("bench-batch.yml")
        self.assertIn("if: always()", workflow)
        self.assertIn("actions/upload-artifact@v4", workflow)
        self.assertIn("needs: [setup, cell]", workflow)

    def test_publication_is_serial_and_release_assets_are_immutable(self) -> None:
        workflow = self.workflow("bench-batch.yml")
        self.assertIn("cancel-in-progress: false", workflow)
        self.assertIn("git fetch origin results", workflow)
        self.assertIn("merge-results", workflow)
        self.assertIn("raw-archive", workflow)
        self.assertIn("gh release view", workflow)
        self.assertNotIn("--clobber", workflow)

    def test_pages_deploys_stable_study_tree(self) -> None:
        workflow = self.workflow("pages.yml")
        self.assertIn("actions/upload-pages-artifact", workflow)
        self.assertIn("actions/deploy-pages", workflow)
        self.assertIn("studies", workflow)

    def test_fixture_suite_never_exceeds_github_matrix_limit(self) -> None:
        suite = json.loads((ROOT / "tests/fixtures/studies/dry-run/suite.json").read_text())
        self.assertLessEqual(len(suite["tasks"]) * 2 * 4, 256)


if __name__ == "__main__":
    unittest.main()
