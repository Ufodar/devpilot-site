---
title: "How to Build a Static Site with Eleventy: Step by Step"
description: "Build a fast, SEO-optimized static site with Eleventy from scratch. Covers project setup, templates, content, CSS, builds, and deployment."
date: 2026-04-26
tags: [eleventy, static-site, tutorial]
layout: article.njk
---

Eleventy (11ty) is a static site generator that gets out of your way. Unlike frameworks that impose their own component model, build pipeline, and data layer, Eleventy takes your existing HTML, Markdown, and template knowledge and adds just enough structure to generate a complete site. The result is fast, simple, and maintainable.

This guide builds a complete static site from scratch. By the end, you will have a project that builds in seconds, scores well on Core Web Vitals, and deploys anywhere.

## Step 1: Initialize the Project

Create a new directory and install Eleventy:

```bash
mkdir my-site && cd my-site
npm init -y
npm install @11ty/eleventy
```

Add build and serve scripts to your `package.json`:

```json
{
  "scripts": {
    "build": "eleventy",
    "serve": "eleventy --serve"
  }
}
```

Create the source directory structure:

```bash
mkdir -p src/_includes src/css
```

## Step 2: Configure Eleventy

Create `.eleventy.js` in your project root:

```javascript
module.exports = function (eleventyConfig) {
  // Pass CSS through without processing
  eleventyConfig.addPassthroughCopy("src/css");

  // Format dates nicely
  eleventyConfig.addFilter("dateDisplay", function (dateObj) {
    return new Date(dateObj).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
    },
    markdownTemplateEngine: "njk",
  };
};
```

This configuration tells Eleventy where your source files live, where to write the output, and that Markdown files should be processed through Nunjucks templates first.

## Step 3: Create the Base Layout

The base layout is the HTML shell that wraps every page. Create `src/_includes/base.njk`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ title }}</title>
  <meta name="description" content="{{ description }}">
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <nav>
    <a href="/">Home</a>
  </nav>
  <main>
    {{ content | safe }}
  </main>
</body>
</html>
```

The `{{ content | safe }}` expression is where your page content gets injected. The `safe` filter tells Nunjucks not to escape the HTML, which is necessary because Markdown gets converted to HTML before reaching the template.

## Step 4: Create Your First Page

Create `src/index.md`:

```markdown
---
title: "My Site"
description: "A fast static site built with Eleventy."
layout: base.njk
---

# Welcome

This is my static site, built with Eleventy.
```

The front matter between the `---` delimiters defines metadata that Eleventy passes to the template. The `layout` key tells Eleventy which template to use.

Test it:

```bash
npx eleventy --serve
```

Open `http://localhost:8080` and you should see your page. Eleventy's serve mode watches for changes and rebuilds automatically.

## Step 5: Add an Article Layout

For blog posts or articles, create a separate layout that extends the base. Create `src/_includes/article.njk`:

```html
---
layout: base.njk
---
<article>
  <header>
    <h1>{{ title }}</h1>
    <time>{{ date | dateDisplay }}</time>
  </header>
  {{ content | safe }}
</article>
```

This layout adds a header with the title and date to every article. The `layout: base.njk` front matter tells Eleventy to wrap this layout inside the base layout, creating a layout chain.

## Step 6: Write an Article

Create `src/articles/my-first-post.md`:

```markdown
---
title: "My First Post"
description: "The first article on my Eleventy site."
date: 2026-04-26
layout: article.njk
tags: [tutorial]
---

This is my first article. Eleventy converts this Markdown into HTML
and wraps it in the article layout, which in turn wraps it in the
base layout.

## Why Eleventy?

Eleventy is simple. It does not require React, Vue, or any JavaScript
framework. It takes your templates and content, generates HTML, and
gets out of the way.
```

The `date` field in the front matter is important for sorting and displaying articles. Eleventy uses it to set the page's `date` property, which your templates can access.

## Step 7: Create an Article Collection

Eleventy collections let you group content and iterate over it. Add this to your `.eleventy.js`:

```javascript
eleventyConfig.addCollection("articles", function (collectionApi) {
  return collectionApi
    .getFilteredByGlob("src/articles/*.md")
    .sort((a, b) => b.date - a.date);
});
```

Now update your homepage to list articles:

```markdown
---
title: "My Site"
description: "A fast static site built with Eleventy."
layout: base.njk
---

# Welcome

{% for article in collections.articles %}
- [{{ article.data.title }}]({{ article.url }})
{% endfor %}
```

## Step 8: Add CSS

Create `src/css/style.css` with your styles. Because we configured Eleventy to pass through the CSS directory, the file gets copied to `_site/css/style.css` without any processing.

This is one of Eleventy's strengths: it does not force you into a specific CSS methodology. Use plain CSS, Sass, PostCSS, or Tailwind -- Eleventy does not care, as long as the output ends up in the right directory.

## Step 9: Add SEO Meta Tags

Update `base.njk` to include proper meta tags:

```html
<meta name="description" content="{{ description }}">
<link rel="canonical" href="https://yoursite.com{{ page.url }}">
<meta property="og:title" content="{{ title }}">
<meta property="og:description" content="{{ description }}">
<meta property="og:type" content="website">
```

For articles, add JSON-LD structured data:

```html
{% if layout === "article.njk" %}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "{{ title }}",
  "description": "{{ description }}",
  "datePublished": "{{ date }}"
}
</script>
{% endif %}
```

## Step 10: Build and Deploy

Build the production site:

```bash
npm run build
```

Eleventy writes the output to `_site/`. This directory contains only static HTML, CSS, and assets -- no server-side code, no JavaScript bundles, no build artifacts.

Deploy anywhere that serves static files:

- **Netlify**: Connect your Git repository, set the build command to `npm run build` and the publish directory to `_site`
- **Vercel**: Same setup; Vercel detects Eleventy automatically
- **GitHub Pages**: Push the `_site` directory or use GitHub Actions
- **Cloudflare Pages**: Connect your repository and set the same build settings

## Common Pitfalls

**Missing passthrough copies**: If your CSS or images are not appearing in the output, you probably forgot to add a `addPassthroughCopy` call in your config.

**Front matter typos**: Eleventy is case-sensitive about front matter keys. `Title` is not the same as `title`. Check your templates if a variable is undefined.

**Permalink issues**: By default, Eleventy creates directories with index.html files. `articles/my-post.md` becomes `/articles/my-post/index.html`. If you want a different URL structure, set `permalink` in the front matter.

## Conclusion

Eleventy gives you the benefits of a static site generator -- templates, collections, data files, builds -- without the complexity of a full framework. A basic site requires only a config file, a layout template, and some Markdown content. From there, you can add complexity incrementally as your needs grow. This simplicity is Eleventy's greatest strength, and it is why the project continues to grow in popularity among developers who value speed and maintainability.
