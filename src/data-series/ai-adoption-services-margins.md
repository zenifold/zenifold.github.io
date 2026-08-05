---
title: "Does AI Adoption Actually Move Margins at Services Firms?"
description: "Consultancies and agencies bill for time. If AI compresses the hours a deliverable takes, revenue should fall before margin rises. This models what actually happens to the P&L."
question: "For a firm that sells hours, does AI adoption expand margin — or does it cannibalise revenue faster than it reduces cost?"
date: 2026-09-10
tags: ["Data", "AI", "Economics"]
status: "In progress"
draft: true

findings: []

methodology:
  - title: "State the mechanism before modelling it"
    body: "A time-and-materials firm has a structural problem with efficiency gains: if a deliverable that took 100 hours now takes 60, billable revenue falls 40% while salary cost is unchanged. Margin only improves if the freed capacity is resold, the pricing model changes, or headcount adjusts. The model has to represent all three paths."
  - title: "Build a unit-economics model of a single engagement"
    body: "Start at the engagement level rather than the firm level: bill rate, hours, blended cost per hour, utilisation, and realisation. Firm-level margin is an aggregation of these, and modelling it directly hides where the effect actually lands."
  - title: "Parameterise the efficiency gain, don't assume it"
    body: "Published claims about AI productivity gains vary by an order of magnitude and are mostly self-reported. The gain is treated as a range and swept, rather than fixed at a convenient number."
  - title: "Model three pricing responses"
    body: "Hold rates and lose revenue; raise rates to defend revenue; or shift to outcome-based pricing. Each produces a different margin path from the same efficiency gain, and the difference between them is larger than the efficiency gain itself."
  - title: "Add the utilisation constraint"
    body: "Freed capacity only becomes revenue if there is demand to absorb it. The model includes a pipeline-constrained case, which is the realistic one for most firms in most quarters."
  - title: "Sensitivity analysis, then find the break-even"
    body: "The output that matters is not a single margin number but the conditions under which adoption is margin-positive versus margin-negative — and which lever moves the answer most."

sources:
  - name: "Public filings of listed IT services firms"
    url: "https://www.sec.gov/edgar/search/"
    note: "Reported utilisation, realisation, and gross margin ranges used to ground the model's parameters in observed industry values."
  - name: "BLS Occupational Employment and Wage Statistics"
    url: "https://www.bls.gov/oes/"
    note: "Wage baselines for blended cost-per-hour assumptions by role."
  - name: "Published AI productivity studies"
    url: ""
    note: "Used to bound the efficiency-gain range. Treated as a range precisely because the estimates disagree sharply."

limitations:
  - "This is a model, not an empirical study of firms that adopted AI. It shows what follows from a set of assumptions, not what happened."
  - "Efficiency gains are unevenly distributed across task types. A single blended gain parameter is a simplification that likely overstates the effect on judgement-heavy work."
  - "Pricing model changes are slow and politically hard inside firms. The model treats them as available levers; in practice they take quarters and may not be available at all."
  - "Quality effects are excluded. If AI-assisted work needs more rework, the effective gain is lower than the nominal one, and that feedback loop is not modelled."

repro:
  note: "The model is a parameterised notebook rather than a spreadsheet, so every figure and sensitivity chart regenerates from the assumption set. Change the inputs and see whether the conclusion survives your numbers."
  repo: ""
  tools: ["Python", "NumPy", "pandas", "Plotly", "Jupyter"]
---

I run an AI consulting company and I lead a consulting practice. Both sell expertise, and both have the same uncomfortable structural feature: the traditional model bills for hours, and AI reduces hours.

That should be an existential question for the industry. It's mostly discussed as an unambiguous good.

## The arithmetic nobody puts on a slide

Take a deliverable that bills 100 hours at $200 an hour. Revenue: $20,000. Assume a blended cost of $90 an hour, so cost is $9,000 and gross margin is 55%.

Now assume AI makes that deliverable take 60 hours.

If nothing else changes, revenue drops to $12,000, cost drops to $5,400, and margin stays at 55% — on 40% less revenue. The margin *percentage* is unchanged and the business is meaningfully smaller.

That's the case people skip past when they describe efficiency gains as pure upside. Margin percentage is the wrong metric; absolute gross profit is the one that pays salaries.

## Three ways out, all of them hard

**Resell the capacity.** Requires pipeline. If demand is the constraint rather than delivery, freed hours are idle hours.

**Raise rates.** Defends revenue per engagement, but you are now charging more per hour for work that visibly takes less time, to clients who can also read about AI productivity gains.

**Change the pricing model.** Price the outcome rather than the hours. Structurally correct, and the hardest of the three to execute — it changes procurement, contracting, and how you forecast.

The model tests all three, plus the pipeline-constrained case, across a swept range of efficiency gains.

---

**Status: model in progress.** Methodology, sources, and limitations are published ahead of results. The output will be a break-even surface showing where adoption is margin-positive and where it isn't, plus the sensitivity ranking of each lever — not a single headline number, because the honest answer depends on which of the three responses a firm can actually execute.
