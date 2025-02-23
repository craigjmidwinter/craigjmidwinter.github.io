---
title: My house automatically orders pizza for me – Dominos Pizza automation using Home Assistant.
slug: 2017-11-my-house-automatically-orders-pizza-for-me-dominos-pizza-automation-using-home-assistant
date_published: 2018-05-04T22:17:00.000Z
date_updated: 2018-12-14T03:59:33.000Z
tags: Home Assistant, YAML, Programming, Dominos, Home Automation, Telegram
---

***Note: If you were linked here to see my telegram keyboard/callback implementation, [I've got a more complete example here](https://midwinter.cc/post/the-simple-guide-to-creating-actionable-notifications-in-home-assistant-using-telegram-s-custom-inline-keyboard-and-telegram_callbacks_SJiJnOqpG/)***

A good automation takes an action that you regularly perform and does it for you-- a great automation amplifies your laziest personality traits and takes them to new depths.

Let me be clear, my wife and I share cooking duties, but when I'm on my own I just really don’t care about cooking for
myself (also just really like pizza). That’s why when I’m home on my own and my wife is out for the evening, I’ll often
just order some pizza for myself.

Lazy? Sure, but it could be lazier-- let’s automate it!

Domino’s Pizza is my go-to pizza place, and they’ve got a pretty good online ordering system. While their API isn’t publically documented, their web-app is pretty fully featured and by opening up the dev-tools on your browser you can take a look at the requests to see what end-points do what.

Now, compiling all of this information and assembling a client library would be a somewhat tedious and painstaking job. I was very pleased to find that someone had already created this client library for the US Domino’s. The American web app is pretty much identical to the Canadian one, just on a different domain, so I just needed to make a few small changes to allow for multiple countries with different endpoints. After that, it was just a matter of creating the Home Assistant service.

Enough about how it’s made-- how do I use it?

Warning: I made this in a day during a hack-day at the office, so it’s pretty basic and a little rough around the edges.

Potential contributors: The client library supports the ability for toppings and coupons, but at the moment the Home Assistant component does not. I’m hoping to get around to adding this in, but it’s not super high on my priority list right now. Also, the current process for getting product codes isn’t the most user friendly thing in the world. I’m not exactly a front-end wizard, so if you’d like to make a panel or something to display this instead of the log dump, that would be awesome!

Right now, this isn’t yet in the core Home Assistant install, but there is
a [Pull Request](https://github.com/home-assistant/home-assistant/pull/10379) made, so it should hopefully be available
in the next release, or if you are impatient you can install the library client library via pip (pizzapi) and
then [grab the component from this gist](https://gist.github.com/craigjmidwinter/8548e572b8ee77decd83983e39b887c9) and
add it to your custom components.

To get the component configured, you are going to need to add your information to your configuration.yml like so:

```yaml
    dominos:
      country_code: ca
      first_name: Justin
      last_name: Trudeau
      email: justin.trudeau@parl.gc.ca
      phone: 6139950253
      address: 24 Sussex Dr, Ottawa, ON, K1M1M4
      show_menu: 1
```

If you are wanting to order anything, you are going to need to define some order entities! These are really simple items that live under the orders key. Right now, they just consist of a name and a list of codes, like so:

```yaml
      orders:
      - name: Medium Pan
        codes:
          - P12IPAZA
```

How do you find these order codes? Well, at the moment, it’s not exactly pretty. Currently, the best way to see the codes for the products at your nearest Dominos is to add show_menu: 1 into your config. With that set, when Home Assistant starts and the component loads, you should see a bunch of products and variants in a panel in Home Assistant. The variants represent different sizes and crust choices for the most part. It takes a bit of guesswork in order to decipher what each code represents, but for the most part, you can look at the online menu of your local dominos and compare the offerings.

Or if you are comfortable using a browser’s dev tools, you can do what I did instead and use the Dominos web app to put together an order, and then before you submit the order, turn off your network connection, open up your browser’s dev tools, hit submit and inspect the payload for the order request and have a look at the codes that are sent.

So now that you have your order codes your full config, with your customer information and a few different orders will look like so:

```yaml
    dominos:
      country_code: ca
      first_name: Justin
      last_name: Trudeau
      email: justin.trudeau@parl.gc.ca
      phone: 6139950253
      address: 24 Sussex Dr, Ottawa, ON, K1M1M4
      show_menu: 1
      orders:
      - name: Medium Pan
        codes:
          - P12IPAZA
```

With your config updated, restart Home Assistant and now you should be ready to order pizza in your scripts and automations! Let’s have a look at the one that I set up as an example--

Now, the automation that I have set up is a bit more complex than it needs to be.

If you just want to include a pizza order into a script that you run (for example, if you wanted to be able to be able to trigger a ‘movie night’ script that put your house into movie mode and ordered a pizza), you can just call the service and specify the order entity that you would like to use by adding something like this to the action on your automation and you are done:

```yaml
        - service: dominos.order
          data:
            order_entity_id: dominos.medium_pan
```

I want my pizza order to be event-based, (ie, at a certain time, if I’m the only one home), but I don’t really want it to happen every single time, I’d like to just be prompted and then have the order placed if I confirm it. For this to happen, I need some sort of actionable notification.

I decided to use Telegram for my notification platform for this since it supports actionable notifications using the custom keyboard feature, and it’s available on all the platforms that I use.

In order to accomplish this, I need to actually set up two separate automations (well, I set up three, but the third is not really necessary). Let’s take a look at the first one:

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
            disable_notification: true
            inline_keyboard:
              - "Gimme Pizza:/gimmepizza"
              - "No thanks:/nopizza"
```

The first automation triggers at 6:30pm if I am at home and my wife is not_home. She goes to the gym in the evening several times a week at this time and we eat a bit later on those days, so I avoid her being in the not_home state by creating a zone around the gym. When the condition is met, I get a telegram message sent to me that looks like this:
![](https://s3.us-west-2.amazonaws.com/mid-midwinter.cc/images/ryt1RoiAZ.png)
The two options are buttons that basically just send back a command (defined in that inline keyboard bit) that we handle in a callback event. The automation for those callback event looks like this:

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

You can see I’ve got one that handles the no response and just gives some user feedback and then one that handles the yes response as well as calls our dominos service and specifies the order.

That inline keyboard is feature is not bound to just two options, so if I had a more adventurous palate, I could have this automation send me a variety of options for orders and let me select which one I want by handling each of the callback responses in a separate automation, but a medium pan pizza is good enough for me.
