---
layout: layouts/post.njk
title: "I Rebuilt My Site to Be Read by Machines"
description: "Search engines send people to your site. AI systems answer questions about you without ever sending anyone. That's a different job, and it needs different plumbing — here's exactly what I built."
date: 2026-08-04
tags: ["AI", "Craft"]
---

For twenty years the job of a personal site was to rank, get clicked, and convert. That job still exists. But a second one has quietly appeared alongside it: increasingly, a machine reads your site, forms a view about who you are, and answers questions on your behalf to someone who never visits.

You don't get a click from that. You don't get analytics on it. You find out it happened when someone repeats a description of you that you didn't write.

So when I rebuilt this site, I treated "legible to machines" as a first-class requirement rather than an afterthought. Here's what that actually meant, in the order it mattered.

## 1. Static HTML, because most AI crawlers barely run JavaScript

This is the least glamorous decision and by far the most important.

Google renders JavaScript, slowly and imperfectly. Most AI crawlers largely don't. A single-page app that Google eventually indexes can look close to empty to a crawler that fetches your HTML and moves on. Everything else in this post is worthless if the content isn't in the initial response.

I build with Eleventy, which outputs plain static HTML. Any static generator does the job. The test is simple: `curl` your own URL and see whether your content is in what comes back. If it isn't, nothing downstream matters.

## 2. An entity graph, not just "some schema"

Most sites that bother with structured data drop in a disconnected `Person` blob and call it done. That doesn't do the thing you want.

What you want is for a machine to be able to conclude: *this site, this LinkedIn profile, this GitHub account, and this company are all the same person.* That's an entity resolution problem, and the mechanism is `sameAs` plus stable `@id` references tying your objects together.

```json
{
  "@type": "Person",
  "@id": "https://example.com/#person",
  "name": "…",
  "sameAs": [
    "https://www.linkedin.com/in/…",
    "https://github.com/…"
  ],
  "worksFor": [{ "@type": "Organization", "name": "…", "url": "…" }]
}
```

Two things I'd emphasise from doing this:

**`sameAs` is an identity claim, so only claim what you control.** A link pointing at a profile you don't own is worse than no link. I filter placeholder URLs out of every generated file for exactly this reason — an unfinished `github.com/TODO` in your structured data is a broken assertion, not a harmless stub.

**Join your objects with `@id`.** A `Person`, a `WebSite`, and a `BlogPosting` that all reference each other read as one coherent graph. Three loose objects on three pages read as noise.

## 3. A disambiguation page

Murphy is a common surname. There is more than one of me, and a machine trying to answer "who is Max Murphy" has to pick.

So there's a page that says plainly which one I am: the product strategist in Roanoke, Virginia, founder of SINSA, previously at PayPal and Cognizant — and it lists the corroborating profiles. It also states that I appear as both *Max* and *Maximilian*, because my LinkedIn says one and this site says the other, and nothing else would connect them.

This is the highest-value page on the site per word written, and almost nobody has one. If you have a common name, write it this week.

## 4. Machine-readable versions of everything

An agent asked "what does this person do" shouldn't have to scrape prose out of HTML. So the same content is published in formats built for parsing:

| Endpoint | What it is |
|---|---|
| `/resume.json` | Career history in the JSON Resume schema |
| `/api/profile.json` | Everything, flat, plus links to the other formats |
| `/llms.txt` | A plain-text index of the site for language models |
| `/llms-full.txt` | The entire site as one document |
| `/feed.json`, `/feed.xml` | The blog, two ways |

The design rule that made this worth doing: **every representation points at the others.** An agent that finds any one of them can discover the rest. A lone JSON file nobody links to is a file nobody finds.

Be honest with yourself about which of these are standards and which are conventions. JSON Resume, JSON Feed, Atom, and schema.org are established with real parsers behind them. `llms.txt` is a proposed convention that no major AI vendor has committed to. It costs one generated file, so I ship it as cheap insurance — not because I think it's load-bearing.

## 5. Deciding about the crawlers

`robots.txt` forces a decision most people avoid: do you let AI crawlers in?

Allowing `GPTBot`, `ClaudeBot`, `PerplexityBot` and the rest is how you get represented in AI answers. It's also how your writing enters training data. Those are the same door.

I allow them, because the entire point of this exercise was to be legible to machines and blocking them contradicts it. But it's a real trade-off with reasonable people on both sides, and it should be a decision rather than a default.

## 6. Writing so that passages survive extraction

This is the part that isn't plumbing.

An AI answering a question about you lifts a passage. It doesn't lift your page's argument, your build-up, or your carefully placed context three paragraphs earlier. So the sentences that describe you need to be **self-contained**.

Practical version: write your bio, your FAQ answers, and the first paragraph of every page so they stand alone with no antecedent. "He led the platform" is useless out of context. "Max Murphy led PayPal's enterprise content management platform across nine markets" survives being cut out and pasted anywhere.

The FAQ format is unreasonably effective here, because a question-and-answer pair is *already* the shape of the thing a model is looking for. Mark it up as `FAQPage` and you've handed over pre-formatted answers.

## What I'd tell you to do first

If you do only three things:

1. **Serve static HTML.** Everything else depends on it.
2. **Write a disambiguation page** and link your real profiles from it with `sameAs`.
3. **Rewrite your bio so it stands alone**, then make sure that same text appears in your structured data.

That's an afternoon. The rest — the JSON endpoints, the feeds, `llms.txt` — is a nice-to-have you can add later.

The underlying shift is worth sitting with, though. For two decades, being findable meant being ranked. It's starting to mean being *described correctly by something you'll never see*. The plumbing above is just what it takes to have a say in that description.
