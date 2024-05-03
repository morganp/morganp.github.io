Title: Convolution in Python
Date: 2024-05-03 14:25 
Category: Python
Tages: python
Author: morganp

Convolution in Python, for merging filter responses, creating pascals triangle ...


    import numpy as np
    
    a= np.array([1,1])
    b= np.array([1,1])

    c =np.convolve(a, b)
    c
    > array([1, 2, 1])
