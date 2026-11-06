
'use strict';
const INTERVALS=[
{id:'p1',label:'reine Prime',short:'r1',degree:1,semitones:0,tier:0},
{id:'m2',label:'kleine Sekunde',short:'k2',degree:2,semitones:1,tier:0},
{id:'M2',label:'grosse Sekunde',short:'g2',degree:2,semitones:2,tier:0},
{id:'m3',label:'kleine Terz',short:'k3',degree:3,semitones:3,tier:0},
{id:'M3',label:'grosse Terz',short:'g3',degree:3,semitones:4,tier:0},
{id:'P4',label:'reine Quarte',short:'r4',degree:4,semitones:5,tier:0},
{id:'P5',label:'reine Quinte',short:'r5',degree:5,semitones:7,tier:0},
{id:'m6',label:'kleine Sexte',short:'k6',degree:6,semitones:8,tier:1},
{id:'M6',label:'grosse Sexte',short:'g6',degree:6,semitones:9,tier:1},
{id:'m7',label:'kleine Septime',short:'k7',degree:7,semitones:10,tier:1},
{id:'M7',label:'grosse Septime',short:'g7',degree:7,semitones:11,tier:1},
{id:'A2',label:'übermässige Sekunde',short:'ü2',degree:2,semitones:3,tier:2},
{id:'A3',label:'übermässige Terz',short:'ü3',degree:3,semitones:5,tier:2},
{id:'d4',label:'verminderte Quarte',short:'v4',degree:4,semitones:4,tier:2},
{id:'A4',label:'übermässige Quarte (Tritonus)',short:'ü4',degree:4,semitones:6,tier:2},
{id:'d5',label:'verminderte Quinte (Tritonus)',short:'v5',degree:5,semitones:6,tier:2},
{id:'A5',label:'übermässige Quinte',short:'ü5',degree:5,semitones:8,tier:2}
];
const LETTERS=['C','D','E','F','G','A','B'],NAT={C:0,D:2,E:4,F:5,G:7,A:9,B:11};
const LEVELS = ['Basic', 'Advanced', 'Profi', 'Dreiklänge', 'Umkehrungen & Lagen', 'Vierklänge', 'Vierklangumkehrungen'];
const TRIADS = [
  { id: 'dur', label: 'Dur', third: 4, fifth: 7 },
  { id: 'moll', label: 'Moll', third: 3, fifth: 7 },
  { id: 'dim', label: 'vermindert', third: 3, fifth: 6 },
  { id: 'aug', label: 'übermässig', third: 4, fifth: 8 },
];
const SEVENTH_CHORDS = [
  { id: 'dominant7', label: 'Dominantseptakkord (7)', third: 4, fifth: 7, seventh: 10 },
  { id: 'maj7', label: 'Dur mit grosser Septime (maj7)', third: 4, fifth: 7, seventh: 11 },
  { id: 'min7', label: 'Mollseptakkord (m7)', third: 3, fifth: 7, seventh: 10 },
  { id: 'halfDim7', label: 'Halbverminderter Septakkord (m7♭5)', third: 3, fifth: 6, seventh: 10 },
  { id: 'dim7', label: 'Verminderter Septakkord (dim7)', third: 3, fifth: 6, seventh: 9 },
];
const INVERSIONS = ['Grundstellung', '1. Umkehrung', '2. Umkehrung', '3. Umkehrung'];
const POSITIONS = ['Oktavlage', 'Terzlage', 'Quintlage', 'Septimlage'];
const POSITION_TONES = ['Grundton', 'Terz', 'Quinte', 'Septime'];
const TRIAD_INVERSIONS = ['', 'Sextakkord', 'Quartsextakkord'];
const SEVENTH_INVERSIONS = ['', 'Quintsextakkord', 'Terzquartakkord', 'Sekundakkord'];
// Durations are in sixteenth notes. A negative value is a rest.
const RHYTHM_LEVELS = [
  { name: 'Grundpuls', meter: '4/4', pulse: 4, patterns: [
    [4,4,8], [8,4,4], [4,2,2,4,4], [2,2,4,4,4], [4,4,4,2,2], [4,4,2,2,4],
  ] },
  { name: 'Pausen & Punktierungen', meter: '4/4', pulse: 4, patterns: [
    [6,2,-4,4], [-4,4,6,2], [4,-4,6,2], [6,2,4,-4], [4,4,-4,2,2], [2,2,-4,6,2],
  ] },
  { name: 'Synkopen & Sechzehntel', meter: '4/4', pulse: 4, patterns: [
    [2,4,2,1,1,2,4], [1,1,2,4,2,4,2], [4,2,4,2,1,1,2],
    [2,4,2,4,2,1,1], [1,1,1,1,2,4,2,4], [4,1,1,1,1,2,4,2],
  ] },
  { name: '6/8-Takt', meter: '6/8', pulse: 6, patterns: [
    [6,2,2,2], [2,2,2,6], [4,2,4,2], [2,4,2,4], [6,4,2], [2,4,6],
  ] },
];
const RHYTHM_VALUES = {
  '-4': 'Viertelpause', 1: 'Sechzehntel', 2: 'Achtel',
  4: 'Viertel', 6: 'punktierter Viertel', 8: 'Halbe',
};
const $=s=>document.getElementById(s);
const st={level:0,mode:'listen',type:'audio',dir:'up',round:0,total:10,correct:0,streak:0,answered:false,ctx:null,stream:null,source:null,analyser:null,raf:0,stage:0,stable:0,last:-1};
st.track = 'pitch';
st.rhythmLevel = 0;
st.rhythmType = 'audio';
st.melodyType = 'sing';
const MELODY_NOTES = [0,1,2,3,4,5,6,7].map(i => ({l:LETTERS[i % 7], o:i === 7 ? 5 : 4, a:0}));
const MELODIES = [
  [0,1,2,1,0], [0,2,4,3,2], [0,1,3,2,0], [1,2,4,3,1],
  [2,3,4,2,0], [2,4,5,4,2], [4,3,2,4,0], [4,5,7,6,4],
];
const DUETS = [
  [[2,3,4,3,2], [0,1,0,1,0]],
  [[4,5,4,3,2], [0,3,2,1,0]],
  [[7,6,5,6,7], [4,2,3,4,2]],
  [[4,3,2,3,4], [2,1,0,1,0]],
  [[2,4,5,3,2], [0,2,3,1,0]],
  [[5,4,3,4,3], [3,2,1,0,1]],
];
const stats=(()=>{try{return JSON.parse(localStorage.getItem('miniMozartStats')||'{"best":0,"total":0}')}catch{return {best:0,total:0}}})();
function save(){localStorage.setItem('miniMozartStats',JSON.stringify(stats))}
function midi(n){return (n.o+1)*12+NAT[n.l]+n.a}
function choose(a){return a[Math.floor(Math.random()*a.length)]}
function makeNote(root,it,sign){let index=LETTERS.indexOf(root.l)+sign*(it.degree-1),l=LETTERS[(index%7+7)%7],o=root.o+Math.floor(index/7),m=midi(root)+sign*it.semitones;return {l,o,a:m-((o+1)*12+NAT[l])}}
function noteName(n){return (n.l==='B'?(n.a===-1?'B':'H'):n.l)+(n.a===1?'♯':n.a===-1?'♭':n.a===2?'𝄪':n.a===-2?'𝄫':'')+n.o}
function isVoicingLevel() {
  return st.level === 4 || st.level === 6;
}

