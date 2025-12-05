Title: Python Base Types
Date: 2025-01-02 18:09 
Category: Tech
Tags: python
Author: morganp

Making notes as I work through [Dr Chucks][dr] Python for Everyone course on [Coursera][course].

There are 3 main types in Python:

* Lists []
* Dictionaries {}
* [Tuples][tuple] ()

[tuple]: https://en.wikipedia.org/wiki/Tuple

List
--
Lists are mutable, ie elements can be changed.  
Creation of a list:

    emptylist = []
    thislist  = ["A","B","C"]
    print( thislist )
      ['A', 'B', 'C']
    print( thislist[1] )
      B

Dictionary
--
Dictionaries are key value pairs.  
Creation of Dictionary

    emptydict = {}
    thisdict  = {0:"A", 1:"B", 2:"C"} 
    print( thisdict )
      {0: 'A', 1: 'B', 2: 'C'}
    print( thisdict[1] )
      B

Tuple
--
Tuples are unmodifiable lists. elements can not be changed or reordered.  
Creation of Tuple.

    emptytuple = () # This is of no real use as imutable
    thistuple  = ("A", "B", "C")
    print( thistuple )
      ('A', 'B', 'C')
    print( thistuple[1] )
      B 
 

[dr]: https://www.dr-chuck.com
[course]: https://www.coursera.org/specializations/python
