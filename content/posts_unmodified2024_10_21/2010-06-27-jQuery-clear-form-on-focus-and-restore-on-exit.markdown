---
layout: post
title: "jQuery clear form on focus and restore on exit"
date: 2010-06-27 10:57:35 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Programming
- jQuery
- Web
discuss_url: //48
url: //48/jQuery_clear_form_on_focus_and_restore_on_exit
id: 48
---
I used [this as a jQuery reference][jquery] to hide and show default text in forms.

    <head>
       <script type=”text/javascript” src=”js/jquery.js”></script>
       <script type=”text/javascript”>

       $(document).ready(function(){

          var clearMePrevious = ”;

          // clear input on focus
          $(’.clearMeFocus’).focus(function()
          {
             if($(this).val()==$(this).attr(’title’))
             {
                clearMePrevious = $(this).val();
                $(this).val(”);
             }
           });

           // if field is empty afterward, add text again
           $(’.clearMeFocus’).blur(function()
           {
            if($(this).val()==”)
            {
              $(this).val(clearMePrevious);
            }
        });
    });

    </script>
    </head>

and the for the form 

    <input type=”text” name=”email” title=”Enter your email” value=”Enter your email” class=”clearMeFocus” />


[jquery]:http://www.eggchops.com/web-stuff/jquery/jquery-clear-focus-function/
