import { type DtzExam } from '@shared/types/dtzExam.ts';

const exam = {
  id: 3,
  title: 'Mock exam 3',
  theme: 'Arbeit & Jobsuche',

  hoeren: {
    teil1: {
      anweisung:
        'Sie hören vier Ansagen. Zu jeder Ansage gibt es eine Aufgabe. Welche Lösung (a, b oder c) passt am besten?',
      items: [
        {
          audio:
            'Guten Tag, Sie sind verbunden mit der Agentur für Arbeit Neustadt. Unsere Servicezeiten sind Montag bis Mittwoch von acht bis sechzehn Uhr, Donnerstag von acht bis achtzehn Uhr und Freitag von acht bis zwölf Uhr. Wenn Sie einen Termin vereinbaren möchten, drücken Sie die Eins. Bei Fragen zum Arbeitslosengeld drücken Sie die Zwei. Wenn Sie mit einer Mitarbeiterin sprechen möchten, bleiben Sie bitte in der Leitung.',
          frage: 'Was muss man tun, wenn man einen Termin vereinbaren möchte?',
          options: ['Die Eins drücken.', 'Die Zwei drücken.', 'In der Leitung bleiben.'],
          answer: 0
        },
        {
          audio:
            'Guten Tag, Herr Petrov, hier spricht Sandra Keller von der Firma Bauer Logistik. Ihr Vorstellungsgespräch morgen um zehn Uhr muss leider ausfallen, weil unser Chef krank ist. Können Sie stattdessen am Donnerstag um vierzehn Uhr kommen? Bitte rufen Sie mich bis heute Abend zurück. Meine Nummer ist null vier null, fünf fünf sechs sieben acht. Vielen Dank.',
          frage: 'Was soll Herr Petrov tun?',
          options: [
            'Heute Abend zurückrufen.',
            'Eine neue Bewerbung schicken.',
            'Morgen um zehn Uhr zur Firma kommen.'
          ],
          answer: 0
        },
        {
          audio:
            'Achtung an Gleis drei. Der Regionalexpress nach Leipzig, planmäßige Abfahrt neun Uhr zwölf, hat voraussichtlich zwanzig Minuten Verspätung. Grund ist eine Signalstörung. Reisende nach Leipzig, die nicht warten möchten, nutzen bitte die S-Bahn auf Gleis eins. Sie fährt um neun Uhr fünfzehn.',
          frage: 'Was können Reisende nach Leipzig tun, wenn sie nicht warten möchten?',
          options: [
            'Den Regionalexpress auf Gleis eins nehmen.',
            'Die S-Bahn auf Gleis eins nehmen.',
            'Zwanzig Minuten auf Gleis drei warten.'
          ],
          answer: 1
        },
        {
          audio:
            'Liebe Besucherinnen und Besucher der Jobbörse in der Stadthalle. Der Vortrag „Bewerbung per E-Mail“ beginnt in zehn Minuten. Bitte beachten Sie: Er findet nicht wie im Programm im Raum vier statt, sondern im Raum zwei. Einen Lebenslauf-Check gibt es den ganzen Tag am Stand zwölf. Wir wünschen Ihnen viel Erfolg.',
          frage: 'Wo findet der Vortrag statt?',
          options: ['Im Raum zwei.', 'Im Raum vier.', 'Am Stand zwölf.'],
          answer: 0
        }
      ]
    },
    teil2: {
      anweisung:
        'Sie hören fünf kurze Radiobeiträge. Zu jedem Beitrag gibt es eine Aufgabe. Welche Lösung (a, b oder c) passt am besten?',
      items: [
        {
          audio:
            'Und nun das Wetter für morgen. Im Norden regnet es am Vormittag, am Nachmittag wird es trocken. Im Süden scheint den ganzen Tag die Sonne, es wird bis zu vierundzwanzig Grad warm. Am Abend wird es im Westen windig. Auch am Wochenende bleibt es überall mild.',
          frage: 'Wie wird das Wetter morgen im Süden?',
          options: ['Es ist sonnig und warm.', 'Es regnet am Vormittag.', 'Es ist windig und kalt.'],
          answer: 0
        },
        {
          audio:
            'Und nun die Verkehrsmeldungen. Auf der A sieben zwischen Hannover und Göttingen ist ein Lastwagen liegen geblieben. Dort steht der Verkehr auf drei Kilometern. Fahren Sie bitte bei Northeim ab und nutzen Sie die Bundesstraße. Außerdem ist die Rheinbrücke in Köln heute Nachmittag wegen Bauarbeiten gesperrt.',
          frage: 'Was sollen Autofahrer auf der A sieben tun?',
          options: [
            'Auf dem Standstreifen warten.',
            'Die Rheinbrücke benutzen.',
            'Bei Northeim auf die Bundesstraße fahren.'
          ],
          answer: 2
        },
        {
          audio:
            'Unser Tipp fürs Wochenende: Am Samstag findet auf dem Marktplatz der große Flohmarkt statt. Von acht bis fünfzehn Uhr verkaufen Familien alte Spielsachen, Bücher und Kleidung. Der Eintritt ist frei. Wer selbst einen Stand haben möchte, zahlt zehn Euro Standgebühr und meldet sich bis Freitag im Rathaus an.',
          frage: 'Bis wann muss man sich für einen Verkaufsstand anmelden?',
          options: ['Bis Donnerstag.', 'Bis Freitag.', 'Bis Samstag um acht Uhr.'],
          answer: 1
        },
        {
          audio:
            'Und das hören Sie im Anschluss: Um zwanzig Uhr läuft unsere Ratgebersendung „Beruf und Chance“. Heute geht es um Menschen, die den Beruf wechseln wollen. Eine Personalchefin erklärt, worauf es bei der Bewerbung ohne Ausbildung ankommt. Hörerinnen und Hörer können während der Sendung anrufen und ihre Fragen stellen. Danach um einundzwanzig Uhr Nachrichten.',
          frage: 'Was können Hörer in der Sendung tun?',
          options: [
            'Ihre Bewerbungsunterlagen einschicken.',
            'Stellenanzeigen kaufen.',
            'Der Personalchefin Fragen stellen.'
          ],
          answer: 2
        },
        {
          audio:
            'Rückenschmerzen im Büro? Die Gesundheitskasse Nordmark lädt Sie ein. Jeden Dienstag um siebzehn Uhr gibt es in der Turnhalle der Hans-Sachs-Schule einen kostenlosen Rückenkurs. Bringen Sie nur eine Matte und bequeme Kleidung mit. Eine Anmeldung ist nicht nötig.',
          frage: 'Was muss man zum Rückenkurs mitbringen?',
          options: ['Eine Anmeldung.', 'Eine Bestätigung vom Arzt.', 'Eine Matte.'],
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
              speaker: 'Murat',
              text: 'Anna, hast du kurz Zeit? Ich habe ein Problem mit dem Schichtplan. Am Samstag muss ich schon um sechs Uhr anfangen, aber meine Tochter hat an dem Tag ihr Schulfest.'
            },
            { speaker: 'Anna', text: 'Oh, das ist schade. Möchtest du mit mir tauschen?' },
            { speaker: 'Murat', text: 'Ja, wenn das geht. Ich arbeite dafür an deinem Sonntag.' },
            {
              speaker: 'Anna',
              text: 'Samstag kann ich leider auch nicht, da kommt meine Mutter zu Besuch. Aber du könntest Herrn Weber fragen. Er hat gestern gesagt, dass er Geld für seinen Urlaub braucht und gern mehr arbeiten würde.'
            },
            { speaker: 'Murat', text: 'Gute Idee. Dann spreche ich gleich mit ihm.' }
          ],
          statement: {
            text: 'Murat möchte am Samstag wegen des Schulfests seiner Tochter nicht arbeiten.',
            answer: true
          },
          question: {
            frage: 'Was rät Anna?',
            options: [
              'Murat soll den Chef anrufen.',
              'Murat soll am Sonntag frei nehmen.',
              'Murat soll Herrn Weber fragen.'
            ],
            answer: 2
          }
        },
        {
          audio: [
            { speaker: 'Jonas', text: 'Na, Lena, wie war dein Vorstellungsgespräch gestern?' },
            {
              speaker: 'Lena',
              text: 'Ganz gut, glaube ich. Die Firma ist ein kleiner Betrieb für Fahrradteile, es gibt nur zwanzig Mitarbeiter. Die Chefin war sehr freundlich.'
            },
            { speaker: 'Jonas', text: 'Und wie sind die Arbeitszeiten?' },
            {
              speaker: 'Lena',
              text: 'Vierzig Stunden pro Woche, aber mit Gleitzeit. Das Gehalt ist leider nicht so hoch, wie ich gedacht habe.'
            },
            { speaker: 'Jonas', text: 'Nimmst du die Stelle, wenn sie dir zusagen?' },
            {
              speaker: 'Lena',
              text: 'Das weiß ich noch nicht. Ich bekomme vielleicht noch ein zweites Angebot. Nächste Woche weiß ich mehr.'
            }
          ],
          statement: {
            text: 'Lena hat sich bei einem großen Betrieb mit vielen Mitarbeitern vorgestellt.',
            answer: false
          },
          question: {
            frage: 'Was sagt Lena zu ihrer Entscheidung?',
            options: [
              'Sie nimmt die Stelle sofort.',
              'Sie wartet noch auf ein anderes Angebot.',
              'Sie lehnt die Stelle ab.'
            ],
            answer: 1
          }
        },
        {
          audio: [
            { speaker: 'Herr Brandt', text: 'Frau Koç, Sie wollten mit mir über Ihren Urlaub sprechen?' },
            {
              speaker: 'Frau Koç',
              text: 'Ja. Ich möchte in den Sommerferien drei Wochen nehmen, vom vierzehnten Juli bis zum dritten August. Mein Mann arbeitet im Ausland, und wir wollen ihn mit den Kindern besuchen.'
            },
            {
              speaker: 'Herr Brandt',
              text: 'Hm, drei Wochen am Stück sind schwierig. Frau Peters hat schon Urlaub ab dem achtundzwanzigsten Juli. Zwei Wochen wären kein Problem.'
            },
            {
              speaker: 'Frau Koç',
              text: 'Dann nehme ich zwei Wochen im Juli und eine Woche im September, wenn das geht.'
            },
            {
              speaker: 'Herr Brandt',
              text: 'Das lässt sich machen. Schicken Sie mir bitte noch eine E-Mail, damit ich alles in den Kalender eintragen kann.'
            }
          ],
          statement: { text: 'Frau Koç bekommt drei Wochen Urlaub am Stück.', answer: false },
          question: {
            frage: 'Was soll Frau Koç noch tun?',
            options: [
              'Mit Frau Peters sprechen.',
              'Dem Chef eine E-Mail schicken.',
              'Ein Formular ausfüllen.'
            ],
            answer: 1
          }
        },
        {
          audio: [
            { speaker: 'Tina', text: 'Du, Jan, fährst du morgen mit dem Auto zur Arbeit?' },
            {
              speaker: 'Jan',
              text: 'Nein, mein Auto ist in der Werkstatt. Ich wollte den Bus nehmen, aber der fährt erst um halb acht, und ich muss schon um sieben im Büro sein, weil wir morgen Inventur haben.'
            },
            { speaker: 'Tina', text: 'Soll ich dich mitnehmen? Ich komme sowieso an deiner Straße vorbei.' },
            { speaker: 'Jan', text: 'Gern! Das wäre toll.' },
            { speaker: 'Tina', text: 'Dann hole ich dich um halb sieben ab. Warte bitte vor dem Haus.' }
          ],
          statement: {
            text: 'Jan kann morgen nicht mit seinem eigenen Auto zur Arbeit fahren.',
            answer: true
          },
          question: {
            frage: 'Wann holt Tina Jan ab?',
            options: ['Um halb sieben.', 'Um sieben Uhr.', 'Um halb acht.'],
            answer: 0
          }
        }
      ]
    },
    teil4: {
      anweisung:
        'Sie hören eine Radiosendung, in der Hörer ihre Meinung zu einem Thema sagen. Lesen Sie zuerst die Sätze a bis f. Zu jeder Meinung passt ein Satz. Ein Beispiel hören Sie zuerst. Zwei Sätze bleiben übrig.',
      thema: 'Arbeiten von zu Hause – Vorteil oder Nachteil?',
      sentences: [
        'Zu Hause arbeite ich konzentrierter als im Großraumbüro.',
        'Mir fehlt der Kontakt zu den Kollegen.',
        'Ich spare Zeit und Geld, weil ich nicht mehr pendeln muss.',
        'Meine Kinder stören mich, deshalb kann ich zu Hause nicht arbeiten.',
        'Mein Chef findet, dass man im Büro besser im Team arbeitet.',
        'Ich habe zu Hause keinen richtigen Arbeitsplatz.'
      ],
      beispiel: {
        audio:
          'Ich arbeite jetzt drei Tage pro Woche zu Hause. Am Anfang war das komisch, aber ich habe schnell gemerkt: Ohne Telefone und ohne die vielen Gespräche im Flur schaffe ich viel mehr. Ich kann mich richtig auf eine Aufgabe konzentrieren.',
        answer: 0
      },
      aussagen: [
        {
          audio:
            'Früher bin ich jeden Morgen fast eine Stunde mit dem Zug gefahren, und die Monatskarte war teuer. Jetzt stehe ich später auf, frühstücke in Ruhe und habe am Ende des Monats mehr Geld im Portemonnaie.',
          answer: 2
        },
        {
          audio:
            'Ich arbeite gern allein, aber nach zwei Wochen zu Hause war mir klar: Das gemeinsame Mittagessen mit den Kollegen und das Reden über alles Mögliche, das vermisse ich sehr.',
          answer: 1
        },
        {
          audio:
            'Wir wohnen in einer kleinen Zweizimmerwohnung. Ich sitze am Küchentisch, und wenn meine Frau kocht, muss ich den Laptop wegräumen. Ein eigenes Zimmer zum Arbeiten wäre schön.',
          answer: 5
        }
      ]
    }
  },

  lesen: {
    teil1: {
      anweisung:
        'Lesen Sie den Wegweiser und die Situationen. Wohin gehen Sie? Welche Lösung (a, b oder c) passt am besten?',
      titel: 'Wegweiser: Bildungs- und Beratungszentrum Westend',
      verzeichnis:
        'Erdgeschoss\nInformation und Anmeldung · Cafeteria · Kopierer und Drucker\n\n1. Stock\nBerufsberatung (Raum 101–105) · Bewerbungswerkstatt (Raum 110) · Stellenbörse mit Computern (Raum 112)\n\n2. Stock\nDeutschkurse (Raum 201–208) · Prüfungsbüro (Raum 210) · Lernraum und Bibliothek (Raum 215)\n\n3. Stock\nWeiterbildung Handwerk und Technik (Raum 301–306) · Kursleiterzimmer (Raum 310)\n\n4. Stock\nVerwaltung · Büro der Leitung',
      questions: [
        {
          frage: 'Sie suchen im Internet nach Stellenanzeigen, haben aber keinen Computer.',
          options: [
            'Erdgeschoss, Kopierer und Drucker',
            '1. Stock, Stellenbörse',
            '2. Stock, Lernraum und Bibliothek'
          ],
          answer: 1
        },
        {
          frage: 'Sie haben Ihr Prüfungszeugnis verloren und brauchen eine Kopie.',
          options: ['2. Stock, Deutschkurse', '2. Stock, Prüfungsbüro', '4. Stock, Verwaltung'],
          answer: 1
        },
        {
          frage: 'Sie möchten mit der Leiterin des Zentrums über eine Beschwerde sprechen.',
          options: ['1. Stock, Berufsberatung', '3. Stock, Kursleiterzimmer', 'Ein anderes Stockwerk'],
          answer: 2
        },
        {
          frage: 'Sie möchten einen Kurs „Elektrotechnik für Anfänger“ besuchen.',
          options: [
            '1. Stock, Berufsberatung',
            '3. Stock, Weiterbildung Handwerk und Technik',
            '4. Stock, Verwaltung'
          ],
          answer: 1
        },
        {
          frage: 'Sie möchten vor dem Kurs in Ruhe einen Kaffee trinken.',
          options: [
            'Erdgeschoss, Cafeteria',
            '2. Stock, Lernraum und Bibliothek',
            '3. Stock, Kursleiterzimmer'
          ],
          answer: 0
        }
      ]
    },
    teil2: {
      anweisung:
        'Lesen Sie die Situationen 26–30 und die Anzeigen a–h. Welche Anzeige passt zu welcher Situation? Für eine Situation gibt es keine passende Anzeige. Dort markieren Sie X.',
      situations: [
        'Sie suchen eine Teilzeitstelle im Verkauf. Sie können nur vormittags arbeiten, weil Ihre Kinder mittags aus der Schule kommen.',
        'Sie sind gelernter Elektriker und suchen eine Vollzeitstelle.',
        'Sie arbeiten tagsüber und möchten abends Ihr Deutsch für den Beruf verbessern.',
        'Sie brauchen Ihr Abschlusszeugnis aus Ihrem Heimatland auf Deutsch. Die Übersetzung muss amtlich beglaubigt sein.',
        'Sie haben ein Auto und möchten am Wochenende Geld dazuverdienen.'
      ],
      ads: [
        'Pizzeria Napoli sucht Fahrer oder Fahrerin für den Lieferdienst. Freitag bis Sonntag, 17–23 Uhr, 12 Euro pro Stunde. Eigenes Auto oder Roller bitte mitbringen. Anruf genügt: 0171 3344556.',
        'Kita Sonnenschein sucht Küchenhilfe. 25 Stunden pro Woche, Montag bis Freitag 7–12 Uhr. Kochen und Spülen für 40 Kinder. Keine Ausbildung nötig.',
        'Elektro Brandl GmbH sucht Elektroniker oder Elektronikerin für Installationen bei Privatkunden. Vollzeit, ab sofort. Führerschein Klasse B ist Pflicht. Bewerbung an: info@elektro-brandl-neustadt.de',
        'Sprachschule Lingua: Intensivkurs Deutsch, Montag bis Freitag von 8 bis 13 Uhr. Allgemeine Sprache für alle Niveaus, Beginn jeden Monat.',
        'Bäckerei Hoffmann sucht freundliche Verkäuferin für den Vormittag. Montag bis Samstag, 6–11.30 Uhr, 20 Stunden pro Woche. Keine Vorkenntnisse nötig, wir lernen Sie ein.',
        'Übersetzungsbüro Sprachbrücke: Wir übersetzen Geschäftsbriefe, Webseiten und Handbücher in zwölf Sprachen. Beglaubigte Übersetzungen von Zeugnissen und Urkunden machen wir leider nicht.',
        'VHS Neustadt: Deutsch im Beruf (B1). Der Kurs läuft sechs Monate, jeden Montag und Mittwoch von 18 bis 20.30 Uhr. Förderung durch das Jobcenter ist möglich. Anmeldung im Büro.',
        'Bewerbungstraining im Jobcenter: Lebenslauf, Anschreiben und Vorstellungsgespräch. Jeden Dienstag von 9 bis 12 Uhr, kostenlos. Eine Anmeldung ist nicht nötig.'
      ],
      answers: [4, 2, 6, -1, 0]
    },
    teil3: {
      anweisung:
        'Lesen Sie die Texte und die Aufgaben dazu. Ist die Aussage richtig oder falsch? Welche Lösung (a, b oder c) passt am besten?',
      texts: [
        {
          titel: 'Jobbörse für die ganze Region',
          text: 'Am ersten Samstag im November lädt die Stadt Neustadt von 10 bis 16 Uhr zur großen Jobbörse in die Stadthalle ein. Mehr als vierzig Firmen aus Handwerk, Pflege und Handel stellen sich vor, viele von ihnen haben auch noch freie Ausbildungsplätze. Der Eintritt ist frei. Wer möchte, kann seine Bewerbungsmappe direkt am Stand der Agentur für Arbeit prüfen lassen. Für Kinder gibt es von 10 bis 14 Uhr eine kostenlose Betreuung. Die Parkplätze an der Stadthalle sind begrenzt, deshalb empfiehlt die Stadt die Buslinie 5.',
          statement: {
            text: 'Auf der Jobbörse kann man seine Bewerbungsunterlagen kontrollieren lassen.',
            answer: true
          },
          question: {
            frage: 'Was ist für Familien wichtig?',
            options: [
              'Die Kinderbetreuung gibt es nur bis 14 Uhr.',
              'Kinder dürfen nicht mitkommen.',
              'Kinder müssen Eintritt bezahlen.'
            ],
            answer: 0
          }
        },
        {
          titel: 'Einladung zum Vorstellungsgespräch',
          text: 'Sehr geehrter Herr Aydin,\n\nvielen Dank für Ihre Bewerbung als Lagerarbeiter. Wir möchten Sie gern kennenlernen und laden Sie zu einem Gespräch am Dienstag, dem 18., um 9.30 Uhr in unser Büro in der Industriestraße 14 ein. Bitte bringen Sie Ihre Originalzeugnisse und eine Kopie Ihres Führerscheins mit. Das Gespräch dauert etwa 45 Minuten, danach zeigen wir Ihnen das Lager. Bitte bestätigen Sie den Termin bis Freitag per E-Mail. Wenn Sie an dem Tag nicht kommen können, rufen Sie uns an, dann suchen wir einen anderen Termin. Fahrkosten können wir leider nicht erstatten.\n\nMit freundlichen Grüßen\nB. Hartmann, Personalabteilung',
          statement: { text: 'Herr Aydin soll nur Kopien seiner Zeugnisse mitbringen.', answer: false },
          question: {
            frage: 'Was soll Herr Aydin bis Freitag tun?',
            options: [
              'Seinen Führerschein schicken.',
              'Im Büro anrufen.',
              'Den Termin per E-Mail bestätigen.'
            ],
            answer: 2
          }
        },
        {
          titel: 'Mitteilung der Hausverwaltung',
          text: 'An alle Mieterinnen und Mieter der Lindenstraße 8:\n\nWegen der Erneuerung der Heizung arbeiten von Montag, dem 3., bis Freitag, dem 14., Handwerker im Haus, jeweils von 7.30 bis 16 Uhr. Es kann dabei laut werden. Am Mittwoch, dem 5., und am Donnerstag, dem 6., ist das Warmwasser von 8 bis 14 Uhr abgestellt. Wer tagsüber nicht zu Hause ist, kann seinen Wohnungsschlüssel bei Frau Kowalski im Erdgeschoss abgeben. Die Miete bleibt unverändert.\n\nHausverwaltung Nordstadt',
          statement: { text: 'Die Miete wird wegen der Arbeiten niedriger.', answer: false },
          question: {
            frage: 'Was können Mieter tun, die tagsüber nicht zu Hause sind?',
            options: [
              'Die Wohnungstür offen lassen.',
              'Einen anderen Termin ausmachen.',
              'Den Schlüssel bei Frau Kowalski abgeben.'
            ],
            answer: 2
          }
        }
      ]
    },
    teil4: {
      anweisung: 'Lesen Sie den Text und die Aussagen dazu. Ist die Aussage richtig oder falsch?',
      titel: 'Neu im Job: Das sollten Sie wissen',
      text: 'Arbeitsvertrag\nDie wichtigsten Bedingungen wie Lohn und Arbeitszeit muss der Arbeitgeber spätestens am ersten Arbeitstag schriftlich festhalten. Auch die Urlaubstage gehören zu den Angaben im Vertrag. Lesen Sie den Vertrag in Ruhe und fragen Sie nach, wenn Sie etwas nicht verstehen.\n\nProbezeit\nOft dauert die Probezeit sechs Monate. In dieser Zeit können beide Seiten den Vertrag mit einer Frist von zwei Wochen kündigen. Danach gelten längere Fristen.\n\nUrlaub\nWer fünf Tage pro Woche arbeitet, hat mindestens 20 Urlaubstage im Jahr. Sprechen Sie Ihren Urlaub rechtzeitig mit Ihrem Chef oder Ihrer Chefin ab.\n\nWenn Sie krank sind\nRufen Sie am ersten Tag so früh wie möglich im Betrieb an. Eine Krankschreibung vom Arzt brauchen Sie normalerweise erst, wenn Sie länger als drei Tage fehlen. Der Arbeitgeber darf sie aber auch früher verlangen.',
      statements: [
        { text: 'Der Arbeitgeber muss die Arbeitsbedingungen schriftlich festhalten.', answer: true },
        { text: 'In der Probezeit kann nur der Arbeitgeber den Vertrag kündigen.', answer: false },
        {
          text: 'Wer nur zwei Tage krank ist, braucht normalerweise keine Krankschreibung vom Arzt.',
          answer: true
        }
      ]
    },
    teil5: {
      anweisung: 'Lesen Sie den Brief. Welches Wort passt in die Lücke? Wählen Sie a, b oder c.',
      text: 'Sehr geehrte Frau Neumann,\n\nich habe Ihre Anzeige in der Zeitung gelesen und möchte mich um die Stelle [1] Lagerhelfer bewerben. [2] drei Jahren arbeite ich in einem Lager in Dresden. Leider ist mein Arbeitsweg sehr lang, deshalb suche ich eine Stelle, [3] näher an meiner Wohnung liegt. Ich habe einen Staplerschein und kann auch am Wochenende arbeiten, [4] es nötig ist. [5] Zeugnisse und meinen Lebenslauf habe ich dieser E-Mail angehängt. Ich würde mich sehr freuen, wenn Sie mich zu einem Gespräch [6] würden.\n\nMit freundlichen Grüßen\nIgor Petrenko',
      gaps: [
        { options: ['als', 'wie', 'wenn'], answer: 0 },
        { options: ['Vor', 'Bei', 'Seit'], answer: 2 },
        { options: ['der', 'das', 'die'], answer: 2 },
        { options: ['ob', 'wenn', 'obwohl'], answer: 1 },
        { options: ['Meinen', 'Meiner', 'Meine'], answer: 2 },
        { options: ['eingeladen', 'einladet', 'einladen'], answer: 2 }
      ]
    }
  },

  schreiben: {
    anweisung:
      'Wählen Sie Aufgabe A oder Aufgabe B. Schreiben Sie einen Text zu allen vier Punkten. Zeigen Sie, was Sie können. Schreiben Sie möglichst viel. Vergessen Sie nicht die Anrede und den Gruß.',
    tasks: [
      {
        titel: 'Aufgabe A: Bewerbung um einen Nebenjob',
        situation:
          'Sie haben in der Zeitung eine Anzeige der Buchhandlung Lesezeit gelesen. Die Buchhandlung sucht eine Aushilfe für samstags. Sie möchten sich bewerben und schreiben an die Inhaberin, Frau Winter.',
        leitpunkte: [
          'Sagen Sie, wo Sie die Anzeige gelesen haben, und erklären Sie, warum Sie die Stelle interessiert.',
          'Beschreiben Sie Ihre Erfahrungen und Ihre Sprachkenntnisse.',
          'Nennen Sie die Tage und Uhrzeiten, an denen Sie arbeiten können.',
          'Fragen Sie nach dem Stundenlohn und bitten Sie um ein Gespräch.'
        ],
        musterloesung:
          'Sehr geehrte Frau Winter,\n\nin der Wochenzeitung habe ich gelesen, dass Sie für Ihre Buchhandlung eine Aushilfe für samstags suchen. Die Stelle interessiert mich sehr, weil ich gern lese und mich gut mit Kinder- und Jugendbüchern auskenne.\n\nIch habe zwei Jahre als Verkäuferin in einem Supermarkt gearbeitet und kann gut mit Kunden umgehen. Meine Muttersprache ist Türkisch, außerdem spreche ich Deutsch auf dem Niveau B1 und ein bisschen Englisch.\n\nSamstags kann ich den ganzen Tag arbeiten, und auch dienstags und donnerstags habe ich nach 16 Uhr Zeit.\n\nKönnten Sie mir bitte sagen, wie hoch der Stundenlohn ist? Ich würde mich freuen, wenn ich mich bei Ihnen persönlich vorstellen dürfte.\n\nMit freundlichen Grüßen\nElif Kaya'
      },
      {
        titel: 'Aufgabe B: Weiterbildung während der Arbeitszeit',
        situation:
          'Sie arbeiten seit einem Jahr in einer Spedition. Die Handwerkskammer bietet einen zweitägigen Kurs für den Staplerschein an. Sie möchten daran teilnehmen und schreiben an Ihren Chef, Herrn Lange.',
        leitpunkte: [
          'Sagen Sie, welchen Kurs Sie besuchen möchten und wann er stattfindet.',
          'Erklären Sie, warum die Weiterbildung auch für die Firma nützlich ist.',
          'Schlagen Sie vor, wie Ihre Arbeit in dieser Zeit erledigt werden kann.',
          'Bitten Sie um eine Antwort bis Freitag.'
        ],
        musterloesung:
          'Sehr geehrter Herr Lange,\n\nich möchte Sie bitten, mich für einen Kurs freizustellen. Die Handwerkskammer bietet am 12. und 13. Mai einen Kurs für den Staplerschein an. Er findet jeweils von 8 bis 16 Uhr statt.\n\nMit dem Staplerschein könnte ich im Lager flexibler arbeiten und Herrn Brandt vertreten, wenn er krank ist oder Urlaub hat. Das ist sicher auch für die Firma ein Vorteil.\n\nMeine Aufgaben an den beiden Tagen könnte meine Kollegin Frau Stein übernehmen. Ich habe schon mit ihr gesprochen, und sie ist einverstanden. Die Lieferungen für den 12. Mai bereite ich vorher vor.\n\nKönnten Sie mir bitte bis Freitag antworten, weil die Anmeldung dann endet?\n\nMit freundlichen Grüßen\nDaniel Petrov'
      }
    ],
    tipps:
      'Cover all four points, each with at least one full sentence. Open with a reason for writing ("ich schreibe Ihnen, weil ...") and close with a polite request ("Könnten Sie mir bitte ..."). Use "Sie" throughout, and connect your ideas with "weil", "deshalb" and "wenn". Do not forget the Anrede and the Gruß.'
  },

  sprechen: {
    teil1: {
      anweisung:
        'Stellen Sie sich Ihrer Gesprächspartnerin oder Ihrem Gesprächspartner vor. Sprechen Sie über die Stichworte auf Ihrer Karte. Danach stellt die Prüferin oder der Prüfer Ihnen Fragen.',
      nachfragen: [
        'Was machen Sie beruflich? Gefällt Ihnen Ihre Arbeit?',
        'Welchen Beruf haben Sie in Ihrem Heimatland gelernt?',
        'Wie sind Ihre Arbeitszeiten?',
        'Wie sind Sie zu Ihrer Arbeit gekommen?',
        'Welchen Beruf möchten Sie in der Zukunft haben?'
      ],
      redemittel: [
        'Ich heiße ... und komme aus ...',
        'Ich wohne seit ... in ...',
        'Von Beruf bin ich ...',
        'Ich arbeite als ... bei der Firma ...',
        'In meiner Familie gibt es ...',
        'Ich spreche ... und ein bisschen ...'
      ]
    },
    teil2: {
      anweisung:
        'Beschreiben Sie Ihr Foto: Was sehen Sie? Was für eine Situation ist das? Danach stellt die Prüferin oder der Prüfer Ihnen Fragen zu Ihren eigenen Erfahrungen.',
      bilder: [
        {
          beschreibung:
            'Auf dem Foto sieht man ein Vorstellungsgespräch in einem hellen Büro. Eine Frau und ein Mann sitzen an einem Tisch. Die Frau hält eine Bewerbungsmappe in der Hand und lächelt. Der Mann macht sich Notizen.',
          fragenA2: [
            'Haben Sie schon einmal ein Vorstellungsgespräch gehabt?',
            'Wo arbeiten Sie jetzt?',
            'Was tragen Sie bei der Arbeit?'
          ],
          fragenB1: [
            'Wie bereiten Sie sich auf ein Vorstellungsgespräch vor?',
            'Welche Fragen sind bei einem Vorstellungsgespräch besonders schwierig?',
            'Was ist Ihnen bei einer neuen Stelle am wichtigsten?'
          ]
        },
        {
          beschreibung:
            'Auf dem Foto sieht man drei Handwerker auf einer Baustelle. Sie tragen gelbe Helme und Arbeitskleidung. Ein Mann zeigt auf einen Plan, die anderen hören zu. Im Hintergrund sieht man ein Haus ohne Dach.',
          fragenA2: [
            'Arbeiten Sie gern mit anderen zusammen?',
            'Haben Sie schon einmal auf einer Baustelle oder in einer Werkstatt gearbeitet?',
            'Wie kommen Sie zur Arbeit?'
          ],
          fragenB1: [
            'Wie wichtig ist Teamarbeit in Ihrem Beruf?',
            'Welche Vor- und Nachteile hat Arbeit im Freien?',
            'Wie war Ihre erste Zeit an einem neuen Arbeitsplatz?'
          ]
        }
      ],
      redemittel: [
        'Auf dem Foto sieht man ...',
        'Im Vordergrund / im Hintergrund ...',
        'Ich glaube, die Personen ...',
        'Das erinnert mich an ...',
        'Bei mir war das so: ...',
        'Meiner Meinung nach ...'
      ]
    },
    teil3: {
      situation:
        'Ein Kollege aus Ihrer Abteilung verlässt nach zehn Jahren die Firma. Sie und Ihre Partnerin oder Ihr Partner möchten für ihn eine Abschiedsfeier planen.',
      aufgabe:
        'Planen Sie die Feier gemeinsam. Sprechen Sie über die Punkte auf Ihrem Zettel und machen Sie Vorschläge. Einigen Sie sich am Ende.',
      notizen: [
        'Wann und wo feiern?',
        'Wen einladen?',
        'Essen und Getränke?',
        'Geschenk für den Kollegen?',
        'Wer organisiert was?',
        '…?'
      ],
      redemittel: [
        'Ich schlage vor, dass wir ...',
        'Wie wäre es, wenn wir ...?',
        'Was meinen Sie dazu?',
        'Das ist eine gute Idee, aber ...',
        'Wollen wir ... machen?',
        'Einverstanden, dann machen wir das so.'
      ]
    }
  }
} as const satisfies DtzExam;

export default exam;
