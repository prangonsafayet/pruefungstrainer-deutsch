import { X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

import PageTitle from '@shared/components/layout/PageTitle/PageTitle.tsx';
import { TRAINERS } from '@shared/config/trainers.ts';
import { type TrainerId } from '@shared/types/trainer.ts';
import { Button } from '@shared/ui/button.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@shared/ui/tabs.tsx';

import EmptyBankNotice from '@features/vocab-practice/components/EmptyBankNotice/EmptyBankNotice.tsx';
import ReferenceTables from '@features/vocab-practice/components/reference/ReferenceTables/ReferenceTables.tsx';
import VocabCategoryPicker from '@features/vocab-practice/components/session/VocabCategoryPicker/VocabCategoryPicker.tsx';
import VocabFlashcardSession from '@features/vocab-practice/components/session/VocabFlashcardSession/VocabFlashcardSession.tsx';
import VocabQuizSession from '@features/vocab-practice/components/session/VocabQuizSession/VocabQuizSession.tsx';

import { useDeepLinkedQuiz } from './useDeepLinkedQuiz.tsx';
import { usePractice } from './usePractice.tsx';

interface VocabPracticePageProps {
  readonly trainer: TrainerId;
}

/**
 * The practice hub of any trainer: flashcards, quiz drills and the reference tables, all
 * over whatever bank its descriptor offers. A trainer whose bank is empty gets the same
 * screen with its empty state — there is no second implementation.
 */
const VocabPracticePage = ({ trainer }: VocabPracticePageProps) => {
  const practice = usePractice(trainer);
  const [params] = useSearchParams();
  const { name, short, basePath } = TRAINERS[trainer];

  const wantedTab = params.get('tab');
  useDeepLinkedQuiz(practice.startQuiz);

  const { session } = practice;

  if (session) {
    return (
      <>
        <div className="mb-4 flex items-center justify-between">
          <PageTitle
            lead={
              session.kind === 'flashcards'
                ? 'Flip, then grade yourself honestly — that is what schedules the reviews.'
                : 'Instant feedback after every answer, with the English meaning.'
            }
          >
            {session.kind === 'flashcards' ? 'Flashcards' : 'Quiz'} · {short}
          </PageTitle>
          <Button variant="ghost" size="sm" onClick={practice.endSession}>
            <X /> End session
          </Button>
        </div>

        {session.kind === 'flashcards' ? (
          <VocabFlashcardSession
            session={session}
            done={practice.sessionDone}
            onFlip={practice.flip}
            onGrade={practice.gradeCard}
            onRestart={() => {
              practice.startFlashcards(session.category);
            }}
            onClose={practice.endSession}
          />
        ) : (
          <VocabQuizSession
            session={session}
            done={practice.sessionDone}
            onChoose={practice.chooseOption}
            onNext={practice.nextQuestion}
            onRestart={() => {
              practice.startQuiz(session.category);
            }}
            onClose={practice.endSession}
          />
        )}
      </>
    );
  }

  if (practice.mastery.total === 0) {
    return (
      <>
        <PageTitle lead="Flashcards and quizzes feed one spaced-repetition schedule; the tables are for looking things up.">
          Practice · {name}
        </PageTitle>
        <EmptyBankNotice trainerName={name} learnTo={`${basePath}/learn`} />
      </>
    );
  }

  return (
    <>
      <PageTitle
        lead={
          <>
            {String(practice.mastery.due)} item{practice.mastery.due === 1 ? '' : 's'} due today. Flashcards
            and quizzes feed the same spaced-repetition schedule; the tables are for looking things up.
          </>
        }
      >
        Practice · {name}
      </PageTitle>

      <Tabs defaultValue={wantedTab === 'tables' ? 'tables' : 'practice'}>
        <TabsList>
          <TabsTrigger value="practice">Practise</TabsTrigger>
          <TabsTrigger value="tables">Reference tables</TabsTrigger>
        </TabsList>
        <TabsContent value="practice">
          <VocabCategoryPicker
            mastery={practice.categoryMastery}
            onFlashcards={practice.startFlashcards}
            onQuiz={practice.startQuiz}
          />
        </TabsContent>
        <TabsContent value="tables">
          <ReferenceTables bank={practice.vocab} />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default VocabPracticePage;
