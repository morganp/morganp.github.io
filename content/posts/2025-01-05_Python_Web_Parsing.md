Title: Python Web Parsing
Date: 2025-01-05 11:15 
Category: Programming
Tags: Python
Author: morganp
Status: published

For parsing web pages with Python, BeautifulSoup is a helpful library. To install:

    pip install beautifulsoup4

You also need a way to fetch the page. The standard library `urllib` works fine for simple cases; `requests` is more ergonomic for anything complex:

    pip install requests

## Basic Usage: Extract all links

    import urllib.request, urllib.parse, urllib.error
    from bs4 import BeautifulSoup
    import ssl

    # Ignore SSL certificate errors
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    url = input('Enter URL: ')
    html = urllib.request.urlopen(url, context=ctx).read()
    soup = BeautifulSoup(html, 'html.parser')

    # Retrieve all anchor tags
    tags = soup('a')
    for tag in tags:
        print(tag.get('href', None))

## Finding Elements

BeautifulSoup provides several ways to locate content:

    # First matching element
    soup.find('h1')
    soup.find('div', class_='content')
    soup.find('a', id='main-link')

    # All matching elements (returns a list)
    soup.find_all('p')
    soup.find_all('a', class_='external')

    # CSS selector syntax
    soup.select('div.article > p')
    soup.select_one('#footer a')

## Extracting Text and Attributes

    tag = soup.find('a')

    tag.text          # visible text content (strips tags)
    tag.get_text()    # same, with optional separator
    tag['href']       # attribute access (raises KeyError if missing)
    tag.get('href')   # safe attribute access (returns None if missing)

## Using requests Instead of urllib

    import requests
    from bs4 import BeautifulSoup

    response = requests.get('https://example.com')
    soup = BeautifulSoup(response.text, 'html.parser')

    for link in soup.find_all('a'):
        print(link.get('href'))

Note: always check `response.status_code == 200` before parsing, and respect `robots.txt`.
