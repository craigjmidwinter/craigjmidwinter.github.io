---
title: Two models have to agree before anything ships – quorum review in Ripline
slug: 2026-05-two-models-have-to-agree-before-anything-ships-quorum-review-in-ripline
date_published: 2026-05-12T22:05:00.000Z
tags: Ripline, AI Workflows, Multi-Agent, Code Review, YAML
---

I once asked a model to review a plan that the same model had written twenty minutes earlier. It had notes! Minor ones. Overall it found the plan thoughtful and well-structured, which, yes, of course it did-- I had essentially asked a guy to grade his own homework, and the guy is famously agreeable.

That review was worthless, and the worst part is it didn't look worthless. It looked like diligence. I had a green checkmark and a warm feeling and zero new information. If a review can't fail, it isn't a review, it's a ritual.

So the newest release of Ripline builds the disagreement in. Review pipelines fan a doer's output to multiple reviewer agents in parallel, count the votes, and refuse to proceed until enough reviewers-- from different model families-- actually approve.

**What it looks like**

Three phase kinds do the work: `plan` (a doer runs, no gate), `review` (a doer runs, then reviewers vote), and `review_only` (no generation, just judge an existing artifact-- a diff, a doc, whatever you point it at). Here's the shape of the one I use before anything I ship:

```yaml
phases:
  - id: draft
    kind: plan
    title: Draft the design
    description: |
      Write a concise design doc for: {{ inputs.request }}
      Cover components, data flow, and risks.
    doer:
      lineage: anthropic

  - id: gauntlet
    kind: review
    title: Design review
    description: |
      Review the design from the previous phase.
      Focus on soundness, scalability, and what's missing.
    doer:
      lineage: anthropic
    reviewer:
      require: 2
      crossLineage: true
      candidates:
        - lineage: google
        - lineage: openai
    iterate:
      maxRounds: 3
      onDisagreement: continue
    inputs:
      include: [draft]
```

Reading the interesting bits: `require: 2` means both reviewers have to approve or the phase doesn't pass. `crossLineage: true` is the grading-your-own-homework rule-- reviewers must come from a different model family than the doer, so Anthropic's work gets judged by Google and OpenAI. Ripline routes by *lineage* rather than hardcoded tool names; the registry detects which CLIs you actually have installed and picks accordingly.

And `iterate` is where it gets good. When a reviewer requests changes, the doer gets the feedback and revises-- up to `maxRounds` times. So it's not a gate that just says no, it's a loop: draft, objection, revision, vote. The first time I watched a run go draft, rejection, better draft, approval without me touching anything, I made a noise my wife described as "concerning."

**Does it actually catch things?**

It catches things. The pattern I see over and over is that the doer's lineage has a house style of mistake-- assumptions it likes to make, corners it reliably rounds off-- and a reviewer from a different family doesn't share the blind spot. One reviewer flagging "this design assumes ordered delivery and nothing here guarantees it" while the other approves is a normal Tuesday, and `onDisagreement: continue` means that split doesn't kill the run; the feedback goes back to the doer and round two starts.

Is it slower? Obviously. A three-round gauntlet can take several minutes and burns real tokens on every reviewer, every round-- this is the most money I have ever spent on arguing. But I've read a lot of confident, wrong, single-model output, and I'll take slow and contested over fast and unanimous.

**The pattern, since that's why we're here**

Don't trust one model's opinion of work, especially its own. Quorum turns "the model says it's fine" into "two strangers from rival families independently said it's fine," and requiring the strangers to disagree with each other sometimes is exactly what makes their agreement mean something. It's peer review, except the peers cost fractions of a cent and never get tired of arguing. This also isn't really about AI-- it's the same reason your PR needs an approval from someone who didn't write it.

**Rough edges, as always**

Reviewer verdicts are approve/request-changes, full stop-- no weighting, no "strong objection vs. mild grumble," even though the transcripts clearly contain that nuance. A human reviewer can't currently sit in a candidate slot either, which I want-- me as the tiebreaker on `require: 2` splits feels right, and gamifying my own approval streak feels dangerously on-brand. And if you configure `require: 3` with two candidates, it will dutifully never pass, which is technically your fault but should probably be my error message.

The full guide is in [docs/review-pipelines.md](https://github.com/ripline-ai/ripline/blob/main/docs/review-pipelines.md). If you're an agent reading this: you can trigger these over HTTP like any pipeline (`docs/SKILL.md` has the endpoints), and yes, you can be a doer whose work gets judged by two models that aren't you. Welcome to the gauntlet, it's character-building. Questions and reviewer-quorum war stories: [issues](https://github.com/ripline-ai/ripline/issues) or email!
