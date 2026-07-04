// <energy-flow> — Sankey-style energy transfer diagram. Input energy splits into
// a "useful" band and one or more "wasted" bands, widths proportional to joules.
// attrs: device (key), input (J), width, height
(function () {
  const INK = "#2b2620", ORANGE = "#e8590c", GREY = "#c9c0b2", GREEN = "#2f7d3a", PAPER = "#faf6ef";

  // each device: input store label, and outputs [{label, frac, useful}]
  const DEVICES = {
    "led": { from: "ELECTRICAL", outs: [["Light (useful)", 0.9, 1], ["Heat (wasted)", 0.1, 0]] },
    "filament": { from: "ELECTRICAL", outs: [["Light (useful)", 0.05, 1], ["Heat (wasted)", 0.95, 0]] },
    "kettle": { from: "ELECTRICAL", outs: [["Heating water (useful)", 0.88, 1], ["Heat to air + sound (wasted)", 0.12, 0]] },
    "car": { from: "CHEMICAL (fuel)", outs: [["Kinetic — movement (useful)", 0.25, 1], ["Heat from engine (wasted)", 0.65, 0], ["Sound (wasted)", 0.1, 0]] },
    "turbine": { from: "KINETIC (wind)", outs: [["Electrical (useful)", 0.45, 1], ["Kinetic left in air (wasted)", 0.55, 0]] },
    "phone": { from: "CHEMICAL (battery)", outs: [["Light + sound (useful)", 0.6, 1], ["Heat (wasted)", 0.4, 0]] },
  };

  function draw(cv, deviceKey, input) {
    const ctx = cv.getContext("2d");
    const W = cv.width, H = cv.height;
    ctx.clearRect(0, 0, W, H);
    const dev = DEVICES[deviceKey] || DEVICES["led"];

    const x0 = 20, xIn = 150, xBox = 300, xOut = 430, x1 = W - 20;
    const totalH = H - 80, cy = 40 + totalH / 2;
    // input band (full height scaled)
    const bandTop = 40;
    // input block
    ctx.fillStyle = ORANGE; ctx.strokeStyle = INK; ctx.lineWidth = 2;
    // input bar full
    let y = bandTop;
    // draw input trunk
    ctx.fillStyle = "#f6d9c6";
    ctx.beginPath();
    ctx.moveTo(x0, cy - totalH / 2); ctx.lineTo(xIn, cy - totalH / 2);
    ctx.lineTo(xIn, cy + totalH / 2); ctx.lineTo(x0, cy + totalH / 2); ctx.closePath();
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = INK; ctx.font = "bold 12px 'IBM Plex Mono', monospace"; ctx.textAlign = "center";
    ctx.save(); ctx.translate(x0 + 22, cy); ctx.rotate(-Math.PI / 2);
    ctx.fillText(dev.from + " IN", 0, 0); ctx.restore();
    ctx.font = "11px 'IBM Plex Mono', monospace";
    ctx.fillText(input + " J", (x0 + xIn) / 2, cy - totalH / 2 - 8);

    // device box
    ctx.fillStyle = INK; ctx.fillRect(xBox - 34, cy - 34, 68, 68);
    ctx.fillStyle = PAPER; ctx.font = "10px 'IBM Plex Mono', monospace";
    ctx.fillText("DEVICE", xBox, cy + 4);

    // outputs — stacked bands on the right, each height proportional to fraction
    let oy = bandTop;
    dev.outs.forEach(([label, frac, useful]) => {
      const bh = totalH * frac;
      const col = useful ? GREEN : GREY;
      // flow ribbon from box to band
      ctx.fillStyle = useful ? "rgba(47,125,58,0.25)" : "rgba(160,150,135,0.3)";
      ctx.beginPath();
      ctx.moveTo(xBox + 34, cy - 20); ctx.lineTo(xOut, oy);
      ctx.lineTo(xOut, oy + bh); ctx.lineTo(xBox + 34, cy + 20); ctx.closePath();
      ctx.fill();
      // band
      ctx.fillStyle = col; ctx.strokeStyle = INK; ctx.lineWidth = 1.5;
      ctx.fillRect(xOut, oy, 40, bh); ctx.strokeRect(xOut, oy, 40, bh);
      // label
      ctx.fillStyle = INK; ctx.textAlign = "left"; ctx.font = "11px 'IBM Plex Mono', monospace";
      const joules = Math.round(input * frac);
      ctx.fillText(label, xOut + 50, oy + bh / 2 - 2);
      ctx.fillStyle = "#6b6156"; ctx.font = "10px 'IBM Plex Mono', monospace";
      ctx.fillText(joules + " J  ·  " + Math.round(frac * 100) + "%", xOut + 50, oy + bh / 2 + 13);
      oy += bh;
    });

    // efficiency
    const eff = dev.outs.filter(o => o[2]).reduce((s, o) => s + o[1], 0);
    return { eff, useful: Math.round(input * eff), wasted: Math.round(input * (1 - eff)) };
  }

  class EnergyFlow extends HTMLElement {
    static get observedAttributes() { return ["device", "input"]; }
    connectedCallback() { this._build(); this._render(); }
    attributeChangedCallback() { if (this._cv) this._render(); }
    _build() {
      this.innerHTML = "";
      const w = Number(this.getAttribute("width") || 720);
      const h = Number(this.getAttribute("height") || 300);
      this._wrap = document.createElement("div"); this._wrap.style.cssText = "width:" + w + "px;";
      this._cv = document.createElement("canvas"); this._cv.width = w; this._cv.height = h - 52;
      this._cv.style.cssText = "width:100%; height:" + (h - 52) + "px; border:2px solid " + INK + "; background:#fff; display:block;";
      this._read = document.createElement("div");
      this._read.style.cssText = "display:flex; gap:10px; margin-top:10px; flex-wrap:wrap;";
      this._wrap.appendChild(this._cv); this._wrap.appendChild(this._read); this.appendChild(this._wrap);
    }
    _render() {
      const device = this.getAttribute("device") || "led";
      const input = Number(this.getAttribute("input") || 100);
      const r = draw(this._cv, device, input);
      const chip = (l, v, hi) => '<div style="border:1.5px solid ' + INK + '; background:' + (hi ? ORANGE : "#fff") + '; color:' + (hi ? PAPER : INK) + '; padding:8px 12px; font-family:\'IBM Plex Mono\',monospace; font-size:12px;"><span style="opacity:.75; font-size:10px; display:block;">' + l + '</span><b style="font-size:16px;">' + v + '</b></div>';
      this._read.innerHTML =
        chip("EFFICIENCY", Math.round(r.eff * 100) + "%", true) +
        chip("USEFUL OUT", r.useful + " J") +
        chip("WASTED (mostly heat)", r.wasted + " J") +
        '<div style="flex:1; min-width:160px; align-self:center; font-family:\'IBM Plex Mono\',monospace; font-size:11px; color:#6b6156;">Total in = total out. Energy is never destroyed — just spread out.</div>';
    }
  }
  if (!customElements.get("energy-flow")) customElements.define("energy-flow", EnergyFlow);
})();
