---
title: Adding bureaucracy and red tape to my agents – structured artifacts and node contracts in Ripline
slug: 2026-03-adding-bureaucracy-and-red-tape-to-my-agents-structured-artifacts-in-ripline
date_published: 2026-03-15T21:40:00.000Z
tags: Ripline, AI Workflows, Multi-Agent, YAML, Programming
cover_image: "/assets/blog/2026/red-tape.jpg"
---

I have a bad habit of kicking off multi-step agent runs and walking away. There's something great about coming back to finished work-- and something uniquely deflating about coming back to four completed pipeline steps that all ran perfectly on top of garbage produced in step one.

That's what kept happening. I'd chain a few agent calls together: one drafts a plan, one turns the plan into tasks, one estimates the tasks. Each agent did its job beautifully. The problem was the handoffs. The planning agent would decide, helpfully and without telling anyone, that today the plan should be prose instead of a list. The task agent would receive an essay where it expected bullet points, shrug, and produce something task-shaped anyway. By step four the run was confidently summarizing a hallucination. Nothing errored. Everything was wrong.

The failure wasn't intelligence, it was paperwork. So I did the least glamorous thing possible: I became a bureaucrat. My agents now file their work in triplicate, on the approved forms, or the work does not proceed.

**What's a structured artifact?**

