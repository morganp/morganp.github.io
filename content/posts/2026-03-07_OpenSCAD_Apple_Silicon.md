Title: OpenSCAD on Apple Silicon
Date: 2026-03-07
Category: Engineering
Tags: OpenSCAD, 3D Print, macOS, Homebrew
Slug: openscad-apple-silicon
Author: morganp
Summary: Installing OpenSCAD on Apple Silicon Macs using Homebrew.

OpenSCAD is a script-based 3D CAD modeller, well suited to parametric and printable part design. The snapshot release has native Apple Silicon support.

## Install Homebrew

If [Homebrew](https://brew.sh) is not already installed, run the following in Terminal:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

## Install OpenSCAD

The snapshot cask provides the latest development build with native ARM support:

```bash
brew install --cask openscad@snapshot
```

Once installed, OpenSCAD will be available in `/Applications` and can be launched from Spotlight or the Applications folder.
