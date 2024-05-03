Title: Python merge PDFs
Date: 2024-04-22 18:49
Category: Python
Tags: python
Author: morganp

Using python script to merge pdfs together.

Install package

    pip install pypdf

Script:

    from pypdf import PdfWriter

    pdfs = ['file1.pdf', 'file2.pdf', 'file3.pdf', 'file4.pdf']

    #merger = PdfMerger()
    merger = PdfWriter()

    for pdf in pdfs:
        merger.append(pdf)

    merger.write("result.pdf")
    merger.close()

[source][source]

[source]: https://stackoverflow.com/questions/3444645/merge-pdf-files

