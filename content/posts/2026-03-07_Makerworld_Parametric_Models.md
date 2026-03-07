Title: MakerWorld Parametric Models with OpenSCAD
Date: 2026-03-07
Category: Engineering
Tags: OpenSCAD, 3D Print, MakerWorld, CAD
Slug: makerworld-parametric-models-openscad
Author: morganp
Summary: How to create customizable parametric models on MakerWorld using OpenSCAD scripts.

MakerWorld listings with a "Customize" button let users tweak model parameters, preview changes live, and download a ready-to-print file. Under the hood, these are OpenSCAD scripts. MakerWorld runs the script inside their Parametric Model Maker app and presents the configurable variables as a UI for the end user.

If you can write an OpenSCAD script that generates your model and expose the key dimensions as variables, MakerWorld handles the rest: a polished customizer UI and a downloadable 3mf file.

OpenSCAD is a free, code-based CAD tool. Rather than clicking tools and dragging dimensions, you describe geometry as code. For example, instead of drawing a sphere and setting its diameter to 20mm, you write:

```openscad
sphere(d = 20);
```

Think of it as scripting the feature timeline you would normally follow in Fusion 360 or Onshape.

## Getting Started with OpenSCAD

**Learning resources:**

- YouTube tutorials are the quickest way to get a feel for what OpenSCAD can do.
- The official [OpenSCAD documentation](https://openscad.org/documentation.html) and [cheatsheet](https://openscad.org/cheatsheet/) are available online.
- LLMs like ChatGPT are surprisingly effective: describe the object you want, ask for an OpenSCAD script, and iterate from there.

**Testing your script:**

- Run it locally in OpenSCAD on your own machine as you develop.
- Or use MakerWorld's Parametric Model Maker directly in your browser without installing anything.

**Which version of OpenSCAD does MakerWorld support?**

MakerWorld is compatible with the 2021 official release. The project has daily development builds with additional features, but stick with the stable 2021 release to ensure compatibility.

## Publishing to MakerWorld

To add a Customize button to your listing, create a new MakerWorld listing and upload the `.scad` file instead of a `.3mf` file. MakerWorld will automatically detect it and enable the customizer. You also earn MakerWorld points when users download via the Customize button.

## Controlling the Customizer UI

Any variable declared at the top of your script appears as an editable field in the UI automatically. To control the widget type (slider, dropdown, colour picker, help text), use comments following the OpenSCAD Customiser standard. The easiest way to explore the options is to click the "Sample Code" icon in the bottom-left of the Parametric Model Maker. It loads example code demonstrating all available widgets.

**Example: dropdown with named options**

```openscad
// Select which size you want
Box_Size = 10; // [10:Large, 5:Medium, 1:Small]
```

**Font selector:**

```openscad
Label_Font = "Arial"; // font
```

Available fonts are those pre-loaded by MakerWorld, which includes most of Google Fonts. The full list is in the Parametric Model Maker under the "Book" icon then "Third-party fonts".

## Libraries

MakerWorld supports a curated set of OpenSCAD libraries:

| Library | Purpose |
|---|---|
| BOSL2 | General-purpose functions and geometry |
| UB | Miscellaneous utilities |
| KeyV2 | Keyboard keycap generation |
| gridfinity-rebuilt-openscad | Gridfinity bin generation |
| threads-scad | Threaded parts |
| Getriebe | Gear generation |
| knurledFinishLib_v2 | Knurled surface textures |

---

*Largely based on this [Reddit post](https://www.reddit.com/r/BambuLab/comments/1jl6ypa/how_to_create_customizable_models_on_maker_world/) in r/BambuLab.*

