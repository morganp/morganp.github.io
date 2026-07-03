// progress-store.js — shared progress tracking (localStorage now, Firebase-ready shape)
// Public API:
//   Progress.markVisited(id)
//   Progress.markCompleted(id, meta)      meta optional e.g. {score, total}
//   Progress.get()                        -> {visited:{}, completed:{}}
//   Progress.onChange(cb)                 -> unsubscribe fn
//   Progress.isVisited(id) / isCompleted(id)
//   Progress.TOPICS                       -> id -> {label, level} registry used by the map + progress page
(function (global) {
  const KEY = "lsa_progress_v1";
  let listeners = [];

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return { visited: {}, completed: {} };
  }
  function save(state) {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
    listeners.forEach(cb => { try { cb(state); } catch (e) {} });
  }
  let state = load();

  const TOPICS = {
    "periodic-table": { label: "Periodic Table", level: "L2" },
    "states-of-matter": { label: "States of Matter", level: "L1-L2" },
    "electron-shells": { label: "Electron Shells", level: "L2-L3" },
    "matter-classify": { label: "Elements, Compounds & Mixtures", level: "L1-L2" },
    "acids-bases": { label: "Acids, Bases & pH", level: "L1-L2" },
    "word-equations": { label: "Reactions & Word Equations", level: "L1-L2" },
    "reactivity-series": { label: "Metals & Reactivity", level: "L2" },
    "materials-resources": { label: "Materials & Earth's Resources", level: "L1-L2" },
    "bonding": { label: "Bonding", level: "L3" },
    "rates-of-reaction": { label: "Rates of Reaction", level: "L3" },
    "energetics": { label: "Energetics", level: "L3" },
    "electrolysis": { label: "Electrolysis", level: "L3" },
    "periodic-trends": { label: "Periodic Trends", level: "L3" },
    "quantitative-chem": { label: "Quantitative Chemistry", level: "L3" },
    "organic-intro": { label: "Organic Chemistry Intro", level: "L3" },
    "chemical-analysis": { label: "Chemical Analysis", level: "L3" },
    "atmosphere-climate": { label: "Atmosphere & Climate", level: "L3" },
    "salts": { label: "Acids, Bases & Salts", level: "L3" },
    "forces-motion": { label: "Forces & Motion", level: "L1-L3" },
  };

  const Progress = {
    TOPICS,
    get() { return state; },
    isVisited(id) { return !!state.visited[id]; },
    isCompleted(id) { return !!state.completed[id]; },
    markVisited(id) {
      if (state.visited[id]) return;
      state = { ...state, visited: { ...state.visited, [id]: Date.now() } };
      save(state);
    },
    markCompleted(id, meta) {
      state = { ...state, completed: { ...state.completed, [id]: { at: Date.now(), ...(meta || {}) } } };
      save(state);
    },
    onChange(cb) { listeners.push(cb); return () => { listeners = listeners.filter(l => l !== cb); }; },
    stats() {
      const ids = Object.keys(TOPICS);
      const visitedN = ids.filter(id => state.visited[id]).length;
      const completedN = ids.filter(id => state.completed[id]).length;
      return { total: ids.length, visited: visitedN, completed: completedN };
    },
  };
  global.Progress = Progress;
})(window);
