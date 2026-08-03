---
title: No draft, no commit – katra, the dev log my agents have to keep
slug: 2026-07-no-draft-no-commit-katra-the-dev-log-my-agents-have-to-keep
date_published: 2026-07-16T21:20:00.000Z
tags: Katra, AI Workflows, Dev Log, Git, Agents
---

**2026-08 Update:** *Katra is now open source: [github.com/craigjmidwinter/katra](https://github.com/craigjmidwinter/katra).*

The last post on this blog before this year was from 2018. It's about my cat's litter box. In the eight years since, I built an MLOps platform, a commercial video editing tool, and a small army of agent infrastructure, and I wrote up approximately none of it-- because the write-up always happens "after", and after is a place I have never once visited.

The lesson I finally accepted: I don't have a writing problem, I have a sequencing problem. If the chronicle happens after the work, it doesn't happen. That's why [my agents keep a dev blog in every project](/blog/2026-06-chat-history-is-where-context-goes-to-die-my-agents-keep-a-dev-blog-now/) and why [long sessions end in a deliberate seam](/blog/2026-07-cut-a-seam-when-the-agent-stops-reading-the-manual/). This post is the final piece of that arc, and the one I threatened at the end of both: making the chronicle structurally impossible to skip.

**Quick recap for new arrivals**

Katra lives inside the repo it documents-- one markdown file per entry, media alongside, and a draft is simply an entry that doesn't have a commit hash yet. There's no separate "publish" step to forget. When you commit the code, `katra stamp` writes the hash and diffstat into the frontmatter, and the draft becomes history:

```yaml
---
title: Teaching the scheduler about stale runs
date: "2026-07-14"
tags: [scheduler, recovery]
hash: 5ddc0f5
stat: {f: 12, a: 340, d: 50}
---
```

Every entry is pinned to the exact commit it describes. The dead ends and the screenshots are in there because they were captured while they were happening, not reconstructed three weeks later by a guy who no longer remembers why the first approach failed.

**The enforcement: no draft, no commit**

Here's the part that separates this from every journal I've abandoned. `katra check` exits non-zero if code is staged and there's no active draft, and it's wired into a commit-gate hook. The commit physically does not proceed until something has been written down. It is a bureaucratic turnstile of my own construction, and I resent it several times a week, and it works. Willpower is a terrible dependency to build on-- I should know, I've read my own snooze-button statistics.

**Then the agents started doing the committing**

This is where it got interesting. These days a big share of my commits are made by coding agents, and an agent will blow past a "you should really write this down" convention even faster than I will. So the gate binds them too, and they get one extra obligation I don't: `katra reconcile`, where the agent has to declare how the work it just finished relates to the task board. Advance a task, close a task, or explicitly state that this work advances no task-- with a reason. No shrugging.

```
katra reconcile --close scheduler-stale-runs
katra reconcile --no-task --reason "drive-by fix, found while reading the claim path"
```

That `--no-task --reason` line is quietly my favourite feature. Agents love doing little unrequested side quests, and I don't want to forbid that-- I want a paper trail of it. There's also `katra memory`, which ingests Claude Code's own memory files into a ledger, so the things the agent decided to remember get reviewed instead of accumulating in the dark.

**The pattern**

Put the chronicle in the exit path, not on a to-do list. Anything you want to *always* happen has to be structural-- a gate the work physically passes through-- because discipline doesn't survive contact with a deadline, and it definitely doesn't survive delegation to a model whose enthusiasm for your documentation conventions resets every session. This blog's eight-year gap is what the honor system produces. The gate is what produces entries.

**The rough edges**

~~Katra isn't public yet~~ (it is now, see the note up top)-- it's still shaped a little too much like my own workflow, and I renamed the whole thing once already (it spent its first six weeks as "devlog", which is a fine name for a tool and a terrible name to search for). The automation around the hooks also spent a while failing invisibly, which for a tool whose entire job is making things visible was a genuinely embarrassing week. If you want to see it when it opens up, or you've built your own version of a commit turnstile, email me-- I'd love to compare notes.
