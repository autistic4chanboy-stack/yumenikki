/* =========================================================================
 *  42 ORIGINS — vue mémoire
 *  Dessine les régions (stack, heap, data, rodata), leurs objets case par
 *  case, les espaces entre objets, les accès du dernier pas et des flèches
 *  SVG pour chaque pointeur.
 * ========================================================================= */
(function (root) {
  'use strict';
  var O42 = root.O42 = root.O42 || {};
  var U = O42.util;
  var BADGE = { stack: 'STACK', heap: 'HEAP', data: 'DATA', bss: 'BSS', rodata: 'RODATA' };
  var COLOR = { stack: '#4aa3ff', heap: '#ff9f43', data: '#3ddc84', bss: '#3ddc84', rodata: '#b48cff', code: '#ff6fb5' };

  function MemView(host) {
    var self = this;
    this.host = host;
    this.prev = new Map();
    this.closed = {};
    this.cells = [];
    host.addEventListener('click', function (e) {
      var h = e.target.closest('.reg-h');
      if (h) { var k = h.parentNode.dataset.kind; self.closed[k] = !self.closed[k]; h.parentNode.classList.toggle('closed'); self.arrows(); }
    });
    host.addEventListener('mouseover', function (e) {
      var c = e.target.closest('.cell[data-ref]');
      self.hover(c);
    });
    host.addEventListener('mouseout', function (e) { if (e.target.closest('.cell[data-ref]')) self.hover(null); });
    if (typeof ResizeObserver !== 'undefined') new ResizeObserver(function () { self.arrows(); }).observe(host);
  }
  var P = MemView.prototype;
  P.reset = function () { this.prev = new Map(); };

  function short(a) { var h = a.toString(16); return '…' + h.slice(-4); }
  function cellHtml(c, accMap, region, prevMap, firstRender, nextMap) {
    var key = c.a + ':' + (c.lbl || '');
    var cls = 'cell';
    if (c.kind) cls += ' k-' + c.kind;
    if (c.cls) cls += ' ' + c.cls;
    var acc = accMap(c.a, c.n);
    if (acc) cls += acc.w ? ' acc-w' : ' acc-r';
    var pv = prevMap.get(key);
    if (!firstRender && pv !== undefined && pv !== c.val) cls += ' chg';
    nextMap.set(key, c.val);
    var title = (c.lbl ? c.lbl + ' · ' : '') + (c.ty ? c.ty + ' · ' : '') + U.hex(c.a) + ' (' + c.n + ' octet' + (c.n > 1 ? 's' : '') + ', ' + region + ')';
    if (c.bytes && c.bytes.length > 1) title += '\noctets (petit-boutiste) : ' + c.bytes.map(function (b) { return (b < 16 ? '0' : '') + b.toString(16); }).join(' ');
    if (c.title) title += '\n' + c.title;
    if (c.ref) title += '\npointe vers ' + U.hex(c.ref);
    if (c.kind === 'char' && c.sub !== undefined) title += '\ncode ASCII : ' + c.sub;
    var tag = acc && acc.tag ? '<span class="tag">' + U.esc(acc.tag) + '</span>' : '';
    return '<div class="' + cls + '" data-a="' + c.a + '" data-n="' + c.n + '"' + (c.ref ? ' data-ref="' + c.ref + '"' : '') + ' title="' + U.esc(title) + '">' + tag +
      '<span class="lbl">' + U.esc(c.lbl || '') + '</span><span class="v">' + U.esc(c.val === undefined ? '' : c.val) + '</span><span class="ca">' + short(c.a) + '</span></div>';
  }

  P.render = function (view, opts) {
    opts = opts || {};
    var self = this, acc = view.acc || [], first = this.prev.size === 0, next = new Map();
    var tagged = {};
    function accMap(a, n) {
      var hit = null;
      for (var i = 0; i < acc.length; i++) {
        var x = acc[i];
        if (a < x.a + x.n && a + n > x.a) {
          if (!hit || x.w) hit = { w: x.w, tag: null };
          if (x.tag && !tagged[x.tag + x.a] && a <= x.a) { tagged[x.tag + x.a] = 1; hit.tag = x.tag; }
        }
      }
      return hit;
    }
    var html = '<div class="mem-in"><svg class="mem-svg"><defs>' +
      Object.keys(COLOR).map(function (k) { return '<marker id="ah-' + k + '" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="' + COLOR[k] + '"/></marker>'; }).join('') +
      '<marker id="ah-bad" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#ff5c7a"/></marker></defs></svg>';
    if (!view.regions.length) html += '<div class="mem-empty">Rien en mémoire pour l’instant.</div>';
    view.regions.forEach(function (r) {
      var closed = self.closed[r.kind] !== undefined ? self.closed[r.kind] : !!r.collapsed;
      html += '<section class="reg reg-' + r.kind + (closed ? ' closed' : '') + '" data-kind="' + r.kind + '">' +
        '<div class="reg-h"><span class="badge">' + BADGE[r.kind] + '</span><h3>' + U.esc(r.title) + '</h3><span class="info" title="' + U.esc(r.info || '') + '">' + U.esc(r.info || '') + '</span><span class="chev">▾</span></div><div class="reg-b">';
      var hasObj = false;
      r.groups.forEach(function (g, gi) {
        var isFrame = r.kind === 'stack' && g.title && !g.slots;
        if (g.slots) { html += self.slotsHtml(g, accMap, next, first); hasObj = true; return; }
        if (isFrame) html += '<div class="frame' + (g.active ? ' active' : '') + '"><div class="frame-h">' + U.esc(g.title) + ' <small>' + U.esc(g.sub || '') + '</small></div>';
        if (isFrame && gi < r.groups.length && !g.objs.length) html += '<div class="frame-empty">aucune variable locale pour l’instant</div>';
        var objs = g.objs.slice();
        var sorted = objs.slice().sort(function (a, b) { return a.a - b.a; });
        var gaps = new Map();
        if (r.kind !== 'stack' || opts.lang === 'c') {
          for (var i = 1; i < sorted.length; i++) {
            var pa = sorted[i - 1], pb = sorted[i], end = pa.a + (pa.cap !== undefined ? pa.cap : pa.n);
            if (r.kind === 'heap' && opts.lang !== 'py') {
              var hg = pb.a - (pa.a + pa.n), marge = hg - 16;
              if (hg > 0) gaps.set(pb.key, { n: hg, hdr: true, txt: (marge > 0 ? marge + ' o de marge (arrondi) + ' : '') + 'en-tête malloc du bloc suivant (taille, état)' });
            } else if (pb.a > end && pb.a - end < 4096 && opts.lang !== 'py') gaps.set(pb.key, { n: pb.a - end, txt: (pb.a - end) + ' octet' + (pb.a - end > 1 ? 's' : '') + ' inutilisé' + (pb.a - end > 1 ? 's' : '') + ' (alignement)' });
          }
          if (r.kind === 'stack') {
            // en C, la pile se lit de haut (adresses hautes) en bas : écart vers l'objet suivant dans l'ordre affiché
            gaps = new Map();
            for (var j = 1; j < objs.length; j++) {
              var hi = objs[j - 1], lo = objs[j], gapN = hi.a - (lo.a + lo.n);
              if (gapN > 0 && gapN < 4096) gaps.set(lo.key, { n: gapN, txt: gapN + ' octet' + (gapN > 1 ? 's' : '') + ' de remplissage (alignement)' });
            }
          }
        }
        (r.kind === 'stack' ? objs : sorted).forEach(function (o) {
          hasObj = true;
          var gp = gaps.get(o.key);
          if (gp && r.kind !== 'stack') html += '<div class="gap' + (gp.hdr ? ' hdr' : '') + '">' + U.esc(gp.txt) + '</div>';
          html += self.objHtml(o, r, accMap, next, first);
          if (gp && r.kind === 'stack') html += '<div class="gap">' + U.esc(gp.txt) + '</div>';
        });
        if (isFrame) html += '</div>';
        if (isFrame && gi < r.groups.length - 1) html += '<div class="grow-down">▼ la pile grandit vers les adresses basses ▼</div>';
      });
      if (!hasObj && r.empty) html += '<div class="frame-empty">' + U.esc(r.empty) + '</div>';
      html += '</div></section>';
    });
    html += '</div>';
    this.host.innerHTML = html;
    this.prev = next;
    this.svg = this.host.querySelector('.mem-svg');
    this.index();
    this.arrows();
    if (opts.scroll !== false) this.scrollToAcc();
  };

  P.objHtml = function (o, r, accMap, next, first) {
    var st = o.status ? ' st-' + o.status : '';
    var head = '<div class="obj-h"><b>' + U.esc(o.name) + '</b><span class="ty">' + U.esc(o.type || '') + '</span><span class="ad" title="adresse de début">' + U.hex(o.a) + '</span>' +
      (o.n && o.cells.length > 1 ? '<span class="sz">' + o.n + ' o</span>' : '') + (o.note ? '<span class="note">' + U.esc(o.note) + '</span>' : '') + '</div>';
    var cells = '<div class="cells">' + o.cells.map(function (c) { return cellHtml(c, accMap, r.kind, this.prev, first, next); }, this).join('') + '</div>';
    var attrs = '" data-key="' + U.esc(o.key) + '" data-oa="' + o.a + '">';
    if (o.cells.length === 1 && !o.isArr) return '<div class="obj obj-row' + st + attrs + cells + head + '</div>';
    return '<div class="obj' + st + attrs + head + cells + '</div>';
  };

  P.slotsHtml = function (g, accMap, next, first) {
    var self = this, html = '<div class="frame active"><div class="frame-h">' + U.esc(g.title) + ' <small>' + U.esc(g.sub || '') + '</small></div><div class="slots">';
    html += '<div class="grow-down">adresses hautes ▲</div>';
    g.objs.forEach(function (o) {
      var marks = (o.marks || []).map(function (m) { return '<span class="m-' + m + '">' + m + ' ➜</span>'; }).join(' ');
      var c = o.cells[0], free = c.cls === 'garbage';
      html += '<div class="slot' + (free ? ' free-zone' : '') + ((o.marks || []).indexOf('rsp') >= 0 ? ' top-rsp' : '') + '"><span class="sm">' + marks + '</span><span class="sa">' + U.hex(o.a) + '</span>' +
        '<span style="display:flex;gap:8px;align-items:center">' + cellHtml(c, accMap, 'stack', self.prev, first, next) + '<span class="sn">' + U.esc(o.note || '') + '</span></span></div>';
    });
    html += '<div class="grow-down">▼ adresses basses (la pile grandit vers le bas)</div></div></div>';
    return html;
  };

  /* index des cases pour retrouver la cible d'un pointeur */
  P.index = function () {
    var list = [];
    this.host.querySelectorAll('.cell').forEach(function (el) { list.push({ a: +el.dataset.a, n: +el.dataset.n, el: el }); });
    list.sort(function (x, y) { return x.a - y.a; });
    this.cells = list;
    var objs = new Map();
    this.host.querySelectorAll('.obj[data-oa]').forEach(function (o) { var c = o.querySelector('.cell'); if (c && !objs.has(+o.dataset.oa)) objs.set(+o.dataset.oa, c); });
    this.objs = objs;
  };
  P.find = function (a) {
    var direct = this.objs && this.objs.get(a);
    if (direct && !direct.closest('.slot')) return direct;
    var L = this.cells, lo = 0, hi = L.length - 1, best = null;
    while (lo <= hi) {
      var mid = (lo + hi) >> 1;
      if (L[mid].a <= a) { best = mid; lo = mid + 1; } else hi = mid - 1;
    }
    if (best === null) return null;
    for (var i = best; i >= 0 && i > best - 4; i--) if (a >= L[i].a && a < L[i].a + Math.max(1, L[i].n) && !L[i].el.closest('.slot')) return L[i].el;
    for (var j = best; j >= 0 && j > best - 4; j--) if (a >= L[j].a && a < L[j].a + Math.max(1, L[j].n)) return L[j].el;
    return null;
  };
  P.arrows = function () {
    var svg = this.svg;
    if (!svg) return;
    var inner = svg.parentNode, box = inner.getBoundingClientRect(), self = this;
    svg.setAttribute('width', inner.scrollWidth); svg.setAttribute('height', inner.scrollHeight);
    var paths = '', n = 0;
    this.host.querySelectorAll('.cell[data-ref]').forEach(function (src) {
      if (n > 80 || src.offsetParent === null) return;
      var tg = self.find(+src.dataset.ref);
      if (!tg || tg === src || tg.offsetParent === null) return;
      var rs = src.querySelector('.v').getBoundingClientRect(), rt = tg.querySelector('.v').getBoundingClientRect();
      var reg = tg.closest('.reg'), kind = reg ? reg.dataset.kind : 'heap';
      var freed = tg.classList.contains('freed');
      var x1 = rs.right - box.left, y1 = rs.top + rs.height / 2 - box.top;
      var tx = rt.left + Math.min(rt.width / 2, 16) - box.left, below = rt.top > rs.bottom - 2, above = rt.bottom < rs.top + 2;
      var path;
      if (below || above) {
        var y2 = below ? rt.top - box.top : rt.bottom - box.top, dy = Math.abs(y2 - y1);
        var cx1 = Math.max(x1, tx) + Math.min(90, 26 + dy * 0.25);
        path = 'M' + x1 + ',' + y1 + ' C' + cx1 + ',' + y1 + ' ' + tx + ',' + (below ? y2 - Math.min(60, 18 + dy * 0.3) : y2 + Math.min(60, 18 + dy * 0.3)) + ' ' + tx + ',' + y2;
      } else {
        var y3 = rt.top - box.top;
        path = 'M' + x1 + ',' + y1 + ' C' + (x1 + 24) + ',' + (y1 - 30) + ' ' + tx + ',' + (y3 - 30) + ' ' + tx + ',' + y3;
      }
      var col = freed ? '#ff5c7a' : COLOR[kind] || '#ffd88a';
      paths += '<path d="' + path + '" stroke="' + col + '" marker-end="url(#ah-' + (freed ? 'bad' : (COLOR[kind] ? kind : 'heap')) + ')"' + (freed ? ' stroke-dasharray="4 3"' : '') + ' data-from="' + src.dataset.a + '"/>';
      n++;
    });
    var defs = svg.querySelector('defs').outerHTML;
    svg.innerHTML = defs + paths;
  };
  P.hover = function (src) {
    this.host.querySelectorAll('.ptr-target').forEach(function (e) { e.classList.remove('ptr-target'); });
    if (this.svg) this.svg.querySelectorAll('path.hot').forEach(function (p) { p.classList.remove('hot'); });
    if (!src) return;
    var tg = this.find(+src.dataset.ref);
    if (tg) tg.classList.add('ptr-target');
    var p = this.svg && this.svg.querySelector('path[data-from="' + src.dataset.a + '"]');
    if (p) p.classList.add('hot');
  };
  P.scrollToAcc = function () {
    var el = this.host.querySelector('.cell.acc-w') || this.host.querySelector('.cell .tag');
    if (el && el.classList.contains('tag')) el = el.parentNode;
    if (!el) return;
    var hb = this.host.getBoundingClientRect(), eb = el.getBoundingClientRect();
    if (eb.top < hb.top + 10 || eb.bottom > hb.bottom - 10) this.host.scrollTop += eb.top - hb.top - hb.height / 3;
  };

  O42.MemView = MemView;
})(typeof window !== 'undefined' ? window : globalThis);
