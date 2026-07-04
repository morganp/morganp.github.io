// <ph-sim> — pH scale interactive: slider drives colour + indicator dip test
// attrs: ph (0-14), width, height
(function () {
  // 0=deep red(strong acid) .. 7=green(neutral) .. 14=deep purple(strong base)
  const STOPS = [
    [0, [178, 24, 43]], [3, [239, 138, 98]], [6, [253, 219, 199]],
    [7, [120, 198, 121]], [8, [186, 228, 188]], [11, [116, 169, 207]], [14, [69, 55, 130]],
  ];
  function colorAt(ph) {
    for (let i = 0; i < STOPS.length - 1; i++) {
      const [p1, c1] = STOPS[i], [p2, c2] = STOPS[i + 1];
      if (ph >= p1 && ph <= p2) {
        const t = (ph - p1) / (p2 - p1);
        const c = c1.map((v, k) => Math.round(v + (c2[k] - v) * t));
        return "rgb(" + c.join(",") + ")";
      }
    }
    return "rgb(120,198,121)";
  }

  class PhSim extends HTMLElement {
    static get observedAttributes() { return ["ph"]; }
    connectedCallback() { this._render(); }
    attributeChangedCallback() { this._render(); }

    _render() {
      const ph = Number(this.getAttribute("ph") || 7);
      const w = Number(this.getAttribute("width") || 520);
      const h = Number(this.getAttribute("height") || 170);
      const color = colorAt(ph);
      const conc = Math.pow(10, -ph);
      const labels = ["BATTERY ACID", "STOMACH ACID", "LEMON JUICE", "VINEGAR", "", "RAIN", "MILK", "PURE WATER", "SEAWATER", "BAKING SODA", "", "AMMONIA", "", "BLEACH", "DRAIN CLEANER"];
      this.innerHTML = "";
      const wrap = document.createElement("div");
      wrap.style.cssText = "width:" + w + "px; font-family:'IBM Plex Mono',monospace;";

      // gradient strip
      const strip = document.createElement("div");
      strip.style.cssText = "position:relative; height:34px; border:2px solid #2b2620; background:linear-gradient(90deg," +
        STOPS.map(([p, c]) => "rgb(" + c.join(",") + ") " + (p / 14 * 100) + "%").join(",") + ");";
      const marker = document.createElement("div");
      marker.style.cssText = "position:absolute; top:-8px; left:" + (ph / 14 * 100) + "%; transform:translateX(-50%); width:0; height:0; border-left:8px solid transparent; border-right:8px solid transparent; border-top:10px solid #2b2620;";
      strip.appendChild(marker);
      wrap.appendChild(strip);

      // scale ticks
      const ticks = document.createElement("div");
      ticks.style.cssText = "display:flex; justify-content:space-between; font-size:10px; color:#6b6156; margin-top:4px;";
      for (let i = 0; i <= 14; i += 2) { const s = document.createElement("span"); s.textContent = i; ticks.appendChild(s); }
      wrap.appendChild(ticks);

      // readout row
      const row = document.createElement("div");
      row.style.cssText = "display:flex; gap:16px; align-items:center; margin-top:14px;";
      const beaker = document.createElement("div");
      beaker.style.cssText = "width:56px; height:64px; border:2.5px solid #2b2620; border-top:none; border-radius:0 0 8px 8px; background:" + color + "; flex-shrink:0; position:relative;";
      const liquidLabel = document.createElement("div");
      liquidLabel.style.cssText = "position:absolute; top:-20px; left:50%; transform:translateX(-50%); font-size:9px; white-space:nowrap; color:#6b6156;";
      liquidLabel.textContent = "INDICATOR";
      beaker.appendChild(liquidLabel);
      row.appendChild(beaker);

      const info = document.createElement("div");
      info.style.cssText = "display:flex; flex-direction:column; gap:4px;";
      const big = document.createElement("div");
      big.style.cssText = "font-family:'Archivo',sans-serif; font-weight:900; font-size:30px; color:#2b2620;";
      big.textContent = "pH " + ph.toFixed(1);
      info.appendChild(big);
      const kind = document.createElement("div");
      kind.style.cssText = "font-weight:600; font-size:12px; color:" + (ph < 6.5 ? "#c0392b" : ph > 7.5 ? "#2a5d8f" : "#2f7d3a") + ";";
      kind.textContent = ph < 6.5 ? "ACIDIC — MORE H⁺ IONS" : ph > 7.5 ? "ALKALINE (BASIC) — MORE OH⁻ IONS" : "NEUTRAL";
      info.appendChild(kind);
      const conc2 = document.createElement("div");
      conc2.style.cssText = "font-size:10.5px; color:#a89d8e;";
      conc2.textContent = "[H⁺] ≈ " + conc.toExponential(1) + " mol/L";
      info.appendChild(conc2);
      const ex = document.createElement("div");
      ex.style.cssText = "font-size:10.5px; color:#6b6156; min-height:14px; line-height:14px;";
      ex.textContent = labels[Math.round(ph)] ? "LIKE: " + labels[Math.round(ph)] : "\u00A0";
      info.appendChild(ex);
      row.appendChild(info);
      wrap.appendChild(row);
      this.appendChild(wrap);
    }
  }
  if (!customElements.get("ph-sim")) customElements.define("ph-sim", PhSim);
})();
