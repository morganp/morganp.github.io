# Todo

## Posts

- [ ] **Opinel knives post.** The Opinel drawing from the `multi-tool-or-separate-tools`
      hero came out well and should carry its own post. Reference crop kept at
      `content/images/Outdoor/OpinelKnives/opinel-sketch-reference.png`, cut from the
      512 px hero prototype, so it is too low resolution to publish. Regenerate at
      2K from the same prompt language when the post is written. Full prototype
      kept alongside it as `hero-prototype-source-512px.png`.
- [x] **Multi-tool or separate tools.** Published 2026-08-29 at
      `content/posts/2026-08-29_Multi_Tool_Or_Separate_Tools/`.

- [x] **Digital Design 03: Metastability.** Published 2026-08-29. Uses tau and T0
      measured in `~/Code/flipflop-mtbf` from the sky130 `dfxtp_1` cell.
- [ ] **Digital Design 04: Boolean algebra.** The other branch promised at the end
      of article 02. Article 02 now describes the split, so 03 and 04 are parallel
      successors rather than a sequence.
- [ ] **The classic.** Stub draft at `content/posts/2026-08-29_The_Classic/`, one
      sentence and a placeholder image. Left deliberately undeveloped.

- [ ] **Printer dimensional accuracy.** Draft at 653 words, parked 2026-08-31.
      Full state, open questions and verified profile facts in
      `notes/printer-dimensional-accuracy/STATE.md`. Waiting on three prints:
      rod diameter, elephant foot at 0.15, and the three-way auto compensation
      comparison.
- [ ] **Three-way ladder experiment.** Print `hole-ladder-gauge` three times on
      the same filament: stock, manual X-Y hole and contour compensation, and
      `enable_circle_compensation` on. Record the smallest hole the pin enters
      each time, plus pin diameter. If auto lands the pin at 4.05 unaided, the
      dimensional accuracy post changes from "set these numbers" to "turn on the
      curve Bambu already fitted, and here is why it ships disabled". Also
      confirm elephant foot at 0.15 lets the pin pass the first layer.
- [ ] **Z accuracy: Precise Z height.** Follow-up to the dimensional accuracy
      post, which covers X-Y only. Layer rounding leaves a part up to one layer
      height short, worst on coarse layers. Off by default, and off in all 100
      top rated MakerWorld profiles and all 30 top dragon profiles.
- [ ] **What the top rated MakerWorld models actually set.** MakerWorld ratings
      are notionally about the print settings shipped with a model rather than the
      model itself, so the highest rated profiles are a settings dataset. Pull the
      profile values from a sample of top rated models and look for what they agree
      on. Needs a scrape or the MakerWorld API, and a check on their terms first.

## Site

- [x] Commit the AMBA network explorer work: LPI and APB submodule bumps, new AXI
      submodule, `copy-webapps` same-name rsync lines, `CLAUDE.md` update.
