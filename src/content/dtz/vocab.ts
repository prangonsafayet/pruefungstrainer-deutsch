import { type AdjectiveEntry, type NounEntry, type VerbEntry, type VocabBank } from '@shared/types/vocab.ts';

import { DTZ_CASE_ITEMS, DTZ_PREP_VERBS } from './grammar.ts';

/* The DTZ vocabulary bank: integration-course everyday life — Behörde, Wohnen, Arbeit,
   Kita und Schule, Gesundheit, Bank. Ids are persisted SRS keys — never renumber existing
   items. */

export const DTZ_VERBS: readonly VerbEntry[] = [
  {
    id: 'dtz.v.001',
    de: 'sich anmelden',
    en: 'to register, to sign up',
    praesens: 'meldet sich an',
    praeteritum: 'meldete sich an',
    perfekt: 'hat sich angemeldet',
    example: {
      de: 'Ich muss mich beim Einwohnermeldeamt anmelden.',
      en: 'I have to register at the residents’ registration office.'
    }
  },
  {
    id: 'dtz.v.002',
    de: 'sich abmelden',
    en: 'to deregister, to cancel a registration',
    praesens: 'meldet sich ab',
    praeteritum: 'meldete sich ab',
    perfekt: 'hat sich abgemeldet',
    example: {
      de: 'Vor dem Umzug ins Ausland hat er sich bei der Gemeinde abgemeldet.',
      en: 'Before moving abroad he deregistered with the town.'
    }
  },
  {
    id: 'dtz.v.003',
    de: 'beantragen',
    en: 'to apply for (officially)',
    praesens: 'beantragt',
    praeteritum: 'beantragte',
    perfekt: 'hat beantragt',
    example: {
      de: 'Sie hat beim Jobcenter Arbeitslosengeld beantragt.',
      en: 'She applied for unemployment benefit at the Jobcenter.'
    }
  },
  {
    id: 'dtz.v.004',
    de: 'einen Antrag stellen',
    en: 'to submit an application',
    praesens: 'stellt einen Antrag',
    praeteritum: 'stellte einen Antrag',
    perfekt: 'hat einen Antrag gestellt',
    example: {
      de: 'Wir haben einen Antrag auf Kindergeld gestellt.',
      en: 'We submitted an application for child benefit.'
    }
  },
  {
    id: 'dtz.v.005',
    de: 'ausfüllen',
    en: 'to fill in',
    praesens: 'füllt aus',
    praeteritum: 'füllte aus',
    perfekt: 'hat ausgefüllt',
    example: {
      de: 'Bitte füllen Sie das Formular in Druckbuchstaben aus.',
      en: 'Please fill in the form in block letters.'
    }
  },
  {
    id: 'dtz.v.006',
    de: 'unterschreiben',
    en: 'to sign',
    praesens: 'unterschreibt',
    praeteritum: 'unterschrieb',
    perfekt: 'hat unterschrieben',
    example: {
      de: 'Der Vermieter hat den Mietvertrag schon unterschrieben.',
      en: 'The landlord has already signed the rental contract.'
    }
  },
  {
    id: 'dtz.v.007',
    de: 'einreichen',
    en: 'to hand in, to submit',
    praesens: 'reicht ein',
    praeteritum: 'reichte ein',
    perfekt: 'hat eingereicht',
    example: {
      de: 'Sie müssen die Unterlagen bis Freitag einreichen.',
      en: 'You have to hand in the documents by Friday.'
    }
  },
  {
    id: 'dtz.v.008',
    de: 'abgeben',
    en: 'to hand in, to drop off',
    praesens: 'gibt ab',
    praeteritum: 'gab ab',
    perfekt: 'hat abgegeben',
    example: {
      de: 'Ich habe den Antrag gestern im Bürgeramt abgegeben.',
      en: 'I handed in the application at the citizens’ office yesterday.'
    }
  },
  {
    id: 'dtz.v.009',
    de: 'mitbringen',
    en: 'to bring along',
    praesens: 'bringt mit',
    praeteritum: 'brachte mit',
    perfekt: 'hat mitgebracht',
    example: {
      de: 'Bitte bringen Sie Ihren Pass und ein Foto mit.',
      en: 'Please bring your passport and a photo.'
    }
  },
  {
    id: 'dtz.v.010',
    de: 'vorlegen',
    en: 'to present, to show',
    praesens: 'legt vor',
    praeteritum: 'legte vor',
    perfekt: 'hat vorgelegt',
    example: {
      de: 'Sie müssen Ihren Aufenthaltstitel vorlegen.',
      en: 'You have to show your residence permit.'
    }
  },
  {
    id: 'dtz.v.011',
    de: 'verlängern',
    en: 'to extend, to renew',
    praesens: 'verlängert',
    praeteritum: 'verlängerte',
    perfekt: 'hat verlängert',
    example: {
      de: 'Ich möchte meine Aufenthaltserlaubnis verlängern.',
      en: 'I would like to renew my residence permit.'
    }
  },
  {
    id: 'dtz.v.012',
    de: 'bestätigen',
    en: 'to confirm',
    praesens: 'bestätigt',
    praeteritum: 'bestätigte',
    perfekt: 'hat bestätigt',
    example: {
      de: 'Das Amt hat den Termin per E-Mail bestätigt.',
      en: 'The office confirmed the appointment by e-mail.'
    }
  },
  {
    id: 'dtz.v.013',
    de: 'vereinbaren',
    en: 'to arrange, to agree on',
    praesens: 'vereinbart',
    praeteritum: 'vereinbarte',
    perfekt: 'hat vereinbart',
    example: {
      de: 'Ich möchte einen Termin beim Hausarzt vereinbaren.',
      en: 'I would like to arrange an appointment with my family doctor.'
    }
  },
  {
    id: 'dtz.v.014',
    de: 'absagen',
    en: 'to cancel, to call off',
    praesens: 'sagt ab',
    praeteritum: 'sagte ab',
    perfekt: 'hat abgesagt',
    example: {
      de: 'Leider musste ich den Termin absagen.',
      en: 'Unfortunately I had to cancel the appointment.'
    }
  },
  {
    id: 'dtz.v.015',
    de: 'verschieben',
    en: 'to postpone, to move',
    praesens: 'verschiebt',
    praeteritum: 'verschob',
    perfekt: 'hat verschoben',
    example: {
      de: 'Können wir den Termin auf nächste Woche verschieben?',
      en: 'Can we move the appointment to next week?'
    }
  },
  {
    id: 'dtz.v.016',
    de: 'kündigen',
    en: 'to terminate, to give notice',
    praesens: 'kündigt',
    praeteritum: 'kündigte',
    perfekt: 'hat gekündigt',
    example: {
      de: 'Wir haben die Wohnung zum Monatsende gekündigt.',
      en: 'We gave notice on the flat for the end of the month.'
    }
  },
  {
    id: 'dtz.v.017',
    de: 'einziehen',
    en: 'to move in',
    praesens: 'zieht ein',
    praeteritum: 'zog ein',
    perfekt: 'ist eingezogen',
    example: {
      de: 'Wir sind im März in die neue Wohnung eingezogen.',
      en: 'We moved into the new flat in March.'
    }
  },
  {
    id: 'dtz.v.018',
    de: 'ausziehen',
    en: 'to move out',
    praesens: 'zieht aus',
    praeteritum: 'zog aus',
    perfekt: 'ist ausgezogen',
    example: {
      de: 'Meine Nachbarn ziehen Ende des Monats aus.',
      en: 'My neighbours are moving out at the end of the month.'
    }
  },
  {
    id: 'dtz.v.019',
    de: 'umziehen',
    en: 'to move (house)',
    praesens: 'zieht um',
    praeteritum: 'zog um',
    perfekt: 'ist umgezogen',
    example: {
      de: 'Im Sommer sind wir in eine größere Wohnung umgezogen.',
      en: 'In summer we moved into a bigger flat.'
    }
  },
  {
    id: 'dtz.v.020',
    de: 'mieten',
    en: 'to rent (as a tenant)',
    praesens: 'mietet',
    praeteritum: 'mietete',
    perfekt: 'hat gemietet',
    example: { de: 'Wir haben eine Dreizimmerwohnung gemietet.', en: 'We have rented a three-room flat.' }
  },
  {
    id: 'dtz.v.021',
    de: 'vermieten',
    en: 'to rent out',
    praesens: 'vermietet',
    praeteritum: 'vermietete',
    perfekt: 'hat vermietet',
    example: {
      de: 'Der Besitzer vermietet die Wohnung an eine Familie.',
      en: 'The owner rents the flat out to a family.'
    }
  },
  {
    id: 'dtz.v.022',
    de: 'bezahlen',
    en: 'to pay',
    praesens: 'bezahlt',
    praeteritum: 'bezahlte',
    perfekt: 'hat bezahlt',
    example: {
      de: 'Die Miete muss am Monatsanfang bezahlt werden.',
      en: 'The rent has to be paid at the start of the month.'
    }
  },
  {
    id: 'dtz.v.023',
    de: 'überweisen',
    en: 'to transfer (money)',
    praesens: 'überweist',
    praeteritum: 'überwies',
    perfekt: 'hat überwiesen',
    example: {
      de: 'Ich überweise die Miete jeden Monat per Dauerauftrag.',
      en: 'I transfer the rent every month by standing order.'
    }
  },
  {
    id: 'dtz.v.024',
    de: 'zurückzahlen',
    en: 'to pay back',
    praesens: 'zahlt zurück',
    praeteritum: 'zahlte zurück',
    perfekt: 'hat zurückgezahlt',
    example: { de: 'Der Vermieter hat die Kaution zurückgezahlt.', en: 'The landlord paid back the deposit.' }
  },
  {
    id: 'dtz.v.025',
    de: 'nachzahlen',
    en: 'to pay an additional amount',
    praesens: 'zahlt nach',
    praeteritum: 'zahlte nach',
    perfekt: 'hat nachgezahlt',
    example: {
      de: 'Wegen der Abrechnung muss ich Nebenkosten nachzahlen.',
      en: 'Because of the statement I have to pay extra utility costs.'
    }
  },
  {
    id: 'dtz.v.026',
    de: 'abbuchen',
    en: 'to debit (from an account)',
    praesens: 'bucht ab',
    praeteritum: 'buchte ab',
    perfekt: 'hat abgebucht',
    example: {
      de: 'Die Krankenkasse bucht den Beitrag jeden Monat ab.',
      en: 'The health insurer debits the contribution every month.'
    }
  },
  {
    id: 'dtz.v.027',
    de: 'ein Konto eröffnen',
    en: 'to open an account',
    praesens: 'eröffnet ein Konto',
    praeteritum: 'eröffnete ein Konto',
    perfekt: 'hat ein Konto eröffnet',
    example: {
      de: 'Ich möchte bei Ihrer Bank ein Konto eröffnen.',
      en: 'I would like to open an account at your bank.'
    }
  },
  {
    id: 'dtz.v.028',
    de: 'sparen',
    en: 'to save (money)',
    praesens: 'spart',
    praeteritum: 'sparte',
    perfekt: 'hat gespart',
    example: { de: 'Wir sparen jeden Monat hundert Euro.', en: 'We save a hundred euros every month.' }
  },
  {
    id: 'dtz.v.029',
    de: 'versichern',
    en: 'to insure',
    praesens: 'versichert',
    praeteritum: 'versicherte',
    perfekt: 'hat versichert',
    example: { de: 'Das Fahrrad ist gegen Diebstahl versichert.', en: 'The bike is insured against theft.' }
  },
  {
    id: 'dtz.v.030',
    de: 'sich krankmelden',
    en: 'to report sick',
    praesens: 'meldet sich krank',
    praeteritum: 'meldete sich krank',
    perfekt: 'hat sich krankgemeldet',
    example: {
      de: 'Ich habe mich heute bei meinem Chef krankgemeldet.',
      en: 'I reported sick to my boss today.'
    }
  },
  {
    id: 'dtz.v.031',
    de: 'sich bewerben',
    en: 'to apply (for a job)',
    praesens: 'bewirbt sich',
    praeteritum: 'bewarb sich',
    perfekt: 'hat sich beworben',
    example: {
      de: 'Ich habe mich um eine Stelle als Pflegehelferin beworben.',
      en: 'I applied for a job as a care assistant.'
    }
  },
  {
    id: 'dtz.v.032',
    de: 'einstellen',
    en: 'to hire',
    praesens: 'stellt ein',
    praeteritum: 'stellte ein',
    perfekt: 'hat eingestellt',
    example: { de: 'Die Firma hat mich als Fahrer eingestellt.', en: 'The company hired me as a driver.' }
  },
  {
    id: 'dtz.v.033',
    de: 'verdienen',
    en: 'to earn',
    praesens: 'verdient',
    praeteritum: 'verdiente',
    perfekt: 'hat verdient',
    example: {
      de: 'Als Lagerarbeiter verdient man etwa zweitausend Euro.',
      en: 'As a warehouse worker you earn about two thousand euros.'
    }
  },
  {
    id: 'dtz.v.034',
    de: 'sich arbeitslos melden',
    en: 'to register as unemployed',
    praesens: 'meldet sich arbeitslos',
    praeteritum: 'meldete sich arbeitslos',
    perfekt: 'hat sich arbeitslos gemeldet',
    example: {
      de: 'Er hat sich gestern beim Jobcenter arbeitslos gemeldet.',
      en: 'He registered as unemployed at the Jobcenter yesterday.'
    }
  },
  {
    id: 'dtz.v.035',
    de: 'sich vorstellen',
    en: 'to introduce oneself, to have an interview',
    praesens: 'stellt sich vor',
    praeteritum: 'stellte sich vor',
    perfekt: 'hat sich vorgestellt',
    example: {
      de: 'Morgen stelle ich mich bei einer Firma vor.',
      en: 'Tomorrow I have an interview at a company.'
    }
  },
  {
    id: 'dtz.v.036',
    de: 'verlieren',
    en: 'to lose',
    praesens: 'verliert',
    praeteritum: 'verlor',
    perfekt: 'hat verloren',
    example: {
      de: 'Er hat seine Arbeit wegen der Schließung verloren.',
      en: 'He lost his job because of the closure.'
    }
  },
  {
    id: 'dtz.v.037',
    de: 'vertreten',
    en: 'to stand in for',
    praesens: 'vertritt',
    praeteritum: 'vertrat',
    perfekt: 'hat vertreten',
    example: {
      de: 'Meine Kollegin vertritt mich in der nächsten Woche.',
      en: 'My colleague is standing in for me next week.'
    }
  },
  {
    id: 'dtz.v.038',
    de: 'sich verspäten',
    en: 'to be late',
    praesens: 'verspätet sich',
    praeteritum: 'verspätete sich',
    perfekt: 'hat sich verspätet',
    example: { de: 'Der Bus hat sich zehn Minuten verspätet.', en: 'The bus was ten minutes late.' }
  },
  {
    id: 'dtz.v.039',
    de: 'ausfallen',
    en: 'to be cancelled, to not take place',
    praesens: 'fällt aus',
    praeteritum: 'fiel aus',
    perfekt: 'ist ausgefallen',
    example: { de: 'Der Deutschkurs fällt morgen aus.', en: 'The German course is cancelled tomorrow.' }
  },
  {
    id: 'dtz.v.040',
    de: 'stattfinden',
    en: 'to take place',
    praesens: 'findet statt',
    praeteritum: 'fand statt',
    perfekt: 'hat stattgefunden',
    example: {
      de: 'Der Elternabend findet am Dienstag statt.',
      en: 'The parents’ evening takes place on Tuesday.'
    }
  },
  {
    id: 'dtz.v.041',
    de: 'teilnehmen',
    en: 'to take part',
    praesens: 'nimmt teil',
    praeteritum: 'nahm teil',
    perfekt: 'hat teilgenommen',
    example: {
      de: 'Alle Eltern sollen am Elternabend teilnehmen.',
      en: 'All parents should take part in the parents’ evening.'
    }
  },
  {
    id: 'dtz.v.042',
    de: 'einladen',
    en: 'to invite',
    praesens: 'lädt ein',
    praeteritum: 'lud ein',
    perfekt: 'hat eingeladen',
    example: {
      de: 'Die Schule lädt die Eltern zu einem Fest ein.',
      en: 'The school invites the parents to a party.'
    }
  },
  {
    id: 'dtz.v.043',
    de: 'abholen',
    en: 'to pick up',
    praesens: 'holt ab',
    praeteritum: 'holte ab',
    perfekt: 'hat abgeholt',
    example: {
      de: 'Ich hole mein Kind um vier Uhr von der Kita ab.',
      en: 'I pick up my child from the daycare at four o’clock.'
    }
  },
  {
    id: 'dtz.v.044',
    de: 'bringen',
    en: 'to bring, to take',
    praesens: 'bringt',
    praeteritum: 'brachte',
    perfekt: 'hat gebracht',
    example: {
      de: 'Ich bringe meine Tochter jeden Morgen in den Kindergarten.',
      en: 'I take my daughter to kindergarten every morning.'
    }
  },
  {
    id: 'dtz.v.045',
    de: 'betreuen',
    en: 'to look after, to supervise',
    praesens: 'betreut',
    praeteritum: 'betreute',
    perfekt: 'hat betreut',
    example: {
      de: 'In der Kita werden die Kinder von Erzieherinnen betreut.',
      en: 'In the daycare the children are looked after by educators.'
    }
  },
  {
    id: 'dtz.v.046',
    de: 'erziehen',
    en: 'to bring up, to raise',
    praesens: 'erzieht',
    praeteritum: 'erzog',
    perfekt: 'hat erzogen',
    example: {
      de: 'Sie haben ihre Kinder zweisprachig erzogen.',
      en: 'They raised their children bilingually.'
    }
  },
  {
    id: 'dtz.v.047',
    de: 'unterrichten',
    en: 'to teach',
    praesens: 'unterrichtet',
    praeteritum: 'unterrichtete',
    perfekt: 'hat unterrichtet',
    example: {
      de: 'Frau Berger unterrichtet Mathematik in der Grundschule.',
      en: 'Ms Berger teaches maths at the primary school.'
    }
  },
  {
    id: 'dtz.v.048',
    de: 'sich entschuldigen',
    en: 'to apologise, to excuse oneself',
    praesens: 'entschuldigt sich',
    praeteritum: 'entschuldigte sich',
    perfekt: 'hat sich entschuldigt',
    example: {
      de: 'Ich möchte mich für die Verspätung entschuldigen.',
      en: 'I would like to apologise for being late.'
    }
  },
  {
    id: 'dtz.v.049',
    de: 'entschuldigen',
    en: 'to excuse (someone)',
    praesens: 'entschuldigt',
    praeteritum: 'entschuldigte',
    perfekt: 'hat entschuldigt',
    example: {
      de: 'Ich habe meinen Sohn bei der Lehrerin entschuldigt.',
      en: 'I excused my son with the teacher.'
    }
  },
  {
    id: 'dtz.v.050',
    de: 'anrufen',
    en: 'to call',
    praesens: 'ruft an',
    praeteritum: 'rief an',
    perfekt: 'hat angerufen',
    example: { de: 'Bitte rufen Sie morgen wieder an.', en: 'Please call again tomorrow.' }
  },
  {
    id: 'dtz.v.051',
    de: 'zurückrufen',
    en: 'to call back',
    praesens: 'ruft zurück',
    praeteritum: 'rief zurück',
    perfekt: 'hat zurückgerufen',
    example: {
      de: 'Die Sekretärin hat versprochen, mich zurückzurufen.',
      en: 'The secretary promised to call me back.'
    }
  },
  {
    id: 'dtz.v.052',
    de: 'erreichen',
    en: 'to reach, to get hold of',
    praesens: 'erreicht',
    praeteritum: 'erreichte',
    perfekt: 'hat erreicht',
    example: {
      de: 'Sie erreichen uns montags bis freitags von 8 bis 16 Uhr.',
      en: 'You can reach us Monday to Friday from 8 to 4.'
    }
  },
  {
    id: 'dtz.v.053',
    de: 'mitteilen',
    en: 'to inform, to let someone know',
    praesens: 'teilt mit',
    praeteritum: 'teilte mit',
    perfekt: 'hat mitgeteilt',
    example: { de: 'Bitte teilen Sie uns Ihre neue Adresse mit.', en: 'Please let us know your new address.' }
  },
  {
    id: 'dtz.v.054',
    de: 'benachrichtigen',
    en: 'to notify',
    praesens: 'benachrichtigt',
    praeteritum: 'benachrichtigte',
    perfekt: 'hat benachrichtigt',
    example: {
      de: 'Wir benachrichtigen Sie, sobald Ihr Paket da ist.',
      en: 'We will notify you as soon as your parcel arrives.'
    }
  },
  {
    id: 'dtz.v.055',
    de: 'anbieten',
    en: 'to offer',
    praesens: 'bietet an',
    praeteritum: 'bot an',
    perfekt: 'hat angeboten',
    example: {
      de: 'Die Volkshochschule bietet günstige Sprachkurse an.',
      en: 'The adult education centre offers cheap language courses.'
    }
  },
  {
    id: 'dtz.v.056',
    de: 'informieren',
    en: 'to inform',
    praesens: 'informiert',
    praeteritum: 'informierte',
    perfekt: 'hat informiert',
    example: {
      de: 'Die Stadt informiert die Bürger über die Baustelle.',
      en: 'The city informs the citizens about the building site.'
    }
  },
  {
    id: 'dtz.v.057',
    de: 'beraten',
    en: 'to advise',
    praesens: 'berät',
    praeteritum: 'beriet',
    perfekt: 'hat beraten',
    example: {
      de: 'Die Mitarbeiterin hat uns freundlich beraten.',
      en: 'The employee advised us in a friendly way.'
    }
  },
  {
    id: 'dtz.v.058',
    de: 'empfehlen',
    en: 'to recommend',
    praesens: 'empfiehlt',
    praeteritum: 'empfahl',
    perfekt: 'hat empfohlen',
    example: { de: 'Der Arzt hat mir eine Kur empfohlen.', en: 'The doctor recommended a cure to me.' }
  },
  {
    id: 'dtz.v.059',
    de: 'verschreiben',
    en: 'to prescribe',
    praesens: 'verschreibt',
    praeteritum: 'verschrieb',
    perfekt: 'hat verschrieben',
    example: {
      de: 'Die Ärztin hat mir ein Medikament verschrieben.',
      en: 'The doctor prescribed me a medicine.'
    }
  },
  {
    id: 'dtz.v.060',
    de: 'untersuchen',
    en: 'to examine',
    praesens: 'untersucht',
    praeteritum: 'untersuchte',
    perfekt: 'hat untersucht',
    example: {
      de: 'Der Arzt hat das Kind gründlich untersucht.',
      en: 'The doctor examined the child thoroughly.'
    }
  },
  {
    id: 'dtz.v.061',
    de: 'behandeln',
    en: 'to treat',
    praesens: 'behandelt',
    praeteritum: 'behandelte',
    perfekt: 'hat behandelt',
    example: { de: 'Der Zahnarzt behandelt den Zahn heute.', en: 'The dentist is treating the tooth today.' }
  },
  {
    id: 'dtz.v.062',
    de: 'sich impfen lassen',
    en: 'to get vaccinated',
    praesens: 'lässt sich impfen',
    praeteritum: 'ließ sich impfen',
    perfekt: 'hat sich impfen lassen',
    example: { de: 'Wir haben uns vor der Reise impfen lassen.', en: 'We got vaccinated before the trip.' }
  },
  {
    id: 'dtz.v.063',
    de: 'einnehmen',
    en: 'to take (medicine)',
    praesens: 'nimmt ein',
    praeteritum: 'nahm ein',
    perfekt: 'hat eingenommen',
    example: {
      de: 'Nehmen Sie die Tabletten dreimal täglich ein.',
      en: 'Take the tablets three times a day.'
    }
  },
  {
    id: 'dtz.v.064',
    de: 'sich erholen',
    en: 'to recover, to rest',
    praesens: 'erholt sich',
    praeteritum: 'erholte sich',
    perfekt: 'hat sich erholt',
    example: {
      de: 'Nach der Grippe muss ich mich noch erholen.',
      en: 'After the flu I still have to recover.'
    }
  },
  {
    id: 'dtz.v.065',
    de: 'sich ärgern',
    en: 'to be annoyed',
    praesens: 'ärgert sich',
    praeteritum: 'ärgerte sich',
    perfekt: 'hat sich geärgert',
    example: {
      de: 'Ich habe mich über die hohe Nachzahlung geärgert.',
      en: 'I was annoyed about the high extra payment.'
    }
  },
  {
    id: 'dtz.v.066',
    de: 'sich beschweren',
    en: 'to complain',
    praesens: 'beschwert sich',
    praeteritum: 'beschwerte sich',
    perfekt: 'hat sich beschwert',
    example: {
      de: 'Die Mieter haben sich über den Lärm beschwert.',
      en: 'The tenants complained about the noise.'
    }
  },
  {
    id: 'dtz.v.067',
    de: 'reparieren',
    en: 'to repair',
    praesens: 'repariert',
    praeteritum: 'reparierte',
    perfekt: 'hat repariert',
    example: {
      de: 'Der Hausmeister repariert morgen die Heizung.',
      en: 'The caretaker is repairing the heating tomorrow.'
    }
  },
  {
    id: 'dtz.v.068',
    de: 'melden',
    en: 'to report, to notify',
    praesens: 'meldet',
    praeteritum: 'meldete',
    perfekt: 'hat gemeldet',
    example: {
      de: 'Bitte melden Sie den Schaden sofort dem Vermieter.',
      en: 'Please report the damage to the landlord straight away.'
    }
  },
  {
    id: 'dtz.v.069',
    de: 'lüften',
    en: 'to air, to ventilate',
    praesens: 'lüftet',
    praeteritum: 'lüftete',
    perfekt: 'hat gelüftet',
    example: {
      de: 'Man soll das Zimmer mehrmals am Tag lüften.',
      en: 'You should air the room several times a day.'
    }
  },
  {
    id: 'dtz.v.070',
    de: 'trennen',
    en: 'to separate (waste)',
    praesens: 'trennt',
    praeteritum: 'trennte',
    perfekt: 'hat getrennt',
    example: { de: 'In Deutschland trennt man den Müll.', en: 'In Germany people separate their rubbish.' }
  },
  {
    id: 'dtz.v.071',
    de: 'verpassen',
    en: 'to miss (a train, a deadline)',
    praesens: 'verpasst',
    praeteritum: 'verpasste',
    perfekt: 'hat verpasst',
    example: { de: 'Ich habe den Zug leider verpasst.', en: 'Unfortunately I missed the train.' }
  },
  {
    id: 'dtz.v.072',
    de: 'umsteigen',
    en: 'to change (trains, buses)',
    praesens: 'steigt um',
    praeteritum: 'stieg um',
    perfekt: 'ist umgestiegen',
    example: {
      de: 'In Frankfurt müssen Sie in den ICE umsteigen.',
      en: 'In Frankfurt you have to change to the ICE.'
    }
  },
  {
    id: 'dtz.v.073',
    de: 'abfahren',
    en: 'to depart',
    praesens: 'fährt ab',
    praeteritum: 'fuhr ab',
    perfekt: 'ist abgefahren',
    example: {
      de: 'Der Zug fährt um 8.15 Uhr von Gleis 3 ab.',
      en: 'The train departs at 8.15 from platform 3.'
    }
  },
  {
    id: 'dtz.v.074',
    de: 'ankommen',
    en: 'to arrive',
    praesens: 'kommt an',
    praeteritum: 'kam an',
    perfekt: 'ist angekommen',
    example: { de: 'Wir sind pünktlich in Hamburg angekommen.', en: 'We arrived in Hamburg on time.' }
  },
  {
    id: 'dtz.v.075',
    de: 'einsteigen',
    en: 'to get on',
    praesens: 'steigt ein',
    praeteritum: 'stieg ein',
    perfekt: 'ist eingestiegen',
    example: { de: 'Bitte steigen Sie hinten in den Bus ein.', en: 'Please get on the bus at the back.' }
  },
  {
    id: 'dtz.v.076',
    de: 'aussteigen',
    en: 'to get off',
    praesens: 'steigt aus',
    praeteritum: 'stieg aus',
    perfekt: 'ist ausgestiegen',
    example: { de: 'Ich steige an der nächsten Haltestelle aus.', en: 'I get off at the next stop.' }
  },
  {
    id: 'dtz.v.077',
    de: 'kontrollieren',
    en: 'to check, to inspect',
    praesens: 'kontrolliert',
    praeteritum: 'kontrollierte',
    perfekt: 'hat kontrolliert',
    example: { de: 'Der Schaffner hat meine Fahrkarte kontrolliert.', en: 'The conductor checked my ticket.' }
  },
  {
    id: 'dtz.v.078',
    de: 'umtauschen',
    en: 'to exchange (goods)',
    praesens: 'tauscht um',
    praeteritum: 'tauschte um',
    perfekt: 'hat umgetauscht',
    example: {
      de: 'Ich möchte die Jacke gegen eine größere umtauschen.',
      en: 'I would like to exchange the jacket for a bigger one.'
    }
  },
  {
    id: 'dtz.v.079',
    de: 'zurückgeben',
    en: 'to return, to give back',
    praesens: 'gibt zurück',
    praeteritum: 'gab zurück',
    perfekt: 'hat zurückgegeben',
    example: {
      de: 'In diesem Geschäft kannst du den Pullover innerhalb von zwei Wochen zurückgeben.',
      en: 'In this shop you can return the sweater within two weeks.'
    }
  },
  {
    id: 'dtz.v.080',
    de: 'bestellen',
    en: 'to order',
    praesens: 'bestellt',
    praeteritum: 'bestellte',
    perfekt: 'hat bestellt',
    example: {
      de: 'Wir haben die Möbel im Internet bestellt.',
      en: 'We ordered the furniture on the internet.'
    }
  },
  {
    id: 'dtz.v.081',
    de: 'liefern',
    en: 'to deliver',
    praesens: 'liefert',
    praeteritum: 'lieferte',
    perfekt: 'hat geliefert',
    example: {
      de: 'Die Firma liefert die Waschmaschine am Dienstag.',
      en: 'The company delivers the washing machine on Tuesday.'
    }
  },
  {
    id: 'dtz.v.082',
    de: 'vergleichen',
    en: 'to compare',
    praesens: 'vergleicht',
    praeteritum: 'verglich',
    perfekt: 'hat verglichen',
    example: {
      de: 'Vergleichen Sie die Preise, bevor Sie einen Vertrag abschließen.',
      en: 'Compare the prices before you sign a contract.'
    }
  },
  {
    id: 'dtz.v.083',
    de: 'abschließen',
    en: 'to conclude (a contract)',
    praesens: 'schließt ab',
    praeteritum: 'schloss ab',
    perfekt: 'hat abgeschlossen',
    example: {
      de: 'Wir haben eine Hausratversicherung abgeschlossen.',
      en: 'We took out a household contents insurance.'
    }
  },
  {
    id: 'dtz.v.084',
    de: 'sich integrieren',
    en: 'to integrate',
    praesens: 'integriert sich',
    praeteritum: 'integrierte sich',
    perfekt: 'hat sich integriert',
    example: {
      de: 'Durch den Kurs hat sie sich schnell integriert.',
      en: 'Through the course she integrated quickly.'
    }
  },
  {
    id: 'dtz.v.085',
    de: 'einbürgern',
    en: 'to naturalise',
    praesens: 'bürgert ein',
    praeteritum: 'bürgerte ein',
    perfekt: 'hat eingebürgert',
    example: { de: 'Nach acht Jahren wurde er eingebürgert.', en: 'After eight years he was naturalised.' }
  },
  {
    id: 'dtz.v.086',
    de: 'wählen',
    en: 'to vote, to choose',
    praesens: 'wählt',
    praeteritum: 'wählte',
    perfekt: 'hat gewählt',
    example: {
      de: 'Deutsche Staatsangehörige dürfen ab 18 Jahren den Bundestag wählen.',
      en: 'German citizens may vote for the Bundestag from the age of 18.'
    }
  },
  {
    id: 'dtz.v.087',
    de: 'bestehen',
    en: 'to pass (an exam)',
    praesens: 'besteht',
    praeteritum: 'bestand',
    perfekt: 'hat bestanden',
    example: {
      de: 'Sie hat die Prüfung im ersten Versuch bestanden.',
      en: 'She passed the exam on the first try.'
    }
  },
  {
    id: 'dtz.v.088',
    de: 'sich anstrengen',
    en: 'to make an effort',
    praesens: 'strengt sich an',
    praeteritum: 'strengte sich an',
    perfekt: 'hat sich angestrengt',
    example: {
      de: 'Er hat sich sehr angestrengt und viel geübt.',
      en: 'He made a big effort and practised a lot.'
    }
  },
  {
    id: 'dtz.v.089',
    de: 'wiederholen',
    en: 'to repeat, to review',
    praesens: 'wiederholt',
    praeteritum: 'wiederholte',
    perfekt: 'hat wiederholt',
    example: { de: 'Könnten Sie das bitte wiederholen?', en: 'Could you please repeat that?' }
  },
  {
    id: 'dtz.v.090',
    de: 'verstehen',
    en: 'to understand',
    praesens: 'versteht',
    praeteritum: 'verstand',
    perfekt: 'hat verstanden',
    example: { de: 'Ich habe die Durchsage nicht verstanden.', en: 'I did not understand the announcement.' }
  },
  {
    id: 'dtz.v.091',
    de: 'sich verabreden',
    en: 'to arrange to meet',
    praesens: 'verabredet sich',
    praeteritum: 'verabredete sich',
    perfekt: 'hat sich verabredet',
    example: {
      de: 'Wir haben uns für Samstag im Park verabredet.',
      en: 'We arranged to meet in the park on Saturday.'
    }
  },
  {
    id: 'dtz.v.092',
    de: 'vorschlagen',
    en: 'to suggest',
    praesens: 'schlägt vor',
    praeteritum: 'schlug vor',
    perfekt: 'hat vorgeschlagen',
    example: { de: 'Ich schlage vor, dass wir zusammen kochen.', en: 'I suggest that we cook together.' }
  },
  {
    id: 'dtz.v.093',
    de: 'zustimmen',
    en: 'to agree',
    praesens: 'stimmt zu',
    praeteritum: 'stimmte zu',
    perfekt: 'hat zugestimmt',
    example: { de: 'Alle haben dem Vorschlag zugestimmt.', en: 'Everyone agreed to the suggestion.' }
  }
];

