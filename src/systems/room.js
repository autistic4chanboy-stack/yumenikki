/* =========================================================================
 *  La chambre (profondeur 0) : lumière, fenêtre, porte, commode, borne,
 *  journal, terrasse. Préparer le rêve. Rien n'y est expliqué.
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, U = YN.util;

  var RM = YN.room = {
    tonight: { pill: false, white: false },
    resetTonight: function () { RM.tonight = { pill: false, white: false }; YN.save.setFlag('glass_today', null, true); },
    room: function () { return YN.save.perm.room; },
    say: function (lines) { YN.ui.dialog.queue(lines.map(function (l) { return typeof l === 'string' ? { t: l } : l; })); },
    refresh: function () { if (YN.game.rt && YN.game.rt.depth === 0) YN.game.rebuildWorld(); },

    bed: function () {
      var lines = [];
      if (RM.tonight.pill && RM.tonight.white) lines.push('The two tastes still mingle in her mouth.');
      YN.ui.dialog.queue(lines.concat([{ t: 'Sleep?' }]), {}, function () {
        YN.ui.dialog.choose(['Sleep', 'Not yet'], function (i) { if (i === 0) YN.game.sleep(); });
      });
    },
    light: function () {
      var r = RM.room(); r.light = !r.light; YN.save.write();
      YN.audio.sfx('switch'); RM.refresh();
    },
    window: function () {
      var r = RM.room(); r.window = !r.window; YN.save.write();
      YN.audio.sfx(r.window ? 'wind_gust' : 'door', { vol: 0.5 }); RM.refresh();
      if (r.window) YN.game.toast('Cold air comes in.');
    },
    door: function () {
      var r = RM.room(), voice = YN.save.flag('voice_returned');
      var opts = [r.door ? 'Close the door' : 'Leave the door ajar', 'Go out', 'Nothing'];
      YN.ui.dialog.choose(opts, function (i) {
        if (i === 0) { r.door = !r.door; YN.save.write(); YN.audio.sfx('door', { vol: 0.4 }); RM.refresh(); }
        else if (i === 1) {
          if (voice && YN.save.perm.eggs.length >= 30) RM.say([{ t: 'The handle is cold. On the other side, a light.' }, { t: 'She should say something.' }]);
          else RM.say(['She shakes her head.']);
        }
      });
    },
    terrace: function () {
      var open = YN.save.flag('terrace_open');
      if (open) { YN.audio.sfx('wind_gust'); YN.game.enterWorld('TERRACE', 'in', 'ROOM', 'door'); return; }
      YN.ui.dialog.choose(['Step out onto the terrace', 'Stay'], function (i) { if (i === 0) { YN.audio.sfx('door'); YN.game.enterWorld('TERRACE', 'in', 'ROOM', 'door'); } });
    },
    commode: function () {
      var p = YN.save.perm.pills;
      YN.ui.dialog.choose(['Top drawer', 'Bottom drawer', 'Close it'], function (i) {
        if (i === 0) {
          if (p.blue <= 0) { RM.say(['The blue box is empty.']); return; }
          RM.say([{ t: 'A blue box. ' + p.blue + ' pill' + (p.blue > 1 ? 's' : '') + '.' }]);
          setTimeout(function () {
            YN.ui.dialog.choose(['Take one', 'Close it'], function (j) {
              if (j !== 0) return;
              if (RM.tonight.pill) { RM.say(['She has already taken one tonight.']); return; }
              p.blue--; RM.tonight.pill = true; YN.save.write(); YN.audio.sfx('pill');
              RM.say(['She swallows a blue pill.']);
            });
          }, 50);
        } else if (i === 1) {
          if (p.white <= 0) { RM.say(['The white vial is empty.']); return; }
          RM.say([{ t: 'A white vial. The label has been torn off.' }]);
          setTimeout(function () {
            YN.ui.dialog.choose(['Take one', 'Close it'], function (j) {
              if (j !== 0) return;
              if (RM.tonight.white) { RM.say(['No.']); return; }
              p.white--; RM.tonight.white = true; YN.save.write(); YN.audio.sfx('pill');
              RM.say(['She swallows a white pill.']);
            });
          }, 50);
        }
      });
    },
    arcade: function () { if (YN.fruit) YN.fruit.open(); },
    desk: function () {
      var d = YN.save.perm.lastDream;
      var l = ['Her diary. The pages are full of drawings of doors.'];
      if (d && d.reason === 'capture') l.push('The last page has been torn out.');
      RM.say(l);
    },
    calendar: function () {
      var now = YN.realtime.now(), fm = YN.realtime.feteDesMeres(now.getFullYear());
      var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      var l = ['The calendar is still on ' + months[now.getMonth()] + '.'];
      if (now.getMonth() === fm.getMonth() || now.getMonth() === 4) l.push('A Sunday in ' + months[fm.getMonth()] + ' is circled in pencil. Beside it, a drawing of a necklace.');
      else l.push('Nothing is circled this month. She turns the pages to a circled Sunday in May, then turns back.');
      RM.say(l);
    },
    poster: function () {
      var n = YN.save.perm.effects.length + YN.save.perm.eggs.length;
      var l = n < 5 ? 'A poster of a starry sky.' : n < 15 ? 'A poster of a starry sky. She has added doors between the stars.' : n < 30 ? 'Almost all the stars on the poster have become doors.' : 'The poster is black. All the stars have gone.';
      RM.say([l]);
    },
    glass: function () { RM.say(['A glass of water. Still cool.']); },
    note: function () { RM.say([{ t: '미안해.', lang: 'ko-s', tr: 'Sorry.' }, { t: 'The handwriting slants, as if written standing up.' }]); },
    blanket: function () { RM.say(['A second blanket, folded at the foot of the bed.']); },
    plant: function () {
      var st = YN.save.questStage('Q02');
      RM.say([st === 'end_room' ? 'A sprout in a pot, on the terrace. It wasn’t there before.' : 'An empty clay pot.']);
    },
    terraceRail: function () {
      if (YN.save.flag('terrace_open')) {
        YN.ui.dialog.queue([{ t: 'The wind is gentle.' }, { t: 'The city sleeps. Every window is dark but one.' }], {}, function () {
          YN.ui.dialog.choose(['Look at the sky', 'Go back in'], function (i) { if (i === 0) YN.game.ending('I'); });
        });
        return;
      }
      var r = RM.room();
      RM.say([r.light ? 'The city. A few lit windows. None of them looks this way.' : 'The city. In the dark, the stars show better.']);
    },

    /* au réveil */
    onWake: function (summary, mother) {
      var S = YN.save;
      if (mother) S.setFlag('glass_today', true, true);
      RM.checkEnding();
      YN.game.rebuildWorld();
      void summary;
    },
    onCapture: function () { RM.checkEnding(); YN.game.rebuildWorld(); },
    checkEnding: function () {
      var S = YN.save, p = S.perm;
      if (p.eggs.length >= 30 && !p.flags.terrace_open) { S.setFlag('terrace_open', true, true); YN.game.toast('A draught.', 3); }
      // la voix revient
      var c1 = !!p.flags.val_resolved, c2 = S.questStage('Q03') === 'end_child' || !!p.flags.letter_to_s,
        c3 = !!p.flags.ondine_out, c4 = !!p.flags.heard_mother || p.mother.visits >= 5 || !!p.flags.mothersday_seen;
      if (c1 && c2 && c3 && c4 && !p.flags.voice_returned) S.setFlag('voice_returned', true, true);
    }
  };

  /* parler à la porte quand la voix est revenue */
  YN.bus.on('boot', function () {
    YN.speech.listen(function (n, raw, awake) {
      var G = YN.game;
      if (!awake || !G.rt || G.rt.id !== 'ROOM') return false;
      if (!YN.save.flag('voice_returned') || YN.save.perm.eggs.length < 30) return false;
      var door = G.rt.findMark('door');
      if (!door || U.dist(door.x, door.y, G.player.x, G.player.y) > 2.5) return false;
      setTimeout(function () {
        YN.audio.sfx('door');
        YN.ui.dialog.queue([{ t: 'The door opens.' }], {}, function () { YN.game.enterWorld('HALL', null, 'ROOM', 'door'); });
      }, 900);
      return true;
    });
  });
})(typeof window !== 'undefined' ? window : globalThis);
