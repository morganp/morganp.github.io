Title: LaTeX macros
Date: 2024-10-10 14:17 
Category: Tech
Tags: TeX
Author: morganp

LaTeX macros can be used as simple text replacments for example:

    \documentclass{article}
    \newcommand{\LUG}{LEGO User Group}
    \begin{document}
      \section{Welcome to the \LUG}
    \end{document}

More Advanced usage allows LaTeX macros to be used like functions:

    \documentclass{article}
    \newcommand{\LUG}[1]{\textbf{#1} LEGO User Group}
    \begin{document}
      \section{Welcome to the \LUG{tartan}}
    \end{document}

