---
company: 'GetVect'
title: 'Developer/Maintainer'
sortDate: '2026-08-05T23:15:20.000Z'
tech: 'Electron, TypeScript, React, Node.js, Playwright'
---
GetVect is a local desktop vectorizer for macOS that I build and maintain, MIT-licensed and open on GitHub. Drop in a PNG, JPEG or BMP and get back SVG, EPS, DXF, PDF or PNG from an offline tracing engine -- no account, no credits, no subscription. Tracing, preview and export make no network calls; the only two network touchpoints are an optional bring-your-own-key AI Enhance step and a once-per-launch update check, both off or disableable.

- Ships a pure vectorization engine (palette selection, tracing, curve fitting) with SVG, EPS, DXF, PDF and PNG exporters, including per-colour layers so SVGs open as editable colour groups in Illustrator or Inkscape and DXF splines that survive into CAD tools.
- Benchmarked against a leading online vectorizer using that product's actual outputs, checked into the repo as exemplars; a fidelity harness measures every build against them on every run.
- Written almost entirely by a multi-agent "pit crew" loop I orchestrated, with the build chronicled in a devlog that ships in the public repo alongside the source; v0.1.0 tagged 119 commits and under 24 hours after the first commit.
