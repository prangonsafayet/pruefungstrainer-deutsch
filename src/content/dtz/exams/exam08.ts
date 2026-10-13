import { type DtzExam } from '@shared/types/dtzExam.ts';

const exam = {
  id: 8,
  title: 'Modelltest 8',
  theme: 'Freizeit, Vereine & Feste',

  hoeren: {
    teil1: {
      anweisung:
        'Sie hören vier Ansagen. Zu jeder Ansage gibt es eine Aufgabe. Welche Lösung (a, b oder c) passt am besten?',
      items: [
        {
          audio:
            'Guten Tag, hier ist der Turnverein Grünau. Unsere Geschäftsstelle ist heute leider geschlossen. Das Training der Kinder-Fußballgruppe findet am Mittwoch nicht in der Halle statt, sondern auf dem Sportplatz. Bitte denken Sie an Sportschuhe für draußen. Fragen zur Mitgliedschaft beantworten wir ab Montag wieder, jeweils von zehn bis zwölf Uhr.',
          frage: 'Wo findet das Training der Kinder am Mittwoch statt?',
          options: ['Auf dem Sportplatz.', 'In der Halle.', 'In der Geschäftsstelle.'],
          answer: 0
        },
        {
          audio:
            'Liebe Badegäste, das Sportbecken wird in zehn Minuten für einen Schwimmkurs mit Kindern gesperrt. Sie können in dieser Zeit gern das Nichtschwimmerbecken benutzen. Wir weisen darauf hin: Das Schwimmbad schließt heute um zwanzig Uhr, die Kasse schon um neunzehn Uhr. Wir wünschen Ihnen noch einen schönen Aufenthalt.',
          frage: 'Wann schließt das Schwimmbad heute?',
          options: ['Um 19 Uhr.', 'Um 20 Uhr.', 'Um 22 Uhr.'],
          answer: 1
        },
        {
          audio:
            'Willkommen beim Kino Odeon. Heute Abend um zwanzig Uhr fünfzehn zeigen wir die Komödie „Das Sommerfest“. Eine Eintrittskarte kostet normalerweise neun Euro, mit Ermäßigung sieben Euro. Und vergessen Sie nicht: Mittwoch ist Kinotag, dann zahlen alle nur sechs Euro. Karten können Sie unter der Nummer null fünf fünf zwei eins, vier vier acht eins reservieren.',
          frage: 'Was kostet eine Kinokarte am Mittwoch?',
          options: ['Sechs Euro.', 'Sieben Euro.', 'Neun Euro.'],
          answer: 0
        },
        {
          audio:
            'Achtung, eine Durchsage der Festleitung. Der Festumzug beginnt heute nicht um vierzehn Uhr, sondern erst um fünfzehn Uhr, weil die Musikkapelle aus Berghausen im Stau steht. Alle Kinder, die am Umzug teilnehmen, treffen sich um vierzehn Uhr dreißig am Rathausplatz. Der Kinderchor singt bis dahin im Festzelt.',
          frage: 'Warum beginnt der Festumzug später?',
          options: [
            'Weil die Musikkapelle im Stau steht.',
            'Wegen des Regens.',
            'Weil die Straßen noch gesperrt sind.'
          ],
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
            'Das Wetter für das Wochenende. Am Samstag scheint zunächst die Sonne, am Abend kommt ein Gewitter. Der Sonntag wird kühl und regnerisch, es hat nur vierzehn Grad. Wer ein Grillfest plant, sollte es also auf den Samstagnachmittag legen.',
          frage: 'Wann ist das Wetter für ein Grillfest am besten?',
          options: ['Am Samstagnachmittag.', 'Am Samstagabend.', 'Am Sonntag.'],
          answer: 0
        },
        {
          audio:
            'Und jetzt noch ein Hinweis für Autofahrer. Wegen des Stadtlaufs am Sonntag sind alle Straßen in der Innenstadt von acht bis vierzehn Uhr gesperrt. Parken Sie am besten am Stadion. Von dort fährt ein kostenloser Bus ins Zentrum.',
          frage: 'Wo sollen Autofahrer am Sonntag parken?',
          options: ['Am Stadion.', 'In der Innenstadt.', 'Am Rathaus.'],
          answer: 0
        },
        {
          audio:
            'Unser Tipp für Sonntag: das Sommerfest im Stadtpark. Von elf bis achtzehn Uhr gibt es Live-Musik, und für die Kinder gibt es einen Zauberer und eine Hüpfburg. Der Eintritt ist frei. Wer mit dem Fahrrad kommt, bekommt am Eingang ein Getränk gratis.',
          frage: 'Was bekommen Besucher, die mit dem Fahrrad kommen?',
          options: ['Eine Eintrittskarte.', 'Ein Eis.', 'Ein Getränk.'],
          answer: 2
        },
        {
          audio:
            'Heute bei Radio Waldheim: Um neunzehn Uhr hören Sie das Vereinsmagazin. Diesmal stellen wir den Schachclub Springer vor, der in diesem Jahr hundert Jahre alt wird. Um einundzwanzig Uhr senden wir Ausschnitte vom Folkfestival am Samstag.',
          frage: 'Was ist das Thema der Sendung um 19 Uhr?',
          options: ['Ein Schachclub.', 'Ein Chor.', 'Ein Folkfestival.'],
          answer: 0
        },
        {
          audio:
            'Sport macht Spaß, aber nicht ohne Aufwärmen. Viele Verletzungen beim Freizeitsport passieren, weil die Muskeln nicht warm sind. Wärmen Sie sich fünf bis zehn Minuten leicht auf und trinken Sie genug Wasser. Und wenn Sie nach langer Pause wieder anfangen, gehen Sie vorher zum Arzt.',
          frage: 'Was sollte man tun, wenn man nach langer Pause wieder Sport machen möchte?',
          options: ['Sofort sehr hart trainieren.', 'Nur am Morgen trainieren.', 'Vorher zum Arzt gehen.'],
          answer: 2
        }
      ]
    },
    teil3: {
      anweisung:
        'Sie hören vier Gespräche. Zu jedem Gespräch gibt es zwei Aufgaben. Entscheiden Sie bei der ersten Aufgabe, ob die Aussage richtig oder falsch ist. Welche Lösung (a, b oder c) passt bei der zweiten Aufgabe am besten?',
      gespraeche: [
        {
          audio: [
            { speaker: 'Mia', text: 'Lena, du singst doch in einem Chor. Kann man da einfach mitmachen?' },
            {
              speaker: 'Lena',
              text: 'Klar! Wir proben jeden Donnerstag um halb acht im Gemeindehaus. Früher war es dienstags, aber das haben wir geändert.'
            },
            { speaker: 'Mia', text: 'Und was kostet das? Ich habe nicht viel Geld.' },
            {
              speaker: 'Lena',
              text: 'Der Mitgliedsbeitrag ist nur fünf Euro im Monat. Und die erste Probe ist kostenlos, da kannst du in Ruhe schauen, ob es dir gefällt.'
            },
            { speaker: 'Mia', text: 'Das klingt gut. Dann komme ich nächste Woche mit.' }
          ],
          statement: { text: 'Die erste Chorprobe kostet nichts.', answer: true },
          question: {
            frage: 'Wann probt der Chor?',
            options: ['Dienstags um 19.30 Uhr.', 'Donnerstags um 18.30 Uhr.', 'Donnerstags um 19.30 Uhr.'],
            answer: 2
          }
        },
        {
          audio: [
            {
              speaker: 'Herr Petrov',
              text: 'Frau Brandt, wir müssen noch das Sommerfest vom Verein besprechen. Wer bringt was mit?'
            },
            {
              speaker: 'Frau Brandt',
              text: 'Ich backe zwei Kuchen. Salat bringt Frau Weber mit, das hat sie mir schon versprochen.'
            },
            {
              speaker: 'Herr Petrov',
              text: 'Gut. Ich kümmere mich um die Getränke. Mein Schwager hat einen Getränkehandel und gibt uns einen guten Preis.'
            },
            { speaker: 'Frau Brandt', text: 'Wunderbar. Und wer macht die Musik?' },
            { speaker: 'Herr Petrov', text: 'Das macht Jonas mit seiner Anlage. Er hat gestern zugesagt.' }
          ],
          statement: { text: 'Frau Brandt bringt einen Salat zum Fest mit.', answer: false },
          question: {
            frage: 'Was bringt Herr Petrov zum Fest mit?',
            options: ['Getränke.', 'Kuchen.', 'Salat.'],
            answer: 0
          }
        },
        {
          audio: [
            {
              speaker: 'Vater',
              text: 'Guten Tag. Ich möchte meinen Sohn im Fußballverein anmelden. Er ist acht Jahre alt.'
            },
            {
              speaker: 'Mitarbeiterin',
              text: 'Sehr gern. Zuerst füllen Sie bitte dieses Anmeldeformular aus. Der Beitrag für Kinder beträgt hundertzwanzig Euro im Jahr. Das Trikot kostet extra, fünfundzwanzig Euro, aber das müssen Sie nicht sofort kaufen.'
            },
            { speaker: 'Vater', text: 'Braucht mein Sohn ein Attest vom Arzt?' },
            {
              speaker: 'Mitarbeiterin',
              text: 'Nein, ein Attest ist nicht nötig. Er kann am Dienstag zu einem Probetraining kommen, dann sehen wir, in welche Gruppe er passt.'
            }
          ],
          statement: { text: 'Der Vater muss ein Attest vom Arzt mitbringen.', answer: false },
          question: {
            frage: 'Was kostet die Mitgliedschaft im Fußballverein?',
            options: ['Zehn Euro im Jahr.', 'Fünfundzwanzig Euro im Jahr.', 'Hundertzwanzig Euro im Jahr.'],
            answer: 2
          }
        },
        {
          audio: [
            {
              speaker: 'Frau Kaya',
              text: 'Guten Abend, Herr Weber. Ich wollte Ihnen etwas sagen. Am Samstag feiern wir im Hof meinen Geburtstag. Sie sind herzlich eingeladen!'
            },
            {
              speaker: 'Herr Weber',
              text: 'Oh, danke schön. Ich komme gern kurz vorbei. Wird es denn laut? Ab zweiundzwanzig Uhr ist ja Nachtruhe.'
            },
            {
              speaker: 'Frau Kaya',
              text: 'Keine Sorge. Wir machen die Musik schon um halb zehn aus. Danach sitzen wir nur noch zusammen und reden.'
            },
            { speaker: 'Herr Weber', text: 'Das ist sehr rücksichtsvoll. Ich bringe einen Salat mit.' }
          ],
          statement: { text: 'Frau Kaya lädt ihren Nachbarn zur Geburtstagsfeier ein.', answer: true },
          question: {
            frage: 'Wann macht Frau Kaya am Samstag die Musik aus?',
            options: ['Um 21.30 Uhr.', 'Um 22 Uhr.', 'Um 23 Uhr.'],
            answer: 0
          }
        }
      ]
    },
    teil4: {
      anweisung:
        'Sie hören im Radio eine Diskussion zum Thema „Warum in einen Verein gehen?“. Sie hören zuerst ein Beispiel und dann drei Aussagen. Welcher Satz (a–f) passt zu welcher Aussage? Zwei Sätze bleiben übrig.',
      thema: 'Warum in einen Verein gehen?',
      sentences: [
        'Im Verein habe ich Freunde gefunden, als ich neu in der Stadt war.',
        'Ich habe keine Zeit für feste Termine und mache lieber allein Sport.',
        'Ein Verein ist zu teuer. Der Beitrag ist für mich ein Problem.',
        'Ich helfe gern ehrenamtlich, denn ich möchte etwas für andere tun.',
        'Beim Training lerne ich viel von den anderen und werde besser.',
        'Vereine sind altmodisch. Im Internet findet man schneller Leute mit denselben Hobbys.'
      ],
      beispiel: {
        audio:
          'Ich brauche keinen Verein. Wenn ich ein Hobby habe, suche ich im Internet. In Foren und Gruppen treffe ich Menschen mit den gleichen Interessen, und das geht viel schneller als mit Mitgliedsantrag und Versammlungen.',
        answer: 5
      },
      aussagen: [
        {
          audio:
            'Vor zwei Jahren bin ich aus Köln hierhergezogen und kannte niemanden. Ich bin dann in den Gartenverein eingetreten. Schon nach wenigen Wochen hatte ich Leute, mit denen ich mich treffen konnte, und heute sind einige davon meine besten Freunde.',
          answer: 0
        },
        {
          audio:
            'Ich trainiere seit zehn Jahren die Jugendmannschaft in unserem Handballverein. Dafür bekomme ich kein Geld, aber das ist mir egal. Es macht mir Freude zu sehen, wie die Kinder Fortschritte machen. Ohne Ehrenamtliche würde es so einen Verein gar nicht geben.',
          answer: 3
        },
        {
          audio:
            'Ich arbeite im Schichtdienst. Heute bin ich morgens im Dienst, nächste Woche nachts. Ich kann deshalb nie sicher sagen, ob ich am Dienstag Zeit habe. Darum jogge ich lieber allein, wann es mir passt. Ein Verein mit festen Trainingszeiten wäre für mich nichts.',
          answer: 1
        }
      ]
    }
  },

  lesen: {
    teil1: {
      anweisung:
        'Lesen Sie den Wegweiser und die Aufgaben 21 bis 25. Wohin gehen Sie? Welche Lösung (a, b oder c) passt am besten?',
      titel: 'Haus der Vereine Waldheim – Wegweiser',
      verzeichnis:
        'Erdgeschoss\nInformation · Café Treffpunkt · Veranstaltungssaal (Konzerte, Theater) · Garderobe\n\n1. Obergeschoss\nMusikschule (Instrumentalunterricht) · Chor „Waldheimer Stimmen“ · Fotoclub (mit Dunkelkammer)\n\n2. Obergeschoss\nSeniorentreff · Schachclub Springer · Bastelwerkstatt für Kinder\n\n3. Obergeschoss\nTurnverein (Geschäftsstelle) · Tanzstudio (Yoga, Zumba) · Kleiner Saal (für Privatfeiern zu mieten)',
      questions: [
        {
          frage: 'Sie möchten Gitarrenunterricht nehmen.',
          options: ['Erdgeschoss', '1. Obergeschoss', '2. Obergeschoss'],
          answer: 1
        },
        {
          frage: 'Ihr Vater (72) möchte andere Menschen zum Kartenspielen treffen.',
          options: ['1. Obergeschoss', '2. Obergeschoss', '3. Obergeschoss'],
          answer: 1
        },
        {
          frage: 'Sie möchten für Ihren Geburtstag einen Raum mieten.',
          options: ['Erdgeschoss', '2. Obergeschoss', '3. Obergeschoss'],
          answer: 2
        },
        {
          frage: 'Sie möchten Ihre Tochter beim Turnverein anmelden.',
          options: ['1. Obergeschoss', '2. Obergeschoss', 'Ein anderes Stockwerk'],
          answer: 2
        },
        {
          frage: 'Sie möchten lernen, Fotos in einer Dunkelkammer zu entwickeln.',
          options: ['1. Obergeschoss', '2. Obergeschoss', '3. Obergeschoss'],
          answer: 0
        }
      ]
    },
    teil2: {
      anweisung:
        'Lesen Sie die Situationen 26 bis 30 und die Anzeigen a bis h. Welche Anzeige passt zu welcher Situation? Zu einer Situation gibt es keine passende Anzeige. Markieren Sie in diesem Fall X.',
      situations: [
        'Ihre Mutter (68) geht gern ins Theater, hat aber nur eine kleine Rente. Sie suchen eine günstige Vorstellung am Nachmittag.',
        'Sie möchten in einem Verein regelmäßig Volleyball spielen.',
        'Sie möchten am Sonntag mit Ihren Kindern (4 und 7 Jahre) ein Fest besuchen, das für Kinder viel zu bieten hat.',
        'Ihr Sohn (11) möchte Gitarre lernen. Sie suchen einen Kurs für Kinder.',
        'Sie spielen gern Schach und suchen Mitspieler.'
      ],
      ads: [
        'Stadtteilfest im Eichenpark – Sonntag, 11 bis 18 Uhr. Hüpfburg, Kinderschminken, Live-Musik und Grillstand. Der Eintritt ist frei. Kommen Sie mit der ganzen Familie!',
        'Schachclub Springer Waldheim sucht Mitspieler! Wir treffen uns jeden Freitag um 19 Uhr im Haus der Vereine. Anfänger sind herzlich willkommen. Infos: www.schach-springer-waldheim.de',
        'Musikschule Harmonie: Gitarrenkurs für Kinder von 8 bis 13 Jahren. Kleine Gruppen, donnerstags um 16 Uhr. Die erste Probestunde ist kostenlos. Anmeldung: 05521 70815.',
        'Gitarrenunterricht für Erwachsene – Einzelstunden bei Musiklehrer Fischer, 30 Euro pro Stunde, auch abends. Telefon: 0152 3342211.',
        'Beachvolleyball-Turnier am Badesee: Samstag, 14. Juli. Teams mit vier Spielern, Startgebühr 20 Euro pro Team. Anmeldung bis 1. Juli online.',
        'TV Waldheim 1890: Handball, Basketball und Tischtennis für Kinder und Erwachsene. Schnuppertraining jederzeit möglich. Geschäftsstelle: Montag bis Donnerstag, 9 bis 12 Uhr.',
        'Stadttheater Waldheim: Seniorenmatinee! Jeden ersten Sonntag im Monat um 15 Uhr. Karten für alle ab 65 Jahren nur 5 Euro.',
        'Nachtflohmarkt auf dem Marktplatz – Samstag von 18 bis 23 Uhr. Standanmeldung 10 Euro. Antikes, Bücher, Kleidung, dazu Musik und Streetfood.'
      ],
      answers: [6, -1, 0, 2, 1]
    },
    teil3: {
      anweisung:
        'Lesen Sie die Texte und die Aufgaben. Entscheiden Sie bei der ersten Aufgabe, ob die Aussage richtig oder falsch ist. Welche Lösung (a, b oder c) passt bei der zweiten Aufgabe am besten?',
      texts: [
        {
          titel: 'Altstadtfest wächst weiter',
          text: 'Das Waldheimer Altstadtfest findet in diesem Jahr zum 40. Mal statt – und es wird größer als je zuvor. Von Freitag bis Sonntag erwarten die Veranstalter rund 30.000 Besucher. Neu ist eine zweite Bühne auf dem Kirchplatz, auf der Bands und Tanzgruppen aus der Region auftreten. Um den Müll zu reduzieren, gibt es an allen Ständen nur noch Mehrwegbecher. Für jeden Becher zahlen die Besucher einen Euro Pfand, den sie bei der Rückgabe zurückbekommen. Ab Freitag, 12 Uhr, sind die Straßen der Altstadt für Autos gesperrt. Anwohner erhalten für diese Zeit eine kostenlose Parkkarte für das Parkhaus am Bahnhof.',
          statement: { text: 'Die Besucher zahlen für die Becher ein Pfand.', answer: true },
          question: {
            frage: 'Warum gibt es nur noch Mehrwegbecher?',
            options: [
              'Einwegbecher sind teurer.',
              'Man möchte weniger Müll haben.',
              'Die Stände haben nicht genug Platz.'
            ],
            answer: 1
          }
        },
        {
          titel: 'Ihre Anmeldung zum Yogakurs',
          text: 'Sehr geehrte Frau Lindqvist,\n\nvielen Dank für Ihre Anmeldung zum Kurs „Yoga für Anfänger“. Der Kurs beginnt am 8. Oktober und findet zehnmal jeweils mittwochs um 18.30 Uhr im Tanzstudio des Hauses der Vereine statt. Die Kursgebühr beträgt 80 Euro. Bitte überweisen Sie diesen Betrag bis zum 1. Oktober auf das Konto des Vereins. Bringen Sie bitte bequeme Kleidung und eine Matte mit. Wenn Sie keine Matte besitzen, können Sie bei uns eine für 2 Euro pro Abend leihen. Falls Sie nicht teilnehmen können, sagen Sie bitte spätestens drei Tage vor Kursbeginn ab, sonst müssen wir die volle Gebühr berechnen.\n\nMit freundlichen Grüßen\nSabine Roth, Turnverein Waldheim',
          statement: { text: 'Frau Lindqvist muss eine eigene Matte mitbringen.', answer: false },
          question: {
            frage: 'Was muss Frau Lindqvist bis zum 1. Oktober tun?',
            options: ['Eine Matte kaufen.', 'Die Kursgebühr überweisen.', 'Den Kurs absagen.'],
            answer: 1
          }
        },
        {
          titel: 'Die Stadtbücherei in den Sommerferien',
          text: 'Liebe Leserinnen und Leser,\n\nvom 10. Juli bis zum 21. August sind Sommerferien. In dieser Zeit ist die Stadtbücherei nur dienstags und donnerstags von 10 bis 14 Uhr geöffnet. Alle Medien, die Sie vor den Ferien ausleihen, müssen Sie erst am 4. September zurückgeben. Außerdem können Sie Bücher und DVDs auch außerhalb der Öffnungszeiten in unseren Rückgabekasten am Eingang werfen. Für Kinder bieten wir jeden Donnerstag um 11 Uhr eine Vorlesestunde an. Wir wünschen Ihnen schöne Ferien und viel Lesespaß!\n\nIhr Team der Stadtbücherei',
          statement: {
            text: 'In den Ferien kann man Medien auch außerhalb der Öffnungszeiten zurückgeben.',
            answer: true
          },
          question: {
            frage: 'Bis wann müssen Medien, die man vor den Ferien ausgeliehen hat, zurückgegeben werden?',
            options: ['Bis zum 10. Juli.', 'Bis zum 21. August.', 'Bis zum 4. September.'],
            answer: 2
          }
        }
      ]
    },
    teil4: {
      anweisung: 'Lesen Sie den Text und die Aufgaben 37 bis 39. Ist die Aussage richtig oder falsch?',
      titel: 'Vereine und Ehrenamt in Waldheim – Informationen für neue Einwohner',
      text: 'Was ist ein Verein?\nIn Deutschland gibt es mehr als 600.000 Vereine. Menschen mit gleichen Interessen treffen sich dort regelmäßig, zum Beispiel zum Sport, zum Singen oder zum Gärtnern. In Waldheim gibt es über 120 Vereine.\n\nWie werde ich Mitglied?\nJeder darf Mitglied werden, die Staatsangehörigkeit spielt keine Rolle. Sie füllen einen Antrag aus und zahlen einen Mitgliedsbeitrag. Viele Vereine bieten vorher ein kostenloses Probetraining oder zwei Schnupperstunden an. So können Sie in Ruhe prüfen, ob der Verein zu Ihnen passt.\n\nWas kostet das?\nDie Beiträge sind sehr unterschiedlich. Ein Gartenverein verlangt oft nur wenige Euro im Monat, ein Tennisclub deutlich mehr. Familien mit wenig Einkommen können bei der Stadt einen Zuschuss zum Vereinsbeitrag ihrer Kinder beantragen. Informationen dazu gibt es im Rathaus.\n\nMithelfen\nViele Vereine suchen Menschen, die ehrenamtlich helfen, etwa als Trainer, bei Festen oder im Vorstand. Das ist freiwillig und wird meist nicht bezahlt.',
      statements: [
        { text: 'Nur Menschen mit deutscher Staatsangehörigkeit dürfen Mitglied werden.', answer: false },
        { text: 'Vor dem Eintritt kann man bei vielen Vereinen kostenlos mitmachen.', answer: true },
        {
          text: 'Familien mit wenig Geld können Hilfe beim Vereinsbeitrag ihrer Kinder bekommen.',
          answer: true
        }
      ]
    },
    teil5: {
      anweisung:
        'Lesen Sie den Brief. Welches Wort passt in welche Lücke (1–6)? Welche Lösung (a, b oder c) passt am besten?',
      text: 'Sehr geehrte Frau Winter,\n\nim Namen des Chors „Waldheimer Stimmen“ danke ich Ihnen herzlich [1] die Einladung zum Straßenfest. [2] das Wetter nicht gut war, sind viele Besucher gekommen, und wir haben viel Applaus bekommen. Nach dem Auftritt haben sich unsere Sängerinnen und Sänger besonders [3] das leckere Essen gefreut, das Sie uns serviert haben. Leider konnten wir nicht bis zum Ende bleiben, [4] der Bus nach Hause schon um 21 Uhr abfuhr. Wir haben auch ein Gruppenfoto gemacht und würden es Ihnen gern [5]. Bitte grüßen Sie [6] Kolleginnen und Kollegen vom Organisationsteam von uns. Im nächsten Jahr sind wir sehr gern wieder dabei.\n\nMit freundlichen Grüßen\nThomas Hellwig\nVorsitzender',
      gaps: [
        { options: ['für', 'über', 'an'], answer: 0 },
        { options: ['Damit', 'Weil', 'Obwohl'], answer: 2 },
        { options: ['auf', 'an', 'über'], answer: 2 },
        { options: ['weil', 'denn', 'dass'], answer: 0 },
        { options: ['schicken', 'schickt', 'geschickt'], answer: 0 },
        { options: ['Ihren', 'Ihre', 'Ihrer'], answer: 1 }
      ]
    }
  },

  schreiben: {
    anweisung:
      'Wählen Sie Aufgabe A oder Aufgabe B. Zeigen Sie, was Sie können. Schreiben Sie möglichst viel. Vergessen Sie nicht die Anrede und den Gruß.',
    tasks: [
      {
        titel: 'Aufgabe A – Absage an die Vereinsvorsitzende',
        situation:
          'Sie sind Mitglied im Gartenverein „Grüne Insel“. Die Vorsitzende, Frau Roth, hat Sie zur Jubiläumsfeier des Vereins eingeladen. Sie können leider nicht kommen. Schreiben Sie Frau Roth eine E-Mail.',
        leitpunkte: [
          'Bedanken Sie sich für die Einladung.',
          'Erklären Sie, warum Sie nicht kommen können.',
          'Bieten Sie an, dem Verein bei einer anderen Gelegenheit zu helfen.',
          'Fragen Sie, wann das nächste Treffen der Mitglieder stattfindet.'
        ],
        musterloesung:
          'Sehr geehrte Frau Roth,\n\nvielen Dank für Ihre Einladung zur Jubiläumsfeier unseres Gartenvereins. Ich habe mich sehr darüber gefreut. Leider kann ich am Samstag nicht kommen, weil ich an diesem Wochenende bei der Hochzeit meiner Schwester in München sein muss. Das Datum steht schon lange fest, und ich kann es nicht verschieben. Ich möchte aber gern etwas für den Verein tun. Wenn Sie Hilfe beim Aufbau brauchen oder jemanden, der Kuchen backt, sagen Sie mir bitte Bescheid. Außerdem würde ich gern wissen, wann das nächste Treffen der Mitglieder stattfindet, damit ich es mir im Kalender notieren kann. Ich wünsche Ihnen ein schönes Fest!\n\nMit freundlichen Grüßen\nDaniel Okafor'
      },
      {
        titel: 'Aufgabe B – Anfrage wegen eines Raums für eine Feier',
        situation:
          'Sie möchten Ihren 40. Geburtstag im Vereinsheim des Sportvereins Waldheim feiern. Sie schreiben an die Verwaltung des Vereinsheims.',
        leitpunkte: [
          'Sagen Sie, für welchen Tag Sie den Raum brauchen und wie viele Gäste kommen.',
          'Fragen Sie, was die Miete kostet.',
          'Fragen Sie, ob Sie Essen und Getränke selbst mitbringen dürfen.',
          'Bitten Sie um eine Antwort und nennen Sie Ihre Telefonnummer.'
        ],
        musterloesung:
          'Sehr geehrte Damen und Herren,\n\nich möchte am Samstag, dem 18. Oktober, meinen 40. Geburtstag feiern und interessiere mich dafür, Ihr Vereinsheim zu mieten. Wir wären etwa 30 Personen und würden ab 17 Uhr feiern. Könnten Sie mir bitte mitteilen, ob der Raum an diesem Tag frei ist und was die Miete kostet? Außerdem würde ich gern wissen, ob wir Essen und Getränke selbst mitbringen dürfen oder ob wir bei Ihnen bestellen müssen. Ich wäre Ihnen dankbar, wenn Sie mir bald antworten könnten. Sie erreichen mich unter der Nummer 0171 5551234, am besten abends nach 18 Uhr.\n\nMit freundlichen Grüßen\nElena Popescu'
      }
    ],
    tipps:
      'Pick one task and cover all four Leitpunkte, each in at least one full sentence. Both tasks are formal or half-formal: use "Sehr geehrte/r ..." and "Mit freundlichen Grüßen". Polite requests such as "Könnten Sie mir bitte mitteilen, ..." and connectors like "weil", "damit" and "außerdem" lift your text to B1.'
  },

  sprechen: {
    teil1: {
      anweisung:
        'Teil 1: Sprechen Sie über sich. Die Stichworte helfen Ihnen. Danach stellt Ihre Prüferin oder Ihr Prüfer Ihnen einige Fragen.',
      nachfragen: [
        'Was machen Sie gern in Ihrer Freizeit?',
        'Gehen Sie manchmal auf Feste oder zu Festen von Freunden?',
        'Sind Sie Mitglied in einem Verein oder möchten Sie in einen Verein gehen?',
        'Wie verbringen Sie gewöhnlich Ihr Wochenende?'
      ],
      redemittel: [
        'Ich heiße ... und bin in ... geboren.',
        'Ich wohne seit ... in ...',
        'Ich arbeite als ... / Ich bin zurzeit ...',
        'In meiner Freizeit ... ich gern ...',
        'Am Wochenende treffe ich oft ...',
        'Ich spreche ... und lerne Deutsch seit ...'
      ]
    },
    teil2: {
      anweisung:
        'Teil 2: Sie bekommen ein Foto. Beschreiben Sie, was Sie sehen und welche Situation das ist. Danach stellt Ihnen die Prüferin oder der Prüfer Fragen zu Ihren Erfahrungen.',
      bilder: [
        {
          beschreibung:
            'Auf dem Foto sieht man ein Straßenfest an einem sonnigen Tag. Viele Menschen laufen zwischen Verkaufsständen mit Essen und Getränken. Im Hintergrund spielt eine kleine Band auf einer Bühne, und ein Kind hält einen bunten Luftballon.',
          fragenA2: [
            'Waren Sie schon einmal auf einem Fest?',
            'Was essen und trinken Sie gern auf einem Fest?',
            'Mit wem gehen Sie gern auf Feste?'
          ],
          fragenB1: [
            'Welche Feste feiert man in Ihrem Heimatland und wie feiert man sie?',
            'Was gefällt Ihnen an deutschen Festen und was ist anders als bei Ihnen zu Hause?',
            'Haben Sie schon einmal ein Fest mitorganisiert? Wie war das?'
          ]
        },
        {
          beschreibung:
            'Auf dem Foto sieht man einen Sportplatz. Eine Trainerin steht mit einer Gruppe von Kindern in gelben Trikots in einem Kreis. Die Kinder hören ihr zu, ein Ball liegt auf dem Rasen.',
          fragenA2: [
            'Treiben Sie Sport?',
            'Welchen Sport mögen Sie?',
            'Haben Sie als Kind Sport im Verein gemacht?'
          ],
          fragenB1: [
            'Warum ist Sport in einer Gruppe oft besser als allein?',
            'Welche Vor- und Nachteile hat ein Verein im Vergleich zum Sport allein?',
            'Was würden Sie tun, um Menschen für einen Verein zu begeistern?'
          ]
        }
      ],
      redemittel: [
        'Auf dem Foto sieht man ...',
        'Im Vordergrund / Im Hintergrund ist ...',
        'Ich glaube, dass die Leute ...',
        'Das gefällt mir, weil ...',
        'Bei uns ist das anders / ähnlich, denn ...',
        'Ich habe selbst schon einmal ...'
      ]
    },
    teil3: {
      situation: 'Ihr Deutschkurs endet bald. Sie möchten mit der Gruppe ein kleines Abschlussfest feiern.',
      aufgabe:
        'Planen Sie das Fest gemeinsam mit Ihrer Gesprächspartnerin oder Ihrem Gesprächspartner. Machen Sie Vorschläge, hören Sie auf die Vorschläge der anderen Person und einigen Sie sich.',
      notizen: [
        'Wann und wo feiern wir?',
        'Wen laden wir ein?',
        'Essen und Getränke',
        'Musik oder Spiele',
        'Wer macht was?',
        '…?'
      ],
      redemittel: [
        'Wie wäre es, wenn wir ... ?',
        'Ich schlage vor, dass wir ...',
        'Was hältst du / halten Sie davon, wenn ... ?',
        'Das ist eine gute Idee, aber ...',
        'Ich kümmere mich gern um ...',
        'Einverstanden, dann machen wir das so.'
      ]
    }
  }
} as const satisfies DtzExam;

export default exam;
