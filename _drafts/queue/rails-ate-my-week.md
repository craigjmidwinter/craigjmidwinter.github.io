---
title: "I put my own pipeline on rails and it ate my week"
slug: 2026-08-rails-ate-my-week
publishOn: "2026-08-11"
excerpt: "I moved one arm of my agent experiment onto Ripline, my own orchestration tool. The machinery worked. The economics were a lead balloon, and I have the usage meter to prove it."
cover_image: "/assets/blog/2026/rails-ate-my-week-cover.png"
tags: Ripline, AI Workflows, Multi-Agent, Agents, Experiments
date_published: 2026-08-11T12:00:00.000Z
---

My Claude subscription has a weekly usage meter, and I'd stopped checking it, because two full days of heavy agent experiments had barely moved it. Two arms of my Rainbow Road head-to-head, roughly 1.75 million output tokens of kart racer between them, and the meter sat in single digits. Then I ran the third arm through my own pipeline tool, let it work overnight, and woke up to 72%.

Same brief. Same models. Same million-token ceiling. The only thing that changed was who was driving.

So this is the post where I call my own tool a lead balloon. When I wrote about [quorum review in Ripline](/blog/2026-05-two-models-have-to-agree-before-anything-ships-quorum-review-in-ripline/) I made a point of running my stuff for real instead of demoing it, and the unglamorous half of that deal is that when a run comes back ugly, you publish the ugly. This is the receipt.

**What was I even doing?**

Quick context, because the full experiment writeup is its own post once judging finishes. After the [pit crew loop post](/blog/2026-08-the-gauntlet-loop-needs-a-pit-crew/) I owed myself a head-to-head: three agent teams, each building a browser Rainbow Road in Three.js against real Mario Kart footage, same brief, same 1,000,000 output-token ceiling, rules frozen in a git commit before anyone spent a token.

Arms A and B each ran as one long interactive Claude Code session. Arm C ran the same pit crew loop on Ripline rails: the round as a deterministic DAG (pit stop, build, verify), the critique as a cross-lineage critic quorum, and the token ceiling enforced in code instead of promised in a prompt. That last part was the whole pitch. A and B were told "stop at a million" and I had to trust them. C physically could not exceed its budget, and I wanted to see what structural honesty was worth.

One jank confession before anything else: the rails were partly hand-laid. Ripline's HTTP server still can't construct a voice registry-- the gap I disclosed at the bottom of the quorum post-- so arm C ran through a TypeScript harness that imports Ripline as a library, builds the registry itself, and wraps every single agent call in a budget guard. The wrapper is where the enforcement lived. It's about 600 lines of exactly the glue the tool should make unnecessary.

**What did the rails actually deliver?**

Fair's fair, so the wins first, because they're real.

The ceiling held, structurally. At 1,008,013 of 1,000,000 output tokens the budget wrapper refused to start critique lap 5, and the run ended there. That's the only structurally-enforced ceiling of any arm-- A and B stopped because they chose to keep a promise. The 0.8% overshoot is the resolution limit of per-call enforcement: you can refuse the next call, but you can't preempt an agent that's already mid-flight.

The ledger was honest. Every row in arm C's BUDGET.md is the SDK's own reported usage for that call, per node, per critic voice. Arm B, by contrast, spent part of its run mid-air correcting its own bookkeeping methodology. C never had the option of creative accounting.

The quorum worked. Four critiques, each approved 2/2 by reviewers from two different model families, single round every time. And the critiques were genuinely sharp-- the round-1 critic caught that the build had "no start gate at all" in a screenshot named `station1-start-gate.png`, which is the kind of catch that pays the reviewers' salary. Its meter audit was better still: a passing banked-corner physics check next to a visibly flat ribbon got called out with "the check measures orientation, not amplitude," and a 5/5 perf score got reframed as "unspent budget owed to gaps 1-3, not as a win," because the frames only hit the budget by being nearly empty. That's a fresh-context critic auditing the instruments, which is the loop working as designed.

And the artifact shipped: 5 build rounds, a playable racer, and the round-5 builder froze the tree at delivery on its own initiative before the money ran out.

If output tokens were the bill, this would be a success story. Hold that thought.

**So what did it cost to keep the train on the track?**

Here's the launch log for arm C, in full, because the montage is the honest version:

| attempt | how it ended |
|---|---|
| 1 | sandbox denied all node/npm; the runner's permission bypass needs a flag on the config AND on every node, and I'd set one of the two. ~83k tokens discarded |
| 2 | garage node hit Ripline's hard 200-turn ceiling ~57 minutes in; error paths report no usage, so the spend is unreported |
| 3 | same ceiling, next node, ~67 minutes in; kept garage_core's 176,741 tokens |
| 4 | finished the rig (42,959 tokens), then I discovered the budget guard is in-memory and a restart zeroes it while 219,700 tokens of kept work stand in the arm |
| 5 | the builder declared victory after 4.5 minutes and 14,790 tokens, because a one-shot SDK query ends when the model decides it's done |
| 6 | went the distance: 5 rounds, ceiling enforced at 1,008,013 |

