Title: Supports that peel off: a Bambu Studio profile that stops fighting back
Date: 2026-08-30
Category: Engineering
Tags: 3D Print, Bambu Lab, Slicer, Supports, OrcaSlicer
Slug: bambu-easy-remove-support-settings
Author: morganp
Summary: The nine Bambu Studio support settings I change from stock for a 0.4mm nozzle at 0.16mm layer height, and why each one matters when you are trying to get supports off without damaging the part.
Status: published

The print finished four hours ago and it is still in the vice. One pair of pliers has already slipped and put a bright crescent scar across the face of the part. The support block is not coming off in one piece, it is coming off in flakes, and every flake takes a little of the model surface with it.

Nothing went wrong. The slicer did exactly what it was told. The problem is that the default support profile is tuned to hold overhangs up reliably, and holding up reliably and letting go cleanly are opposite requirements.

This post is the profile I have settled on in Bambu Studio, printing PLA on an A1 Mini, and the reasoning behind each value. The settings map straight across to OrcaSlicer, which shares the same support engine. It started from a handful of Reddit threads and then a few months of adjusting one number at a time.

Nine settings differ from the stock profile. Everything else Bambu ships is already right, so it is not listed here: if a setting is absent below, leave it alone. The nine are given in the order Bambu Studio presents them, so you can work down the panel rather than hunting.

Unless a setting says otherwise, every value is for a 0.4mm nozzle at 0.16mm layer height. Only one of the nine moves with layer height, and it has its own table.

## What actually holds a support onto the model

It is tempting to think of support removal as a strength problem, as though the support is glued on and you need enough force to break the glue. That is not what is happening.

A support touches the model in exactly two places. The top of the support column meets the underside of the overhang, and the bottom of the support column meets whatever it is standing on. Everywhere else it is standing in open air. All the effort of removal goes into those two interfaces, and both of them are governed by a gap you set in the slicer.

If that gap is zero, the interface extrusion is laid onto solid plastic that is still warm. It welds. No amount of care with the pliers will separate a weld, so you end up tearing the model surface instead of the support.

If the gap is too large, the interface has nothing under it, sags into the void, and the overhang above prints onto a wavy surface. The support is easy to remove because it barely worked.

Everything below is about landing between those two failures, and about reducing how much support gets generated in the first place.

## Support

**Enable support: on.** Stock leaves it off, which is the right default and the
reason this list starts here.

**Style: Tree Slim.** The type is already tree (auto) at stock, so only the
style changes. Tree supports touch the model at discrete points rather than
under the entire projected footprint, and less contact area is less to break.
Tree Slim keeps the branches thin instead of thickening them into the
plate-filling structures Tree Strong produces.

