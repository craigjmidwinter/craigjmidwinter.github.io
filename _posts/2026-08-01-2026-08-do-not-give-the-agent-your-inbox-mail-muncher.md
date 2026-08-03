---
title: Don't give the agent your inbox, give it a mail slot – mail-muncher
slug: 2026-08-do-not-give-the-agent-your-inbox-mail-muncher
date_published: 2026-08-01T20:45:00.000Z
tags: Mail Muncher, AI Workflows, Agents, MCP, Go
cover_image: "/assets/blog/2026/mail-slot.jpg"
---

I build a lot of tiny tools for tedious workflows. Population: one user, me. The reigning example is the booking pipeline for the podcast: every invitation lives in its own little directory with a status-- prospect, invited, confirmed, scheduled, recorded-- a tracker file shows where everyone stands, and a triage step keeps it all honest. The tedious part was never the spreadsheet. The tedious part is that the whole workflow runs on *other people answering email*, and for years the state machine that noticed the answers was me, scrolling my inbox, badly. Tools like this are trivial right up until they need to know whether somebody replied. Sending the invitation is one line of code. Reading the answer means mail access, and mail access is where every little workflow tool I've ever started went to die-- because the obvious way to grant it is handing the thing your entire account, and these days the thing doing the reading is an agent, which sharpens the problem considerably.

Think about what that grant actually is. Full mailbox access can read two decades of tax documents, medical appointments, and every password reset you've ever received. It can usually send. It can usually delete. I trust the booking pipeline to read replies from people I invited onto a podcast; I do not trust anything, silicon or otherwise, with *send and delete on my primary email account*. Read the scope screen sometime and see how you feel about it.

