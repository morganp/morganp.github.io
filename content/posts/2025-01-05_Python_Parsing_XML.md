Title: Python Parsing XML
Date: 2025-01-05 13:31 
Category: Tech
Tags: python
Author: morganp
Status: draft
<!--to publish change draft to published-->

Parsing XML text using Python. Element Tree converts the XML text into a stuct tree format.

Example: From python for every one:

    import xml.etree.ElementTree as ET
    data = '''<person>
      <name>Chuck</name>
      <phone type="intl">
        +1 734 303 4456
      </phone>
      <email hide="yes" />
    </person>'''
    
    tree = ET. fromstring (data)
    print ('Name:', tree.find('name').text) 
    print ('Attr:', tree.find('email').get('hide'))
