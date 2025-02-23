---
title: Making my dumb bed, smart – Home Assistant Bed Occupancy Sensor
slug: 2018-05-making-my-dumb-bed-smart-home-assistant-bed-occupancy-sensor
date_published: 2018-05-20T23:43:00.000Z
date_updated: 2018-12-31T14:49:22.000Z
tags: Home Assistant, MQTT, NodeMCU, Arduino, Home Automation, Programming
cover_image: "/assets/blog/IMG_20180518_174346.jpg"
---

I’ll try not to be as long-winded as I usually am, but I’m pretty proud of the bed sensor I built. Here’s a video of it working in Home Assistant:

Now, this sensor is similar to the one in [this build on the 24-7-home-security blog](http://24-7-home-security.com/how-to-make-a-wifi-bed-occupancy-sensor-arduino/), with a few changes– Instead of using the Arduino Uno for the controller, I used [this ESP8266MOD dev board](https://www.gearbest.com/transmitters-receivers-module/pp_366523.html?wid=1433363&amp;lkid=14192359). I chose this for a few reasons– it’s smaller, cheaper and it’s got wifi capabilities built in which eliminates the need for an additional ethernet/wifi shield and the router. I also chose to use one of [these little potentiometers](https://www.amazon.ca/gp/product/B0753G1ZDZ/ref=oh_aui_detailpage_o02_s00?ie=UTF8&amp;psc=1) (I used a 1k) instead of the voltage divider in the blog post– it’s smaller and it’s what I had lying around.

I’ve got a king sized bed and I wanted to get a reading on both using two FSRs. The one drawback to the ESP8266MOD is that it only has a single analog input pin– this means, if you want to read the two separately, you’ll need to multiplex them, or build two sensors. I just ended up building two sensors.

Let’s take a look at the guts of this thing:

![](/assets/blog/IMG_20180518_174346.jpg)

I thought I had taken more and better photos of this before I sealed it up and put it in place, but I guess I didn’t/ The strip thing you see goes on for 2 feet. That’s the FSR and it just sits underneath the mattress but on top of the box spring. In the final version, I made the wires that connect it to the controller much longer so that the controllers can just sit on the floor under the bed.

There’s not a heck of a lot to see in the Arduino sketch. Most of it I just patched together from pieces of code I found around the internet. All it does is connect to wifi, read the analog pin and then publish the value to my MQTT server.

```c
    #include 
    #include 
    int fsrAnalogPin = 0; // FSR is connected to analog 0
    int LEDpin = 11; // connect Red LED to pin 11 (PWM pin)
    int fsrReading; // the analog reading from the FSR resistor divider
    int LEDbrightness;
    WiFiClient espClient;
    const char * ssid = "SSID";
    const char * password = "PASSWORD";
    PubSubClient client(espClient);
    const char * mqtt_topic_bed = "sensor/bed/left";
    const char * mqtt_server = "mqtt.address";
    void loop()
    {
      // put your main code here, to run repeatedly:
      fsrReading = analogRead(fsrAnalogPin);
      Serial.print("Analog reading = ");
      Serial.println(fsrReading);
      if (!client.connected())
      {
        reconnect();
      }
      
      char buffer[10];
      dtostrf(fsrReading,0, 0, buffer);
    
      Serial.println(buffer);
      client.publish(mqtt_topic_bed, buffer);
      delay(1000);
    }
    
    void setup()
    {
      Serial.begin(9600); // We'll send debugging information via the Serial monitor
      // setup WiFi
      setup_wifi();
      client.setServer(mqtt_server, 1883);
      reconnect();
    }
    
    void reconnect()
    {
      // Loop until we're reconnected
      while (!client.connected())
      {
        Serial.print("Attempting MQTT connection...");
        // Attempt to connect
        if (client.connect("ESP8266Client", "USERNAME", "PASSWORD"))
        {
          Serial.println("connected");
        }
        else
        {
          Serial.print("failed, rc=");
          Serial.print(client.state());
          Serial.println(" try again in 5 seconds");
          // Wait 5 seconds before retrying
          delay(5000);
        }
      }
    }
    
    void setup_wifi()
    {
      delay(10);
      // We start by connecting to a WiFi network
      Serial.println();
      Serial.print("Connecting to ");
      Serial.println(ssid);
      WiFi.begin(ssid, password);
      while (WiFi.status() != WL_CONNECTED)
      {
        delay(500);
        Serial.print(".");
      }
    }
```

Once it was in place and reporting I watched to see the values it was reporting while I wasn’t in bed compared to the values that it was reporting while I was in bed. The difference in the numbers was significant and finding a number to use as the threshold between the occupied and unoccupied states was really easy. Now, I just created these sensors within Home Assistant

```yaml
    - platform: mqtt
      state_topic: 'sensor/bed/left'
      name: 'bed_left_value'
    
    - platform: mqtt
      state_topic: 'sensor/bed/right'
      name: 'bed_right_value'
    
    - platform: template
      sensors:
        bed_craig:
          friendly_name: "Bed - Craig"
          value_template: "{% if states.sensor.bed_left_value.state|int > 200 %}Occupied{% else %}Unoccupied{% endif %}"
          icon_template: "{% if states.sensor.bed_left_value.state|int > 200 %}mdi:hotel{% else %}mdi:bed-empty{% endif %}"
    
        bed_jess:
          friendly_name: "Bed - Jess"
          value_template: "{% if states.sensor.bed_right_value.state|int > 200 %}Occupied{% else %}Unoccupied{% endif %}"
          icon_template: "{% if states.sensor.bed_right_value.state|int > 200 %}mdi:hotel{% else %}mdi:bed-empty{% endif %}"
    
        bed_both:
          friendly_name: "Bed - Both"
          value_template: "{% if states.sensor.bed_jess.state == 'Occupied' and states.sensor.bed_craig.state == 'Occupied' %}Occupied{% else %}Unoccupied{% endif %}"
```

Boom! That’s all there is to it! Right now, I’ve just got it set up so that if we are both in bed, it turns off all the lights in the house other than the ones in the bedroom and arms the alarm system, and then if one of us gets out of bed it will turn on the corridor and bathroom lights on a low brightness in case one of us gets up during the night. I’ll try to remember to post any unique automations I come up with that use this sensor. If you’ve got a bed sensor or anything similar, let me know what some of your favourite automations that make use of it are in the comments!
