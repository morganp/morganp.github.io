// <force-sim> — push-a-crate physics sandbox (canvas web component)
// attrs: force (N), mass (kg), mu (friction coeff), resetkey, width, height
(function () {
  const G = 9.8;
  class ForceSim extends HTMLElement {
    static get observedAttributes() { return ["force", "mass", "mu", "resetkey"]; }

    connectedCallback() {
      const w = Number(this.getAttribute("width") || 640);
      const h = Number(this.getAttribute("height") || 400);
      const dpr = window.devicePixelRatio || 1;
      this.style.display = "inline-block";
      this._canvas = document.createElement("canvas");
      this._canvas.width = w * dpr; this._canvas.height = h * dpr;
      this._canvas.style.width = w + "px"; this._canvas.style.height = h + "px";
      this.appendChild(this._canvas);
      this._ctx = this._canvas.getContext("2d");
      this._w = w; this._h = h; this._dpr = dpr;
      this._reset();
      this._last = performance.now();
      const loop = (now) => {
        if (!this.isConnected) return;
        const dt = Math.min((now - this._last) / 1000, 0.05);
        this._last = now;
        this._step(dt);
        this._draw();
        this._raf = requestAnimationFrame(loop);
      };
      this._raf = requestAnimationFrame(loop);
    }
    disconnectedCallback() { cancelAnimationFrame(this._raf); }
    attributeChangedCallback(name) { if (name === "resetkey") this._reset(); }

    _reset() { this._x = 0; this._v = 0; this._t = 0; this._hist = []; }

    _params() {
      return {
        F: Number(this.getAttribute("force") || 0),
        m: Math.max(Number(this.getAttribute("mass") || 10), 1),
        mu: Math.max(Number(this.getAttribute("mu") || 0.2), 0),
      };
    }

    _step(dt) {
      const { F, m, mu } = this._params();
      const fMax = mu * m * G;
      let fFric, a;
      if (Math.abs(this._v) < 0.02) {
        if (Math.abs(F) <= fMax) { this._v = 0; fFric = -F; a = 0; }
        else { fFric = -Math.sign(F) * fMax; a = (F + fFric) / m; }
      } else {
        fFric = -Math.sign(this._v) * fMax;
        a = (F + fFric) / m;
        const nv = this._v + a * dt;
        if (Math.sign(nv) !== Math.sign(this._v)) { // friction stopped it
          if (Math.abs(F) <= fMax) { this._v = 0; a = 0; }
        }
      }
      this._v += a * dt;
      if (Math.abs(this._v) < 0.02 && Math.abs(F) <= fMax) this._v = 0;
      this._x += this._v * dt;
      this._t += dt;
      this._a = a; this._fFric = fFric;
      this._hist.push(this._v);
      if (this._hist.length > 360) this._hist.shift();
    }

    _arrow(x1, y1, x2, y2, color, label) {
      const ctx = this._ctx;
      if (Math.hypot(x2 - x1, y2 - y1) < 4) return;
      ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      const ang = Math.atan2(y2 - y1, x2 - x1);
      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - 9 * Math.cos(ang - 0.45), y2 - 9 * Math.sin(ang - 0.45));
      ctx.lineTo(x2 - 9 * Math.cos(ang + 0.45), y2 - 9 * Math.sin(ang + 0.45));
      ctx.fill();
      if (label) {
        ctx.font = "600 10px 'IBM Plex Mono', monospace";
        ctx.textAlign = "center";
        ctx.fillText(label, (x1 + x2) / 2, y1 < y2 ? y2 + 14 : Math.min(y1, y2) - 12);
      }
    }

    _draw() {
      const ctx = this._ctx, w = this._w, h = this._h;
      const { F, m, mu } = this._params();
      const ink = "#2b2620", grey = "#a89d8e", accent = "#e8590c", teal = "#66a3a3";
      ctx.setTransform(this._dpr, 0, 0, this._dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const groundY = 218;
      const cx = w / 2;
      const crateW = 26 + Math.sqrt(m) * 10; // size hints at mass
      const crateH = crateW * 0.8;

      // scrolling ground ticks (treadmill: crate fixed, world moves)
      const pxm = 14;
      ctx.strokeStyle = ink; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(0, groundY); ctx.lineTo(w, groundY); ctx.stroke();
      ctx.font = "500 9px 'IBM Plex Mono', monospace"; ctx.fillStyle = grey; ctx.textAlign = "center";
      const firstMark = Math.floor((this._x - cx / pxm) / 5) * 5;
      for (let k = firstMark; k < this._x + cx / pxm + 5; k += 5) {
        const px = cx + (k - this._x) * pxm;
        if (px < -20 || px > w + 20) continue;
        ctx.strokeStyle = "#c9c0b2"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(px, groundY); ctx.lineTo(px, groundY + 8); ctx.stroke();
        ctx.fillText(k + " m", px, groundY + 20);
      }

      // crate
      const cy = groundY - crateH;
      ctx.fillStyle = "#fff"; ctx.strokeStyle = ink; ctx.lineWidth = 2;
      ctx.fillRect(cx - crateW / 2, cy, crateW, crateH);
      ctx.strokeRect(cx - crateW / 2, cy, crateW, crateH);
      ctx.beginPath(); ctx.moveTo(cx - crateW / 2, cy); ctx.lineTo(cx + crateW / 2, cy + crateH); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx + crateW / 2, cy); ctx.lineTo(cx - crateW / 2, cy + crateH); ctx.stroke();
      ctx.font = "800 12px 'Archivo', sans-serif"; ctx.fillStyle = ink; ctx.textAlign = "center";
      ctx.fillText(m + " kg", cx, cy - 32);

      // force arrows (free-body)
      const fScale = 0.55;
      const midY = cy + crateH / 2;
      if (F !== 0) this._arrow(cx + Math.sign(F) * crateW / 2, midY, cx + Math.sign(F) * (crateW / 2 + Math.abs(F) * fScale), midY, accent, "PUSH " + Math.abs(F) + " N");
      const fr = Math.abs(this._fFric || 0);
      if (fr > 0.5) {
        const dir = Math.sign(this._fFric);
        this._arrow(cx, groundY - 6, cx + dir * fr * fScale, groundY - 6, teal, "");
        ctx.font = "600 10px 'IBM Plex Mono', monospace"; ctx.fillStyle = teal; ctx.textAlign = "center";
        ctx.fillText("FRICTION " + fr.toFixed(0) + " N", cx + dir * fr * fScale * 0.5, groundY + 34);
      }
      const wgt = m * G;
      this._arrow(cx, cy + crateH / 2, cx, cy + crateH / 2 + 34, grey, "");
      this._arrow(cx, cy + crateH / 2, cx, cy + crateH / 2 - 34, grey, "");

      // readouts
      ctx.font = "600 11px 'IBM Plex Mono', monospace"; ctx.textAlign = "left";
      const net = F + (this._fFric || 0);
      const rows = [
        ["NET FORCE", net.toFixed(0) + " N", accent],
        ["ACCELERATION", (this._a || 0).toFixed(1) + " m/s²", ink],
        ["VELOCITY", this._v.toFixed(1) + " m/s", ink],
        ["DISTANCE", this._x.toFixed(1) + " m", ink],
        ["WEIGHT = NORMAL", wgt.toFixed(0) + " N", grey],
      ];
      rows.forEach(([k, v, c], i) => {
        ctx.fillStyle = grey; ctx.fillText(k, 14, 22 + i * 17);
        ctx.fillStyle = c; ctx.fillText(v, 130, 22 + i * 17);
      });

      // velocity-time graph
      const gy = 258, gh = h - gy - 14, gw = w - 28;
      ctx.strokeStyle = ink; ctx.lineWidth = 1.5;
      ctx.strokeRect(14, gy, gw, gh);
      ctx.font = "600 9px 'IBM Plex Mono', monospace"; ctx.fillStyle = grey; ctx.textAlign = "left";
      ctx.fillText("VELOCITY–TIME GRAPH (LIVE) · SCALE ±" + Math.ceil(Math.max(5, ...this._hist.map(Math.abs))) + " m/s", 20, gy + 14);
      const vmax = Math.max(5, ...this._hist.map(Math.abs));
      ctx.strokeStyle = "#e6dfd2"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(14, gy + gh / 2); ctx.lineTo(14 + gw, gy + gh / 2); ctx.stroke();
      ctx.strokeStyle = accent; ctx.lineWidth = 2;
      ctx.beginPath();
      this._hist.forEach((v, i) => {
        const px = 14 + (i / 359) * gw;
        const py = gy + gh / 2 - Math.max(Math.min(v / vmax, 1), -1) * (gh / 2 - 4);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      });
      ctx.stroke();
    }
  }
  if (!customElements.get("force-sim")) customElements.define("force-sim", ForceSim);
})();
