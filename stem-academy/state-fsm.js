// <state-fsm> — canvas finite-state diagram for the four states of matter.
// Draws SOLID-LIQUID-GAS-PLASMA nodes; every transition is drawn as its own
// single-direction arrow with a unique, always-visible label (e.g. MELTING is
// its own arrow, FREEZING is a separate arrow the other way) plus a dedicated
// SOLID<->GAS skip pair (SUBLIMATION / DEPOSITION). Nodes are clickable.
// attrs: current="solid|liquid|gas|plasma"  path="SL:fwd,LG:fwd"  width height
// prop: onNodeClick(key) — set as a JS property (not a string attribute)
(function () {
  const NODES = {
    solid: { x: 78, y: 78, label: "SOLID" },
    liquid: { x: 240, y: 78, label: "LIQUID" },
    gas: { x: 402, y: 78, label: "GAS" },
    plasma: { x: 564, y: 78, label: "PLASMA" },
  };
  const EDGES = [
    { id: "SL", a: "solid", b: "liquid", fwd: "MELTING", bwd: "FREEZING", kind: "line" },
    { id: "LG", a: "liquid", b: "gas", fwd: "BOILING", bwd: "CONDENSING", kind: "line" },
    { id: "GP", a: "gas", b: "plasma", fwd: "IONISATION", bwd: "RECOMBINATION", kind: "line" },
    { id: "SG", a: "solid", b: "gas", fwd: "SUBLIMATION", bwd: "DEPOSITION", kind: "arc" },
  ];
  const R = 30;
  const ORANGE = "#e8590c", BLUE = "#4a90d9", INK = "#2b2620", GREY = "#c9c0b2", GREYTXT = "#a89d8e";

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
      const h = Number(this.getAttribute("height") || 230);
      const dpr = window.devicePixelRatio || 1;
      this._canvas = document.createElement("canvas");
      this._canvas.width = w * dpr; this._canvas.height = h * dpr;
      this._canvas.style.width = w + "px"; this._canvas.style.height = h + "px";
      this.appendChild(this._canvas);
      this._ctx = this._canvas.getContext("2d");
      this._w = w; this._h = h; this._dpr = dpr;
    }

    _nodeAt(mx, my) {
      for (const key in NODES) {
        const n = NODES[key];
        if (Math.hypot(mx - n.x, my - n.y) <= R) return key;
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
      ctx.lineTo(x - size * Math.cos(angle - 0.4), y - size * Math.sin(angle - 0.4));
      ctx.lineTo(x - size * Math.cos(angle + 0.4), y - size * Math.sin(angle + 0.4));
      ctx.closePath();
      ctx.fill();
    }

    _draw() {
      const ctx = this._ctx, w = this._w, h = this._h;
      const current = this.getAttribute("current") || "solid";
      const pathAttr = this.getAttribute("path") || "";
      const active = {};
      pathAttr.split(",").filter(Boolean).forEach(seg => {
        const [id, dir] = seg.split(":");
        active[id] = dir;
      });
      ctx.setTransform(this._dpr, 0, 0, this._dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const drawDirLine = (A, B, label, isActive, color, arrowAtB, labelSide) => {
        const dx = B.x - A.x, dy = B.y - A.y, dist = Math.hypot(dx, dy);
        const ux = dx / dist, uy = dy / dist;
        const nx = -uy, ny = ux; // normal
        const off = labelSide * 7;
        const sx = A.x + ux * R + nx * off, sy = A.y + uy * R + ny * off;
        const ex = B.x - ux * R + nx * off, ey = B.y - uy * R + ny * off;
        ctx.strokeStyle = color; ctx.lineWidth = isActive ? 3 : 1.4;
        ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(ex, ey); ctx.stroke();
        const angle = Math.atan2(dy, dx);
        if (arrowAtB) this._arrowHead(ctx, ex, ey, angle, color, isActive ? 9 : 6);
        else this._arrowHead(ctx, sx, sy, angle + Math.PI, color, isActive ? 9 : 6);
        const mx = (sx + ex) / 2 + nx * 11, my = (sy + ey) / 2 + ny * 11 - 2;
        ctx.textAlign = "center";
        ctx.font = isActive ? "800 10.5px 'IBM Plex Mono', monospace" : "600 8px 'IBM Plex Mono', monospace";
        ctx.fillStyle = isActive ? color : GREYTXT;
        ctx.fillText(label, mx, my);
      };

      const drawDirArc = (A, B, label, isActive, color, arrowAtB, dip) => {
        const cx = (A.x + B.x) / 2, cy = A.y + dip;
        const t0 = 0.06, t1 = 0.94;
        const qx = (t) => (1 - t) * (1 - t) * A.x + 2 * (1 - t) * t * cx + t * t * B.x;
        const qy = (t) => (1 - t) * (1 - t) * A.y + 2 * (1 - t) * t * cy + t * t * B.y;
        ctx.strokeStyle = color; ctx.lineWidth = isActive ? 3 : 1.4;
        ctx.beginPath();
        ctx.moveTo(qx(t0), qy(t0));
        for (let t = t0; t <= t1; t += 0.02) ctx.lineTo(qx(t), qy(t));
        ctx.stroke();
        if (arrowAtB) {
          const ang = Math.atan2(qy(t1) - qy(t1 - 0.04), qx(t1) - qx(t1 - 0.04));
          this._arrowHead(ctx, qx(t1), qy(t1), ang, color, isActive ? 9 : 6);
        } else {
          const ang = Math.atan2(qy(t0) - qy(t0 + 0.04), qx(t0) - qx(t0 + 0.04));
          this._arrowHead(ctx, qx(t0), qy(t0), ang, color, isActive ? 9 : 6);
        }
        const mx = qx(0.5), my = qy(0.5) + 14;
        ctx.textAlign = "center";
        ctx.font = isActive ? "800 10.5px 'IBM Plex Mono', monospace" : "600 8px 'IBM Plex Mono', monospace";
        ctx.fillStyle = isActive ? color : GREYTXT;
        ctx.fillText(label, mx, my);
      };

      // edges — each direction is its own always-visible, uniquely labelled arrow
      EDGES.forEach(e => {
        const A = NODES[e.a], B = NODES[e.b];
        const fwdActive = active[e.id] === "fwd";
        const bwdActive = active[e.id] === "bwd";
        if (e.kind === "line") {
          drawDirLine(A, B, e.fwd, fwdActive, fwdActive ? ORANGE : GREY, true, -1);
          drawDirLine(A, B, e.bwd, bwdActive, bwdActive ? BLUE : GREY, false, 1);
        } else {
          drawDirArc(A, B, e.fwd, fwdActive, fwdActive ? ORANGE : GREY, true, 100);
          drawDirArc(A, B, e.bwd, bwdActive, bwdActive ? BLUE : GREY, false, 138);
        }
      });

      // nodes
      Object.keys(NODES).forEach(key => {
        const n = NODES[key];
        const isCurrent = key === current;
        const isHover = key === this._hover;
        ctx.beginPath(); ctx.arc(n.x, n.y, R + (isHover ? 3 : 0), 0, Math.PI * 2);
        ctx.fillStyle = isCurrent ? ORANGE : "#fff";
        ctx.fill();
        ctx.strokeStyle = INK; ctx.lineWidth = isCurrent ? 2.5 : 2; ctx.stroke();
        ctx.font = "800 10px 'Archivo', sans-serif";
        ctx.fillStyle = isCurrent ? "#faf6ef" : INK;
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(n.label, n.x, n.y + 1);
      });
    }
  }
  if (!customElements.get("state-fsm")) customElements.define("state-fsm", StateFsm);
})();
