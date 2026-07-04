// <field-sim> — magnetic field visualiser. Bar-magnet mode traces dipole field
// lines (N->S) with a test compass; electromagnet mode scales field strength with
// current and shows how many paperclips the coil can lift.
// attrs: mode (bar|electromagnet), current (0-10, electromagnet), turns (1-40), width, height
(function () {
  const INK = "#2b2620", REDN = "#c0392b", BLUES = "#2a5d8f", ORANGE = "#e8590c", GREY = "#a89d8e";

  // dipole field at (x,y) from two poles +q at p1, -q at p2
  function dipoleField(x, y, p1, p2) {
    let fx = 0, fy = 0;
    const add = (px, py, q) => {
      const dx = x - px, dy = y - py; let r2 = dx * dx + dy * dy; if (r2 < 60) r2 = 60;
      const r = Math.sqrt(r2); const f = q / r2;
      fx += f * dx / r; fy += f * dy / r;
    };
    add(p1[0], p1[1], 1); add(p2[0], p2[1], -1);
    return [fx, fy];
  }

  function traceLine(ctx, start, p1, p2, W, H, dir) {
    let x = start[0], y = start[1];
    ctx.beginPath(); ctx.moveTo(x, y);
    for (let i = 0; i < 400; i++) {
      const [fx, fy] = dipoleField(x, y, p1, p2);
      const m = Math.hypot(fx, fy) || 1;
      const step = 4 * dir;
      x += fx / m * step; y += fy / m * step;
      if (x < -20 || x > W + 20 || y < -20 || y > H + 20) break;
      // stop near south pole
      if (Math.hypot(x - p2[0], y - p2[1]) < 12) break;
      if (Math.hypot(x - p1[0], y - p1[1]) < 12) break;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  class FieldSim extends HTMLElement {
    static get observedAttributes() { return ["mode", "current", "turns"]; }
    connectedCallback() { this._build(); this._render(); }
    attributeChangedCallback() { if (this._cv) this._render(); }
    _build() {
      this.innerHTML = "";
      const w = Number(this.getAttribute("width") || 640);
      const h = Number(this.getAttribute("height") || 340);
      this._wrap = document.createElement("div"); this._wrap.style.cssText = "width:" + w + "px;";
      this._cv = document.createElement("canvas"); this._cv.width = w; this._cv.height = h - 52;
      this._cv.style.cssText = "width:100%; height:" + (h - 52) + "px; border:2px solid " + INK + "; background:#fbf7f0; display:block;";
      this._read = document.createElement("div");
      this._read.style.cssText = "display:flex; gap:10px; margin-top:10px; flex-wrap:wrap;";
      this._wrap.appendChild(this._cv); this._wrap.appendChild(this._read); this.appendChild(this._wrap);
    }
    _render() {
      const mode = this.getAttribute("mode") || "bar";
      const ctx = this._cv.getContext("2d");
      const W = this._cv.width, H = this._cv.height;
      ctx.clearRect(0, 0, W, H);
      const cx = W / 2, cy = H / 2;

      if (mode === "bar") {
        const half = 90, pw = 46;
        const p1 = [cx + half - 20, cy], p2 = [cx - half + 20, cy]; // N right(+), S left(-)
        // field lines
        ctx.strokeStyle = "rgba(43,38,32,0.35)"; ctx.lineWidth = 1.3;
        const seeds = 9;
        for (let i = 0; i < seeds; i++) {
          const ang = -Math.PI / 2 + (Math.PI) * (i / (seeds - 1));
          const sx = p1[0] + Math.cos(ang) * 16, sy = p1[1] + Math.sin(ang) * 16;
          traceLine(ctx, [sx, sy], p1, p2, W, H, 1);
        }
        // arrows on lines (sample direction near mid-top)
        [[cx, cy - 70], [cx, cy + 70], [cx + 130, cy], [cx - 130, cy]].forEach(([ax, ay]) => {
          const [fx, fy] = dipoleField(ax, ay, p1, p2); const m = Math.hypot(fx, fy) || 1;
          const ux = fx / m, uy = fy / m;
          ctx.fillStyle = ORANGE; ctx.beginPath();
          ctx.moveTo(ax + ux * 7, ay + uy * 7);
          ctx.lineTo(ax - ux * 5 - uy * 4, ay - uy * 5 + ux * 4);
          ctx.lineTo(ax - ux * 5 + uy * 4, ay - uy * 5 - ux * 4);
          ctx.closePath(); ctx.fill();
        });
        // magnet body (N right red, S left blue)
        ctx.fillStyle = BLUES; ctx.fillRect(cx - half, cy - pw / 2, half, pw);
        ctx.fillStyle = REDN; ctx.fillRect(cx, cy - pw / 2, half, pw);
        ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.strokeRect(cx - half, cy - pw / 2, half * 2, pw);
        ctx.fillStyle = "#fff"; ctx.font = "bold 20px 'Archivo', sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText("S", cx - half / 2, cy); ctx.fillText("N", cx + half / 2, cy);
        // legend
        ctx.textBaseline = "alphabetic"; ctx.textAlign = "left"; ctx.font = "11px 'IBM Plex Mono', monospace"; ctx.fillStyle = "#6b6156";
        ctx.fillText("field lines run N → S outside the magnet · arrows = compass direction", 12, H - 12);
        this._readChips([["FIELD SHAPE", "DIPOLE"], ["POLES", "N + S"], ["RULE", "LIKE POLES REPEL"]], "A compass needle lines up with the arrows. Break a magnet in half and you get two new N–S magnets.");
      } else {
        const current = Number(this.getAttribute("current") || 4);
        const turns = Number(this.getAttribute("turns") || 12);
        const strength = current * turns; // ampere-turns proxy
        // draw coil: solenoid of ellipses around a core
        const coilX0 = cx - 120, coilX1 = cx + 120, coilY = cy - 6, r = 34;
        // iron core
        ctx.fillStyle = "#b9b2a6"; ctx.fillRect(coilX0 - 10, coilY - 10, 260, 20);
        ctx.strokeStyle = INK; ctx.lineWidth = 1.5; ctx.strokeRect(coilX0 - 10, coilY - 10, 260, 20);
        ctx.font = "10px 'IBM Plex Mono', monospace"; ctx.fillStyle = "#6b6156"; ctx.textAlign = "center";
        ctx.fillText("IRON CORE", cx, coilY + 4);
        // windings
        const n = Math.max(4, Math.min(20, Math.round(turns)));
        ctx.strokeStyle = current > 0.1 ? "#b8722f" : "#9a948c"; ctx.lineWidth = 3;
        for (let i = 0; i < n; i++) {
          const x = coilX0 + (coilX1 - coilX0) * (i / (n - 1));
          ctx.beginPath(); ctx.ellipse(x, coilY, 10, r, 0, 0, Math.PI * 2); ctx.stroke();
        }
        // field lines strength -> number & spread
        const lines = Math.max(0, Math.min(6, Math.round(strength / 18)));
        ctx.strokeStyle = "rgba(232,89,12,0.5)"; ctx.lineWidth = 1.4;
        for (let k = 1; k <= lines; k++) {
          const off = k * 16;
          ctx.beginPath();
          ctx.moveTo(coilX1, coilY - off * 0.2);
          ctx.bezierCurveTo(coilX1 + 90, coilY - off, cx, coilY - off - 30, coilX0 - 90, coilY - off);
          ctx.lineTo(coilX0, coilY - off * 0.2);
          ctx.stroke();
        }
        // pole labels ends
        ctx.fillStyle = REDN; ctx.font = "bold 15px 'Archivo',sans-serif"; ctx.textAlign = "center";
        ctx.fillText(current >= 0 ? "N" : "S", coilX1 + 16, coilY + 5);
        ctx.fillStyle = BLUES; ctx.fillText(current >= 0 ? "S" : "N", coilX0 - 16, coilY + 5);
        // paperclips lifted
        const clips = Math.round(strength / 8);
        ctx.fillStyle = "#6b6156"; ctx.font = "11px 'IBM Plex Mono', monospace"; ctx.textAlign = "left";
        ctx.fillText("lifting " + clips + " paperclips", 12, H - 12);
        // draw dangling clips under core
        ctx.strokeStyle = "#8a857f"; ctx.lineWidth = 2;
        for (let i = 0; i < Math.min(clips, 12); i++) {
          const px = cx - 70 + i * 12;
          ctx.beginPath(); ctx.moveTo(px, coilY + 10); ctx.lineTo(px, coilY + 24); ctx.stroke();
          ctx.beginPath(); ctx.ellipse(px, coilY + 28, 3, 5, 0, 0, 7); ctx.stroke();
        }
        this._readChips([["CURRENT", current.toFixed(1) + " A"], ["TURNS", turns], ["STRENGTH", strength.toFixed(0) + " A·turns"]], "More current OR more turns of wire = a stronger electromagnet. Switch it off and the magnetism vanishes.");
      }
    }
    _readChips(chips, note) {
      const chip = (l, v, hi) => '<div style="border:1.5px solid ' + INK + '; background:' + (hi ? ORANGE : "#fff") + '; color:' + (hi ? "#faf6ef" : INK) + '; padding:8px 12px; font-family:\'IBM Plex Mono\',monospace; font-size:12px;"><span style="opacity:.75; font-size:10px; display:block;">' + l + '</span><b style="font-size:15px;">' + v + '</b></div>';
      this._read.innerHTML = chips.map((c, i) => chip(c[0], c[1], i === 0)).join("") +
        '<div style="flex:1; min-width:150px; align-self:center; font-family:\'IBM Plex Mono\',monospace; font-size:11px; color:#6b6156;">' + note + '</div>';
    }
  }
  if (!customElements.get("field-sim")) customElements.define("field-sim", FieldSim);
})();
