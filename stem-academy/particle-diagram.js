// <particle-diagram> — small canvas showing element / compound / mixture particle arrangement
// attrs: kind="element|compound|mixture"  width height
(function () {
  class ParticleDiagram extends HTMLElement {
    static get observedAttributes() { return ["kind"]; }
    connectedCallback() {
      const w = Number(this.getAttribute("width") || 160);
      const h = Number(this.getAttribute("height") || 130);
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
      ctx.setTransform(this._dpr, 0, 0, this._dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const A = "#e8590c", B = "#66a3a3";
      const dot = (x, y, c, r) => { ctx.beginPath(); ctx.arc(x, y, r || 9, 0, Math.PI * 2); ctx.fillStyle = c; ctx.fill(); ctx.strokeStyle = "#2b2620"; ctx.lineWidth = 1.3; ctx.stroke(); };
      const cols = 4, rows = 3, spx = w / cols, spy = h / rows;
      const cells = [];
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) cells.push({ x: spx * (c + 0.5), y: spy * (r + 0.5) });

      if (kind === "element") {
        cells.forEach(p => dot(p.x, p.y, A));
      } else if (kind === "compound") {
        // pairs of A-B bonded, all same pattern
        for (let i = 0; i < cells.length; i += 2) {
          const p1 = cells[i], p2 = cells[i + 1];
          if (!p2) break;
          ctx.strokeStyle = "#2b2620"; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
          dot(p1.x, p1.y, A, 8); dot(p2.x, p2.y, B, 6);
        }
      } else { // mixture: random assortment, no bonds, some pairs same-element clumped randomly
        const seeded = [A, B, "#a89d8e"];
        cells.forEach((p, i) => dot(p.x + (i % 2 ? 4 : -4), p.y, seeded[i % 3], i % 3 === 2 ? 6 : 8.5));
      }
    }
  }
  if (!customElements.get("particle-diagram")) customElements.define("particle-diagram", ParticleDiagram);
})();
