---
title: I hired a dude who voices Nike commercials to tell me when my cat litter is full
slug: 2018-06-i-hired-a-dude-who-voices-nike-commercials-to-tell-me-when-my-cat-litter-is-full
date_published: 2018-07-04T00:00:00.000Z
date_updated: 2018-12-21T20:48:22.000Z
tags: Home Assistant, Home Automation, Node-RED
---

So, recently I decided to step my game up with my audio notifications for my home automation setup. I’m in the process of slowly redoing some of my YAML automations in Node-RED, and I thought what better of a time to make some improvements.

Up until recently I had been just using the built-in Home Assistant tts.google_say service to create whatever message I needed and then piping that over my whole home audio when I needed. It’s reliable and gets the job done just fine, but it’s very robotic and I wanted a voice with personality and confidence.

So, naturally, I went on Fiverr.

After some searching and listening to a lot of different samples I came across a gig from a guy named Uni V Sol who had a very impressive demo reel.

Perfect. If major brands like Nike, Pepsi and AT&T trusted him to deliver their important messages, I’m sure I could trust him to deliver important notifications about my cat’s litter box being full.

So, I bought 50 words worth and sent him a list of notifications.

How did they turn out? Have a listen to my new cat litter notification:

It was super affordable and I’m really happy with how they turned out. I’ll definitely be ordering from him again once I’ve got another batch of notifications ready. [(Check out his fiverr gig here)](https://www.fiverr.com/univsolmc/record-an-urban-male-voice-over)

Now that I’ve got my fancy new notifications, let’s put them to use

I don’t really care about if these go off when I’m not home, but I don’t want them to go off while the house is in ‘Night Mode’ and wake us up. Since I’ve got more than a few notifications that need to be handled in the same way I decided to create a reusable sub-flow that I could just pass messages into from other flows.

The flow for this is pretty simple, take a look–
![](/images/2018/12/Screenshot-2018-06-24-15.10.54.png)
The first node there is the entry point– every flow that is going to pass this flow a message is going to have a corresponding node that is the other side of the virtual wire. This is where the messages come in.

The way that I’ve configure this to work is that incoming messages should all have a property on the message named file that is set to the url of the file we want to play, so we’ll always send a message where msg.file = “https://server/our-notification.mp3.

It’s important to note that I set this on the message object directly and not as part of the payload. The reason that I do that is because the Home Assistant Node-RED nodes trample over the data in the payload, so setting it directly on the msg object makes it easier to persist from node to node.

From there I check the state of an input_boolean that I have set up in HASS that indicates whether or not the house is in “Night Mode”. In my setup, this entity is basically Do Not Disturb mode. This node has a “half if state” set to on, and so if any messages come in while we’re in night mode, we just ignore them.

After that it’s fairly self-explanatory– First it sets the volume of my everywhere media_player group, and then there are two different pairs of nodes that prep a the payload with a sound file, in the set it preps and plays a small blank sound file and then in the second set it preps and plays the notification file I need.

The reason for the blank spacer is because for reasons that still remain a mystery to me, often when Home Assistant tries to play an audio file and it hasn’t yet taken control of the chromecast group, I can hear the chime indicating that HASS has connected, but the audio fails to play. If it’s followed by audio in the next few minutes while HASS still has control, it plays without a hitch, so I’ve got this little blank file in there to make it work more smoothly. If you know why it does this or have a fix for it, please let me know in the comments!

And that about does it for this flow! [If you want to check out how I’ve set up my cat litter notification, check out this post](https://149walnut.com/2018-06-automatic-litterbox-notifications-using-an-home-assistant-and-node-red-with-an-external-rest-api/)!
