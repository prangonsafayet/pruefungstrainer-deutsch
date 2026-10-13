import { Link } from 'react-router-dom';

import PageTitle from '@shared/components/layout/PageTitle/PageTitle.tsx';
import { IMPRESSUM_PATH, LEGAL_OPERATOR } from '@shared/config/legal.ts';

/**
 * Datenschutzerklärung for the public, local-only deployment: Netlify hosting and its server
 * logs, browser storage, the browser's own speech synthesis and recordings that never leave the
 * device. It states facts about this app; legal wording the author has not verified is marked
 * TODO(legal), to be filled from a generator (e-recht24, datenschutz-generator.de).
 * If cloud sync is ever switched on for the deployment, this page must also cover Supabase and
 * the OAuth providers.
 */
const DatenschutzPage = () => (
  <article lang="de" className="prose max-w-3xl">
    <PageTitle>Datenschutzerklärung</PageTitle>

    <h2>1. Verantwortlicher</h2>
    <p>
      {LEGAL_OPERATOR.name}, {LEGAL_OPERATOR.street}, {LEGAL_OPERATOR.city}, {LEGAL_OPERATOR.country}
      <br />
      E-Mail: <a href={`mailto:${LEGAL_OPERATOR.email}`}>{LEGAL_OPERATOR.email}</a> — siehe auch das{' '}
      <Link to={IMPRESSUM_PATH}>Impressum</Link>.
    </p>

    <h2>2. Das Wichtigste in Kürze</h2>
    <ul>
      <li>Diese Website hat keine Benutzerkonten, keine Registrierung und keine Anmeldung.</li>
      <li>Es gibt keine Analyse- oder Tracking-Werkzeuge, keine Werbung und keine Cookies.</li>
      <li>Schriftarten und alle Skripte werden von dieser Website selbst ausgeliefert, nicht von Dritten.</li>
      <li>Ihr Lernfortschritt wird nur in Ihrem Browser gespeichert und nicht an einen Server übertragen.</li>
    </ul>

    <h2>3. Hosting und Server-Logfiles</h2>
    <p>
      Die Website wird bei Netlify, Inc., 101 2nd Street, San Francisco, CA 94105, USA, gehostet. Beim Aufruf
      der Seite verarbeitet Netlify technisch notwendige Daten, insbesondere Ihre IP-Adresse, Datum und
      Uhrzeit des Abrufs, die aufgerufene Adresse, den Referrer und die Browserkennung (User-Agent), um die
      Seite auszuliefern und den Betrieb abzusichern. Netlify gibt an, nach dem EU-U.S. Data Privacy Framework
      zertifiziert zu sein. Mit Netlify besteht ein Auftragsverarbeitungsvertrag (Data Processing Agreement),
      der Teil der Nutzungsbedingungen von Netlify ist.
    </p>
    <p>
      <mark>
        [TODO: Rechtsgrundlage (voraussichtlich Art. 6 Abs. 1 lit. f DSGVO), Speicherdauer der Logfiles und
        Hinweis zur Drittlandübermittlung aus einem Generator übernehmen.]
      </mark>
    </p>

    <h2>4. Speicherung im Browser</h2>
    <p>
      Die App speichert Ihren Fortschritt (Prüfungsversuche, Antworten, Lernplan, Einstellungen) im lokalen
      Speicher Ihres Browsers (localStorage und sessionStorage). Damit die App auch offline funktioniert, legt
      ein Service Worker die Programmdateien im Browser-Cache ab. Diese Daten verlassen Ihr Gerät nicht. Sie
      können sie jederzeit in den Einstellungen unter „Delete all progress“ oder über die Website-Daten Ihres
      Browsers löschen und unter „Export progress“ als Datei sichern.
    </p>
    <p>
      <mark>
        [TODO: Rechtsgrundlage für den Zugriff auf den Endgerätespeicher (voraussichtlich § 25 Abs. 2 Nr. 2
        TDDDG) aus einem Generator übernehmen.]
      </mark>
    </p>

    <h2>5. Vorlesefunktion (Hörverstehen)</h2>
    <p>
      Die Hörtexte werden mit der Sprachausgabe Ihres Browsers (Web Speech API) vorgelesen. Die App sendet
      dafür keine Daten an eigene Server oder an Dritte. Je nach Browser und gewählter Stimme kann die
      Sprachausgabe allerdings vom Browser-Hersteller über dessen Dienste erzeugt werden (z. B. Online-Stimmen
      in Google Chrome); dafür gelten die Datenschutzbestimmungen des jeweiligen Browser-Herstellers. Auf dem
      Gerät installierte Stimmen arbeiten ohne Übertragung.
    </p>

    <h2>6. Mikrofon (Sprechen)</h2>
    <p>
      Im Modul „Sprechen“ können Sie Ihre Antwort aufnehmen, sobald Sie den Mikrofonzugriff im Browser
      erlauben. Die Aufnahme bleibt im Arbeitsspeicher Ihres Browsers, wird nur auf Ihrem Gerät abgespielt,
      nicht gespeichert und nicht übertragen. Sie verschwindet, wenn Sie die Seite verlassen oder neu laden.
    </p>

    <h2>7. Kontakt per E-Mail</h2>
    <p>
      Wenn Sie mir eine E-Mail schreiben, verarbeite ich Ihre Angaben nur, um Ihre Anfrage zu beantworten.
    </p>
    <p>
      <mark>
        [TODO: Rechtsgrundlage und Speicherdauer für E-Mail-Anfragen aus einem Generator übernehmen.]
      </mark>
    </p>

    <h2>8. Ihre Rechte</h2>
    <p>
      <mark>
        [TODO: Abschnitt zu den Betroffenenrechten (Art. 15–21 DSGVO) und zum Beschwerderecht bei einer
        Aufsichtsbehörde aus einem Generator übernehmen.]
      </mark>
    </p>

    <p className="text-sm">
      Stand: <mark>[TODO: Datum]</mark>
    </p>
  </article>
);

export default DatenschutzPage;
