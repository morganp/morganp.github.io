// <photon-jump> — looping canvas animation: electron absorbs energy, jumps up a
// shell, falls back and emits a photon. attrs: width (default 340), height (default 280)
(function () {
  const PHASES = [
    { until: 1.4, cap: "AN ELECTRON RESTS ON ITS FLOOR (LOW ENERGY)" },
    { until: 2.0, cap: "A JOLT OF ENERGY ARRIVES — HEAT OR ELECTRICITY" },
    { until: 2.4, cap: "THE ELECTRON ABSORBS IT AND JUMPS UP A FLOOR" },
    { until: 3.6, cap: "IT CAN'T STAY UP HERE FOR LONG…" },
    { until: 4.0, cap: "IT FALLS BACK DOWN —" },
    { until: 5.8, cap: "— AND SPITS THE ENERGY OUT AS A PHOTON OF LIGHT" },
  ];
  const LOOP = 5.8;

  class PhotonJump extends HTMLElement {
    connectedCallback() {
      const w = Number(this.getAttribute("width") || 340);
      const h = Number(this.getAttribute("height") || 280);
      const dpr = window.devicePixelRatio || 1;
      this.style.display = "inline-block";
      this._canvas = document.createElement("canvas");
      this._canvas.width = w * dpr; this._canvas.height = h * dpr;
      this._canvas.style.width = w + "px"; this._canvas.style.height = h + "px";
      this.appendChild(this._canvas);
      this._ctx = this._canvas.getContext("2d");
      this._w = w; this._h = h; this._dpr = dpr;
      this._t = 0; this._last = performance.now();
      const loop = (now) => {
        if (!this.isConnected) return;
        this._t = (this._t + Math.min((now - this._last) / 1000, 0.05)) % LOOP;
        this._last = now;
        this._draw();
        this._raf = requestAnimationFrame(loop);
      };
      this._raf = requestAnimationFrame(loop);
    }
    disconnectedCallback() { cancelAnimationFrame(this._raf); }

    _draw() {
      const ctx = this._ctx, w = this._w, h = this._h, t = this._t;
      const ink = "#2b2620", ring = "#c9c0b2", accent = "#e8590c", glow = "#fcc419", grey = "#a89d8e";
      const cx = w / 2, cy = h / 2 - 14;
      const r1 = 44, r2 = 88;
      ctx.setTransform(this._dpr, 0, 0, this._dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // rings + labels
      ctx.strokeStyle = ring; ctx.lineWidth = 1.5;
      [r1, r2].forEach((r) => { ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke(); });
      ctx.fillStyle = grey; ctx.font = "600 9px 'IBM Plex Mono', monospace"; ctx.textAlign = "center";
      ctx.fillText("FLOOR 1", cx, cy - r1 - 5);
      ctx.fillText("FLOOR 2", cx, cy - r2 - 5);

      // nucleus cluster
      const nuc = [[0, 0, accent], [7, 3, grey], [-6, 4, grey], [1, -7, accent], [-4, -4, accent], [6, -4, grey]];
      nuc.forEach(([dx, dy, c]) => {
        ctx.beginPath(); ctx.arc(cx + dx, cy + dy, 5.5, 0, Math.PI * 2);
        ctx.fillStyle = c; ctx.fill();
        ctx.strokeStyle = "#faf6ef"; ctx.lineWidth = 1; ctx.stroke();
      });

      // phase machine
      let phase = PHASES.findIndex(p => t < p.until);
      if (phase < 0) phase = PHASES.length - 1;
      const ease = (x) => x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;

      // electron angle: orbits during idle/hold/after, frozen during zap/jump/fall
      const freezeA = 0.9 * 1.4 - Math.PI / 4; // angle when zap starts (matches idle formula at t=1.4)
      let a, r;
      if (t < 1.4) { a = 0.9 * t - Math.PI / 4; r = r1; }
      else if (t < 2.0) { a = freezeA; r = r1; }
      else if (t < 2.4) { a = freezeA; r = r1 + (r2 - r1) * ease((t - 2.0) / 0.4); }
      else if (t < 3.6) { a = freezeA + 0.5 * (t - 2.4); r = r2 + Math.sin((t - 2.4) * 14) * 1.5; }
      else if (t < 4.0) { a = freezeA + 0.5 * 1.2; r = r2 - (r2 - r1) * ease((t - 3.6) / 0.4); }
      else { a = freezeA + 0.6 + 0.9 * (t - 4.0); r = r1; }
      const ex = cx + r * Math.cos(a), ey = cy + r * Math.sin(a);

      // zap bolt (phase 1): zigzag from top-left edge toward electron
      if (t >= 1.4 && t < 2.0) {
        const p = (t - 1.4) / 0.6;
        const sx = 18, sy = 16;
        const tipX = sx + (ex - sx) * Math.min(p * 1.3, 1), tipY = sy + (ey - sy) * Math.min(p * 1.3, 1);
        ctx.strokeStyle = glow; ctx.lineWidth = 2.5;
        ctx.beginPath();
        const segs = 7, dx = (tipX - sx) / segs, dy = (tipY - sy) / segs;
        const nx = -dy, ny = dx, nl = Math.hypot(nx, ny) || 1;
        ctx.moveTo(sx, sy);
        for (let i = 1; i <= segs; i++) {
          const off = (i % 2 ? 6 : -6) * (i < segs ? 1 : 0);
          ctx.lineTo(sx + dx * i + (nx / nl) * off, sy + dy * i + (ny / nl) * off);
        }
        ctx.stroke();
      }

      // photon (phase 5): wave packet travelling outward from fall point
      if (t >= 4.0) {
        const p = (t - 4.0) / 1.8;
        const pa = freezeA + 0.6; // emission direction
        const dist = r1 + 12 + p * (Math.max(w, h) * 0.55);
        const px = cx + dist * Math.cos(pa), py = cy + dist * Math.sin(pa);
        const ux = Math.cos(pa), uy = Math.sin(pa), vx = -uy, vy = ux;
        ctx.strokeStyle = glow; ctx.lineWidth = 2.5;
        ctx.globalAlpha = Math.max(1 - p * 0.9, 0);
        ctx.beginPath();
        for (let k = -20; k <= 20; k++) {
          const along = k * 1.4, amp = Math.sin(k * 0.9) * 6 * Math.exp(-(k * k) / 260);
          const qx = px + ux * along + vx * amp, qy = py + uy * along + vy * amp;
          if (k === -20) ctx.moveTo(qx, qy); else ctx.lineTo(qx, qy);
        }
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      // electron (with glow while excited)
      if (t >= 2.0 && t < 4.0) {
        ctx.beginPath(); ctx.arc(ex, ey, 9, 0, Math.PI * 2);
        ctx.fillStyle = glow; ctx.globalAlpha = 0.4; ctx.fill(); ctx.globalAlpha = 1;
      }
      ctx.beginPath(); ctx.arc(ex, ey, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = ink; ctx.fill();

      // caption
      ctx.fillStyle = ink; ctx.font = "600 10.5px 'IBM Plex Mono', monospace"; ctx.textAlign = "center";
      ctx.fillText(PHASES[phase].cap, cx, h - 12);
    }
  }
  if (!customElements.get("photon-jump")) customElements.define("photon-jump", PhotonJump);
})();
