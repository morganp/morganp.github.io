// <ray-sim> — geometric optics. Reflection mode: incident ray hits a mirror, reflects
// at an equal angle. Refraction mode: ray crosses into water/glass and bends toward the
// normal (Snell's law). attrs: mode (reflection|refraction), angle (deg from normal), medium (water|glass|diamond), width, height
(function () {
  const INK = "#2b2620", ORANGE = "#e8590c", BLUE = "#2a5d8f", GREY = "#a89d8e";
  const N = { water: 1.33, glass: 1.5, diamond: 2.42 };

  class RaySim extends HTMLElement {
    static get observedAttributes() { return ["mode", "angle", "medium"]; }
    connectedCallback() { this._build(); this._render(); }
    attributeChangedCallback() { if (this._cv) this._render(); }
    _build() {
      this.innerHTML = "";
      const w = Number(this.getAttribute("width") || 620);
      const h = Number(this.getAttribute("height") || 340);
      this._wrap = document.createElement("div"); this._wrap.style.cssText = "width:" + w + "px;";
      this._cv = document.createElement("canvas"); this._cv.width = w; this._cv.height = h - 52;
      this._cv.style.cssText = "width:100%; height:" + (h - 52) + "px; border:2px solid " + INK + "; background:#0d1220; display:block;";
      this._read = document.createElement("div"); this._read.style.cssText = "display:flex; gap:10px; margin-top:10px; flex-wrap:wrap;";
      this._wrap.appendChild(this._cv); this._wrap.appendChild(this._read); this.appendChild(this._wrap);
    }
    _render() {
      const mode = this.getAttribute("mode") || "reflection";
      const angle = Number(this.getAttribute("angle") || 40); // degrees from normal
      const medium = this.getAttribute("medium") || "water";
      const ctx = this._cv.getContext("2d");
      const W = this._cv.width, H = this._cv.height;
      ctx.clearRect(0, 0, W, H);
      const cx = W / 2, cy = H / 2, L = 150;
      const rad = angle * Math.PI / 180;

      // surface line (horizontal), normal (vertical dashed)
      ctx.strokeStyle = "#3a4258"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(30, cy); ctx.lineTo(W - 30, cy); ctx.stroke();
      ctx.setLineDash([6, 5]); ctx.strokeStyle = "#6b7590"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(cx, cy - 130); ctx.lineTo(cx, cy + 130); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = "#8a93a8"; ctx.font = "10px 'IBM Plex Mono', monospace"; ctx.textAlign = "left";
      ctx.fillText("normal", cx + 6, cy - 118);

      // incident ray from upper-left to origin
      const ix = cx - Math.sin(rad) * L, iy = cy - Math.cos(rad) * L;
      const drawRay = (x1, y1, x2, y2, col, w2) => {
        ctx.strokeStyle = col; ctx.lineWidth = w2; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
        // arrowhead mid
        const mx = (x1 + x2) / 2, my = (y1 + y2) / 2; const a = Math.atan2(y2 - y1, x2 - x1);
        ctx.fillStyle = col; ctx.beginPath();
        ctx.moveTo(mx + Math.cos(a) * 8, my + Math.sin(a) * 8);
        ctx.lineTo(mx + Math.cos(a + 2.5) * 8, my + Math.sin(a + 2.5) * 8);
        ctx.lineTo(mx + Math.cos(a - 2.5) * 8, my + Math.sin(a - 2.5) * 8);
        ctx.closePath(); ctx.fill();
      };
      drawRay(ix, iy, cx, cy, "#ffd43b", 3);
      ctx.fillStyle = "#ffd43b"; ctx.font = "11px 'IBM Plex Mono', monospace"; ctx.textAlign = "right";
      ctx.fillText("incident", ix - 4, iy);

      let r2label = "", chips;
      if (mode === "reflection") {
        // shade below as mirror
        ctx.fillStyle = "rgba(120,130,160,0.25)"; ctx.fillRect(30, cy, W - 60, cy - 20);
        for (let x = 40; x < W - 30; x += 14) { ctx.strokeStyle = "#4a5268"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x, cy); ctx.lineTo(x - 8, cy + 8); ctx.stroke(); }
        // reflected ray upper-right, same angle
        const rx = cx + Math.sin(rad) * L, ry = cy - Math.cos(rad) * L;
        drawRay(cx, cy, rx, ry, "#ff9d3c", 3);
        ctx.fillStyle = "#ff9d3c"; ctx.textAlign = "left"; ctx.fillText("reflected", rx + 4, ry);
        // angle arcs
        ctx.strokeStyle = "#8a93a8"; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.arc(cx, cy, 40, -Math.PI / 2 - rad, -Math.PI / 2); ctx.stroke();
        ctx.beginPath(); ctx.arc(cx, cy, 40, -Math.PI / 2, -Math.PI / 2 + rad); ctx.stroke();
        ctx.fillStyle = "#cdd3e0"; ctx.textAlign = "center";
        ctx.fillText(angle + "°", cx - 30 * Math.sin(rad / 2) - 8, cy - 46);
        ctx.fillText(angle + "°", cx + 30 * Math.sin(rad / 2) + 8, cy - 46);
        chips = [["ANGLE IN", angle + "°"], ["ANGLE OUT", angle + "°"], ["LAW", "i = r"]];
        this._note = "Law of reflection: the angle of incidence always equals the angle of reflection.";
      } else {
        // refraction: ray enters medium below, bends toward normal
        const n = N[medium] || 1.33;
        const sinT = Math.sin(rad) / n;
        let refr;
        if (sinT > 1) { refr = null; } else { refr = Math.asin(sinT); }
        // shade medium below
        ctx.fillStyle = medium === "water" ? "rgba(60,130,190,0.28)" : medium === "glass" ? "rgba(150,200,210,0.22)" : "rgba(200,220,255,0.28)";
        ctx.fillRect(30, cy, W - 60, cy - 20);
        ctx.fillStyle = "#7f95b8"; ctx.font = "11px 'IBM Plex Mono', monospace"; ctx.textAlign = "left";
        ctx.fillText(medium.toUpperCase() + "  n = " + n, 40, cy + 22);
        ctx.fillText("AIR  n = 1.00", 40, cy - 12);
        if (refr === null) {
          // total internal reflection note (won't happen air->denser, but guard)
          const rx = cx + Math.sin(rad) * L, ry = cy - Math.cos(rad) * L;
          drawRay(cx, cy, rx, ry, "#ff9d3c", 3);
          chips = [["ANGLE IN", angle + "°"], ["RESULT", "REFLECTED"], ["MEDIUM", medium]];
          this._note = "Beyond the critical angle the light can't get out — it reflects back in.";
        } else {
          const tx = cx + Math.sin(refr) * L, ty = cy + Math.cos(refr) * L;
          drawRay(cx, cy, tx, ty, "#ffd43b", 3);
          ctx.fillStyle = "#ffd43b"; ctx.textAlign = "left"; ctx.fillText("refracted", tx + 4, ty);
          // arcs
          ctx.strokeStyle = "#8a93a8"; ctx.lineWidth = 1.2;
          ctx.beginPath(); ctx.arc(cx, cy, 40, -Math.PI / 2 - rad, -Math.PI / 2); ctx.stroke();
          ctx.beginPath(); ctx.arc(cx, cy, 40, Math.PI / 2, Math.PI / 2 + refr); ctx.stroke();
          chips = [["ANGLE IN (air)", angle + "°"], ["ANGLE OUT", Math.round(refr * 180 / Math.PI) + "°"], ["MEDIUM", medium]];
          this._note = "Entering a denser medium, light slows and bends TOWARD the normal. Denser = bends more.";
        }
      }

      const chip = (l, v, hi) => '<div style="border:1.5px solid ' + INK + '; background:' + (hi ? ORANGE : "#fff") + '; color:' + (hi ? "#faf6ef" : INK) + '; padding:8px 12px; font-family:\'IBM Plex Mono\',monospace; font-size:12px;"><span style="opacity:.75; font-size:10px; display:block;">' + l + '</span><b style="font-size:15px;">' + v + '</b></div>';
      this._read.innerHTML = chips.map((c, i) => chip(c[0], c[1], i === 0)).join("") +
        '<div style="flex:1; min-width:150px; align-self:center; font-family:\'IBM Plex Mono\',monospace; font-size:11px; color:#6b6156;">' + this._note + '</div>';
    }
  }
  if (!customElements.get("ray-sim")) customElements.define("ray-sim", RaySim);
})();
