// <decay-sim> — radioactive decay lab. A grid of unstable nuclei decay at random;
// the population halves every half-life. Shows the live grid + a decay curve with
// half-life markers. attrs: halflife (seconds), resetkey, width, height
(function () {
  const INK = "#2b2620", ORANGE = "#e8590c", GREY = "#b8b0a3", GREEN = "#2f7d3a";
  const N = 400, COLS = 25, ROWS = 16;

  class DecaySim extends HTMLElement {
    static get observedAttributes() { return ["halflife", "resetkey"]; }
    connectedCallback() { this._build(); this._reset(); this._loop = this._loop.bind(this); this._last = performance.now(); this._raf = requestAnimationFrame(this._loop); }
    disconnectedCallback() { cancelAnimationFrame(this._raf); }
    attributeChangedCallback(n) { if (n === "resetkey") this._reset(); }
    _build() {
      this.innerHTML = "";
      const w = Number(this.getAttribute("width") || 720);
      const h = Number(this.getAttribute("height") || 320);
      this._wrap = document.createElement("div"); this._wrap.style.cssText = "width:" + w + "px;";
      this._cv = document.createElement("canvas"); this._cv.width = w; this._cv.height = h - 52;
      this._cv.style.cssText = "width:100%; height:" + (h - 52) + "px; border:2px solid " + INK + "; background:#fbf7f0; display:block;";
      this._read = document.createElement("div"); this._read.style.cssText = "display:flex; gap:10px; margin-top:10px; flex-wrap:wrap;";
      this._wrap.appendChild(this._cv); this._wrap.appendChild(this._read); this.appendChild(this._wrap);
    }
    _reset() {
      this.state = new Array(N).fill(false); // false = intact, true = decayed
      this.t = 0; this.history = [{ t: 0, n: N }];
      this._last = performance.now();
    }
    _loop(now) {
      const hl = Math.max(1, Number(this.getAttribute("halflife") || 6));
      let dt = (now - this._last) / 1000; this._last = now;
      if (dt > 0.1) dt = 0.1;
      this.t += dt;
      // decay constant lambda = ln2 / halflife; each intact nucleus decays with prob lambda*dt
      const lambda = Math.LN2 / hl;
      const p = lambda * dt;
      let remaining = 0;
      for (let i = 0; i < N; i++) {
        if (!this.state[i]) { if (Math.random() < p) this.state[i] = true; }
        if (!this.state[i]) remaining++;
      }
      const last = this.history[this.history.length - 1];
      if (this.t - last.t > 0.15) this.history.push({ t: this.t, n: remaining });
      this._render(remaining, hl);
      this._raf = requestAnimationFrame(this._loop);
    }
    _render(remaining, hl) {
      const ctx = this._cv.getContext("2d");
      const W = this._cv.width, H = this._cv.height;
      ctx.clearRect(0, 0, W, H);
      // left: grid of nuclei
      const gridW = W * 0.46, pad = 16;
      const cw = (gridW - pad * 2) / COLS, ch = (H - pad * 2) / ROWS;
      const r = Math.min(cw, ch) * 0.32;
      for (let i = 0; i < N; i++) {
        const c = i % COLS, row = Math.floor(i / COLS);
        const x = pad + c * cw + cw / 2, y = pad + row * ch + ch / 2;
        ctx.fillStyle = this.state[i] ? GREY : ORANGE;
        ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
      }
      ctx.fillStyle = "#6b6156"; ctx.font = "10px 'IBM Plex Mono', monospace"; ctx.textAlign = "left";
      ctx.fillText("● undecayed   ● decayed (daughter)", pad, H - 4);

      // right: decay curve
      const gx0 = W * 0.52, gx1 = W - 20, gy0 = 24, gy1 = H - 34;
      // axes
      ctx.strokeStyle = INK; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(gx0, gy0); ctx.lineTo(gx0, gy1); ctx.lineTo(gx1, gy1); ctx.stroke();
      ctx.fillStyle = "#6b6156"; ctx.font = "10px 'IBM Plex Mono', monospace"; ctx.textAlign = "right";
      ctx.fillText("nuclei", gx0 - 4, gy0 + 4); ctx.textAlign = "center";
      ctx.fillText("time →", (gx0 + gx1) / 2, H - 6);
      const tMax = Math.max(hl * 5, this.t, 4);
      const X = (t) => gx0 + (gx1 - gx0) * (t / tMax);
      const Y = (n) => gy1 - (gy1 - gy0) * (n / N);
      // half-life dashed markers
      ctx.setLineDash([4, 4]); ctx.strokeStyle = "#d8c7a8"; ctx.lineWidth = 1;
      for (let k = 1; k <= 5; k++) {
        const t = hl * k; if (t > tMax) break;
        ctx.beginPath(); ctx.moveTo(X(t), gy0); ctx.lineTo(X(t), gy1); ctx.stroke();
        const frac = N / Math.pow(2, k);
        ctx.beginPath(); ctx.moveTo(gx0, Y(frac)); ctx.lineTo(gx1, Y(frac)); ctx.stroke();
      }
      ctx.setLineDash([]);
      // theoretical curve
      ctx.strokeStyle = "rgba(43,38,32,0.35)"; ctx.lineWidth = 1.5; ctx.beginPath();
      for (let px = 0; px <= 100; px++) { const t = tMax * px / 100; const n = N * Math.pow(0.5, t / hl); const x = X(t), y = Y(n); px === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
      ctx.stroke();
      // actual history
      ctx.strokeStyle = ORANGE; ctx.lineWidth = 2.5; ctx.beginPath();
      this.history.forEach((h, i) => { const x = X(h.t), y = Y(h.n); i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); });
      ctx.stroke();
      // half-life labels
      ctx.fillStyle = "#a89d8e"; ctx.font = "9px 'IBM Plex Mono', monospace"; ctx.textAlign = "center";
      for (let k = 1; k <= 4; k++) { const t = hl * k; if (t > tMax) break; ctx.fillText(k + "×½-life", X(t), gy1 + 12); }

      const chip = (l, v, hi) => '<div style="border:1.5px solid ' + INK + '; background:' + (hi ? ORANGE : "#fff") + '; color:' + (hi ? "#faf6ef" : INK) + '; padding:8px 12px; font-family:\'IBM Plex Mono\',monospace; font-size:12px;"><span style="opacity:.75; font-size:10px; display:block;">' + l + '</span><b style="font-size:15px;">' + v + '</b></div>';
      this._read.innerHTML =
        chip("NUCLEI REMAINING", remaining + " / " + N, true) +
        chip("% LEFT", Math.round(remaining / N * 100) + "%") +
        chip("TIME ELAPSED", this.t.toFixed(1) + " s") +
        chip("HALF-LIVES PASSED", (this.t / hl).toFixed(2)) +
        '<div style="flex:1; min-width:140px; align-self:center; font-family:\'IBM Plex Mono\',monospace; font-size:11px; color:#6b6156;">Orange curve = your sample. Faint curve = the perfect theory.</div>';
    }
  }
  if (!customElements.get("decay-sim")) customElements.define("decay-sim", DecaySim);
})();
