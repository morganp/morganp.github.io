Title: Printer dimensional accuracy: the hole is small and the base is wide
Date: 2026-08-30
Category: Engineering
Tags: 3D Print, Bambu Lab, Slicer, Tolerances, OrcaSlicer
Slug: printer-dimensional-accuracy
Author: morganp
Summary: Elephant foot compensation and X-Y hole compensation in Bambu Studio, why a printed hole finishes under its nominal diameter, and a gauge coupon that gives you your own numbers.
Status: draft

The M3 bolt will not go through the 3mm clearance hole. The bracket rocks on the bench, and a feeler gauge finds daylight under one corner. The CAD model measures 3.000mm and the bench block is flat, so both faults belong to the printer.

Two slicer settings correct them, and on an A1 Mini both ship switched off. This is Bambu Studio with a 0.4mm nozzle in PLA, and every setting maps straight across to OrcaSlicer.

[![Cross section of a first layer spreading wider than the layers above it, and a hole whose toolpath chords fall inside the nominal circle]({attach}/images/Engineering/PrinterDimensionalAccuracy/01-two-errors-900w.png)]({attach}/images/Engineering/PrinterDimensionalAccuracy/01-two-errors-HQ.png)

## The settings

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
  <thead><tr><th>Setting</th><th>Where</th><th>Stock, A1 Mini</th><th>Starting value</th></tr></thead>
  <tbody>
  <tr><td>Elefant foot compensation</td><td>Quality</td><td class="was">0</td><td class="now">0.15mm</td></tr>
  <tr><td>Initial layer height</td><td>Quality</td><td class="was">0.2mm</td><td class="now">0.2mm, or 0.16</td></tr>
  <tr><td>X-Y hole compensation</td><td>Quality, Precision</td><td class="was">0</td><td class="now">0.05mm</td></tr>
  <tr><td>X-Y contour compensation</td><td>Quality, Precision</td><td class="was">0</td><td class="now">-0.05mm</td></tr>
  <tr><td>Bed temperature, other layers</td><td>Filament</td><td class="was">65C textured</td><td class="now">60C</td></tr>
  </tbody>
</table>
</div>

Bambu spells it Elefant. Stock values come from the 0.16mm Optimal profile as
shipped; P1 and X1 profiles inherit 0.15mm elephant foot compensation, while
every A1 Mini profile overrides it to zero. The compensations are starting
points, and the gauge print at the end replaces them with yours.

## Why the base spreads

The nozzle lays the first layer with the tip roughly one layer height above a
plate held at 60 to 65C. Molten plastic under pressure with nowhere upward to
go moves sideways, so the base finishes 0.1 to 0.3mm wider than the wall above
it on each side. A printed peg then jams in its socket, and a part that should
sit flat sits on a rim.

The spread runs inward as well as outward. A hole in the first layer loses the
same tenth of a millimetre the outside gains, so a pin that slides down a hole
stops dead on the bottom layer, and a bolt that should pass through a plate
catches on its last 0.2mm. The hole measures correctly everywhere you can reach
with a gauge, and still refuses the bolt.

Elephant foot compensation fixes both directions at once, and touches no layer
but the first. It shrinks the solid area of that layer by the value you set, so
the outside wall comes in and every hole wall goes out. Set it too high and bed
contact drops, so adhesion suffers and a visible step appears at the base.

On an A1 Mini this is the setting doing nothing, because every stock A1 Mini
profile ships it at zero while the P1 and X1 profiles inherit 0.15mm. A pin
that will not pass the bottom layer of a printed hole is that zero, seen from
the inside.

Initial layer height trades one error against another. The stock 0.2mm absorbs
levelling error across the plate, and a thicker layer spreads further. Drop it
to 0.16mm once your plate is trustworthy and the spread falls with it.

One trap sits behind both. If the bulge runs up five or six layers rather than
one, that is bed heat softening the base, and compensation cannot reach it.
Drop the bed temperature for layers above the first, 60C rather than 65C on the
textured plate for PLA.

## Why holes come out small

Three effects stack, all of them on the inside of a curve.

The toolpath approximates the circle with straight segments, and every chord
falls inside the true arc. The extrusion sits on a concave path, so the bead
crowds toward the centre rather than spreading evenly. Flow lags where the head
slows for curvature, and thin walls between features hold heat, so the plastic
stays soft and creeps inward.

Each contributes a roughly fixed error in millimetres. A 10mm hole loses a
percent or two and nobody notices. A 3mm hole loses the same absolute amount
and the bolt no longer fits.

X-Y hole compensation offsets hole perimeters outward by the value you set.
It moves the wall, so measured diameter changes by about twice the value.
X-Y contour compensation does the same for outside walls, and takes a negative
value, since an outside curve gains material for the same reason a hole loses
it.

## Bambu already measured this

Under Quality sits **Auto circle contour-hole compensation**, and it does per
filament and per diameter what the two manual settings do with one blunt
number. Every Bambu filament profile carries a fitted curve for circle error.
Bambu PLA Basic on an A1 Mini ships these:

| Coefficient | Hole | Outside contour |
|---|---|---|
| coef_1 | 0 | 0 |
| coef_2 | -0.008 | 0.008 |
| coef_3 | 0.23415 | -0.041 |
| Clamped between | 0.088 and 0.22 | -0.035 and 0.033 |

The compensation is a polynomial in the diameter of the circle, clamped to
those limits, and applied to circles up to 50mm. Evaluating the hole curve
gives 0.21 on a 3mm hole, 0.20 at 4mm, 0.15 at 10mm, and the 0.088 floor from
about 18mm upward. That is the error described above, measured and fitted: bad
on small holes, tapering as the circle grows. The contour curve is far smaller
and changes sign, which matches outside curves being much less wrong than
holes.

