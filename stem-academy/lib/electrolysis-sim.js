// <electrolysis-sim> — canvas: molten/dissolved ionic compound between two electrodes,
// cations drift to cathode, anions drift to anode, discharge bubbles/deposits at each.
// attrs: width height
(function () {
  class ElectrolysisSim extends HTMLElement {
    connectedCallback() {
      const w = Number(this.getAttribute("width") || 480);
      const h = Number(this.getAttribute("height") || 260);
      const dpr = window.devicePixelRatio || 1;
      this._canvas = document.createElement("canvas");
      this._canvas.width = w * dpr; this._canvas.height = h * dpr;
      this._canvas.style.width = w + "px"; this._canvas.style.height = h + "px";
      this.appendChild(this._canvas);
      this._ctx = this._canvas.getContext("2d");
      this._w = w; this._h = h; this._dpr = dpr;
      this._ions = [];
      for (let i = 0; i < 16; i++) {
        this._ions.push({
          x: w * 0.25 + Math.random() * w * 0.5, y: 30 + Math.random() * (h - 90),
          cation: i % 2 === 0, wobble: Math.random() * Math.PI * 2,
        });
      }
      this._bubbles = []; this._t = 0;
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

    _step(dt) {
      const w = this._w, h = this._h;
      const cathodeX = w * 0.22, anodeX = w * 0.78;
      this._ions.forEach(ion => {
        const targetX = ion.cation ? cathodeX : anodeX;
        ion.x += (targetX - ion.x) * dt * 0.6;
        ion.wobble += dt * 4;
        ion.y += Math.sin(ion.wobble) * 0.4;
        if (Math.abs(ion.x - targetX) < 6) {
          // discharge: pop a bubble/deposit, respawn ion in the middle
          if (Math.random() < 0.02) {
            this._bubbles.push({ x: targetX, y: ion.y, t: 0, cation: ion.cation });
            ion.x = w * 0.35 + Math.random() * w * 0.3;
            ion.y = 30 + Math.random() * (h - 90);
          }
        }
      });
      this._bubbles.forEach(b => { b.t += dt; b.y -= 22 * dt; });
      this._bubbles = this._bubbles.filter(b => b.t < 1.4);
    }

    _draw() {
      const ctx = this._ctx, w = this._w, h = this._h;
      const ink = "#2b2620", accent = "#e8590c", blue = "#4a90d9", grey = "#a89d8e";
      ctx.setTransform(this._dpr, 0, 0, this._dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const liqTop = 20, liqBot = h - 50;
      // container + liquid
      ctx.strokeStyle = ink; ctx.lineWidth = 2;
      ctx.strokeRect(w * 0.1, liqTop, w * 0.8, liqBot - liqTop);
      ctx.fillStyle = "rgba(102,163,163,0.12)";
      ctx.fillRect(w * 0.1 + 1, liqTop + 1, w * 0.8 - 2, liqBot - liqTop - 2);

      // electrodes
      const cathodeX = w * 0.22, anodeX = w * 0.78;
      [cathodeX, anodeX].forEach((x, i) => {
        ctx.fillStyle = "#5b5348";
        ctx.fillRect(x - 5, liqTop - 26, 10, (liqBot - liqTop) + 30);
      });
      ctx.font = "700 11px 'IBM Plex Mono', monospace"; ctx.textAlign = "center"; ctx.fillStyle = ink;
      ctx.fillText("CATHODE (−)", cathodeX, liqTop - 32);
      ctx.fillText("ANODE (+)", anodeX, liqTop - 32);

      // ions
      this._ions.forEach(ion => {
        ctx.beginPath(); ctx.arc(ion.x, ion.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = ion.cation ? accent : blue; ctx.fill();
        ctx.strokeStyle = ink; ctx.lineWidth = 1.2; ctx.stroke();
        ctx.fillStyle = "#faf6ef"; ctx.font = "700 8px 'IBM Plex Mono', monospace"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(ion.cation ? "+" : "−", ion.x, ion.y + 0.5);
      });

      // bubbles/deposits rising
      this._bubbles.forEach(b => {
        ctx.globalAlpha = Math.max(1 - b.t / 1.4, 0);
        ctx.beginPath(); ctx.arc(b.x, b.y, 4, 0, Math.PI * 2);
        ctx.strokeStyle = b.cation ? accent : blue; ctx.lineWidth = 1.5; ctx.stroke();
        ctx.globalAlpha = 1;
      });

      // legend
      ctx.font = "500 10px 'IBM Plex Mono', monospace"; ctx.textAlign = "left"; ctx.fillStyle = grey;
      ctx.fillText("● CATIONS (+) → CATHODE   ● ANIONS (−) → ANODE", w * 0.1, h - 14);
    }
  }
  if (!customElements.get("electrolysis-sim")) customElements.define("electrolysis-sim", ElectrolysisSim);
})();
