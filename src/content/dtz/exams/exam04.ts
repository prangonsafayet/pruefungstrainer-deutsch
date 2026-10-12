import { type DtzExam } from '@shared/types';

const exam = {
  id: 4,
  title: 'Modelltest 4',
  theme: 'Gesundheit & Arztbesuch',

  hoeren: {
    teil1: {
      anweisung:
        'Sie hören vier Ansagen. Zu jeder Ansage gibt es eine Aufgabe. Welche Lösung (a, b oder c) passt am besten?',
      items: [
        {
          audio:
            'Praxis für Allgemeinmedizin Doktor Berger. Unsere Sprechzeiten sind Montag, Dienstag und Donnerstag von acht bis zwölf Uhr und von fünfzehn bis achtzehn Uhr. Mittwoch und Freitag sind wir nur vormittags für Sie da, von acht bis dreizehn Uhr. Rezepte können Sie telefonisch ab zehn Uhr bestellen. In dringenden Fällen außerhalb der Sprechzeiten wählen Sie die Nummer eins eins sechs, eins eins sieben.',
          frage: 'Was gilt für Mittwoch und Freitag?',
          options: [
            'Die Praxis hat nur für Notfälle geöffnet.',
            'Die Praxis hat nur vormittags geöffnet.',
            'Die Praxis ist geschlossen.'
          ],
          answer: 1
        },
        {
          audio:
            'Guten Tag, Frau Petrović, hier ist die Rosen-Apotheke. Ihr Medikament ist jetzt da. Sie können es heute bis neunzehn Uhr oder morgen ab acht Uhr bei uns abholen. Bitte bringen Sie Ihre Gesundheitskarte mit. Wenn Sie nicht selbst kommen können, darf auch eine andere Person das Medikament abholen. Sie braucht dann eine Vollmacht von Ihnen.',
          frage: 'Was muss Frau Petrović in die Apotheke mitbringen?',
          options: ['Eine Vollmacht.', 'Das Rezept.', 'Die Gesundheitskarte.'],
          answer: 2
        },
        {
          audio:
            'Eine Durchsage der Verkehrsbetriebe. Wegen eines Rettungseinsatzes fährt die Linie drei heute nicht bis zum Klinikum. Die Bahnen enden an der Haltestelle Ostring. Von dort fährt alle zehn Minuten ein Ersatzbus zum Klinikum. Die Fahrt dauert etwa fünf Minuten. Ihre Fahrscheine gelten auch im Ersatzbus.',
          frage: 'Wie kommen Fahrgäste heute zum Klinikum?',
          options: [
            'Mit der Linie drei bis zum Klinikum.',
            'Mit dem Ersatzbus ab Ostring.',
            'Zu Fuß ab Ostring.'
          ],
          answer: 1
        },
        {
          audio:
            'Guten Tag, Frau Marković, hier ist das Sekretariat der Grundschule Lindenhof. Ihr Sohn Luca hat Fieber bekommen und fühlt sich nicht gut. Bitte holen Sie ihn bis zwölf Uhr ab. Wenn Sie selbst nicht kommen können, rufen Sie uns bitte an. Dann kann vielleicht eine andere Person ihn abholen. Vielen Dank.',
          frage: 'Was soll Frau Marković tun?',
          options: [
            'Luca ein Medikament bringen.',
            'Luca bis zwölf Uhr abholen.',
            'Mit der Lehrerin sprechen.'
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
            'Und nun das Wetter. Heute wird es sehr heiß, bis zu fünfunddreißig Grad. Der Wetterdienst hat eine Hitzewarnung herausgegeben. Ärzte raten, viel Wasser zu trinken und zwischen elf und fünfzehn Uhr nicht in der Sonne zu bleiben. Besonders ältere Menschen und kleine Kinder sollten im Schatten oder im Haus bleiben. Morgen wird es etwas kühler.',
          frage: 'Was raten die Ärzte bei der Hitze?',
          options: [
            'Viel zu trinken und mittags im Schatten zu bleiben.',
            'Nur am Abend etwas zu trinken.',
            'Mittags Sport im Freien zu machen.'
          ],
          answer: 0
        },
        {
          audio:
            'Eine Information für Autofahrer: Wegen des Halbmarathons am Sonntag sind in der Innenstadt von sieben bis fünfzehn Uhr mehrere Straßen gesperrt. Betroffen sind die Hauptstraße, die Bahnhofstraße und der Marktplatz. Die Buslinien werden umgeleitet. Das Parkhaus am Stadion ist aber erreichbar.',
          frage: 'Was gilt am Sonntag in der Innenstadt?',
          options: [
            'Das Parkhaus am Stadion ist geschlossen.',
            'Mehrere Straßen sind gesperrt.',
            'Die Busse fahren nicht.'
          ],
          answer: 1
        },
        {
          audio:
            'Der Veranstaltungstipp für diese Woche: Das Rote Kreuz lädt am Donnerstag von sechzehn bis zwanzig Uhr zur Blutspende in die Turnhalle der Gesamtschule ein. Spenden darf, wer mindestens achtzehn Jahre alt ist. Wer zum ersten Mal spendet, bringt bitte einen Ausweis mit. Danach gibt es für alle einen kleinen Imbiss.',
          frage: 'Was müssen Erstspender mitbringen?',
          options: ['Ein ärztliches Zeugnis.', 'Einen Ausweis.', 'Eine Anmeldung aus dem Internet.'],
          answer: 1
        },
        {
          audio:
            'Und das hören Sie im Anschluss: Um zwölf Uhr beginnt unser Gesundheitsmagazin „Fit am Mittag“. Heute ist eine Ärztin für Schlafmedizin bei uns zu Gast. Sie beantwortet Ihre Fragen: Warum wachen wir nachts auf? Und was hilft, wenn man abends nicht einschlafen kann? Rufen Sie uns an, die Telefonnummer nennen wir in der Sendung. Um halb eins folgen die Nachrichten.',
          frage: 'Worum geht es heute im Gesundheitsmagazin?',
          options: ['Ernährung bei Kindern.', 'Sport im Alter.', 'Probleme mit dem Schlafen.'],
          answer: 2
        },
        {
          audio:
            'Husten, Schnupfen, Halsschmerzen? Mit Lindensaft aus Ihrer Apotheke sind Sie schnell wieder fit. Der Saft lindert den Husten schon nach einem Tag, schmeckt nach Honig und ist auch für Kinder ab sechs Jahren geeignet. Fragen Sie in Ihrer Apotheke. Wenn die Beschwerden länger als eine Woche dauern, gehen Sie bitte zum Arzt.',
          frage: 'Für wen ist der Saft geeignet?',
          options: ['Nur für Erwachsene.', 'Auch für Babys.', 'Auch für Kinder ab sechs Jahren.'],
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
            { speaker: 'Ärztin', text: 'Guten Morgen, Frau Weiß. Was fehlt Ihnen denn?' },
            {
              speaker: 'Frau Weiß',
              text: 'Ich habe seit drei Tagen starke Halsschmerzen und Husten. Gestern hatte ich auch Fieber, achtunddreißig Komma fünf.'
            },
            {
              speaker: 'Ärztin',
              text: 'Lassen Sie mich mal in den Hals schauen. Ja, der ist ziemlich rot. Ich höre noch Ihre Lunge ab. Gut, die Lunge ist frei. Es ist eine Erkältung. Ein Antibiotikum brauchen Sie nicht. Ich schreibe Sie für fünf Tage krank und verschreibe Ihnen Halstabletten und einen Hustensaft.'
            },
            { speaker: 'Frau Weiß', text: 'Und wenn es nicht besser wird?' },
            {
              speaker: 'Ärztin',
              text: 'Dann kommen Sie bitte wieder, wenn das Fieber nach drei Tagen nicht weg ist. Trinken Sie viel und bleiben Sie im Bett.'
            }
          ],
          statement: { text: 'Frau Weiß hat erst seit gestern Halsschmerzen.', answer: false },
          question: {
            frage: 'Was bekommt Frau Weiß von der Ärztin?',
            options: [
              'Ein Antibiotikum und eine Spritze.',
              'Halstabletten und Hustensaft.',
              'Eine Überweisung ins Krankenhaus.'
            ],
            answer: 1
          }
        },
        {
          audio: [
            { speaker: 'Praxis', text: 'Zahnarztpraxis Wolf, guten Tag.' },
            {
              speaker: 'Herr Demir',
              text: 'Guten Tag, hier ist Demir. Ich habe seit gestern starke Zahnschmerzen und möchte so schnell wie möglich einen Termin.'
            },
            {
              speaker: 'Praxis',
              text: 'Einen Moment. Heute ist leider alles voll. Morgen um zehn Uhr fünfzehn hätten wir einen Termin, jemand hat abgesagt.'
            },
            {
              speaker: 'Herr Demir',
              text: 'Morgen früh arbeite ich eigentlich. Gibt es etwas am Nachmittag?'
            },
            { speaker: 'Praxis', text: 'Am Nachmittag erst wieder am Donnerstag um sechzehn Uhr.' },
            {
              speaker: 'Herr Demir',
              text: 'Das ist zu spät, ich habe wirklich große Schmerzen. Dann komme ich morgen früh und spreche mit meinem Chef.'
            },
            { speaker: 'Praxis', text: 'Gut. Bringen Sie bitte Ihre Versichertenkarte mit.' }
          ],
          statement: { text: 'Herr Demir kann noch heute zum Zahnarzt kommen.', answer: false },
          question: {
            frage: 'Wann geht Herr Demir zum Zahnarzt?',
            options: ['Heute Abend.', 'Morgen um 10.15 Uhr.', 'Am Donnerstag um 16 Uhr.'],
            answer: 1
          }
        },
        {
          audio: [
            { speaker: 'Nadine', text: 'Hallo Sabine, du siehst müde aus. Ist alles in Ordnung?' },
            {
              speaker: 'Sabine',
              text: 'Ach, ich schlafe schlecht, seit ich Rückenschmerzen habe. Der Arzt sagt, ich sitze zu viel.'
            },
            {
              speaker: 'Nadine',
              text: 'Das kenne ich. Ich gehe seit zwei Monaten jeden Dienstag zum Rückenkurs im Gesundheitszentrum. Das hilft wirklich. Die Krankenkasse bezahlt sogar die Hälfte.'
            },
            { speaker: 'Sabine', text: 'Wie viel kostet der Kurs denn?' },
            {
              speaker: 'Nadine',
              text: 'Achtzig Euro für zehn Termine. Die Hälfte bekommst du zurück, wenn du mindestens acht Mal kommst.'
            },
            {
              speaker: 'Sabine',
              text: 'Das klingt gut. Dann melde ich mich an. Wann beginnt der nächste Kurs?'
            },
            {
              speaker: 'Nadine',
              text: 'Anfang des Monats. Die Anmeldung ist am Empfang. Nach der Arbeit zeige ich dir den Weg.'
            }
          ],
          statement: { text: 'Die Krankenkasse bezahlt den ganzen Rückenkurs.', answer: false },
          question: {
            frage: 'Was möchte Sabine tun?',
            options: [
              'Den Arzt wechseln.',
              'Mit Nadine ins Fitnessstudio gehen.',
              'Sich für den Rückenkurs anmelden.'
            ],
            answer: 2
          }
        },
        {
          audio: [
            { speaker: 'Apothekerin', text: 'Guten Tag, was kann ich für Sie tun?' },
            {
              speaker: 'Kunde',
              text: 'Guten Tag. Ich habe hier ein Rezept für meinen Sohn. Er hat eine Ohrenentzündung.'
            },
            {
              speaker: 'Apothekerin',
              text: 'Ah ja, Ohrentropfen. Die nimmt er dreimal täglich, morgens, mittags und abends, jeweils drei Tropfen ins rechte Ohr. Bewahren Sie die Flasche im Kühlschrank auf.'
            },
            { speaker: 'Kunde', text: 'Muss ich etwas dazuzahlen?' },
            {
              speaker: 'Apothekerin',
              text: 'Nein, bei Kindern unter achtzehn Jahren ist das Medikament zuzahlungsfrei.'
            },
            { speaker: 'Kunde', text: 'Danke. Und was mache ich, wenn es nach zwei Tagen nicht besser ist?' },
            { speaker: 'Apothekerin', text: 'Dann gehen Sie bitte noch einmal zum Kinderarzt.' }
          ],
          statement: { text: 'Der Kunde muss für das Medikament nichts dazuzahlen.', answer: true },
          question: {
            frage: 'Was soll der Kunde tun, wenn es nach zwei Tagen nicht besser ist?',
            options: [
              'Mehr Tropfen nehmen.',
              'Wieder zum Kinderarzt gehen.',
              'In der Apotheke ein anderes Mittel kaufen.'
            ],
            answer: 1
          }
        }
      ]
    },
    teil4: {
      anweisung:
        'Sie hören eine Radiosendung, in der Hörer ihre Meinung zu einem Thema sagen. Lesen Sie zuerst die Sätze a bis f. Zu jeder Meinung passt ein Satz. Ein Beispiel hören Sie zuerst. Zwei Sätze bleiben übrig.',
      thema: 'Gesund essen im Alltag – ist das möglich?',
      sentences: [
        'Ich koche jeden Abend frisch, weil ich dann weiß, was im Essen ist.',
        'Gesundes Essen ist mir zu teuer, ich kaufe meistens das Billigste.',
        'In der Kantine gibt es mittags zu wenig Auswahl für Vegetarier.',
        'Ich trinke jeden Tag mindestens zwei Liter Wasser.',
        'Meine Kinder wollen nur Pommes und Nudeln essen.',
        'Ich esse nur am Wochenende richtig, unter der Woche habe ich keine Zeit.'
      ],
      beispiel: {
        audio:
          'Ich koche abends immer frisch. Dann weiß ich genau, was in meinem Essen ist: kein Zucker, keine Zusatzstoffe, nur Gemüse, Fleisch und Reis. Das dauert ein bisschen länger, aber es lohnt sich.',
        answer: 0
      },
      aussagen: [
        {
          audio:
            'Ich versuche wirklich, gesund zu kochen. Aber meine beiden Söhne essen kein Gemüse. Wenn ich Salat auf den Tisch stelle, bekomme ich nur lange Gesichter. Am Ende gibt es doch wieder Nudeln mit Soße.',
          answer: 4
        },
        {
          audio:
            'Schauen Sie sich die Preise an: Ein Kilo Bio-Äpfel kostet mehr als doppelt so viel wie normale Äpfel. Bei meinem Gehalt kann ich mir das nicht leisten. Ich nehme leider fast immer die günstigste Ware.',
          answer: 1
        },
        {
          audio:
            'Ich esse kein Fleisch, und in unserer Kantine gibt es jeden Tag nur Schnitzel, Wurst oder Fisch. Eine vegetarische Alternative suche ich dort meistens vergeblich.',
          answer: 2
        }
      ]
    }
  },

  lesen: {
    teil1: {
      anweisung:
        'Lesen Sie den Wegweiser und die Situationen. Wohin gehen Sie? Welche Lösung (a, b oder c) passt am besten?',
      titel: 'Wegweiser: Ärztehaus Mitte',
      verzeichnis:
        'Erdgeschoss\nApotheke am Markt · Sanitätshaus · Anmeldung und Information\n\n1. Stock\nAllgemeinmedizin Dr. Hartmann · Kinderärztin Dr. Yilmaz · Hautärztin Dr. Brandt\n\n2. Stock\nZahnarztpraxis Dr. Wolf · Röntgenpraxis · Labor (Blutabnahme)\n\n3. Stock\nPhysiotherapie Kraft · Praxis für Ergotherapie\n\n4. Stock\nErnährungsberatung · Beratungsstelle für Familien',
      questions: [
        {
          frage: 'Ihre Tochter ist fünf Jahre alt und hat seit gestern Fieber.',
          options: ['Erdgeschoss, Apotheke', '1. Stock, Kinderärztin', '3. Stock, Physiotherapie'],
          answer: 1
        },
        {
          frage: 'Sie haben starke Zahnschmerzen.',
          options: ['1. Stock, Hautärztin', '2. Stock, Zahnarztpraxis', '3. Stock, Physiotherapie'],
          answer: 1
        },
        {
          frage: 'Sie möchten sich beraten lassen, was Sie wegen Übergewicht essen sollten.',
          options: ['1. Stock, Allgemeinmedizin', '3. Stock, Ergotherapie', 'Ein anderes Stockwerk'],
          answer: 2
        },
        {
          frage: 'Nach einer Knieoperation sollen Sie bei einer Therapeutin Übungen machen.',
          options: ['Erdgeschoss, Sanitätshaus', '3. Stock, Physiotherapie', '4. Stock, Ernährungsberatung'],
          answer: 1
        },
        {
          frage: 'Sie haben ein Rezept von Ihrem Hausarzt bekommen und brauchen das Medikament.',
          options: ['Erdgeschoss, Apotheke', 'Erdgeschoss, Sanitätshaus', '2. Stock, Labor'],
          answer: 0
        }
      ]
    },
    teil2: {
      anweisung:
        'Lesen Sie die Situationen 26–30 und die Anzeigen a–h. Welche Anzeige passt zu welcher Situation? Für eine Situation gibt es keine passende Anzeige. Dort markieren Sie X.',
      situations: [
        'Sie möchten Ihren Blutdruck messen lassen, haben aber keinen Termin beim Arzt.',
        'Sie brauchen für den Führerschein einen Erste-Hilfe-Kurs und eine Bescheinigung dafür.',
        'Sie sind neu in der Stadt und suchen einen Hausarzt.',
        'Sie sitzen den ganzen Tag im Büro und haben oft Rückenschmerzen. Vor der Arbeit möchten Sie in einer Gruppe gezielt den Rücken trainieren.',
        'Ihre Mutter ist 68 Jahre alt. Sie möchte sich bewegen, aber ihre Gelenke tun schnell weh.'
      ],
      ads: [
        'Fitnessstudio Aktiv: Eine Probewoche kostenlos! Danach 29 Euro im Monat. Geräte, Kurse und Sauna. Täglich von 6 bis 23 Uhr geöffnet.',
        'Rotes Kreuz: Erste Hilfe am Kind. Kurs für Eltern, Großeltern und Babysitter, Samstag 9–16 Uhr. Bescheinigungen für den Führerschein stellen wir bei diesem Kurs nicht aus.',
        'Hausarztpraxis Dr. Meyer: Neue Patientinnen und Patienten sind herzlich willkommen! Sprechstunde Montag bis Freitag, am Samstag nach Termin. Unsere Praxis ist barrierefrei.',
        'Linden-Apotheke: Jeden Mittwoch von 9 bis 12 Uhr messen wir Ihren Blutdruck kostenlos und ohne Termin. Einfach vorbeikommen!',
        'Rückenyoga am Morgen: Mo, Mi und Fr von 7 bis 8 Uhr im Gesundheitszentrum Süd. Sanfte Übungen für alle, die viel sitzen. Matten sind vorhanden. 8 Termine für 48 Euro.',
        'Kinderturnen „Kleine Füchse“: Für Kinder von 3 bis 6 Jahren, Dienstag und Donnerstag 16–17 Uhr in der Turnhalle der Grundschule. Eltern dürfen zuschauen.',
        'Wassergymnastik für Seniorinnen und Senioren: Dienstag und Freitag um 14 Uhr im Hallenbad Nord. Sanfte Bewegung im warmen Wasser, gut für Rücken und Gelenke. Ab 60 Jahren.',
        'Raucherentwöhnung an der VHS: In acht Abenden zum Nichtraucher! Kleine Gruppe, Dienstag um 19 Uhr. Kursgebühr 60 Euro. Anmeldung im Büro.'
      ],
      answers: [3, -1, 2, 4, 6]
    },
    teil3: {
      anweisung:
        'Lesen Sie die Texte und die Aufgaben dazu. Ist die Aussage richtig oder falsch? Welche Lösung (a, b oder c) passt am besten?',
      texts: [
        {
          titel: 'Grippeimpfung in der Stadthalle',
          text: 'Das Gesundheitsamt bietet im Oktober wieder eine Aktion zur Grippeimpfung an. Im Foyer der Stadthalle können sich Menschen ab 60 Jahren sowie Menschen mit chronischen Krankheiten jeden Dienstag und Donnerstag von 14 bis 18 Uhr kostenlos impfen lassen. Zur Impfung bringen Sie bitte Ihre Versichertenkarte und Ihren Impfpass mit. Eine Anmeldung ist nicht nötig. Wer jünger und gesund ist, kann sich beim Hausarzt impfen lassen. Das Gesundheitsamt rät außerdem: Lassen Sie sich nicht zu spät impfen, denn der Schutz beginnt erst nach etwa zwei Wochen.',
          statement: {
            text: 'Bei der Aktion im Oktober kann sich jeder Erwachsene kostenlos impfen lassen.',
            answer: false
          },
          question: {
            frage: 'Was soll man zur Impfung mitbringen?',
            options: [
              'Versichertenkarte und Impfpass.',
              'Eine Überweisung vom Hausarzt.',
              'Eine Anmeldung aus dem Internet.'
            ],
            answer: 0
          }
        },
        {
          titel: 'Ihr Termin im Klinikum',
          text: 'Sehr geehrte Frau Lindqvist,\n\nhiermit bestätigen wir Ihren Termin für eine Untersuchung des Knies (MRT) am Montag um 8.15 Uhr im Klinikum Südstadt, Gebäude C, Zimmer 14. Bitte melden Sie sich 20 Minuten vor Beginn an der Anmeldung. Bringen Sie die Überweisung Ihrer Hausärztin und, wenn vorhanden, frühere Röntgenbilder mit. Sie müssen nicht nüchtern sein und dürfen vorher ganz normal essen und trinken. Metallgegenstände müssen Sie vor der Untersuchung ablegen. Wenn Sie einen Herzschrittmacher haben, informieren Sie uns bitte vorher telefonisch. Falls Sie den Termin nicht wahrnehmen können, sagen Sie bitte spätestens am Freitag davor ab.\n\nMit freundlichen Grüßen\nRadiologie, Klinikum Südstadt',
          statement: { text: 'Frau Lindqvist darf vor der Untersuchung ganz normal essen.', answer: true },
          question: {
            frage: 'Wann soll Frau Lindqvist an der Anmeldung sein?',
            options: ['Um 7.55 Uhr.', 'Um 8.15 Uhr.', 'Um 8.35 Uhr.'],
            answer: 0
          }
        },
        {
          titel: 'Kopfläuse in der Klasse 2b',
          text: 'Liebe Eltern der Klasse 2b,\n\nin unserer Klasse wurden Kopfläuse festgestellt. Das kommt bei Kindern häufig vor und ist kein Zeichen für mangelnde Sauberkeit. Bitte kontrollieren Sie heute Abend die Haare Ihres Kindes. Haben Sie Läuse gefunden, behandeln Sie Ihr Kind mit einem Mittel aus der Apotheke und informieren Sie uns bitte kurz. Ihr Kind darf wieder in die Schule, sobald es behandelt wurde. Ein Attest vom Arzt brauchen Sie nur, wenn nach der zweiten Behandlung noch Läuse da sind.\n\nGrundschule Am Park, Sekretariat',
          statement: {
            text: 'Nur Eltern von Kindern, die sich am Kopf kratzen, sollen die Haare kontrollieren.',
            answer: false
          },
          question: {
            frage: 'Wann darf ein Kind mit Läusen wieder in die Schule?',
            options: [
              'Erst nach einer Woche.',
              'Immer nur mit einem Attest vom Arzt.',
              'Sobald es mit einem Mittel aus der Apotheke behandelt wurde.'
            ],
            answer: 2
          }
        }
      ]
    },
    teil4: {
      anweisung: 'Lesen Sie den Text und die Aussagen dazu. Ist die Aussage richtig oder falsch?',
      titel: 'Zum Arzt in Deutschland: Informationen für Neuzugezogene',
      text: 'Die Krankenversicherung\nIn Deutschland muss jeder krankenversichert sein. Mit Ihrer elektronischen Gesundheitskarte können Sie zum Arzt gehen. Bringen Sie die Karte bitte zu jedem ersten Besuch in einem Quartal mit.\n\nHausarzt und Facharzt\nMeistens gehen Sie zuerst zu Ihrem Hausarzt. Wenn nötig, stellt er Ihnen eine Überweisung zu einem Facharzt aus. Zum Zahnarzt, zur Frauenärztin und zum Augenarzt können Sie auch ohne Überweisung gehen.\n\nWenn die Praxis geschlossen ist\nBei lebensgefährlichen Notfällen wählen Sie die 112. Für Beschwerden, die nicht bis zum nächsten Tag warten können, hilft Ihnen abends, nachts und am Wochenende der ärztliche Bereitschaftsdienst unter der Nummer 116 117.\n\nMedikamente\nMedikamente mit Rezept bekommen Sie in der Apotheke. Meistens zahlen Sie einen kleinen Teil selbst dazu, in der Regel fünf bis zehn Euro. Kinder und Jugendliche unter 18 Jahren zahlen nichts dazu.',
      statements: [
        { text: 'Jeder, der in Deutschland lebt, muss krankenversichert sein.', answer: true },
        { text: 'Für einen Besuch beim Augenarzt braucht man immer eine Überweisung.', answer: false },
        { text: 'Den ärztlichen Bereitschaftsdienst kann man nur tagsüber anrufen.', answer: false }
      ]
    },
    teil5: {
      anweisung: 'Lesen Sie den Brief. Welches Wort passt in die Lücke? Wählen Sie a, b oder c.',
      text: 'Sehr geehrte Frau Doktor Hartmann,\n\nich bin seit einem Monat in Ihrer Praxis Patient und möchte Sie heute [1] etwas bitten. Im Moment habe ich oft Kopfschmerzen, [2] ich den ganzen Tag am Computer arbeite. Bis jetzt habe ich Schmerztabletten genommen, aber ich möchte wissen, [3] es eine bessere Lösung gibt. Könnten Sie mir bitte einen Termin [4]? Ich kann nur am Nachmittag kommen, [5] ich vormittags arbeiten muss. Für [6] Hilfe wäre ich Ihnen sehr dankbar.\n\nMit freundlichen Grüßen\nKarim Haddad',
      gaps: [
        { options: ['von', 'um', 'für'], answer: 1 },
        { options: ['damit', 'weil', 'obwohl'], answer: 1 },
        { options: ['ob', 'dass', 'wenn'], answer: 0 },
        { options: ['geben', 'gegeben', 'gibt'], answer: 0 },
        { options: ['denn', 'weil', 'obwohl'], answer: 1 },
        { options: ['Ihrer', 'Ihren', 'Ihre'], answer: 2 }
      ]
    }
  },

  schreiben: {
    anweisung:
      'Wählen Sie Aufgabe A oder Aufgabe B. Schreiben Sie einen Text zu allen vier Punkten. Zeigen Sie, was Sie können. Schreiben Sie möglichst viel. Vergessen Sie nicht die Anrede und den Gruß.',
    tasks: [
      {
        titel: 'Aufgabe A: Einen Arzttermin absagen',
        situation:
          'Sie haben morgen um 9 Uhr einen Termin bei Ihrem Zahnarzt, Dr. Wolf. Sie haben seit einer Woche Zahnschmerzen. Sie können aber nicht kommen und schreiben der Praxis eine E-Mail.',
        leitpunkte: [
          'Entschuldigen Sie sich und erklären Sie, warum Sie morgen nicht kommen können.',
          'Schlagen Sie einen neuen Termin vor und nennen Sie Tage und Uhrzeiten.',
          'Beschreiben Sie, wie es Ihrem Zahn im Moment geht.',
          'Fragen Sie, was Sie bis zum neuen Termin gegen die Schmerzen tun können.'
        ],
        musterloesung:
          'Sehr geehrte Damen und Herren,\n\nleider kann ich morgen um 9 Uhr nicht zu meinem Termin bei Dr. Wolf kommen. Mein Chef hat mich kurzfristig zu einem wichtigen Kundentermin geschickt. Es tut mir sehr leid, dass ich so spät absage.\n\nKönnte ich stattdessen am Montag oder am Mittwoch nach 16 Uhr kommen? Auch am Freitagvormittag hätte ich Zeit.\n\nMeine Zahnschmerzen sind im Moment nicht mehr so stark wie letzte Woche, aber bei kaltem Wasser tut der Zahn noch weh. Was kann ich bis zum neuen Termin gegen die Schmerzen tun? Darf ich ein Schmerzmittel nehmen?\n\nVielen Dank für Ihr Verständnis. Bitte antworten Sie mir per E-Mail.\n\nMit freundlichen Grüßen\nAhmad Rahimi'
      },
      {
        titel: 'Aufgabe B: Eine Nachricht an die Lehrerin',
        situation:
          'Ihre Tochter Mia (8 Jahre) war eine Woche lang krank und konnte nicht zur Schule gehen. Heute geht es ihr wieder gut. Sie schreiben der Klassenlehrerin, Frau Berger.',
        leitpunkte: [
          'Erklären Sie, was Mia hatte und wie lange sie gefehlt hat.',
          'Sagen Sie, dass Sie ein Attest vom Arzt mitgeben, und entschuldigen Sie Mia für die Fehltage.',
          'Fragen Sie, wie Mia den Unterricht nachholen kann.',
          'Fragen Sie, ob Mia am Ausflug am Freitag schon wieder teilnehmen darf.'
        ],
        musterloesung:
          'Sehr geehrte Frau Berger,\n\nich möchte Ihnen mitteilen, warum Mia in der letzten Woche nicht in der Schule war. Sie hatte eine starke Grippe mit hohem Fieber und musste fünf Tage im Bett bleiben. Seit gestern ist sie wieder gesund.\n\nEin Attest von unserem Kinderarzt gebe ich Mia morgen mit. Bitte entschuldigen Sie sie für die Fehltage.\n\nKönnten Sie mir sagen, wie Mia den Stoff nachholen kann? Ich kann mit ihr zu Hause üben, wenn sie die Hausaufgaben und die Arbeitsblätter bekommt.\n\nAußerdem würde ich gern wissen, ob Mia am Freitag schon wieder am Ausflug teilnehmen darf. Sie freut sich sehr darauf.\n\nVielen Dank für Ihre Hilfe.\n\nMit freundlichen Grüßen\nSvetlana Ivanova'
      }
    ],
    tipps:
      'Cover all four points, each with at least one full sentence. Start with the reason you are writing, and make questions polite ("Könnten Sie mir bitte sagen, ...?"). Use "Sie" for the doctor\'s office and the teacher, and link your ideas with "weil", "deshalb" and "wenn". Do not forget the Anrede and the Gruß.'
  },

  sprechen: {
    teil1: {
      anweisung:
        'Stellen Sie sich Ihrer Gesprächspartnerin oder Ihrem Gesprächspartner vor. Sprechen Sie über die Stichworte auf Ihrer Karte. Danach stellt die Prüferin oder der Prüfer Ihnen Fragen.',
      nachfragen: [
        'Wie kommen Sie zu Ihrem Hausarzt oder zu Ihrer Hausärztin?',
        'Was machen Sie, um gesund zu bleiben?',
        'Welche Sprachen sprechen Sie zu Hause?',
        'Wie sieht ein normaler Tag bei Ihnen aus?',
        'Was machen Sie in Ihrer Freizeit?'
      ],
      redemittel: [
        'Ich heiße ... und komme aus ...',
        'Ich wohne seit ... in ...',
        'Von Beruf bin ich ...',
        'Ich bin verheiratet / ledig und habe ... Kinder.',
        'Meine Muttersprache ist ...',
        'In meiner Freizeit ...'
      ]
    },
    teil2: {
      anweisung:
        'Beschreiben Sie Ihr Foto: Was sehen Sie? Was für eine Situation ist das? Danach stellt die Prüferin oder der Prüfer Ihnen Fragen zu Ihren eigenen Erfahrungen.',
      bilder: [
        {
          beschreibung:
            'Auf dem Foto sieht man ein Wartezimmer in einer Arztpraxis. Mehrere Personen sitzen auf Stühlen und warten. Eine ältere Frau liest eine Zeitschrift, ein Mann schaut auf sein Handy. Neben der Tür steht ein Tisch mit Zeitschriften.',
          fragenA2: [
            'Waren Sie schon einmal beim Arzt in Deutschland?',
            'Wie lange mussten Sie dort warten?',
            'Was machen Sie, wenn Sie warten müssen?'
          ],
          fragenB1: [
            'Wie finden Sie einen Arzt, wenn Sie neu in einer Stadt sind?',
            'Was ist für Sie bei einem Arztbesuch besonders wichtig?',
            'Wie ist das Gesundheitssystem in Ihrem Heimatland? Was ist dort anders?'
          ]
        },
        {
          beschreibung:
            'Auf dem Foto sieht man eine Apothekerin und eine Kundin an der Theke einer Apotheke. Die Apothekerin gibt der Kundin eine kleine Tüte. Hinter ihr stehen viele Regale mit Medikamenten. Die Kundin lächelt.',
          fragenA2: [
            'Gehen Sie oft in die Apotheke?',
            'Was kaufen Sie dort?',
            'Gibt es in der Nähe Ihrer Wohnung eine Apotheke?'
          ],
          fragenB1: [
            'Was tun Sie, wenn Sie leichte Beschwerden haben, zum Beispiel eine Erkältung?',
            'Wann gehen Sie lieber zum Arzt als in die Apotheke?',
            'Wie erklären Sie Ihre Beschwerden, wenn Ihnen ein Wort auf Deutsch fehlt?'
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
        'Ein Kollege liegt nach einer Operation im Krankenhaus. Sie und Ihre Partnerin oder Ihr Partner möchten ihn gemeinsam besuchen.',
      aufgabe:
        'Planen Sie den Besuch gemeinsam. Sprechen Sie über die Punkte auf Ihrem Zettel und machen Sie Vorschläge. Einigen Sie sich am Ende.',
      notizen: [
        'Wann besuchen?',
        'Wie zum Krankenhaus kommen?',
        'Was mitbringen?',
        'Wie lange bleiben?',
        'Wer informiert die anderen Kollegen?',
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
