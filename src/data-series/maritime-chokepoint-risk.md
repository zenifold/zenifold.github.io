---
title: "How Concentrated Is Global Trade in a Handful of Chokepoints?"
description: "Supply chain risk is usually discussed qualitatively. This quantifies it — measuring how much of global seaborne trade depends on a small number of straits, and what a closure actually costs in transit time."
question: "What share of global seaborne trade passes through the top maritime chokepoints, and how much rerouting capacity exists if one closes?"
date: 2026-10-01
tags: ["Data", "Geo-strategy"]
status: "In progress"
draft: true

findings: []

methodology:
  - title: "Define the chokepoint set from geography, not headlines"
    body: "Select straits by structural necessity — no viable alternative route within a defined detour threshold — rather than by recent news coverage. Selection criteria are fixed before pulling volume data so the set isn't shaped by which chokepoint happens to be in the news."
  - title: "Quantify throughput by commodity class"
    body: "Aggregate transit volumes for crude, refined products, LNG, and containerised goods separately. A strait that carries 20% of LNG and 3% of containers is a different kind of exposure, and blending them into one 'trade share' figure hides the thing that matters."
  - title: "Compute detour cost, not just closure probability"
    body: "Risk is exposure times consequence. For each chokepoint, calculate the shortest viable alternative route and express the penalty in additional sea days and distance — the operational cost of a closure, independent of how likely one is."
  - title: "Convert detour days into effective capacity loss"
    body: "Longer voyages absorb tonnage. A fleet re-routing around a closure loses effective capacity proportional to added transit time, which is the mechanism that turns a regional incident into a global price move."
  - title: "Build a concentration index"
    body: "Apply a Herfindahl-style measure across routes per commodity class to give a single comparable concentration figure, so exposure can be compared between oil and containers on the same scale."
  - title: "Stress test single-chokepoint closure"
    body: "Model closure of each chokepoint individually and report the resulting capacity loss by commodity. Deliberately not modelling simultaneous closures — correlated multi-strait scenarios require assumptions about causation that the data cannot support."

sources:
  - name: "US EIA — World Oil Transit Chokepoints"
    url: "https://www.eia.gov/international/analysis/special-topics/World_Oil_Transit_Chokepoints"
    note: "Published transit volumes for crude and refined products through major straits."
  - name: "UNCTAD Review of Maritime Transport"
    url: "https://unctad.org/topic/transport-and-trade-logistics/review-of-maritime-transport"
    note: "Global seaborne trade totals and fleet capacity, used as the denominator."
  - name: "Suez Canal Authority / Panama Canal Authority traffic statistics"
    url: ""
    note: "Official transit counts and tonnage for the two managed canals, including drought-related restriction periods."
  - name: "NOAA / GEBCO bathymetry and coastline data"
    url: "https://www.gebco.net"
    note: "Underlying geography for computing viable alternative routes and detour distances."

limitations:
  - "Route distances are computed on great-circle paths adjusted for landmass, not on actual commercial routing, which follows weather, piracy risk, insurance terms, and canal fees."
  - "Transit volume data is published at annual or monthly granularity and lags. This measures structural exposure, not live conditions."
  - "Closure is treated as binary. Real disruptions are usually partial — draft restrictions, convoy delays, insurance repricing — and partial disruption is harder to model and more common."
  - "Vessel-class constraints are simplified. Some alternative routes are unavailable to the largest vessels regardless of distance, which understates the penalty for those classes."
  - "The concentration index is descriptive. It says nothing about the probability of any given closure, and should not be read as a forecast."

repro:
  note: "Routing computations and the concentration index are in the notebook. All inputs are public; the geodesic routing step is the slowest part and is cached."
  repo: ""
  tools: ["Python", "GeoPandas", "Shapely", "NetworkX", "matplotlib"]
---

Supply chain fragility became a boardroom topic in 2021 and has mostly been discussed in adjectives since. "Fragile," "exposed," "resilient." Very little of that discussion attaches a number to the exposure.

This analysis quantifies it: how much of global seaborne trade structurally depends on a small number of straits, and what it actually costs when one becomes unavailable.

## Why exposure alone is the wrong measure

A chokepoint carrying a large share of trade isn't automatically high risk. What matters is whether there's an alternative.

A strait carrying 15% of a commodity with a two-day detour available is an inconvenience. One carrying 8% with a fourteen-day detour is a systemic problem, because the detour itself destroys effective fleet capacity — every ship spends longer at sea, so fewer voyages happen per year with the same tonnage.

That second-order effect is the mechanism by which a regional closure becomes a global price event, and it's why this analysis computes detour cost per chokepoint rather than stopping at throughput share.

## What separates this from the usual treatment

Three things:

**Commodity classes stay separate.** Crude, LNG, and containers have different routes, different vessel constraints, and different substitutability. A single blended "share of world trade" figure is the most common way this topic gets flattened into something meaningless.

**Consequence is measured, not asserted.** Additional sea days is a concrete, checkable number. "Highly exposed" is not.

**No multi-chokepoint scenarios.** Modelling simultaneous closures requires assumptions about what would cause them, and those assumptions would be doing all the work. The analysis stops at single-closure stress tests and says so.

---

**Status: analysis in progress.** Methodology, sources, and limitations are published before results. Output will be a per-chokepoint exposure and detour-cost table, concentration indices by commodity class, and single-closure capacity-loss estimates — with the routing notebook linked so the detour figures can be checked directly.
