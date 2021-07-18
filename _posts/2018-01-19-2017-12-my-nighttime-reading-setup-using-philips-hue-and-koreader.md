---
title: Night-time reading with KoReader and Philips Hue
slug: 2017-12-my-nighttime-reading-setup-using-philips-hue-and-koreader
date_published: 2018-01-19T21:14:00.000Z
date_updated: 2018-12-12T01:19:52.000Z
tags: Philips Hue, KoReader
excerpt: Using Philips Hue and KoReader for nighttime reading
---

Just wanted to quickly post about my new night-time reading set-up since I’m pretty happywith it, so far.
![](/images/2018/12/r1U2cwpMz.jpg)
I hesitate to call this a scene, because when I think of a scene in the home automation context, I think of several entities getting set to a state by a single action trigger, and by that definition, this doesn’t really qualify-- but I’m hoping to change that eventually.

This really just consists of two devices:

- My bedside lamp ([Philips Hue bulb](http://amzn.to/2DLiEon))

- [My e-reader](http://amzn.to/2DHCzEN)

As I mentioned, this isn’t really much of a scene. I do have a button in Home Assistant that sets my Hue bulb to a low red colour, but the second piece of this I have to set separately.

You probably noticed in the attached image that the display on my ereader is inverted, this is a cool feature called ‘night mode’. For some reason, this feature doesn’t come stock on any e-ink e-readers as far as I know (though there might be some), but this can be added pretty easily to most major e-readers using a cool project called KoReader.

KoReader seems to support the major e-readers from what I can tell. It’s was dead simple to get from my factory Kobo settings to running KoReader just by following the [instructions on their wiki](https://github.com/koreader/koreader/wiki).

It also looks like it is super developer friendly, so maybe one day down the line I’ll see if I can add a plugin which will allow me to turn on night mode and adjust the brightness via a home assistant automation!
