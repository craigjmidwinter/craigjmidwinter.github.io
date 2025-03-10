---
title: Automatic Litterbox Notifications – Using an Home Assistant and Node Red with an external REST API
slug: 2018-06-automatic-litterbox-notifications-using-an-home-assistant-and-node-red-with-an-external-rest-api
date_published: 2018-06-24T00:03:00.000Z
date_updated: 2018-12-21T20:49:02.000Z
tags: Node-RED, Home Assistant, Home Automation, Programming
---

Cleaning the cat litter– it’s the job the whole household fights over. Nothing is quite as glamourous as scooping shit out of a box in a dark corner of the basement.

It’s always these undesirable tasks that I end up putting off and forgetting about. The thing about the cat litter is that it’s a lot less of a pain in the ass to clean if you stay on top of it. Unfortunately, it’s my chore and I don’t always stay on top of it as well as I probably should- it’s not uncommon for Jess to notice that it’s getting a bit too full even though I feel like I have just cleaned it.

In any event, I wanted a solution to take the guess-work out of it and to give me a reminder when it’s full. Down the road I was thinking about gamify it and awarding myself badges and maybe keeping a highscore board for cleaning streaks and stuff.

Now, there are a number of ways you can really simply implement something pretty much exactly the same as what I’ve got here using purely Home Assistant (or HASS and Node Red or AppDaemon), but I decided I wanted to create a little external service so I could extend and fuck around with it in the future if I wanted to. I won’t go into the details of that service but if you’re really interested, let me know and I can make a post about it in the future.

**So, what does this do?**

Basically, all it consists of is a button near the litterbox that I hit after I’ve cleaned the litter box to log the fact that I’ve cleaned it. It fires a thank you tweet off and logs the cleaning in the microservice. In addition to the api endpoint for logging the cleaning, it provides a few endpoints to provide some information to my HASS install, the main one being an litterbox fill percentage that my HASS install uses in a sensor to determine when it should notify me about needing to be cleaned again. Let’s look at the Node-Red flow:
![](/src/images/2018/12/Screenshot-2018-06-24-16.54.22.png)
It looks a little more complicated than it actually is. I tried to group it and lay it out as logically as possible. Let’s take a look at the top part of the flow
![](/src/images/2018/12/Screenshot-2018-06-24-16.55.55.png)
The top part of this flow just handles the litter clean button press. When it sees the event in Home Assistant, it uses the HTTP Request node to send a request to the API on the litterbox microservice to log the cleaning, thanks me on twitter, and then waits 20 seconds (I do this here because the sensor we use in Home Assistant only updates every few seconds.) before sending the reset message to the Trigger & Block node.

There is also this daily notification reset, that sends the reset message to the Trigger & Block node once a day.

**What is the trigger and block node and what does it do?**

The trigger and block node is useful node that is helpful for limiting actions that only should be triggered once. Essentially, the first message through it passes through and then locks the door behind it. In order to open the door for more messages to come through, you need to send a message where msg.reset is set. So in this case, we are firing our notification flow the first time that the litter level crosses the threshold and then the door locks. After that, we are unlocking the door once a day to allow another notification through as a reminder and also unlocking it after it gets cleaned.

**Ok, let’s take a look at the actual notification flow**
![](/src/images/2018/12/Screenshot-2018-06-24-16.57.10.png)
The main trigger for this part of the flow is checking the litter fill sensor I’ve got set up in Home Assistant. This is a REST sensor and it gets the percentage from my micro service’s api using an HTTP request. This type of sensor is really handy and has really limitless potential since you can use it to get any sort of data from any external REST API that you’ve got access to and use a template to read the data you want to use. This is what the configuration for my sensor looks like in my Home Assistant config

    - platform: rest
      name: litter_percent
      unit_of_measurement: '%'
      resource: http://litterboxservice.local/catlitter/litter-percent
      icon_template: '{% if states.sensor.litter_percent.state|default(0)|int >= 75 %}mdi:emoticon-poop{% else %}mdi:cat{% endif %}'

Now that we’re getting the data we want, let’s look at the notifications.

So, I get these notifications in two ways. The first way I receive it is through a voice notification in the house. To accomplish this, I just send a formatted message to my [voice notification sub-flow that I covered in this previous post.](https://149walnut.com/2018-06-i-hired-a-dude-who-voices-nike-commercials-to-tell-me-when-my-cat-litter-is-full/)

The second way I get these notifications is through twitter, and in this case I also attach a photo of the dirty litter box just for some added shaming. I’ve got a camera set up down there and a little script runs that keeps an snapshot stored on my HASS server. I’ve noticed that the night-vision images are pretty gross, so I’ve got a little flow that checks if the lights are on down there and if they are off it will turn the lights in the basement on for a bit so that the snapshot is better lit before it sends it.

The actual fill percentage isn’t based on anything but time since the last cleaning– for now, this is pretty effective but down the road I’m considering adding some load sensors to the bottom of the litter boxes in order to detect when the cats actually visit the boxes and using the number of visits since the last cleaning for this value. I’m also considering only tweeting the photo of the full litter box if I haven’t cleaned it after the first notification.

If you’ve got any questions or improvements that you want to suggest, leave me a comment!
