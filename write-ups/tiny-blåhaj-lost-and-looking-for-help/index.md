---
layout: post
title: "Tiny Blåhaj: lost and looking for help"
categories: [osint, haix-la-chapelle2025]
date: 2025-12-01 13:00:00 -0500
writeup: true
permalink: /write-ups/tiny-blåhaj-lost-and-looking-for-help/
order: 8
---

**Haix-la-Chapelle 2025**

I participated with my club team tjcsc in Haix-la-Chapelle 2025, and we got first place! 

**Challenge:** Tiny Blåhaj: lost and looking for help  
**Category:** OSINT  
**Author:** Tschotsch  
**Flag:** `haix{dortmund_polizeiwache_nord}`

---

![](./haj.jpg)

![](./when_u_have_to_zip_the_haj_to_bestow_delight_upon_gitlab.webp)

We are given these images. The first image seems to be taken from a bus, and I can see some things out the window. 
 
The second image is not very useful, but it appears to be a compressed BLÅHAJ shark toy (so cute!)

Let's focus on the first image first. We are asked to find the exact city and police station the image refers to. 

Instantly, I notice the police car colors. Instantly, I can tell that this image was taken in Germany, based on the police car colors. 

![](./1.jpg)
*Credit to [Bunt_smuggler](https://www.reddit.com/r/europe/comments/hddkkb/some_more_european_emergency_vehicle_paintwork/)*

That certainly narrows things down. Now, I notice that there is some sort of store with a sign with text. The sign reads "DOST Kitabevi". Let's try searching for that on Google Maps:

![](./1.png)

Searching for this gets us:

![](./2.png)

Oh! There's a location in a city called "Dortmund". Let's go into street view to double check if it's the same place.

![](./3.png)

This looks exactly like the place in the provided image!

So we have confirmed that the city is Dortmund, but what about the police station? Let's go back to Google Maps and search "police station".

![](./3.png)

Great! We see a police station near the store. It is called "Polizeiwache Nord". Let's try entering the flag.

Let's go! The flag worked! The flag is `haix{dortmund_polizeiwache_nord}`.

Thank you for reading my write-up! This was a great CTF, and I'd like to give a huge shoutout for the organizers for doing such a good job on organizing their first CTF!

If there's anything you think I could improve on in future write-ups, please let me know! 

Thank you and have a great day!