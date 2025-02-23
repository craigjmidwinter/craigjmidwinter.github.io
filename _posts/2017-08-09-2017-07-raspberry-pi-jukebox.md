---
title: True MPD Jukebox using Raspberry Pi
slug: 2017-07-raspberry-pi-jukebox
date_published: 2017-08-09T21:28:00.000Z
date_updated: 2018-12-21T21:06:58.000Z
tags: Raspberry Pi, Programming
---

Since my fiancee, Jess, and I are getting hitched in a few months, we've obviously been in the midst of wedding planning (prior to starting work on this game). When discussing our options for music, we thought that the money we could spend on hiring a DJ could be better spent elsewhere. Initially we were just going to put together a google music playlist and let it run on shuffle, but then I thought it would be fun to let guests have a say in the playlist, so I decided that I could probably build a jukebox web app pretty easily.

The jukebox application is pretty straight forward. It's a Laravel project which basically consists of two components. First, a pared-down MPD web client which users can just select a song to add to the queue. The second portion is an artisan command which runs in the background which listens for the state of MPD. Whenever the song changes, the listener checks to see if its that song is the last song in the queue, and if it is, it just queues a random song.

It's open source and [you can check it out on GitHub if you'd like](https://github.com/wardcraigj/jukebox) (though I haven't touched the readme yet, it's pretty straight forward I'll try to remember to update it with some instructions). The repository is a Homestead project, which I was using for dev, so you can probably get it going locally with a 'vagrant up' though you might need to do some tinkering with MPD in the VM in order for it to actually play.

In "production", I'm running it on a Raspberry Pi LEMP stack.

Step-by-step to follow...
