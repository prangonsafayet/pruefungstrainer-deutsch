// Node validator for exam data files.
// Usage: node validate.cjs [src/content/trainers/<id>/exams/examNN.ts ...]
// With no args it discovers every trainer under src/content/trainers and validates its
// papers against the format they are authored in — so a new trainer needs no edit here.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const TRAINERS_DIR = path.join(__dirname, 'src', 'content', 'trainers');

// Which paper a file is: the type it declares itself to satisfy, not its folder name.
const formatOf = abs => {
  const text = fs.readFileSync(abs, 'utf8');
  if (/satisfies\s+SingleLevelExam/.test(text)) return 'single-level';
  if (/satisfies\s+DtzExam/.test(text)) return 'dtz-paper';
  return 'dual-level';
};

const discover = () => {
  const found = [];
  for (const trainer of fs.readdirSync(TRAINERS_DIR).sort()) {
    const dir = path.join(TRAINERS_DIR, trainer, 'exams');
    if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) continue;
    for (const name of fs
      .readdirSync(dir)
      .filter(x => /^exam\d+\.ts$/.test(x))
      .sort()) {
      const file = `src/content/trainers/${trainer}/exams/${name}`;
      found.push({ trainer, file, format: formatOf(path.join(dir, name)) });
    }
  }
  return found;
};

const named = process.argv.slice(2);
const allExams = named.length
  ? named.map(file => ({
      trainer: file.split('/')[3],
      file,
      format: formatOf(path.join(__dirname, file))
    }))
  : discover();

const files = allExams.filter(entry => entry.format === 'dual-level').map(entry => entry.file);

let failures = 0;
const err = (f, msg) => {
  failures++;
  console.error(`  ✗ [${f}] ${msg}`);
};

const distinct = arr => new Set(arr).size === arr.length;
// The Sprechen part names are fixed telc facts for the single-level paper, and were wrong
// in twenty papers once ("Kontaktaufnahme", "Präsentation"), so they are asserted here.
// The dual-level paper's `sprechen` carries no part names to check — see its type.
const SPRECHEN_TITLES = {
  b1: ['Einander kennenlernen', 'Über ein Thema sprechen', 'Gemeinsam etwas planen'],
  b2: ['Über Erfahrungen sprechen', 'Diskussion', 'Gemeinsam etwas planen']
};
const inRange = (arr, n) => arr.every(i => Number.isInteger(i) && i >= 0 && i < n);
const mixedBool = (items, key) => {
  const vals = items.map(i => i[key]);
  return vals.includes(true) && vals.includes(false);
};
const isStr = s => typeof s === 'string' && s.trim().length > 0;
const audioOk = a =>
  isStr(a) || (Array.isArray(a) && a.length >= 2 && a.every(t => isStr(t.speaker) && isStr(t.text)));

