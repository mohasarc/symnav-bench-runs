from __future__ import annotations

import unittest

from test_smoke_studies import (
    MULTI_SWE_REVISION,
    POLYBENCH_REVISION,
    SmokeStudyContract,
)


FULL_SYMNAV_BENCH_SHA = "5f5d1f815201aade7682695f4b7aa14557131e96"
FULL_IMAGE_REFERENCE = "ghcr.io/mohasarc/symnav-bench:sha-5f5d1f8"
FULL_IMAGE_DIGEST = (
    "sha256:d71e8eb4a166d843ba40a5ffa8dd9475b7090724fe7a7586a0f5fcf9acd34283"
)


class FullStudyContract(SmokeStudyContract):
    expected_task_count: int

    def assert_immutable_execution_pin(self) -> None:
        self.assertEqual(
            self.execution,
            {
                "image_reference": FULL_IMAGE_REFERENCE,
                "image_digest": FULL_IMAGE_DIGEST,
                "symnav_bench_sha": FULL_SYMNAV_BENCH_SHA,
            },
        )
        self.assertEqual(
            self.manifest["harness"]["image"],
            f"ghcr.io/mohasarc/symnav-bench@{FULL_IMAGE_DIGEST}",
        )

    def assert_full_suite(self) -> None:
        tasks = self.suite["tasks"]

        self.assertEqual(self.suite["benchmark"], self.benchmark)
        self.assertEqual(self.suite["source_revision"], self.source_revision)
        self.assertEqual(len(tasks), self.expected_task_count)
        self.assertEqual(len({task["slug"] for task in tasks}), len(tasks))
        self.assertEqual({task["language"] for task in tasks}, {"typescript"})
        self.assertTrue(all(len(task["checksum"]) == 64 for task in tasks))
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


R2_SYMNAV_BENCH_SHA = "c671e8e5b8f89cb5f78e9c16ff3077cb3b35d917"
R2_IMAGE_REFERENCE = "ghcr.io/mohasarc/symnav-bench:sha-c671e8e"
R2_IMAGE_DIGEST = (
    "sha256:1eab4b1b65035dc34bd26864abd32bb2ef42b4edd3157c483d96688762da5864"
)


class SwePolybenchR2StudyTest(SwePolybenchFullStudyTest):
    study_id = "swe-polybench-ts-himid-codex-terra-medium-pr94-r2"

    def assert_immutable_execution_pin(self) -> None:
        self.assertEqual(
            self.execution,
            {
                "image_reference": R2_IMAGE_REFERENCE,
                "image_digest": R2_IMAGE_DIGEST,
                "symnav_bench_sha": R2_SYMNAV_BENCH_SHA,
            },
        )
        self.assertEqual(
            self.manifest["harness"]["image"],
            f"ghcr.io/mohasarc/symnav-bench@{R2_IMAGE_DIGEST}",
        )

    def test_r2_suite_checksums_differ_from_the_invalidated_run(self) -> None:
        import json
        from pathlib import Path

        first = json.loads(
            Path("studies/swe-polybench-ts-himid-codex-terra-medium-pr94/suite.json")
            .read_text(encoding="utf-8")
        )
        first_checksums = {t["slug"]: t["checksum"] for t in first["tasks"]}
        for task in self.suite["tasks"]:
            self.assertNotEqual(task["checksum"], first_checksums[task["slug"]])
