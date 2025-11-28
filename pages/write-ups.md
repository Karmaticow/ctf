---
title: Write-ups
layout: blog
permalink: /write-ups/
show_bio: false
show_intro: true
placeholder_message: "Write-ups will appear here when published."
list_source: writeups
---
{% assign all_tags = site.pages | where: "writeup", true | map: "categories" | join: "," | split: "," | uniq | sort %}

<section class="filters">
  {% for tag in all_tags %}
  {% assign trimmed = tag | strip %}
  {% if trimmed != "" %}
  <span class="filter-chip" data-tag="{{trimmed | downcase}}">{{trimmed}}</span>
  {% endif %}
  {% endfor %}
</section>

<div class="filter-controls">
  <div>
    <label for="sort-order">Sort by:</label>
    <select id="sort-order">
      <option value="desc">Newest first</option>
      <option value="asc">Oldest first</option>
    </select>
  </div>
</div>
