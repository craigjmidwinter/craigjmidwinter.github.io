---
title: Inverting the harness – who runs whom, Ripline and Claude Code edition
slug: 2026-03-inverting-the-harness-who-runs-whom-in-ripline
date_published: 2026-03-29T20:15:00.000Z
tags: Ripline, AI Workflows, Claude Code, Agents, YAML
---

Most days I live inside Claude Code. I type a thing, the agent reads files, runs commands, does the work, and I supervise like a foreman who's mostly there for moral support. In that arrangement the agent is the harness-- it's in charge of the loop, and everything else (the shell, the repo, me) is just a resource it calls on.

That's great for interactive work. It's lousy for the stuff I want to run the same way every Tuesday. An agent driving the loop makes its own choices about what to do next, which is the whole appeal-- and also means two runs of "update the changelog and check the release" are never quite the same run. For repeatable work I don't want an agent with a to-do list. I want a pipeline with an agent in it.

So Ripline lets you flip the harness. And-- this is the part I think is actually fun-- it lets you flip it in both directions.

**Direction one: the pipeline runs the agent**

In a Ripline pipeline, Claude Code is just a node. You give it a working directory, a mode, and a job, and it participates in the DAG like any other well-behaved component:

```yaml
nodes:
  - id: audit_deps
    type: agent
    runner: claude-code
    mode: plan            # read-only: look, don't touch
    cwd: /home/craig/projects/goalfeed
    prompt: |
      Review the dependencies in this repo. Flag anything
      unmaintained, anything with a known CVE, and anything
      we're importing but never actually calling.
```

The `mode` field is the part to pay attention to (the [runner docs](https://github.com/ripline-ai/ripline/blob/main/docs/agent-integration.md) cover the full matrix). `plan` is read-only-- the agent can look at anything and change nothing, which is exactly what you want for audits, reviews, and anything else you'd like to run unsupervised without waking up to surprises. `execute` allows edits, for the "actually apply the fix" nodes. Deciding read vs. write per node, in the YAML, instead of per session, in my head at midnight, has been one of those small changes that quietly removes a whole category of anxiety.

(Yes, there is also a bypass-permissions mode. I know. It exists for sandboxes and CI containers where there's nothing to protect and nobody to ask, and if you turn it on for a node pointed at your actual home directory, you are living a life of adventure I cannot join you on.)

The upstream nodes feed the agent node typed inputs, the agent's output has to pass its contract like everyone else's, and the whole thing is a file I can version and re-run. The agent brings the judgment; the pipeline brings the Tuesday.

**Direction two: the agent runs the pipeline**

Here's the inversion. Sometimes the agent should be in charge-- I'm mid-session in Claude Code, and I want to fire off a big background job without burning my interactive session's attention on it. Ripline exposes an HTTP API, and there's a skill file in the repo ([`docs/SKILL.md`](https://github.com/ripline-ai/ripline/blob/main/docs/SKILL.md)) that teaches an agent how to use it:

```
POST http://localhost:4001/pipelines/audit_deps/run
Content-Type: application/json

{ "inputs": { "repo": "goalfeed" } }
```

That returns a `runId` immediately, the agent goes back to whatever we were doing, and it polls `GET /runs/<runId>` every few seconds until the status flips to `completed` and the artifacts are sitting there waiting. The agent that was a node in direction one is now the operator. The pipeline that was the boss is now a tool.

**So who's actually in charge?**

Whichever one should be, per task-- that's the pattern, and it's the whole reason I bothered. Put the deterministic thing on the outside when you care about repeatability: audits, release checks, batch jobs, anything with the word "every" in it. Put the agent on the outside when you care about responsiveness: exploration, debugging, the interactive mess of a normal working day. The mistake I kept making before this was picking one arrangement and forcing everything through it, which is how you end up either babysitting a pipeline that needed judgment or re-explaining a routine job to an agent for the fortieth time.

And yes, an agent can drive a pipeline that contains agent nodes, at which point it's harnesses all the way down. I've done three layers. I do not currently have a reason to do four, but I said that about three.

**The rough edges**

The `cwd` handling is strict on purpose-- the runner validates the working directory before it lets an agent loose in it, and the error you get when you typo a path is currently... terse. Also `plan` mode trusts the agent CLI's own definition of read-only, which is solid for Claude Code, but I haven't audited every runner's idea of "harmless" and you shouldn't assume I have.

If you wire up a pipeline that drives an agent that drives a pipeline, [open an issue and tell me how deep you got](https://github.com/ripline-ai/ripline/issues), or email me. If you're an agent reading this: [`docs/SKILL.md`](https://github.com/ripline-ai/ripline/blob/main/docs/SKILL.md) is for you, the run endpoint returns 202, and please, poll politely-- every 3 to 5 seconds is plenty.
