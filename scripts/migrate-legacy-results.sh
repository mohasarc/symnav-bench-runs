#!/usr/bin/env bash
set -euo pipefail

root=${1:-.}
legacy="$root/legacy"
marker="$legacy/manifest.json"

if [[ -f "$marker" || ! -d "$root/cells" ]]; then
  exit 0
fi

mkdir -p "$legacy"
mv "$root/cells" "$legacy/cells"
if [[ -d "$root/report" ]]; then
  mv "$root/report" "$legacy/report"
fi
python - "$legacy" <<'PY'
import hashlib, json, pathlib, sys
legacy = pathlib.Path(sys.argv[1])
files = {}
for path in sorted(path for path in legacy.rglob("*") if path.is_file()):
    if path.name == "manifest.json":
        continue
    files[path.relative_to(legacy).as_posix()] = hashlib.sha256(path.read_bytes()).hexdigest()
(legacy / "manifest.json").write_text(json.dumps({
    "schema_version": 1,
    "source": "global-cells",
    "files": files,
}, indent=2, sort_keys=True) + "\n")
PY
