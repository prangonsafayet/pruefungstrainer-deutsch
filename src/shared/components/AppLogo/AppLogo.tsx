interface AppLogoProps {
  readonly className?: string;
}

/**
 * Inlined so the mark paints with the first frame. Its colours are the fixed `--logo-*`
 * tokens (one value in both themes — a brand mark does not invert). Kept visually identical
 * to `public/logo.svg`, which is the PWA icon and social-preview source — change both together.
 * Decorative: the link around it carries the accessible name.
 */
const AppLogo = ({ className = 'size-9' }: AppLogoProps) => (
  <svg className={className} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id="app-logo-tile" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" className="[stop-color:var(--logo-tile-light)]" />
        <stop offset="1" className="[stop-color:var(--logo-tile)]" />
      </linearGradient>
    </defs>
    <rect width="64" height="64" rx="16" fill="url(#app-logo-tile)" />
    <rect x="13" y="11" width="31" height="42" rx="5" className="fill-[var(--logo-paper)]" />
    <g className="fill-[var(--logo-tile)]" opacity=".3">
      <rect x="18.5" y="18" width="20" height="3" rx="1.5" />
      <rect x="18.5" y="25" width="20" height="3" rx="1.5" />
      <rect x="18.5" y="32" width="13" height="3" rx="1.5" />
    </g>
    <circle
      cx="44"
      cy="44"
      r="13"
      strokeWidth="3"
      className="fill-[var(--logo-mark)] stroke-[var(--logo-paper)]"
    />
    <path
      d="M38.5 44.5l3.8 3.8 7.2-7.6"
      fill="none"
      strokeWidth="3.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="stroke-[var(--logo-paper)]"
    />
  </svg>
);

export default AppLogo;
