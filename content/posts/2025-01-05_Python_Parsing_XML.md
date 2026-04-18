Title: Python Parsing XML
Date: 2025-01-05 13:31 
Category: Programming
Tags: Python
Author: morganp
Status: published

Parsing XML with Python using the standard library `xml.etree.ElementTree`. It converts XML text into a tree of `Element` objects you can traverse and query.

## Basic Parsing

    import xml.etree.ElementTree as ET

    data = '''<person>
      <name>Chuck</name>
      <phone type="intl">
        +1 734 303 4456
      </phone>
      <email hide="yes" />
    </person>'''

    tree = ET.fromstring(data)
    print('Name:', tree.find('name').text)
    print('Attr:', tree.find('email').get('hide'))

## Parsing from a File

    tree = ET.parse('data.xml')
    root = tree.getroot()
    print(root.tag)

## Iterating over Children

    for child in root:
        print(child.tag, child.attrib)

Use `iter()` to walk the entire tree recursively:

    for elem in root.iter('phone'):
        print(elem.text.strip())

## Accessing Attributes and Text

    elem = root.find('phone')
    elem.text.strip()       # text content
    elem.get('type')        # attribute value (None if missing)
    elem.attrib             # dict of all attributes

## Finding Multiple Elements

    # All direct children matching a tag
    root.findall('item')

    # XPath-style expressions
    root.findall('./items/item')
    root.find('./items/item[@id="1"]')

## Handling Namespaces

XML namespaces appear as `{uri}tag`. Register a prefix to keep queries readable:

    ns = {'ns': 'http://example.com/schema'}
    root.find('ns:item', ns)

For larger or more complex XML, consider `lxml` which is faster and supports full XPath:

    pip install lxml
