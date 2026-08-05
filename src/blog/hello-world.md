---
layout: layouts/post.njk
title: "Your first post title goes here"
description: "Reference file showing the front-matter contract for a post."
date: 2026-08-04
tags: ["Tag"]
draft: true
---

<!-- draft: true keeps this out of the build entirely. It was previously
     published, which meant these setup notes were being served as Max's
     writing in llms.txt, llms-full.txt, and api/profile.json. Keep the flag
     set, or delete the file once you have a real post. -->


TODO: Delete this file once you have a real post. It exists so the blog index,
the feeds, and `llms.txt` have something to render while you set the site up.

## Writing posts

Add a Markdown file to `src/blog/`. The front matter above is the whole
contract — `title`, `description`, `date`, and `tags`. Everything else is
handled by the layout.

Two things worth knowing:

- `description` does a lot of work. It becomes the meta description, the excerpt
  on the index, the summary in both feeds, and the line an AI system is most
  likely to quote when summarising the post. Write it deliberately.
- Set `draft: true` in front matter to keep a post out of the build.

## Formatting

Standard Markdown works — **bold**, *italic*, [links](https://example.com),
lists, and code:

```js
const posts = collection.getFilteredByGlob("src/blog/*.md");
```

> Blockquotes render in the site's serif face.
