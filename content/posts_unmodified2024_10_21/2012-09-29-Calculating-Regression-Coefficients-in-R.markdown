---
layout: post
title: "Calculating Regression Coefficients in R"
date: 2012-09-29 12:10:18 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- R
- Statistics
discuss_url: //198
url: //198/Calculating_Regression_Coefficients_in_R
id: 198
---
For this example we will have a data file with two columns of data labelled A and B. For example

    A    B
    0.1 0.2
    0.3 0.4
    0.5 0.6

Set the working directory and load the data as usual in r:

    setwd("~/Code/example")
    data = read.table("data.txt", header=T)
    names(data) # List the header names

Correlation
--

Find the correlation between A and B.

    cor(data$A, data$b)

If you have more than 2 variables calculate the correlation matrix using :

    cor(data)

Unstandardised Regression Coefficient
--

A predicting B

    lm(data$B~data$A)

Standardised Regression Coefficient
--

A predicting B

    lm( scale( data$B )~scale( data$A ) )
