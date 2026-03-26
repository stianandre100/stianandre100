#!/usr/bin/env python3
"""CSV Data Summarizer - automatically analyzes CSV files with statistics and visualizations."""

import sys
import os
import pandas as pd
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns
from pathlib import Path


def summarize_csv(file_path: str) -> str:
    """Load a CSV file and generate a comprehensive statistical summary with visualizations."""
    path = Path(file_path)
    if not path.exists():
        return f"Error: File '{file_path}' not found."

    df = pd.read_csv(file_path)
    output_dir = path.parent

    lines = []
    lines.append("=" * 60)
    lines.append("  CSV DATA SUMMARIZER")
    lines.append("=" * 60)

    # ── Dataset overview ──────────────────────────────────────────
    lines.append("\n📋 DATASET OVERVIEW")
    lines.append("-" * 40)
    lines.append(f"  File       : {path.name}")
    lines.append(f"  Rows       : {df.shape[0]:,}")
    lines.append(f"  Columns    : {df.shape[1]}")
    lines.append(f"  Memory     : {df.memory_usage(deep=True).sum() / 1024:.1f} KB")

    # ── Column types ─────────────────────────────────────────────
    lines.append("\n🗂️  COLUMN TYPES")
    lines.append("-" * 40)
    for col, dtype in df.dtypes.items():
        lines.append(f"  {col:<30} {str(dtype)}")

    # ── Missing values ────────────────────────────────────────────
    missing = df.isnull().sum()
    missing = missing[missing > 0]
    lines.append("\n❓ MISSING VALUES")
    lines.append("-" * 40)
    if missing.empty:
        lines.append("  ✅ No missing values found.")
    else:
        for col, count in missing.items():
            pct = count / len(df) * 100
            lines.append(f"  {col:<30} {count:>6,}  ({pct:.1f}%)")

    # ── Identify column categories ────────────────────────────────
    numeric_cols = df.select_dtypes(include='number').columns.tolist()
    categorical_cols = [
        c for c in df.select_dtypes(include=['object', 'category']).columns
        if df[c].nunique() <= 50 and not c.lower().endswith('id')
    ]

    # Try to detect date columns
    date_cols = []
    for col in df.columns:
        if df[col].dtype == object:
            try:
                parsed = pd.to_datetime(df[col], infer_datetime_format=True)
                df[col] = parsed
                date_cols.append(col)
            except Exception:
                pass
    date_cols += df.select_dtypes(include=['datetime', 'datetime64']).columns.tolist()
    date_cols = list(dict.fromkeys(date_cols))  # deduplicate

    # ── Numeric statistics ────────────────────────────────────────
    if numeric_cols:
        lines.append("\n📊 NUMERIC STATISTICS")
        lines.append("-" * 40)
        desc = df[numeric_cols].describe().round(2)
        lines.append(desc.to_string())

    # ── Correlation summary ───────────────────────────────────────
    if len(numeric_cols) >= 2:
        lines.append("\n🔗 CORRELATION MATRIX")
        lines.append("-" * 40)
        corr = df[numeric_cols].corr().round(2)
        lines.append(corr.to_string())

    # ── Categorical distributions ─────────────────────────────────
    if categorical_cols:
        lines.append("\n🏷️  CATEGORICAL DISTRIBUTIONS (top 5)")
        lines.append("-" * 40)
        for col in categorical_cols:
            lines.append(f"\n  {col}:")
            top5 = df[col].value_counts().head(5)
            for val, cnt in top5.items():
                pct = cnt / len(df) * 100
                lines.append(f"    {str(val):<25} {cnt:>6,}  ({pct:.1f}%)")

    # ── Time-series summary ───────────────────────────────────────
    if date_cols:
        lines.append("\n📅 TIME-SERIES INFO")
        lines.append("-" * 40)
        for col in date_cols:
            min_date = df[col].min()
            max_date = df[col].max()
            duration = max_date - min_date
            lines.append(f"  {col}: {min_date.date()} → {max_date.date()}  ({duration.days} days)")

    # ── Visualizations ────────────────────────────────────────────
    plot_numeric = numeric_cols[:4]
    plot_categorical = categorical_cols[:4]
    plots_saved = []

    # 1. Correlation heatmap
    if len(plot_numeric) >= 2:
        fig, ax = plt.subplots(figsize=(8, 6))
        sns.heatmap(
            df[plot_numeric].corr(),
            annot=True, fmt='.2f', cmap='coolwarm',
            center=0, ax=ax, square=True
        )
        ax.set_title('Correlation Heatmap')
        fig.tight_layout()
        out = str(output_dir / 'correlation_heatmap.png')
        fig.savefig(out, dpi=150)
        plt.close(fig)
        plots_saved.append(out)

    # 2. Time-series plot
    if date_cols and plot_numeric:
        date_col = date_cols[0]
        fig, ax = plt.subplots(figsize=(10, 4))
        for col in plot_numeric[:3]:
            ts = df.set_index(date_col)[col].dropna().sort_index()
            ax.plot(ts.index, ts.values, label=col)
        ax.set_title('Time-Series Trends')
        ax.legend()
        fig.tight_layout()
        out = str(output_dir / 'time_series.png')
        fig.savefig(out, dpi=150)
        plt.close(fig)
        plots_saved.append(out)

    # 3. Numeric distributions (histograms)
    if plot_numeric:
        n = len(plot_numeric)
        fig, axes = plt.subplots(1, n, figsize=(5 * n, 4))
        if n == 1:
            axes = [axes]
        for ax, col in zip(axes, plot_numeric):
            df[col].dropna().hist(ax=ax, bins=30, color='steelblue', edgecolor='white')
            ax.set_title(col)
            ax.set_xlabel('Value')
            ax.set_ylabel('Frequency')
        fig.suptitle('Numeric Distributions')
        fig.tight_layout()
        out = str(output_dir / 'distributions.png')
        fig.savefig(out, dpi=150)
        plt.close(fig)
        plots_saved.append(out)

    # 4. Categorical distributions (horizontal bar charts)
    if plot_categorical:
        n = len(plot_categorical)
        fig, axes = plt.subplots(1, n, figsize=(5 * n, 4))
        if n == 1:
            axes = [axes]
        for ax, col in zip(axes, plot_categorical):
            top = df[col].value_counts().head(10)
            top.sort_values().plot(kind='barh', ax=ax, color='steelblue')
            ax.set_title(col)
            ax.set_xlabel('Count')
        fig.suptitle('Categorical Distributions')
        fig.tight_layout()
        out = str(output_dir / 'categorical_distributions.png')
        fig.savefig(out, dpi=150)
        plt.close(fig)
        plots_saved.append(out)

    if plots_saved:
        lines.append("\n🖼️  VISUALIZATIONS SAVED")
        lines.append("-" * 40)
        for p in plots_saved:
            lines.append(f"  {p}")

    lines.append("\n" + "=" * 60)
    return "\n".join(lines)


if __name__ == '__main__':
    csv_path = sys.argv[1] if len(sys.argv) > 1 else 'resources/sample.csv'
    result = summarize_csv(csv_path)
    print(result)
