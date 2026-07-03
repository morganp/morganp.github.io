// <energy-profile> — canvas energy diagram (reaction progress vs energy)
// attrs: kind="exo|endo" width height
(function () {
  class EnergyProfile extends HTMLElement {
    static get observedAttributes() { return ["kind"]; }
    connectedCallback() { this._build(); this._draw(); }
    attributeChangedCallback() { if (this._ctx) this._draw(); }
    _build() {
      const w = Number(this.getAttribute("width") || 420);
      const h = Number(this.getAttribute("height") || 260);
      const dpr = window.devicePixelRatio || 1;
      this._canvas = document.createElement("canvas");
      this._canvas.width = w * dpr; this._canvas.height = h * dpr;
      this._canvas.style.width = w + "px"; this._canvas.style.height = h + "px";
      this.appendChild(this._canvas);
      this._ctx = this._canvas.getContext("2d");
      this._w = w; this._h = h; this._dpr = dpr;
    }
    _draw() {
      const ctx = this._ctx, w = this._w, h = this._h, kind = this.getAttribute("kind") || "exo";
      const ink = "#2b2620", accent = "#e8590c", grey = "#a89d8e", blue = "#4a90d9";
      ctx.setTransform(this._dpr, 0, 0, this._dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const padL = 46, padR = 20, padT = 30, padB = 40;
      const gx = padL, gy = padT, gw = w - padL - padR, gh = h - padT - padB;
      // axes
      ctx.strokeStyle = ink; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(gx, gy); ctx.lineTo(gx, gy + gh); ctx.lineTo(gx + gw, gy + gh); ctx.stroke();
      ctx.save();
      ctx.translate(14, gy + gh / 2); ctx.rotate(-Math.PI / 2);
      ctx.font = "600 10px 'IBM Plex Mono', monospace"; ctx.fillStyle = grey; ctx.textAlign = "center";
      ctx.fillText("ENERGY", 0, 0);
      ctx.restore();
      ctx.font = "600 10px 'IBM Plex Mono', monospace"; ctx.textAlign = "center";
      ctx.fillText("REACTION PROGRESS", gx + gw / 2, gy + gh + 20);

      const startY = kind === "exo" ? gy + gh * 0.4 : gy + gh * 0.62;
      const endY = kind === "exo" ? gy + gh * 0.7 : gy + gh * 0.32;
      const peakY = gy + gh * 0.08;

      // curve: start flat -> rise to peak -> fall to end
      ctx.strokeStyle = accent; ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(gx + gw * 0.05, startY);
      ctx.lineTo(gx + gw * 0.22, startY);
      ctx.bezierCurveTo(gx + gw * 0.36, startY, gx + gw * 0.42, peakY, gx + gw * 0.5, peakY);
      ctx.bezierCurveTo(gx + gw * 0.58, peakY, gx + gw * 0.64, endY, gx + gw * 0.78, endY);
      ctx.lineTo(gx + gw * 0.95, endY);
      ctx.stroke();

      // dashed level lines + labels
      ctx.setLineDash([4, 4]); ctx.strokeStyle = grey; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(gx, startY); ctx.lineTo(gx + gw * 0.22, startY); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(gx, endY); ctx.lineTo(gx + gw * 0.78, endY); ctx.stroke();
      ctx.setLineDash([]);

      // Ea bracket
      ctx.strokeStyle = blue; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(gx + gw * 0.5 + 4, startY); ctx.lineTo(gx + gw * 0.5 + 4, peakY); ctx.stroke();
      ctx.font = "700 10.5px 'IBM Plex Mono', monospace"; ctx.fillStyle = blue; ctx.textAlign = "left";
      ctx.fillText("Eₐ", gx + gw * 0.5 + 8, (startY + peakY) / 2);

      // delta H bracket
      ctx.strokeStyle = accent; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(gx + gw * 0.86, Math.min(startY, endY)); ctx.lineTo(gx + gw * 0.86, Math.max(startY, endY)); ctx.stroke();
      ctx.fillStyle = accent; ctx.textAlign = "left";
      ctx.fillText("ΔH " + (kind === "exo" ? "(−)" : "(+)"), gx + gw * 0.86 + 6, (startY + endY) / 2);

      ctx.font = "600 10px 'IBM Plex Mono', monospace"; ctx.fillStyle = ink; ctx.textAlign = "left";
      ctx.fillText("Reactants", gx + gw * 0.03, startY - 8);
      ctx.textAlign = "right";
      ctx.fillText("Products", gx + gw * 0.98, endY - 8);
    }
  }
  if (!customElements.get("energy-profile")) customElements.define("energy-profile", EnergyProfile);
})();
