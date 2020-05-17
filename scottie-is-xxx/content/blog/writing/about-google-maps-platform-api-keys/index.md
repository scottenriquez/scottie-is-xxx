---
title: Mitigating Risk With Using Google Maps API Keys in the Browser
date: "2018-05-05T22:12:03.284Z"
description: "Relevant to the June 2018 Terms of Service changes to the Google Maps platform."
---

Recently, Google announced significant changes to the Maps platform to mixed reactions from the development community. While the myriad of products have now been combined and refactored for simplicity, the general concerns seem to stem around a steep increase in price, a Google billing account requirement, falling victim to overage charges from DDoS attacks, and a mere 30-day notice of these changes. All of these factors have many developers (especially of small to medium-sized projects) considering other platforms for map services.

It’s also worth noting that a valid API key is now required. This may seem like a non-factor to developers properly managing credentials on the backend as to not expose them to the client. However, the Maps Embed API requires the key as a parameter in an HTML `script` tag like so:

```html
src="https://maps.googleapis.com/maps/api/js?key=MY_API_KEY"
```

When I first added this to my projects, I certainly had concerns about not only exposing the key to the browser via HTML, but also commiting to publicly available source code. There are a few important steps that should be taken to mitigate risk, especially considering the drastic increase in price.

# Minimizing Permissions for API Keys
Creating an API key for Google Maps is quite simple, but it’s not obvious that by default the key has various services enabled for it including Embed, JavaScript, iOS and Android. While basic security principles dictate that you should grant the minimum permissions required, this need is escalated by the fact that if you use the API key in the browser, you're effectively sharing it with the entire world. Theoretically, you could intercept someone’s key from their web application and use it for any of the services that are enabled for it. For use in the browser, only two APIs are required: Embed and JavaScript.

# Restricting Referrer Domains or IP Addresses
Even if you’ve only allowed your key access to the minimum APIs, by default any site on any domain could rack up charges on your Google account by simply using your key on their site. To combat this, you should specify restrictions via a regular expression that fits your domain or IP. For example, my key is restricted to `https://www.scottie.is/*`.

# Set a Billing Alarm
If you’re already a developer using the Maps platform, the email announcing these changes should have given you some indication of whether or not your monthly charges will change. Regardless, setting a billing alarm will help prevent unexpected charges and give warning of unexpectedly high usage.