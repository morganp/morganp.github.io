// <pressure-sim> — gas in a box. Particles bounce off the walls; each wall hit is a
// tiny push, and the pressure is those pushes added up. Shrink the box (volume down) or
// heat it (temperature up) and the wall-hit rate — the pressure — climbs.
// attrs: volume (0.3-1 fraction of box width), temp (0.3-2 speed factor), width, height
(function () {
  const INK = "#2b2620", ORANGE = "#e8590c", BLUE = "#2a5d8f", GREY = "#a89d8e";
  const NP = 46;

  class PressureSim extends HTMLElement {
    static get observedAttributes() { return ["volume", "temp"]; }
    connectedCallback() {
      this._build(); this._init();
      this._loop = this._loop.bind(this); this._raf = requestAnimationFrame(this._loop);
      this._hits = 0; this._hitWindow = [];
    }
    disconnectedCallback() { cancelAnimationFrame(this._raf); }
    attributeChangedCallback() {}
    _build() {
      this.innerHTML = "";
      const w = Number(this.getAttribute("width") || 640);
      const h = Number(this.getAttribute("height") || 320);
      this._wrap = document.createElement("div"); this._wrap.style.cssText = "width:" + w + "px;";
      this._cv = document.createElement("canvas"); this._cv.width = w; this._cv.height = h - 52;
      this._cv.style.cssText = "width:100%; height:" + (h - 52) + "px; border:2px solid " + INK + "; background:#111014; display:block;";
      this._read = document.createElement("div"); this._read.style.cssText = "display:flex; gap:10px; margin-top:10px; flex-wrap:wrap;";
      this._wrap.appendChild(this._cv); this._wrap.appendChild(this._read); this.appendChild(this._wrap);
    }
    _init() {
      const H = this._cv.height;
      this.p = [];
      for (let i = 0; i < NP; i++) {
        const a = Math.random() * 7;
        this.p.push({ x: 60 + Math.random() * 200, y: 30 + Math.random() * (H - 60), vx: Math.cos(a), vy: Math.sin(a) });
      }
    }
    _loop() {
      const W = this._cv.width, H = this._cv.height;
      const vol = Math.max(0.3, Math.min(1, Number(this.getAttribute("volume") || 0.8)));
      const temp = Math.max(0.3, Math.min(2, Number(this.getAttribute("temp") || 1)));
      const boxL = 30, boxR = 30 + (W - 60) * vol, boxT = 22, boxB = H - 22;
      const speed = temp * 2.4;
      let hitsThisFrame = 0;
      const ctx = this._cv.getContext("2d");
      ctx.clearRect(0, 0, W, H);
      // draw box + piston
      ctx.strokeStyle = "#5a5550"; ctx.lineWidth = 2; ctx.strokeRect(boxL, boxT, boxR - boxL, boxB - boxT);
      // piston (right wall) — orange bar
      ctx.fillStyle = ORANGE; ctx.fillRect(boxR - 4, boxT, 8, boxB - boxT);
      ctx.fillStyle = "#6b6156"; ctx.font = "10px 'IBM Plex Mono', monospace"; ctx.textAlign = "center";
      // grey area outside piston
      ctx.fillStyle = "rgba(90,85,80,0.25)"; ctx.fillRect(boxR + 4, boxT, W - 30 - (boxR + 4), boxB - boxT);

      this.p.forEach(pt => {
        pt.x += pt.vx * speed; pt.y += pt.vy * speed;
        if (pt.x < boxL + 4) { pt.x = boxL + 4; pt.vx = Math.abs(pt.vx); hitsThisFrame++; }
        if (pt.x > boxR - 6) { pt.x = boxR - 6; pt.vx = -Math.abs(pt.vx); hitsThisFrame++; }
        if (pt.y < boxT + 4) { pt.y = boxT + 4; pt.vy = Math.abs(pt.vy); hitsThisFrame++; }
        if (pt.y > boxB - 4) { pt.y = boxB - 4; pt.vy = -Math.abs(pt.vy); hitsThisFrame++; }
        ctx.fillStyle = temp > 1.3 ? "#ff9d3c" : temp < 0.6 ? "#7fb3e0" : "#ffd43b";
        ctx.beginPath(); ctx.arc(pt.x, pt.y, 4, 0, 7); ctx.fill();
      });

      // moving average of hits => pressure proxy
      this._hitWindow.push(hitsThisFrame);
      if (this._hitWindow.length > 40) this._hitWindow.shift();
      const avg = this._hitWindow.reduce((a, b) => a + b, 0) / this._hitWindow.length;
      // pressure ~ hits per wall-area; scale to kPa-ish for readout
      const pressure = avg * 42 / vol * 0.5 + 20;

      ctx.fillStyle = "#8a857f"; ctx.font = "10px 'IBM Plex Mono', monospace"; ctx.textAlign = "left";
      ctx.fillText("● gas particles — every wall hit is a push", 34, H - 8);

      const chip = (l, v, hi) => '<div style="border:1.5px solid ' + INK + '; background:' + (hi ? ORANGE : "#fff") + '; color:' + (hi ? "#faf6ef" : INK) + '; padding:8px 12px; font-family:\'IBM Plex Mono\',monospace; font-size:12px;"><span style="opacity:.75; font-size:10px; display:block;">' + l + '</span><b style="font-size:15px;">' + v + '</b></div>';
      this._read.innerHTML =
        chip("PRESSURE", Math.round(pressure) + " kPa", true) +
        chip("VOLUME", Math.round(vol * 100) + "%") +
        chip("TEMPERATURE", Math.round(temp * 150 + 30) + " K") +
        '<div style="flex:1; min-width:150px; align-self:center; font-family:\'IBM Plex Mono\',monospace; font-size:11px; color:#6b6156;">Squeeze the box or heat the gas → more wall hits per second → higher pressure.</div>';
      this._raf = requestAnimationFrame(this._loop);
    }
  }
  if (!customElements.get("pressure-sim")) customElements.define("pressure-sim", PressureSim);
})();
