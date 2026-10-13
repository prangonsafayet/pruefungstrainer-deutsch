/**
 * Splits an authored guide into the parts the page lays out itself: its title becomes the
 * page's one `<h1>`, its lead the page lead, and its table of contents a side nav — the rest
 * is the prose body. Every part stays authored HTML (entities such as `&amp;` included) and is
 * injected, like the body.
 *
 * shortcut: regexes over trusted, repo-authored HTML with one `<h1>`, one `p.lead` and one
 * flat `div.guide-toc` of `<a href="#…">` links; a guide authored differently keeps those
 * parts in its body (nothing is lost), and would need a real parser to be split.
 */

export interface GuideTocEntry {
  readonly href: string;
  /** Authored HTML. */
  readonly label: string;
}

export interface GuideParts {
  /** Authored HTML, or null when the guide has no `<h1>`. */
  readonly title: string | null;
  readonly lead: string | null;
  readonly toc: readonly GuideTocEntry[];
  readonly body: string;
}

const TITLE = /<h1\b[^>]*>([\s\S]*?)<\/h1>/;
const LEAD = /<p class="lead">([\s\S]*?)<\/p>/;
const TOC = /<div class="guide-toc">([\s\S]*?)<\/div>/;
const TOC_LINK = /<a href="(#[^"]+)">([\s\S]*?)<\/a>/g;

export const splitGuide = (html: string): GuideParts => {
  let body = html;
  const take = (pattern: RegExp): string | null => {
    const match = pattern.exec(body);
    if (!match) return null;
    body = body.replace(match[0], '');
    return (match[1] ?? '').trim();
  };

  const title = take(TITLE);
  const lead = take(LEAD);
  const tocHtml = take(TOC);
  const toc =
    tocHtml === null
      ? []
      : [...tocHtml.matchAll(TOC_LINK)].map(([, href = '', label = '']) => ({ href, label: label.trim() }));

  return { title, lead, toc, body: body.trim() };
};
