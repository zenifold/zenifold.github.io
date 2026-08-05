---
layout: layouts/post.njk
title: "AI Belongs in the Product, Not the Pitch Deck"
description: "The useful test for an AI feature isn't whether you can build it. It's whether it moves a number somebody already cared about before you showed up — a test that kills most AI features at the whiteboard."
date: 2026-06-18
tags: ["AI", "Product"]
---

Every company I talk to has an AI initiative. Most of them have an AI slide. Fewer have an AI feature that anyone uses twice.

The gap between those three things is worth being precise about, because the failure isn't technical. The models work. The failure is that a lot of AI work starts from *what could we do with this* rather than from a problem someone was already losing sleep over.

## The test

Here's the one I use: **does it move a number somebody already cared about before you arrived?**

That's a harsh filter and it's supposed to be. It kills most AI features at the whiteboard, which saves a quarter of engineering time. And the ones that survive it tend to be unglamorous — they look less like a demo and more like a workflow that quietly got shorter.

If nobody was tracking the metric before the AI showed up, the AI isn't the reason it moved. It's the reason you started measuring.

## Most of the good work is internal

The AI work I'm proudest of isn't customer-facing.

At SourceFuse I lead AI product innovation across delivery: a user story generator, infrastructure-as-code scaffolding, automated code review. None of that shows up in a product demo. All of it compounds. Tooling that gives six product managers and their teams back hours every week outperforms a customer-facing feature that impresses once and then sits there.

Earlier, at People Rocket, an AI-powered QA tool cut critical deliverable errors by 65%. That number is only achievable because we pointed it at something painful and already-counted. Nobody had to be convinced the errors mattered — they'd been arguing about them for a year. The AI just got to be the thing that fixed it.

Internal tooling is unglamorous, hard to put in a press release, and usually the highest-ROI AI work available to a company. It's also the safest place to learn what these systems are actually good at, because your users are twelve feet away and will tell you immediately when it's wrong.

## Where it's the product itself

The customer-facing version follows the same rule, it just has higher stakes.

For the world's largest QSR, I led the design of a logistics platform where AI drove predictive ordering. Forecasting demand in that context has an immediate physical consequence — inventory that either exists or doesn't, waste that either happens or doesn't. There was no ambiguity about whether a better forecast was worth having.

At Relief Financial, improving ML prediction accuracy by 35% for debt and credit risk mattered because the model's output *was* the product. Not a garnish on it. When the prediction is the thing you're selling, accuracy stops being a technical metric and becomes a product spec — and someone has to decide what "accurate enough" means for the decision being made. That's a product call, not an ML one.

## The part everyone underestimates

Here's what I've watched sink more AI features than bad models: the human loop.

A prediction nobody trusts doesn't get used. A prediction nobody can override gets routed around — people build a spreadsheet next to your system and run the business from that instead. Both failures look identical in your analytics, which show a feature with low engagement, and both get diagnosed as "we need better UX."

Deciding where a human stays in the loop is a product decision. It usually determines whether the system survives contact with the people who have to run it. Design the override before you design the model.

## Execution got cheap; judgment didn't

The broader shift is that AI is making execution dramatically cheaper. Producing the artifact — the code, the copy, the first draft of the plan — costs a fraction of what it did.

Which means the scarce thing is no longer production. It's judgment: knowing which artifact was worth producing, and whether what came back is any good. That skill comes from having shipped things and watched them fail in specific ways. It doesn't come from the tool.

The companies that get value from AI in the next few years won't be the ones with the best models. They'll be the ones whose people can tell the difference between output and progress.
