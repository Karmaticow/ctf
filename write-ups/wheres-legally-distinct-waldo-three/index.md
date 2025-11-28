---
layout: post
title: "Where’s Legally Distinct Waldo Three"
categories: [osint, patriotctf2025]
date: 2025-11-27 11:00:00 -0500
writeup: true
permalink: /write-ups/wheres-legally-distinct-waldo-three/
order: 3
---

**PatriotCTF 2025**

I participated with my high school club team tjcsc in PatriotCTF 2025, and we got 54th overall!

**Challenge:** Where’s Legally Distinct Waldo Three

**Category:** OSINT

**Flag:** pctf{center_for_the_arts_concert_hall}

So, here is the provided image:

![Provided challenge image](./waldo3-000.png)

Interesting. I assumed it was on campus because the past two have been so far, and this seems similar. I immediately notice a pond/lake, a sidewalk with a bridge, an arena on the left, and a big parking lot past the trees in the middle. This should be a piece of cake! Let’s look around on Google Maps.

![Initial Google Maps match](./waldo3-001.png)

Well this is simply too easy 😭. I see the pond, the arena, parking lot, and a pathway. Let’s note the distinct features from a similar POV:

![Noting distinct features](./waldo3-002.png)

![Matching the capture angle](./waldo3-003.png)

Now, we can find the building from this angle.

![Street view verification](./waldo3-004.png)

Center for the Arts eh? Let’s try that… Oops! Somehow pctf{center_for_the_arts} didn’t work… Interesting. Let’s gather some more information in street view.

![Additional street view context](./waldo3-005.png)

Concert Hall? Let’s try that.

Easy dub! pctf{center_for_the_arts_concert_hall} worked! Unfortunate that I wasted an attempt…
