// <sound-wave> — animated sound wave. Top: transverse graph of the pressure trace
// (frequency = pitch, amplitude = volume). Bottom: longitudinal compressions of air
// particles travelling right. attrs: freq (Hz-ish 1-12), amp (0-1), width, height
(function () {
  const INK = "#2b2620", ORANGE = "#e8590c", GREY = "#c9c0b2";

  class SoundWave extends HTMLElement {
    static get observedAttributes() { return ["freq", "amp"]; }
    connectedCallback() {
      this._build(); this._t = 0;
      this._loop = this._loop.bind(this); this._raf = requestAnimationFrame(this._loop);
    }
    disconnectedCallback() { cancelAnimationFrame(this._raf); }
    attributeChangedCallback() { this._readout(); }
    _build() {
      this.innerHTML = "";
      const w = Number(this.getAttribute("width") || 640);
      const h = Number(this.getAttribute("height") || 300);
      this._wrap = document.createElement("div"); this._wrap.style.cssText = "width:" + w + "px;";
      this._cv = document.createElement("canvas"); this._cv.width = w; this._cv.height = h - 52;
      this._cv.style.cssText = "width:100%; height:" + (h - 52) + "px; border:2px solid " + INK + "; background:#fbf7f0; display:block;";
      this._read = document.createElement("div"); this._read.style.cssText = "display:flex; gap:10px; margin-top:10px; flex-wrap:wrap;";
      this._wrap.appendChild(this._cv); this._wrap.appendChild(this._read); this.appendChild(this._wrap);
      this._readout();
    }
    _readout() {
      const freq = Number(this.getAttribute("freq") || 4);
      const amp = Number(this.getAttribute("amp") || 0.6);
      const hz = Math.round(freq * 55);
      const chip = (l, v, hi) => '<div style="border:1.5px solid ' + INK + '; background:' + (hi ? ORANGE : "#fff") + '; color:' + (hi ? "#faf6ef" : INK) + '; padding:8px 12px; font-family:\'IBM Plex Mono\',monospace; font-size:12px;"><span style="opacity:.75; font-size:10px; display:block;">' + l + '</span><b style="font-size:15px;">' + v + '</b></div>';
      const pitch = freq < 4 ? "LOW / BASS" : freq < 8 ? "MID" : "HIGH / TREBLE";
      const vol = amp < 0.33 ? "QUIET" : amp < 0.7 ? "MEDIUM" : "LOUD";
      if (this._read) this._read.innerHTML =
        chip("FREQUENCY → PITCH", hz + " Hz · " + pitch, true) +
        chip("AMPLITUDE → VOLUME", Math.round(amp * 100) + "% · " + vol) +
        '<div style="flex:1; min-width:150px; align-self:center; font-family:\'IBM Plex Mono\',monospace; font-size:11px; color:#6b6156;">Sound needs a medium to travel — no air, no sound. It moves ~343 m/s in air.</div>';
    }
    _loop() {
      const freq = Number(this.getAttribute("freq") || 4);
      const amp = Number(this.getAttribute("amp") || 0.6);
      const ctx = this._cv.getContext("2d");
      const W = this._cv.width, H = this._cv.height;
      ctx.clearRect(0, 0, W, H);
      this._t += 0.05;
      const midTop = H * 0.28, midBot = H * 0.72;

      // axis label top
      ctx.fillStyle = "#6b6156"; ctx.font = "10px 'IBM Plex Mono', monospace"; ctx.textAlign = "left";
      ctx.fillText("PRESSURE (wave graph)", 12, 16);
      ctx.fillText("AIR PARTICLES (compressions travelling →)", 12, H * 0.5 + 14);
      // centre line
      ctx.strokeStyle = GREY; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(0, midTop); ctx.lineTo(W, midTop); ctx.stroke(); ctx.setLineDash([]);

      // transverse trace
      const A = amp * (H * 0.19);
      const k = freq * 0.05;
      ctx.strokeStyle = ORANGE; ctx.lineWidth = 2.5; ctx.beginPath();
      for (let x = 0; x <= W; x++) {
        const y = midTop - A * Math.sin(k * x - this._t * 2);
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
      // amplitude bracket
      if (amp > 0.05) {
        ctx.strokeStyle = INK; ctx.lineWidth = 1; ctx.beginPath();
        ctx.moveTo(24, midTop); ctx.lineTo(24, midTop - A); ctx.stroke();
        ctx.fillStyle = INK; ctx.font = "10px 'IBM Plex Mono', monospace"; ctx.fillText("amplitude", 30, midTop - A / 2);
      }

      // longitudinal particle field
      const rows = 4, cols = 60;
      const bandTop = H * 0.55, bandH = H * 0.4;
      for (let r = 0; r < rows; r++) {
        const py = bandTop + (bandH) * (r + 0.5) / rows;
        for (let c = 0; c < cols; c++) {
          const base = (c + 0.5) / cols * W;
          const disp = 8 * amp * Math.sin(k * base - this._t * 2);
          const px = base + disp;
          // darker where compressed (particles bunch)
          const dens = 0.4 + 0.6 * Math.abs(Math.cos(k * base - this._t * 2));
          ctx.fillStyle = "rgba(43,38,32," + (0.25 + dens * 0.6) + ")";
          ctx.beginPath(); ctx.arc(px, py, 2.4, 0, 7); ctx.fill();
        }
      }
      this._raf = requestAnimationFrame(this._loop);
    }
  }
  if (!customElements.get("sound-wave")) customElements.define("sound-wave", SoundWave);
})();