const seenIds = new Set();
for (const file of files) {
  const abs = path.join(__dirname, file);
  const ctx = {};
  vm.createContext(ctx);
  let ex;
  try {
    // Strip the TypeScript wrapper so the literal can be evaluated as plain JS.
    const src = fs
      .readFileSync(abs, 'utf8')
      .replace(/^import[^\n]*\n/gm, '')
      .replace(/^\s*const exam =\s*/m, '')
      .replace(/\bas const satisfies DualLevelExam;?/, '')
      .replace(/export default exam;?\s*$/m, '')
      .trim()
      .replace(/;\s*$/, '');
    ex = vm.runInContext('(' + src + ')', ctx, { filename: file });
  } catch (e) {
    err(file, 'JS error: ' + e.message);
    continue;
  }
  if (!ex || typeof ex !== 'object') {
    err(file, 'file does not export a single exam object');
    continue;
  }
  const f = file;
  // Per file, so one bad paper cannot relabel every valid one after it.
  const failuresBefore = failures;
  // Two identical options in one item would make two answers correct.
  const optionsDistinct = (label, options) => {
    if (Array.isArray(options) && !distinct(options)) err(f, `${label} repeats an option`);
  };

  if (!Number.isInteger(ex.id)) err(f, 'missing id');
  else if (seenIds.has(ex.id)) err(f, 'duplicate id ' + ex.id);
  else seenIds.add(ex.id);
  if (!['easy', 'medium', 'b1'].includes(ex.difficulty)) err(f, 'bad difficulty');
  for (const k of ['title', 'level', 'theme']) if (!isStr(ex[k])) err(f, 'missing ' + k);

  // Lesen
  const L = ex.lesen || {};
  const t1 = L.teil1 || {};
  if (!t1.situations || t1.situations.length !== 5) err(f, 'lesen.teil1 needs 5 situations');
  if (!t1.ads || t1.ads.length !== 8) err(f, 'lesen.teil1 needs 8 ads');
  else if (!distinct(t1.ads.map(a => JSON.stringify(a)))) err(f, 'lesen.teil1 repeats an ad');
  if (!t1.answers || t1.answers.length !== 5 || !distinct(t1.answers) || !inRange(t1.answers, 8))
    err(f, 'lesen.teil1 answers invalid');
  const t2 = L.teil2 || {};
  if (!t2.texts || t2.texts.length !== 2 || !t2.texts.every(t => isStr(t.titel) && isStr(t.text)))
    err(f, 'lesen.teil2 needs 2 texts');
  if (!t2.questions || t2.questions.length !== 5) err(f, 'lesen.teil2 needs 5 questions');
  else
    t2.questions.forEach((q, i) => {
      if (![0, 1].includes(q.textIndex)) err(f, `lesen.teil2 q${i + 1} bad textIndex`);
      if (!q.options || q.options.length !== 3 || !inRange([q.answer], 3))
        err(f, `lesen.teil2 q${i + 1} bad options/answer`);
      else optionsDistinct(`lesen.teil2 q${i + 1}`, q.options);
    });
  const t3 = L.teil3 || {};
  if (!t3.messages || t3.messages.length !== 5) err(f, 'lesen.teil3 needs 5 messages');
  if (!t3.headlines || t3.headlines.length !== 8) err(f, 'lesen.teil3 needs 8 headlines');
  else if (!distinct(t3.headlines)) err(f, 'lesen.teil3 repeats a headline');
  if (!t3.answers || t3.answers.length !== 5 || !distinct(t3.answers) || !inRange(t3.answers, 8))
    err(f, 'lesen.teil3 answers invalid');
  const t4 = L.teil4 || {};
  if (!isStr(t4.titel) || !isStr(t4.text)) err(f, 'lesen.teil4 missing text');
  if (
    !t4.statements ||
    t4.statements.length !== 5 ||
    !t4.statements.every(s => isStr(s.text) && typeof s.answer === 'boolean')
  )
    err(f, 'lesen.teil4 needs 5 statements');
  else if (!mixedBool(t4.statements, 'answer')) err(f, 'lesen.teil4 statements all same truth value');

  // Sprachbausteine
  const S = ex.sprachbausteine || {};
  const s1 = S.teil1 || {};
  if (!isStr(s1.text)) err(f, 'sb.teil1 missing text');
  else
    for (let i = 1; i <= 6; i++) if (!s1.text.includes(`[${i}]`)) err(f, `sb.teil1 text missing gap [${i}]`);
  if (
    !s1.gaps ||
    s1.gaps.length !== 6 ||
    !s1.gaps.every(g => g.options && g.options.length === 3 && inRange([g.answer], 3))
  )
    err(f, 'sb.teil1 gaps invalid');
  else s1.gaps.forEach((g, i) => optionsDistinct(`sb.teil1 gap${i + 1}`, g.options));
  const s2 = S.teil2 || {};
  if (!isStr(s2.text)) err(f, 'sb.teil2 missing text');
  else
    for (let i = 1; i <= 6; i++) if (!s2.text.includes(`[${i}]`)) err(f, `sb.teil2 text missing gap [${i}]`);
  if (!s2.wordBank || s2.wordBank.length !== 12) err(f, 'sb.teil2 needs 12 wordBank words');
  // A repeated bank word makes two indices correct for the same gap.
  else if (!distinct(s2.wordBank)) err(f, 'sb.teil2 repeats a wordBank word');
  if (!s2.answers || s2.answers.length !== 6 || !distinct(s2.answers) || !inRange(s2.answers, 12))
    err(f, 'sb.teil2 answers invalid');
  const s3 = S.teil3 || {};
  if (
    !s3.items ||
    s3.items.length !== 5 ||
    !s3.items.every(
      it => isStr(it.prompt) && it.options && it.options.length === 3 && inRange([it.answer], 3)
    )
  )
    err(f, 'sb.teil3 items invalid');
  else s3.items.forEach((it, i) => optionsDistinct(`sb.teil3 item${i + 1}`, it.options));

  // Hören
  const H = ex.hoeren || {};
  const h1 = H.teil1 || {};
  if (
    !h1.items ||
    h1.items.length !== 4 ||
    !h1.items.every(it => audioOk(it.audio) && isStr(it.statement) && typeof it.answer === 'boolean')
  )
    err(f, 'hoeren.teil1 invalid');
  else if (!mixedBool(h1.items, 'answer')) err(f, 'hoeren.teil1 all same truth value');
  const h2 = H.teil2 || {};
  if (
    !h2.items ||
    h2.items.length !== 4 ||
    !h2.items.every(
      it =>
        audioOk(it.audio) &&
        isStr(it.frage) &&
        it.options &&
        it.options.length === 3 &&
        inRange([it.answer], 3)
    )
  )
    err(f, 'hoeren.teil2 invalid');
  else h2.items.forEach((it, i) => optionsDistinct(`hoeren.teil2 item${i + 1}`, it.options));
  const h3 = H.teil3 || {};
  if (
    !h3.items ||
    h3.items.length !== 4 ||
    !h3.items.every(it => audioOk(it.audio) && isStr(it.statement) && typeof it.answer === 'boolean')
  )
    err(f, 'hoeren.teil3 invalid');
  else if (!mixedBool(h3.items, 'answer')) err(f, 'hoeren.teil3 all same truth value');
  const h4 = H.teil4 || {};
  if (!audioOk(h4.audio) || !Array.isArray(h4.audio)) err(f, 'hoeren.teil4 audio must be dialogue array');
  if (
    !h4.questions ||
    h4.questions.length !== 4 ||
    !h4.questions.every(q => isStr(q.frage) && q.options && q.options.length === 3 && inRange([q.answer], 3))
  )
    err(f, 'hoeren.teil4 questions invalid');
  else h4.questions.forEach((q, i) => optionsDistinct(`hoeren.teil4 q${i + 1}`, q.options));
  const h5 = H.teil5 || {};
  if (!isStr(h5.audio)) err(f, 'hoeren.teil5 audio must be a string');
  if (
    !h5.gaps ||
    h5.gaps.length !== 4 ||
    !h5.gaps.every(g => isStr(g.label) && isStr(g.answer) && Array.isArray(g.alt))
  )
    err(f, 'hoeren.teil5 gaps invalid');
  else
    h5.gaps.forEach((g, i) => {
      // The note sheet renders the label with its gap shown as ____ .
      if (!g.label.includes('____')) err(f, `hoeren.teil5 gap${i + 1} label needs a ____ blank`);
      const hay = h5.audio.toLowerCase();
      const needles = [g.answer, ...g.alt].map(x => x.toLowerCase());
      // The answer (or an alternative) should be derivable; only warn-level: check the main token appears for word answers
      if (!/\d/.test(g.answer) && !needles.some(n => hay.includes(n.split(' ').pop()))) {
        console.warn(
          `  ⚠ [${f}] hoeren.teil5 gap${i + 1}: answer "${g.answer}" not literally found in audio (check it is inferable)`
        );
      }
    });

  // Schreiben
  const W = ex.schreiben || {};
  if (!isStr(W.anweisung) || !isStr(W.situation) || !isStr(W.musterloesung) || !isStr(W.tipps))
    err(f, 'schreiben missing fields');
  if (
    !W.incomingEmail ||
    !isStr(W.incomingEmail.von) ||
    !isStr(W.incomingEmail.betreff) ||
    !isStr(W.incomingEmail.text)
  )
    err(f, 'schreiben.incomingEmail invalid');
  if (!W.points || W.points.length !== 3 || !W.points.every(isStr)) err(f, 'schreiben needs 3 points');

  // Sprechen. The dual-level paper's parts carry no titel to check; the item counts below
  // (5 Punkte in Teil 1, 4 Leitfragen, 4 Punkte in Teil 3) are this repo's authoring
  // conventions for a full-looking task, not telc rules.
  const P = ex.sprechen || {};
  if (
    !P.teil1 ||
    !P.teil1.punkte ||
    P.teil1.punkte.length < 5 ||
    !P.teil1.redemittel ||
    P.teil1.redemittel.length < 5
  )
    err(f, 'sprechen.teil1 invalid');
  if (
    !P.teil2 ||
    !isStr(P.teil2.thema) ||
    !P.teil2.leitfragen ||
    P.teil2.leitfragen.length !== 4 ||
    !P.teil2.redemittel ||
    P.teil2.redemittel.length < 4
  )
    err(f, 'sprechen.teil2 invalid');
  if (
    !P.teil3 ||
    !isStr(P.teil3.aufgabe) ||
    !P.teil3.punkte ||
    P.teil3.punkte.length !== 4 ||
    !P.teil3.redemittel ||
    P.teil3.redemittel.length < 4
  )
    err(f, 'sprechen.teil3 invalid');

  if (failures === failuresBefore) console.log(`  ✓ [${f}] OK — "${ex.title}" (${ex.level}, ${ex.theme})`);
  else console.log(`  … [${f}] checked with errors above`);
}

