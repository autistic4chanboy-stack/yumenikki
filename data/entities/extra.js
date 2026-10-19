/* =========================================================================
 *  HABITANTS SUPPLÉMENTAIRES — un passant de plus dans les mondes calmes.
 *  Ils ne donnent rien ; ils disent quelque chose du lieu.
 *  Identifiants N600 et suivants (attribués dans l’ordre : ne jamais
 *  insérer, retirer ni déplacer une ligne).
 *  Les habitants ne parlent jamais français : en / ko-s / ko-n, avec `tr`.
 *  La narration (sans guillemets) reste en français.
 * ========================================================================= */
(function (root) {
  'use strict';
  var YN = root.YN, NEXT = 600;
  function H(o) { return Object.assign({ t: 'humanoid', head: 'round', body: 'coat', c: ['#5a5a6a', '#3a3a4a', '#e0c8b0', '#2a2a2a'], eyes: 'dots', mouth: 'line', h: 23 }, o); }
  var kid = function (c, o) { return H(Object.assign({ t: 'kid', body: 'sweater', c: c || ['#7a8aa0', '#5a6a80', '#f0d0b0', '#1a1a1a'] }, o)); };
  var adult = function (c, o) { return H(Object.assign({ t: 'adult', c: c || ['#5a5a6a', '#3a3a4a', '#e0c8b0', '#2a2a2a'] }, o)); };
  var old = function (c, o) { return H(Object.assign({ t: 'old', c: c || ['#7a6a5a', '#5a4a3a', '#e0c8a8', '#d0d0d0'] }, o)); };
  var ghost = function (c, h) { return { t: 'ghost', c: [c || 'rgba(220,220,255,0.5)'], h: h || 20 }; };
  var beast = function (t, c, h) { return { t: t, c: [c], h: h || 10 }; };
  var VOICE = { t: 'voice' };
  function KS(t, tr) { return { t: t, lang: 'ko-s', tr: tr }; }
  function KN(t, tr) { return { t: t, lang: 'ko-n', tr: tr }; }
  function EN(t, tr) { return { t: t, lang: 'en', tr: tr }; }
  function SEQ() { return { seq: Array.prototype.slice.call(arguments) }; }

  /* [monde, nom, apparence, comportement, répliques, options] */
  var LIST = [
    // ---- mondes du cœur ----
    ['W005', 'A Passer-by in Negative', adult(['#e8e8e8', '#c8c8c8', '#202020', '#ffffff']), 'wander', [
      SEQ('He is white where he should be black.', EN('Colours are confiscated here. You get them back at the exit. Nobody leaves.')),
      EN('Shh. Someone is sleeping, somewhere in the grey. We all walk on tiptoe.'),
      EN('I used to be a photograph. Someone kept the negative and lost the picture.')]],
    ['W006', 'A Weary Picker', old(), 'static', [
      KS('사과는 익기도 전에 떨어져. 너무 쳐다봐서 그래.', 'Apples fall before they’re ripe. It’s from being looked at too much.'),
      KS('사과 하나 먹어. 밥은 먹었니?', 'Have an apple. Have you eaten?')]],
    ['W007', 'An Assembly-Line Worker', adult(['#6a6a5a', '#4a4a3a', '#e0c8b0', '#1a1a1a'], { body: 'uniform' }), 'static', [
      KS('야근 3일째입니다. 괜찮습니다.', 'Third night of overtime. I’m fine.'),
      KS('우리는 남들 잠을 만들어요. 우리는 잘 권리도 없고요.', 'We make sleep for other people. We don’t even have the right to sleep.')]],
    ['W008', 'A Masterless Dog', beast('dog', '#a08060', 12), 'wander', [
      'He wags his tail at every door. None of them opens. He starts again at the next one.',
      'At one door he stays longer than at the others. He sniffs the doorstep. There used to be a smell of soap.']],
    ['W009', 'The House Cat', beast('cat', '#3a3a3a', 9), 'shy', [
      'The cat sleeps on the chair in the hall, the one nobody sits on any more. He is keeping the seat.',
      'When you come near, he opens one eye, looks at the door, then at you. It isn’t you he was waiting for. He half falls back asleep anyway.']],
    ['W010', 'A Lost Postman', adult(['#3a4a7a', '#2a3a6a', '#e0c8b0', '#1a1a1a'], { body: 'uniform', acc: 'bag' }), 'wander', [
      EN('Number 47. Number 47 again. Every house is number 47. I’ve been delivering the same letter for years.'),
      EN('Return to sender. Sender unknown.')]],
    ['W011', 'A Sand-Buried Switchboard Operator', adult(['#c8a878', '#a88858', '#e0c8b0', '#3a2a1a'], { acc: 'phone' }), 'static', [
      EN('Hello? Hold the line. Hold the line. Hold the line…'),
      EN('Please hold. Your call is important to us.'),
      EN('A little girl keeps dialling a number that isn’t a number. Zero. Just zero. Someone always picks up. Someone always has to go.')]],
    ['W013', 'A Metronome Snail', beast('snail', '#c8a060', 8), 'wander', [
      'He moves in time. Tick. Tock. Too slow for the song, just fast enough for him.',
      'On his shell, someone has pencilled a bar of music. Four notes, no more: the ones you hum to a child to help them fall asleep.']],
    ['W014', 'A Half-Erased Drawing', ghost('rgba(60,60,60,0.6)', 22), 'wander', [
      SEQ('One of his arms is missing, rubbed out.', EN('It doesn’t hurt. It feels empty.')),
      EN('She drew me holding somebody’s hand. Then she rubbed the somebody out. The hand went with him.')]],
    ['W015', 'A Player Who No Longer Blinks', kid(['#3a3a5a', '#2a2a4a', '#e0c8b0', '#1a1a1a'], { eyes: 'wide' }), 'static', [
      KS('한 판만 더. 한 판만.', 'One more round. Just one.'),
      KS('엄마 아빠는 내가 학원에 있는 줄 알아.', 'Mum and Dad think I’m at the hagwon.')]],
    ['W016', 'A Lifeguard Without Water', adult(['#d04040', '#a03030', '#e0b890', '#1a1a1a'], { acc: 'flag' }), 'static', [
      EN('No running. No diving. No crying in the shallow end.'),
      EN('The water left one night without a word. I kept the whistle. In case it comes back.')]],
    ['W017', 'A Night Cashier', adult(['#3a7a5a', '#2a5a4a', '#e0c8b0', '#1a1a1a'], { body: 'uniform' }), 'static', [
      KS('봉투 필요하세요? …아, 죄송합니다. 졸려서.', 'Do you need a bag? … Ah, sorry. I’m falling asleep.'),
      KS('밤손님들은 늘 같은 걸 사요. 우유하고… 시간.', 'Night customers always buy the same thing. Milk, and… time.')]],
    ['W020', 'A Deflated Mascot', beast('blob', '#e0d0e0', 18), 'statue', [
      'An empty rabbit costume, sitting on a bench. The zip is open down the back.',
      'In the costume’s pocket, a ride ticket for two. Only one half has been torn off.']],
    ['W021', 'A Blind Mole', beast('rabbit', '#3a3030', 9), 'shy', [
      SEQ('She digs upwards.', EN('They say there’s a garden up there. With an old lady who waters it.')),
      EN('All the roots down here grow towards the same place. Towards a stone. As if they missed someone.')]],
    ['W022', 'A Ticketless Traveller', adult(['#4a4a5a', '#3a3a4a', '#e0c8b0', '#2a2a2a'], { acc: 'briefcase' }), 'static', [
      EN('Next stop: nowhere. Mind the gap.'),
      EN('I got on to go to work. How long ago was that?')]],
    ['W023', 'A Doll Doing the Housework', { t: 'doll', c: ['#f0c0d0', '#d0a0b0', '#f8e0d0', '#6a3a2a'], h: 14 }, 'wander', [
      SEQ('She sweeps a tiny broom across a tiny rug.', EN('Everything must be perfect when Sir comes home. He doesn’t come home. Everything must be perfect anyway.')),
      EN('If there’s a stain, you sew a flower over it. Nobody must see.')]],
    ['W024', 'A Flying Sock', beast('moth', '#e0e0f0', 9), 'fly', [
      'A sock that flies like a bird. It has been looking for its pair since the last wash.',
      'It’s a left sock. Here, it’s always the left ones that get lost first.']],
    ['W025', 'A Fisherman on the Ice', old(['#4a5a6a', '#3a4a5a', '#e0c8a8', '#c8c8c8']), 'static', [
      EN('I fish for things that fell into the lake. A key. A glove. A sentence nobody said.'),
      EN('The ice is thickest where people stood waiting. You can tell. It never thaws there.')]],
    ['W026', 'A Guard Pigeon', beast('bird', '#8a8a9a', 9), 'wander', [
      'He watches the edge of the roof very seriously, as if it were his job to keep people away from the drop.',
      'When you go near the edge, he steps in front of you and puffs up his feathers. He won’t move. It’s his roof, and you’re on it.']],
    ['W028', 'A Gardener in Gloves', adult(['#5a7a4a', '#4a6a3a', '#e0c8b0', '#3a2a1a']), 'static', [
      EN('What grows here has been cold its whole life. It grows anyway. Slower. Stronger.'),
      EN('The old lady who came before me whistled to the blackbirds. Since she stopped, the seedlings lean towards the door.')]],
    ['W028', 'A Shivering Bumblebee', beast('bee', '#e0b030', 6), 'fly', [
      'It buzzes against the glass, on the warm side.',
      'On the glass, a small hand left a print in the mist, a long time ago. It buzzes right on that spot.']],
    ['W029', 'The Lady of the Lighthouse', old(['#2a3a5a', '#1a2a4a', '#e0c8a8', '#e0e0e0'], { acc: 'lantern' }), 'static', [
      EN('I’ve never seen a boat. I light it anyway. You never know who’s out at sea.'),
      EN('My daughter works nights too. Somewhere, one of her lamps is on. This one is for her.')]],
    ['W031', 'A Night Runner', kid(['#5a3a3a', '#3a2a2a', '#e0c0a0', '#1a1a1a']), 'wander', [
      EN('The Maze changes at midnight. Runners know it. Walkers get lost in it.'),
      EN('Day maze, night maze. Same walls, different lies.')], { speed: 3 }],
    ['W034', 'A One-Eyed Teddy Bear', { t: 'doll', c: ['#a07040', '#805020', '#c09060', '#1a1a1a'], h: 13 }, 'statue', [
      EN('They put me in the attic when she turned seven. I’m waiting for her. Bears have time.'),
      EN('The man with the suitcase won me at a fair. He said I had his eyes. I’ve only one left.')]],
    ['W036', 'A Front-Row Spectator', adult(['#8a2a3a', '#6a1a2a', '#e0c8b0', '#2a1a10']), 'static', [
      'She claps before the end of every act, so that nobody has time to be sad.',
      EN('Laugh first. Laugh early. If you laugh before the end, there isn’t one.')]],
    ['W037', 'A Complainant in the Queue', adult(), 'wander', [
      KN('침묵을 고발하러 왔습니다. 래일 다시 오라고 했습니다. 십일 년째입니다.', 'I came to report the silence. They told me to come back tomorrow. This is the eleventh year.'),
      KN('일없습니다. 다 잘 되고 있습니다.', 'It’s nothing. Everything is going well.')]],
    ['W038', 'The Night Watchman', old(['#3a4a3a', '#2a3a2a', '#e0c8a8', '#c8c8c8'], { body: 'uniform' }), 'static', [
      KS('1204호? 그 집 엄마는 항상 늦게 와.', 'Number 1204? The mother there always comes home late.'),
      KS('12층 그 꼬마, 가끔 테라스에 나와 있어. 안 보는 척하지. 보고 있어.', 'The little one on the twelfth floor, she comes out on the terrace sometimes. I pretend not to look. I’m looking.')]],
    ['W039', 'A Child Building Castles', kid(['#c8b890', '#a89870', '#f0d0b0', '#3a2a1a']), 'static', [
      EN('The sea rubs them out. I build them again. It’s our game. She always wins, but I play anyway.'),
      EN('There’s a boat stranded further up the beach. Nobody rows it. Something small is sleeping inside.')]],
    ['W040', 'Someone in the Dark', VOICE, 'voice', null, { ambientLines: [
      'Someone is breathing, very close, without fear.',
      EN('Don’t turn on the light. We see each other better like this.'),
      EN('You leave the lamp on so nothing will come. Nothing came. Only me.')] }],

    // ---- mondes secrets W041–W160 ----
    ['W041', 'A Walking Crane', beast('bird', '#f0ece0', 9), 'wander', [
      SEQ('A paper crane, walking.', EN('If you unfold me, I become a letter. Nobody wants to read me.')),
      EN('A thousand of us and you get a wish. She stopped at seven. Seven is enough for one small wish.')]],
    ['W042', 'A Worker Bee', beast('bee', '#e0a020', 7), 'fly', [
      KS('일벌은 쉬지 않아요.', 'Worker bees don’t rest.'),
      'She buzzes a number: hours, maybe.']],
    ['W043', 'A Running Nurse', adult(['#e8eef0', '#c8d0d8', '#e0c8b0', '#2a1a10'], { body: 'uniform' }), 'wander', [
      EN('Room 12, room 14, room 3. I don’t have time. Nobody has time.'),
      EN('At seven I go home. My daughter has already left for school. I kiss her pillow.')], { speed: 2.6 }],
    ['W044', 'A Polite Crow', beast('crow', '#1a1a20', 9), 'static', [
      EN('Pardon me. I don’t eat anything. I only come to keep them company. Scarecrows are very lonely.'),
      EN('They were put here to frighten. Nobody asked them if they wanted to.')]],
    ['W045', 'A Ruminating Beast', beast('deer', '#8a6a4a', 16), 'static', [
      'She chews. She chews. As if she were always chewing the same thought.',
      'Between her teeth, a scrap of paper that keeps coming back. Only one word is still legible, in a child’s letters: tomorrow.']],
    ['W046', 'A Bespectacled Botanist', adult(['#6a7a5a', '#4a5a3a', '#e0c8b0', '#5a3a2a'], { acc: 'book' }), 'static', [
      EN('Every flower is pressed with a date. This one: the day her grandmother left. It’s still a little purple.'),
      EN('The ones from 2020 are the palest. That year, something was taken out of the light.')]],
    ['W047', 'A Wrung-Out Winegrower', adult(['#6a2a4a', '#4a1a3a', '#e0c8b0', '#1a1a1a']), 'wander', [
      KS('짜내고 또 짜내. 그게 회사야.', 'Squeeze, and squeeze again. That’s the company.'),
      KS('마지막 한 방울까지 “수고하셨습니다”래. 남는 건 껍질뿐이야.', 'Down to the last drop, it’s “thank you for your hard work”. All that’s left is the skin.')]],
    ['W048', 'A Student on the Drying Rack', kid(['#8a7aa0', '#6a5a80', '#f0d0b0', '#1a1a1a'], { eyes: 'closed' }), 'static', [
      KS('알바 끝나고 빨래. 빨래 끝나면 알바.', 'Laundry after the part-time job. The part-time job after the laundry.'),
      'She sleeps sitting up, her head against the warm porthole.']],
    ['W049', 'A Valet Without Cars', adult(['#2a2a3a', '#1a1a2a', '#e0c8b0', '#1a1a1a'], { body: 'uniform' }), 'wander', [
      EN('Level minus forty. Still looking for your car? Everybody is.'),
      EN('One car hasn’t moved since 1989. On the passenger seat, a bowl of rice, gone cold. Nobody comes down for it.')]],
    ['W050', 'A Lost Bellboy', kid(['#a02020', '#801010', '#e0c8b0', '#1a1a1a'], { body: 'uniform' }), 'wander', [
      EN('Room 404 not found. Would you like to try room 405? It’s also not found.'),
      EN('Room 1204 is booked every night. The guest leaves at nine and comes back at seven. Nobody has ever seen her sleep.')]],
    ['W051', 'A Passer-by Without an Umbrella', adult(['#4a5a6a', '#3a4a5a', '#e0c8b0', '#1a1a1a']), 'wander', [
      EN('I don’t have an umbrella. I decided it doesn’t matter. It’s a decision you make every morning.'),
      EN('A man sells red umbrellas on the corner. He knocks on the lampposts. He says they’re doors.')]],
    ['W052', 'A Window Watcher', old(), 'static', [
      EN('From up here you can see every lit window in the city. I count the ones that go out. I say goodnight to each one.'),
      EN('Some never go out. Night nurses. Night watchmen. Children who are scared. Those, I say goodnight to twice.')]],
    ['W053', 'An Employee Between Floors', adult(['#2a2a34', '#1a1a24', '#e0c8b0', '#1a1a1a'], { acc: 'briefcase' }), 'static', [
      KS('47층 회의, 12층 보고, 3층 사과.', 'Meeting on the 47th, report on the 12th, apologies on the 3rd.'),
      KS('이제 엘리베이터에서 안 내려요. 그게 더 빨라요.', 'I don’t get out of the lift any more. It’s quicker.')]],
    ['W054', 'A Waiting Number', ghost('rgba(220,220,200,0.5)', 18), 'wander', [
      EN('I have number 0. They call from 1 upwards.'),
      EN('I was here before the first number. Before the first word. I can wait a little longer.')]],
    ['W055', 'A Television Salesman', adult(['#4a4a6a', '#3a3a5a', '#e0c8b0', '#1a1a1a']), 'static', [
      EN('Buy one, get one. Everything is fine. Stay tuned.'),
      KN('오늘도 우리 공화국은 행복합니다.', 'Today again, our republic is happy.')]],
    ['W056', 'A Girl Who Smiles on Command', kid(['#e0a0b0', '#c08090', '#f0d0b0', '#1a1a1a'], { mouth: 'smile' }), 'static', [
      EN('Click. Smile. Click. Smile. By the fourth photo you can’t tell which one is real.'),
      EN('My mum keeps the strip in her wallet. She looks at it on the night bus. On weekdays, that’s the closest she gets to me.')]],
    ['W057', 'A Rubber Duck', beast('bird', '#f0d040', 7), 'wander', [
      'Squeak. It floats in a bathtub with no bottom.',
      'When you squeeze it, it squeaks twice, like someone knocking at a door and waiting to be asked who’s there.']],
    ['W058', 'A Stair Climber', adult(), 'wander', [
      EN('I’ve been climbing since this morning. I’m at the bottom. That’s normal. It’s like my career.'),
      EN('My father climbed these stairs too. He got as far as section chief. After that, the stairs climbed him.')]],
    ['W059', 'A Grandmother on a Stool', old(['#a06a8a', '#804a6a', '#e0c0a0', '#d8d8d8']), 'static', [
      KS('밥 먹었어? 아이고, 말랐네.', 'Have you eaten? Oh dear, you’re so thin.'),
      KS('우리 딸도 맨날 괜찮대. 괜찮다는 애가 제일 안 괜찮은 거야.', 'My daughter always says she’s fine too. The one who says she’s fine is the one who’s least fine.'),
      KS('자장자장… 아이고, 아니지. 여긴 꿈이지.', 'Hush-a-bye… Oh dear, no. This is a dream.')]],
    ['W060', 'A Projectionist', adult(['#3a2a2a', '#2a1a1a', '#e0c8b0', '#1a1a1a']), 'static', [
      EN('The film is always the same: a little girl waiting for her mother. It never ends. People leave before.'),
      EN('Sometimes I swap the reels. Then it’s the mother waiting for the little girl. It’s the same film.')]],
    ['W061', 'A Ten p.m. Pupil', kid(['#2a3a5a', '#1a2a4a', '#e0c8b0', '#1a1a1a'], { body: 'uniform', acc: 'book' }), 'static', [
      KS('학원 끝나면 열한 시. 집에 가면 또 숙제.', 'When the hagwon finishes, it’s eleven. At home, more homework.'),
      KS('엄마가 돈 내고 나를 여기 보내. 여기가 내가 제일 잘 자는 곳이야.', 'Mum pays to send me here. This is the place where I sleep best.')]],
    ['W062', 'A Gamer in a Hoodie', kid(['#3a3a3a', '#2a2a2a', '#e0c8b0', '#1a1a1a']), 'static', [
      KS('엄마 전화 왔어. 안 받아.', 'Mum’s calling. I’m not answering.'),
      EN('GG.'),
      KS('엄마도 내 전화 안 받으니까. 비긴 거야.', 'She doesn’t answer when I call either. So we’re even.')]],
    ['W063', 'A 3 a.m. Customer', adult(['#5a5a5a', '#3a3a3a', '#e0c8b0', '#1a1a1a']), 'wander', [
      KS('삼각김밥 하나, 커피 하나. 오늘 저녁이에요.', 'One rice triangle, one coffee. That’s tonight’s dinner.'),
      KS('회식 끝나고 다시 회사 가요. 집은… 주말에 가 봐야죠.', 'After the team dinner, I go back to the office. Home… I’ll try to drop by at the weekend.')]],
    ['W064', 'A Passenger Asleep on His Feet', adult(['#2a2a3a', '#1a1a2a', '#e0c8b0', '#1a1a1a'], { eyes: 'closed' }), 'static', [
      KS('다음 역은… 다음 역은…', 'The next station is… the next station is…'),
      'He sleeps standing up, held up by the crowd.']],
    ['W065', 'An Identical Neighbour', adult(['#8a8a9a', '#6a6a7a', '#e0c8b0', '#2a2a2a']), 'wander', [
      KS('1204호세요? 저도요. 다들 1204호예요.', 'Are you from 1204? Me too. Everyone is from 1204.'),
      KS('모든 집이 같은 시간에 불을 꺼요. 한 집만 빼고요. 그 집 애는 불 켜 놓고 자요.', 'Every flat turns its lights off at the same time. Except one. The child in that one sleeps with the light on.')]],
    ['W066', 'Another Courier', adult(['#e0a020', '#c08010', '#e0c8b0', '#1a1a1a'], { body: 'uniform' }), 'wander', [
      KS('배달 30분 안에! 아니면 별점 1개.', 'Delivered within thirty minutes! Or it’s one star.'),
      KS('어제 1204호 배달. “문 앞에 두세요. 벨 누르지 마세요.” 아무도 안 열어요.', 'Yesterday, a delivery to 1204. “Leave it at the door. Don’t ring the bell.” Nobody opens.')], { speed: 3 }],
    ['W067', 'An Off-Key Singer', adult(['#8a3a8a', '#6a2a6a', '#e0c8b0', '#1a1a1a'], { acc: 'mic' }), 'static', [
      KS('노래방에서는 아무도 안 울어. 다 노래하니까.', 'Nobody cries at karaoke. Everyone’s singing.'),
      KS('부장님 18번은 맨날 같은 노래야. 집에 가고 싶다는 노래. 다들 박수 쳐.', 'The boss’s go-to song is always the same one. A song about wanting to go home. Everyone claps.')]],
    ['W068', 'A Passer-by Reading the Railing', adult(['#4a6a7a', '#3a5a6a', '#e0c8b0', '#1a1a1a']), 'static', [
      KS('힘내세요. 당신은 혼자가 아니에요.', 'Hang in there. You are not alone.'),
      KS('누가 나한테 쓴 거예요. 아무한테나 쓴 거기도 하고요. 똑같아요.', 'Someone wrote this for me. And for anyone. It’s the same thing.'),
      KS('오늘은 집에 갈 거예요. 내일 또 읽으러 올게요.', 'Tonight I’m going home. I’ll come back to read it tomorrow.')]],
    ['W069', 'A Moderator', adult(['#3a3a4a', '#2a2a3a', '#d8c0a8', '#1a1a1a'], { eyes: 'wide' }), 'static', [
      EN('Flagged. Flagged. Removed. Next.'),
      KS('아무도 보면 안 되는 걸 제가 봐요. 하루 여덟 시간.', 'I watch what nobody should see. Eight hours a day.')]],
    ['W070', 'A Surveillance Drone', beast('moth', '#3a3a4a', 8), 'fly', [
      'It hums above your head. A little red light blinks: it is recording that you are fine.',
      'At every lit window, it takes a photo and sends it far away, to someone who always replies with a thumbs-up.']],
    ['W071', 'An Exhausted Flag-Bearer', adult(['#5a6a4a', '#4a5a3a', '#e0c8b0', '#1a1a1a'], { body: 'uniform', acc: 'flag' }), 'static', [
      KN('경애하는 어버이께 감사드립니다!', 'Thank you, beloved Parent!'),
      'His arms shake under the flag. He smiles harder.']],
    ['W072', 'A Model Resident', adult(['#c8c0b0', '#a8a090', '#e0c8b0', '#1a1a1a'], { mouth: 'smile' }), 'static', [
      KN('우리 마을은 아무 문제도 없습니다.', 'Our village has no problems at all.'),
      'Behind her, the window is painted on the wall. There is no house.']],
    ['W073', 'A Child Reciting', kid(['#c83030', '#a02020', '#e0c8b0', '#1a1a1a'], { body: 'uniform' }), 'static', [
      KN('우리는 행복합니다. 우리는 부럽지 않습니다.', 'We are happy. We have nothing to envy.'),
      'He recites without breathing. At the end he looks at you, as if to check he got it right.']],
    ['W074', 'A Gleaner', old(['#8a7a5a', '#6a5a3a', '#e0c8a8', '#c8c8c8']), 'static', [
      KN('올해도 풍년입니다.', 'This year again, the harvest is plentiful.'),
      'Her basket is empty. She holds it close as if it were heavy.']],
    ['W075', 'A Frame Cleaner', adult(['#4a4a3a', '#3a3a2a', '#e0c8b0', '#1a1a1a']), 'wander', [
      KN('초상화에 먼지가 있으면 안 됩니다.', 'There must be no dust on the portraits.'),
      KN('스무 해째 같은 초상화를 닦습니다. 제 초상화는 한 번도 본 적이 없습니다.', 'I have wiped the same portrait for twenty years. I have never seen my own.')]],
    ['W076', 'A Guide with a Megaphone', adult(['#3a4a3a', '#2a3a2a', '#e0c8b0', '#1a1a1a'], { acc: 'mic' }), 'static', [
      KN('모든 것이 잘 되고 있습니다!', 'Everything is going well!'),
      'The megaphone repeats it. He stopped saying anything long ago.']],
    ['W078', 'A Soldier Who Doesn’t Look', adult(['#4a5a3a', '#3a4a2a', '#e0c8b0', '#1a1a1a'], { body: 'uniform' }), 'static', [
      KN('건너면 돌아올 수 없어.', 'If you cross, you can’t come back.'),
      'He looks at the other bank without looking at it. Those are his orders.']],
    ['W079', 'A Woman with a Handkerchief', adult(['#6a5a6a', '#4a3a4a', '#e0c8b0', '#2a1a10']), 'static', [
      SEQ('She waves a handkerchief at a train that left long ago.', KN('누군가는 끝까지 작별 인사를 해야 하지 않겠습니까.', 'Someone has to keep saying goodbye until the very end, don’t they?')),
      KN('그날은 신발 한 짝이 렬차보다 먼저 떠났습니다.', 'That day, a single shoe left before the train.')]],
    ['W080', 'A Ghost Mechanic', ghost('rgba(200,200,180,0.5)', 22), 'wander', [
      SEQ('He is repairing a train that will never run again.', EN('It’s not so it’ll run. It’s so it’ll be ready.')),
      EN('Every engine here was promised to someone. Number 23 was promised to a boy. He’s an old man now. He’s still on the platform, polishing his shoes.')]],
    ['W081', 'A Clockmaker Without a Watch', old(), 'static', [
      EN('Every clock here is slow by a different life. That one is yours. It runs a little fast. That’s a good sign.'),
      EN('Some clocks have two hands of the same length. They can’t tell which hour they’re in. When the hour repeats, they listen.')]],
    ['W082', 'An Insomniac Platform Master', adult(['#2a3a5a', '#1a2a4a', '#e0c8b0', '#1a1a1a'], { body: 'uniform' }), 'static', [
      EN('The 23:71? Never seen it. Everybody waits for it. Come back between eleven and midnight. You never know.'),
      EN('It isn’t in the timetable. Hours that overflow don’t go in timetables. They go on platforms.')]],
    ['W083', 'A Lost Property Clerk', old(['#5a4a3a', '#3a2a1a', '#e0c8a8', '#c8c8c8']), 'static', [
      EN('Last year we found a child’s voice. Nobody came to claim it. It’s in the drawer, there. Sometimes it sings.'),
      EN('The locker marked 1951 is the fullest. Shoes, mostly. Never more than one of each pair.')]],
    ['W084', 'A Cloud That Rains by Itself', beast('jelly', '#d0d8e8', 12), 'fly', [
      'A little grey cloud raining on itself. It says it helps.',
      EN('Don’t worry. It’s only rain. Somebody has to let it out.')]],
    ['W085', 'A One-Person Caravan', adult(['#c8a878', '#a88858', '#d0a880', '#3a2a1a']), 'wander', [
      EN('Salt is the tears of someone who walked a long way. I came to gather them.'),
      EN('A little girl walked south through here once, with only one shoe. The salt is thickest along her path.')]],
    ['W086', 'A Late Reflection', ghost('rgba(200,220,240,0.6)', 22), 'mimic', [
      'It copies your movements, a second late. It looks more tired than you.',
      'When you stop, it carries on for a moment, alone. It makes a gesture you didn’t make: it pulls a blanket up over someone.']],
    ['W087', 'Someone Behind a Curtain', VOICE, 'voice', null, { ambientLines: [
      'A curtain moves.',
      EN('Don’t pull it. I’m not ready.'),
      EN('Me neither.'),
      'A thousand curtains move at once, then none at all.'] }],
    ['W088', 'A Soaked Gull', beast('bird', '#f0f0f0', 9), 'wander', [
      'She cries into the wind, just to check she still has a voice.',
      'In her beak, a scrap of wet postcard. The stamp comes from very far away; the writing has run.']],
    ['W089', 'A Croupier in a Tuxedo', adult(['#1a1a1a', '#0a0a0a', '#e0c8b0', '#1a1a1a']), 'static', [
      EN('The house always wins. The house is always empty.'),
      EN('Place your minutes. Red: an hour with your mother. Black: an hour of sleep. She always bets on black. She always loses.')]],
    ['W090', 'A Deep-Sea Swimmer', adult(['#2a6a7a', '#1a5a6a', '#e0c8b0', '#1a1a1a']), 'swim', [
      SEQ('She swims under the green surface. She comes up for air and says:', EN('A little longer. There’s a bed, down there.')),
      EN('Every night I swim down to it. Every morning I come back up. Someone has to go to work.')]],
    ['W091', 'A Guardian Crab', beast('ant', '#c05030', 7), 'wander', [
      'It pinches the air when you near the chest. Then it lets you by. Crabs are fair.',
      'It always walks sideways, so it never turns its back on the wreck. Crabs don’t abandon ships.']],
    ['W092', 'A Lone Weatherwoman', adult(['#5a6a7a', '#4a5a6a', '#e0c8b0', '#1a1a1a'], { acc: 'clipboard' }), 'static', [
      EN('Forecast: long night, possible clearing towards morning. That’s what I say every evening. Sometimes it’s true.'),
      EN('Low pressure over the twelfth floor. Three years now. I keep reporting it. Nobody adjusts anything.')]],
    ['W093', 'A Blinking Statue', old(['#8a8a8a', '#6a6a6a', '#a8a8a8', '#8a8a8a']), 'statue', [
      SEQ('She blinks when you look away.', EN('Don’t tell anyone. We’re not allowed to move, here.')),
      EN('There’s one real statue, further in. She doesn’t blink. She’s the only one of us who really rests.')]],
    ['W094', 'A Nine-Year-Old Big Sister', kid(['#c86a6a', '#a04a4a', '#f0d0b0', '#1a1a1a']), 'wander', [
      SEQ('She holds the hand of a child smaller than her.', EN('I’m taking him home. Mum’s working. I’m big.'), 'She isn’t big.'),
      EN('I know how to do the rice. You press the button and you wait. Then you wait for Mum.')]],
    ['W095', 'A Child in Front of the Screen', kid(['#4a5a8a', '#3a4a7a', '#d8c0b0', '#1a1a1a'], { eyes: 'wide' }), 'static', [
      SEQ('He watches the TV. The TV watches him.', EN('It talks to me when there’s nobody here.')),
      EN('On TV they laugh at the right moment. I’m learning. When I laugh really loud at school, everybody looks at me.')]],
    ['W096', 'Behind the Partition', VOICE, 'voice', null, { ambientLines: [
      'Someone is crying very softly in the next cubicle. When you knock, it stops.',
      EN('… I’m fine. I’m fine. I’ll be out soon.'),
      EN('Fold one corner, then the other. If your hands are busy, nobody hears you.')] }],
    ['W097', 'A PE Teacher', adult(['#2a5a2a', '#1a4a1a', '#e0c8b0', '#1a1a1a'], { acc: 'flag' }), 'static', [
      SEQ(EN('Climb the rope! Everybody’s watching!'), 'Nobody is watching. Except them, laughing.'),
      EN('She doesn’t answer when I call her name. So I call it louder. That helps, doesn’t it?')]],
    ['W098', 'A Living Doodle', beast('blob', '#3a3a8a', 12), 'wander', [
      SEQ('It is made of crossings-out.', EN('I’m everything she wrote before she wrote the right sentence.')),
      EN('The right sentence was three words long. In the end she crossed it out too. It’s under me, somewhere.')]],
    ['W099', 'A Punished Child', kid(['#6a6a8a', '#4a4a6a', '#f0d0b0', '#1a1a1a']), 'static', [
      EN('They told me to wait here. Everyone went home. It’s snowing. Nobody came to say it was over.'),
      EN('If I go in by myself, it means I gave up. If I stay, it means I’m good. I’m good.')]],
    ['W101', 'A Man Who Lives in the Whale', old(['#6a5a4a', '#4a3a2a', '#e0c8a8', '#c8c8c8'], { acc: 'book' }), 'static', [
      EN('I have a chair, a lamp, a book. It’s nice inside the whale. Only people are missing.'),
      EN('The book is a train timetable. I read it from the end. That way, the trains are always about to arrive.')]],
    ['W102', 'A Glowing Krill', beast('jelly', '#f08060', 6), 'fly', [
      'A tiny glowing shrimp. It dances, all alone, in the dark.',
      'If you keep still, it settles on your hand and glows a little brighter, like a nightlight.'], { count: 3, light: 1 }],
    ['W103', 'A Gallery Attendant', adult(['#3a3a4a', '#2a2a3a', '#e0c8b0', '#1a1a1a'], { body: 'uniform' }), 'static', [
      KN('이 감정은 전시 금지입니다.', 'This emotion is banned from display.'),
      KN('분노는 지하에. 슬픔은 자물쇠 안에. 허용된 기쁨은 1호실, 9시부터 9시 5분까지.', 'Anger, in the basement. Sadness, under lock and key. Permitted joy: Room 1, from 9:00 to 9:05.')]],
    ['W104', 'A Reversed Passer-by', adult(['#c0c8e0', '#a0a8c0', '#e0c8b0', '#1a1a1a']), 'wander', [
      EN('Here, we say hello when we leave and goodbye when we arrive. Hello.'),
      EN('A man here once left saying “see you tomorrow”. So here, that means forever. Goodbye.')]],
    ['W105', 'A Librarian Rat', beast('rabbit', '#6a6a6a', 8), 'shy', [
      'He files scraps of maps of the Maze, in order of night.',
      'One of the maps is folded into the shape of a compass. He always sets it apart, as if it belonged to someone who will come back for it.']],
    ['W106', 'A Counting Doorman', adult(['#5a3a2a', '#3a2a1a', '#e0c8b0', '#1a1a1a'], { body: 'uniform' }), 'static', [
      EN('Nine hundred and ninety-nine doors open onto a wall. Only one onto a bedroom. I can’t remember which.'),
      EN('The right one has light under it. Always on. Someone in there is afraid of the dark.')]],
    ['W107', 'A Child on the Ceiling', kid(['#8aa06a', '#6a804a', '#f0d0b0', '#1a1a1a']), 'wander', [
      EN('Here, you’re the one who’s upside down. I’m normal.'),
      EN('From up here, your bedroom ceiling is my floor. I can hear you not sleeping.')]],
    ['W108', 'An Announcement Voice', VOICE, 'voice', null, { ambientLines: [
      EN('Attention please. A child is waiting at the information desk.'),
      EN('… The child is still waiting.'),
      EN('Would the parents of the child in the yellow raincoat… Would anyone…')] }],
    ['W109', 'A Disheartened Woodcutter', adult(['#8a3a2a', '#6a2a1a', '#e0c8b0', '#3a2a1a']), 'static', [
      EN('I cut. It grows back. I cut. It grows back. At first I was angry. Now I think it’s beautiful.'),
      EN('At three in the morning, a grey wolf comes and sits with me. He works nights too, he says.')]],
    ['W110', 'An Archivist with a Black Marker', adult(['#2a2a2a', '#1a1a1a', '#e0c8b0', '#1a1a1a']), 'static', [
      KN('이 문서는 존재하지 않습니다.', 'This document does not exist.'),
      'He blacks out lines. Sometimes he reads one first. He never says which.']],
    ['W112', 'A Theatre Dresser', adult(['#7a4a6a', '#5a2a4a', '#e0c8b0', '#2a1a10'], { acc: 'needle' }), 'static', [
      EN('Here, we take the costumes off. Some actors won’t any more. They sleep in them.'),
      EN('There’s a white dress nobody is allowed to try on. Mourning white. It hangs there, waiting for a name.')]],
    ['W113', 'A Fly Under the Lamp', beast('moth', '#3a3a30', 6), 'fly', [
      'It circles the bulb, again and again. The only light on in the whole house.',
      'Under the lamp, on the table, a note on squared paper. The ink has bled; all you can make out is Korean handwriting, hurried, by someone who was leaving.']],
    ['W114', 'A Toy Robot Without Batteries', { t: 'robot', c: ['#c8c8d0', '#a0a0a8', '#e04040', '#303030'], h: 14 }, 'statue', [
      SEQ('It takes one step when you look at it. Then nothing.', EN('Bat… ter… ies…')),
      EN('Wind… me… up… Some… one… used… to…')]],
    ['W115', 'A Pupil from 1989', kid(['#2a3a5a', '#1a2a4a', '#f0d0b0', '#1a1a1a'], { body: 'uniform' }), 'static', [
      KS('우리 엄마는 공장에서 일해. 밤에.', 'My mum works at the factory. At night.'),
      KS('미란이는 맨날 학교에 늦게까지 남아 있어. 집에 가도 아무도 없대.', 'Mi-ran always stays late at school. She says even if she goes home, there’s nobody there.')]],
    ['W116', 'A Street Vendor', old(['#6a5a4a', '#4a3a2a', '#e0c8a8', '#c8c8c8']), 'static', [
      KS('붕어빵 하나 줄까? 따뜻해.', 'Want a bungeoppang? It’s warm.'),
      KS('저 빌딩들 불 꺼지는 거 봤니? 아직 하나도 안 꺼졌어. 아빠들은 언제 오나 몰라.', 'Have you seen the lights in those buildings go out? Not a single one yet. I wonder when the dads come home.')]],
    ['W117', 'A Knitting Patient', old(['#c8d0d8', '#a8b0b8', '#e0c8a8', '#d8d8d8'], { acc: 'needle' }), 'static', [
      KS('딸한테 줄 목도리를 뜨고 있어. 1989년에 시작했지. 길어질 거야.', 'I’m knitting a scarf for my daughter. I started it in 1989. It’s going to be long.'),
      KS('딸은 프랑스에 있어. 춥대. 아니, 괜찮대. 걔는 늘 괜찮대.', 'My daughter is in France. She says it’s cold. No, she says she’s fine. She always says she’s fine.')]],
    ['W118', 'A Pale Stretcher-Bearer', adult(['#a0c0b0', '#80a090', '#d8c8b8', '#1a1a1a'], { body: 'uniform' }), 'wander', [
      KS('3교대, 오늘은 밤 근무.', 'Three shifts. Tonight, it’s nights.'),
      KS('여기 엘리베이터는 아침 7시에만 올라가요. 다들 그때 퇴근하니까.', 'The lift here only goes up at seven in the morning. That’s when everyone finishes their shift.')]],
    ['W119', 'The Dreaming Patient', old(['#d8d8e0', '#b8b8c0', '#e0c8a8', '#d8d8d8'], { eyes: 'closed' }), 'statue', [
      SEQ('He is asleep. In his dream, he says:', EN('I dream of a girl who dreams of me. She’s lucky. She’ll wake up.')),
      EN('Tell the night nurse she can sit down. Just for a minute. I won’t tell.')]],
    ['W121', 'An Observer in a Lab Coat', adult(['#e8e8e8', '#c8c8c8', '#e0c8b0', '#1a1a1a'], { acc: 'clipboard' }), 'static', [
      EN('Subject 6: still dreaming. Note: she talks to them.'),
      EN('Note: she does not talk to us. Note: we have not asked properly.')]],
    ['W122', 'An Intern Tidying Up', kid(['#e8e8e8', '#c8c8c8', '#e0c8b0', '#3a2a1a'], { acc: 'clipboard' }), 'wander', [
      EN('Subjects 1 to 5: file missing. Subject 6: you.'),
      EN('Your mother signed the form at seven in the morning, still in her uniform. She asked if it would hurt. It didn’t.')]],
    ['W123', 'The Listening Microphone', VOICE, 'voice', null, { ambientLines: [
      'The red light comes on when you speak. A recorded voice repeats, slowed down, what you said yesterday.',
      EN('Recording. Recording. Nothing said for forty minutes. Keep recording.'),
      EN('Playback, night three, 2:14 a.m. Subject says one word. Inaudible. Possibly “Mum”.')] }],
    ['W124', 'A Dream Technician', adult(['#3a5a6a', '#2a4a5a', '#e0c8b0', '#1a1a1a'], { body: 'uniform' }), 'static', [
      EN('Dream output nominal. Emotional leakage: high.'),
      EN('We make happy dreams for sad people. The pipe leaks.')]],
    ['W125', 'A Replacement Resident', adult(['#7a7a7a', '#5a5a5a', '#e0c8b0', '#2a2a2a']), 'wander', [
      EN('I replaced somebody yesterday. He had a dog. The dog doesn’t like me. He’s right.'),
      EN('Here, when somebody leaves, the city puts someone else in their chair. Nobody notices. Children notice.')]],
    ['W126', 'A Dormitory Night-Watcher', adult(['#4a4a6a', '#3a3a5a', '#e0c8b0', '#2a1a10'], { acc: 'lantern' }), 'static', [
      EN('Shh. They all sleep at the same time. When one wakes up, all the others dream of them.'),
      EN('One bed has a lamp that stays on. I’m not allowed to switch it off. Sometimes I do, very gently.')]],
    ['W127', 'A Corridor Walker', ghost('rgba(230,230,230,0.5)', 20), 'wander', [
      EN('The corridor loops. So do I. We get along.'),
      EN('Corridor zero. Before the first room. Some people never get as far as a door. They’re not lost. They’re early.')]],
    ['W128', 'The Wall', VOICE, 'voice', null, { ambientLines: [
      EN('How did you get in? … Don’t tell me. It would work less well.'),
      EN('Rooms without doors are for the things nobody says. You fit in here very well.')] }],
    ['W129', 'A Little Ghost on the Swing', ghost('rgba(255,230,230,0.5)', 14), 'static', [
      SEQ('He swings all by himself.', EN('They all went off to big school. Nobody said goodbye to me.')),
      EN('There was a girl who talked a lot, back then. She talked for two. Then she stopped.')]],
    ['W130', 'A Child Looking for Pairs', kid(['#8a9aa0', '#6a7a80', '#f0d0b0', '#1a1a1a']), 'wander', [
      SEQ('He looks for pairs among thousands of shoes.', EN('If I find the pair, someone comes home. That’s the rule.')),
      EN('It’s always the left ones that are missing. Someone lost a left one a long time ago, and all the others followed.')]],
    ['W133', 'A Shrinking Employee', adult(['#3a3a4a', '#2a2a3a', '#e0c8b0', '#1a1a1a'], { h: 17 }), 'static', [
      KS('칼퇴는 꿈이에요.', 'Leaving on time is a dream.'),
      'His chair is smaller than it was a moment ago. So is he.']],
    ['W134', 'A Director Who Never Concludes', adult(['#5a2a3a', '#3a1a2a', '#e0c8b0', '#1a1a1a']), 'static', [
      KS('마지막으로 한 가지만 더…', 'Just one last thing…'),
      KS('…그리고 결론적으로, 결론을 내리기 전에…', '… and to conclude, before concluding…')]],
    ['W135', 'A Smoker on Break', adult(['#4a4a4a', '#2a2a2a', '#e0c8b0', '#1a1a1a']), 'static', [
      KS('5분만. 5분만 쉬고 들어갈게.', 'Five minutes. Just a five-minute break, then I’ll go back in.'),
      KS('여기서 보면 도시가 자는 것 같아요. 절대 안 자요. 저도요.', 'From here, the city looks like it’s asleep. It never sleeps. Neither do I.')]],
    ['W137', 'A Flower No One Waters Any More', H({ head: 'flower', body: 'stick', legs: false, arms: false, c: ['#6a8a4a', '#6a8a4a', '#f0e080', '#c080c0'], h: 15 }), 'static', [
      SEQ('A drooping flower.', EN('Somebody watered me on Sundays. How many Sundays has it been?')),
      EN('A hundred and fifty-something. I stopped counting. Counting is for flowers who are sure of something.')]],
    ['W138', 'A Postman of the Impossible', adult(['#c8a020', '#a08010', '#e0c8b0', '#1a1a1a'], { body: 'uniform', acc: 'bag' }), 'wander', [
      EN('Address: Mum, in ten years. I’m keeping it. I’ll deliver it.'),
      EN('Some letters leave before they’re written. 1989, bound for 2044. I just walk in between.')]],
    ['W139', 'A Night Cleaner', old(['#4a6a8a', '#3a5a7a', '#e0c0a0', '#c8c8c8'], { acc: 'broom' }), 'static', [
      KS('사람들이 퇴근하면 우리가 출근해요.', 'When people clock off, we clock on.'),
      KS('김 과장님 자리는 항상 마지막이에요. 사진 액자만 닦아요. 이름표 단 꼬마 여자애.', 'Manager Kim’s desk is always the last one. I only wipe the photo frame. A little girl wearing a name badge.')]],
    ['W140', 'A Cartographer Pigeon', beast('bird', '#8a8a9a', 9), 'wander', [
      'He follows the map drawn on the walls. He has never got lost.',
      'He lands on the arm of a girl who writes on her skin, reads, then sets off in the right direction.']],
    ['W141', 'The Owner Who Doesn’t Exist', ghost('rgba(240,240,220,0.45)', 22), 'static', [
      EN('Welcome. Nothing is for sale. Everything is free. Nothing exists. Help yourself.'),
      EN('The shelf at the back has the things people meant to buy on the way home. Milk. Batteries. A birthday cake.')]],
    ['W142', 'A Resident of 13A', adult(['#6a5a7a', '#4a3a5a', '#e0c8b0', '#1a1a1a']), 'static', [
      EN('There’s no thirteenth floor, so we live on 13A. We never get any post. It’s restful.'),
      EN('On some Fridays, the street grows one house too many. That’s how people get here.')]],
    ['W143', 'A Hand on the Banister', VOICE, 'voice', null, { ambientLines: [
      'A hand, next to yours, on the banister. It doesn’t pull. It holds.',
      EN('One step. Then another. I’m not going anywhere.')] }],
    ['W144', 'A Silhouette at the Window', ghost('rgba(255,240,200,0.5)', 22), 'static', [
      'She waves to you from far away. When you come closer, the house moves back. She keeps waving.',
      'She wears a gardening apron. In her other hand, something heavy: a watering can, perhaps. She never puts it down.']],
    ['W145', 'A Motionless Passer-by', adult(), 'statue', [
      EN('If you stand still long enough, the world opens up in the end. I’ve been waiting since Tuesday.'),
      EN('Which Tuesday, I couldn’t say. There have been a lot of Tuesdays.')]],
    ['W146', 'A Doll with a Sewn-Up Mouth', { t: 'doll', c: ['#d8c8c0', '#b8a8a0', '#f0e0d8', '#3a1a1a'], h: 13 }, 'statue', [
      'A doll whose mouth is sewn shut. Her eyes follow the door.',
      'The stitches are very tight, in red thread. Someone wanted nobody to see. One stitch has come undone, the one in the middle.']],
    ['W147', 'A Bug', beast('blob', '#40ff60', 12), 'wander', [
      SEQ('██ ███ ██████.', EN('Sorry. I meant to say: hello.')),
      EN('I was a line of dialogue once. Somebody translated me too many times.')]],
    ['W148', 'The Guest Who Didn’t Come', ghost('rgba(255,220,240,0.5)', 18), 'static', [
      EN('Happy birthday. I’m the friend you invited who didn’t come. I came after all. In a dream.'),
      EN('There were six chairs. Your mum arrived at the very end, still in her coat. She ate her cake standing up. It counted.')]],
    ['W149', 'A Dream Inspector', adult(['#2a3a6a', '#1a2a5a', '#e0c8b0', '#1a1a1a'], { body: 'uniform', acc: 'ticket' }), 'static', [
      EN('Dream number seven. Please keep your ticket until you wake up.'),
      EN('A ticket punched too early brings luck to people who wait. Don’t throw yours away.')]],
    ['W150', 'A Hesitant Customer', adult(['#8a6a4a', '#6a4a2a', '#e0c8b0', '#1a1a1a']), 'wander', [
      EN('I wanted to buy the memory of a summer. It costs a year. A year is expensive.'),
      EN('The cheapest thing in the shop is a knock-knock joke with no ending. Nobody buys it. Everybody already has one.')]],
    ['W151', 'A Disheartened Cartographer', adult(['#5a5a3a', '#3a3a2a', '#e0c8b0', '#3a2a1a'], { acc: 'map' }), 'static', [
      EN('I’ve drawn a hundred maps of the Maze. It changes every night. I keep them anyway: they’re beautiful.'),
      EN('There’s another girl here, very fast. She says there’s a way out to the real world. I didn’t tell her about the stairs that go down.')]],
    ['W152', 'An Endless Walker', old(), 'wander', [
      EN('I walked straight ahead for seven nights. I passed the same tree three times. It said hello.'),
      EN('The fourth time, I said hello first. It looked surprised. We’re friends now.')]],
    ['W153', 'A Child in the Cupboard', kid(['#a08a6a', '#806a4a', '#f0d0b0', '#1a1a1a']), 'shy', [
      EN('The house added a room last night. It does that when someone feels too cramped.'),
      EN('The new room is always the same: a bed, a lamp left on, a door that doesn’t quite shut. So you can hear if anyone comes.')]],
    ['W154', 'A Land Surveyor', adult(['#6a6a4a', '#4a4a2a', '#e0c8b0', '#1a1a1a'], { acc: 'clipboard' }), 'wander', [
      EN('Outside: four metres. Inside: four hundred. I did the sums again. It’s grief that takes up the room.'),
      EN('Grief, and a suitcase nobody unpacks. That alone is forty metres.')]],
    ['W155', 'A Girl Who Meets Herself', kid(['#a8c4e2', '#7e9cc4', '#f6d8c0', '#1e1a26'], { alpha: 0.7 }), 'wander', [
      'She says hello to you. Then she says hello again, coming in through the door opposite. It’s the same girl.',
      EN('Hello. — Hello. — Did you say it first, or did I?')]],
    ['W156', 'A Speller', old(['#5a5a6a', '#3a3a4a', '#e0c8a8', '#c8c8c8']), 'static', [
      EN('S. O. R. A. The stones spell a name when you look at them in order. I don’t know who that is.'),
      EN('Over there, they say it means a seashell. Something you can hide inside. Or hold to your ear, to hear the sea when it’s far away.')]],
    ['W157', 'A Narrator Who Starts Over', VOICE, 'voice', null, { ambientLines: [
      EN('Once upon a time… no. Twice upon a time… no. Once upon a night.'),
      EN('Once upon a night, there was a lamp left on. That’s the whole story. The rest is people walking past it.')] }],
    ['W158', 'A Lost White Bear', beast('dog', '#f0f0f0', 18), 'wander', [
      'A big white bear on the white plain. You can only see him by his shadow.',
      'When he lies down, you can’t see him at all. All that remains, in the snow, is the shape of a great back, breathing.']],
    ['W159', 'A Blackbird on the Plinth', beast('bird', '#1a1a1a', 8), 'static', [
      'A blackbird on the statue’s shoulder. It whistles a tune the statue used to know.',
      'It stops halfway through the tune, tilts its head and waits. Someone, before, always whistled the rest.']],
    ['W160', 'The Names That Resurface', VOICE, 'voice', null, { ambientLines: [
      KS('옥순… 미란… 소라…', 'Ok-sun… Mi-ran… Sora…'),
      'The names rise from the well, one by one, and fall back.',
      KN('…재식이올시다. 저도 여기 있습니다. 죄송합니다.', '… It is Jae-sik. I am here too. I’m sorry.')] }],
    // ---- mondes profonds ----
    ['W166', 'A Snail Following the Spiral', beast('snail', '#e8c040', 8), 'wander', [
      SEQ('It has followed the spiral since the beginning.', EN('I’m in no hurry to reach the middle. Nobody should be.')),
      EN('Right at the middle, they say, there’s a room where you were before you had a name.')]],
    ['W170', 'A Rolling Pip', beast('blob', '#1a1010', 8), 'wander', [
      SEQ('A black pip, rolling all by itself.', EN('Plant me, and another game will grow.')),
      EN('Watermelon summers. Someone cut it into triangles and saved the biggest for you. Then said she wasn’t hungry.')]],
    ['W172', 'A Robot Nanny', { t: 'robot', c: ['#e8e8f0', '#c8c8d8', '#80c0ff', '#303040'], h: 18 }, 'static', [
      EN('Your mother loves you. This message was scheduled.'),
      KS('엄마는 회의 중이에요. 잘 자요.', 'Mum is in a meeting. Sleep well.'),
      KS('오늘의 엄마 영상: 3초. 다시 재생할까요?', 'Today’s Mum video: 3 seconds. Play it again?')]],
    ['W174', 'A Chatty Glass Shard', beast('jelly', '#c0f0ff', 8), 'fly', [
      SEQ('It reflects your face in six pieces.', EN('Which one is real? All of them.')),
      EN('One piece shows a woman at a desk, at night, in 2044. She has your eyes. She looks very tired.')]],
    ['W175', 'The Heartbeat', VOICE, 'voice', null, { ambientLines: [
      'Ba-dum. Ba-dum. The steps beat like a heart coming down the stairs with you.',
      'Between two beats, very far away, a woman’s voice counts something in Korean, gets it wrong, and starts again from the beginning.'] }],
    ['W176', 'A Presenter Stuck in the Screen', adult(['#2a2a4a', '#1a1a3a', '#e0c8b0', '#1a1a1a'], { mouth: 'smile' }), 'static', [
      EN('Breaking news: nothing happened. Again.'),
      KN('오늘의 소식: 모든 것이 정상입니다.', 'Today’s news: everything is normal.')]],
    ['W180', 'The Witches’ Black Cat', beast('cat', '#101010', 9), 'static', [
      SEQ('He sleeps at the foot of the fifth bed. He opens one eye:', EN('They’ll be back. They always come back when you’re scared.')),
      EN('Each of them sleeps on a rule. You know them all by heart. You learned them before you could read.')]]
  ];

  LIST.forEach(function (row) {
    var w = YN.data.worlds[row[0]]; if (!w) { YN.warn('extra inhabitant: missing world ' + row[0]); return; }
    var o = row[5] || {}, id = 'N' + (NEXT++), voice = row[3] === 'voice';
    var def = Object.assign({ id: id, world: row[0], name: row[1], look: row[2], kind: voice ? 'voice' : 'creature', behavior: voice ? 'static' : row[3], radius: 3, speed: 1.2, solid: row[3] === 'static' || row[3] === 'statue' }, voice ? { invisible: true, hearDist: 30, ambientEvery: 16 } : {}, { lines: row[4] || undefined }, o);
    var count = def.count || 1; delete def.count;
    YN.defEntity(def);
    w.npcs = (w.npcs || []).slice();
    for (var i = 0; i < count; i++) w.npcs.push({ id: id, at: 'random-any' });
  });
})(typeof window !== 'undefined' ? window : globalThis);
