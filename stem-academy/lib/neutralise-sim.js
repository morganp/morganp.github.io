// neutralise-sim.js — <neutralise-sim h="" oh="" na="" cl="" water="" ph="">
// A beaker of ions for the reaction  HCl + NaOH -> NaCl + H2O.
// Shows free H+ (orange) and OH- (blue) ions, spectator Na+ / Cl- (the salt),
// and the H2O molecules formed when an H+ meets an OH-. Gentle floating motion.
(function () {
  const INK = "#2b2620";
  const H = "#e8590c";    // H+  (acid)
  const OH = "#2a6fb0";   // OH- (alkali)
  const NA = "#8a8178";   // Na+ spectator
  const CL = "#3f9c46";   // Cl- spectator
  const WO = "#7fbfd0";   // water oxygen
  const MONO = "700 9px 'IBM Plex Mono', ui-monospace, monospace";

  // liquid tint by pH (warm=acid, muted violet=neutral, cool=alkali)
  function phColor(ph) {
    if (ph == null) return "#efe7da";
    if (ph < 7) { const t = ph / 7; return `rgb(${Math.round(235 - t * 20)}, ${Math.round(150 + t * 60)}, ${Math.round(120 + t * 60)})`; }
    if (ph > 7) { const t = (ph - 7) / 7; return `rgb(${Math.round(150 - t * 30)}, ${Math.round(200 - t * 20)}, ${Math.round(220)})`; }
    return "#cbb8d8";
  }

  class NeutraliseSim extends HTMLElement {
    static get observedAttributes() { return ["h", "oh", "na", "cl", "water", "ph", "width", "height"]; }
    connectedCallback() {
      if (this._built) return; this._built = true;
      const w = +this.getAttribute("width") || 460;
      const hgt = +this.getAttribute("height") || 240;
      this.W = w; this.Hh = hgt;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.canvas = document.createElement("canvas");
      this.canvas.width = w * dpr; this.canvas.height = hgt * dpr;
      this.canvas.style.width = w + "px"; this.canvas.style.height = hgt + "px";
      this.canvas.style.display = "block";
      this.ctx = this.canvas.getContext("2d"); this.ctx.scale(dpr, dpr);
      this.appendChild(this.canvas);
      this.t = 0;
      const loop = () => { this.t++; try { this.draw(); } catch (e) {} this.raf = requestAnimationFrame(loop); };
      loop();
    }
    disconnectedCallback() { cancelAnimationFrame(this.raf); }
    attributeChangedCallback() { /* redraw picks up attrs each frame */ }

    num(a) { const v = +this.getAttribute(a); return isNaN(v) ? 0 : v; }

    // deterministic base position for item index i within the liquid box
    pos(i) {
      const s = Math.sin(i * 12.9898) * 43758.5453; const rx = s - Math.floor(s);
      const s2 = Math.sin(i * 78.233) * 12543.123; const ry = s2 - Math.floor(s2);
      return { rx, ry };
    }

    draw() {
      const c = this.ctx, W = this.W, Hh = this.Hh;
      c.clearRect(0, 0, W, Hh);
      c.lineJoin = "round"; c.lineCap = "round";

      const ph = this.hasAttribute("ph") ? +this.getAttribute("ph") : null;
      // beaker geometry
      const bx = 20, by = 34, bw = W - 40, bh = Hh - 58;
      // liquid
      c.beginPath(); c.rect(bx + 3, by + 3, bw - 6, bh - 6); c.fillStyle = phColor(ph); c.fill();
      // beaker outline (open top)
      c.beginPath();
      c.moveTo(bx, by); c.lineTo(bx, by + bh); c.lineTo(bx + bw, by + bh); c.lineTo(bx + bw, by);
      c.lineWidth = 2.5; c.strokeStyle = INK; c.stroke();
      c.beginPath(); c.moveTo(bx - 6, by); c.lineTo(bx + 10, by); c.moveTo(bx + bw - 10, by); c.lineTo(bx + bw + 6, by); c.stroke();

      // build the population (cap each so the beaker never overcrowds)
      const cap = (n) => Math.min(n, 9);
      const groups = [
        { type: "water", n: cap(this.num("water")) },
        { type: "h", n: cap(this.num("h")) },
        { type: "oh", n: cap(this.num("oh")) },
        { type: "na", n: cap(this.num("na")) },
        { type: "cl", n: cap(this.num("cl")) },
      ];
      const items = [];
      groups.forEach(g => { for (let k = 0; k < g.n; k++) items.push(g.type); });

      const innerX = bx + 16, innerY = by + 14, innerW = bw - 32, innerH = bh - 28;
      items.forEach((type, i) => {
        const p = this.pos(i * 2.7 + 1);
        const x = innerX + p.rx * innerW + Math.sin(this.t * 0.02 + i) * 4;
        const y = innerY + p.ry * innerH + Math.cos(this.t * 0.024 + i * 1.3) * 4;
        this.drawParticle(type, x, y);
      });

      c.font = MONO; c.textAlign = "left"; c.textBaseline = "alphabetic";
    }

    drawParticle(type, x, y) {
      const c = this.ctx;
      const chip = (col, r) => { c.beginPath(); c.arc(x, y, r, 0, 7); c.fillStyle = col; c.fill(); c.lineWidth = 1.5; c.strokeStyle = INK; c.stroke(); };
      const sign = (s, col) => { c.font = MONO; c.fillStyle = col || "#fff"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(s, x, y + 0.5); };
      if (type === "h") { chip(H, 9); sign("H+"); }
      else if (type === "oh") { c.beginPath(); c.ellipse(x, y, 13, 9, 0, 0, 7); c.fillStyle = OH; c.fill(); c.lineWidth = 1.5; c.strokeStyle = INK; c.stroke(); sign("OH\u2212"); }
      else if (type === "na") { chip(NA, 8.5); sign("Na+"); }
      else if (type === "cl") { chip(CL, 9); sign("Cl\u2212"); }
      else if (type === "water") {
        // bent water molecule: O + two H
        c.beginPath(); c.arc(x, y, 7, 0, 7); c.fillStyle = WO; c.fill(); c.lineWidth = 1.5; c.strokeStyle = INK; c.stroke();
        [[-8, -6], [8, -6]].forEach(([dx, dy]) => { c.beginPath(); c.arc(x + dx, y + dy, 4, 0, 7); c.fillStyle = "#fff"; c.fill(); c.lineWidth = 1.2; c.strokeStyle = INK; c.stroke(); });
        c.font = "700 7px 'IBM Plex Mono', monospace"; c.fillStyle = INK; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("H\u2082O", x, y + 13);
      }
    }
  }
  if (!customElements.get("neutralise-sim")) customElements.define("neutralise-sim", NeutraliseSim);
})();
