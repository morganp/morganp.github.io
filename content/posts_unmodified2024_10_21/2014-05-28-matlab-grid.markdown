---
layout: post
title: "Matlab: Grid"
date: 2014-05-28 19:49:38 +0100
comments: true
sharing: true
footer: true
categories: 
- Engineering
tags:
- Programming
- Matlab
published: true
---

![](/images/Engineering/matlab_grid/grid_on.png)

To add X and Y grids to plots :
 
    grid on;

<!-- more -->

![](/images/Engineering/matlab_grid/y_grid_on.png)

To add Y only grid:

    set(gca,'XGrid','off','YGrid','on');

![](/images/Engineering/matlab_grid/x_grid_on.png)

To add X only grid

    set(gca,'XGrid','on','YGrid',’off');