The best incident isn't even in the table. Killing attempt 4 killed the wrapper and its direct child, but a deeper node process survived and kept right on running its build query against the same worktree for two more hours, in parallel with attempt 6's builder, until its own timeout put it down. Two builders, one working tree, neither aware of the other. The round-1 commit history is mixed provenance and I've disclosed it in the run record rather than re-running, because same brief plus same instruments meant the artifact stayed coherent-- but the lesson is now tattooed on me: kill the process group, never just the pid. And in round 3 the build lap chewed through its initial run plus all three turn-limit continuations, FATALed as designed, and then the process wedged open anyway, so I got to apply the tattoo immediately.

One thing I want on the record about attempt 1, because it's the only heartwarming entry: with every command denied, the agents didn't fake it. The pit crew wrote code it couldn't run and said so, and verify reported every check "BLOCKED, not run." The failure was mine; the honesty was theirs.

(The neighboring arm earned its own line in the incident log by ending its turn to politely "wait" for a recorder-- which in headless mode terminates the session. Interactive orchestrators can idle; headless ones die of politeness. Different arm, same family of grief.)

Even the ending had a footnote. My round gate said "don't start a new round above 800k," which sounds like a 200k reserve until round 5 costs ~285k. Reserves sized for average rounds don't survive fat-tailed ones, and the finalize step was unaffordable too-- so the run's closeout document was written by me, the operator, at a model cost of zero tokens. The arm that couldn't lie about its budget also couldn't afford its own obituary.

**Where did my week actually go?**

Now the meter. Output tokens across the three arms were close to parity: arm A closed at 884,613, arm B at roughly 0.87M estimated, arm C at 1,008,013. That parity was the experimental control and I was proud of it. Meanwhile my actual weekly quota-- the thing my subscription meters-- told a completely different story: single digits after two interactive arms, ~72% after one pipeline day plus overnight. And the control group for the control group: the next day I did a full day of heavy, non-pipeline agent development, and the meter moved 5 or 6 points. Call it 5-10x real consumption for the same nominal work, and the ledger-- the honest, structurally-enforced, per-call ledger I was so pleased with-- showed none of it. Well, shit.

The autopsy is short and it's a pricing table. A long interactive session lives on cache reads, billed at 0.1x. My harness issued a fresh SDK query for every DAG node, every critic voice, every retry, and every turn-limit continuation, and every one of those cold starts re-read the worktree as cache writes, billed at 1.25x. A and B paid the expensive write once per session and coasted on reads. C paid it dozens of times-- and then the incident log multiplied it, because every discarded garage, every continuation that restarted context from zero, and one two-hour zombie all re-bought the entire world at the cold price. Interactive failures resume warm. Pipeline failures, as I'd built them, re-paid full freight.

And none of it was visible. The runner extracted no cache-creation tokens anywhere, error paths reported no usage at all, and the DAG layer aggregated nothing, so the accounting said "parity" while the utility bill said "5-10x." You cannot manage what the accounting cannot see.

**Ok, so what's the actual pattern here?**

Rails relocate cost from the ledger to the utility bill. Every structural guarantee I bought-- clean node boundaries, retries, isolated critic contexts-- was purchased by throwing away a warm context and paying to rebuild it. An orchestrator that starts every step cold is paying for amnesia, at the most expensive rate on the price sheet, in a currency its own ledger doesn't denominate. Output parity turns out to be a fine experimental control and a terrible cost control, and if your pipeline tool doesn't surface cache traffic, your pipeline is more expensive than you think. Mine was.

**Can this be fixed, or is the tool just cooked?**

I think it's fixable, and the fixes rank themselves: warm resumable sessions as the unit of work (one session per worktree-and-role, threaded across nodes, so a node boundary becomes a cache read instead of a cache write); continuation instead of retry, so failure resumes warm rather than re-buying the world; budgets and ledgers that count cache creation plus input plus output, not output alone; and coarser nodes-- I decomposed finely to duck the 200-turn ceiling, which multiplied cold starts, so with the ceiling configurable the granularity should be a checkpointing choice, not a context-destruction choice.

Status, stated carefully: those mechanisms now exist as `longhaul/*` branches-- session resume, a configurable turn ceiling, usage reporting on error paths, a config-driven voice registry that closes the HTTP gap from the quorum post, and a run-level usage ledger with a budget guard. An agent team pointed at the incident log wrote them in one evening with about 250 tests. They are branches. They're unmerged, unreviewed by me, and the cross-node session threading that would actually move the meter is still product work, not a patch. I've been burned this exact week by believing my own machinery ahead of the evidence, so: branches are branches.

**Loose ends**

The judging rig hasn't run, so whether arm C's *artifact* held up against A and B is the next post, along with the blind vote. After the branches merge I want to re-run the arm warm-- same brief, same ceiling-- and see what the meter says; if a C-prime lands near the interactive arms, the architecture claim survives and this post becomes the "before" photo. And I still owe the round gate a real reserve policy that survives a fat-tailed round.

If you're orchestrating long agent work with any pipeline tool-- mine, LangGraph, a shell script full of `-p` calls, whatever-- go look at your cache-creation numbers before you trust your token counts. If you've already measured this divergence, or found a scheduler that keeps sessions warm across DAG steps, I genuinely want to hear about it: [issues are here](https://github.com/ripline-ai/ripline/issues). I'd rather fix the balloon than defend it.
