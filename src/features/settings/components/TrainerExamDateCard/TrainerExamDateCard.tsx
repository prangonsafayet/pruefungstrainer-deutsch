import { type TrainerId } from '@shared/types/trainer.ts';
import { Card, CardContent, CardHeader } from '@shared/ui/card.tsx';

import ExamDateControls from '@features/settings/components/ExamDateControls/ExamDateControls.tsx';
import SettingsField from '@features/settings/components/SettingsField/SettingsField.tsx';
import { useTrainerConditions } from '@features/settings/hooks/useTrainerConditions.tsx';

interface TrainerExamDateCardProps {
  readonly trainer: TrainerId;
}

/**
 * One trainer's exam date, on its own card so the three read as peers rather than as one
 * block of six fields. The accent is the trainer's, painted as a rail down the edge: as
 * heading text it would be a 2:1 contrast ratio, and the name already says which exam.
 */
const TrainerExamDateCard = ({ trainer }: TrainerExamDateCardProps) => {
  const { name, accent, settings, setSetting } = useTrainerConditions(trainer);

  return (
    <Card className="relative gap-4 overflow-hidden py-5">
      <span aria-hidden className="absolute inset-y-0 left-0 w-1" style={{ background: accent }} />
      <CardHeader>
        <h3 className="font-semibold leading-none">{name}</h3>
      </CardHeader>
      <CardContent>
        <SettingsField label="Exam date">
          <ExamDateControls
            trainer={trainer}
            value={settings.examDate}
            onChange={iso => {
              setSetting('examDate', iso);
            }}
          />
        </SettingsField>
      </CardContent>
    </Card>
  );
};

export default TrainerExamDateCard;
