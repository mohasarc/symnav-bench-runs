"""Build the published Pages tree: static JSON API plus the study explorer app."""

from __future__ import annotations

import json
import shutil
import sys
from pathlib import Path
from typing import Any


UNREGISTERED_VALIDITY = "valid"


class SymnavVersionRegistry:
    def __init__(self, entries: list[dict[str, Any]]) -> None:
        self.entries = entries
        self._by_sha = {entry["sha"]: entry for entry in entries}

    def resolve(self, sha: str | None) -> dict[str, Any]:
        entry = self._by_sha.get(sha or "")
        return {
            "version": entry["version"] if entry else None,
            "summary": entry["summary"] if entry else None,
        }


class StudyRowBuilder:
    def __init__(self, registry: SymnavVersionRegistry, catalog_studies: dict) -> None:
        self.registry = registry
        self.catalog_studies = catalog_studies

    def row(self, study_id: str, analysis: dict[str, Any]) -> dict[str, Any]:
        study = analysis.get("study", {})
        revision = study.get("symnav_revision") or {}
        catalog = self.catalog_studies.get(study_id, {})
        arms = [self._arm(item) for item in analysis.get("configurations", [])]
        return {
            "id": study_id,
            "benchmark": study.get("benchmark", "deepswe"),
            "benchmark_source_revision": study.get("benchmark_source_revision")
            or study.get("deep_swe_sha"),
            "repetitions": study.get("repetitions"),
            "conditions": study.get("conditions", []),
            "symnav": {**revision, **self.registry.resolve(revision.get("sha"))},
            "validity": catalog.get("validity", UNREGISTERED_VALIDITY),
            "note": catalog.get("note"),
            "coverage": analysis.get("coverage", {}),
            "models": sorted({arm["model"] for arm in arms}),
            "efforts": sorted({arm["effort"] for arm in arms}),
            "agents": sorted({arm["agent"] for arm in arms}),
            "arms": arms,
            "comparisons": [
                self._comparison(item) for item in analysis.get("comparisons", [])
            ],
        }

    @staticmethod
    def _arm(configuration: dict[str, Any]) -> dict[str, Any]:
        metrics = configuration.get("metrics", {})
        adoption = configuration.get("adoption") or {}
        coverage = configuration.get("coverage", {})
        return {
            "configuration_id": configuration.get("id"),
            "agent": configuration.get("agent"),
            "model": configuration.get("model"),
            "effort": configuration.get("effort"),
            "agent_version": configuration.get("agent_version"),
            "condition": configuration.get("condition"),
            "performance_score": metrics.get("performance_score"),
            "f2p": metrics.get("f2p"),
            "partial": metrics.get("partial"),
            "cost": metrics.get("cost"),
            "adoption_rate": adoption.get("used_symnav_rate"),
            "scored_slots": coverage.get("scored_slots"),
            "planned_slots": coverage.get("planned_slots"),
        }

    @staticmethod
    def _comparison(comparison: dict[str, Any]) -> dict[str, Any]:
        uplift = comparison.get("uplift") or {}
        return {
            "condition": comparison.get("condition"),
            "primary": comparison.get("primary"),
            "uplift": uplift.get("value"),
            "lower_95": uplift.get("lower_95"),
            "upper_95": uplift.get("upper_95"),
            "randomization_p_value": comparison.get("randomization_p_value"),
            "wins": comparison.get("wins"),
            "ties": comparison.get("ties"),
            "losses": comparison.get("losses"),
            "demonstrated_improvement": comparison.get("demonstrated_improvement"),
            "material_improvement": comparison.get("material_improvement"),
        }


def build_site(
    results_root: Path, site: Path, assets: Path, catalog_path: Path | None = None
) -> None:
    catalog = _read_catalog(catalog_path or results_root / "catalog.json")
    registry = SymnavVersionRegistry(catalog.get("symnav_versions", []))
    builder = StudyRowBuilder(registry, catalog.get("studies", {}))

    site.mkdir(parents=True, exist_ok=True)
    api = site / "api"
    (api / "studies").mkdir(parents=True, exist_ok=True)

    rows = []
    for study in sorted(_study_directories(results_root)):
        analysis = json.loads(
            (study / "dashboard" / "analysis.json").read_text(encoding="utf-8")
        )
        rows.append(builder.row(study.name, analysis))
        shutil.copyfile(
            study / "dashboard" / "analysis.json", api / "studies" / f"{study.name}.json"
        )
        shutil.copytree(study / "dashboard", site / "studies" / study.name)

    _write_json(
        api / "index.json",
        {"symnav_versions": registry.entries, "studies": rows},
    )
    _write_json(
        site / "studies.json",
        {
            "studies": [
                {
                    "id": row["id"],
                    "status": "provisional"
                    if row["coverage"].get("provisional", True)
                    else "complete",
                }
                for row in rows
            ]
        },
    )
    _copy_assets(assets, site)


def _study_directories(results_root: Path) -> list[Path]:
    studies = results_root / "studies"
    if not studies.is_dir():
        return []
    return [
        study
        for study in studies.iterdir()
        if study.is_dir() and (study / "dashboard" / "analysis.json").is_file()
    ]


def _read_catalog(path: Path) -> dict[str, Any]:
    if not path.is_file():
        return {}
    return json.loads(path.read_text(encoding="utf-8"))


def _write_json(path: Path, payload: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, indent=1, sort_keys=True) + "\n", encoding="utf-8")


def _copy_assets(assets: Path, site: Path) -> None:
    for item in assets.iterdir():
        target = site / item.name
        if item.is_dir():
            shutil.copytree(item, target, dirs_exist_ok=True)
        else:
            shutil.copyfile(item, target)


if __name__ == "__main__":
    arguments = [Path(argument) for argument in sys.argv[1:]]
    build_site(*arguments)
