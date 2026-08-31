Title: Printer dimensional accuracy: the hole is small and the base is wide
Date: 2026-08-30
Category: Engineering
Tags: 3D Print, Bambu Lab, Slicer, Tolerances, OrcaSlicer
Slug: printer-dimensional-accuracy
Author: morganp
Summary: Why a printed hole finishes under its nominal diameter, the Bambu Studio settings that correct it, and the curve Bambu already fitted for you and left switched off.
Status: draft

The M3 bolt will not go through the 3mm clearance hole. The bracket rocks on the bench. The CAD measures 3.000mm and the bench is flat, so both faults belong to the printer, and both have a setting.

[![Cross section of a first layer spreading wider than the layers above it, and a hole whose toolpath chords fall inside the nominal circle]({attach}/images/Engineering/PrinterDimensionalAccuracy/01-two-errors-900w.png)]({attach}/images/Engineering/PrinterDimensionalAccuracy/01-two-errors-HQ.png)

## The base spreads

Nozzle pressure against a hot plate pushes the first layer sideways, so the
base finishes 0.1 to 0.3mm wider than the wall above it. The same displacement
runs inward at a hole, which is why a pin slides down a hole and stops on the
bottom layer.

`Elefant foot compensation` fixes both directions at once. It shrinks the solid
area of the first layer, so the outside comes in and every hole wall goes out,
and it touches no other layer. Every stock A1 Mini profile ships it at **zero**,
while P1 and X1 profiles inherit 0.15mm.

If the bulge runs up five layers rather than one, that is bed heat rather than
squash, and no compensation reaches it. Drop the plate to 60C after the first
layer.

## Holes come out small

Three effects stack on the inside of a curve: the toolpath chords fall inside
the true arc, extrusion on a concave path crowds toward the centre, and flow
lags where the head slows. Each contributes a roughly fixed error in
millimetres, so a 10mm hole loses a percent and a 3mm hole loses the bolt.

`X-Y hole compensation` offsets hole walls outward, `X-Y contour compensation`
does the same for outside walls and takes a negative value. Both ship at zero.

## Bambu already measured this

`Auto circle contour-hole compensation` does the same job per filament and per
diameter. Every Bambu filament profile carries a fitted curve. Bambu PLA Basic
on an A1 Mini compensates a hole by 0.21mm at 3mm diameter, 0.20 at 4mm, 0.15
at 10mm, and a 0.088 floor beyond about 18mm. That is the error above, measured
and fitted.

It is off by default, and no shipped process profile turns it on. The curve
only exists for Bambu's own filaments, it only corrects circles the slicer
recognises, up to 50mm, and switching it on would change the fit of every model
already tuned against uncompensated printers. Do not run it alongside the
manual settings: they stack, and on a 4mm hole the pair opens the hole by a
quarter of a millimetre.

## Measuring your own

[Download the ladder gauge (3mf)]({static}/models/hole-ladder-gauge.3mf), or the
[OpenSCAD source]({static}/models/hole-ladder-gauge.scad). One card of thirteen
holes, 3.70 to 4.30 in 0.05mm steps, and a 4.00mm pin. Both the pin and the
holes have the squashed layer kept clear of the fit, the pin by a foot and the
holes by a lead-in cone.

A 4.00 pin never enters a 4.00 hole, since two equal diameters interfere. The
target is the pin entering at 4.05.

1. Print card and pin with every compensation at zero.
2. Measure the pin across the outside jaws. Anything over 4.00 is contour
   error, so contour compensation is minus half of it.
3. Find the smallest hole the pin enters. Subtract the pin diameter, then the
   0.05 a sliding fit needs. Half of what remains is your hole compensation.
4. Reprint and confirm the pin enters at 4.05 and passes all the way through.

Do elephant foot first. A narrowed bottom layer stops the pin whatever the rest
of the hole measures, and correcting the wrong fault twice is how an afternoon
disappears.
