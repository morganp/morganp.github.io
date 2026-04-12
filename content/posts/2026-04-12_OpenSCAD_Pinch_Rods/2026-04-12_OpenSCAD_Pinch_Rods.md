Title: 3D Printed Pinch Rods in OpenSCAD
Date: 2026-04-12
Category: Home & Garden
Tags: OpenSCAD, 3D Printing, BOSL2, Woodworking, CAD, Parametric Design
Slug: openscad-pinch-rods
Author: morganp
Summary: Designing a parametric set of pinch rods in OpenSCAD using the BOSL2 library. Pinch rods are a traditional woodworking tool for checking carcases for square and transferring interior dimensions without measuring.
Status: published

[![Assembled pinch rods]({attach}/images/OpenSCAD/PinchRods/assembled-900w.png)]({attach}/images/OpenSCAD/PinchRods/assembled-HQ.png)

## What are Pinch Rods?

Pinch rods are a traditional woodworking measuring tool that predate the tape measure as the reliable way to check whether a box, cabinet, or carcase is square. The concept is simple: two flat rods with pointed ends overlap and slide through a pair of guide blocks. You nestle the tips into opposite diagonal corners of an assembly, lock the rods in place, then check the other diagonal. If both diagonals match, the assembly is square.

The beauty of pinch rods over a tape measure is that you never read a number. The rods physically span the diagonal, and you use that same span directly on the other diagonal. Any discrepancy is immediately obvious as a gap or an overrun at one tip.

They have a second use too: transferring interior dimensions. Set the rods to fit snugly inside a space, lock them, carry the tool to your workpiece, and mark directly. No arithmetic, no misread ruler.

[![Side profile showing both guides and the two overlapping rods]({attach}/images/OpenSCAD/PinchRods/assembled_side-900w.png)]({attach}/images/OpenSCAD/PinchRods/assembled_side-HQ.png)

Lost Art Press have documented pinch rods across several articles spanning 2013 to 2025, from a home-centre build using steel tube sleeves and heart pine, through to the machined brass Crucible Tool hardware and a new all-metal prototype using 1/4" keystock. The design has been remarkably stable across all those years -- two rods, two guides, one thumbscrew.

## The OpenSCAD Design

A parametrised OpenSCAD model. The guides with or without the rods can be 3D printed. The full source is on GitHub at [morganp/OpenSCAD_PinchRods](https://github.com/morganp/OpenSCAD_PinchRods).

The model parameters:

```openscad
STOCK_THICKNESS = 19/2;  // height of ONE rod -- two stack to fill the opening
STOCK_WIDTH     = 19;    // width of each rod
WALL_THICKNESS  = 5;     // guide wall thickness
GUIDE_LENGTH    = 40;    // depth of each guide block
```

The two rods are 19mm wide and 9.5mm tall each. They sit one on top of the other inside both guide blocks, so the guide opening is 19mm x 19mm total.

### Display Mode

A `MODE` variable at the top switches between a full assembly preview and single-part export for printing:

```openscad
MODE = "assembled";   // or "print"
PRINT_PART = "guide2"; // "fastener" | "guide1" | "guide2"
```

## The Two Guides

The guides are intentionally different. Each one locks a different rod, so you can set one end, then adjust the other independently.

**Guide 1** is mounted inverted in the assembly. Flipping it 180 degrees around the X axis keeps the rod opening in exactly the same position (the opening is symmetric around the centreline at Z = 14.5mm), but moves the countersunk screw hole from the bottom to the top. A screw through that top hole locks onto the top rod.

**Guide 2** has a cylindrical standoff boss on top with an M5 threaded hole. A clamping membrane -- a thin slab just inside the opening -- transmits force from the thumbscrew down onto the bottom rod when the knob is tightened. BOSL2's `screw_hole()` cuts the threaded recess into the standoff, and `screw()` with `anchor=BOTTOM` generates the matching fastener.

| Guide 1 -- inverted, screw hole on top | Guide 2 -- M5 thumbscrew knob |
|---|---|
| [![Guide 1]({attach}/images/OpenSCAD/PinchRods/guide1_detail-900w.png)]({attach}/images/OpenSCAD/PinchRods/guide1_detail-HQ.png) | [![Guide 2]({attach}/images/OpenSCAD/PinchRods/guide2_detail-900w.png)]({attach}/images/OpenSCAD/PinchRods/guide2_detail-HQ.png) |

## Tapered Tips

Each rod has a 45-degree chisel taper at one end. Both tapers point toward the shared centreline between the two stacked rods, so from the side the two tips form a symmetric arrowhead shape pointing at the Z midpoint.

[![Tapered rod tips exiting guide 1]({attach}/images/OpenSCAD/PinchRods/tips_detail-900w.png)]({attach}/images/OpenSCAD/PinchRods/tips_detail-HQ.png)

The taper is generated using `hull()` between a knife-edge line at the tip and a full rectangular cross-section a little further along. At 45 degrees the horizontal run equals the vertical rise, so the taper length is exactly `STOCK_THICKNESS` (9.5mm). The two rods have their tapers on opposite ends of the assembly so each tip engages a different corner of the workpiece.

## Printable Parts

Three parts are printed separately. For 3mf export, set `MODE = "print"` and select the part with `PRINT_PART`. Note that Guide 1 is printed in its natural orientation (flat bottom on the bed) and then flipped over when assembled.

| Guide 1 | Guide 2 | Thumbscrew |
|---|---|---|
| [![Guide 1 part]({attach}/images/OpenSCAD/PinchRods/part_guide1-900w.png)]({attach}/images/OpenSCAD/PinchRods/part_guide1-HQ.png) | [![Guide 2 part]({attach}/images/OpenSCAD/PinchRods/part_guide2-900w.png)]({attach}/images/OpenSCAD/PinchRods/part_guide2-HQ.png) | [![Fastener part]({attach}/images/OpenSCAD/PinchRods/part_fastener-900w.png)]({attach}/images/OpenSCAD/PinchRods/part_fastener-HQ.png) |

## Dependencies

The SCAD file requires two OpenSCAD libraries in your libraries folder:

- [BOSL2](https://github.com/BelfrySCAD/BOSL2) -- parametric screws, threads, and screw holes
- [parametric-knob-maker](https://github.com/TemptorSent/parametric-knob-maker) -- the thumbscrew knob profile

The source is on GitHub at [morganp/OpenSCAD_PinchRods](https://github.com/morganp/OpenSCAD_PinchRods).
