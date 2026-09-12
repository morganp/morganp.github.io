// Hole fit test coupon
// lizard-spock.co.uk/printer-dimensional-accuracy.html
//
// A go/no-go check, not a measurement. Print it once with the compensations at
// zero, once with them set, and try the same fasteners and pins in both.
//
// Six holes across the sizes where the error actually bites:
//
//   2.4  M2 clearance
//   3.0  3mm pin or filament-free dowel
//   3.4  M3 clearance, the fit that fails most often
//   4.5  M4 clearance
//   5.0  5mm pin, LED, magnet post
//   6.0  6mm pin or rod
//
// Each hole is labelled on the top face. A joint pin beside the row tests the
// other direction, an outside curve that has to enter a hole of its own.
//
// Every hole has a lead-in cone at the bottom. The first layer squeezes inward
// into a hole as well as outward around the part, so without the cone a bolt
// meets that one narrowed layer and stops, whatever the rest of the hole
// measures.

/* [Coupon] */
// Height from the plate to the top face
height       = 6;
// Wall between holes and around the edge
margin       = 3.5;
// Nominal hole diameters, ascending
holes        = [2.4, 3, 3.4, 4.5, 5, 6];

// Depth of the bottom lead-in, past the squashed first layer
lead_in      = 0.6;
// How much wider the lead-in starts
lead_flare   = 0.6;

/* [Pin] */
// Test pin standing on the top face, sized to the 6mm hole
pin_diameter = 6;
pin_height   = 8;

/* [Label] */
// Engrave the nominal size beside each hole
label        = true;
label_size   = 2.6;
label_depth  = 0.4;

/* [Hidden] */
$fn = 96;

function hole_x(i) =
    margin + holes[0] / 2 +
    (i == 0 ? 0 :
        holes[i] / 2 + holes[i - 1] / 2 + margin + hole_x(i - 1) - margin - holes[0] / 2);

length    = hole_x(len(holes) - 1) + holes[len(holes) - 1] / 2 + margin;
row_y     = margin + max(holes) / 2;
pin_y     = row_y + max(holes) / 2 + margin + pin_diameter / 2;
depth     = pin_y + pin_diameter / 2 + margin;

module coupon() {
    difference() {
        union() {
            cube([length, depth, height]);
            translate([length - margin - pin_diameter / 2, pin_y, height])
                cylinder(h = pin_height, d = pin_diameter);
        }

        for (i = [0 : len(holes) - 1]) {
            translate([hole_x(i), row_y, -1])
                cylinder(h = height + 2, d = holes[i]);

            translate([hole_x(i), row_y, -0.01])
                cylinder(h = lead_in, d1 = holes[i] + lead_flare, d2 = holes[i]);
        }

        if (label)
            for (i = [0 : len(holes) - 1])
                translate([hole_x(i), pin_y - pin_diameter / 2 - 1.2,
                           height - label_depth])
                    linear_extrude(label_depth + 0.01)
                        text(str(holes[i]), size = label_size,
                             halign = "center", valign = "top",
                             font = "Helvetica");
    }
}

coupon();
echo(str("coupon ", length, " x ", depth, " x ", height));
