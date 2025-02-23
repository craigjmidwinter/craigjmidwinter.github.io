---
title: Telegram keyboard and callbacks in Home Assistant with Node-RED
slug: 2018-05-telegram-keyboard-and-callbacks-in-home-assistant-with-node-red
date_published: 2018-05-10T22:56:00.000Z
date_updated: 2018-12-21T20:50:30.000Z
tags: Home Assistant, Home Automation, Telegram, Node-RED
---

Last week I made [this blog post](https://midwinter.cc/post/the-simple-guide-to-creating-actionable-notifications-in-home-assistant-using-telegram-s-custom-inline-keyboard-and-telegram_callbacks_SJiJnOqpG/) describing how to use the Telegram inline keyboard and callback functions within Home Assistant. I posted the article to Reddit and a user left a comment wondering how to accomplish this within Node-RED, so I thought I’d make a quick post on how to do that.

Now, I am not a Node-RED expert by any means-- it’s actually been a couple of years since I’ve tried doing anything with it, but I’ve noticed more and more people are starting to use it to handle their automations and I can definitely see it’s advantages. Personally, I haven’t encountered any real insurmountable limitations using Home Assistants baked-in YAML-based automation engine, and I’m not the most visually-oriented person so I’m not in a huge rush to start changing over all my automations, but it’s definitely a tool that I would consider in the future.

I prefaced this tutorial with the fact that I am not a Node-RED expert because there are a lot of ways this flow could be accomplished, and I’m not 100% sure if my implementation breaks any common conventions-- there could be a more Node-REDy way to do this, and if there is, please leave me a comment to let me know what you would do different!

If you are looking for a real Node-RED guru or a crash-course on some of the fundamentals of integrating Node-RED with Home Assistant, I recommend checking out the excellent [DIY Futurism blog by u/diybrad](https://diyfuturism.com/). He’s great Home Automation blogger who has got a lot of excellent posts about his implementations of automations in Node-RED and it’s a great point of reference for anybody just starting out with the tool.

## Assumptions

I’m going to assume that you already have Node-RED running and configured with your Home Assistant installation. If you haven’t, check out [this post on DIY Futurism](https://diyfuturism.com/index.php/2017/11/26/the-open-source-smart-home-getting-started-with-home-assistant-node-red/) for how to do that. Additionally, like my previous post on this matter, I’m going to assume that you have configured the telegram_bot platform using [the webhook](https://www.home-assistant.io/components/telegram_bot.webhooks/) or [polling method](https://www.home-assistant.io/components/telegram_bot.polling/) on your Home Assistant install.

Ok, now that that’s all out of the way, let’s get our hands dirty!
![](/src/images/2018/12/BkVNvaZRz--1-.png)
## Inline Keyboard

If you have ever created an automation for Home Assistant in Node-RED, this is going to look pretty familiar to you. In this case, for demonstration purposes I’m just using the Inject node to trigger the initial message. In any other practical automation, you’ll probably use some other event within Home Assistant and/or have some sort of logic that is going to trigger it, but whatever that might be, the message is going to flow to the call service node in order to trigger our message. Let’s take a look at that node to see what it looks like:
![](/src/images/2018/12/r1bqwaZCz--1-.png)
The really important bits of this are the ‘domain’, ‘service’, and ‘data’ field. Domain and service are pretty straight-forward. The domain is going to be ‘telegram_bot’ and the service is ‘send_message’. Now, let’s look at the data-- you can’t see it all in the screenshot and it’s hard to read all on one line anyways, so here’s a better look:

    {
      "target": "123456789",
      "title": "Want pizza?",
      "message": "You look like you are home alone. Should I order you a pizza?",
      "inline_keyboard": [
        "Gimme Pizza:\/gimmepizza",
        "No thanks:\/nopizza"
      ]
    }

You can see in our json object we are setting the target to our chat id, then setting the title and message fields, and then we have the inline_keyboard field, which is getting set to an array of a few specifically formatted strings. Each button consists of two parts, the message text and the message command. The two parts are separated by a colon with the text that your user sees coming before the colon and the message command that gets sent back to Home Assistant coming after. The message command is going to be a special text string that you make up. It has got to start with a slash and I don’t think it can contain any spaces. This command is what we will use to distinguish ‘Gimme Pizza’ from ‘No Thanks’.

## Telegram Callbacks

Now, let’s take a look at the automation flow to handle the reply!
![](/src/images/2018/12/BypVOTZ0z.png)
Look at this! It’s nice and small-- let’s break it down!

The first piece here is the events:all node. It sends a message down the flow for every single event that happens within Home Assistant. Obviously, we only want to react to certain events, so we’re going to pipe this into a function node to filter it out. The code in that function looks like this:

    if(msg.payload.event_type == "telegram_callback") {
        msg.payload.data = {"callback_query_id": msg.payload.event.id};
        return msg;    
    }

What this does is use an if statement to filter through all the messages coming in and only allow messages of the telegram_callback event type through, if it matches that event_type, it also manipulates the message payload before passing it on to the next node. It does this by adding an object named ‘data’ to it and initializing this object with one property on it called “callback_query_id” with the value of msg.payload.event.id. If you are wondering why msg.payload.event.id is not in quotes, that’s because in this case we are referring to the value of msg.payload.event.id not the literal string “msg.payload.event.id”.

This function here is the main reason why I said that I am not entirely sure if there is a more Node-REDy way to do this. It definitely works to do it this way, but there are two things I could see possibly going against common Node-RED. First, there may be a more simpler way of filtering out all messages that don’t match on a single value with another core node type that does not require writing code, and second (and I expect this is more of an issue than the first point) the function, while simple, has more than one responsibility-- that is to say, it both filters out messages and manipulates the message in a single node. It might be common practice to separate these responsibilities in to two different nodes in order to better represent the logic visually.

With that said, I think this is an elegant enough way of handling the data here. If you are planning on having a lot of different telegram_callback automations, I’d recommend saving the first two nodes in this as a sub-flow so that you can reuse it as the entrypoint for all your callback automations.

On to the next node!
![](/src/images/2018/12/HyPi-T@0M.png)
The next node here is a simple switch and if we look at how this node is configured, you can see that it is matching on the two commands that we defined in our keyboard in the initial message, with a separate exit-point for each of the two responses.
![](/src/images/2018/12/r1zaKabRf.png)
From both the exit point of the ‘No’ and the 'Yes' response we just flow into a change node. They both look very similar to this, the only difference is what we set the reply message to. We use this change node to add a field called message to the data object and set it to the message we want to send in the callback.  I’ve also got the yes exit point flowing into another service call just to illustrate where we would branch off and fire our automation.

Both the yes and no change nodes flow into the same service call node. Here’s how that looks--
![](/src/images/2018/12/HkGm9aZAM.png)![](https://149walnut.com/images/HkGm9aZAM.png)
This node calls the answer_callback_query service of telegram_bot. We set the data in this node to be an empty object by using a set of empty curly-boys (that’s definitely a technical term). We don’t need to set the data here for the same reason that we can share this node for both yes and no-- The Home Assistant service call node will look for the data object in the payload we created and use that for the data in the service call if it exists!

That should about cover it! Please feel free to comment with any questions or improvements you might have!
