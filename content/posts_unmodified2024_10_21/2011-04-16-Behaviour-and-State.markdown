---
layout: post
title: "Behaviour and State"
date: 2011-04-16 17:59:44 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Programming
- Ruby
discuss_url: //100
url: //100/Behaviour_and_State
id: 100
---
Classes are a basic Object Orientated Structure which encapsulate state and behaviour. Some times you just require to capture state/storage of a data structure with out any behaviour, in this case Ruby's Stuct can be useful.

    class Desk
      attr_accessor :height, :width, :depth

      def initialize(height=nil, width=nil, depth=nil)
        @height = height
        @width = width
        @depth = depth
      end
    end
 
Becomes (Is the same as):

    DeskS = Struct.new(:height, :width, :depth)

Instantiation 

    a = Desk.new(12, 13, 14)
    b = DeskS.new(12, 13, 14)

    a.height
     => 12

    b.height
     => 12 

Taking this further for less code in a basic class. This might be too far!

    #In herriting from a Struct
    # class DeskWithBehaviour < DeskS
    class DeskWithBehaviour < Struct.new(:height, :width, :depth)
      def volume
        height * width * depth
      end
    end

    # Or Pass Struct a block
    DeskSPlus = Struct.new(:height, :width, :depth) do
      def volume
        height * width * depth
      end
    end

    c = DeskWithBehaviour.new(1,2,3)
    c.volume
     => 6
    c.class
     => DeskWithBehaviour

    d = DeskSPlus.new(1,2,3)
    d.volume
     => 6
    d.class
     => DeskSPlus
