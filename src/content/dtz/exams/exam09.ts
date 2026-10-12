import { type DtzExam } from '@shared/types';

const exam = {
  id: 9,
  title: 'Modelltest 9',
  theme: 'Aus- & Weiterbildung',

  hoeren: {
    teil1: {
      anweisung:
        'Sie hören vier Ansagen am Telefon oder in einem Gebäude. Zu jeder Ansage gibt es eine Aufgabe. Welche Lösung (a, b oder c) passt am besten?',
      items: [
        {
          audio:
            'Guten Tag, Sie sind verbunden mit der Volkshochschule Neustadt. Unser Büro ist von Montag bis Donnerstag jeweils von acht bis zwölf Uhr geöffnet. Am Donnerstag sind wir außerdem von vierzehn bis achtzehn Uhr für Sie da. Am Freitag bleibt das Büro geschlossen. Das Herbstprogramm finden Sie auch im Internet.',
          frage: 'Wann können Sie am Nachmittag persönlich ins Büro kommen?',
          options: ['Am Montag', 'Am Donnerstag', 'Am Freitag'],
          answer: 1
        },
        {
          audio:
            'Hallo, hier ist Frau Becker von der Sprachschule Lingua. Der Kurs Deutsch B1 am Mittwochabend fällt diese Woche leider aus, weil die Lehrerin krank ist. Der nächste Unterricht ist am Mittwoch in einer Woche, wie immer um achtzehn Uhr dreißig. Die Hausaufgaben schicke ich Ihnen per E-Mail. Auf Wiederhören.',
          frage: 'Was ist mit dem Kurs diese Woche?',
          options: ['Er findet nicht statt.', 'Er beginnt später.', 'Er ist in einem anderen Raum.'],
          answer: 0
        },
        {
          audio:
            'Liebe Besucherinnen und Besucher, die Stadtbibliothek schließt in zehn Minuten. Wer noch Bücher ausleihen möchte, kommt bitte jetzt an die Theke im Erdgeschoss. Die Computer im ersten Stock werden in fünf Minuten ausgeschaltet. Bitte speichern Sie Ihre Arbeit. Vielen Dank.',
          frage: 'Was sollen die Besucher bald tun?',
          options: [
            'Ihre Bücher zurückbringen.',
            'Das Gebäude sofort verlassen.',
            'Ihre Arbeit am Computer speichern.'
          ],
          answer: 2
        },
        {
          audio:
            'Guten Tag, Herr Aksoy, hier spricht Herr Metzger vom Autohaus Brandt. Sie haben sich bei uns um einen Ausbildungsplatz als Kfz-Mechatroniker beworben. Wir möchten Sie gern zu einem Vorstellungsgespräch einladen, und zwar am Dienstag um zehn Uhr fünfzehn. Wenn Ihnen der Termin nicht passt, nennen Sie mir bitte zwei andere Tage. Bringen Sie bitte Ihr letztes Zeugnis mit.',
          frage: 'Was sollen Sie tun, wenn der Termin nicht passt?',
          options: ['Zwei andere Tage nennen.', 'Das Zeugnis schicken.', 'Eine neue Bewerbung schreiben.'],
          answer: 0
        }
      ]
    },
    teil2: {
      anweisung:
        'Sie hören fünf kurze Informationen im Radio. Zu jeder Information gibt es eine Aufgabe. Welche Lösung (a, b oder c) passt am besten?',
      items: [
        {
          audio:
            'Das Wetter für morgen, Samstag. Im Norden regnet es den ganzen Tag, die Temperaturen steigen nur auf zwölf Grad. Im Süden scheint dagegen von früh bis spät die Sonne, es wird bis zu zwanzig Grad warm. Am Sonntag wird es dann im ganzen Land etwas kühler.',
          frage: 'Wie wird das Wetter morgen im Süden?',
          options: ['Regnerisch', 'Sonnig', 'Kühl'],
          answer: 1
        },
        {
          audio:
            'Und nun der Verkehr. Auf der A sieben in Richtung Norden ist zwischen Kassel-Nord und Göttingen ein Lastwagen verunglückt. Die Autobahn ist gesperrt. Autofahrer verlassen sie bitte an der Ausfahrt Kassel-Nord und fahren über die Bundesstraße drei weiter.',
          frage: 'Was sollen Autofahrer tun?',
          options: [
            'Bei Kassel-Nord die Autobahn verlassen.',
            'Auf der Autobahn langsam fahren.',
            'In Göttingen mit dem Zug weiterfahren.'
          ],
          answer: 0
        },
        {
          audio:
            'Unser Veranstaltungstipp für das Wochenende: Am Samstag ist Tag der offenen Tür an der Berufsschule am Markt, von zehn bis fünfzehn Uhr. Sie können Werkstätten und Labore besichtigen, mit Lehrern und Auszubildenden sprechen und sich über Ausbildungsberufe informieren. Der Eintritt ist frei.',
          frage: 'Was kann man am Samstag an der Berufsschule tun?',
          options: [
            'Eine Prüfung ablegen.',
            'Sich über Berufe informieren.',
            'Sich für einen Sprachkurs anmelden.'
          ],
          answer: 1
        },
        {
          audio:
            'Im Anschluss an die Nachrichten hören Sie unsere Sendung Lernen im Alltag. Heute geht es um die Frage: Wie lerne ich mit vierzig Jahren noch einen neuen Beruf? Zu Gast sind eine Berufsberaterin und ein Mann, der in diesem Alter noch einmal eine Ausbildung begonnen hat. Hörerinnen und Hörer können während der Sendung anrufen.',
          frage: 'Worum geht es in der Sendung?',
          options: [
            'Um eine neue Ausbildung im mittleren Alter',
            'Um Berufe für junge Leute',
            'Um Sprachkurse im Ausland'
          ],
          answer: 0
        },
        {
          audio:
            'Wer viel am Schreibtisch sitzt, hat oft Rückenschmerzen. Die Vita-Krankenkasse lädt Sie deshalb zu einem Rückenkurs ein, immer dienstags um neunzehn Uhr. Für Versicherte der Vita ist der Kurs kostenlos, alle anderen zahlen zwanzig Euro. Anmeldung an jedem Schalter der Vita.',
          frage: 'Wer muss für den Rückenkurs nichts bezahlen?',
          options: ['Alle Teilnehmer', 'Nur Versicherte der Vita', 'Nur Schüler und Studenten'],
          answer: 1
        }
      ]
    },
    teil3: {
      anweisung:
        'Sie hören vier Gespräche. Zu jedem Gespräch gibt es zwei Aufgaben: erst richtig oder falsch, dann eine Frage mit den Lösungen a, b und c.',
      gespraeche: [
        {
          audio: [
            {
              speaker: 'Frau Kern',
              text: 'Herr Demir, haben Sie schon mit dem Chef über den Excel-Kurs gesprochen?'
            },
            {
              speaker: 'Herr Demir',
              text: 'Ja, gestern. Er ist einverstanden. Die Firma übernimmt die Kosten, das sind zweihundertachtzig Euro.'
            },
            { speaker: 'Frau Kern', text: 'Das ist ja toll. Und wann findet der Kurs statt?' },
            {
              speaker: 'Herr Demir',
              text: 'An drei Samstagen im November, immer von neun bis dreizehn Uhr.'
            },
            { speaker: 'Frau Kern', text: 'Dann haben Sie ein paar freie Samstage weniger!' },
            {
              speaker: 'Herr Demir',
              text: 'Das stimmt, aber ich lerne gern. Mit Excel kann ich im Büro viel Zeit sparen.'
            }
          ],
          statement: { text: 'Herr Demir muss den Kurs selbst bezahlen.', answer: false },
          question: {
            frage: 'Wann findet der Kurs statt?',
            options: [
              'An drei Abenden in der Woche',
              'An drei Samstagen im November',
              'Von Montag bis Mittwoch'
            ],
            answer: 1
          }
        },
        {
          audio: [
            {
              speaker: 'Frau Roth',
              text: 'Guten Tag, Frau Aydin. Schön, dass Sie gekommen sind. Es geht um Emre.'
            },
            { speaker: 'Frau Aydin', text: 'Guten Tag. Wie läuft es denn bei ihm?' },
            {
              speaker: 'Frau Roth',
              text: 'In Englisch und in Sport ist er sehr gut. Nur in Mathematik hat er im Moment eine Fünf.'
            },
            {
              speaker: 'Frau Aydin',
              text: 'Ach, das habe ich befürchtet. Er sagt immer, er versteht die Aufgaben nicht.'
            },
            {
              speaker: 'Frau Roth',
              text: 'Ich empfehle Ihnen die Nachhilfe an unserer Schule. Sie findet montags nach der sechsten Stunde statt und ist kostenlos.'
            },
            { speaker: 'Frau Aydin', text: 'Das klingt gut. Dann melde ich ihn gleich an.' }
          ],
          statement: { text: 'Emre hat in Mathematik eine schlechte Note.', answer: true },
          question: {
            frage: 'Was empfiehlt die Lehrerin?',
            options: [
              'Die kostenlose Nachhilfe an der Schule',
              'Mehr Hausaufgaben zu Hause',
              'Einen Privatlehrer am Nachmittag'
            ],
            answer: 0
          }
        },
        {
          audio: [
            {
              speaker: 'Berater',
              text: 'Guten Morgen, Herr Petrov. Sie haben mir geschrieben, dass Sie in Bulgarien als Elektriker gearbeitet haben.'
            },
            {
              speaker: 'Herr Petrov',
              text: 'Ja, acht Jahre lang. Ich habe auch eine Ausbildung mit Zeugnis. Aber hier in Deutschland kennt das niemand.'
            },
            {
              speaker: 'Berater',
              text: 'Genau. Deshalb sollten Sie als Erstes bei der Handwerkskammer einen Antrag auf Anerkennung Ihres Abschlusses stellen. Das dauert einige Wochen.'
            },
            { speaker: 'Herr Petrov', text: 'Und kann ich mich schon bei Firmen bewerben?' },
            {
              speaker: 'Berater',
              text: 'Das dürfen Sie natürlich auch. Aber mit der Anerkennung haben Sie bessere Chancen. Einen Deutschkurs müssen Sie nicht mehr machen, Ihr Sprachzeugnis reicht aus.'
            }
          ],
          statement: { text: 'Herr Petrov hat seinen Abschluss schon anerkennen lassen.', answer: false },
          question: {
            frage: 'Was soll Herr Petrov als Erstes tun?',
            options: [
              'Einen weiteren Deutschkurs besuchen',
              'Sich bei Firmen bewerben',
              'Einen Antrag auf Anerkennung stellen'
            ],
            answer: 2
          }
        },
        {
          audio: [
            { speaker: 'Sabine', text: 'Hallo Lena, du siehst aber müde aus.' },
            {
              speaker: 'Lena',
              text: 'Ja, ich habe heute Nacht bis ein Uhr gelernt. Morgen schreibe ich die Prüfung in Biologie.'
            },
            { speaker: 'Sabine', text: 'Für den Hauptschulabschluss, oder? Wie läuft das Lernen denn?' },
            {
              speaker: 'Lena',
              text: 'Ganz gut. Jeden Mittwoch lerne ich in der Bibliothek mit drei Leuten aus meinem Kurs. Das hilft mir sehr.'
            },
            { speaker: 'Sabine', text: 'Dann drücke ich dir die Daumen.' }
          ],
          statement: { text: 'Lena lernt für ihre Prüfungen immer allein.', answer: false },
          question: {
            frage: 'Warum ist Lena heute müde?',
            options: [
              'Sie hat die Prüfung schon geschrieben.',
              'Sie hat lange gearbeitet.',
              'Sie hat bis spät in der Nacht gelernt.'
            ],
            answer: 2
          }
        }
      ]
    },
    teil4: {
      anweisung:
        'Sie hören im Radio eine Diskussion. Vier Personen sprechen über das Thema. Zu welcher Person passt welcher Satz (a–f)? Zwei Sätze bleiben übrig. Lesen Sie zuerst die Sätze. Das Beispiel ist schon gelöst.',
      thema: 'Weiterbildung neben dem Beruf: Wie lernen Sie?',
      sentences: [
        'Ich finde Weiterbildungen zu teuer.',
        'Ich lerne lieber zu Hause im Internet als im Kursraum.',
        'Ich habe zu wenig Zeit für eine Weiterbildung.',
        'Meine Firma bezahlt den Kurs.',
        'Ich möchte lieber studieren als arbeiten.',
        'Dank eines Kurses habe ich eine bessere Stelle gefunden.'
      ],
      beispiel: {
        audio:
          'Ich arbeite Vollzeit und habe zwei kleine Kinder. Nach dem Abendessen bin ich einfach zu müde. Für einen Kurs fehlt mir im Moment die Zeit, auch wenn ich das Thema spannend finde.',
        answer: 2
      },
      aussagen: [
        {
          audio:
            'Ich mache gerade eine Weiterbildung zum Lagerleiter. Mein Chef hat mir die Kursgebühren bezahlt, und ich darf sogar zwei Tage im Monat dafür freinehmen. Das finde ich fair.',
          answer: 3
        },
        {
          audio:
            'Früher habe ich Abendkurse besucht, aber das war nichts für mich. Heute lerne ich online. Ich sitze zu Hause auf dem Sofa und entscheide selbst, wann ich eine Lektion mache. Das passt viel besser zu meinem Alltag.',
          answer: 1
        },
        {
          audio:
            'Vor zwei Jahren habe ich einen Kurs für Pflegeassistenz gemacht. Danach habe ich in einem Krankenhaus eine neue Stelle bekommen, mit besserem Gehalt und besseren Arbeitszeiten. Der Kurs hat sich für mich wirklich gelohnt.',
          answer: 5
        }
      ]
    }
  },

  lesen: {
    teil1: {
      anweisung:
        'Lesen Sie die Situationen und das Verzeichnis. Wo finden Sie was? Welche Lösung (a, b oder c) passt am besten?',
      titel: 'Bildungszentrum Lindenhof – Wegweiser',
      verzeichnis:
        '3. Stock: Verwaltung · Buchhaltung (Rechnungen und Zahlungen) · Konferenzraum\n2. Stock: Berufliche Weiterbildung (Räume 201–208) · Bildungsberatung · Bibliothek\n1. Stock: Deutschkurse (Räume 101–110) · Prüfungsbüro (Prüfungen und Zeugnisse) · Computerlernraum\nErdgeschoss: Anmeldung (für alle Kurse) · Cafeteria · Buchladen\nUntergeschoss: Kinderspielzimmer (Betreuung während der Kurszeiten) · Fahrradkeller',
      questions: [
        {
          frage: 'Sie möchten sich für den Deutschkurs B1 anmelden. Wohin gehen Sie?',
          options: ['Ins Erdgeschoss', 'In den 1. Stock', 'In den 2. Stock'],
          answer: 0
        },
        {
          frage:
            'Ihre Tochter ist vier Jahre alt. Während Ihres Kurses soll jemand auf sie aufpassen. Wohin gehen Sie?',
          options: ['Ins Untergeschoss', 'Ins Erdgeschoss', 'In den 1. Stock'],
          answer: 0
        },
        {
          frage: 'Sie haben eine Frage zur Rechnung für Ihren Kurs. Wohin gehen Sie?',
          options: ['In den 2. Stock', 'In den 3. Stock', 'In ein anderes Stockwerk'],
          answer: 1
        },
        {
          frage:
            'Sie möchten wissen, welche Weiterbildung zu Ihrem Beruf passt, und suchen ein Gespräch mit einer Beraterin. Wohin gehen Sie?',
          options: ['In den 2. Stock', 'In den 3. Stock', 'In ein anderes Stockwerk'],
          answer: 0
        },
        {
          frage: 'Nach dem Unterricht möchten Sie in Ruhe einen Kaffee trinken. Wohin gehen Sie?',
          options: ['In den 1. Stock', 'In den 2. Stock', 'In ein anderes Stockwerk'],
          answer: 2
        }
      ]
    },
    teil2: {
      anweisung:
        'Lesen Sie die Situationen und die Anzeigen a–h. Welche Anzeige passt zu welcher Situation? Für eine Situation gibt es keine passende Anzeige. Wählen Sie dann X.',
      situations: [
        'Sie arbeiten tagsüber und möchten abends Ihr Englisch für den Beruf verbessern.',
        'Ihr Sohn (14) braucht Hilfe in Mathematik. Sie suchen eine Gruppe, die höchstens 10 Euro pro Termin kostet.',
        'Sie möchten Ihren Hauptschulabschluss nachholen und können nur vormittags zum Unterricht kommen.',
        'Sie arbeiten tagsüber und möchten am Wochenende einen Computerkurs für Anfänger besuchen.',
        'Sie brauchen für Ihre Prüfung einen ruhigen Platz zum Lernen, auch am Samstag. Es soll nichts kosten.'
      ],
      ads: [
        'Computerkurs für Seniorinnen und Senioren: Grundlagen für Anfänger ab 60 Jahren, dienstags von 10 bis 11.30 Uhr, acht Termine, 40 Euro. Volkshochschule Neustadt, Tel. 05121 334455',
        'Englisch intensiv: Montag bis Freitag, 9–13 Uhr, drei Wochen, 390 Euro. Für alle, die schnell Fortschritte machen wollen. Sprachschule Weltweit, Tel. 05121 778899',
        'Business English am Abend: Sprachschule Lingua Nova, dienstags und donnerstags, 18.30–20.00 Uhr, zehn Wochen, 140 Euro. Speziell für Berufstätige. Anmeldung: Tel. 05121 223344',
        'Lernhilfe Pluspunkt: Nachhilfe in Mathe, Deutsch und Englisch für Klasse 5–10. Einzelunterricht nach Termin, 25 Euro pro Stunde. Probestunde kostenlos.',
        'Abendschule am Stadtpark: Hauptschulabschluss nachholen. Unterricht Montag bis Donnerstag, 18.00–21.15 Uhr. Beginn: 4. November. Informationsabend am 28. Oktober.',
        'Stadtbibliothek Süd: Ruhige Lernräume, Montag bis Samstag von 9 bis 22 Uhr geöffnet. Eintritt frei. WLAN vorhanden. Bitte Bibliotheksausweis mitbringen (kostenlos am Empfang).',
        'Mathe-Treff für Klasse 7–10: Kleine Gruppe, jeden Mittwoch von 16 bis 17 Uhr im Jugendzentrum Mitte. Nur 8 Euro pro Termin. Anmeldung beim Jugendzentrum.',
        'Schulabschluss am Tag: Hauptschulabschluss in einem Jahr. Unterricht Montag bis Freitag, 8.30–13.00 Uhr. Kinderbetreuung möglich. Beratung und Anmeldung: Bildungswerk Nord, Tel. 05121 556677'
      ],
      answers: [2, 6, 7, -1, 5]
    },
    teil3: {
      anweisung:
        'Lesen Sie die Texte. Zu jedem Text gibt es zwei Aufgaben: erst richtig oder falsch, dann eine Frage mit den Lösungen a, b und c.',
      texts: [
        {
          titel: 'Neues Lernzentrum in der Weststadt',
          text: 'Am Montag hat in der Weststadt das neue Lernzentrum „Zukunft“ eröffnet. In den hellen Räumen im ehemaligen Postgebäude können Erwachsene Deutsch lernen, ihren Schulabschluss nachholen oder am Computer üben. Das Besondere: Für Eltern gibt es eine kostenlose Kinderbetreuung, während sie lernen. Die Kurse selbst kosten nur eine kleine Gebühr. Menschen mit Sozialleistungen müssen gar nichts bezahlen. Die Leiterin, Petra Voss, sagt: „Wir wollen, dass niemand wegen Geldproblemen auf Bildung verzichten muss.“ Bisher haben sich 140 Personen angemeldet, die meisten für einen Deutschkurs. In den Computerkursen sind noch Plätze frei.',
          statement: {
            text: 'Eltern müssen für die Kinderbetreuung im Lernzentrum bezahlen.',
            answer: false
          },
          question: {
            frage: 'Für wen sind die Kurse kostenlos?',
            options: [
              'Für alle Einwohner der Weststadt',
              'Für Menschen mit Sozialleistungen',
              'Für alle Eltern mit kleinen Kindern'
            ],
            answer: 1
          }
        },
        {
          titel: 'E-Mail der Bildungsakademie',
          text: 'Betreff: Ihr Platz im Kurs „Pflegehelfer/in“\n\nSehr geehrter Herr Hosseini,\n\nvielen Dank für Ihre Anmeldung zum Qualifizierungskurs „Pflegehelfer/in“, der am 4. November beginnt. Wir freuen uns, Ihnen mitzuteilen, dass wir Ihnen einen Platz anbieten können. Bitte überweisen Sie die Kursgebühr von 180 Euro bis zum 25. Oktober auf das Konto, das Sie unten finden. Wenn wir bis dahin keine Zahlung erhalten haben, geben wir den Platz an die nächste Person auf der Warteliste. Falls Sie doch nicht teilnehmen können, teilen Sie uns das bitte bis zum 21. Oktober schriftlich mit. Dann erstatten wir Ihnen die Gebühr vollständig. Bitte bringen Sie am ersten Unterrichtstag Ihren Ausweis mit.\n\nMit freundlichen Grüßen\nIrene Wolf, Bildungsakademie Nord',
          statement: {
            text: 'Herr Hosseini kann bis zum 21. Oktober schriftlich absagen und bekommt sein Geld zurück.',
            answer: true
          },
          question: {
            frage: 'Was muss Herr Hosseini bis zum 25. Oktober tun?',
            options: ['180 Euro bezahlen', 'Seinen Ausweis schicken', 'Den Kurs schriftlich absagen'],
            answer: 0
          }
        },
        {
          titel: 'Elternbrief der Gesamtschule Eichenhain',
          text: 'Liebe Eltern,\n\nam Freitag, dem 13. November, findet der Elternsprechtag statt. Er beginnt um 14 Uhr und endet um 19 Uhr. Jedes Gespräch dauert zehn Minuten. Bitte tragen Sie sich bis zum 6. November in die Liste im Sekretariat oder auf unserer Internetseite ein. Der Unterricht endet an diesem Tag schon um 12.15 Uhr. Kinder, die nicht abgeholt werden, können bis 14 Uhr in der Betreuung bleiben. Wenn Sie beim Gespräch sprachliche Hilfe brauchen, bringen Sie bitte eine Begleitperson mit oder sagen Sie uns Bescheid. Dann versuchen wir, eine Dolmetscherin zu finden.\n\nMit freundlichen Grüßen\nDie Schulleitung',
          statement: { text: 'Jedes Elterngespräch dauert eine Viertelstunde.', answer: false },
          question: {
            frage: 'Bis wann sollen sich die Eltern für ein Gespräch eintragen?',
            options: [
              'Bis zum 6. November',
              'Bis zum 13. November',
              'Bis 14 Uhr am Tag des Elternsprechtags'
            ],
            answer: 0
          }
        }
      ]
    },
    teil4: {
      anweisung: 'Lesen Sie den Text und die Aussagen. Sind die Aussagen richtig oder falsch?',
      titel: 'Bildungsurlaub: Informationen für Beschäftigte',
      text: 'In den meisten Bundesländern darf sich weiterbilden, wer arbeitet – und bekommt dafür freie Tage. Die Regeln sind aber nicht überall gleich. Diese Broschüre der Bildungsberatung Lindenhof beantwortet die wichtigsten Fragen.\n\nWer hat Anspruch?\nAnspruch auf Bildungsurlaub haben alle Beschäftigten, die seit mindestens sechs Monaten im Betrieb arbeiten. Auch Auszubildende und Teilzeitkräfte können Bildungsurlaub nehmen.\n\nWie viel Zeit bekommt man?\nIn der Regel sind es fünf Arbeitstage pro Jahr. Sie können zwei Jahre zusammenlegen und dann zehn Tage am Stück nehmen. In dieser Zeit zahlt der Arbeitgeber Ihr Gehalt weiter. Die Kursgebühren müssen Sie jedoch meistens selbst bezahlen.\n\nWie beantrage ich Bildungsurlaub?\nSie brauchen eine schriftliche Anmeldebestätigung des Kursanbieters. Mit dieser Bestätigung stellen Sie den Antrag bei Ihrem Arbeitgeber, mindestens sechs Wochen vor Kursbeginn. Der Arbeitgeber darf den Antrag nur ablehnen, wenn dringende betriebliche Gründe dagegensprechen, zum Beispiel wenn zur gleichen Zeit zu viele Kolleginnen und Kollegen fehlen würden.\n\nWelche Kurse zählen?\nNicht jeder Kurs ist anerkannt. Gefragt sind Kurse zu Beruf, Politik oder Sprachen. Reine Freizeitkurse, zum Beispiel zum Tanzen oder Malen, werden nicht anerkannt. Fragen Sie am besten vor der Anmeldung bei uns nach.',
      statements: [
        {
          text: 'Wer erst seit drei Monaten in einem Betrieb arbeitet, hat noch keinen Anspruch auf Bildungsurlaub.',
          answer: true
        },
        { text: 'Während des Bildungsurlaubs bekommen Beschäftigte kein Gehalt.', answer: false },
        {
          text: 'Der Arbeitgeber kann den Antrag ablehnen, wenn gleichzeitig zu viele Kollegen fehlen würden.',
          answer: true
        }
      ]
    },
    teil5: {
      anweisung: 'Lesen Sie den Brief. Welches Wort (a, b oder c) passt in die Lücke?',
      text: 'Sehr geehrte Frau Lorenz,\n\nich habe Ihr Kursprogramm gelesen und interessiere mich sehr [1] die Fortbildung „Büro-Organisation“. Ich möchte mich gern anmelden, [2] ich im Moment als Aushilfe arbeite und eine feste Stelle im Büro suchen möchte. Leider kann ich nicht an [3] Kurs im Oktober teilnehmen, denn ich habe bis Ende November Schichtdienst. Könnten Sie mir bitte [4], ob es im Januar einen weiteren Kurs gibt? Ich schicke Ihnen mit diesem Brief außerdem meinen Lebenslauf. In [5] Lebenslauf können Sie sehen, welche Erfahrungen ich bereits habe. Ich bedanke mich im Voraus für Ihre [6] Antwort.\n\nMit freundlichen Grüßen\nDenis Marković',
      gaps: [
        { options: ['für', 'an', 'auf'], answer: 0 },
        { options: ['denn', 'obwohl', 'weil'], answer: 2 },
        { options: ['der', 'dem', 'den'], answer: 1 },
        { options: ['mitteilen', 'mitgeteilt', 'mitteilt'], answer: 0 },
        { options: ['meinem', 'meinen', 'meiner'], answer: 0 },
        { options: ['schnellen', 'schnelle', 'schneller'], answer: 1 }
      ]
    }
  },

  schreiben: {
    anweisung:
      'Wählen Sie Aufgabe A oder Aufgabe B. Zeigen Sie, was Sie können. Schreiben Sie möglichst viel. Vergessen Sie nicht die Anrede und den Gruß.',
    tasks: [
      {
        titel: 'Aufgabe A: Anfrage an die Volkshochschule',
        situation:
          'Sie arbeiten tagsüber in einem kleinen Büro und möchten sich weiterbilden. Im Programm der Volkshochschule Neustadt haben Sie den Abendkurs „Buchführung für Anfänger“ gefunden. Sie schreiben eine E-Mail an die Kursleiterin, Frau Berger.',
        leitpunkte: [
          'Sagen Sie, warum Sie den Kurs besuchen möchten.',
          'Fragen Sie nach Terminen und Kosten.',
          'Erklären Sie, dass Sie Anfänger sind, und fragen Sie nach Vorkenntnissen und Material.',
          'Fragen Sie, ob noch Plätze frei sind, und bitten Sie um eine schnelle Antwort.'
        ],
        musterloesung:
          'Sehr geehrte Frau Berger,\n\nich habe im Programm der Volkshochschule Neustadt Ihren Kurs „Buchführung für Anfänger“ gefunden und möchte mich gern anmelden. Ich arbeite seit einem Jahr in einem kleinen Büro und muss dort immer öfter Rechnungen und Zahlungen bearbeiten. Deshalb möchte ich besser verstehen, wie Buchführung funktioniert.\n\nKönnen Sie mir bitte sagen, an welchen Tagen und um welche Uhrzeit der Kurs stattfindet? Ich arbeite bis 17 Uhr, deshalb wäre ein Abendtermin ideal. Außerdem würde ich gern wissen, was der Kurs kostet. Ich habe noch keine Vorkenntnisse. Muss ich vorher etwas lernen oder etwas mitbringen?\n\nSind noch Plätze frei? Ich würde mich über eine schnelle Antwort freuen.\n\nMit freundlichen Grüßen\nMaria Santos'
      },
      {
        titel: 'Aufgabe B: Nachricht an die Kursleiterin',
        situation:
          'Sie besuchen einen Deutschkurs am Vormittag. Nächste Woche müssen Sie zu einer Operation ins Krankenhaus und können von Montag bis Mittwoch nicht zum Unterricht kommen. Am Donnerstag schreibt der Kurs einen wichtigen Test. Sie schreiben eine E-Mail an Ihre Kursleiterin, Frau Kowalski.',
        leitpunkte: [
          'Entschuldigen Sie sich und erklären Sie, warum Sie fehlen.',
          'Sagen Sie, wie lange Sie nicht kommen können.',
          'Bitten Sie um die Hausaufgaben und das Material für die drei Tage.',
          'Fragen Sie, ob Sie den Test am Donnerstag mitschreiben können.'
        ],
        musterloesung:
          'Liebe Frau Kowalski,\n\nleider muss ich Ihnen mitteilen, dass ich nächste Woche nicht zum Unterricht kommen kann. Ich muss am Montag für eine kleine Operation ins Krankenhaus und bleibe bis Mittwoch dort. Es tut mir sehr leid, dass ich so lange fehle.\n\nKönnten Sie mir bitte die Hausaufgaben und das Material für Montag bis Mittwoch schicken? Dann kann ich im Krankenhaus ein bisschen lernen und verpasse nicht zu viel.\n\nAm Donnerstag schreiben wir den Test. Ich möchte ihn sehr gern mitschreiben, weil er für meine Prüfung wichtig ist. Glauben Sie, dass das nach der Operation möglich ist? Falls nicht, könnte ich den Test vielleicht in der Woche danach nachholen.\n\nVielen Dank für Ihr Verständnis.\n\nMit freundlichen Grüßen\nAmira Haddad'
      }
    ],
    tipps:
      'Cover all four points, each in at least one full sentence. Open with a clear Anrede (Sehr geehrte Frau ... / Liebe Frau ...) and close with Grüße. Use connectors such as "weil", "deshalb" and "außerdem", and polite forms like "Könnten Sie bitte ...?" to show B1.'
  },

  sprechen: {
    teil1: {
      anweisung:
        'Stellen Sie sich vor. Sprechen Sie über die Stichworte auf Ihrer Karte. Danach stellt Ihnen die Prüferin oder der Prüfer Fragen.',
      nachfragen: [
        'Wie lange lernen Sie schon Deutsch und wo lernen Sie?',
        'Was haben Sie in Ihrem Heimatland gelernt oder gearbeitet?',
        'Was ist für Sie am schwierigsten an der deutschen Sprache?',
        'Möchten Sie sich in Zukunft weiterbilden? Wenn ja, wie?'
      ],
      redemittel: [
        'Ich heiße ... und komme aus ...',
        'Ich wohne seit ... in ...',
        'Ich arbeite als ... / Ich habe als ... gearbeitet.',
        'Ich lerne seit ... Deutsch, weil ...',
        'In meiner Familie gibt es ...',
        'Ich spreche ... und ein bisschen ...'
      ]
    },
    teil2: {
      anweisung:
        'Sie bekommen ein Foto. Beschreiben Sie, was Sie sehen und was für eine Situation das ist. Danach stellt Ihnen die Prüferin oder der Prüfer Fragen zu Ihren eigenen Erfahrungen.',
      bilder: [
        {
          beschreibung:
            'Auf dem Foto sieht man einen Klassenraum mit etwa zehn Erwachsenen an Tischen. Eine Lehrerin steht an der Tafel und erklärt etwas. Einige Leute schreiben, andere sehen auf ihre Bücher.',
          fragenA2: [
            'Haben Sie auch schon einmal einen Kurs besucht?',
            'Lernen Sie lieber in einer Gruppe oder allein?',
            'Wie kommen Sie zu Ihrem Deutschkurs?'
          ],
          fragenB1: [
            'Was war für Sie in Ihrem Deutschkurs besonders hilfreich?',
            'Welche Vor- und Nachteile hat Lernen in der Gruppe?',
            'Was würden Sie an Ihrem Kurs gern verbessern?'
          ]
        },
        {
          beschreibung:
            'Auf dem Foto sieht man eine Werkstatt. Ein junger Mann in Arbeitskleidung steht an einer Werkbank. Neben ihm steht ein älterer Mann und zeigt ihm, wie man ein Werkzeug benutzt.',
          fragenA2: [
            'Haben Sie schon einmal in einer Werkstatt oder Firma gearbeitet?',
            'Kennen Sie jemanden, der eine Ausbildung macht?',
            'Welchen Beruf finden Sie interessant?'
          ],
          fragenB1: [
            'Wie haben Sie Ihren Beruf gelernt?',
            'Warum ist eine Ausbildung in Deutschland für viele junge Leute wichtig?',
            'Würden Sie in Ihrem Alter noch einmal einen neuen Beruf lernen? Warum (nicht)?'
          ]
        }
      ],
      redemittel: [
        'Auf dem Foto sieht man ...',
        'Im Vordergrund / Im Hintergrund ...',
        'Ich glaube, die Leute sind ... / Das ist wahrscheinlich ...',
        'Bei mir war das so: ...',
        'Ich habe schon einmal ... gemacht.',
        'Meiner Meinung nach ... , weil ...'
      ]
    },
    teil3: {
      situation:
        'Ihre Deutschklasse macht in vier Wochen die Abschlussprüfung. Sie und Ihr Partner oder Ihre Partnerin möchten für die Klasse einen gemeinsamen Lernnachmittag organisieren.',
      aufgabe:
        'Planen Sie den Lernnachmittag gemeinsam. Sprechen Sie über die Punkte und machen Sie Vorschläge.',
      notizen: [
        'Wann? (Tag und Uhrzeit)',
        'Wo? (Raum)',
        'Welche Themen üben?',
        'Was soll jeder mitbringen?',
        'Essen und Getränke',
        '…?'
      ],
      redemittel: [
        'Wie wäre es, wenn wir ...?',
        'Ich schlage vor, dass ...',
        'Passt es dir am ... um ...?',
        'Gute Idee! Aber was ist mit ...?',
        'Einverstanden, dann machen wir das so.',
        'Ich kann ... mitbringen.'
      ]
    }
  }
} as const satisfies DtzExam;

export default exam;