export const DTZ_NOUNS: readonly NounEntry[] = [
  {
    id: 'dtz.n.001',
    de: 'Antrag',
    en: 'application, request',
    article: 'der',
    plural: 'die Anträge',
    example: {
      de: 'Den Antrag müssen Sie persönlich abgeben.',
      en: 'You have to hand in the application in person.'
    }
  },
  {
    id: 'dtz.n.002',
    de: 'Formular',
    en: 'form',
    article: 'das',
    plural: 'die Formulare',
    example: { de: 'Das Formular gibt es auch online.', en: 'The form is also available online.' }
  },
  {
    id: 'dtz.n.003',
    de: 'Unterlage',
    en: 'document (supporting)',
    article: 'die',
    plural: 'die Unterlagen (meist nur im Plural)',
    example: {
      de: 'Bitte bringen Sie alle Unterlagen zum Termin mit.',
      en: 'Please bring all documents to the appointment.'
    }
  },
  {
    id: 'dtz.n.004',
    de: 'Bescheinigung',
    en: 'certificate, confirmation',
    article: 'die',
    plural: 'die Bescheinigungen',
    example: {
      de: 'Für das Amt brauche ich eine Bescheinigung vom Arbeitgeber.',
      en: 'For the office I need a confirmation from my employer.'
    }
  },
  {
    id: 'dtz.n.005',
    de: 'Nachweis',
    en: 'proof',
    article: 'der',
    plural: 'die Nachweise',
    example: { de: 'Als Nachweis genügt eine Kopie.', en: 'A copy is enough as proof.' }
  },
  {
    id: 'dtz.n.006',
    de: 'Frist',
    en: 'deadline',
    article: 'die',
    plural: 'die Fristen',
    example: {
      de: 'Die Frist für den Antrag endet am 31. März.',
      en: 'The deadline for the application ends on 31 March.'
    }
  },
  {
    id: 'dtz.n.007',
    de: 'Gebühr',
    en: 'fee',
    article: 'die',
    plural: 'die Gebühren',
    example: {
      de: 'Für den neuen Ausweis müssen Sie eine Gebühr bezahlen.',
      en: 'For the new ID you have to pay a fee.'
    }
  },
  {
    id: 'dtz.n.008',
    de: 'Bescheid',
    en: 'official notice, decision',
    article: 'der',
    plural: 'die Bescheide',
    example: {
      de: 'Der Bescheid kommt in etwa zwei Wochen per Post.',
      en: 'The notice arrives by post in about two weeks.'
    }
  },
  {
    id: 'dtz.n.009',
    de: 'Widerspruch',
    en: 'objection',
    article: 'der',
    plural: 'die Widersprüche',
    example: {
      de: 'Gegen den Bescheid kann man Widerspruch einlegen.',
      en: 'You can lodge an objection against the notice.'
    }
  },
  {
    id: 'dtz.n.010',
    de: 'Behörde',
    en: 'public authority',
    article: 'die',
    plural: 'die Behörden',
    example: {
      de: 'Viele Behörden sind nachmittags geschlossen.',
      en: 'Many authorities are closed in the afternoon.'
    }
  },
  {
    id: 'dtz.n.011',
    de: 'Amt',
    en: 'office (public)',
    article: 'das',
    plural: 'die Ämter',
    example: {
      de: 'Das Amt hat montags und donnerstags geöffnet.',
      en: 'The office is open on Mondays and Thursdays.'
    }
  },
  {
    id: 'dtz.n.012',
    de: 'Einwohnermeldeamt',
    en: 'residents’ registration office',
    article: 'das',
    plural: 'die Einwohnermeldeämter',
    example: {
      de: 'Im Einwohnermeldeamt bekommt man die Meldebescheinigung.',
      en: 'At the registration office you get the certificate of registration.'
    }
  },
  {
    id: 'dtz.n.013',
    de: 'Ausländerbehörde',
    en: 'immigration office',
    article: 'die',
    plural: 'die Ausländerbehörden',
    example: {
      de: 'Die Ausländerbehörde verlängert meine Aufenthaltserlaubnis.',
      en: 'The immigration office renews my residence permit.'
    }
  },
  {
    id: 'dtz.n.014',
    de: 'Aufenthaltserlaubnis',
    en: 'residence permit',
    article: 'die',
    plural: 'die Aufenthaltserlaubnisse',
    example: {
      de: 'Meine Aufenthaltserlaubnis gilt noch bis Juni.',
      en: 'My residence permit is valid until June.'
    }
  },
  {
    id: 'dtz.n.015',
    de: 'Jobcenter',
    en: 'Jobcenter (employment office)',
    article: 'das',
    plural: 'die Jobcenter',
    example: {
      de: 'Das Jobcenter hat mir einen Sprachkurs angeboten.',
      en: 'The Jobcenter offered me a language course.'
    }
  },
  {
    id: 'dtz.n.016',
    de: 'Agentur für Arbeit',
    en: 'employment agency',
    article: 'die',
    plural: 'die Agenturen für Arbeit',
    example: {
      de: 'Die Agentur für Arbeit hilft bei der Stellensuche.',
      en: 'The employment agency helps with the job search.'
    }
  },
  {
    id: 'dtz.n.017',
    de: 'Arbeitslosengeld',
    en: 'unemployment benefit',
    article: 'das',
    plural: '– (nur Singular)',
    example: {
      de: 'Er bekommt seit drei Monaten Arbeitslosengeld.',
      en: 'He has received unemployment benefit for three months.'
    }
  },
  {
    id: 'dtz.n.018',
    de: 'Kindergeld',
    en: 'child benefit',
    article: 'das',
    plural: '– (nur Singular)',
    example: {
      de: 'Das Kindergeld wird jeden Monat überwiesen.',
      en: 'The child benefit is transferred every month.'
    }
  },
  {
    id: 'dtz.n.019',
    de: 'Standesamt',
    en: 'registry office',
    article: 'das',
    plural: 'die Standesämter',
    example: {
      de: 'Das Standesamt stellt die Geburtsurkunde aus.',
      en: 'The registry office issues the birth certificate.'
    }
  },
  {
    id: 'dtz.n.020',
    de: 'Finanzamt',
    en: 'tax office',
    article: 'das',
    plural: 'die Finanzämter',
    example: {
      de: 'Die Steuererklärung geht an das Finanzamt.',
      en: 'The tax return goes to the tax office.'
    }
  },
  {
    id: 'dtz.n.021',
    de: 'Steuererklärung',
    en: 'tax return',
    article: 'die',
    plural: 'die Steuererklärungen',
    example: {
      de: 'Bis Juli muss ich meine Steuererklärung abgeben.',
      en: 'I have to submit my tax return by July.'
    }
  },
  {
    id: 'dtz.n.022',
    de: 'Krankenkasse',
    en: 'health insurance fund',
    article: 'die',
    plural: 'die Krankenkassen',
    example: {
      de: 'Meine Krankenkasse übernimmt die Kosten für die Brille.',
      en: 'My health insurer covers the cost of the glasses.'
    }
  },
  {
    id: 'dtz.n.023',
    de: 'Versicherungskarte',
    en: 'insurance card',
    article: 'die',
    plural: 'die Versicherungskarten',
    example: {
      de: 'Bitte bringen Sie Ihre Versicherungskarte zum Arzt mit.',
      en: 'Please bring your insurance card to the doctor.'
    }
  },
  {
    id: 'dtz.n.024',
    de: 'Krankmeldung',
    en: 'sick note, notice of sickness',
    article: 'die',
    plural: 'die Krankmeldungen',
    example: {
      de: 'Die Krankmeldung muss der Arbeitgeber bekommen.',
      en: 'The employer has to receive the sick note.'
    }
  },
  {
    id: 'dtz.n.025',
    de: 'Termin',
    en: 'appointment',
    article: 'der',
    plural: 'die Termine',
    example: {
      de: 'Ich habe am Dienstag einen Termin beim Zahnarzt.',
      en: 'I have an appointment at the dentist on Tuesday.'
    }
  },
  {
    id: 'dtz.n.026',
    de: 'Sprechzeit',
    en: 'office hours, consultation hours',
    article: 'die',
    plural: 'die Sprechzeiten',
    example: {
      de: 'Die Sprechzeiten finden Sie auf unserer Website.',
      en: 'You can find the consultation hours on our website.'
    }
  },
  {
    id: 'dtz.n.027',
    de: 'Öffnungszeit',
    en: 'opening hours',
    article: 'die',
    plural: 'die Öffnungszeiten',
    example: { de: 'Die Öffnungszeiten der Bank sind neu.', en: 'The bank’s opening hours are new.' }
  },
  {
    id: 'dtz.n.028',
    de: 'Wartezeit',
    en: 'waiting time',
    article: 'die',
    plural: 'die Wartezeiten',
    example: {
      de: 'Die Wartezeit beim Amt beträgt oft eine Stunde.',
      en: 'The waiting time at the office is often an hour.'
    }
  },
  {
    id: 'dtz.n.029',
    de: 'Ausweis',
    en: 'ID card',
    article: 'der',
    plural: 'die Ausweise',
    example: { de: 'Bitte zeigen Sie Ihren Ausweis am Eingang.', en: 'Please show your ID at the entrance.' }
  },
  {
    id: 'dtz.n.030',
    de: 'Pass',
    en: 'passport',
    article: 'der',
    plural: 'die Pässe',
    example: { de: 'Mein Pass ist noch zwei Jahre gültig.', en: 'My passport is still valid for two years.' }
  },
  {
    id: 'dtz.n.031',
    de: 'Foto',
    en: 'photo',
    article: 'das',
    plural: 'die Fotos',
    example: {
      de: 'Für den Antrag brauchen Sie ein biometrisches Foto.',
      en: 'For the application you need a biometric photo.'
    }
  },
  {
    id: 'dtz.n.032',
    de: 'Anmeldung',
    en: 'registration',
    article: 'die',
    plural: 'die Anmeldungen',
    example: {
      de: 'Die Anmeldung ist bis zum 15. September möglich.',
      en: 'Registration is possible until 15 September.'
    }
  },
  {
    id: 'dtz.n.033',
    de: 'Unterschrift',
    en: 'signature',
    article: 'die',
    plural: 'die Unterschriften',
    example: {
      de: 'Auf dem Vertrag fehlt noch Ihre Unterschrift.',
      en: 'Your signature is still missing on the contract.'
    }
  },
  {
    id: 'dtz.n.034',
    de: 'Mietvertrag',
    en: 'rental contract',
    article: 'der',
    plural: 'die Mietverträge',
    example: {
      de: 'Im Mietvertrag steht, wie hoch die Kaution ist.',
      en: 'The rental contract states how high the deposit is.'
    }
  },
  {
    id: 'dtz.n.035',
    de: 'Miete',
    en: 'rent',
    article: 'die',
    plural: 'die Mieten',
    example: { de: 'Die Miete für die Wohnung beträgt 650 Euro.', en: 'The rent for the flat is 650 euros.' }
  },
  {
    id: 'dtz.n.036',
    de: 'Kaution',
    en: 'deposit',
    article: 'die',
    plural: 'die Kautionen',
    example: {
      de: 'Die Kaution bekommt man nach dem Auszug zurück.',
      en: 'You get the deposit back after moving out.'
    }
  },
  {
    id: 'dtz.n.037',
    de: 'Nebenkosten',
    en: 'utility costs, service charges',
    article: 'die',
    plural: 'die Nebenkosten (immer Plural)',
    example: {
      de: 'Die Nebenkosten sind in der Warmmiete enthalten.',
      en: 'The service charges are included in the warm rent.'
    }
  },
  {
    id: 'dtz.n.038',
    de: 'Nachzahlung',
    en: 'extra payment',
    article: 'die',
    plural: 'die Nachzahlungen',
    example: {
      de: 'Wegen der Heizung gab es eine Nachzahlung.',
      en: 'Because of the heating there was an extra payment.'
    }
  },
  {
    id: 'dtz.n.039',
    de: 'Abrechnung',
    en: 'statement, bill',
    article: 'die',
    plural: 'die Abrechnungen',
    example: {
      de: 'Die Abrechnung der Nebenkosten kommt einmal im Jahr.',
      en: 'The statement of utility costs comes once a year.'
    }
  },
  {
    id: 'dtz.n.040',
    de: 'Vermieter',
    en: 'landlord',
    article: 'der',
    plural: 'die Vermieter',
    example: { de: 'Der Vermieter wohnt im Erdgeschoss.', en: 'The landlord lives on the ground floor.' }
  },
  {
    id: 'dtz.n.041',
    de: 'Mieter',
    en: 'tenant',
    article: 'der',
    plural: 'die Mieter',
    example: {
      de: 'Die Mieter im zweiten Stock sind sehr nett.',
      en: 'The tenants on the second floor are very nice.'
    }
  },
  {
    id: 'dtz.n.042',
    de: 'Kündigung',
    en: 'notice (of termination)',
    article: 'die',
    plural: 'die Kündigungen',
    example: { de: 'Die Kündigung muss schriftlich erfolgen.', en: 'The notice has to be given in writing.' }
  },
  {
    id: 'dtz.n.043',
    de: 'Kündigungsfrist',
    en: 'period of notice',
    article: 'die',
    plural: 'die Kündigungsfristen',
    example: {
      de: 'Die Kündigungsfrist für die Wohnung beträgt drei Monate.',
      en: 'The notice period for the flat is three months.'
    }
  },
  {
    id: 'dtz.n.044',
    de: 'Hausmeister',
    en: 'caretaker',
    article: 'der',
    plural: 'die Hausmeister',
    example: { de: 'Der Hausmeister repariert den Aufzug.', en: 'The caretaker is repairing the lift.' }
  },
  {
    id: 'dtz.n.045',
    de: 'Hausordnung',
    en: 'house rules',
    article: 'die',
    plural: 'die Hausordnungen',
    example: {
      de: 'In der Hausordnung steht, wann Ruhezeiten sind.',
      en: 'The house rules say when quiet hours are.'
    }
  },
  {
    id: 'dtz.n.046',
    de: 'Mangel',
    en: 'defect',
    article: 'der',
    plural: 'die Mängel',
    example: {
      de: 'Bitte melden Sie jeden Mangel sofort schriftlich.',
      en: 'Please report every defect in writing at once.'
    }
  },
  {
    id: 'dtz.n.047',
    de: 'Heizung',
    en: 'heating',
    article: 'die',
    plural: 'die Heizungen',
    example: {
      de: 'Die Heizung im Bad ist seit gestern kaputt.',
      en: 'The heating in the bathroom has been broken since yesterday.'
    }
  },
  {
    id: 'dtz.n.048',
    de: 'Reparatur',
    en: 'repair',
    article: 'die',
    plural: 'die Reparaturen',
    example: { de: 'Die Reparatur dauert zwei Tage.', en: 'The repair takes two days.' }
  },
  {
    id: 'dtz.n.049',
    de: 'Wohnungsübergabe',
    en: 'handover of the flat',
    article: 'die',
    plural: 'die Wohnungsübergaben',
    example: {
      de: 'Bei der Wohnungsübergabe wird ein Protokoll geschrieben.',
      en: 'At the handover of the flat a report is written.'
    }
  },
  {
    id: 'dtz.n.050',
    de: 'Umzug',
    en: 'move, relocation',
    article: 'der',
    plural: 'die Umzüge',
    example: {
      de: 'Wir brauchen am Samstag Hilfe beim Umzug.',
      en: 'We need help with the move on Saturday.'
    }
  },
  {
    id: 'dtz.n.051',
    de: 'Anzeige',
    en: 'advertisement',
    article: 'die',
    plural: 'die Anzeigen',
    example: {
      de: 'Ich habe Ihre Anzeige im Internet gelesen.',
      en: 'I read your advertisement on the internet.'
    }
  },
  {
    id: 'dtz.n.052',
    de: 'Arbeitsvertrag',
    en: 'employment contract',
    article: 'der',
    plural: 'die Arbeitsverträge',
    example: {
      de: 'Der Arbeitsvertrag gilt zunächst für ein Jahr.',
      en: 'The employment contract is initially valid for one year.'
    }
  },
  {
    id: 'dtz.n.053',
    de: 'Probezeit',
    en: 'probation period',
    article: 'die',
    plural: 'die Probezeiten',
    example: { de: 'Die Probezeit dauert sechs Monate.', en: 'The probation period lasts six months.' }
  },
  {
    id: 'dtz.n.054',
    de: 'Gehalt',
    en: 'salary',
    article: 'das',
    plural: 'die Gehälter',
    example: {
      de: 'Das Gehalt wird am Monatsende überwiesen.',
      en: 'The salary is transferred at the end of the month.'
    }
  },
  {
    id: 'dtz.n.055',
    de: 'Lohn',
    en: 'wage',
    article: 'der',
    plural: 'die Löhne',
    example: { de: 'Der Lohn hängt von der Arbeitszeit ab.', en: 'The wage depends on the working hours.' }
  },
  {
    id: 'dtz.n.056',
    de: 'Überstunde',
    en: 'overtime hour',
    article: 'die',
    plural: 'die Überstunden',
    example: {
      de: 'Diese Woche habe ich zehn Überstunden gemacht.',
      en: 'This week I worked ten hours of overtime.'
    }
  },
  {
    id: 'dtz.n.057',
    de: 'Bewerbung',
    en: 'application (for a job)',
    article: 'die',
    plural: 'die Bewerbungen',
    example: {
      de: 'Schicken Sie Ihre Bewerbung bitte per E-Mail.',
      en: 'Please send your application by e-mail.'
    }
  },
  {
    id: 'dtz.n.058',
    de: 'Lebenslauf',
    en: 'CV',
    article: 'der',
    plural: 'die Lebensläufe',
    example: {
      de: 'Im Lebenslauf stehen meine bisherigen Arbeitsstellen.',
      en: 'My previous jobs are listed in the CV.'
    }
  },
  {
    id: 'dtz.n.059',
    de: 'Vorstellungsgespräch',
    en: 'job interview',
    article: 'das',
    plural: 'die Vorstellungsgespräche',
    example: { de: 'Morgen habe ich ein Vorstellungsgespräch.', en: 'Tomorrow I have a job interview.' }
  },
  {
    id: 'dtz.n.060',
    de: 'Arbeitgeber',
    en: 'employer',
    article: 'der',
    plural: 'die Arbeitgeber',
    example: {
      de: 'Mein Arbeitgeber zahlt einen Zuschuss zur Fahrkarte.',
      en: 'My employer pays a subsidy towards the travel ticket.'
    }
  },
  {
    id: 'dtz.n.061',
    de: 'Kollegin',
    en: 'colleague (female)',
    article: 'die',
    plural: 'die Kolleginnen',
    example: {
      de: 'Meine Kollegin hilft mir bei den Formularen.',
      en: 'My colleague helps me with the forms.'
    }
  },
  {
    id: 'dtz.n.062',
    de: 'Ausbildung',
    en: 'vocational training',
    article: 'die',
    plural: 'die Ausbildungen',
    example: {
      de: 'Sie macht eine Ausbildung zur Krankenpflegerin.',
      en: 'She is doing vocational training as a nurse.'
    }
  },
  {
    id: 'dtz.n.063',
    de: 'Praktikumsplatz',
    en: 'internship place',
    article: 'der',
    plural: 'die Praktikumsplätze',
    example: {
      de: 'Ich suche einen Praktikumsplatz in einem Büro.',
      en: 'I am looking for an internship place in an office.'
    }
  },
  {
    id: 'dtz.n.064',
    de: 'Integrationskurs',
    en: 'integration course',
    article: 'der',
    plural: 'die Integrationskurse',
    example: {
      de: 'Der Integrationskurs endet mit dem Deutsch-Test.',
      en: 'The integration course ends with the German test.'
    }
  },
  {
    id: 'dtz.n.065',
    de: 'Deutschkurs',
    en: 'German course',
    article: 'der',
    plural: 'die Deutschkurse',
    example: { de: 'Der Deutschkurs beginnt um neun Uhr.', en: 'The German course starts at nine o’clock.' }
  },
  {
    id: 'dtz.n.066',
    de: 'Prüfung',
    en: 'exam',
    article: 'die',
    plural: 'die Prüfungen',
    example: {
      de: 'Die Prüfung besteht aus einem schriftlichen und einem mündlichen Teil.',
      en: 'The exam consists of a written and an oral part.'
    }
  },
  {
    id: 'dtz.n.067',
    de: 'Zertifikat',
    en: 'certificate',
    article: 'das',
    plural: 'die Zertifikate',
    example: { de: 'Mit dem Zertifikat kann ich mich bewerben.', en: 'With the certificate I can apply.' }
  },
  {
    id: 'dtz.n.068',
    de: 'Volkshochschule',
    en: 'adult education centre',
    article: 'die',
    plural: 'die Volkshochschulen',
    example: {
      de: 'An der Volkshochschule gibt es viele Abendkurse.',
      en: 'At the adult education centre there are many evening courses.'
    }
  },
  {
    id: 'dtz.n.069',
    de: 'Kita',
    en: 'daycare centre',
    article: 'die',
    plural: 'die Kitas',
    example: {
      de: 'Unsere Kita hat von sieben bis siebzehn Uhr geöffnet.',
      en: 'Our daycare centre is open from seven to five.'
    }
  },
  {
    id: 'dtz.n.070',
    de: 'Kindergarten',
    en: 'kindergarten',
    article: 'der',
    plural: 'die Kindergärten',
    example: {
      de: 'Mein Sohn geht seit September in den Kindergarten.',
      en: 'My son has gone to kindergarten since September.'
    }
  },
  {
    id: 'dtz.n.071',
    de: 'Elternabend',
    en: 'parents’ evening',
    article: 'der',
    plural: 'die Elternabende',
    example: {
      de: 'Am Elternabend bespricht die Lehrerin den Schulausflug.',
      en: 'At the parents’ evening the teacher discusses the school trip.'
    }
  },
  {
    id: 'dtz.n.072',
    de: 'Grundschule',
    en: 'primary school',
    article: 'die',
    plural: 'die Grundschulen',
    example: {
      de: 'Die Grundschule ist in der Nähe unserer Wohnung.',
      en: 'The primary school is near our flat.'
    }
  },
  {
    id: 'dtz.n.073',
    de: 'Zeugnis',
    en: 'report card, certificate',
    article: 'das',
    plural: 'die Zeugnisse',
    example: {
      de: 'Das Zeugnis bekommen die Kinder im Februar.',
      en: 'The children get their report cards in February.'
    }
  },
  {
    id: 'dtz.n.074',
    de: 'Elternbeitrag',
    en: 'parents’ contribution (fee)',
    article: 'der',
    plural: 'die Elternbeiträge',
    example: {
      de: 'Der Elternbeitrag für die Kita ist vom Einkommen abhängig.',
      en: 'The parents’ fee for the daycare depends on income.'
    }
  },
  {
    id: 'dtz.n.075',
    de: 'Klassenlehrerin',
    en: 'class teacher (female)',
    article: 'die',
    plural: 'die Klassenlehrerinnen',
    example: { de: 'Die Klassenlehrerin ruft morgen an.', en: 'The class teacher will call tomorrow.' }
  },
  {
    id: 'dtz.n.076',
    de: 'Entschuldigung',
    en: 'excuse, apology',
    article: 'die',
    plural: 'die Entschuldigungen',
    example: {
      de: 'Das Kind braucht eine Entschuldigung für den Unterricht.',
      en: 'The child needs an excuse for the lesson.'
    }
  },
  {
    id: 'dtz.n.077',
    de: 'Hausarzt',
    en: 'family doctor',
    article: 'der',
    plural: 'die Hausärzte',
    example: {
      de: 'Mein Hausarzt hat nur vormittags Sprechstunde.',
      en: 'My family doctor only has consultation hours in the morning.'
    }
  },
  {
    id: 'dtz.n.078',
    de: 'Facharzt',
    en: 'specialist doctor',
    article: 'der',
    plural: 'die Fachärzte',
    example: {
      de: 'Für den Facharzt brauche ich eine Überweisung.',
      en: 'For the specialist I need a referral.'
    }
  },
  {
    id: 'dtz.n.079',
    de: 'Überweisung',
    en: 'referral; bank transfer',
    article: 'die',
    plural: 'die Überweisungen',
    example: {
      de: 'Die Überweisung zum Augenarzt habe ich schon bekommen.',
      en: 'I have already received the referral to the eye doctor.'
    }
  },
  {
    id: 'dtz.n.080',
    de: 'Rezept',
    en: 'prescription',
    article: 'das',
    plural: 'die Rezepte',
    example: {
      de: 'Mit dem Rezept gehen Sie in die Apotheke.',
      en: 'With the prescription you go to the pharmacy.'
    }
  },
  {
    id: 'dtz.n.081',
    de: 'Apotheke',
    en: 'pharmacy',
    article: 'die',
    plural: 'die Apotheken',
    example: {
      de: 'Die Apotheke am Markt hat auch nachts Notdienst.',
      en: 'The pharmacy at the market has an emergency service at night too.'
    }
  },
  {
    id: 'dtz.n.082',
    de: 'Praxis',
    en: 'doctor’s practice',
    article: 'die',
    plural: 'die Praxen',
    example: {
      de: 'Die Praxis ist im Urlaub bis zum 10. August geschlossen.',
      en: 'The practice is closed on holiday until 10 August.'
    }
  },
  {
    id: 'dtz.n.083',
    de: 'Medikament',
    en: 'medicine',
    article: 'das',
    plural: 'die Medikamente',
    example: {
      de: 'Dieses Medikament bekommt man nur mit Rezept.',
      en: 'You can only get this medicine with a prescription.'
    }
  },
  {
    id: 'dtz.n.084',
    de: 'Impfung',
    en: 'vaccination',
    article: 'die',
    plural: 'die Impfungen',
    example: {
      de: 'Für die Impfung brauchen Sie einen Termin.',
      en: 'For the vaccination you need an appointment.'
    }
  },
  {
    id: 'dtz.n.085',
    de: 'Notfall',
    en: 'emergency',
    article: 'der',
    plural: 'die Notfälle',
    example: { de: 'Im Notfall rufen Sie die 112 an.', en: 'In an emergency call 112.' }
  },
  {
    id: 'dtz.n.086',
    de: 'Konto',
    en: 'bank account',
    article: 'das',
    plural: 'die Konten',
    example: {
      de: 'Das Gehalt kommt direkt auf mein Konto.',
      en: 'The salary goes straight into my account.'
    }
  },
  {
    id: 'dtz.n.087',
    de: 'Dauerauftrag',
    en: 'standing order',
    article: 'der',
    plural: 'die Daueraufträge',
    example: { de: 'Die Miete zahle ich per Dauerauftrag.', en: 'I pay the rent by standing order.' }
  },
  {
    id: 'dtz.n.088',
    de: 'Rechnung',
    en: 'bill, invoice',
    article: 'die',
    plural: 'die Rechnungen',
    example: {
      de: 'Die Rechnung muss bis zum Ersten bezahlt sein.',
      en: 'The bill has to be paid by the first.'
    }
  },
  {
    id: 'dtz.n.089',
    de: 'Versicherung',
    en: 'insurance',
    article: 'die',
    plural: 'die Versicherungen',
    example: {
      de: 'Die Versicherung zahlt bei einem Wasserschaden.',
      en: 'The insurance pays in the case of water damage.'
    }
  },
  {
    id: 'dtz.n.090',
    de: 'Vertrag',
    en: 'contract',
    article: 'der',
    plural: 'die Verträge',
    example: {
      de: 'Vor der Unterschrift lese ich den Vertrag genau.',
      en: 'Before signing I read the contract carefully.'
    }
  },
  {
    id: 'dtz.n.091',
    de: 'Kundenservice',
    en: 'customer service',
    article: 'der',
    plural: '– (meist Singular; die Kundenservices)',
    example: {
      de: 'Der Kundenservice ist rund um die Uhr erreichbar.',
      en: 'Customer service can be reached around the clock.'
    }
  },
  {
    id: 'dtz.n.092',
    de: 'Haltestelle',
    en: 'stop (bus, tram)',
    article: 'die',
    plural: 'die Haltestellen',
    example: {
      de: 'Die Haltestelle ist direkt vor dem Rathaus.',
      en: 'The stop is right in front of the town hall.'
    }
  },
  {
    id: 'dtz.n.093',
    de: 'Fahrkarte',
    en: 'ticket',
    article: 'die',
    plural: 'die Fahrkarten',
    example: { de: 'Die Fahrkarte gilt zwei Stunden lang.', en: 'The ticket is valid for two hours.' }
  },
  {
    id: 'dtz.n.094',
    de: 'Gleis',
    en: 'platform, track',
    article: 'das',
    plural: 'die Gleise',
    example: {
      de: 'Der Zug nach Berlin fährt von Gleis 5.',
      en: 'The train to Berlin leaves from platform 5.'
    }
  },
  {
    id: 'dtz.n.095',
    de: 'Verspätung',
    en: 'delay',
    article: 'die',
    plural: 'die Verspätungen',
    example: { de: 'Der Zug hat zwanzig Minuten Verspätung.', en: 'The train is twenty minutes late.' }
  },
  {
    id: 'dtz.n.096',
    de: 'Fahrplan',
    en: 'timetable',
    article: 'der',
    plural: 'die Fahrpläne',
    example: {
      de: 'Im Fahrplan stehen alle Abfahrtszeiten.',
      en: 'All departure times are in the timetable.'
    }
  },
  {
    id: 'dtz.n.097',
    de: 'Paket',
    en: 'parcel',
    article: 'das',
    plural: 'die Pakete',
    example: { de: 'Das Paket liegt bei der Nachbarin.', en: 'The parcel is at the neighbour’s.' }
  },
  {
    id: 'dtz.n.098',
    de: 'Einladung',
    en: 'invitation',
    article: 'die',
    plural: 'die Einladungen',
    example: {
      de: 'Ich habe eine Einladung zum Elternabend bekommen.',
      en: 'I received an invitation to the parents’ evening.'
    }
  },
  {
    id: 'dtz.n.099',
    de: 'Verein',
    en: 'club, association',
    article: 'der',
    plural: 'die Vereine',
    example: { de: 'Mein Sohn spielt Fußball im Verein.', en: 'My son plays football in a club.' }
  },
  {
    id: 'dtz.n.100',
    de: 'Nachbarschaft',
    en: 'neighbourhood',
    article: 'die',
    plural: '– (meist Singular; die Nachbarschaften)',
    example: {
      de: 'In unserer Nachbarschaft gibt es ein Straßenfest.',
      en: 'There is a street party in our neighbourhood.'
    }
  },
  {
    id: 'dtz.n.101',
    de: 'Müll',
    en: 'rubbish',
    article: 'der',
    plural: '– (nur Singular)',
    example: {
      de: 'Den Müll muss man in verschiedene Tonnen trennen.',
      en: 'You have to separate the rubbish into different bins.'
    }
  },
  {
    id: 'dtz.n.102',
    de: 'Ruhezeit',
    en: 'quiet hours',
    article: 'die',
    plural: 'die Ruhezeiten',
    example: {
      de: 'In der Ruhezeit darf man keine laute Musik hören.',
      en: 'During quiet hours you may not play loud music.'
    }
  },
  {
    id: 'dtz.n.103',
    de: 'Angebot',
    en: 'offer',
    article: 'das',
    plural: 'die Angebote',
    example: { de: 'Das Angebot gilt nur bis Samstag.', en: 'The offer is only valid until Saturday.' }
  },
  {
    id: 'dtz.n.104',
    de: 'Beratung',
    en: 'advice, counselling',
    article: 'die',
    plural: 'die Beratungen',
    example: { de: 'Die Beratung im Rathaus ist kostenlos.', en: 'The advice at the town hall is free.' }
  },
  {
    id: 'dtz.n.105',
    de: 'Auskunft',
    en: 'information',
    article: 'die',
    plural: 'die Auskünfte',
    example: { de: 'Eine Auskunft bekommen Sie am Schalter.', en: 'You can get information at the counter.' }
  },
  {
    id: 'dtz.n.106',
    de: 'Schalter',
    en: 'counter',
    article: 'der',
    plural: 'die Schalter',
    example: {
      de: 'An welchem Schalter bekomme ich die Nummer?',
      en: 'At which counter do I get the number?'
    }
  },
  {
    id: 'dtz.n.107',
    de: 'Genehmigung',
    en: 'permit, approval',
    article: 'die',
    plural: 'die Genehmigungen',
    example: {
      de: 'Für den Umbau brauchen Sie eine Genehmigung.',
      en: 'For the conversion you need a permit.'
    }
  },
  {
    id: 'dtz.n.108',
    de: 'Staatsangehörigkeit',
    en: 'nationality',
    article: 'die',
    plural: 'die Staatsangehörigkeiten',
    example: { de: 'Auf dem Formular steht: Staatsangehörigkeit.', en: 'On the form it says: nationality.' }
  },
  {
    id: 'dtz.n.109',
    de: 'Geburtsdatum',
    en: 'date of birth',
    article: 'das',
    plural: 'die Geburtsdaten',
    example: { de: 'Bitte tragen Sie Ihr Geburtsdatum ein.', en: 'Please enter your date of birth.' }
  },
  {
    id: 'dtz.n.110',
    de: 'Anschrift',
    en: 'address',
    article: 'die',
    plural: 'die Anschriften',
    example: {
      de: 'Die Anschrift des Amtes steht oben im Brief.',
      en: 'The office’s address is at the top of the letter.'
    }
  },
  {
    id: 'dtz.n.111',
    de: 'Arbeitsstelle',
    en: 'job, place of work',
    article: 'die',
    plural: 'die Arbeitsstellen',
    example: {
      de: 'Ich habe endlich eine neue Arbeitsstelle gefunden.',
      en: 'I have finally found a new job.'
    }
  }
];

