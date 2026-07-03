// progress-store.js — shared progress tracking. localStorage always (offline/guest layer);
// mirrors to Firebase Auth + Firestore when signed in, so progress syncs cross-device.
// Public API:
//   Progress.markVisited(id)
//   Progress.markCompleted(id, meta)      meta optional e.g. {score, total}
//   Progress.get()                        -> {visited:{}, completed:{}}
//   Progress.onChange(cb)                 -> unsubscribe fn
//   Progress.isVisited(id) / isCompleted(id)
//   Progress.TOPICS                       -> id -> {label, level} registry used by the map + progress page
//   Progress.signIn() / Progress.signOutUser()
//   Progress.onAuthChange(cb)             -> unsubscribe fn; cb receives {user, syncing} (user null = signed out)
//   Progress.authUser()                   -> current firebase user or null
(function (global) {
  const KEY = "lsa_progress_v1";
  let listeners = [];
  let authListeners = [];
  let authUser = null;
  let syncing = false;

  const firebaseConfig = {
    apiKey: "AIzaSyD3EUADdF_nGKVoSBUTEzMyN0TES5quVzU",
    authDomain: "lizard-spock-stem.firebaseapp.com",
    projectId: "lizard-spock-stem",
    storageBucket: "lizard-spock-stem.firebasestorage.app",
    messagingSenderId: "29155796196",
    appId: "1:29155796196:web:bac2348423fc2e5b4df8f1",
    measurementId: "G-BQJ48N38DT",
  };

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return { visited: {}, completed: {} };
  }
  function save(state, opts) {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
    listeners.forEach(cb => { try { cb(state); } catch (e) {} });
    if (!(opts && opts.skipCloud)) pushToCloud(state);
  }
  let state = load();

  function notifyAuth() {
    authListeners.forEach(cb => { try { cb({ user: authUser, syncing }); } catch (e) {} });
  }

  // Merge two progress states: union of visited (earliest timestamp wins),
  // union of completed (latest attempt wins).
  function mergeStates(a, b) {
    const visited = { ...a.visited };
    Object.keys(b.visited).forEach(id => {
      visited[id] = visited[id] ? Math.min(visited[id], b.visited[id]) : b.visited[id];
    });
    const completed = { ...a.completed };
    Object.keys(b.completed).forEach(id => {
      const cur = completed[id];
      completed[id] = (!cur || (b.completed[id].at || 0) > (cur.at || 0)) ? b.completed[id] : cur;
    });
    return { visited, completed };
  }

  // --- Firebase (lazy, dynamic ESM import — no build step needed) ---
  let fb = null; // { app, auth, db, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, doc, getDoc, setDoc, onSnapshot }
  let unsubDoc = null;
  let fbReady = null;

  function loadFirebase() {
    if (fbReady) return fbReady;
    fbReady = (async () => {
      const [{ initializeApp }, authMod, fsMod] = await Promise.all([
        import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"),
        import("https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js"),
        import("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"),
      ]);
      const app = initializeApp(firebaseConfig);
      const auth = authMod.getAuth(app);
      const db = fsMod.getFirestore(app);
      fb = { app, auth, db, ...authMod, ...fsMod };
      authMod.onAuthStateChanged(auth, onAuthStateChanged);
      return fb;
    })().catch(e => { console.warn("Firebase unavailable, staying local-only:", e); return null; });
    return fbReady;
  }

  async function onAuthStateChanged(user) {
    if (unsubDoc) { unsubDoc(); unsubDoc = null; }
    authUser = user || null;
    if (!user) { notifyAuth(); return; }

    syncing = true; notifyAuth();
    try {
      const ref = fb.doc(fb.db, "progress", user.uid);
      const snap = await fb.getDoc(ref);
      const cloud = snap.exists() ? snap.data() : { visited: {}, completed: {} };
      const merged = mergeStates(state, { visited: cloud.visited || {}, completed: cloud.completed || {} });
      state = merged;
      try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
      await fb.setDoc(ref, state);
      listeners.forEach(cb => { try { cb(state); } catch (e) {} });

      unsubDoc = fb.onSnapshot(ref, (s) => {
        if (!s.exists()) return;
        const d = s.data();
        state = { visited: d.visited || {}, completed: d.completed || {} };
        try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
        listeners.forEach(cb => { try { cb(state); } catch (e) {} });
      });
    } catch (e) {
      console.warn("Progress cloud sync failed:", e);
    }
    syncing = false; notifyAuth();
  }

  function pushToCloud(s) {
    if (!fb || !authUser) return;
    try { fb.setDoc(fb.doc(fb.db, "progress", authUser.uid), s).catch(() => {}); } catch (e) {}
  }

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
    authUser() { return authUser; },
    onAuthChange(cb) {
      authListeners.push(cb);
      cb({ user: authUser, syncing });
      return () => { authListeners = authListeners.filter(l => l !== cb); };
    },
    async signIn() {
      const f = await loadFirebase();
      if (!f) throw new Error("Firebase failed to load");
      const provider = new f.GoogleAuthProvider();
      await f.signInWithPopup(f.auth, provider);
    },
    async signOutUser() {
      if (!fb) return;
      await fb.signOut(fb.auth);
    },
  };
  global.Progress = Progress;
  loadFirebase(); // start loading immediately so auth state (if already signed in) resolves fast
})(window);
