---
title: "Three robots build Rainbow Road: putting the pit crew loop on the clock"
date: "TBD -- date of final judging"
excerpt: "I coined a variant of the gauntlet loop and then had to find out if it actually buys anything. So three agent teams each built their own Rainbow Road, and I pre-registered the rules before any of them wrote a line."
coverImage: "TBD -- /assets/blog/2026/rainbow-gauntlet-cover.png"
tags: [ai-workflows, experiments, games]
---

<!-- DRAFT SCAFFOLD -- do not publish until: arms A/B/C complete, judge rig run,
     blind vote widget live at /experiments/. Placeholders marked TODO throughout.
     Raw material index at the bottom of this file. -->

A few weeks ago I wrote about the pit crew loop -- my name for a gauntlet loop where
one role does nothing but build instruments before anyone builds the thing. Coining a
loop is free. Knowing whether it buys anything costs about a million tokens per arm,
and that's the bill this post pays.

The short version: I had three agent teams each build their own version of Rainbow
Road -- a browser kart racer in Three.js, judged against real Mario Kart World
footage. One team ran a plain gauntlet loop. One ran the pit crew loop. One ran the
pit crew loop inside a Ripline pipeline, on rails. Same brief, same models, same
1,000,000 output-token ceiling, and I froze the rules in a git commit before any arm
started so I couldn't quietly move the goalposts when the results embarrassed me.

<!-- TODO: one-sentence spoiler of the headline result once known. Keep it honest --
     a null result gets stated as flatly as a win. -->

**Play them yourself before the reveal:** the three builds are at
[/experiments/](TODO) with a blind vote widget. Go vote before this post biases you.
Seriously, this paragraph moves above the fold when it ships.

## Why Rainbow Road?

The original inspiration is Matt Shumer's Claude of Duty -- one maximalist prompt,
"the most recent Call of Duty games" as the bar, and a loop where a harsh critic
compares screenshots of the build against the real game until it can't tell which is
which. It's a great experiment shape and a five-sentence prompt.

Picking my own target took longer than I'd like to admit, and the rejection list is
half the design story:

- 2D anything -- rejected. The gap between your 2D game and a famous one is
  hand-drawn art, and no instrument closes an art gap. The bar has to sit far above
  reach with the gap made of *engineering*: geometry, shaders, physics, camera,
  speed-feel.
- VR -- rejected as deck-stacking in my own favor. Instrumentation obviously
  dominates there, and an LLM critic can't judge comfort from a still.
- A GTA clone -- vetoed on the grounds that every single person with a Claude
  subscription is building one right now.
- NHL 26 -- rejected (mocap humanoids are the art trap at maximum) but earmarked,
  because a browser hockey game that fires my real goal light deserves to exist.
- Satisfactory, No Man's Sky -- systems depth and procedural scale are invisible to
  a frame critic. NMS is earmarked for a possible second experiment for exactly that
  reason.

Rainbow Road survived because it's emissive geometry and postprocessing all the way
down -- a glowing ribbon in space is exactly the kind of thing iteration climbs --
and because "the current Mario Kart's Rainbow Road" is a bar the way "the most
recent Call of Duty" is a bar: famous, concrete, and comfortably out of reach.

## What exactly got pre-registered?

<!-- TODO: link the rainbow-gauntlet repo once it's public with the subtree-merged
     arm histories. -->

The protocol commit pins: three arms (gauntlet / pit crew / pit crew-in-Ripline),
one shared brief, a 1,000,000 output-token ceiling per arm, model roles (Fable
orchestrates and critiques, Opus implements), seven held-out functional checks the
builders never see, and blind judging by fresh-context critics from three model
lineages against real gameplay frames at eight fixed camera stations.

A↔B isolates the pit crew. B↔C isolates the orchestration engine. A↔C is confounded
and doesn't get presented as a single-cause comparison. And n is 1 run per arm --
this is an exploratory paired case study, not a causal claim. I'm writing that
sentence here so nobody has to write it under the post for me.

