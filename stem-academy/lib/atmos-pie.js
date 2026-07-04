// <atmos-pie> — canvas donut chart of atmosphere composition
// attrs: width height (fixed data: N2 78%, O2 21%, other 1%)
(function () {
  class AtmosPie extends HTMLElement {
    connectedCallback() {
      const w = Number(this.getAttribute("width") || 260);
      const h = Number(this.getAttribute("height") || 260);
      const dpr = window.devicePixelRatio || 1;
      this._canvas = document.createElement("canvas");
      this._canvas.width = w * dpr; this._canvas.height = h * dpr;
      this._canvas.style.width = w + "px"; this._canvas.style.height = h + "px";
      this.appendChild(this._canvas);
      const ctx = this._canvas.getContext("2d");
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const cx = w / 2, cy = h / 2 - 10, r = Math.min(w, h) / 2 - 40;
      const slices = [
        { label: "Nitrogen N₂", value: 78, color: "#66a3a3" },
        { label: "Oxygen O₂", value: 21, color: "#4a90d9" },
        { label: "Argon + CO₂ + other", value: 1, color: "#e8590c" },
      ];
      let start = -Math.PI / 2;
      const ink = "#2b2620";
      slices.forEach(s => {
        const angle = (s.value / 100) * Math.PI * 2;
        ctx.beginPath(); ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, r, start, start + angle);
        ctx.closePath();
        ctx.fillStyle = s.color; ctx.fill();
        ctx.strokeStyle = "#faf6ef"; ctx.lineWidth = 2; ctx.stroke();
        start += angle;
      });
      ctx.font = "700 11px 'IBM Plex Mono', monospace"; ctx.textAlign = "left";
      slices.forEach((s, i) => {
        const y = cy + r + 26 + i * 16;
        ctx.fillStyle = s.color; ctx.fillRect(cx - r, y - 9, 10, 10);
        ctx.fillStyle = ink; ctx.fillText(s.label + " — " + s.value + "%", cx - r + 16, y);
      });
    }
  }
  if (!customElements.get("atmos-pie")) customElements.define("atmos-pie", AtmosPie);
})();
