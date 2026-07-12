from __future__ import annotations

import hashlib
import json
import subprocess
import unittest
from pathlib import Path
from tempfile import TemporaryDirectory


ROOT = Path(__file__).parents[1]


class LegacyMigrationTest(unittest.TestCase):
    def test_imports_global_cells_once_without_changing_bytes(self) -> None:
        with TemporaryDirectory() as directory:
            results = Path(directory)
            cell = results / "cells/cell-a/cell.json"
            cell.parent.mkdir(parents=True)
            cell.write_bytes(b'{"solved":true}\n')
            checksum = hashlib.sha256(cell.read_bytes()).hexdigest()

            command = ["bash", str(ROOT / "scripts/migrate-legacy-results.sh"), str(results)]
            subprocess.run(command, check=True)
            subprocess.run(command, check=True)

            migrated = results / "legacy/cells/cell-a/cell.json"
            self.assertEqual(hashlib.sha256(migrated.read_bytes()).hexdigest(), checksum)
            manifest = json.loads((results / "legacy/manifest.json").read_text())
            self.assertEqual(manifest["files"]["cells/cell-a/cell.json"], checksum)
            self.assertFalse((results / "cells").exists())


if __name__ == "__main__":
    unittest.main()
