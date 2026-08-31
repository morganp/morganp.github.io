# Printer dimensional accuracy, parked 2026-08-31

## Where the post stands

`content/posts/2026-08-30_Printer_Dimensional_Accuracy/`, `Status: draft`, 653
words. Five sections: hook, the base spreads, holes come out small, Bambu
already measured this, measuring your own. Cut down from 2046 words; the long
version is `post-long-version.md` here if anything needs pulling back.

Diagram: `content/images/Engineering/PrinterDimensionalAccuracy/01-two-errors.svg`
plus its HQ and 900w PNGs, hand authored in the site palette.

## Coupons

| File | Purpose | In the post |
|---|---|---|
| `hole-ladder-gauge` | 13 holes 3.70 to 4.30 in 0.05 steps, 4.00mm rod on a foot, lead-in cones | yes |
| `hole-fit-test` | six holes 2.4 to 6.0mm for real fasteners | no, kept for later |
| `dimensional-accuracy-gauge` | caliper block, holes 3 to 10mm plus a boss | no, kept for later |

All three under `content/models/`, scad plus 3mf.

## What the printing found so far

- Test print at 0.08mm layer: the rod enters the 4.05 hole, which is the target,
  so hole error at that layer height is about one step, roughly the clearance a
  sliding fit needs anyway.
- The rod would not pass the bottom layer. That is elephant foot seen from the
  inside, and the A1 Mini ships `elefant_foot_compensation` at 0. It prompted
  the lead-in cones on both fit coupons.
- Rod diameter across the calipers was never recorded. Without it the contour
  and hole errors cannot be separated.

## Open questions, in order

1. Measure the rod. Over 4.00 is contour error.
2. Reprint with elephant foot at 0.15 and confirm the rod passes the first layer.
3. Three-way ladder: stock, manual compensations, `enable_circle_compensation`.
   If auto lands the rod at 4.05 unaided, the post's thesis changes from "set
   these numbers" to "turn on the curve Bambu already fitted".
4. Replace the post's "0.1 to 0.3mm" with measured numbers.

## Verified facts worth not re-deriving

- Every stock A1 Mini process profile ships `elefant_foot_compensation` at 0.
  P1 and X1 profiles inherit 0.15. Checked in the installed system profiles.
- `xy_hole_compensation` and `xy_contour_compensation` are 0 in
  `fdm_process_common`, so zero everywhere.
- `enable_circle_compensation` is 0 in `fdm_process_common` and no shipped
  process profile turns it on. All 227 Bambu filament profiles carry fitted
  coefficients: for PLA Basic on A1M the hole curve gives 0.21 at 3mm, 0.20 at
  4mm, 0.15 at 10mm, floor 0.088 from about 18mm, clamped to 0.088 and 0.22.
- Elephant foot compensation shrinks the solid area of the first layer, so it
  opens holes and pulls the outside in. Not yet confirmed by print.
- 0.08mm and 0.20mm A1M profiles use identical line widths, so hole error
  should transfer between them. Not yet confirmed by print.

## MakerWorld research

See `makerworld-findings.md`. Method notes: the site 403s server-side fetches,
so the API has to be called from the page context in a logged-in browser.
Bursts of profile downloads trip a captcha, one every three seconds does not.
