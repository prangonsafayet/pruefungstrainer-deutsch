import { type DtzExam } from '@shared/types/dtzExam.ts';

const exam = {
  id: 5,
  title: 'Mock exam 5',
  theme: 'Kinder, Kita & Schule',

  hoeren: {
    teil1: {
      anweisung:
        'Sie hören vier Ansagen. Zu jeder Ansage gibt es eine Aufgabe. Welche Lösung (a, b oder c) passt am besten?',
      items: [
        {
          audio:
            'Guten Tag, Sie sind verbunden mit der Kita Sonnenschein. Wegen einer Fortbildung für das ganze Team bleibt unsere Kita am kommenden Freitag geschlossen. Wenn Sie an diesem Tag keine andere Betreuung für Ihr Kind finden, melden Sie sich bitte bis Donnerstag, zwölf Uhr, für unsere Notbetreuung im Familienzentrum in der Lindenstraße an. Das geht per E-Mail oder mit dem Zettel an der Eingangstür. Am Montag sind wir wie gewohnt wieder für Ihre Kinder da. Vielen Dank.',
          frage: 'Was müssen Eltern tun, wenn sie am Freitag keine Betreuung haben?',
          options: [
            'Bis Donnerstagmittag eine Notbetreuung anmelden.',
            'Am Freitagmorgen in der Kita anrufen.',
            'Das Kind zur Grundschule bringen.'
          ],
          answer: 0
        },
        {
          audio:
            'Kinder- und Jugendarztpraxis Dr. Sommer, guten Tag. Unsere Impfsprechstunde ist jeden Dienstag von fünfzehn bis siebzehn Uhr. Dafür brauchen Sie keinen Termin. Für alle anderen Untersuchungen vereinbaren Sie bitte einen Termin. Das geht telefonisch von Montag bis Freitag, jeweils von acht bis zwölf Uhr. Vielen Dank für Ihren Anruf.',
          frage: 'Frau Petrova möchte ihr Kind impfen lassen. Sie hat keinen Termin. Wann kann sie kommen?',
          options: [
            'Am Dienstagnachmittag.',
            'Am Montagvormittag.',
            'Am Freitag zwischen acht und zwölf Uhr.'
          ],
          answer: 0
        },
        {
          audio:
            'Liebe Eltern der Klasse 3b, herzlich willkommen zum Elternabend. Eine wichtige Änderung: Der Elternabend findet heute nicht im Klassenzimmer statt, weil dort gerade der Boden erneuert wird. Wir treffen uns um neunzehn Uhr in der Mensa im Erdgeschoss. Die Aula ist heute Abend leider belegt. Bitte folgen Sie den Pfeilen im Flur.',
          frage: 'Wo findet der Elternabend statt?',
          options: ['Im Klassenzimmer der 3b.', 'In der Mensa.', 'In der Aula.'],
          answer: 1
        },
        {
          audio:
            'Grundschule Am Bach, Sekretariat. Wir sind montags bis donnerstags von acht bis zwölf Uhr für Sie da, freitags nur bis elf Uhr. Wenn Ihr Kind krank ist, können Sie es auch außerhalb dieser Zeiten entschuldigen: Sprechen Sie einfach nach dem Signalton auf diesen Anrufbeantworter. Nennen Sie bitte den Namen und die Klasse Ihres Kindes.',
          frage: 'Wie können Eltern ihr Kind krankmelden, wenn das Sekretariat nicht besetzt ist?',
          options: [
            'Sie schicken dem Sekretariat eine E-Mail.',
            'Sie sprechen auf den Anrufbeantworter.',
            'Sie warten bis zum nächsten Tag.'
          ],
          answer: 1
        }
      ]
    },
    teil2: {
      anweisung:
        'Sie hören fünf kurze Informationen im Radio. Zu jeder Information gibt es eine Aufgabe. Welche Lösung (a, b oder c) passt am besten?',
      items: [
        {
          audio:
            'Und nun das Wetter für morgen. Zu Schulbeginn ist es in der ganzen Region neblig, bei etwa fünf Grad. Ab zehn Uhr kommt die Sonne heraus, und am Nachmittag werden es bis zu zwölf Grad. Nur im Bergland regnet es den ganzen Tag.',
          frage: 'Wie ist das Wetter morgen früh?',
          options: ['Neblig.', 'Sonnig.', 'Regnerisch.'],
          answer: 0
        },
        {
          audio:
            'Verkehrsmeldung: Auf der Bundesstraße zwölf zwischen Altendorf und Neustadt gibt es nach einem Unfall Stau. Sie brauchen etwa zwanzig Minuten länger. Außerdem ist die Hauptstraße in Neustadt am Samstag von sechzehn bis neunzehn Uhr gesperrt, denn dann gehen die Kinder der Grundschulen mit ihren Laternen durch die Stadt.',
          frage: 'Warum ist die Hauptstraße am Samstag gesperrt?',
          options: [
            'Weil es einen Unfall gab.',
            'Weil es eine Baustelle gibt.',
            'Weil Kinder mit Laternen durch die Stadt gehen.'
          ],
          answer: 2
        },
        {
          audio:
            'Unser Tipp für das Wochenende: die Kinderbuchmesse in der Stadthalle. Am Samstag und am Sonntag, jeweils von zehn bis siebzehn Uhr, gibt es Lesungen, eine Bastelecke und viele Bücher zum Anschauen. Kinder bis vierzehn Jahre haben freien Eintritt, Erwachsene zahlen fünf Euro.',
          frage: 'Wer muss bei der Kinderbuchmesse nichts bezahlen?',
          options: ['Alle Besucher am Samstag.', 'Erwachsene mit Kind.', 'Kinder bis vierzehn Jahre.'],
          answer: 2
        },
        {
          audio:
            'Heute Abend um zwanzig Uhr fünfzehn hören Sie bei uns die Sendung „Familie heute“. Das Thema: Hausaufgaben. Wie lange sollen Kinder am Nachmittag lernen, und wie viel Hilfe brauchen sie? Eine Lehrerin und ein Vater sind im Studio. Sie können unter der Nummer null drei null, vier fünf sechs, sieben acht anrufen und mitreden.',
          frage: 'Was können die Hörer in der Sendung tun?',
          options: ['Ein Buch gewinnen.', 'Im Studio anrufen und mitreden.', 'Kochrezepte hören.'],
          answer: 1
        },
        {
          audio:
            'Husten, Schnupfen, Fieber? Der Herbst ist da. In der Apotheke am Markt bekommen Sie diese Woche Hustensaft für Kinder zum halben Preis. Außerdem beraten wir Sie kostenlos zum Thema Kopfläuse in Kita und Schule. Apotheke am Markt, von Montag bis Samstag für Sie da.',
          frage: 'Was ist diese Woche in der Apotheke billiger?',
          options: ['Vitamintabletten.', 'Fieberthermometer.', 'Hustensaft für Kinder.'],
          answer: 2
        }
      ]
    },
    teil3: {
      anweisung:
        'Sie hören vier Gespräche. Zu jedem Gespräch gibt es zwei Aufgaben: Ist die Aussage richtig oder falsch? Welche Lösung (a, b oder c) passt am besten?',
      gespraeche: [
        {
          audio: [
            {
              speaker: 'Frau Krüger',
              text: 'Grundschule Am Bach, Krüger. Guten Tag, Frau Demir. Ich rufe wegen des Elternsprechtags an. Ihr Termin ist am Dienstag um sechzehn Uhr dreißig.'
            },
            {
              speaker: 'Frau Demir',
              text: 'Oh, am Dienstag arbeite ich bis siebzehn Uhr. Das schaffe ich nicht. Gibt es noch einen anderen Termin?'
            },
            {
              speaker: 'Frau Krüger',
              text: 'Am Donnerstag habe ich noch Zeit, entweder um fünfzehn Uhr oder um achtzehn Uhr.'
            },
            {
              speaker: 'Frau Demir',
              text: 'Achtzehn Uhr passt gut. Dann kann ich direkt nach der Arbeit kommen.'
            },
            {
              speaker: 'Frau Krüger',
              text: 'Gut, dann trage ich Sie am Donnerstag um achtzehn Uhr ein. Bringen Sie bitte das Lesetagebuch Ihrer Tochter mit.'
            }
          ],
          statement: { text: 'Frau Demir kann am Dienstag zum Gespräch kommen.', answer: false },
          question: {
            frage: 'Wann findet das Gespräch jetzt statt?',
            options: [
              'Dienstag um sechzehn Uhr dreißig.',
              'Donnerstag um fünfzehn Uhr.',
              'Donnerstag um achtzehn Uhr.'
            ],
            answer: 2
          }
        },
        {
          audio: [
            {
              speaker: 'Erzieherin',
              text: 'Herr Schulz, hier ist die Kita Regenbogen. Lena fühlt sich nicht gut. Wir haben Fieber gemessen: achtunddreißig Komma fünf.'
            },
            {
              speaker: 'Herr Schulz',
              text: 'Oh nein. Ich bin gerade in einer Besprechung. Ich kann in einer Stunde bei Ihnen sein. Geht das?'
            },
            {
              speaker: 'Erzieherin',
              text: 'Ja, kein Problem. Lena kann so lange im Ruheraum liegen. In der Kita darf sie erst wieder spielen, wenn sie einen ganzen Tag kein Fieber mehr hat.'
            },
            {
              speaker: 'Herr Schulz',
              text: 'Verstanden. Ich gehe morgen mit ihr zur Kinderärztin. Soll ich dann ein Attest mitbringen?'
            },
            {
              speaker: 'Erzieherin',
              text: 'Nein, ein Attest brauchen wir nicht. Es reicht, wenn Sie uns Bescheid geben, sobald Lena wieder gesund ist.'
            }
          ],
          statement: {
            text: 'Lena darf erst wieder in der Kita spielen, wenn sie einen Tag lang kein Fieber hat.',
            answer: true
          },
          question: {
            frage: 'Was muss Herr Schulz tun, wenn Lena wieder gesund ist?',
            options: [
              'Der Kita ein Attest bringen.',
              'Der Kita Bescheid geben.',
              'Lena sofort wieder in die Kita bringen.'
            ],
            answer: 1
          }
        },
        {
          audio: [
            {
              speaker: 'Frau Brandt',
              text: 'Hallo Sabine! Sag mal, fährst du Mia morgens immer mit dem Auto zur Schule?'
            },
            {
              speaker: 'Sabine',
              text: 'Ja, leider. Die Schule ist drei Kilometer weit, und der Bus fährt nur alle halbe Stunde. Da komme ich morgens ständig zu spät zur Arbeit.'
            },
            {
              speaker: 'Frau Brandt',
              text: 'Wir wohnen doch fast in derselben Straße. Sollen wir eine Fahrgemeinschaft machen? Ich fahre montags, mittwochs und freitags, du dienstags und donnerstags.'
            },
            {
              speaker: 'Sabine',
              text: 'Gute Idee! Dann spare ich Zeit und Benzin. Mia braucht aber einen Kindersitz.'
            },
            {
              speaker: 'Frau Brandt',
              text: 'Kein Problem, ich habe zwei Sitze im Auto. Dann fangen wir nächste Woche an.'
            }
          ],
          statement: { text: 'Die beiden Frauen wollen sich beim Fahren abwechseln.', answer: true },
          question: {
            frage: 'Warum fährt Sabine bisher mit dem Auto?',
            options: [
              'Mia hat zu viel Gepäck.',
              'Der Bus fährt nicht oft.',
              'Der Schulweg ist zu gefährlich.'
            ],
            answer: 1
          }
        },
        {
          audio: [
            {
              speaker: 'Mutter',
              text: 'Guten Tag, ich möchte meinen Sohn Daniel für die Ferienbetreuung im August anmelden.'
            },
            { speaker: 'Mitarbeiterin', text: 'Gern. Für welche Wochen denn?' },
            { speaker: 'Mutter', text: 'Für die ersten beiden Augustwochen. Was kostet das?' },
            {
              speaker: 'Mitarbeiterin',
              text: 'Eine Woche kostet fünfundsechzig Euro, mit Mittagessen. Für Familien mit Familienpass kostet die Woche nur vierzig Euro.'
            },
            { speaker: 'Mutter', text: 'Wir haben einen Familienpass. Muss ich Daniel persönlich anmelden?' },
            {
              speaker: 'Mitarbeiterin',
              text: 'Nein, Sie füllen das Formular auf unserer Internetseite aus und laden eine Kopie des Familienpasses hoch. Das geht bis zum dreißigsten Juni.'
            }
          ],
          statement: {
            text: 'Die Anmeldung ist nur persönlich bei der Ferienbetreuung möglich.',
            answer: false
          },
          question: {
            frage: 'Was kostet eine Woche mit dem Familienpass?',
            options: ['Vierzig Euro.', 'Fünfundsechzig Euro.', 'Achtzig Euro.'],
            answer: 0
          }
        }
      ]
    },
    teil4: {
      anweisung:
        'Sie hören in einer Radiosendung vier Meinungen zu einem Thema. Lesen Sie zuerst die Sätze a–f. Zu den Meinungen 1–3 passt jeweils ein Satz. Zwei Sätze bleiben übrig. Das Beispiel (0) ist schon gelöst.',
      thema: 'Handys in der Grundschule',
      sentences: [
        'Ein Handy ist für Kinder nur für Notfälle sinnvoll.',
        'Kinder sollten erst ab zwölf Jahren ein eigenes Handy bekommen.',
        'Klingelnde Handys stören den Unterricht.',
        'Eltern sollten genau kontrollieren, wie lange ihre Kinder am Handy sind.',
        'In den Pausen reden die Kinder kaum noch miteinander.',
        'Die Schule soll den richtigen Umgang mit dem Internet beibringen, statt Handys zu verbieten.'
      ],
      beispiel: {
        audio:
          'Ich unterrichte seit fünfzehn Jahren und habe es oft erlebt: Mitten im Unterricht klingelt ein Handy, und alle Kinder schauen hin. Dann ist die Konzentration weg, und ich muss wieder von vorn anfangen. Für mich gehört das Handy deshalb nicht ins Klassenzimmer.',
        answer: 2
      },
      aussagen: [
        {
          audio:
            'Mein Sohn ist acht. Früher hat er in der Pause Fußball gespielt. Heute sitzt er mit zwei Freunden auf einer Bank, und alle drei schauen nur auf einen Bildschirm. Sie sagen kaum ein Wort. Das macht mich wirklich traurig.',
          answer: 4
        },
        {
          audio:
            'Meine Tochter fährt allein mit dem Bus zur Schule. Ich möchte wissen, ob sie gut angekommen ist, und sie kann mich anrufen, wenn der Bus ausfällt. Dafür ist das Handy gut. Zum Spielen oder für Videos braucht sie es nicht.',
          answer: 0
        },
        {
          audio:
            'Verbote bringen nichts. Die Kinder sind sowieso im Internet, spätestens zu Hause. Deshalb finde ich, dass die Schule ihnen zeigen muss, wie man sich dort sicher bewegt. Das könnte in einem eigenen Fach passieren, zum Beispiel „Medien“.',
          answer: 5
        }
      ]
    }
  },

  lesen: {
    teil1: {
      anweisung:
        'Lesen Sie den Wegweiser und die Situationen 21–25. Wohin gehen Sie? Kreuzen Sie an: a, b oder c.',
      titel: 'Gesamtschule Am Stadtpark – Wegweiser',
      verzeichnis: `3. Stock
Physik- und Chemieräume (301–306)
Kunstraum (307)
Musiksaal (310)

2. Stock
Klassenräume 7 bis 10 (201–216)
Computerraum (220)
Schulbibliothek (222)

1. Stock
Klassenräume 5 und 6 (101–110)
Lehrerzimmer (112)
Schulsozialarbeit (115)
Elternsprechzimmer (116)

Erdgeschoss
Sekretariat (001)
Schulleitung (002)
Hausmeister (004)
Mensa mit Essensausgabe
Elterncafé „Treffpunkt“

Untergeschoss
Turnhalle und Umkleiden
Fahrradkeller`,
      questions: [
        {
          frage: 'Sie möchten Ihre Tochter für morgen im Sekretariat krankmelden. Wohin gehen Sie?',
          options: ['Erdgeschoss', '1. Stock', 'anderes Stockwerk'],
          answer: 0
        },
        {
          frage:
            'Sie möchten mit einer Sozialarbeiterin über die Probleme Ihres Sohnes in der Klasse sprechen.',
          options: ['1. Stock', '2. Stock', 'anderes Stockwerk'],
          answer: 0
        },
        {
          frage:
            'Ihre Tochter aus der 8. Klasse hat ein Buch in der Schulbibliothek vergessen. Wohin gehen Sie?',
          options: ['1. Stock', '2. Stock', 'anderes Stockwerk'],
          answer: 1
        },
        {
          frage: 'Sie suchen die Turnhalle, weil dort heute das Sportfest stattfindet.',
          options: ['Erdgeschoss', '1. Stock', 'anderes Stockwerk'],
          answer: 2
        },
        {
          frage: 'Sie holen Ihren Sohn zum Mittagessen in der Mensa ab.',
          options: ['1. Stock', '2. Stock', 'anderes Stockwerk'],
          answer: 2
        }
      ]
    },
    teil2: {
      anweisung:
        'Lesen Sie die Situationen 26–30 und die Anzeigen a–h. Welche Anzeige passt zu welcher Situation? Zu einer Situation gibt es keine passende Anzeige. Hier markieren Sie X.',
      situations: [
        'Ihr Sohn (12 Jahre) möchte in den Ferien Programmieren lernen.',
        'Ihr Sohn (5 Jahre) hat viel Energie. Sie suchen am Wochenende Sport für ihn und möchten ihn zuerst kostenlos ausprobieren lassen.',
        'Sie möchten am Freitagabend mit Ihrem Mann ins Kino gehen. Sie suchen jemanden für Ihre Kinder, den Sie im Internet buchen können.',
        'Ihre Tochter kommt bald in die Schule. Sie suchen einen gebrauchten Schulranzen.',
        'Ihre Tochter (8 Jahre) hat Probleme in Mathematik. Sie suchen eine günstige Lösung in einer kleinen Gruppe.'
      ],
      ads: [
        'Volkshochschule Bergfeld: Computerkurs „Tabellen und Texte“ für Erwachsene. Mittwochs 18.30–20.00 Uhr, 10 Abende, 85 Euro. Anmeldung online.',
        'TSV Eintracht: Kinderturnen für 3- bis 6-Jährige. Samstags 10.00–11.00 Uhr in der Turnhalle der Grundschule Nord. Die erste Stunde zum Schnuppern ist kostenlos!',
        'Schulbasar in der Aula der Gesamtschule: Gebrauchte Schulranzen, Bücher und Turnbeutel zu kleinen Preisen. Samstag, 9–13 Uhr. Eintritt frei.',
        'Ferienlager „Waldfreunde“: Eine Woche zelten, Fußball und Schwimmen für Kinder von 8 bis 14 Jahren. 190 Euro, Anmeldung bis 1. Juni.',
        'Lernhaus Pünktchen: Nachhilfe in Mathe, Deutsch und Englisch für die Klassen 1–10. Gruppenstunde 9 Euro, Einzelstunde 18 Euro. Montag bis Freitag, 14–18 Uhr.',
        'Familienzentrum Lindenstraße: Spielgruppe für Kinder von 1 bis 3 Jahren, dienstags und donnerstags 9–11 Uhr. Eltern bleiben dabei.',
        'Babysitter-Börse „Kleine Helfer“: Geprüfte Babysitter ab 16 Jahren, 10 Euro pro Stunde. Buchung online bis 2 Tage vorher.',
        'Mathe-Nachhilfe von Studentin: Einzelunterricht für Schüler ab Klasse 9, auch Abitur-Vorbereitung. 25 Euro pro Stunde, bei Ihnen zu Hause.'
      ],
      answers: [-1, 1, 6, 2, 4]
    },
    teil3: {
      anweisung:
        'Lesen Sie die Texte 1–3 und die Aufgaben dazu. Ist die Aussage richtig oder falsch? Welche Lösung (a, b oder c) passt am besten?',
      texts: [
        {
          titel: 'Neue Schulbuslinie ab November',
          text: 'Ab dem 3. November fährt die neue Schulbuslinie 27 vom Neubaugebiet Birkenhain zur Gesamtschule Am Stadtpark. Der Bus startet um 7.05 Uhr an der Haltestelle „Birkenweg“ und braucht für die Strecke zwölf Minuten. Bisher mussten die Schülerinnen und Schüler aus Birkenhain mit zwei Linien fahren und umsteigen. Die Stadt bezahlt die Fahrkarte für alle Kinder, die weiter als drei Kilometer von der Schule entfernt wohnen. Alle anderen zahlen den normalen Schülerpreis von 28 Euro im Monat. Anträge gibt es im Rathaus und auf der Internetseite der Stadt. „Wir hoffen, dass jetzt weniger Eltern ihre Kinder mit dem Auto zur Schule bringen“, sagt Bürgermeisterin Ruth Albers.',
          statement: { text: 'Schüler aus Birkenhain müssen künftig nicht mehr umsteigen.', answer: true },
          question: {
            frage: 'Wer bekommt die Fahrkarte von der Stadt bezahlt?',
            options: [
              'Kinder, die mehr als drei Kilometer von der Schule entfernt wohnen.',
              'Alle Kinder der Gesamtschule.',
              'Nur Kinder, die in Birkenhain wohnen.'
            ],
            answer: 0
          }
        },
        {
          titel: 'E-Mail der Kita „Regenbogen“',
          text: `Betreff: Neue Öffnungszeiten und Sommerschließung

Sehr geehrte Eltern,

ab dem 1. Januar ändern sich die Öffnungszeiten unserer Kita. Wir öffnen künftig um 7.00 Uhr statt um 7.30 Uhr. Dafür schließen wir freitags schon um 15.00 Uhr statt um 16.30 Uhr. Der Grund: Mehrere Kolleginnen gehen in Elternzeit, und wir haben deshalb weniger Personal. Die Sommerschließung dauert im nächsten Jahr drei Wochen, vom 20. Juli bis zum 7. August. Wer in dieser Zeit eine Betreuung braucht, meldet das bitte bis zum 28. Februar im Büro. Der Elternbeitrag bleibt unverändert.

Mit freundlichen Grüßen
Sabine Hoffmann, Kita-Leitung`,
          statement: { text: 'Die Kita öffnet im neuen Jahr später als bisher.', answer: false },
          question: {
            frage: 'Warum ändern sich die Öffnungszeiten?',
            options: [
              'Weil weniger Personal da ist.',
              'Weil die Eltern es wünschen.',
              'Weil weniger Kinder angemeldet sind.'
            ],
            answer: 0
          }
        },
        {
          titel: 'Mitteilung der Grundschule Am Bach',
          text: `Liebe Eltern der Klassen 1 bis 4,

am kommenden Donnerstag machen alle Klassen einen Wandertag zum Naturpark. Der Bus fährt um 8.15 Uhr an der Schule ab, die Rückkehr ist gegen 13.00 Uhr. Bitte geben Sie Ihrem Kind wetterfeste Kleidung, festes Schuhwerk und einen Rucksack mit Getränk und Pausenbrot mit. Für den Bus bezahlen Sie 4,50 Euro. Das Geld geben Sie bitte bis Dienstag in einem Umschlag mit dem Namen des Kindes dem Klassenlehrer. Wenn die Kosten ein Problem für Sie sind, sprechen Sie bitte mit der Schulleitung. Bei starkem Regen wird der Wandertag auf Freitag verschoben.

Mit freundlichen Grüßen
Die Schulleitung`,
          statement: { text: 'Bei starkem Regen findet der Wandertag am Freitag statt.', answer: true },
          question: {
            frage: 'Was sollen Eltern bis Dienstag tun?',
            options: [
              'Das Kind im Sekretariat anmelden.',
              'Dem Klassenlehrer 4,50 Euro im Umschlag geben.',
              'Verpflegung in der Schule bestellen.'
            ],
            answer: 1
          }
        }
      ]
    },
    teil4: {
      anweisung: 'Lesen Sie den Text und die Aussagen 1–3. Ist die Aussage richtig oder falsch?',
      titel: 'Schulstart in Bergfeld – Informationen für Eltern',
      text: `Schulpflicht
Alle Kinder, die bis zum 30. September sechs Jahre alt werden, müssen im selben Jahr in die Schule gehen. Wer erst nach dem 30. September sechs wird, kann auf Antrag früher eingeschult werden.

Anmeldung
Die Anmeldung findet im November statt. Im Oktober bekommen Sie dazu einen Brief von der Stadt. Bitte bringen Sie zur Anmeldung die Geburtsurkunde und den Impfausweis Ihres Kindes mit. Die Anmeldung ist nur persönlich im Schulbüro der zuständigen Grundschule möglich.

Schuleingangsuntersuchung
Im Frühjahr untersucht das Gesundheitsamt alle angemeldeten Kinder. Dabei werden Sehen, Hören und Sprache geprüft. Die Untersuchung ist kostenlos und dauert etwa eine Stunde. Ein Elternteil muss das Kind begleiten.

Schulmaterial und Kosten
Der Schulbesuch ist kostenlos. Für Hefte, Stifte und den Schulranzen müssen die Eltern aber selbst bezahlen. Familien mit geringem Einkommen können beim Jobcenter einen Zuschuss beantragen.

Betreuung am Nachmittag
Die meisten Grundschulen in Bergfeld bieten bis 16 Uhr eine Betreuung an. Sie kostet je nach Einkommen zwischen 0 und 90 Euro im Monat. Für die Nachmittagsbetreuung ist ein eigener Antrag nötig, den Sie bis zum 31. Januar stellen müssen.`,
      statements: [
        { text: 'Die Anmeldung in der Grundschule ist auch online möglich.', answer: false },
        { text: 'Die Schuleingangsuntersuchung kostet nichts.', answer: true },
        { text: 'Familien mit wenig Geld können Hilfe für das Schulmaterial bekommen.', answer: true }
      ]
    },
    teil5: {
      anweisung: 'Lesen Sie den Brief. Welche Lösung (a, b oder c) passt in die Lücken [1] bis [6]?',
      text: `Sehr geehrte Frau Winkler,

vielen Dank für Ihren Brief. Ich möchte Sie um [1] Gespräch bitten, [2] ich mir Sorgen um die Leistungen meines Sohnes Emre mache.

Emre geht sehr gern in Ihre Klasse, [3] er hat seit einigen Wochen große Schwierigkeiten beim Lesen. Zu Hause lese ich jeden Abend [4] ihm, aber er mag keine Bücher. Gestern hat er mir erzählt, dass er sich vor dem Vorlesen in der Klasse fürchtet.

Ich habe deshalb schon mit unserer Kinderärztin [5]. Sie hat mir einen Termin bei einer Logopädin empfohlen, [6] ich leider erst im Januar bekomme.

Ich wäre Ihnen dankbar, wenn Sie nächste Woche Zeit für mich hätten.

Mit freundlichen Grüßen
Elif Yıldız`,
      gaps: [
        { options: ['einen', 'einem', 'ein'], answer: 2 },
        { options: ['weil', 'damit', 'obwohl'], answer: 0 },
        { options: ['sondern', 'aber', 'deshalb'], answer: 1 },
        { options: ['bei', 'zu', 'mit'], answer: 2 },
        { options: ['sprochen', 'gesprochen', 'gesprecht'], answer: 1 },
        { options: ['der', 'dem', 'den'], answer: 2 }
      ]
    }
  },

  schreiben: {
    anweisung:
      'Wählen Sie Aufgabe A oder Aufgabe B. Zeigen Sie, was Sie können. Schreiben Sie möglichst viel. Vergessen Sie nicht die Anrede und den Gruß.',
    tasks: [
      {
        titel: 'Aufgabe A: Ihr Kind ist krank',
        situation:
          'Ihr Sohn Tim (7 Jahre) geht in die Klasse 2a. Er hat seit gestern Fieber und kann nicht in die Schule gehen. Schreiben Sie eine E-Mail an die Klassenlehrerin, Frau Berger.',
        leitpunkte: [
          'Entschuldigen Sie Tim und nennen Sie den Grund.',
          'Sagen Sie, wie lange er voraussichtlich fehlt.',
          'Bitten Sie um die Hausaufgaben für diese Tage.',
          'Fragen Sie, ob Sie Ihren Termin beim Elternsprechtag verschieben können.'
        ],
        musterloesung:
          'Sehr geehrte Frau Berger,\n\nleider ist mein Sohn Tim seit gestern krank. Er hat Fieber und Husten, deshalb kann er nicht in die Schule kommen. Bitte entschuldigen Sie sein Fehlen. Die Kinderärztin hat gesagt, dass er bis Freitag zu Hause bleiben muss. Ich hoffe, dass er am Montag wieder gesund ist.\n\nKönnten Sie mir bitte sagen, welche Hausaufgaben Tim in dieser Woche machen soll? Ich kann die Blätter auch am Nachmittag in der Schule abholen, wenn das für Sie einfacher ist. Außerdem habe ich am Donnerstag einen Termin beim Elternsprechtag. Tim ist dann vielleicht noch krank, und ich möchte ihn nicht allein lassen. Wäre es möglich, den Termin auf nächste Woche zu verschieben?\n\nVielen Dank für Ihre Hilfe.\n\nMit freundlichen Grüßen\nMaria Petrova'
      },
      {
        titel: 'Aufgabe B: Ferienbetreuung',
        situation:
          'Ihre Tochter Amira (9 Jahre) soll in den Sommerferien in die Ferienbetreuung der Stadt gehen. Sie schreiben eine E-Mail an die Leiterin, Frau Dr. Ahrens.',
        leitpunkte: [
          'Stellen Sie sich und Ihre Tochter kurz vor.',
          'Nennen Sie die Wochen, für die Sie einen Platz brauchen.',
          'Fragen Sie nach den Kosten und nach dem Mittagessen.',
          'Bitten Sie um das Anmeldeformular und um eine Antwort bis Ende Mai.'
        ],
        musterloesung:
          'Sehr geehrte Frau Dr. Ahrens,\n\nmein Name ist Ali Hassan, und ich bin der Vater von Amira. Sie ist neun Jahre alt und geht in die dritte Klasse der Grundschule Nord. Ich arbeite ganztags und suche deshalb in den Sommerferien einen Betreuungsplatz für sie.\n\nAmira soll in den ersten drei Ferienwochen kommen, also vom 6. bis zum 24. Juli. Können Sie mir bitte sagen, was die Betreuung pro Woche kostet und ob das Mittagessen im Preis enthalten ist? Amira isst kein Schweinefleisch. Gibt es dafür eine Lösung?\n\nIch wäre Ihnen dankbar, wenn Sie mir das Anmeldeformular schicken könnten. Ich brauche bis Ende Mai eine Antwort, weil ich dann meinen Urlaub planen muss.\n\nVielen Dank im Voraus.\n\nMit freundlichen Grüßen\nAli Hassan'
      }
    ],
    tipps:
      'Cover all four Leitpunkte and write a complete text with Anrede and Gruß. Use polite forms ("Könnten Sie ...", "Ich wäre Ihnen dankbar, wenn ...") and connect your sentences with "weil", "deshalb" or "außerdem". Keep a formal tone in Aufgabe B.'
  },

  sprechen: {
    teil1: {
      anweisung:
        'Stellen Sie sich vor. Sprechen Sie über Ihren Namen, Ihren Geburtsort, Ihren Wohnort, Ihre Arbeit oder Ihren Beruf, Ihre Familie und Ihre Sprachen.',
      nachfragen: [
        'Haben Sie Kinder? Wie alt sind sie und wohin gehen sie?',
        'Wie lange wohnen Sie schon in Deutschland?',
        'Was gefällt Ihnen an Ihrem Wohnort besonders gut?',
        'Welche Sprachen sprechen Sie zu Hause mit Ihrer Familie?'
      ],
      redemittel: [
        'Ich heiße ... und komme aus ...',
        'Ich wohne seit ... in ...',
        'Ich arbeite als ... / Ich suche zurzeit Arbeit als ...',
        'Ich bin verheiratet / ledig und habe ... Kinder.',
        'Zu Hause sprechen wir ..., aber mit meinen Kindern spreche ich auch Deutsch.'
      ]
    },
    teil2: {
      anweisung:
        'Beschreiben Sie das Foto: Was sehen Sie? Was für eine Situation ist das? Danach stellt Ihnen die Prüferin oder der Prüfer Fragen zu Ihren eigenen Erfahrungen.',
      bilder: [
        {
          beschreibung:
            'Auf dem Foto sieht man einen Vater, der morgens sein kleines Kind in der Kita abgibt. Das Kind zieht in der Garderobe die Jacke aus, und eine Erzieherin begrüßt beide freundlich. Im Hintergrund hängen viele bunte Kinderjacken und Rucksäcke.',
          fragenA2: [
            'Wie kommen die Kinder bei Ihnen zur Kita oder zur Schule?',
            'Was ziehen Kinder im Winter an?',
            'Haben Sie Ihre Kinder auch schon morgens in die Kita gebracht?'
          ],
          fragenB1: [
            'Wie war das in Ihrem Heimatland: Ab welchem Alter gehen Kinder dort in die Kita? Was ist anders als in Deutschland?',
            'Wie finden Sie es, wenn kleine Kinder schon früh den ganzen Tag betreut werden?',
            'Wie schaffen Eltern es, Arbeit und Kinder zu organisieren?'
          ]
        },
        {
          beschreibung:
            'Auf dem Foto sieht man eine Mutter und ihre Tochter am Küchentisch. Das Mädchen macht Hausaufgaben und schaut ein wenig traurig auf ihr Heft, die Mutter zeigt auf eine Aufgabe und erklärt etwas. Auf dem Tisch liegen Stifte, Bücher und ein Glas Saft.',
          fragenA2: [
            'Haben Sie als Kind auch Hausaufgaben gemacht?',
            'Wo und wann machen Kinder bei Ihnen Hausaufgaben?',
            'Welches Schulfach mochten Sie am liebsten?'
          ],
          fragenB1: [
            'Sollten Eltern ihren Kindern bei den Hausaufgaben helfen? Warum oder warum nicht?',
            'Wie war Ihre Schulzeit? Was würden Sie heute anders machen?',
            'Wie können Eltern helfen, die selbst nicht gut Deutsch sprechen?'
          ]
        }
      ],
      redemittel: [
        'Auf dem Foto sieht man ...',
        'Ich glaube, die Person ... gerade ...',
        'Das erinnert mich an ...',
        'Bei uns ist das anders / ähnlich, denn ...',
        'Ich finde es gut / nicht so gut, wenn ...'
      ]
    },
    teil3: {
      situation:
        'Die Klasse Ihres Kindes möchte ein Sommerfest an der Schule feiern. Sie planen es gemeinsam mit einem anderen Elternteil.',
      aufgabe: 'Besprechen Sie, was nötig ist, und einigen Sie sich auf einen Plan.',
      notizen: [
        'Wann und wo?',
        'Wer wird eingeladen?',
        'Essen und Getränke',
        'Spiele und Musik für die Kinder',
        'Wer macht was?',
        '…?'
      ],
      redemittel: [
        'Was hältst du davon, wenn wir ...?',
        'Ich schlage vor, dass wir ...',
        'Das ist eine gute Idee, aber ...',
        'Wollen wir das so machen?',
        'Wer kümmert sich um ...? – Das kann ich übernehmen.'
      ]
    }
  }
} as const satisfies DtzExam;

export default exam;
