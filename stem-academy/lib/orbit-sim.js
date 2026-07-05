// <orbit-sim> — gravity & orbits. "solar" mode animates the inner planets round the Sun
// (relative periods, not to true scale). "satellite" mode: one body orbits a planet at a
// radius you set — a bigger orbit means slower speed and a longer year (Kepler's 3rd law).
// attrs: mode (solar|satellite), radius (0.3-1, satellite), width, height
(function () {
  const INK = "#2b2620", ORANGE = "#e8590c", GREY = "#a89d8e";
  const PLANETS = [
    { name: "Mercury", r: 0.16, col: "#b08d63", size: 3, period: 0.24 },
    { name: "Venus", r: 0.26, col: "#d9a066", size: 5, period: 0.62 },
    { name: "Earth", r: 0.37, col: "#3a7bd5", size: 5, period: 1.0 },
    { name: "Mars", r: 0.47, col: "#c1440e", size: 4, period: 1.88 },
    { name: "Jupiter", r: 0.66, col: "#c99e6a", size: 10, period: 11.9 },
    { name: "Saturn", r: 0.85, col: "#d8c88f", size: 9, period: 29.5 },
  ];

  class OrbitSim extends HTMLElement {
    static get observedAttributes() { return ["mode", "radius"]; }
    connectedCallback() { this._build(); this._t = 0; this._loop = this._loop.bind(this); this._raf = requestAnimationFrame(this._loop); }
    disconnectedCallback() { cancelAnimationFrame(this._raf); }
    _build() {
      this.innerHTML = "";
      const w = Number(this.getAttribute("width") || 640);
      const h = Number(this.getAttribute("height") || 340);
      this._wrap = document.createElement("div"); this._wrap.style.cssText = "width:" + w + "px;";
      this._cv = document.createElement("canvas"); this._cv.width = w; this._cv.height = h - 52;
      this._cv.style.cssText = "width:100%; height:" + (h - 52) + "px; border:2px solid " + INK + "; background:#0a0e1a; display:block;";
      this._read = document.createElement("div"); this._read.style.cssText = "display:flex; gap:10px; margin-top:10px; flex-wrap:wrap;";
      this._wrap.appendChild(this._cv); this._wrap.appendChild(this._read); this.appendChild(this._wrap);
    }
    _loop() {
      const mode = this.getAttribute("mode") || "solar";
      const ctx = this._cv.getContext("2d");
      const W = this._cv.width, H = this._cv.height;
      const cx = W / 2, cy = H / 2;
      ctx.clearRect(0, 0, W, H);
      // stars
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      for (let i = 0; i < 40; i++) { const sx = (i * 97) % W, sy = (i * 53) % H; ctx.fillRect(sx, sy, 1, 1); }
      this._t += 0.012;

      if (mode === "solar") {
        const maxR = Math.min(W, H) * 0.46;
        // sun
        const sg = ctx.createRadialGradient(cx, cy, 2, cx, cy, 20);
        sg.addColorStop(0, "#fff3b0"); sg.addColorStop(1, "#e8590c");
        ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(cx, cy, 14, 0, 7); ctx.fill();
        PLANETS.forEach(p => {
          const rr = p.r * maxR;
          ctx.strokeStyle = "rgba(150,160,190,0.25)"; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.arc(cx, cy, rr, 0, 7); ctx.stroke();
          const ang = this._t / p.period * 6 + p.r * 10;
          const x = cx + Math.cos(ang) * rr, y = cy + Math.sin(ang) * rr;
          ctx.fillStyle = p.col; ctx.beginPath(); ctx.arc(x, y, p.size, 0, 7); ctx.fill();
          if (p.name === "Saturn") { ctx.strokeStyle = "#d8c88f"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.ellipse(x, y, p.size + 5, p.size + 1.5, 0.5, 0, 7); ctx.stroke(); }
          ctx.fillStyle = "#aeb6c8"; ctx.font = "9px 'IBM Plex Mono', monospace"; ctx.textAlign = "center";
          ctx.fillText(p.name, x, y - p.size - 4);
        });
        ctx.fillStyle = "#e8590c"; ctx.font = "10px 'IBM Plex Mono', monospace"; ctx.textAlign = "center"; ctx.fillText("SUN", cx, cy + 26);
        ctx.fillStyle = "#8a93a8"; ctx.font = "10px 'IBM Plex Mono', monospace"; ctx.textAlign = "left";
        ctx.fillText("inner planets — spacing & periods relative, not to true scale", 12, H - 10);
        this._chips([["EARTH'S YEAR", "365 DAYS"], ["CLOSER = FASTER", "MERCURY: 88 D"], ["FARTHER = SLOWER", "SATURN: 29 YR"]], "The closer a planet is to the Sun, the stronger the pull and the faster it must orbit.");
      } else {
        const radius = Math.max(0.3, Math.min(1, Number(this.getAttribute("radius") || 0.6)));
        const rr = radius * Math.min(W, H) * 0.42;
        // planet (Earth)
        const pg = ctx.createRadialGradient(cx - 4, cy - 4, 2, cx, cy, 22);
        pg.addColorStop(0, "#5b9bd5"); pg.addColorStop(1, "#1e3a5f");
        ctx.fillStyle = pg; ctx.beginPath(); ctx.arc(cx, cy, 20, 0, 7); ctx.fill();
        ctx.fillStyle = "#7fb37f"; ctx.beginPath(); ctx.arc(cx + 6, cy - 3, 5, 0, 7); ctx.fill();
        // orbit path
        ctx.strokeStyle = "rgba(150,160,190,0.35)"; ctx.setLineDash([4, 4]); ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(cx, cy, rr, 0, 7); ctx.stroke(); ctx.setLineDash([]);
        // Kepler: period^2 ∝ radius^3 → angular speed ∝ r^-1.5
        const omega = 2.2 * Math.pow(radius, -1.5);
        const ang = this._t * omega;
        const x = cx + Math.cos(ang) * rr, y = cy + Math.sin(ang) * rr;
        // velocity vector (tangent)
        ctx.strokeStyle = "#ffd43b"; ctx.lineWidth = 2;
        const vlen = 22 / Math.pow(radius, 0.5);
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - Math.sin(ang) * vlen, y + Math.cos(ang) * vlen); ctx.stroke();
        // arrowhead on the velocity vector (>=10px per figure standard)
        { const tx = x - Math.sin(ang) * vlen, ty = y + Math.cos(ang) * vlen; const va = Math.atan2(ty - y, tx - x);
          ctx.fillStyle = "#ffd43b"; ctx.beginPath(); ctx.moveTo(tx, ty);
          ctx.lineTo(tx - 12 * Math.cos(va - 0.45), ty - 12 * Math.sin(va - 0.45));
          ctx.lineTo(tx - 12 * Math.cos(va + 0.45), ty - 12 * Math.sin(va + 0.45));
          ctx.closePath(); ctx.fill(); }
        ctx.fillStyle = "#cfcfcf"; ctx.beginPath(); ctx.arc(x, y, 6, 0, 7); ctx.fill();
        ctx.fillStyle = "#8a93a8"; ctx.font = "10px 'IBM Plex Mono', monospace"; ctx.textAlign = "left";
        ctx.fillText("● satellite — yellow arrow = its speed", 12, H - 10);
        const period = Math.pow(radius / 0.6, 1.5) * 90;
        this._chips([["ORBIT RADIUS", Math.round(radius * 100) + "%"], ["ORBITAL SPEED", (1 / Math.pow(radius, 0.5)).toFixed(2) + "×"], ["PERIOD", period.toFixed(0) + " min"]], "Lower orbits are faster (the ISS laps Earth in ~90 min); the Moon, far out, takes a month.");
      }
      this._raf = requestAnimationFrame(this._loop);
    }
    _chips(chips, note) {
      const chip = (l, v, hi) => '<div style="border:1.5px solid ' + INK + '; background:' + (hi ? ORANGE : "#fff") + '; color:' + (hi ? "#faf6ef" : INK) + '; padding:8px 12px; font-family:\'IBM Plex Mono\',monospace; font-size:12px;"><span style="opacity:.75; font-size:10px; display:block;">' + l + '</span><b style="font-size:14px;">' + v + '</b></div>';
      this._read.innerHTML = chips.map((c, i) => chip(c[0], c[1], i === 0)).join("") +
        '<div style="flex:1; min-width:150px; align-self:center; font-family:\'IBM Plex Mono\',monospace; font-size:11px; color:#6b6156;">' + note + '</div>';
    }
  }
  if (!customElements.get("orbit-sim")) customElements.define("orbit-sim", OrbitSim);
})();
