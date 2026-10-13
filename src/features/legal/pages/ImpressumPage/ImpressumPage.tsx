import { Link } from 'react-router-dom';

import PageTitle from '@shared/components/layout/PageTitle/PageTitle.tsx';
import { DATENSCHUTZ_PATH, INDEPENDENCE_DISCLAIMER, LEGAL_OPERATOR } from '@shared/config/legal.ts';

/**
 * Anbieterkennzeichnung (§ 5 DDG). German, because the obligation and its readers are German;
 * the operator's details come from `@shared/config/legal.ts`.
 */
const ImpressumPage = () => (
  <article lang="de" className="prose max-w-3xl">
    <PageTitle>Impressum</PageTitle>

    <h2>Angaben gemäß § 5 DDG</h2>
    <p>
      {LEGAL_OPERATOR.name}
      <br />
      {LEGAL_OPERATOR.street}
      <br />
      {LEGAL_OPERATOR.city}
      <br />
      {LEGAL_OPERATOR.country}
    </p>

    <h2>Kontakt</h2>
    <p>
      E-Mail: <a href={`mailto:${LEGAL_OPERATOR.email}`}>{LEGAL_OPERATOR.email}</a>
    </p>

    {/* TODO(legal): confirm with a generator (e-recht24, datenschutz-generator.de) whether a
        "Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV" block is needed for this site. */}
    <p>
      <mark>
        [TODO: Prüfen, ob ein Abschnitt „Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV“ nötig ist.]
      </mark>
    </p>

    <h2>Hinweis zur Unabhängigkeit</h2>
    <p>
      Unabhängiges, nicht-kommerzielles Projekt. Es besteht keine Verbindung zur telc gGmbH, zur g.a.s.t. e.V.
      oder zum Bundesamt für Migration und Flüchtlinge (BAMF), und es liegt keine Billigung durch diese vor.
      Prüfungsbezeichnungen werden ausschließlich verwendet, um zu beschreiben, worauf die App vorbereitet.
      Alle Übungsaufgaben sind eigene Texte.
    </p>
    <p lang="en" className="text-sm">
      {INDEPENDENCE_DISCLAIMER}
    </p>

    {/* TODO(legal): Haftung für Inhalte / Links und Urheberrecht — take from a generator if wanted. */}
    <p>
      <mark>[TODO: Optionale Abschnitte zu Haftung und Urheberrecht aus einem Generator übernehmen.]</mark>
    </p>

    <p>
      Datenschutz: siehe <Link to={DATENSCHUTZ_PATH}>Datenschutzerklärung</Link>.
    </p>
  </article>
);

export default ImpressumPage;
