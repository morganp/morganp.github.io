// Support peel-off test coupon
// lizard-spock.co.uk/bambu-easy-remove-support-settings.html
//
// An inverted L. The underside of the arm is a flat overhang with nothing
// below it, so the slicer must support it from the build plate. Printing one
// coupon per candidate Top Z distance tells you which value peels cleanly:
//
//   - the arm underside is the surface to inspect once the support is off
//   - the post beside the support column tests the XY clearance
//   - the support column is tall enough to get a fingernail under
//
// Set label to the value under test, for example "0.25", to tell a row of
// printed coupons apart afterwards.

/* [Coupon] */
// Post footprint along X
post_width  = 10;
// Depth of the whole coupon along Y
depth       = 14;
// Height from the plate to the underside of the arm
post_height = 18;
// Length of the unsupported overhang along X
arm_length  = 22;
// Thickness of the arm
arm_thick   = 4;

/* [Label] */
// Text embossed on top of the arm, empty for none
label        = "";
label_size   = 5;
label_depth  = 0.6;

/* [Hidden] */
$fn = 48;

module coupon() {
    union() {
        // Vertical post, the only part that reaches the plate
        cube([post_width, depth, post_height]);

        // Arm cantilevered in +X, its underside is the overhang under test
        translate([0, 0, post_height])
            cube([post_width + arm_length, depth, arm_thick]);
    }
}

module labelled_coupon() {
    if (label == "") {
        coupon();
    } else {
        difference() {
            coupon();
            translate([post_width + arm_length / 2,
                       depth / 2,
                       post_height + arm_thick - label_depth])
                linear_extrude(label_depth + 0.01)
                    text(label, size = label_size,
                         halign = "center", valign = "center",
                         font = "Helvetica");
        }
    }
}

labelled_coupon();
