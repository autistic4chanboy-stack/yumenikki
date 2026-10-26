/* =========================================================================
 *  42 ORIGINS — vue mémoire
 *  La mémoire est dessinée comme une vraie suite d'octets : chaque case a
 *  une largeur proportionnelle à sa taille (char = 1 case, int = 4, pointeur
 *  = 8), les lignes font 16 octets avec leur adresse à gauche. Les pointeurs
 *  affichent leur cible en clair (« → s[0] ») et des flèches à angle droit
 *  passent par des couloirs sur le côté, sans traverser les cases.
 * ========================================================================= */
(function (root) {
  'use strict';
  var O42 = root.O42 = root.O42 || {};
  var U = O42.util;
  var BADGE = { stack: 'STACK', heap: 'HEAP', data: 'DATA', bss: 'BSS', rodata: 'RODATA' };
  var WIRE = ['#ffd166', '#4cc9f0', '#f72585', '#80ed99', '#c77dff', '#ff9e00', '#2ec4b6', '#ff6b6b', '#a3b1ff', '#f4f1bb'];
  var UNIT = 26, GUTTER = 78;

  function MemView(host) {
    var self = this;
    this.host = host;
    this.prev = new Map();
    this.closed = {};
    this.wires = true;
    this.bytes = false;
    host.addEventListener('click', function (e) {
      var h = e.target.closest('.reg-h');
      if (h) { var k = h.parentNode.dataset.kind; self.closed[k] = !h.parentNode.classList.contains('closed'); h.parentNode.classList.toggle('closed'); self.links(); }
    });
    host.addEventListener('mouseover', function (e) { var c = e.target.closest('.cell[data-ref]'); if (c !== self.hot) self.hover(c); });
    host.addEventListener('mouseleave', function () { self.hover(null); });
    if (typeof ResizeObserver !== 'undefined') {
      var w = 0;
      new ResizeObserver(function () {
        if (Math.abs(host.clientWidth - w) > 30 && self.last) { w = host.clientWidth; self.render(self.last.view, Object.assign({}, self.last.opts, { scroll: false, keep: true })); }
        else self.links();
      }).observe(host);
    }
  }
  var P = MemView.prototype;
  P.reset = function () { this.prev = new Map(); };

  function hx(b) { return (b < 16 ? '0' : '') + b.toString(16); }
  function tail(a) { var h = a.toString(16); return h.length > 6 ? '…' + h.slice(-6) : '0x' + h; }

  P.render = function (view, opts) {
    opts = opts || {};
    this.last = { view: view, opts: opts };
    var self = this, acc = view.acc || [], first = this.prev.size === 0, next = opts.keep ? this.prev : new Map();
    this.real = opts.lang !== 'py';
    var avail = this.host.clientWidth - 24 - GUTTER - 70;
    this.bpr = !this.real ? 0 : avail >= 16 * UNIT ? 16 : avail >= 12 * UNIT ? 12 : 8;
    var tagged = {};
    this.accMap = function (a, n) {
      var hit = null;
      for (var i = 0; i < acc.length; i++) {
        var x = acc[i];
        if (a < x.a + x.n && a + n > x.a) {
          if (!hit || x.w) hit = { w: x.w, tag: hit ? hit.tag : null };
          if (x.tag && !tagged[x.tag + x.a] && a <= x.a) { tagged[x.tag + x.a] = 1; hit.tag = x.tag; }
        }
      }
      return hit;
    };
    this.cmp = { prev: this.prev, next: next, first: first };
    var html = '<div class="mem-in' + (this.real ? ' real' : ' objs') + (this.bytes && this.real ? ' show-bytes' : '') + '" style="--u:' + UNIT + 'px"><svg class="mem-svg" aria-hidden="true"></svg>';
    if (!view.regions.length) html += '<div class="mem-empty">Rien en mémoire pour l’instant.</div>';
    else html += '<div class="addr-guide">▲ adresses hautes</div>';
    view.regions.forEach(function (r) {
      var closed = self.closed[r.kind] !== undefined ? self.closed[r.kind] : !!r.collapsed;
      var nobj = r.groups.reduce(function (n, g) { return n + g.objs.length; }, 0);
      html += '<section class="reg reg-' + r.kind + (closed ? ' closed' : '') + (nobj ? '' : ' empty') + '" data-kind="' + r.kind + '">' +
        '<div class="reg-h" title="' + U.esc(r.info || '') + '"><span class="badge">' + BADGE[r.kind] + '</span><h3>' + U.esc(r.title) + '</h3><span class="chev">▾</span></div>' +
        '<div class="reg-b">' + (r.info ? '<p class="reg-info">' + U.esc(r.info) + '</p>' : '');
      var any = false;
      r.groups.forEach(function (g, gi) {
        if (g.slots) { html += self.slotsHtml(g); any = true; return; }
        var isFrame = r.kind === 'stack' && g.title;
        if (isFrame) {
          if (gi > 0) html += '<div class="call-link">▼ appel de <b>' + U.esc(g.title) + '</b></div>';
          html += '<div class="frame' + (g.active ? ' active' : '') + '"><div class="frame-h"><span class="fname">' + U.esc(g.title) + '</span><span class="fsub">' + U.esc(g.sub || '') + '</span></div>';
          if (!g.objs.length) html += '<div class="frame-empty">pas encore de variable locale</div>';
        }
        var objs = r.kind === 'stack' ? g.objs.slice() : g.objs.slice().sort(function (a, b) { return a.a - b.a; });
        objs.forEach(function (o, i) {
          any = true;
          if (self.real && i > 0) html += self.gapHtml(objs[i - 1], o, r.kind);
          html += self.objHtml(o, r);
        });
        if (isFrame) html += '</div>';
      });
      if (!any && r.empty) html += '<div class="frame-empty">' + U.esc(r.empty) + '</div>';
      html += '</div></section>';
    });
    if (view.regions.length) html += '<div class="addr-guide">▼ adresses basses</div>';
    html += '</div>';
    this.host.innerHTML = html;
    this.prev = next;
    this.svg = this.host.querySelector('.mem-svg');
    this.index();
    this.describe();
    this.links();
    if (opts.scroll !== false) this.scrollToAcc();
  };

  /* espace entre deux objets voisins : remplissage, en-tête malloc */
  P.gapHtml = function (a, b, kind) {
    var n, txt, hdr = false;
    if (kind === 'stack') { n = a.a - (b.a + b.n); txt = 'remplissage (alignement)'; }
    else if (kind === 'heap') { n = b.a - (a.a + a.n); hdr = true; txt = 'en-tête malloc + marge'; }
    else { n = b.a - (a.a + a.n); txt = 'inutilisé (alignement)'; }
    if (n <= 0 || n > 4096) return '';
    var w = Math.min(n, this.bpr || 8);
    return '<div class="gap' + (hdr ? ' hdr' : '') + '"><span class="gap-box" style="width:calc(var(--u) * ' + w + ')"></span><span>' + n + ' octet' + (n > 1 ? 's' : '') + ' ' + txt + '</span></div>';
  };

  P.cellHtml = function (c, kind) {
    var key = c.a + ':' + (c.lbl || ''), cls = 'cell', acc = this.accMap(c.a, c.n);
    if (c.kind) cls += ' k-' + c.kind;
    if (c.cls) cls += ' ' + c.cls;
    if (acc) cls += acc.w ? ' acc-w' : ' acc-r';
    var pv = this.cmp.prev.get(key);
    if (!this.cmp.first && pv !== undefined && pv !== c.val) cls += ' chg';
    this.cmp.next.set(key, c.val);
    var n = Math.max(1, c.n), units = Math.min(n, this.bpr || 8);
    var title = (c.lbl ? c.lbl + ' — ' : '') + (c.ty ? c.ty + ', ' : '') + c.n + ' octet' + (c.n > 1 ? 's' : '') + ' à l’adresse ' + U.hex(c.a) + ' (' + kind + ')';
    if (c.bytes && c.bytes.length > 1) title += '\noctets en mémoire (petit-boutiste) : ' + c.bytes.map(hx).join(' ');
    if (c.kind === 'char' && c.sub !== undefined) title += '\ncode ASCII : ' + c.sub;
    if (c.title) title += '\n' + c.title;
    if (c.ref) title += '\nvaleur : ' + U.hex(c.ref) + ' (une adresse)';
    var style = this.real ? ' style="width:calc(var(--u) * ' + units + ')"' : '';
    var lbl = acc && acc.tag ? '<span class="lbl tagged">' + U.esc(acc.tag) + '</span>' : '<span class="lbl">' + U.esc(c.lbl || '') + '</span>';
    var sub = '', val = c.val === undefined ? '' : String(c.val);
    if (c.kind === 'char') {
      if (/garbage/.test(c.cls || '')) val = '?';
      else if (/^\\x/.test(val)) { val = val.slice(2); cls += ' np'; }
    }
    var bytes = '';
    if (this.real && c.bytes) bytes = '<span class="bytes">' + c.bytes.slice(0, units).map(function (b) { return '<i>' + hx(b) + '</i>'; }).join('') + '</span>';
    return '<div class="' + cls + '" data-a="' + c.a + '" data-n="' + c.n + '" data-lbl="' + U.esc(c.lbl || '') + '"' + (c.ref ? ' data-ref="' + c.ref + '"' : '') + style + ' title="' + U.esc(title) + '">' + lbl +
      '<span class="v' + (this.real && n > 1 ? ' multi' : '') + '"><span class="vt">' + U.esc(val) + '</span>' + sub + '</span>' + bytes + '</div>';
  };

  P.objHtml = function (o, r) {
    var self = this, st = o.status ? ' st-' + o.status : '';
    var one = o.cells.length === 1 && !o.isArr;
    var meta = '<span class="vmeta">' + (o.n && !one ? o.n + ' o · ' : '') + '<span class="vad">' + U.hex(o.a) + '</span></span>';
    var head = '<span class="vn">' + U.esc(o.name) + '</span><span class="vt">' + U.esc(o.type || '') + '</span>' + (o.note ? '<span class="vnote">' + U.esc(o.note) + '</span>' : '');
    var attrs = ' data-key="' + U.esc(o.key) + '" data-oa="' + o.a + '" data-name="' + U.esc(o.name) + '"';
    if (one) return '<div class="var one' + st + '"' + attrs + '><div class="var-h">' + head + '<span class="grow"></span>' + meta + '</div><div class="strip">' + this.cellHtml(o.cells[0], r.kind) + '</div></div>';
    var rows = '';
    if (this.real) {
      var line = [], used = 0, start = null;
      var flush = function () { if (line.length) rows += '<div class="srow"><span class="sadr" title="adresse du début de la ligne">' + tail(start) + '</span><div class="strip">' + line.join('') + '</div></div>'; line = []; used = 0; start = null; };
      o.cells.forEach(function (c) {
        var w = Math.min(Math.max(1, c.n), self.bpr);
        if (used + w > self.bpr) flush();
        if (start === null) start = c.a;
        line.push(self.cellHtml(c, r.kind));
        used += w;
      });
      flush();
    } else rows = '<div class="srow"><div class="strip wrap">' + o.cells.map(function (c) { return self.cellHtml(c, r.kind); }).join('') + '</div></div>';
    return '<div class="var' + st + '"' + attrs + '><div class="var-h">' + head + '<span class="grow"></span>' + meta + '</div>' + rows + '</div>';
  };

  /* pile de l'assembleur : une tranche de 8 octets par ligne */
  P.slotsHtml = function (g) {
    var self = this, html = '<div class="frame active slots"><div class="frame-h"><span class="fname">' + U.esc(g.title) + '</span><span class="fsub">' + U.esc(g.sub || '') + '</span></div>';
    g.objs.forEach(function (o) {
      var c = o.cells[0], marks = (o.marks || []).map(function (m) { return '<span class="mk mk-' + m + '">' + m + ' ▶</span>'; }).join('');
      var lbl = c.lbl; c.lbl = '';
      html += '<div class="slot' + (c.cls === 'garbage' ? ' below' : '') + ((o.marks || []).indexOf('rsp') >= 0 ? ' at-rsp' : '') + '">' +
        '<span class="sm">' + marks + '</span><span class="so" title="' + U.hex(o.a) + '">' + U.esc(lbl) + '</span>' + self.cellHtml(c, 'stack') + '<span class="sn">' + U.esc(o.note || '') + '</span></div>';
    });
    return html + '</div>';
  };

  /* ---------------------------------------------------------------- pointeurs */
  P.index = function () {
    var list = [];
    this.host.querySelectorAll('.cell').forEach(function (el) { list.push({ a: +el.dataset.a, n: +el.dataset.n, el: el }); });
    list.sort(function (x, y) { return x.a - y.a; });
    this.cells = list;
    var objs = new Map();
    this.host.querySelectorAll('.var[data-oa]').forEach(function (o) { var c = o.querySelector('.cell'); if (c && !objs.has(+o.dataset.oa)) objs.set(+o.dataset.oa, c); });
    this.objs = objs;
  };
  P.find = function (a) {
    var direct = this.objs.get(a);
    if (direct && !direct.closest('.slot')) return direct;
    var L = this.cells, lo = 0, hi = L.length - 1, best = null;
    while (lo <= hi) { var mid = (lo + hi) >> 1; if (L[mid].a <= a) { best = mid; lo = mid + 1; } else hi = mid - 1; }
    if (best === null) return null;
    for (var i = best; i >= 0 && i > best - 6; i--) if (a >= L[i].a && a < L[i].a + Math.max(1, L[i].n) && !L[i].el.closest('.slot')) return L[i].el;
    for (var j = best; j >= 0 && j > best - 6; j--) if (a >= L[j].a && a < L[j].a + Math.max(1, L[j].n)) return L[j].el;
    return null;
  };
  /* remplace l'adresse brute par sa cible lisible : « → s[2] » */
  P.describe = function () {
    var self = this, k = 0;
    this.links_ = [];
    this.host.querySelectorAll('.cell[data-ref]').forEach(function (src) {
      var ref = +src.dataset.ref, tg = self.find(ref), vt = src.querySelector('.vt');
      if (!tg) { if (src.closest('.slot')) return; vt.textContent = '⚠ ' + U.hex(ref); src.classList.add('dangling'); src.title += '\n⚠ cette adresse ne correspond à aucune case connue'; return; }
      var obj = tg.closest('.var'), name = obj ? obj.dataset.name : '';
      var many = obj && obj.querySelectorAll('.cell').length > 1, off = ref - (+tg.dataset.a);
      var whole = self.objs.get(ref) === tg && (+tg.dataset.a !== ref || !many);
      var label = whole ? name : name + (many ? tg.dataset.lbl || '' : '') + (off > 0 ? ' +' + off : '');
      var slot = tg.closest('.slot');
      if (slot) label = 'pile ' + (slot.querySelector('.so') ? slot.querySelector('.so').textContent : '');
      var freed = tg.classList.contains('freed');
      if (!src.closest('.slot')) vt.innerHTML = '<b>→</b> ' + U.esc(label || U.hex(ref)) + (freed ? ' <em>libéré !</em>' : '');
      src.insertAdjacentHTML('beforeend', '<span class="raw">' + U.hex(ref) + '</span>');
      if (freed) src.classList.add('dangling');
      var col = freed ? '#ff5c7a' : WIRE[k++ % WIRE.length];
      src.style.setProperty('--wire', col);
      src.classList.add('src');
      tg.classList.add('target');
      var pins = tg.querySelector('.pins');
      if (!pins) { tg.insertAdjacentHTML('beforeend', '<span class="pins"></span>'); pins = tg.querySelector('.pins'); }
      if (pins.children.length < 4) pins.insertAdjacentHTML('beforeend', '<i style="background:' + col + '"></i>');
      self.links_.push({ src: src, tg: tg, col: col, freed: freed });
    });
  };
  P.links = function () {
    var svg = this.svg;
    if (!svg || !this.links_) return;
    var inner = svg.parentNode, box = inner.getBoundingClientRect(), W = inner.clientWidth;
    svg.setAttribute('width', inner.scrollWidth); svg.setAttribute('height', inner.scrollHeight);
    var items = [], self = this;
    this.links_.forEach(function (L) {
      if (L.src.offsetParent === null || L.tg.offsetParent === null) return;
      if (!self.wires && L.src !== self.hot) return;
      var rs = L.src.querySelector('.v').getBoundingClientRect(), rt = L.tg.querySelector('.v').getBoundingClientRect();
      items.push({ L: L, sx: rs.left + Math.min(rs.width / 2, 40) - box.left, sy: rs.bottom - box.top, tx: rt.left + Math.min(rt.width / 2, 13) - box.left, ty: rt.top - box.top, span: Math.abs(rt.top - rs.bottom) });
    });
    // les flèches les plus courtes dans les couloirs intérieurs : moins de croisements
    items.sort(function (a, b) { return a.span - b.span; });
    var paths = '', heads = '';
    items.forEach(function (it, i) {
      var lane = W - 10 - (i % 10) * 7, chan = it.sy + 5, top = it.ty - 5;
      var pts = [[it.sx, it.sy], [it.sx, chan], [lane, chan], [lane, top], [it.tx, top], [it.tx, it.ty - 1]];
      var d = rounded(pts, 5), hot = self.hot && it.L.src === self.hot;
      var cls = (hot ? 'hot' : self.hot ? 'dim' : '') + (it.L.freed ? ' bad' : '');
      paths += '<path class="' + cls + '" d="' + d + '" stroke="' + it.L.col + '"/>';
      heads += '<path class="head ' + cls + '" d="M' + (it.tx - 4) + ',' + (it.ty - 7) + ' L' + (it.tx + 4) + ',' + (it.ty - 7) + ' L' + it.tx + ',' + (it.ty - 1) + 'z" fill="' + it.L.col + '"/>';
    });
    svg.innerHTML = paths + heads;
  };
  function rounded(p, r) {
    var d = 'M' + p[0][0] + ',' + p[0][1];
    for (var i = 1; i < p.length - 1; i++) {
      var a = p[i - 1], b = p[i], c = p[i + 1];
      var l1 = Math.hypot(b[0] - a[0], b[1] - a[1]), l2 = Math.hypot(c[0] - b[0], c[1] - b[1]), rr = Math.min(r, l1 / 2, l2 / 2);
      if (!l1 || !l2) { d += ' L' + b[0] + ',' + b[1]; continue; }
      var p1 = [b[0] + (a[0] - b[0]) * rr / l1, b[1] + (a[1] - b[1]) * rr / l1], p2 = [b[0] + (c[0] - b[0]) * rr / l2, b[1] + (c[1] - b[1]) * rr / l2];
      d += ' L' + p1[0] + ',' + p1[1] + ' Q' + b[0] + ',' + b[1] + ' ' + p2[0] + ',' + p2[1];
    }
    var e = p[p.length - 1];
    return d + ' L' + e[0] + ',' + e[1];
  }
  P.hover = function (src) {
    this.hot = src;
    this.host.querySelectorAll('.ptr-target').forEach(function (e) { e.classList.remove('ptr-target'); });
    if (src) { var tg = this.find(+src.dataset.ref); if (tg) tg.classList.add('ptr-target'); }
    this.links();
  };
  P.setOptions = function (o) {
    if (o.wires !== undefined) this.wires = o.wires;
    if (o.bytes !== undefined) this.bytes = o.bytes;
    if (this.last) this.render(this.last.view, Object.assign({}, this.last.opts, { scroll: false, keep: true }));
  };
  P.scrollToAcc = function () {
    var el = this.host.querySelector('.cell.acc-w') || this.host.querySelector('.cell .lbl.tagged');
    if (el && !el.classList.contains('cell')) el = el.closest('.cell');
    if (!el) return;
    var hb = this.host.getBoundingClientRect(), eb = el.getBoundingClientRect();
    if (eb.top < hb.top + 10 || eb.bottom > hb.bottom - 10) this.host.scrollTop += eb.top - hb.top - hb.height / 3;
  };

  O42.MemView = MemView;
})(typeof window !== 'undefined' ? window : globalThis);
