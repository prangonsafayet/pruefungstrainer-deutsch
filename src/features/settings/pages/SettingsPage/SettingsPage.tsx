import { Link } from 'react-router-dom';

import SyncPanel from '@shared/account-sync/components/sync/SyncPanel/SyncPanel.tsx';
import { isSyncConfigured } from '@shared/account-sync/lib/supabaseClient.ts';
import PageTitle from '@shared/components/layout/PageTitle/PageTitle.tsx';
import { DATENSCHUTZ_PATH, IMPRESSUM_PATH, INDEPENDENCE_DISCLAIMER } from '@shared/config/legal.ts';
import { TRAINER_ORDER } from '@shared/config/trainers.ts';

import AudioSettingsCard from '@features/settings/components/AudioSettingsCard/AudioSettingsCard.tsx';
import DeleteProgressCard from '@features/settings/components/DeleteProgressCard/DeleteProgressCard.tsx';
import DiagnosticsCard from '@features/settings/components/DiagnosticsCard/DiagnosticsCard.tsx';
import ExamConditionsCard from '@features/settings/components/ExamConditionsCard/ExamConditionsCard.tsx';
import ProgressBackupCard from '@features/settings/components/ProgressBackupCard/ProgressBackupCard.tsx';
import SettingsSection from '@features/settings/components/SettingsSection/SettingsSection.tsx';
import TrainerExamDateCard from '@features/settings/components/TrainerExamDateCard/TrainerExamDateCard.tsx';

/**
 * Six groups, in the order they matter: when you sit the exam, how strictly a mock exam
 * runs, what it sounds like, where the results are kept, and what to do with them — then help for when something breaks, and last who
 * made this and the legal pages. Grouping by what a setting is for is what keeps the
 * destructive action out of a row of dropdowns.
 */
const SettingsPage = () => (
  <>
    <PageTitle lead="Your exam dates drive the study plans. Everything else here decides how a mock exam runs — set it once and leave it, so your scores stay comparable.">
      Settings
    </PageTitle>

    <SettingsSection
      title="Your exams"
      lead="Each trainer has its own date, and its 28-day plan re-paces itself around that date on its own."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {TRAINER_ORDER.map(trainer => (
          <TrainerExamDateCard key={trainer} trainer={trainer} />
        ))}
      </div>
    </SettingsSection>

    <SettingsSection
      title="Exam conditions"
      lead="How closely a mock exam copies the real sitting. The defaults match the official format of each paper — relax one and your scores stop being comparable."
    >
      <ExamConditionsCard />
    </SettingsSection>

    <SettingsSection
      title="Listening audio"
      lead="Your browser reads the listening modules aloud. One voice serves every trainer."
    >
      <AudioSettingsCard />
    </SettingsSection>

    <SettingsSection
      title="Account and sync"
      lead={
        isSyncConfigured
          ? 'Sign in to carry your progress between devices. Without it, everything stays in this browser.'
          : 'Everything stays in this browser on this deployment.'
      }
    >
      <SyncPanel />
    </SettingsSection>

    <SettingsSection
      title="Your data"
      lead="Your attempts, plans and settings are stored in this browser. Take a copy of them, restore one, or clear everything out."
    >
      <div className="space-y-4">
        <ProgressBackupCard />
        <DeleteProgressCard />
      </div>
    </SettingsSection>

    <SettingsSection
      title="Something not working?"
      lead="Copy a short technical summary to paste into a bug report. It stays on this device until you paste it."
    >
      <DiagnosticsCard />
    </SettingsSection>

    <SettingsSection title="About" lead={INDEPENDENCE_DISCLAIMER}>
      <p className="text-sm text-muted-foreground">
        <Link to={IMPRESSUM_PATH} className="text-primary underline-offset-4 hover:underline">
          Impressum
        </Link>{' '}
        ·{' '}
        <Link to={DATENSCHUTZ_PATH} className="text-primary underline-offset-4 hover:underline">
          Datenschutzerklärung
        </Link>
      </p>
    </SettingsSection>
  </>
);

export default SettingsPage;