function makeChord() {
  const voicing = isVoicingLevel();
  const seventh = st.level >= 5;
  // The diminished seventh chord is symmetric and its inversion is ambiguous by ear.
  const qualities = seventh
    ? (voicing ? SEVENTH_CHORDS.filter(chord => chord.id !== 'dim7') : SEVENTH_CHORDS)
    : (voicing ? TRIADS.slice(0, 2) : TRIADS);
  const quality = choose(qualities);
  const semitones = [0, quality.third, quality.fifth];
  if (quality.seventh !== undefined) semitones.push(quality.seventh);
  const tones = semitones.map((semitones, index) => ({
    degree: 2 * index + 1, semitones,
  }));
  const degrees = tones.map((_, index) => index);
  const inversion = voicing ? choose(degrees) : 0;
  const position = voicing ? choose(degrees) : degrees.length - 1;
  const upper = voicing
    ? degrees.map(index => (position + 1 + index) % degrees.length)
    : degrees.slice(1);
  const candidates = [3, 4, 5].flatMap(o => LETTERS.map(l => {
    const root = { l, o, a: 0 };
    const notes = [makeNote(root, tones[inversion], 1)];
    // Cycle the upper voices so the requested chord tone is on top.
    for (const index of upper) {
      const note = makeNote(root, tones[index], 1);
      while (midi(note) <= midi(notes[notes.length - 1])) note.o++;
      notes.push(note);
    }
    return notes;
  })).filter(notes => notes.every(note => Math.abs(note.a) <= 1 && midi(note) >= 55 && midi(note) <= 84));
  return { quality, inversion, position, notes: choose(candidates) };
}

function showChordQuestion() {
  const voicing = isVoicingLevel();
  const seventh = st.level >= 5;
  const chordName = seventh ? 'Vierklang' : 'Dreiklang';
  const qualities = seventh ? SEVENTH_CHORDS : TRIADS;
  if (voicing) {
    const names = seventh ? SEVENTH_INVERSIONS : TRIAD_INVERSIONS;
    $('chordInversion').replaceChildren(new Option('Bitte wählen', ''),
      ...names.map((name, index) => new Option(name ? INVERSIONS[index] + ' (' + name + ')' : INVERSIONS[index], index)));
    $('chordPosition').replaceChildren(new Option('Bitte wählen', ''),
      ...POSITIONS.slice(0, names.length).map((name, index) => new Option(name + ' (' + POSITION_TONES[index] + ' oben)', index)));
  } else {
    $('chordQuality').replaceChildren(new Option('Bitte wählen', ''),
      ...qualities.map(quality => new Option(quality.label, quality.id)));
  }
  $('chordQualityLabel').textContent = seventh ? 'VIERKLANGTYP' : 'DREIKLANGTYP';
  $('playChordLabel').textContent = chordName + ' abspielen';
  $('chordQualityRow').hidden = voicing;
  $('voicingAnswers').hidden = !voicing;
  for (const id of ['chordQuality', 'chordInversion', 'chordPosition']) {
    $(id).value = '';
    $(id).disabled = false;
  }
  $('checkChord').disabled = false;
  $('promptEyebrow').textContent = st.type === 'audio' ? 'GEHÖRTRAINING' : 'NOTENLESEN';
  $('promptTitle').textContent = voicing ? 'Welche Umkehrung und Lage hat der ' + chordName + '?' :
    'Welchen ' + chordName + (st.type === 'audio' ? ' hörst du?' : ' siehst du?');
  $('promptDescription').textContent = voicing
    ? 'Der tiefste Ton bestimmt die Umkehrung, der höchste die Lage. Ein Akkordton ist verdoppelt.'
    : 'Bestimme den Akkordtyp in Grundstellung.';
  if (st.type === 'audio') hideScore();
  else showScore();
}

function rhythmNotation(pattern, meter) {
  const width = 85 + pattern.length * 29;
  const label = meter + '-Takt: ' + pattern.map(value => RHYTHM_VALUES[value]).join(', ');
  const notes = pattern.map((value, index) => {
    const x = 55 + index * 29;
    if (value < 0) {
      return '<path transform="translate(' + x + ' 0)" d="M-3 13 L5 25 L0 32 L6 39 C-2 35 -6 43 1 47" fill="none" stroke="currentColor" stroke-width="2.7" stroke-linecap="round"/>';
    }
    const flags = value < 4 ? '<path d="M6 12 Q15 17 13 26" fill="none" stroke="currentColor" stroke-width="2"/>' : '';
    const secondFlag = value === 1 ? '<path d="M6 19 Q15 24 13 33" fill="none" stroke="currentColor" stroke-width="2"/>' : '';
    const dot = value === 6 ? '<circle cx="12" cy="34" r="2" fill="currentColor"/>' : '';
    const head = '<ellipse cy="38" rx="7" ry="4.8" transform="rotate(-16 0 38)" fill="' +
      (value === 8 ? 'none' : 'currentColor') + '" stroke="currentColor" stroke-width="2"/>';
    return '<g transform="translate(' + x + ' 0)">' + head +
      '<path d="M6 37 V11" stroke="currentColor" stroke-width="2"/>' + flags + secondFlag + dot + '</g>';
  }).join('');
  return '<svg viewBox="0 0 ' + width + ' 57" role="img" aria-label="' + label + '">' +
    '<path d="M4 38 H' + (width - 8) + ' v-15" fill="none" stroke="currentColor" opacity=".45"/>' +
    '<text x="8" y="28" fill="currentColor" font-size="15">' + meter + '</text>' + notes + '</svg>';
}

