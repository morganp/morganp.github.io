// <particle-diagram> — labelled canvas figure: element / compound / mixture,
// with real substance examples and an in-diagram legend (per journal convention).
// Molecules are drawn as touching/overlapping circles (space-filling style),
// matching standard particle-diagram convention — no stick "bond" lines.
// attrs: kind="element|compound|mixture"  width height
(function () {
  class ParticleDiagram extends HTMLElement {
    static get observedAttributes() { return ["kind"]; }
    connectedCallback() {
      const w = Number(this.getAttribute("width") || 200);
      const h = Number(this.getAttribute("height") || 168);
      const dpr = window.devicePixelRatio || 1;
      this._canvas = document.createElement("canvas");
      this._canvas.width = w * dpr; this._canvas.height = h * dpr;
      this._canvas.style.width = w + "px"; this._canvas.style.height = h + "px";
      this.appendChild(this._canvas);
      this._ctx = this._canvas.getContext("2d");
      this._w = w; this._h = h; this._dpr = dpr;
      this._draw();
    }
    attributeChangedCallback() { if (this._ctx) this._draw(); }

    _draw() {
      const ctx = this._ctx, w = this._w, h = this._h, kind = this.getAttribute("kind") || "element";
      const INK = "#2b2620";
      ctx.setTransform(this._dpr, 0, 0, this._dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const plotH = h - 46; // reserve bottom strip for the (possibly 2-line) legend
      const dot = (x, y, c, r, label) => {
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = c; ctx.fill();
        ctx.strokeStyle = INK; ctx.lineWidth = 1.2; ctx.stroke();
        if (label) {
          ctx.font = "700 " + Math.max(7, r) + "px 'IBM Plex Mono', monospace";
          ctx.fillStyle = "#faf6ef"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
          ctx.fillText(label, x, y + 0.5);
        }
      };
      // two circles drawn touching/overlapping — no connecting stick line (space-filling molecule style)
      const pair = (cx, cy, r1, c1, l1, r2, c2, l2, overlap) => {
        const d = r1 + r2 - (overlap != null ? overlap : 4);
        dot(cx - d / 2, cy, c1, r1, l1);
        dot(cx + d / 2, cy, c2, r2, l2);
      };
      const legendAt = (items, startY, lineGap) => {
        ctx.font = "600 9px 'IBM Plex Mono', monospace"; ctx.textAlign = "left"; ctx.textBaseline = "middle";
        let x = 8, line = 0;
        const lineY = () => startY + line * (lineGap || 14);
        items.forEach(([color, text]) => {
          const itemW = 13 + ctx.measureText(text).width + 12;
          if (x + itemW > w - 4 && x > 8) { line++; x = 8; }
          const y = lineY();
          ctx.beginPath(); ctx.arc(x + 5, y, 5, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill();
          ctx.strokeStyle = INK; ctx.lineWidth = 1; ctx.stroke();
          ctx.fillStyle = INK;
          ctx.fillText(text, x + 13, y);
          x += itemW;
        });
        return line; // number of extra wrapped lines used
      };
      const legend = (items) => legendAt(items, h - 26);
      const miniLabel = (text, y) => {
        ctx.font = "700 8.5px 'IBM Plex Mono', monospace"; ctx.textAlign = "left"; ctx.textBaseline = "middle";
        ctx.fillStyle = "#8a8074"; ctx.fillText(text, 8, y);
      };

      const A = "#e8590c", B = "#66a3a3", C = "#a89d8e";

      if (kind === "element") {
        // Two separate worked examples of "element" (one type of atom), each self-contained
        // with its own heading + diagram + legend, split by a divider so they never read
        // as two different substances mixed together.
        const sectionH = h / 2;

        // — Example 1: a metal, atoms unbonded —
        miniLabel("EXAMPLE 1 — METAL, ATOMS UNBONDED", 12);
        const cols = 4, rows = 2, spx = w / cols, spy = 46 / rows;
        for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
          dot(spx * (c + 0.5), 24 + spy * (r + 0.5), A, 9, "Au");
        }
        legendAt([[A, "Au — gold (metal)"]], sectionH - 10);

        ctx.strokeStyle = "#d8d0c2"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(6, sectionH + 2); ctx.lineTo(w - 6, sectionH + 2); ctx.stroke();

        // — Example 2: a diatomic gas, bonded pairs of the SAME element —
        miniLabel("EXAMPLE 2 — GAS, BONDED PAIRS", sectionH + 24);
        const pairY = sectionH + 24 + (sectionH - 24 - 20) / 2 + 8;
        [w * 0.2, w * 0.5, w * 0.8].forEach(cx => pair(cx, pairY, 7, B, "O", 7, B, "O"));
        legendAt([[B, "O₂ — oxygen, still one element"]], h - 10);
      } else if (kind === "compound") {
        // sodium chloride (NaCl) — two elements chemically bonded 1:1, touching not stick-bonded
        const cols = 3, rows = 2;
        const spx = w / cols, spy = plotH / rows;
        for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
          pair(spx * (c + 0.5), spy * (r + 0.5), 9, A, "Na", 8, B, "Cl", 2);
        }
        legend([[A, "Na"], [B, "Cl — sodium chloride, 1:1"]]);
      } else {
        // air — a real mixture: N2 (majority), O2 (some), Ar (trace) — molecules/atoms not bonded to EACH OTHER
        const cellsX = 4, cellsY = 3, spx = w / cellsX, spy = plotH / cellsY;
        const slots = [];
        for (let r = 0; r < cellsY; r++) for (let c = 0; c < cellsX; c++) slots.push({ x: spx * (c + 0.5), y: spy * (r + 0.5) });
        slots.forEach((p, i) => {
          if (i < 7) pair(p.x, p.y, 6.5, B, "N", 6.5, B, "N");
          else if (i < 10) pair(p.x, p.y, 6.5, A, "O", 6.5, A, "O");
          else dot(p.x, p.y, C, 8, "Ar");
        });
        legend([[B, "N₂"], [A, "O₂"], [C, "Ar — argon (trace)"]]);
      }
    }
  }
  if (!customElements.get("particle-diagram")) customElements.define("particle-diagram", ParticleDiagram);
})();
