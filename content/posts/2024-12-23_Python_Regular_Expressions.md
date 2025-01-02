Title: Python Regular Expressions
Date: 2024-12-23 10:21 
Category: Tech
Tags: python
Author: morganp

Python Regular Expressions Quick Guide: 
--

    ^        Matches the beginning of a line
    $        Matches the end of the line
    .        Matches any character
    \s       Matches whitespace
    \S       Matches any non-whitespace character
    *        Repeats a character zero or more times
    *?       Repeats a character zero or more times 
             (non-greedy)
    +        Repeats a character one or more times
    +?       Repeats a character one or more times 
             (non-greedy)
    [aeiou]  Matches a single character in the listed set
    [^XYZ]   Matches a single character not in the listed set
    [a-z0-9] The set of characters can include a range
    (        Indicates where string extraction is to start
    )        Indicates where string extraction is to end

Based on Dr Chucks from Python for Everyone course.

Usage:
--

    import re

    list_of_strings = re.findall(<pattern>, string)
