---
layout: post
title: "matrix: A Ruby Standard Library"
date: 2012-01-20 12:09:05 +0000 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Math
- Ruby
- Programming
discuss_url: //136
url: //136/matrix%3A_A_Ruby_Standard_Library
id: 136
---
[Originally written][homework] as an assignment for [Ruby Mendicant University][RMU].

[homework]: http://github.com/sandal/guides/wiki/STDLIB:-Matrix
[RMU]: http://mendicantuniversity.org/

matrix is part of the [Ruby Standard Library][stlib]  

Usage
=====

A note before we start, if using Ruby 1.8 require 'mathn' will make matrix division return more accurate results. With it Rational numbers can be returned with out it Rounded numbers are returned. Ruby 1.9 Rational numbers are used by default.

    require 'matrix'
    a = Matrix[[1,2], [3,4]] 
    => Matrix[[1, 2], [3, 4]] 
    This would look like:  
       1,2
       3,4

    a = Matrix.columns([ [1,3],[2,4] ]) #Note Rows and columns swapped
    => Matrix[[1, 2], [3, 4]] 
    
    This would still look like
       1,2
       3,4


If you already have the row defined as a Arrays then using rows they can be combined into a matrix

    row1 = [1,2]
    row2 = [3,4]
    a = Matrix[ row1,row2 ]
    #This is also the same as:
    b = Matrix.rows([ row1, row2 ])

This by defaults to copying the arrays, i.e. any change to Matrix a will not effect row1 or row2. If you would like the row1 and row2 to be pointers to the respective rows then a boolean switch can be used to control this behaviour

    row1 = [1,2]
    row2 = [3,4]
    a = Matrix.rows([ row1, row2 ], false)
    => Matrix[[1, 2], [3, 4]]
    row1[0] = 9
    puts a
    => Matrix[[9, 2], [3, 4]]

Note that you can not replace entire rows with:
 
    row1 = [5,6]
    puts a 
    => Matrix[[9, 2], [3, 4]]

This is because row1 has become a new Array and does not modify the existing array, Matrix a now contains the old Array row1.


Identity & Operators
--------------------

For matrix mathematics the identity matrix is very useful, more can be read [here][ident]. The identity matrix is often represented by I, its definition, given a matrix M:

    M*I = I*M = M

As it is a core part of matrices mathematics they are very simple to create in ruby.

    i = Matrix.identity(2)
    => Matrix[[1,0],[0,1]]

    i = Matrix.identity(3)
    => Matrix[[1, 0, 0], [0, 1, 0], [0, 0, 1]]

Addition and subtraction (and multiplication by scalars) work as expected

    a =  Matrix[ [1,1], [2,2] ] + Matrix.identity(2)
    => Matrix[[2, 1], [2, 3]]

    s = Matrix[ [1,1], [2,2] ] - Matrix.identity(2)
    => Matrix[[0, 1], [2, 1]]

    m =  Matrix.identity(2) * 3
    => Matrix[[3, 0], [0, 3]] 
    NB: this is the same as Matrix.scalar(2, 3)

Matrix by Matrix Multiplication is only possible with m by p multiplied by p by n, i.e. the inner dimension must match. This will result in an m x n matrix. In the next example a 1,4 * 4,1 results in 1,1 a single element matrix.

    [ [1 2 3 4] ]*[ [1]    => 1*1 + 2*2 + 3*3 + 4*4 = Matrix[ [30] ]
                    [2]
                    [3]
                    [4] ]

For a 2,2 * 2,2 results in a 2,2

    [[a,b],  * [[w,x]   => [[a*w + b*y], [a*x + b*x]
     [c,d]]     [y,z]]      [c*w + d*y], [c*x + d*z]]

At first glance this might not seem any thing special but there are a few mathematical properties that make this incredibly useful, rotation and solving linear equations for example.
            

Rotation
========

[<img src="http://imgs.xkcd.com/comics/matrix_transform.png">][comic]
_Comic from [kxcd][comic]_


Rotating a 2,1 matrix is relatively trivial. This can be used to rotate a set of x,y coordinates and makes rotating vector images trivial.

    [ [cos(x), -sin(x)]   * [[x] 
      [sin(x),  cos(x)] ]    [y]]


Solving Linear Equations (Linear Algebra)
=========================================

Here I would like to introduce the inverse function. Which is as simple as calling inverse, be careful though as not all matrices have an inverse and then it will throw 'ExceptionForMatrix::ErrNotRegular: Not Regular Matrix'. Any matrix multiplied by its inverse will lead to the identity matrix.

    a = Matrix.scalar(4,3) * Matrix.scalar(4,3).inverse
    => Matrix[[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]]

Two dimensional matrices are often used to help solve linear equations. Whereby we have x unknowns we can calculate the single solution if it exists with x equations.

For example:

    1a + 2b + 3c = 38
    4a + 5b + 6c = 92
    7a + 8b + 0c = 83

Can be rewritten as:
  
    [[1, 2, 3], * [[ a ],  = [[ 38 ],
     [4, 5, 6],    [ b ],     [ 92 ],
     [7, 8, 0]]    [ c ]]     [ 83 ]]

    This can be generalised to A.x = y

When the inverse of A exists it can be solved for x, by multiplying both sides by A^-1
    
    A.x = y
    x   = A^-1.y

    A = Matrix[ [1, 2, 3], [4,5,6], [7,8,0] ]
    y = Matrix[ [38], [92], [83] ]

    x = A.inverse * y
    => Matrix[[5], [6], [7]]

For sanity lets just check that.

    a = x[0,0]
    b = x[1,0]
    c = x[2,0]

    1*a + 2*b + 3*c 
    => 38
    4*a + 5*b + 6*c 
    => 92
    7*a + 8*b + 0*c 
    => 83

All Equations return expected results.


[stlib]: http://ruby-doc.org/stdlib/libdoc/matrix/rdoc/classes/Matrix.html
[comic]: http://xkcd.com/184/

[rotate]: http://en.wikipedia.org/wiki/Rotation_matrix
[linalgebra]: http://en.wikipedia.org/wiki/Linear_algebra
[ident]: http://en.wikipedia.org/wiki/Identity_matrix

