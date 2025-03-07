---
title: Using Home Assistant and Philips Hue to create a full colour sunrise
slug: 2017-12-using-home-assistant-and-philips-hue-to-create-a-full-colour-sunrise-alarm-clock
date_published: 2017-12-06T21:58:00.000Z
date_updated: 2018-12-21T20:51:44.000Z
tags: Home Assistant, YAML, Philips Hue, Home Automation
cover_image: /assets/blog/sunrise.jpg
---

This is a new automation in my set-up, but it’s one I’m pretty happy with, not only because I think it’s a pretty cool effect, but for me, it’s actually a real money-saver.

Here’s how I used [Philips Hue](http://amzn.to/2jkHCCj) and [Home Assistant](https://home-assistant.io/) to build a natural coloured sunrise in my bedroom and save over $400/year--

![](https://www.youtube.com/watch?v=mccJNHih7a8)

**How does this save me money?**

I am addicted to snoozing on alarms in the morning.

In the mornings, I can either have a nice relaxing 30-minute walk into the office, or I can rush to the bus stop about 7
minutes away and catch an 10 minute bus. This choice getting left to be made by the sleepiest version of myself is no
good-- sleepy Craig sucks. He’s a lazy piece of shit. He’d sell his first-born child for an extra 13 minutes of sleep in
to morning.

Over time, taking the bus adds up. By a conservative estimate of the e-cash fare ($2.35, for now...), and saving 4 trips/week for 48 weeks, that’s $451.20 back in my pocket! Fuck yeah!

This automation has significantly cut down on how many times I hit snooze, and I also find that waking up is less jarring and I’m a lot less groggy as a result.

If you are a Home Assistant user, and you have Philips Hue bulbs or some other coloured smart lighting system setup that
supports transitions, I definitely recommend setting something like this up!

**How does it work?**

I’m going to assume that you’ve already got Home Assistant set up and working with your lights. If not, head over to homeassistant.io and give it a try. It’s really pretty easy to get up and running and the learning curve is not as steep as it looks, plus, there is a fantastic community that will provide you with support if you hit a snag.

Now, to implement this, we are going to be creating a Home Assistant script, which will be what run to create our sunrise effect, we’ll create a couple of entities to use in the front end so that we can easily configure when we want this to run, and then we’ll create the automation that will ultimate trigger the script at the desired time.

**The script**

If you’ve played around with Home Assistant a bit, you might have already got a few scripts set-up, or you might just have everything configured right in the actions of your automations. There are a couple of advantages to doing this sort of thing in a script-- the first is that scripts allow us to reuse the actions easily and then if we want to change the action, we only need to adjust it in one place. This is especially nice when we are building more involved multi-step actions like our sunrise.

Here’s what our sunrise script looks like-- It’s a long one, but I’ve got some comments there to give you an idea of what each block is doing and separated it into blocks for readability:

```yaml
    sunrise:
      sequence:
        # light 1 dark red to medium warm orange
        - service: homeassistant.turn_on
          data:
            entity_id: light.craigs_bedroom_lamp
            rgb_color: [98,19,0]
            brightness: 1
        - delay:
            seconds: 1.00
        - service: homeassistant.turn_on
          data:
            entity_id: light.craigs_bedroom_lamp
            rgb_color: [249,123,0]
            brightness: 103
            transition: 15
        - delay:
            seconds: 15.00
    
        # light 2 dark warm orange to medium warm orange
        - service: homeassistant.turn_on
          data:
            entity_id: light.jessicas_bedroom_lamp
            rgb_color: [249,123,0]
            brightness: 1
        - delay:
            seconds: 1.00
        - service: homeassistant.turn_on
          data:
            entity_id: light.jessicas_bedroom_lamp
            rgb_color: [249,123,0]
            brightness: 103
            transition: 15
        - delay:
            seconds: 15.00
    
        # group medium warm orange to full bright
        - service: homeassistant.turn_on
          data:
            entity_id: light.sunrise
            rgb_color: [255,178,67]
            brightness: 255
            transition: 30
        - delay:
            seconds: 30.00
    
    
        # turn one bulb overhead on lowest and fade to full brightness slowly
        - service: homeassistant.turn_on
          data:
            entity_id: light.bedroom_fan_1
            brightness: 1
        - delay:
            seconds: 1.00
        - service: homeassistant.turn_on
          data:
            entity_id: light.bedroom_fan_1
            brightness: 255
            transition: 60
        - delay:
            seconds: 60.00
    
        # turn on the second bulb overhead and fade to full brightness a bit faster
        - service: homeassistant.turn_on
          data:
            entity_id: light.bedroom_fan_2
            brightness: 1
        - delay:
            seconds: 1.00
        - service: homeassistant.turn_on
          data:
            entity_id: light.bedroom_fan_2
            brightness: 255
            transition: 30
    
        # no delay - also through put the corridor outside the room on
        - service: homeassistant.turn_on
          data:
            entity_id: light.upstairs_corridor
            brightness: 200
            transition: 5
```

There are a couple of things worth noting about this script. What makes this effect work well is the use of the light entities ‘transition’ attribute in combination with the ‘delay’ action in the script.

Typically, Home Assistant wants to perform actions quickly and then immediately move on to the next action. Normally, that’s exactly what we want, but in this case, it’s not. By setting the ‘transition’ in the data when we call the ‘homeassistant.turn_on’ service, we are telling Home Assistant how long it should take to transition from the lights current state to the new state. Now, we need Home Assistant to wait before performing the next step so we use the ‘delay’ action and set it to the same number as the number we have as our transition time.

I’ve played with the times and I found that for me, these are the durations that work best, but you can play with them to suit your preference.

**The entities**

Now, before we write our automation to trigger this, lets create some entities that we can use to configure this a bit easier.

I’ve got this set as two separate automations in my set-up. One for weekdays, and the other for weekends. This lets me have separate wake-up times that I don’t need to mess with too often.

Here’s the entities I’ve created:

```yaml
    input_boolean:
      weekday_sunrise:
      weekend_sunrise:
    
    input_number:
      weekday_alarm_hour:
        name: Hour
        icon: mdi:timer
        min: 0
        max: 23
        step: 1
      weekday_alarm_minutes:
        name: Minutes
        icon: mdi:timer
        min: 0
        max: 59
        step: 5
      weekend_alarm_hour:
        name: Hour
        icon: mdi:timer
        min: 0
        max: 23
        step: 1
      weekend_alarm_minutes:
        name: Minutes
        icon: mdi:timer
        min: 0
        max: 59
        step: 5
    
    sensor:
      - platform: template
        sensors:
          weekday_alarm_time:
            friendly_name: 'Time'
            value_template: '{{ "%02d:%02d" | format(states("input_number.weekday_alarm_hour") | int, states("input_number.weekday_alarm_minutes") | int) }}'
          weekend_alarm_time:
            friendly_name: 'Time'
            value_template: '{{ "%02d:%02d" | format(states("input_number.weekend_alarm_hour") | int, states("input_number.weekend_alarm_minutes") | int) }}'
```

**Okay, whoa, whoa, whoa! What the fuck are those sensors? They look complicated.**

Yeah, you can add those and not touch them, but if you want to know what they are doing, I’ll try to explain. If you don’t give a shit or already know, [skip ahead](#sunrise-entities)

As you may or may not know, [Home Assistant has support for a template engine](https://home-assistant.io/docs/configuration/templating/) called [Jinja](http://jinja.pocoo.org/). This allows you to evaluate and manipulate data at execution. These sensors that we are creating here basically takes the data and instructions that we are giving it and evaluate it as the sensors state. This is a really powerful tool to have in your Home Assistant arsenal, and I’d highly recommend looking at the Home Assistant documentation and the Jinja documentation to get a better grasp on this.

I’ll try to break down this statement and what happens behind the scenes:

```yaml
{{ "%02d:%02d" | format(states("input_number.weekday_alarm_hour") | int, states("input_number.weekday_alarm_minutes") | int) }}
```

We’ll start looking at this from the inside-out

```yaml
{{ "%02d:%02d" | **format(states("input_number.weekday_alarm_hour")** | int, states("input_number.weekday_alarm_minutes") | int) }}
```
This item in bold is just getting the state of the entity that it’s being passed. In this case, it’s going to be a string of characters representing a number-- If you remember when we created this entity, from 0-23 representing the hour we want to wake up at. Let’s pretend that we’ve got this set to 6. So this is going to end up returning “6”, and our statement now essentially looks like this:

```yaml
{{ "%02d:%02d" | format(**“6”** | int, states("input_number.weekday_alarm_minutes") | int) }}
```

Now, we’ve got the same thing happening to the other number entity.

```yaml
{{ "%02d:%02d" | format(“6” | int, **states("input_number.weekday_alarm_minutes")** | int) }}
```

This represented minutes, so it’s going to be between 0-59. Let’s pretend we’ve got this set to 30. As you can probably guess, this is going to return “30”

```yaml
{{ "%02d:%02d" | format(“6” | int, **“30”**| int) }}
```

Ok, now what is that line symbol ('|') we see in here? That’s a pipe symbol and in jinja, it’s the filter operator. Essentially, it takes what is on the left and filters it through what is on the right side.

```yaml
{{ "%02d:%02d" | format(**“6” | int**, **“30”| int**) }}
```

In the case above, we are taking “6” and putting it though the int filter. This int filter basically says to take the characters on the left side and make them a number that the computer can use. So “6” | int becomes 6 and “30” | 30. Now our statement looks like this:

```yaml
{{ "%02d:%02d" | format(**6, 30**) }}
```

Ok, that’s a bit easier to read now. Now we’ve just got some crazy characters, the filter with our numbers representing the time.

```yaml
{{ **"%02d:%02d" | format(6, 30)** }}
```

So, the format filter means to apply Python string formatting. Python string formatting is a way for you to say “I want a string of characters that looks like this” and then give it some data and get a string that looks the way you asked it to.

The crazy string of characters represents how we want the resulting string to look and the numbers in the brackets are extra data (called parameters) that we want to be formatted in this way.

[PyFormat.info](https://pyformat.info/) has some good information on all the ways you can format a string, but what you need to know about this is that the ‘%’ sign means that we are going to put the a value that is getting passed in here, the ‘d’ is the type of data that is going here (d means int). The stuff in between says how we want to display it-- the 2 means it should be 2 characters long and 0 is the character we should use to pad it if the value is too short. So for our first value 6 inserted at the first %02d becomes 06 and the second value at the second %02d becomes 30. The ‘:’ character unchanged since it is outside of the replacement which leaves us with

```yaml
{{ "06:30” }}
```

The double curly brackets in jinja just means to evaluate what is inside and output it. We already know what that is-- 06:30! That’s our sensors state!

**The other entities**

Ok, remember those other entities we set up? The non-crazy ones?

```yaml
    input_boolean:
      weekday_sunrise:
      weekend_sunrise:
    
    input_number:
      weekday_alarm_hour:
        name: Hour
        icon: mdi:timer
        min: 0
        max: 23
        step: 1
      weekday_alarm_minutes:
        name: Minutes
        icon: mdi:timer
        min: 0
        max: 59
        step: 5
      weekend_alarm_hour:
        name: Hour
        icon: mdi:timer
        min: 0
        max: 23
        step: 1
      weekend_alarm_minutes:
        name: Minutes
        icon: mdi:timer
        min: 0
        max: 59
        step: 5
```

Yeah, those ones.

I just added those their own groups like this and then added them to one of my views:

```yaml
    weekday_sunrise_panel:
        name: Weekday Alarm Clock
        entities:
          - input_boolean.weekday_sunrise
          - sensor.weekday_alarm_time
          - input_number.weekday_alarm_hour
          - input_number.weekday_alarm_minutes
    
    weekend_sunrise_panel:
        name: Weekend Alarm Clock
        entities:
          - input_boolean.weekend_sunrise
          - sensor.weekend_alarm_time
          - input_number.weekend_alarm_hour
          - input_number.weekend_alarm_minutes
```

**The automation**

Ok, so now that we’ve got our script ready to go and our entities set up in the front end, let’s make our automations!

```yaml
    - alias: 'Weekday Sunrise'
      initial_state: 'on'
      trigger:
        - platform: time
          minutes: '/1'
          seconds: 0
      condition:
        - condition: time
          weekday:
            - mon
            - tue
            - wed
            - thu
            - fri
        - condition: state
          entity_id: input_boolean.weekday_sunrise
          state: 'on'
        - condition: template
          value_template: '{{ ((as_timestamp(now())|int)|timestamp_custom("%H:%M"))  == states("sensor.weekday_alarm_time") }}'
      action:
        - service: media_player.play_media
          data:
            entity_id: media_player.everywhere
            media_content_id: https://149walnut.publicvm.com:8123/local/audio/circle-of-life.mp3
            media_content_type: audio/mp3
        - delay: 3 #this is here to compensate for the delay in playing the media over chromecast.
        - service: script.turn_on
          entity_id: script.sunrise
    
    - alias: 'Weekend Sunrise'
      initial_state: 'on'
      trigger:
        - platform: time
          minutes: '/1'
          seconds: 0
      condition:
        - condition: time
          weekday:
            - sat
            - sun
        - condition: state
          entity_id: input_boolean.weekend_sunrise
          state: 'on'
        - condition: template
          value_template: '{{ ((as_timestamp(now())|int)|timestamp_custom("%H:%M"))  == states("sensor.weekend_alarm_time") }}'
      action:
        - service: script.turn_on
          entity_id: script.sunrise
```

Here’s our two automations. Both are pretty much exactly the same, with a couple of exceptions.

The triggers are exactly the same in both. The trigger happens every minute. Obviously we don’t want this firing every minute, that’s where our conditions come into play.

The first condition is for the day of the week-- pretty straight forward. The weekday automation is set to weekdays and the weekend automation is set to weekends.

The second condition is whether or not we have our input_boolean switch enabled. We’ve got a separate switch so we can turn weekday or weekend alarms on or off independently. Each automation uses the corresponding input_boolean for this condition.

The third condition is another template! We already know how templates get evaluated. This is pretty similar. What we haven’t seen before is the == sign. This means to check for equivalence between the values on either side.

Without going into too much detail about templates again, the stuff on the right side uses some built-in functions to get the current time and output it. These built-in functions output the time as a string in the same format as the format we used for the sensor we created earlier. On the right side-- hey, look at that! We’re getting the state of our sensor! So, when the clock hits the time that we set, this will be True and our third condition will be met!

The action on both of these are similar-- they both trigger our script. The only real difference between these two actions is that on weekdays, I like to wake up to the sunrise accompanied by “The Circle of Life” from the Lion King soundtrack blaring on all my speakers… I don’t need to justify myself to you.

That’s it! If you have any questions or if you’ve implemented this yourself, let me know in the comments!
