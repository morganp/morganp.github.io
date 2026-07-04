// <titration-curve> — canvas pH-vs-volume titration curve (strong acid + strong alkali)
// attrs: volume (0-50, mL of alkali added), width height
(function () {
  class TitrationCurve extends HTMLElement {
    static get observedAttributes() { return ["volume"]; }
    connectedCallback() { this._build(); this._draw(); }
    attributeChangedCallback() { if (this._ctx) this._draw(); }
    _build() {
      const w = Number(this.getAttribute("width") || 480);
      const h = Number(this.getAttribute("height") || 260);
      const dpr = window.devicePixelRatio || 1;
      this._canvas = document.createElement("canvas");
      this._canvas.width = w * dpr; this._canvas.height = h * dpr;
      this._canvas.style.width = w + "px"; this._canvas.style.height = h + "px";
      this.appendChild(this._canvas);
      this._ctx = this._canvas.getContext("2d");
      this._w = w; this._h = h; this._dpr = dpr;
    }
    _phAt(v) {
      // sigmoid-ish curve centred at equivalence point v=25, steep jump
      const eq = 25;
      return 7 + 6 * Math.tanh((v - eq) / 1.6);
    }
    _draw() {
      const ctx = this._ctx, w = this._w, h = this._h;
      const v = Math.max(0, Math.min(50, Number(this.getAttribute("volume") || 0)));
      const ink = "#2b2620", accent = "#e8590c", grey = "#a89d8e", blue = "#4a90d9";
      ctx.setTransform(this._dpr, 0, 0, this._dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const padL = 44, padR = 16, padT = 16, padB = 36;
      const gx = padL, gy = padT, gw = w - padL - padR, gh = h - padT - padB;
      ctx.strokeStyle = ink; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(gx, gy); ctx.lineTo(gx, gy + gh); ctx.lineTo(gx + gw, gy + gh); ctx.stroke();
      ctx.font = "600 9.5px 'IBM Plex Mono', monospace"; ctx.fillStyle = grey; ctx.textAlign = "center";
      ctx.fillText("VOLUME OF ALKALI ADDED (mL)", gx + gw / 2, gy + gh + 24);
      ctx.save(); ctx.translate(14, gy + gh / 2); ctx.rotate(-Math.PI / 2); ctx.fillText("pH", 0, 0); ctx.restore();

      // curve
      ctx.strokeStyle = blue; ctx.lineWidth = 2;
      ctx.beginPath();
      for (let vv = 0; vv <= 50; vv += 0.5) {
        const ph = this._phAt(vv);
        const x = gx + (vv / 50) * gw, y = gy + gh - (ph / 14) * gh;
        if (vv === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // equivalence marker
      ctx.setLineDash([3, 3]); ctx.strokeStyle = grey; ctx.lineWidth = 1;
      const eqX = gx + (25 / 50) * gw;
      ctx.beginPath(); ctx.moveTo(eqX, gy); ctx.lineTo(eqX, gy + gh); ctx.stroke();
      ctx.setLineDash([]);
      ctx.font = "600 9px 'IBM Plex Mono', monospace"; ctx.fillStyle = grey; ctx.textAlign = "center";
      ctx.fillText("EQUIVALENCE POINT (pH 7)", eqX, gy + 12);

      // current point
      const ph = this._phAt(v);
      const px = gx + (v / 50) * gw, py = gy + gh - (ph / 14) * gh;
      ctx.beginPath(); ctx.arc(px, py, 6, 0, Math.PI * 2);
      ctx.fillStyle = accent; ctx.fill(); ctx.strokeStyle = ink; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.font = "800 11px 'Archivo', sans-serif"; ctx.fillStyle = ink; ctx.textAlign = "left";
      ctx.fillText("pH " + ph.toFixed(1) + " at " + v.toFixed(0) + " mL", px + 10, py - 8);
    }
  }
  if (!customElements.get("titration-curve")) customElements.define("titration-curve", TitrationCurve);
})();
