from __future__ import annotations

import hashlib
import json
import unittest
from pathlib import Path


ROOT = Path(__file__).parents[1]
SYMNAV_SHA = "ef9fd76da7f85bccf130af09d2dd9a5a4a8309bb"
SYMNAV_BASE_SHA = "fcf17a14126537dc3c36614ef942de90f4804dbe"
SYMNAV_BENCH_SHA = "a3ff57fb6ab8a9e26067e5fabd710c0c5a9fec84"
IMAGE_REFERENCE = "ghcr.io/mohasarc/symnav-bench:sha-a3ff57f"
IMAGE_DIGEST = "sha256:904a61970a396e47af1cbc2b912807dd54337c898cccaa3dd8164dae5383c6a5"
POLYBENCH_REVISION = "d56445f9940eae4e9d2974ec66820c2f1d7754e6"
MULTI_SWE_REVISION = "56ff018c04a38e27ada1e9d0a6d5839a51f88f0d"
CONFIGURATIONS = [
    {
        "id": "codex-gpt-5.6-terra-medium",
        "agent": "codex",
        "model": "gpt-5.6-terra",
        "effort": "medium",
        "agent_version": "0.144.1",
    }
]


def fingerprint(value: dict) -> str:
    canonical = json.dumps(value, sort_keys=True, separators=(",", ":"))
    return hashlib.sha256(canonical.encode()).hexdigest()


class SmokeStudyContract(unittest.TestCase):
    study_id: str
    benchmark: str
    source_revision: str

    def setUp(self) -> None:
        study = ROOT / "studies" / self.study_id
        self.manifest = json.loads((study / "manifest.yml").read_text(encoding="utf-8"))
        self.suite = json.loads((study / "suite.json").read_text(encoding="utf-8"))
        self.execution = json.loads((study / "execution.json").read_text(encoding="utf-8"))

    def assert_v2_protocol(self) -> None:
        protocol = self.manifest["protocol"]
        benchmark = protocol["benchmark"]
        symnav = protocol["symnav"]

        self.assertEqual(self.manifest["schema_version"], 2)
        self.assertEqual(self.manifest["id"], self.study_id)
        self.assertNotIn("deep_swe_sha", protocol)
        self.assertEqual(benchmark["name"], self.benchmark)
        self.assertEqual(benchmark["source"], {"revision": self.source_revision})
        self.assertEqual(symnav["sha"], SYMNAV_SHA)
        self.assertEqual(symnav["kind"], "pull_request")
        self.assertEqual(symnav["evaluation_sequence"], 8)
        self.assertEqual(symnav["base_ref"], "extraction-v2-e2e-phase-8")
        self.assertEqual(symnav["base_sha"], SYMNAV_BASE_SHA)
        self.assertEqual(symnav["pull_request"], 94)
        self.assertEqual(protocol["repetitions"], 1)
        self.assertEqual(protocol["wall_clock_seconds"], 9000)
        self.assertEqual(protocol["conditions"], ["stock", "symnav"])
        self.assertEqual(self.manifest["protocol_fingerprint"], fingerprint(protocol))
        self.assertEqual(self.manifest["configurations"], CONFIGURATIONS)

    def assert_two_task_suite(self) -> None:
        tasks = self.suite["tasks"]

        self.assertEqual(self.suite["benchmark"], self.benchmark)
        self.assertEqual(self.suite["source_revision"], self.source_revision)
        self.assertEqual(len(tasks), 2)
        self.assertEqual(len({task["slug"] for task in tasks}), 2)
        self.assertEqual({task["language"] for task in tasks}, {"typescript"})
        self.assertTrue(all(len(task["checksum"]) == 64 for task in tasks))
        self.assertEqual(self.suite["fingerprint"], self.suite_fingerprint(tasks))
        repetitions = self.manifest["protocol"]["repetitions"]
        self.assertEqual(len(tasks) * 2 * repetitions, 4)

    def assert_immutable_execution_pin(self) -> None:
        self.assertEqual(
            self.execution,
            {
                "image_reference": IMAGE_REFERENCE,
                "image_digest": IMAGE_DIGEST,
                "symnav_bench_sha": SYMNAV_BENCH_SHA,
            },
        )
        self.assertEqual(
            self.manifest["harness"]["image"],
            f"ghcr.io/mohasarc/symnav-bench@{IMAGE_DIGEST}",
        )

    def suite_fingerprint(self, tasks: list[dict]) -> str:
        return fingerprint(
            {
                "benchmark": self.benchmark,
                "source_revision": self.source_revision,
                "tasks": tasks,
            }
        )


class SwePolybenchSmokeStudyTest(SmokeStudyContract):
    study_id = "swe-polybench-ts-smoke"
    benchmark = "swe-polybench"
    source_revision = POLYBENCH_REVISION

    def test_declares_v2_polybench_protocol(self) -> None:
        self.assert_v2_protocol()
        self.assertEqual(
            self.manifest["protocol"]["benchmark"]["tiers"], ["high", "mid"]
        )

    def test_pins_one_high_and_one_mid_task(self) -> None:
        self.assert_two_task_suite()
        self.assertEqual(
            sorted(task["tier"] for task in self.suite["tasks"]), ["high", "mid"]
        )

    def test_pins_immutable_harness_image(self) -> None:
        self.assert_immutable_execution_pin()


class MultiSweBenchSmokeStudyTest(SmokeStudyContract):
    study_id = "multi-swe-bench-ts-smoke"
    benchmark = "multi-swe-bench"
    source_revision = MULTI_SWE_REVISION

    def test_declares_v2_multi_swe_protocol(self) -> None:
        self.assert_v2_protocol()
        self.assertNotIn("tiers", self.manifest["protocol"]["benchmark"])

    def test_pins_two_tasks_from_two_repos(self) -> None:
        self.assert_two_task_suite()
        tasks = self.suite["tasks"]
        self.assertTrue(all("tier" not in task for task in tasks))
        repos = {task["slug"].rsplit("-", 1)[0] for task in tasks}
        self.assertEqual(len(repos), 2)

    def test_pins_immutable_harness_image(self) -> None:
        self.assert_immutable_execution_pin()


if __name__ == "__main__":
    unittest.main()
