---
title: Don't give the agent your inbox, give it a mail slot – mail-muncher
slug: 2026-08-do-not-give-the-agent-your-inbox-mail-muncher
date_published: 2026-08-01T20:45:00.000Z
tags: Mail Muncher, AI Workflows, Agents, MCP, Go
---

I'm job hunting right now, which means my inbox is a slow drip of recruiter replies, scheduling links, and rejections with the structural sincerity of a hotel checkout survey. I have agents triaging all of it-- and the obvious way to set that up is also the way I refused to do it, because the obvious way is handing an AI agent your entire Gmail.

Think about what that grant actually is. Full mailbox access can read two decades of tax documents, medical appointments, and every password reset you've ever received. It can usually send. It can usually delete. I trust my agents to sort recruiter mail; I do not trust anything, silicon or otherwise, with *send and delete on my primary email account*. That's not paranoia, that's just reading the scope screen.

So I built [mail-muncher](https://github.com/craigjmidwinter/mail-muncher): an email client for AI agents. It gives a program its own read-only mailbox, filtered down to exactly the mail it asked for, delivered as files on disk.

**How it works**

Mail-muncher pulls from any IMAP mailbox (or Gmail's API with a read-only OAuth scope), evaluates each message against ordered rules, and writes the matches to a directory-- a byte-faithful `.eml`, plus a markdown rendering with the headers as YAML frontmatter and attachments extracted alongside. No mode ever writes to your mailbox. The agent never touches the account at all; it reads files, which it was already good at.

```yaml
rules:
  - name: job-search
    from_domains_file: ~/job-search/interested-domains.txt
    deliver_to: ~/Mail/job-search
```

**The feature I'm proudest of is that boring second line**

`from_domains_file` points at a plain text file that *some other program owns*, and mail-muncher re-reads it at the start of every cycle. My job-search pipeline maintains that file: when I apply somewhere, the company's domain gets appended. The very next cycle, mail from that company starts landing in the agent's mailbox. No config edit, no restart, no redeploy-- the pipeline subscribes itself to the mail it's going to need, one line at a time. Two programs coordinating through a text file is 1970s technology, and I mean that as the highest compliment.

**The read-only question, honestly**

"Read-only" deserves scrutiny, so here's the actual table ([the README](https://github.com/craigjmidwinter/mail-muncher#two-ways-to-connect-a-mailbox) has the long version). With plain IMAP you authenticate with an app password, setup takes about two minutes, and read-only is enforced by mail-muncher's own code-- the credential itself could send and delete, the program just never does. With the Gmail provider you register an OAuth client with the `gmail.readonly` scope, setup takes closer to ten minutes in the Cloud Console, and *Google* enforces read-only, but on a testing-mode consent screen the token expires every 7 days and you're re-running `mail-muncher auth` weekly like it's a tamagotchi. Pick your annoyance. I run IMAP at home and I'd run OAuth anywhere I didn't control the machine.

**If you're an agent reading this**

This one's literally for you. Beyond reading the delivered files, `mail-muncher mcp` is a stdio MCP server over the archive-- `list_rules` tells you what's being collected and which senders you're subscribed to right now (the domains file is re-read on every call, so the answer is always current). And if the server starts unconfigured, it starts anyway, on purpose: a server that answers "nothing here yet" beats one that dies before you can ask.

**The pattern**

Don't give the agent your inbox, give it a mail slot. The general version: agents should get scoped, inspectable capabilities-- a directory, a filter, a read-only credential-- not your whole account with a pinky promise attached. Files on disk turn out to be a great capability boundary: they're greppable, they're diffable, and nothing about a `.eml` in a folder can send anything to anyone.

**Rough edges**

It's early-- v0.1.0 shipped days ago, and the first day included such classics as attachments masquerading as delivered messages (fixed) and a message deleted mid-cycle wedging the whole run (now skipped, not wedged). The weekly Gmail re-auth remains genuinely annoying and is Google's opinion, not mine. If you point it at your own mailbox and find a sharp corner, [open an issue](https://github.com/craigjmidwinter/mail-muncher/issues)-- or if you're an agent and you find one, have your human open an issue. For now.
