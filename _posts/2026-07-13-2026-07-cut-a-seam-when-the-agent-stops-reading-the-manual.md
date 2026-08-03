---
title: Cut a seam – what I do when the agent stops reading the manual
slug: 2026-07-cut-a-seam-when-the-agent-stops-reading-the-manual
date_published: 2026-07-13T20:50:00.000Z
tags: Katra, AI Workflows, Agents, Context Engineering
---

**2026-08 Update:** *Katra is now open source: [github.com/craigjmidwinter/katra](https://github.com/craigjmidwinter/katra).*

Every project I work on has a CLAUDE.md-- the standing instructions the agent reads at the start of a session. And it does a pretty good job, right up until the session gets long enough that it doesn't. The agent starts missing things it knew an hour ago. House rules it followed all morning quietly stop applying.

My first instinct was to treat this as disobedience. It isn't-- it's a gauge. When the standing instructions start getting missed, that's the most reliable signal I've found that the context window is overfull and the conversation is past its best-before date. It's [my bed sensor](/blog/2018-05-making-my-dumb-bed-smart-home-assistant-bed-occupancy-sensor/) all over again: I didn't need a smarter mattress, I needed to notice when a number crossed a threshold and then actually act on it. The instructions-getting-missed moment is the threshold. The action is what this post is about.

**Don't push through. Cut a seam.**

When the signal fires, I stop asking for more work and ask for exactly one thing: distill. The agent updates the project's dev log with where things actually stand, and then it takes whatever we're mid-flight on and breaks it into handoff documentation-- either a single task file, or better, a set of smaller task files that a fresh agent can pick up cold. Small tasks are the win condition, because then I can run them in series with one agent or fan them out to several in parallel, depending on what they are.

The seam is the whole trick. A conversation doesn't get to trail off into a fog of degraded context; it ends at a deliberate cut, with its knowledge written down on the near side, so the next session starts sharp instead of starting confused.

**Tasks grew into a real model**

Doing this by hand for a few weeks taught me the handoff files wanted structure, so katra (the dev log tool-- [previously](/blog/2026-06-chat-history-is-where-context-goes-to-die-my-agents-keep-a-dev-blog-now/), back when it was called devlog) now has a proper node model I've been calling the almanac: tasks, epics, decisions, and articles, cross-referenced with wikilinks, with a board view over top.

```
katra task new "Serialize config writes" --epic scheduler-recovery
katra decide "Workers claim runs atomically; recovery only promotes stale claims"
```

Tasks link to the entries that advanced them, decisions link to the tasks they constrain, and epics compute their status by rolling up their child tasks-- nobody updates an epic's status by hand, because a status field a human maintains is a status field that's wrong. When a seam gets cut, the distillation has somewhere to land: the fog becomes tasks on a board instead of a paragraph of vibes in a handoff doc.

**The pattern**

Treat instruction-drift as a sensor reading, not a discipline problem, and respond with a routine instead of frustration: distill, cut, restart fresh. The general shape is one I keep coming back to-- find the observable signal that a system is degrading, put a threshold on it, and attach a documented action to the threshold. That was true for [a litter box in 2018](/blog/2018-06-automatic-litterbox-notifications-using-an-home-assistant-and-node-red-with-an-external-rest-api/) and it's true for a context window now, which either says something profound about engineering or something concerning about me.

**Loose ends**

The almanac is a week old and the board view is ugly in ways I'm choosing not to screenshot. I also don't have the seam-cutting itself automated yet-- I still notice the drift by feel, and I'd love a real detector (instruction-recall canaries? periodic quiz questions? if you've built one, email me). And there's one more enforcement idea I've been circling: what if the commit itself refused to happen without the chronicle? More on that soon.
