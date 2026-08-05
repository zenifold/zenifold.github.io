---
layout: layouts/post.njk
title: "The Non-Engineer's Guide to Calling BS on a Technical Estimate"
description: "I have no engineering background and I've been evaluating technical work for twenty years. The skill isn't knowing how the system works — it's knowing which questions make a soft estimate fall apart."
date: 2026-07-30
tags: ["Craft", "Product"]
---

I have a computer science degree and I have never worked as an engineer. For twenty years I've been the person on the other side of the estimate — scoping it, funding it, and living with it.

That turns out to be its own skill, and it's not the one the degree gave me. What actually built it was deploying a few hundred things — more than 150 websites as a freelancer, plus a dozen products since — and being wrong in public often enough to develop instincts about where estimates go soft.

Here's the useful part: those instincts compress into questions. You don't need to understand the architecture to tell when an estimate is soft. You need to know which questions estimates fall apart under.

## First, the thing to internalise

**You are not trying to catch anyone lying.** Almost nobody is lying. Engineers give soft estimates for the same reason everyone does: the work is genuinely uncertain, and the uncertainty lives in places that are boring to explain to someone who didn't ask precisely.

Your job isn't to detect deception. It's to move uncertainty out of someone's head and onto the table where it can be planned around. Every question below is a way of doing that, and none of them work if you ask them in a tone that suggests you think you're being conned.

## The questions

### "What has to be true for this to be two weeks?"

The single most useful question I know.

A soft estimate is soft because it rests on assumptions the estimator hasn't said out loud — the API behaves like the docs claim, the data is as clean as everyone believes, the other team ships their part first. Asking what has to be *true* invites those assumptions into the open without challenging the number.

The answers are the actual risk register. And it's a collaborative question rather than an adversarial one: you're helping defend the estimate, not attacking it.

### "What's the part you're least sure about?"

Everyone has one. It's usually named instantly, and it's almost always where the schedule will actually break.

If the answer is "nothing, it's straightforward" and the estimate is longer than a week, something is being smoothed over — usually because the person thinks you don't want detail. Ask again, differently.

### "What would you cut if you had half the time?"

This one tells you three things at once.

You learn what's genuinely essential versus assumed. You learn whether the work decomposes at all — if the honest answer is "nothing, it's all or nothing," you have a monolithic risk that can't be de-scoped under pressure, which is worth knowing *before* you're under pressure. And you often discover that the half-time version is fine, and the other half was gold-plating nobody asked for.

### "Is that estimate for building it, or for it working?"

Different numbers. Frequently very different numbers.

"Building it" often means the happy path runs on a laptop. "Working" means error states, edge cases, someone else's data, load, monitoring, and the thing you do when it breaks at 2am. The gap between those two is where most schedule overruns actually live, and it's usually a gap in the *question*, not in the engineer's judgment.

### "What does 'we'd need to refactor that first' mean here?"

That sentence covers an enormous range — from half a day of tidying to a quarter-long project that touches everything.

Don't accept it as an atomic unit. Ask what specifically needs to change, what else touches that code, and what happens if you don't. Sometimes the answer is that it's genuinely blocking. Sometimes it's a long-standing irritation that's being attached to your project because your project has budget. Both are legitimate. They're just very different decisions and you should get to make it knowingly.

### "Who else has to do something for this to ship?"

Estimates are usually given for the estimator's own work. Dependencies get mentally discounted — not dishonestly, just optimistically, because other teams' timelines aren't vivid to you.

Every hand-off is a queue, and queues are where calendar time disappears. This question converts a two-week estimate into a two-week estimate *plus* an unknown wait, which is the number you should actually be planning with.

### "Has anyone here done this specific thing before?"

The difference between "we've built this kind of thing" and "we've built this thing" is enormous, and the language people use blurs it constantly.

Novel work isn't a reason not to do it. It's a reason to expect the estimate to be wrong in one direction and to build a checkpoint in early, so you find out in week one instead of week five.

## Two failure modes to avoid

**Don't turn this into an interrogation.** Ask all seven of these in one meeting and you'll get defensive, padded estimates forever after — people will protect themselves rather than inform you. Two questions, asked because you actually want the answer, will get you more than a checklist delivered at someone.

**Don't confuse confidence with accuracy.** A crisp, decisive answer feels better than a hedged one. It is not more likely to be true. The most accurate estimators I've worked with hedge constantly, because they're the ones who've been burned and remember it. Learn to hear an honest hedge as a good sign.

## What this is really doing

None of these questions require you to know how the system works. They work because they force the *implicit* parts of an estimate to become explicit — dependencies, assumptions, the definition of done, the parts nobody's done before.

That's also why this transfers. I've used the same seven questions on marketplace platforms, an enterprise content system across nine markets, fintech models, and AI tooling. The domain changed completely each time. Where the uncertainty hides did not.

It's worth saying that this matters more now, not less. AI is making execution dramatically cheaper — producing the code, the draft, the prototype costs a fraction of what it did. What stays expensive is judgment: knowing whether the thing that came back is any good, and whether it was worth building. That judgment is exactly what these questions exercise.

You get it by having built things and watched them fail in specific ways. My degree didn't teach me any of the seven questions above — shipping did. Which is oddly good news, because it means the skill is available to anyone willing to be wrong in public for a few years.
