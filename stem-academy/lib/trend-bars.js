// <trend-bars> — canvas bar chart for a periodic trend across a row of elements
// attrs: data="Na:186,Mg:160,..."  unit="picometres"  width height
(function () {
  class TrendBars extends HTMLElement {
    static get observedAttributes() { return ["data", "unit"]; }
    connectedCallback() { this._build(); this._draw(); }
    attributeChangedCallback() { if (this._ctx) this._draw(); }
    _build() {
      const w = Number(this.getAttribute("width") || 560);
      const h = Number(this.getAttribute("height") || 220);
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
      const raw = this.getAttribute("data") || "";
      const unit = this.getAttribute("unit") || "";
      const data = raw.split(",").filter(Boolean).map(pair => {
        const [sym, value] = pair.split(":");
        return { sym, value: Number(value) };
      });
      const ink = "#2b2620", accent = "#e8590c", grey = "#a89d8e";
      ctx.setTransform(this._dpr, 0, 0, this._dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      if (!data.length) return;
      const padL = 10, padR = 10, padT = 16, padB = 40;
      const gw = w - padL - padR, gh = h - padT - padB;
      const maxV = Math.max(...data.map(d => d.value)) * 1.15;
      const bw = gw / data.length;
      data.forEach((d, i) => {
        const bh = (d.value / maxV) * gh;
        const x = padL + i * bw + bw * 0.15, bwid = bw * 0.7;
        const y = padT + gh - bh;
        ctx.fillStyle = accent;
        ctx.fillRect(x, y, bwid, bh);
        ctx.strokeStyle = ink; ctx.lineWidth = 1.3; ctx.strokeRect(x, y, bwid, bh);
        ctx.font = "800 11px 'Archivo', sans-serif"; ctx.fillStyle = ink; ctx.textAlign = "center";
        ctx.fillText(d.sym, x + bwid / 2, padT + gh + 16);
        ctx.font = "500 9px 'IBM Plex Mono', monospace"; ctx.fillStyle = grey;
        ctx.fillText(String(d.value), x + bwid / 2, y - 6);
      });
      ctx.strokeStyle = ink; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(padL, padT + gh); ctx.lineTo(padL + gw, padT + gh); ctx.stroke();
      if (unit) {
        ctx.font = "500 9.5px 'IBM Plex Mono', monospace"; ctx.fillStyle = grey; ctx.textAlign = "left";
        ctx.fillText(unit, padL, 12);
      }
    }
  }
  if (!customElements.get("trend-bars")) customElements.define("trend-bars", TrendBars);
})();
