# CSV Data Summarizer

Analyze CSV files with automatic statistical summaries and visualizations using Python, pandas, matplotlib, and seaborn.

## Trigger

Use this skill when the user provides a CSV file path or asks to analyze tabular/CSV data.

## Instructions

When activated, you MUST immediately and automatically:

1. Run the comprehensive analysis using `analyze.py`
2. Generate ALL relevant visualizations
3. Present the complete results in a single response

**DO NOT ASK THE USER WHAT THEY WANT TO DO WITH THE DATA.**

Never say things like:
- "What would you like me to help you with?"
- "Here are some options:"
- "Would you like me to analyze this?"

Do not list choices or wait for user direction before analyzing. Do not provide partial analysis that requires follow-up.

## Adaptive Analysis

Inspect the data first, then determine what analyses are most relevant:

- **Sales data**: Revenue trends, product performance, regional breakdowns
- **Customer data**: Demographics, segmentation, lifetime value analysis
- **Financial data**: P&L summaries, correlation analysis, variance reporting
- **Time-series / operational data**: Temporal patterns, anomaly detection
- **Survey data**: Response distributions, sentiment breakdowns

## How to Run

```bash
python .claude/skills/csv-data-summarizer/analyze.py <path-to-csv>
```

Requires Python 3.8+ and the packages listed in `requirements.txt`:

```bash
pip install -r .claude/skills/csv-data-summarizer/requirements.txt
```

## Output

The script prints a formatted text summary and saves up to four PNG visualizations:
- `correlation_heatmap.png`
- `time_series.png`
- `distributions.png`
- `categorical_distributions.png`
