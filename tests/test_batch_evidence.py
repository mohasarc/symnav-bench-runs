from __future__ import annotations

import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path


ROOT = Path(__file__).parents[1]
VALIDATOR = ROOT / "scripts" / "validate-batch-evidence.py"


class BatchEvidenceTest(unittest.TestCase):
    def test_accepts_exactly_one_matching_attempt_per_planned_slot(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            batch = self.write_batch(root, ("slot-a", "slot-b"))
            self.write_attempt(root, "artifact-a", "slot-a")
            self.write_attempt(root, "artifact-b", "slot-b")

            result = self.validate(batch, root / "artifacts")

            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertIn("validated 2 attempt records for 2 planned slots", result.stdout)

    def test_rejects_missing_attempt_evidence(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            batch = self.write_batch(root, ("slot-a", "slot-b"))
            self.write_attempt(root, "artifact-a", "slot-a")

            result = self.validate(batch, root / "artifacts")

            self.assertNotEqual(result.returncode, 0)
            self.assertIn("missing slots: slot-b", result.stderr)

    def test_accepts_partial_evidence_when_publication_allows_missing_slots(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            batch = self.write_batch(root, ("slot-a", "slot-b"))
            self.write_attempt(root, "artifact-a", "slot-a")

            result = self.validate(batch, root / "artifacts", "--allow-missing")

            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertIn("validated 1 attempt records for 2 planned slots", result.stdout)

    def test_accepts_repeated_attempt_evidence_for_a_rerun_slot(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            batch = self.write_batch(root, ("slot-a",))
            self.write_attempt(root, "artifact-a", "slot-a")
            self.write_attempt(root, "artifact-a-copy", "slot-a")

            result = self.validate(batch, root / "artifacts")

            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertIn("validated 2 attempt records for 1 planned slots", result.stdout)

    def test_rejects_unplanned_slot_evidence(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            batch = self.write_batch(root, ("slot-a",))
            self.write_attempt(root, "artifact-a", "slot-a")
            self.write_attempt(root, "artifact-wrong", "slot-wrong")

            result = self.validate(batch, root / "artifacts")

            self.assertNotEqual(result.returncode, 0)
            self.assertIn("unexpected slots: slot-wrong", result.stderr)

    def test_rejects_attempt_metadata_that_disagrees_with_matrix(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            batch = self.write_batch(root, ("slot-a",))
            attempt = self.attempt("slot-a")
            attempt["slot"]["task"] = "wrong-task"
            self.write_attempt(root, "artifact-a", "slot-a", attempt)

            result = self.validate(batch, root / "artifacts")

            self.assertNotEqual(result.returncode, 0)
            self.assertIn("metadata mismatch", result.stderr)
            self.assertIn("task expected task-slot-a, got wrong-task", result.stderr)

    def validate(self, batch: Path, artifacts: Path, *extra_arguments: str) -> subprocess.CompletedProcess[str]:
        return subprocess.run(
            [
                sys.executable,
                str(VALIDATOR),
                "--batch",
                str(batch),
                "--artifacts",
                str(artifacts),
                *extra_arguments,
            ],
            text=True,
            capture_output=True,
            check=False,
        )

    def write_batch(self, root: Path, slot_ids: tuple[str, ...]) -> Path:
        batch = root / "batch.json"
        batch.write_text(
            json.dumps(
                {
                    "batch_id": "batch-001",
                    "matrix": {
                        "include": [self.matrix_slot(slot_id) for slot_id in slot_ids],
                    },
                }
            ),
            encoding="utf-8",
        )
        return batch

    def write_attempt(
        self,
        root: Path,
        artifact: str,
        slot_id: str,
        attempt: dict | None = None,
    ) -> None:
        path = root / "artifacts" / artifact / slot_id / "attempts" / "attempt-id" / "attempt.json"
        path.parent.mkdir(parents=True)
        path.write_text(json.dumps(attempt or self.attempt(slot_id)), encoding="utf-8")

    @staticmethod
    def matrix_slot(slot_id: str) -> dict:
        return {
            "study_id": "study",
            "configuration_id": "configuration",
            "batch_id": "batch-001",
            "slot_id": slot_id,
            "condition": "stock",
            "task": f"task-{slot_id}",
            "repetition": 1,
        }

    @classmethod
    def attempt(cls, slot_id: str) -> dict:
        matrix = cls.matrix_slot(slot_id)
        return {
            "identity": {"slot_id": slot_id, "attempt_id": "attempt-id"},
            "slot": {
                key: matrix[key]
                for key in (
                    "study_id",
                    "configuration_id",
                    "slot_id",
                    "condition",
                    "task",
                    "repetition",
                )
            },
            "batch_id": matrix["batch_id"],
        }


if __name__ == "__main__":
    unittest.main()