It is off by default, and not one shipped process profile turns it on. Four
reasons, in order of weight:

- The curve is filament specific, and only Bambu's own filaments carry one.
  A third-party spool inherits whatever generic profile you cloned from.
- It only corrects circles the slicer recognises as circles, up to 50mm.
  A slot, an oval or an arbitrary curve gets nothing.
- It changes how those loops print, with their own speed setting and their own
  seam handling.
- Enabling it for everyone would silently change the fit of every model already
  tuned against uncompensated printers, print-in-place assemblies most of all.

Do not run it alongside the manual settings. They stack, and on a 4mm hole the
pair would open the hole by about 0.25mm. Use one or the other.

## Fix it in the slicer, not the model

Growing the hole in CAD works once. The same model then prints oversize on a
machine that is already compensated, prints differently again at another layer
height, and carries an unexplained 3.2mm dimension for anyone who opens it in
two years.

Compensation belongs to the machine, so it lives in the machine's profile. The
model keeps the dimension the part actually needs.

The exception is clearance that a fit genuinely requires. An M3 bolt through a
bracket wants 3.4mm modelled, because the design intends a loose fit, not
because the printer misses.

## The gauge print

[Download the gauge coupon (3mf)]({static}/models/dimensional-accuracy-gauge.3mf), or the
[OpenSCAD source]({static}/models/dimensional-accuracy-gauge.scad) to change the
dimensions.

It is a 64 by 28 by 8mm block with through holes at 3, 4, 5, 6, 8 and 10mm, and
a 10mm boss standing on the top face. The boss gives an outside curve that
never touches the plate, so it measures the curve error alone.

1. Print the coupon at the layer height and filament you use most, with all
   four compensations at zero.
2. Measure the block across its length at the base, then again just under the
   top face. The difference is the elephant foot spread. Set elephant foot
   compensation to that difference.
3. Measure each hole. Take the shortfall on the mid range holes, halve it, and
   set X-Y hole compensation to the result.
4. Measure the boss. Take the excess, halve it, and set X-Y contour
   compensation to minus that value.
5. Reprint and confirm. Two rounds usually lands it.

Measure holes above the first few layers, and take two readings across each
hole at ninety degrees, since a hole out of round averages badly.

## The fit print

Calipers tell you the error. A bolt tells you whether it matters.

[Download the fit coupon (3mf)]({static}/models/hole-fit-test.3mf), or the
[OpenSCAD source]({static}/models/hole-fit-test.scad).

It is 49 by 23 by 6mm and prints in about twelve minutes. Six labelled holes
cover the sizes where the error bites, and a 6mm pin stands on the top face so
one coupon tests the outside curve as well.

| Hole | What goes in it |
|---|---|
| 2.4mm | M2 clearance |
| 3.0mm | 3mm pin |
| 3.4mm | M3 clearance, the fit that fails most |
| 4.5mm | M4 clearance |
| 5.0mm | 5mm pin or magnet post |
| 6.0mm | 6mm rod, and the printed pin from the other coupon |

Print it twice, once on each column below, and try the same hardware in both.

| Setting | Before | After |
|---|---|---|
| X-Y hole compensation | 0 | 0.05mm |
| X-Y contour compensation | 0 | -0.05mm |
| Elefant foot compensation | preset, 0 on an A1 Mini | 0.15mm |

The after print should take an M3 bolt with a little play where the before
print jams. If the holes now feel sloppy, drop hole compensation to 0.03. If
the bolt still binds, go to 0.08.

## The ladder, if you have no calipers

Caliper inside jaws are poor below about 4mm, which is exactly where the error
matters. The ladder replaces the awkward measurement with a fit.

[Download the ladder gauge (3mf)]({static}/models/hole-ladder-gauge.3mf), or the
[OpenSCAD source]({static}/models/hole-ladder-gauge.scad).

One card of thirteen holes, 3.70 to 4.30 in 0.05mm steps, each engraved with
its size, and one 4.00mm pin on the same plate. The pin stands on a foot, so
the squashed first layer stays in the foot and the shaft prints at full
diameter. Every hole has a 0.6mm lead-in cone underneath for the same reason.
Without it the pin meets the narrowed first layer of the card and stops there,
and the card measures elephant foot instead of hole error.

A 4.00 pin will never enter a 4.00 hole. Two identical diameters interfere, and
a sliding fit in PLA at this size wants about 0.05mm of air. The target is the
pin entering at **4.05**, one step up. Anything higher is error you can correct.

1. Print the card and pin together, compensations at zero.
2. Measure the pin shaft across the outside jaws, up near the top and away from
   the foot. Calipers are accurate on a 4mm outside dimension. Anything over
   4.00 is the contour error, so set X-Y contour compensation to minus half of
   it.
3. Find the smallest hole the pin enters. Take that label, subtract the
   measured pin diameter, then subtract the 0.05 a sliding fit needs. What is
   left is the hole error, so set X-Y hole compensation to half of it.
4. Reprint and confirm the pin now enters at 4.05.

A worked example. The pin measures 4.06 and first enters the 4.20 hole. The
contour error is 0.06, so contour compensation is -0.03. The hole gap is
4.20 - 4.06 = 0.14, of which 0.05 is the clearance you always need, leaving
0.09 of error, so hole compensation is 0.045. Round to 0.05 and reprint.

A pin that already enters at 4.05 needs no hole compensation at all. Check the
first layer before concluding anything, though: a hole that accepts the pin
down to its last 0.2mm and then stops is not a hole error.

## What to check first

Do elephant foot before holes. A bulged base widens every measurement taken
near the plate, so hole numbers derived first are measuring two faults at once
and correcting neither.
