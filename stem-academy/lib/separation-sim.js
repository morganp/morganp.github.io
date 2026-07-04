// separation-sim.js — <separation-sim method="filtration|evaporation|distillation|chromatography">
// Looping canvas animation of the four mixture-separation techniques.
// Colours match the site: ink #2b2620, paper #faf6ef, accent #e8590c.
(function () {
  const INK = "#2b2620", PAPER = "#faf6ef", ACCENT = "#e8590c";
  const LIQ = "#6aa9d8", LIQ2 = "#2a6fb0", SOLID = "#b5895a", SALT = "#f4efe6", VAP = "#bcd3e0";
  const MONO = "600 10px 'IBM Plex Mono', ui-monospace, monospace";

  class SeparationSim extends HTMLElement {
    static get observedAttributes() { return ["method", "width", "height"]; }

    connectedCallback() {
      if (this._built) return;
      this._built = true;
      this.method = this.getAttribute("method") || "filtration";
      const w = +this.getAttribute("width") || 440;
      const h = +this.getAttribute("height") || 300;
      this.W = w; this.H = h;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.canvas = document.createElement("canvas");
      this.canvas.width = w * dpr; this.canvas.height = h * dpr;
      this.canvas.style.width = w + "px"; this.canvas.style.height = h + "px";
      this.canvas.style.display = "block";
      this.ctx = this.canvas.getContext("2d");
      this.ctx.scale(dpr, dpr);
      this.appendChild(this.canvas);
      this.t = 0;
      const loop = () => { this.t++; try { this.draw(); } catch (e) {} this.raf = requestAnimationFrame(loop); };
      loop();
    }
    disconnectedCallback() { cancelAnimationFrame(this.raf); }
    attributeChangedCallback(name, oldV, newV) {
      if (name === "method" && newV) { this.method = newV; this.t = 0; }
    }

    // helpers ---------------------------------------------------------------
    label(x, y, text, color, align) {
      const c = this.ctx;
      c.font = MONO; c.fillStyle = color || INK;
      c.textAlign = align || "left"; c.textBaseline = "middle";
      c.fillText(text, x, y);
      c.textAlign = "left";
    }
    dot(x, y, r, fill) {
      const c = this.ctx; c.beginPath(); c.arc(x, y, r, 0, 7); c.fillStyle = fill; c.fill();
    }
    stroke(w, col) { const c = this.ctx; c.lineWidth = w || 2; c.strokeStyle = col || INK; c.stroke(); }

    draw() {
      const c = this.ctx;
      c.clearRect(0, 0, this.W, this.H);
      c.lineJoin = "round"; c.lineCap = "round";
      if (this.method === "filtration") this.drawFiltration();
      else if (this.method === "evaporation") this.drawEvaporation();
      else if (this.method === "distillation") this.drawDistillation();
      else if (this.method === "chromatography") this.drawChromatography();
    }

    // FILTRATION ------------------------------------------------------------
    drawFiltration() {
      const c = this.ctx, W = this.W;
      const CYCLE = 260; const p = (this.t % CYCLE) / CYCLE;
      const cx = 210;

      // pouring beaker (top-left, tilted)
      c.save(); c.translate(96, 60); c.rotate(0.5);
      c.beginPath(); c.rect(-30, -22, 60, 44); c.fillStyle = "#fff"; c.fill(); this.stroke(2, INK);
      c.beginPath(); c.rect(-30, 2, 60, 20); c.fillStyle = "#cfe0ea"; c.fill();
      for (let i = 0; i < 5; i++) this.dot(-20 + i * 10, 12, 2, SOLID);
      c.restore();
      this.label(58, 26, "MUDDY MIXTURE", INK);

      // stream into funnel
      for (let i = 0; i < 6; i++) {
        const ph = (this.t * 0.04 + i / 6) % 1;
        const x = 120 + ph * 70, y = 78 + ph * 34;
        this.dot(x, y, 2.4, i % 2 ? LIQ : SOLID);
      }

      // funnel
      c.beginPath();
      c.moveTo(cx - 52, 108); c.lineTo(cx + 52, 108);
      c.lineTo(cx + 8, 168); c.lineTo(cx + 8, 196);
      c.lineTo(cx - 8, 196); c.lineTo(cx - 8, 168);
      c.closePath(); c.fillStyle = "#fff"; c.fill(); this.stroke(2, INK);
      // filter paper cone
      c.beginPath(); c.moveTo(cx - 44, 112); c.lineTo(cx + 44, 112); c.lineTo(cx, 170); c.closePath();
      c.fillStyle = "#faf6ef"; c.fill(); this.stroke(1.5, "#c9c0b2");

      // residue building on filter (solid brown), grows with p
      const heap = Math.floor(4 + p * 16);
      for (let i = 0; i < heap; i++) {
        const rr = (i / heap);
        const x = cx + (Math.sin(i * 2.3) * 30) * (1 - rr * 0.5);
        const y = 150 - rr * 26;
        this.dot(x, y, 2.6, SOLID);
      }
      this.label(cx + 58, 128, "RESIDUE", ACCENT);
      this.label(cx + 58, 140, "(solid caught)", "#6b6156");

      // drips falling from spout
      for (let i = 0; i < 4; i++) {
        const ph = (this.t * 0.05 + i / 4) % 1;
        this.dot(cx, 198 + ph * 40, 2.2, LIQ);
      }

      // collecting beaker (bottom)
      const by = 244, bh = 46;
      c.beginPath(); c.rect(cx - 40, by, 80, bh); c.fillStyle = "#fff"; c.fill(); this.stroke(2, INK);
      const lvl = 8 + p * 26;
      c.beginPath(); c.rect(cx - 38, by + bh - lvl, 76, lvl); c.fillStyle = LIQ; c.fill();
      this.label(cx + 46, by + 20, "FILTRATE", "#2a6fb0");
      this.label(cx + 46, by + 32, "(clear liquid)", "#6b6156");
    }

    // EVAPORATION -----------------------------------------------------------
    drawEvaporation() {
      const c = this.ctx;
      const CYCLE = 300; const p = (this.t % CYCLE) / CYCLE;
      const cx = 200;

      // vapour rising
      for (let i = 0; i < 9; i++) {
        const ph = (this.t * 0.012 + i / 9) % 1;
        const x = cx - 60 + i * 15 + Math.sin(ph * 6 + i) * 6;
        const y = 150 - ph * 120;
        c.globalAlpha = 0.7 * (1 - ph); this.dot(x, y, 3.2, VAP); c.globalAlpha = 1;
      }
      this.label(cx, 34, "WATER LEAVES AS VAPOUR", "#2a6fb0", "center");

      // evaporating dish
      c.beginPath();
      c.moveTo(cx - 70, 150); c.quadraticCurveTo(cx, 210, cx + 70, 150);
      c.fillStyle = "#fff"; c.fill(); this.stroke(2, INK);
      // remaining solution (drops with p)
      const solTop = 150 + p * 34;
      c.save();
      c.beginPath(); c.moveTo(cx - 70, 150); c.quadraticCurveTo(cx, 210, cx + 70, 150); c.clip();
      c.beginPath(); c.rect(cx - 72, solTop, 144, 60); c.fillStyle = LIQ; c.fill();
      c.restore();

      // salt crystals left behind, grow with p
      const nx = Math.floor(2 + p * 12);
      for (let i = 0; i < nx; i++) {
        const x = cx - 40 + (i / Math.max(1, nx - 1)) * 80 + Math.sin(i * 3) * 3;
        const s = 3 + (Math.sin(i * 1.7) + 1) * 1.5;
        c.beginPath(); c.rect(x - s / 2, 196 - s, s, s); c.fillStyle = SALT; c.fill(); this.stroke(1, INK);
      }
      if (p > 0.55) this.label(cx, 214, "SALT LEFT BEHIND", ACCENT, "center");

      // tripod + flame
      c.beginPath(); c.moveTo(cx - 52, 210); c.lineTo(cx - 40, 258); c.moveTo(cx + 52, 210); c.lineTo(cx + 40, 258); this.stroke(2, INK);
      c.beginPath(); c.moveTo(cx - 74, 210); c.lineTo(cx + 74, 210); this.stroke(2, INK);
      // flickering flame
      const f = Math.sin(this.t * 0.3) * 3;
      c.beginPath();
      c.moveTo(cx - 14, 244); c.quadraticCurveTo(cx - 8, 224 + f, cx, 214 - f);
      c.quadraticCurveTo(cx + 8, 224 - f, cx + 14, 244); c.closePath();
      c.fillStyle = ACCENT; c.fill();
      c.beginPath(); c.moveTo(cx - 7, 244); c.quadraticCurveTo(cx, 232 + f, cx + 7, 244); c.closePath();
      c.fillStyle = "#fcc419"; c.fill();
      this.label(cx, 272, "HEAT", "#6b6156", "center");
    }

    // DISTILLATION ----------------------------------------------------------
    drawDistillation() {
      const c = this.ctx;
      const CYCLE = 300; const p = (this.t % CYCLE) / CYCLE;

      // flask (left)
      const fx = 92, fy = 150;
      c.beginPath(); c.arc(fx, fy, 40, 0, 7); c.fillStyle = "#fff"; c.fill(); this.stroke(2, INK);
      c.beginPath(); c.rect(fx - 9, fy - 74, 18, 40); c.fillStyle = "#fff"; c.fill(); this.stroke(2, INK);
      // solution in flask (mostly stays)
      c.save(); c.beginPath(); c.arc(fx, fy, 38, 0, 7); c.clip();
      c.beginPath(); c.rect(fx - 40, fy - 4, 80, 44); c.fillStyle = LIQ; c.fill();
      // dissolved solid dots stay behind
      for (let i = 0; i < 6; i++) this.dot(fx - 24 + i * 9, fy + 22 + Math.sin(i + this.t * 0.05) * 2, 2, SOLID);
      c.restore();

      // flame under flask
      const f = Math.sin(this.t * 0.3) * 3;
      c.beginPath();
      c.moveTo(fx - 12, 214); c.quadraticCurveTo(fx - 6, 198 + f, fx, 190 - f);
      c.quadraticCurveTo(fx + 6, 198 - f, fx + 12, 214); c.closePath(); c.fillStyle = ACCENT; c.fill();

      // vapour rising in flask neck
      for (let i = 0; i < 4; i++) {
        const ph = (this.t * 0.02 + i / 4) % 1;
        c.globalAlpha = 0.8 * (1 - ph * 0.5);
        this.dot(fx, fy - 40 - ph * 30, 2.6, VAP); c.globalAlpha = 1;
      }

      // condenser (sloping tube to the right)
      c.beginPath(); c.moveTo(fx, 76); c.lineTo(180, 76); c.lineTo(300, 150);
      c.lineWidth = 12; c.strokeStyle = "#e6eef3"; c.stroke();
      c.beginPath(); c.moveTo(fx, 76); c.lineTo(180, 76); c.lineTo(300, 150);
      this.stroke(2, INK);
      // water jacket hatching on condenser
      c.strokeStyle = "#9fc0d0"; c.lineWidth = 1;
      for (let i = 0; i < 6; i++) { const x = 190 + i * 16; c.beginPath(); c.moveTo(x, 70); c.lineTo(x + 8, 96); c.stroke(); }
      this.label(200, 60, "CONDENSER (cools vapour)", "#2a6fb0", "center");

      // vapour travelling along condenser then condensing to drips
      for (let i = 0; i < 6; i++) {
        const ph = (this.t * 0.02 + i / 6) % 1;
        if (ph < 0.6) { // vapour phase along tube
          const tt = ph / 0.6;
          const x = fx + tt * (300 - fx);
          const y = 76 + Math.max(0, (x - 180)) * (74 / 120);
          this.dot(x, y, 2.4, VAP);
        } else { // condensed drip falling into beaker
          const tt = (ph - 0.6) / 0.4;
          this.dot(300, 150 + tt * 40, 2.4, LIQ);
        }
      }

      // collection beaker (right)
      const bx = 300, by = 196, bw = 60, bh = 60;
      c.beginPath(); c.rect(bx - bw / 2, by, bw, bh); c.fillStyle = "#fff"; c.fill(); this.stroke(2, INK);
      const lvl = 6 + p * 40;
      c.beginPath(); c.rect(bx - bw / 2 + 2, by + bh - lvl, bw - 4, lvl); c.fillStyle = LIQ2; c.fill();
      this.label(bx, by + bh + 14, "PURE LIQUID", ACCENT, "center");
      this.label(fx, 250, "mixture stays", "#6b6156", "center");
    }

    // CHROMATOGRAPHY --------------------------------------------------------
    drawChromatography() {
      const c = this.ctx;
      const CYCLE = 320; const p = (this.t % CYCLE) / CYCLE;
      const cx = 200;

      // beaker
      const bx = cx, bTop = 60, bBot = 262, bw = 150;
      c.beginPath(); c.rect(bx - bw / 2, bTop, bw, bBot - bTop); c.fillStyle = "rgba(255,255,255,0.5)"; c.fill(); this.stroke(2, INK);
      // solvent pool at bottom
      c.beginPath(); c.rect(bx - bw / 2 + 2, bBot - 26, bw - 4, 24); c.fillStyle = "#dff0f5"; c.fill();
      this.label(bx + bw / 2 + 6, bBot - 14, "SOLVENT", "#2a6fb0");

      // paper strip
      const px = cx, pw = 46, pTop = 44, pBot = bBot - 6;
      c.beginPath(); c.rect(px - pw / 2, pTop, pw, pBot - pTop); c.fillStyle = "#fff"; c.fill(); this.stroke(2, INK);
      // wet solvent front rising
      const baseY = pBot - 20;               // start line (pencil)
      const frontY = baseY - p * (baseY - pTop - 16);
      c.beginPath(); c.rect(px - pw / 2 + 1.5, frontY, pw - 3, pBot - frontY - 1.5); c.fillStyle = "rgba(180,214,228,0.45)"; c.fill();
      // pencil baseline
      c.beginPath(); c.moveTo(px - pw / 2, baseY); c.lineTo(px + pw / 2, baseY); this.stroke(1, "#a89d8e");
      this.label(px + pw / 2 + 8, baseY, "start line", "#6b6156");
      // solvent front label
      this.label(px - pw / 2 - 8, frontY, "front", "#2a6fb0", "right");

      // ink components separating: each rises at its own rate from baseY
      const comps = [
        { col: "#c0392b", rate: 0.92 },  // fastest (most soluble)
        { col: "#e8a13a", rate: 0.60 },
        { col: "#2a6fb0", rate: 0.30 },  // slowest
      ];
      comps.forEach((cp, i) => {
        const y = baseY - p * cp.rate * (baseY - pTop - 20);
        const spread = 5 + p * 4;
        c.globalAlpha = 0.9;
        this.dot(px - 8 + i * 8, Math.min(y, baseY), spread * 0.6, cp.col);
        c.globalAlpha = 1;
      });
      if (p < 0.08) this.label(cx, 30, "A DOT OF MIXED INK...", INK, "center");
      else if (p > 0.5) this.label(cx, 30, "...SPLITS INTO ITS COLOURS", ACCENT, "center");
    }
  }

  if (!customElements.get("separation-sim")) customElements.define("separation-sim", SeparationSim);
})();
