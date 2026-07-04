// <lever-sim> — simple-machines lab. Three machines share one idea: trade distance for force.
// attrs: machine (lever|ramp|pulley), load (N), setting (lever: effort-arm cm; ramp: angle deg; pulley: rope count), width, height
(function () {
  const INK = "#2b2620", ORANGE = "#e8590c", GREY = "#a89d8e", PAPER = "#faf6ef", GREEN = "#2f7d3a";

  function draw(cv, machine, load, setting) {
    const ctx = cv.getContext("2d");
    const W = cv.width, H = cv.height;
    ctx.clearRect(0, 0, W, H);
    ctx.lineJoin = "round"; ctx.lineCap = "round";
    ctx.font = "12px 'IBM Plex Mono', monospace";

    let effort = load, ma = 1, distMult = 1, note = "";

    if (machine === "lever") {
      const loadArm = 40;           // fixed, cm
      const effortArm = setting;    // cm
      ma = effortArm / loadArm;
      effort = load / ma;
      // draw seesaw
      const pivotX = W * 0.42, baseY = H - 70;
      // beam pivoted at pivotX; load on left at loadArm, effort on right at effortArm (scaled)
      const scale = 2.1;
      const lx = pivotX - loadArm * scale, ex = pivotX + effortArm * scale;
      // tilt: balanced -> level
      const beamY = baseY - 40;
      ctx.strokeStyle = INK; ctx.lineWidth = 6;
      ctx.beginPath(); ctx.moveTo(lx, beamY); ctx.lineTo(Math.min(ex, W - 20), beamY); ctx.stroke();
      // pivot triangle
      ctx.fillStyle = ORANGE; ctx.beginPath();
      ctx.moveTo(pivotX, beamY + 3); ctx.lineTo(pivotX - 22, baseY); ctx.lineTo(pivotX + 22, baseY); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.stroke();
      // load block (left)
      ctx.fillStyle = INK; ctx.fillRect(lx - 22, beamY - 42, 44, 40);
      ctx.fillStyle = PAPER; ctx.textAlign = "center"; ctx.fillText("LOAD", lx, beamY - 26); ctx.fillText(load + "N", lx, beamY - 12);
      // effort arrow (down, right)
      const arrowLen = 30 + Math.min(60, effort * 0.5);
      ctx.strokeStyle = GREEN; ctx.lineWidth = 4;
      const eay = beamY - arrowLen;
      ctx.beginPath(); ctx.moveTo(Math.min(ex, W - 20), eay); ctx.lineTo(Math.min(ex, W - 20), beamY - 4); ctx.stroke();
      ctx.fillStyle = GREEN; ctx.beginPath();
      const ax = Math.min(ex, W - 20);
      ctx.moveTo(ax, beamY - 2); ctx.lineTo(ax - 6, beamY - 12); ctx.lineTo(ax + 6, beamY - 12); ctx.closePath(); ctx.fill();
      ctx.textAlign = "center"; ctx.fillText("EFFORT", ax, eay - 6);
      // arm labels
      ctx.fillStyle = GREY; ctx.font = "11px 'IBM Plex Mono', monospace";
      ctx.fillText("load arm 40cm", (lx + pivotX) / 2, baseY + 16);
      ctx.fillText("effort arm " + effortArm + "cm", (pivotX + ax) / 2, baseY + 16);
      note = "Longer effort arm → less effort needed";
    } else if (machine === "ramp") {
      const angle = setting;        // deg
      const rad = angle * Math.PI / 180;
      ma = 1 / Math.sin(rad);
      effort = load * Math.sin(rad);
      distMult = ma;
      // draw ramp
      const baseY = H - 60, x0 = 70, x1 = W - 90;
      const rampLen = x1 - x0;
      const topY = baseY - rampLen * Math.tan(rad);
      ctx.fillStyle = "#efe7d8"; ctx.strokeStyle = INK; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(x0, baseY); ctx.lineTo(x1, baseY); ctx.lineTo(x1, Math.max(topY, 60)); ctx.closePath(); ctx.fill(); ctx.stroke();
      // box on ramp midway
      const mx = (x0 + x1) / 2, my = baseY - (baseY - Math.max(topY, 60)) * ((mx - x0) / rampLen);
      ctx.save(); ctx.translate(mx, my - 4); ctx.rotate(-rad);
      ctx.fillStyle = INK; ctx.fillRect(-20, -34, 40, 34);
      ctx.fillStyle = PAPER; ctx.textAlign = "center"; ctx.font = "11px 'IBM Plex Mono', monospace";
      ctx.fillText(load + "N", 0, -14);
      ctx.restore();
      // angle label
      ctx.fillStyle = ORANGE; ctx.font = "13px 'IBM Plex Mono', monospace"; ctx.textAlign = "left";
      ctx.fillText(angle + "°", x0 + 24, baseY - 6);
      note = "Gentler slope → less effort, but a longer push";
    } else { // pulley
      const ropes = Math.max(1, Math.round(setting)); // number of supporting rope sections
      ma = ropes; effort = load / ropes; distMult = ropes;
      // draw pulley block
      const cx = W / 2, topY = 50;
      ctx.strokeStyle = INK; ctx.lineWidth = 2;
      // top support
      ctx.beginPath(); ctx.moveTo(cx - 90, topY); ctx.lineTo(cx + 90, topY); ctx.stroke();
      ctx.fillStyle = INK; for (let i = -1; i <= 1; i += 2) { }
      // fixed wheel top, moving wheel bottom
      const botY = H - 120;
      ctx.fillStyle = "#efe7d8";
      ctx.beginPath(); ctx.arc(cx - 24, topY + 22, 16, 0, 7); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx + 24, topY + 22, 16, 0, 7); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx, botY, 20, 0, 7); ctx.fill(); ctx.stroke();
      // ropes
      ctx.strokeStyle = ORANGE; ctx.lineWidth = 2.5;
      for (let i = 0; i < ropes; i++) {
        const rx = cx - 24 + (48 * i) / Math.max(1, ropes - 1 || 1);
        ctx.beginPath(); ctx.moveTo(rx, topY + 22); ctx.lineTo(rx, botY); ctx.stroke();
      }
      // load hanging
      ctx.fillStyle = INK; ctx.fillRect(cx - 26, botY + 20, 52, 44);
      ctx.fillStyle = PAPER; ctx.textAlign = "center"; ctx.font = "12px 'IBM Plex Mono', monospace";
      ctx.fillText("LOAD", cx, botY + 42); ctx.fillText(load + "N", cx, botY + 57);
      // effort arrow down on free rope
      ctx.strokeStyle = GREEN; ctx.lineWidth = 4;
      const freeX = cx + 70;
      ctx.beginPath(); ctx.moveTo(freeX, topY + 22); ctx.lineTo(cx + 40, topY + 22); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(freeX, topY + 22); ctx.lineTo(freeX, botY - 20); ctx.stroke();
      ctx.fillStyle = GREEN; ctx.beginPath();
      ctx.moveTo(freeX, botY - 18); ctx.lineTo(freeX - 6, botY - 30); ctx.lineTo(freeX + 6, botY - 30); ctx.closePath(); ctx.fill();
      ctx.textAlign = "left"; ctx.fillText("PULL", freeX + 8, (topY + botY) / 2);
      note = "More rope sections → less pull, but you pull more rope";
    }

    return { effort, ma, distMult, note };
  }

  class LeverSim extends HTMLElement {
    static get observedAttributes() { return ["machine", "load", "setting"]; }
    connectedCallback() { this._build(); this._render(); }
    attributeChangedCallback() { if (this._cv) this._render(); }
    _build() {
      this.innerHTML = "";
      const w = Number(this.getAttribute("width") || 700);
      const h = Number(this.getAttribute("height") || 340);
      this._wrap = document.createElement("div");
      this._wrap.style.cssText = "width:" + w + "px;";
      this._cv = document.createElement("canvas");
      this._cv.width = w; this._cv.height = h - 56;
      this._cv.style.cssText = "width:100%; height:" + (h - 56) + "px; border:2px solid " + INK + "; background:#fff; display:block;";
      this._read = document.createElement("div");
      this._read.style.cssText = "display:flex; gap:10px; margin-top:10px; flex-wrap:wrap;";
      this._wrap.appendChild(this._cv); this._wrap.appendChild(this._read);
      this.appendChild(this._wrap);
    }
    _render() {
      const machine = this.getAttribute("machine") || "lever";
      const load = Number(this.getAttribute("load") || 100);
      const setting = Number(this.getAttribute("setting") || 80);
      const r = draw(this._cv, machine, load, setting);
      const chip = (label, val, hi) =>
        '<div style="border:1.5px solid ' + INK + '; background:' + (hi ? ORANGE : "#fff") + '; color:' + (hi ? PAPER : INK) + '; padding:8px 12px; font-family:\'IBM Plex Mono\',monospace; font-size:12px;"><span style="opacity:.75; font-size:10px; display:block;">' + label + '</span><b style="font-size:16px;">' + val + '</b></div>';
      this._read.innerHTML =
        chip("EFFORT NEEDED", r.effort.toFixed(0) + " N", true) +
        chip("MECHANICAL ADV.", r.ma.toFixed(2) + "×") +
        chip("DISTANCE TRADE", r.distMult.toFixed(2) + "×") +
        '<div style="flex:1; min-width:160px; align-self:center; font-family:\'IBM Plex Mono\',monospace; font-size:11px; color:#6b6156;">' + r.note + '</div>';
    }
  }
  if (!customElements.get("lever-sim")) customElements.define("lever-sim", LeverSim);
})();
