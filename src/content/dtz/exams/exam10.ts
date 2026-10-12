import { type DtzExam } from '@shared/types';

const exam = {
  id: 10,
  title: 'Modelltest 10',
  theme: 'Banken, Verträge & Versicherungen',

  hoeren: {
    teil1: {
      anweisung:
        'Sie hören vier Ansagen am Telefon oder in einem Gebäude. Zu jeder Ansage gibt es eine Aufgabe. Welche Lösung (a, b oder c) passt am besten?',
      items: [
        {
          audio:
            'Willkommen bei der Stadtbank Rheinblick. Wenn Sie Ihre Bankkarte verloren haben und sie sperren lassen möchten, drücken Sie bitte die Eins. Für Fragen zum Online-Banking drücken Sie die Zwei. Wenn Sie einen Beratungstermin vereinbaren möchten, drücken Sie die Drei. Für alle anderen Anliegen bleiben Sie bitte in der Leitung.',
          frage: 'Welche Taste drücken Sie, wenn Sie Ihre Bankkarte sperren lassen möchten?',
          options: ['Die Eins', 'Die Zwei', 'Die Drei'],
          answer: 0
        },
        {
          audio:
            'Guten Tag, Herr Costa, hier spricht Frau Hartmann von der Nordstern-Versicherung. Es geht um Ihre Schadenmeldung wegen des Wasserschadens in Ihrer Küche. Der Gutachter kommt am Donnerstag zwischen zehn und zwölf Uhr zu Ihnen. Bitte halten Sie die Rechnungen und die Fotos vom Schaden bereit. Wenn die Zeit nicht passt, rufen Sie mich gern zurück.',
          frage: 'Was soll Herr Costa bereithalten?',
          options: ['Seinen Mietvertrag', 'Rechnungen und Fotos', 'Seine Versicherungskarte'],
          answer: 1
        },
        {
          audio:
            'Liebe Kundinnen und Kunden des Handyshops Telefix im Erdgeschoss. Nur heute: Bei Abschluss eines neuen Vertrages bekommen Sie das Smartphone ohne Aufpreis. Der Vertrag läuft vierundzwanzig Monate und kostet neunzehn Euro neunundneunzig im Monat. Unsere Mitarbeiter an Schalter drei beraten Sie gern.',
          frage: 'Was kostet der Vertrag im Monat?',
          options: ['9,99 Euro', '19,99 Euro', '24 Euro'],
          answer: 1
        },
        {
          audio:
            'Guten Tag, hier ist die Hausverwaltung Schulte. Die Jahresabrechnung für Ihre Nebenkosten ist fertig. Sie bekommen eine Rückzahlung von hundertvierzig Euro, die wir nächste Woche auf Ihr Konto überweisen. Falls sich Ihre Kontonummer geändert hat, teilen Sie uns das bitte bis Freitag mit. Vielen Dank.',
          frage: 'Was sollen Sie tun, wenn sich Ihre Kontonummer geändert hat?',
          options: [
            'Bis Freitag Bescheid sagen.',
            'Eine neue Abrechnung schicken.',
            'Den Vermieter besuchen.'
          ],
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
            'Die Aussichten für die kommende Nacht: Zunächst bleibt es trocken bei zwei Grad. Nach Mitternacht beginnt es zu regnen. Weil der Boden noch gefroren ist, besteht vor allem im Bergland Glatteisgefahr. Am Morgen steigen die Temperaturen auf fünf Grad, dann taut das Eis.',
          frage: 'Wann kann es auf den Straßen glatt werden?',
          options: ['Am Abend', 'Nach Mitternacht', 'Am Morgen'],
          answer: 1
        },
        {
          audio:
            'Hinweis für Bahnreisende: Wegen einer Störung im Stellwerk fahren zwischen Köln und Düsseldorf bis etwa zwanzig Uhr keine Regionalzüge. Sie können stattdessen die S-Bahn oder die Ersatzbusse nutzen. Ihre Fahrkarten bleiben dafür gültig.',
          frage: 'Was gilt für die Fahrkarten?',
          options: [
            'Man kann sie weiter benutzen.',
            'Man bekommt das Geld zurück.',
            'Man muss neue Fahrkarten kaufen.'
          ],
          answer: 0
        },
        {
          audio:
            'Unser Tipp für Donnerstag: Die Verbraucherzentrale lädt zu einem Vortrag mit dem Titel Vorsicht, Vertragsfalle ein. Sie erfahren, wie Sie unseriöse Verträge bei Telefon, Internet und Strom erkennen. Beginn ist um neunzehn Uhr in der Stadtbibliothek, Saal zwei. Der Eintritt ist frei, eine Anmeldung ist nicht nötig.',
          frage: 'Was muss man für den Vortrag tun?',
          options: [
            'Man muss nichts tun, man kann einfach hingehen.',
            'Man muss sich vorher anmelden.',
            'Man muss Eintritt bezahlen.'
          ],
          answer: 0
        },
        {
          audio:
            'Im Anschluss hören Sie unsere Sendung Geld und Leben. Heute fragen wir: Wie kündige ich einen Handyvertrag richtig? Der Experte Thomas Ahlers erklärt, welche Fristen gelten und warum man eine Kündigung immer schriftlich schicken sollte. Rufen Sie uns an und stellen Sie Ihre Fragen.',
          frage: 'Worum geht es in der Sendung?',
          options: ['Um günstige Handys', 'Um Geldsparen im Urlaub', 'Um die Kündigung eines Vertrages'],
          answer: 2
        },
        {
          audio:
            'Ein Besuch beim Zahnarzt kann teuer werden. Mit der Zahnzusatzversicherung Strahlend der Nordstern-Versicherung zahlen Sie schon ab sieben Euro im Monat und bekommen bis zu achtzig Prozent der Kosten für Zahnersatz erstattet. Lassen Sie sich jetzt beraten.',
          frage: 'Was bietet die Zusatzversicherung?',
          options: [
            'Sie bezahlt nur Brillen und Kontaktlinsen.',
            'Sie bezahlt alle Arztkosten.',
            'Sie bezahlt einen großen Teil der Zahnarztkosten.'
          ],
          answer: 2
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
              speaker: 'Herr Wagner',
              text: 'Guten Tag, Herr Lang. Sie möchten also ein Girokonto eröffnen?'
            },
            {
              speaker: 'Herr Lang',
              text: 'Ja, ich habe vor zwei Wochen meine Ausbildung angefangen. Mein Lohn soll auf ein deutsches Konto kommen.'
            },
            {
              speaker: 'Herr Wagner',
              text: 'Dann habe ich eine gute Nachricht. Für Auszubildende ist das Konto kostenlos. Sie brauchen nur eine Bescheinigung von Ihrem Betrieb.'
            },
            { speaker: 'Herr Lang', text: 'Die kann ich morgen mitbringen. Wann bekomme ich meine Karte?' },
            {
              speaker: 'Herr Wagner',
              text: 'In etwa fünf Tagen mit der Post. Die Geheimzahl, die PIN, schicken wir getrennt in einem zweiten Brief.'
            }
          ],
          statement: {
            text: 'Herr Lang braucht für das kostenlose Konto eine Bescheinigung seines Betriebs.',
            answer: true
          },
          question: {
            frage: 'Was bekommt Herr Lang in einem getrennten Brief?',
            options: ['Die Bankkarte', 'Den Kontovertrag', 'Die Geheimzahl'],
            answer: 2
          }
        },
        {
          audio: [
            {
              speaker: 'Herr Brandt',
              text: 'Die Wohnung hat drei Zimmer. Die Kaltmiete beträgt fünfhundert Euro, dazu kommen hundertvierzig Euro Nebenkosten.'
            },
            { speaker: 'Frau Silva', text: 'Das ist in Ordnung. Und wie ist das mit der Kaution?' },
            {
              speaker: 'Herr Brandt',
              text: 'Die Kaution beträgt drei Monatskaltmieten, also fünfzehnhundert Euro. Sie können sie aber in drei Raten bezahlen, jeweils am Ersten des Monats.'
            },
            { speaker: 'Frau Silva', text: 'Das ist gut. Dann könnte ich im Dezember einziehen.' },
            { speaker: 'Herr Brandt', text: 'Gern. Den Vertrag unterschreiben wir nächste Woche.' }
          ],
          statement: {
            text: 'Frau Silva muss die ganze Kaution schon bei der Unterschrift bezahlen.',
            answer: false
          },
          question: {
            frage: 'Wie hoch ist die Kaltmiete?',
            options: ['140 Euro', '500 Euro', '1500 Euro'],
            answer: 1
          }
        },
        {
          audio: [
            {
              speaker: 'Frau Wiśniewska',
              text: 'Guten Tag, hier spricht Marta Wiśniewska. Mein Sohn hat beim Fußballspielen eine Fensterscheibe bei unserem Nachbarn zerbrochen. Der Glaser sagt, die Reparatur kostet dreihundertzwanzig Euro.'
            },
            { speaker: 'Mitarbeiter', text: 'Haben Sie bei uns eine Haftpflichtversicherung?' },
            { speaker: 'Frau Wiśniewska', text: 'Ja, seit drei Jahren.' },
            {
              speaker: 'Mitarbeiter',
              text: 'Dann melden Sie den Schaden bitte bei uns. Sie zahlen eine Selbstbeteiligung von fünfzig Euro, den Rest übernehmen wir.'
            },
            { speaker: 'Frau Wiśniewska', text: 'Was brauchen Sie von mir?' },
            {
              speaker: 'Mitarbeiter',
              text: 'Schicken Sie uns die Rechnung vom Glaser und ein Foto vom Schaden, am besten per E-Mail.'
            }
          ],
          statement: { text: 'Die Kundin muss selbst fünfzig Euro bezahlen.', answer: true },
          question: {
            frage: 'Was soll die Kundin der Versicherung schicken?',
            options: [
              'Die Rechnung und ein Foto',
              'Nur die Rechnung',
              'Ein Foto und den Versicherungsvertrag'
            ],
            answer: 0
          }
        },
        {
          audio: [
            {
              speaker: 'Tom',
              text: 'Ayse, ich habe ein tolles Angebot für meinen Internetvertrag gefunden. Bei Funkwelle zahle ich zehn Euro weniger im Monat.'
            },
            { speaker: 'Ayse', text: 'Dann kündige doch einfach deinen alten Vertrag.' },
            {
              speaker: 'Tom',
              text: 'Das geht leider nicht sofort. Mein Vertrag läuft noch bis Ende Dezember, und die Kündigungsfrist beträgt einen Monat zum Vertragsende.'
            },
            { speaker: 'Ayse', text: 'Dann musst du also bald kündigen.' },
            {
              speaker: 'Tom',
              text: 'Genau. Spätestens Ende November. Ich schreibe die Kündigung am besten noch diese Woche.'
            }
          ],
          statement: { text: 'Tom kann seinen alten Vertrag sofort beenden.', answer: false },
          question: {
            frage: 'Bis wann muss Tom kündigen?',
            options: ['Bis Ende Oktober', 'Bis Ende November', 'Bis Ende Dezember'],
            answer: 1
          }
        }
      ]
    },
    teil4: {
      anweisung:
        'Sie hören im Radio eine Diskussion. Vier Personen sprechen über das Thema. Zu welcher Person passt welcher Satz (a–f)? Zwei Sätze bleiben übrig. Lesen Sie zuerst die Sätze. Das Beispiel ist schon gelöst.',
      thema: 'Geldgeschäfte und Verträge: Wie entscheiden Sie?',
      sentences: [
        'Ich finde eine Haftpflichtversicherung besonders wichtig.',
        'Ich habe schlechte Erfahrungen mit einem Vertrag am Telefon gemacht.',
        'Ich vergleiche Angebote im Internet, bevor ich etwas unterschreibe.',
        'Ich zahle lieber bar, weil ich Karten nicht traue.',
        'Ich habe meinen Versicherungsvertrag gekündigt, weil er zu teuer war.',
        'Ich lasse mich bei der Bank persönlich beraten.'
      ],
      beispiel: {
        audio:
          'Ich gehe bei allen Geldfragen zu meiner Bank. Dort sitzt jemand vor mir, der mir alles erklärt, und ich kann sofort nachfragen. Im Internet würde ich mich nie beraten lassen.',
        answer: 5
      },
      aussagen: [
        {
          audio:
            'Letztes Jahr hat mich jemand am Telefon angerufen und mir einen günstigen Stromtarif angeboten. Ich habe zugestimmt. Später war der Preis fast doppelt so hoch, und aus dem Vertrag kam ich lange nicht mehr heraus. Das passiert mir nie wieder.',
          answer: 1
        },
        {
          audio:
            'Bevor ich irgendetwas unterschreibe, schaue ich mir auf Vergleichsportalen im Internet mehrere Angebote an. Das dauert ein oder zwei Abende, aber ich spare im Jahr oft mehr als hundert Euro.',
          answer: 2
        },
        {
          audio:
            'Wenn ich nur eine einzige Versicherung haben dürfte, dann wäre es die Haftpflicht. Man kann so leicht einen großen Schaden verursachen, zum Beispiel mit dem Fahrrad. Und die Versicherung kostet im Monat nur wenige Euro.',
          answer: 0
        }
      ]
    }
  },

  lesen: {
    teil1: {
      anweisung:
        'Lesen Sie die Situationen und das Verzeichnis. Wo finden Sie was? Welche Lösung (a, b oder c) passt am besten?',
      titel: 'Finanzhaus Mitte – Übersicht',
      verzeichnis:
        '3. Stock: Versicherungsbüro Nordstern (Haftpflicht, Hausrat, Auto) · Krankenkasse Gesund & Fit · Steuerberatung Kramer\n2. Stock: Telefix (Handy- und Internetverträge) · Kundencenter Stadtwerke (Strom, Gas, Wasser) · Reisebüro Weitblick\n1. Stock: Stadtbank – Beratung (Konto, Kredit) · Notar Dr. Weiß · Kopierladen\nErdgeschoss: Stadtbank – Schalter und Geldautomaten · Poststelle (Briefe und Pakete) · Café Pause',
      questions: [
        {
          frage: 'Sie möchten Bargeld aus dem Automaten holen. Wohin gehen Sie?',
          options: ['Ins Erdgeschoss', 'In den 1. Stock', 'In den 2. Stock'],
          answer: 0
        },
        {
          frage: 'Sie möchten einen neuen Handyvertrag abschließen. Wohin gehen Sie?',
          options: ['In den 1. Stock', 'In den 2. Stock', 'In den 3. Stock'],
          answer: 1
        },
        {
          frage: 'Sie möchten ein Paket nach Spanien schicken. Wohin gehen Sie?',
          options: ['In den 1. Stock', 'In den 2. Stock', 'In ein anderes Stockwerk'],
          answer: 2
        },
        {
          frage:
            'Ihre Stromrechnung ist viel zu hoch. Sie möchten mit jemandem darüber sprechen. Wohin gehen Sie?',
          options: ['In den 2. Stock', 'In den 3. Stock', 'In ein anderes Stockwerk'],
          answer: 0
        },
        {
          frage:
            'Sie sind neu in Deutschland. Sie möchten sich gegen Schäden schützen, die Sie aus Versehen bei anderen Personen verursachen. Wohin gehen Sie?',
          options: ['In den 1. Stock', 'In den 2. Stock', 'In den 3. Stock'],
          answer: 2
        }
      ]
    },
    teil2: {
      anweisung:
        'Lesen Sie die Situationen und die Anzeigen a–h. Welche Anzeige passt zu welcher Situation? Für eine Situation gibt es keine passende Anzeige. Wählen Sie dann X.',
      situations: [
        'Sie haben ein Motorrad gekauft und suchen dafür eine passende Versicherung.',
        'Sie haben ein teures neues Fahrrad gekauft und möchten es gegen Diebstahl versichern.',
        'Sie brauchen Hilfe bei Ihrer Steuererklärung, haben aber nur samstags Zeit.',
        'Sie möchten einen Handyvertrag abschließen, den Sie jeden Monat kündigen können.',
        'Sie sind Student und suchen ein Girokonto, für das Sie keine Gebühren bezahlen müssen.'
      ],
      ads: [
        'Telefix-Aktion: Smartphone mit 20 GB für nur 9,99 Euro im Monat! Vertragslaufzeit 24 Monate, Kündigung nur zum Vertragsende. Telefix, Hauptstraße 12',
        'Stadtbank Direkt: Gratis-Girokonto für Schüler, Studierende und Auszubildende. Keine Kontoführungsgebühr bis 27 Jahre, Karte kostenlos. Online eröffnen mit Ausweis und Studienbescheinigung.',
        'Lohnsteuerhilfe Rhein: Wir erstellen Ihre Steuererklärung. Beratung Montag bis Freitag von 9 bis 16 Uhr. Jahresbeitrag ab 60 Euro. Tel. 0221 445566',
        'Radschutz: Die Fahrradversicherung gegen Diebstahl und Vandalismus. Schon ab 4,50 Euro im Monat, jederzeit kündbar. Beratung unter Tel. 0221 889900',
        'Kfz-Direkt: Autoversicherung für Pkw und Transporter. Jetzt Beitrag berechnen und bis zu 30 Prozent sparen. Motorräder und Roller versichern wir leider nicht.',
        'Handytarif Flex von Telefix: 10 GB nur 14,99 Euro im Monat. Keine Vertragslaufzeit! Sie können jeden Monat kündigen. Telefix, Hauptstraße 12',
        'Steuerhilfe am Samstag: Wir helfen Ihnen bei Ihrer Steuererklärung. Jeden Samstag von 9 bis 13 Uhr im Gemeindehaus Südstadt. Anmeldung telefonisch unter 0221 667788.',
        'Stadtbank Konto Plus: Girokonto ab 6,90 Euro im Monat mit Kreditkarte und Reiseversicherung. Beratung in jeder Filiale.'
      ],
      answers: [-1, 3, 6, 5, 1]
    },
    teil3: {
      anweisung:
        'Lesen Sie die Texte. Zu jedem Text gibt es zwei Aufgaben: erst richtig oder falsch, dann eine Frage mit den Lösungen a, b und c.',
      texts: [
        {
          titel: 'Stadtbank schließt Filiale in Altendorf',
          text: 'Die Stadtbank wird ihre Filiale in Altendorf zum 31. März schließen. Als Grund nennt die Bank, dass immer weniger Kunden zum Schalter kommen und die meisten ihre Geschäfte online erledigen. Der Geldautomat vor dem Gebäude bleibt jedoch stehen. Außerdem kann man künftig in der Bäckerei am Marktplatz beim Einkaufen bis zu 200 Euro in bar abheben. Für ältere Kunden, die kein Online-Banking nutzen, bietet die Bank jeden Dienstag von 10 bis 12 Uhr eine Sprechstunde im Gemeindehaus an. Der Bürgermeister kritisierte die Entscheidung: Gerade auf dem Land seien Filialen wichtig.',
          statement: { text: 'Der Geldautomat in Altendorf wird ebenfalls abgebaut.', answer: false },
          question: {
            frage: 'Was gibt es in Altendorf künftig jeden Dienstag?',
            options: [
              'Einen Online-Kurs in der Bäckerei',
              'Eine Sprechstunde der Bank im Gemeindehaus',
              'Einen Markt auf dem Marktplatz'
            ],
            answer: 1
          }
        },
        {
          titel: 'E-Mail der Nordstern-Versicherung',
          text: 'Betreff: Änderung Ihres Beitrags\n\nSehr geehrter Herr Okafor,\n\nwir möchten Sie darüber informieren, dass sich der Beitrag für Ihre Hausratversicherung ab dem 1. Januar von 9,80 Euro auf 11,40 Euro im Monat erhöht. Der Grund sind die gestiegenen Kosten für Reparaturen. Der Umfang Ihres Versicherungsschutzes bleibt unverändert. Sie müssen nichts tun. Wenn Sie mit der Erhöhung nicht einverstanden sind, können Sie Ihren Vertrag innerhalb von vier Wochen nach Erhalt dieser Mitteilung kündigen.\n\nMit freundlichen Grüßen\nNordstern-Versicherung, Kundenservice',
          statement: {
            text: 'Herr Okafor kann kündigen, wenn er den höheren Beitrag nicht akzeptiert.',
            answer: true
          },
          question: {
            frage: 'Was ändert sich zum 1. Januar?',
            options: ['Der Schutz wird kleiner.', 'Der Beitrag steigt.', 'Der Vertrag endet automatisch.'],
            answer: 1
          }
        },
        {
          titel: 'Aushang der Hausverwaltung Schulte',
          text: 'Ablesung der Heizkostenzähler\n\nAm Dienstag, dem 17. November, lesen Mitarbeiter der Firma Messdienst Klein die Zähler in allen Wohnungen ab. Bitte sorgen Sie dafür, dass an diesem Tag zwischen 8 und 16 Uhr jemand in der Wohnung ist. Wenn niemand öffnet, kommt ein zweiter Termin. Dafür berechnet der Messdienst 25 Euro. Wer nicht zu Hause sein kann, liest die Zähler bitte selbst ab und gibt die Werte bis Freitag, den 13. November, im Büro der Hausverwaltung ab. Das Büro ist montags bis freitags von 9 bis 12 Uhr geöffnet.',
          statement: {
            text: 'Wenn beim ersten Termin niemand öffnet, ist der zweite Termin kostenlos.',
            answer: false
          },
          question: {
            frage: 'Bis wann können Mieter ihre Zählerstände selbst im Büro abgeben?',
            options: ['Bis Freitag, 13. November', 'Bis Dienstag um 8 Uhr', 'Bis Dienstag um 16 Uhr'],
            answer: 0
          }
        }
      ]
    },
    teil4: {
      anweisung: 'Lesen Sie den Text und die Aussagen. Sind die Aussagen richtig oder falsch?',
      titel: 'Verträge: Was Verbraucher wissen sollten',
      text: 'Verträge begegnen uns jeden Tag: beim Handy, beim Strom, im Fitnessstudio oder bei der Versicherung. Diese Broschüre der Verbraucherberatung Südstadt hilft Ihnen, den Überblick zu behalten.\n\nVor der Unterschrift\nLesen Sie jeden Vertrag in Ruhe durch, auch das Kleingedruckte. Achten Sie besonders auf Laufzeit, Kündigungsfrist und Preis. Unterschreiben Sie nie unter Zeitdruck. Fragen Sie nach, wenn Sie etwas nicht verstehen.\n\nWiderruf\nWenn Sie einen Vertrag im Internet oder am Telefon abgeschlossen haben, können Sie ihn in der Regel innerhalb von 14 Tagen widerrufen. Die Frist beginnt, sobald Sie die Vertragsbestätigung erhalten haben. Sie müssen keinen Grund nennen. Es genügt ein kurzes Schreiben, in dem steht, dass Sie den Vertrag widerrufen.\n\nKündigung\nViele Verträge haben eine feste Laufzeit, zum Beispiel 24 Monate. Wer nicht rechtzeitig kündigt, bleibt oft weitere Monate gebunden. Notieren Sie sich deshalb das Ende der Kündigungsfrist im Kalender. Schicken Sie Ihre Kündigung am besten per Einschreiben. Bei einer E-Mail sollten Sie sich den Eingang bestätigen lassen.\n\nHilfe bekommen\nHaben Sie Probleme mit einem Vertrag? Unsere Beraterinnen und Berater prüfen Ihre Unterlagen. Sprechzeiten sind dienstags und donnerstags von 9 bis 12 Uhr. Einen Termin brauchen Sie dafür nicht.',
      statements: [
        {
          text: 'Einen Vertrag, den man im Internet abgeschlossen hat, kann man in der Regel 14 Tage lang widerrufen.',
          answer: true
        },
        { text: 'Wer einen Vertrag widerruft, muss dafür einen Grund angeben.', answer: false },
        {
          text: 'Wer eine Kündigung per E-Mail schickt, sollte sich den Eingang bestätigen lassen.',
          answer: true
        }
      ]
    },
    teil5: {
      anweisung: 'Lesen Sie den Brief. Welches Wort (a, b oder c) passt in die Lücke?',
      text: 'Betreff: Kündigung meiner Hausratversicherung, Vertragsnummer 48 21 77\n\nSehr geehrte Damen und Herren,\n\nhiermit [1] ich meinen Vertrag zum nächstmöglichen Termin. Ich habe die Versicherung vor zwei Jahren abgeschlossen, aber ich kündige, [2] mein Beitrag inzwischen zu hoch geworden ist. Bitte schicken Sie mir [3] Bestätigung der Kündigung schriftlich. Das Geld, das ich zu viel bezahlt habe, überweisen Sie bitte [4] mein Konto bei der Stadtbank. Bei Fragen können Sie [5] gern jederzeit telefonisch bei mir melden. Ich wäre Ihnen dankbar, [6] Sie mir die Kündigung bis Ende des Monats bestätigen könnten.\n\nMit freundlichen Grüßen\nIvan Petrović',
      gaps: [
        { options: ['gekündigt', 'kündigt', 'kündige'], answer: 2 },
        { options: ['dass', 'ob', 'weil'], answer: 2 },
        { options: ['die', 'den', 'der'], answer: 0 },
        { options: ['auf', 'über', 'mit'], answer: 0 },
        { options: ['mich', 'Ihnen', 'sich'], answer: 2 },
        { options: ['wenn', 'ob', 'dass'], answer: 0 }
      ]
    }
  },

  schreiben: {
    anweisung:
      'Wählen Sie Aufgabe A oder Aufgabe B. Zeigen Sie, was Sie können. Schreiben Sie möglichst viel. Vergessen Sie nicht die Anrede und den Gruß.',
    tasks: [
      {
        titel: 'Aufgabe A: Beschwerde an den Kundenservice',
        situation:
          'Vor zwei Wochen haben Sie bei der Firma Funkwelle einen Internetvertrag abgeschlossen. Seitdem funktioniert das Internet in Ihrer Wohnung nur ganz selten. Sie schreiben eine E-Mail an den Kundenservice.',
        leitpunkte: [
          'Nennen Sie Ihre Kundennummer und beschreiben Sie das Problem.',
          'Sagen Sie, was Sie schon selbst versucht haben.',
          'Bitten Sie darum, dass ein Techniker zu Ihnen kommt, und nennen Sie mögliche Termine.',
          'Fragen Sie, ob Sie für die Zeit ohne Internet weniger bezahlen müssen.'
        ],
        musterloesung:
          'Sehr geehrte Damen und Herren,\n\nich habe vor zwei Wochen bei Ihnen einen Internetvertrag abgeschlossen, meine Kundennummer ist 5 4 7 2 1 9. Leider funktioniert das Internet in meiner Wohnung nur ganz selten. Oft ist die Verbindung mehrere Stunden lang weg, und ich kann weder E-Mails schreiben noch im Internet arbeiten.\n\nIch habe schon den Router mehrmals neu gestartet und alle Kabel kontrolliert. Außerdem habe ich Ihre Hotline angerufen, aber das Problem ist geblieben.\n\nDeshalb bitte ich Sie, einen Techniker zu mir zu schicken. Ich bin an den Vormittagen von Dienstag bis Donnerstag zu Hause.\n\nWürden Sie mir außerdem für die Zeit ohne Internet einen Teil der Kosten zurückzahlen? Ich freue mich auf Ihre schnelle Antwort.\n\nMit freundlichen Grüßen\nLuca Bianchi'
      },
      {
        titel: 'Aufgabe B: E-Mail an die Bank',
        situation:
          'Sie haben Ihre Bankkarte verloren und sofort telefonisch über den Sperr-Notruf sperren lassen. Sie haben ein Konto bei der Stadtbank Rheinblick und schreiben eine E-Mail an Ihre Beraterin, Frau Neumann.',
        leitpunkte: [
          'Erklären Sie, was passiert ist, wann und wo.',
          'Sagen Sie, dass Sie die Karte schon telefonisch haben sperren lassen, und bitten Sie um eine schriftliche Bestätigung.',
          'Fragen Sie, wann Sie eine neue Karte bekommen und was sie kostet.',
          'Fragen Sie, wie Sie bis dahin an Bargeld kommen.'
        ],
        musterloesung:
          'Sehr geehrte Frau Neumann,\n\nleider habe ich gestern meine Bankkarte verloren. Ich war am Nachmittag in der Stadt einkaufen und habe zuletzt im Supermarkt in der Bahnhofstraße bezahlt. Als ich später am Geldautomaten Geld abheben wollte, war die Karte nicht mehr in meiner Tasche.\n\nIch habe die Karte noch am selben Abend telefonisch über den Sperr-Notruf sperren lassen. Bitte bestätigen Sie mir die Sperrung schriftlich.\n\nIch möchte außerdem gern wissen, wann ich eine neue Karte bekomme und ob sie etwas kostet. Wie kann ich in der Zwischenzeit Bargeld bekommen? Ich brauche nächste Woche Geld für meine Miete.\n\nVielen Dank für Ihre Hilfe. Bitte antworten Sie mir bald.\n\nMit freundlichen Grüßen\nSofia Petrova'
      }
    ],
    tipps:
      'Cover all four points, each in at least one full sentence. Open with a clear Anrede (Sehr geehrte Frau ... / Sehr geehrte Damen und Herren) and close with Grüße. Give reasons with "weil" and "deshalb", and use polite requests such as "Könnten Sie bitte ...?" or "Ich bitte Sie, ..." to show B1.'
  },

  sprechen: {
    teil1: {
      anweisung:
        'Stellen Sie sich vor. Sprechen Sie über die Stichworte auf Ihrer Karte. Danach stellt Ihnen die Prüferin oder der Prüfer Fragen.',
      nachfragen: [
        'Wie lange wohnen Sie schon in Deutschland?',
        'Was gefällt Ihnen an Ihrer Arbeit oder Ihrem Beruf?',
        'Was machen Sie in Ihrer Freizeit am liebsten?',
        'Welche Sprachen sprechen Sie zu Hause?'
      ],
      redemittel: [
        'Ich heiße ... und komme aus ...',
        'Ich wohne seit ... in ...',
        'Ich arbeite als ... / Ich suche gerade Arbeit als ...',
        'In meiner Familie gibt es ...',
        'Zu Hause sprechen wir ...',
        'In meiner Freizeit ... ich gern ...'
      ]
    },
    teil2: {
      anweisung:
        'Sie bekommen ein Foto. Beschreiben Sie, was Sie sehen und was für eine Situation das ist. Danach stellt Ihnen die Prüferin oder der Prüfer Fragen zu Ihren eigenen Erfahrungen.',
      bilder: [
        {
          beschreibung:
            'Auf dem Foto sieht man eine Frau und einen Mann an einem Küchentisch. Vor ihnen liegen viele Papiere, Briefe und ein Taschenrechner. Die beiden schauen auf einen Laptop und sehen etwas besorgt aus.',
          fragenA2: [
            'Haben Sie zu Hause auch viele Briefe und Rechnungen?',
            'Wer erledigt bei Ihnen den Papierkram?',
            'Was machen Sie mit wichtigen Papieren?'
          ],
          fragenB1: [
            'Wie behalten Sie den Überblick über Ihre Rechnungen und Verträge?',
            'Welche Probleme mit Briefen von Ämtern oder Firmen hatten Sie schon?',
            'Was würden Sie jemandem raten, der neu in Deutschland ist und viel Post bekommt?'
          ]
        },
        {
          beschreibung:
            'Auf dem Foto sieht man eine junge Frau an einem Geldautomaten vor einer Bank. Sie steckt gerade eine Karte in den Automaten. Hinter ihr wartet ein älterer Mann mit einer Tasche.',
          fragenA2: [
            'Gehen Sie oft zum Geldautomaten?',
            'Bezahlen Sie lieber mit Karte oder bar?',
            'Haben Sie ein Konto in Deutschland?'
          ],
          fragenB1: [
            'Welche Vor- und Nachteile hat Online-Banking?',
            'Wie war es für Sie, in Deutschland ein Konto zu eröffnen?',
            'Wie sicher ist Ihrer Meinung nach das Bezahlen mit Karte?'
          ]
        }
      ],
      redemittel: [
        'Auf dem Foto sieht man ...',
        'Im Vordergrund / Im Hintergrund ...',
        'Ich glaube, die Leute sind ... / Das ist wahrscheinlich ...',
        'Bei mir war das so: ...',
        'Ich habe schon einmal ... erlebt.',
        'Meiner Meinung nach ..., weil ...'
      ]
    },
    teil3: {
      situation:
        'Ihre Freundin Mira ist neu in der Stadt. Sie braucht ein Konto und eine Versicherung, kennt sich aber mit den Formularen noch nicht aus. Sie und Ihr Partner oder Ihre Partnerin möchten ihr helfen.',
      aufgabe:
        'Planen Sie gemeinsam, wie Sie Mira helfen. Sprechen Sie über die Punkte und machen Sie Vorschläge.',
      notizen: [
        'Wann gehen wir hin?',
        'Zu welcher Bank?',
        'Welche Papiere braucht Mira?',
        'Wer begleitet Mira?',
        'Treffpunkt und Uhrzeit',
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
