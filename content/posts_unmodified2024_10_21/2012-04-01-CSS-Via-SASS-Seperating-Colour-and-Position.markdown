---
layout: post
title: "CSS (Via SASS) Seperating Colour and Position"
date: 2012-04-01 16:15:15 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- CSS
- SASS
- Web
- Sinatra
discuss_url: //144
url: //144/CSS_%28Via_SASS%29_Seperating_Colour_and_Position
id: 144
---
While working on this site I wanted to find a simple way of trying out multiple stylesheets for different colour schemes. I originally thought a simple way to do this would be split it in to multiple stylesheets, one for position and another for colour.

Style/Colour (SASS)

    body
      font-family: 'Droid Sans',sans-serif
    
    h1, h2, h3
      font-family: 'Droid Serif',serif

    pre, code, tt 
      font-family: 'Droid Sans Mono','andale mono','lucida console',monospace
    
    h1
      font-size: 2em
      line-height: 1.5em
      margin-bottom: 0
      border-bottom-style: solid
      border-bottom-width: 1px
    
    h2
      font-size: 1.5em
      line-height: 1em
      margin-top: 4px
      margin-bottom: 10px
      
    p
      font-size: 1.5em

Colour (SASS formatting)

    h1
      color: #3E7697

    h2, h3
      border-color: #3E7697
      color: #3E7697
    
    p
      color: #333300

However I ran into problems with some of the new css3 features, box shadows in particular. box-shadow does not seem to be able to separate position and colour.

    .box_shadow {
     -webkit-box-shadow: 0px 0px 4px 0px #ffffff; /* Saf3-4, iOS 4.0.2 - 4.2, Android 2.3+ */
      -moz-box-shadow: 0px 0px 4px 0px #ffffff; /* FF3.5 - 3.6 */
      box-shadow: 0px 0px 4px 0px #ffffff; /* Opera 10.5, IE9, FF4+, Chrome 6+, iOS 5 */
    }
   
SASS allows variables to be introduced and has a system of partials or combining multiple SASS files to render the finished CSS. Using both of these techniques allows a semantic colour scheme to be introduced before combining it with the Styling which applies the style (Colour and Position).

If I was to have two variants of my stylesheet light_text_on_dark_background and dark_text_on_light_background the sass files might look like:

light_on_dark.sass

    @import _base.sass
    @import _light_color.sass
    @import _position_after_color.sass

dark_on_light.sass

    @import _base.sass
    @import _dark_color.sass
    @import _position_after_color.sass

Now the colours, first I give hex colours a mnemonic variable name (black, dark_blue etc) so you know roughly what it looks like, since most colour schemes are only made up of 3 to 4 main colours this relatively easy. I then assign the mnemonic colours to semantic variable names. Every colour scheme must use the same semantic names.

\_light_color.sass

    //Mnemonic Colours
    $dark:            #333300
    $darker:          #664411
    $very_light_grey: #F0F0F0
    $light_grey:      #97A4A6
    $dark_blue:       #3E7697

    //Semantic Colours - Every colour scheme file implements these
    $back:           $very_light_grey
    $text:           $dark
    $title:          $dark_blue 
    $header:         $dark_blue
    $currentnav:     $title
    $link:           $darker
    $hoverlink:      $title
    $lightlink:      $text
    $lighthoverlink: $title
    $menulink:       $text
    $menuhoverlink:  $title

    // Radius for nice looking corners
    $shadow_color:  $header

\_dark_color.sass

    //Mnemonic Colours
    $black:        #000000
    $dark:         #333300
    $darker:       #664411
    $light_grey:   #97A4A6
    $light_blue:   #3E7697
    $dark_blue:    #105984

    //Semantic Colours - Every colour scheme file implements these
    $back:           $black
    $text:           $light_grey
    $title:          $light_blue
    $header:         $dark_blue
    $currentnav:     $title
    $link:           $darker
    $hoverlink:      $title
    $lightlink:      $text
    $lighthoverlink: $title
    $menulink:       $text
    $menuhoverlink:  $title

    // Radius for nice looking corners
    $shadow_color:   $header

The position and styling can then be applied using these semantic names.

\_position_after_color.sass

    $radius: 12px
    $shadow_right: 0px
    $shadow_top: 0px
    $shadow_width: 4px
    
    =radius
      -moz-border-radius: #{$radius}
      -webkit-border-radius: #{$radius}
      border-radius: #{$radius}
      -moz-box-shadow: #{$shadow_right} #{$shadow_top} #{$shadow_width} #{$shadow_color}
      -webkit-box-shadow: #{$shadow_right} #{$shadow_top} #{$shadow_width} #{$shadow_color}
      box-shadow: #{$shadow_right} #{$shadow_top} #{$shadow_width} #{$shadow_color}
    
    body
      color: #{$text}
      background-color: #{$back}
      width: 100%

    h1
      color: #{$header}
    
    h2, h3
      border-color: #{$title}
      color: #{$title}
    
    p
      font-size: 1.5em
      color: #{$text}

    pre.prettyprint
      +radius
      padding: 0px 10px


Some of the Sass setup in Sinatra:
 
    require 'compass' #Must be before Sinatra
    require 'sinatra' 
    require 'haml'
    require 'sass'

    configure :development do
     Compass.configuration do |config|
        config.project_path = File.dirname(__FILE__)
        config.sass_dir = 'views/stylesheets'
        config.output_style = :expanded
      end
    end

     configure :production do
     Compass.configuration do |config|
        config.project_path = File.dirname(__FILE__)
        config.sass_dir = 'views/stylesheets'
        config.output_style = :compressed
      end
    end

    configure do
      set :haml, { :format => :html5 }
      set :sass, Compass.sass_engine_options
    end

