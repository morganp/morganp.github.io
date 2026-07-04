// <circuit-sim> — animated circuit. A battery drives current round a loop; bulbs
// glow by the power they dissipate. Modes: single / series (2 bulbs) / parallel (2 bulbs).
// attrs: voltage (V), resistance (ohms, per bulb), mode, width, height
(function () {
  const INK = "#2b2620", ORANGE = "#e8590c", GREY = "#c9c0b2", PAPER = "#faf6ef";

  class CircuitSim extends HTMLElement {
    static get observedAttributes() { return ["voltage", "resistance", "mode"]; }
    connectedCallback() {
      this._build();
      this._t = 0;
      this._loop = this._loop.bind(this);
      this._raf = requestAnimationFrame(this._loop);
    }
    disconnectedCallback() { cancelAnimationFrame(this._raf); }
    attributeChangedCallback() { this._readout(); }
    _build() {
      this.innerHTML = "";
      const w = Number(this.getAttribute("width") || 640);
      const h = Number(this.getAttribute("height") || 320);
      this._w = w; this._h = h;
      this._wrap = document.createElement("div"); this._wrap.style.cssText = "width:" + w + "px;";
      this._cv = document.createElement("canvas"); this._cv.width = w; this._cv.height = h - 52;
      this._cv.style.cssText = "width:100%; height:" + (h - 52) + "px; border:2px solid " + INK + "; background:#111014; display:block;";
      this._read = document.createElement("div");
      this._read.style.cssText = "display:flex; gap:10px; margin-top:10px; flex-wrap:wrap;";
      this._wrap.appendChild(this._cv); this._wrap.appendChild(this._read); this.appendChild(this._wrap);
      this._readout();
    }
    _vals() {
      const V = Number(this.getAttribute("voltage") || 6);
      const R = Math.max(0.5, Number(this.getAttribute("resistance") || 4));
      const mode = this.getAttribute("mode") || "single";
      let Rtot, I, perBulb;
      if (mode === "series") { Rtot = 2 * R; I = V / Rtot; perBulb = I; }
      else if (mode === "parallel") { Rtot = R / 2; I = V / Rtot; perBulb = I / 2; }
      else { Rtot = R; I = V / Rtot; perBulb = I; }
      return { V, R, mode, Rtot, I, perBulb };
    }
    _readout() {
      const { V, I, Rtot, mode } = this._vals();
      const chip = (l, v, hi) => '<div style="border:1.5px solid ' + INK + '; background:' + (hi ? ORANGE : "#fff") + '; color:' + (hi ? PAPER : INK) + '; padding:8px 12px; font-family:\'IBM Plex Mono\',monospace; font-size:12px;"><span style="opacity:.75; font-size:10px; display:block;">' + l + '</span><b style="font-size:16px;">' + v + '</b></div>';
      const P = V * I;
      const note = mode === "series" ? "Series: one loop — current is the SAME everywhere, voltage shares out." :
        mode === "parallel" ? "Parallel: current SPLITS between branches — each bulb gets the full voltage." :
        "Ohm's law: current = voltage ÷ resistance.";
      if (this._read) this._read.innerHTML =
        chip("CURRENT I", I.toFixed(2) + " A", true) +
        chip("TOTAL RESISTANCE", Rtot.toFixed(1) + " Ω") +
        chip("POWER", P.toFixed(1) + " W") +
        '<div style="flex:1; min-width:150px; align-self:center; font-family:\'IBM Plex Mono\',monospace; font-size:11px; color:#6b6156;">' + note + '</div>';
    }
    _loop() {
      const { I, mode, perBulb, R } = this._vals();
      const ctx = this._cv.getContext("2d");
      const W = this._cv.width, H = this._cv.height;
      ctx.clearRect(0, 0, W, H);
      this._t += 0.02 + I * 0.02;

      const L = 70, Rt = W - 70, T = 55, B = H - 45;
      ctx.strokeStyle = "#5a5550"; ctx.lineWidth = 3;
      ctx.lineJoin = "round";

      // draw battery on left side (middle)
      const by = (T + B) / 2;
      const drawWire = (pts) => { ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]); ctx.stroke(); };

      // brightness helper
      const glow = Math.min(1, perBulb * R / 8);
      const drawBulb = (x, y, br, label) => {
        const g = Math.min(1, br);
        ctx.beginPath(); ctx.arc(x, y, 16, 0, 7);
        ctx.fillStyle = "rgba(20,18,16,0.9)"; ctx.fill();
        if (g > 0.02) {
          const grd = ctx.createRadialGradient(x, y, 2, x, y, 34);
          grd.addColorStop(0, "rgba(255,220,120," + (0.35 + g * 0.65) + ")");
          grd.addColorStop(1, "rgba(255,220,120,0)");
          ctx.fillStyle = grd; ctx.beginPath(); ctx.arc(x, y, 34, 0, 7); ctx.fill();
          ctx.fillStyle = "rgba(255," + Math.round(200 + g * 55) + "," + Math.round(90 + g * 120) + ",1)";
          ctx.beginPath(); ctx.arc(x, y, 12, 0, 7); ctx.fill();
        }
        ctx.strokeStyle = "#8a857f"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, 16, 0, 7); ctx.stroke();
        // filament x
        ctx.strokeStyle = g > 0.02 ? "#fff3c4" : "#6a655f"; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(x - 7, y - 7); ctx.lineTo(x + 7, y + 7); ctx.moveTo(x + 7, y - 7); ctx.lineTo(x - 7, y + 7); ctx.stroke();
        if (label) { ctx.fillStyle = "#cfc8bf"; ctx.font = "10px 'IBM Plex Mono', monospace"; ctx.textAlign = "center"; ctx.fillText(label, x, y + 32); }
        ctx.strokeStyle = "#5a5550"; ctx.lineWidth = 3;
      };

      // battery symbol
      const drawBattery = (x, y) => {
        ctx.strokeStyle = "#e8590c"; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(x - 3, y - 16); ctx.lineTo(x - 3, y + 16); ctx.stroke(); // long +
        ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x + 6, y - 9); ctx.lineTo(x + 6, y + 9); ctx.stroke(); // short -
        ctx.fillStyle = "#e8590c"; ctx.font = "12px 'IBM Plex Mono', monospace"; ctx.textAlign = "center";
        ctx.fillText("+", x - 12, y - 6); ctx.fillText("−", x + 16, y - 6);
        ctx.strokeStyle = "#5a5550"; ctx.lineWidth = 3;
      };

      // current dots animation along a path list
      const drawFlow = (pts, amps, phase) => {
        if (amps < 0.02) return;
        // build cumulative lengths
        let total = 0; const segs = [];
        for (let i = 1; i < pts.length; i++) { const dx = pts[i][0] - pts[i - 1][0], dy = pts[i][1] - pts[i - 1][1]; const d = Math.hypot(dx, dy); segs.push({ a: pts[i - 1], b: pts[i], d, s: total }); total += d; }
        const gap = 26; const n = Math.floor(total / gap);
        const off = ((this._t * (40 + amps * 30)) + phase) % gap;
        ctx.fillStyle = "#ffd43b";
        for (let k = 0; k < n; k++) {
          let dpos = k * gap + off;
          const seg = segs.find(s => dpos >= s.s && dpos <= s.s + s.d) || segs[segs.length - 1];
          const t = (dpos - seg.s) / seg.d;
          const px = seg.a[0] + (seg.b[0] - seg.a[0]) * t, py = seg.a[1] + (seg.b[1] - seg.a[1]) * t;
          ctx.beginPath(); ctx.arc(px, py, 2.6, 0, 7); ctx.fill();
        }
      };

      if (mode === "single") {
        const path = [[L, by], [L, T], [Rt, T], [Rt, by + 0], [Rt, B], [L, B], [L, by + 18]];
        drawWire([[L, by - 18], [L, T], [Rt, T], [Rt, B], [L, B], [L, by + 18]]);
        drawFlow([[L, T], [Rt, T], [Rt, B], [L, B]], I, 0);
        drawBattery(L, by);
        drawBulb((L + Rt) / 2, T, glow, "BULB");
      } else if (mode === "series") {
        drawWire([[L, by - 18], [L, T], [Rt, T], [Rt, B], [L, B], [L, by + 18]]);
        drawFlow([[L, T], [Rt, T], [Rt, B], [L, B]], I, 0);
        drawBattery(L, by);
        const b = Math.min(1, perBulb * R / 8);
        drawBulb(W * 0.38, T, b, "BULB 1"); drawBulb(W * 0.62, T, b, "BULB 2");
      } else { // parallel
        drawWire([[L, by - 18], [L, T], [Rt, T], [Rt, B], [L, B], [L, by + 18]]);
        // two vertical branches
        const bx1 = W * 0.42, bx2 = W * 0.62;
        drawWire([[bx1, T], [bx1, B]]); drawWire([[bx2, T], [bx2, B]]);
        drawFlow([[L, T], [Rt, T], [Rt, B], [L, B]], I, 0);
        drawFlow([[bx1, T], [bx1, B]], perBulb, 5); drawFlow([[bx2, T], [bx2, B]], perBulb, 9);
        drawBattery(L, by);
        const b = Math.min(1, perBulb * R / 8);
        drawBulb(bx1, (T + B) / 2, b, "BULB 1"); drawBulb(bx2, (T + B) / 2, b, "BULB 2");
      }

      // current arrow key
      ctx.fillStyle = "#8a857f"; ctx.font = "10px 'IBM Plex Mono', monospace"; ctx.textAlign = "left";
      ctx.fillText("● = flowing charge (conventional current + → −)", 12, H - 12);

      this._raf = requestAnimationFrame(this._loop);
    }
  }
  if (!customElements.get("circuit-sim")) customElements.define("circuit-sim", CircuitSim);
})();
