import { type ReactNode } from 'react';

import { BookOpen, Info } from 'lucide-react';

import PageTitle from '@shared/components/layout/PageTitle/PageTitle.tsx';
import SectionTitle from '@shared/components/layout/SectionTitle/SectionTitle.tsx';
import { useTrainerContent } from '@shared/hooks/useTrainerContent.tsx';
import { plural } from '@shared/lib/format.ts';
import { type LearnDay } from '@shared/types/learn.ts';
import { type TrainerId } from '@shared/types/trainer.ts';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@shared/ui/accordion.tsx';
import { Alert, AlertDescription } from '@shared/ui/alert.tsx';
import { Button } from '@shared/ui/button.tsx';
import { Card, CardContent } from '@shared/ui/card.tsx';
import { Progress } from '@shared/ui/progress.tsx';
import { Sheet, SheetContent, SheetTitle } from '@shared/ui/sheet.tsx';

import CheatsheetPanel from '@features/curriculum/components/CheatsheetPanel/CheatsheetPanel.tsx';
import LearnDayCard from '@features/curriculum/components/LearnDayCard/LearnDayCard.tsx';
import LearnSlotSection from '@features/curriculum/components/LearnSlotSection/LearnSlotSection.tsx';
import { useCheatsheetPanel } from '@features/curriculum/hooks/useCheatsheetPanel.tsx';
import { useLearnPlan } from '@features/curriculum/hooks/useLearnPlan.tsx';
import { useScheduledLearn } from '@features/curriculum/hooks/useScheduledLearn.tsx';

interface CurriculumPageProps {
  readonly trainer: TrainerId;
}

/** One trainer's curriculum, re-paced around its own exam date, with its cheatsheets at hand. */
const CurriculumPage = ({ trainer }: CurriculumPageProps) => {
  const plan = useLearnPlan(trainer);
  const scheduled = useScheduledLearn(trainer);
  const panel = useCheatsheetPanel();
  const curriculum = useTrainerContent(trainer).curriculum;
  const hasCheatsheets = Object.keys(plan.cheatsheets).length > 0;

  const dayCard = (day: LearnDay, complete: boolean) => (
    <LearnDayCard
      key={day.day}
      day={day}
      complete={complete}
      cheatsheets={plan.cheatsheets}
      basePath={plan.basePath}
      aiPromptLang={plan.aiPromptLang}
      isTaskDone={index => plan.isTaskDone(day.day, index)}
      onToggleTask={(index, done) => {
        plan.toggleTask(day.day, index, done);
      }}
      onOpenCheatsheet={id => {
        panel.open(id, day.day);
      }}
      onStartModule={(exam, module) => {
        plan.startModule(exam, module, { resumeIfSame: true });
      }}
    />
  );

  const cheatsheetPanel = (heading: (text: string) => ReactNode) => (
    <CheatsheetPanel
      cheatsheets={plan.cheatsheets}
      openId={panel.openId}
      fromDay={panel.fromDay}
      heading={heading}
      onOpen={id => {
        panel.open(id);
      }}
      onShowList={panel.showList}
      onBackToDay={panel.backToDay}
    />
  );

  return (
    <>
      <PageTitle
        /* The curriculum intro is repo-authored HTML (it bolds a few phrases) and is
           injected rather than rendered as text — same as the guide and the cheatsheets. It
           is the fallback for a date no plan can be built from. */
        lead={scheduled.lead ?? <span dangerouslySetInnerHTML={{ __html: curriculum.intro }} />}
      >
        {scheduled.headline}
      </PageTitle>

      {scheduled.notice ? (
        <Alert className="mb-4">
          <Info aria-hidden />
          <AlertDescription>{scheduled.notice}</AlertDescription>
        </Alert>
      ) : null}

      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start lg:gap-8 xl:grid-cols-[minmax(0,1fr)_25rem]">
        <div className="min-w-0">
          <Card>
            <CardContent className="space-y-3">
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="font-heading font-bold">Plan progress</span>
                <span className="tabular-nums text-muted-foreground">
                  {plan.summary.doneTasks}/{plan.summary.totalTasks} tasks done
                </span>
              </div>
              <Progress value={plan.summary.percent} aria-label="Plan progress" />
              {hasCheatsheets && !panel.wide ? (
                <Button variant="secondary" size="sm" onClick={panel.showList}>
                  <BookOpen /> Cheatsheets ({Object.keys(plan.cheatsheets).length})
                </Button>
              ) : null}
            </CardContent>
          </Card>

          {scheduled.scheduled ? (
            <>
              <SectionTitle>Your schedule</SectionTitle>
              <div className="stagger space-y-8">
                {scheduled.groups.map(group => (
                  <LearnSlotSection key={group.key} group={group} plan={plan} onOpenCheatsheet={panel.open} />
                ))}
              </div>
            </>
          ) : (
            <>
              <SectionTitle>The curriculum</SectionTitle>
              <div className="stagger space-y-4">{scheduled.pending.map(day => dayCard(day, false))}</div>
            </>
          )}

          {scheduled.extra.length > 0 ? (
            <>
              <SectionTitle>Extra material</SectionTitle>
              <p className="mb-3 text-muted-foreground">
                Not scheduled at your pace — these {scheduled.extra.length} days are worth doing if you find
                the time, and they move into the plan automatically if your exam date moves.
              </p>
              <div className="stagger space-y-4">{scheduled.extra.map(day => dayCard(day, false))}</div>
            </>
          ) : null}

          {scheduled.done.length > 0 ? (
            <>
              <SectionTitle>Done</SectionTitle>
              <Card>
                <CardContent>
                  <Accordion type="single" collapsible>
                    <AccordionItem value="done" className="border-b-0">
                      <AccordionTrigger className="text-base font-semibold">
                        {plural(scheduled.done.length, 'day')} finished
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">{scheduled.done.map(day => dayCard(day, true))}</div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </>
          ) : null}
        </div>

        {hasCheatsheets && panel.wide ? (
          <aside
            aria-label="Cheatsheets"
            className="sticky top-[calc(var(--header-h,4rem)+1.5rem)] flex max-h-[calc(100dvh-var(--header-h,4rem)-3rem)] flex-col overflow-y-auto rounded-2xl bg-card p-5 shadow-soft"
          >
            {cheatsheetPanel(text => (
              <h2 ref={panel.headingRef} tabIndex={-1} className="text-lg font-bold outline-none">
                {text}
              </h2>
            ))}
          </aside>
        ) : null}
      </div>

      {hasCheatsheets && !panel.wide ? (
        <Sheet open={panel.sheetOpen} onOpenChange={panel.setSheetOpen}>
          <SheetContent
            side={panel.sheetSide}
            aria-describedby={undefined}
            closeLabel="Close cheatsheets"
            onCloseAutoFocus={panel.onSheetCloseAutoFocus}
          >
            <div className="overflow-y-auto p-5">
              {cheatsheetPanel(text => (
                <SheetTitle className="pr-12">{text}</SheetTitle>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      ) : null}
    </>
  );
};

export default CurriculumPage;
