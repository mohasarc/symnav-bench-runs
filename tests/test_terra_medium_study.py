from __future__ import annotations

import hashlib
import json
import unittest
from pathlib import Path


ROOT = Path(__file__).parents[1]
STUDY_ID = "deepswe-ts-codex-terra-medium-pr94"
STUDY = ROOT / "studies" / STUDY_ID
SYMNAV_SHA = "80aa4bfa421a7960945005d637ffa5c74665a3ab"
SYMNAV_BASE_SHA = "fcf17a14126537dc3c36614ef942de90f4804dbe"
DEEP_SWE_SHA = "6db64a40f3318d8659238ff34a8cc4b491c49205"
SYMNAV_BENCH_SHA = "70ebb24ef55dbf5edecc173d853e5dadc588ce65"
IMAGE_DIGEST = "sha256:f558044ad693d82b06e0b5598e56f6a2bb1af4b9c22089e8e7b30c8f813e864f"


class TerraMediumStudyTest(unittest.TestCase):
    def setUp(self) -> None:
        self.manifest = json.loads((STUDY / "manifest.yml").read_text(encoding="utf-8"))
        self.suite = json.loads((STUDY / "suite.json").read_text(encoding="utf-8"))
        self.execution = json.loads((STUDY / "execution.json").read_text(encoding="utf-8"))

    def test_pins_pr_revision_and_protocol(self) -> None:
        protocol = self.manifest["protocol"]
        symnav = protocol["symnav"]

        self.assertEqual(self.manifest["schema_version"], 1)
        self.assertEqual(self.manifest["id"], STUDY_ID)
        self.assertEqual(protocol["deep_swe_sha"], DEEP_SWE_SHA)
        self.assertEqual(symnav["sha"], SYMNAV_SHA)
        self.assertEqual(symnav["kind"], "pull_request")
        self.assertEqual(symnav["evaluation_sequence"], 1)
        self.assertEqual(symnav["base_ref"], "extraction-v2-e2e-phase-8")
        self.assertEqual(symnav["base_sha"], SYMNAV_BASE_SHA)
        self.assertEqual(symnav["pull_request"], 94)
        self.assertEqual(protocol["repetitions"], 4)
        self.assertEqual(protocol["wall_clock_seconds"], 9000)
        self.assertEqual(protocol["conditions"], ["stock", "symnav"])
        self.assertEqual(protocol["practical_uplift_points"], 5)
        self.assertEqual(
            self.manifest["protocol_fingerprint"],
            self.fingerprint(protocol),
        )

    def test_pins_one_codex_terra_medium_configuration(self) -> None:
        self.assertEqual(
            self.manifest["configurations"],
            [
                {
                    "id": "codex-gpt-5.6-terra-medium",
                    "agent": "codex",
                    "model": "gpt-5.6-terra",
                    "effort": "medium",
                    "agent_version": "0.144.1",
                }
            ],
        )

    def test_pins_35_typescript_tasks_and_280_slots(self) -> None:
        tasks = self.suite["tasks"]

        self.assertEqual(self.suite["deep_swe_sha"], DEEP_SWE_SHA)
        self.assertEqual(len(tasks), 35)
        self.assertEqual({task["language"] for task in tasks}, {"typescript"})
        self.assertEqual(len({task["slug"] for task in tasks}), 35)
        self.assertTrue(all(len(task["checksum"]) == 64 for task in tasks))
        self.assertEqual(self.suite["fingerprint"], self.suite_fingerprint(tasks))
        self.assertEqual(len(tasks) * 2 * self.manifest["protocol"]["repetitions"], 280)

    def test_pins_immutable_harness_image(self) -> None:
        self.assertEqual(
            self.execution,
            {
                "image_reference": "ghcr.io/mohasarc/symnav-bench:sha-70ebb24",
                "image_digest": IMAGE_DIGEST,
                "symnav_bench_sha": SYMNAV_BENCH_SHA,
            },
        )

    @staticmethod
    def fingerprint(value: dict) -> str:
        canonical = json.dumps(value, sort_keys=True, separators=(",", ":"))
        return hashlib.sha256(canonical.encode()).hexdigest()

    @staticmethod
    def suite_fingerprint(tasks: list[dict]) -> str:
        return TerraMediumStudyTest.fingerprint(
            {"deep_swe_sha": DEEP_SWE_SHA, "tasks": tasks}
        )


if __name__ == "__main__":
    unittest.main()
