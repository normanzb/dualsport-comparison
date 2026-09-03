#!/usr/bin/env bash
# Creates the local Python environment the cutout script needs.
# Run once. Safe to re-run.
set -euo pipefail

repo="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
venv="$repo/.venv-img"

if [ -x "$venv/bin/python" ]; then
  echo "environment already exists at .venv-img"
else
  echo "creating .venv-img"
  python3 -m venv "$venv"
fi

# --use-system-ca equivalent for pip behind a corporate root cert: if pip fails
# with an SSL error, export PIP_CERT=/path/to/your/keychain-export.pem first.
"$venv/bin/pip" install --quiet --upgrade pip
"$venv/bin/pip" install --quiet "rembg[cli]" onnxruntime pillow

echo
echo "ready. models download on first use into ~/.u2net (birefnet-general is ~1 GB)."
"$venv/bin/python" - <<'PY'
import onnxruntime as ort
print("onnxruntime", ort.__version__, "| providers:", ", ".join(ort.get_available_providers()))
PY
