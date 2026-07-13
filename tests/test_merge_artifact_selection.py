from __future__ import annotations

import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path


ROOT = Path(__file__).parents[1]
SELECTOR = ROOT / "scripts" / "select-merge-artifacts.py"


class MergeArtifactSelectionTest(unittest.TestCase):
    def test_skips_rerun_evidence_when_only_archive_pointer_differs(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            source = self.write_attempt(root / "artifacts" / "artifact-a")
            target = root / "study" / "attempts" / "slot-a" / "attempt-a.json"
            target.parent.mkdir(parents=True)
            data = json.loads(source.read_text(encoding="utf-8"))
            data["artifact"] = {"archive": "batch.tar.gz"}
            target.write_text(json.dumps(data), encoding="utf-8")

            result = self.select(root / "study", root / "artifacts")

            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertEqual(result.stdout, "")

    def test_selects_new_attempt_evidence(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            self.write_attempt(root / "artifacts" / "artifact-a")

            result = self.select(root / "study", root / "artifacts")

            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertEqual(result.stdout.strip(), str(root / "artifacts" / "artifact-a"))

    def test_selects_one_copy_of_a_repeated_artifact_attempt(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            self.write_attempt(root / "artifacts" / "artifact-a")
            self.write_attempt(root / "artifacts" / "artifact-a-rerun")

            result = self.select(root / "study", root / "artifacts")

            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertEqual(result.stdout.strip(), str(root / "artifacts" / "artifact-a"))

    def test_rejects_conflicting_existing_attempt(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            source = self.write_attempt(root / "artifacts" / "artifact-a")
            target = root / "study" / "attempts" / "slot-a" / "attempt-a.json"
            target.parent.mkdir(parents=True)
            data = json.loads(source.read_text(encoding="utf-8"))
            data["rewards"] = {"reward": 0}
            target.write_text(json.dumps(data), encoding="utf-8")

            result = self.select(root / "study", root / "artifacts")

            self.assertNotEqual(result.returncode, 0)
            self.assertIn("different immutable content", result.stderr)

    def select(self, study_dir: Path, artifacts: Path) -> subprocess.CompletedProcess[str]:
        return subprocess.run(
            [sys.executable, str(SELECTOR), "--study-dir", str(study_dir), "--artifacts", str(artifacts)],
            text=True,
            capture_output=True,
            check=False,
        )

    @staticmethod
    def write_attempt(artifact_dir: Path) -> Path:
        path = artifact_dir / "attempt.json"
        path.parent.mkdir(parents=True)
        path.write_text(
            json.dumps(
                {
                    "identity": {"slot_id": "slot-a", "attempt_id": "attempt-a"},
                    "rewards": {"reward": 1},
                }
            ),
            encoding="utf-8",
        )
        return path


if __name__ == "__main__":
    unittest.main()
