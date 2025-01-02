Title: TeX hyphenation
Date: 2024-10-14 14:45 
Category: Tech 
Tags: TeX,
Author: morganp

When TeX/LaTeX is fully justifying text there are times when it could do better but it does not know how to hyphenate certain words. Here we can give it guidnace on how to split words.

For example (insert into the pre-amble):

    \hyphenation{acro-nym}

Multiple hyphenation points can also be defined, and for related words:

    \hyphenation{ac-ro-nym ac-ro-nym-ic a-cro-nym-i-cal-ly}
 
The hyphenation point can be inserted manually with a `\-`, but it is best to setup in the pre-amble and keep all the layout rules together.

    acro\-nym

Preventing Hyphenation
--

Preventing hyphenation can be done by decalring in the pre-amble without a hyphen or inline with an `\mbox` command

    \hyphenation{automobile}

    this will stop hyphenation of inline text \mbox{automobile}

Global Hyphenation Control
--

Use the hphenat package to prevent all hyphenation

    \usepackage[none]{hyphenat}

There are some better ideas on this [TeX SO Question][TeX Stackoverflow].
[TeX Stackoverflow]: https://tex.stackexchange.com/q/5036/165015

