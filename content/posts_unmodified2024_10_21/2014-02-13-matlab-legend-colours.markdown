---
layout: post
title: "Matlab: legend colours"
date: 2014-02-13 20:51:45 +0000
comments: true
categories: Engineering
tags:
- Matlab
---

When plotting several lines in Matlab, I have become aware of how hard it was to see the colours in the legend. Based [on this matlabcentral question][source] I found an easy way to control the line thickness in the legend.

    plot(randn(100,1));
    hold on;
    plot(randn(100,1),'k');


    [legh,objh,outh,outm] = legend('First','Second','Location','Southeast');
    set(objh,'linewidth',2); %%<-- set legend line thickness to 2


Or just the following after you define your legend:


    % legend('First','Second','Location','Southeast');

    [legh,objh,outh,outm] = legend();
    set(objh,'linewidth',2);

[source]: http://www.mathworks.co.uk/matlabcentral/newsreader/view_thread/267186
