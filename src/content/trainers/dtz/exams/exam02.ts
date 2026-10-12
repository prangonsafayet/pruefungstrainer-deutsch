import { type DtzExam } from '@shared/types';

const exam = {
  id: 2,
  title: 'Modelltest 2',
  theme: 'Wohnen & Nachbarschaft',

  hoeren: {
    teil1: {
      anweisung:
        'Sie hören vier Ansagen. Zu jeder Ansage gibt es eine Aufgabe. Welche Lösung (a, b oder c) passt am besten?',
      items: [
        {
          audio:
            'Guten Tag, Frau Kaya, hier ist Herr Brandt von der Hausverwaltung. Am Donnerstag kommt ein Handwerker, um die Heizung in Ihrer Wohnung zu reparieren. Er kommt zwischen acht und zwölf Uhr. Bitte seien Sie in dieser Zeit zu Hause. Die Heizung müssen Sie vorher nicht ausschalten, und einen Schlüssel brauchen wir auch nicht. Vielen Dank und einen schönen Tag.',
          frage: 'Was soll Frau Kaya am Donnerstag tun?',
          options: [
            'Die Heizung ausschalten.',
            'Den Schlüssel beim Hausmeister abgeben.',
            'Am Vormittag zu Hause sein.'
          ],
          answer: 2
        },
        {
          audio:
            'Liebe Kundinnen und Kunden, heute gibt es bei uns im ersten Stock Matratzen und Bettwäsche zu besonders günstigen Preisen. Im zweiten Stock finden Sie heute alle Lampen und Leuchten mit zwanzig Prozent Rabatt, allerdings nur bis achtzehn Uhr. Gartenmöbel gibt es wie immer im Erdgeschoss. Wir wünschen Ihnen viel Spaß beim Einkaufen.',
          frage: 'Wo gibt es heute Lampen mit Rabatt?',
          options: ['Im Erdgeschoss.', 'Im ersten Stock.', 'Im zweiten Stock.'],
          answer: 2
        },
        {
          audio:
            'Hallo Frau Lenz, hier ist Tobias Roth aus dem dritten Stock links. Der Paketbote war heute Mittag da, und Sie waren nicht zu Hause. Ich habe Ihr Paket angenommen. Sie können es heute noch bis zwanzig Uhr abholen, klingeln Sie einfach bei mir. Morgen bin ich nicht da. Bis später!',
          frage: 'Wo ist das Paket von Frau Lenz?',
          options: ['Beim Paketboten.', 'Beim Nachbarn im dritten Stock.', 'Beim Hausmeister.'],
          answer: 1
        },
        {
          audio:
            'Guten Tag, hier sind die Stadtwerke Rheinfeld mit einer Information für alle Bewohnerinnen und Bewohner der Birkenstraße. Am Dienstag wird das Wasser wegen einer Reparatur von neun bis fünfzehn Uhr abgestellt. Bitte füllen Sie schon am Montagabend einige Flaschen oder Eimer mit Wasser, damit Sie am Dienstag Trinkwasser haben und die Toilette benutzen können. Wir bitten um Ihr Verständnis.',
          frage: 'Was sollten die Bewohner der Birkenstraße schon am Montag tun?',
          options: [
            'Die Stadtwerke anrufen.',
            'Den Hausmeister informieren.',
            'Wasser für den nächsten Tag aufbewahren.'
          ],
          answer: 2
        }
      ]
    },
    teil2: {
      anweisung:
        'Sie hören fünf kurze Informationen im Radio. Zu jeder Information gibt es eine Aufgabe. Welche Lösung (a, b oder c) passt am besten?',
      items: [
        {
          audio:
            'Das Wetter am Wochenende: Am Samstag bleibt es trocken, mit Sonne und Wolken bei bis zu achtzehn Grad. Am Sonntag zieht von Westen her Regen auf, dazu wird es windig. Wer am Wochenende umziehen möchte, hat also am Samstag das beste Wetter.',
          frage: 'Wann regnet es am Wochenende?',
          options: ['Am Samstag.', 'An beiden Tagen.', 'Am Sonntag.'],
          answer: 2
        },
        {
          audio:
            'Eine Information für Fahrgäste: Die Straßenbahnlinie vier fährt wegen Bauarbeiten bis Montag nicht zwischen Rathausplatz und Südbahnhof. Zwischen diesen beiden Haltestellen fahren Ersatzbusse, und zwar alle zehn Minuten. Ihre Fahrkarte gilt auch im Ersatzbus.',
          frage: 'Was gilt für die Linie 4 bis Montag?',
          options: [
            'Die Straßenbahn fährt nur alle zehn Minuten.',
            'Zwischen zwei Haltestellen fahren Ersatzbusse.',
            'Für den Ersatzbus braucht man eine neue Fahrkarte.'
          ],
          answer: 1
        },
        {
          audio:
            'Unser Tipp für Schnäppchenjäger: der Nachbarschaftsflohmarkt in der Lindenstraße am Samstag von zehn bis sechzehn Uhr. Fast alle Haushalte der Straße verkaufen Kleidung, Spielzeug, Bücher und Geschirr direkt vor der Haustür. Wer einen eigenen Stand haben möchte, muss sich vorher anmelden und fünf Euro bezahlen.',
          frage: 'Was müssen Verkäufer beim Flohmarkt tun?',
          options: [
            'Nur Kleidung und Spielzeug verkaufen.',
            'Sich vorher anmelden und fünf Euro zahlen.',
            'Bis sechzehn Uhr aufbauen.'
          ],
          answer: 1
        },
        {
          audio:
            'Heute Abend um neunzehn Uhr dreißig hören Sie bei uns die Sendung „Wohnen heute“. Es geht um die Nebenkostenabrechnung: Was darf der Vermieter verlangen, und was nicht? Ein Rechtsanwalt für Mietrecht ist im Studio. Hörerinnen und Hörer können unter der bekannten Nummer anrufen und ihre Fragen stellen.',
          frage: 'Was können Hörer in der Sendung tun?',
          options: [
            'Fragen an einen Experten stellen.',
            'Einen Rechtsanwalt kostenlos besuchen.',
            'Ihre Nebenkostenabrechnung einschicken.'
          ],
          answer: 0
        },
        {
          audio:
            'Gesund wohnen: Die Gesundheitskasse Nord lädt zum Kurs „Richtig lüften, richtig heizen“ ein. Sie lernen, wie Sie Schimmel in der Wohnung vermeiden und Heizkosten sparen. Der Kurs findet am Samstag um zehn Uhr statt. Für Mitglieder ist er kostenlos, alle anderen zahlen zehn Euro. Anmeldung bitte telefonisch.',
          frage: 'Wer muss für den Kurs nichts bezahlen?',
          options: [
            'Alle, die sich telefonisch anmelden.',
            'Alle Mieter.',
            'Mitglieder der Gesundheitskasse.'
          ],
          answer: 2
        }
      ]
    },
    teil3: {
      anweisung:
        'Sie hören vier Gespräche. Zu jedem Gespräch gibt es zwei Aufgaben. Ist die Aussage richtig oder falsch? Welche Lösung (a, b oder c) passt am besten?',
      gespraeche: [
        {
          audio: [
            {
              speaker: 'Herr Lang',
              text: 'Guten Tag, Frau Sahin. Kommen Sie herein. Die Wohnung liegt im zweiten Stock, und es gibt einen Aufzug.'
            },
            { speaker: 'Frau Sahin', text: 'Das ist praktisch. Wie groß ist die Wohnung?' },
            {
              speaker: 'Herr Lang',
              text: 'Drei Zimmer, fünfundsiebzig Quadratmeter. Die Kaltmiete beträgt sechshundertzwanzig Euro. Dazu kommen hundertfünfzig Euro Nebenkosten für Heizung, Wasser und Müll.'
            },
            { speaker: 'Frau Sahin', text: 'Und wie hoch ist die Kaution?' },
            { speaker: 'Herr Lang', text: 'Zwei Kaltmieten. Das Geld bekommen Sie beim Auszug zurück.' },
            {
              speaker: 'Frau Sahin',
              text: 'Die Wohnung gefällt mir. Ich überlege es mir und rufe Sie morgen an.'
            }
          ],
          statement: { text: 'Die Wohnung liegt im dritten Stock.', answer: false },
          question: {
            frage: 'Wie viel muss Frau Sahin monatlich insgesamt zahlen?',
            options: ['620 Euro.', '770 Euro.', '1.240 Euro.'],
            answer: 1
          }
        },
        {
          audio: [
            {
              speaker: 'Frau Weber',
              text: 'Guten Abend, Herr Çelik. Ich habe gehört, dass Sie am Samstag eine Party machen.'
            },
            {
              speaker: 'Herr Çelik',
              text: 'Ja, mein Bruder hat Geburtstag. Ich wollte es Ihnen sowieso sagen. Es kommen etwa zwanzig Leute.'
            },
            {
              speaker: 'Frau Weber',
              text: 'Ich habe nichts gegen eine Feier. Aber bitte machen Sie die Musik ab zehn Uhr leiser, weil mein Sohn am Sonntag früh aufstehen muss.'
            },
            {
              speaker: 'Herr Çelik',
              text: 'Das ist selbstverständlich. Und wenn Sie Lust haben, kommen Sie gern kurz vorbei.'
            },
            {
              speaker: 'Frau Weber',
              text: 'Das ist nett, aber ich bleibe lieber zu Hause. Vielen Dank trotzdem.'
            }
          ],
          statement: { text: 'Herr Çelik feiert am Samstag eine Party.', answer: true },
          question: {
            frage: 'Worum bittet Frau Weber?',
            options: [
              'Um weniger Lärm ab zehn Uhr.',
              'Um eine Einladung zur Party.',
              'Um eine andere Uhrzeit für das Fest.'
            ],
            answer: 0
          }
        },
        {
          audio: [
            { speaker: 'Frau Roth', text: 'Hausverwaltung Roth, guten Tag.' },
            {
              speaker: 'Herr Demir',
              text: 'Guten Tag, hier ist Demir, Gartenstraße zwölf. Bei uns ist seit drei Tagen die Heizung kalt, und es ist schon ziemlich kühl in der Wohnung.'
            },
            { speaker: 'Frau Roth', text: 'Das tut mir leid. Haben Sie die Heizkörper schon entlüftet?' },
            { speaker: 'Herr Demir', text: 'Ja, das habe ich gestern versucht, aber es hat nicht geholfen.' },
            {
              speaker: 'Frau Roth',
              text: 'Dann schicke ich Ihnen einen Techniker. Er kann morgen Nachmittag zwischen vierzehn und sechzehn Uhr kommen. Passt das?'
            },
            { speaker: 'Herr Demir', text: 'Ja, da bin ich zu Hause. Vielen Dank.' }
          ],
          statement: { text: 'Die Heizung funktioniert seit gestern nicht.', answer: false },
          question: {
            frage: 'Wann kommt der Techniker?',
            options: ['Heute Abend.', 'Übermorgen früh.', 'Morgen Nachmittag.'],
            answer: 2
          }
        },
        {
          audio: [
            { speaker: 'Anna', text: 'Hallo Ben, ich ziehe am Samstag um. Kannst du mir helfen?' },
            {
              speaker: 'Ben',
              text: 'Am Samstag? Klar, gern. Am Sonntag kann ich leider nicht mehr helfen, da muss ich arbeiten.'
            },
            {
              speaker: 'Anna',
              text: 'Das ist kein Problem. Die neue Wohnung ist nur drei Straßen entfernt, wir schaffen alles an einem Tag. Aber wie transportieren wir die Möbel?'
            },
            {
              speaker: 'Ben',
              text: 'Mein Bruder hat einen Transporter und leiht ihn dir kostenlos. Du musst nur das Benzin bezahlen.'
            },
            { speaker: 'Anna', text: 'Wunderbar! Dann lade ich euch beide danach zum Pizzaessen ein.' }
          ],
          statement: { text: 'Für den Transporter muss Anna nur das Benzin bezahlen.', answer: true },
          question: {
            frage: 'Warum kann Ben am Sonntag nicht helfen?',
            options: ['Er ist krank.', 'Er ist bei seinem Bruder.', 'Er muss arbeiten.'],
            answer: 2
          }
        }
      ]
    },
    teil4: {
      anweisung:
        'Sie hören im Radio eine Diskussion. Drei Personen äußern ihre Meinung zum Thema. Zu den Aussagen gibt es sechs Sätze (a–f). Welcher Satz passt zu welcher Person? Zu dem Beispiel gehört schon ein Satz. Zwei Sätze passen nicht.',
      thema: 'Zusammenleben im Mietshaus',
      sentences: [
        'Gemeinsame Feste verbessern das Verhältnis zwischen den Nachbarn.',
        'Die Hausordnung muss für alle Mieter gleich gelten.',
        'Auch in einer kleinen Wohnung kann eine Familie gut leben.',
        'Neue Nachbarn sollte man selbst begrüßen.',
        'Lärm ist das größte Problem im Mietshaus.',
        'Haustiere gehören nicht in Mietwohnungen.'
      ],
      beispiel: {
        audio:
          'Für mich ist der Lärm das größte Problem in unserem Haus. Über mir wohnt eine Familie, bei der die Kinder bis spät abends durch die Wohnung laufen. Dazu kommt manchmal laute Musik, und am Sonntag bohrt jemand an der Wand. Ich schlafe seit Monaten schlecht.',
        answer: 4
      },
      aussagen: [
        {
          audio:
            'Als ich vor drei Jahren hier eingezogen bin, hat mich niemand begrüßt. Das war ein komisches Gefühl. Wenn jetzt jemand Neues kommt, klingele ich mit einem Kuchen und stelle mich vor. Ich sage, wo die Mülltonnen stehen und wer in welcher Wohnung lebt. Die Leute freuen sich immer sehr darüber.',
          answer: 3
        },
        {
          audio:
            'Bei uns im Haus gibt es jeden Sommer ein Hoffest. Jeder bringt etwas zu essen mit, die Kinder spielen zusammen, und wir sitzen bis spät am Tisch. Seit wir das machen, grüßen sich alle im Treppenhaus, und es gibt viel weniger Streit als früher.',
          answer: 0
        },
        {
          audio:
            'Wir sind zu viert und wohnen auf sechzig Quadratmetern. Viele denken, dass das nicht geht. Aber es geht sehr gut. Jeder hat seinen festen Platz, die Spielsachen liegen in Kisten unter den Betten, und abends sind wir sowieso alle zusammen. Man muss nur ein bisschen organisiert sein.',
          answer: 2
        }
      ]
    }
  },

  lesen: {
    teil1: {
      anweisung:
        'Lesen Sie das Verzeichnis und die Aufgaben 21–25. Wohin gehen Sie? Welche Lösung (a, b oder c) passt am besten?',
      titel: 'Einrichtungshaus Wohnwelt Brandt – Übersicht',
      verzeichnis:
        'Untergeschoss\nAbhollager für große Möbel · Lieferservice-Büro · Parkhaus\n\nErdgeschoss\nEingang · Information · Kasse · Café · Pflanzen und Gartenbedarf\n\n1. Stock\nSofas und Sessel · Betten und Matratzen · Schränke und Regale · Kinderzimmer\n\n2. Stock\nKüchen und Haushalt (Töpfe, Geschirr, Besteck, Küchenmaschinen) · Lampen und Leuchten · Gardinen und Teppiche\n\n3. Stock\nElektrogroßgeräte (Waschmaschinen, Kühlschränke, Herde) · Werkzeug und Renovieren (Farben, Tapeten, Bohrmaschinen)',
      questions: [
        {
          frage: 'Sie möchten eine neue Matratze für Ihr Bett kaufen.',
          options: ['Erdgeschoss: Information', '1. Stock: Betten und Matratzen', 'Ein anderes Stockwerk'],
          answer: 1
        },
        {
          frage: 'Sie suchen eine Lampe für Ihr Wohnzimmer.',
          options: [
            '1. Stock: Sofas und Sessel',
            '2. Stock: Gardinen und Teppiche',
            '2. Stock: Lampen und Leuchten'
          ],
          answer: 2
        },
        {
          frage: 'Sie haben im Geschäft einen großen Schrank gekauft und möchten ihn selbst mitnehmen.',
          options: ['Erdgeschoss: Kasse', '1. Stock: Schränke und Regale', 'Ein anderes Stockwerk'],
          answer: 2
        },
        {
          frage: 'Sie möchten Ihr Schlafzimmer streichen und brauchen Farbe.',
          options: [
            '2. Stock: Küchen und Haushalt',
            '3. Stock: Werkzeug und Renovieren',
            'Ein anderes Stockwerk'
          ],
          answer: 1
        },
        {
          frage: 'Ihre alte Waschmaschine ist kaputt, und Sie möchten eine neue kaufen.',
          options: [
            '1. Stock: Schränke und Regale',
            '2. Stock: Küchen und Haushalt',
            'Ein anderes Stockwerk'
          ],
          answer: 2
        }
      ]
    },
    teil2: {
      anweisung:
        'Lesen Sie die Situationen 26–30 und die Anzeigen a–h. Welche Anzeige passt zu welcher Situation? Für eine Situation gibt es keine passende Anzeige. Dann schreiben Sie X.',
      situations: [
        'Sie möchten eine Hausratversicherung für Ihre Wohnung abschließen.',
        'Sie ziehen am Samstag um und möchten selbst fahren. Dafür brauchen Sie nur einen Transporter.',
        'Am Samstagabend tropft in Ihrer Küche das Wasser aus dem Rohr. Sie brauchen sofort einen Handwerker.',
        'Sie haben wenig Geld und möchten gebrauchte Möbel für Ihre neue Wohnung kaufen.',
        'Sie suchen eine Zwei-Zimmer-Wohnung für höchstens 600 Euro warm. Sie wollen sofort einziehen.'
      ],
      ads: [
        'Helle 3-Zimmer-Wohnung, 85 m², Balkon, 890 Euro warm. Besichtigung nach Absprache. Hausverwaltung Roth, Tel. 0172 556677.',
        'Zwei-Zimmer-Wohnung, 52 m², Einbauküche, 580 Euro warm, sofort frei. Keine Provision! Anruf genügt: 0151 223344.',
        'Rollfix Autovermietung: Transporter ab 29 Euro pro Tag, auch am Wochenende. Voraussetzung: Führerschein Klasse B. Abholung und Rückgabe in der Hafenstraße 8.',
        'Umzugsprofis Nord: Wir packen, tragen und fahren. Komplettservice für Ihren Umzug ab 450 Euro. Kostenloser Besichtigungstermin.',
        'Rohrbruch? Wasserschaden? Klempner-Notdienst Mertens ist 24 Stunden für Sie da, auch am Wochenende und an Feiertagen. Tel. 0800 123123.',
        'Sanitär Müller: Neue Bäder, Heizungen und Reparaturen. Wir sind für Sie da Montag bis Freitag von 8 bis 17 Uhr. Termine nach Vereinbarung.',
        'Sozialkaufhaus Zweite Chance: Gut erhaltene gebrauchte Möbel und Haushaltswaren zu kleinen Preisen. Sofa ab 40 Euro, Tisch ab 15 Euro. Mo–Sa 10–18 Uhr.',
        'Mieterverein Rheinfeld: Wir beraten Sie bei Fragen zu Mietvertrag, Nebenkosten und Kündigung. Beitrag 5 Euro pro Monat. Sprechzeiten: Mo und Mi 14–18 Uhr.'
      ],
      answers: [-1, 2, 4, 6, 1]
    },
    teil3: {
      anweisung:
        'Lesen Sie die Texte und die Aufgaben. Ist die Aussage richtig oder falsch? Welche Lösung (a, b oder c) passt am besten?',
      texts: [
        {
          titel: 'Neues Wohnprojekt in der Ahornstraße',
          text: 'In der Ahornstraße entsteht ein neues Mehrgenerationenhaus mit 40 Wohnungen. Die Wohnungsgenossenschaft möchte, dass Junge und Alte, Familien und Alleinstehende unter einem Dach leben. Die Hälfte der Wohnungen ist für Familien mit Kindern reserviert, zehn Wohnungen sind für Seniorinnen und Senioren vorgesehen. Die Miete beträgt ab 7 Euro pro Quadratmeter. Alle Bewohner können einen Gemeinschaftsraum und einen großen Garten nutzen. Parkplätze gibt es nur wenige, dafür bietet das Haus Carsharing an. Bewerbungen sind bis zum 30. November möglich, der Einzug ist im Frühjahr geplant.',
          statement: {
            text: 'Die Hälfte der Wohnungen ist für Familien mit Kindern reserviert.',
            answer: true
          },
          question: {
            frage: 'Was gibt es im Haus für alle Bewohner?',
            options: [
              'Ein Café im Erdgeschoss.',
              'Einen Gemeinschaftsraum und einen Garten.',
              'Einen Parkplatz für jede Wohnung.'
            ],
            answer: 1
          }
        },
        {
          titel: 'Brief der Hausverwaltung',
          text: 'Sehr geehrte Frau Okafor,\n\nanbei erhalten Sie die Nebenkostenabrechnung für das vergangene Jahr. Sie haben monatlich 120 Euro, also insgesamt 1.440 Euro, als Vorauszahlung geleistet. Die tatsächlichen Kosten betragen 1.598 Euro. Daraus ergibt sich eine Nachzahlung von 158 Euro. Bitte überweisen Sie den Betrag bis zum 30. November auf das bekannte Konto. Wenn Sie mit der Abrechnung nicht einverstanden sind, können Sie innerhalb von zwölf Monaten schriftlich Einspruch einlegen. Für Fragen stehen wir Ihnen gern zur Verfügung.\n\nMit freundlichen Grüßen\nHausverwaltung Schulte',
          statement: { text: 'Frau Okafor bekommt Geld zurück.', answer: false },
          question: {
            frage: 'Was kann Frau Okafor tun, wenn sie mit der Abrechnung nicht einverstanden ist?',
            options: [
              'Innerhalb eines Jahres schriftlich Einspruch einlegen.',
              'Die Zahlung einfach verweigern.',
              'Den Mietvertrag sofort kündigen.'
            ],
            answer: 0
          }
        },
        {
          titel: 'Aushang im Treppenhaus',
          text: 'Wichtige Mitteilung für alle Mieter\n\nIn allen Wohnungen unseres Hauses werden die Rauchmelder ausgetauscht. Die Techniker kommen am Dienstag, dem 18., und am Mittwoch, dem 19. November, jeweils zwischen 8 und 16 Uhr. Der Austausch dauert pro Wohnung etwa 15 Minuten und ist für Sie kostenlos. Bitte sorgen Sie dafür, dass an diesen Tagen jemand zu Hause ist. Wenn das nicht möglich ist, können Sie Ihren Wohnungsschlüssel beim Hausmeister, Herrn Pavlov, im Erdgeschoss abgeben. Er begleitet die Techniker dann durch Ihre Wohnung.\n\nIhre Hausverwaltung',
          statement: {
            text: 'Der Austausch der Rauchmelder dauert pro Wohnung etwa 15 Minuten.',
            answer: true
          },
          question: {
            frage: 'Was können Mieter tun, die an beiden Tagen nicht zu Hause sind?',
            options: [
              'Selbst einen Techniker bestellen.',
              'Den Schlüssel beim Hausmeister abgeben.',
              'Einen neuen Termin im Internet buchen.'
            ],
            answer: 1
          }
        }
      ]
    },
    teil4: {
      anweisung: 'Lesen Sie den Text und die Aufgaben 37–39. Ist die Aussage richtig oder falsch?',
      titel: 'Haus Rosengarten – Ihre Hausordnung kurz erklärt',
      text: 'Herzlich willkommen in Ihrem neuen Zuhause! Damit alle Bewohner gut zusammenleben, bitten wir Sie, die folgenden Regeln zu beachten.\n\nMülltrennung\nPapier gehört in die blaue Tonne, Verpackungen in die gelbe Tonne, Bioabfall in die braune Tonne. Alles andere kommt in die graue Tonne. Altglas bringen Sie bitte zum Container an der Ecke Lindenstraße.\n\nRuhezeiten\nIn unserem Haus gilt eine Mittagsruhe von 13 bis 15 Uhr und eine Nachtruhe von 22 bis 6 Uhr. Laute Arbeiten wie Bohren sind an Sonn- und Feiertagen nicht erlaubt.\n\nWaschküche\nDie Waschküche im Keller ist von Montag bis Samstag von 7 bis 20 Uhr geöffnet. Sonntags bleibt sie geschlossen. Ein Waschgang kostet 1,50 Euro. Tragen Sie Ihren Waschtag bitte in die Liste im Hausflur ein.\n\nSperrmüll\nGroße Möbel und Elektrogeräte dürfen Sie nicht einfach vor das Haus stellen. Melden Sie den Sperrmüll vorher bei der Abfallwirtschaft an. Sie stellen die Sachen erst am vereinbarten Abholtag vor die Tür.',
      statements: [
        { text: 'In diesem Haus gibt es keine Mittagsruhe.', answer: false },
        { text: 'Sperrmüll darf man jederzeit vor das Haus stellen.', answer: false },
        { text: 'Am Sonntag ist die Waschküche geschlossen.', answer: true }
      ]
    },
    teil5: {
      anweisung: 'Lesen Sie den Brief. Welches Wort passt in die Lücke? Kreuzen Sie an: a, b oder c.',
      text: 'Sehr geehrter Herr Schulte,\n\nich möchte Ihnen mitteilen, [1] in unserer Wohnung seit Anfang Oktober die Heizung im Schlafzimmer nicht mehr funktioniert. Meine Familie friert nun schon [2] zwei Wochen, und mein kleiner Sohn ist deswegen erkältet. Ich habe Sie am 3. Oktober angerufen, aber Sie haben [3] nicht zurückgerufen. [4] die Heizung bis Freitag nicht repariert ist, muss ich die Miete mindern. Bitte schicken Sie [5] Handwerker, der den Schaden schnell beheben kann. Über eine rasche Antwort würde ich mich sehr [6].\n\nMit freundlichen Grüßen\nOlga Marković',
      gaps: [
        { options: ['dass', 'weil', 'ob'], answer: 0 },
        { options: ['nach', 'vor', 'seit'], answer: 2 },
        { options: ['mich', 'ich', 'mir'], answer: 0 },
        { options: ['Obwohl', 'Falls', 'Damit'], answer: 1 },
        { options: ['einem', 'einen', 'eine'], answer: 1 },
        { options: ['freut', 'gefreut', 'freuen'], answer: 2 }
      ]
    }
  },

  schreiben: {
    anweisung:
      'Wählen Sie Aufgabe A oder Aufgabe B. Zeigen Sie, was Sie können. Schreiben Sie möglichst viel. Vergessen Sie nicht die Anrede und den Gruß.',
    tasks: [
      {
        titel: 'Aufgabe A: Lärm im Haus',
        situation:
          'Ihr Nachbar über Ihnen macht fast jeden Abend nach 22 Uhr laute Musik. Sie können nicht schlafen. Schreiben Sie eine E-Mail an die Hausverwaltung.',
        leitpunkte: [
          'Beschreiben Sie das Problem (wer, wann, wie laut).',
          'Berichten Sie, was Sie schon versucht haben.',
          'Erklären Sie, welche Folgen der Lärm für Sie hat.',
          'Bitten Sie die Hausverwaltung um eine Lösung und um eine Antwort.'
        ],
        musterloesung:
          'Sehr geehrte Damen und Herren,\n\nich wohne seit zwei Jahren in der Gartenstraße 12, im zweiten Stock. Seit etwa einem Monat macht mein Nachbar aus dem dritten Stock fast jeden Abend nach 22 Uhr sehr laute Musik. Oft hört man sie bis nach Mitternacht.\n\nIch habe schon zweimal an seiner Tür geklingelt und ihn freundlich gebeten, die Musik leiser zu machen. Er hat sich entschuldigt, aber nach ein paar Tagen war es wieder genauso laut.\n\nDa ich früh zur Arbeit muss, kann ich kaum noch schlafen und bin tagsüber sehr müde. Das ist für mich auf Dauer nicht zumutbar.\n\nKönnten Sie bitte mit dem Nachbarn sprechen und ihn an die Nachtruhe erinnern? Ich würde mich über eine kurze Antwort sehr freuen.\n\nMit freundlichen Grüßen\nMarta Kowalska'
      },
      {
        titel: 'Aufgabe B: Neue Nachbarin',
        situation:
          'Sie sind vor einer Woche in ein neues Haus gezogen. Beim Umzug war es laut. Schreiben Sie eine E-Mail an Ihre Nachbarin, Frau Lenz.',
        leitpunkte: [
          'Stellen Sie sich kurz vor.',
          'Entschuldigen Sie sich für den Lärm beim Umzug.',
          'Laden Sie Frau Lenz zu einem Kaffee ein (Tag und Uhrzeit).',
          'Fragen Sie, wo Sie den Müll und das Altpapier entsorgen können.'
        ],
        musterloesung:
          'Liebe Frau Lenz,\n\nich bin Ihr neuer Nachbar und wohne seit einer Woche direkt neben Ihnen. Ich heiße Daniel Ortega, arbeite als Krankenpfleger und lebe mit meiner Frau und unserem Sohn hier.\n\nBeim Umzug am Samstag war es leider sehr laut, weil wir viele schwere Möbel tragen mussten. Bitte entschuldigen Sie den Lärm. Wir hoffen, dass wir Sie nicht zu sehr gestört haben.\n\nWir würden uns freuen, Sie persönlich kennenzulernen. Haben Sie Lust, am Sonntag um 15 Uhr bei uns auf einen Kaffee vorbeizukommen? Wir backen auch einen Kuchen.\n\nÜbrigens habe ich noch eine Frage: Wo stehen im Haus die Tonnen für Müll und Altpapier? Ich habe sie bisher nicht gefunden.\n\nViele Grüße\nDaniel Ortega'
      }
    ],
    tipps:
      'Cover all four Leitpunkte, ideally one paragraph each. Start with the right Anrede (Sehr geehrte Damen und Herren for the Hausverwaltung, Liebe Frau Lenz for a neighbour) and finish with a Gruß. Use connectors (weil, deshalb, da, außerdem) and polite requests ("Könnten Sie bitte ...?", "Ich würde mich freuen, wenn ...").'
  },

  sprechen: {
    teil1: {
      anweisung:
        'Stellen Sie sich Ihrem Gesprächspartner vor. Sprechen Sie über Ihren Namen, Ihren Geburtsort, Ihren Wohnort, Ihre Arbeit oder Ihren Beruf, Ihre Familie und Ihre Sprachen. Danach stellt die Prüferin Ihnen noch einige Fragen.',
      nachfragen: [
        'Wohnen Sie in einer Wohnung oder in einem Haus? Wie gefällt es Ihnen dort?',
        'Wie lange wohnen Sie schon in Ihrer Wohnung?',
        'Mit wem wohnen Sie zusammen?',
        'Wie ist das Verhältnis zu Ihren Nachbarn?',
        'Wie sah Ihre Wohnung im Heimatland aus?'
      ],
      redemittel: [
        'Ich heiße ... und komme aus ...',
        'Ich wohne seit ... in ...',
        'Ich wohne zusammen mit ...',
        'Ich arbeite als ... / Ich besuche zurzeit einen Deutschkurs.',
        'Meine Familie besteht aus ...',
        'Ich spreche ... und lerne gerade Deutsch.'
      ]
    },
    teil2: {
      anweisung:
        'Beschreiben Sie Ihr Foto: Was sehen Sie? Was für eine Situation ist das? Danach stellt die Prüferin Ihnen Fragen zu Ihren eigenen Erfahrungen.',
      bilder: [
        {
          beschreibung:
            'Auf dem Foto sieht man einen Umzugswagen vor einem Mehrfamilienhaus. Zwei Personen tragen ein Sofa die Treppe hinauf. Im Hintergrund stehen mehrere Kartons auf dem Gehweg.',
          fragenA2: [
            'Sind Sie schon einmal umgezogen? Wann war das?',
            'Wer hat Ihnen beim Umzug geholfen?',
            'Wie sieht Ihre jetzige Wohnung aus?'
          ],
          fragenB1: [
            'Was war bei Ihrem letzten Umzug besonders anstrengend?',
            'Würden Sie beim nächsten Mal eine Umzugsfirma beauftragen? Warum oder warum nicht?',
            'Worauf achten Sie, wenn Sie eine neue Wohnung suchen?'
          ]
        },
        {
          beschreibung:
            'Auf dem Foto sieht man einen Hinterhof zwischen mehreren Wohnhäusern. Menschen unterschiedlichen Alters stehen um einen Grill und unterhalten sich. Auf einem Tisch stehen Salate, Getränke und Kuchen, und Kinder spielen daneben.',
          fragenA2: [
            'Kennen Sie Ihre Nachbarn? Wie heißen sie?',
            'Feiern Sie manchmal mit Ihren Nachbarn?',
            'Was machen Sie gern am Wochenende mit anderen Menschen?'
          ],
          fragenB1: [
            'Wie wichtig ist Ihnen ein gutes Verhältnis zu Ihren Nachbarn?',
            'Gab es schon einmal Probleme mit Nachbarn? Wie haben Sie sie gelöst?',
            'Wie ist das Zusammenleben in Häusern in Ihrem Heimatland im Vergleich zu Deutschland?'
          ]
        }
      ],
      redemittel: [
        'Auf dem Foto sieht man ...',
        'Das Bild zeigt eine Situation in ...',
        'Ich glaube, die Leute ...',
        'Das kenne ich auch aus meinem Alltag: ...',
        'Bei mir war das so: ...',
        'Meiner Meinung nach ...'
      ]
    },
    teil3: {
      situation:
        'In Ihrem Haus sind mehrere neue Nachbarn eingezogen. Sie und Ihr Gesprächspartner möchten alle Hausbewohner zu einem gemeinsamen Treffen einladen.',
      aufgabe:
        'Planen Sie gemeinsam ein Hoffest für alle Hausbewohner. Sprechen Sie über die Notizen und machen Sie Vorschläge.',
      notizen: [
        'Wann und wie lange?',
        'Wo im Haus oder im Hof?',
        'Essen und Getränke?',
        'Wer macht was?',
        'Wie laden wir alle ein?',
        '…?'
      ],
      redemittel: [
        'Wie wäre es, wenn wir ...?',
        'Ich schlage vor, dass wir ...',
        'Das ist eine gute Idee. Außerdem könnten wir ...',
        'Ich bin nicht sicher, ob ...',
        'Einverstanden, dann machen wir es so.',
        'Wer kümmert sich um ...?'
      ]
    }
  }
} as const satisfies DtzExam;

export default exam;
