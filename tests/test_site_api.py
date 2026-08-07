from __future__ import annotations

import json
import sys
import unittest
from pathlib import Path
from tempfile import TemporaryDirectory

sys.path.insert(0, str(Path(__file__).parents[1] / "scripts"))

from build_site import build_site  # noqa: E402


SYMNAV_SHA = "ef9fd76da7f85bccf130af09d2dd9a5a4a8309bb"
OLDER_SHA = "80aa4bfa421a7960945005d637ffa5c74665a3ab"

CATALOG = {
    "symnav_versions": [
        {"version": "0.1.0", "sha": OLDER_SHA, "summary": "first"},
        {"version": "0.2.0", "sha": SYMNAV_SHA, "summary": "second"},
    ],
    "studies": {"broken": {"validity": "invalidated", "note": "patches never applied"}},
}


def analysis_payload(
    *,
    study_id: str,
    benchmark: str,
    symnav_sha: str,
    model: str,
    stock_score: float,
    symnav_score: float,
) -> dict:
    return {
        "schema_version": 1,
        "study": {
            "id": study_id,
            "benchmark": benchmark,
            "benchmark_source_revision": "d56445f",
            "repetitions": 1,
            "conditions": ["stock", "symnav"],
            "symnav_revision": {
                "sha": symnav_sha,
                "kind": "pull_request",
                "evaluation_sequence": 8,
                "pull_request": 94,
                "base_ref": "branch",
                "base_sha": "f" * 40,
            },
        },
        "coverage": {
            "planned_slots": 150,
            "scored_slots": 147,
            "complete_tasks": 73,
            "total_tasks": 75,
            "provisional": True,
            "pilot": True,
        },
        "configurations": [
            {
                "id": "cfg",
                "agent": "codex",
                "model": model,
                "effort": "medium",
                "agent_version": "0.144.1",
                "condition": condition,
                "full_symnav": condition == "symnav",
                "coverage": {"scored_slots": 74, "planned_slots": 75},
                "metrics": {"performance_score": score, "cost": 29.0},
                "adoption": {"used_symnav_rate": 0.92},
            }
            for condition, score in (("stock", stock_score), ("symnav", symnav_score))
        ],
        "comparisons": [
            {
                "condition": "symnav",
                "primary": True,
                "uplift": {"value": 0.095, "lower_95": -0.01, "upper_95": 0.2},
                "randomization_p_value": 0.08,
                "wins": 10,
                "ties": 53,
                "losses": 3,
                "demonstrated_improvement": False,
                "material_improvement": False,
            }
        ],
        "tasks": [],
        "attempts": [],
        "versions": [],
        "official_references": [],
        "warnings": [],
    }


def write_study(root: Path, study_id: str, payload: dict) -> None:
    dashboard = root / "studies" / study_id / "dashboard"
    dashboard.mkdir(parents=True)
    (dashboard / "analysis.json").write_text(json.dumps(payload), encoding="utf-8")
    (dashboard / "index.html").write_text("<html></html>", encoding="utf-8")
    data = root / "studies" / study_id / "data"
    data.mkdir(parents=True)
    (data / "study.json").write_text(json.dumps(payload), encoding="utf-8")


