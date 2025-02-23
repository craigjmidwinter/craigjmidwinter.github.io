---
title: NHL goal light celebration with Home Assistant and Philips Hue
slug: 2018-02-nhl-goal-light-celebration-with-home-assistant-and-philips-hue
date_published: 2018-02-11T22:02:00.000Z
date_updated: 2018-12-14T03:46:14.000Z
tags: Home Assistant, Home Automation, NHL, Goallight, Philips Hue, Goalfeed, YAML
---

**2025 Update:** *The Goalfeed integration is now a free addon instead of a component with a paid subscription.
Everything else in this guide should still be relevant though.
See [Goalfeed Hassio Addon](https://github.com/goalfeed/hassio-goalfeed-repository)

Ok, so here’s one of the automations that I think is pretty fun-- my neighbours might disagree though. This is how I use Home Assistant to automatically trigger a goal celebration whenever the Winnipeg Jets score!

~~So, this relies on the [Goalfeed component](https://home-assistant.io/components/goalfeed/) that is in the 0.63
release of Home Assistant, which requires an account with [goalfeed.ca](https://goalfeed.ca/) (full disclosure, I wrote
and operate this service and there's a $1.99/month subscription to cover server cost and external services etc). Once
you’ve got the account and your credentials are in your configuration,~~ Home Assistant will fire events every time an
NHL or MLB team scores. These events can be used to trigger whatever automation you want.

Now, the way this component works is that it fires an event called ‘goal’ for every goal or run scored, the event has some event data that is included which basically just identifies which team scored. Ultimately, the automation is going to look like this:

```yaml
    - alias: 'Jets Goal'
      hide_entity: true
      trigger:
        platform: event
        event_type: goal
        event_data:
          team_name: "Winnipeg Jets"
      action:
      - delay: "00:00:{{ states.input_number.goalfeed.state | int }}"
      - service: homeassistant.turn_on
        entity_id: input_boolean.goaling
      - service: media_player.play_media
        data:
          entity_id: media_player.everywhere
          media_content_id: https://hassbian.local:8123/local/audio/goalhorn1718.mp3
          media_content_type: audio/mp3
      - service: script.turn_on
        entity_id: script.goal_start
```

Since we don’t want to trigger this automation every single time any team scores, we’ve got to specify the event data that we want to match in the automation trigger. You’ll notice there’s a lot going on in the action of this automation.

First, in the action, I have this delay instruction with this template:

```yaml
      - delay: "00:00:{{ states.input_number.goalfeed.state | int }}"
```    

I’ve added an input_number entity in my config like this:

```yaml
    input_number:
      goalfeed:
        name: Goalfeed Delay
        initial: 30
        min: 0
        max: 180
        step: 1
```

The reason for this is that the goalfeed events usually come in really quickly. I watch most games online, and depending on the source and my connection, the time between when the event comes in and when I see the goal sometimes requires a bit of tweaking, so having a nice little slider in the front end to configure this is key.

The next action item is setting an input_boolean (which I also added in my main config). I just set this to true to represent the fact that the goal light script is running. I’ll show you how I use this in the second automation.

The third item is the call to my media_player entity, which is a group of google homes/chrome cast audios that plays an mp3 of the Jets goal horn throughout the house.

The last item is turns on a script, which basically makes the light show work. I’ll get to that in a minute, but let’s go back to that input boolean for a second.

The input boolean that we turn on in the first automation we use as a trigger for a second automation that ends the goal celebration. That automation looks like this:

```yaml
    - alias: 'Turn off goal'
      trigger:
        platform: state
        entity_id: input_boolean.goaling
        to: 'on'
        for:
          seconds: 30
      action:
      - service: media_player.stop_media
        data:
          entity_id: media_player.everywhere
      - service: script.turn_on
        entity_id: script.goal_stop
      - service: homeassistant.turn_off
        entity_id: input_boolean.goaling
```

This is pretty straightforward-- when the input_boolean has been ‘on’ for 30 seconds, this automation runs, it runs a stop script and sets the input_boolean back to ‘off’.

Ok, now let’s take a look at the scripts for the light sequence.

```yaml
    goal_start:
      sequence:
      - service: scene.turn_on
        entity_id: scene.all_dark
      - service: script.turn_on
        entity_id: script.goal_repeat
    
    goal_loop:
      sequence:
        - condition: state
          entity_id: input_boolean.goaling
          state: 'on'
        - alias: swon
          service: homeassistant.turn_on
          data:
            entity_id: light.goallight
            rgb_color: [255, 0, 0]
            brightness: 255
            transition: 0.25
        - delay:
            seconds: 0.25
        - condition: state
          entity_id: input_boolean.goaling
          state: 'on'
        - alias: swoff
          service: homeassistant.turn_off
          data:
            entity_id: light.goallight
            transition: 0.25
        - delay:
            seconds: 0.25
        - alias: loop
          service: script.turn_on
          data:
            entity_id: script.goal_repeat
    
    goal_repeat:
      sequence:
        - condition: state
          entity_id: input_boolean.goaling
          state: 'on'
        - delay:
            seconds: 1.5
        - service: script.turn_on
          entity_id: script.goal_loop
    
    goal_stop:
      sequence:
      - service: homeassistant.turn_off
        entity_id: script.goal_loop
      - service: homeassistant.turn_off
        entity_id: script.goal_repeat
      - service: homeassistant.turn_on
        entity_id: group.main_floor
      - service: light.turn_on
        entity_id: light.goallight
        data:
          brightness: 255
          rgb_color: [255, 172, 68]
```

So, there are four scripts here in my setup. The first is the start script. This handles turning off all of my non-colour changing lights and then starts the goal loop.

The goal loop consists of two scripts and the reason why have two is that we need two scripts in order to make the looping mechanism work-- the first script has our light sequence and then it triggers the second script, which basically just triggers the first script again.

There are two things that might be worth noting about the primary goal script, but I’ve gone into more detail on both of these things in other posts, so if you are curious, feel free to follow the links to those posts. The first is using a single light entity to control a group of hue bulbs-- I outline this a bit [in this quick tip](https://midwinter.cc/post/quick-tip-controlling-colour-of-groups-of-philips-hue-lights-in-home-assistant_SJEXvIslG/). The second is the use of the transition and delay instructions-- the need for a delay in this use of transition is covered a bit more in my [post on building a sunrise alarm clock](https://midwinter.cc/post/using-home-assistant-and-philips-hue-to-create-a-full-colour-sunrise-alarm-clock_H1waliSbG/).

Feel free to comment with any questions that you might have!
