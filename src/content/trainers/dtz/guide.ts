/* The Deutsch-Test für Zuwanderer (DTZ) Exam Guide, authored as HTML and injected into a .prose container.
   Every format and scoring figure below comes from docs/dtz-format.local.md (the g.a.s.t. Übungssatz 1).
   Not stated there, so not stated here: how often a Hören text is played, minutes per Teil inside
   Hören/Lesen, a Schreiben word count, and any preparation time before Sprechen. */

/** Structure, scoring and per-module tactics. Trusted, repo-authored HTML. */
export const DTZ_GUIDE = `
<h1>Exam Guide — Deutsch-Test für Zuwanderer (DTZ)</h1>
<p class="lead">What the DTZ is, how its four parts are built, how every point is awarded, and concrete tactics for each Teil. The format and scoring facts follow the free Übungssatz published by g.a.s.t.; the tips and wording in this guide are this trainer's own.</p>

<div class="guide-toc">
  <a href="#g-what">What the DTZ is</a>
  <a href="#g-structure">Structure &amp; timing</a>
  <a href="#g-scoring">Scoring &amp; certificate</a>
  <a href="#g-hoeren">Crack: Hören</a>
  <a href="#g-lesen">Crack: Lesen</a>
  <a href="#g-schreiben">Crack: Schreiben</a>
  <a href="#g-sprechen">Crack: Sprechen</a>
  <a href="#g-dayof">Exam day</a>
  <a href="#g-source">Source</a>
</div>

<h2 id="g-what">1. What the DTZ is</h2>
<div class="card">
<p>The <b>Deutsch-Test für Zuwanderer (DTZ)</b> is the final exam (<b>Abschlussprüfung</b>) of the Integrationskurs. It covers the levels <b>A2 to B1</b>, so one sitting can end in a <b>Zertifikat A2</b> or a <b>Zertifikat B1</b> — the level you reach decides which.</p>
<p>The exam is not one test with one pass mark. It is built from <b>three separate results</b> — Hören + Lesen together, Schreiben, and Sprechen — and each of them is placed on the scale <b>unter A2 / A2 / B1</b>. The certificate follows from how the three results combine (see section 3).</p>
<div class="callout"><b>There is no Sprachbausteine module.</b> The gap-fill task, where you complete a letter, is simply the last Teil of Lesen (Teil 5).</div>
</div>

<h2 id="g-structure">2. Structure &amp; timing</h2>
<div class="card">
<p><b>Written part: 100 minutes, no breaks, in this order: Hören ca. 25 min → Lesen 45 min → Schreiben 30 min.</b> The oral part, Sprechen, is a pair exam of ca. 16 minutes. The order of the four parts is Hören, Lesen, Schreiben, Sprechen.</p>

<p><b>Hören — 20 items, 4 Teile</b></p>
<ul>
<li><b>Teil 1</b> — Ansagen am Telefon und öffentliche Durchsagen verstehen · 4 items (+ Beispiel) · a/b/c, one item per Ansage.</li>
<li><b>Teil 2</b> — kurze Informationen in den Medien (Radio) verstehen · 5 items · a/b/c, one item per Ansage.</li>
<li><b>Teil 3</b> — alltägliche Gespräche verstehen · 8 items (+ Beispiel) · 4 Gespräche, each with <b>one richtig/falsch item and one a/b/c item</b>.</li>
<li><b>Teil 4</b> — unterschiedliche Meinungen zu einem Thema verstehen · 3 items (+ Beispiel) · you match 3 statements to six sentences, a–f; you get <b>1 minute to read the six sentences first</b>.</li>
</ul>

<p><b>Lesen — 25 items, 5 Teile</b></p>
<ul>
<li><b>Teil 1</b> — Kataloge, Register, Verzeichnisse verstehen (for example a building directory) · 5 items (+ Beispiel) · a/b/c per situation; one option can be a "none of the listed" answer such as "in einem anderen Stockwerk".</li>
<li><b>Teil 2</b> — Informationen in Anzeigen verstehen · 5 items · match 5 situations to 8 ads, a–h. <b>Exactly one situation has no matching ad — you mark it X.</b></li>
<li><b>Teil 3</b> — Pressetexte und formelle Mitteilungen verstehen · 6 items · 3 texts, each with <b>one richtig/falsch item and one a/b/c item</b>.</li>
<li><b>Teil 4</b> — Informationsbroschüren verstehen · 3 items · one text, 3 richtig/falsch statements.</li>
<li><b>Teil 5</b> — Wörter in einem Brief ergänzen · 6 items (+ Beispiel) · a letter with 6 gaps, a/b/c each.</li>
</ul>

<p><b>Schreiben — one task, 30 minutes.</b> You choose <b>Aufgabe A or Aufgabe B</b>. Each is a halbformelle or formelle Mitteilung (an E-Mail or a Brief) with <b>4 Leitpunkte</b>.</p>

<p><b>Sprechen — 3 Teile, 5 rated sub-tasks, ca. 16 minutes, in pairs.</b></p>
<ul>
<li><b>Teil 1 (ca. 4 min in total)</b> — <b>1A</b> über sich sprechen, guided by the keywords Name, Geburtsort, Wohnort, Arbeit/Beruf, Familie, Sprachen · <b>1B</b> auf Nachfragen reagieren.</li>
<li><b>Teil 2 (ca. 6 min in total)</b> — <b>2A</b> über Erfahrungen sprechen: you describe a photo ("Was sehen Sie? Was für eine Situation?"), and each candidate has a different photo · <b>2B</b> auf Nachfragen reagieren: the examiner asks about your own experience, with separate A2-level and B1-level questions.</li>
<li><b>Teil 3 (ca. 6 min)</b> — gemeinsam etwas planen. Both of you work from the same task sheet: a situation, a task, and about five notes that end in "…?".</li>
</ul>
<p>The official material also mentions about 20 minutes for the pair in total, including about 4 minutes in which the examiners deliberate.</p>
</div>

<h2 id="g-scoring">3. Scoring &amp; certificate</h2>
<div class="card">
<p>There are <b>three results</b>, and each lands on the scale <b>B1 / A2 / unter A2</b>.</p>

<p><b>Result 1 — Hören + Lesen: 45 items, 1 point each, maximum 45.</b><br>
<b>33–45 = B1 · 20–32 = A2 · 0–19 = unter A2.</b></p>

<p><b>Result 2 — Schreiben: four criteria, maximum 20.</b><br>
I <b>Aufgabenbewältigung</b> (did you deal with the Leitpunkte?) · II <b>Kommunikative Gestaltung</b> · III <b>Korrektheit</b> · IV <b>Wortschatz</b>. Each criterion is rated on six steps: <b>B1 gut erfüllt 5 · B1 erfüllt 4 · A2 gut erfüllt 3 · A2 erfüllt 2 · A1 1 · 0</b>.<br>
For Aufgabenbewältigung the steps are tied to the Leitpunkte: 5 = all four, precisely · 4 = all four, or three adequately · 3 = three or two · 2 = two or one · 1 = only one · 0 = none, or the topic missed.<br>
<b>15–20 = B1 · 7–14 = A2 · 0–6 = unter A2.</b> A text that has nothing to do with the task gets 0 on every criterion.</p>

<p><b>Result 3 — Sprechen: maximum 100.</b><br>
<b>Sum 1, Aufgabenbewältigung per sub-task (50):</b> 1A = 5 · 1B = 5 · 2A = 10 · 2B = 10 · 3 = 20.<br>
<b>Sum 2, language over the whole exam (50):</b> Aussprache/Intonation 10 · Flüssigkeit 10 · Korrektheit 15 · Wortschatz 15.<br>
Every scale has six steps: B1 gut erfüllt (100%) · B1 erfüllt (80%) · A2 gut erfüllt (60%) · A2 erfüllt (40%) · A1 (20%) · 0. Your final mark is the <b>mean of the two examiners</b>.<br>
<b>75–100 = B1 · 35–74.5 = A2 · 0–34.5 = unter A2.</b></p>

<div class="callout"><b>The certificate rule.</b><br>
· Sprechen <b>unter A2</b> → <b>no certificate</b>, whatever else you scored.<br>
· <b>Zertifikat B1:</b> Sprechen B1 <b>and</b> (Hören + Lesen B1 <b>or</b> Schreiben B1).<br>
· <b>Zertifikat A2:</b> otherwise, Sprechen at least A2 <b>and</b> (Hören + Lesen at least A2 <b>or</b> Schreiben at least A2).<br>
· Anything else → no certificate (unter A2).</div>

<p><b>What that means for you:</b> Sprechen is the gate. A strong written result cannot rescue an oral result below A2. Past that gate, the written side is an either/or: one good result — Hören + Lesen, or Schreiben — is enough for the level it reaches. So you do not need to be strong at everything at once; you need a reliable Sprechen and one solid written strength.</p>
</div>

<h2 id="g-hoeren">4. Crack: Hören (ca. 25 minutes, 20 items)</h2>
<div class="card">
<div class="tactic"><b>Teil 1 and 2: the question is a filter, not decoration.</b> An Ansage often contains several numbers, times or places; only one of them answers the item. Read the question and the three options first, then listen for that one piece of information. The other numbers are there to be ignored.</div>
<div class="tactic"><b>Teil 1: listen for the purpose.</b> A telephone message or a station announcement has a job — cancel, change, ask for a call back. Many wrong options give you a true detail from the recording but not the point of the message.</div>
<div class="tactic"><b>Teil 3: every Gespräch has two items — mark which one is which.</b> The richtig/falsch item checks one detail. The a/b/c item usually checks the outcome or the reason. Underline the key word of each item before the Gespräch starts.</div>
<div class="tactic"><b>Teil 4: use the minute you get first.</b> Read all six sentences a–f, and underline in each one the word that carries its opinion (for example a reason, a wish, a complaint). There are more sentences than statements, so some sentences are never used — do not try to force a match.</div>
<div class="tactic"><b>Teil 4: match the opinion, not the topic.</b> Every speaker talks about the same subject, so the shared nouns tell you nothing. Listen for what the speaker thinks about it.</div>
<div class="tactic"><b>Correction signals flip the answer:</b> nicht … sondern · leider · doch nicht · stattdessen · eigentlich … aber. A speaker who says "um vier Uhr — nein, um halb fünf" means the second time.</div>
<div class="tactic"><b>Never leave an item empty.</b> A wrong answer costs nothing — every item is worth 1 point if right and 0 if not.</div>
</div>

<h2 id="g-lesen">5. Crack: Lesen (45 minutes, 25 items)</h2>
<div class="card">
<div class="tactic"><b>Plan your own clock.</b> You have one 45-minute block for 25 items, about 1.8 minutes per item on average. Decide your order before the exam and glance at your watch after each Teil; the short Teile at the start should be fast, so that Teil 3 and Teil 5 get the time they need.</div>
<div class="tactic"><b>Teil 1 (Verzeichnis): read the situation first, then scan the directory.</b> Decide what you are looking for — a person, a department, a floor — and only then run your eyes down the list. Reading the whole directory from the top wastes the time you do not have. Check the "none of the listed" option before you settle on a near match.</div>
<div class="tactic"><b>Teil 2 (Anzeigen): one situation has no ad — that one is X.</b> Do the clear matches first and cross each ad off. Then look at the situations left over. The one that fails on a hard fact — a price, an age, a day, a place — is the X. Tempting extra ads usually fit the topic but break one detail.</div>
<div class="tactic"><b>Teil 2: pull the hard facts out of the situation first</b> — who, what, when, where, how much — then check the ads for each one.</div>
<div class="tactic"><b>Teil 3 (Pressetext, Mitteilung): two items per text, two different jobs.</b> The richtig/falsch item checks one statement against one place in the text. The a/b/c item asks for the main point or a reason. Wrong options often repeat a word from the text in a sentence that quietly changes its meaning.</div>
<div class="tactic"><b>Teil 4 (Broschüre): find the sentence, then compare.</b> Locate the passage the statement is about, and compare numbers, days, conditions and negations word by word. "Plausible" is not "stated".</div>
<div class="tactic"><b>Teil 5 (Brief ergänzen): read the whole sentence, and the sentence before it.</b> The gaps test small grammar words and connectors. The word before the gap often fixes the case; the sentence logic fixes whether you need weil, obwohl, deshalb or trotzdem.</div>
<div class="tactic"><b>Never leave an item blank.</b> A wrong answer costs nothing.</div>
</div>

<h2 id="g-schreiben">6. Crack: Schreiben (30 minutes, one task)</h2>
<div class="card">
<div class="tactic"><b>Choose A or B in the first minute, and stay with your choice.</b> Pick the task whose four Leitpunkte you can already say in German. Do not choose by topic you like — choose by words you own.</div>
<div class="tactic"><b>Four Leitpunkte, four paragraphs or clear blocks.</b> Result I (Aufgabenbewältigung) is tied directly to how many Leitpunkte you cover: all four precisely earns the top step. Tick each one off on the task sheet as you write it, and give each at least one full sentence with a reason or a detail.</div>
<div class="tactic"><b>Follow the instruction: "Zeigen Sie, was Sie können. Schreiben Sie möglichst viel. Vergessen Sie nicht die Anrede und den Gruß."</b> There is no word count in the task, so the instruction itself is your guide: write fully, and show your range. Do not stop after the bare minimum.</div>
<div class="tactic"><b>Anrede and Gruß are part of the task.</b> Formal: "Sehr geehrte Frau …, / Sehr geehrter Herr …," and "Mit freundlichen Grüßen". Halbformell, to someone you know a little: "Liebe Frau …," / "Lieber Herr …," and "Viele Grüße". Write the first word after the comma in lower case.</div>
<div class="tactic"><b>Show your range for criteria II–IV.</b> Use a few different connectors (weil, deshalb, trotzdem, obwohl, wenn), a polite request in Konjunktiv II ("Könnten Sie mir bitte …?"), and the precise noun instead of "Ding" or "Sache". Short, correct sentences score better than long ones that fall apart.</div>
<div class="tactic"><b>Keep time for a check.</b> Check last: verb position, capital letters on nouns and on Sie/Ihnen/Ihr, the Anrede, the Gruß, and all four Leitpunkte. Also check you really wrote about the task — a text unrelated to the task gets 0 on every criterion.</div>
</div>

<h2 id="g-sprechen">7. Crack: Sprechen (ca. 16 minutes, in pairs)</h2>
<div class="card">
<div class="callout"><b>Sprechen is the gate.</b> A result below A2 means no certificate at all (section 3). It is also the part you can improve fastest by talking aloud — every day, even alone.</div>
<div class="tactic"><b>Teil 1A (über sich sprechen):</b> work through the keywords in order — Name, Geburtsort, Wohnort, Arbeit/Beruf, Familie, Sprachen — with one or two full sentences each. This is only 5 of the 100 points, but it is your warm-up, so make it automatic.</div>
<div class="tactic"><b>Teil 1B (auf Nachfragen reagieren):</b> answer the question you were asked, then add one detail. A one-word answer gives the examiner nothing to rate.</div>
<div class="tactic"><b>Teil 2A (Bild beschreiben) is worth 10 points.</b> Follow a fixed route: Wo ist das? Wer ist zu sehen? Was machen die Menschen? Wie ist die Stimmung? Say what you see, and if you do not know a word, describe it ("dieses Ding, mit dem man …").</div>
<div class="tactic"><b>Teil 2B (eigene Erfahrungen) is worth 10 points.</b> The examiner has A2-level and B1-level questions. Answer with a real example from your own life — "Bei mir war das so: …" — and give a reason. A reasoned answer with an example shows B1.</div>
<div class="tactic"><b>Teil 3 (gemeinsam planen) is the biggest single task: 20 of 100 points.</b> Use the five notes on the sheet as your agenda. Make a suggestion, react to your partner's suggestion (agree, or decline and offer an alternative), and finish with a decision both of you have said out loud.</div>
<div class="tactic"><b>Language counts over the whole exam, not per task:</b> Aussprache/Intonation, Flüssigkeit, Korrektheit and Wortschatz together are the other 50 points. Speak clearly and keep going; repair a mistake quickly instead of stopping.</div>
<div class="tactic"><b>Your partner is a part of the exam, not an obstacle.</b> If your partner is quiet, ask a question ("Und was denken Sie?"). If your partner talks a lot, wait for a pause and add your own point. Either way, you are doing Teil 3 well.</div>
<div class="tactic"><b>If you do not understand a question, say so in German.</b> "Entschuldigung, könnten Sie das bitte wiederholen?" is a perfectly good sentence — much better than silence.</div>
</div>

<h2 id="g-dayof">8. Exam day</h2>
<div class="card">
<div class="tactic"><b>The written part is one 100-minute sitting without breaks.</b> Eat and drink beforehand, go to the toilet before the start, and bring a pen that works.</div>
<div class="tactic"><b>Bring your ID and your invitation letter.</b> Check the letter for the time and place of each part, including Sprechen — do not assume.</div>
<div class="tactic"><b>Fill every box.</b> A blank is a guaranteed 0, and a guess is a real chance. This applies to every a/b/c and richtig/falsch item in Hören and Lesen.</div>
<div class="tactic"><b>Know your target before the day.</b> Which level do you want? For B1 you need Sprechen at B1 and either Hören + Lesen at B1 (33 of 45) or Schreiben at B1 (15 of 20). Knowing that, you know where to spend your last practice hours.</div>
</div>

<h2 id="g-source">9. Source</h2>
<div class="card">
<p>The format and scoring facts in this guide follow the free <b>Übungssatz</b> published by <b>g.a.s.t.</b> — see <a href="https://www.gast.de/dtz" target="_blank" rel="noopener noreferrer">gast.de/dtz</a> for the official DTZ materials. The Modelltests in this trainer are original texts written to that format; nothing from the Übungssatz is copied. Where the official material gives no figure — how often a recording is played, the minutes per Teil inside Hören and Lesen, a word count for Schreiben, or preparation time before Sprechen — this guide gives none either. Check your own exam invitation for those details.</p>
</div>
`;
