// <rate-sim> — canvas: particles colliding in a flask, rate of successful collisions
// scales with concentration, temperature, surface area (as particle count / speed / size)
// attrs: conc (1-10 relative), temp (0-100 C), surface (1-3: lump/chips/powder), width, height
(function () {
  class RateSim extends HTMLElement {
    connectedCallback() {
      const w = Number(this.getAttribute("width") || 420);
      const h = Number(this.getAttribute("height") || 260);
      const dpr = window.devicePixelRatio || 1;
      this._canvas = document.createElement("canvas");
      this._canvas.width = w * dpr; this._canvas.height = h * dpr;
      this._canvas.style.width = w + "px"; this._canvas.style.height = h + "px";
      this.appendChild(this._canvas);
      this._ctx = this._canvas.getContext("2d");
      this._w = w; this._h = h; this._dpr = dpr;
      this._particles = [];
      this._gasVol = 0; this._hist = []; this._t = 0; this._lastCollide = 0;
      this._last = performance.now();
      const loop = (now) => {
        if (!this.isConnected) return;
        const dt = Math.min((now - this._last) / 1000, 0.05);
        this._last = now; this._t += dt;
        this._step(dt);
        this._draw();
        this._raf = requestAnimationFrame(loop);
      };
      this._raf = requestAnimationFrame(loop);
    }
    disconnectedCallback() { cancelAnimationFrame(this._raf); }

    _params() {
      return {
        conc: Math.max(1, Number(this.getAttribute("conc") || 5)),
        temp: Math.max(0, Number(this.getAttribute("temp") || 20)),
        surface: Math.max(1, Number(this.getAttribute("surface") || 1)),
      };
    }

    _ensureParticles() {
      const { conc } = this._params();
      const n = Math.round(6 + conc * 2.2);
      while (this._particles.length < n) {
        this._particles.push({ x: Math.random() * this._w, y: Math.random() * (this._h - 60) + 10, a: Math.random() * Math.PI * 2 });
      }
      while (this._particles.length > n) this._particles.pop();
    }

    _step(dt) {
      this._ensureParticles();
      const { temp, surface } = this._params();
      const speed = 30 + temp * 1.3;
      const solidCount = 5 + surface * 4; // more, smaller pieces = more surface area
      this._particles.forEach(p => {
        // random walk with drift
        p.a += (Math.random() - 0.5) * 1.2;
        p.x += Math.cos(p.a) * speed * dt;
        p.y += Math.sin(p.a) * speed * dt;
        if (p.x < 10) { p.x = 10; p.a = Math.PI - p.a; }
        if (p.x > this._w - 10) { p.x = this._w - 10; p.a = Math.PI - p.a; }
        if (p.y < 10) { p.y = 10; p.a = -p.a; }
        if (p.y > this._h - 60) { p.y = this._h - 60; p.a = -p.a; }
      });
      // successful-collision rate model: proportional to speed(temp) * conc(count) * surface, with activation-energy-esque threshold from temp
      const rate = (this._particles.length * (speed / 60) * (surface * 0.4 + 0.6)) * 0.14;
      this._gasVol += rate * dt;
      this._hist.push(rate);
      if (this._hist.length > 300) this._hist.shift();
      this._rate = rate; this._solidCount = solidCount;
    }

    _draw() {
      const ctx = this._ctx, w = this._w, h = this._h;
      const ink = "#2b2620", accent = "#e8590c", grey = "#a89d8e", teal = "#66a3a3";
      ctx.setTransform(this._dpr, 0, 0, this._dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      // flask outline
      ctx.strokeStyle = ink; ctx.lineWidth = 2;
      ctx.strokeRect(1, 1, w - 2, h - 62);
      // solid lumps at bottom-ish, count/size reflects surface area setting
      const { surface } = this._params();
      const pieces = Math.round(this._solidCount || 5);
      for (let i = 0; i < pieces; i++) {
        const r = surface >= 3 ? 3 : surface === 2 ? 6 : 12;
        const cx = 20 + (i % 8) * ((w - 40) / 8), cy = h - 90 + Math.floor(i / 8) * 16;
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fillStyle = grey; ctx.fill(); ctx.strokeStyle = ink; ctx.lineWidth = 1; ctx.stroke();
      }
      // particles (acid molecules)
      this._particles.forEach(p => {
        ctx.beginPath(); ctx.arc(p.x, p.y, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = teal; ctx.fill(); ctx.strokeStyle = ink; ctx.lineWidth = 1; ctx.stroke();
      });
      // readouts
      ctx.font = "600 11px 'IBM Plex Mono', monospace"; ctx.textAlign = "left"; ctx.fillStyle = grey;
      ctx.fillText("REACTION RATE", 10, h - 44);
      ctx.fillStyle = accent; ctx.font = "800 14px 'Archivo', sans-serif";
      ctx.fillText((this._rate || 0).toFixed(1) + " units/s", 130, h - 42);
      ctx.font = "600 11px 'IBM Plex Mono', monospace"; ctx.fillStyle = grey;
      ctx.fillText("GAS COLLECTED", 10, h - 26);
      ctx.fillStyle = ink; ctx.font = "800 14px 'Archivo', sans-serif";
      ctx.fillText(this._gasVol.toFixed(0) + " cm³", 130, h - 24);
      // mini rate history sparkline
      const gx = 250, gw = w - gx - 10, gy = h - 56, gh = 46;
      ctx.strokeStyle = ink; ctx.lineWidth = 1; ctx.strokeRect(gx, gy, gw, gh);
      ctx.font = "500 8.5px 'IBM Plex Mono', monospace"; ctx.fillStyle = grey; ctx.textAlign = "left";
      ctx.fillText("RATE OVER TIME", gx + 4, gy + 10);
      const maxR = Math.max(3, ...this._hist);
      ctx.strokeStyle = accent; ctx.lineWidth = 1.5;
      ctx.beginPath();
      this._hist.forEach((v, i) => {
        const px = gx + (i / 299) * gw, py = gy + gh - (v / maxR) * (gh - 14);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      });
      ctx.stroke();
    }
  }
  if (!customElements.get("rate-sim")) customElements.define("rate-sim", RateSim);
})();
