from __future__ import annotations

import unittest

from test_smoke_studies import (
    MULTI_SWE_REVISION,
    POLYBENCH_REVISION,
    SmokeStudyContract,
)


class FullStudyContract(SmokeStudyContract):
    expected_task_count: int

    def assert_full_suite(self) -> None:
        tasks = self.suite["tasks"]

        self.assertEqual(self.suite["benchmark"], self.benchmark)
        self.assertEqual(self.suite["source_revision"], self.source_revision)
        self.assertEqual(len(tasks), self.expected_task_count)
        self.assertEqual(len({task["slug"] for task in tasks}), len(tasks))
        self.assertEqual({task["language"] for task in tasks}, {"typescript"})
        self.assertEqual(self.suite["fingerprint"], self.suite_fingerprint(tasks))


class SwePolybenchFullStudyTest(FullStudyContract):
    study_id = "swe-polybench-ts-himid-codex-terra-medium-pr94"
    benchmark = "swe-polybench"
    source_revision = POLYBENCH_REVISION
    expected_task_count = 75

    def test_declares_v2_polybench_protocol(self) -> None:
        self.assert_v2_protocol()
        self.assertEqual(
            self.manifest["protocol"]["benchmark"]["tiers"], ["high", "mid"]
        )

    def test_pins_all_himid_tasks(self) -> None:
        self.assert_full_suite()
        tiers = {task["tier"] for task in self.suite["tasks"]}
        self.assertEqual(tiers, {"high", "mid"})

    def test_pins_immutable_harness_image(self) -> None:
        self.assert_immutable_execution_pin()


class MultiSweBenchFullStudyTest(FullStudyContract):
    study_id = "multi-swe-bench-ts-codex-terra-medium-pr94"
    benchmark = "multi-swe-bench"
    source_revision = MULTI_SWE_REVISION
    expected_task_count = 201

    def test_declares_v2_multi_swe_protocol(self) -> None:
        self.assert_v2_protocol()
        self.assertNotIn("tiers", self.manifest["protocol"]["benchmark"])

    def test_pins_the_whole_typescript_set(self) -> None:
        self.assert_full_suite()
        tasks = self.suite["tasks"]
        self.assertTrue(all("tier" not in task for task in tasks))
        repos = {task["slug"].split("__")[0] for task in tasks}
        self.assertEqual(repos, {"darkreader", "mui", "vuejs"})

    def test_pins_immutable_harness_image(self) -> None:
        self.assert_immutable_execution_pin()


if __name__ == "__main__":
    unittest.main()
