Title: Supports that peel off: a Bambu Studio profile that stops fighting back
Date: 2026-08-30
Category: Engineering
Tags: 3D Print, Bambu Lab, Slicer, Supports, OrcaSlicer
Slug: bambu-easy-remove-support-settings
Author: morganp
Summary: The nine Bambu Studio support settings I change from stock for a 0.4mm nozzle at 0.16mm layer height, and why each one matters when you are trying to get supports off without damaging the part.
Status: published

The print finished four hours ago and it is still in the vice. One pair of pliers has already slipped and put a bright crescent scar across the face of the part. The support block is coming off in flakes, and every flake takes a little of the model surface with it.

Nothing went wrong. The stock support profile is tuned to hold overhangs up reliably, and holding up reliably and letting go cleanly are opposite requirements.

Below is the profile I have settled on in Bambu Studio, printing PLA on an A1 Mini with a 0.4mm nozzle at 0.16mm layer height. The settings map straight across to OrcaSlicer, which shares the same support engine.

## The 0.16mm profile

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
  <thead><tr><th>Setting</th><th>Panel</th><th>Stock</th><th>This profile</th></tr></thead>
  <tbody>
  <tr><td>Enable support</td><td>Support</td><td class="was">off</td><td class="now">on</td></tr>
  <tr><td>Style</td><td>Support</td><td class="was">Default</td><td class="now">Tree Slim</td></tr>
  <tr><td>On build plate only</td><td>Support</td><td class="was">off</td><td class="now">on</td></tr>
  <tr><td>Support critical regions only</td><td>Support</td><td class="was">off</td><td class="now">on</td></tr>
  <tr><td>Support wall loops</td><td>Advanced</td><td class="was">-1 (auto)</td><td class="now">0</td></tr>
  <tr><td>Top Z distance</td><td>Advanced</td><td class="was">0.16mm</td><td class="now">0.25mm</td></tr>
  <tr><td>Base pattern</td><td>Advanced</td><td class="was">Default</td><td class="now">Hollow</td></tr>
  <tr><td>Top interface spacing</td><td>Interface</td><td class="was">0.5mm</td><td class="now">0.8mm</td></tr>
  <tr><td>Support/object XY distance</td><td>Interface</td><td class="was">0.35mm</td><td class="now">0.65mm</td></tr>
  </tbody>
</table>
</div>

Stock values are for the 0.16mm Optimal profile. Any setting absent from the
table is left exactly as Bambu ships it.

## Top Z distance by layer height

Top Z distance is the only value here that depends on layer height. Bambu's own
stock value tracks the layer height until it caps at 0.20mm:

| Layer height | 0.08 | 0.12 | 0.16 | 0.20 | 0.24 | 0.28 |
|---|---|---|---|---|---|---|
| Top Z, stock | 0.08 | 0.12 | 0.16 | 0.20 | 0.20 | 0.20 |
| Top Z, this profile | 0.17 | 0.21 | 0.25 | 0.29 | 0.29 | 0.29 |

The rule is stock plus about 0.09mm. Only the 0.16mm column has been print
tested, so treat the rest as a starting point.

## Why the gap is the whole game

A support touches the model in two places: the top of the column against the
underside of the overhang, and the bottom of the column against whatever it
stands on. Everywhere else it stands in open air. All the effort of removal
goes into those two interfaces, and a gap you set in the slicer governs both.

At a gap of zero the interface extrusion lands on solid plastic that is still
warm, and it welds. Pliers cannot separate a weld, so the model surface tears
instead of the support.

At too large a gap the interface has nothing under it, sags into the void, and
the overhang above prints onto a wavy surface. Removal is easy because the
support barely worked.

Every value below lands between those two failures, or reduces how much support
gets generated at all.

## What each setting does

**Enable support: on.** Stock leaves it off, and the rest of the list only
matters once it is on.

