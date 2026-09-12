// Hole ladder gauge
// lizard-spock.co.uk/printer-dimensional-accuracy.html
//
// One printed pin, nominally 4mm, and a card of holes stepping 0.05mm from
// 3.70 to 4.30. Find the smallest hole the pin enters and read the fit
// straight off the card. No calipers in a 3mm hole, and nothing loose to mix
// up: the sizes are engraved beside the holes they belong to.
//
// The pin stands on a foot, so the squashed first layer stays in the foot and
// the shaft above it prints at full diameter. Every hole gets a lead-in cone
// at the bottom for the same reason: the first layer of the card squeezes
// inward into the hole, and without the cone that one layer is what the pin
// meets first, so the card would measure the elephant foot rather than the
// hole.
//
// Reading it:
//   1. Measure the pin shaft with the outside jaws. Calipers are accurate on
//      a 4mm outside dimension. Excess over 4.00 is the contour error, so
//      X-Y contour compensation is minus half of it.
//   2. Find the smallest hole the pin slides into. That label minus the
//      measured pin diameter is the clearance you are living with.
//   3. Hole error is the label minus the pin diameter, so X-Y hole
//      compensation is half of that difference.

/* [Ladder] */
// Middle of the range, and the pin size
nominal   = 4.0;
// Step between neighbouring holes
step      = 0.05;
// Holes each side of nominal
each_side = 6;
// Card thickness, deep enough for a real fit
thickness = 4;
// Holes per row
per_row   = 7;

// Depth of the bottom lead-in, past the squashed first layer
lead_in     = 0.6;
// How much wider the lead-in starts
lead_flare  = 0.6;

/* [Pin] */
pin_height  = 12;
foot_d      = 9;
foot_h      = 1.2;

/* [Label] */
label_size  = 2;
label_depth = 0.4;

/* [Hidden] */
$fn    = 128;
margin = 4;

// Two decimals always, so 3.70 and 4.00 read as clearly as 3.85
function label_of(v) =
    let (whole = floor(v + 1e-9),
         hund  = round((v - whole) * 100))
    str(whole, ".", hund < 10 ? str("0", hund) : str(hund));

count    = each_side * 2 + 1;
sizes    = [for (i = [0 : count - 1]) nominal + (i - each_side) * step];
rows     = ceil(count / per_row);
pitch_x  = nominal + each_side * step + 3.2;
pitch_y  = nominal + each_side * step + 6.5;
card_w   = per_row * pitch_x + margin;
card_d   = rows * pitch_y + margin;

module card() {
    difference() {
        cube([card_w, card_d, thickness]);

        for (i = [0 : count - 1]) {
            row = floor(i / per_row);
            col = i % per_row;
            x   = margin / 2 + pitch_x / 2 + col * pitch_x;
            y   = card_d - margin / 2 - pitch_y / 2 - row * pitch_y + 1.5;

            translate([x, y, -1])
                cylinder(h = thickness + 2, d = sizes[i]);

            // Lead-in cone, so the gauging length starts above the first layer
            translate([x, y, -0.01])
                cylinder(h = lead_in, d1 = sizes[i] + lead_flare, d2 = sizes[i]);

            translate([x, y - nominal / 2 - each_side * step - 1.4,
                       thickness - label_depth])
                linear_extrude(label_depth + 0.01)
                    text(label_of(sizes[i]), size = label_size,
                         halign = "center", valign = "top",
                         font = "Helvetica");
        }
    }
}

module pin() {
    cylinder(h = foot_h, d = foot_d);
    translate([0, 0, foot_h]) cylinder(h = pin_height, d = nominal);
}

card();
translate([card_w + 8, card_d / 2, 0]) pin();

echo(str("card ", card_w, " x ", card_d, " x ", thickness,
         ", holes ", sizes[0], " to ", sizes[count - 1], ", pin ", nominal));
