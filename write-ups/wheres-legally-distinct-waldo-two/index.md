---
layout: post
title: "Where’s Legally Distinct Waldo Two"
categories: [osint, patriotctf2025]
date: 2025-11-27 10:00:00 -0500
writeup: true
permalink: /write-ups/wheres-legally-distinct-waldo-two/
order: 2
---

**PatriotCTF 2025**

I participated with my club team tjcsc in PatriotCTF 2025, and we got 54th overall!

**Challenge:** Where’s Legally Distinct Waldo Two

**Category:** OSINT

**Flag:** ``pctf{thompson_hall}``

So, here is the provided image:

![Provided challenge image](./waldo2-000.png)

<del>Wait! I drove by here while heading to the in-person launch event!</del> We can see that there’s some road in between some buildings. This is probably on campus like the first one. Let’s do some reconnaissance.

![Initial reconnaissance reference](./waldo2-001.png)

First, I noticed a building with an interesting and pretty unique glass design. Looking around on Google Maps, I see:

![Google Maps glass building](./waldo2-002.png)

That looks just like the building in the image! Now, let’s match the surroundings and get the angle at which the image was taken from:

![Matching the camera angle](./waldo2-003.png)

This looks pretty similar to the angle at which the image was taken. I see a few similar features:

![Feature comparison](./waldo2-004.png)

![Determining the capture building](./waldo2-005.png)

Looks great! Now, let’s find the building the image was taken from based on this angle:

![Thompson Hall confirmation](./waldo2-006.png)

Thompson Hall? Let’s try that…

Great! The flag was ``pctf{thompson_hall}``. Another easy challenge done!
