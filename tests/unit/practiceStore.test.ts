import { beforeEach, describe, expect, it } from 'vitest';

import { type StudyCard } from '@shared/types/vocab.ts';

import { type QuizQuestion } from '@features/vocab-practice/lib/quiz.ts';
import { isSessionDone, usePracticeStore } from '@features/vocab-practice/lib/practiceStore.ts';

/*
 * The practice session state machine. The counters feed the end-of-session score and every
 * grade writes SRS state, so the guards matter: a quiz answer locks once, "next" needs an
 * answer, and an action for the other session kind changes nothing.
 */

const card = (id: string): StudyCard => ({
  id,
  category: 'verbs',
  front: id,
  frontDetail: '',
  back: id,
  example: { de: '', en: '' }
});

const question = (id: string, answer: number): QuizQuestion => ({
  id,
  category: 'nouns',
  prompt: id,
  hint: '',
  options: ['a', 'b', 'c'],
  answer,
  explanation: ''
});

const store = usePracticeStore.getState;

beforeEach(() => {
  store().end();
});

describe('a flashcard session', () => {
  it('flips, grades both ways, moves on and is done after the last card', () => {
    store().startFlashcards('b1', 'verbs', [card('gehen'), card('kommen')]);
    store().flip();
    expect(store().session).toMatchObject({ kind: 'flashcards', trainer: 'b1', flipped: true, index: 0 });

    store().grade(true);
    expect(store().session).toMatchObject({ correct: 1, wrong: 0, index: 1, flipped: false });
    const session = store().session;
    expect(session && isSessionDone(session)).toBe(false);

    store().grade(false);
    expect(store().session).toMatchObject({ correct: 1, wrong: 1, index: 2 });
    const done = store().session;
    expect(done && isSessionDone(done)).toBe(true);
  });

  it('ignores quiz actions', () => {
    store().startFlashcards('b1', 'mixed', [card('gehen')]);
    const before = store().session;

    store().choose(0);
    store().next();

    expect(store().session).toEqual(before);
  });
});

describe('a quiz session', () => {
  it('locks the first answer, counts it once, and only advances after an answer', () => {
    store().startQuiz('b2', 'nouns', [question('q1', 1), question('q2', 2)]);

    store().next();
    expect(store().session).toMatchObject({ index: 0, chosen: null });

    store().choose(1);
    store().choose(0);
    expect(store().session).toMatchObject({ chosen: 1, correct: 1, wrong: 0 });

    store().next();
    expect(store().session).toMatchObject({ index: 1, chosen: null });

    store().choose(0);
    expect(store().session).toMatchObject({ correct: 1, wrong: 1 });
    store().next();
    const done = store().session;
    expect(done && isSessionDone(done)).toBe(true);
  });

  it('ignores flashcard actions, and ending clears the session', () => {
    store().startQuiz('b2', 'nouns', [question('q1', 0)]);
    const before = store().session;

    store().flip();
    store().grade(true);
    expect(store().session).toEqual(before);

    store().end();
    expect(store().session).toBeNull();
    /* With no session at all, every action is a no-op rather than a crash. */
    store().flip();
    store().grade(true);
    store().choose(0);
    store().next();
    expect(store().session).toBeNull();
  });
});
