---
layout: post
title: "Octopress categories with different styles"
date: 2014-06-14 08:24:01 +0100
comments: true
sharing: true
footer: true
categories: 
- Tech
tags:
- Programming
- Octopress
published: true
---

As I use the code blocks for ingredient lists on my recipe pages I wanted to 
have a different style, lighter background instead of black.

I currently manually set a different layout in the _post header:

    layout: post
    categories: 
    - Tech

    layout: recipe
    categories: 
    - Cooking

<!-- more -->

The layout will then look for a matching layout in `source/_layouts`

Manually create your new layout (instructions from top level Octopress site):

    cp source/_layouts/post.html source/_layouts/recipe.html

Edit `source/_layouts/recipe.html` changing the role to `recipe`:

    ---
    layout: default
    single: true
    ---

    <div>
    <article class="hentry" role="recipe">
      \{\% include article.html \%\}
      <footer>
        <p class="meta">

This will now pick up the styling that `post` also gets but we can target our modifications to `article[role="recipe"]`.
For custom stylings apply changes in to the relevant file in `sass/custom/`.

To modify the background colour of a code block  
`sass/custom/_styles.scss` add:

    // Customise the recipe layout
    article[role="recipe"] pre {
      background-color: $sidebar-bg;
    }

NB: `$sidebar-bg` is defined in `sass/base/_theme.scss`
