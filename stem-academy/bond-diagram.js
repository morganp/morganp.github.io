// <bond-diagram> — canvas showing ionic transfer or covalent sharing between two atoms
// attrs: kind="ionic|covalent|metallic" a-shells (csv) b-shells (csv) a-sym b-sym width height
(function () {
  class BondDiagram extends HTMLElement {
    static get observedAttributes() { return ["kind"]; }
    connectedCallback() { this._build(); this._draw(); }
    attributeChangedCallback() { if (this._ctx) this._draw(); }

    _build() {
      const w = Number(this.getAttribute("width") || 380);
      const h = Number(this.getAttribute("height") || 220);
      const dpr = window.devicePixelRatio || 1;
      this._canvas = document.createElement("canvas");
      this._canvas.width = w * dpr; this._canvas.height = h * dpr;
      this._canvas.style.width = w + "px"; this._canvas.style.height = h + "px";
      this.appendChild(this._canvas);
      this._ctx = this._canvas.getContext("2d");
      this._w = w; this._h = h; this._dpr = dpr;
    }

    _atom(cx, cy, shells, sym, r0, ink) {
      const ctx = this._ctx;
      shells.forEach((n, i) => {
        const r = r0 + i * 16;
        ctx.strokeStyle = "#c9c0b2"; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
      });
      ctx.beginPath(); ctx.arc(cx, cy, r0 - 8, 0, Math.PI * 2);
      ctx.fillStyle = "#e8590c"; ctx.fill(); ctx.strokeStyle = "#2b2620"; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.fillStyle = "#faf6ef"; ctx.font = "800 10px Archivo, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(sym, cx, cy + 1);
      return { cx, cy, r0 };
    }

    _electron(cx, cy, r, angle, color) {
      const ctx = this._ctx;
      const x = cx + r * Math.cos(angle), y = cy + r * Math.sin(angle);
      ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = color || "#2b2620"; ctx.fill();
      return { x, y };
    }

    _draw() {
      const ctx = this._ctx, w = this._w, h = this._h, kind = this.getAttribute("kind") || "ionic";
      ctx.setTransform(this._dpr, 0, 0, this._dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const cy = h / 2 + 6;

      if (kind === "ionic") {
        const aX = w * 0.28, bX = w * 0.72;
        this._atom(aX, cy, [8, 1], "Na", 16);
        this._atom(bX, cy, [8, 7], "Cl", 16);
        // arrow showing electron transfer
        ctx.strokeStyle = "#e8590c"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(aX + 46, cy - 24); ctx.bezierCurveTo(aX + 90, cy - 60, bX - 90, cy - 60, bX - 46, cy - 24); ctx.stroke();
        ctx.fillStyle = "#e8590c";
        ctx.beginPath(); ctx.arc(bX - 46, cy - 24, 4, 0, Math.PI * 2); ctx.fill();
        ctx.font = "600 10.5px 'IBM Plex Mono', monospace"; ctx.fillStyle = "#6b6156"; ctx.textAlign = "center";
        ctx.fillText("Na GIVES ITS 1 OUTER ELECTRON TO Cl", w / 2, cy - 70);
        ctx.font = "700 11px 'IBM Plex Mono', monospace";
        ctx.fillStyle = "#2f7d3a"; ctx.fillText("Na⁺", aX, cy + 52);
        ctx.fillStyle = "#4a90d9"; ctx.fillText("Cl⁻", bX, cy + 52);
        ctx.font = "500 10px 'IBM Plex Mono', monospace"; ctx.fillStyle = "#a89d8e";
        ctx.fillText("OPPOSITE CHARGES ATTRACT — IONIC BOND", w / 2, h - 12);
      } else if (kind === "covalent") {
        const aX = w * 0.32, bX = w * 0.68;
        this._atom(aX, cy, [8, 6], "O", 16);
        this._atom(bX, cy, [2], "H", 14);
        ctx.strokeStyle = "#2b2620"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(aX + 40, cy); ctx.lineTo(bX - 30, cy); ctx.stroke();
        // shared electron pair
        this._electron(aX + (bX - aX) * 0.5 - 4, cy, 0, 0, "#e8590c");
        this._electron(aX + (bX - aX) * 0.5 + 4, cy, 0, 0, "#e8590c");
        ctx.font = "500 10px 'IBM Plex Mono', monospace"; ctx.fillStyle = "#6b6156"; ctx.textAlign = "center";
        ctx.fillText("SHARED PAIR OF ELECTRONS", w / 2, cy - 40);
        ctx.fillStyle = "#a89d8e";
        ctx.fillText("NEITHER ATOM FULLY GIVES THEM UP — COVALENT BOND", w / 2, h - 12);
      } else { // metallic
        const cols = 4, rows = 2;
        for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
          const cx = w * 0.14 + c * (w * 0.72 / (cols - 1)), y = cy - 30 + r * 60;
          ctx.beginPath(); ctx.arc(cx, y, 15, 0, Math.PI * 2);
          ctx.fillStyle = "#a89d8e"; ctx.fill(); ctx.strokeStyle = "#2b2620"; ctx.lineWidth = 1.5; ctx.stroke();
        }
        // free electrons scattered (a "sea")
        for (let i = 0; i < 14; i++) {
          const x = w * 0.1 + Math.random() * w * 0.8, y = cy - 45 + Math.random() * 90;
          ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2);
          ctx.fillStyle = "#e8590c"; ctx.globalAlpha = 0.85; ctx.fill(); ctx.globalAlpha = 1;
        }
        ctx.font = "500 10px 'IBM Plex Mono', monospace"; ctx.fillStyle = "#6b6156"; ctx.textAlign = "center";
        ctx.fillText("METAL IONS SIT IN A 'SEA' OF FREE ELECTRONS", w / 2, h - 12);
      }
    }
  }
  if (!customElements.get("bond-diagram")) customElements.define("bond-diagram", BondDiagram);
})();