function showRhythmQuestion() {
  const level = RHYTHM_LEVELS[st.rhythmLevel];
  const previous = st.rhythm?.target;
  const target = choose(level.patterns.filter(pattern => pattern !== previous));
  const alternatives = level.patterns.filter(pattern => pattern !== target);
  const first = choose(alternatives);
  const choices = [first, choose(alternatives.filter(pattern => pattern !== first))];
  choices.splice(Math.floor(Math.random() * 3), 0, target);
  st.rhythm = { target, level, answer: choices.indexOf(target) };
  const listening = st.rhythmType === 'audio';
  const tapping = st.rhythmType === 'tap';
  $('playRhythm').disabled = false;
  $('playRhythm').hidden = !listening && !tapping;
  $('rhythmScore').hidden = listening;
  $('rhythmScore').innerHTML = listening ? '' : rhythmNotation(target, level.meter);
  $('rhythmChoices').hidden = tapping;
  $('rhythmTapArea').hidden = !tapping;
  $('promptEyebrow').textContent = 'RHYTHMUS · ' + level.meter + '-TAKT';
  $('promptTitle').textContent = tapping ? 'Kannst du den Rhythmus klopfen?'
    : listening ? 'Welchen Rhythmus hörst du?' : 'Welcher Klang passt zum Notenbild?';
  $('promptDescription').textContent = listening
    ? 'Höre den Takt an und wähle das passende Notenbild.'
    : tapping ? 'Klopfe einmal pro Note. Bei einer Pause wartest du bis zur nächsten Note.'
      : 'Höre die drei Beispiele an und wähle das passende aus.';
  if (tapping) {
    $('startRhythmTap').disabled = false;
    $('rhythmPad').disabled = true;
    $('rhythmTapStatus').textContent = 'Warte beim Einzählen einen Takt. Klopfe ab dem nächsten betonten Klick.';
    return;
  }
  $('rhythmChoices').replaceChildren(...choices.map((pattern, index) => {
    const row = document.createElement('div');
    row.className = 'rhythm-choice';
    const letter = 'ABC'[index];
    if (!listening) {
      const play = document.createElement('button');
      play.type = 'button';
      play.className = 'secondarybtn';
      play.textContent = '▶ ' + letter + ' anhören';
      play.onclick = () => playRhythm(pattern);
      row.append(play);
    }
    const answer = document.createElement('button');
    answer.type = 'button';
    answer.className = 'levelbtn rhythm-answer';
    answer.innerHTML = listening ? '<strong>' + letter + '</strong>' + rhythmNotation(pattern, level.meter)
      : '<strong>' + letter + ' auswählen</strong>';
    answer.onclick = () => finish(index === st.rhythm.answer);
    row.append(answer);
    return row;
  }));
}

function playRhythm(pattern = []) {
  stopRhythm();
  const { level } = st.rhythm;
  const ctx = audio();
  const bus = ctx.createGain();
  bus.connect(ctx.destination);
  st.rhythmBus = bus;
  const unit = .66 / level.pulse;
  const length = level.meter === '6/8' ? 12 : 16;
  const start = ctx.currentTime + .05;
  function hit(at, frequency, volume, duration, type) {
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(volume, at);
    gain.gain.exponentialRampToValueAtTime(.001, at + duration);
    oscillator.connect(gain);
    gain.connect(bus);
    oscillator.start(at);
    oscillator.stop(at + duration);
  }
  for (let step = 0; step < length * 2; step += level.pulse) {
    hit(start + step * unit, step % length === 0 ? 820 : 610, step < length ? .10 : .035, .045, 'sine');
  }
  let step = length;
  for (const value of pattern) {
    if (value > 0) hit(start + step * unit, 320, .21, value * unit * .85, 'triangle');
    step += Math.abs(value);
  }
  return { start: start + length * unit, end: start + 2 * length * unit, unit };
}

function stopRhythm() {
  if (st.rhythmBus) st.rhythmBus.disconnect();
  st.rhythmBus = null;
  if (st.tap) {
    clearTimeout(st.tap.begin);
    clearTimeout(st.tap.finish);
    st.tap = null;
    $('rhythmPad').disabled = true;
  }
}

function expectedTaps(pattern, unit) {
  const times = [];
  let position = 0;
  for (const value of pattern) {
    if (value > 0) times.push(position * unit);
    position += Math.abs(value);
  }
  return times;
}

async function startRhythmTap() {
  const question = st.rhythm;
  $('startRhythmTap').disabled = true;
  $('playRhythm').disabled = true;
  const ctx = audio();
  if (ctx.state === 'suspended') await ctx.resume();
  if (st.track !== 'rhythm' || st.rhythm !== question || st.answered) return;
  const timing = playRhythm();
  const tap = { ...timing, times: [], tolerance: Math.min(.13, timing.unit * .65) };
  st.tap = tap;
  $('rhythmPad').disabled = false;
  $('rhythmPad').focus();
  $('rhythmTapStatus').textContent = 'Einzählen …';
  tap.begin = setTimeout(() => {
    $('rhythmTapStatus').textContent = 'Jetzt klopfen.';
  }, (tap.start - ctx.currentTime) * 1000);
  tap.finish = setTimeout(() => {
    const expected = expectedTaps(question.target, tap.unit);
    const sameCount = tap.times.length === expected.length;
    const correct = sameCount && expected.every((time, index) => Math.abs(tap.times[index] - time) <= tap.tolerance);
    const detail = sameCount
      ? (correct ? 'Alle Schläge waren im Takt.' : 'Mindestens ein Schlag war zu früh oder zu spät.')
      : 'Geklopft: ' + tap.times.length + '. Erwartet: ' + expected.length + '.';
    $('rhythmTapStatus').textContent = '';
    finish(correct, detail);
  }, (tap.end - ctx.currentTime + .04) * 1000);
}

function recordRhythmTap() {
  if (!st.tap) return;
  const time = st.ctx.currentTime;
  if (time >= st.tap.start - st.tap.tolerance && time < st.tap.end) {
    st.tap.times.push(time - st.tap.start);
    $('rhythmTapStatus').textContent = 'Schläge erfasst: ' + st.tap.times.length;
  }
}

