// <collision-sim> — 1D collision lab. Two carts on a track collide; final velocities
// follow conservation of momentum with a coefficient of restitution e (1 = perfectly
// elastic, 0 = they stick). Live momentum tally before & after.
// attrs: m1, m2, v1, v2 (px units), e (0-1), resetkey, width, height
(function () {
  const INK = "#2b2620", ORANGE = "#e8590c", BLUE = "#2a5d8f", GREEN = "#2f7d3a", GREY = "#a89d8e";

  class CollisionSim extends HTMLElement {
    static get observedAttributes() { return ["m1", "m2", "v1", "v2", "e", "resetkey"]; }
    connectedCallback() { this._build(); this._reset(); this._loop = this._loop.bind(this); this._raf = requestAnimationFrame(this._loop); }
    disconnectedCallback() { cancelAnimationFrame(this._raf); }
    attributeChangedCallback(n) { if (n === "resetkey") this._reset(); else this._reset(); }
    _build() {
      this.innerHTML = "";
      const w = Number(this.getAttribute("width") || 700);
      const h = Number(this.getAttribute("height") || 300);
      this._wrap = document.createElement("div"); this._wrap.style.cssText = "width:" + w + "px;";
      this._cv = document.createElement("canvas"); this._cv.width = w; this._cv.height = h - 52;
      this._cv.style.cssText = "width:100%; height:" + (h - 52) + "px; border:2px solid " + INK + "; background:#fbf7f0; display:block;";
      this._read = document.createElement("div"); this._read.style.cssText = "display:flex; gap:10px; margin-top:10px; flex-wrap:wrap;";
      this._wrap.appendChild(this._cv); this._wrap.appendChild(this._read); this.appendChild(this._wrap);
    }
    _reset() {
      const W = this._cv ? this._cv.width : 700;
      this.m1 = Number(this.getAttribute("m1") || 2);
      this.m2 = Number(this.getAttribute("m2") || 4);
      this.v1 = Number(this.getAttribute("v1") || 3);
      this.v2 = Number(this.getAttribute("v2") || -1);
      this.e = Math.max(0, Math.min(1, Number(this.getAttribute("e") || 1)));
      this.x1 = W * 0.25; this.x2 = W * 0.7;
      this.done = false;
      this.pBefore = (this.m1 * this.v1 + this.m2 * this.v2);
      this._render();
    }
    _radius(m) { return 14 + m * 5; }
    _loop() {
      const cv = this._cv; if (!cv) return;
      const W = cv.width, H = cv.height;
      const r1 = this._radius(this.m1), r2 = this._radius(this.m2);
      const dt = 1;
      this.x1 += this.v1 * dt; this.x2 += this.v2 * dt;
      // collision
      if (!this.done && this.x2 - this.x1 <= r1 + r2 && (this.v1 - this.v2) > 0) {
        const m1 = this.m1, m2 = this.m2, u1 = this.v1, u2 = this.v2, e = this.e;
        // 1D restitution equations
        this.v1 = (m1 * u1 + m2 * u2 - m2 * e * (u1 - u2)) / (m1 + m2);
        this.v2 = (m1 * u1 + m2 * u2 + m1 * e * (u1 - u2)) / (m1 + m2);
        // separate to avoid sticking overlap when e>0
        const overlap = (r1 + r2) - (this.x2 - this.x1);
        this.x1 -= overlap / 2; this.x2 += overlap / 2;
        this.done = true;
      }
      // walls bounce (keep on screen)
      if (this.x1 < r1 + 4) { this.x1 = r1 + 4; this.v1 = Math.abs(this.v1); }
      if (this.x2 > W - r2 - 4) { this.x2 = W - r2 - 4; this.v2 = -Math.abs(this.v2); }
      if (this.x1 > W - r1 - 4) { this.x1 = W - r1 - 4; this.v1 = -Math.abs(this.v1); }
      if (this.x2 < r2 + 4) { this.x2 = r2 + 4; this.v2 = Math.abs(this.v2); }
      this._render();
      this._raf = requestAnimationFrame(this._loop);
    }
    _render() {
      const ctx = this._cv.getContext("2d");
      const W = this._cv.width, H = this._cv.height;
      ctx.clearRect(0, 0, W, H);
      const trackY = H * 0.62;
      // track
      ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(10, trackY + 30); ctx.lineTo(W - 10, trackY + 30); ctx.stroke();
      for (let x = 20; x < W - 10; x += 22) { ctx.strokeStyle = GREY; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x, trackY + 30); ctx.lineTo(x - 8, trackY + 38); ctx.stroke(); }
      const r1 = this._radius(this.m1), r2 = this._radius(this.m2);
      const ball = (x, r, m, v, col, label) => {
        ctx.fillStyle = col; ctx.strokeStyle = INK; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(x, trackY, r, 0, 7); ctx.fill(); ctx.stroke();
        ctx.fillStyle = "#fff"; ctx.font = "bold 12px 'IBM Plex Mono', monospace"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(m + "kg", x, trackY);
        // velocity arrow
        ctx.textBaseline = "alphabetic";
        if (Math.abs(v) > 0.05) {
          const dir = v > 0 ? 1 : -1, len = Math.min(60, Math.abs(v) * 14);
          ctx.strokeStyle = col; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.moveTo(x, trackY - r - 14); ctx.lineTo(x + dir * len, trackY - r - 14); ctx.stroke();
          ctx.fillStyle = col; ctx.beginPath();
          ctx.moveTo(x + dir * len + dir * 12, trackY - r - 14); ctx.lineTo(x + dir * len, trackY - r - 20); ctx.lineTo(x + dir * len, trackY - r - 8); ctx.closePath(); ctx.fill();
        }
        ctx.fillStyle = INK; ctx.font = "11px 'IBM Plex Mono', monospace"; ctx.textAlign = "center";
        ctx.fillText(label + " v=" + v.toFixed(1), x, trackY - r - 24);
      };
      ball(this.x1, r1, this.m1, this.v1, ORANGE, "A");
      ball(this.x2, r2, this.m2, this.v2, BLUE, "B");

      const pNow = (this.m1 * this.v1 + this.m2 * this.v2);
      const chip = (l, v, hi) => '<div style="border:1.5px solid ' + INK + '; background:' + (hi ? ORANGE : "#fff") + '; color:' + (hi ? "#faf6ef" : INK) + '; padding:8px 12px; font-family:\'IBM Plex Mono\',monospace; font-size:12px;"><span style="opacity:.75; font-size:10px; display:block;">' + l + '</span><b style="font-size:15px;">' + v + '</b></div>';
      const conserved = Math.abs(pNow - this.pBefore) < 0.4;
      this._read.innerHTML =
        chip("TOTAL MOMENTUM NOW", pNow.toFixed(1) + " kg·m/s", true) +
        chip("BEFORE COLLISION", this.pBefore.toFixed(1) + " kg·m/s") +
        chip("STATUS", this.done ? (this.e >= 0.99 ? "ELASTIC BOUNCE" : this.e <= 0.01 ? "STUCK TOGETHER" : "PARTLY ELASTIC") : "APPROACHING") +
        '<div style="flex:1; min-width:150px; align-self:center; font-family:\'IBM Plex Mono\',monospace; font-size:11px; color:' + (conserved ? "#2f7d3a" : "#6b6156") + ';">' + (conserved ? "✓ Momentum is conserved — the total is unchanged by the crash." : "Total momentum stays constant through the collision.") + '</div>';
    }
  }
  if (!customElements.get("collision-sim")) customElements.define("collision-sim", CollisionSim);
})();
