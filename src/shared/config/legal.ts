/**
 * Legal facts shown on the Impressum, the Datenschutzerklärung, the footer and Settings. One
 * place, so a change of address or wording is one edit.
 *
 * TODO(legal): the postal address is a placeholder. § 5 DDG requires a postal address where
 * the operator can be served (a home address or a c/o Impressum service) — fill it in before
 * relying on these pages.
 */
export const LEGAL_OPERATOR = {
  name: 'Safayet Bin Azam',
  street: '[TODO: Straße und Hausnummer]',
  city: '[TODO: PLZ und Ort]',
  country: 'Deutschland',
  email: 'prangonsafayet@gmail.com'
} as const;

/** The independence notice: footer, Settings and README carry this exact text. */
export const INDEPENDENCE_DISCLAIMER =
  'Independent project. Not affiliated with or endorsed by telc gGmbH, g.a.s.t. e.V. or the Bundesamt für Migration und Flüchtlinge (BAMF). Exam names are used only to describe what this app helps you prepare for.';

export const IMPRESSUM_PATH = '/impressum';
export const DATENSCHUTZ_PATH = '/datenschutz';
