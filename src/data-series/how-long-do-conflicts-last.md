---
title: "How Long Do Armed Conflicts Actually Last?"
description: "Coverage of any active conflict is dominated by the last week. Seventy years of conflict-termination data gives a base rate for duration — and shows which structural features actually predict a long war."
question: "What is the empirical distribution of armed conflict duration since 1946, and which structural characteristics — conflict type, number of parties, external involvement — predict the long tail?"
date: 2026-10-22
tags: ["Data", "Geo-strategy"]
status: "In progress"
draft: true

findings: []

methodology:
  - title: "Use a conflict definition that predates the question"
    body: "Adopt the UCDP/PRIO coding of armed conflict and its episode boundaries rather than defining categories myself. Using an established academic definition means the sample isn't shaped by which cases I find interesting."
  - title: "Model duration with survival analysis, not averages"
    body: "Conflict duration is heavily right-skewed and heavily censored — many conflicts in any dataset are still ongoing at the cutoff. A mean duration computed on completed conflicts only is badly biased downward. Kaplan–Meier handles the censoring properly."
  - title: "Separate episodes from conflicts"
    body: "Many conflicts stop and restart. Whether you treat a recurrence as a continuation or a new episode changes the duration distribution substantially, so both codings are reported rather than one being chosen quietly."
  - title: "Stratify by structural characteristics"
    body: "Fit survival curves separately by conflict type (interstate, intrastate, internationalised intrastate), number of active parties, and presence of external state support — the features available at onset rather than ones only visible in hindsight."
  - title: "Cox proportional hazards for the multivariate view"
    body: "Which characteristics still predict duration once the others are controlled for? Test the proportional-hazards assumption explicitly, because it is frequently violated in conflict data and rarely checked."
  - title: "Report the tail, not just the median"
    body: "The median is the least useful statistic here. What matters for anyone reasoning about an active conflict is the conditional expectation: given that it has already run three years, what does the distribution say about the next three?"

sources:
  - name: "UCDP/PRIO Armed Conflict Dataset"
    url: "https://ucdp.uu.se/downloads/"
    note: "The standard dataset for armed conflict onset, type, parties, and termination, covering 1946 onward."
  - name: "UCDP Conflict Termination Dataset"
    url: "https://ucdp.uu.se/downloads/"
    note: "Coded termination outcomes — victory, peace agreement, ceasefire, or low activity — used for the survival endpoints."
  - name: "SIPRI Military Expenditure Database"
    url: "https://www.sipri.org/databases/milex"
    note: "Military spending by state and year, used to test whether relative capacity relates to duration."

limitations:
  - "Conflict coding involves judgement. Where an episode starts and ends, and whether a recurrence is the same conflict, are contested calls made by the dataset's coders — not neutral facts."
  - "Right-censoring is severe for recent onsets. Any conflict active at the data cutoff contributes information about a minimum duration only."
  - "A base rate is not a forecast for a specific case. Structural similarity to past conflicts is a weak basis for prediction, and this analysis will not claim otherwise."
  - "Fatality thresholds in the conflict definition mean lower-intensity violence is excluded entirely, which systematically shortens some conflicts and omits others."
  - "Survival analysis describes the distribution of outcomes. It says nothing about the causes of termination, and reading a hazard ratio as a causal effect would be a mistake."

repro:
  note: "The datasets are public and freely downloadable for research use. The notebook covers episode construction, both recurrence codings, the Kaplan–Meier fits, and the proportional-hazards diagnostics."
  repo: ""
  tools: ["Python", "lifelines", "pandas", "matplotlib", "Jupyter"]
---

Reporting on an active conflict is necessarily about the last week. That produces a distorted sense of duration: every development reads as potentially decisive, and the question "how long might this run" gets answered by analogy to whichever previous war comes to mind.

There is a better answer available, because armed conflicts have been systematically coded since 1946.

## Why the average is the wrong number

Conflict duration is not normally distributed. Most conflicts end relatively quickly; a small number run for decades and dominate any mean.

Worse, the dataset is heavily **censored** — a substantial share of conflicts are still active whenever you draw the line. Computing an average duration across only the ones that have ended systematically understates how long conflicts last, because the longest ones are precisely the ones that haven't finished yet.

Survival analysis exists for exactly this problem. It uses the information in "this conflict has lasted at least *N* years and is ongoing" without pretending to know the final number.

## The question that actually matters

For anyone reasoning about a conflict already underway, the useful statistic isn't the median duration at onset. It's the **conditional** distribution: given that a conflict has already run three years, what does history say about the next three?

That number is often counterintuitive. For many hazard shapes, having lasted a long time is itself evidence that a conflict will last longer still — the structural features that produced a long war don't resolve on a schedule.

This is the part of the analysis I expect to be most useful and most uncomfortable.

## What this analysis will not do

It will not forecast any specific conflict. Base rates describe categories, and every active conflict has particulars that a structural dataset cannot capture — leadership, domestic politics, external commitments that change without warning.

Treating a survival curve as a prediction about a specific war would be a category error, and a genuinely harmful one given the subject. The output is a distribution and a set of conditional expectations, presented as context for reasoning rather than as an answer.

---

**Status: analysis in progress.** Methodology, sources, and limitations are published before results. Output will be Kaplan–Meier curves overall and stratified, the Cox model with diagnostics, and a conditional-duration table — with the notebook linked so the episode-coding choices can be inspected and disagreed with.
