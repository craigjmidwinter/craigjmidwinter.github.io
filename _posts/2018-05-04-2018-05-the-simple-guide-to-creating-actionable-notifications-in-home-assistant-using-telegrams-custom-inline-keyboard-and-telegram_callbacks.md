---
title: The simple guide to Telegram's custom inline keyboard
slug: 2018-05-the-simple-guide-to-creating-actionable-notifications-in-home-assistant-using-telegrams-custom-inline-keyboard-and-telegram_callbacks
date_published: 2018-05-04T22:27:00.000Z
date_updated: 2018-12-11T22:42:45.000Z
tags: Home Assistant, Telegram, YAML, Home Automation
---

*Note: If you'd like to see how this is implemented with Node-RED instead, [check this post](https://midwinter.cc/post/telegram-keyboard-and-callbacks-in-home-assistant-with-node-red_r1Fa56ZRz/#top).*

A while ago I made [this post](https://midwinter.cc/post/my-house-orders-pizza-for-me-dominos-pizza-automation-using-home-assistant_SJY1zsc0W/) about creating an automation and Home Assistant integration to allow my house to order pizza for me. In the months since, I’ve noticed it referenced on a few occasions when people have been looking for more information on how to use the inline keyboard functionality in conjunction with the Telegram callbacks in order to create an actionable notification in Home Assistant.
![](https://s3.us-west-2.amazonaws.com/mid-midwinter.cc/images/BJWTz95Tf.png)
Since that post is a bit long and only partially focuses on that functionality, I thought I’d cut the bullshit and make a quick post that focuses on it. If anyone has questions about this, feel free to leave a comment and I’ll try to answer. I’ll also try and keep this page updated with the answers to any questions that come up over time.

This post makes the assumption that you are familiar with the basic structure for defining automations in Home Assistant. It also makes the assumption that you have added the telegram bot to your configuration by following the instructions for either the [webhook method](https://www.home-assistant.io/components/telegram_bot.webhooks/) or the [polling method](https://www.home-assistant.io/components/telegram_bot.polling/).

I’ll stick with the original example since it is really straight forward. At its simplest, using the Telegram inline keyboard and the Telegram callback really only requires two automations in Home Assistant-- I think the functionality is better demonstrated using three automations (one for your prompt and two answers), but there really isn't any practical limit to how many you can have!

The first is your prompt, this is going to be your initial trigger automation. This automation is what sends your initial message on Telegram with your options. It will look something like this--

```yaml
    - alias: 'Want pizza?'
      hide_entity: true
      trigger:
        platform: time
        at: '18:30:00'    
      condition:
        - condition: state
          entity_id: device_tracker.craig_craig
          state: 'home'
        - condition: state
          entity_id: device_tracker.jess_iphone
          state: 'not_home'
      action:
        - service: telegram_bot.send_message
          data_template:
            title: 'Want pizza?'
            target: 123456789
            message: 'You look like you are home alone. Should I order you a pizza?'
            inline_keyboard:
              - "Gimme Pizza:/gimmepizza"
              - "No thanks:/nopizza"
```

The trigger and condition portions of this should look fairly familiar to you, you’ve probably got a bunch of automations that look like this in your current setup. The interesting bit is the action-- we’re calling the telegram_bot.send_message service and then using a data_template to define the message. Most of it is pretty self explanatory, the target field is the user_id and the message and title fields are the main contents of your message. The interesting part about this is the inline_keyboard field. This is where you set up your buttons!

Each button consists of two parts, the message and the payload. The two parts are separated by a colon with the message that your user sees in the message coming before the colon and the payload that gets sent back to Home Assistant. The payload is going to be a special command that you make up. It has got to start with a slash and I don’t think it can contain any spaces. This special command is what we will use to distinguish ‘Gimme Pizza’ from ‘No Thanks’.

This payload command can be reused in other prompt-like telegram message automations if you want to be able to trigger the same answer automation in a different combination of buttons in another context, or if you want to change the message side in a different context.

Now that we are able to send these messages from Home Assistant to our Telegram users, we need to define a way to handle those commands we’ve got coming in!

```yaml
    - alias: 'No pizza'
      hide_entity: true
      trigger:
        platform: event
        event_type: telegram_callback
        event_data:
          data: '/nopizza'
      action:
        - service: telegram_bot.answer_callback_query
          data_template:
            callback_query_id: '{{ trigger.event.data.id }}'
            message: 'Ok, no pizza then'
    
    - alias: 'gimme pizza'
      hide_entity: true
      trigger:
        platform: event
        event_type: telegram_callback
        event_data:
          data: '/gimmepizza'
      action:
        - service: telegram_bot.answer_callback_query
          data_template:
            callback_query_id: '{{ trigger.event.data.id }}'
            message: 'PIZZA TIME'
        - service: dominos.order
          data:
            order_entity_id: dominos.medium_pan
```

As you can see we’ve got one automation for each answer. Both automations are triggered using the built-in event platform, and the same telegram_callback event_type, the difference is that we define different event_data for them, each automation matching the payload for the corresponding button!

We can trigger whatever we want in these automations-- In both of these cases we are using the telegram_bot.answer_callback_query service to provide the user with some feedback just to say that we received the message. This uses trigger.event within a template in order to use some of the information from the triggering event in the action. In this case, we are getting the id field and using it in the callback_query_id to tell the telegram_bot.answer_callback_query

service which event we are replying to and then defining a message.

My wife and I don’t actually really use Telegram at all day-to-day, instead we usually use Facebook Messenger for text communication. So for me, getting notifications on Telegram is not tremendously practical. I’ve actually just recently modified the Facebook Messenger notification platform in Home Assistant to allow for the sending of messages like this. I’ve created this PR to have that code added into the core Home Assistant project, so that should be available in the near future. I’ll try to remember to make a post about it when it gets merged in!

Hopefully this broke things down a bit, and please don’t hesitate to leave any questions you might have as comments and I’ll do my best to address them and keep this post up to date!
