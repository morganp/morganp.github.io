---
layout: post
title: "Git Submodules"
date: 2012-09-28 11:40:17 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Command Line
- Git
- Programming
discuss_url: //197
url: //197/Git_Submodules
id: 197
---
For code reuse within I have found Subversion externals really nice to work with. Instead of copy and pasting code between projects you import part or a whole Subversion repository, at trunk, a pinned revision of trunk or a tag.

Git has some thing similar called submodules. Git Submodules are covered in [Chapter 6.6][6.6] of [Pro Git][progit] by Scott Chacon. Which has been [released for free][git book].

My example is based on [Chapter 6.6][6.6] with a little bit of experimenting. 

For the example we will have git repos `project_top` and `project_sub`.

    $ cd project_top
    $ git submodule add git@github.com:morganp/project_sub.git sub

We now have a folder in project_top called sub. 

    $ git status
    # On branch master
    # Changes to be committed:
    #     new file: .gitmodules
    #     new file: sub

The .gitmodules keeps track of which git repos map to folder names. sub is interesting it is actually recording the commit (hash) that you currently have cloned in sub.

If you commit these changes.

    $git commit -am 'Added Sub module sub'

Then go into folder sub and create or modify a file, you will see that git status works as expected if you were in a standalone repository. 

If you then commit and push the changes to sub :

    git commit -am 'Modifying project_sub'
    git push origin master

Pushing back to the location everyone else will pull from is important as the next stage will move the project_sub sumodule on to that revision and if the commit hash does not exist and git clone or pull would fail.

Going back to the main project_top and lets see what modifications to sub (project_sub) look like.

    $ git status
    # On branch master
    # Changes not staged for commit:
    #        modified: sub (new commits)
    
Now release the changes in project_sub to every one else on project_top.

    git commit sub -m 'moving to point to latest project_sub'
    git push origin master

Done.  
Note that github understands submodules and will display sub as a special folder in project_top. Sub will link to to the master page, there will also be a hash which will link to the included revision in that commit of project_top.

[6.6]: http://git-scm.com/book/en/Git-Tools-Submodules
[git book]: http://git-scm.com/book