function melodyNote(value, bass = false) {
  const note = MELODY_NOTES[value];
  return bass ? { ...note, o: note.o - 1 } : note;
}

function melodyNotation(notes, { current = -1, marks = [], bass = false } = {}) {
  const lines = [52,72,92,112,132].map(line =>
    '<path d="M35 ' + line + ' H530" stroke="#b3a089"/>').join('');
  const clef = bass ? '<text x="45" y="107" font-family="serif" font-size="76" fill="#efd4a1">𝄢</text>'
    : '<text x="45" y="129" font-family="serif" font-size="86" fill="#efd4a1">𝄞</text>';
  return lines + clef +
    '<path d="M530 52 V132" stroke="#b3a089"/>' + notes.map((value, index) => {
      const x = 155 + 80 * index;
      const color = marks[index] === true ? '#8cdbb1' : marks[index] === false ? '#f1a394' : '#faf0dc';
      const highlight = index === current
        ? '<rect x="' + (x-30) + '" y="36" width="60" height="126" rx="8" fill="#e5ba7833"/>' : '';
      if (value === null) return highlight + '<circle cx="' + x + '" cy="92" r="6" fill="none" stroke="#b3a089" stroke-dasharray="3 2"/>';
      const yy = y(melodyNote(value, bass)) - (bass ? 120 : 0);
      const ledger = yy >= 152 ? '<path d="M' + (x-16) + ' 152 h32" stroke="#c9b397"/>' : '';
      return highlight + ledger + '<g fill="' + color + '" stroke="' + color + '">' +
        '<ellipse cx="' + x + '" cy="' + yy + '" rx="10" ry="6" transform="rotate(-18 ' + x + ' ' + yy + ')"/>' +
        '<path d="M' + (x+9) + ' ' + yy + ' v-42" stroke-width="2"/></g>';
    }).join('');
}

function renderMelody() {
  const melody = st.melody;
  const singing = st.melodyType !== 'dictation';
  const notes = singing ? melody.target : melody.answer;
  const marks = singing
    ? notes.map((_, index) => index < melody.step ? true : undefined)
    : st.answered ? notes.map((note, index) => note === melody.target[index]) : [];
  const options = { current: st.answered ? -1 : melody.step, marks };
  const staves = melody.voices || [notes];
  staves.forEach((line, index) => {
    const staff = $(index === 0 ? 'melodyStaff' : 'duetLowerStaff');
    const bass = index === 1;
    const active = !melody.voices || index === melody.voice;
    staff.innerHTML = melodyNotation(line, { ...(active ? options : {}), bass });
    staff.setAttribute('aria-label', (bass ? 'Unterstimme im Bassschlüssel' : melody.voices ? 'Oberstimme im Violinschlüssel' : 'Violinschlüssel') + ': ' +
      line.map(note => note === null ? 'leer' : noteName(melodyNote(note, bass))).join(', '));
  });
}

function showMelodyQuestion() {
  const duet = st.melodyType === 'duet';
  const singing = st.melodyType !== 'dictation';
  const voices = duet ? choose(DUETS.filter(pair => pair !== st.melody?.voices)) : null;
  const voice = Number($('duetVoice').value);
  const target = voices ? voices[voice] : choose(MELODIES.filter(melody => melody !== st.melody?.target));
  st.melody = { target, voices, voice, answer: [target[0], null, null, null, null], step: singing ? 0 : 1 };
  $('promptEyebrow').textContent = duet ? 'ZWEISTIMMIGER SATZ' : singing ? 'BLATTSINGEN' : 'NOTENDIKTAT';
  $('promptTitle').textContent = duet ? 'Kannst du deine Stimme singen?' : singing ? 'Kannst du diese Melodie singen?' : 'Welche Töne hörst du?';
  $('promptDescription').textContent = duet
    ? 'Höre beide Stimmen zusammen oder einzeln. Wähle dann deine Stimme und singe sie in deinem Tempo.'
    : singing
    ? 'Höre bei Bedarf den Startton. Singe dann die fünf Noten nacheinander in deinem Tempo.'
    : 'Höre die Melodie und ergänze die vier fehlenden Noten. Der erste Ton ist vorgegeben.';
  $('melodyScoreTitle').textContent = duet ? 'OBERSTIMME' : singing ? 'DEINE MELODIE' : 'DEIN NOTENDIKTAT';
  for (const id of ['duetSettings', 'duetLower', 'duetPlayback']) $(id).hidden = !duet;
  $('duetVoice').disabled = false;
  $('melodyStatus').textContent = singing ? 'Die hervorgehobene Note ist als Nächstes dran.' :
    'Tippe ins Notensystem oder wähle die Tonhöhen unter den Noten.';
  $('melodySolution').hidden = true;
  $('melodyInputs').hidden = singing;
  $('melodyListen').hidden = singing;
  $('melodyMic').hidden = !singing;
  $('melodyMic').disabled = false;
  $('melodyCheck').hidden = singing;
  $('melodyCheck').disabled = false;
  $('melodyStaff').classList.toggle('editable', !singing);
  $('melodyInputs').replaceChildren(...target.slice(1).map((_, offset) => {
    const index = offset + 1;
    const label = document.createElement('label');
    label.textContent = 'Ton ' + (index + 1);
    const select = document.createElement('select');
    select.replaceChildren(new Option('Wählen', ''),
      ...MELODY_NOTES.map((note, value) => new Option(noteName(note), value)));
    select.onfocus = () => { st.melody.step = index; renderMelody(); };
    select.onchange = () => {
      st.melody.answer[index] = select.value === '' ? null : Number(select.value);
      renderMelody();
    };
    label.append(select);
    return label;
  }));
  renderMelody();
}

function placeMelodyNote(event) {
  if (st.melodyType !== 'dictation' || st.answered) return;
  const staff = $('melodyStaff');
  const transform = staff.getScreenCTM();
  if (!transform) return;
  const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(transform.inverse());
  const index = Math.round((point.x - 155) / 80);
  if (index < 1 || index >= st.melody.answer.length || point.y < 68 || point.y > 166) return;
  const value = Math.min(7, Math.max(0, Math.round((152 - point.y) / 10)));
  st.melody.answer[index] = value;
  st.melody.step = index;
  $('melodyInputs').querySelectorAll('select')[index - 1].value = String(value);
  renderMelody();
}

