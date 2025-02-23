---
title: Introducing WarpcoreJS
slug: introducing-warpcorejs
date_published: 2020-03-03T04:54:12.000Z
date_updated: 2020-03-03T14:24:07.000Z
tags: Home Assistant, Home Automation, Javascript, Programming, YAML, Smart Home, Node-RED
excerpt: WarpcoreJS is an automation engine I wrote so I could write Home Assistant (and other) automations in Javascript
---

It’s been quiet here over the past year, mostly due to the fact that I haven’t really had too much time to work on any home automation projects with a new baby in the house, but recently I’ve been finding myself with a bit more time and energy to look at things again. Before taking on a new project or optimisation after such a long hiatus, I thought I’d do a bit of an audit of my existing setup, and taking an deep-dive into my setup after a year of mostly maintenance and surface level use has been enlightening.

I noticed a few things while auditing my setup.  First was that there was a lot of dead config, which mostly consisted of:

- Non-critical integrations that had become broken either due to not following the upgrade path updating Home Assistant or just being deprecated in general.
- Sensors and automations that I had implemented, and then found a better way to handle or realised it was unnecessary.
- Groups and sensors that I no longer needed

The other main observation was-- prior to my hiatus, I was in the process of moving a bunch of automations from Home Assistant’s internal yaml-based automation engine to Node-RED. This resulted in a messy mix of yaml automations and Node-RED flows.
There is only one option-- we’re going to burn it to the ground.
![](/content/images/2020/03/burn1.gif)I would have hastily edited this to make it relevant but I'm lazy
Actually, going scorched-earth for only those two, fairly easily addressable issues is really extreme, and I’m not going true scorched-earth since I intend on using the same devices, but I’ve learned a lot since starting with Home Assistant, and this gives me an opportunity to revisit all of the decisions that I had made, armed with much more information and experience than I originally had. It also gives me the opportunity to address shortcomings in my setup head-on without my existing infrastructure being used as a crutch or being handcuffed to it by the weight of the effort required to migrate everything since I’m already assuming that effort.
![](/content/images/2020/03/burn2.gif)
This is obviously a sizeable initiative, and there are a few things that have come up during the process that I would like to cover in the future, but there is one thing in particular that I wanted to share--

I decided to write my own automation engine.

## Introducing [WarpcoreJS](https://github.com/craigjmidwinter/warpcore)

Now, first off-- to be clear this isn’t a replacement or alternative for Home Assistant-- this is just an automation engine, so at best it would be an alternative for YAML automations, using Node-Red or AppDaemon. The target audience for this project is someone with who wants to write automations in Javascript.

This project is also not strongly tied to Home Assistant in any way. You could write a service for it that would generate events and execute tasks for anything.

### Got it. Why?

I began writing this as an alternative to existing solutions for Home Assistant for a few reasons:

- I found the built-in YAML automation/scripting feature in Home Assistant to be cumbersome.
- I don't enjoy the visual programming style of NodeRED and it often feels like implementing things in NodeRED is more complex and less elegant than could be accomplished through directly programming them.
- I don't particularly love writing python, which is what AppDaemon uses.

My primary goal was to build a pure automation engine and leave the responsibility of maintaining state (outside of within an automation or task), to Home Assistant. I also wanted to be able to leverage all of the integrations that Home Assistant provides, but also have the ability to integrate directly with devices if I felt the need (I have found trying to get a well timed a light sequence through Home Assistant is difficult, for example).

Additionally, I had a requirement that couldn't be met by any of the above solutions out-of-the-box-- I wanted a queue system for job execution so that I could:

- Make task deferral easier.
- Have distributed worker nodes.

## Task deferral

### Task deferral? What do you mean, what's the use-case?

Lets think about this in terms of an automation:

You have a plant sensor that reports moisture level, and you want to be alerted when it goes below a certain level.

Ok, so in any of the existing automation solutions, it's pretty easy to accomplish a simple notification whenever the sensor drops below a threshold, but what if that happens when we are out? or what if it's the middle of the night? We probably want to defer that notification to a time when we are less likely to forget about it. With WarpcoreJS, we can dispatch a task to a queue to be executed once a condition is met (or immediately if we wanted)

## Distributed Worker Nodes

### Really? How crazy are your automations that you need multiple nodes to handle the workload? Why the hell would you need that?

This might sound like it's either over-engineering or completely unnecessary, but it's not necessarily about the quantity of work that needs to be distributed, it's sometimes about the physical location of where that work needs to be done. Lets say your main home assistant server is located in a closet upstairs, but you had a small bluetooth device in your den, or a little IR blaster to turn off your TV, or maybe you had cannibalised one of your car remotes so you could automate your car starting. It's possible that any of these devices could be out of the range of your primary Home Assistant server, with WarpcoreJS, you could deploy a little pi-zero as a worker node in those locations and have it consume a special queue for these tasks.

## Ok, I’m curious, where can I find the project

The project is on github and npm as [warpcorejs](https://github.com/craigjmidwinter/warpcore) as well as two services that you can plug into it [warpcorejs-homeassistant](https://github.com/craigjmidwinter/warpcore-homeassistant) and [warpcore-time](https://github.com/craigjmidwinter/warpcore-time).

Now that I’ve finally got this project in a published state, I’m actively looking for some contributors to help make it better. This project is really in its infancy, so there is a ton of room for improvements, but if you are interested in helping out and not sure where to start, helping out with any of the following would be super helpful:

- Documentation
- Some helpful util functions for `warpcore-homeassistant` for common actions and in order to make automation writing more readable
