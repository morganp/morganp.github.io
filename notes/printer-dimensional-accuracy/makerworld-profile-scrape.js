// MakerWorld print profile settings collector.
// Paste into the devtools console on any makerworld.com page (same-origin fetch
// is required, the API 403s from curl behind Cloudflare).
//
// Public API used:
//   /api/v1/search-service/select/design?offset=&limit=&sort=download   list
//   /api/v1/design-service/design/{id}                                  detail
// Per profile (instance) the detail response carries:
//   extention.modelInfo.projectSettings = {layerHeight, wallLoops, sparseInfillDensity}
//   ratingScoreTotal, ratingCount, isOfficial, downloadCount, printCount, needAms
// Nothing else from the slicer profile is public. Supports, speeds, temperatures
// and compensations live only inside the downloadable 3mf, which needs an account.
//
// Seed ids: search result pages are server rendered, so collect ids from the DOM
// of /en/search/models?keyword=<term> rather than from the search API.

window.__collect = {
  ids: [],
  out: [],
  i: 0,

  // Run on each search results page to accumulate model ids.
  scrapeIds() {
    const ids = new Set(JSON.parse(localStorage.getItem('__ids') || '[]'));
    document.querySelectorAll('a[href*="/models/"]').forEach(a => {
      const m = a.getAttribute('href').match(/\/models\/(\d+)/);
      if (m) ids.add(+m[1]);
    });
    localStorage.setItem('__ids', JSON.stringify([...ids]));
    return ids.size;
  },

  // Fetch profile rows for the next n models. Call repeatedly, 35 at a time,
  // to stay under the devtools evaluation timeout.
  async run(n) {
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    if (!this.ids.length) this.ids = JSON.parse(localStorage.getItem('__ids') || '[]');
    let done = 0, errs = 0;
    while (done < n && this.i < this.ids.length) {
      const id = this.ids[this.i++];
      try {
        const j = await (await fetch(`/api/v1/design-service/design/${id}`,
                                     {headers: {accept: 'application/json'}})).json();
        for (const p of (j.instances || [])) {
          const ps = (p.extention && p.extention.modelInfo && p.extention.modelInfo.projectSettings) || {};
          this.out.push({
            d: id,
            t: (p.title || '').slice(0, 60),
            s: p.ratingCount ? +(p.ratingScoreTotal / p.ratingCount).toFixed(2) : null,
            n: p.ratingCount,
            off: p.isOfficial ? 1 : 0,
            dl: p.downloadCount,
            pr: p.printCount,
            lh: ps.layerHeight,
            w: ps.wallLoops,
            inf: ps.sparseInfillDensity,
            ams: p.needAms ? 1 : 0,
            f: (p.instanceFilaments || []).map(x => x.type).join('/')
          });
        }
      } catch (e) { errs++; }
      done++;
      await sleep(120);
    }
    localStorage.setItem('__prof', JSON.stringify(this.out));
    return [this.i, this.out.length, errs];
  },

  csv() {
    const h = 'design,title,stars,ratings,official,downloads,prints,layer,walls,infill,ams,filament';
    const rows = this.out.map(p => [p.d, JSON.stringify(p.t), p.s, p.n, p.off, p.dl, p.pr,
                                    p.lh, p.w, p.inf, p.ams, p.f].join(','));
    return [h, ...rows].join('\n');
  }
};