function finishMelody() {
  const { target, step, answer } = st.melody;
  $('melodyMic').disabled = true;
  $('melodyCheck').disabled = true;
  $('melodyStatus').textContent = '';
  renderMelody();
  if (st.melodyType !== 'dictation') {
    $('duetVoice').disabled = true;
    return step + ' von ' + target.length + ' Tönen erkannt';
  }
  $('melodyInputs').querySelectorAll('select').forEach(select => { select.disabled = true; });
  $('melodySolutionStaff').innerHTML = melodyNotation(target);
  $('melodySolutionStaff').setAttribute('aria-label', 'Lösung: ' + target.map(note => noteName(MELODY_NOTES[note])).join(', '));
  $('melodySolution').hidden = false;
  return answer.slice(1).filter((note, index) => note === target[index + 1]).length + ' von 4 eingetragenen Tönen richtig';
}

function checkMelody() {
  const { answer, target } = st.melody;
  const missing = answer.indexOf(null);
  if (missing !== -1) return $('melodyInputs').querySelectorAll('select')[missing - 1].focus();
  finish(answer.every((note, index) => note === target[index]));
}

function singMelodyLoop() {
  const melody = st.melody;
  const buffer = new Float32Array(st.analyser.fftSize);
  st.analyser.getFloatTimeDomainData(buffer);
  const detected = pitch(buffer, st.ctx.sampleRate, true);
  const bass = melody.voices && melody.voice === 1;
  const target = midi(melodyNote(melody.target[melody.step], bass));
  const alternateOctave = bass ? 12 : -12;
  const nearAlternate = detected !== null && Math.abs(detected - target - alternateOctave) <= .55;
  const octave = melody.octave ?? (nearAlternate ? alternateOctave : 0);
  const difference = detected === null ? null : detected - target - octave;
  if (difference !== null && Math.abs(difference) <= .55) {
    melody.stableSince ??= performance.now();
    if (performance.now() - melody.stableSince >= 260) {
      melody.octave = octave;
      melody.step++;
      melody.stableSince = null;
      if (melody.step === melody.target.length) return finish(true);
      renderMelody();
      $('melodyStatus').textContent = 'Ton ' + melody.step + ' erkannt. Singe die nächste Note.';
    }
  } else {
    melody.stableSince = null;
  }
  st.raf = requestAnimationFrame(singMelodyLoop);
}

async function startMelodyMic() {
  stopDuetAudio();
  if (st.stream) {
    stopMic();
    $('melodyStatus').textContent = 'Mikrofon pausiert. Du kannst bei der markierten Note fortfahren.';
    return;
  }
  const question = st.melody;
  const button = $('melodyMic');
  button.disabled = true;
  let stream;
  try {
    const ctx = audio();
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    if (st.track !== 'melody' || st.melody !== question || st.answered) {
      stream.getTracks().forEach(track => track.stop());
      return;
    }
    st.stream = stream;
    st.source = ctx.createMediaStreamSource(stream);
    st.analyser = ctx.createAnalyser();
    st.analyser.fftSize = 4096;
    st.source.connect(st.analyser);
    question.stableSince = null;
    button.textContent = 'Mikrofon stoppen';
    $('melodyStatus').textContent = 'Singe die markierte Note und halte sie kurz.';
    singMelodyLoop();
  } catch {
    if (st.melody === question && st.track === 'melody' && !st.answered) {
      stopMic();
      $('melodyStatus').textContent = 'Kein Mikrofonzugriff. Prüfe die Berechtigung im Browser.';
    }
  } finally {
    if (st.melody === question && st.track === 'melody' && !st.answered) button.disabled = false;
  }
}

