---
title: "DevToolkit"
description: "Practical guides, tool comparisons, and workflow tips for modern developers. From AI coding assistants to Docker Compose templates."
layout: base.njk
---

<div class="home-hero">
  <h1>Practical Developer Guides</h1>
  <p>Comparisons, tutorials, and workflow tips to help you ship faster. No fluff, no hype -- just tools and techniques that work.</p>
</div>

<div class="cta-box">
  <h2>Free Online Tools</h2>
  <p>JSON formatter, Base64 encoder, URL encoder, hash generator — all private, all free, no signup.</p>
  <a href="/tools/" class="cta-button">Open Tools</a>
</div>

<div class="cta-box">
  <h2>Digital Products</h2>
  <p>Ready-made developer tools: AI coding prompts, dev environment kits, SaaS landing page templates.</p>
  <a href="https://ifdian.net/a/devpilot" class="cta-button">Browse Products</a>
</div>

<h2>Latest Articles</h2>
<ul class="article-list">
{% for article in collections.articles %}
  <li>
    <a href="{{ article.url }}">{{ article.data.title }}</a>
    <div class="meta">{{ article.data.date | dateDisplay }}</div>
    <p class="excerpt">{{ article.data.description }}</p>
  </li>
{% endfor %}
</ul>
