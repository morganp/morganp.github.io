---
layout: post
title: "@philip_roberts taught me a thing or two about CSS"
date: 2010-07-22 10:15:50 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Web
- CSS
discuss_url: //56
url: //56/%40philip_roberts_taught_me_a_thing_or_two_about_CSS
id: 56
---
CSS or Cascading Style Sheets are used for styling html elements. HTML elements can have id's, which must be unique to all other elements on the page. HTML elements can also have a type class, an item can belong to multiple classes and a page can have multiple items in a class.

Example page:
 
    <html>
       <head>
       </head>
       <body id="about">
          <div id="nav">
            <a href="next">next</a>
          </div>
          <div id="body">
            <a class="small, underline"href="a">something</a>
            <a class="small" href="b">something</a>
            <a class="small" href="c">something</a>
          </div>
       </body>
    <html>

To refer to id's use a # symbol and . for classes. eg

    div#nav
    a.small

If you want to apply the same style to multiple elements they can be written in a list before the style. Make h1 h2 and h3 all text 2x normal:

    h1, h2, h3 {
        test-size: 200%;
    }

Now for the new stuff, if the ',' are removed from the list it specifies a hierarchy which for the element which you are matching:

    body#about div#nav a {
       background-color:yellow;
    }

The second thing that I had not realised is that the more specific the higher the precedent.

    a { 
      background-color:black;
    }
    body#about div#nav a {
      background-color:yellow;
    }

Will render the same as 

    body#about div#nav a {
       background-color:yellow;
    }
    a { 
       background-color:black;
    }
   
I had previously assumed in the last example that the last a define would have been all encompassing.

NB: For debugging CSS I think that the [FireBug plugin][firebug] for firefox is great. Watch the Video to get the most out of it.

[firebug]: http://getfirebug.com/
