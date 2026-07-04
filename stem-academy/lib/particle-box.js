// <particle-box> — canvas particle simulation of a state of matter
// attrs: state="solid|liquid|gas|plasma"  width  height
(function () {
  const N = 42;
  class ParticleBox extends HTMLElement {
    static get observedAttributes() { return ["state"]; }

    connectedCallback() {
      const w = Number(this.getAttribute("width") || 300);
      const h = Number(this.getAttribute("height") || 220);
      const dpr = window.devicePixelRatio || 1;
      this.style.display = "inline-block";
      this._canvas = document.createElement("canvas");
      this._canvas.width = w * dpr; this._canvas.height = h * dpr;
      this._canvas.style.width = w + "px"; this._canvas.style.height = h + "px";
      this.appendChild(this._canvas);
      this._ctx = this._canvas.getContext("2d");
      this._w = w; this._h = h; this._dpr = dpr;

      // particles
      this._ps = [];
      for (let i = 0; i < N; i++) {
        this._ps.push({
          x: Math.random() * w, y: Math.random() * h,
          vx: 0, vy: 0, phase: Math.random() * Math.PI * 2,
        });
      }
      this._t = 0; this._last = performance.now();
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
    attributeChangedCallback() { /* read each frame */ }

    _lattice(i) {
      // compact packed block (not spanning the whole box) — reads as "solid" vs gas filling everything
      const cols = 7, rows = 6;
      const spacing = 15; // tight, particle-diameter-ish spacing
      const blockW = (cols - 1) * spacing, blockH = (rows - 1) * spacing;
      const startX = this._w / 2 - blockW / 2;
      const startY = this._h - 22 - blockH; // sits on the "floor" like a resting block
      const gx = i % cols, gy = Math.floor(i / cols);
      return { x: startX + gx * spacing, y: startY + gy * spacing };
    }

    _step(dt) {
      const st = this.getAttribute("state") || "solid";
      const w = this._w, h = this._h, m = 9; // margin = radius
      this._ps.forEach((p, i) => {
        if (st === "solid") {
          const L = this._lattice(i);
          const jx = Math.sin(this._t * 9 + p.phase) * 1.6;
          const jy = Math.cos(this._t * 8 + p.phase * 1.3) * 1.6;
          // gentle ease-in to the lattice spot, so settling into a solid reads as
          // a real animation rather than an instant snap
          const settle = 1 - Math.exp(-dt * 1.8);
          p.x += ((L.x + jx) - p.x) * settle;
          p.y += ((L.y + jy) - p.y) * settle;
          p.vx = p.vy = 0;
        } else {
          const speed = st === "liquid" ? 26 : st === "gas" ? 95 : 170;
          // random nudge
          p.vx += (Math.random() - 0.5) * speed * dt * 6;
          p.vy += (Math.random() - 0.5) * speed * dt * 6;
          if (st === "liquid") p.vy += 40 * dt; // gravity: pool at bottom
          // clamp speed
          const sp = Math.hypot(p.vx, p.vy) || 1, cap = speed;
          if (sp > cap) { p.vx *= cap / sp; p.vy *= cap / sp; }
          p.x += p.vx * dt; p.y += p.vy * dt;
          // walls
          if (p.x < m) { p.x = m; p.vx = Math.abs(p.vx); }
          if (p.x > w - m) { p.x = w - m; p.vx = -Math.abs(p.vx); }
          if (p.y < m) { p.y = m; p.vy = Math.abs(p.vy); }
          if (p.y > h - m) { p.y = h - m; p.vy = -Math.abs(p.vy) * (st === "liquid" ? 0.3 : 1); }
          // liquid cohesion: soft repel/attract neighbours (cheap pass)
          if (st === "liquid") {
            for (let j = i + 1; j < this._ps.length; j++) {
              const q = this._ps[j];
              const dx = q.x - p.x, dy = q.y - p.y, d = Math.hypot(dx, dy);
              if (d > 0 && d < 18) { const f = (18 - d) * 2.2 * dt; p.x -= (dx / d) * f; p.y -= (dy / d) * f; q.x += (dx / d) * f; q.y += (dy / d) * f; }
            }
          }
        }
      });
    }

    _draw() {
      const ctx = this._ctx, w = this._w, h = this._h;
      const st = this.getAttribute("state") || "solid";
      ctx.setTransform(this._dpr, 0, 0, this._dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      // container
      ctx.strokeStyle = "#2b2620"; ctx.lineWidth = 2;
      ctx.strokeRect(1, 1, w - 2, h - 2);

      this._ps.forEach((p) => {
        if (st === "plasma") {
          // glow
          ctx.beginPath(); ctx.arc(p.x, p.y, 11, 0, Math.PI * 2);
          ctx.fillStyle = "#fcc419"; ctx.globalAlpha = 0.25; ctx.fill(); ctx.globalAlpha = 1;
        }
        ctx.beginPath(); ctx.arc(p.x, p.y, 7, 0, Math.PI * 2);
        ctx.fillStyle = st === "plasma" ? "#e8590c" : "#a89d8e";
        ctx.fill();
        ctx.strokeStyle = "#2b2620"; ctx.lineWidth = 1.2; ctx.stroke();
        if (st === "plasma") {
          // stripped electron zipping nearby
          const ea = this._t * 7 + p.phase * 5;
          ctx.beginPath(); ctx.arc(p.x + Math.cos(ea) * 14, p.y + Math.sin(ea) * 14, 2.2, 0, Math.PI * 2);
          ctx.fillStyle = "#2b2620"; ctx.fill();
        }
      });
    }
  }
  if (!customElements.get("particle-box")) customElements.define("particle-box", ParticleBox);
})();
