---
title: Smart Garbage! – Pattern for deferring service calls in Home Assistant
slug: 2018-05-smart-garbage-pt-1-pattern-for-deferring-service-calls-in-home-assistant
date_published: 2018-05-16T23:27:00.000Z
date_updated: 2018-12-31T14:49:50.000Z
tags: Home Assistant, Home Automation, YAML, Design Patterns
---

Garbage day is the same day every week, but somehow I haven’t developed a steady routine surrounding it. Our garbage is picked up out front, but the main way we enter and leave the house is through the back door. As a result, I’ve got a bad habit of forgetting to put out the garbage and recycling. While I haven’t come up with a way to make the bins take themselves out, I’ve come out with a nice solution to remind me to take them out and bring them back in.

This is the first part in a series of posts about how I’ve implemented my Garbage reminders. I wanted to cover this automation, because while it’s a ridiculously unnecessary automation, I think some of the components and patterns in its implementation can be followed and used individually in really interesting ways. In this post, I’m going to focus on the pattern that I follow when I need to defer a service call within Home Assistant.

So, this automation started really simply. Since Garbage day is Friday, I just set a static reminder on Thursday evening to notify me to put the garbage out, and one on Friday after work to bring it back in. The automations for both are essentially the exact same just at a different time with different message text, so we’ll just look at the first one

    - alias: 'Garbage Day'
      initial_state: 'on'
      trigger:
        platform: time
        at: '20:15:00'
      condition:
      - condition: time
        weekday:
          - thu
      action:
      - service: notify.149twitter
        data:
          message: "Tomorrow is garbage day @craigjmidwinter"

Ok, not bad, but it could be better. What if I’m not home? How about I defer these notifications until I get home when I can actually do something about it so that I don’t forget again?

We can easily make sure this doesn’t fire while we are away by adding a condition to our first automation so that it only fires when we are home–

    - alias: 'Garbage Day - Home'
      initial_state: 'on'
      trigger:
        platform: time
        at: '20:15:00'
      condition:
      - condition: time
        weekday:
          - thu
      - condition: state
        entity_id: device_tracker.craig_craig
        state: 'home'
      action:
      - service: notify.149twitter
        data:
          message: "Tomorrow is garbage day @craigjmidwinter"

But what happens if we are away when our reminder is supposed to fire while we’re out? We need an automation to handle that situation. It’s going to look very similar to the one for our home state.

    - alias: 'Garbage Day - Not Home'
      initial_state: 'on'
      trigger:
        platform: time
        at: '20:15:00'
      condition:
      - condition: time
        weekday:
          - thu
      - condition: template
        value_template: "{{ not is_state('device_tracker.craig_craig', 'home') }}"
      action:
      - service: input_boolean.turn_on
        entity_id: input_boolean.garbage_day_pending

There are a couple of key differences in this automation. The first is the template condition that we added. I’ve decided to use a template condition here instead of a simple state condition that checks for not_home because I’ve got some zones set up, so this device tracking isn’t necessarily always in the not_home state when I’m out.

The second difference is that instead of calling the notification service, I’m turning on an input boolean that we need to add to our main configuration like this–

    input_booleans:
      garbage_day_pending:

Perfect. Now we can create automations for our state change for when we arrive home, and use these being in the on state as a condition, and then in the action, we’ll trigger the service call we want to make, and then set our pending input boolean to off since the job is complete.

    - alias: 'Deferred Garbage Day Notification'
      trigger:
        platform: state
        entity_id: device_tracker.craig_craig
        to: 'home'
      condition:
      - condition: state
        entity_id: input_boolean.garbage_day_pending
        state: 'on'
      action:
      - service: notify.149twitter
        data:
          message: "Tomorrow is garbage day @craigjmidwinter"
      - service: input_boolean.turn_off
        entity_id: input_boolean.garbage_day_pending

Ok, great! But having these service calls duplicated sucks, what if we want to add on another notification platform like a facebook message or something? Then we’d need to make that change in more than one place, so lets move these to their own scripts and just call the scripts from both places. The scripts will look like this:

    garbage_notify:
      sequence:
        - service: notify.149twitter
          data:
            message: "Tomorrow is garbage day @craigjmidwinter"
        - service: notify.facebook
          data:
            message: "Tomorrow is garbage day"
            target:
              - !secret facebook_id_craig
              - !secret facebook_id_jess

Then our complete, updated automations will look like this:

    - alias: 'Garbage Day - Home'
      initial_state: 'on'
      trigger:
        platform: time
        at: '20:15:00'
      condition:
      - condition: time
        weekday:
          - thu
      - condition: state
        entity_id: device_tracker.craig_craig
        state: 'home'
      action:
      - service: script.turn_on
        entity_id: script.garbage_notify
    
    - alias: 'Garbage Day - Not Home'
      initial_state: 'on'
      trigger:
        platform: time
        at: '20:15:00'
      condition:
      - condition: time
        weekday:
          - thu
      - condition: template
        value_template: "{{ not is_state('device_tracker.craig_craig', 'home') }}"
      action:
      - service: input_boolean.turn_on
        entity_id: input_boolean.garbage_day_pending
    
    - alias: 'Deferred Garbage Day Notification'
      trigger:
        platform: state
        entity_id: device_tracker.craig_craig
        to: 'home'
      condition:
      - condition: state
        entity_id: input_boolean.garbage_day_pending
        state: 'on'
      action:
      - service: script.turn_on
        entity_id: script.garbage_notify
      - service: input_boolean.turn_off
        entity_id: input_boolean.garbage_day_pending

Fuck yeah! Now I’ll never forget to take the trash out ever again. This same pattern for deferring service calls is a super handy tool to use in order to add better context to notifications and automations.

It’s a small thing, but I personally find that it really helps make the house feel smarter– so much so that I’m considering writing a feature for Home Assistant to handle this sort of flow in a queue-worker system (for example, instead of having setting a switch, and then checking the switch when you get home to trigger the service call, you would just send the information about the service call to a ‘home’ queue and manage when the worker should be processing the jobs).

That’s it for part one! Stay tuned for part two where I’ll go over how I’m determining whether the garbage is at the curb already!