class SiteApiTest(unittest.TestCase):
    def setUp(self) -> None:
        self.temporary = TemporaryDirectory()
        self.root = Path(self.temporary.name) / "results"
        self.site = Path(self.temporary.name) / "_site"
        self.assets = Path(self.temporary.name) / "site"
        self.assets.mkdir(parents=True)
        (self.assets / "index.html").write_text("<html>app</html>", encoding="utf-8")
        (self.assets / "explorer.js").write_text("export {}\n", encoding="utf-8")
        self.root.mkdir(parents=True)
        (self.root / "catalog.json").write_text(json.dumps(CATALOG), encoding="utf-8")
        write_study(
            self.root,
            "polybench-r3",
            analysis_payload(
                study_id="polybench-r3",
                benchmark="swe-polybench",
                symnav_sha=SYMNAV_SHA,
                model="gpt-5.6-terra",
                stock_score=0.353,
                symnav_score=0.448,
            ),
        )
        write_study(
            self.root,
            "broken",
            analysis_payload(
                study_id="broken",
                benchmark="swe-polybench",
                symnav_sha=OLDER_SHA,
                model="gpt-5.6-terra",
                stock_score=0.0,
                symnav_score=0.0,
            ),
        )

    def tearDown(self) -> None:
        self.temporary.cleanup()

    def build(self) -> dict:
        build_site(self.root, self.site, self.assets)
        return json.loads((self.site / "api" / "index.json").read_text(encoding="utf-8"))

    def test_index_lists_every_study_with_facets(self) -> None:
        index = self.build()

        studies = {study["id"]: study for study in index["studies"]}
        self.assertEqual(set(studies), {"polybench-r3", "broken"})
        self.assertEqual(studies["polybench-r3"]["benchmark"], "swe-polybench")
        self.assertEqual(studies["polybench-r3"]["models"], ["gpt-5.6-terra"])
        self.assertEqual(studies["polybench-r3"]["repetitions"], 1)

    def test_symnav_sha_resolves_to_a_semantic_version(self) -> None:
        index = self.build()

        studies = {study["id"]: study for study in index["studies"]}
        self.assertEqual(studies["polybench-r3"]["symnav"]["version"], "0.2.0")
        self.assertEqual(studies["broken"]["symnav"]["version"], "0.1.0")
        self.assertEqual(
            [item["version"] for item in index["symnav_versions"]], ["0.1.0", "0.2.0"]
        )

    def test_unregistered_sha_reports_no_version_rather_than_guessing(self) -> None:
        write_study(
            self.root,
            "unregistered",
            analysis_payload(
                study_id="unregistered",
                benchmark="deepswe",
                symnav_sha="c" * 40,
                model="claude-opus-4-8",
                stock_score=0.3,
                symnav_score=0.3,
            ),
        )

        index = self.build()

        studies = {study["id"]: study for study in index["studies"]}
        self.assertIsNone(studies["unregistered"]["symnav"]["version"])

    def test_catalog_validity_lands_on_the_study_row(self) -> None:
        index = self.build()

        studies = {study["id"]: study for study in index["studies"]}
        self.assertEqual(studies["broken"]["validity"], "invalidated")
        self.assertEqual(studies["polybench-r3"]["validity"], "valid")
        self.assertIn("never applied", studies["broken"]["note"])

    def test_arm_scores_and_uplift_are_summarized_per_configuration(self) -> None:
        index = self.build()

        study = next(item for item in index["studies"] if item["id"] == "polybench-r3")
        arms = {arm["condition"]: arm for arm in study["arms"]}
        self.assertAlmostEqual(arms["stock"]["performance_score"], 0.353)
        self.assertAlmostEqual(arms["symnav"]["performance_score"], 0.448)
        self.assertAlmostEqual(arms["symnav"]["adoption_rate"], 0.92)
        comparison = study["comparisons"][0]
        self.assertAlmostEqual(comparison["uplift"], 0.095)
        self.assertEqual(comparison["wins"], 10)

    def test_per_study_analysis_is_served_under_the_api(self) -> None:
        self.build()

        served = json.loads(
            (self.site / "api" / "studies" / "polybench-r3.json").read_text(
                encoding="utf-8"
            )
        )
        self.assertEqual(served["study"]["id"], "polybench-r3")

    def test_app_shell_and_per_study_dashboards_are_both_published(self) -> None:
        self.build()

        self.assertEqual(
            (self.site / "index.html").read_text(encoding="utf-8"), "<html>app</html>"
        )
        self.assertTrue((self.site / "explorer.js").is_file())
        self.assertTrue((self.site / "studies" / "polybench-r3" / "index.html").is_file())

    def test_provisional_studies_stay_published_with_their_status(self) -> None:
        self.build()

        listing = json.loads((self.site / "studies.json").read_text(encoding="utf-8"))
        self.assertEqual(
            {item["id"]: item["status"] for item in listing["studies"]},
            {"polybench-r3": "provisional", "broken": "provisional"},
        )

    def test_study_without_a_dashboard_is_skipped(self) -> None:
        (self.root / "studies" / "half-declared").mkdir(parents=True)

        index = self.build()

        self.assertNotIn("half-declared", {study["id"] for study in index["studies"]})


if __name__ == "__main__":
    unittest.main()
