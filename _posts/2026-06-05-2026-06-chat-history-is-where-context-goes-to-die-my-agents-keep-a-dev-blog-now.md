---
title: Chat history is where context goes to die – my agents keep a dev blog now
slug: 2026-06-chat-history-is-where-context-goes-to-die-my-agents-keep-a-dev-blog-now
date_published: 2026-06-05T21:10:00.000Z
tags: Katra, AI Workflows, Agents, Dev Log
cover_image: "/assets/blog/2026/junk-drawer-context.jpg"
---

**2026-08 Update:** *The little CLI in this post grew up, got renamed katra, and is now open source: [github.com/craigjmidwinter/katra](https://github.com/craigjmidwinter/katra).*

*Provenance, since it matters for a post about honest records: this was written up from the katra entries and drafts of the time and published in the August relaunch. Anything I know now but didn't know then is marked as a dated aside.*

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

**Screenshots, and how often that actually happens**

The other thing the instructions ask of the agents is a screenshot or a chart in every entry, because a picture forces them to actually run the thing. An agent that has to show you the working feature has a much harder time handing you code it never executed. It's a verification trick dressed up as a documentation habit. [My cat litter box used to tweet a photo of itself](/blog/2018-06-automatic-litterbox-notifications-using-an-home-assistant-and-node-red-with-an-external-rest-api/) for the same reason: a claim with a photo attached is a different class of claim.

I want to be careful about how hard I sell that, though, because it's a house rule and not a gate. Nothing in the tool refuses an entry that has no picture in it. It's a line in a markdown file telling the agent what a good entry looks like, and it holds about as well as any other line in a markdown file.

*(2026-08: I eventually measured, which I don't recommend doing on a good day. One project puts a visual in 83% of its entries using exactly the same CLI as everywhere else. Seven of my eleven projects have never shipped a single picture. The tooling isn't the blocker, the habit just never formed, and the tool's own log is where I found that out-- which makes it the least flattering telemetry I own.)*

The reusable bit under all of this, if you want it without the CLI: distill context at the moment it exists, into a place both you and the machine can retrieve it from. Chat is where context is born; it's a terrible place for it to live. A repo-resident chronicle with commit traceability turns "I think we decided this in a conversation a few weeks ago" into a grep, and you can get most of the way there with a `docs/` folder and a naming convention.

**What's still duct tape**

The CLI is early and shaped exactly like my own habits-- there's a live-reload viewer I'm fond of and hooks I'm still fighting with. I have some ideas about making commits refuse to happen without a draft entry, which is either a great idea or a turnstile I'll come to hate, and I'll report back either way. If you're doing something similar-- agent-maintained project journals, decision logs, anything in that family-- email me, I want to hear what stuck.
