#!/usr/bin/env python3
"""Extract Bambu Studio settings from downloaded MakerWorld profile 3mf files.

A profile 3mf is a zip. Metadata/project_settings.config is a JSON document of
roughly 580 keys, the whole slicer profile. Point this at a folder of 3mf files
and it writes one CSV row per file.

    python3 parse-3mf-settings.py ~/Downloads/makerworld > profiles.csv
"""
import csv, json, sys, zipfile
from pathlib import Path

KEYS = [
    "print_settings_id", "printer_model", "nozzle_diameter",
    "layer_height", "initial_layer_print_height",
    "wall_loops", "wall_generator", "sparse_infill_density", "sparse_infill_pattern",
    "top_shell_layers", "bottom_shell_layers",
    "outer_wall_speed", "inner_wall_speed", "sparse_infill_speed", "initial_layer_speed",
    "enable_support", "support_type", "support_style", "support_top_z_distance",
    "support_threshold_angle", "support_base_pattern", "support_object_xy_distance",
    "support_interface_spacing",
    "elefant_foot_compensation", "xy_hole_compensation", "xy_contour_compensation",
    "brim_type", "brim_width", "ironing_type", "seam_position",
    "filament_type", "nozzle_temperature", "hot_plate_temp", "textured_plate_temp",
]


def settings(path):
    with zipfile.ZipFile(path) as z:
        name = next((n for n in z.namelist() if n.endswith("project_settings.config")), None)
        if not name:
            return None
        return json.loads(z.read(name))


def main(folder):
    out = csv.writer(sys.stdout)
    out.writerow(["file", "keys"] + KEYS)
    for p in sorted(Path(folder).glob("*.3mf")):
        cfg = settings(p)
        if cfg is None:
            print(f"no project_settings.config in {p.name}", file=sys.stderr)
            continue
        row = [p.name, len(cfg)]
        for k in KEYS:
            v = cfg.get(k)
            row.append(v[0] if isinstance(v, list) and v else v)
        out.writerow(row)


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else ".")
