/* =========================================================================
 *  Les fins. Aucune n'est expliquée. La Fin I est traitée sans aucune image
 *  explicite et suivie d'un message de prévention.
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, U = YN.util;

  var SEQ = {
    I: { name: 'The Terrace', bg: '#f4f4f0', ink: '#303038', lines: ['The wind is gentle.', 'She closes her eyes.', '', '', 'The terrace is empty.', 'In the bedroom, the light has been left on.'], music: null },
    II: { name: 'The Door', bg: '#2a2218', ink: '#f4e0b0', lines: ['The hallway is cold.', 'At the end, the kitchen light is on.', 'Her mother is asleep at the table, still in her work smock.', 'Sora takes the blanket from the sofa.', 'She lays it over her shoulders.', 'She switches off the light.', '', '— 잘 자, 엄마.'], music: 'room' },
    III: { name: 'The Sixth Sleep', bg: '#0a0618', ink: '#c8b8ff', lines: ['She lies back down.', 'Further down, there is no more down.', 'Every door is open.', 'Someone is counting the visits. Hers too.'], music: 'effectroom' },
    IV: { name: '█████', bg: '#000', ink: '#30ff60', lines: ['> END', '> you wrote the word for her.', '> she, too, sometimes cheats at sleep.', '> set 32'], music: null }
  };

  var E = YN.endings = {
    SEQ: SEQ,
    play: function (id) {
      var s = SEQ[id]; if (!s) return;
      var G = YN.game, S = YN.save;
      G.state = 'ending';
      if (S.dream) S.commitDream('ending');
      if (S.perm.endings.indexOf(id) < 0) S.perm.endings.push(id);
      S.write();
      YN.audio.stopMusic(3);
      if (s.music) setTimeout(function () { YN.audio.playMusic(s.music, { fade: 4 }); }, 2000);
      var ov = document.createElement('div'); ov.className = 'ending'; ov.style.background = s.bg; ov.style.color = s.ink;
      document.body.appendChild(ov);
      var i = 0;
      var next = function () {
        if (i < s.lines.length) {
          var p = document.createElement('p'); p.textContent = s.lines[i] || ' '; ov.appendChild(p);
          setTimeout(function () { p.classList.add('show'); }, 50);
          i++; setTimeout(next, s.lines[i - 1] ? 2600 : 1600);
        } else setTimeout(E.credits.bind(null, ov, s, id), 3500);
      };
      setTimeout(function () { ov.classList.add('show'); setTimeout(next, 2200); }, 50);
    },
    credits: function (ov, s, id) {
      ov.innerHTML = '<div class="credits-roll"><h1>' + U.escape(s.name) + '</h1><p>Yume Nikki — The Dream Archive</p><p class="small">Endings found: ' + YN.save.perm.endings.length + ' / 4</p>' +
        (id === 'I' ? '<p class="care">If what you have just seen feels too close to home, talk to someone about it.<br>US: <b>988</b> · UK &amp; Ireland: <b>116 123</b> · South Korea: <b>109</b> · France: <b>3114</b> — free, 24/7. Elsewhere: findahelpline.com</p>' : '') +
        '<p class="small">Press any key.</p></div>';
      var done = function () {
        document.removeEventListener('keydown', done, true);
        ov.parentNode && ov.parentNode.removeChild(ov);
        YN.game.state = 'title'; YN.game.rt = null;
        if (id === 'I' || id === 'II') YN.save.setFlag('terrace_open', null, true);
        YN.ui.title();
      };
      setTimeout(function () { document.addEventListener('keydown', done, true); ov.addEventListener('click', done); }, 1500);
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
