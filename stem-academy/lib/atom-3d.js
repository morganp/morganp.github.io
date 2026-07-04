// <atom-3d> — draggable 3D Bohr-model atom (canvas web component)
// attrs: shells="2,8,14,2"  symbol="Fe"  size="182"
(function () {
  class Atom3D extends HTMLElement {
    static get observedAttributes() { return ["shells", "symbol", "size", "protons", "neutrons"]; }

    constructor() {
      super();
      this._rotX = -0.9;
      this._rotY = 0.35;
      this._autoSpin = true;
      this._t = 0;
      this._dragging = false;
    }

    connectedCallback() {
      const size = Number(this.getAttribute("size") || 182);
      this.style.display = "inline-block";
      this.style.width = size + "px";
      this.style.height = size + "px";
      this.style.touchAction = "none";
      this.style.cursor = "grab";

      this._canvas = document.createElement("canvas");
      const dpr = window.devicePixelRatio || 1;
      this._canvas.width = size * dpr;
      this._canvas.height = size * dpr;
      this._canvas.style.width = size + "px";
      this._canvas.style.height = size + "px";
      this._size = size;
      this._dpr = dpr;
      this.appendChild(this._canvas);
      this._ctx = this._canvas.getContext("2d");

      this.addEventListener("pointerdown", (e) => {
        this._dragging = true;
        this._autoSpin = false;
        this._px = e.clientX; this._py = e.clientY;
        this.style.cursor = "grabbing";
        this.setPointerCapture(e.pointerId);
      });
      this.addEventListener("pointermove", (e) => {
        if (!this._dragging) return;
        this._rotY += (e.clientX - this._px) * 0.012;
        this._rotX += (e.clientY - this._py) * 0.012;
        this._px = e.clientX; this._py = e.clientY;
      });
      const end = () => { this._dragging = false; this.style.cursor = "grab"; };
      this.addEventListener("pointerup", end);
      this.addEventListener("pointercancel", end);

      this._last = performance.now();
      const loop = (now) => {
        if (!this.isConnected) return;
        const dt = Math.min((now - this._last) / 1000, 0.05);
        this._last = now;
        this._t += dt;
        if (this._autoSpin && !this._dragging) this._rotY += dt * 0.25;
        this._draw();
        this._raf = requestAnimationFrame(loop);
      };
      this._raf = requestAnimationFrame(loop);
    }

    disconnectedCallback() { cancelAnimationFrame(this._raf); }

    attributeChangedCallback() { /* re-read attrs each frame; nothing to do */ }

    _project(x, y, z) {
      const cx = Math.cos(this._rotX), sx = Math.sin(this._rotX);
      const cy = Math.cos(this._rotY), sy = Math.sin(this._rotY);
      let y1 = y * cx - z * sx, z1 = y * sx + z * cx;
      let x2 = x * cy + z1 * sy, z2 = -x * sy + z1 * cy;
      const f = 460, s = f / (f - z2);
      const half = this._size / 2;
      return { x: half + x2 * s * (this._size / 200), y: half + y1 * s * (this._size / 200), s, z: z2 };
    }

    _draw() {
      const ctx = this._ctx, size = this._size, dpr = this._dpr;
      const shells = (this.getAttribute("shells") || "").split(",").map(Number).filter(n => n > 0);
      const symbol = this.getAttribute("symbol") || "";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, size, size);

      const n = shells.length;
      const rMin = 26, rMax = 92;
      const ink = "#2b2620", ring = "#c9c0b2", accent = "#e8590c";

      // each shell's guide-ring plane gets its own tilt (like real orbital planes)
      // — this is just the reference ring; electrons below get their OWN individual
      // tilt so they don't all sit flush on one flat disc (no "rings of Saturn").
      const tilt = (x, y, i) => {
        const a = i * 0.85 + 0.3, b = i * 0.5;
        let y1 = y * Math.cos(a), z1 = y * Math.sin(a);
        let x2 = x * Math.cos(b) + z1 * Math.sin(b);
        let z2 = -x * Math.sin(b) + z1 * Math.cos(b);
        return { x: x2, y: y1, z: z2 };
      };

      // deterministic pseudo-random per electron: small individual wobble ON TOP of
      // the shared shell-plane tilt, so electrons stay visibly attached to their
      // shell's guide ring while still each rotating on a slightly different tilt
      // (avoids both the flat "Saturn ring" look AND detaching from the shell).
      const seeded = (k) => { const x = Math.sin(k * 999.7 + 12.9898) * 43758.5453; return x - Math.floor(x); };
      const electronPoint = (r, a, shellIdx, elIdx) => {
        const k = shellIdx * 131 + elIdx;
        const wobble = (seeded(k * 1.7 + 0.3) - 0.5) * 0.5; // small extra inclination, radians
        const wobbleNode = seeded(k * 3.1 + 1.2) * Math.PI * 2;
        // start from the shell's shared orbital plane (same as its guide ring)…
        const base = tilt(r * Math.cos(a), r * Math.sin(a), shellIdx);
        // …then tip it slightly around a per-electron axis for individual variation.
        const cn = Math.cos(wobbleNode), sn = Math.sin(wobbleNode);
        const bx = base.x * cn + base.y * sn, by = -base.x * sn + base.y * cn, bz = base.z;
        const by2 = by * Math.cos(wobble) - bz * Math.sin(wobble);
        const bz2 = by * Math.sin(wobble) + bz * Math.cos(wobble);
        const x2 = bx * cn - by2 * sn, y2 = bx * sn + by2 * cn;
        return { x: x2, y: y2, z: bz2 };
      };

      // rings
      ctx.strokeStyle = ring;
      ctx.lineWidth = 1;
      shells.forEach((count, i) => {
        const r = n === 1 ? rMin : rMin + (i * (rMax - rMin)) / (n - 1);
        ctx.beginPath();
        for (let k = 0; k <= 72; k++) {
          const a = (k / 72) * Math.PI * 2;
          const t = tilt(r * Math.cos(a), r * Math.sin(a), i);
          const p = this._project(t.x, t.y, t.z);
          if (k === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
      });

      // electrons (collect, then draw back-to-front around nucleus)
      const dots = [];
      shells.forEach((count, i) => {
        const r = n === 1 ? rMin : rMin + (i * (rMax - rMin)) / (n - 1);
        const speed = 0.55 / (i * 0.6 + 1);
        for (let j = 0; j < count; j++) {
          const a = (j / count) * Math.PI * 2 + this._t * speed + i * 0.7;
          const t = electronPoint(r, a, i, j);
          dots.push(this._project(t.x, t.y, t.z));
        }
      });
      dots.sort((a, b) => a.z - b.z);

      const drawDot = (p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3 * p.s, 0, Math.PI * 2);
        ctx.fillStyle = ink;
        ctx.globalAlpha = 0.45 + 0.55 * Math.min(Math.max((p.z + 60) / 120, 0), 1);
        ctx.fill();
        ctx.globalAlpha = 1;
      };

      dots.filter(p => p.z < 0).forEach(drawDot);

      // nucleus — packed proton/neutron cluster, sized from the REAL atom (protons attr,
      // neutrons attr) rather than a generic guess, so different elements' nuclei actually differ.
      // Every proton and neutron is drawn — no sampling/cap — so the nucleus visibly grows
      // with atomic number/mass right up through the heaviest elements.
      const realProtons = Number(this.getAttribute("protons"));
      const realNeutrons = Number(this.getAttribute("neutrons"));
      const protons = realProtons > 0 ? realProtons : shells.reduce((a, b) => a + b, 0);
      const neutrons = realNeutrons >= 0 && this.hasAttribute("neutrons") ? realNeutrons : protons;
      const totalNucleons = Math.max(protons + neutrons, 1);
      const protonFrac = protons / totalNucleons;
      // dot radius shrinks gently as the count climbs (so ~250 nucleons stay legible)
      // but never collapses so much that the cluster's overall growth disappears.
      const dotR = Math.max(2.6, 5.2 - Math.cbrt(totalNucleons) * 0.55);
      // physically-correct close-packing radius: N spheres of radius dotR packed at
      // ~74% density (real close-packing fraction) fill a sphere of radius R.
      const R = dotR * Math.cbrt(totalNucleons / 0.74);
      if (!this._cluster || this._clusterKey !== protons + "/" + neutrons) {
        this._clusterKey = protons + "/" + neutrons;
        this._cluster = [];
        const GA = Math.PI * (3 - Math.sqrt(5));
        for (let i = 0; i < totalNucleons; i++) {
          const rr = R * Math.cbrt((i + 0.5) / totalNucleons);
          const th = Math.acos(1 - 2 * ((i + 0.5) / totalNucleons));
          const ph = i * GA;
          this._cluster.push({
            x: rr * Math.sin(th) * Math.cos(ph),
            y: rr * Math.sin(th) * Math.sin(ph),
            z: rr * Math.cos(th),
            proton: i < Math.round(totalNucleons * protonFrac),
          });
        }
      }
      const nucDots = this._cluster.map((c) => {
        const p = this._project(c.x, c.y, c.z);
        p.proton = c.proton;
        return p;
      });
      nucDots.sort((a, b) => a.z - b.z);
      nucDots.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, dotR * p.s * (size / 200), 0, Math.PI * 2);
        ctx.fillStyle = p.proton ? accent : "#a89d8e";
        ctx.fill();
        ctx.strokeStyle = "#faf6ef";
        ctx.lineWidth = 0.8;
        ctx.stroke();
      });

      dots.filter(p => p.z >= 0).forEach(drawDot);

      // symbol label (moved out of nucleus)
      if (symbol) {
        ctx.fillStyle = ink;
        ctx.font = "800 13px Archivo, sans-serif";
        ctx.textAlign = "left";
        ctx.textBaseline = "bottom";
        ctx.fillText(symbol, 6, size - 5);
      }
    }
  }
  if (!customElements.get("atom-3d")) customElements.define("atom-3d", Atom3D);
})();
