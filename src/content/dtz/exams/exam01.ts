import { type DtzExam } from '@shared/types/dtzExam.ts';

const exam = {
  id: 1,
  title: 'Modelltest 1',
  theme: 'Ankommen & Behörden',

  hoeren: {
    teil1: {
      anweisung:
        'Sie hören vier Ansagen. Zu jeder Ansage gibt es eine Aufgabe. Welche Lösung (a, b oder c) passt am besten?',
      items: [
        {
          audio:
            'Guten Tag, Herr Yilmaz, hier ist das Bürgeramt Nordstadt. Ihr Termin am Dienstag um vierzehn Uhr fällt leider aus, weil wir unser Computersystem warten müssen. Sie haben jetzt einen neuen Termin am Donnerstag um halb zehn. Bitte bringen Sie Ihren Pass und Ihren Mietvertrag mit. Wenn Ihnen der Donnerstag nicht passt, rufen Sie uns bitte zurück. Auf Wiederhören.',
          frage: 'Warum ruft das Bürgeramt an?',
          options: [
            'Herr Yilmaz hat wichtige Unterlagen vergessen.',
            'Herr Yilmaz muss eine Gebühr bezahlen.',
            'Der Termin am Dienstag findet nicht statt.'
          ],
          answer: 2
        },
        {
          audio:
            'Achtung an Gleis vier. Der Regionalexpress nach Kassel, planmäßige Abfahrt fünfzehn Uhr achtundvierzig, fährt heute nicht von Gleis vier ab, sondern von Gleis elf. Bitte beachten Sie die geänderte Gleisangabe. Der Zug fährt in zwölf Minuten.',
          frage: 'Von welchem Gleis fährt der Zug nach Kassel ab?',
          options: ['Von Gleis 4.', 'Von Gleis 11.', 'Von Gleis 14.'],
          answer: 1
        },
        {
          audio:
            'Herzlich willkommen beim Jobcenter Südstadt. Sie sind mit dem automatischen Telefonservice verbunden. Wenn Sie Fragen zu Ihrem Arbeitslosengeld haben, drücken Sie die Eins. Wenn Sie einen Termin vereinbaren, verschieben oder absagen möchten, drücken Sie die Zwei. Wenn Sie Unterlagen einreichen möchten, drücken Sie die Drei. Unsere Telefonzeiten sind montags bis freitags von acht bis fünfzehn Uhr, donnerstags bis achtzehn Uhr.',
          frage: 'Sie möchten einen Termin im Jobcenter verschieben. Welche Taste drücken Sie?',
          options: ['Die Eins.', 'Die Zwei.', 'Die Drei.'],
          answer: 1
        },
        {
          audio:
            'Guten Tag, Frau Petrova, hier spricht die Ausländerbehörde der Stadt Rheinfeld. Ihr Aufenthaltstitel ist fertig. Sie können ihn in den nächsten vier Wochen abholen, aber nur mit Termin. Den Termin können Sie im Internet buchen oder telefonisch montags bis donnerstags zwischen acht und zwölf Uhr vereinbaren. Ohne Termin können wir Ihnen die Karte leider nicht geben. Bitte bringen Sie Ihren Pass und diesen Brief mit.',
          frage: 'Was muss Frau Petrova tun, um ihren Aufenthaltstitel zu bekommen?',
          options: ['Einen Termin vereinbaren.', 'Die Karte per Post anfordern.', 'Vier Wochen warten.'],
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
            'Und nun das Wetter für morgen. Im Norden bleibt es bewölkt, und es regnet immer wieder. Im Süden scheint dagegen den ganzen Tag die Sonne, bei Temperaturen bis zu zweiundzwanzig Grad. Am Wochenende wird es überall kühler.',
          frage: 'Wie wird das Wetter morgen im Süden?',
          options: ['Es regnet.', 'Es wird kühler.', 'Es ist sonnig.'],
          answer: 2
        },
        {
          audio:
            'Eine Verkehrsmeldung für die Autobahn A sieben Richtung Süden. Zwischen Hohenfeld und Rheinau ist die Autobahn nach einem Unfall gesperrt. Es gibt acht Kilometer Stau. Autofahrer sollen bei Hohenfeld abfahren und über die Bundesstraße vier fahren.',
          frage: 'Was sollen Autofahrer tun?',
          options: [
            'Bei Hohenfeld abfahren und die Bundesstraße nehmen.',
            'In Rheinau abfahren.',
            'Auf der Autobahn bleiben und warten.'
          ],
          answer: 0
        },
        {
          audio:
            'Unser Tipp für das Wochenende: das Fest der Kulturen im Stadtpark. Am Samstag ab vierzehn Uhr gibt es Musik und Tanz, und an vielen Ständen können Sie Essen aus zwanzig Ländern probieren. Der Eintritt ist frei. Über Spenden für Deutschkurse freuen sich die Veranstalter.',
          frage: 'Was kostet der Eintritt beim Fest der Kulturen?',
          options: ['Zwanzig Euro.', 'Nichts.', 'Eine Spende ist Pflicht.'],
          answer: 1
        },
        {
          audio:
            'Heute Abend um zwanzig Uhr fünfzehn hören Sie bei uns die Sendung „Leben in Deutschland“. Heute geht es um die Anerkennung ausländischer Berufsabschlüsse: Wie läuft das Verfahren, und wo bekommt man Hilfe? Im Anschluss beantwortet eine Expertin Ihre Fragen am Hörertelefon.',
          frage: 'Worum geht es in der Sendung?',
          options: [
            'Um Wohnungen für Zuwanderer.',
            'Um Deutschkurse im Internet.',
            'Um die Anerkennung von Berufsabschlüssen.'
          ],
          answer: 2
        },
        {
          audio:
            'Ihre Apotheke am Markt informiert: Jeden Mittwoch von fünfzehn bis achtzehn Uhr können Sie sich bei uns ohne Termin gegen Grippe impfen lassen. Für alle ab sechzig Jahren ist die Impfung kostenlos. Alle anderen zahlen fünfundzwanzig Euro. Bitte bringen Sie Ihren Impfausweis mit.',
          frage: 'Wer muss für die Grippeimpfung nichts bezahlen?',
          options: [
            'Alle Kunden mit Impfausweis.',
            'Alle ab sechzig Jahren.',
            'Alle, die einen Termin haben.'
          ],
          answer: 1
        }
      ]
    },
    teil3: {
      anweisung:
        'Sie hören vier Gespräche. Zu jedem Gespräch gibt es zwei Aufgaben. Ist die Aussage richtig oder falsch? Welche Lösung (a, b oder c) passt am besten?',
      gespraeche: [
        {
          audio: [
            { speaker: 'Beamtin', text: 'Guten Morgen. Was kann ich für Sie tun?' },
            {
              speaker: 'Herr Costa',
              text: 'Guten Morgen. Ich bin vor einer Woche umgezogen und möchte mich anmelden.'
            },
            {
              speaker: 'Beamtin',
              text: 'Dann brauche ich Ihren Pass und die Wohnungsgeberbestätigung von Ihrem Vermieter.'
            },
            {
              speaker: 'Herr Costa',
              text: 'Die Bestätigung habe ich leider noch nicht. Aber ich habe meinen Mietvertrag dabei.'
            },
            {
              speaker: 'Beamtin',
              text: 'Der Mietvertrag reicht dafür nicht. Rufen Sie Ihren Vermieter an. Er kann das Formular auch per E-Mail schicken. Dann kommen Sie morgen Vormittag einfach noch einmal vorbei, bis zwölf Uhr brauchen Sie keinen Termin.'
            },
            { speaker: 'Herr Costa', text: 'Gut, dann komme ich morgen früh wieder. Vielen Dank.' }
          ],
          statement: { text: 'Der Mietvertrag reicht für die Anmeldung aus.', answer: false },
          question: {
            frage: 'Wann kann Herr Costa wiederkommen?',
            options: ['Noch heute.', 'Morgen Vormittag.', 'Erst nächsten Monat.'],
            answer: 1
          }
        },
        {
          audio: [
            { speaker: 'Nina', text: 'Hallo Dev! Wie läuft denn dein Deutschkurs?' },
            {
              speaker: 'Dev',
              text: 'Ganz gut. Ich besuche den Abendkurs. Vormittags kann ich nicht, weil ich tagsüber arbeite.'
            },
            {
              speaker: 'Nina',
              text: 'Das ist anstrengend, oder? Ich gehe jeden Vormittag in den Kurs. Nächsten Monat mache ich den Abschlusstest.'
            },
            { speaker: 'Dev', text: 'Dann drücke ich dir die Daumen. Ich muss noch ein halbes Jahr lernen.' },
            { speaker: 'Nina', text: 'Du schaffst das auch. Danach bekommst du ja genauso ein Zertifikat.' }
          ],
          statement: { text: 'Nina macht nächsten Monat einen Test.', answer: true },
          question: {
            frage: 'Warum besucht Dev den Kurs am Abend?',
            options: [
              'Er arbeitet tagsüber.',
              'Der Vormittagskurs war schon voll.',
              'Er möchte abends Menschen kennenlernen.'
            ],
            answer: 0
          }
        },
        {
          audio: [
            { speaker: 'Mitarbeiter', text: 'Familienkasse, guten Tag.' },
            {
              speaker: 'Frau Ivanova',
              text: 'Guten Tag, hier ist Ivanova. Meine Tochter ist vor zwei Monaten geboren. Ich möchte Kindergeld beantragen. Wie geht das?'
            },
            {
              speaker: 'Mitarbeiter',
              text: 'Sie können den Antrag im Internet ausfüllen oder das Papierformular per Post an uns schicken. Dazu brauchen wir Ihre Steueridentifikationsnummer und die Ihrer Tochter.'
            },
            {
              speaker: 'Frau Ivanova',
              text: 'Die Nummer meiner Tochter habe ich schon per Post bekommen. Wie lange dauert die Bearbeitung?'
            },
            {
              speaker: 'Mitarbeiter',
              text: 'In der Regel etwa sechs Wochen.'
            },
            {
              speaker: 'Frau Ivanova',
              text: 'Das ist gut. Dann fülle ich den Antrag heute Abend online aus.'
            }
          ],
          statement: { text: 'Die Bearbeitung des Antrags dauert etwa eine Woche.', answer: false },
          question: {
            frage: 'Wie kann Frau Ivanova den Antrag stellen?',
            options: ['Nur persönlich im Amt.', 'Im Internet oder per Post.', 'Nur telefonisch.'],
            answer: 1
          }
        },
        {
          audio: [
            {
              speaker: 'Herr Horvat',
              text: 'Guten Tag. Ich habe einen Führerschein aus Serbien und wohne seit zwei Monaten in Deutschland und bin seitdem angemeldet. Darf ich damit weiter Auto fahren?'
            },
            {
              speaker: 'Mitarbeiterin',
              text: 'Ja, aber nur sechs Monate lang ab dem Tag Ihrer Anmeldung. Danach brauchen Sie einen deutschen Führerschein.'
            },
            { speaker: 'Herr Horvat', text: 'Was muss ich dafür machen?' },
            {
              speaker: 'Mitarbeiterin',
              text: 'Sie müssen den Führerschein umschreiben lassen. Dazu brauchen Sie ein biometrisches Passfoto, eine Übersetzung Ihres Führerscheins, einen Sehtest und eine Bescheinigung über einen Erste-Hilfe-Kurs.'
            },
            { speaker: 'Herr Horvat', text: 'Wo kann ich den Sehtest machen?' },
            {
              speaker: 'Mitarbeiterin',
              text: 'Bei jedem Optiker. Das kostet meistens nur wenige Euro. Den Rest erledigen wir dann hier bei uns.'
            }
          ],
          statement: {
            text: 'Herr Horvat darf noch vier Monate mit seinem Führerschein fahren.',
            answer: true
          },
          question: {
            frage: 'Wo kann Herr Horvat den Sehtest machen?',
            options: ['Im Amt.', 'Beim Optiker.', 'Beim Hausarzt.'],
            answer: 1
          }
        }
      ]
    },
    teil4: {
      anweisung:
        'Sie hören im Radio eine Diskussion. Drei Personen äußern ihre Meinung zum Thema. Zu den Aussagen gibt es sechs Sätze (a–f). Welcher Satz passt zu welcher Person? Zu dem Beispiel gehört schon ein Satz. Zwei Sätze passen nicht.',
      thema: 'Behördengänge: Was hilft beim Papierkram?',
      sentences: [
        'Eine Begleitung, die gut Deutsch spricht, macht den Behördengang leichter.',
        'Wer alle Unterlagen vorher kopiert und mitbringt, spart Zeit.',
        'Anträge im Internet sind besser als ein Besuch im Amt.',
        'Briefe von Behörden sind zu schwer zu verstehen.',
        'Beratungsstellen erklären Formulare besser als die Ämter selbst.',
        'Man sollte früh am Morgen zum Amt gehen, um lange Wartezeiten zu vermeiden.'
      ],
      beispiel: {
        audio:
          'Ich lese die Briefe vom Amt oft dreimal und verstehe trotzdem nur die Hälfte. Da stehen Wörter wie „Bescheid“ oder „Widerspruch“, die kaum jemand kennt. Die Sätze sind lang und kompliziert. Warum können die Behörden nicht einfacher schreiben?',
        answer: 3
      },
      aussagen: [
        {
          audio:
            'Früher habe ich stundenlang im Wartezimmer gesessen. Heute mache ich fast alles am Computer: die Ummeldung, den Kindergeldantrag, sogar die Terminbuchung. Ich muss nicht mehr durch die halbe Stadt fahren, und ich kann abends zu Hause in Ruhe ausfüllen, was ich brauche. Ins Amt gehe ich nur noch, wenn es gar nicht anders geht.',
          answer: 2
        },
        {
          audio:
            'Mein Deutsch ist inzwischen ziemlich gut, aber bei den Ämtern verstehe ich trotzdem vieles nicht. Deshalb nehme ich immer meine Nachbarin mit. Sie ist in Deutschland aufgewachsen und kennt die Wörter. Wenn ich etwas nicht verstehe, fragt sie sofort nach. Allein würde ich mich dort nicht wohlfühlen.',
          answer: 0
        },
        {
          audio:
            'Ich gehe zur Migrationsberatung in unserem Stadtteil. Die Beraterin nimmt sich eine Stunde Zeit und erklärt mir jeden Brief und jedes Formular in Ruhe. Im Amt haben die Mitarbeiter dafür keine Zeit, da stehen schon die nächsten Leute vor der Tür. Bei der Beratung kann ich so oft fragen, wie ich will.',
          answer: 4
        }
      ]
    }
  },

  lesen: {
    teil1: {
      anweisung:
        'Lesen Sie das Verzeichnis und die Aufgaben 21–25. Wohin gehen Sie? Welche Lösung (a, b oder c) passt am besten?',
      titel: 'Behördenhaus Lindenallee – Wegweiser',
      verzeichnis:
        'Erdgeschoss\nEmpfang und Information · Kasse (Gebühren bezahlen) · Fundbüro\n\n1. Stock\nEinwohnermeldeamt (Anmeldung, Abmeldung, Ummeldung) · Passamt (Reisepass, Personalausweis) · Standesamt (Geburtsurkunden, Eheschließung)\n\n2. Stock\nKfz-Zulassungsstelle (Autos anmelden) · Führerscheinstelle · Ordnungsamt (Hundesteuer, Parkausweise)\n\n3. Stock\nSozialamt (Grundsicherung) · Wohngeldstelle (Mietzuschuss) · Jugendamt (Kita-Plätze, Elterngeld)\n\n4. Stock\nBauamt · Umweltamt · Sitzungssaal',
      questions: [
        {
          frage: 'Sie sind umgezogen und möchten Ihre neue Adresse melden.',
          options: [
            'Erdgeschoss: Empfang und Information',
            '1. Stock: Einwohnermeldeamt',
            'Ein anderes Stockwerk'
          ],
          answer: 1
        },
        {
          frage: 'Sie haben Ihren Personalausweis verloren und brauchen einen neuen.',
          options: ['Erdgeschoss: Fundbüro', '1. Stock: Passamt', '2. Stock: Ordnungsamt'],
          answer: 1
        },
        {
          frage: 'Sie haben ein gebrauchtes Auto gekauft und möchten es anmelden.',
          options: ['1. Stock: Standesamt', '2. Stock: Führerscheinstelle', '2. Stock: Kfz-Zulassungsstelle'],
          answer: 2
        },
        {
          frage: 'Sie verdienen wenig und möchten Hilfe bei der Miete beantragen.',
          options: ['3. Stock: Jugendamt', '3. Stock: Wohngeldstelle', 'Ein anderes Stockwerk'],
          answer: 1
        },
        {
          frage: 'Sie suchen einen Platz in der Kita für Ihre Tochter.',
          options: ['1. Stock: Standesamt', '2. Stock: Ordnungsamt', 'Ein anderes Stockwerk'],
          answer: 2
        }
      ]
    },
    teil2: {
      anweisung:
        'Lesen Sie die Situationen 26–30 und die Anzeigen a–h. Welche Anzeige passt zu welcher Situation? Für eine Situation gibt es keine passende Anzeige. Dann schreiben Sie X.',
      situations: [
        'Sie arbeiten tagsüber und möchten abends Deutsch lernen.',
        'Sie haben einen Brief vom Jobcenter bekommen, den Sie nicht verstehen. Sie möchten mit jemandem darüber sprechen und dafür nichts bezahlen.',
        'Sie sind Krankenpfleger und möchten Ihren ausländischen Abschluss in Deutschland anerkennen lassen.',
        'Sie brauchen für eine Bewerbung ein professionelles Foto.',
        'Sie brauchen eine beglaubigte Übersetzung Ihrer Heiratsurkunde aus dem Arabischen ins Deutsche.'
      ],
      ads: [
        'Handwerkskammer Rheinfeld: Anerkennungsberatung für Handwerksberufe, zum Beispiel Elektriker, Tischler und Maler. Beratung nur nach Terminvereinbarung, kostenlos. Telefon: 03 51 / 44 88 10.',
        'Sprachschule Lingua: Deutsch intensiv, Niveau B1. Montag bis Freitag, 9–13 Uhr. Kleine Gruppen, Kursbeginn jeden Monat. Kosten: 280 Euro pro Monat.',
        'Caritas Migrationsberatung: Wir helfen bei Briefen von Ämtern, bei Anträgen und Formularen. Kostenlos und vertraulich. Montag bis Donnerstag, 9–12 Uhr, auch ohne Termin. Bahnhofstraße 21.',
        'Foto-Studio Blitz: Bewerbungsfotos, Passfotos und Familienbilder. Bewerbungsfoto mit zwei Bildern ab 24 Euro. Ohne Termin, Di–Sa 10–18 Uhr, Marktgasse 5.',
        'Volkshochschule Südstadt: Deutsch B1 am Abend. Montag und Mittwoch, 18:30–21:00 Uhr. Kursstart am 3. November. Anmeldung im Sekretariat oder online.',
        'Rechtsanwältin Dr. Brandt: Aufenthaltsrecht und Arbeitsrecht. Erstberatung 60 Euro. Bitte vereinbaren Sie telefonisch einen Termin.',
        'Übersetzungsbüro Weber: Beglaubigte Übersetzungen von Urkunden und Zeugnissen aus dem Englischen, Französischen, Spanischen und Italienischen ins Deutsche. Schnell und günstig.',
        'Anerkennung im Gesundheitswesen: Beratung für Ärzte, Krankenpfleger und Physiotherapeuten mit ausländischem Abschluss. Wir prüfen Ihre Unterlagen und helfen beim Antrag. Dienstag und Donnerstag, 10–16 Uhr.'
      ],
      answers: [4, 2, 7, 3, -1]
    },
    teil3: {
      anweisung:
        'Lesen Sie die Texte und die Aufgaben. Ist die Aussage richtig oder falsch? Welche Lösung (a, b oder c) passt am besten?',
      texts: [
        {
          titel: 'Neues Willkommenszentrum in Neuburg',
          text: 'Die Stadt Neuburg hat im ehemaligen Postgebäude ein Willkommenszentrum eröffnet. Dort bekommen Neuzugezogene Auskunft zu Wohnungssuche, Arbeit und Sprachkursen. Die Mitarbeiterinnen und Mitarbeiter sprechen unter anderem Arabisch, Ukrainisch, Türkisch und Englisch. Das Zentrum ist dienstags und donnerstags von 10 bis 17 Uhr geöffnet. Die Beratung ist kostenlos, ein Termin ist nicht nötig. „Wir wollen, dass sich neue Nachbarn von Anfang an willkommen fühlen“, sagte die Bürgermeisterin bei der Eröffnung. Bezahlt wird das Projekt vom Land.',
          statement: {
            text: 'Für die Beratung im Willkommenszentrum braucht man einen Termin.',
            answer: false
          },
          question: {
            frage: 'Was bietet das Willkommenszentrum an?',
            options: [
              'Beratung in mehreren Sprachen.',
              'Wohnungen für Neuzugezogene.',
              'Deutschkurse am Dienstag und Donnerstag.'
            ],
            answer: 0
          }
        },
        {
          titel: 'E-Mail der Ausländerbehörde',
          text: 'Sehr geehrter Herr Nowak,\n\nvielen Dank für Ihren Antrag auf Verlängerung Ihrer Aufenthaltserlaubnis. Ihren Pass haben wir bereits geprüft. Zur weiteren Bearbeitung benötigen wir noch Ihre Gehaltsabrechnungen der letzten drei Monate und eine Kopie Ihres Mietvertrags. Bitte reichen Sie die Unterlagen bis zum 15. November im Online-Portal oder in Zimmer 214 ein. Wenn die Unterlagen nicht rechtzeitig bei uns eingehen, können wir Ihren Antrag nicht bearbeiten. Ihre jetzige Aufenthaltserlaubnis gilt noch bis zum 30. November.\n\nMit freundlichen Grüßen\nA. Schäfer\nAusländerbehörde Rheinfeld',
          statement: {
            text: 'Herr Nowak soll die fehlenden Unterlagen bis zum 30. November abgeben.',
            answer: false
          },
          question: {
            frage: 'Was passiert, wenn die Unterlagen zu spät kommen?',
            options: [
              'Der Antrag wird nicht bearbeitet.',
              'Herr Nowak muss eine Strafe zahlen.',
              'Die Aufenthaltserlaubnis wird sofort verlängert.'
            ],
            answer: 0
          }
        },
        {
          titel: 'Elternbrief der Grundschule Am Park',
          text: 'Liebe Eltern,\n\nbevor Ihr Kind im September eingeschult wird, untersucht das Gesundheitsamt alle Schulanfänger. Den Termin für Ihr Kind finden Sie im beiliegenden Brief. Bitte bringen Sie zu der Untersuchung den Impfausweis und das gelbe Vorsorgeheft mit. Falls Sie den Termin nicht wahrnehmen können, sagen Sie bitte spätestens drei Tage vorher im Sekretariat Bescheid, damit wir den Termin an ein anderes Kind vergeben können. Der erste Schultag ist der 9. September. Wir freuen uns auf Ihre Kinder!\n\nMit freundlichen Grüßen\nSchulleitung',
          statement: { text: 'Die Eltern müssen zur Untersuchung den Impfausweis mitbringen.', answer: true },
          question: {
            frage: 'Was sollen Eltern tun, wenn der Termin nicht passt?',
            options: [
              'Sie müssen nichts tun.',
              'Sie sollen mindestens drei Tage vorher im Sekretariat Bescheid sagen.',
              'Sie sollen am ersten Schultag mit der Lehrerin sprechen.'
            ],
            answer: 1
          }
        }
      ]
    },
    teil4: {
      anweisung: 'Lesen Sie den Text und die Aufgaben 37–39. Ist die Aussage richtig oder falsch?',
      titel: 'Wohnsitz anmelden – das müssen Sie wissen',
      text: 'Wer in Deutschland in eine neue Wohnung zieht, muss sich beim Einwohnermeldeamt anmelden.\n\nFrist\nDie Anmeldung muss spätestens zwei Wochen nach dem Einzug erfolgen. Wer sie vergisst, muss mit einem Bußgeld rechnen.\n\nUnterlagen\nSie brauchen Ihren Pass oder Personalausweis, das ausgefüllte Anmeldeformular und die Wohnungsgeberbestätigung. Diese Bestätigung bekommen Sie von Ihrem Vermieter. Familien melden alle Familienmitglieder gemeinsam an und bringen dafür auch die Geburtsurkunden der Kinder mit.\n\nKosten\nDie Anmeldung ist kostenlos. Für eine Meldebescheinigung, zum Beispiel für die Bank oder den Arbeitgeber, zahlen Sie in manchen Städten eine kleine Gebühr.\n\nUmzug in eine andere Stadt\nWenn Sie in eine andere deutsche Stadt ziehen, melden Sie sich nur an Ihrem neuen Wohnort an. Die Abmeldung am alten Wohnort übernimmt das Amt automatisch. Nur wer ins Ausland zieht, muss sich selbst abmelden.',
      statements: [
        { text: 'Man muss sich spätestens zwei Wochen nach dem Einzug anmelden.', answer: true },
        { text: 'Für die Anmeldung selbst muss man 10 Euro bezahlen.', answer: false },
        {
          text: 'Wer in eine andere deutsche Stadt zieht, muss sich am alten Wohnort selbst abmelden.',
          answer: false
        }
      ]
    },
    teil5: {
      anweisung: 'Lesen Sie den Brief. Welches Wort passt in die Lücke? Kreuzen Sie an: a, b oder c.',
      text: 'Sehr geehrte Frau Berger,\n\nvielen Dank für Ihren Brief vom 3. Oktober. Ich [1] gern zu dem Gespräch kommen, aber leider habe ich an [2] Tag einen Arzttermin mit meiner Tochter. Könnten wir das Gespräch [3] Mittwoch verschieben? Ich habe zwei Kinder, [4] ich nach der Schule abholen muss. Der Mittwochvormittag passt mir sehr gut, [5] ich an diesem Tag erst um 14 Uhr arbeiten muss. Ich habe Ihnen letzte Woche schon eine E-Mail [6], aber leider keine Antwort bekommen. Bitte rufen Sie mich an, wenn der neue Termin möglich ist.\n\nMit freundlichen Grüßen\nSelma Aydin',
      gaps: [
        { options: ['würden', 'wurde', 'würde'], answer: 2 },
        { options: ['diesem', 'dieser', 'diesen'], answer: 0 },
        { options: ['zu', 'auf', 'bei'], answer: 1 },
        { options: ['die', 'denen', 'deren'], answer: 0 },
        { options: ['denn', 'deshalb', 'weil'], answer: 2 },
        { options: ['geschickt', 'schicken', 'schickt'], answer: 0 }
      ]
    }
  },

  schreiben: {
    anweisung:
      'Wählen Sie Aufgabe A oder Aufgabe B. Zeigen Sie, was Sie können. Schreiben Sie möglichst viel. Vergessen Sie nicht die Anrede und den Gruß.',
    tasks: [
      {
        titel: 'Aufgabe A: Termin im Bürgeramt',
        situation:
          'Sie haben einen Termin im Bürgeramt, um sich umzumelden. Sie können an diesem Tag aber nicht kommen. Schreiben Sie eine E-Mail an das Bürgeramt.',
        leitpunkte: [
          'Entschuldigen Sie sich und erklären Sie, warum Sie nicht kommen können.',
          'Schlagen Sie einen neuen Termin vor (Wochentag und Uhrzeit).',
          'Fragen Sie, welche Unterlagen Sie mitbringen müssen.',
          'Bitten Sie um eine Bestätigung per E-Mail.'
        ],
        musterloesung:
          'Sehr geehrte Damen und Herren,\n\nich habe am Dienstag, dem 12. November, um 10 Uhr einen Termin bei Ihnen, um mich umzumelden. Leider kann ich an diesem Tag nicht kommen, weil ich dringend zu einem Arzttermin mit meiner kranken Tochter muss. Bitte entschuldigen Sie die Umstände.\n\nKönnte ich stattdessen am Donnerstag in derselben Woche kommen, am besten am Vormittag gegen 9 Uhr? Wenn das nicht möglich ist, passt mir auch der folgende Montag.\n\nAußerdem möchte ich gern wissen, welche Unterlagen ich zur Ummeldung mitbringen muss. Reicht mein Mietvertrag, oder brauche ich eine Bestätigung von meinem Vermieter?\n\nIch freue mich über eine kurze Bestätigung des neuen Termins per E-Mail.\n\nMit freundlichen Grüßen\nIvan Petrov'
      },
      {
        titel: 'Aufgabe B: Krank im Integrationskurs',
        situation:
          'Sie waren zwei Tage krank und konnten nicht in den Integrationskurs gehen. Schreiben Sie eine E-Mail an Ihre Kursleiterin, Frau Meier.',
        leitpunkte: [
          'Entschuldigen Sie sich und erklären Sie, warum Sie gefehlt haben.',
          'Fragen Sie nach den Hausaufgaben und dem Stoff der beiden Tage.',
          'Schlagen Sie vor, wie Sie den Stoff nachholen können.',
          'Sagen Sie, ob Sie am Freitag zum Test kommen können.'
        ],
        musterloesung:
          'Liebe Frau Meier,\n\nleider konnte ich am Montag und am Dienstag nicht zum Kurs kommen, weil ich eine starke Grippe hatte. Mein Arzt hat mir eine Krankschreibung gegeben, die ich Ihnen am Mittwoch zeigen werde. Es tut mir sehr leid, dass ich gefehlt habe.\n\nKönnten Sie mir bitte sagen, welche Hausaufgaben wir bekommen haben und welches Thema Sie in den beiden Stunden behandelt haben? Ich würde gern alles nachholen. Vielleicht kann mir eine Mitschülerin ihre Notizen schicken, oder ich kann nach dem Unterricht zu Ihnen kommen, um offene Fragen zu klären.\n\nAm Freitag möchte ich sehr gern am Test teilnehmen. Ich fühle mich schon viel besser und lerne jeden Abend.\n\nViele Grüße\nAmina Hassan'
      }
    ],
    tipps:
      'Cover all four Leitpunkte, each with its own paragraph or at least two sentences. Open with a correct Anrede (Sehr geehrte Damen und Herren / Liebe Frau Meier) and close with a Gruß. Use connectors such as weil, deshalb and außerdem, and polite forms like "Könnten Sie ...?" or "Ich würde gern ...".'
  },

  sprechen: {
    teil1: {
      anweisung:
        'Stellen Sie sich Ihrem Gesprächspartner vor. Sprechen Sie über Ihren Namen, Ihren Geburtsort, Ihren Wohnort, Ihre Arbeit oder Ihren Beruf, Ihre Familie und Ihre Sprachen. Danach stellt die Prüferin Ihnen noch einige Fragen.',
      nachfragen: [
        'Seit wann leben Sie in Deutschland?',
        'Was gefällt Ihnen an Ihrer Stadt besonders gut?',
        'Welche Sprachen haben Sie schon gelernt, und wo haben Sie Deutsch gelernt?',
        'Was haben Sie in Ihrem Heimatland beruflich gemacht?',
        'Was war in Deutschland am Anfang für Sie am schwierigsten?'
      ],
      redemittel: [
        'Ich heiße ... und komme aus ...',
        'Ich bin in ... geboren und wohne jetzt in ...',
        'Ich lebe seit ... in Deutschland.',
        'Ich arbeite als ... / Ich suche zurzeit Arbeit als ...',
        'Ich bin verheiratet und habe ... Kinder.',
        'Meine Muttersprache ist ..., außerdem spreche ich ...'
      ]
    },
    teil2: {
      anweisung:
        'Beschreiben Sie Ihr Foto: Was sehen Sie? Was für eine Situation ist das? Danach stellt die Prüferin Ihnen Fragen zu Ihren eigenen Erfahrungen.',
      bilder: [
        {
          beschreibung:
            'Auf dem Foto sieht man einen Wartebereich in einem Amt. Mehrere Menschen sitzen auf Stühlen und halten Nummern und Formulare in den Händen. An der Wand hängt eine Anzeigetafel mit Zahlen.',
          fragenA2: [
            'Waren Sie schon einmal in einem Amt? Wann und warum?',
            'Wie lange mussten Sie dort warten?',
            'Wer hat Ihnen beim Ausfüllen der Formulare geholfen?'
          ],
          fragenB1: [
            'Was war bei Ihrem letzten Behördengang einfach, und was war schwierig?',
            'Was würden Sie an den Ämtern in Deutschland verbessern?',
            'Wie ist das in Ihrem Heimatland: Gehen die Menschen auch persönlich zum Amt?'
          ]
        },
        {
          beschreibung:
            'Auf dem Foto sieht man einen Klassenraum mit einer Gruppe Erwachsener. Eine Lehrerin steht an der Tafel und erklärt etwas. Die Teilnehmenden sitzen an Tischen und schreiben in ihre Hefte.',
          fragenA2: [
            'Haben Sie schon einen Deutschkurs besucht? Wo?',
            'Wie gefällt Ihnen das Lernen in der Gruppe?',
            'Was machen Sie nach dem Unterricht, um Deutsch zu üben?'
          ],
          fragenB1: [
            'Was hat Ihnen im Deutschkurs am meisten geholfen?',
            'Welche Vor- und Nachteile hat ein Kurs im Vergleich zum Lernen allein?',
            'Wo möchten Sie in Zukunft noch besser Deutsch können, und warum?'
          ]
        }
      ],
      redemittel: [
        'Auf dem Foto sieht man ...',
        'Das Bild zeigt eine Situation in ...',
        'Ich glaube, die Personen ...',
        'Ich habe auch schon einmal ... erlebt.',
        'Bei mir war das so: ...',
        'Meiner Meinung nach ...'
      ]
    },
    teil3: {
      situation:
        'Ein Freund von Ihnen ist vor Kurzem in Ihre Stadt gezogen. Er spricht noch nicht gut Deutsch und muss einige Behördengänge erledigen. Sie möchten ihm helfen.',
      aufgabe:
        'Planen Sie gemeinsam mit Ihrem Gesprächspartner einen Tag, an dem Sie Ihrem Freund bei den Behördengängen helfen. Sprechen Sie über die Notizen und machen Sie Vorschläge.',
      notizen: [
        'Welche Ämter?',
        'Wann und wie lange?',
        'Wie kommen wir hin?',
        'Welche Unterlagen?',
        'Was machen wir danach?',
        '…?'
      ],
      redemittel: [
        'Wie wäre es, wenn wir ...?',
        'Ich schlage vor, dass wir ...',
        'Das ist eine gute Idee. Außerdem könnten wir ...',
        'Das finde ich nicht so gut, weil ...',
        'Einverstanden, dann machen wir es so.',
        'Wer kümmert sich um ...?'
      ]
    }
  }
} as const satisfies DtzExam;

export default exam;
