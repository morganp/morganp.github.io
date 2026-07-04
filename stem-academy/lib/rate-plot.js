// <rate-plot> — reaction kinetics. Plots how the rate depends on a reactant's
// concentration for zero-, first- and second-order reactions, with the current
// concentration marked. attrs: order (0|1|2), conc (0-1), width, height
(function () {
  const INK = "#2b2620", ORANGE = "#e8590c", GREY = "#a89d8e";
  const K = 1; // rate constant (arbitrary units)

  class RatePlot extends HTMLElement {
    static get observedAttributes() { return ["order", "conc"]; }
    connectedCallback() { this._build(); this._render(); }
    attributeChangedCallback() { if (this._cv) this._render(); }
    _build() {
      this.innerHTML = "";
      const w = Number(this.getAttribute("width") || 620);
      const h = Number(this.getAttribute("height") || 300);
      this._wrap = document.createElement("div"); this._wrap.style.cssText = "width:" + w + "px;";
      this._cv = document.createElement("canvas"); this._cv.width = w; this._cv.height = h - 52;
      this._cv.style.cssText = "width:100%; height:" + (h - 52) + "px; border:2px solid " + INK + "; background:#fbf7f0; display:block;";
      this._read = document.createElement("div"); this._read.style.cssText = "display:flex; gap:10px; margin-top:10px; flex-wrap:wrap;";
      this._wrap.appendChild(this._cv); this._wrap.appendChild(this._read); this.appendChild(this._wrap);
    }
    _rate(order, c) { return K * Math.pow(c, order); }
    _render() {
      const order = Number(this.getAttribute("order") || 1);
      const conc = Math.max(0, Math.min(1, Number(this.getAttribute("conc") || 0.5)));
      const ctx = this._cv.getContext("2d");
      const W = this._cv.width, H = this._cv.height;
      ctx.clearRect(0, 0, W, H);
      const mL = 54, mR = 20, mT = 22, mB = 40;
      const gx0 = mL, gx1 = W - mR, gy0 = mT, gy1 = H - mB;
      // axes
      ctx.strokeStyle = INK; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(gx0, gy0); ctx.lineTo(gx0, gy1); ctx.lineTo(gx1, gy1); ctx.stroke();
      ctx.fillStyle = "#6b6156"; ctx.font = "11px 'IBM Plex Mono', monospace";
      ctx.save(); ctx.translate(16, (gy0 + gy1) / 2); ctx.rotate(-Math.PI / 2); ctx.textAlign = "center"; ctx.fillText("RATE →", 0, 0); ctx.restore();
      ctx.textAlign = "center"; ctx.fillText("CONCENTRATION [A] →", (gx0 + gx1) / 2, H - 8);
      const X = (c) => gx0 + (gx1 - gx0) * c;
      const Y = (r) => gy1 - (gy1 - gy0) * Math.min(1, r);
      // faint other-order curves
      [0, 1, 2].forEach(o => {
        ctx.strokeStyle = o === order ? ORANGE : "rgba(160,150,135,0.35)";
        ctx.lineWidth = o === order ? 3 : 1.3;
        ctx.beginPath();
        for (let px = 0; px <= 100; px++) { const c = px / 100; const x = X(c), y = Y(this._rate(o, c)); px === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
        ctx.stroke();
        // label
        const lc = 0.92; ctx.fillStyle = o === order ? ORANGE : "#b7ad9d"; ctx.font = (o === order ? "bold " : "") + "10px 'IBM Plex Mono', monospace"; ctx.textAlign = "left";
        ctx.fillText("order " + o, X(lc) - 8, Y(this._rate(o, lc)) - 6);
      });
      // current point
      const cx = X(conc), cy = Y(this._rate(order, conc));
      ctx.setLineDash([4, 4]); ctx.strokeStyle = "#2a5d8f"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(cx, gy1); ctx.lineTo(cx, cy); ctx.lineTo(gx0, cy); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = "#2a5d8f"; ctx.beginPath(); ctx.arc(cx, cy, 5, 0, 7); ctx.fill();

      const rate = this._rate(order, conc);
      const doubled = this._rate(order, Math.min(1, conc * 2));
      const factor = rate > 0 ? (doubled / rate) : (order === 0 ? 1 : 0);
      const chip = (l, v, hi) => '<div style="border:1.5px solid ' + INK + '; background:' + (hi ? ORANGE : "#fff") + '; color:' + (hi ? "#faf6ef" : INK) + '; padding:8px 12px; font-family:\'IBM Plex Mono\',monospace; font-size:12px;"><span style="opacity:.75; font-size:10px; display:block;">' + l + '</span><b style="font-size:15px;">' + v + '</b></div>';
      const dblNote = order === 0 ? "no change (×1)" : order === 1 ? "doubles (×2)" : "quadruples (×4)";
      this._read.innerHTML =
        chip("RATE = k[A]^" + order, rate.toFixed(2) + " (rel.)", true) +
        chip("[A] NOW", conc.toFixed(2)) +
        chip("DOUBLE [A] →", "rate " + dblNote) +
        '<div style="flex:1; min-width:150px; align-self:center; font-family:\'IBM Plex Mono\',monospace; font-size:11px; color:#6b6156;">The shape of the rate–concentration graph tells you the order directly.</div>';
    }
  }
  if (!customElements.get("rate-plot")) customElements.define("rate-plot", RatePlot);
})();