export const DTZ_ADJECTIVES: readonly AdjectiveEntry[] = [
  {
    id: 'dtz.a.001',
    de: 'gültig',
    en: 'valid',
    example: {
      de: 'Mein Pass ist noch bis nächstes Jahr gültig.',
      en: 'My passport is still valid until next year.'
    }
  },
  {
    id: 'dtz.a.002',
    de: 'ungültig',
    en: 'invalid',
    example: { de: 'Die Fahrkarte ist leider ungültig.', en: 'The ticket is unfortunately invalid.' }
  },
  {
    id: 'dtz.a.003',
    de: 'zuständig',
    en: 'responsible, in charge',
    example: {
      de: 'Für Ihren Antrag ist das Bürgeramt zuständig.',
      en: 'The citizens’ office is responsible for your application.'
    }
  },
  {
    id: 'dtz.a.004',
    de: 'verpflichtet',
    en: 'obliged',
    example: {
      de: 'Alle Mieter sind verpflichtet, die Hausordnung einzuhalten.',
      en: 'All tenants are obliged to observe the house rules.'
    }
  },
  {
    id: 'dtz.a.005',
    de: 'erforderlich',
    en: 'required, necessary',
    example: {
      de: 'Für den Antrag ist ein Nachweis erforderlich.',
      en: 'A proof is required for the application.'
    }
  },
  {
    id: 'dtz.a.006',
    de: 'kostenlos',
    en: 'free of charge',
    example: {
      de: 'Die Beratung im Rathaus ist kostenlos.',
      en: 'The advice at the town hall is free of charge.'
    }
  },
  {
    id: 'dtz.a.007',
    de: 'kostenpflichtig',
    en: 'subject to a charge',
    example: { de: 'Der Parkplatz ist kostenpflichtig.', en: 'The car park is subject to a charge.' }
  },
  {
    id: 'dtz.a.008',
    de: 'schriftlich',
    en: 'in writing, written',
    example: { de: 'Die Kündigung muss schriftlich erfolgen.', en: 'Notice has to be given in writing.' }
  },
  {
    id: 'dtz.a.009',
    de: 'mündlich',
    en: 'oral, verbal',
    example: {
      de: 'Die mündliche Prüfung ist am Nachmittag.',
      en: 'The oral exam is in the afternoon.'
    }
  },
  {
    id: 'dtz.a.010',
    de: 'persönlich',
    en: 'personal, in person',
    example: {
      de: 'Den Antrag müssen Sie persönlich abgeben.',
      en: 'You have to hand in the application in person.'
    }
  },
  {
    id: 'dtz.a.011',
    de: 'offiziell',
    en: 'official',
    example: {
      de: 'Das ist eine offizielle Mitteilung der Stadt.',
      en: 'This is an official notice from the city.'
    }
  },
  {
    id: 'dtz.a.012',
    de: 'vollständig',
    en: 'complete',
    example: {
      de: 'Der Antrag ist leider nicht vollständig.',
      en: 'The application is unfortunately not complete.'
    }
  },
  {
    id: 'dtz.a.013',
    de: 'fehlend',
    en: 'missing',
    example: {
      de: 'Bitte reichen Sie die fehlenden Unterlagen nach.',
      en: 'Please submit the missing documents later.'
    }
  },
  {
    id: 'dtz.a.014',
    de: 'dringend',
    en: 'urgent',
    komparativ: 'dringender',
    superlativ: 'am dringendsten',
    example: { de: 'Ich brauche dringend einen Termin.', en: 'I urgently need an appointment.' }
  },
  {
    id: 'dtz.a.015',
    de: 'pünktlich',
    en: 'punctual, on time',
    komparativ: 'pünktlicher',
    superlativ: 'am pünktlichsten',
    example: { de: 'Bitte kommen Sie pünktlich zum Termin.', en: 'Please come to the appointment on time.' }
  },
  {
    id: 'dtz.a.016',
    de: 'geöffnet',
    en: 'open',
    example: {
      de: 'Das Bürgeramt ist samstags nicht geöffnet.',
      en: 'The citizens’ office is not open on Saturdays.'
    }
  },
  {
    id: 'dtz.a.017',
    de: 'geschlossen',
    en: 'closed',
    example: { de: 'Die Bank ist am Feiertag geschlossen.', en: 'The bank is closed on the public holiday.' }
  },
  {
    id: 'dtz.a.018',
    de: 'günstig',
    en: 'cheap, favourable',
    komparativ: 'günstiger',
    superlativ: 'am günstigsten',
    example: {
      de: 'Wir suchen eine günstige Wohnung in der Nähe.',
      en: 'We are looking for a cheap flat nearby.'
    }
  },
  {
    id: 'dtz.a.019',
    de: 'teuer',
    en: 'expensive',
    komparativ: 'teurer',
    superlativ: 'am teuersten',
    example: {
      de: 'Die Mieten in der Innenstadt sind sehr teuer.',
      en: 'The rents in the city centre are very expensive.'
    }
  },
  {
    id: 'dtz.a.020',
    de: 'möbliert',
    en: 'furnished',
    example: {
      de: 'Das Zimmer ist möbliert und hat einen Balkon.',
      en: 'The room is furnished and has a balcony.'
    }
  },
  {
    id: 'dtz.a.021',
    de: 'hell',
    en: 'bright',
    komparativ: 'heller',
    superlativ: 'am hellsten',
    example: { de: 'Die Wohnung ist hell und ruhig.', en: 'The flat is bright and quiet.' }
  },
  {
    id: 'dtz.a.022',
    de: 'ruhig',
    en: 'quiet',
    komparativ: 'ruhiger',
    superlativ: 'am ruhigsten',
    example: { de: 'Wir wohnen in einer ruhigen Straße.', en: 'We live in a quiet street.' }
  },
  {
    id: 'dtz.a.023',
    de: 'laut',
    en: 'loud, noisy',
    komparativ: 'lauter',
    superlativ: 'am lautesten',
    example: {
      de: 'Die Nachbarn sind abends oft laut.',
      en: 'The neighbours are often noisy in the evening.'
    }
  },
  {
    id: 'dtz.a.024',
    de: 'zentral',
    en: 'central',
    komparativ: 'zentraler',
    superlativ: 'am zentralsten',
    example: {
      de: 'Die Wohnung liegt zentral, direkt am Markt.',
      en: 'The flat is centrally located, right at the market.'
    }
  },
  {
    id: 'dtz.a.025',
    de: 'kaputt',
    en: 'broken',
    example: {
      de: 'Die Waschmaschine ist leider kaputt.',
      en: 'The washing machine is unfortunately broken.'
    }
  },
  {
    id: 'dtz.a.026',
    de: 'frei',
    en: 'free, vacant',
    example: { de: 'Ab Mai ist die Wohnung wieder frei.', en: 'From May the flat is vacant again.' }
  },
  {
    id: 'dtz.a.027',
    de: 'besetzt',
    en: 'occupied, engaged',
    example: { de: 'Die Leitung ist leider besetzt.', en: 'The line is unfortunately engaged.' }
  },
  {
    id: 'dtz.a.028',
    de: 'ausgebucht',
    en: 'fully booked',
    example: { de: 'Der Kurs ist leider ausgebucht.', en: 'The course is unfortunately fully booked.' }
  },
  {
    id: 'dtz.a.029',
    de: 'berufstätig',
    en: 'employed, working',
    example: { de: 'Beide Eltern sind berufstätig.', en: 'Both parents are in employment.' }
  },
  {
    id: 'dtz.a.030',
    de: 'arbeitslos',
    en: 'unemployed',
    example: { de: 'Seit Januar bin ich arbeitslos.', en: 'I have been unemployed since January.' }
  },
  {
    id: 'dtz.a.031',
    de: 'befristet',
    en: 'temporary, fixed-term',
    example: {
      de: 'Mein Arbeitsvertrag ist auf ein Jahr befristet.',
      en: 'My employment contract is limited to one year.'
    }
  },
  {
    id: 'dtz.a.032',
    de: 'unbefristet',
    en: 'permanent, open-ended',
    example: {
      de: 'Nach der Probezeit bekommt er einen unbefristeten Vertrag.',
      en: 'After the probation period he gets a permanent contract.'
    }
  },
  {
    id: 'dtz.a.033',
    de: 'flexibel',
    en: 'flexible',
    komparativ: 'flexibler',
    superlativ: 'am flexibelsten',
    example: { de: 'Die Arbeitszeiten sind flexibel.', en: 'The working hours are flexible.' }
  },
  {
    id: 'dtz.a.034',
    de: 'freundlich',
    en: 'friendly',
    komparativ: 'freundlicher',
    superlativ: 'am freundlichsten',
    example: { de: 'Die Mitarbeiterin war sehr freundlich.', en: 'The employee was very friendly.' }
  },
  {
    id: 'dtz.a.035',
    de: 'hilfsbereit',
    en: 'helpful',
    komparativ: 'hilfsbereiter',
    superlativ: 'am hilfsbereitesten',
    example: { de: 'Meine Kollegen sind sehr hilfsbereit.', en: 'My colleagues are very helpful.' }
  },
  {
    id: 'dtz.a.036',
    de: 'zuverlässig',
    en: 'reliable',
    komparativ: 'zuverlässiger',
    superlativ: 'am zuverlässigsten',
    example: {
      de: 'Wir suchen eine zuverlässige Mitarbeiterin.',
      en: 'We are looking for a reliable employee.'
    }
  },
  {
    id: 'dtz.a.037',
    de: 'erfahren',
    en: 'experienced',
    komparativ: 'erfahrener',
    superlativ: 'am erfahrensten',
    example: { de: 'Die Ärztin ist sehr erfahren.', en: 'The doctor is very experienced.' }
  },
  {
    id: 'dtz.a.038',
    de: 'krank',
    en: 'ill',
    komparativ: 'kränker',
    superlativ: 'am kränksten',
    example: {
      de: 'Mein Kind ist krank und kann nicht in die Kita.',
      en: 'My child is ill and cannot go to daycare.'
    }
  },
  {
    id: 'dtz.a.039',
    de: 'gesund',
    en: 'healthy',
    komparativ: 'gesünder',
    superlativ: 'am gesündesten',
    example: { de: 'Obst und Gemüse sind gesund.', en: 'Fruit and vegetables are healthy.' }
  },
  {
    id: 'dtz.a.040',
    de: 'ansteckend',
    en: 'contagious',
    example: { de: 'Die Grippe ist sehr ansteckend.', en: 'The flu is very contagious.' }
  },
  {
    id: 'dtz.a.041',
    de: 'nüchtern',
    en: 'on an empty stomach',
    example: {
      de: 'Zur Blutabnahme müssen Sie nüchtern kommen.',
      en: 'For the blood test you have to come on an empty stomach.'
    }
  },
  {
    id: 'dtz.a.042',
    de: 'schmerzhaft',
    en: 'painful',
    komparativ: 'schmerzhafter',
    superlativ: 'am schmerzhaftesten',
    example: { de: 'Die Spritze war nicht schmerzhaft.', en: 'The injection was not painful.' }
  },
  {
    id: 'dtz.a.043',
    de: 'verständlich',
    en: 'understandable',
    komparativ: 'verständlicher',
    superlativ: 'am verständlichsten',
    example: {
      de: 'Die Erklärung des Amtes war nicht verständlich.',
      en: 'The office’s explanation was not understandable.'
    }
  },
  {
    id: 'dtz.a.044',
    de: 'wichtig',
    en: 'important',
    komparativ: 'wichtiger',
    superlativ: 'am wichtigsten',
    example: { de: 'Es ist wichtig, die Frist einzuhalten.', en: 'It is important to keep the deadline.' }
  },
  {
    id: 'dtz.a.045',
    de: 'möglich',
    en: 'possible',
    example: { de: 'Eine Anmeldung ist auch online möglich.', en: 'Registration is also possible online.' }
  },
  {
    id: 'dtz.a.046',
    de: 'unmöglich',
    en: 'impossible',
    example: {
      de: 'Es ist unmöglich, heute noch einen Termin zu bekommen.',
      en: 'It is impossible to get an appointment today.'
    }
  },
  {
    id: 'dtz.a.047',
    de: 'kurzfristig',
    en: 'at short notice',
    example: {
      de: 'Ich musste den Termin kurzfristig absagen.',
      en: 'I had to cancel the appointment at short notice.'
    }
  },
  {
    id: 'dtz.a.048',
    de: 'regelmäßig',
    en: 'regular',
    example: {
      de: 'Sie müssen das Medikament regelmäßig einnehmen.',
      en: 'You have to take the medicine regularly.'
    }
  },
  {
    id: 'dtz.a.049',
    de: 'monatlich',
    en: 'monthly',
    example: { de: 'Die Miete wird monatlich überwiesen.', en: 'The rent is transferred monthly.' }
  },
  {
    id: 'dtz.a.050',
    de: 'jährlich',
    en: 'yearly',
    example: {
      de: 'Die Nebenkosten werden jährlich abgerechnet.',
      en: 'The service charges are billed yearly.'
    }
  },
  {
    id: 'dtz.a.051',
    de: 'ehrenamtlich',
    en: 'voluntary, unpaid',
    example: {
      de: 'Sie arbeitet ehrenamtlich im Sportverein.',
      en: 'She works voluntarily in the sports club.'
    }
  },
  {
    id: 'dtz.a.052',
    de: 'sicher',
    en: 'safe, sure',
    komparativ: 'sicherer',
    superlativ: 'am sichersten',
    example: { de: 'Das Viertel ist auch nachts sicher.', en: 'The area is safe even at night.' }
  },
  {
    id: 'dtz.a.053',
    de: 'deutlich',
    en: 'clear',
    komparativ: 'deutlicher',
    superlativ: 'am deutlichsten',
    example: { de: 'Bitte sprechen Sie etwas deutlicher.', en: 'Please speak a little more clearly.' }
  },
  {
    id: 'dtz.a.054',
    de: 'gemeinsam',
    en: 'joint, together',
    example: {
      de: 'Wir planen gemeinsam ein Fest für die Nachbarn.',
      en: 'We are planning a party for the neighbours together.'
    }
  },
  {
    id: 'dtz.a.055',
    de: 'verheiratet',
    en: 'married',
    example: { de: 'Ich bin verheiratet und habe zwei Kinder.', en: 'I am married and have two children.' }
  },
  {
    id: 'dtz.a.056',
    de: 'ledig',
    en: 'single (unmarried)',
    example: {
      de: 'Auf dem Formular steht: ledig, verheiratet, geschieden.',
      en: 'On the form it says: single, married, divorced.'
    }
  }
];

export const DTZ_VOCAB: VocabBank = {
  verbs: DTZ_VERBS,
  nouns: DTZ_NOUNS,
  adjectives: DTZ_ADJECTIVES,
  prepVerbs: DTZ_PREP_VERBS,
  caseItems: DTZ_CASE_ITEMS
};
