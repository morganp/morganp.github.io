---
layout: post
title: "Active Record  attributes simplify update and create."
date: 2010-08-13 02:13:17 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Active Record
- Programming
discuss_url: //61
url: //61/Active_Record__attributes_simplify_update_and_create.
id: 61
---
In Active Record when updating records I used to have an very manual process to this some thing like:

    @todo.done = params['post']['done']
    @todo.desc = params['post']['desc']
    @todo.save

Model of Todo with boolean done and text description field. 

This can be done in a more maintainable fashion with:
 
    @todo.update_attributes = params['post']

This does pose the security concern that the form (which transmits params\['post'\]) could be hacked to add id fields or such like that you may get unwanted manipulation of the table.

To solve this there is a attr_accessible which specifies fields allowed to be updated by the .attributes . while this might seem now like there is no benefit as if we run a migration to add an extra column we also need to update the Active Record model. While this is true we only need to update the model once and create/new  and update methods should benefit from this.

    class Todo < ActiveRecord::Base
    end

Becomes 

    class Todo < ActiveRecord::Base
       attr_accessible :done
       attr_accessible :desc
    end

Summary:
--------

    @customer.update_attributes = { "description" => "Jolly fellow", "credit_rating" => "Superb" }

same as:

    @customer.description = "Jolly fellow"
    @customer.credit_rating = "Superb"
    @customer.save

