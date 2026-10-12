import { type CaseItem, type PrepVerbEntry } from '@shared/types';

/* DTZ grammar banks: Verben mit Präposition and case government (Akkusativ / Dativ /
   Genitiv), set in integration-course everyday life. Ids are persisted SRS keys — never
   renumber existing items. */

export const DTZ_PREP_VERBS: readonly PrepVerbEntry[] = [
  {
    id: 'dtz.pv.001',
    de: 'sich anmelden bei + Dat.',
    en: 'to register with',
    verb: 'sich anmelden',
    preposition: 'bei',
    kasus: 'dativ',
    example: {
      de: 'Ich habe mich beim Einwohnermeldeamt angemeldet.',
      en: 'I registered at the residents’ registration office.'
    }
  },
  {
    id: 'dtz.pv.002',
    de: 'sich anmelden zu + Dat.',
    en: 'to sign up for',
    verb: 'sich anmelden',
    preposition: 'zu',
    kasus: 'dativ',
    example: {
      de: 'Sie hat sich zu einem Integrationskurs angemeldet.',
      en: 'She signed up for an integration course.'
    }
  },
  {
    id: 'dtz.pv.003',
    de: 'sich bewerben um + Akk.',
    en: 'to apply for',
    verb: 'sich bewerben',
    preposition: 'um',
    kasus: 'akkusativ',
    example: {
      de: 'Er bewirbt sich um eine Stelle als Elektriker.',
      en: 'He is applying for a job as an electrician.'
    }
  },
  {
    id: 'dtz.pv.004',
    de: 'sich bewerben bei + Dat.',
    en: 'to apply to (a company)',
    verb: 'sich bewerben',
    preposition: 'bei',
    kasus: 'dativ',
    example: { de: 'Ich habe mich bei einer Bäckerei beworben.', en: 'I applied to a bakery.' }
  },
  {
    id: 'dtz.pv.005',
    de: 'einen Antrag stellen auf + Akk.',
    en: 'to apply for (officially)',
    verb: 'einen Antrag stellen',
    preposition: 'auf',
    kasus: 'akkusativ',
    example: { de: 'Wir stellen einen Antrag auf Wohngeld.', en: 'We are applying for housing benefit.' }
  },
  {
    id: 'dtz.pv.006',
    de: 'warten auf + Akk.',
    en: 'to wait for',
    verb: 'warten',
    preposition: 'auf',
    kasus: 'akkusativ',
    example: {
      de: 'Ich warte seit einer Stunde auf meinen Termin.',
      en: 'I have been waiting for my appointment for an hour.'
    }
  },
  {
    id: 'dtz.pv.007',
    de: 'sich kümmern um + Akk.',
    en: 'to take care of',
    verb: 'sich kümmern',
    preposition: 'um',
    kasus: 'akkusativ',
    example: {
      de: 'Wer kümmert sich um die Anmeldung der Kinder?',
      en: 'Who takes care of registering the children?'
    }
  },
  {
    id: 'dtz.pv.008',
    de: 'sich interessieren für + Akk.',
    en: 'to be interested in',
    verb: 'sich interessieren',
    preposition: 'für',
    kasus: 'akkusativ',
    example: {
      de: 'Ich interessiere mich für einen Computerkurs.',
      en: 'I am interested in a computer course.'
    }
  },
  {
    id: 'dtz.pv.009',
    de: 'sich entscheiden für + Akk.',
    en: 'to decide on',
    verb: 'sich entscheiden',
    preposition: 'für',
    kasus: 'akkusativ',
    example: {
      de: 'Wir haben uns für die kleinere Wohnung entschieden.',
      en: 'We decided on the smaller flat.'
    }
  },
  {
    id: 'dtz.pv.010',
    de: 'sich freuen auf + Akk.',
    en: 'to look forward to',
    verb: 'sich freuen',
    preposition: 'auf',
    kasus: 'akkusativ',
    example: {
      de: 'Die Kinder freuen sich auf den Ausflug.',
      en: 'The children are looking forward to the trip.'
    }
  },
  {
    id: 'dtz.pv.011',
    de: 'sich freuen über + Akk.',
    en: 'to be pleased about',
    verb: 'sich freuen',
    preposition: 'über',
    kasus: 'akkusativ',
    example: { de: 'Ich freue mich über die schnelle Antwort.', en: 'I am pleased about the quick reply.' }
  },
  {
    id: 'dtz.pv.012',
    de: 'sich ärgern über + Akk.',
    en: 'to be annoyed about',
    verb: 'sich ärgern',
    preposition: 'über',
    kasus: 'akkusativ',
    example: {
      de: 'Der Mieter ärgert sich über die hohe Nachzahlung.',
      en: 'The tenant is annoyed about the high extra payment.'
    }
  },
  {
    id: 'dtz.pv.013',
    de: 'sich beschweren über + Akk.',
    en: 'to complain about',
    verb: 'sich beschweren',
    preposition: 'über',
    kasus: 'akkusativ',
    example: {
      de: 'Ich möchte mich über den Lärm beschweren.',
      en: 'I would like to complain about the noise.'
    }
  },
  {
    id: 'dtz.pv.014',
    de: 'sich beschweren bei + Dat.',
    en: 'to complain to',
    verb: 'sich beschweren',
    preposition: 'bei',
    kasus: 'dativ',
    example: { de: 'Beschweren Sie sich bitte beim Hausmeister.', en: 'Please complain to the caretaker.' }
  },
  {
    id: 'dtz.pv.015',
    de: 'sich erinnern an + Akk.',
    en: 'to remember',
    verb: 'sich erinnern',
    preposition: 'an',
    kasus: 'akkusativ',
    example: { de: 'Können Sie sich an den Namen erinnern?', en: 'Can you remember the name?' }
  },
  {
    id: 'dtz.pv.016',
    de: 'denken an + Akk.',
    en: 'to think of',
    verb: 'denken',
    preposition: 'an',
    kasus: 'akkusativ',
    example: {
      de: 'Denken Sie bitte an die Unterlagen für den Termin.',
      en: 'Please remember the documents for the appointment.'
    }
  },
  {
    id: 'dtz.pv.017',
    de: 'teilnehmen an + Dat.',
    en: 'to take part in',
    verb: 'teilnehmen',
    preposition: 'an',
    kasus: 'dativ',
    example: { de: 'Ich nehme am Elternabend teil.', en: 'I am taking part in the parents’ evening.' }
  },
  {
    id: 'dtz.pv.018',
    de: 'sich beteiligen an + Dat.',
    en: 'to participate in',
    verb: 'sich beteiligen',
    preposition: 'an',
    kasus: 'dativ',
    example: { de: 'Alle Mieter beteiligen sich an den Kosten.', en: 'All tenants contribute to the costs.' }
  },
  {
    id: 'dtz.pv.019',
    de: 'sich handeln um + Akk.',
    en: 'to be about, to concern',
    verb: 'sich handeln',
    preposition: 'um',
    kasus: 'akkusativ',
    example: { de: 'Es handelt sich um einen Irrtum der Behörde.', en: 'It is a mistake by the authority.' }
  },
  {
    id: 'dtz.pv.020',
    de: 'fragen nach + Dat.',
    en: 'to ask for, to ask about',
    verb: 'fragen',
    preposition: 'nach',
    kasus: 'dativ',
    example: {
      de: 'Ich möchte nach den Öffnungszeiten fragen.',
      en: 'I would like to ask about the opening hours.'
    }
  },
  {
    id: 'dtz.pv.021',
    de: 'sich erkundigen nach + Dat.',
    en: 'to enquire about',
    verb: 'sich erkundigen',
    preposition: 'nach',
    kasus: 'dativ',
    example: { de: 'Ich habe mich nach dem Preis erkundigt.', en: 'I enquired about the price.' }
  },
  {
    id: 'dtz.pv.022',
    de: 'suchen nach + Dat.',
    en: 'to look for',
    verb: 'suchen',
    preposition: 'nach',
    kasus: 'dativ',
    example: {
      de: 'Wir suchen nach einer Wohnung mit drei Zimmern.',
      en: 'We are looking for a flat with three rooms.'
    }
  },
  {
    id: 'dtz.pv.023',
    de: 'hören von + Dat.',
    en: 'to hear from',
    verb: 'hören',
    preposition: 'von',
    kasus: 'dativ',
    example: {
      de: 'Ich habe lange nichts mehr vom Jobcenter gehört.',
      en: 'I have not heard from the Jobcenter for a long time.'
    }
  },
  {
    id: 'dtz.pv.024',
    de: 'sprechen mit + Dat.',
    en: 'to speak with',
    verb: 'sprechen',
    preposition: 'mit',
    kasus: 'dativ',
    example: {
      de: 'Ich möchte mit der Sachbearbeiterin sprechen.',
      en: 'I would like to speak with the case worker.'
    }
  },
  {
    id: 'dtz.pv.025',
    de: 'sprechen über + Akk.',
    en: 'to talk about',
    verb: 'sprechen',
    preposition: 'über',
    kasus: 'akkusativ',
    example: {
      de: 'Wir sprechen im Kurs über das Thema Wohnen.',
      en: 'In class we talk about the topic of housing.'
    }
  },
  {
    id: 'dtz.pv.026',
    de: 'sich unterhalten über + Akk.',
    en: 'to talk about, to chat about',
    verb: 'sich unterhalten',
    preposition: 'über',
    kasus: 'akkusativ',
    example: {
      de: 'Die Eltern unterhalten sich über die Schule.',
      en: 'The parents are talking about the school.'
    }
  },
  {
    id: 'dtz.pv.027',
    de: 'sich verabreden mit + Dat.',
    en: 'to arrange to meet',
    verb: 'sich verabreden',
    preposition: 'mit',
    kasus: 'dativ',
    example: { de: 'Ich habe mich mit meiner Nachbarin verabredet.', en: 'I arranged to meet my neighbour.' }
  },
  {
    id: 'dtz.pv.028',
    de: 'bestehen aus + Dat.',
    en: 'to consist of',
    verb: 'bestehen',
    preposition: 'aus',
    kasus: 'dativ',
    example: { de: 'Die Prüfung besteht aus vier Teilen.', en: 'The exam consists of four parts.' }
  },
  {
    id: 'dtz.pv.029',
    de: 'abhängen von + Dat.',
    en: 'to depend on',
    verb: 'abhängen',
    preposition: 'von',
    kasus: 'dativ',
    example: {
      de: 'Der Preis hängt von der Größe der Wohnung ab.',
      en: 'The price depends on the size of the flat.'
    }
  },
  {
    id: 'dtz.pv.030',
    de: 'gehören zu + Dat.',
    en: 'to belong to, to be part of',
    verb: 'gehören',
    preposition: 'zu',
    kasus: 'dativ',
    example: {
      de: 'Zu den Unterlagen gehört auch eine Kopie des Passes.',
      en: 'A copy of the passport is also part of the documents.'
    }
  },
  {
    id: 'dtz.pv.031',
    de: 'einladen zu + Dat.',
    en: 'to invite to',
    verb: 'einladen',
    preposition: 'zu',
    kasus: 'dativ',
    example: {
      de: 'Wir laden Sie herzlich zum Elternabend ein.',
      en: 'We cordially invite you to the parents’ evening.'
    }
  },
  {
    id: 'dtz.pv.032',
    de: 'gratulieren zu + Dat.',
    en: 'to congratulate on',
    verb: 'gratulieren',
    preposition: 'zu',
    kasus: 'dativ',
    example: {
      de: 'Ich gratuliere Ihnen zur bestandenen Prüfung.',
      en: 'I congratulate you on passing the exam.'
    }
  },
  {
    id: 'dtz.pv.033',
    de: 'sich vorbereiten auf + Akk.',
    en: 'to prepare for',
    verb: 'sich vorbereiten',
    preposition: 'auf',
    kasus: 'akkusativ',
    example: { de: 'Wir bereiten uns auf den Deutsch-Test vor.', en: 'We are preparing for the German test.' }
  },
  {
    id: 'dtz.pv.034',
    de: 'sich verlassen auf + Akk.',
    en: 'to rely on',
    verb: 'sich verlassen',
    preposition: 'auf',
    kasus: 'akkusativ',
    example: {
      de: 'Auf meine Kollegin kann ich mich immer verlassen.',
      en: 'I can always rely on my colleague.'
    }
  },
  {
    id: 'dtz.pv.035',
    de: 'achten auf + Akk.',
    en: 'to pay attention to',
    verb: 'achten',
    preposition: 'auf',
    kasus: 'akkusativ',
    example: { de: 'Bitte achten Sie auf die Frist.', en: 'Please pay attention to the deadline.' }
  },
  {
    id: 'dtz.pv.036',
    de: 'verzichten auf + Akk.',
    en: 'to do without',
    verb: 'verzichten',
    preposition: 'auf',
    kasus: 'akkusativ',
    example: {
      de: 'Wir verzichten auf ein Auto und fahren Bus.',
      en: 'We do without a car and take the bus.'
    }
  },
  {
    id: 'dtz.pv.037',
    de: 'sich bedanken für + Akk.',
    en: 'to thank for',
    verb: 'sich bedanken',
    preposition: 'für',
    kasus: 'akkusativ',
    example: { de: 'Ich bedanke mich für Ihre schnelle Hilfe.', en: 'I thank you for your quick help.' }
  },
  {
    id: 'dtz.pv.038',
    de: 'sich entschuldigen für + Akk.',
    en: 'to apologise for',
    verb: 'sich entschuldigen',
    preposition: 'für',
    kasus: 'akkusativ',
    example: { de: 'Ich entschuldige mich für die späte Antwort.', en: 'I apologise for the late reply.' }
  },
  {
    id: 'dtz.pv.039',
    de: 'sorgen für + Akk.',
    en: 'to provide for, to ensure',
    verb: 'sorgen',
    preposition: 'für',
    kasus: 'akkusativ',
    example: {
      de: 'Die Hausverwaltung sorgt für die Sauberkeit im Haus.',
      en: 'The property management ensures cleanliness in the building.'
    }
  },
  {
    id: 'dtz.pv.040',
    de: 'leiden an + Dat.',
    en: 'to suffer from',
    verb: 'leiden',
    preposition: 'an',
    kasus: 'dativ',
    example: { de: 'Mein Vater leidet an Diabetes.', en: 'My father suffers from diabetes.' }
  }
];

