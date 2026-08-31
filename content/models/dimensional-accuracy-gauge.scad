// Dimensional accuracy gauge coupon
// lizard-spock.co.uk/printer-dimensional-accuracy.html
//
// One print that measures both errors a slicer can correct:
//
//   - six through holes, 3 to 10mm, for X-Y hole compensation
//   - a boss on the top face, clear of the plate, for X-Y contour
//     compensation on an outside curve
//   - a block long enough to measure across at the base and again near the
//     top, where the difference is the elephant foot spread
//
// Print at the layer height you actually use, measure with calipers, then set
// the compensations from the errors. Set label to the filament or the setting
// under test to tell a row of printed coupons apart afterwards.

/* [Block] */
// Height from the plate to the top face
block_height = 8;
// Wall between holes and around the edge
margin       = 4;

/* [Holes] */
// Nominal through hole diameters, ascending
holes = [3, 4, 5, 6, 8, 10];

/* [Boss] */
// Outside curve to measure, standing on the top face
boss_diameter = 10;
boss_height   = 6;

/* [Label] */
// Text embossed on the top face, empty for none
label       = "";
label_size  = 4;
label_depth = 0.6;

/* [Hidden] */
$fn = 96;

// Hole centre along X, spaced so every wall between holes equals margin
function hole_x(i) =
    margin + holes[0] / 2 +
    (i == 0 ? 0 :
        holes[i] / 2 + holes[i - 1] / 2 + margin + hole_x(i - 1) - margin - holes[0] / 2);

block_length = hole_x(len(holes) - 1) + holes[len(holes) - 1] / 2 + margin;
hole_row_y   = margin + max(holes) / 2;
boss_y       = hole_row_y + max(holes) / 2 + margin / 2 + boss_diameter / 2;
block_depth  = boss_y + boss_diameter / 2 + margin / 2;

module gauge() {
    difference() {
        union() {
            cube([block_length, block_depth, block_height]);

            // Outside curve, lifted clear of the first layers
            translate([block_length / 2, boss_y, block_height])
                cylinder(h = boss_height, d = boss_diameter);
        }

        // Through holes, ascending along X
        for (i = [0 : len(holes) - 1])
            translate([hole_x(i), hole_row_y, -1])
                cylinder(h = block_height + 2, d = holes[i]);

        // Label on the top face, ahead of the hole row
        if (label != "")
            translate([block_length / 2, margin / 2 + 1,
                       block_height - label_depth])
                linear_extrude(label_depth + 0.01)
                    text(label, size = label_size,
                         halign = "center", valign = "bottom",
                         font = "Helvetica");
    }
}

gauge();
echo(str("block ", block_length, " x ", block_depth, " x ", block_height));
