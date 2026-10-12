import { type DtzExam } from '@shared/types';

const exam = {
  id: 7,
  title: 'Modelltest 7',
  theme: 'Verkehr & Mobilität',

  hoeren: {
    teil1: {
      anweisung:
        'Sie hören vier Ansagen. Zu jeder Ansage gibt es eine Aufgabe. Welche Lösung (a, b oder c) passt am besten?',
      items: [
        {
          audio:
            'Guten Tag, Sie haben die Fahrschule Lenz erreicht. Unser Büro ist von Montag bis Donnerstag am Nachmittag besetzt, von fünfzehn bis achtzehn Uhr. Die Theoriestunde heute Abend fällt leider aus, weil unser Lehrer krank ist. Alle Fahrstunden finden wie geplant statt. Bitte sprechen Sie nach dem Signalton Ihren Namen und Ihre Telefonnummer auf das Band.',
          frage: 'Was fällt heute aus?',
          options: ['Die Fahrstunde.', 'Die Theoriestunde.', 'Die Büroöffnung.'],
          answer: 1
        },
        {
          audio:
            'Achtung am Gleis drei. Der Regionalexpress nach Würzburg hat heute zehn Minuten Verspätung. Er fährt nicht von Gleis drei, sondern von Gleis sieben ab. Bitte gehen Sie durch die Unterführung zu Gleis sieben. Beachten Sie auch die Anzeigetafeln.',
          frage: 'Was sollen die Reisenden nach Würzburg tun?',
          options: ['Zu Gleis sieben gehen.', 'Auf Gleis drei warten.', 'Auf einen Ersatzbus warten.'],
          answer: 0
        },
        {
          audio:
            'Verkehrsbetriebe Altenau, guten Tag. Sie möchten ein Monatsticket kaufen oder kündigen? Dann drücken Sie bitte die Eins. Haben Sie Fragen zu den Fahrplänen? Drücken Sie die Zwei. Wenn Sie etwas im Bus oder in der Bahn vergessen haben, drücken Sie die Drei. Für alle anderen Anliegen bleiben Sie bitte in der Leitung.',
          frage: 'Sie haben im Bus Ihren Regenschirm vergessen. Welche Taste drücken Sie?',
          options: ['Die Eins.', 'Die Zwei.', 'Die Drei.'],
          answer: 2
        },
        {
          audio:
            'Liebe Fahrgäste, wegen einer Baustelle in der Hauptstraße fährt die Linie zwölf bis Sonntag nicht über den Marktplatz. Bitte steigen Sie an der Haltestelle Schillerplatz aus. Von dort fährt alle zehn Minuten ein Ersatzbus zum Marktplatz. Ihre Fahrscheine bleiben gültig. Wir danken für Ihr Verständnis.',
          frage: 'Wie kommen die Fahrgäste zum Marktplatz?',
          options: [
            'Mit der Linie zwölf direkt.',
            'Mit einem Ersatzbus ab Schillerplatz.',
            'Zu Fuß ab der Hauptstraße.'
          ],
          answer: 1
        }
      ]
    },
    teil2: {
      anweisung:
        'Sie hören fünf kurze Radiobeiträge. Zu jedem Beitrag gibt es eine Aufgabe. Welche Lösung (a, b oder c) passt am besten?',
      items: [
        {
          audio:
            'Und jetzt das Wetter für morgen. Im Norden regnet es am Vormittag, am Nachmittag wird es trocken. Im Süden bleibt es sonnig bei bis zu zweiundzwanzig Grad. Im Osten ziehen am Abend Nebelfelder auf, deshalb fahren Sie dort bitte vorsichtig.',
          frage: 'Wie wird das Wetter morgen im Süden?',
          options: ['Regnerisch am Vormittag.', 'Sonnig und warm.', 'Neblig am Abend.'],
          answer: 1
        },
        {
          audio:
            'Und nun die Verkehrsmeldung. Auf der A neun Richtung München stehen Sie zwischen Ingolstadt und Pfaffenhofen im Stau. Wegen eines Unfalls ist der Stau etwa fünf Kilometer lang. Sie müssen mit etwa dreißig Minuten Verspätung rechnen. Die Autobahn ist nicht gesperrt.',
          frage: 'Wie lange müssen Autofahrer auf der A neun länger fahren?',
          options: ['Etwa fünf Minuten.', 'Etwa dreißig Minuten.', 'Mehr als eine Stunde.'],
          answer: 1
        },
        {
          audio:
            'Unser Tipp für das Wochenende: der Fahrradfrühling in Altenau. Am Samstag und Sonntag findet auf dem Festplatz ein großer Fahrradmarkt statt. Der Eintritt kostet zwei Euro, Kinder kommen kostenlos hinein. Von zehn bis zwölf Uhr können Sie Ihr Rad kostenlos prüfen lassen. Reparaturen kosten aber extra.',
          frage: 'Was ist beim Fahrradfrühling kostenlos?',
          options: ['Die Prüfung des Fahrrads.', 'Der Eintritt für Erwachsene.', 'Die Reparatur.'],
          answer: 0
        },
        {
          audio:
            'Heute Abend um zwanzig Uhr hören Sie bei Radio Altenau die Sendung „Unterwegs“. Diesmal geht es um die Frage: Wie kommen Pendler günstiger zur Arbeit? Zu Gast ist ein Experte der Verkehrsbetriebe. Hörerinnen und Hörer können während der Sendung anrufen und ihre Fragen stellen.',
          frage: 'Worum geht es in der Sendung?',
          options: [
            'Wann die Busse neue Fahrpläne bekommen.',
            'Wo man sein Auto reparieren lässt.',
            'Wie man günstig zur Arbeit fährt.'
          ],
          answer: 2
        },
        {
          audio:
            'Müde am Steuer? Jeder vierte schwere Unfall auf der Autobahn entsteht durch Müdigkeit. Machen Sie deshalb alle zwei Stunden eine Pause, trinken Sie Wasser und gehen Sie ein paar Minuten spazieren. Kaffee hilft nur für kurze Zeit. Ihre Gesundheit ist wichtiger als jede Minute, die Sie sparen.',
          frage: 'Was hilft laut Radiospot am besten gegen Müdigkeit beim Autofahren?',
          options: ['Regelmäßig Pausen machen.', 'Viel Kaffee trinken.', 'Das Radio laut stellen.'],
          answer: 0
        }
      ]
    },
    teil3: {
      anweisung:
        'Sie hören vier Gespräche. Zu jedem Gespräch gibt es zwei Aufgaben. Entscheiden Sie bei der ersten Aufgabe, ob die Aussage richtig oder falsch ist. Welche Lösung (a, b oder c) passt bei der zweiten Aufgabe am besten?',
      gespraeche: [
        {
          audio: [
            { speaker: 'Mann', text: 'Guten Tag. Ich möchte morgen nach Leipzig fahren. Was kostet das?' },
            {
              speaker: 'Mitarbeiterin',
              text: 'Guten Tag. Am Vormittag gibt es zwei Züge. Der Zug um sechs Uhr fünfzehn kostet mit dem Sparpreis neunundzwanzig Euro. Der Zug um sieben Uhr vierzig kostet achtundfünfzig Euro. Danach fährt erst um vierzehn Uhr zwölf wieder einer.'
            },
            {
              speaker: 'Mann',
              text: 'Ich habe um zehn Uhr einen Termin in Leipzig. Wann kommt der Zug um sieben Uhr vierzig an?'
            },
            { speaker: 'Mitarbeiterin', text: 'Um neun Uhr fünfundvierzig.' },
            {
              speaker: 'Mann',
              text: 'Das ist knapp, aber es geht. Um sechs Uhr fünfzehn ist mir zu früh. Dann nehme ich den späteren Zug.'
            },
            {
              speaker: 'Mitarbeiterin',
              text: 'Gut. Das macht achtundfünfzig Euro. Zahlen Sie bar oder mit Karte?'
            }
          ],
          statement: { text: 'Der Mann hat in Leipzig um zehn Uhr einen Termin.', answer: true },
          question: {
            frage: 'Welche Fahrkarte kauft der Mann?',
            options: [
              'Eine Fahrkarte für den Zug um 6.15 Uhr für 29 Euro.',
              'Eine Fahrkarte für den Zug um 7.40 Uhr für 58 Euro.',
              'Eine Fahrkarte für den Zug um 14.12 Uhr.'
            ],
            answer: 1
          }
        },
        {
          audio: [
            { speaker: 'Ben', text: 'Anna, kommst du eigentlich immer mit dem Fahrrad ins Büro?' },
            {
              speaker: 'Anna',
              text: 'Ja, seit einem Jahr. Mit dem E-Bike brauche ich nur fünfunddreißig Minuten, obwohl ich zwölf Kilometer fahre.'
            },
            {
              speaker: 'Ben',
              text: 'Wirklich? Ich fahre noch mit dem Auto, aber der Parkplatz kostet achtzig Euro im Monat. Stau habe ich eigentlich selten, aber das Geld ärgert mich.'
            },
            {
              speaker: 'Anna',
              text: 'Dann kauf dir doch auch ein Rad. Unsere Firma gibt zweihundert Euro dazu. Den Rest musst du natürlich selbst bezahlen.'
            },
            { speaker: 'Ben', text: 'Das wusste ich nicht. Und wo stelle ich das Rad ab?' },
            { speaker: 'Anna', text: 'Im Keller. Dort gibt es sogar eine Dusche.' }
          ],
          statement: { text: 'Die Firma bezahlt das Fahrrad vollständig.', answer: false },
          question: {
            frage: 'Warum möchte Ben nicht mehr mit dem Auto fahren?',
            options: ['Er steht oft im Stau.', 'Der Parkplatz ist zu teuer.', 'Sein Auto ist kaputt.'],
            answer: 1
          }
        },
        {
          audio: [
            { speaker: 'Kundin', text: 'Guten Tag, ich möchte den Führerschein machen. Was muss ich tun?' },
            {
              speaker: 'Fahrlehrer',
              text: 'Zuerst brauchen Sie einen Sehtest und einen Erste-Hilfe-Kurs. Den Sehtest machen Sie beim Optiker, er kostet sieben Euro. Der Erste-Hilfe-Kurs dauert einen Tag.'
            },
            { speaker: 'Kundin', text: 'Und wann kann ich mit dem Unterricht anfangen?' },
            {
              speaker: 'Fahrlehrer',
              text: 'Der nächste Theoriekurs beginnt am dritten Mai, jeweils abends. Die Fahrstunden vereinbaren wir danach.'
            },
            { speaker: 'Kundin', text: 'Muss ich die Theorieprüfung schon vor dem Kurs machen?' },
            {
              speaker: 'Fahrlehrer',
              text: 'Nein, die machen Sie erst am Ende der Theoriestunden. Zuerst kommen der Sehtest und der Erste-Hilfe-Kurs.'
            }
          ],
          statement: { text: 'Den Sehtest macht man beim Optiker.', answer: true },
          question: {
            frage: 'Was muss die Kundin vor dem Unterricht machen?',
            options: [
              'Einen Sehtest und einen Erste-Hilfe-Kurs.',
              'Die Theorieprüfung ablegen.',
              'Eine Probefahrt machen.'
            ],
            answer: 0
          }
        },
        {
          audio: [
            {
              speaker: 'Mann',
              text: 'Guten Tag. Ich habe gestern Abend im Bus der Linie zwölf meinen Rucksack vergessen. Kann ich ihn heute abholen?'
            },
            {
              speaker: 'Mitarbeiterin',
              text: 'Leider nicht sofort. Gefundene Sachen kommen erst nach zwei Tagen ins Fundbüro am Hauptbahnhof. Kommen Sie am Donnerstag, das Fundbüro ist von acht bis sechzehn Uhr geöffnet.'
            },
            { speaker: 'Mann', text: 'Muss ich meine Fahrkarte mitbringen?' },
            {
              speaker: 'Mitarbeiterin',
              text: 'Nein, die brauchen Sie nicht. Aber bringen Sie bitte Ihren Personalausweis mit. Beschreiben Sie mir bitte noch kurz den Rucksack.'
            },
            {
              speaker: 'Mann',
              text: 'Er ist schwarz, und in der Seitentasche steckt eine blaue Wasserflasche.'
            }
          ],
          statement: { text: 'Der Mann kann seinen Rucksack sofort abholen.', answer: false },
          question: {
            frage: 'Was muss der Mann zum Fundbüro mitbringen?',
            options: ['Die Fahrkarte.', 'Ein Foto vom Rucksack.', 'Den Personalausweis.'],
            answer: 2
          }
        }
      ]
    },
    teil4: {
      anweisung:
        'Sie hören im Radio eine Diskussion zum Thema „Brauchen wir in der Innenstadt noch Autos?“. Sie hören zuerst ein Beispiel und dann drei Aussagen. Welcher Satz (a–f) passt zu welcher Aussage? Zwei Sätze bleiben übrig.',
      thema: 'Brauchen wir in der Innenstadt noch Autos?',
      sentences: [
        'Ich fahre jeden Tag mit dem Fahrrad, weil das schnell und gesund ist.',
        'Mit kleinen Kindern kann ich nicht ohne Auto einkaufen.',
        'Busse und Bahnen sollten billiger werden, dann steigen mehr Leute um.',
        'Für meine Arbeit brauche ich ein Auto, weil ich viel Material transportiere.',
        'In der Stadt gibt es zu wenige Parkplätze.',
        'Ich gehe gern zu Fuß, und die Autos in der Innenstadt stören mich.'
      ],
      beispiel: {
        audio:
          'Ich bin Elektriker und fahre jeden Tag zu verschiedenen Kunden. Meine Leitern und meine Kabel kann ich nicht im Bus mitnehmen. Deshalb muss ich mit dem Auto fahren, ob es jemandem gefällt oder nicht.',
        answer: 3
      },
      aussagen: [
        {
          audio:
            'Ich habe zwei kleine Kinder, drei und sechs Jahre alt. Mit Kinderwagen und vollen Einkaufstüten im Bus, das schaffe ich nicht. Der Supermarkt ist weit weg, und die Kinder sind schnell müde. Für uns als Familie ist das Auto im Alltag einfach nötig.',
          answer: 1
        },
        {
          audio:
            'Ich bin Student und habe kein Auto. Das Monatsticket kostet bei uns sechzig Euro, das ist viel Geld. Ein Fahrrad habe ich auch, aber im Winter fahre ich damit nicht. Wenn die Fahrkarten nur halb so teuer wären, würden bestimmt viele meiner Freunde den Bus nehmen.',
          answer: 2
        },
        {
          audio:
            'Ich wohne seit vierzig Jahren mitten in der Stadt und erledige fast alles zu Fuß. Früher war es ruhiger. Heute sind die Straßen laut und die Luft ist schlecht. Radfahren ist mir zu gefährlich, deshalb wünsche ich mir mehr autofreie Straßen im Zentrum.',
          answer: 5
        }
      ]
    }
  },

  lesen: {
    teil1: {
      anweisung:
        'Lesen Sie den Wegweiser und die Aufgaben 21 bis 25. Wohin gehen Sie? Welche Lösung (a, b oder c) passt am besten?',
      titel: 'Hauptbahnhof Neustadt – Wegweiser',
      verzeichnis:
        'Untergeschoss\nFahrradparkhaus · Schließfächer · Toiletten\n\nErdgeschoss\nReisezentrum (nur Fahrkarten und Reiseauskunft) · Fundbüro · Bäckerei Kornblume · Kiosk · Apotheke\n\n1. Obergeschoss\nWartesaal · Bahnhofsmission · Mobilitätsservice (Hilfe beim Ein- und Aussteigen, Rollstuhl-Service) · Reisebüro Fernweh\n\n2. Obergeschoss\nKundendialog (Beschwerden, Erstattung bei Verspätung) · Verwaltung der Regionalbahn · Konferenzraum',
      questions: [
        {
          frage: 'Sie möchten Ihr Fahrrad sicher abstellen.',
          options: ['Untergeschoss', 'Erdgeschoss', '2. Obergeschoss'],
          answer: 0
        },
        {
          frage: 'Sie möchten eine Fahrkarte nach Hamburg kaufen.',
          options: ['Erdgeschoss', '1. Obergeschoss', '2. Obergeschoss'],
          answer: 0
        },
        {
          frage: 'Sie haben im Zug Ihre Jacke vergessen.',
          options: ['1. Obergeschoss', '2. Obergeschoss', 'Ein anderes Stockwerk'],
          answer: 2
        },
        {
          frage: 'Ihre Großmutter sitzt im Rollstuhl und braucht Hilfe beim Einsteigen in den Zug.',
          options: ['Erdgeschoss', '1. Obergeschoss', '2. Obergeschoss'],
          answer: 1
        },
        {
          frage:
            'Ihr Zug ist ausgefallen. Sie möchten sich beschweren und einen Teil des Fahrpreises zurückbekommen.',
          options: [
            'Erdgeschoss: Reisezentrum',
            '1. Obergeschoss: Mobilitätsservice',
            '2. Obergeschoss: Kundendialog'
          ],
          answer: 2
        }
      ]
    },
    teil2: {
      anweisung:
        'Lesen Sie die Situationen 26 bis 30 und die Anzeigen a bis h. Welche Anzeige passt zu welcher Situation? Zu einer Situation gibt es keine passende Anzeige. Markieren Sie in diesem Fall X.',
      situations: [
        'Ihr Fahrrad hat einen Platten. Sie müssen heute Abend damit nach Hause fahren.',
        'Sie möchten den Führerschein machen. Sie arbeiten von 8 bis 17 Uhr.',
        'Sie wohnen im Stadtzentrum und suchen einen Stellplatz für Ihr Auto, den Sie dauerhaft mieten können. Er soll höchstens fünf Minuten von Ihrer Wohnung entfernt sein.',
        'Sie suchen ein gebrauchtes Auto und möchten höchstens 3.000 Euro bezahlen.',
        'Sie ziehen am Samstag um und brauchen ein großes Fahrzeug für Ihre Möbel.'
      ],
      ads: [
        'Fahrschule Tempo – Abendkurs! Theorie montags und mittwochs von 18.30 bis 20 Uhr, Fahrstunden nach Absprache auch samstags. Anmeldung: 0171 5534120.',
        'Fahrschule Kurz – Ferienkurs! Theorie und Praxis täglich von 8 bis 16 Uhr, zwei Wochen lang. Der Führerschein in kurzer Zeit. Telefon: 05521 40893.',
        'Privatverkauf: Ford Fiesta, Baujahr 2011, 98.000 km, TÜV bis 2027, 2.700 Euro. Besichtigung abends nach 18 Uhr. Telefon: 0160 7712345.',
        'Fahrradladen Speiche – Reparatur-Express! Platten, Bremsen und Licht. Abgabe bis 10 Uhr, Abholung am selben Tag ab 17 Uhr. Jakobstraße 9.',
        'Fahrradwerkstatt Kurbel: Wir reparieren alle Fahrräder und E-Bikes. Termine in ca. zwei Wochen. Bitte rufen Sie an: 05521 61177.',
        'Transporter-Verleih Kastenwagen: Große Transporter ab 39 Euro pro Tag, auch am Wochenende. Führerschein Klasse B reicht. Hafenstraße 14.',
        'Parkhaus Am Dom: 1,50 Euro pro Stunde, Tageshöchstsatz 9 Euro. Nur Kurzzeitparker, Dauerparken ist nicht möglich. Täglich 6 bis 24 Uhr.',
        'Garage in Ellern zu vermieten, 15 Kilometer von Altenau entfernt, 45 Euro im Monat. Trocken und sicher. Anruf genügt: 0152 8809910.'
      ],
      answers: [3, 0, -1, 2, 5]
    },
    teil3: {
      anweisung:
        'Lesen Sie die Texte und die Aufgaben. Entscheiden Sie bei der ersten Aufgabe, ob die Aussage richtig oder falsch ist. Welche Lösung (a, b oder c) passt bei der zweiten Aufgabe am besten?',
      texts: [
        {
          titel: 'Neuer Radschnellweg eröffnet',
          text: 'Mit dem Fahrrad zur Arbeit – jetzt schneller und sicherer. Am Freitag hat Oberbürgermeisterin Karin Vogel den neuen Radschnellweg zwischen Altenau und Kronberg eröffnet. Der Weg ist 14 Kilometer lang und mindestens vier Meter breit, sodass Radfahrer bequem nebeneinander fahren und überholen können. Kreuzungen mit Autostraßen gibt es kaum: An den Hauptstraßen führen Brücken und Unterführungen hinüber. Der Bau hat elf Millionen Euro gekostet. Die Hälfte davon bezahlt das Land, die andere Hälfte die Stadt. Auch im Winter soll der Weg nutzbar sein: Bei Schnee wird er vor allen anderen Radwegen geräumt, und er ist bis 23 Uhr beleuchtet. Die Stadt rechnet mit etwa 2.000 Radfahrern pro Tag. Für die Strecke braucht man ungefähr 40 Minuten – mit dem Auto im Berufsverkehr dauert es oft länger.',
          statement: { text: 'Der Radschnellweg hat viele Kreuzungen mit Autostraßen.', answer: false },
          question: {
            frage: 'Wie wurde der Bau bezahlt?',
            options: [
              'Die Stadt und das Land haben sich die Kosten geteilt.',
              'Die Stadt hat alles allein bezahlt.',
              'Die Autofahrer bezahlen eine Gebühr.'
            ],
            answer: 0
          }
        },
        {
          titel: 'Änderung Ihres Abonnements',
          text: 'Sehr geehrter Herr Demir,\n\nzum 1. Januar ändern sich die Preise bei den Verkehrsbetrieben Altenau. Ihr Monatsticket „Stadt“ kostet dann 62 Euro statt bisher 58 Euro. Ihr Abonnement verlängert sich automatisch, wenn Sie nicht kündigen. Wenn Sie das Abonnement beenden möchten, teilen Sie uns das bitte bis zum 30. November schriftlich oder in Ihrem Online-Kundenkonto mit. Bei späterer Kündigung können wir Ihr Abonnement erst zum nächsten Termin beenden. Als Dank für Ihre Treue erhalten Sie mit dem nächsten Ticket einen Gutschein für eine Tageskarte.\n\nMit freundlichen Grüßen\nIhr Kundenservice',
          statement: {
            text: 'Herr Demir muss nichts tun, wenn er mit dem Monatsticket weiterfahren möchte.',
            answer: true
          },
          question: {
            frage: 'Bis wann muss Herr Demir kündigen, wenn er das Abonnement beenden möchte?',
            options: ['Bis zum 30. November.', 'Bis zum 31. Dezember.', 'Bis zum 1. Januar.'],
            answer: 0
          }
        },
        {
          titel: 'Mitteilung der Hausverwaltung',
          text: 'Liebe Mieterinnen und Mieter,\n\nin unserem Fahrradkeller ist kaum noch Platz, weil viele alte Fahrräder dort stehen. Bitte bringen Sie deshalb bis zum 15. Mai an Ihrem Fahrrad einen Zettel mit Ihrem Namen und Ihrer Wohnungsnummer an. Alle Fahrräder ohne Zettel werden am 16. Mai von uns entfernt und vier Wochen im Lager aufbewahrt. Danach spenden wir sie an soziale Projekte. Wir erinnern außerdem daran, dass Fahrräder aus Brandschutzgründen nicht im Treppenhaus stehen dürfen.\n\nIhre Hausverwaltung Berger',
          statement: { text: 'Im Treppenhaus dürfen keine Fahrräder stehen.', answer: true },
          question: {
            frage: 'Was passiert mit Fahrrädern ohne Zettel?',
            options: [
              'Sie werden sofort weggeworfen.',
              'Sie werden entfernt und zunächst vier Wochen aufbewahrt.',
              'Sie dürfen gegen eine Gebühr im Keller bleiben.'
            ],
            answer: 1
          }
        }
      ]
    },
    teil4: {
      anweisung: 'Lesen Sie den Text und die Aufgaben 37 bis 39. Ist die Aussage richtig oder falsch?',
      titel: 'Mit Bus und Bahn durch Altenau – Informationen für neue Einwohner',
      text: 'Tickets\nFahrkarten für Bus und Bahn in Altenau gibt es am Automaten, in der App und im Kundencenter am Marktplatz. Sie gelten in allen Stadtbussen und in den Regionalzügen innerhalb der Stadtgrenze. Wer regelmäßig fährt, spart mit einem Monatsticket: Es kostet 58 Euro und gilt für beliebig viele Fahrten.\n\nKinder und Familien\nKinder unter sechs Jahren fahren kostenlos. Für Kinder von sechs bis vierzehn Jahren gibt es ein günstiges Kinderticket. Schüler bekommen in ihrer Schule einen Antrag für die Schülerkarte.\n\nFahrrad im Bus\nFahrräder dürfen in den Stadtbussen mitgenommen werden, aber nicht immer: Montag bis Freitag ist die Mitnahme zwischen 6 und 9 Uhr sowie zwischen 16 und 18 Uhr nicht erlaubt. Für ein Fahrrad brauchen Sie ein eigenes Ticket.\n\nAbends und am Wochenende\nAb 19 Uhr sowie am Samstag und Sonntag dürfen Inhaber eines Monatstickets eine weitere erwachsene Person kostenlos mitnehmen. Nachts fahren am Wochenende Nachtbusse, die alle 30 Minuten abfahren.',
      statements: [
        { text: 'Kinder unter sechs Jahren müssen kein Ticket kaufen.', answer: true },
        { text: 'Fahrräder dürfen in den Stadtbussen immer kostenlos mitfahren.', answer: false },
        {
          text: 'Wer ein Monatsticket hat, darf am Montagvormittag eine weitere Person kostenlos mitnehmen.',
          answer: false
        }
      ]
    },
    teil5: {
      anweisung:
        'Lesen Sie den Brief. Welches Wort passt in welche Lücke (1–6)? Welche Lösung (a, b oder c) passt am besten?',
      text: 'Sehr geehrte Damen und Herren,\n\nich wohne seit drei Jahren in der Lindenstraße und fahre jeden Morgen mit [1] Bus der Linie 7 zur Arbeit. [2] der Fahrplanänderung im September fährt dieser Bus nur noch alle 30 Minuten. Das ist für viele Anwohner ein großes Problem, [3] besonders ältere Menschen und Familien mit kleinen Kindern auf den Bus angewiesen sind. Ich habe schon mit meinen Nachbarn gesprochen, und [4] ärgern sich ebenfalls über die Situation. Außerdem hat die Haltestelle weder ein Dach [5] eine Sitzbank. Ich möchte Sie deshalb bitten, den alten Fahrplan wieder [6]. Über eine Antwort würde ich mich freuen.\n\nMit freundlichen Grüßen\nSabine Hartmann',
      gaps: [
        { options: ['den', 'dem', 'der'], answer: 1 },
        { options: ['Vor', 'Bis', 'Seit'], answer: 2 },
        { options: ['weil', 'obwohl', 'damit'], answer: 0 },
        { options: ['sie', 'ihnen', 'ihr'], answer: 0 },
        { options: ['oder', 'noch', 'aber'], answer: 1 },
        { options: ['einführen', 'eingeführt', 'einzuführen'], answer: 2 }
      ]
    }
  },

  schreiben: {
    anweisung:
      'Wählen Sie Aufgabe A oder Aufgabe B. Zeigen Sie, was Sie können. Schreiben Sie möglichst viel. Vergessen Sie nicht die Anrede und den Gruß.',
    tasks: [
      {
        titel: 'Aufgabe A – Fahrstunde absagen',
        situation:
          'Sie machen Ihren Führerschein bei der Fahrschule Lenz. Morgen haben Sie eine Fahrstunde bei Ihrem Fahrlehrer, Herrn Lenz. Sie können aber nicht kommen. Schreiben Sie ihm eine E-Mail.',
        leitpunkte: [
          'Entschuldigen Sie sich und sagen Sie, dass Sie den Termin nicht wahrnehmen können.',
          'Erklären Sie, warum Sie morgen nicht kommen können.',
          'Schlagen Sie einen neuen Termin vor.',
          'Fragen Sie, ob die abgesagte Stunde etwas kostet.'
        ],
        musterloesung:
          'Sehr geehrter Herr Lenz,\n\nleider muss ich meine Fahrstunde morgen um 17 Uhr absagen. Bitte entschuldigen Sie, dass ich Ihnen so kurzfristig schreibe. Ich habe seit gestern eine starke Erkältung mit Fieber, und mein Arzt hat mir gesagt, dass ich mindestens drei Tage zu Hause bleiben soll. Außerdem möchte ich nicht, dass ich Sie anstecke. Wäre es möglich, die Stunde auf nächsten Montag um dieselbe Uhrzeit zu verschieben? Wenn Ihnen das nicht passt, kann ich auch am Dienstag nach 16 Uhr kommen. Noch eine Frage: Muss ich die ausgefallene Stunde bezahlen, weil ich so spät absage? Ich würde mich über eine kurze Antwort freuen.\n\nMit freundlichen Grüßen\nIhr Fahrschüler Ali Rahimi'
      },
      {
        titel: 'Aufgabe B – Beschwerde bei den Verkehrsbetrieben',
        situation:
          'Sie haben gestern am Fahrkartenautomaten Ihrer Haltestelle ein Monatsticket gekauft. Der Automat hat das Geld genommen, aber kein Ticket gegeben. Schreiben Sie an die Verkehrsbetriebe.',
        leitpunkte: [
          'Beschreiben Sie, was passiert ist (wann, wo, wie viel Geld).',
          'Erklären Sie, warum das für Sie ein Problem ist.',
          'Sagen Sie, was Sie von den Verkehrsbetrieben erwarten.',
          'Bitten Sie um eine schnelle Antwort.'
        ],
        musterloesung:
          'Sehr geehrte Damen und Herren,\n\ngestern Abend um 18 Uhr wollte ich am Fahrkartenautomaten an der Haltestelle Schillerplatz ein Monatsticket für 58 Euro kaufen. Ich habe mit meiner Karte bezahlt, und der Betrag wurde von meinem Konto abgebucht. Das Ticket habe ich aber nicht bekommen, auf dem Bildschirm stand nur eine Fehlermeldung. Das ist für mich ein großes Problem, weil ich jeden Tag mit dem Bus zur Arbeit fahre und heute schon eine neue Fahrkarte kaufen musste. Ich bitte Sie deshalb, mir das Ticket zuzuschicken oder die 58 Euro zurückzuzahlen. Den Kontoauszug und den Beleg lege ich bei. Ich würde mich freuen, wenn Sie mir bald antworten könnten.\n\nMit freundlichen Grüßen\nMaria Kowalska'
      }
    ],
    tipps:
      'Write one of the two tasks and cover all four Leitpunkte, each with at least one full sentence. Start with a suitable greeting (Aufgabe A: halbformell or formal to your Fahrlehrer, Aufgabe B: formal) and end with a closing. Use connectors such as "weil", "deshalb" and "außerdem", and use the polite "Sie" throughout.'
  },

  sprechen: {
    teil1: {
      anweisung:
        'Teil 1: Sprechen Sie über sich. Die Stichworte helfen Ihnen. Danach stellt Ihre Prüferin oder Ihr Prüfer Ihnen einige Fragen.',
      nachfragen: [
        'Wie sind Sie heute hierhergekommen – mit dem Bus, mit dem Auto oder zu Fuß?',
        'Wie lange wohnen Sie schon in Deutschland?',
        'Was gefällt Ihnen an Ihrer Stadt besonders gut?',
        'Welche Sprachen sprechen Sie zu Hause?'
      ],
      redemittel: [
        'Ich heiße ... und komme aus ...',
        'Ich wohne seit ... in ...',
        'Ich arbeite als ... / Ich suche gerade Arbeit als ...',
        'Meine Familie besteht aus ...',
        'Ich spreche ... und lerne seit ... Deutsch.',
        'Zur Arbeit fahre ich meistens mit ...'
      ]
    },
    teil2: {
      anweisung:
        'Teil 2: Sie bekommen ein Foto. Beschreiben Sie, was Sie sehen und welche Situation das ist. Danach stellt Ihnen die Prüferin oder der Prüfer Fragen zu Ihren Erfahrungen.',
      bilder: [
        {
          beschreibung:
            'Auf dem Foto sieht man eine Bushaltestelle an einem regnerischen Morgen. Mehrere Menschen stehen unter einem kleinen Dach und warten, einige halten Regenschirme. Ein Mann schaut auf seine Uhr.',
          fragenA2: [
            'Wie fahren Sie normalerweise zur Arbeit oder zum Deutschkurs?',
            'Fahren Sie gern mit dem Bus?',
            'Wie oft fährt der Bus in Ihrer Nähe?'
          ],
          fragenB1: [
            'Was machen Sie, wenn der Bus Verspätung hat?',
            'Welche Vor- und Nachteile haben Busse und Bahnen im Vergleich zum Auto?',
            'Wie ist der öffentliche Verkehr in Ihrem Heimatland im Vergleich zu Deutschland?'
          ]
        },
        {
          beschreibung:
            'Auf dem Foto sieht man einen breiten Radweg in einer Stadt. Viele Radfahrer fahren nebeneinander, darunter eine Mutter mit einem Kind im Anhänger. Daneben stehen Autos im Stau.',
          fragenA2: [
            'Haben Sie ein Fahrrad?',
            'Wo fahren Sie gern mit dem Fahrrad?',
            'Wie oft benutzen Sie das Fahrrad?'
          ],
          fragenB1: [
            'Sollte man in Städten mehr Radwege bauen? Warum?',
            'Welche Erfahrungen haben Sie mit dem Radfahren im Straßenverkehr gemacht?',
            'Was würde Sie dazu bringen, öfter auf das Auto zu verzichten?'
          ]
        }
      ],
      redemittel: [
        'Auf dem Foto sieht man ...',
        'Im Vordergrund / Im Hintergrund sind ...',
        'Ich glaube, die Leute sind ...',
        'Das erinnert mich an ...',
        'Bei mir ist das ähnlich / anders, weil ...',
        'Ich habe selbst schon erlebt, dass ...'
      ]
    },
    teil3: {
      situation:
        'Viele Nachbarn in Ihrem Haus haben ein altes Fahrrad im Keller, das nicht mehr fährt. Sie möchten gemeinsam mit Ihrer Partnerin oder Ihrem Partner einen Reparaturtag im Hof organisieren.',
      aufgabe:
        'Planen Sie den Reparaturtag gemeinsam mit Ihrer Gesprächspartnerin oder Ihrem Gesprächspartner. Machen Sie Vorschläge, hören Sie auf die Vorschläge der anderen Person und einigen Sie sich.',
      notizen: [
        'Wann und wo?',
        'Wer hilft mit?',
        'Welches Werkzeug brauchen wir?',
        'Wie informieren wir die Nachbarn?',
        'Was gibt es zu essen und zu trinken?',
        '…?'
      ],
      redemittel: [
        'Wie wäre es, wenn wir ... ?',
        'Ich schlage vor, dass wir ...',
        'Das finde ich eine gute Idee, aber ...',
        'Da bin ich nicht sicher, denn ...',
        'Sollen wir lieber ... oder ... ?',
        'Einverstanden, dann machen wir das so.'
      ]
    }
  }
} as const satisfies DtzExam;

export default exam;
