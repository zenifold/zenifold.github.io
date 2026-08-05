---
title: "Are Prediction Markets Any Good at Geopolitics?"
description: "Markets are well calibrated on elections and sports, where outcomes are frequent and resolution is clean. Geopolitical questions are neither. This tests whether the calibration survives the move."
question: "Do prediction markets stay calibrated on geopolitical questions, where base rates are thin, resolution is ambiguous, and the sample is small — or does the reputation come entirely from domains that don't resemble geopolitics?"
date: 2026-11-12
tags: ["Data", "Forecasting", "Geo-strategy"]
status: "In progress"
draft: true

findings: []

methodology:
  - title: "Pre-register the resolved-contract universe"
    body: "Fix the inclusion rule before pulling outcomes: every geopolitical contract that resolved in the window, not the memorable ones. Retrospectively selecting contracts is how this genre of analysis usually goes wrong, in both directions."
  - title: "Classify contracts by resolution cleanliness"
    body: "A contract on \"will X hold an election by date Y\" resolves unambiguously. One on \"will there be a meaningful escalation\" depends on a resolution committee's judgement. These should not be scored together, and separating them is itself a finding about the instrument."
  - title: "Score calibration and discrimination separately"
    body: "Brier decomposition into reliability and resolution. A market can be honest about its uncertainty (well calibrated) while adding almost nothing over the base rate (poor discrimination). On geopolitics I would expect exactly that pattern, which is why the two are reported apart."
  - title: "Compare against the naive base rate, not against pundits"
    body: "The demanding benchmark isn't an expert — it's the unconditional historical frequency of the event class. A forecaster that cannot beat the base rate is decorative regardless of how sophisticated the mechanism is."
  - title: "Measure liquidity and treat thin markets separately"
    body: "Geopolitical contracts are often thinly traded, and a mid-price with a wide spread is not a probability. Stratify by volume and open interest, and report whether calibration is carried entirely by the liquid contracts."
  - title: "Bootstrap everything, and expect it to be inconclusive"
    body: "The resolved geopolitical sample is small. Confidence intervals will be wide, and the honest headline may be that the data cannot distinguish the market from the base rate. That result gets published as readily as any other."

sources:
  - name: "Kalshi"
    url: "https://kalshi.com"
    note: "Regulated US event contracts with published resolution criteria — the cleanest source for auditable geopolitical questions."
  - name: "Polymarket"
    url: "https://polymarket.com"
    note: "On-chain markets with deeper liquidity on headline questions; resolution is committee-based, which matters for the cleanliness classification."
  - name: "UCDP/PRIO Armed Conflict Dataset"
    url: "https://ucdp.uu.se/downloads/"
    note: "Used to construct the historical base rates that market forecasts are scored against."
  - name: "Good Judgment Project published results"
    url: "https://goodjudgment.com"
    note: "Prior work on geopolitical forecasting accuracy, used as an external reference point for expected skill levels."

limitations:
  - "The resolved geopolitical contract universe is small. This analysis is likely to be underpowered, and saying so is part of the result."
  - "Resolution ambiguity is not evenly distributed. The questions most worth forecasting are frequently the ones hardest to resolve cleanly, which biases the clean-resolution subsample toward easier questions."
  - "Prediction markets on geopolitical events face regulatory constraints that shape which questions exist at all. The available universe is not a random sample of interesting questions."
  - "Thin markets can be moved cheaply. A calibration result driven by low-volume contracts is measuring something closer to noise than to aggregated belief."
  - "Scoring a forecast against an outcome says nothing about whether the forecast was reasonable given information available at the time."

repro:
  note: "Contract selection rules, the cleanliness classification, and the scoring pipeline are all in the notebook. The classification is the most subjective step, so every contract's assigned class is published alongside the result for inspection."
  repo: ""
  tools: ["Python", "pandas", "scikit-learn", "matplotlib", "Jupyter"]
---

Prediction markets have a strong reputation, built mostly on elections and sports. Both are unusually friendly domains: outcomes arrive frequently, resolution is unambiguous, base rates are well established, and liquidity is deep.

Geopolitics is the opposite on every one of those dimensions. So the interesting question isn't whether prediction markets work — it's whether the thing that makes them work survives the move to a domain where the conditions no longer hold.

## Why this is a harder test than it looks

**Thin base rates.** With elections you have hundreds of comparable prior events. With "will this specific bilateral relationship rupture in the next six months," you have analogies at best.

**Ambiguous resolution.** Sports resolve themselves. Many geopolitical contracts resolve on a committee reading a definition against a messy reality, which introduces a source of error that has nothing to do with forecasting skill.

**Thin liquidity.** A market price is an aggregation mechanism. With few participants and wide spreads, there isn't much being aggregated, and the mid-price is closer to one desk's opinion than to a crowd's.

**Small samples.** Even several years of resolved geopolitical contracts is a small *n* by the standards of a calibration test. Wide intervals are guaranteed.

## The result I'd bet on, and why I might be wrong

My prior is that geopolitical markets will be **reasonably calibrated but weakly discriminating** — honest about their uncertainty, but adding little over the historical base rate. That's the pattern you'd expect when participants are thoughtful but the underlying question is genuinely hard.

If that's what the data shows, the practical implication is not "ignore prediction markets." It's narrower and more useful: treat the price as a well-behaved summary of consensus uncertainty rather than as a signal that beats knowing the base rate.

The result that would surprise me is strong discrimination on the ambiguous-resolution subset. That would suggest participants are pricing the resolution committee's behaviour as much as the world's — which would be a finding about the instrument rather than about geopolitics, and arguably a more interesting one.

## The likeliest honest outcome

Underpowered. Confidence intervals wide enough that the market and the base rate can't be distinguished.

I'm stating that in advance because it's the result most likely to go unpublished if it isn't committed to beforehand — and a series that only publishes when the data cooperates isn't a research series.

---

**Status: analysis in progress.** Methodology, sources, limitations, and my prior are published before results. Findings, calibration curves by resolution cleanliness, and the liquidity stratification will follow, with every contract's classification published for inspection.
