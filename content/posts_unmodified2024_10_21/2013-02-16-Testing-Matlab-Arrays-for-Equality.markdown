---
layout: post
title: "Testing Matlab Arrays for Equality."
date: 2013-02-16 21:22:07 +0000 
comments: true
sharing: true
footer: true
categories: Engineering
tags:
- Matlab
discuss_url: //212
url: //212/Testing_Matlab_Arrays_for_Equality.
id: 212
---
Testing a matlab array for equality can be doen a few different was some have surprising side effects if your not use to working with vectorised testing.

Initial test :

    a = [1,2,3];
    if (a == [1,2,3])
      disp('equal')
    end

    > equal

Seems easy, But what happens if the dimensions of the array are incorrect?

    a = [1,2,3];
    if (a == [1,2,3,4])
      disp('equal')
    end

    Error using  == 
    Matrix dimensions must agree

May be if we check dimensions first using short-circuiting (`&&`) operators. NB: Short circuiting operators only execute if required, if it failed on the left hand side the right side will not be evaluated.

    a = [1,2,3];
    if ((length(a) == 4) && (a == [1,2,3,4]))
      disp('equal')
    end

So far so good, but lets check it will also pass:

    a = [1,2,3];
    if ((length(a) == 3) && (a == [1,2,3]))
      disp('equal')
    end

    Operands to the || and && operators must be convertible to logical scalar
    values.

This is where it got interesting for me:
 
    a ==[1,2,3]
    ans =

     1     1     1

The basic equality `==`  test for arrays is vectorised. When this is the only test it gets reduced down to true or false, but can not be combined with scalars.

Then I the discovered the [isequal][] function.

    a = [1,2,3];
    isequal(a, [1,2,3])

    ans =

         1

    a = [1,2,3];
    isequal(a, [1,2,3,4])

    ans =

         0

For direct comparisons of arrays use `isequal(a,b)` for vectorised operations use `a==b`.

[isequal]: http://www.mathworks.co.uk/help/matlab/ref/isequal.html
