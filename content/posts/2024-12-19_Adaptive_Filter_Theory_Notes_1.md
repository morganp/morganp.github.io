Title: Adaptive Filter Theory Notes 1
Date: 2024-12-19 11:04 
Category: Engineering
Tags: DSP
Author: morganp

Notes From Reading Adaptive Signal Theory (5th Ed) by Simon Haykin

Three Basic Kinds Of Estimation
--

* Filtering  - Extraction of Current and previous information. RealTime operation.
* Smoothing  - Data after the time of interest is used. Posteriori operation.
* Prediction - forcasting for some time in the future. RealTime operation.

Filter optimization is useful to think of minimising the mean-square-error. 

For stationary inputs the **Wiener** filter is considered optimal in mean-square-error sense.

Plots of the mean-square value of the error signal versus the adjustable parameters of the linear filter is known as the **error-performance-surface**. The min point on this is the Wiener solution.

Wiener Filter is no good with moving signals, or precense of noise. Kalman Filters are useful in this sitation.





 

