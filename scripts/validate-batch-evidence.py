#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import sys
from collections import Counter
from pathlib import Path
from typing import Any


SLOT_FIELDS = (
    "study_id",
    "configuration_id",
    "slot_id",
    "condition",
    "task",
    "repetition",
)


class BatchEvidenceValidator:
    def __init__(self, batch_path: Path, artifacts_path: Path) -> None:
        self.batch_path = batch_path
        self.artifacts_path = artifacts_path

    def validate(self) -> tuple[int, int]:
        expected = self.expected_slots()
        actual: Counter[str] = Counter()
        errors: list[str] = []
        attempt_paths = sorted(self.artifacts_path.rglob("attempt.json"))
        for attempt_path in attempt_paths:
            try:
                attempt = self.read_mapping(attempt_path)
                slot = self.mapping(attempt.get("slot"), f"{attempt_path}: slot")
                identity = self.mapping(attempt.get("identity"), f"{attempt_path}: identity")
                slot_id = self.string(identity.get("slot_id"), f"{attempt_path}: identity slot_id")
                actual[slot_id] += 1
                expected_slot = expected.get(slot_id)
                if expected_slot is None:
                    continue
                mismatches = self.metadata_mismatches(attempt, identity, slot, expected_slot)
                if mismatches:
                    errors.append(f"{attempt_path}: metadata mismatch: {', '.join(mismatches)}")
            except (json.JSONDecodeError, OSError, TypeError, ValueError) as error:
                errors.append(str(error))
        missing = sorted(set(expected) - set(actual))
        unexpected = sorted(set(actual) - set(expected))
        duplicates = sorted(slot_id for slot_id, count in actual.items() if count > 1)
        if missing:
            errors.append(f"missing slots: {', '.join(missing)}")
        if unexpected:
            errors.append(f"unexpected slots: {', '.join(unexpected)}")
        if duplicates:
            errors.append(f"duplicate slots: {', '.join(duplicates)}")
        if errors:
            raise ValueError("batch evidence validation failed\n" + "\n".join(errors))
        return len(attempt_paths), len(expected)

    def expected_slots(self) -> dict[str, dict[str, Any]]:
        batch = self.read_mapping(self.batch_path)
        matrix = self.mapping(batch.get("matrix"), f"{self.batch_path}: matrix")
        include = matrix.get("include")
        if not isinstance(include, list) or not include:
            raise ValueError(f"{self.batch_path}: matrix include must be a non-empty list")
        expected: dict[str, dict[str, Any]] = {}
        for index, value in enumerate(include):
            slot = self.mapping(value, f"{self.batch_path}: matrix include {index}")
            slot_id = self.string(slot.get("slot_id"), f"{self.batch_path}: matrix slot_id")
            if slot_id in expected:
                raise ValueError(f"{self.batch_path}: duplicate planned slot {slot_id}")
            expected[slot_id] = slot
        return expected

    @staticmethod
    def metadata_mismatches(
        attempt: dict[str, Any],
        identity: dict[str, Any],
        slot: dict[str, Any],
        expected: dict[str, Any],
    ) -> list[str]:
        mismatches = [
            f"{field} expected {expected.get(field)}, got {slot.get(field)}"
            for field in SLOT_FIELDS
            if slot.get(field) != expected.get(field)
        ]
        if identity.get("slot_id") != slot.get("slot_id"):
            mismatches.append(
                f"identity slot_id expected {slot.get('slot_id')}, got {identity.get('slot_id')}"
            )
        if attempt.get("batch_id") != expected.get("batch_id"):
            mismatches.append(
                f"batch_id expected {expected.get('batch_id')}, got {attempt.get('batch_id')}"
            )
        return mismatches

    @staticmethod
    def read_mapping(path: Path) -> dict[str, Any]:
        value = json.loads(path.read_text(encoding="utf-8"))
        return BatchEvidenceValidator.mapping(value, str(path))

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
    parser.add_argument("--batch", type=Path, required=True)
    parser.add_argument("--artifacts", type=Path, required=True)
    arguments = parser.parse_args()
    try:
        attempts, slots = BatchEvidenceValidator(arguments.batch, arguments.artifacts).validate()
    except (json.JSONDecodeError, OSError, TypeError, ValueError) as error:
        print(error, file=sys.stderr)
        return 1
    print(f"validated {attempts} attempt records for {slots} planned slots")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
