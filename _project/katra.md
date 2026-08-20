---
company: 'Katra'
title: 'Developer/Maintainer'
sortDate: '2026-07-11T16:18:42.000Z'
tech: 'Go, Markdown, Git, MCP'
---
<!-- TODO(2026-08-20): Katra's branding/docs overhaul is underway in its own
     session. Refresh this copy and any visuals once the new identity lands. -->
Katra is a committed, markdown-native dev log, project wiki, and cross-project hub that I build and maintain, MIT-licensed and open on GitHub. Every node -- entry, task, epic, decision, article -- is one markdown file in the repo, so the whole thing versions, diffs, and merges like the code it describes. I use it for spec-driven agentic development: the spec agents build from and the record they leave behind live in the same git history.

- Pairs a backward, immutable record (entries stamped with the commit hash and diffstat they describe) with a forward, mutable ledger (tasks and epics with a status lifecycle), mechanizing a hand-sync I'd re-invented in incompatible shapes across eight repos.
- A wiki with a spine: structured frontmatter edges (`epic:`, `supersedes:`) drive generated views -- boards, roadmaps, epic rollups -- while freeform `[[wikilinks]]` in the body give backlinks and connective tissue.
- Built for agents as much as humans: ships an MCP server and a Claude Code skill, so agents read the current spec and write the durable record directly instead of losing that context when the session ends.