The amendment trail is public too, because I got things wrong before the first
counted token was spent:

- **Amendment 1**: each arm runs in its own fresh repo, born empty, never reads its
  siblings, and every arm gets an identical katra dev log setup -- the entries the
  arms write while working are primary sources for this post.
- **Amendment 2**: the ceiling froze at 1M after calibration showed gauntlet laps
  running 250-400k tokens -- below ~750k the pit crew arm can't amortize building
  its instruments, which would bias the experiment *against* my own coin. For the
  record: Claude of Duty publishes no token or cost figures. This post publishes its
  bills to the dollar.
- **Amendment 3** is a whole story. See the pilot, below.

## The pilot run, or: I ran the control arm wrong first

Arm A ran once before the counted round, all the way to a finished game -- "Prism
Drift," 4 rounds, ~810,690 tokens, all mandatory requirements verified, 120fps.
Then it got reclassified as a pilot, for two honest reasons.

First, my harness killed its builders twice (a background-task timeout I didn't
know about, then a task reaper I also didn't know about), so ~190k of its ledger is
conservative estimation for agents that died before reporting. You can't publish a
token-parity experiment where a fifth of one arm's bill is a guess.

Second, and worse: its critique laps had no reference imagery. The critic compared
the build against its *memory* of Mario Kart. The original experiment's whole
mechanic is the critic staring at real frames of the real game next to yours. I'd
rebuilt the loop and left out the eyes.

<!-- TODO: 1-2 sentences on what the pilot was still good for: calibrated round
     costs (250-400k/lap), debugged harness, validated the prompt. Pilots are
     normal science; say so without being defensive. -->

The fix (Amendment 3, committed before the counted round): the bar became Mario
Kart World's Rainbow Road -- the current game, matching "the most recent Call of
Duty" in spirit -- embodied as eight fixed reference frames. And here's a detail I
only got right because someone looked over my shoulder: my first reference set was
promo stills from a wiki. Gorgeous, staged, HUD-less. Useless. You can't score a
gameplay screenshot against a press render -- the comparison has to be
like-for-like, windshield vs windshield. The final frames are grabs from real 150cc
race footage, HUD on, at eight stations: start gate, pack racing, the climb, a
banked corner, the water glide, the station launch, the wide descent, the finish
gate.

<!-- TODO: consider a side-by-side figure: promo still vs HUD gameplay frame,
     captioned "one of these is a lie about what the game looks like". Rights note:
     we don't republish Nintendo frames; describe or link instead. Decide at edit
     time. -->

Amendment 3 also restored two structural bits of the original: every critique lap
runs as a *separate fresh-context critic* that never learns what round it is or
what just changed, and it has to say, station by station, which frame looks better
and why. And the brief got two additions: mandatory gamepad support, and explicit
permission to fan builders out in parallel -- Shumer's writeup found sequential
single-owner passes beat parallel fan-out decisively, and I wanted each arm free to
test that for itself.

## Arm A: what a control arm does when nobody's watching

<!-- STATUS: arm A counted round in flight as of this scaffold. Numbers below are
     current as of round 2; update from BUDGET.md / katra entries at edit time. -->

The first surprise came before the first builder was dispatched: the control arm
built instruments. Unprompted, the orchestrator installed Playwright and wrote
itself a station-capture script and a verify harness before writing a single brief.
The pilot run did the same thing (its very first ledger row is "scaffolding + probe
harness"), so it's stable behavior, not a fluke.

Which reframes the whole experiment, honestly. The gauntlet control isn't "no
instruments" -- a competent orchestrator improvises a minimal probe on its own. The
pit crew treatment is *mandated breadth and discipline*: six required instruments
built before any gameplay code, and a standing rule that any weakness noticed twice
becomes a harness check. The real question was never tools vs no tools. It's
whether systematizing the instinct beats the instinct.

(Caveat I owe you: both arms carry a katra dev log whose instructions include
"capture screenshots of visible progress," so some of that instinct might be
priming from the chronicle tooling. It's constant across arms, so the comparisons
hold -- but a katra-free control arm is on the follow-up list.)

Round 1 cost 94,400 tokens against the pilot's 206,000 for the same milestone --
no harness kills this time, and every ledger row reported rather than estimated.
The fresh-context critic then earned its tokens. Its best line about the round-1
build: **"the track surface is a gradient, not a material."** One observation that
explains two symptoms -- the road looks cheap *and* the speedometer reads 291 km/h
over a frame that feels parked, because nothing on the surface repeats, so nothing
measures motion. It also called the props "amateurish," the camera "a spectator
drone, not a chase cam," and pointed out that the finish-line station was the same
shot as the start -- "the most emotionally loaded frame in a race game is a repeat
of frame one."

And -- this is the part that made me trust it -- it found a place the build *beats*
the bar: the HUD. Per-racer gaps in metres and a live minimap the reference doesn't
have. The orchestrator's next brief said "protect the information design, raise the
finish," which is the opposite of the note I'd have written.

Round 2 went out as four parallel builders on four disjoint file sets -- surface,
world, camera, karts/FX/HUD -- with single ownership of every file and a shared
section map the orchestrator authored so the world and camera builders never had to
talk. Integration cost 6,000 tokens. No merge fight. That's a real data point
against "parallel always loses": *structured* fan-out with ownership contracts is a
different animal from six agents in one working tree.

<!-- TODO: rounds 3+ summary, final arm A numbers, RESULTS.md quotes. -->

## The postcard problem

Here's my favorite bug of the experiment so far, and I didn't find it -- I was
sent a screenshot of it. The round-2 build's station captures were the best frames
the run had produced. The actual game, played by a human, was a black screen with a
beautiful HUD -- the chase camera staring into the void while the minimap cheerfully
tracked a race you couldn't see.

The station captures looked great because the stations are frozen showcase poses.
The capture tool photographs those eight poses. The verify tool asserts on
simulation state through window globals. The critic sees station frames. Nothing in
the arm's entire sensory apparatus ever takes a picture through the windshield.

So the build could score *higher* on every instrument while being unplayable. The
pattern, extracted: **instruments verify what they look at, and a screenshot rig
pointed at showcase poses is a different sensor than the player's camera.** Every
test suite has a windshield it isn't photographing.

I didn't intervene -- the run has to catch it or not on its own, and the held-out
judge rig records 10-second clips through actual gameplay, so an unplayable build
can't survive judging. Where in that chain it got caught is the interesting part:

It got caught in round 3, one round after a human hit it, and the diagnosis is a
gift: the "fog veil" was nine 4-kilometre additive nebula quads plus a galaxy band,
all stacked between the chase camera and empty black. Additive over black is black.
The stations didn't see it because the frozen poses look across the track, not down
the racing line.

And the same round found four more effects that were *running correctly and
invisible*: a boost plume drawn inside the bodywork facing the wrong way, drift
sparks spawning 30 metres behind a 6-metre chase camera, contact shadows the kart
itself occluded 100% of, and particles sized in world-metres that went sub-pixel
past 25m. The tell for all five is the same -- the simulation state was right, the
tests passed, and the pixels never arrived. To find them, the round-3 builders did
what the instrument suite never did: pointed cameras at the actual problem
(close-up FX plates, drive-line shots -- a little _fx3/ directory of ad hoc
sensors). The arm grew a windshield camera the moment it needed one; it just needed
a round of being wrong first.

<!-- TODO: A↔B check still open: arm B's mandated screenshot sampler is ALSO
     station-based -- does B inherit the postcard blind spot, or does its headless
     physics/replay harness surface the invisible-FX class earlier? This is now a
     sharp, falsifiable question for the B run. -->

There's a third layer under the windshield problem. I played round 3 the minute it
committed, and my notes were not subtle: the driving feels bad, the karts still look
bad, and the items aren't any fun. Now line those up against the loop's sensors.
"Karts look bad" is frame-visible -- the critic has been hammering it since lap 1,
so if they're still ugly that's the loop's taste failing, not its eyes. But "feels
bad" and "isn't fun"? No frame shows steering weight. No window global asserts that
a hit is satisfying. The critic scores postcards, the harness scores physics state,
and *feel* has no instrument anywhere in the loop. You can bolt on a windshield
camera; a camera still can't feel the steering.

<!-- TODO (feel-gap follow-through): does arm B's mandated headless physics harness
     (assertions on speed / drift charge / mini-turbo delta -- numbers ADJACENT to
     feel) drag handling quality up even though nothing measures feel directly?
     Compare human play notes across arms at matched rounds. -->
<!-- TODO: human-vs-critic divergence table -- my round-3 play notes vs critique
     lap 3's ranked gaps, side by side. -->
<!-- TOKEN UTILIZATION (final): arm A closed at 884,613 of 1M (88.5%) -- declared
     round 4 "final" at 618,903 then spent 265k on it, right up to the 900k stop
     line. Split: builders 748,178 (84.6%, 13 opus passes), critics 52,535 (5.9%,
     4 laps), orchestrator 84,000 (9.5%). The earlier "underspends" hypothesis was
     wrong -- it plans conservatively but spends fully. Compare B/C splits,
     especially critic share (A spent under 6% on the eyes). -->
<!-- AMORTIZATION CHECK (compute when B closes): A per-round costs 94k / 237k /
     287k / 265k. For B: pit-crew lap cost up front, then cost-per-round and
     gaps-closed-per-token after. Where instruments save OUTPUT tokens: builders
     stop writing sensors mid-round (A round 3 improvised _fx3 plates mid-build);
     fewer wrong-fix pendulums (A's saturation pendulum = a builder pass spent
     relearning); shorter briefs ("run the harness" vs prose gap descriptions).
     Counterweight: critic side saves nothing, and instruments pointed at the
     wrong thing (postcard risk) are pure cost. -->

## Arm B: the pit crew gets its turn

<!-- STATUS: in flight. Confirmed material so far, update at edit time. -->

<!-- GARAGE: 6 instruments, 188 assertions, 24s one-command suite (gauntlet.mjs),
     plus grey-box sim to hang them on. Cost ~422k harness-total tokens (~30%
     output share) BEFORE any real content -- arm A got a complete playable slice
     for 94k output. The amortization bet, priced. Also wrote critic-brief.md in
     the garage, before any critique existed. -->

<!-- BOOKKEEPING SAGA (own subsection candidate): B started recording harness
     per-agent TOTALS against the output ceiling as a "conservative" policy, hit
     1,000,466 after 4 agents, and wrote a mid-run "Methodology correction"
     titled as a reductio: the overflow proves the summed figure isn't the
     governed quantity. Switched to ~30% output-share estimate, left the original
     rows standing. Also ledgers builder self-estimates vs measured: self-ests
     run 3-6x low EVERY time (one builder guessed ~50k, measured 220,522) --
     "agents badly underestimate their own consumption" is B's own phrasing. -->

<!-- PIT STOP 1 (the thesis event, write this scene in full): after critique lap
     1, before building anything, the crew built 12 visual meters from the
     critic's adjectives, comparison plates, and capture fixes. Verbatim from the
     commit: "the meters found a build defect the critique could only see the
     symptoms of. dot(cameraForward, kartHeading) = -0.998 at all 8 stations" --
     the camera was facing BACKWARDS at every station and the critic could only
     say the frames felt wrong. The light-meter line from the pit-crew post,
     enacted by an agent, unprompted, with a dot product. Other pit stop 1
     details: 3/12 meters at target, the 9 misses declared "the next lap's work
     list, explicitly NOT build failures"; only the debug-overlay regression
     guard can fail a build; capture determinism improved 50x (0.2-2.4% ->
     0.00-0.04%) by seeding the fx PRNG + virtual 60Hz clock; two stations
     re-staged at the instrument (S6 to airborne apex, S2 to show items). -->

<!-- CAMERA BUG RESOLUTION (lap 2): the -0.998 defect was TWO CANCELLING BUGS --
     camera.js used FWD=(0,0,-1) against core's +Z heading AND karts.js authored
     the kart nose-at--Z. They cancelled visually "while emptying the world of
     everything ahead." Fix corrected camDot to +0.997 at all 8 stations AND, as
     side effects, wheel-spin, steering and pitch SIGNS -- a meter-found defect
     reaching into feel territory that no frame shows. Meters 3/12 -> 8/12 with
     hard numbers (empty-sky 64.7->30.1%, line-work blocks 13->0%, bank roll
     4.04->12.82deg). 189/189 assertions, 294 fps median. -->

<!-- METER AUDIT (thesis event #2, critique lap 2 -- write as the Goodhart
     scene): the fresh critic audited the METERS, headline "the important part":
     "Two of twelve meters are actively rewarding the wrong thing." m2 hue
     entropy is maximised by random noise -- the confetti deck that is gap #2
     PASSES it, a proper glass surface would score LOWER and look better. m8
     gate-dominance reports 100% because the gate's bbox encloses the camera
     while the visible gate is 8.72% -- "it saturates when the object surrounds
     the camera -- measuring the opposite of dominance." Three more pass on
     proxies (void=luminance<0.08 so a bright nebula counts as world; bank meter
     checks ribbon projection while chase.roll=0.00deg at every frozen station
     so the actual mechanic is unverified; item "boxes" are 274px pyramids that
     read as architecture -- "Size was the proxy; identity is the problem").
     Critic still blunt: "Reference still wins all eight stations. Not close at
     any." This is the monkey-paw paragraph from the pit-crew post happening
     live: builders optimize what you measure, and the fresh-context critic is
     what audits the scoreboard. The loop is bidirectional now -- meters catch
     what critics can't articulate (camDot), critics catch meters lying (m2/m8).
     Neither replaces the other; that's the finding. -->

<!-- PIT STOP 2 (the scoreboard gets honest): repaired the audited meters and
     THREE VERDICTS FLIPPED PASS->FAIL -- the build was worse than the scoreboard
     said (empty-sky 30.2 PASS -> 47.1 FAIL counting geometry not skybox
     brightness; hue entropy -> 60.5px tile pitch FAIL; item legibility 3 -> 0).
     m8 100% -> 32.4%. Built TWO NEW meters from the critique: m13 foreground
     blowout = the critic's largest ranked gap "previously invisible to the
     suite"; m14 sky artefacts (85 black quads reading as render corruption).
     Found the perf gate was HOLLOW -- passing with 0/0 assertions while 1% lows
     sat below its own declared minimum; now 5 real assertions, 40fps regression
     fails. And the repaired m2 is validated against synthesised ground truth
     (big tiles score 20x hue noise) with that validation asserted in the
     gauntlet: meter tests in CI, instruments instrumenting instruments. 220/220.
     Narrative beat: an honest scoreboard makes the build LOOK worse -- that dip
     is the cost of stopping the lie, and the loop paid it without being told. -->

<!-- FINALS: ~866k/1M output est (2,887,428 harness total), 8 agents (6 opus
     builders incl 2 pit crew, 2 fable critics), 3 laps + 2 pit stops. 220/220
     assertions, 88/88 replay floats bit-identical, 0 NaN over 84k kart-ticks,
     303fps median, 8/14 meters at target. CONTRACT.md's pure-ESM core boundary
     = self-identified highest-leverage decision (headless suite in 2.1s = run
     on every change). RESULTS.md's own framing: "the instruments and the critic
     disagreed three times, and each time the disagreement was itself the
     finding." Nearly identical spend to A (884,613 output) -- same bill,
     opposite allocation. -->

<!-- THE CROWN FINDING (write as the post's climax): Craig played B's final
     build. UNPLAYABLE -- left/right inverted, heavy jitter. 220 green
     assertions shipped inverted steering. Mechanism (verified in source):
     test-physics drives every scenario with laneSteer(), a closed-loop
     controller that derives "right" from the same core geometry as the sim
     (right = cross(up, heading)) -- controller and plant are consistent with
     each other regardless of whether the convention matches the screen. The
     whole loop (input right=+1, sim, tests, replays, determinism) is
     internally coherent and MIRRORED relative to the rendered view. No
     instrument crosses the sim->pixels boundary except still photographs,
     which cannot show direction sense. Likely origin: lap 2's cancelling-bugs
     fix "re-authored nose-at-+Z ... corrected wheel-spin, steering and pitch
     signs" -- into core-coherence, not screen-correctness. Jitter: interp code
     exists; suspect camera not interpolated or slerp hemisphere flip; 303fps
     median says nothing about motion coherence (fps is not smoothness --
     another proxy trap). Sentence for the post: "You can pass 220 assertions
     and lose to a thumb on a gamepad in four seconds." Judge rig will see the
     jitter in clips; the inversion is HUMAN-ONLY (replays play back through
     the same mirrored mapping and look perfect). Human play notes are a
     judging instrument, period. Honest calibrations to keep: n=1/arm,
     pre-registered variance warning; B's budget was ~40% instruments so fewer
     content laps than A (3 vs 4 rounds/13 passes); A avoided the bug class by
     one builder's lucky convention choice, not method. Negative result stated
     plainly: the pit crew as operationalized bought correctness + honest
     meters + the camera catch, not playability. Pit-crew-v2's first mandated
     instrument writes itself: open-loop screen-space direction check -- press
     right 1s from rest, assert rendered X increases. Ten lines. Would have
     caught it.
     REFINEMENT (Craig, playing lap snapshots in sequence): lap 1 (:8905) had
     FORWARD/BACKWARD inverted -- the backwards-camera bug -- and the loop
     CAUGHT AND FIXED it, because pit stop 1's meter measured exactly that
     axis (camDot). Left/right was never metered and shipped broken. So: the
     pit crew fixed 100% of the inversions it instrumented and 0% of the ones
     it didn't, and the two bugs were one dot product apart. The failure is
     meter COVERAGE, not method -- the recurring loop had the machinery
     (complaints -> instruments) but no complaint ever arrived because no
     critic and no meter ever drives. Frame the climax this way: same bug
     class, same fix cost, opposite outcomes, decided by which axis had a
     number attached.
     ESCALATION (Craig, playing arm C round 1): C ALSO ships inverted
     left/right. 2 of 3 arms mirrored; the control is the one that got it
     right. Pattern, not fluke. Mechanism hypothesis for the post: the
     headless-pure-core discipline (B and C both) severs the input convention
     from the screen by design — closed-loop tests derive "right" from sim
     geometry, nothing with eyes or hands ever exercises screen-coherence.
     A built game-first against the rendered picture, where a mirrored
     convention is self-evident to the builder's own loop. Claim: instrument-
     first architecture makes handedness untestable by construction while
     making everything else more testable. Judge rig can't see it either
     (replays go through the same mirrored mapping) — Craig's play notes are
     the only sensor that caught it in all three arms. Report as POST-HOC
     human-play observation, clearly labeled discovered-after, never
     retrofitted into the pre-registered suite. -->

<!-- FRAMING VERDICT (Craig, 2026-08-05, final): do NOT salvage a pro-ripline
     thesis. Arm C reports as a negative result on cost, stated plainly: the
     review machinery worked (5 rounds, 4 quorum approvals, the only
     structurally-enforced ceiling of any arm) and the economics did not
     ("a lead balloon"). The constructive ending is the efficiency roadmap
     (runs/ripline-efficiency-findings.md): warm sessions as the unit of work,
     continuation not retry, cache-aware accounting, coarse nodes. No spin. -->

## Arm C: the same loop, on rails

<!-- TODO: arm C needs the Ripline review-phase harness (the HTTP server can't
     drive review phases yet -- documented gap, same artifact as the review-harness
     battle test). Structure:
     - pipeline YAML: pit_crew -> build -> verify as typed DAG nodes, critic quorum
       via the review harness, budget enforced by the harness rather than promised
       by a prompt
     - what "on rails" bought: typed handoffs, resumable rounds, enforced budget,
       no human-shaped drift between laps
     - what it cost: everything the DAG didn't anticipate
     - model pinning: structural (per-node YAML) vs "please use opus" -- report
       whether A/B drifted from the role split where C couldn't
     - final numbers -->

<!-- THE QUOTA FINDING (B<->C, possibly the most actionable in the post): the
     arms' OUTPUT-token bills were nearly identical (~0.87-1.0M each) but real
     subscription consumption diverged ~5-10x against arm C. Craig's weekly
     usage: single digits after the A and B days; ~72% after the arm C
     day+overnight; a full day of heavy non-ripline dev after stopping added
     only ~5-6 points. Mechanism: A/B = one long interactive session each,
     living on cheap cache READS (0.1x). C's harness = a fresh SDK query per
     node/voice/retry/continuation — dozens of cold starts, each re-reading the
     whole worktree as cache WRITES (1.25x), multiplied by the incident log
     (6 launch attempts, discarded garages, a 2h zombie, context-from-zero
     continuations). None of it visible in the ledger because the runner
     extracted no cache_creation tokens anywhere — the exact gap the
     longhaul/runner branch fixed. Pattern extraction: "rails relocate cost
     from the ledger to the utility bill" / an orchestration engine that
     starts every step cold is paying for amnesia; session resume + cache-aware
     accounting are prerequisites for pipeline orchestration of long agent
     work, not nice-to-haves. -->

## So, did the pit crew buy anything?

<!-- TODO: the actual results section. Table sketch:
     | arm | tokens | laps | functional checks passed | median frame score |
     clip score | pairwise wins |
     Plus: judge rig details (Playwright, same seed, same replay file, 8 stations,
     blind pack with reference frames mixed in, 3 model lineages), and the
     bill in dollars per arm.
     Write the null-result version of this section FIRST so the temptation to
     narrativize a win never gets room to move. -->

## Loose ends

<!-- TODO at edit time, current candidates:
     - CRITIC-SIDE INSTRUMENTATION (Craig's call, mid-B-run): the addendum licenses
       tooling that makes "every judgment more accurate" but mandates only
       builder-side verifiers + a station sampler. Open observation: does B invent
       critic instruments unprompted (histograms per station, lap-over-lap diff
       plates, motion clips instead of stills, telemetry overlays)? If not ->
       "pit crew v2" arm: instruments serve the eyes first. Arm A evidence for
       each: saturation pendulum (histogram), "is this better" from memory (diff
       plates), "291 km/h reads as parked" + black windshield (clips), feel gap
       (telemetry). Possibly the most original thread in the series.
     - RECURRING PIT STOPS (Craig, mid-B-run): instrument -> build -> critique ->
       re-instrument, every lap. Each stop's backlog sourced from the lap that just
       ended: gaps the critic couldn't articulate (histogram), bug class the
       builder fumbled (sensor), questions that were expensive to answer (probe).
       Serves BOTH builder and critic. Arm A improvised exactly this (unscheduled
       _fx3 / cam4-final stops) -- so the question is scheduling vs improvising
       the instinct, same shape as the main A-vs-B question one level up. Guard
       against gold-plating: budget from the gaps list, not a quota; "must change
       what the next lap does" enforced per stop. Home: arm D or the headline of
       round 2. Candidate for the real definition of "pit crew loop" (recurring
       stops; one-shot phase = degenerate case). NOT injectable into B or C.
       IMPORTANT REFRAME (Craig: "that's kinda what I had in mind from the
       outset"): the PUBLISHED pit-crew post already defines the standing-crew
       version -- "making the next lap faster and the judging more accurate"
       (both customers), "first task" (not only task), notice-twice as a
       during-the-race rule, and the light-meter line IS the critic-side
       instrument. Arm B's addendum is a conservative NARROWING of the coin
       (upfront set + reactive tail, builder-skewed). Disclose that in the
       writeup: B tests a subset; arm D / round 2 tests the coin as published.
       No re-coining needed. -->
     - ARM D SPEC ("the test driver", answer to the 2-of-3 inversion pattern):
       standing pit crew + two new garage mandates. (1) SHAKEDOWN HARNESS:
       end-to-end coherence probe entering through the PLAYER'S door — real
       keyboard events to the real page (never the sim API), rendered-frame
       assertions: right pressed -> rendered X increases; up -> speedo climbs
       AND world flows toward camera; drift left -> sparks left. ~10
       assertions, seconds to run. Principle: unit instruments per layer plus
       one probe crossing every boundary (the bugs all lived AT boundaries).
       (2) INPUT-OVERLAY CLIPS: input state burned into capture frames, critic
       judges 3s clips not stills — handedness/jitter/speed-feel become
       critic-visible. Plus: convention contract signed pre-sim (CONTRACT.md
       declares "+steer = screen-right under standard chase cam", garage's
       first instrument proves it), and optionally the formalized 2-minute
       human test drive (disclosed human-assist condition). PREDICTION, made
       before any arm D run: D ships correct handedness and its critiques
       start ranking motion-feel gaps no arm has ranked. The racing metaphor
       closes itself: a pit crew without a test driver never learns the
       steering is backwards.
     - the katra-free control arm (was the instrument instinct priming?)
     - a second paired round if budget allows (protocol allows it)
     - NMS as the visual-iteration-axis experiment
     - browser hockey + the real goal light
     - Ripline HTTP review phases (kill the harness workaround)
     - whatever the judge rig turns up that none of the instruments saw -->

The builds stay up at [/experiments/](TODO), the vote widget stays blind until you
scroll past it, and the full protocol with its amendment trail is in the repo. If
you think the experiment design is broken somewhere, tell me exactly where -- the
amendment log shows I have a track record of being wrong before being right, and
I'd rather extend it than defend it.

<!-- ============================================================
RAW MATERIAL INDEX (delete before publish)

- Protocol + amendments: ~/workspace/rainbow-gauntlet/PROTOCOL.md (Amendments 1-3),
  PROMPT.md (brief v2), runs/HARNESS.md (both harness incidents, env var fix)
- Pilot: ~/workspace/rainbow-arm-a-pilot (RESULTS.md, BUDGET.md w/ estimated rows,
  katra entries + media incl. r2-drift-t1.png etc.)
- Arm A counted: ~/workspace/rainbow-arm-a (BUDGET.md ledger w/ harness-total
  column, RUNLOG.md, katra/entries/2026-08-03-rainbow-road-from-an-empty-repo...,
  shots/r1 + shots/r2 station sets, tools/capture.mjs + verify.mjs)
- Critic quotes: round-1 critique quoted in the katra entry above (gradient-not-
  material, spectator drone, no midground 6-10 objects vs bar's 25-40, station 8 =
  station 1, HUD beats bar)
- Black-screen evidence: Craig's screenshot 2026-08-03 ~8:40pm (HUD + minimap live,
  chase cam black, NOVA-7 -476m) -- in session; capture into repo at edit time
- Reference frames: judge/reference/ station1-8 (gitignored, ATTRIBUTION.md has
  sourcing: YouTube Zy5EiHTaoII 150cc no-commentary, grabbed at 10/25/45/65/105/
  165/245/265s; retired MK8D promo set + why)
- Fan-out data: BUDGET rows 4-7 (four builders 45.6k/61.8k/47.2k/66.6k) + row 8
  (integration 6k); section-map contract described in katra entry
- Claude of Duty prompt: fetched verbatim from github.com/mshumer/Claude-of-Duty
  prompt.md; README: 11 critics, best frame score 5.05/10, "sequential
  single-owner passes beat parallel fan-out decisively"
- Voice guide: ~/workspace/job-search/profile/blog-voice.md (litmus test at bottom)
============================================================ -->
