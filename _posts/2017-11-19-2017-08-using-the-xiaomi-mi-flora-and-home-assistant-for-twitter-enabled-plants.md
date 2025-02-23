---
title: Using the Xiaomi Mi Flora and Home Assistant for Twitter enabled plants
slug: 2017-08-using-the-xiaomi-mi-flora-and-home-assistant-for-twitter-enabled-plants
date_published: 2017-11-19T21:34:00.000Z
date_updated: 2018-12-21T21:06:11.000Z
tags: Home Automation, Home Assistant, Twitter, Xiaomi, YAML
cover_image: "/assets/blog/2017-08-using-the-xiaomi-mi-flora-and-home-assistant-for-twitter-enabled-plants/tweet-plant.jpg"
---

**2025 Update:** *The Mi Flora integration appears to be replaced by
the [Xiaomi BLE component](https://www.home-assistant.io/integrations/xiaomi_ble). I haven't used it yet, but the same
logic/process should apply*

I have a confession. I am a murderer. So many unsuspecting house plants have fallen victim to my black thumb. Luckily, I have changed my ways, thanks in no small part to this little miracle worker.

![](https://s3.us-west-2.amazonaws.com/mid-midwinter.cc/images/ByUqHgdwW.png)

The [Xiaomi Mi Flora smart plant monitor](http://amzn.to/2vhQP4K) is a wicked little plant monitor for an awesome price. The device tracks light accumulation, soil moisture, soil fertility and room temperature of your plants and reports them over bluetooth.

The stock app does a decent enough job of providing you with information about the plants that you want to monitor, but unfortunately it requires you to actively open the app and check your plants to check its needs-- not a big deal if you are a motivated gardener who just needs some help determining your plants needs, but if you are a lazy ass like me, you’re probably about as likely to remember to check the app for information as you were to remember to water them in the first place.

Luckily, some dedicated Home Assistant contributors whipped up this handy integration!

Now, admittedly, I tend to be way more enthusiastic about my home automation projects than my wife is, so when I implement something that she finds useful, I am stoked. This is one such project.

As long as you aren’t intimidated by having to enter a couple of very simple commands into the command line (and
provided you’ve got Home Assistant running on a device with Bluetooth), it’s really easy to get up and running, and once
you have it configured, all of the notification platforms provided by Home Assistant are at your fingertips.

Once you’ve connected your Mi Flora to Home Assistant, you’ll need to add automations like this to your config:

```yaml
automation:
  - alias: "Office Ficus - Water Warning"
    trigger:
      platform: numeric_state
      entity_id: sensor.office_ficus_moisture
      below: 15
    action:
      service: notify.149twitter
      data:
        message: "Office Ficus: Hey! I'm dying over here @craigjmidwinter"

  - alias: "Office Ficus - Enough Water"
    trigger:
      platform: numeric_state
      entity_id: sensor.office_ficus_moisture
      above: 50
    action:
      service: notify.149twitter
      data:
        message: "Office Ficus: About time—thanks for taking time out of your busy day to water me @craigjmidwinter"
```

You'll want to change the notify service to match whatever you previously set. You should also change out the mention since these tweets will only notify me, and I've got enough of a problem keeping my own plants alive, let alone worrying about yours.

You'll also want to change the above and below values to reflect whatever plan you have. I pulled the values here (low
15%, high 50%) for my ficus plant from the Xiaomi app’s plant database and just used them in the template. I figured it
was best to use those values as a starting point, that way if there was some variance between the actual value and the
value reported by the sensor, the values from the app's database were presumably set with this in mind.

Even if you don’t use Home Assistant, I’d highly recommend grabbing one of these sensors if you have trouble keeping plants alive.