export const DTZ_CASE_ITEMS: readonly CaseItem[] = [
  {
    id: 'dtz.c.001',
    de: 'für + Akkusativ',
    en: 'for',
    kasus: 'akkusativ',
    kind: 'praeposition',
    example: { de: 'Das Formular ist für den Vermieter.', en: 'The form is for the landlord.' }
  },
  {
    id: 'dtz.c.002',
    de: 'ohne + Akkusativ',
    en: 'without',
    kasus: 'akkusativ',
    kind: 'praeposition',
    example: {
      de: 'Ohne einen Termin kann ich Ihnen nicht helfen.',
      en: 'Without an appointment I cannot help you.'
    }
  },
  {
    id: 'dtz.c.003',
    de: 'gegen + Akkusativ',
    en: 'against',
    kasus: 'akkusativ',
    kind: 'praeposition',
    example: {
      de: 'Gegen den Bescheid kann man Widerspruch einlegen.',
      en: 'You can lodge an objection against the notice.'
    }
  },
  {
    id: 'dtz.c.004',
    de: 'durch + Akkusativ',
    en: 'through, by means of',
    kasus: 'akkusativ',
    kind: 'praeposition',
    example: {
      de: 'Durch den Deutschkurs habe ich viele Freunde gefunden.',
      en: 'Through the German course I have made many friends.'
    }
  },
  {
    id: 'dtz.c.005',
    de: 'um + Akkusativ',
    en: 'around, at (a time)',
    kasus: 'akkusativ',
    kind: 'praeposition',
    example: { de: 'Das Amt macht um 16 Uhr zu.', en: 'The office closes at 4 p.m.' }
  },
  {
    id: 'dtz.c.006',
    de: 'bis + Akkusativ',
    en: 'until, by',
    kasus: 'akkusativ',
    kind: 'praeposition',
    example: {
      de: 'Bis nächsten Freitag müssen Sie die Unterlagen abgeben.',
      en: 'You must hand in the documents by next Friday.'
    }
  },
  {
    id: 'dtz.c.007',
    de: 'mit + Dativ',
    en: 'with',
    kasus: 'dativ',
    kind: 'praeposition',
    example: { de: 'Ich fahre mit dem Bus zum Amt.', en: 'I take the bus to the office.' }
  },
  {
    id: 'dtz.c.008',
    de: 'nach + Dativ',
    en: 'after, to (a city)',
    kasus: 'dativ',
    kind: 'praeposition',
    example: { de: 'Nach dem Kurs gehe ich zur Bank.', en: 'After the course I go to the bank.' }
  },
  {
    id: 'dtz.c.009',
    de: 'aus + Dativ',
    en: 'from, out of',
    kasus: 'dativ',
    kind: 'praeposition',
    example: { de: 'Ich komme aus einem kleinen Dorf.', en: 'I come from a small village.' }
  },
  {
    id: 'dtz.c.010',
    de: 'von + Dativ',
    en: 'from, of',
    kasus: 'dativ',
    kind: 'praeposition',
    example: {
      de: 'Das ist ein Brief von meiner Krankenkasse.',
      en: 'That is a letter from my health insurer.'
    }
  },
  {
    id: 'dtz.c.011',
    de: 'zu + Dativ',
    en: 'to, at',
    kasus: 'dativ',
    kind: 'praeposition',
    example: {
      de: 'Ich gehe heute zu der Ausländerbehörde.',
      en: 'Today I am going to the immigration office.'
    }
  },
  {
    id: 'dtz.c.012',
    de: 'bei + Dativ',
    en: 'at, with (a person or firm)',
    kasus: 'dativ',
    kind: 'praeposition',
    example: { de: 'Ich arbeite bei einer Reinigungsfirma.', en: 'I work at a cleaning company.' }
  },
  {
    id: 'dtz.c.013',
    de: 'seit + Dativ',
    en: 'since, for',
    kasus: 'dativ',
    kind: 'praeposition',
    example: { de: 'Seit einem Jahr wohne ich in dieser Stadt.', en: 'I have lived in this city for a year.' }
  },
  {
    id: 'dtz.c.014',
    de: 'gegenüber + Dativ',
    en: 'opposite',
    kasus: 'dativ',
    kind: 'praeposition',
    example: { de: 'Die Bank ist gegenüber dem Rathaus.', en: 'The bank is opposite the town hall.' }
  },
  {
    id: 'dtz.c.015',
    de: 'außer + Dativ',
    en: 'except',
    kasus: 'dativ',
    kind: 'praeposition',
    example: { de: 'Außer dem Pass brauchen Sie ein Foto.', en: 'Apart from the passport you need a photo.' }
  },
  {
    id: 'dtz.c.016',
    de: 'in (wohin?) + Akkusativ',
    en: 'into, to (direction)',
    kasus: 'akkusativ',
    kind: 'praeposition',
    example: { de: 'Ich gehe in die Apotheke.', en: 'I am going to the pharmacy.' }
  },
  {
    id: 'dtz.c.017',
    de: 'in (wo?) + Dativ',
    en: 'in (location)',
    kasus: 'dativ',
    kind: 'praeposition',
    example: { de: 'Meine Kinder sind in der Kita.', en: 'My children are at the daycare.' }
  },
  {
    id: 'dtz.c.018',
    de: 'auf (wohin?) + Akkusativ',
    en: 'onto, to (direction)',
    kasus: 'akkusativ',
    kind: 'praeposition',
    example: {
      de: 'Legen Sie bitte die Unterlagen auf den Tisch.',
      en: 'Please put the documents on the table.'
    }
  },
  {
    id: 'dtz.c.019',
    de: 'auf (wo?) + Dativ',
    en: 'on (location)',
    kasus: 'dativ',
    kind: 'praeposition',
    example: { de: 'Die Unterlagen liegen auf dem Tisch.', en: 'The documents are on the table.' }
  },
  {
    id: 'dtz.c.020',
    de: 'an (wohin?) + Akkusativ',
    en: 'to, at (direction)',
    kasus: 'akkusativ',
    kind: 'praeposition',
    example: { de: 'Bitte wenden Sie sich an den Schalter 3.', en: 'Please turn to counter 3.' }
  },
  {
    id: 'dtz.c.021',
    de: 'an (wo?) + Dativ',
    en: 'at, on (location)',
    kasus: 'dativ',
    kind: 'praeposition',
    example: { de: 'Die Nummer steht an der Tür.', en: 'The number is on the door.' }
  },
  {
    id: 'dtz.c.022',
    de: 'vor (wo?) + Dativ',
    en: 'in front of (location)',
    kasus: 'dativ',
    kind: 'praeposition',
    example: { de: 'Wir warten vor dem Eingang.', en: 'We are waiting in front of the entrance.' }
  },
  {
    id: 'dtz.c.023',
    de: 'zwischen (wo?) + Dativ',
    en: 'between (location)',
    kasus: 'dativ',
    kind: 'praeposition',
    example: {
      de: 'Die Bank liegt zwischen der Post und dem Café.',
      en: 'The bank is between the post office and the café.'
    }
  },
  {
    id: 'dtz.c.024',
    de: 'wegen + Genitiv',
    en: 'because of',
    kasus: 'genitiv',
    kind: 'praeposition',
    example: {
      de: 'Wegen des Streiks fahren keine Busse.',
      en: 'Because of the strike no buses are running.'
    }
  },
  {
    id: 'dtz.c.025',
    de: 'trotz + Genitiv',
    en: 'despite',
    kasus: 'genitiv',
    kind: 'praeposition',
    example: {
      de: 'Trotz der Verspätung haben wir den Termin geschafft.',
      en: 'Despite the delay we made the appointment.'
    }
  },
  {
    id: 'dtz.c.026',
    de: 'während + Genitiv',
    en: 'during',
    kasus: 'genitiv',
    kind: 'praeposition',
    example: {
      de: 'Während der Sprechzeit ist das Büro besetzt.',
      en: 'During office hours the office is staffed.'
    }
  },
  {
    id: 'dtz.c.027',
    de: 'helfen + Dativ',
    en: 'to help',
    kasus: 'dativ',
    kind: 'verb',
    example: { de: 'Können Sie mir bitte helfen?', en: 'Can you please help me?' }
  },
  {
    id: 'dtz.c.028',
    de: 'danken + Dativ',
    en: 'to thank',
    kasus: 'dativ',
    kind: 'verb',
    example: { de: 'Ich danke Ihnen für Ihre Hilfe.', en: 'I thank you for your help.' }
  },
  {
    id: 'dtz.c.029',
    de: 'gehören + Dativ',
    en: 'to belong to',
    kasus: 'dativ',
    kind: 'verb',
    example: { de: 'Das Fahrrad gehört meinem Nachbarn.', en: 'The bike belongs to my neighbour.' }
  },
  {
    id: 'dtz.c.030',
    de: 'gefallen + Dativ',
    en: 'to please, to appeal to',
    kasus: 'dativ',
    kind: 'verb',
    example: { de: 'Die Wohnung gefällt meiner Frau gut.', en: 'My wife likes the flat very much.' }
  },
  {
    id: 'dtz.c.031',
    de: 'antworten + Dativ',
    en: 'to answer',
    kasus: 'dativ',
    kind: 'verb',
    example: { de: 'Das Amt hat mir noch nicht geantwortet.', en: 'The office has not answered me yet.' }
  },
  {
    id: 'dtz.c.032',
    de: 'gratulieren + Dativ',
    en: 'to congratulate',
    kasus: 'dativ',
    kind: 'verb',
    example: { de: 'Wir gratulieren Ihnen zum Zertifikat.', en: 'We congratulate you on the certificate.' }
  },
  {
    id: 'dtz.c.033',
    de: 'passen + Dativ',
    en: 'to suit, to fit',
    kasus: 'dativ',
    kind: 'verb',
    example: { de: 'Passt Ihnen der Termin am Montag?', en: 'Does the appointment on Monday suit you?' }
  },
  {
    id: 'dtz.c.034',
    de: 'fehlen + Dativ',
    en: 'to be missing',
    kasus: 'dativ',
    kind: 'verb',
    example: { de: 'Mir fehlt noch ein Nachweis.', en: 'I am still missing a proof.' }
  },
  {
    id: 'dtz.c.035',
    de: 'schmecken + Dativ',
    en: 'to taste (good)',
    kasus: 'dativ',
    kind: 'verb',
    example: { de: 'Das Essen in der Kantine schmeckt mir.', en: 'I like the food in the canteen.' }
  },
  {
    id: 'dtz.c.036',
    de: 'zuhören + Dativ',
    en: 'to listen to',
    kasus: 'dativ',
    kind: 'verb',
    example: { de: 'Ich höre dem Sprecher genau zu.', en: 'I listen to the speaker carefully.' }
  },
  {
    id: 'dtz.c.037',
    de: 'brauchen + Akkusativ',
    en: 'to need',
    kasus: 'akkusativ',
    kind: 'verb',
    example: { de: 'Ich brauche einen neuen Ausweis.', en: 'I need a new ID.' }
  },
  {
    id: 'dtz.c.038',
    de: 'besuchen + Akkusativ',
    en: 'to visit, to attend',
    kasus: 'akkusativ',
    kind: 'verb',
    example: { de: 'Meine Tochter besucht die Grundschule.', en: 'My daughter attends primary school.' }
  },
  {
    id: 'dtz.c.039',
    de: 'fragen + Akkusativ',
    en: 'to ask (a person)',
    kasus: 'akkusativ',
    kind: 'verb',
    example: {
      de: 'Fragen Sie bitte den Mitarbeiter am Schalter.',
      en: 'Please ask the employee at the counter.'
    }
  },
  {
    id: 'dtz.c.040',
    de: 'jeden Tag — Akkusativ',
    en: 'every day',
    kasus: 'akkusativ',
    kind: 'wendung',
    example: { de: 'Jeden Tag lerne ich zwanzig neue Wörter.', en: 'Every day I learn twenty new words.' }
  },
  {
    id: 'dtz.c.041',
    de: 'nächste Woche — Akkusativ',
    en: 'next week',
    kasus: 'akkusativ',
    kind: 'wendung',
    example: {
      de: 'Nächste Woche habe ich einen Termin beim Amt.',
      en: 'Next week I have an appointment at the office.'
    }
  },
  {
    id: 'dtz.c.042',
    de: 'am Montag — Dativ',
    en: 'on Monday',
    kasus: 'dativ',
    kind: 'wendung',
    example: {
      de: 'Am Montag ist das Bürgeramt bis 18 Uhr geöffnet.',
      en: 'On Monday the citizens’ office is open until 6 p.m.'
    }
  },
  {
    id: 'dtz.c.043',
    de: 'im Januar — Dativ',
    en: 'in January',
    kasus: 'dativ',
    kind: 'wendung',
    example: { de: 'Im Januar beginnt der neue Kurs.', en: 'The new course starts in January.' }
  }
];
