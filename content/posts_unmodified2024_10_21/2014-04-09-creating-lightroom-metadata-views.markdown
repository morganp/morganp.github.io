---
layout: post
title: "Creating Lightroom Metadata Views"
date: 2014-04-09 01:28:27 +0100
comments: true
categories: 
- Photography
tags:
- Lightroom
- Programming
---
Lightroom plugins for metadata views are called metadata tag sets and only require 2 text files.

create a folder called `something.lrdevplugin` once you are happy with it it can be renamed `something.lrplugin`

Create a file called Info.lua and Tagset.lua

Info.lua:

    return {
      LrSdkVersion = 5.0,
      LrSdkMinimumVersion = 5.0,
      LrToolkitIdentifier = ’sample.metadata',
      LrPluginName = LOC "$$$/CustomMetadata/PluginName=Example View",
      LrMetadataTagsetFactory = ‘Tagset.lua',
    }

Tagset.lua


    return {
      title = LOC "$$$/SampleTagset/Title=Example Meta",
      id = ‘Tagset',
      items = {
        {'com.adobe.jobIdentifier', height_in_lines = 1},
        'com.adobe.separator',
        {'com.adobe.title', height_in_lines = 2},
        'com.adobe.separator',
        {'com.adobe.caption', height_in_lines = 6},
      },
    }

The full list of options can be seen from page 63 of the [lightroom sdk guide](http://wwwimages.adobe.com/www.adobe.com/content/dam/Adobe/en/devnet/photoshoplightroom/pdfs/lr5/lightroom-sdk-guide.pdf).

My [Copyright view][] and [JobID view][].

[Copyright view]: https://github.com/morganp/CopyrightMetadataTagset.lrdevplugin
[JobID view]: https://github.com/morganp/CopyrightMetadataTagset.lrdevplugin
