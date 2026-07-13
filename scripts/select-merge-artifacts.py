#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any


class MergeArtifactSelector:
    def __init__(self, study_dir: Path, artifacts_dir: Path) -> None:
        self.study_dir = study_dir
        self.artifacts_dir = artifacts_dir

    def select(self) -> list[Path]:
        selected: list[Path] = []
        selected_attempts: dict[tuple[str, str], dict[str, Any]] = {}
        errors: list[str] = []
        for artifact_dir in sorted(path for path in self.artifacts_dir.iterdir() if path.is_dir()):
            attempt_paths = sorted(artifact_dir.rglob("attempt.json"))
            if len(attempt_paths) != 1:
                errors.append(f"{artifact_dir}: expected one attempt.json, found {len(attempt_paths)}")
                continue
            source = attempt_paths[0]
            source_data = self.read_mapping(source)
            identity = self.mapping(source_data.get("identity"), f"{source}: identity")
            slot_id = self.string(identity.get("slot_id"), f"{source}: identity slot_id")
            attempt_id = self.string(identity.get("attempt_id"), f"{source}: identity attempt_id")
            attempt_key = (slot_id, attempt_id)
            previous = selected_attempts.get(attempt_key)
            if previous is not None:
                if self.without_archive_pointer(previous) != self.without_archive_pointer(source_data):
                    errors.append(f"duplicate artifact has different immutable content: {source}")
                continue
            target = self.study_dir / "attempts" / slot_id / f"{attempt_id}.json"
            if not target.exists():
                selected.append(artifact_dir)
                selected_attempts[attempt_key] = source_data
                continue
            if self.same_immutable_attempt(target, source_data):
                continue
            errors.append(f"attempt already exists with different immutable content: {target}")
        if errors:
            raise ValueError("merge artifact selection failed\n" + "\n".join(errors))
        return selected

    @classmethod
    def same_immutable_attempt(cls, target: Path, source_data: dict[str, Any]) -> bool:
        target_data = cls.read_mapping(target)
        return cls.without_archive_pointer(target_data) == cls.without_archive_pointer(source_data)

    @staticmethod
    def without_archive_pointer(attempt: dict[str, Any]) -> dict[str, Any]:
        return {key: value for key, value in attempt.items() if key != "artifact"}

    @staticmethod
    def read_mapping(path: Path) -> dict[str, Any]:
        return MergeArtifactSelector.mapping(json.loads(path.read_text(encoding="utf-8")), str(path))

    @staticmethod
    def mapping(value: object, name: str) -> dict[str, Any]:
        if not isinstance(value, dict):
            raise ValueError(f"{name} must be an object")
        return value

    @staticmethod
    def string(value: object, name: str) -> str:
        if not isinstance(value, str) or not value:
            raise ValueError(f"{name} must be a non-empty string")
        return value


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--study-dir", type=Path, required=True)
    parser.add_argument("--artifacts", type=Path, required=True)
    arguments = parser.parse_args()
    try:
        selected = MergeArtifactSelector(arguments.study_dir, arguments.artifacts).select()
    except (json.JSONDecodeError, OSError, TypeError, ValueError) as error:
        print(error, file=sys.stderr)
        return 1
    for artifact_dir in selected:
        print(artifact_dir)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
