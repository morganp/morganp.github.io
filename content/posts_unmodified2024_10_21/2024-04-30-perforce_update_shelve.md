Title: Perforce Update files in a Shelve 
Date: 2024-04-30 11:04 
Category: Tech
Tages: perforce
Author: morganp

Perforce can temporarily checkins of changes that you might want to share with others before fully commiting them to the code base. These P4 Shelves have some properties that seem undesirable for a revision control system. They are not imuttable. 

From there nature they are temporary but they can also be altered and maintain the same changelist number. Solution based on [this SO answer][update shelve].

Lets create file a.txt with some default content, and create a shelve.

    echo "File a - line 1" >> a.txt
    p4 add a.txt
    p4 shelve ...

    > Change 3265397 created with 1 open file(s).
    > Shelving files for change 3265397.


Remeber the Changelist number for the shelve, we will refer to it as \<change#\>. 
Now lets modify a and create a b.txt. 

    p4 edit a.txt
    echo "File a - line 2 after intial shelve" >> a.txt
    echo "File b - line 1 Missed in first shelve" >> b.txt
    p4 add b.txt
 
    p4 reopen -c <change#> b.txt

    > b.txt#1 - reopened; change 3265397

    p4 shelve -r -c <change#> 

    > Shelving files for change 3265397.
    > add //./a.txt#1
    > add //./b.txt#1
    > Change 3265397 files shelved.




[update shelve]: https://stackoverflow.com/a/23109698/97073