**Style: Tree Slim.** The type is already tree (auto) at stock, so only the
style changes. Tree supports touch the model at discrete points rather than
under the whole projected footprint, and less contact area is less to break.
Tree Slim keeps the branches thin instead of thickening them into the
plate-filling structures Tree Strong produces. One caveat: Bambu Studio has an
[open bug](https://github.com/bambulab/BambuStudio/issues/10553) where tree
support ignores a threshold angle below 20 degrees and supports everything at
70 degrees and above instead. Stock threshold is 25 at 0.16mm so this profile
never touches it, but stock falls to 20 at 0.12mm and 15 at 0.08mm. At finer
layer heights, hold the threshold at 20 or above.

**On build plate only: on.** Supports landing on the model leave the worst
marks, because you pry against a printed surface rather than against the plate.
Anything that would need a support standing on the model now gets none, so this
is a constraint on how you orient the part.

**Support critical regions only: on.** Prunes support down to the places that
genuinely fail without it. Small isolated overhangs bridge fine.

**Support wall loops: 0.** A wall loop wraps the support body in a continuous
perimeter, turning loose infill lines into a rigid tube. The setting runs from
-1 to 2, where -1 is the stock auto and 0 permits infill-only support wherever
the body stands without a wall. That covers most tree branches, so the support
crumbles under a thumb.

**Top Z distance: 0.25mm.** The air gap under the model, and the number that
decides between a fingernail job and a pliers job. Stock 0.16mm is one whole
layer, which welds. See the table above for other layer heights.

**Base pattern: Hollow.** A sparse support body, again in the service of
weakness.

**Top interface spacing: 0.8mm.** The surprise of the set. Stock 0.5mm
approaches a solid sheet directly under the overhang: best surface finish,
hardest thing in the world to remove. At 0.8mm with a 0.4mm nozzle the
interface lines sit roughly a line width apart, so contact with the model above
is a series of ridges rather than a plane. Surface finish drops slightly.
Removal changes character completely, because the break now has somewhere to
start.

**Support/object XY distance: 0.65mm.** Horizontal clearance where a support
runs alongside a vertical wall. Too small and the support fuses to the side of
the part. Stock is 0.35mm and most published advice sits at 0.35 to 0.40, so
0.65 is deliberately generous. If your parts have narrow slots that supports
must reach into, come back down towards 0.4.

## Why 0.25mm is available at all

0.25mm is not a multiple of 0.16mm, and that is the point.

A support printed on the model's layer grid can only leave an air gap of a
whole number of layers. At 0.16mm the choices are 0.16mm, which welds, or
0.32mm, which sags. The value you want sits between them and stays
unreachable. Hence all the tuning advice that ends in "try one layer, then try
two", and why neither ever quite works.

Independent support layer height removes the constraint, and Bambu turns it on
by default, so it is not on the list above. The support uses its own layer
heights and stops wherever it needs to in order to leave the gap you asked for.
The gap becomes a real dimension in millimetres.

The option is ignored when the prime tower is enabled. Turn on a multi-colour
print and the supports go back on the model's layer grid, which puts you back
to choosing between 0.16mm and 0.32mm.

## A part to test it on

Tuning a gap 0.01mm at a time needs something small to tune against. A real
part takes hours and only has the overhangs it happens to have.

[Download the test coupon (3mf)]({static}/models/support-peel-test.3mf), or the
[OpenSCAD source]({static}/models/support-peel-test.scad) to change the
dimensions.

It is an inverted L, 32 by 14 by 22mm, printing in under half an hour:

- The arm cantilevers 22mm over nothing, so the slicer supports 308mm² of flat
  ceiling from the plate. That underside is the surface to inspect.
- The post beside the support column puts a vertical wall next to the support,
  where too small an XY distance shows up as fusing.
- At 18mm the column is tall enough to get a fingernail under.

The coupon has a `label` parameter in the source. Set it to the value under
test, print one per candidate, and a row of them stays readable a week later.
The 3mf carries geometry only, so apply your own profile after opening.

## If you change one thing

Change the top Z distance, and change it by 0.01mm at a time.

Every other value shifts the result a little. That one decides whether the
support comes off in your hand or comes off with a scalpel, and on a 0.4mm
nozzle 0.24mm and 0.26mm are genuinely different prints. Get it right for your
filament, then leave the rest alone.
