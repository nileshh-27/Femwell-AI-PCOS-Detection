import argparse
import json
import sys
from pathlib import Path

import joblib
import pandas as pd


def _read_stdin_json() -> dict:
    raw = sys.stdin.read()
    if not raw.strip():
        raise ValueError("Expected JSON on stdin")
    return json.loads(raw)


def main() -> None:
    parser = argparse.ArgumentParser(description="Run PCOS model inference for a single example.")
    parser.add_argument("--model", default="pcos_model.joblib", help="Path to .joblib model artifact")
    args = parser.parse_args()

    model_path = Path(args.model).resolve()
    if not model_path.exists():
        raise FileNotFoundError(f"Model not found: {model_path}")

    payload = _read_stdin_json()

    obj = joblib.load(model_path)
    if isinstance(obj, dict) and "pipeline" in obj:
        pipeline = obj["pipeline"]
        meta = obj.get("meta") or {}
    else:
        pipeline = obj
        meta = {}

    # Expect keys matching training columns (minus label).
    df = pd.DataFrame([payload])

    if not hasattr(pipeline, "predict_proba"):
        raise TypeError("Loaded model does not support predict_proba")

    prob = float(pipeline.predict_proba(df)[:, 1][0])
    out = {
        "pcos_probability": prob,
        "model_version": meta.get("model_version") or "ml-logreg-v1",
    }
    sys.stdout.write(json.dumps(out))


if __name__ == "__main__":
    main()