One caveat that costs nothing to avoid. Bambu Studio has an
[open bug](https://github.com/bambulab/BambuStudio/issues/10553) where tree
support ignores a threshold angle below 20 degrees and supports everything at
70 degrees and above instead. The stock threshold is 25 at this layer height so
the profile never touches it, but the stock value falls to 20 at 0.12mm and 15
at 0.08mm. If you take this profile to a finer layer height, hold the threshold
at 20 or above, or accept far more support than you asked for.

**On build plate only: on.** Supports that land on the model leave the worst
marks, because you are prying against a surface rather than against the plate.
Turning this on means anything needing a support that stands on the model gets
no support at all, so it is a constraint on how you orient the part rather than
a free improvement.

**Support critical regions only: on.** Prunes the generated support down to the
places that genuinely fail without it. Small isolated overhangs bridge fine and
do not justify a branch.

## Advanced

**Support wall loops: 0.** A wall loop puts a continuous perimeter around the
support body, which turns a stack of loose infill lines into a rigid tube.
Rigid is exactly what you do not want. The setting runs from -1 to 2, where -1
is the stock auto and 0 permits infill-only support wherever the body is thick
enough to stand without a wall. That covers most tree branches, so the result
is a support you can crumble under a thumb.

**Top Z distance: 0.25mm.** The air gap between the top of the support and the
underside of the model, and the number that decides whether removal is a
fingernail job or a pliers job. Stock is 0.16mm here, one whole layer, which
welds. This is the one setting that moves with layer height, so it gets its own
section below.

**Base pattern: Hollow.** A sparse support body, again in the service of
weakness.

## Interface and XY clearance

**Top interface spacing: 0.8mm.** This is the one that surprised me. A solid
interface, which is what stock 0.5mm approaches, is a near-continuous sheet
directly under the overhang. It gives the best surface finish and it is the
hardest thing in the world to remove. At 0.8mm with a 0.4mm nozzle the
interface lines are laid down with roughly a line width of air between them, so
the contact with the model above is a series of ridges rather than a plane.
Surface finish drops slightly. Removal changes character completely, because
there is now somewhere for the break to start.

**Support/object XY distance: 0.65mm.** The horizontal clearance where a
support runs alongside a vertical wall. Too small and the support fuses to the
side of the part. Stock is 0.35mm and most published advice sits at 0.35 to
0.40, so 0.65 is deliberately generous: it trades a little wasted space beside
the part for a support that never touches a wall it was not meant to touch. If
your parts have narrow slots that supports need to reach into, come back down
towards 0.4.

## The one that moves with layer height

Top Z distance is the only value here that depends on how thick your layers
are. Bambu's own stock value tracks the layer height exactly until it caps:

| Layer height | 0.08 | 0.12 | 0.16 | 0.20 | 0.24 | 0.28 |
|---|---|---|---|---|---|---|
| Top Z, stock | 0.08 | 0.12 | 0.16 | 0.20 | 0.20 | 0.20 |
| Top Z, this profile | 0.17 | 0.21 | 0.25 | 0.29 | 0.29 | 0.29 |

The rule is stock plus about 0.09mm. Stock is one layer, which welds, and
roughly a tenth of a millimetre more lifts the interface clear without letting
the overhang sag into the gap. Only the 0.16mm column has been print tested;
the rest follow the rule, so treat them as a starting point. The three coarse
heights land on the same number because Bambu caps its own top Z at 0.20mm from
0.20mm upward.

## Why a value between two layers is available at all

0.25mm is not a multiple of 0.16mm, and that is the point.

If the support were printed on the model's layer grid, the air gap could only
ever be a whole number of layers. At 0.16mm the choices would be 0.16mm, which
welds, or 0.32mm, which sags. The value you actually want sits between the two
and would be unreachable. That is why so much support tuning advice ends in
"try one layer, then try two" and why neither ever quite works.

Independent support layer height is what removes the constraint, and Bambu
turns it on by default, so it is not on the list above. It lets the support use
its own layer heights and stop wherever it needs to in order to leave the gap
you asked for. The gap becomes a real dimension in millimetres rather than a
rounded multiple.

Worth knowing because it is easy to lose: the option is ignored when the prime
tower is enabled. Turn on a multi-colour print and the supports go back on the
model's layer grid, which puts you back to choosing between 0.16mm and 0.32mm.

## The nine, in one place

<div class="support-values">
<style>
.support-values table { border-collapse: collapse; width: 100%; margin: 1.2em 0; }
.support-values th, .support-values td { padding: 0.4em 0.9em; text-align: left; border: none; }
.support-values thead th { border-bottom: 2px solid #2D2D2D; font-weight: 600; }
.support-values td:not(:first-child) { font-variant-numeric: tabular-nums; white-space: nowrap; }
.support-values tbody tr:nth-child(3n+1) { background: #FFFFFF; }
.support-values tbody tr:nth-child(3n+2) { background: #F5F2EC; }
.support-values tbody tr:nth-child(3n+3) { background: #EAE3D5; }
.support-values td.was { color: #4A4A4A; }
.support-values td.now { color: #7B35C2; font-weight: 600; }
</style>
<table>
  <thead><tr><th>Setting</th><th>Stock</th><th>This profile</th></tr></thead>
  <tbody>
  <tr><td>Enable support</td><td class="was">off</td><td class="now">on</td></tr>
  <tr><td>Style</td><td class="was">Default</td><td class="now">Tree Slim</td></tr>
  <tr><td>On build plate only</td><td class="was">off</td><td class="now">on</td></tr>
  <tr><td>Support critical regions only</td><td class="was">off</td><td class="now">on</td></tr>
  <tr><td>Support wall loops</td><td class="was">-1 (auto)</td><td class="now">0</td></tr>
  <tr><td>Top Z distance</td><td class="was">0.16mm</td><td class="now">0.25mm</td></tr>
  <tr><td>Base pattern</td><td class="was">Default</td><td class="now">Hollow</td></tr>
  <tr><td>Top interface spacing</td><td class="was">0.5mm</td><td class="now">0.8mm</td></tr>
  <tr><td>Support/object XY distance</td><td class="was">0.35mm</td><td class="now">0.65mm</td></tr>
  </tbody>
</table>
</div>

Stock values are for the 0.16mm Optimal profile on an A1 mini with a 0.4mm
nozzle. Anything not in this table is left exactly as Bambu ships it.

## A part to test it on

Tuning a gap by 0.01mm at a time needs something small to tune it against, and
a real part is the wrong thing to use: it takes hours and it only has the
overhangs it happens to have.

[Download the test coupon (3mf)]({static}/models/support-peel-test.3mf), or the
[OpenSCAD source]({static}/models/support-peel-test.scad) if you want to change
the dimensions.

It is an inverted L, 32 by 14 by 22mm, and it prints in under half an hour:

- The arm cantilevers 22mm with nothing under it, so the slicer has to support
  308mm² of flat ceiling from the plate. That underside is the surface to look
  at once the support is off.
- The post beside the support column puts a vertical wall right next to the
  support, which is where an XY distance that is too small shows up as fusing.
- At 18mm the column is tall enough to get a fingernail under, which is the
  whole thing you are testing.

The coupon has a `label` parameter in the source. Set it to the value under
test, print one per candidate, and a row of them stays readable a week later.
The 3mf carries geometry only, so apply your own profile to it after opening.

## If you change one thing

Change the top Z distance, and change it by 0.01mm at a time.

Every other value on that list shifts the result a little. That one decides whether the support comes off in your hand or comes off with a scalpel, and the useful range on a 0.4mm nozzle is narrow enough that 0.24mm and 0.26mm are genuinely different prints. Get it right for your filament, then leave the rest alone.