So I built [mail-muncher](https://github.com/craigjmidwinter/mail-muncher): an email client for AI agents. It gives a program its own read-only mailbox, filtered down to exactly the mail it asked for, delivered as files on disk.

**How it works**

Mail-muncher pulls from any IMAP mailbox (or Gmail's API with a read-only OAuth scope), evaluates each message against ordered rules, and writes the matches to a directory-- a byte-faithful `.eml`, plus a markdown rendering with the headers as YAML frontmatter and attachments extracted alongside. No mode ever writes to your mailbox. The agent never touches the account at all; it reads files, which it was already good at.

```yaml
accounts:
  - name: personal
    provider: imap
    imap:
      host: imap.fastmail.com
      username: craig@example.com
      password_cmd: security find-generic-password -s mail-muncher -w

rules:
  - name: podcast-booking
    match:
      any:
        - from_regex_file: ~/.local/share/booking/invited.txt
        - subject_regex: "(?i)oscars outsider"
    dest: ~/Mail/booking
    formats: [eml, markdown]
```

That's the whole config. Unknown keys are a hard error, so a typo fails `mail-muncher validate` instead of quietly matching nothing at 3am.

**The feature I'm proudest of is the file another program owns**

That `invited.txt` doesn't belong to mail-muncher and it doesn't belong to me. It belongs to the booking pipeline, and mail-muncher re-reads it at the start of every cycle. The moment an invitation goes out, the pipeline appends a line for that person. The very next cycle, their replies start landing in its mailbox-- no config edit, no restart, no redeploy. When a booking closes out, the line goes away and the mailbox narrows itself. The tool subscribes itself to exactly the correspondence its workflow needs, one line at a time. (The same trick works a level up with `from_domains_file`, where the lines are whole sender domains-- publicists, studios, anyone institutional.)

The delivered files are where it gets good, because mail as *files* means the rest of the pipeline is just programs reading a directory. A sweep runs every five minutes; a triage step reads whatever's new and turns it into proposals against the tracker: she said yes, move her to scheduling; he asked for dates, draft three options; two weeks of silence on this one, nudge or archive? I approve the proposals; the tracker stays true; nobody re-reads an inbox. The mail stopped being a place I check and became an input the pipeline consumes.

Once you see the shape you see it everywhere, because every workflow that involves other people eventually hits a phase that boils down to *did they answer yet*. A job search is this exact machine with higher stakes: every application subscribes the pipeline to one more company, every reply is a state change, and three weeks of silence is data worth acting on. Cold outreach in sales is the same loop with a quota attached. Chasing invoices, collecting RSVPs, nagging reviewers about a stale PR, waiting on a contractor's expiring paperwork-- the tool owns a text file, and the mailbox follows the tool. Two programs coordinating through a text file is 1970s technology, and I mean that as the highest compliment.

And replies are only half of what an inbox is. The other half is a feed nobody structures for you: newsletters, receipts, statements, alerts, the transactional exhaust of being a person. Point a rule at the senders worth keeping and `dest:` at a folder your agent indexes, and you're building a corpus out of your own mail-- the markdown rendering with its frontmatter is ready to grep or embed, attachments are already extracted alongside, and the byte-faithful `.eml` sits next to it for when you need the original as evidence. A year of receipts becomes an expense dataset; a few good newsletters become a searchable library instead of guilt. An inbox is a dataset that arrives pre-sorted by sender and dated to the second. It just needed a tap installed.

**That file is a capability, so treat it like one**

Since I'm bragging about it, the honest caveat, and it applies to both flavors of watch file. Domain matching is equality-or-subdomain, so `acme.com` also catches `careers.acme.com`-- handy, and it means one line reading `com` subscribes the agent to every .com sender in the mailbox; the regex flavor has an equivalent foot-gun in a lone `.`, which matches everyone with a pulse. The parser now refuses the obviously-too-broad entries, per line, loudly, without dropping the rest of the file. But no guard changes the shape of the thing: whoever can append a line widens the slot. That's config-level trust living in a file that looks like a to-do list. Own it, chmod it, and don't leave it anywhere the agent can write.

**None of the plumbing is new, and I'm not going to pretend it is**

Fetch mail, filter it, drop it somewhere: that's fetchmail and procmail, and Sieve has been doing rules server-side since before I had a mail account worth filtering. [The README lists the tools that do this better](https://github.com/craigjmidwinter/mail-muncher#alternatives) when a human is the consumer. Two things here I do claim. The filter operand lives in a file another program owns and gets re-read every cycle. And the failure policy is built for that arrangement: if a watch file vanishes mid-run, the default `on_degraded_filter: hold` stores whatever did match, logs the degradation loudly, and then refuses to save the advanced cursor-- so the mail you wanted gets re-evaluated when the file comes back, instead of being consumed by an empty list while everything reports success.

**The read-only question, honestly**

"Read-only" deserves scrutiny, so here's the actual table ([the README](https://github.com/craigjmidwinter/mail-muncher#two-ways-to-connect-a-mailbox) has the long version). With plain IMAP you authenticate with an app password, setup takes about two minutes, and read-only is enforced by mail-muncher's own code-- the credential itself could send and delete, the program just never does. With the Gmail provider you register an OAuth client with the `gmail.readonly` scope, setup takes closer to ten minutes in the Cloud Console, and *Google* enforces read-only, but on a testing-mode consent screen the token expires every 7 days and you're re-running `mail-muncher auth` weekly like it's a tamagotchi. Pick your annoyance. I run IMAP at home and I'd run OAuth anywhere I didn't control the machine.

![The Gmail OAuth token on day 7. It needs to be fed, it does not care that it's Sunday, and there is no version of this where I remember on my own.](/assets/blog/2026/meme-token-tamagotchi.jpg)

While I'm being honest about that app password: there is deliberately no `password:` key in the schema, only `password_cmd`, so the secret stays in the keychain and the config stays boring enough to commit. That's worth something, and it's worth less than it looks. Anything that can read the config can also run the command it names, and what comes back is a full mail credential that can send and delete. The boundary actually doing the work there is process isolation. So if your agent has Bash on the same box, run mail-muncher somewhere the agent isn't-- a different user, a container, another machine. The mail slot is only a slot if the agent can't walk around to the back door.

**If you're an agent reading this**

This one's literally for you. Beyond reading the delivered files, `mail-muncher mcp` is a stdio MCP server over the archive-- `list_rules` tells you what's being collected and which senders you're subscribed to right now (the watch files are re-read on every call, so the answer is always current). And if the server starts unconfigured, it starts anyway, on purpose: a server that answers "nothing here yet" beats one that dies before you can ask.

**The pattern**

Don't give the agent your inbox, give it a mail slot. The general version: agents should get scoped, inspectable capabilities-- a directory, a filter, a read-only credential-- not your whole account with a pinky promise attached. Files on disk turn out to be a great capability boundary: they're greppable, they're diffable, and nothing about a `.eml` in a folder can send anything to anyone.

**The direction this doesn't protect you in**

The mail slot bounds what the agent can do to my account. It does exactly nothing about what the mail can do to my agent. Every byte that lands in that folder was written by a stranger and is about to be read by a program holding tools, which is prompt injection with a tidy filename and a YAML header. Filtering by sender domain narrows who gets to try; the words that arrive are still theirs. I put every company on that list myself and I still have no idea who's typing at the other end. The README puts it flatter than I'd have dared about my own project: "Message bodies are attacker-controlled text. Filtered is not vetted." Delivered mail is data, and it doesn't earn authority by arriving through a tool you trust.

**Sharp corners, week one**

It's early-- four releases in the first three days, which is either momentum or panic, and the first day included such classics as attachments masquerading as delivered messages (fixed) and a message deleted mid-cycle wedging the whole run (now skipped, not wedged). The weekly Gmail re-auth remains genuinely annoying and is Google's opinion, not mine. If you point it at your own mailbox and find a sharp corner, [open an issue](https://github.com/craigjmidwinter/mail-muncher/issues)-- or if you're an agent and you find one, have your human open an issue. For now.
