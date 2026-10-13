import { type ReactNode } from 'react';

interface SettingsSectionProps {
  /** Names the section for the eye and, as a landmark, for a screen reader. */
  readonly title: string;
  /** What the settings in it are for. One sentence. */
  readonly lead: string;
  readonly children: ReactNode;
}

/**
 * One group of settings: a heading, what the group is for, and its controls.
 *
 * The page is a list of these rather than one long column, so every control sits under a
 * heading that says what changing it affects. Each is a named region, which is what lets a
 * screen reader jump between the groups instead of walking every field.
 */
const SettingsSection = ({ title, lead, children }: SettingsSectionProps) => (
  <section
    aria-label={title}
    className="mt-10 border-border md:grid md:grid-cols-[13rem_minmax(0,1fr)] md:gap-8 md:border-t md:pt-8 lg:grid-cols-[16rem_minmax(0,1fr)]"
  >
    {/* Tablet and up: what the group is for on the left, its controls on the right. */}
    <div className="mb-3 md:mb-0">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="mt-1 max-w-3xl text-sm text-muted-foreground">{lead}</p>
    </div>
    <div className="min-w-0">{children}</div>
  </section>
);

export default SettingsSection;
