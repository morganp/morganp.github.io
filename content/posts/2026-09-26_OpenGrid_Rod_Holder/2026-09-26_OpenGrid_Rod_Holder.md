Title: openGrid rod holder
Date: 2026-09-26
Category: Engineering
Tags: 3D Printing, OpenSCAD, openGrid, Workshop
Slug: opengrid-rod-holder
Author: morganp
Summary: A one-cell openGrid pot that keeps 0.5, 0.8 and 1.0 mm steel rod sorted by diameter, with windows to show the short offcuts at the bottom.
Status: published

Thin steel rod arrives in 300 mm lengths and rolls off the bench at the first knock. The 0.5, 0.8 and 1.0 mm diameters look the same from a metre away. The short offcuts disappear first, usually at the moment a single hinge pin is needed. I cut this rod into pins for hinges made with my [OpenSCAD hinge library](https://github.com/morganp/OpenSCAD_hinge). This post describes a wall-mounted pot that keeps each diameter in its own compartment, for anyone storing small rod, wire or drill bits on an openGrid board.

![Tall square openGrid rod holder with a lattice of diamond windows running up the front and side walls, and four compartments visible at the top]({static}/images/Engineering/OpenGridRodHolder/01-rod_holder.png)

## One cell wide, six tall

The holder snaps onto an [openGrid](https://www.opengrid.world/) board, the wall mounting system by David D, which uses a 28 mm grid. It takes 1 grid cell of width and 6 cells of height, so it measures 27.6 x 27.6 x 167.6 mm. The 0.4 mm missing from each cell leaves a gap between neighbours, so holders tile flush side by side and stack flush above each other.

Inside are 4 compartments in a 2 x 2 grid, each about 11 x 10.5 mm and 165.6 mm deep. Each diameter gets its own compartment, with one spare. A 300 mm rod stands about 134 mm proud of the top, which leaves plenty to grab.

Version 1 was 2 cells wide with 4 compartments in a single row. Version 2 packs the same 4 compartments into half the wall space.

![Four rod holders tiled in a 2 x 2 block on the openGrid board cells their snaps sit in]({static}/images/Engineering/OpenGridRodHolder/02-rod_holder_tiling.png)

## Seeing the offcuts

Rod gets used from the top, so the short offcuts collect at the bottom of a 166 mm bore, out of sight. A lattice of diamond windows runs up the outer walls and shows them without tipping the holder out. The diamonds wrap round the 2 front corners, so the front view shows the front corner of all 4 compartments.

![Bottom of the holder seen from a front corner, with short offcuts standing in two compartments behind the diamond windows]({static}/images/Engineering/OpenGridRodHolder/03-rod_holder_windows.png)

Windows in a rod holder look like a way for rods to fall out. They are not, because the lowest window starts 4 mm above the floor. A rod rests its bottom end on the floor behind that solid band. To escape, it has to be lifted over the band first, and gravity keeps it seated. A rod leaning against a window can only push its top end out, which slides it upwards rather than out.

![Section through the left column of the holder showing the front and back bores, the solid floor band and the back plate carrying the snaps]({static}/images/Engineering/OpenGridRodHolder/04-rod_holder_section.png)

## Labels and printing

Every compartment has a card label pocket. The front row is labelled on the front face, and the back row on the side it touches. Cards drop in from the top, so changing a label means writing a new slip of card rather than reprinting the holder.

![Top of the holder showing the rounded edges, the two front card pockets, a side card pocket and the top of the diamond lattice]({static}/images/Engineering/OpenGridRodHolder/05-rod_holder_detail.png)

The holder prints front face down with the snaps pointing up. Every diamond edge runs at 45 degrees, so the part needs no supports and no bridges across the windows.

![The holder laid front face down for printing, with the two openGrid snaps on the upper face]({static}/images/Engineering/OpenGridRodHolder/06-rod_holder_print.png)

## Not yet printed

I have not printed this version yet. Two things still need testing: whether the 0.5 mm rod stays in its compartment, and whether a 168 mm part with this many windows is stiff enough. Print a single openGrid snap first and check the fit on your board before committing to the full part.

## Files and parts

- Model: [Openscad_rod_holder](https://github.com/morganp/Openscad_rod_holder), MIT licence, every dimension parametric
- openGrid snap geometry: [openscad-opengrid](https://github.com/morganp/openscad-opengrid)
- Hinges that use the pins: [OpenSCAD_hinge](https://github.com/morganp/OpenSCAD_hinge)
- openGrid by David D, CC BY 4.0: [openGrid on Printables](https://www.printables.com/model/1214361-opengrid-walldesk-mounting-framework-and-ecosystem)

The steel rod, sold in 300 mm lengths:

- <a href="https://www.amazon.co.uk/dp/B0GHY3PFYC?tag=morgan07e-21" rel="sponsored nofollow noopener">0.5 mm steel rod on Amazon</a>
- <a href="https://www.amazon.co.uk/dp/B0GHXMZJH4?tag=morgan07e-21" rel="sponsored nofollow noopener">0.8 mm steel rod on Amazon</a>
- <a href="https://www.amazon.co.uk/dp/B0GHXHVHG7?tag=morgan07e-21" rel="sponsored nofollow noopener">1.0 mm steel rod on Amazon</a>

*As an Amazon Associate I earn from qualifying purchases.*
