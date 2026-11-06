
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
const LEVELS = ['Basic', 'Advanced', 'Profi', 'Dreiklänge', 'Umkehrungen & Lagen', 'Vierklänge'];
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
const INVERSIONS = ['Grundstellung', '1. Umkehrung', '2. Umkehrung'];
const POSITIONS = ['Oktavlage', 'Terzlage', 'Quintlage'];
const $=s=>document.getElementById(s);
const st={level:0,mode:'listen',type:'audio',dir:'up',round:0,total:10,correct:0,streak:0,answered:false,ctx:null,stream:null,source:null,analyser:null,raf:0,stage:0,stable:0,last:-1};
const stats=(()=>{try{return JSON.parse(localStorage.getItem('miniMozartStats')||'{"best":0,"total":0}')}catch{return {best:0,total:0}}})();
function save(){localStorage.setItem('miniMozartStats',JSON.stringify(stats))}
function midi(n){return (n.o+1)*12+NAT[n.l]+n.a}
function choose(a){return a[Math.floor(Math.random()*a.length)]}
function makeNote(root,it,sign){let index=LETTERS.indexOf(root.l)+sign*(it.degree-1),l=LETTERS[(index%7+7)%7],o=root.o+Math.floor(index/7),m=midi(root)+sign*it.semitones;return {l,o,a:m-((o+1)*12+NAT[l])}}
function noteName(n){return (n.l==='B'?(n.a===-1?'B':'H'):n.l)+(n.a===1?'♯':n.a===-1?'♭':n.a===2?'𝄪':n.a===-2?'𝄫':'')+n.o}
function makeChord() {
  const voicing = st.level === 4;
  const qualities = st.level === 5 ? SEVENTH_CHORDS : TRIADS;
  const quality = choose(voicing ? qualities.slice(0, 2) : qualities);
  const inversion = voicing ? choose([0, 1, 2]) : 0;
  const position = voicing ? choose([0, 1, 2]) : 2;
  const semitones = [0, quality.third, quality.fifth];
  if (quality.seventh !== undefined) semitones.push(quality.seventh);
  const tones = semitones.map((semitones, index) => ({
    degree: 2 * index + 1, semitones,
  }));
  const candidates = [3, 4, 5].flatMap(o => LETTERS.map(l => {
    const root = { l, o, a: 0 };
    const notes = [makeNote(root, tones[inversion], 1)];
    // Cycle the upper voices so the requested chord tone is on top.
    const upper = voicing ? [(position + 1) % 3, (position + 2) % 3, position] : tones.slice(1).map((_, index) => index + 1);
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
  const voicing = st.level === 4;
  const seventh = st.level === 5;
  const chordName = seventh ? 'Vierklang' : 'Dreiklang';
  const qualities = seventh ? SEVENTH_CHORDS : TRIADS;
  $('chordQuality').replaceChildren(new Option('Bitte wählen', ''),
    ...qualities.map(quality => new Option(quality.label, quality.id)));
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
  $('promptTitle').textContent = voicing ? 'Welche Umkehrung und Lage hat der Dreiklang?' :
    'Welchen ' + chordName + (st.type === 'audio' ? ' hörst du?' : ' siehst du?');
  $('promptDescription').textContent = voicing
    ? 'Der tiefste Ton bestimmt die Umkehrung, der höchste die Lage. Du hörst oder siehst Dur- und Molldreiklänge mit einem verdoppelten Akkordton.'
    : 'Bestimme den Akkordtyp in Grundstellung.';
  if (st.type === 'audio') hideScore();
  else showScore();
}

function newQuestion(){
stopMic();st.round++;if(st.round>st.total){result();return}
st.chord = st.level >= 3 ? makeChord() : null;
if (!st.chord) {
let pool=INTERVALS.filter(x=>x.tier<=st.level);let next=choose(pool);if(st.it&&pool.length>1){for(let k=0;k<10&&next===st.it;k++)next=choose(pool)}
st.it=next;let sign=st.dir==='mixed'?(Math.random()<.5?1:-1):st.dir==='down'?-1:1;
let candidates=['C','D','E','F','G','A','B'].map(l=>({l,o:sign===1?4:5,a:0})).filter(n=>{let p=makeNote(n,next,sign);return Math.abs(p.a)<=1&&midi(p)>=55&&midi(p)<=84});
st.a=choose(candidates.length?candidates:[{l:'C',o:sign===1?4:5,a:0}]);st.b=makeNote(st.a,next,sign);
}
st.answered=false;st.stage=0;st.last=-1;st.stable=0;
$('listenArea').hidden=Boolean(st.chord)||st.mode!=='listen';$('singArea').hidden=st.mode!=='sing';$('chordArea').hidden=!st.chord;$('feedback').hidden=true;
$('roundTag').textContent=LEVELS[st.level].toUpperCase()+' · '+(st.mode==='listen'?'ERKENNEN':'SINGEN');
$('roundCounter').textContent='AUFGABE '+String(st.round).padStart(2,'0')+' / '+st.total;
$('progressFill').style.width=(100*(st.round-1)/st.total)+'%';
$('levelLabel').textContent=LEVELS[st.level].toUpperCase();
$('answerInput').value='';$('answerInput').disabled=false;$('checkButton').disabled=false;$('nextButton').disabled=true;$('revealButton').disabled=false;
$('nextButton').textContent=st.round===st.total?'Ergebnis anzeigen →':'Nächste Aufgabe →';
$('correctScore').textContent=st.correct;$('streakScore').textContent=st.streak;
if(st.chord){
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
$('correctScore').textContent=st.correct;$('streakScore').textContent=st.streak;updateStats();showScore();
let solution;
if (st.chord) {
  const { quality, inversion, position } = st.chord;
  solution = st.level === 4
    ? INVERSIONS[inversion] + ' · ' + POSITIONS[position] + ' (' + quality.label + ')'
    : quality.label;
  for (const id of ['chordQuality', 'chordInversion', 'chordPosition', 'checkChord']) $(id).disabled = true;
} else {
  solution = st.it.label + ' (' + st.it.short + ')';
}
const f=$('feedback');f.hidden=false;f.className='feedback '+(ok?'good':'bad');f.textContent=(ok?'✓ Richtig! ':'Lösung: ')+solution+'. '+extra;
$('nextButton').disabled=false;$('checkButton').disabled=true;$('revealButton').disabled=true;
}
function check(){let v=$('answerInput').value;if(!v.trim())return $('answerInput').focus();
let correct=matches(v,st.it),enh=false;if(!correct&&st.mode==='listen'&&st.type==='audio'&&INTERVALS.some(x=>x.semitones===st.it.semitones&&matches(v,x))){correct=true;enh=true}
finish(correct,enh?'Klanglich enharmonisch gleich.':'')
}
function checkChord() {
  const { quality, inversion, position } = st.chord;
  const answers = st.level === 4
    ? [['chordInversion', String(inversion)], ['chordPosition', String(position)]]
    : [['chordQuality', quality.id]];
  const missing = answers.find(([id]) => !$(id).value);
  if (missing) return $(missing[0]).focus();
  finish(answers.every(([id, value]) => $(id).value === value));
}
function result(){
stopMic();$('roundCounter').textContent='TRAINING ABGESCHLOSSEN';$('progressFill').style.width='100%';$('promptEyebrow').textContent='DEIN ERGEBNIS';$('promptTitle').textContent=st.correct+' von '+st.total+' richtig';$('promptDescription').textContent=Math.round(st.correct/st.total*100)+'% Trefferquote. Starte eine neue Runde.';
$('listenArea').hidden=true;$('singArea').hidden=true;$('chordArea').hidden=true;$('feedback').hidden=true;$('revealButton').disabled=true;$('nextButton').disabled=false;$('nextButton').textContent='Noch einmal spielen ↻';hideScore();
}
function y(n){return 132-((n.o*7+LETTERS.indexOf(n.l))-(4*7+2))*10}
function score(){
let s='<g stroke="#b3a089" stroke-width="1.5">'+[52,72,92,112,132].map(v=>'<line x1="55" y1="'+v+'" x2="510" y2="'+v+'"/>').join('')+'</g><text x="76" y="129" font-family="serif" font-size="92" fill="#efd4a1">𝄞</text>';
const notes = st.chord ? st.chord.notes.map((note, index) => [note, 205 + index * 90]) : [[st.a,240],[st.b,393]];
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
function tone(note,start,duration=.7,volume=.16){
let ctx=audio(),osc=ctx.createOscillator(),gain=ctx.createGain();osc.type='triangle';osc.frequency.value=440*Math.pow(2,(note-69)/12);gain.gain.setValueAtTime(.0001,start);gain.gain.exponentialRampToValueAtTime(volume,start+.04);gain.gain.setTargetAtTime(.0001,start+duration-.12,.08);osc.connect(gain);gain.connect(ctx.destination);osc.start(start);osc.stop(start+duration+.2)
}
function play(){let t=audio().currentTime+.08;tone(midi(st.a),t);tone(midi(st.b),t+.85,.8)}
function playChord() {
  const notes = st.chord.notes.map(midi);
  const start = audio().currentTime + .08;
  notes.forEach((note, index) => tone(note, start + index * .42, .36));
  notes.forEach(note => tone(note, start + notes.length * .42 + .12, 1, .16 / notes.length));
}
function pitch(buf,sampleRate){
let mean=0,rms=0;for(let v of buf)mean+=v;mean/=buf.length;for(let v of buf)rms+=(v-mean)**2;rms=Math.sqrt(rms/buf.length);$('meterFill').style.width=Math.min(100,rms*700)+'%';if(rms<.012)return null;
let best=-1,lagBest=0;for(let lag=Math.floor(sampleRate/950);lag<=Math.min(sampleRate/115,buf.length*.65);lag++){let xy=0,xx=0,yy=0;for(let j=0;j<buf.length-lag;j+=2){let a=buf[j]-mean,b=buf[j+lag]-mean;xy+=a*b;xx+=a*a;yy+=b*b}let c=xy/Math.sqrt(xx*yy+1e-12);if(c>best){best=c;lagBest=lag}}
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
try{let stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:false,noiseSuppression:false,autoGainControl:false},video:false});if(st.mode!=='sing'||st.answered){stream.getTracks().forEach(t=>t.stop());return}
st.stream=stream;st.source=audio().createMediaStreamSource(stream);st.analyser=audio().createAnalyser();st.analyser.fftSize=4096;st.source.connect(st.analyser);$('micButtonLabel').textContent='Mikrofon stoppen';$('micButton').classList.add('recording');$('micStatus').textContent='Singe den Startton';loop()
}catch(e){$('micStatus').textContent='Mikrofonzugriff nicht möglich';}
}
function stopMic(){if(st.raf)cancelAnimationFrame(st.raf);st.raf=0;if(st.source)st.source.disconnect();if(st.stream)st.stream.getTracks().forEach(t=>t.stop());st.source=null;st.stream=null;st.analyser=null;$('meterFill').style.width='0%';$('micButtonLabel').textContent='Mikrofon starten';$('micButton').classList.remove('recording')}
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
updateStats();reset();
