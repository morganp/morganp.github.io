Title: Python read a CSV file 
Date: 2024-04-19 12:34
Category: Python
Tags: pelican, python
Author: morganp

Python example for reading data from a csv file.


    import csv
    with open(data.csv', newline='') as csvfile:
        spamreader = csv.reader(csvfile, delimiter=' ', quotechar='|')
        for row in spamreader:
            print(', '.join(row))


Import csv into a numpy array.

    import numpy as np
    import csv
    with open('data.csv', 'r') as f:
      reader = csv.reader(f)
      data   = list(reader)
    # data_array = np.array(data)  # Conversion for strings
    data_array = np.array(data, dtype=float) # Conversion for doubles

    # Print first 10 data elements.
    for a in range(0,10):
      print( data_array[a] )

Outputs: 

    

[source][source]

[source]: https://saturncloud.io/blog/loading-csv-data-into-a-numpy-array-a-comprehensive-guide/