function newQuestion(){
stopMic();stopRhythm();stopDuetAudio();st.round++;if(st.round>st.total){result();return}
const rhythm = st.track === 'rhythm';
const pitchTrack = st.track === 'pitch';
st.chord = pitchTrack && st.level >= 3 ? makeChord() : null;
if (pitchTrack && !st.chord) {
let pool=INTERVALS.filter(x=>x.tier<=st.level);let next=choose(pool);if(st.it&&pool.length>1){for(let k=0;k<10&&next===st.it;k++)next=choose(pool)}
st.it=next;let sign=st.dir==='mixed'?(Math.random()<.5?1:-1):st.dir==='down'?-1:1;
let candidates=['C','D','E','F','G','A','B'].map(l=>({l,o:sign===1?4:5,a:0})).filter(n=>{let p=makeNote(n,next,sign);return Math.abs(p.a)<=1&&midi(p)>=55&&midi(p)<=84});
st.a=choose(candidates.length?candidates:[{l:'C',o:sign===1?4:5,a:0}]);st.b=makeNote(st.a,next,sign);
}
st.answered=false;st.stage=0;st.last=-1;st.stable=0;
$('listenArea').hidden=!pitchTrack||Boolean(st.chord)||st.mode!=='listen';$('singArea').hidden=!pitchTrack||st.mode!=='sing';$('chordArea').hidden=!st.chord;$('feedback').hidden=true;
$('notationCard').hidden = !pitchTrack;
$('rhythmArea').hidden = !rhythm;
$('melodyArea').hidden = pitchTrack || rhythm;
const levelName = (pitchTrack ? LEVELS[st.level] : rhythm ? RHYTHM_LEVELS[st.rhythmLevel].name : 'Melodie').toUpperCase();
$('roundTag').textContent=levelName+' · '+(pitchTrack ? (st.mode==='listen'?'ERKENNEN':'SINGEN') : rhythm ? 'RHYTHMUS' : $('melodyType').selectedOptions[0].textContent.toUpperCase());
$('roundCounter').textContent='AUFGABE '+String(st.round).padStart(2,'0')+' / '+st.total;
$('progressFill').style.width=(100*(st.round-1)/st.total)+'%';
$('levelLabel').textContent=levelName;
$('answerInput').value='';$('answerInput').disabled=false;$('checkButton').disabled=false;$('nextButton').disabled=true;$('revealButton').disabled=false;
$('nextButton').textContent=st.round===st.total?'Ergebnis anzeigen →':'Nächste Aufgabe →';
$('correctScore').textContent=st.correct;$('streakScore').textContent=st.streak;
if(rhythm){
showRhythmQuestion();
}else if(!pitchTrack){
showMelodyQuestion();
}else if(st.chord){
showChordQuestion();
}else if(st.mode==='sing'){
$('promptEyebrow').textContent='GESANGSTRAINING';$('promptTitle').textContent='Kannst du das Intervall singen?';$('promptDescription').textContent='Singe zuerst den Startton und danach den Zielton.';showScore();
$('targetNote').textContent=noteName(st.a);$('detectedNote').textContent='–';$('centsLabel').textContent='–';$('micStatus').textContent='Bereit zum Singen';
$('singStepOne').className='step active';$('singStepTwo').className='step';
}else if(st.type==='audio'){
$('promptEyebrow').textContent='GEHÖRTRAINING';$('promptTitle').textContent='Welches Intervall hörst du?';$('promptDescription').textContent='Spiele die beiden Töne ab und gib das Intervall ein.';hideScore();
}else{
$('promptEyebrow').textContent='NOTENLESEN';$('promptTitle').textContent='Welches Intervall siehst du?';$('promptDescription').textContent='Lies die Noten und benenne das Intervall.';showScore()
}
}
function normalize(s){return s.toLowerCase().trim().replace(/ß/g,'ss').replace(/ä/g,'a').replace(/ö/g,'o').replace(/ü/g,'u').replace(/[^a-z0-9]/g,'')}
function matches(input,i){
let qual=i.id[0]==='m'?'kleine':i.id[0]==='M'?'grosse':['P','p'].includes(i.id[0])?'reine':i.id[0]==='A'?'übermässige':'verminderte';
let ordinal=['','Prime','Sekunde','Terz','Quarte','Quinte','Sexte','Septime'][i.degree];
let labels=[i.label,i.short,i.id,qual+' '+ordinal,qual.slice(0,-1)+' '+ordinal];
if(i.id==='p1')labels.push('Prime','Unisono');
if(i.id==='P4')labels.push('Quarte');
if(i.id==='P5')labels.push('Quinte');
if(i.id==='A4'||i.id==='d5')labels.push('Tritonus');
return labels.some(s=>normalize(s)===normalize(input));
}
function finish(ok,extra=''){
if(st.answered)return;st.answered=true;stopMic();
if(ok){st.correct++;st.streak++;stats.total++;stats.best=Math.max(stats.best,st.streak);save()}else st.streak=0;
$('correctScore').textContent=st.correct;$('streakScore').textContent=st.streak;updateStats();
let solution;
if (st.track === 'rhythm') {
  stopRhythm();
  const { answer, target, level } = st.rhythm;
  $('rhythmScore').innerHTML = rhythmNotation(target, level.meter);
  $('rhythmScore').hidden = false;
  $('rhythmChoices').querySelectorAll('.rhythm-answer').forEach((button, index) => {
    button.disabled = true;
    if (index === answer) button.classList.add('active');
  });
  if (st.rhythmType === 'tap') {
    $('startRhythmTap').disabled = true;
    $('playRhythm').disabled = false;
    $('rhythmTapStatus').textContent = '';
    solution = 'Rhythmus im Notenbild';
  } else {
    solution = 'Rhythmus ' + 'ABC'[answer];
  }
} else if (st.track === 'melody') {
  solution = finishMelody();
} else if (st.chord) {
  const { quality, inversion, position } = st.chord;
  solution = isVoicingLevel()
    ? INVERSIONS[inversion] + ' · ' + POSITIONS[position] + ' (' + quality.label + ')'
    : quality.label;
  for (const id of ['chordQuality', 'chordInversion', 'chordPosition', 'checkChord']) $(id).disabled = true;
} else {
  solution = st.it.label + ' (' + st.it.short + ')';
}
if (st.track === 'pitch') showScore();
const f=$('feedback');f.hidden=false;f.className='feedback '+(ok?'good':'bad');
const feedbackPrefix = ok ? '✓ Richtig! ' : st.track === 'melody' ? '' : 'Lösung: ';
f.textContent=feedbackPrefix+solution+'. '+extra;
$('nextButton').disabled=false;$('checkButton').disabled=true;$('revealButton').disabled=true;
}
function check(){let v=$('answerInput').value;if(!v.trim())return $('answerInput').focus();
let correct=matches(v,st.it),enh=false;if(!correct&&st.mode==='listen'&&st.type==='audio'&&INTERVALS.some(x=>x.semitones===st.it.semitones&&matches(v,x))){correct=true;enh=true}
finish(correct,enh?'Klanglich enharmonisch gleich.':'')
}
function checkChord() {
  const { quality, inversion, position } = st.chord;
  const answers = isVoicingLevel()
    ? [['chordInversion', String(inversion)], ['chordPosition', String(position)]]
    : [['chordQuality', quality.id]];
  const missing = answers.find(([id]) => !$(id).value);
  if (missing) return $(missing[0]).focus();
  finish(answers.every(([id, value]) => $(id).value === value));
}
function result(){
stopMic();$('roundCounter').textContent='TRAINING ABGESCHLOSSEN';$('progressFill').style.width='100%';$('promptEyebrow').textContent='DEIN ERGEBNIS';$('promptTitle').textContent=st.correct+' von '+st.total+' richtig';$('promptDescription').textContent=Math.round(st.correct/st.total*100)+'% Trefferquote. Starte eine neue Runde.';
$('listenArea').hidden=true;$('singArea').hidden=true;$('chordArea').hidden=true;$('rhythmArea').hidden=true;$('melodyArea').hidden=true;$('feedback').hidden=true;$('revealButton').disabled=true;$('nextButton').disabled=false;$('nextButton').textContent='Noch einmal spielen ↻';hideScore();
}
function y(n){return 132-((n.o*7+LETTERS.indexOf(n.l))-(4*7+2))*10}
function score(){
let s='<g stroke="#b3a089" stroke-width="1.5">'+[52,72,92,112,132].map(v=>'<line x1="55" y1="'+v+'" x2="510" y2="'+v+'"/>').join('')+'</g><text x="76" y="129" font-family="serif" font-size="92" fill="#efd4a1">𝄞</text>';
const notes = st.chord
  ? st.chord.notes.map((note, index) => [note, 205 + index * (st.chord.notes.length === 5 ? 70 : 90)])
  : [[st.a,240],[st.b,393]];
for(let [n,x] of notes){
let yy=y(n);
for(let ly=152;ly<=yy;ly+=20)s+='<line x1="'+(x-22)+'" y1="'+ly+'" x2="'+(x+22)+'" y2="'+ly+'" stroke="#c9b397"/>';
for(let ly=32;ly>=yy;ly-=20)s+='<line x1="'+(x-22)+'" y1="'+ly+'" x2="'+(x+22)+'" y2="'+ly+'" stroke="#c9b397"/>';
if(n.a)s+='<text x="'+(x-40)+'" y="'+(yy+10)+'" font-size="33" fill="#efd4a1">'+(n.a===1?'♯':n.a===-1?'♭':n.a===2?'𝄪':'𝄫')+'</text>';
s+='<ellipse cx="'+x+'" cy="'+yy+'" rx="13" ry="9" transform="rotate(-18 '+x+' '+yy+')" fill="#faf0dc"/><line x1="'+(x+12)+'" y1="'+yy+'" x2="'+(x+12)+'" y2="'+(yy-55)+'" stroke="#faf0dc" stroke-width="2.4"/>';
}
return s
}
function showScore(){
  $('staff').setAttribute('viewBox', st.chord ? '0 -70 560 280' : '0 0 560 190');
  $('staff').setAttribute('aria-label', st.chord ? 'Akkordtöne im Violinschlüssel, von unten nach oben' : 'Zwei Noten im Violinschlüssel');
  $('staff').innerHTML=score();$('scoreWrap').classList.remove('is-hidden');$('scorePlaceholder').style.display='none';
  $('noteLegend').textContent = st.chord ? st.chord.notes.map(noteName).join(' – ') : noteName(st.a)+' → '+noteName(st.b);
  $('notationHint').textContent = st.chord ? 'Von unten nach oben' : 'Violinschlüssel';
}
function hideScore(){$('scoreWrap').classList.add('is-hidden');$('scorePlaceholder').style.display='flex';$('scorePlaceholder').innerHTML='<span>𝄞</span><p>Entdecke die Noten nach der Lösung</p>';$('noteLegend').textContent='';$('notationHint').textContent='Nach deiner Antwort sichtbar'}
function audio(){if(!st.ctx)st.ctx=new (window.AudioContext||window.webkitAudioContext)();if(st.ctx.state==='suspended')st.ctx.resume();return st.ctx}
function tone(note,start,duration=.7,volume=.16,destination=null){
let ctx=audio(),osc=ctx.createOscillator(),gain=ctx.createGain();osc.type='triangle';osc.frequency.value=440*Math.pow(2,(note-69)/12);gain.gain.setValueAtTime(.0001,start);gain.gain.exponentialRampToValueAtTime(volume,start+.04);gain.gain.setTargetAtTime(.0001,start+duration-.12,.08);osc.connect(gain);gain.connect(destination || ctx.destination);osc.start(start);osc.stop(start+duration+.2)
}
function stopDuetAudio() {
  if (st.duetBus) st.duetBus.disconnect();
  st.duetBus = null;
}

