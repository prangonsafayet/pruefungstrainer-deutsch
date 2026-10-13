import { type LearnPlan } from '@shared/types/learn.ts';

/* The DTZ 28-day curriculum: cheatsheets and the copy-paste AI tutor prompts.
   `intro` and every `cheatsheets[].html` are authored HTML and are injected; all other
   strings are plain text and are rendered as text. Days 1–14 are the core tier and are
   always scheduled; days 15–28 deepen towards a confident certificate when the runway
   leaves room.

   Format facts come from docs/dtz-format.local.md only. Nothing here states how often a
   Hören text is played, minutes per Teil inside Hören/Lesen, a Schreiben word count, or
   preparation time before Sprechen — the source does not give them. */
export const DTZ_CURRICULUM: LearnPlan = {
  /* The prompts address the AI in German; two that interview in English say so themselves. */
  aiPromptLang: 'de',
  intro: `This plan adapts to your <b>DTZ exam date</b> — set it in Settings and the days re-pace themselves.
  Each day = vocabulary in the practice hub + one grammar or skill focus + an <b>AI practice session</b>: copy the prompt into Claude (or any AI chat) and it becomes your tutor, examiner or speaking partner.
  The DTZ ends in a <b>Zertifikat A2 or B1</b>, built from three results: Hören + Lesen, Schreiben and Sprechen. Sprechen is the gate, so it appears in the plan from day 12 onwards and again and again.
  Days 1–14 are the <b>core curriculum</b> and are always scheduled; days 15–28 deepen everything — Konjunktiv II, formal letters, picture description, full mock sittings — when your date leaves room.`,

  cheatsheets: {
    schreiben: {
      title: 'Schreiben: the formal and half-formal message',
      html: `<p><b>The task:</b> one of <b>Aufgabe A or B</b>, a halbformelle or formelle Mitteilung (E-Mail or Brief) with <b>4 Leitpunkte</b>, 30 minutes. The instruction: <i>Zeigen Sie, was Sie können. Schreiben Sie möglichst viel. Vergessen Sie nicht die Anrede und den Gruß.</i></p>
<p><b>Four criteria, 0–5 each (max 20):</b> I Aufgabenbewältigung (the Leitpunkte) · II Kommunikative Gestaltung · III Korrektheit · IV Wortschatz. <b>15–20 = B1 · 7–14 = A2.</b> For I: all four Leitpunkte precisely = 5, only one = 1.</p>
<p><b>Fixed skeleton — memorize it:</b></p>
<p>1. <b>Anrede:</b> Sehr geehrte Frau Weber, / Sehr geehrter Herr Braun, (formal) · Liebe Frau Weber, / Lieber Herr Braun, (half-formal, someone you know a little) · Sehr geehrte Damen und Herren, (name unknown) — then the next word in lower case!<br>
2. <b>Einstieg (1 sentence):</b> ich schreibe Ihnen, weil … · vielen Dank für Ihre Nachricht. · ich habe Ihre Anzeige gelesen und interessiere mich für …<br>
3. <b>The four Leitpunkte, one block each — Redemittel:</b><br>
&nbsp;&nbsp;· <b>informieren:</b> Ich möchte Ihnen mitteilen, dass … · Ich wohne seit … in …<br>
&nbsp;&nbsp;· <b>begründen / entschuldigen:</b> Leider kann ich nicht kommen, weil … · Entschuldigen Sie bitte, dass … · Ich war krank, deshalb …<br>
&nbsp;&nbsp;· <b>bitten (Konjunktiv II):</b> Könnten Sie mir bitte sagen, wann …? · Ich wäre Ihnen dankbar, wenn … · Würden Sie mir bitte einen Termin geben?<br>
&nbsp;&nbsp;· <b>vorschlagen:</b> Wie wäre es mit Dienstag? · Ich schlage vor, dass wir … · Können wir den Termin verschieben?<br>
&nbsp;&nbsp;· <b>sich beschweren:</b> Leider funktioniert … nicht. · Ich bitte Sie, das Problem bis … zu lösen.<br>
&nbsp;&nbsp;· <b>nachfragen:</b> Ich habe noch eine Frage: … · Wissen Sie, ob …?<br>
4. <b>Schluss:</b> Ich freue mich auf Ihre Antwort. · Vielen Dank im Voraus.<br>
5. <b>Gruß:</b> Mit freundlichen Grüßen (formal) · Viele Grüße (half-formal) + full name. Never "LG" or "Tschüss".</p>
<p><b>Checklist:</b> task A or B chosen in the first minute? All 4 Leitpunkte ticked off? Anrede AND Gruß present? Sie/Ihnen/Ihr capitalized? At least three different connectors (weil, deshalb, trotzdem, obwohl, wenn)? Verb in position 2 in main clauses, at the end after weil/dass? A text unrelated to the task scores 0 on every criterion — stay on topic.</p>`
    },
    sprechen: {
      title: 'Sprechen: Redemittel for all five sub-tasks',
      html: `<p><b>Teil 1A — über sich sprechen.</b> Keywords: Name, Geburtsort, Wohnort, Arbeit/Beruf, Familie, Sprachen. Ich heiße … und komme aus … · Ich bin in … geboren. · Ich wohne seit … in … · Ich arbeite als … / Ich suche eine Arbeit als … · Ich bin verheiratet und habe zwei Kinder. · Ich spreche … und lerne Deutsch seit …<br>
<b>Teil 1B — auf Nachfragen reagieren:</b> answer, then add one detail. Das ist eine gute Frage. Also: … · Ja, das stimmt. Außerdem … · Nein, leider nicht, aber …</p>
<p><b>Teil 2A — ein Bild beschreiben</b> (Was sehen Sie? Was für eine Situation?): follow a route.<br>
<b>Ort:</b> Das Foto zeigt … · Das ist wahrscheinlich in …/bei …<br>
<b>Personen:</b> Auf dem Bild sehe ich … · Links/rechts/in der Mitte/im Hintergrund …<br>
<b>Tätigkeit:</b> Die Frau gibt dem Mann … · Sie sprechen über …<br>
<b>Stimmung &amp; Vermutung:</b> Sie sind wohl … · Ich glaube, dass … · Es sieht so aus, als ob …<br>
<b>Unknown word?</b> Describe it: das ist ein Ding, mit dem man … · Wie sagt man …?</p>
<p><b>Teil 2B — über eigene Erfahrungen sprechen</b> (the examiner asks both A2-level and B1-level questions): Bei mir war das so: … · Ich habe die Erfahrung gemacht, dass … · In meinem Heimatland ist das anders, dort … · Als ich neu in Deutschland war, … · Ich finde es gut/schlecht, dass …, weil …</p>
<p><b>Teil 3 — gemeinsam etwas planen</b> (20 of 100 points): use the notes on the task sheet as your agenda and reach a decision.<br>
<b>Vorschläge machen:</b> Wollen wir …? · Wie wäre es mit …? · Ich schlage vor, dass wir … · Wir könnten …<br>
<b>Zustimmen:</b> Gute Idee! · Das finde ich auch gut. · Einverstanden. · Das passt mir gut.<br>
<b>Ablehnen + Alternative:</b> Das ist leider schwierig, weil … Vielleicht könnten wir stattdessen … · Ich bin nicht sicher. Wie wäre es lieber mit …?<br>
<b>Nachfragen:</b> Und was denkst du? · Hast du eine andere Idee? · Wer bringt was mit?<br>
<b>Abschluss:</b> Gut, dann machen wir das so. · Dann treffen wir uns am … um … Uhr.</p>
<p><b>Repair phrases (gold on exam day):</b> Wie bitte? · Könnten Sie das bitte wiederholen? · Entschuldigung, das habe ich nicht verstanden. · Einen Moment, ich überlege kurz. · Ich meine …</p>
<p><b>Scoring reminder:</b> 5 + 5 + 10 + 10 + 20 points for the five sub-tasks, plus 50 for language over the whole exam (Aussprache/Intonation, Flüssigkeit, Korrektheit, Wortschatz). <b>75–100 = B1 · 35–74.5 = A2.</b></p>`
    },
    konnektoren: {
      title: 'Konnektoren & Wortstellung',
      html: `<p><b>Group 1 — Position 0 (word order unchanged):</b> und, aber, oder, denn, sondern → "Ich lerne viel, <b>denn</b> ich will die Prüfung bestehen."</p>
<p><b>Group 2 — verb to the END (Nebensatz):</b> weil, dass, wenn, als, obwohl, damit, bevor, nachdem, ob → "Ich lerne weiter, <b>obwohl</b> ich müde <b>bin</b>." Nebensatz first? The main verb comes directly after the comma: "Weil ich krank war, <b>habe</b> ich den Termin abgesagt."</p>
<p><b>Group 3 — verb directly after (inversion):</b> deshalb, deswegen, trotzdem, außerdem, dann, danach, sonst → "Die Kita ist geschlossen, <b>deshalb bleibe</b> ich heute zu Hause."</p>
<p><b>weil vs. obwohl vs. deshalb vs. trotzdem</b> — the Lesen Teil 5 classic:<br>
weil = reason (Ich bleibe, <b>weil</b> es regnet.) · obwohl = unexpected contrast (Ich gehe, <b>obwohl</b> es regnet.) · deshalb = consequence (Es regnet, <b>deshalb</b> bleibe ich.) · trotzdem = contrast as a main clause (Es regnet, <b>trotzdem gehe</b> ich.)</p>
<p><b>wenn vs. als vs. ob:</b> wenn = repeated or future (Wenn ich Zeit habe, …) · als = one time in the past (Als ich ankam, …) · ob = indirect yes/no question (Ich weiß nicht, <b>ob</b> das Amt heute offen ist.)</p>
<p><b>dass:</b> after opinions and information → Ich finde, dass …· Ich möchte Ihnen mitteilen, dass … · Es ist wichtig, dass …</p>
<p><b>damit vs. um … zu:</b> same subject → um … zu (Ich rufe an, <b>um</b> einen Termin <b>zu</b> vereinbaren.) · different subjects → damit (Ich schreibe, <b>damit</b> Sie mir einen Termin geben.)</p>
<p><b>Easy extras:</b> nicht nur … sondern auch · entweder … oder · zuerst … dann … danach … schließlich (for the order of events).</p>`
    },
    kasus: {
      title: 'Kasus & Präpositionen',
      html: `<table class="history"><tr><th></th><th>Maskulin</th><th>Feminin</th><th>Neutrum</th><th>Plural</th></tr>
<tr><td><b>Nominativ</b></td><td>der / ein</td><td>die / eine</td><td>das / ein</td><td>die / –</td></tr>
<tr><td><b>Akkusativ</b></td><td><b>den / einen</b></td><td>die / eine</td><td>das / ein</td><td>die / –</td></tr>
<tr><td><b>Dativ</b></td><td><b>dem / einem</b></td><td><b>der / einer</b></td><td><b>dem / einem</b></td><td><b>den …n</b></td></tr></table>
<p><b>Always Akkusativ:</b> für, ohne, gegen, um, durch, bis → Das Formular ist für <b>den</b> Vermieter. · Ich komme ohne <b>meinen</b> Mann.<br>
<b>Always Dativ:</b> mit, nach, aus, zu, von, bei, seit, gegenüber → Ich gehe zu <b>der</b> Ausländerbehörde. · Ich wohne seit <b>einem</b> Jahr hier. · Ich komme aus <b>dem</b> Büro.</p>
<p><b>Wechselpräpositionen</b> (in, an, auf, über, unter, vor, hinter, neben, zwischen): Wohin? → Akkusativ (Ich gehe <b>in die</b> Bank.) · Wo? → Dativ (Ich bin <b>in der</b> Bank.)</p>
<p><b>Verbs with Dativ:</b> helfen, danken, gehören, gefallen, gratulieren, antworten → Können Sie <b>mir</b> helfen? · Das Auto gehört <b>meinem</b> Nachbarn.</p>
<p><b>Verbs with a fixed preposition:</b> warten auf + Akk. · sich bewerben um + Akk. · sich kümmern um + Akk. · sich interessieren für + Akk. · teilnehmen an + Dat. · fragen nach + Dat. · sich anmelden bei + Dat. · Learn the preposition together with its case.</p>
<p><b>Adjektivendungen — the 3-second rule:</b> after der/die/das → <b>-e</b> or <b>-en</b> (der neu<b>e</b> Antrag, den neu<b>en</b> Antrag). After ein/kein/mein the adjective shows the gender where "ein" cannot: ein neu<b>er</b> Antrag, ein neu<b>es</b> Formular. Dativ singular is ALWAYS -en: mit dem neu<b>en</b> Formular.</p>
<p><b>Time expressions:</b> jeden Tag, nächste Woche, letzten Monat → Akkusativ · am Montag, im Januar, um 8 Uhr, in einer Woche → Dativ.</p>`
    },
    verben: {
      title: 'Verben: Perfekt, Modalverben, trennbare Verben, Konjunktiv II',
      html: `<p><b>Perfekt (speaking and letters) = haben/sein + Partizip II.</b> <b>sein</b> for movement and change of state: gegangen, gefahren, gekommen, umgezogen, geblieben, passiert, gewesen. Everything else: <b>haben</b> (Ich habe einen Antrag gestellt.).</p>
<p><b>Partizip II patterns:</b> regular ge…t (gemacht, gearbeitet) · irregular ge…en (gesprochen, geschrieben, gefunden) · no ge- for verbs ending in -ieren and for inseparable prefixes be-, ver-, er-, ent-, zer- (telefoniert, bezahlt, verstanden, bekommen) · separable verbs: ge in the middle (angemeldet, abgeholt, eingezogen).</p>
<p><b>Trennbare Verben:</b> main clause → the prefix goes to the end (Ich <b>melde</b> mich beim Amt <b>an</b>. · Der Kurs <b>fängt</b> um 9 Uhr <b>an</b>.) · Nebensatz → one word (…, weil ich mich <b>anmelde</b>.) · with a modal verb → infinitive (Ich muss mich <b>anmelden</b>.) · typical: anmelden, abmelden, ausfüllen, abholen, einziehen, ausziehen, einreichen, vorbeibringen, nachfragen, mitbringen.</p>
<p><b>Modalverben:</b> können (Möglichkeit/Erlaubnis) · müssen (Pflicht) · dürfen (Erlaubnis) · sollen (Auftrag) · wollen (Wunsch) · möchten (höflicher Wunsch). The modal verb is in position 2, the infinitive at the END: Sie <b>müssen</b> das Formular bis Freitag <b>abgeben</b>. Präteritum of modals (very common in texts): konnte, musste, wollte, durfte, sollte.</p>
<p><b>Präteritum to recognize in Lesen:</b> war · hatte · gab · ging · kam · fuhr · sah · nahm · fand · blieb · wurde.</p>
<p><b>Konjunktiv II for politeness (Schreiben &amp; Sprechen):</b><br>
Könnten Sie mir bitte helfen? · Würden Sie mir bitte einen Termin geben? · Ich hätte gern einen Termin. · Ich möchte gern … · Wäre es möglich, den Termin zu verschieben? · Ich wäre Ihnen dankbar, wenn …<br>
<b>Ratschläge:</b> Sie sollten … · An Ihrer Stelle würde ich …</p>
<p><b>Passiv (Mitteilungen, Lesen Teil 3):</b> werden + Partizip II → Das Formular <b>wird</b> online <b>ausgefüllt</b>. · Der Antrag <b>muss</b> unterschrieben <b>werden</b>. Recognize it; you rarely need to write it.</p>`
    },
    alltag: {
      title: 'Alltag: Behörden, Wohnen, Arbeit & Formulare',
      html: `<p><b>Ämter und Stellen:</b> das Einwohnermeldeamt / das Bürgeramt (<i>sich anmelden, die Meldebescheinigung</i>) · die Ausländerbehörde (<i>die Aufenthaltserlaubnis, den Aufenthaltstitel verlängern</i>) · das Jobcenter / die Agentur für Arbeit (<i>arbeitslos melden, der Bewilligungsbescheid, Arbeitslosengeld beantragen</i>) · das Standesamt · das Finanzamt (<i>die Steuererklärung, die Steuernummer</i>) · die Krankenkasse (<i>die Versicherungskarte, die Krankmeldung</i>) · die Bank (<i>das Konto eröffnen, die Überweisung, der Dauerauftrag</i>).</p>
<p><b>Formulare:</b> der Antrag (<i>stellen, ausfüllen, einreichen, unterschreiben</i>) · die Unterlagen (<i>mitbringen, vorlegen</i>) · die Frist (<i>die Frist einhalten, bis zum … abgeben</i>) · die Bescheinigung · die Anmeldung · der Nachweis · die Gebühr · der Bescheid · der Widerspruch.</p>
<p><b>Termin:</b> einen Termin vereinbaren / absagen / verschieben · die Sprechzeiten · geöffnet / geschlossen · eine Nummer ziehen · aufgerufen werden · Bitte bringen Sie Ihren Pass mit.</p>
<p><b>Wohnen:</b> der Mietvertrag · die Kaltmiete / Warmmiete · die Nebenkosten (<i>die Nachzahlung, die Abrechnung</i>) · die Kaution · der Vermieter / die Vermieterin · der Hausmeister · die Hausordnung · kündigen (<i>die Kündigungsfrist</i>) · die Wohnungsübergabe · der Mangel (<i>den Mangel melden</i>) · die Reparatur.</p>
<p><b>Arbeit:</b> sich bewerben (um) · die Bewerbung / der Lebenslauf · das Vorstellungsgespräch · der Arbeitsvertrag · die Probezeit · das Gehalt / der Lohn · die Überstunden · krankmelden / die Krankmeldung · die Kündigung.</p>
<p><b>Familie &amp; Schule:</b> die Kita · der Kindergarten · der Elternabend · die Einladung · das Zeugnis · die Entschuldigung (<i>für das Kind</i>) · die Klassenlehrerin · der Elternbeitrag.</p>
<p><b>Gesundheit:</b> der Hausarzt / der Facharzt · die Überweisung (<i>from the Hausarzt; also: bank transfer!</i>) · das Rezept · die Apotheke · die Krankenkasse · die Praxis · der Impftermin.</p>
<p><b>Typical phrases in letters:</b> Hiermit melde ich mich … an. · Ich beantrage … · Ich möchte meinen Vertrag zum … kündigen. · Bitte bestätigen Sie mir schriftlich, dass … · Anbei sende ich Ihnen … · Bitte rufen Sie mich zurück.</p>`
    },
    hoeren: {
      title: 'Hören: traps & technique',
      html: `<p><b>Rule 1 — read before you listen.</b> Use every moment before a task to read the items and the options, and underline the key word of each. In Teil 4 you get <b>1 minute</b> to read the six sentences a–f before you listen: use all of it.</p>
<p><b>Rule 2 — Teil by Teil.</b> Teil 1: Ansagen am Telefon and Durchsagen, 4 items · Teil 2: Radio, 5 items · Teil 3: four Gespräche, each with <b>one richtig/falsch + one a/b/c</b> · Teil 4: three statements, match each opinion to a sentence a–f.</p>
<p><b>The paraphrase trap:</b> the correct answer rarely uses the words of the item. "Der Termin fällt aus" in the item = "Wir müssen die Sprechstunde leider absagen" in the audio. Wrong options often repeat a word you DID hear — hearing a word is not hearing the meaning.</p>
<p><b>Correction signals (the answer flips!):</b> nicht … sondern · leider · doch nicht · stattdessen · eigentlich … aber · Achtung, eine Änderung: …</p>
<p><b>Number &amp; clock traps:</b> halb zehn = <b>9:30</b> · Viertel vor sieben = 6:45 · vierzehn (14) vs. vierzig (40) · zweiundzwanzig = 22, units FIRST · dates: am dritten Mai, am zwanzigsten · Telefonnummern einzeln oder in Gruppen.</p>
<p><b>Teil 3 — two jobs:</b> the richtig/falsch item checks one detail; the a/b/c item usually checks the result or the reason of the whole Gespräch.</p>
<p><b>Teil 4 — opinion, not topic:</b> all statements are about the same subject. Mark in each sentence a–f the word that carries the opinion (a wish, a complaint, a reason). There are more sentences than statements, so some sentences are never used.</p>
<p><b>Who says what:</b> in Gesprächen, items often ask about ONE speaker. The distractor is usually the other person's view.</p>
<p><b>Never leave an item empty:</b> a wrong answer costs nothing. <b>Daily routine:</b> 10 minutes of slow German news or radio, and say 5 sentences aloud after the speaker.</p>`
    },
    lesen: {
      title: 'Lesen: the five Teile',
      html: `<p><b>Budget:</b> 45 minutes, 25 items. This is about 1.8 minutes per item on average — set your own order and check your watch after each Teil.</p>
<p><b>Teil 1 — Verzeichnis (5 items, a/b/c):</b> read the situation first, then scan the directory for the one word that matters (a person, a department, a floor). Check whether option c is a "none of the listed" answer (for example "in einem anderen Stockwerk") before choosing a near match.</p>
<p><b>Teil 2 — Anzeigen (5 situations, 8 ads a–h):</b> pull out the hard facts — <b>who, what, when, where, how much</b>. <b>Exactly one situation has no ad: write X.</b> Do the sure matches first and cross the ads off. The leftover situation that breaks a hard fact in every remaining ad is your X.</p>
<p><b>Teil 3 — Pressetext, Mitteilung (3 texts × 2 items):</b> one richtig/falsch + one a/b/c per text. For richtig/falsch find ONE passage and compare numbers, days and negations word by word. For a/b/c ask: what is the main point or the reason?</p>
<p><b>Teil 4 — Broschüre (3 richtig/falsch):</b> find the sentence the statement is about. Plausible but not in the text = falsch.</p>
<p><b>Teil 5 — Brief ergänzen (6 gaps, a/b/c):</b> read the whole sentence and the one before it. Typical gaps: connectors (weil, obwohl, deshalb, trotzdem, dass), prepositions with the right case, verb forms, small words like "man", "es", "sich".</p>
<p><b>The three traps:</b> a number or day that is changed slightly · a word from the text inside a wrong option · "not mentioned" counts as falsch.</p>`
    }
  },

  days: [
    {
      day: 1,
      tier: 'core',
      title: 'Kick-off: the DTZ and the Kasus-Check',
      focus: 'Know the exam, then Akkusativ vs. Dativ',
      tasks: [
        'Read the DTZ exam guide: four parts, the three results (Hören + Lesen, Schreiben, Sprechen) and the certificate rule — Sprechen is the gate.',
        'Review the Kasus cheatsheet and the reference table in the practice hub, then take the quiz: 15 Kasus items.',
        {
          text: 'One flashcard session (20 cards) of nouns in the practice hub — this becomes your daily routine.',
          target: { kind: 'practice' }
        }
      ],
      cheats: ['kasus'],
      ai: [
        {
          t: 'Case drill',
          p: 'Du bist mein Deutschtrainer (Niveau A2–B1, Vorbereitung auf den Deutsch-Test für Zuwanderer). Stelle mir 15 Lückensätze aus dem Alltag, in denen ich zwischen Akkusativ und Dativ entscheiden muss — mit Präpositionen wie mit, für, in, zu, bei, nach. Korrigiere jede Antwort sofort und erkläre kurz auf Englisch, warum der Kasus richtig ist. Am Ende: meine drei häufigsten Fehler.'
        }
      ]
    },
    {
      day: 2,
      tier: 'core',
      title: 'Perfekt & trennbare Verben',
      focus: 'Talking about the past, and the prefix that jumps to the end',
      tasks: [
        {
          text: 'Study the verbs cheatsheet, then quiz: 15 verb forms in the practice hub.',
          target: { kind: 'quiz', category: 'verbs' }
        },
        'One flashcard session (20 cards) of verbs — say the Perfekt form aloud every time.',
        'Write 8 sentences about your last week at an office or a shop in Perfekt (Ich habe mich angemeldet. Ich bin zur Bank gegangen.), four of them with a trennbares Verb.'
      ],
      cheats: ['verben'],
      ai: [
        {
          t: 'Tense debrief',
          p: 'Du bist mein Deutschtrainer (Niveau A2–B1). Ich schreibe dir 8 Sätze über meine letzte Woche im Perfekt, einige mit trennbaren Verben. Korrigiere alle Fehler (haben/sein, Partizip II, Position des Verbs), erkläre die Korrekturen kurz auf Englisch und stelle mir danach mündlich weitere Fragen über gestern und letzte Woche, damit ich die Vergangenheit aktiv übe.'
        }
      ]
    },
    {
      day: 3,
      tier: 'core',
      title: 'Konnektoren & Wortstellung',
      focus: 'weil, dass, obwohl, deshalb — the three word-order groups',
      tasks: [
        'Learn the three connector groups from the cheatsheet: Position 0, verb to the end, inversion.',
        'Join 10 sentence pairs on paper: 4× weil, 3× obwohl, 3× deshalb — check the verb position every time.',
        {
          text: 'One flashcard session (20 cards) in the practice hub, category of your choice.',
          target: { kind: 'practice' }
        }
      ],
      cheats: ['konnektoren'],
      ai: [
        {
          t: 'Connector workout',
          p: 'Du bist mein Deutschtrainer (Niveau A2–B1). Gib mir 12 Satzpaare aus dem Alltag (Arzttermin, Wohnung, Arbeit), die ich mit einem passenden Konnektor verbinden muss (weil, dass, obwohl, deshalb, trotzdem, wenn). Ich schreibe den Satz, du korrigierst sofort — achte besonders auf die Verbposition — und erklärst den Unterschied kurz auf Englisch, wenn ich den falschen Konnektor wähle.'
        }
      ]
    },
    {
      day: 4,
      tier: 'core',
      title: 'Verben mit Präposition',
      focus: 'warten auf, sich kümmern um — fixed pairs, free points in Lesen Teil 5',
      tasks: [
        {
          text: 'Study the Verben-mit-Präposition reference table in the practice hub — mark the 10 you did not know.',
          target: { kind: 'practice', tab: 'tables' }
        },
        'One flashcard session (20 cards) of Verben mit Präposition.',
        'Write 10 own sentences with the pairs you marked, including 3 about an Amt (sich anmelden bei, einen Antrag stellen auf, sich kümmern um).'
      ],
      cheats: ['kasus'],
      ai: [
        {
          t: 'Preposition pairs',
          p: 'Du bist mein Deutschtrainer (Niveau A2–B1). Frage mich 15 Verben mit Präposition ab, die im Alltag mit Behörden, Arbeit und Familie vorkommen (z. B. warten auf, sich bewerben um, sich anmelden bei, teilnehmen an). Ich muss die Präposition UND den Kasus nennen und einen Beispielsatz bilden. Korrigiere sofort.'
        }
      ]
    },
    {
      day: 5,
      tier: 'core',
      title: 'Alltag: Behörden & Formulare',
      focus: 'The vocabulary behind half of the exam texts',
      tasks: [
        'Read the Alltag cheatsheet once, slowly. Mark the 15 words you could not explain in German or English.',
        'Two flashcard sessions (20 cards each): nouns with Behörde, Formular, Wohnung, Arbeit — always learn article + plural together.',
        'Write a list of 10 things you must organise as a new resident (sich anmelden, ein Konto eröffnen, …) and say each one aloud in a full sentence with müssen or wollen.'
      ],
      cheats: ['alltag'],
      ai: [
        {
          t: 'Behörden role play',
          p: 'Spiele mit mir Rollenspiele auf Deutsch (Niveau A2–B1): Ich bin Kunde beim Einwohnermeldeamt, bei der Krankenkasse oder bei der Bank, du bist der Mitarbeiter. Stelle einfache, realistische Fragen (Termin, Unterlagen, Frist, Gebühr). Korrigiere mich erst am Ende und nenne mir dann die 5 wichtigsten Wörter, die ich nicht kannte, mit Artikel und Plural.'
        }
      ]
    },
    {
      day: 6,
      tier: 'core',
      title: 'Lesen — Teil 1 and Teil 2',
      focus: 'Scan the directory; find the one ad that does not exist (X)',
      tasks: [
        {
          text: 'Read the Lesen cheatsheet, then take mock exam 1 → Lesen (Teil 1: Verzeichnis, a/b/c) — untimed.',
          target: { kind: 'module', exam: 1, module: 'lesen', teil: '1' }
        },
        {
          text: 'Take mock exam 1 → Lesen (Teil 2: Anzeigen, ein X): note for every situation the hard fact that decided it, and which situation was the X.',
          target: { kind: 'module', exam: 1, module: 'lesen', teil: '2' }
        },
        'Add every unknown word that blocked an answer to your flashcards (max 15).'
      ],
      cheats: ['lesen'],
      ai: [
        {
          t: 'Anzeigen trainer',
          p: 'Schreibe fünf kurze Situationen (je 2 Sätze, Alltag: Wohnung, Sprachkurs, Arzt, Kinderbetreuung, Arbeit) und acht kurze Anzeigen (a–h) im Stil des Deutsch-Tests für Zuwanderer. Genau eine Situation darf zu keiner Anzeige passen (dann schreibe ich X). Mach die falschen Anzeigen verlockend: Sie sollen thematisch passen, aber ein Detail (Preis, Tag, Ort, Alter) bricht. Ich antworte, du löst auf und nennst für jede Antwort das entscheidende Detail.'
        }
      ]
    },
    {
      day: 7,
      tier: 'core',
      title: 'Hören — Teil 1 and Teil 2',
      focus: 'Ansagen and radio news: listen for the one fact the question asks for',
      tasks: [
        'Read the Hören cheatsheet — especially the paraphrase trap and the correction signals.',
        {
          text: 'Take mock exam 1 → Hören (Teil 1: Ansagen am Telefon und Durchsagen, a/b/c) and mock exam 1 → Hören (Teil 2: Radio, a/b/c) in one go, no pausing.',
          target: { kind: 'module', exam: 1, module: 'hoeren' }
        },
        'Review every red item: was it a number, a paraphrase or a correction signal? Note the trap type.'
      ],
      cheats: ['hoeren'],
      ai: [
        {
          t: 'Paraphrase radar',
          p: 'Du bist mein Hörverstehen-Trainer (Deutsch-Test für Zuwanderer). Schreibe 8 kurze Ansagen (Telefonansage einer Arztpraxis, Durchsage im Bahnhof, Radiomeldung; je 3–4 Sätze, als Transkript) und zu jeder eine Frage mit drei Antworten a/b/c. Die richtige Antwort PARAPHRASIERT den Text, die falschen wiederholen ein Wort aus dem Text. Baue Korrektursignale ein (nicht … sondern, leider, stattdessen). Ich antworte, du löst auf.'
        }
      ]
    },
    {
      day: 8,
      tier: 'core',
      title: 'Hören — Teil 3 and Teil 4',
      focus: 'Two items per Gespräch; matching opinions to sentences a–f',
      tasks: [
        {
          text: 'Take mock exam 1 → Hören (Teil 3: Gespräche, je richtig/falsch + a/b/c): before each Gespräch, underline the key word of both items.',
          target: { kind: 'module', exam: 1, module: 'hoeren', teil: '3' }
        },
        {
          text: 'Take mock exam 1 → Hören (Teil 4: Meinungen, a–f zuordnen): use the minute before the audio to underline the opinion word in each of the six sentences.',
          target: { kind: 'module', exam: 1, module: 'hoeren', teil: '4' }
        },
        'Count your Hören items in Teil 1–4 (out of 20). Hören and Lesen are banded together out of 45 (33–45 = B1, 20–32 = A2), so keep this score and add your Lesen score (day 9) before you compare the sum with the bands.'
      ],
      cheats: ['hoeren'],
      ai: [
        {
          t: 'Meinungen-Trainer',
          p: 'Schreibe vier kurze Statements (je 3–4 Sätze, Transkript) von vier verschiedenen Personen zu demselben Alltagsthema (z. B. Kinderbetreuung, Wohnen in der Stadt oder auf dem Land). Dazu sechs Sätze a–f, die jeweils eine Meinung ausdrücken. Das erste Statement ist ein gelöstes Beispiel (nenne den passenden Satz). Ich ordne die drei anderen Statements zu, zwei Sätze bleiben übrig. Danach erklärst du, an welchem Wort ich die Meinung jeder Person erkenne.'
        }
      ]
    },
    {
      day: 9,
      tier: 'core',
      title: 'Lesen — Teil 3, 4 and 5',
      focus: 'Texts, brochure, and the letter with gaps',
      tasks: [
        {
          text: 'Take mock exam 2 → Lesen (Teil 3: Pressetexte und Mitteilungen) and mock exam 2 → Lesen (Teil 4: Informationsbroschüre, richtig/falsch).',
          target: { kind: 'module', exam: 2, module: 'lesen' }
        },
        {
          text: 'Take mock exam 2 → Lesen (Teil 5: Brief ergänzen): for every wrong gap, say the rule from the Konnektoren or Kasus cheatsheet.',
          target: { kind: 'module', exam: 2, module: 'lesen', teil: '5' }
        },
        'One flashcard session (20 cards) — include the words you collected on day 6.'
      ],
      cheats: ['lesen', 'konnektoren'],
      ai: [
        {
          t: 'Brief-Lücken',
          p: 'Erstelle eine Übung wie Teil 5 im Lesen des Deutsch-Tests für Zuwanderer: ein kurzer Brief (ca. 120 Wörter) einer Mieterin an den Vermieter mit 6 Lücken, je drei Optionen a/b/c. Teste Konnektoren (weil, obwohl, deshalb), Präpositionen mit Kasus und Verbformen. Nach meinen Antworten erklärst du jede Lücke in einem Satz auf Englisch. Dann ein neuer Brief zu einem anderen Thema (Krankenkasse, Kita, Arbeit).'
        }
      ]
    },
    {
      day: 10,
      tier: 'core',
      title: 'Checkpoint week 1+',
      focus: 'Consolidate before you write and speak',
      tasks: [
        'Review every red item from mock exam 1 and 2 in the review screen — out loud, with the rule.',
        'Flashcard sweep: repeat ALL cards from days 1–9; struggling cards go into a second session today.',
        'Quiz: 15 items in your weakest practice-hub category (be honest — the stats show it).'
      ],
      cheats: ['kasus', 'verben'],
      ai: [
        {
          t: 'Weak-point analysis',
          lang: 'en',
          p: 'Interview me in English about my first 9 days of Vorbereitung auf den Deutsch-Test für Zuwanderer: which part felt hardest (Hören, Lesen, Schreiben, Sprechen), which grammar topic keeps costing points. Then build a concrete 30-minute daily micro-plan for the next week targeting my two weakest areas. Danach: 10 schnelle deutsche Quizfragen genau zu diesen Schwächen, mit sofortiger Korrektur.'
        }
      ]
    },
    {
      day: 11,
      tier: 'core',
      title: 'Schreiben — the message with 4 Leitpunkte',
      focus: 'Choose A or B, cover all four Leitpunkte, Anrede and Gruß',
      tasks: [
        'Memorize the skeleton from the Schreiben cheatsheet: Anrede, Einstieg, four Leitpunkte, Schluss, Gruß.',
        {
          text: 'Take mock exam 1 → Schreiben: choose Aufgabe A or B in the first minute, write for 30 minutes, no dictionary.',
          target: { kind: 'module', exam: 1, module: 'schreiben' }
        },
        'Self-check: all four Leitpunkte? Anrede and Gruß? Three different connectors? Then rate yourself on the four criteria (0–5 each; 15–20 = B1, 7–14 = A2).'
      ],
      cheats: ['schreiben'],
      ai: [
        {
          t: 'Schreiben examiner',
          p: 'Du bist Prüfer für den Schreiben-Teil des Deutsch-Tests für Zuwanderer. Gib mir zwei Aufgaben A und B (halbformelle oder formelle E-Mail bzw. Brief, je 4 Leitpunkte, Alltagsthemen). Ich wähle eine und schreibe sie. Bewerte sie nach vier Kriterien mit je 0–5 Punkten: Aufgabenbewältigung (die Leitpunkte), kommunikative Gestaltung, Korrektheit, Wortschatz (5 = B1 gut erfüllt, 4 = B1 erfüllt, 3 = A2 gut erfüllt, 2 = A2 erfüllt, 1 = A1). Korrigiere jeden Fehler und zeige eine Musterversion.'
        },
        {
          t: 'Leitpunkt phrases',
          p: 'Gib mir für diese 6 Brief-Funktionen je 3 A2–B1-Redemittel zum Auswendiglernen: informieren, begründen/entschuldigen, höflich bitten (Konjunktiv II), vorschlagen, sich beschweren, nachfragen. Frage mich danach ab: Du nennst die Funktion, ich schreibe einen Satz, du korrigierst sofort.'
        }
      ]
    },
    {
      day: 12,
      tier: 'core',
      title: 'Sprechen — Teil 1 and Teil 2',
      focus: 'Über sich sprechen, Bild beschreiben, eigene Erfahrungen',
      tasks: [
        'Learn the Redemittel for Teil 1A, 1B, 2A and 2B from the Sprechen cheatsheet — say each set aloud 3 times.',
        'Record yourself: 90 seconds of Teil 1A (Name, Geburtsort, Wohnort, Arbeit/Beruf, Familie, Sprachen), then listen back and fix one thing.',
        {
          text: 'Take mock exam 1 → Sprechen (Teil 2A: Bild beschreiben): describe the photo aloud with the route Ort, Personen, Tätigkeit, Stimmung. Then answer two own-experience questions (Teil 2B).',
          target: { kind: 'module', exam: 1, module: 'sprechen', teil: '2A' }
        }
      ],
      cheats: ['sprechen'],
      ai: [
        {
          t: 'Bild-Beschreibung',
          p: 'Wir üben Teil 2 der mündlichen Prüfung im Deutsch-Test für Zuwanderer. Beschreibe mir in Worten ein Foto aus dem Alltag (z. B. Menschen im Wartezimmer, auf dem Spielplatz, im Supermarkt) in 4–5 Sätzen — ich kann es nicht sehen und sage dir dann, was ich mir vorstelle und was ich sehe. Danach stellst du mir drei Fragen zu meinen eigenen Erfahrungen (eine leichte, zwei etwas schwerere) und gibst mir erst am Ende Feedback auf Englisch.'
        }
      ]
    },
    {
      day: 13,
      tier: 'core',
      title: 'Sprechen — Teil 3: gemeinsam planen',
      focus: 'Vorschläge machen, zustimmen, ablehnen — and reach a decision',
      tasks: [
        'Learn the Teil-3 Redemittel from the cheatsheet: Vorschläge machen, zustimmen, ablehnen + Alternative, Abschluss.',
        {
          text: 'Take mock exam 1 → Sprechen (Teil 3): use the five notes on the task sheet as your agenda and plan the whole thing out loud, solo, ending with a decision.',
          target: { kind: 'module', exam: 1, module: 'sprechen', teil: '3' }
        },
        'Plan out loud for 3 minutes in a second situation of your own (a party for the Kita, a trip with your course): Wann? Wo? Was? Wer macht was?'
      ],
      cheats: ['sprechen'],
      ai: [
        {
          t: 'Planungs-Partner',
          p: 'Wir üben Teil 3 der mündlichen Prüfung im Deutsch-Test für Zuwanderer: gemeinsam etwas planen. Gib mir eine Situation und eine Aufgabe mit fünf Stichpunkten, die mit "…?" enden (z. B. Wir planen ein Fest im Deutschkurs). Du bist mein Partner: Mache selbst Vorschläge, stimme zu, lehne einen meiner Vorschläge höflich ab und frage nach. Wir hören auf, wenn wir eine Entscheidung haben. Danach Feedback auf Englisch.'
        }
      ]
    },
    {
      day: 14,
      tier: 'core',
      title: 'Core finale — second message & battle plan',
      focus: 'Close the core, open the mock phase',
      tasks: [
        {
          text: 'Take mock exam 2 → Schreiben: second message, 30 minutes, checklist afterwards.',
          target: { kind: 'module', exam: 2, module: 'schreiben' }
        },
        'Review sweep: reread all eight cheatsheets once (30 min) and your red items from mock exam 1 and 2.',
        'Say your Teil-1A self-presentation once — still automatic?',
        'From here the rhythm is: one mock exam every 2–3 days, always with a full review the same day.'
      ],
      cheats: ['schreiben', 'sprechen'],
      ai: [
        {
          t: 'Halfway review',
          p: 'Du bist mein Deutschtrainer (Niveau A2–B1). Teste in 20 gemischten Aufgaben, ob das Kernprogramm sitzt: 5× Kasus/Präpositionen, 5× Perfekt und trennbare Verben, 5× Konnektoren mit Wortstellung, 5× Wörter aus dem Alltag (Behörde, Wohnung, Arbeit). Eine Aufgabe nach der anderen, sofortige Korrektur. Am Ende: Punktzahl und die 3 Themen, die ich in Woche 3 wiederholen muss.'
        }
      ]
    },
    {
      day: 15,
      tier: 'extension',
      title: 'Konjunktiv II & höfliche Bitten',
      focus: 'Könnten Sie …? Ich hätte gern … — the B1 signal in Schreiben and Sprechen',
      tasks: [
        'Study the Konjunktiv-II block in the verbs cheatsheet: wäre, hätte, würde, könnte, sollte.',
        'Write 8 polite requests to an Amt, a landlord or a teacher (Könnten Sie mir bitte …? Wäre es möglich, …?) and 4 pieces of advice (An Ihrer Stelle würde ich …).',
        {
          text: 'Quiz: 15 verb forms in the practice hub, and flag every Konjunktiv item you hesitate on.',
          target: { kind: 'quiz', category: 'verbs' }
        }
      ],
      cheats: ['verben'],
      ai: [
        {
          t: 'Konjunktiv coach',
          p: 'Du bist mein Deutschtrainer (Niveau A2–B1). Runde 1: 8 direkte Sätze, die ich höflich umformulieren muss (Geben Sie mir einen Termin! → Könnten Sie mir bitte einen Termin geben?). Runde 2: 5 Situationen, in denen ich höflich bitten muss (Termin verschieben, Nachbarn um Ruhe bitten, Vermieter um Reparatur bitten). Runde 3: Ich gebe dir 5 Ratschläge mit "An deiner Stelle würde ich …". Korrigiere alles sofort, kurze Erklärungen auf Englisch.'
        }
      ]
    },
    {
      day: 16,
      tier: 'extension',
      title: 'Mock exam 3 — the written part in one sitting',
      focus: 'Hören, Lesen and Schreiben back to back, as in the real exam',
      tasks: [
        'Take mock exam 3 → Hören, Lesen and Schreiben in the exam order with the timer on: no pausing, no dictionary, no breaks between the three modules.',
        'Add up Hören + Lesen (max 45) and rate your Schreiben (max 20), then compare with the bands in the guide (33–45 = B1, 20–32 = A2 · 15–20 = B1, 7–14 = A2).',
        'Review every red item and sort it: vocabulary gap, grammar gap or technique error. Add the 15 most painful unknown words to your flashcards.'
      ],
      cheats: [],
      ai: [
        {
          t: 'Error debrief',
          p: 'Ich habe gerade einen kompletten schriftlichen Teil (Hören, Lesen, Schreiben) einer Probeprüfung für den Deutsch-Test für Zuwanderer gemacht. Ich füge meine Fehler ein (Aufgabe + meine falsche Antwort + richtige Antwort). Analysiere die Muster auf Englisch, nenne die 3 Baustellen mit dem größten Punkte-Hebel und erstelle zu jeder eine deutsche Mini-Übung (5 Aufgaben), die wir sofort zusammen machen.'
        }
      ]
    },
    {
      day: 17,
      tier: 'extension',
      title: 'Wohnen, Nebenkosten & Vermieter',
      focus: 'The housing vocabulary of Lesen Teil 3–5 and the formal letter',
      tasks: [
        'Reread the Wohnen block in the Alltag cheatsheet: Mietvertrag, Kaltmiete/Warmmiete, Nebenkosten, Kaution, kündigen, Mangel melden.',
        'Write a formelle message to your Vermieter in 12 sentences: a heater is broken (Mangel melden), you ask for a repair date (bitten) and you suggest a time (vorschlagen).',
        'One flashcard session (20 cards) of nouns about Wohnen and Arbeit.'
      ],
      cheats: ['alltag', 'kasus'],
      ai: [
        {
          t: 'Vermieter-Brief',
          p: 'Du bist mein Deutschtrainer (Niveau A2–B1). Gib mir drei realistische Briefaufgaben rund ums Wohnen (Nebenkostenabrechnung unklar, Heizung kaputt, Kündigung der Wohnung) mit je 4 Leitpunkten, so wie im Schreiben-Teil des Deutsch-Tests für Zuwanderer. Ich schreibe die erste. Du korrigierst jeden Fehler, markierst fehlende Leitpunkte und gibst mir 5 Wörter, die den Brief formeller machen würden.'
        }
      ]
    },
    {
      day: 18,
      tier: 'extension',
      title: 'Mock exam 4 — Schreiben & Lesen',
      focus: 'Formal register under time pressure',
      tasks: [
        {
          text: 'Take mock exam 4 → Schreiben: choose A or B in the first minute, 30 minutes, formelle or halbformelle Mitteilung. Keep the last minutes for the checklist.',
          target: { kind: 'module', exam: 4, module: 'schreiben' }
        },
        {
          text: 'Take mock exam 4 → Lesen (Teil 2: Anzeigen, ein X) and mock exam 4 → Lesen (Teil 5: Brief ergänzen).',
          target: { kind: 'module', exam: 4, module: 'lesen' }
        },
        'Review every red item and update your personal top-5 mistakes list.'
      ],
      cheats: ['schreiben', 'lesen'],
      ai: [
        {
          t: 'Message upgrade',
          p: 'Du bist Prüfer im Deutsch-Test für Zuwanderer. Ich füge meine Mitteilung aus der heutigen Probeprüfung ein (Aufgabe + mein Text). Bewerte nach den vier Kriterien (Aufgabenbewältigung, kommunikative Gestaltung, Korrektheit, Wortschatz) mit je 0–5 Punkten, markiere jeden Fehler, und zeige dann, wie derselbe Text mit 3 besseren Konnektoren und 2 Konjunktiv-II-Formulierungen klingt. Danach diktierst du mir die 5 wichtigsten Korrekturen zum Abschreiben.'
        }
      ]
    },
    {
      day: 19,
      tier: 'extension',
      title: 'Mock exam 5 — the written part in one sitting',
      focus: 'Written routine under pressure',
      tasks: [
        'Take mock exam 5 → Hören, Lesen and Schreiben in the exam order with the timer on and no breaks.',
        'Rate your Schreiben on the four criteria before reading any feedback — honest self-assessment is an exam skill. Then compare Hören + Lesen and Schreiben with mock exam 3.',
        'Review every red item; note which Teil cost you the most items.'
      ],
      cheats: ['konnektoren'],
      ai: [
        {
          t: 'Teil-by-Teil review',
          p: 'Ich füge meine Ergebnisse aus Probeprüfung 5 für den Deutsch-Test für Zuwanderer ein, getrennt nach Teilen (Hören Teil 1–4, Lesen Teil 1–5, Schreiben). Erkläre mir auf Englisch, in welchen Teilen ich die meisten Punkte verliere und warum (Wortschatz, Grammatik, Technik, Zeit). Gib mir danach 8 deutsche Übungsaufgaben für den schwächsten Teil, eine nach der anderen, mit sofortiger Korrektur.'
        }
      ]
    },
    {
      day: 20,
      tier: 'extension',
      title: 'Sprechen — Bild & Erfahrungen',
      focus: 'Teil 2A and 2B: 20 of the 100 points',
      tasks: [
        'Take mock exam 3 → Sprechen (Teil 2A: Bild beschreiben) and mock exam 4 → Sprechen (Teil 2A): record both, then listen back and count how many of Ort, Personen, Tätigkeit, Stimmung you covered.',
        'Answer the Teil-2B questions of both tests aloud with a real example from your life each time: Bei mir war das so: …',
        'Drill the repair phrases once more: Wie bitte? Könnten Sie das wiederholen? Wie sagt man …?'
      ],
      cheats: ['sprechen'],
      ai: [
        {
          t: 'Erfahrungen-Interview',
          p: 'Du bist Prüfer in der mündlichen Prüfung des Deutsch-Tests für Zuwanderer, Teil 2B. Stelle mir nacheinander 6 Fragen zu meinen Erfahrungen (Arbeit, Wohnen, Familie, Behörden, Deutsch lernen), die ersten drei auf A2-Niveau, die letzten drei auf B1-Niveau (mit Grund, Vergleich oder Meinung). Unterbrich mich nicht. Am Ende Feedback auf Englisch: die 5 wichtigsten Fehler und zwei Redemittel, mit denen meine Antworten länger und besser würden.'
        }
      ]
    },
    {
      day: 21,
      tier: 'extension',
      title: 'Mock exam 6 & checkpoint week 3',
      focus: 'Trend check: are the curves rising?',
      tasks: [
        'Take mock exam 6 → Hören, Lesen and Schreiben in one sitting, with the timer on.',
        'Look at your results across mock exams 3, 5 and 6: write down your weakest Teil and your weakest grammar topic.',
        'Flashcard sweep: review every struggling card from the last two weeks.'
      ],
      cheats: [],
      ai: [
        {
          t: 'Trend analysis',
          p: 'Ich bin in Woche 3 meiner Vorbereitung auf den Deutsch-Test für Zuwanderer und füge meine Ergebnisse der Probeprüfungen ein (Hören + Lesen von 45, Schreiben von 20). Analysiere den Trend auf Englisch: Bei welchem Zertifikat (A2 oder B1) stehe ich gerade, und was fehlt mir zum nächsten Band? Erstelle einen konkreten Plan für die letzte Woche: welcher Teil an welchem Tag, mit je einer messbaren Übung. Danach 10 deutsche Blitzfragen zu meinem schwächsten Grammatikthema.'
        }
      ]
    },
    {
      day: 22,
      tier: 'extension',
      title: 'Lesen & Hören sharpening',
      focus: 'The Teile that cost points: Lesen Teil 3 and Hören Teil 3',
      tasks: [
        'Take mock exam 5 → Lesen (Teil 3: Pressetexte und Mitteilungen) and mock exam 6 → Lesen (Teil 3): for each text, name which of the two items was richtig/falsch and which was a/b/c, and where the proof sits.',
        'Take mock exam 5 → Hören (Teil 3: Gespräche) and mock exam 6 → Hören (Teil 3): before each Gespräch, underline the key words of both items.',
        'One flashcard session (20 cards) of Verben mit Präposition.'
      ],
      cheats: ['lesen', 'hoeren'],
      ai: [
        {
          t: 'Gespräch & Pressetext',
          p: 'Schreibe einen kurzen Pressetext (ca. 150 Wörter, A2–B1) über eine Neuigkeit in einer Stadt (neue Buslinie, geänderte Öffnungszeiten im Bürgeramt) und dazu zwei Aufgaben: eine richtig/falsch-Aussage und eine Frage mit a/b/c. Baue typische Fallen ein: verändertes Datum, Verneinung, plausibel aber nicht im Text. Ich antworte, du löst auf und zitierst den Satz, der die Antwort beweist. Dann ein neuer Text.'
        }
      ]
    },
    {
      day: 23,
      tier: 'extension',
      title: 'Mock exam 7 — the written part in one sitting',
      focus: 'Routine beats inspiration',
      tasks: [
        'Take mock exam 7 → Hören, Lesen and Schreiben in one sitting, with the timer on.',
        'Rewrite your Schreiben text once more, fixing every marked mistake — the corrected version is the one your hand remembers.',
        'Review every red item; your top-5 mistakes list should be getting shorter, not longer.'
      ],
      cheats: ['schreiben'],
      ai: [
        {
          t: 'Error debrief',
          p: 'Ich füge meine Fehler aus Probeprüfung 7 für den Deutsch-Test für Zuwanderer ein. Gruppiere sie auf Englisch nach Ursache (Wortschatz, Grammatikregel, Technik/Zeitdruck, Unaufmerksamkeit) und sage mir, welche Gruppe vor der Prüfung noch trainierbar ist und welche ich mit Strategie (Reihenfolge, Raten, Zeiteinteilung) abfangen muss. Danach eine 10-Aufgaben-Mini-Übung zur größten Gruppe.'
        }
      ]
    },
    {
      day: 24,
      tier: 'extension',
      title: 'Hören bootcamp',
      focus: 'Zero points lost on paraphrases and digits',
      tasks: [
        'Reread the Hören cheatsheet and drill the correction signals (nicht … sondern, leider, stattdessen) out loud.',
        {
          text: 'Take mock exam 4 → Hören (Teil 1: Ansagen) and mock exam 4 → Hören (Teil 4: Meinungen zuordnen): use the minute before Teil 4 to mark the opinion word in each of the six sentences.',
          target: { kind: 'module', exam: 4, module: 'hoeren' }
        },
        'Dictation marathon: 20 times, dates, prices and phone numbers heard as words, written as digits — repeat until 20/20.'
      ],
      cheats: ['hoeren'],
      ai: [
        {
          t: 'Numbers at full speed',
          p: 'Diktiere mir deutsche Zahlen in Worten, ich antworte in Ziffern: Uhrzeiten (Viertel vor acht, halb zehn), Daten (am einundzwanzigsten März), Preise (neunundneunzig Cent), Hausnummern und Telefonnummern einzeln oder in Gruppen. 10 pro Runde, jede Runde schneller und gemeiner (vierzehn vs. vierzig!). Sofortige Korrektur. Nach 3 Runden: Liste aller Fallen, in die ich getappt bin.'
        }
      ]
    },
    {
      day: 25,
      tier: 'extension',
      title: 'Mock exam 8 & the certificate check',
      focus: 'Which certificate does today’s result give you?',
      tasks: [
        'Take mock exam 8 → Hören, Lesen and Schreiben in one sitting, with the timer on.',
        'Check the certificate rule with your three results: B1 needs Sprechen B1 and (Hören + Lesen 33–45 or Schreiben 15–20); A2 needs Sprechen at least A2 and (Hören + Lesen at least 20 or Schreiben at least 7). Where are you today?',
        'Review every red item and do one flashcard session (20 cards) of your weakest category.'
      ],
      cheats: [],
      ai: [
        {
          t: 'Margin check',
          p: 'Ich füge meine Ergebnisse aus Probeprüfung 8 für den Deutsch-Test für Zuwanderer ein (Hören + Lesen von 45, Schreiben von 20, meine Einschätzung für Sprechen von 100). Erkläre mir auf Englisch, welches Zertifikat daraus nach den Regeln folgt (Sprechen ist das Tor; für B1 Sprechen B1 und entweder Hören + Lesen B1 oder Schreiben B1) und was mir zum nächsten Band fehlt. Dann simuliere die 5 Aufgabentypen, in denen ich zuletzt Punkte verloren habe — eine nach der anderen, auf Deutsch, mit sofortiger Korrektur.'
        }
      ]
    },
    {
      day: 26,
      tier: 'extension',
      title: 'Schreiben & Sprechen — final polish',
      focus: 'Sprechen is the gate; Schreiben is a second path to B1',
      tasks: [
        {
          text: 'Take mock exam 8 → Schreiben again with the Aufgabe you did not choose on day 25: write it in 30 minutes, then check all four Leitpunkte, Anrede and Gruß.',
          target: { kind: 'module', exam: 8, module: 'schreiben' }
        },
        {
          text: 'Take mock exam 9 → Sprechen: Teil 1A from memory, Teil 2A with the photo, Teil 2B with your own experience, Teil 3 as a full plan — record and listen back.',
          target: { kind: 'module', exam: 9, module: 'sprechen' }
        },
        'Drill the repair phrases one last time: Wie bitte? Könnten Sie das wiederholen? Ich meine …'
      ],
      cheats: ['schreiben', 'sprechen'],
      ai: [
        {
          t: 'Double examiner',
          p: 'Du bist Prüfer für die produktiven Teile des Deutsch-Tests für Zuwanderer. Erst Schreiben: Gib mir zwei Aufgaben A und B mit je 4 Leitpunkten; ich wähle eine und schreibe sie in 30 Minuten; du bewertest nach den vier Kriterien mit je 0–5 Punkten. Dann Sprechen: Simuliere Teil 2B und Teil 3 auf Deutsch, bleib in der Rolle, und gib mir erst danach Feedback auf Englisch — mit einer ehrlichen Einschätzung, ob das heute für A2 oder für B1 im mündlichen Teil reichen würde.'
        }
      ]
    },
    {
      day: 27,
      tier: 'extension',
      title: 'Mock exam 9 & final sweep',
      focus: 'Last full rehearsal',
      tasks: [
        'Take mock exam 9 → Hören, Lesen and Schreiben in one sitting, with the timer on — treat it as the real day: same start time as your exam if possible.',
        'Keep mock exam 10 as a reserve: use only its module for your weakest skill, tomorrow morning at the earliest — or not at all.',
        'Final flashcard sweep: only the cards that are still struggling; everything green stays closed.'
      ],
      cheats: [],
      ai: [
        {
          t: 'Final debrief',
          p: 'Ich habe meine letzte komplette schriftliche Probeprüfung für den Deutsch-Test für Zuwanderer gemacht und füge Ergebnisse und Fehler ein. Kein neues Training mehr: Sag mir auf Englisch nur noch, (1) welche 3 Dinge ich am Prüfungstag strategisch anders machen soll (Reihenfolge, Zeiteinteilung, Raten), (2) welche 5 Formulierungen ich für Schreiben und Sprechen noch einmal ansehen soll, (3) was ich bewusst NICHT mehr üben soll. Kurz und konkret.'
        }
      ]
    },
    {
      day: 28,
      tier: 'extension',
      title: 'Light review only',
      focus: 'Peak, don’t cram',
      tasks: [
        'Reread all eight cheatsheets once, slowly (45 min) — mark the 5 things you still want on a single sheet of paper.',
        'Say your Teil-1A self-presentation and your 5 Konjunktiv-II politeness phrases aloud — they must be automatic.',
        'Pack for exam day (ID, invitation letter, a pen that works, water, watch), check the time and place of the written and the oral part in your invitation, plan your route — then close the books and rest.'
      ],
      cheats: ['alltag', 'schreiben', 'sprechen', 'hoeren'],
      ai: [
        {
          t: 'Calm warm-up',
          p: 'Morgen ist meine Prüfung (Deutsch-Test für Zuwanderer). Führe ein ruhiges, freundliches Gespräch auf Deutsch mit mir (10 Minuten): Alltagsfragen, ein bisschen über meine Pläne nach der Prüfung, nichts Schweres. Korrigiere nur Fehler, die das Verstehen stören, und tu das beiläufig. Am Ende: drei Sätze Ermutigung auf Englisch und die Erinnerung, heute früh schlafen zu gehen.'
        }
      ]
    }
  ]
};
