---
title: "What the Base Rates Say About Capital-Intensive IPOs"
description: "Every hyped listing of an infrastructure-heavy company gets analysed as a special case. Four decades of IPO data say the category behaves consistently enough to forecast — and the pattern is not the one the coverage implies."
question: "Do capital-intensive infrastructure companies — launch, telecom buildout, semiconductors, energy — systematically under- or over-perform on listing, and does the pattern differ from asset-light tech?"
date: 2026-09-24
tags: ["Data", "Economics", "Markets"]
status: "In progress"
draft: true

findings: []

methodology:
  - title: "Define the category by cost structure, not by sector label"
    body: "\"Infrastructure-heavy\" is classified by capex intensity and fixed-asset ratio at listing, not by SIC code. A satellite operator and a fab have more in common economically than a fab and a fabless designer, and sector labels obscure that."
  - title: "Build the sample from four decades, not the recent memorable ones"
    body: "The entire point of a base rate is that it includes the listings nobody remembers. Sampling from famous IPOs is the error the analysis exists to correct — survivorship bias runs in both directions here."
  - title: "Separate first-day pop from long-run return"
    body: "Underpricing and long-run performance are different phenomena with different causes. A stock can pop 40% on day one and still trail the market over three years; conflating them produces most of the bad commentary in this area."
  - title: "Benchmark against style-matched portfolios"
    body: "Compare each listing to a matched portfolio on size and book-to-market rather than to a broad index, so the result isn't just a restatement of a known factor premium."
  - title: "Use buy-and-hold abnormal returns with bootstrapped intervals"
    body: "Long-run IPO performance is notoriously sensitive to the return measure. Report BHAR alongside calendar-time portfolio returns, and if the two disagree, say so rather than picking the one with the better story."
  - title: "Test the capital-intensity gradient"
    body: "The interesting result isn't a single average. It's whether performance varies monotonically with capex intensity — and whether there's a threshold beyond which the market systematically misprices the buildout period."

sources:
  - name: "Jay Ritter's IPO data (University of Florida)"
    url: "https://site.warrington.ufl.edu/ritter/ipo-data/"
    note: "The standard long-run IPO dataset — listing dates, proceeds, and long-run returns going back to the 1970s."
  - name: "SEC EDGAR"
    url: "https://www.sec.gov/edgar/search/"
    note: "S-1 filings for capex intensity, fixed-asset ratios, and stated use of proceeds at the time of listing."
  - name: "Kenneth French Data Library"
    url: "https://mba.tuck.dartmouth.edu/pages/faculty/ken.french/data_library.html"
    note: "Factor returns and size/book-to-market breakpoints for building style-matched benchmarks."

limitations:
  - "Capex intensity at listing is a snapshot. Companies that pivot toward or away from asset-heavy models after IPO are misclassified for the rest of the window."
  - "The sample is US listings. Applying the base rate to a listing on another exchange, or to a direct listing rather than a bookbuilt IPO, is an extrapolation."
  - "Long-run abnormal return estimates are sensitive to the benchmark and the return-aggregation method. This is a genuine methodological dispute in the literature, not a settled question."
  - "Base rates describe a category. They cannot tell you whether a specific company is the exception, and the whole marketing case for any given listing is that it is."

repro:
  note: "Sample construction, classification rules, and both return measures are in the notebook. The classification thresholds are the most contestable choice — they're parameterised so you can move them and see whether the conclusion holds."
  repo: ""
  tools: ["Python", "pandas", "statsmodels", "matplotlib", "Jupyter"]
---

Every few years a company with enormous fixed costs and a compelling story approaches the public markets, and the coverage treats it as unprecedented. Sometimes it is. Usually the economics are a known category with a measurable history.

This analysis asks what that history says.

## Why the category matters more than the company

Capital-intensive businesses share a specific problem at listing: the spending happens years before the revenue, so at the moment of IPO the accounts look their worst and the story has to carry the valuation.

That's not a criticism — it's structurally true of anything that has to build physical capacity before it can sell. Rail, telecom buildout, semiconductor fabs, satellite constellations, and energy infrastructure all share it. What differs is how consistently markets have priced that gap.

If the market systematically misprices the buildout period in one direction, that's a base rate worth knowing before you form a view on any individual listing.

## The two questions people conflate

**Underpricing** — does the stock pop on day one? This is mostly about how the offering was priced and allocated, and it's a transfer between the issuer and the initial buyers.

**Long-run performance** — does it beat a comparable portfolio over three to five years? This is about whether the market's initial assessment was right.

These are different questions with different answers, and most commentary treats a large first-day pop as evidence about the second. It isn't. A company can be badly underpriced by its bankers and still be a poor long-run holding, or vice versa.

## What would make this analysis wrong

The honest failure mode: capital intensity might not be the variable that matters. It could be a proxy for something else — sector, era, interest-rate environment at listing, or simply company age.

The analysis tests the gradient across capex intensity specifically, and includes era and rate controls, precisely so the result can come back as "this variable does nothing once you control for X." That's a publishable finding and it's the one I'd bet against my own hypothesis on.

---

**Status: analysis in progress.** Methodology, sources, and limitations are published before results, so the conclusion can't drift toward the more interesting story. Findings, the capex-intensity gradient, and both return measures will be added on completion with the notebook.
