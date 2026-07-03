// <chain-diagram> — canvas skeletal-ish diagram of a straight-chain alkane/alkene
// attrs: carbons (int), alkene (bool: has one C=C double bond near start) width height
(function () {
  class ChainDiagram extends HTMLElement {
    static get observedAttributes() { return ["carbons", "alkene"]; }
    connectedCallback() { this._build(); this._draw(); }
    attributeChangedCallback() { if (this._ctx) this._draw(); }
    _build() {
      const w = Number(this.getAttribute("width") || 480);
      const h = Number(this.getAttribute("height") || 160);
      const dpr = window.devicePixelRatio || 1;
      this._canvas = document.createElement("canvas");
      this._canvas.width = w * dpr; this._canvas.height = h * dpr;
      this._canvas.style.width = w + "px"; this._canvas.style.height = h + "px";
      this.appendChild(this._canvas);
      this._ctx = this._canvas.getContext("2d");
      this._w = w; this._h = h; this._dpr = dpr;
    }
    _draw() {
      const ctx = this._ctx, w = this._w, h = this._h;
      const n = Math.max(1, Math.min(10, Number(this.getAttribute("carbons") || 1)));
      const alkene = this.getAttribute("alkene") === "true";
      const ink = "#2b2620", accent = "#e8590c", grey = "#a89d8e";
      ctx.setTransform(this._dpr, 0, 0, this._dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const cy = h / 2, margin = 50;
      const step = n > 1 ? (w - margin * 2) / (n - 1) : 0;
      const pts = [];
      for (let i = 0; i < n; i++) {
        const x = margin + i * step;
        const y = cy + (i % 2 === 0 ? 18 : -18);
        pts.push({ x, y });
      }
      // bonds between carbons
      for (let i = 0; i < pts.length - 1; i++) {
        const isDouble = alkene && i === 0;
        ctx.strokeStyle = isDouble ? accent : ink; ctx.lineWidth = 2.4;
        ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[i + 1].x, pts[i + 1].y); ctx.stroke();
        if (isDouble) {
          const dx = pts[i + 1].x - pts[i].x, dy = pts[i + 1].y - pts[i].y;
          const len = Math.hypot(dx, dy), nx = -dy / len, ny = dx / len;
          ctx.beginPath();
          ctx.moveTo(pts[i].x + nx * 6, pts[i].y + ny * 6);
          ctx.lineTo(pts[i + 1].x + nx * 6, pts[i + 1].y + ny * 6);
          ctx.stroke();
        }
      }
      // carbon nodes + implicit H count label
      pts.forEach((p, i) => {
        ctx.beginPath(); ctx.arc(p.x, p.y, 12, 0, Math.PI * 2);
        ctx.fillStyle = "#2b2620"; ctx.fill();
        ctx.fillStyle = "#faf6ef"; ctx.font = "800 10px 'Archivo', sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText("C", p.x, p.y + 0.5);
        // H count: 3 for end carbons (single bonds), 2 for middle, adjust for alkene carbons
        let hCount = (i === 0 || i === pts.length - 1) ? 3 : 2;
        if (alkene && (i === 0 || i === 1)) hCount -= 1;
        ctx.font = "600 9px 'IBM Plex Mono', monospace"; ctx.fillStyle = grey;
        ctx.fillText("H" + hCount, p.x, p.y + (p.y > cy ? 24 : -24));
      });
      ctx.font = "700 11px 'IBM Plex Mono', monospace"; ctx.fillStyle = ink; ctx.textAlign = "left";
      const names = ["", "meth", "eth", "prop", "but", "pent", "hex", "hept", "oct", "non", "dec"];
      const formula = "C" + n + "H" + (alkene ? (2 * n) : (2 * n + 2));
      ctx.fillText((names[n] || "") + (alkene ? "ene" : "ane") + "  ·  " + formula, 10, 20);
    }
  }
  if (!customElements.get("chain-diagram")) customElements.define("chain-diagram", ChainDiagram);
})();
