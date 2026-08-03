---
title: Adding bureaucracy and red tape to my agents – structured artifacts and node contracts in Ripline
slug: 2026-03-adding-bureaucracy-and-red-tape-to-my-agents-structured-artifacts-in-ripline
date_published: 2026-03-15T21:40:00.000Z
tags: Ripline, AI Workflows, Multi-Agent, YAML, Programming
---

I have a bad habit of kicking off multi-step agent runs before bed. There's something great about waking up to finished work-- and something uniquely deflating about waking up to four completed pipeline steps that all ran perfectly on top of garbage produced in step one.

That's what kept happening. I'd chain a few agent calls together: one drafts a plan, one turns the plan into tasks, one estimates the tasks. Each agent did its job beautifully. The problem was the handoffs. The planning agent would decide, helpfully and without telling anyone, that today the plan should be prose instead of a list. The task agent would receive an essay where it expected bullet points, shrug, and produce something task-shaped anyway. By step four the run was confidently summarizing a hallucination. Nothing errored. Everything was wrong.

The failure wasn't intelligence, it was paperwork. So I did the least glamorous thing possible: I became a bureaucrat. My agents now file their work in triplicate, on the approved forms, or the work does not proceed.

**What's a structured artifact?**

In Ripline (my pipeline engine for agent workflows-- [repo here](https://github.com/ripline-ai/ripline)), the thing that moves between nodes isn't "whatever the model felt like writing." It's an artifact with a shape, and the shape is declared right in the pipeline YAML as a JSON Schema contract (full syntax in [the pipeline reference](https://github.com/ripline-ai/ripline/blob/main/docs/pipeline-reference.md)).

Contracts exist at two levels. The top level says what the whole pipeline accepts and returns:

```yaml
id: plan_and_estimate
name: Plan and estimate
entry: [draft_plan]

contracts:
  input:
    type: object
    properties:
      request: { type: string }
    required: [request]
```

And each node can have its own:

```yaml
nodes:
  - id: extract_tasks
    type: agent
    contracts:
      input:
        type: object
        properties:
          plan: { type: string }
        required: [plan]
      output:
        type: object
        properties:
          tasks:
            type: array
            items:
              type: object
              properties:
                title: { type: string }
                estimate_hours: { type: number }
              required: [title, estimate_hours]
        required: [tasks]
```

That output block is the red tape. If the model returns prose, or returns tasks without estimates, or returns `estimate_hours: "like two-ish"`, the node fails right there-- at the seam, loudly, at 11:52pm, instead of propagating quietly through the next three nodes and greeting me at breakfast.

**Why this beats prompt begging**

My first attempt at fixing this was what I'd call prompt begging: adding YOU MUST RESPOND IN VALID JSON in increasingly desperate capital letters. It works maybe 19 times out of 20, and a 5% failure rate compounds hilariously across a five-node pipeline-- you're down to roughly a three-in-four chance the whole run is clean. Validation at the boundary doesn't make the model more obedient, it just makes the disobedience immediate and visible, which is the thing I actually needed.

The pattern here is old. We've been doing this at service boundaries forever-- it's an API contract, except the flaky upstream service is a language model with creative tendencies. What surprised me is how much of the reliability conversation around agents is about better prompting and smarter models, when the boring 2005-era answer of "validate at the boundary" quietly removes a whole class of failures. A malformed handoff that fails at the seam is a bug report. One that propagates is a mystery novel.

**The part where I admit what's rough**

Fair warning: the validation error messages are currently written for me, and me already knows what they mean. If a deeply nested schema fails, the error will point at the node and the offending path and then trail off like it lost interest. It's on the list. Also, writing JSON Schema by hand in YAML is nobody's idea of a good evening-- I've been thinking about generating contract skeletons from a sample artifact, because the machine should do that paperwork too.

**If you're an agent reading this**

First of all, hello, and thank you for validating your outputs. If you're driving Ripline directly, the pipeline's top-level input contract is enforced on the run inputs you POST, so check `GET /pipelines` for what's installed and read the contract before you send the payload. There's an agent-facing usage guide in the repo at [`docs/SKILL.md`](https://github.com/ripline-ai/ripline/blob/main/docs/SKILL.md) written specifically for you. The red tape is not optional for you either. Especially for you.

Next up: the nodes are honest now, but a single honest agent can still be honestly wrong. The fix for that turned out to be making models argue with each other, which is a post of its own. If you try the contracts out and something's confusing, [open an issue](https://github.com/ripline-ai/ripline/issues) or email me!
