import { type DtzExam } from '@shared/types';

const exam = {
  id: 6,
  title: 'Modelltest 6',
  theme: 'Einkaufen & Verbraucherrechte',

  hoeren: {
    teil1: {
      anweisung:
        'Sie hören vier Ansagen. Zu jeder Ansage gibt es eine Aufgabe. Welche Lösung (a, b oder c) passt am besten?',
      items: [
        {
          audio:
            'Guten Tag, Frau Kowalski, hier ist der Handyservice Funkloch. Ihr Smartphone ist repariert. Sie können es ab morgen abholen, von Montag bis Freitag zwischen zehn und achtzehn Uhr, samstags von zehn bis dreizehn Uhr. Bitte bringen Sie den Reparaturschein mit. Die Reparatur kostet neunundvierzig Euro. Auf Wiederhören.',
          frage: 'Was soll Frau Kowalski mitbringen?',
          options: ['Einen neuen Akku.', 'Die Rechnung vom Kauf.', 'Den Reparaturschein.'],
          answer: 2
        },
        {
          audio:
            'Liebe Kundinnen und Kunden, in der Haushaltsabteilung im Untergeschoss beginnt jetzt unsere Topfwoche: Alle Töpfe und Pfannen kosten heute dreißig Prozent weniger. Das Angebot gilt nur bis achtzehn Uhr. Wir erinnern Sie außerdem daran, dass unser Kaufhaus heute um zwanzig Uhr schließt. Vielen Dank.',
          frage: 'Was ist heute im Kaufhaus billiger?',
          options: [
            'Kleidung im ersten Stock.',
            'Möbel im dritten Stock.',
            'Töpfe und Pfannen im Untergeschoss.'
          ],
          answer: 2
        },
        {
          audio:
            'Achtung, eine wichtige Information für unsere Kunden: Der Hersteller ruft den Fruchtjoghurt „Landfrisch“, Sorte Erdbeere, im Becher mit hundertfünfzig Gramm zurück, weil kleine Plastikteile im Joghurt sein können. Bitte essen Sie diesen Joghurt nicht. Sie können ihn an jeder Kasse zurückgeben und bekommen Ihr Geld zurück. Einen Kassenbon brauchen Sie dafür nicht.',
          frage: 'Was können Kunden mit dem Joghurt tun?',
          options: [
            'Ihn an der Kasse zurückgeben und ihr Geld bekommen.',
            'Ihn nur mit dem Kassenbon zurückgeben.',
            'Ihn ohne Probleme essen.'
          ],
          answer: 0
        },
        {
          audio:
            'Verbraucherzentrale Hohenbach, guten Tag. Unsere telefonische Beratung erreichen Sie montags, mittwochs und donnerstags von neun bis zwölf Uhr. Eine persönliche Beratung in unserem Büro in der Gartenstraße gibt es nur mit Termin. Termine vergeben wir auf unserer Internetseite. Bitte halten Sie bei der Beratung Ihre Unterlagen bereit, zum Beispiel den Vertrag oder die Rechnung.',
          frage: 'Wann ist die telefonische Beratung?',
          options: [
            'Dienstags und freitags.',
            'Montags, mittwochs und donnerstags vormittags.',
            'Jeden Tag nachmittags.'
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
            'Das Wetter am Wochenende: Am Samstag scheint in der ganzen Region die Sonne, bei bis zu zweiundzwanzig Grad. Am Sonntag ziehen am Nachmittag Wolken auf, und am Abend kann es regnen.',
          frage: 'Wann kann es regnen?',
          options: ['Am Samstagmorgen.', 'Am Samstagnachmittag.', 'Am Sonntagabend.'],
          answer: 2
        },
        {
          audio:
            'Verkehrsmeldung: Wegen des großen Flohmarkts ist der Marktplatz am Sonntag von sechs bis sechzehn Uhr für Autos gesperrt. Parken können Sie im Parkhaus am Bahnhof. Von dort fährt alle zehn Minuten ein kostenloser Bus zum Marktplatz.',
          frage: 'Wie kommen Besucher am besten zum Flohmarkt?',
          options: [
            'Mit dem Fahrrad durch die Fußgängerzone.',
            'Mit dem Auto bis zum Marktplatz.',
            'Mit dem kostenlosen Bus vom Parkhaus.'
          ],
          answer: 2
        },
        {
          audio:
            'Tipp für das Wochenende: die Verbrauchermesse „Clever kaufen“ in der Stadthalle. Experten geben Tipps zu Strom, Handyverträgen und Versicherungen. Der Eintritt ist frei. Um elf und um fünfzehn Uhr gibt es jeweils einen Vortrag über sicheres Einkaufen im Internet.',
          frage: 'Worüber gibt es um elf Uhr einen Vortrag?',
          options: ['Über Strom.', 'Über sicheres Einkaufen im Internet.', 'Über Versicherungen.'],
          answer: 1
        },
        {
          audio:
            'Heute Abend um neunzehn Uhr dreißig im „Verbrauchertipp“: Was tun, wenn die Ware aus dem Internet nicht gefällt? Bei Online-Bestellungen haben Sie vierzehn Tage Zeit, um den Kauf zu widerrufen. Rechtsanwältin Petra Lindner erklärt, wie das genau geht.',
          frage: 'Worum geht es in der Sendung?',
          options: ['Um Urlaubsreisen.', 'Um Gartentipps.', 'Um das Zurückgeben von Waren aus dem Internet.'],
          answer: 2
        },
        {
          audio:
            'Rückenschmerzen? Im Sanitätshaus Weber testen Sie diese Woche kostenlos Matratzen und Kissen. Unsere Fachleute beraten Sie ohne Termin. Wenn Sie ein Matratzenpaket kaufen, bekommen Sie fünfzig Euro Rabatt. Sanitätshaus Weber, Bahnhofstraße vierzehn.',
          frage: 'Was kostet das Testen der Matratzen?',
          options: ['Nichts.', 'Zehn Euro.', 'Fünfzig Euro.'],
          answer: 0
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
              speaker: 'Kundin',
              text: 'Guten Tag. Ich möchte diese Jacke umtauschen. Sie ist leider zu klein.'
            },
            { speaker: 'Verkäufer', text: 'Haben Sie den Kassenbon dabei?' },
            { speaker: 'Kundin', text: 'Ja, hier. Ich habe die Jacke letzten Samstag gekauft.' },
            {
              speaker: 'Verkäufer',
              text: 'Das ist in Ordnung. Wir tauschen Kleidung innerhalb von vierzehn Tagen um, wenn sie nicht getragen wurde. Möchten Sie die Jacke eine Nummer größer?'
            },
            { speaker: 'Kundin', text: 'Ja, gern. Haben Sie die noch?' },
            {
              speaker: 'Verkäufer',
              text: 'Leider nicht. Ich kann Ihnen einen Gutschein geben, oder Sie bekommen Ihr Geld zurück.'
            },
            { speaker: 'Kundin', text: 'Dann nehme ich lieber das Geld.' }
          ],
          statement: { text: 'Die Kundin bekommt eine größere Jacke.', answer: false },
          question: {
            frage: 'Was bekommt die Kundin?',
            options: ['Ihr Geld.', 'Einen Gutschein.', 'Eine andere Jacke.'],
            answer: 0
          }
        },
        {
          audio: [
            {
              speaker: 'Herr Wagner',
              text: 'Guten Tag, hier Wagner. Ich habe vor zehn Tagen Schuhe bei Ihnen bestellt, aber das Paket ist immer noch nicht da.'
            },
            {
              speaker: 'Kundenservice',
              text: 'Einen Moment, Herr Wagner. Laut System hat der Zusteller das Paket am Dienstag bei einem Nachbarn abgegeben, bei Familie Kern.'
            },
            {
              speaker: 'Herr Wagner',
              text: 'Familie Kern? Die wohnen gar nicht in meinem Haus. Ich wohne in der Nummer zwölf, die Kerns wohnen in der Nummer einundzwanzig.'
            },
            {
              speaker: 'Kundenservice',
              text: 'Dann ist wohl bei der Hausnummer etwas verwechselt worden. Ich gebe das an den Zusteller weiter. Er holt das Paket dort ab und bringt es Ihnen. Das dauert zwei bis drei Tage. Wenn es dann nicht da ist, schicken wir Ihnen kostenlos neue Schuhe.'
            }
          ],
          statement: { text: 'Das Paket wurde bei den falschen Nachbarn abgegeben.', answer: true },
          question: {
            frage: 'Was passiert jetzt?',
            options: [
              'Herr Wagner holt das Paket selbst bei Familie Kern ab.',
              'Herr Wagner bekommt sofort sein Geld zurück.',
              'Der Zusteller holt das Paket ab und bringt es zu Herrn Wagner.'
            ],
            answer: 2
          }
        },
        {
          audio: [
            {
              speaker: 'Kundin',
              text: 'Guten Tag, vor acht Monaten habe ich bei Ihnen diese Waschmaschine gekauft. Jetzt pumpt sie das Wasser nicht mehr ab.'
            },
            { speaker: 'Verkäufer', text: 'Das tut mir leid. Haben Sie die Rechnung noch?' },
            { speaker: 'Kundin', text: 'Ja, hier ist sie.' },
            {
              speaker: 'Verkäufer',
              text: 'Dann haben Sie noch Gewährleistung, die gilt zwei Jahre ab dem Kauf. Wir schicken einen Techniker, der die Maschine bei Ihnen zu Hause repariert. Für Sie ist das kostenlos. Er kann am Donnerstag zwischen acht und zwölf Uhr kommen.'
            },
            {
              speaker: 'Kundin',
              text: 'Am Donnerstagvormittag arbeite ich leider. Haben Sie auch einen Termin am Nachmittag?'
            },
            {
              speaker: 'Verkäufer',
              text: 'Ja, am Donnerstag zwischen vierzehn und siebzehn Uhr. Das trage ich ein.'
            }
          ],
          statement: { text: 'Die Kundin muss die Reparatur selbst bezahlen.', answer: false },
          question: {
            frage: 'Wann kommt der Techniker?',
            options: ['Donnerstagvormittag.', 'Donnerstagnachmittag.', 'Freitagvormittag.'],
            answer: 1
          }
        },
        {
          audio: [
            {
              speaker: 'Anna',
              text: 'Stell dir vor, ich habe mein Handyabo gekündigt, aber jetzt schreibt mir der Anbieter, dass der Vertrag noch weiterläuft.'
            },
            { speaker: 'Markus', text: 'Wie lange war denn die Laufzeit?' },
            {
              speaker: 'Anna',
              text: 'Zwei Jahre. Die sind vor drei Monaten zu Ende gegangen. Ich habe nicht gewusst, dass sich der Vertrag automatisch verlängert.'
            },
            {
              speaker: 'Markus',
              text: 'Das ist ärgerlich. Aber du musst das nicht einfach so akzeptieren. Geh doch zur Verbraucherzentrale, die helfen bei so etwas.'
            },
            {
              speaker: 'Anna',
              text: 'Gute Idee. Ich rufe gleich morgen früh dort an und frage nach einem Termin.'
            }
          ],
          statement: {
            text: 'Anna wusste nicht, dass sich der Vertrag automatisch verlängert.',
            answer: true
          },
          question: {
            frage: 'Was will Anna jetzt tun?',
            options: [
              'Zum Handyanbieter gehen.',
              'Bei der Verbraucherzentrale anrufen.',
              'Einen neuen Vertrag abschließen.'
            ],
            answer: 1
          }
        }
      ]
    },
    teil4: {
      anweisung:
        'Sie hören in einer Radiosendung vier Meinungen zu einem Thema. Lesen Sie zuerst die Sätze a–f. Zu den Meinungen 1–3 passt jeweils ein Satz. Zwei Sätze bleiben übrig. Das Beispiel (0) ist schon gelöst.',
      thema: 'Online einkaufen oder im Geschäft?',
      sentences: [
        'Im Internet sind die Preise meistens niedriger.',
        'Im Geschäft kann man Kleidung und Schuhe anprobieren.',
        'Wenn alle online kaufen, müssen kleine Läden schließen.',
        'Im Internet kauft man oft mehr, als man braucht.',
        'Online einkaufen spart viel Zeit.',
        'Ältere Menschen brauchen im Laden jemanden, der sie berät.'
      ],
      beispiel: {
        audio:
          'Ich kaufe Schuhe und Jacken nur im Geschäft. Ich muss sie anziehen und spüren, ob sie wirklich passen. Im Internet bestelle ich dreimal die gleiche Hose in verschiedenen Größen, und dann muss ich zwei davon wieder zurückschicken. Das ist mir zu umständlich.',
        answer: 1
      },
      aussagen: [
        {
          audio:
            'Ich vergleiche immer zuerst im Internet. Dieselbe Waschmaschine war dort fast hundert Euro billiger als im Laden in unserer Stadt. Bei meinem kleinen Budget zählt für mich vor allem der Preis.',
          answer: 0
        },
        {
          audio:
            'In unserer Straße haben in den letzten Jahren drei Geschäfte zugemacht: der Bäcker, der Buchladen und der Schuster. Wenn niemand mehr dort kauft, gibt es bald nur noch leere Schaufenster und kein Leben mehr auf der Straße.',
          answer: 2
        },
        {
          audio:
            'Meine Mutter ist achtundsiebzig. Wenn sie ein neues Telefon braucht, möchte sie jemanden fragen können. Im Internet ist da niemand, der ihr in Ruhe etwas erklärt. Im Laden geht sie zum Verkäufer, und der zeigt ihr alles.',
          answer: 5
        }
      ]
    }
  },

  lesen: {
    teil1: {
      anweisung:
        'Lesen Sie den Wegweiser und die Situationen 21–25. Wohin gehen Sie? Kreuzen Sie an: a, b oder c.',
      titel: 'Kaufhaus Bergmann – Wegweiser',
      verzeichnis: `3. Stock
Möbel und Wohnen
Lampen und Teppiche
Küchenstudio

2. Stock
Elektro und Computer
Handys und Zubehör
Reparaturservice für Handys und Computer
Fotostudio

1. Stock
Damenmode und Herrenmode
Kinderbekleidung
Schuhe
Spielwaren

Erdgeschoss
Lebensmittel und Feinkost
Drogerie
Schreibwaren und Zeitungen
Kundenservice (Umtausch, Reklamation, Geschenkgutscheine)
Geldautomat

Untergeschoss
Haushaltswaren (Töpfe, Pfannen, Geschirr)
Werkzeug und Gartenbedarf
Fahrradzubehör
Zugang zum Parkhaus`,
      questions: [
        {
          frage: 'Sie möchten eine Jacke umtauschen, die nicht passt. Wohin gehen Sie?',
          options: ['Erdgeschoss', '1. Stock', 'anderes Stockwerk'],
          answer: 0
        },
        {
          frage:
            'Ihr Handy ist ins Wasser gefallen und funktioniert nicht mehr. Sie möchten es reparieren lassen.',
          options: ['1. Stock', '2. Stock', 'anderes Stockwerk'],
          answer: 1
        },
        {
          frage: 'Sie suchen eine neue Lampe für Ihr Wohnzimmer.',
          options: ['1. Stock', '2. Stock', 'anderes Stockwerk'],
          answer: 2
        },
        {
          frage: 'Sie brauchen neue Töpfe und Pfannen für Ihre Küche.',
          options: ['Untergeschoss', 'Erdgeschoss', '1. Stock'],
          answer: 0
        },
        {
          frage: 'Sie möchten für Ihre Tochter Kinderschuhe kaufen.',
          options: ['Erdgeschoss', '1. Stock', '2. Stock'],
          answer: 1
        }
      ]
    },
    teil2: {
      anweisung:
        'Lesen Sie die Situationen 26–30 und die Anzeigen a–h. Welche Anzeige passt zu welcher Situation? Zu einer Situation gibt es keine passende Anzeige. Hier markieren Sie X.',
      situations: [
        'Ihre Tochter (10 Jahre) braucht ein Fahrrad. Sie möchten ein gebrauchtes kaufen, das ein Fachmann geprüft hat.',
        'Ihre Waschmaschine ist kaputt. Sie möchten sie reparieren lassen, weil eine neue zu teuer ist.',
        'Sie möchten Ihren alten Fernseher kostenlos entsorgen.',
        'Sie haben Ärger mit Ihrem Handyanbieter und möchten sich günstig beraten lassen.',
        'Sie suchen Winterschuhe und möchten höchstens 40 Euro ausgeben.'
      ],
      ads: [
        'Elektro-Discount Kowalski: Fernseher ab 199 Euro! Lieferung kostenlos, 3 Jahre Garantie. Hauptstraße 41, Mo–Sa 9–19 Uhr.',
        'Verbraucherzentrale Hohenbach: Ärger mit Handyvertrag, Online-Shop oder Versicherung? Wir beraten Sie nach Terminvereinbarung. Erstberatung 10 Euro.',
        'Zweirad Schröder: Neue Kinderfahrräder ab 189 Euro. Frühjahrsaktion: Helm gratis dazu! Lindenallee 8.',
        'Reparatur-Express Meier: Wir reparieren Waschmaschinen, Trockner und Kühlschränke – schnell und günstig. Anfahrt 15 Euro, Reparatur ab 39 Euro. Mo–Sa 8–18 Uhr.',
        'Rechtsanwältin Dr. Yılmaz: Beratung zu Mietrecht und Arbeitsrecht. Erstgespräch 60 Euro. Termine nach Vereinbarung.',
        'Schuhhaus Weigel: Winterschlussverkauf! Alle Winterschuhe reduziert: Stiefel ab 39 Euro, Sneaker ab 29 Euro. Nur bis zum 31. Januar.',
        'Möbelhaus Sperling: Wir kaufen gut erhaltene Möbel an. Preis nach Absprache, Abholung kostenlos. Telefon 0172 5554433.',
        'Fahrradbörse Süd: Gebrauchte Kinder- und Erwachsenenräder, vom Fachmann geprüft, ab 45 Euro. 3 Monate Garantie. Samstags 10–14 Uhr, Bahnhofstraße 9.'
      ],
      answers: [7, 3, -1, 1, 5]
    },
    teil3: {
      anweisung:
        'Lesen Sie die Texte 1–3 und die Aufgaben dazu. Ist die Aussage richtig oder falsch? Welche Lösung (a, b oder c) passt am besten?',
      texts: [
        {
          titel: 'Neuer Laden ohne Verpackung eröffnet',
          text: 'In der Gartenstraße in Hohenbach hat am Samstag der erste Unverpackt-Laden der Stadt eröffnet. Hier gibt es Nudeln, Reis, Nüsse und Gewürze ohne Verpackung. Die Kunden bringen ihre eigenen Gläser und Dosen mit und füllen sie selbst. Bezahlt wird nach Gewicht: Die Kasse wiegt zuerst den leeren Behälter und dann den gefüllten. Wer keinen Behälter hat, kann im Laden ein Pfandglas für einen Euro leihen. Zur Eröffnung bekommt jeder Kunde, der für mehr als 20 Euro einkauft, ein Geschenk. Die Besitzerin Julia Mertens sagt: „Wir wollen zeigen, dass man auch mit weniger Müll gut einkaufen kann.“ Der Laden ist montags bis samstags von 9 bis 18 Uhr geöffnet.',
          statement: { text: 'Im neuen Laden müssen alle Kunden ein Pfandglas leihen.', answer: false },
          question: {
            frage: 'Wer bekommt zur Eröffnung ein Geschenk?',
            options: [
              'Nur Kunden, die für mehr als 20 Euro einkaufen.',
              'Jeder Kunde, der etwas kauft.',
              'Die ersten hundert Kunden.'
            ],
            answer: 0
          }
        },
        {
          titel: 'E-Mail vom Kundenservice',
          text: `Betreff: Ihre Reklamation – Kaffeemaschine „Aroma 300“

Sehr geehrter Herr Brandt,

vielen Dank für Ihre Nachricht. Es tut uns leid, dass Ihre Kaffeemaschine nach nur vier Monaten nicht mehr funktioniert. Da Sie das Gerät bei uns gekauft haben und die gesetzliche Gewährleistung zwei Jahre beträgt, übernehmen wir die Reparatur selbstverständlich kostenlos. Bitte senden Sie die Maschine in der Originalverpackung an die unten stehende Adresse und legen Sie eine Kopie der Rechnung bei. Das Porto bezahlen wir. Die Reparatur dauert in der Regel zehn Werktage. Falls das Gerät nicht repariert werden kann, erhalten Sie ein neues.

Mit freundlichen Grüßen
Katrin Lorenz, Kundenservice Elektro Kuhn`,
          statement: { text: 'Herr Brandt muss die Reparatur selbst bezahlen.', answer: false },
          question: {
            frage: 'Was soll Herr Brandt tun?',
            options: [
              'Eine neue Kaffeemaschine kaufen.',
              'Das Gerät mit einer Kopie der Rechnung einschicken.',
              'Das Porto selbst bezahlen.'
            ],
            answer: 1
          }
        },
        {
          titel: 'Mitteilung der Hausverwaltung',
          text: `Neue Paketbox im Haus Lindenallee 5

Liebe Mieterinnen und Mieter,

ab dem 1. Dezember steht im Eingangsbereich eine Paketbox. Wenn Sie nicht zu Hause sind, legen die Zusteller Ihre Pakete dort ein. Sie bekommen dann eine Nachricht auf Ihr Handy mit einem Code, mit dem Sie das Fach öffnen können. Bitte holen Sie Ihr Paket innerhalb von drei Tagen ab. Danach wird es an den Absender zurückgeschickt. Die Nutzung der Box ist für Sie kostenlos. Bitte stellen Sie keine Pakete im Hausflur ab, weil dort die Fluchtwege frei bleiben müssen. Für die Einrichtung benötigen wir bis zum 15. November Ihre Handynummer. Schreiben Sie sie bitte auf den Zettel im Briefkasten oder rufen Sie uns an.

Hausverwaltung Krause GmbH`,
          statement: {
            text: 'Pakete, die nach drei Tagen noch in der Box liegen, werden zurückgeschickt.',
            answer: true
          },
          question: {
            frage: 'Was müssen die Mieter bis zum 15. November tun?',
            options: [
              'Einen Schlüssel für die Box abholen.',
              'Die Paketbox bezahlen.',
              'Der Hausverwaltung ihre Handynummer geben.'
            ],
            answer: 2
          }
        }
      ]
    },
    teil4: {
      anweisung: 'Lesen Sie den Text und die Aussagen 1–3. Ist die Aussage richtig oder falsch?',
      titel: 'Ihre Rechte beim Einkaufen – Informationen der Verbraucherzentrale',
      text: `Einkaufen im Geschäft
Wenn Sie im Geschäft etwas kaufen, haben Sie kein gesetzliches Recht, die Ware zurückzugeben, nur weil sie Ihnen nicht gefällt. Viele Geschäfte tauschen die Ware trotzdem freiwillig um. Fragen Sie deshalb vor dem Kauf nach den Regeln des Geschäfts. Heben Sie den Kassenbon gut auf.

Einkaufen im Internet
Bei Bestellungen im Internet können Sie den Kauf in der Regel innerhalb von 14 Tagen widerrufen. Sie müssen dafür keinen Grund nennen. Die Frist beginnt, wenn Sie die Ware erhalten haben. Teilen Sie dem Händler Ihren Widerruf eindeutig mit, zum Beispiel per E-Mail, und schicken Sie die Ware zurück.

Wenn die Ware kaputt ist
Ist ein Produkt in den ersten zwei Jahren nach dem Kauf kaputt, wenden Sie sich zuerst an den Verkäufer, nicht an den Hersteller. Der Verkäufer muss das Produkt reparieren oder austauschen. Das nennt man Gewährleistung. Eine Garantie dagegen ist ein freiwilliges Versprechen des Herstellers.

Hilfe bekommen
Die Verbraucherzentrale berät Sie persönlich, telefonisch oder per E-Mail. Die erste Beratung kostet 10 Euro. Bringen Sie bitte alle Unterlagen mit, zum Beispiel Vertrag, Rechnung und Schriftverkehr.`,
      statements: [
        { text: 'Wer im Geschäft einkauft, darf die Ware immer zurückgeben.', answer: false },
        { text: 'Bei einer Online-Bestellung muss man den Widerruf nicht begründen.', answer: true },
        {
          text: 'Wenn ein Produkt in den ersten zwei Jahren kaputtgeht, ist zuerst der Verkäufer zuständig.',
          answer: true
        }
      ]
    },
    teil5: {
      anweisung: 'Lesen Sie den Brief. Welche Lösung (a, b oder c) passt in die Lücken [1] bis [6]?',
      text: `Sehr geehrte Damen und Herren,

am 4. März habe ich in Ihrer Filiale in der Bahnhofstraße einen Staubsauger [1] 129 Euro gekauft. Leider funktioniert das Gerät seit einer Woche nicht mehr, [2] ich es erst zweimal benutzt habe. Der Motor macht ein lautes Geräusch und geht nach wenigen Sekunden aus.

Der Verkäufer, [3] mich damals beraten hat, hat mir gesagt, dass ich bei Problemen jederzeit zu Ihnen kommen kann. Die Rechnung und die Verpackung habe ich gut [4].

Bitte teilen Sie mir [5] einer Woche mit, wie Sie das Problem lösen. Wenn Sie Fragen haben, rufen Sie [6] bitte unter der Nummer 0170 1234567 an.

Mit freundlichen Grüßen
Peter Albrecht`,
      gaps: [
        { options: ['für', 'mit', 'bei'], answer: 0 },
        { options: ['weil', 'damit', 'obwohl'], answer: 2 },
        { options: ['den', 'der', 'dem'], answer: 1 },
        { options: ['aufheben', 'aufgehebt', 'aufgehoben'], answer: 2 },
        { options: ['innerhalb', 'vor', 'seit'], answer: 0 },
        { options: ['mir', 'ich', 'mich'], answer: 2 }
      ]
    }
  },

  schreiben: {
    anweisung:
      'Wählen Sie Aufgabe A oder Aufgabe B. Zeigen Sie, was Sie können. Schreiben Sie möglichst viel. Vergessen Sie nicht die Anrede und den Gruß.',
    tasks: [
      {
        titel: 'Aufgabe A: Eine Bestellung zurückschicken',
        situation:
          'Sie haben vor fünf Tagen im Internet bei „Modehaus Online“ eine Jacke bestellt. Die Jacke ist heute angekommen, aber sie ist viel zu groß. Schreiben Sie dem Kundenservice.',
        leitpunkte: [
          'Nennen Sie, was Sie wann bestellt haben (Bestellnummer 48213).',
          'Sagen Sie, dass Sie den Kauf widerrufen, und nennen Sie den Grund.',
          'Fragen Sie, wie Sie die Jacke zurückschicken können.',
          'Fragen Sie, wann und wie Sie Ihr Geld zurückbekommen.'
        ],
        musterloesung:
          'Sehr geehrte Damen und Herren,\n\nvor fünf Tagen habe ich bei Ihnen im Internet eine Winterjacke bestellt. Die Bestellnummer ist 48213. Das Paket ist heute bei mir angekommen, aber leider ist die Jacke viel zu groß. Ich habe Größe M bestellt, aber die Jacke passt eher einem Mann mit Größe XL.\n\nDeshalb möchte ich den Kauf widerrufen. Ich weiß, dass ich dafür vierzehn Tage Zeit habe. Bitte schreiben Sie mir, wie ich die Jacke zurückschicken kann. Muss ich das Porto selbst bezahlen, oder legen Sie ein Rücksendeetikett bei?\n\nAußerdem möchte ich gern wissen, wann ich mein Geld zurückbekomme und ob es auf mein Konto überwiesen wird.\n\nVielen Dank für Ihre Hilfe.\n\nMit freundlichen Grüßen\nPeter Albrecht'
      },
      {
        titel: 'Aufgabe B: Ein gebrauchtes Fahrrad kaufen',
        situation:
          'Auf einer Kleinanzeigen-Seite haben Sie das gebrauchte Fahrrad von Herrn Roth gesehen. Es kostet 120 Euro. Schreiben Sie ihm eine E-Mail.',
        leitpunkte: [
          'Sagen Sie, dass Sie sich für das Fahrrad interessieren, und warum Sie ein Fahrrad brauchen.',
          'Fragen Sie nach dem Alter und dem Zustand des Fahrrads.',
          'Fragen Sie, ob der Preis etwas niedriger sein kann.',
          'Schlagen Sie einen Termin vor, an dem Sie das Fahrrad ansehen können.'
        ],
        musterloesung:
          'Guten Tag, Herr Roth,\n\nich habe Ihre Anzeige für das gebrauchte Fahrrad gesehen und interessiere mich sehr dafür. Ich brauche ein Fahrrad, weil ich seit Kurzem eine neue Arbeit habe und mit dem Bus fast eine Stunde unterwegs bin.\n\nKönnen Sie mir bitte sagen, wie alt das Fahrrad ist? Sind die Reifen und die Bremsen noch in gutem Zustand? Gibt es Schäden, zum Beispiel am Rahmen?\n\nDer Preis von 120 Euro ist für mich ein bisschen hoch. Wären Sie damit einverstanden, wenn ich 100 Euro zahle?\n\nIch könnte am Samstagvormittag zu Ihnen kommen und das Fahrrad ansehen. Passt Ihnen zehn Uhr? Bitte schreiben Sie mir kurz, ob das möglich ist.\n\nViele Grüße\nElena Popescu'
      }
    ],
    tipps:
      'Cover all four Leitpunkte and write a complete text with Anrede and Gruß. Aufgabe A is formal ("Sehr geehrte Damen und Herren", "Sie"), Aufgabe B is half-formal ("Guten Tag, Herr Roth"). Use polite questions ("Könnten Sie mir bitte sagen, ...") and connect your ideas with "weil", "deshalb" or "außerdem".'
  },

  sprechen: {
    teil1: {
      anweisung:
        'Stellen Sie sich vor. Sprechen Sie über Ihren Namen, Ihren Geburtsort, Ihren Wohnort, Ihre Arbeit oder Ihren Beruf, Ihre Familie und Ihre Sprachen.',
      nachfragen: [
        'Wo kaufen Sie normalerweise ein: im Supermarkt, auf dem Markt oder im Internet?',
        'Was haben Sie zuletzt gekauft? Waren Sie zufrieden?',
        'Wie war das Einkaufen, als Sie neu in Deutschland waren?',
        'Gehen Sie lieber allein oder mit Freunden oder Familie einkaufen?'
      ],
      redemittel: [
        'Ich heiße ... und komme aus ...',
        'Ich wohne seit ... in ...',
        'Ich arbeite als ... / Ich mache gerade einen Deutschkurs.',
        'In meiner Familie gibt es ... Personen.',
        'Ich spreche ..., und ich lerne Deutsch seit ...'
      ]
    },
    teil2: {
      anweisung:
        'Beschreiben Sie das Foto: Was sehen Sie? Was für eine Situation ist das? Danach stellt Ihnen die Prüferin oder der Prüfer Fragen zu Ihren eigenen Erfahrungen.',
      bilder: [
        {
          beschreibung:
            'Auf dem Foto sieht man eine Supermarktkasse. Eine ältere Frau packt Lebensmittel in ihre Stofftasche, hinter ihr warten drei Kunden mit vollen Einkaufswagen. Die Kassiererin lächelt und scannt gerade eine Packung Milch.',
          fragenA2: [
            'Gehen Sie gern in den Supermarkt?',
            'Was kaufen Sie jede Woche?',
            'Bringen Sie eine eigene Tasche zum Einkaufen mit?'
          ],
          fragenB1: [
            'Wie finden Sie Selbstbedienungskassen, an denen man selbst scannt?',
            'Haben Sie schon einmal etwas im Supermarkt reklamiert? Was ist passiert?',
            'Was ist beim Einkaufen in Deutschland anders als in Ihrem Heimatland?'
          ]
        },
        {
          beschreibung:
            'Auf dem Foto sieht man einen Flohmarkt im Freien. An einem Tisch liegen gebrauchte Bücher, Geschirr und Spielzeug. Ein Mann hält eine Lampe in der Hand und spricht mit der Verkäuferin, vielleicht über den Preis.',
          fragenA2: [
            'Waren Sie schon einmal auf einem Flohmarkt?',
            'Was kaufen Sie gern gebraucht?',
            'Was würden Sie auf einem Flohmarkt verkaufen?'
          ],
          fragenB1: [
            'Warum kaufen viele Menschen gebrauchte Sachen? Was spricht dafür, was dagegen?',
            'Handeln Sie gern um den Preis? Wie ist das in Ihrem Heimatland?',
            'Haben Sie schon einmal etwas im Internet gebraucht gekauft oder verkauft? Welche Erfahrungen haben Sie gemacht?'
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
        'Ihr Deutschkurs endet bald. Sie möchten gemeinsam mit einer anderen Kursteilnehmerin ein Abschiedsgeschenk für Ihre Lehrerin kaufen.',
      aufgabe: 'Besprechen Sie, was nötig ist, und einigen Sie sich auf einen Plan.',
      notizen: [
        'Was schenken?',
        'Wie viel Geld?',
        'Wo kaufen: im Geschäft oder im Internet?',
        'Wer kauft ein und wann?',
        'Wie übergeben wir das Geschenk?',
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
