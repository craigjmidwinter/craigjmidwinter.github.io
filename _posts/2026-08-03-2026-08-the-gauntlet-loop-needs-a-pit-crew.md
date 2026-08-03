---
title: The gauntlet loop needs a pit crew
slug: 2026-08-the-gauntlet-loop-needs-a-pit-crew
date_published: 2026-08-03T18:30:00.000Z
tags: AI Workflows, Multi-Agent, Agents, Testing, Loop Engineering
---

I've been running a lot of gauntlet loops lately. If you haven't met the pattern, it's Matt Shumer's coinage-- [his own write-up](https://somethingbig.ai/gauntlet-loop) is the source to read, and [Claude of Duty](https://github.com/mshumer/Claude-of-Duty) is the demonstration that made it famous: a Call of Duty-style FPS in Three.js, built from a single published prompt. The shape: a lead agent gets an ambitious goal and a concrete reference for quality, decomposes the work into separately judgeable pieces, builders build, and fresh-context critics compare the actual artifact against the reference-- blind A/B where possible-- looping on the largest gap until the thing meets the bar or you hit your cost ceiling. Shumer's own emphasis is that the bar is the most important part: "make it amazing" fails, actual Call of Duty screenshots work. (There's also a broader [survey of the loop-engineering family](https://www.thepromptindex.com/ai-loop-engineering-gauntlet-loop-guide.html) if you want the landscape.) It's a genuinely good pattern, and the separation of builder from critic fixes the "grading your own homework" problem I've [ranted about before](/blog/2026-05-two-models-have-to-agree-before-anything-ships-quorum-review-in-ripline/).

But after enough laps I noticed where my loops actually spend their time, and it's not building and it's not judging. It's the space between-- critics squinting at an artifact trying to decide *how* to compare it to the reference, and builders receiving feedback like "the pacing feels off in the second section" and having to guess what, mechanically, to change. The loop's speed limit isn't intelligence. It's measurement.

Human teams solved this a long time ago, and not by hiring better critics. They hired people who build test rigs, staging environments, and dashboards. So my gauntlet loops now have a third role, and I've been calling the variant what it obviously is:

**The pit crew loop**

Builder, critic, and pit crew. The pit crew doesn't drive and doesn't judge the driving. Its entire job is instrumentation and tooling-- making the next lap faster and the judging more accurate:

- **Turn the reference into executable checks.** Before the builders start, the pit crew's first task is converting the quality bar into acceptance and e2e tests wherever it can. "Matches the reference" becomes a suite that runs in seconds, and a whole class of critic deliberation just evaporates-- the artifact passes or it doesn't, and critics save their judgment for the parts that genuinely need taste.
- **Build purpose-specific harnesses.** Replay rigs, fixture generators, a screenshot bot that produces the blind A/B pair automatically, a script that spins the artifact up in the exact configuration critics need to see. Whatever removes manual steps between "builder finished" and "critic judging real output."
- **Put numbers on the vague stuff.** Latency budgets, bundle sizes, phase timings, error rates. Not because numbers are the whole story, but because "the largest gap"-- the thing the gauntlet iterates on-- should be identified by measurement where possible, not by whichever critic wrote the most confident paragraph.

And one standing rule that does most of the work: **any note a critic gives twice becomes a check the pit crew automates.** Complaints are instrument requests in disguise. The second time a critic writes "the export is missing the header row again," that sentence is done being feedback and starts being a test.

**This keeps working on me in real life**

When I put a pipeline in charge of tailoring my resume, the unlock wasn't a better writer agent-- it was a little harness that renders the PDF and then parses it *back out* the way an applicant tracking system would. Critics stopped debating font vibes and started reading parse output. In Multicam Toolbox, per-run metrics with phase timing are what turn "the tool feels slow on long episodes" into "the diarization phase is 80% of the wall clock, go stare at that." Same shape both times: the instrument did more for iteration speed than any amount of added cleverness.

**The failure modes, because there are two good ones**

First: the pit crew can gold-plate. An agent asked to build tooling will, with complete sincerity, construct a beautiful dashboard nobody requested-- the gauntlet's cost boundary has to apply to instruments too, and "does this measurement change what the builder does next lap" is the test. Second: builders optimize what you measure, with all the monkey-paw energy that implies. The fresh-context integration critic at the end stays essential precisely because it judges the whole artifact and not the scoreboard. Instruments narrow the argument; they don't end it.

**The pattern**

In an agent loop, tokens get spent on judgment or on measurement, and only one of those compounds. Judgment evaporates when the session ends. A test, a harness, a metric-- those are still there on lap forty, still there next month when a completely different loop runs against the same project. The pit crew is the only role in the gauntlet whose output makes every *future* lap cheaper, which is why it deserves a dedicated seat instead of being something builders do reluctantly on the side.

I've been running this as a dedicated phase in my [Ripline](https://github.com/ripline-ai/ripline) pipelines-- pit crew lap first, then the build/critique cycle-- and I'm still tuning where the crew's budget should cap out. If you try a pit crew loop, or you've got a better name for it, email me. Especially if you've got a better name. I've been staring at this one long enough to love it, which is exactly when someone should stop me.