// ---------------------------------------------------------------------------
// Single-level Modelltests (src/content/trainers/<id>/exams/examNN.ts)
// ---------------------------------------------------------------------------
const telcFiles = allExams.filter(entry => entry.format === 'single-level');

const telcSeen = {};
for (const { trainer: level, file } of telcFiles) {
  telcSeen[level] = telcSeen[level] || new Set();
  const abs = path.join(__dirname, file);
  const ctx = {};
  vm.createContext(ctx);
  let ex;
  try {
    const src = fs
      .readFileSync(abs, 'utf8')
      .replace(/^import[^\n]*\n/gm, '')
      .replace(/^\s*const exam =\s*/m, '')
      .replace(/\bas const satisfies SingleLevelExam;?/, '')
      .replace(/export default exam;?\s*$/m, '')
      .trim()
      .replace(/;\s*$/, '');
    ex = vm.runInContext('(' + src + ')', ctx, { filename: file });
  } catch (e) {
    err(file, 'JS error: ' + e.message);
    continue;
  }
  if (!ex || typeof ex !== 'object') {
    err(file, 'file does not export a single exam object');
    continue;
  }
  const f = file;
  // Per file, so one bad paper cannot relabel every valid one after it.
  const failuresBefore = failures;
  const optionsDistinct = (label, options) => {
    if (Array.isArray(options) && !distinct(options)) err(f, `${label} repeats an option`);
  };

  if (!Number.isInteger(ex.id) || ex.id < 1 || ex.id > 10) err(f, 'id must be 1–10');
  else if (telcSeen[level].has(ex.id)) err(f, `duplicate ${level} id ${ex.id}`);
  else telcSeen[level].add(ex.id);
  if (ex.level !== level) err(f, `level must be '${level}'`);
  for (const k of ['title', 'theme']) if (!isStr(ex[k])) err(f, 'missing ' + k);

  // Lesen: 5 texts → 10 headlines · 5 MC on one article · 10 situations → 12 ads
  const L = ex.lesen || {};
  const t1 = L.teil1 || {};
  if (!t1.headlines || t1.headlines.length !== 10) err(f, 'lesen.teil1 needs 10 headlines');
  // Two identical headlines would make two answers correct for the same text.
  else if (!distinct(t1.headlines)) err(f, 'lesen.teil1 repeats a headline');
  if (!t1.texts || t1.texts.length !== 5 || !t1.texts.every(isStr)) err(f, 'lesen.teil1 needs 5 texts');
  if (!t1.answers || t1.answers.length !== 5 || !distinct(t1.answers) || !inRange(t1.answers, 10))
    err(f, 'lesen.teil1 answers invalid');
  const t2 = L.teil2 || {};
  if (!isStr(t2.titel) || !isStr(t2.text)) err(f, 'lesen.teil2 missing article');
  if (
    !t2.questions ||
    t2.questions.length !== 5 ||
    !t2.questions.every(q => isStr(q.frage) && q.options && q.options.length === 3 && inRange([q.answer], 3))
  )
    err(f, 'lesen.teil2 questions invalid');
  else t2.questions.forEach((q, i) => optionsDistinct(`lesen.teil2 q${i + 1}`, q.options));
  const t3 = L.teil3 || {};
  if (!t3.situations || t3.situations.length !== 10) err(f, 'lesen.teil3 needs 10 situations');
  if (!t3.ads || t3.ads.length !== 12) err(f, 'lesen.teil3 needs 12 ads');
  else if (!distinct(t3.ads.map(a => JSON.stringify(a)))) err(f, 'lesen.teil3 repeats an ad');
  if (!t3.answers || t3.answers.length !== 10 || !distinct(t3.answers) || !inRange(t3.answers, 12))
    err(f, 'lesen.teil3 answers invalid');

  // Sprachbausteine: 10 MC gaps · 10 gaps from a 15-word bank
  const S = ex.sprachbausteine || {};
  const s1 = S.teil1 || {};
  if (!isStr(s1.text)) err(f, 'sb.teil1 missing text');
  else
    for (let i = 1; i <= 10; i++) if (!s1.text.includes(`[${i}]`)) err(f, `sb.teil1 text missing gap [${i}]`);
  if (
    !s1.gaps ||
    s1.gaps.length !== 10 ||
    !s1.gaps.every(g => g.options && g.options.length === 3 && inRange([g.answer], 3))
  )
    err(f, 'sb.teil1 gaps invalid');
  else s1.gaps.forEach((g, i) => optionsDistinct(`sb.teil1 gap${i + 1}`, g.options));
  const s2 = S.teil2 || {};
  if (!isStr(s2.text)) err(f, 'sb.teil2 missing text');
  else
    for (let i = 1; i <= 10; i++) if (!s2.text.includes(`[${i}]`)) err(f, `sb.teil2 text missing gap [${i}]`);
  if (!s2.wordBank || s2.wordBank.length !== 15) err(f, 'sb.teil2 needs 15 wordBank words');
  // A repeated bank word makes two indices correct for the same gap.
  else if (!distinct(s2.wordBank)) err(f, 'sb.teil2 repeats a wordBank word');
  if (!s2.answers || s2.answers.length !== 10 || !distinct(s2.answers) || !inRange(s2.answers, 15))
    err(f, 'sb.teil2 answers invalid');

  // Hören: 5 R/F clips · one interview with 10 statements · 5 R/F announcements
  const H = ex.hoeren || {};
  const h1 = H.teil1 || {};
  if (
    !h1.items ||
    h1.items.length !== 5 ||
    !h1.items.every(it => audioOk(it.audio) && isStr(it.statement) && typeof it.answer === 'boolean')
  )
    err(f, 'hoeren.teil1 invalid');
  else if (!mixedBool(h1.items, 'answer')) err(f, 'hoeren.teil1 all same truth value');
  const h2 = H.teil2 || {};
  if (!audioOk(h2.audio) || !Array.isArray(h2.audio)) err(f, 'hoeren.teil2 audio must be dialogue array');
  if (
    !h2.statements ||
    h2.statements.length !== 10 ||
    !h2.statements.every(it => isStr(it.statement) && typeof it.answer === 'boolean')
  )
    err(f, 'hoeren.teil2 needs 10 statements');
  else if (!mixedBool(h2.statements, 'answer')) err(f, 'hoeren.teil2 all same truth value');
  const h3 = H.teil3 || {};
  if (
    !h3.items ||
    h3.items.length !== 5 ||
    !h3.items.every(it => audioOk(it.audio) && isStr(it.statement) && typeof it.answer === 'boolean')
  )
    err(f, 'hoeren.teil3 invalid');
  else if (!mixedBool(h3.items, 'answer')) err(f, 'hoeren.teil3 all same truth value');

  // Schreiben: one task at both levels — B1 replies to an incoming e-mail, B2 writes a
  // halbformelle E-Mail from a prompt. Neither level offers a choice of two tasks.
  const W = ex.schreiben || {};
  if (!isStr(W.anweisung) || !isStr(W.tipps)) err(f, 'schreiben missing fields');
  const wantTasks = 1;
  if (!W.tasks || W.tasks.length !== wantTasks) err(f, `schreiben needs ${wantTasks} task(s)`);
  else
    W.tasks.forEach((t, i) => {
      if (!isStr(t.titel) || !isStr(t.situation) || !isStr(t.musterloesung))
        err(f, `schreiben.task${i + 1} missing fields`);
      if (!t.leitpunkte || t.leitpunkte.length !== 4 || !t.leitpunkte.every(isStr))
        err(f, `schreiben.task${i + 1} needs 4 Leitpunkte`);
      if (level === 'b1' && (!t.incoming || !isStr(t.incoming.von) || !isStr(t.incoming.text)))
        err(f, 'schreiben B1 task needs the incoming letter');
      // B2 writes its halbformelle E-Mail from the prompt alone — no letter to reply to.
      if (level === 'b2' && t.incoming) err(f, 'schreiben B2 task must not carry an incoming letter');
    });

  // Sprechen: three parts with Punkte and Redemittel. The part names differ between the two
  // levels and are the telc facts most easily copied from the wrong level, so they are checked.
  const P = ex.sprechen || {};
  const wantTitles = SPRECHEN_TITLES[level] || [];
  ['teil1', 'teil2', 'teil3'].forEach((teil, i) => {
    const want = wantTitles[i];
    const got = (P[teil] || {}).titel;
    if (want && !(isStr(got) && got.includes(want)))
      err(f, `sprechen.${teil} must be named "${want}" at ${level.toUpperCase()}, not "${String(got)}"`);
  });
  for (const teil of ['teil1', 'teil2', 'teil3']) {
    const t = P[teil] || {};
    if (
      !isStr(t.titel) ||
      !isStr(t.anweisung) ||
      !t.punkte ||
      t.punkte.length < 3 ||
      !t.redemittel ||
      t.redemittel.length < 4
    )
      err(f, `sprechen.${teil} invalid`);
  }

  if (failures === failuresBefore)
    console.log(`  ✓ [${f}] OK — "${ex.title}" (telc ${level.toUpperCase()}, ${ex.theme})`);
  else console.log(`  … [${f}] checked with errors above`);
}

