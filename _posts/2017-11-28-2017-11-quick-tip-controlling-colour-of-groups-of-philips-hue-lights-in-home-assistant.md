---
title: "Quick Tip: Controlling Colour of Groups of Philips Hue Lights in Home Assistant"
slug: 2017-11-quick-tip-controlling-colour-of-groups-of-philips-hue-lights-in-home-assistant
date_published: 2017-11-28T22:12:00.000Z
date_updated: 2018-12-12T01:17:37.000Z
tags: Home Assistant, Home Automation, Philips Hue
---

Just a quick little tip for anybody using Philips Hue and Home Assistant--

I noticed this while working on a component that I'm hoping to release in the next month or so, but I thought I'd post about it for anybody who might be searching about this sort of behaviour. If you are building any automations or scripts using groups of Philips Hue bulbs, instead of defining the groups in Home Assistant and using them as you normally would, instead create the group on the Hue Bridge using a Hue app.

The group that you create in the Hue app will appear as a single light entity within Home Assistant. There are a few benefits to this-- having Home Assistant address a single entity allows you for more simultaneous control over the bulbs in the group. You can see the difference if you try dimming a Home Assistant group vs the native group that appears as a light entity. When the Home Assistant group dims, each light reacts individually, however when you dim the group entity, all the lights react simultaneously.

Cleaner dimming isn't the only upside, we also are able to set colour and transition time on this light entity and have it apply to the entire group, which can be really handy.

Lastly, this is far more performant. Users with a lot of bulbs on their hub or users who are running Home Assistant on under-powered machines with a lot of devices and integrations should see a bit of a performance gain in these scenarios since it reduces the amount of requests that need to be made between Home Assistant and the Philips Hue hub from 1/device to 1/group.
