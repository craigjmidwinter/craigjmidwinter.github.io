---
title: Chat history is where context goes to die – my agents keep a dev blog now
slug: 2026-06-chat-history-is-where-context-goes-to-die-my-agents-keep-a-dev-blog-now
date_published: 2026-06-05T21:10:00.000Z
tags: Katra, AI Workflows, Agents, Dev Log
---

**2026-08 Update:** *The little CLI in this post grew up, got renamed katra, and is now open source: [github.com/craigjmidwinter/katra](https://github.com/craigjmidwinter/katra).*

There's a tempting idea that your agent's chat history is a project archive-- scroll back far enough and every decision you ever made is in there somewhere. And it is in there. So is everything else. Chat history is the junk drawer of context: the decision you need is definitely in it, underneath four hundred lines of the agent narrating a test run and that one time you asked it to explain a regex at 1am. I kept believing I'd go digging when it mattered, and I kept not doing it, because nobody greps a junk drawer.

**Set up a dev blog for every project. Your agents maintain it.**

Not a public blog-- an internal one, living in the repo, written as the work happens. Articles about important decisions, features, and dead ends, with screenshots. Mine is tied to git commits for traceability: every entry gets stamped with the hash and diffstat of the work it describes, so "why does the scheduler do this weird thing" has an answer with a date, a picture, and a commit attached.

The tooling is a little CLI I built (working name: devlog-- naming things is hard and I refuse to rush it). The core of it:

```
devlog new "Recovery kept double-claiming workers"
devlog capture before.png
devlog append "The dedupe fix. Note the config write is now serialized."
# ...commit the code...
devlog stamp     # entry gets the hash + diffstat, moves from draft to log
```

One markdown file per entry, YAML frontmatter, media alongside in the repo. No database, no separate app, greppable like everything else you own.

**The part that made me actually build it: the blog is for the agent too**

Here's the thing I underrated at first. A distilled, organized project chronicle isn't just for future-me-- it's *retrievable by the agent*. When a fresh session needs to know why the config writes are serialized, it doesn't need to archaeology its way through old conversations that it can't see anyway. It reads the entry, which is two paragraphs and a screenshot instead of nine thousand tokens of meandering transcript. You're not writing documentation, you're precomputing context.

**Screenshots as a lie detector**

The other reason my project memory insists the agents capture screenshots and charts as they write entries: it forces them to actually run the thing. An agent that has to attach a picture of the working feature to its write-up cannot quietly hand you code it never executed-- the entry won't have anything to show. It's a verification mechanism dressed up as a documentation habit, and it catches real nonsense weekly. [My cat litter box used to tweet a photo of itself](/blog/2018-06-automatic-litterbox-notifications-using-an-home-assistant-and-node-red-with-an-external-rest-api/) for the same reason: a claim with a photo attached is a different class of claim.

**The pattern**

Distill context at the moment it exists, into a place both you and the machine can retrieve it from. Chat is where context is born; it's a terrible place for it to live. A repo-resident chronicle with commit traceability turns "I think we decided this in a conversation a few weeks ago" into a grep.

**Loose ends**

The CLI is early and shaped exactly like my own habits-- there's a live-reload viewer I'm fond of and hooks I'm still fighting with. I have some ideas about making commits refuse to happen without a draft entry, which is either a great idea or a turnstile I'll come to hate, and I'll report back either way. If you're doing something similar-- agent-maintained project journals, decision logs, anything in that family-- email me, I want to hear what stuck.