In Ripline (my pipeline engine for agent workflows-- [repo here](https://github.com/ripline-ai/ripline)), the thing that moves between nodes isn't "whatever the model felt like writing." It's an artifact with a shape, and the shape is declared right in the pipeline YAML as a JSON Schema contract (full syntax in [the pipeline reference](https://github.com/ripline-ai/ripline/blob/main/docs/pipeline-reference.md)).

Contracts show up at two levels, and-- this is the part I had wrong in my own head for about a month-- only one of them actually stops anything. Here's the top of a pipeline file:

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

That top-level block is documentation. The schema accepts it, the pipeline reference documents it, and then nothing checks it. There's a `compileContract` helper sitting on the registry with zero callers, which is a very honest summary of the situation: I wrote a gate and shipped a comment. POST a run with no `request` at all and nobody objects at the door.

The one that does the work is on the node, and it's the output half:

```yaml
nodes:
  - id: draft_plan
    type: agent
    prompt: |
      Write a short implementation plan for: {{ inputs.request }}

  - id: extract_tasks
    type: agent
    prompt: |
      Turn the plan into a task list with hour estimates.
    contracts:
      input:
        type: object
        properties:
          draft_plan: { type: string }
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

edges:
  - from: { node: draft_plan }
    to: { node: extract_tasks }
```

(Those two blocks are the head and the body of one file. Ripline wants `entry`, `nodes` and at least one edge or it won't load the pipeline at all, so don't paste just the middle bit and wonder why nothing shows up in `GET /pipelines`.)

Two different things are going on in that node, and only one of them is a contract in the sense you'd expect. The `input` block is a filter, not a check-- it decides which upstream artifacts this node is allowed to see, so `extract_tasks` gets `draft_plan` handed to it and nothing else from the run. That's context isolation, it's genuinely useful, and it never rejects anything. It just passes a smaller pile.

The `output` block is the red tape. Ripline runs the agent, parses the response as JSON, and validates it with Ajv. If the model returns prose, or returns tasks without estimates, or returns `estimate_hours: "like two-ish"`, the node throws right there-- at the seam, loudly, in the first minute, instead of propagating quietly through the next three nodes and greeting me at the end of the run looking respectable. One genuinely enforced boundary per handoff turns out to be enough, because the handoff is where the lying happens.

**So did this replace prompt begging?**

No, and I want to be straight about that, because I told a friend it had and then he went and read the code.

My first attempt at this was pure prompt begging: YOU MUST RESPOND IN VALID JSON, in increasingly desperate capital letters. Ripline still begs. When a node has an output contract, the executor appends this to the prompt before it runs:

> Respond with a single JSON object only (no markdown, code fences, or explanation). Your response must conform to this schema: ...

...followed by the schema itself, pretty-printed. The begging didn't go away. It got automated and stapled to a validator. What changed isn't that I stopped asking nicely, it's that when the asking fails, something catches it.

There's a forgiving bit in the middle, too, which I resisted for embarrassingly long. Models wrap JSON in code fences constantly-- that's exactly why the prompt asks them not to-- and for a while the validator did a bare `JSON.parse` on the whole response and failed the node over three backticks. It now pulls the last JSON object out of the text and validates that, falling back to a strict parse so the error message stays readable when there's genuinely nothing parseable in there. Being strict about the *shape* and relaxed about the *wrapper* turns out to be the right split. I had it backwards.

The compounding is why that matters. Begging alone works maybe 19 times out of 20, and a 5% failure rate compounds hilariously across a five-node pipeline-- you're down to roughly a three-in-four chance the whole run is clean. Validation at the boundary doesn't make the model more obedient, it makes the disobedience immediate and visible, which is the thing I actually needed.

The fair question here is why beg at all when constrained decoding exists. If you're calling a model API directly, you should use it-- structured outputs and grammar-constrained sampling make malformed JSON impossible rather than unlikely, and that is strictly better than anything I'm doing. But Ripline's agent nodes shell out to agent CLIs, `claude -p` and `codex exec`, and what comes back over that pipe is text. There's no sampler out here for me to constrain. Boundary validation is what you do when you don't own the decoder, which is most of the time once your agents are subprocesses.

The pattern here is old. We've been doing this at service boundaries forever-- it's an API contract, except the flaky upstream service is a language model with creative tendencies. What surprised me is how much of the reliability conversation around agents is about better prompting and smarter models, when the boring 2005-era answer of "validate at the boundary" quietly removes a whole class of failures. A malformed handoff that fails at the seam is a bug report. One that propagates is a mystery novel.

**The part where I admit what's rough**

Roughly in order of how much it bothers me:

There is no repair round. When Ajv rejects an output, the node dies. The default is one attempt, and if you bump `retry.maxAttempts` you get a blind resample-- same prompt, same schema, no mention of what was actually wrong. Handing the validator's complaint back to the model and asking again is the obvious next thing, and I haven't done it, which is a bit embarrassing given that the repair loop is most of the point of owning a validator.

Pipeline-level contracts are decorative, per above. Either wire them up or delete them from the schema; leaving a field that looks like a gate and isn't is the worst of the three options and it's the one currently shipping.

Node `input` contracts have the same problem in a smaller way. They're a real feature-- the artifact filter-- wearing the name of a different feature. If you write `required: [plan]` in a node's input contract expecting it to fail when `plan` is missing, nothing happens. It's a filter with a schema-shaped costume on.

And the error messages are written for me, and me already knows what they mean. If a deeply nested schema fails you get the node id and the offending path and then it trails off like it lost interest. Writing JSON Schema by hand in YAML is also nobody's idea of a good evening-- I keep meaning to generate contract skeletons from a sample artifact, because the machine should do that paperwork too.

**If you're an agent reading this**

Hello, and thank you for validating your outputs. If you're driving Ripline over HTTP: `GET /pipelines` gives you the list, but it's a summary-- ids, tags, node counts-- so you want `GET /pipelines/<id>` for the full definition with the contracts in it. Read the node output contracts before you do the work, not after; they're the shape your answer has to survive, and nothing upstream is going to check your inputs on your behalf. There's a usage guide at [`docs/SKILL.md`](https://github.com/ripline-ai/ripline/blob/main/docs/SKILL.md) written for you. The red tape is not optional. Especially for you.

Next up: the nodes are honest now, but a single honest agent can still be honestly wrong, and the fix for that turned out to be making models argue with each other. If you wire up contracts and hit something confusing-- or you'd like to be the person who finally makes me build the repair loop-- [the issues are here](https://github.com/ripline-ai/ripline/issues).
