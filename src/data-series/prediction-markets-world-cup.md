---
title: "Were Prediction Markets Actually Right About the World Cup Finalists?"
description: "Prediction markets are widely assumed to beat pundits. This tests that claim against the 2026 World Cup using calibration curves and Brier scores rather than anecdote."
question: "Did prediction markets price World Cup outcomes better than bookmakers and expert panels — and were they well calibrated, or merely directionally lucky?"
date: 2026-08-20
tags: ["Data", "Forecasting"]
status: "In progress"
draft: true

findings: []

methodology:
  - title: "Define the claim precisely"
    body: "\"Prediction markets are right\" is untestable. The testable versions are: were stated probabilities calibrated (did 70% events happen ~70% of the time), and did they beat bookmaker and expert baselines on Brier score? Both are pre-registered before looking at outcomes."
  - title: "Assemble aligned probability snapshots"
    body: "Pull market prices for each match and each tournament-winner contract at fixed intervals, then align them to the same timestamps as bookmaker odds and published expert forecasts. Comparing a market price from kickoff to a pundit pick from three weeks earlier is the most common error in this genre."
  - title: "Strip the vig from bookmaker odds"
    body: "Bookmaker prices embed an overround and are not probabilities. Convert to implied probabilities and normalise so each market sums to one, otherwise the baseline is unfairly penalised."
  - title: "Score with Brier, decompose into reliability and resolution"
    body: "Brier score alone conflates two different skills. Decomposing it separates calibration (are the numbers honest) from discrimination (does it separate winners from losers) — a forecaster can be excellent at one and poor at the other."
  - title: "Bin and plot calibration"
    body: "Group forecasts into probability bins and plot observed frequency against stated probability. Report bin counts alongside, since a tournament has few matches and tail bins will be thin."
  - title: "Bootstrap the confidence intervals"
    body: "A single World Cup is roughly 64 matches. Any difference in Brier score needs a resampled interval before it means anything — and it is entirely possible the honest answer is that the sample is too small to distinguish the sources."

sources:
  - name: "Kalshi"
    url: "https://kalshi.com"
    note: "Regulated US event contracts; historical price series for tournament and match markets."
  - name: "Polymarket"
    url: "https://polymarket.com"
    note: "On-chain prediction market; deeper liquidity on headline contracts, thinner on individual matches."
  - name: "Football-Data.co.uk"
    url: "https://www.football-data.co.uk"
    note: "Historical closing odds from multiple bookmakers, used to build the vig-adjusted baseline."
  - name: "FIFA official results"
    url: "https://www.fifa.com"
    note: "Ground truth for match and tournament outcomes."

limitations:
  - "One tournament is a small sample. Sixty-four matches cannot reliably separate two forecasters whose true skill differs modestly."
  - "Market liquidity varies enormously between the winner market and individual group-stage matches; thin markets have wider spreads and noisier mid-prices."
  - "Selection of expert forecasts is a judgement call, and cherry-picking pundits would bias the comparison. The selection rule is fixed in advance and published."
  - "Prices move on information; a calibration test across the tournament partly measures how quickly each source incorporated news, not only forecasting skill."

repro:
  note: "Everything is public data. The notebook pulls the price series, builds the vig-adjusted baseline, and regenerates every figure from raw inputs."
  repo: ""
  tools: ["Python", "pandas", "scikit-learn", "matplotlib", "Jupyter"]
---

Prediction markets have a good reputation and a thin evidence base in casual conversation. People remember the calls that landed and forget the confident 80% that didn't, which is exactly the bias that calibration analysis exists to remove.

This post tests the claim properly against the 2026 World Cup.

## Why "were they right" is the wrong question

A forecaster who says 60% and is wrong hasn't necessarily failed. If they say 60% a hundred times and the event happens sixty times, they are perfectly calibrated — and being "wrong" on any individual call is expected.

So the analysis asks two separate questions:

**Calibration** — when markets said 70%, did those things happen about 70% of the time? This is about honesty of the numbers.

**Discrimination** — did markets separate the eventual finalists from the rest earlier and more sharply than the alternatives? This is about usefulness.

A source can be well calibrated and useless (predicting 50% on every coin flip), or highly discriminating but overconfident. Brier decomposition separates the two, which is why this analysis reports both rather than a single accuracy figure.

## The comparison set

Three forecast sources, aligned to identical timestamps:

1. **Prediction markets** — Kalshi and Polymarket mid-prices
2. **Bookmakers** — closing odds, converted to probabilities with the overround removed
3. **Expert panels** — published pre-tournament and pre-match predictions, selected by a rule fixed in advance

The alignment step is where most public comparisons of this kind fall apart, and it's the part that takes the most work.

---

**Status: analysis in progress.** The methodology, sources, and limitations above are settled and published before the results, so the analysis can't quietly drift toward a more interesting conclusion. Findings, calibration curves, and Brier decomposition will be added here on completion, along with the notebook.
