Title: Better Python Iterators
Date: 2025-03-01 12:24 
Category: Tech
Tags: python
Author: morganp
Status: published
<!--to publish change draft to published-->

Pyhton can convert most (all) lists/collections into iterator objects, this is done by calling `iter()` ie

    num_list = [1, 2, 3] 
    num_iter = iter(num_list)  # Returns Iterator

Python in the background is calling the objects `__iter__()` method.

A typical method for returning an Iterator is using a for loop to compile/create the elements. However the draw back to this is that the for loop can not begin executing until the full iterator is created.  
This could make it the program look like it has stalled while it compiles long and or complex iterator objects.


Generator Functions
--

Generator function allow an optimisation that it allows the use of the iterator after each element has been created. Generator functions return elemnts using `yield` instead of `return` on the complete list. The a benefit of this approach is that the full iterator never has to be held in memory at the same time, allowing much larger data sets to be analysed.

Generator Example
--

    def my_generator(n):

        # initialize counter
        value = 0

        # loop until counter is less than n
        while value < n:

            # produce the current value of the counter
            yield value

            # increment the counter
            value += 1

Non-Generator Example
--

    def my_nongenerator(n):

        # initialize counter
        value = 0
        this_list = list()
        # loop until counter is less than n
        while value < n:

            # produce the current value of the counter
            this_list.append( value )

            # increment the counter
            value += 1
        return this_list

