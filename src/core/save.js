/* =========================================================================
 *  Sauvegarde — deux couches strictement séparées :
 *   - perm  : progression validée (au réveil normal)
 *   - dream : ce qui a été trouvé cette nuit (jeté en cas de capture)
 *  Stockage local du navigateur, somme de contrôle, copie de secours,
 *  instantané du rêve pour survivre à un rechargement.
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN;
  var U = YN.util;
  var SAVE_VERSION = 3;
  var KEY = 'yn_dream_archive_save', BAK = 'yn_dream_archive_save_bak',
      SNAP = 'yn_dream_archive_snapshot', SETTINGS = 'yn_dream_archive_settings';
  // aWYgeW91IGFyZSByZWFkaW5nIHRoaXMsIHRoZSBiaXNjdWl0IHdpbGwgbm90IHByb3RlY3QgeW91IGZyb20gaGVyLg==

  /* ---------- couche de stockage (remplaçable dans les tests) ---------- */
  var memStore = {};
  YN.store = {
    backend: null,
    init: function () {
      try {
        var ls = root.localStorage;
        var k = '__yn_probe__'; ls.setItem(k, '1'); ls.removeItem(k);
        this.backend = ls;
      } catch (e) {
        YN.warn('local storage unavailable: progress will not survive closing the tab');
        this.backend = null;
      }
    },
    get: function (k) {
      try { return this.backend ? this.backend.getItem(k) : (k in memStore ? memStore[k] : null); }
      catch (e) { return null; }
    },
    set: function (k, v) {
      try { if (this.backend) this.backend.setItem(k, v); else memStore[k] = v; return true; }
      catch (e) { YN.warn('cannot write (' + k + '): ' + e); return false; }
    },
    del: function (k) {
      try { if (this.backend) this.backend.removeItem(k); else delete memStore[k]; } catch (e) { /* rien */ }
    },
    useMemory: function () { this.backend = null; memStore = {}; }
  };

  function checksum(str) { return YN.rng.hash(str).toString(36); }

  function newPerm() {
    return {
      v: SAVE_VERSION,
      created: Date.now(), updated: Date.now(),
      _: 'she is still asleep',
      accepted: false, schemaSeen: false,
      stats: { dreams: 0, wakes: 0, captures: 0, cookieSaves: 0, pinches: 0, timeouts: 0, doorWakes: 0, dreamSeconds: 0 },
      effects: [], equipped: null,
      cookies: 0,
      pills: { blue: 3, white: 7, blueTick: 0 },
      room: { light: true, window: false, door: false },
      worlds: {}, npcs: {}, rel: {}, flags: {}, quests: {}, secrets: {},
      corruption: {}, eggs: [], notes: [], items: {},
      mother: { visits: 0, last: 0 },
      witchesMet: {}, endings: [], debug: false,
      arcade: { best: 0, bestFruit: 0 },
      route: {}, lastDream: null
    };
  }

  function newDream(perm, opts) {
    opts = opts || {};
    var duration = opts.pill ? 1200 : 600;
    return {
      no: perm.stats.dreams + 1,
      started: Date.now(),
      duration: duration,
      remaining: duration,
      pill: !!opts.pill,
      white: !!opts.white,
      room: U.copy(perm.room),
      effects: [], flags: {}, quests: {}, rel: {}, items: {}, notes: [], secrets: {},
      worlds: {}, npcs: {}, eggs: [],
      cookiesFound: 0,
      said: [], route: [], priestessIn: {},
      depthMax: 1,
      mother: { roll: false, at: 0, done: false },
      temp: {}
    };
  }

  /* ---------- validation ---------- */
  function validate(p) {
    var issues = [];
    if (!p || typeof p !== 'object') return { ok: false, issues: ['unreadable content'] };
    var base = newPerm();
    Object.keys(base).forEach(function (k) {
      if (p[k] === undefined || (typeof p[k] !== typeof base[k]) || (Array.isArray(base[k]) !== Array.isArray(p[k]))) {
        if (p[k] !== undefined) issues.push('field repaired: ' + k);
        p[k] = base[k];
      }
    });
    Object.keys(base.stats).forEach(function (k) { if (typeof p.stats[k] !== 'number') p.stats[k] = 0; });
    ['light', 'window', 'door'].forEach(function (k) { p.room[k] = !!p.room[k]; });
    // identifiants inconnus : on ne les supprime pas des drapeaux, mais des effets oui
    if (YN.data.effects && YN.data.effects.length) {
      var before = p.effects.length;
      p.effects = p.effects.filter(function (id, i, a) { return YN.effectById(id) && a.indexOf(id) === i; });
      if (p.effects.length !== before) issues.push('unknown effects removed: ' + (before - p.effects.length));
      p.eggs = p.eggs.filter(function (id, i, a) { return YN.effectById(id) && a.indexOf(id) === i; });
      if (p.equipped && p.effects.indexOf(p.equipped) < 0) p.equipped = null;
    }
    p.cookies = U.clamp(p.cookies | 0, 0, 3);
    p.pills.blue = U.clamp(p.pills.blue | 0, 0, 5);
    p.pills.white = U.clamp(p.pills.white | 0, 0, 7);
    Object.keys(p.corruption).forEach(function (w) {
      var c = p.corruption[w];
      if (!c || typeof c.lvl !== 'number') { delete p.corruption[w]; return; }
      c.lvl = U.clamp(Math.round(c.lvl), 0, 5);
      if (!c.lvl) delete p.corruption[w];
    });
    if (p.v < SAVE_VERSION) { issues.push('migration v' + p.v + ' → v' + SAVE_VERSION); p.v = SAVE_VERSION; }
    return { ok: true, issues: issues };
  }

  /* ---------- module ---------- */
  var S = YN.save = {
    VERSION: SAVE_VERSION,
    perm: null,
    dream: null,
    loadIssues: [],
    corruptedOnLoad: false,

    newPerm: newPerm,
    validate: validate,
    checksum: checksum,

    exists: function () { return !!YN.store.get(KEY) || !!YN.store.get(BAK); },

    _read: function (key) {
      var raw = YN.store.get(key);
      if (!raw) return null;
      try {
        var box = JSON.parse(raw);
        if (!box || typeof box.payload !== 'string') return null;
        if (checksum(box.payload) !== box.sum) return { bad: true };
        return { perm: JSON.parse(box.payload) };
      } catch (e) { return { bad: true }; }
    },

    load: function () {
      this.loadIssues = []; this.corruptedOnLoad = false;
      var r = this._read(KEY);
      if (!r || r.bad) {
        if (r && r.bad) { this.corruptedOnLoad = true; this.loadIssues.push('main save damaged'); }
        var b = this._read(BAK);
        if (b && !b.bad) { r = b; this.loadIssues.push('backup copy used'); }
        else { r = null; if (b && b.bad) this.loadIssues.push('backup copy damaged'); }
      }
      if (!r) { this.perm = null; return false; }
      var v = validate(r.perm);
      this.loadIssues = this.loadIssues.concat(v.issues);
      this.perm = r.perm;
      return true;
    },

    fresh: function () { this.perm = newPerm(); this.dream = null; return this.perm; },

    write: function () {
      if (!this.perm) return false;
      this.perm.updated = Date.now();
      var payload = JSON.stringify(this.perm);
      var box = JSON.stringify({ payload: payload, sum: checksum(payload), v: SAVE_VERSION });
      var ok = YN.store.set(KEY, box);
      if (ok) {
        // vérifie la relecture avant de mettre à jour la copie de secours
        var back = this._read(KEY);
        if (back && !back.bad) YN.store.set(BAK, box);
        else YN.warn('save read-back failed');
      }
      return ok;
    },

    wipe: function () {
      YN.store.del(KEY); YN.store.del(BAK); YN.store.del(SNAP);
      this.perm = null; this.dream = null;
    },

    /* ---------- rêve ---------- */
    beginDream: function (opts) {
      this.dream = newDream(this.perm, opts);
      return this.dream;
    },

    inDream: function () { return !!this.dream; },

    /* Réveil normal : on valide tout ce qui a été trouvé cette nuit. */
    commitDream: function (reason) {
      var p = this.perm, d = this.dream;
      if (!p || !d) return null;
      var summary = { effects: d.effects.slice(), worlds: 0, notes: d.notes.length, reason: reason };
      d.effects.forEach(function (id) { if (p.effects.indexOf(id) < 0) p.effects.push(id); });
      U.keys(d.flags).forEach(function (k) { if (d.flags[k] === null) delete p.flags[k]; else p.flags[k] = d.flags[k]; });
      U.keys(d.quests).forEach(function (k) { p.quests[k] = d.quests[k]; });
      U.keys(d.rel).forEach(function (k) { p.rel[k] = (p.rel[k] || 0) + d.rel[k]; });
      U.keys(d.items).forEach(function (k) {
        p.items[k] = (p.items[k] || 0) + d.items[k];
        if (p.items[k] <= 0) delete p.items[k];
      });
      d.notes.forEach(function (n) { if (p.notes.indexOf(n) < 0) p.notes.push(n); });
      U.keys(d.secrets).forEach(function (k) { p.secrets[k] = d.secrets[k]; });
      U.keys(d.worlds).forEach(function (w) {
        var rec = p.worlds[w] || (p.worlds[w] = { v: 0, d: d.no });
        if (!rec.v) summary.worlds++;
        rec.v += d.worlds[w];
      });
      U.keys(d.npcs).forEach(function (n) {
        var rec = p.npcs[n] || (p.npcs[n] = { met: d.no, talks: 0 });
        rec.talks += d.npcs[n];
      });
      d.eggs.forEach(function (id) {
        if (p.eggs.indexOf(id) < 0) p.eggs.push(id);
        var k = p.effects.indexOf(id); if (k >= 0) p.effects.splice(k, 1);
      });
      for (var i = 1; i < d.route.length; i++) {
        var key = d.route[i - 1] + '>' + d.route[i];
        p.route[key] = (p.route[key] || 0) + 1;
      }
      p.cookies = U.clamp(p.cookies + d.cookiesFound, 0, 3);
      p.room = U.copy(d.room);
      if (p.equipped && p.effects.indexOf(p.equipped) < 0) p.equipped = null;
      // décroissance de la corruption laissée par la Prêtresse
      U.keys(p.corruption).forEach(function (w) {
        if (!d.priestessIn[w]) p.corruption[w].lvl -= 1;
        if (p.corruption[w].lvl <= 0) delete p.corruption[w];
      });
      // les comprimés reviennent, sans explication
      p.pills.white = Math.min(7, p.pills.white + 1);
      p.pills.blueTick = (p.pills.blueTick || 0) + 1;
      if (p.pills.blueTick >= 3) { p.pills.blueTick = 0; p.pills.blue = Math.min(5, p.pills.blue + 1); }
      p.stats.dreams++; p.stats.wakes++;
      p.stats.dreamSeconds += Math.round(d.duration - d.remaining);
      p.lastDream = { no: d.no, reason: reason, effects: d.effects.length, at: Date.now() };
      this.dream = null;
      this.clearSnapshot();
      this.write();
      return summary;
    },

    /* Capture : tout ce qui n'a pas été validé disparaît. */
    discardDream: function (by) {
      var p = this.perm, d = this.dream;
      if (!p) return null;
      var lost = d ? { effects: d.effects.slice(), notes: d.notes.length, cookies: d.cookiesFound, by: by } : null;
      p.stats.dreams++; p.stats.captures++;
      if (d) {
        p.stats.dreamSeconds += Math.round(d.duration - d.remaining);
        p.room = U.copy(d.room); // la lumière éteinte par la mère reste éteinte : c'est le monde réel
      }
      p.lastDream = { no: d ? d.no : 0, reason: 'capture', by: by, lost: lost ? lost.effects.length : 0, at: Date.now() };
      this.dream = null;
      this.clearSnapshot();
      this.write();
      return lost;
    },

    /* ---------- accès fusionnés ---------- */
    isEgg: function (id) {
      return (this.perm && this.perm.eggs.indexOf(id) >= 0) || (this.dream && this.dream.eggs.indexOf(id) >= 0);
    },
    effectState: function (id) {
      if (this.isEgg(id)) return null; // un effet couché dans un nid ne s'utilise plus
      if (this.perm && this.perm.effects.indexOf(id) >= 0) return 'saved';
      if (this.dream && this.dream.effects.indexOf(id) >= 0) return 'dream';
      return null;
    },
    hasEffect: function (id) { return !!this.effectState(id); },
    ownedEffects: function () {
      var self = this, l = this.perm ? this.perm.effects.slice() : [];
      if (this.dream) this.dream.effects.forEach(function (e) { if (l.indexOf(e) < 0) l.push(e); });
      return l.filter(function (e) { return !self.isEgg(e); });
    },
    eggCount: function () { return (this.perm ? this.perm.eggs.length : 0) + (this.dream ? this.dream.eggs.length : 0); },
    layEgg: function (id) { // irréversible une fois validé au réveil
      if (!this.hasEffect(id)) return false;
      if (this.dream) this.dream.eggs.push(id); else { this.perm.eggs.push(id); this.write(); }
      if (this.perm.equipped === id) this.perm.equipped = null;
      return true;
    },
    grantEffect: function (id) {
      if (this.hasEffect(id)) return false;
      if (this.dream) this.dream.effects.push(id);
      else { this.perm.effects.push(id); this.write(); }
      return true;
    },
    removeEffect: function (id) { // utilisé par les nids (irréversible) : retrait des deux couches
      if (this.dream) { var i = this.dream.effects.indexOf(id); if (i >= 0) this.dream.effects.splice(i, 1); }
      var j = this.perm.effects.indexOf(id); if (j >= 0) this.perm.effects.splice(j, 1);
      if (this.perm.equipped === id) this.perm.equipped = null;
    },

    flag: function (k) {
      if (this.dream && k in this.dream.flags) return this.dream.flags[k];
      return this.perm ? this.perm.flags[k] : undefined;
    },
    setFlag: function (k, v, now) {
      if (v === undefined) v = true;
      if (this.dream && !now) this.dream.flags[k] = v;
      else { if (v === null) delete this.perm.flags[k]; else this.perm.flags[k] = v; if (!this.dream) this.write(); }
    },
    temp: function (k, v) { // état propre au rêve en cours, jamais sauvegardé
      if (!this.dream) return undefined;
      if (v === undefined) return this.dream.temp[k];
      this.dream.temp[k] = v; return v;
    },

    quest: function (q) {
      if (this.dream && this.dream.quests[q]) return this.dream.quests[q];
      return (this.perm && this.perm.quests[q]) || null;
    },
    questStage: function (q) { var r = this.quest(q); return r ? r.stage : null; },
    setQuest: function (q, stage, extra) {
      var rec = U.copy(this.quest(q)) || { stage: null, log: [], data: {} };
      rec.stage = stage;
      rec.log = (rec.log || []).concat([stage]);
      if (extra) { rec.data = rec.data || {}; U.keys(extra).forEach(function (k) { rec.data[k] = extra[k]; }); }
      if (this.dream) this.dream.quests[q] = rec;
      else { this.perm.quests[q] = rec; this.write(); }
      return rec;
    },

    rel: function (n) { return ((this.perm && this.perm.rel[n]) || 0) + ((this.dream && this.dream.rel[n]) || 0); },
    addRel: function (n, d) {
      if (this.dream) this.dream.rel[n] = (this.dream.rel[n] || 0) + d;
      else { this.perm.rel[n] = (this.perm.rel[n] || 0) + d; this.write(); }
    },

    items: function (id) { return ((this.perm && this.perm.items[id]) || 0) + ((this.dream && this.dream.items[id]) || 0); },
    addItem: function (id, n) {
      n = n === undefined ? 1 : n;
      if (this.dream) this.dream.items[id] = (this.dream.items[id] || 0) + n;
      else { this.perm.items[id] = (this.perm.items[id] || 0) + n; if (this.perm.items[id] <= 0) delete this.perm.items[id]; this.write(); }
    },

    visits: function (w) {
      return ((this.perm && this.perm.worlds[w] && this.perm.worlds[w].v) || 0) + ((this.dream && this.dream.worlds[w]) || 0);
    },
    discovered: function (w) { return this.visits(w) > 0; },
    visitWorld: function (w) {
      if (!this.dream) return;
      this.dream.worlds[w] = (this.dream.worlds[w] || 0) + 1;
      this.dream.route.push(w);
      if (this.dream.route.length > 200) this.dream.route.shift();
    },
    metNpc: function (n) { return !!((this.perm && this.perm.npcs[n]) || (this.dream && this.dream.npcs[n] !== undefined)); },
    meetNpc: function (n) {
      if (this.dream) this.dream.npcs[n] = (this.dream.npcs[n] || 0) + 1;
      else if (this.perm) { var r = this.perm.npcs[n] || (this.perm.npcs[n] = { met: this.perm.stats.dreams, talks: 0 }); r.talks++; }
    },
    talks: function (n) {
      return ((this.perm && this.perm.npcs[n] && this.perm.npcs[n].talks) || 0) + ((this.dream && this.dream.npcs[n]) || 0);
    },

    addNote: function (id) {
      if (this.hasNote(id)) return false;
      if (this.dream) this.dream.notes.push(id); else { this.perm.notes.push(id); this.write(); }
      return true;
    },
    hasNote: function (id) {
      return (this.perm && this.perm.notes.indexOf(id) >= 0) || (this.dream && this.dream.notes.indexOf(id) >= 0);
    },
    secret: function (k) { return (this.dream && this.dream.secrets[k]) || (this.perm && this.perm.secrets[k]); },
    setSecret: function (k, v) {
      if (this.dream) this.dream.secrets[k] = v === undefined ? true : v;
      else { this.perm.secrets[k] = v === undefined ? true : v; this.write(); }
    },

    /* ---------- biscuits ---------- */
    cookies: function () { return U.clamp((this.perm ? this.perm.cookies : 0) + (this.dream ? this.dream.cookiesFound : 0), 0, 3); },
    addCookie: function () {
      if (this.cookies() >= 3) return false;
      if (this.dream) this.dream.cookiesFound++; else { this.perm.cookies++; this.write(); }
      return true;
    },
    /* consommé au moment où il empêche la capture : définitif, même si l'on est attrapée ensuite */
    useCookie: function () {
      if (this.cookies() <= 0) return false;
      if (this.dream && this.dream.cookiesFound > 0) this.dream.cookiesFound--;
      else { this.perm.cookies = Math.max(0, this.perm.cookies - 1); }
      this.perm.stats.cookieSaves++;
      this.write();
      return true;
    },

    /* ---------- cicatrices : écrites tout de suite, survivent à la capture ---------- */
    corruption: function (w) { var c = this.perm && this.perm.corruption[w]; return c ? c.lvl : 0; },
    addCorruption: function (w, n) {
      if (!this.perm) return 0;
      var c = this.perm.corruption[w] || (this.perm.corruption[w] = { lvl: 0, last: 0 });
      c.lvl = U.clamp(c.lvl + n, 0, 5);
      c.last = this.dream ? this.dream.no : this.perm.stats.dreams;
      if (this.dream) this.dream.priestessIn[w] = true;
      if (!c.lvl) delete this.perm.corruption[w];
      this.write();
      return c.lvl;
    },
    stabilize: function (w, n) {
      if (!this.perm || !this.perm.corruption[w]) return 0;
      var c = this.perm.corruption[w];
      c.lvl = Math.max(0, c.lvl - (n || 5));
      if (!c.lvl) delete this.perm.corruption[w];
      this.write();
      return c.lvl;
    },
    markWitchMet: function (id) { if (this.perm && !this.perm.witchesMet[id]) { this.perm.witchesMet[id] = this.perm.stats.dreams + 1; this.write(); } },
    motherVisit: function () {
      if (!this.perm) return;
      this.perm.mother.visits++; this.perm.mother.last = this.perm.stats.dreams + 1;
      if (this.dream) { this.dream.mother.done = true; this.dream.room.light = false; }
      this.perm.room.light = false;
      this.write();
    },

    /* ---------- instantané (rechargement du navigateur) ---------- */
    snapshot: function (extra) {
      if (!this.perm || !this.dream) return;
      var snap = { base: this.perm.updated, dream: this.dream, extra: extra || null, at: Date.now() };
      YN.store.set(SNAP, JSON.stringify(snap));
    },
    readSnapshot: function () {
      var raw = YN.store.get(SNAP);
      if (!raw || !this.perm) return null;
      try {
        var s = JSON.parse(raw);
        if (!s || s.base !== this.perm.updated || !s.dream) return null;
        return s;
      } catch (e) { return null; }
    },
    clearSnapshot: function () { YN.store.del(SNAP); },

    /* ---------- réglages (séparés de la progression) ---------- */
    defaultSettings: function () {
      return {
        music: 0.7, sfx: 0.8, ambience: 0.6, voice: 0.7, master: 0.9,
        reduceFlash: false, reduceMotion: false, reduceDistortion: false,
        jumpscare: 1, // 0 doux, 1 normal
        darkAssist: false, timerVisible: true, uiScale: 1,
        pixelPerfect: true, showFps: false,
        camera: 0, // 0 directe (suit la protagoniste au pixel près), 1 douce
        cameraFx: false, // tremblements et secousses
        pixelMove: true, // déplacement au pixel (régulier) ; sinon déplacement libre avec inertie
        translate: 1 // 0 jamais, 1 avec l’Oreillette, 2 toujours
      };
    },
    loadSettings: function () {
      var d = this.defaultSettings();
      try {
        var s = JSON.parse(YN.store.get(SETTINGS) || '{}');
        U.keys(d).forEach(function (k) { if (typeof s[k] === typeof d[k]) d[k] = s[k]; });
      } catch (e) { /* défaut */ }
      this.settings = d;
      return d;
    },
    writeSettings: function () { YN.store.set(SETTINGS, JSON.stringify(this.settings)); }
  };
})(typeof window !== 'undefined' ? window : globalThis);
