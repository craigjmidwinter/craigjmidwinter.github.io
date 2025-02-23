---
title: Philips Hue and Tasker – Use your lights as a notification for Text Messages
slug: 2017-11-philips-hue-and-tasker-use-your-lights-as-a-notification-for-text-messages
date_published: 2017-11-19T22:57:00.000Z
date_updated: 2018-12-21T21:05:44.000Z
tags: Tasker, Android, Philips Hue, Home Automation
cover_image: /assets/blog/text.jpg
---

A couple years ago, back when I first bought my Philips Hue lights, I posted this video of me using my lights as a notification for incoming text messages.

![](https://www.youtube.com/watch?v=z0GOOe544Ow)

Since then, I’ve been asked a few times how to do this, so I thought I’d post a tutorial on how to do this with Android.

What you’ll need:

- [Philips Hue lights](http://amzn.to/2zQyUoC)
- An Android phone
- [The Tasker app](https://play.google.com/store/apps/details?id=net.dinglisch.android.taskerm&amp;hl=en)
- [The autohue plugin](https://play.google.com/store/apps/details?id=com.cuberob.autohue&amp;hl=en)

I’m going to assume you’ve already got your lights set up for normal operations.

On your phone, open up the tasker app. At the bottom of the screen you should see a button with a plus sign in it. Hit this button to begin creating a profile trigger.
![](https://s3.us-west-2.amazonaws.com/mid-midwinter.cc/images/H1YFs4CyM.png)
From here, you will be presented with a bunch of options. We’re going to be create one based on an event.
![](https://s3.us-west-2.amazonaws.com/mid-midwinter.cc/images/BymghER1G.png)
In the screen that comes up, there is a text box at the bottom that allows you to search. Start typing ‘text’ and you should see an option that appears called ‘Received Text’. Select this option.
![](https://s3.us-west-2.amazonaws.com/mid-midwinter.cc/images/Syi43EAyM.png)
In this screen you can customize the event criteria. If you want to limit this to a single contact, you can do this by editing the sender. If you want this to trigger for every contact, we can move on without changing anything (you can always come back and edit this later). When you are done hit the back arrow in the top left of your screen.
![](https://s3.us-west-2.amazonaws.com/mid-midwinter.cc/images/r1guhN0kf.png)
Now that the trigger is made, it’s time to build the task action. You should see a menu now that has any existing tasks you have already built, and at the top is the option to create a new task. Choose the new task option and give it a name like ‘red alert’.

Now, you should see an empty task screen. Let’s add some actions to it. The first thing we’ll need is our light sequence. Hit the plus button in the lower left, and you’ll be presented with a bunch of action options.

Here, we’ll start our search for ‘hue’ until we see the option for ‘Hue 2.0’
![](https://s3.us-west-2.amazonaws.com/mid-midwinter.cc/images/r1jk6V0yG.png)![](https://s3.us-west-2.amazonaws.com/mid-midwinter.cc/images/BJxdaV01G.png)
Now that we’re in the action edit menu, we need to configure the hue alert. Hit the pencil next to Configuration in order to edit this.
![](https://s3.us-west-2.amazonaws.com/mid-midwinter.cc/images/BkuhpVAJf.png)
If this is the first time using the autohue plugin, you’ll need to set up your bridge. Unfortunately, I set mine up a long time ago, so I wasn’t able to add any information on this, but it should be pretty straight forward.

After your bridge is set up, you should see a list of your bulbs, here you can select which lights you’d like to use, you can also use the groups tab to select any groups you have set up. Select the group you want to use for this notification.

Now that you have your bulbs selected, choose the following settings

- Set Power [checked] - Power [checked]
- Set Colour [checked] - Select colour [whatever colour you’d like this notification to flash]
- Set Alert [checked] - Blink 15 seconds

Now that you have all your settings selected, select the three dots in the top right corner and choose ‘Done’, and then at the Action Edit screen, click the back arrow.

Now, if you click the play button in the bottom left, it should run this action. If you run this now, you’ll see your lights blink for the alert.

One thing you’ll notice is that your lights will stay in whatever color you set for the alert. That’s because we haven’t told the lights what to change to after. We’ll need to add another Hue 2.0 task to change them back. Before we do that though-- Tasker will execute the tasks one after another immediately after the previous task was triggered unless we tell it otherwise, so the next task we need to add is a task that tells tasker to wait.

Hit the plus button on the bottom and search for the ‘Wait’ action.
![](https://s3.us-west-2.amazonaws.com/mid-midwinter.cc/images/r1hO04RkM.png)
The only thing we need to change in here is to set Seconds to 15, which is the length of our blink sequence. If you would like your notification to be shorter than 15 seconds, you can set the seconds here to whatever your desired duration is.

Back out of this screen until you are back at the Task Edit screen. Now it’s time to add the last Hue 2.0 task. Again hit the plus button to add the final action and search for Hue 2.0

Select the bridge and bulbs you selected initially and then set the following settings:

- Set Power [checked]Power [checked]
- Set Colour [checked]Select colour [whatever colour you’d like the bulbs to return to after the notification has completed]
- Set Alert [checked]None (stop)

Back out of this all the way to the main tasker screen, make sure the profile is enabled and that tasker is enabled and you should be good to go! For the auto in my video, I just set my ringtone like normal to a red alert sound I downloaded from here: (I used the red alert sound from Star Trek, [downloaded from here](http://www.trekcore.com/audio/))

Any questions, feel free to comment and I’ll do my best to help!
