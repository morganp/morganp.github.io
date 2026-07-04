// <state-fsm> — canvas finite-state diagram for the four states of matter.
// Layout: the four nodes sit on a central line. Every transition that ADDS energy
// (melting, boiling, ionisation, sublimation) arcs through the TOP half with a
// rightward arrow; every transition that REMOVES energy (freezing, condensing,
// recombination, deposition) arcs through the BOTTOM half with a leftward arrow.
// Nodes are clickable.
// attrs: current="solid|liquid|gas|plasma"  path="SL:fwd,LG:fwd"  width height
(function () {
  const NODES = {
    solid: { x: 90, label: "SOLID" },
    liquid: { x: 250, label: "LIQUID" },
    gas: { x: 410, label: "GAS" },
    plasma: { x: 570, label: "PLASMA" },
  };
  const EDGES = [
    { id: "SL", a: "solid", b: "liquid", fwd: "MELTING", bwd: "FREEZING", kind: "adj" },
    { id: "LG", a: "liquid", b: "gas", fwd: "BOILING", bwd: "CONDENSING", kind: "adj" },
    { id: "GP", a: "gas", b: "plasma", fwd: "IONISATION", bwd: "RECOMBINATION", kind: "adj" },
    { id: "SG", a: "solid", b: "gas", fwd: "SUBLIMATION", bwd: "DEPOSITION", kind: "skip" },
  ];
  const R = 34;
  const ORANGE = "#e8590c", BLUE = "#2a6fb0", INK = "#2b2620", GREYTXT = "#a89d8e";
  const GREYLINE = "#c9c0b2";

  class StateFsm extends HTMLElement {
    static get observedAttributes() { return ["current", "path"]; }
    connectedCallback() {
      this._build();
      this._hover = null;
      this._canvas.style.cursor = "pointer";
      this._canvas.addEventListener("click", (e) => this._handleClick(e));
      this._canvas.addEventListener("mousemove", (e) => this._handleMove(e));
      this._canvas.addEventListener("mouseleave", () => { this._hover = null; this._draw(); });
      this._draw();
    }
    attributeChangedCallback() { if (this._ctx) this._draw(); }

    _build() {
      const w = Number(this.getAttribute("width") || 620);
      const h = Number(this.getAttribute("height") || 300);
      const dpr = window.devicePixelRatio || 1;
      this._canvas = document.createElement("canvas");
      this._canvas.width = w * dpr; this._canvas.height = h * dpr;
      this._canvas.style.width = w + "px"; this._canvas.style.height = h + "px";
      this._canvas.style.display = "block";
      this.appendChild(this._canvas);
      this._ctx = this._canvas.getContext("2d");
      this._w = w; this._h = h; this._dpr = dpr; this._cy = h / 2;
    }

    _nodeAt(mx, my) {
      for (const key in NODES) {
        if (Math.hypot(mx - NODES[key].x, my - this._cy) <= R + 4) return key;
      }
      return null;
    }
    _eventPos(e) {
      const rect = this._canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }
    _handleClick(e) {
      const { x, y } = this._eventPos(e);
      const key = this._nodeAt(x, y);
      if (key && typeof this.onNodeClick === "function") this.onNodeClick(key);
      if (key) this.dispatchEvent(new CustomEvent("nodeclick", { detail: { state: key }, bubbles: true }));
    }
    _handleMove(e) {
      const { x, y } = this._eventPos(e);
      const key = this._nodeAt(x, y);
      if (key !== this._hover) { this._hover = key; this._canvas.style.cursor = key ? "pointer" : "default"; this._draw(); }
    }

    _arrowHead(ctx, x, y, angle, color, size) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - size * Math.cos(angle - 0.42), y - size * Math.sin(angle - 0.42));
      ctx.lineTo(x - size * Math.cos(angle + 0.42), y - size * Math.sin(angle + 0.42));
      ctx.closePath();
      ctx.fill();
    }

    _draw() {
      const ctx = this._ctx, w = this._w, h = this._h, cy = this._cy;
      const current = this.getAttribute("current") || "solid";
      const pathAttr = this.getAttribute("path") || "";
      const active = {};
      pathAttr.split(",").filter(Boolean).forEach(seg => { const [id, dir] = seg.split(":"); active[id] = dir; });
      ctx.setTransform(this._dpr, 0, 0, this._dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // energy-direction hints (this is the whole point of the top/bottom split)
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.font = "700 10px 'IBM Plex Mono', monospace";
      ctx.fillStyle = ORANGE; ctx.fillText("\u25B2 ADDING ENERGY  \u2014  melt \u00b7 boil \u00b7 ionise", w / 2, 13);
      ctx.fillStyle = BLUE; ctx.fillText("\u25BC REMOVING ENERGY  \u2014  freeze \u00b7 condense", w / 2, h - 12);

      const norm = (dx, dy) => { const d = Math.hypot(dx, dy) || 1; return { x: dx / d, y: dy / d }; };

      const drawArc = (ax, bx, label, isActive, color, arrowAtB, dip, up) => {
        const ctrl = { x: (ax + bx) / 2, y: cy + (up ? -dip : dip) };
        const A = { x: ax, y: cy }, B = { x: bx, y: cy };
        const dA = norm(ctrl.x - A.x, ctrl.y - A.y);
        const dB = norm(ctrl.x - B.x, ctrl.y - B.y);
        const sx = A.x + dA.x * R, sy = A.y + dA.y * R;
        const ex = B.x + dB.x * R, ey = B.y + dB.y * R;
        ctx.strokeStyle = color; ctx.lineWidth = isActive ? 3.5 : 2;
        ctx.beginPath(); ctx.moveTo(sx, sy); ctx.quadraticCurveTo(ctrl.x, ctrl.y, ex, ey); ctx.stroke();
        const hs = isActive ? 15 : 11;
        if (arrowAtB) { const ang = Math.atan2(ey - ctrl.y, ex - ctrl.x); this._arrowHead(ctx, ex, ey, ang, color, hs); }
        else { const ang = Math.atan2(sy - ctrl.y, sx - ctrl.x); this._arrowHead(ctx, sx, sy, ang, color, hs); }
        const mx = 0.25 * sx + 0.5 * ctrl.x + 0.25 * ex, my = 0.25 * sy + 0.5 * ctrl.y + 0.25 * ey;
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.font = isActive ? "800 11.5px 'IBM Plex Mono', monospace" : "600 10px 'IBM Plex Mono', monospace";
        ctx.fillStyle = isActive ? color : GREYTXT;
        ctx.fillText(label, mx, my + (up ? -10 : 10));
      };

      EDGES.forEach(e => {
        const ax = NODES[e.a].x, bx = NODES[e.b].x;
        const fwdActive = active[e.id] === "fwd";
        const bwdActive = active[e.id] === "bwd";
        const dip = e.kind === "skip" ? 100 : 50;
        drawArc(ax, bx, e.fwd, fwdActive, fwdActive ? ORANGE : GREYLINE, true, dip, true);   // energy IN -> top
        drawArc(ax, bx, e.bwd, bwdActive, bwdActive ? BLUE : GREYLINE, false, dip, false);   // energy OUT -> bottom
      });

      // nodes
      Object.keys(NODES).forEach(key => {
        const n = NODES[key];
        const isCurrent = key === current;
        const isHover = key === this._hover;
        ctx.beginPath(); ctx.arc(n.x, cy, R + (isHover ? 3 : 0), 0, Math.PI * 2);
        ctx.fillStyle = isCurrent ? ORANGE : "#fff";
        ctx.fill();
        ctx.strokeStyle = INK; ctx.lineWidth = isCurrent ? 3 : 2; ctx.stroke();
        ctx.font = "800 11.5px 'Archivo', sans-serif";
        ctx.fillStyle = isCurrent ? "#faf6ef" : INK;
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(n.label, n.x, cy + 1);
      });
    }
  }
  if (!customElements.get("state-fsm")) customElements.define("state-fsm", StateFsm);
})();
