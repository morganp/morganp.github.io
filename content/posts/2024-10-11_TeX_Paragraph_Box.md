Title: TeX Paragraph Box
Date: 2024-10-11 14:18 
Category: Tech
Tags: TeX 
Author: morganp

`parbox` is a LaTeX command used to place a box around text. 

Remeber that optional arguments are in \[\] (Square brackets)

Typical usage is :

    \parbox[alignment]{width}{text}

The options are:

    alignment:
      t - Top alligned
      c - vertically centered
      b - Bottom alligned
      s - Stretch to fill vertically
    
    width fractional value followed by ISO units of mm, cm and in are supported

Example:

    \documentclass{article}
    \begin{document}
      \parbox[b]{2.3cm}{b for bottom aligned}
    \end{document}


If a large amount of text is to be placed in the box `minipage` is preffered over `parbox`.

    \documentclass{article}
    \begin{document}
      \begin{minipage}{2.3cm}
        minipage not parbox
      \end{minipage}
    \end{document}

`minipage` supports all the arguments of `\parbox`, as well as `\footnote`

    \documentclass{article}
    \begin{document}
      \begin{minipage}{5cm}
        minipage not parbox	\footnote{this is a foot note}.
        Second Line with another foot note \footnote{Another foot note}.
      \end{minipage}
    \end{document}

![](/images/Tech/Tex/tex_minipage_footnote.png)