// --- DTZ (Deutsch-Test für Zuwanderer A2–B1) ---------------------------------------------
// Every count below is from the g.a.s.t. Übungssatz the trainer follows
// (docs/dtz-format.local.md): Hören 4/5/8/3, Lesen 5/5/6/3/6, Schreiben A or B with four
// Leitpunkte each, Sprechen three Teile.
const dtzFiles = allExams.filter(entry => entry.format === 'dtz-paper');
const dtzSeen = new Set();
// Lesen Teil 2's one situation without a matching ad (X). Mirrors NO_MATCH_ANSWER.
const NO_MATCH = -1;
for (const { file } of dtzFiles) {
  const abs = path.join(__dirname, file);
  const ctx = {};
  vm.createContext(ctx);
  let ex;
  try {
    const src = fs
      .readFileSync(abs, 'utf8')
      .replace(/^import[^\n]*\n/gm, '')
      .replace(/^\s*const exam =\s*/m, '')
      .replace(/\bas const satisfies DtzExam;?/, '')
      .replace(/export default exam;?\s*$/m, '')
      .trim()
      .replace(/;\s*$/, '');
    ex = vm.runInContext('(' + src + ')', ctx, { filename: file });
  } catch (e) {
    err(file, 'JS error: ' + e.message);
    continue;
  }
  if (!ex || typeof ex !== 'object') {
    err(file, 'file does not export a single exam object');
    continue;
  }
  const f = file;
  // Per file, so one bad paper cannot relabel every valid one after it.
  const failuresBefore = failures;
  const mcOk = (label, q) => {
    if (
      !q ||
      !isStr(q.frage) ||
      !Array.isArray(q.options) ||
      q.options.length !== 3 ||
      !q.options.every(isStr)
    ) {
      err(f, `${label} needs a question with 3 options`);
      return;
    }
    if (!distinct(q.options)) err(f, `${label} repeats an option`);
    if (!inRange([q.answer], 3)) err(f, `${label} answer must be 0–2`);
  };
  const tfOk = (label, s) => {
    if (!s || !isStr(s.text) || typeof s.answer !== 'boolean')
      err(f, `${label} needs a richtig/falsch statement`);
  };
  const truthMixed = statements => {
    const vals = statements.map(s => s && s.answer);
    return vals.includes(true) && vals.includes(false);
  };

  if (!Number.isInteger(ex.id) || ex.id < 1 || ex.id > 10) err(f, 'id must be 1–10');
  else if (dtzSeen.has(ex.id)) err(f, `duplicate DTZ id ${ex.id}`);
  else dtzSeen.add(ex.id);
  for (const k of ['title', 'theme']) if (!isStr(ex[k])) err(f, 'missing ' + k);

  // Hören: Teil 1 four and Teil 2 five announcements, one a/b/c item each.
  const H = ex.hoeren || {};
  for (const [teil, n] of [
    ['teil1', 4],
    ['teil2', 5]
  ]) {
    const t = H[teil] || {};
    if (!isStr(t.anweisung)) err(f, `hoeren.${teil} missing anweisung`);
    if (!Array.isArray(t.items) || t.items.length !== n) {
      err(f, `hoeren.${teil} needs ${n} items`);
      continue;
    }
    t.items.forEach((it, i) => {
      if (!audioOk(it.audio)) err(f, `hoeren.${teil}[${i}] audio invalid`);
      mcOk(`hoeren.${teil}[${i}]`, it);
    });
  }
  // Teil 3: four conversations, each one richtig/falsch plus one a/b/c item.
  const h3 = H.teil3 || {};
  if (!isStr(h3.anweisung)) err(f, 'hoeren.teil3 missing anweisung');
  if (!Array.isArray(h3.gespraeche) || h3.gespraeche.length !== 4) err(f, 'hoeren.teil3 needs 4 Gespräche');
  else {
    h3.gespraeche.forEach((g, i) => {
      if (!audioOk(g.audio)) err(f, `hoeren.teil3[${i}] audio invalid`);
      tfOk(`hoeren.teil3[${i}].statement`, g.statement);
      mcOk(`hoeren.teil3[${i}].question`, g.question);
    });
    if (!truthMixed(h3.gespraeche.map(g => g.statement)))
      err(f, 'hoeren.teil3 statements all same truth value');
  }
  // Teil 4: six sentences a–f, a Beispiel that uses one, three statements matched to the rest.
  const h4 = H.teil4 || {};
  if (!isStr(h4.anweisung) || !isStr(h4.thema)) err(f, 'hoeren.teil4 missing anweisung/thema');
  // 6 sentences − 1 Beispiel − 3 Aussagen leaves exactly two; "drei" slipped into two papers once.
  if (isStr(h4.anweisung) && /\b(drei|vier|fünf)\s+Sätze\s+(bleiben|passen)/i.test(h4.anweisung))
    err(f, 'hoeren.teil4 anweisung miscounts the leftover sentences (two remain)');
  if (
    !Array.isArray(h4.sentences) ||
    h4.sentences.length !== 6 ||
    !h4.sentences.every(isStr) ||
    !distinct(h4.sentences)
  )
    err(f, 'hoeren.teil4 needs 6 distinct sentences a–f');
  if (!h4.beispiel || !audioOk(h4.beispiel.audio) || !inRange([h4.beispiel.answer], 6))
    err(f, 'hoeren.teil4 needs a Beispiel with audio and an answer 0–5');
  if (!Array.isArray(h4.aussagen) || h4.aussagen.length !== 3) err(f, 'hoeren.teil4 needs 3 Aussagen');
  else {
    const answers = h4.aussagen.map(a => a.answer);
    h4.aussagen.forEach((a, i) => {
      if (!audioOk(a.audio)) err(f, `hoeren.teil4[${i}] audio invalid`);
    });
    if (!inRange(answers, 6) || !distinct(answers)) err(f, 'hoeren.teil4 answers must be distinct, 0–5');
    if (h4.beispiel && answers.includes(h4.beispiel.answer))
      err(f, 'hoeren.teil4 reuses the Beispiel sentence');
  }

  // Lesen
  const L = ex.lesen || {};
  const l1 = L.teil1 || {};
  if (!isStr(l1.anweisung) || !isStr(l1.titel) || !isStr(l1.verzeichnis))
    err(f, 'lesen.teil1 missing fields');
  if (!Array.isArray(l1.questions) || l1.questions.length !== 5) err(f, 'lesen.teil1 needs 5 questions');
  else l1.questions.forEach((q, i) => mcOk(`lesen.teil1[${i}]`, q));

  // Teil 2: five situations, eight ads a–h, exactly one situation with no ad (X).
  const l2 = L.teil2 || {};
  if (!isStr(l2.anweisung)) err(f, 'lesen.teil2 missing anweisung');
  if (!Array.isArray(l2.situations) || l2.situations.length !== 5 || !l2.situations.every(isStr))
    err(f, 'lesen.teil2 needs 5 situations');
  if (!Array.isArray(l2.ads) || l2.ads.length !== 8 || !l2.ads.every(isStr) || !distinct(l2.ads))
    err(f, 'lesen.teil2 needs 8 distinct ads a–h');
  if (!Array.isArray(l2.answers) || l2.answers.length !== 5) err(f, 'lesen.teil2 needs 5 answers');
  else {
    const xs = l2.answers.filter(a => a === NO_MATCH).length;
    const matched = l2.answers.filter(a => a !== NO_MATCH);
    if (xs !== 1) err(f, `lesen.teil2 needs exactly one X (-1) answer, has ${xs}`);
    if (!inRange(matched, 8) || !distinct(matched)) err(f, 'lesen.teil2 answers must be distinct, 0–7');
  }

  // Teil 3: three texts, each one richtig/falsch plus one a/b/c item.
  const l3 = L.teil3 || {};
  if (!isStr(l3.anweisung)) err(f, 'lesen.teil3 missing anweisung');
  if (!Array.isArray(l3.texts) || l3.texts.length !== 3) err(f, 'lesen.teil3 needs 3 texts');
  else {
    l3.texts.forEach((t, i) => {
      if (!isStr(t.titel) || !isStr(t.text)) err(f, `lesen.teil3[${i}] missing titel/text`);
      tfOk(`lesen.teil3[${i}].statement`, t.statement);
      mcOk(`lesen.teil3[${i}].question`, t.question);
    });
    if (!truthMixed(l3.texts.map(t => t.statement))) err(f, 'lesen.teil3 statements all same truth value');
  }

  // Teil 4: one brochure, three richtig/falsch statements.
  const l4 = L.teil4 || {};
  if (!isStr(l4.anweisung) || !isStr(l4.titel) || !isStr(l4.text)) err(f, 'lesen.teil4 missing fields');
  if (!Array.isArray(l4.statements) || l4.statements.length !== 3) err(f, 'lesen.teil4 needs 3 statements');
  else {
    l4.statements.forEach((s, i) => tfOk(`lesen.teil4[${i}]`, s));
    if (!truthMixed(l4.statements)) err(f, 'lesen.teil4 all same truth value');
  }

  // Teil 5: a letter with gaps [1]–[6], three options each.
  const l5 = L.teil5 || {};
  if (!isStr(l5.anweisung) || !isStr(l5.text)) err(f, 'lesen.teil5 missing fields');
  else {
    for (let g = 1; g <= 6; g++) if (!l5.text.includes(`[${g}]`)) err(f, `lesen.teil5 text missing [${g}]`);
    if (l5.text.includes('[7]')) err(f, 'lesen.teil5 text has a [7] gap');
  }
  if (!Array.isArray(l5.gaps) || l5.gaps.length !== 6) err(f, 'lesen.teil5 needs 6 gaps');
  else
    l5.gaps.forEach((g, i) => {
      if (
        !Array.isArray(g.options) ||
        g.options.length !== 3 ||
        !g.options.every(isStr) ||
        !distinct(g.options)
      )
        err(f, `lesen.teil5 gap ${i + 1} needs 3 distinct options`);
      if (!inRange([g.answer], 3)) err(f, `lesen.teil5 gap ${i + 1} answer must be 0–2`);
    });

  // Schreiben: Aufgabe A or B, four Leitpunkte each, written from the prompt alone.
  const W = ex.schreiben || {};
  if (!isStr(W.anweisung) || !isStr(W.tipps)) err(f, 'schreiben missing fields');
  if (!Array.isArray(W.tasks) || W.tasks.length !== 2) err(f, 'schreiben needs exactly 2 tasks (A and B)');
  else
    W.tasks.forEach((t, i) => {
      if (!isStr(t.titel) || !isStr(t.situation) || !isStr(t.musterloesung))
        err(f, `schreiben.task${i + 1} missing fields`);
      if (!Array.isArray(t.leitpunkte) || t.leitpunkte.length !== 4 || !t.leitpunkte.every(isStr))
        err(f, `schreiben.task${i + 1} needs 4 Leitpunkte`);
      if (t.incoming) err(f, `schreiben.task${i + 1} must not carry an incoming letter`);
    });

  // Sprechen: über sich sprechen, über Erfahrungen sprechen (two photos), gemeinsam planen.
  const P = ex.sprechen || {};
  const p1 = P.teil1 || {};
  if (!isStr(p1.anweisung) || !Array.isArray(p1.nachfragen) || p1.nachfragen.length < 2)
    err(f, 'sprechen.teil1 needs an anweisung and ≥ 2 Nachfragen');
  const p2 = P.teil2 || {};
  if (!isStr(p2.anweisung)) err(f, 'sprechen.teil2 missing anweisung');
  // In the DTZ the examiner asks the follow-up questions in Teil 1 and 2, not the partner.
  for (const [teil, t] of [
    ['teil1', p1],
    ['teil2', p2]
  ])
    if (isStr(t.anweisung) && /Gesprächspartner\w*[^.]*\bFragen\b/.test(t.anweisung))
      err(f, `sprechen.${teil} anweisung gives the follow-up questions to the partner, not the examiner`);
  if (!Array.isArray(p2.bilder) || p2.bilder.length !== 2) err(f, 'sprechen.teil2 needs 2 Bilder');
  else
    p2.bilder.forEach((b, i) => {
      if (!isStr(b.beschreibung)) err(f, `sprechen.teil2 Bild ${i + 1} needs a description`);
      if (
        !Array.isArray(b.fragenA2) ||
        !b.fragenA2.length ||
        !Array.isArray(b.fragenB1) ||
        !b.fragenB1.length
      )
        err(f, `sprechen.teil2 Bild ${i + 1} needs A2 and B1 questions`);
    });
  const p3 = P.teil3 || {};
  if (!isStr(p3.situation) || !isStr(p3.aufgabe)) err(f, 'sprechen.teil3 missing situation/aufgabe');
  if (
    !Array.isArray(p3.notizen) ||
    p3.notizen.length < 4 ||
    !String(p3.notizen[p3.notizen.length - 1])
      .trim()
      .endsWith('?')
  )
    err(f, 'sprechen.teil3 needs ≥ 4 Notizen, the last ending in "?"');
  for (const teil of ['teil1', 'teil2', 'teil3']) {
    const red = (P[teil] || {}).redemittel;
    if (!Array.isArray(red) || red.length < 4) err(f, `sprechen.${teil} needs ≥ 4 Redemittel`);
  }

  if (failures === failuresBefore) console.log(`  ✓ [${f}] OK — "${ex.title}" (DTZ, ${ex.theme})`);
  else console.log(`  … [${f}] checked with errors above`);
}

console.log(failures ? `\nFAILED: ${failures} problem(s).` : '\nAll files valid.');
process.exit(failures ? 1 : 0);