function playDuet(indices) {
  stopMic();
  stopDuetAudio();
  const ctx = audio();
  st.duetBus = ctx.createGain();
  st.duetBus.connect(ctx.destination);
  const start = ctx.currentTime + .08;
  for (const voice of indices) {
    st.melody.voices[voice].forEach((value, index) => {
      tone(midi(melodyNote(value, voice === 1)), start + index * .62, .53, .16 / indices.length, st.duetBus);
    });
  }
  if (!st.answered) $('melodyStatus').textContent = 'Höre zu. Starte danach das Mikrofon für deine Stimme.';
}
function play(){let t=audio().currentTime+.08;tone(midi(st.a),t);tone(midi(st.b),t+.85,.8)}
function playChord() {
  const notes = st.chord.notes.map(midi);
  const start = audio().currentTime + .08;
  notes.forEach((note, index) => tone(note, start + index * .42, .36));
  notes.forEach(note => tone(note, start + notes.length * .42 + .12, 1, .16 / notes.length));
}
function pitch(buf,sampleRate,preferFundamental=false){
let mean=0,rms=0;for(let v of buf)mean+=v;mean/=buf.length;for(let v of buf)rms+=(v-mean)**2;rms=Math.sqrt(rms/buf.length);$('meterFill').style.width=Math.min(100,rms*700)+'%';if(rms<.012)return null;
const correlations = [];
let best=-1,lagBest=0;for(let lag=Math.floor(sampleRate/950);lag<=Math.min(sampleRate/115,buf.length*.65);lag++){let xy=0,xx=0,yy=0;for(let j=0;j<buf.length-lag;j+=2){let a=buf[j]-mean,b=buf[j+lag]-mean;xy+=a*b;xx+=a*a;yy+=b*b}let c=xy/Math.sqrt(xx*yy+1e-12);if(preferFundamental)correlations[lag]=c;if(c>best){best=c;lagBest=lag}}
if(preferFundamental) {
  const firstPeak = correlations.findIndex((value, lag) => value >= Math.max(.82, best - .06) && value >= correlations[lag-1] && value > correlations[lag+1]);
  if(firstPeak > 0) lagBest = firstPeak;
}
if(best<.82)return null;return 69+12*Math.log2(sampleRate/lagBest/440);
}
function loop(){
if(!st.analyser||st.answered||st.mode!=='sing')return;let buf=new Float32Array(st.analyser.fftSize);st.analyser.getFloatTimeDomainData(buf);let p=pitch(buf,st.ctx.sampleRate),target=st.stage===0?midi(st.a):midi(st.b);
if(p!==null){let note=Math.round(p),cent=Math.round((p-target)*100);$('detectedNote').textContent=['C','C♯','D','E♭','E','F','F♯','G','A♭','A','B','H'][(note%12+12)%12]+(Math.floor(note/12)-1);$('centsLabel').textContent=(cent>0?'+':'')+cent+' ct';
if(Math.abs(cent)<=50){$('micStatus').textContent='Ton halten …';let now=performance.now();if(st.last!==st.stage){st.stable=now;st.last=st.stage}if(now-st.stable>350){if(st.stage===0){st.stage=1;st.last=-1;$('singStepOne').className='step done';$('singStepTwo').className='step active';$('targetNote').textContent=noteName(st.b);$('micStatus').textContent='Jetzt Zielton singen'}else{return finish(true,'Beide Töne erkannt.')}}}else{st.last=-1;$('micStatus').textContent=cent>0?'Etwas tiefer singen':'Etwas höher singen'}
}else{$('detectedNote').textContent='–';$('centsLabel').textContent='–';$('micStatus').textContent='Singe einen klaren Ton';st.last=-1}
st.raf=requestAnimationFrame(loop)
}
async function microphone(){
if(st.stream){stopMic();return}
if(!navigator.mediaDevices?.getUserMedia){$('micStatus').textContent='Mikrofon benötigt HTTPS';return}
try{let stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:false,noiseSuppression:false,autoGainControl:false},video:false});if(st.track!=='pitch'||st.mode!=='sing'||st.answered){stream.getTracks().forEach(t=>t.stop());return}
st.stream=stream;st.source=audio().createMediaStreamSource(stream);st.analyser=audio().createAnalyser();st.analyser.fftSize=4096;st.source.connect(st.analyser);$('micButtonLabel').textContent='Mikrofon stoppen';$('micButton').classList.add('recording');$('micStatus').textContent='Singe den Startton';loop()
}catch(e){$('micStatus').textContent='Mikrofonzugriff nicht möglich';}
}
function stopMic(){if(st.raf)cancelAnimationFrame(st.raf);st.raf=0;if(st.source)st.source.disconnect();if(st.stream)st.stream.getTracks().forEach(t=>t.stop());st.source=null;st.stream=null;st.analyser=null;$('meterFill').style.width='0%';$('micButtonLabel').textContent='Mikrofon starten';$('micButton').classList.remove('recording');$('melodyMic').textContent='Mikrofon starten'}
function updateStats(){$('bestStreak').textContent=stats.best;$('allCorrect').textContent=stats.total}
function reset(){st.round=0;st.correct=0;st.streak=0;newQuestion()}
function setMode(mode) {
  st.mode = mode;
  for (const [id, active] of [['listenMode', mode === 'listen'], ['singMode', mode === 'sing']]) {
    $(id).classList.toggle('active', active);
    $(id).setAttribute('aria-pressed', active);
  }
  $('listenOptions').hidden = mode === 'sing';
}
document.querySelectorAll('[data-level]').forEach((button, level, buttons) => {
  button.onclick = () => {
    st.level = level;
    const chordLevel = level >= 3;
    $('singMode').disabled = chordLevel;
    $('direction').parentElement.hidden = chordLevel;
    if (chordLevel) setMode('listen');
    buttons.forEach(option => {
      option.classList.toggle('active', option === button);
      option.setAttribute('aria-pressed', option === button);
    });
    reset();
  };
});
$('listenMode').onclick=()=>{setMode('listen');reset()};
$('singMode').onclick=()=>{setMode('sing');reset()};
function setTrack(track) {
  if (st.track === track) return;
  st.track = track;
  const rhythm = track === 'rhythm';
  const pitchTrack = track === 'pitch';
  $('levelHeading').hidden = track === 'melody';
  $('pitchLevels').hidden = !pitchTrack;
  $('pitchModeSettings').hidden = !pitchTrack;
  $('rhythmLevels').hidden = !rhythm;
  $('rhythmSettings').hidden = !rhythm;
  $('melodySettings').hidden = track !== 'melody';
  for (const [id, active] of [['pitchTrack', pitchTrack], ['rhythmTrack', rhythm], ['melodyTrack', track === 'melody']]) {
    $(id).classList.toggle('active', active);
    $(id).setAttribute('aria-pressed', active);
  }
  reset();
}
$('pitchTrack').onclick = () => setTrack('pitch');
$('rhythmTrack').onclick = () => setTrack('rhythm');
$('melodyTrack').onclick = () => setTrack('melody');
$('melodyType').onchange = event => { st.melodyType = event.target.value; reset(); };
$('melodyStaff').onclick = placeMelodyNote;
$('melodyCheck').onclick = checkMelody;
$('melodyMic').onclick = startMelodyMic;
$('melodyReference').onclick = () => {
  stopMic();
  stopDuetAudio();
  const { target, voices, voice } = st.melody;
  tone(midi(melodyNote(target[0], voices && voice === 1)), audio().currentTime + .06, .62);
};
$('duetVoice').onchange = event => {
  stopMic();
  stopDuetAudio();
  const { voices } = st.melody;
  const voice = Number(event.target.value);
  st.melody = { voices, voice, target: voices[voice], step: 0 };
  $('melodyMic').disabled = false;
  $('melodyStatus').textContent = 'Die hervorgehobene Note ist als Nächstes dran.';
  renderMelody();
};
$('duetBoth').onclick = () => playDuet([0, 1]);
$('duetUpper').onclick = () => playDuet([0]);
$('duetBass').onclick = () => playDuet([1]);
$('melodyListen').onclick = () => {
  const start = audio().currentTime + .08;
  st.melody.target.forEach((value, index) => tone(midi(MELODY_NOTES[value]), start + index * .62, .5));
};
document.querySelectorAll('[data-rhythm-level]').forEach((button, index, buttons) => {
  button.onclick = () => {
    st.rhythmLevel = index;
    buttons.forEach(option => {
      option.classList.toggle('active', option === button);
      option.setAttribute('aria-pressed', option === button);
    });
    reset();
  };
});
$('rhythmType').onchange = event => { st.rhythmType = event.target.value; reset(); };
$('playRhythm').onclick = () => playRhythm(st.rhythm.target);
$('startRhythmTap').onclick = startRhythmTap;
$('rhythmPad').onclick = recordRhythmTap;
$('rhythmPad').onkeydown = event => {
  if (event.code !== 'Space') return;
  event.preventDefault();
  if (!event.repeat) recordRhythmTap();
};
$('playChord').onclick=playChord;
$('checkChord').onclick=checkChord;
$('questionType').onchange=e=>{st.type=e.target.value;reset()};
$('direction').onchange=e=>{st.dir=e.target.value;reset()};
$('playButton').onclick=play;$('referenceButton').onclick=()=>tone(midi(st.a),audio().currentTime+.08,.9);$('demoButton').onclick=play;
$('checkButton').onclick=check;$('answerInput').onkeydown=e=>{if(e.key==='Enter')check()};
$('revealButton').onclick=()=>finish(false);
$('nextButton').onclick=()=>st.round>st.total?reset():newQuestion();
$('micButton').onclick=microphone;
$('resetProgress').onclick=()=>{if(confirm('Fortschritt zurücksetzen?')){stats.best=0;stats.total=0;save();updateStats();reset()}};
$('helpButton').onclick=()=>$('helpDialog').showModal();
window.addEventListener('pagehide',stopMic);
window.addEventListener('pagehide',stopRhythm);
window.addEventListener('pagehide',stopDuetAudio);
updateStats();reset();
