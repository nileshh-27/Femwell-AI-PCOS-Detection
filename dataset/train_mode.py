import argparse
import json
from dataclasses import dataclass
from pathlib import Path

import joblib
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
	accuracy_score,
	classification_report,
	confusion_matrix,
	f1_score,
	precision_score,
	recall_score,
	roc_auc_score,
)
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler


@dataclass(frozen=True)
class TrainConfig:
	train_csv: Path
	test_csv: Path
	label_col: str
	drop_cols: tuple[str, ...]
	model_out: Path
	metrics_out: Path
	random_state: int


def _load_csv(path: Path) -> pd.DataFrame:
	if not path.exists():
		raise FileNotFoundError(f"CSV not found: {path}")
	df = pd.read_csv(path)
	if df.empty:
		raise ValueError(f"CSV is empty: {path}")
	return df


def _build_pipeline(numeric_cols: list[str], categorical_cols: list[str], random_state: int) -> Pipeline:
	numeric_transformer = Pipeline(
		steps=[
			("imputer", SimpleImputer(strategy="median")),
			("scaler", StandardScaler()),
		]
	)

	categorical_transformer = Pipeline(
		steps=[
			("imputer", SimpleImputer(strategy="most_frequent")),
			(
				"onehot",
				OneHotEncoder(handle_unknown="ignore", sparse_output=False),
			),
		]
	)

	preprocessor = ColumnTransformer(
		transformers=[
			("num", numeric_transformer, numeric_cols),
			("cat", categorical_transformer, categorical_cols),
		],
		remainder="drop",
	)

	# Logistic regression is a strong baseline: fast, interpretable, and works well
	# with one-hot + standardized numeric features.
	clf = LogisticRegression(
		max_iter=2000,
		class_weight="balanced",
		random_state=random_state,
	)

	return Pipeline(steps=[("preprocess", preprocessor), ("model", clf)])


def _split_features_label(df: pd.DataFrame, label_col: str, drop_cols: tuple[str, ...]) -> tuple[pd.DataFrame, pd.Series]:
	if label_col not in df.columns:
		raise ValueError(f"Label column '{label_col}' not found. Columns: {list(df.columns)}")

	y = df[label_col]

	for c in drop_cols:
		if c in df.columns and c != label_col:
			df = df.drop(columns=[c])

	X = df.drop(columns=[label_col])
	return X, y


def _infer_column_types(X: pd.DataFrame) -> tuple[list[str], list[str]]:
	numeric_cols: list[str] = []
	categorical_cols: list[str] = []
	for col in X.columns:
		if pd.api.types.is_numeric_dtype(X[col]):
			numeric_cols.append(col)
		else:
			categorical_cols.append(col)
	return numeric_cols, categorical_cols


def train_and_evaluate(cfg: TrainConfig) -> dict:
	train_df = _load_csv(cfg.train_csv)
	test_df = _load_csv(cfg.test_csv)

	X_train, y_train = _split_features_label(train_df, cfg.label_col, cfg.drop_cols)
	X_test, y_test = _split_features_label(test_df, cfg.label_col, cfg.drop_cols)

	# Coerce label to int 0/1
	y_train = pd.to_numeric(y_train, errors="raise").astype(int)
	y_test = pd.to_numeric(y_test, errors="raise").astype(int)

	numeric_cols, categorical_cols = _infer_column_types(X_train)

	pipeline = _build_pipeline(numeric_cols, categorical_cols, cfg.random_state)
	pipeline.fit(X_train, y_train)

	y_pred = pipeline.predict(X_test)
	# Some models may not implement predict_proba; logistic regression does.
	y_prob = pipeline.predict_proba(X_test)[:, 1]

	metrics = {
		"rows": {
			"train": int(len(train_df)),
			"test": int(len(test_df)),
		},
		"columns": {
			"numeric": numeric_cols,
			"categorical": categorical_cols,
		},
		"scores": {
			"accuracy": float(accuracy_score(y_test, y_pred)),
			"precision": float(precision_score(y_test, y_pred, zero_division=0)),
			"recall": float(recall_score(y_test, y_pred, zero_division=0)),
			"f1": float(f1_score(y_test, y_pred, zero_division=0)),
			"roc_auc": float(roc_auc_score(y_test, y_prob)),
		},
		"confusion_matrix": confusion_matrix(y_test, y_pred).tolist(),
		"classification_report": classification_report(y_test, y_pred, zero_division=0, output_dict=True),
		"model": {
			"type": "logistic_regression",
			"random_state": cfg.random_state,
		},
		"label": {
			"column": cfg.label_col,
			"drop_columns": list(cfg.drop_cols),
		},
	}

	cfg.model_out.parent.mkdir(parents=True, exist_ok=True)
	cfg.metrics_out.parent.mkdir(parents=True, exist_ok=True)

	joblib.dump(
		{
			"pipeline": pipeline,
			"schema": {
				"numeric_cols": numeric_cols,
				"categorical_cols": categorical_cols,
				"feature_columns": list(X_train.columns),
			},
			"meta": {
				"model_version": "ml-logreg-v1",
			},
		},
		cfg.model_out,
	)

	cfg.metrics_out.write_text(json.dumps(metrics, indent=2), encoding="utf-8")
	return metrics


def main() -> None:
	parser = argparse.ArgumentParser(description="Train and evaluate a PCOS screening classifier (demo ML).")
	parser.add_argument("--train", default="pcos_train.csv", help="Path to training CSV")
	parser.add_argument("--test", default="pcos_test.csv", help="Path to test CSV")
	parser.add_argument("--label", default="pcos_label", help="Name of label column")
	parser.add_argument(
		"--drop",
		nargs="*",
		default=["label_source"],
		help="Columns to drop before training (besides label)",
	)
	parser.add_argument("--model-out", default="pcos_model.joblib", help="Output path for saved model pipeline")
	parser.add_argument("--metrics-out", default="pcos_metrics.json", help="Output path for metrics JSON")
	parser.add_argument("--seed", type=int, default=42, help="Random seed")

	args = parser.parse_args()
	base_dir = Path(__file__).resolve().parent

	cfg = TrainConfig(
		train_csv=(base_dir / args.train).resolve(),
		test_csv=(base_dir / args.test).resolve(),
		label_col=str(args.label),
		drop_cols=tuple(args.drop or []),
		model_out=(base_dir / args.model_out).resolve(),
		metrics_out=(base_dir / args.metrics_out).resolve(),
		random_state=int(args.seed),
	)

	metrics = train_and_evaluate(cfg)
	print("✅ Training complete")
	print(f"Model saved to: {cfg.model_out}")
	print(f"Metrics saved to: {cfg.metrics_out}")
	print("\nKey metrics:")
	print(json.dumps(metrics["scores"], indent=2))


if __name__ == "__main__":
	main()

