import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { A2B1_EXAMS } from '@content/a2b1/exams/allExams.ts';
import { TRAINERS } from '@shared/config/trainers.ts';
import { type Settings } from '@shared/types/progress.ts';

/*
 * The listening audio: which voice reads, at what pitch per speaker, in what order, and what
 * happens with no speech synthesis or no German voice (no play is spent, the learner is told).
 * happy-dom ships no `speechSynthesis`, so each test installs a fake one and re-imports the
 * module, which reads the voice list once at import time.
 */

interface Spoken {
  readonly text: string;
  readonly voice: string | undefined;
  readonly pitch: number;
  readonly rate: number;
}

const toastErrors: string[] = [];

vi.mock('sonner', () => ({
  toast: {
    error: (title: string) => {
      toastErrors.push(title);
    }
  }
}));

const voice = (name: string, lang: string): SpeechSynthesisVoice =>
  ({ name, lang, voiceURI: name, localService: true, default: false }) as SpeechSynthesisVoice;

let voices: SpeechSynthesisVoice[] = [];
let spoken: Spoken[] = [];
let cancels = 0;

/* The shape of the handler the app sets, declared by example: the tests' lint config reports
   parameter names inside a bare function type. */
const failureHandler = (failure: { readonly error: string }): string => failure.error;

class FakeUtterance {
  text: string;
  voice: SpeechSynthesisVoice | null = null;
  lang = '';
  rate = 1;
  pitch = 1;
  onend: (() => void) | undefined;
  onerror: typeof failureHandler | undefined;
  constructor(text: string) {
    this.text = text;
  }
}

let pending: FakeUtterance | null = null;

const installSpeech = (): void => {
  Object.defineProperty(window, 'speechSynthesis', {
    configurable: true,
    value: {
      getVoices: () => voices,
      onvoiceschanged: null,
      cancel: () => {
        cancels += 1;
      },
      speak: (utterance: FakeUtterance) => {
        spoken.push({
          text: utterance.text,
          voice: utterance.voice?.name,
          pitch: utterance.pitch,
          rate: utterance.rate
        });
        pending = utterance;
      }
    }
  });
  vi.stubGlobal('SpeechSynthesisUtterance', FakeUtterance);
  vi.stubGlobal('speechSynthesis', window.speechSynthesis);
};

const load = () => import('@shared/lib/speech.ts');

/** Ends the utterance being spoken and lets the gap between turns pass. */
const finishTurn = async (): Promise<void> => {
  const current = pending;
  pending = null;
  current?.onend?.();
  await vi.advanceTimersByTimeAsync(400);
};

beforeEach(() => {
  vi.resetModules();
  vi.useFakeTimers();
  voices = [voice('Anna', 'de-DE'), voice('Samantha', 'en-US'), voice('Markus', 'de-AT')];
  spoken = [];
  pending = null;
  cancels = 0;
  toastErrors.length = 0;
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  Reflect.deleteProperty(window, 'speechSynthesis');
});

describe('speakScript', () => {
  it('reads a dialogue turn by turn, alternating pitch per speaker, in the chosen voice', async () => {
    installSpeech();
    const speech = await load();
    const done = vi.fn();

    const result = speech.speakScript(
      [
        { speaker: 'A', text: 'Hallo.' },
        { speaker: 'B', text: 'Guten Tag.' },
        { speaker: 'A', text: 'Tschüss.' }
      ],
      0.9,
      'Markus',
      done
    );

    expect(result.ok).toBe(true);
    expect(speech.isSpeaking()).toBe(true);
    await finishTurn();
    await finishTurn();
    await finishTurn();

    expect(spoken.map(turn => [turn.text, turn.pitch])).toEqual([
      ['Hallo.', 1.05],
      ['Guten Tag.', 0.85],
      ['Tschüss.', 1.05]
    ]);
    expect(spoken.every(turn => turn.voice === 'Markus' && turn.rate === 0.9)).toBe(true);
    expect(done).toHaveBeenCalledTimes(1);
    expect(speech.isSpeaking()).toBe(false);
  });

  it('reads a monologue at normal pitch, falling back to the first German voice', async () => {
    installSpeech();
    const speech = await load();

    speech.speakScript('Ein Text.', 1, 'Nobody');
    await finishTurn();

    expect(spoken).toEqual([{ text: 'Ein Text.', voice: 'Anna', pitch: 1, rate: 1 }]);
  });

  it('stops after the current turn when stopped, and carries on past a failed utterance', async () => {
    installSpeech();
    const speech = await load();
    const done = vi.fn();
    speech.speakScript(
      [
        { speaker: 'A', text: 'eins' },
        { speaker: 'B', text: 'zwei' },
        { speaker: 'A', text: 'drei' }
      ],
      1,
      'Anna',
      done
    );

    /* The first utterance errors: the next turn still comes. */
    pending?.onerror?.({ error: 'synthesis-failed' });
    await vi.advanceTimersByTimeAsync(150);
    expect(spoken.map(turn => turn.text)).toEqual(['eins', 'zwei']);

    speech.stopSpeech();
    expect(cancels).toBeGreaterThan(0);
    await finishTurn();
    expect(spoken.map(turn => turn.text)).toEqual(['eins', 'zwei']);
    expect(done).toHaveBeenCalledTimes(1);
  });

  it('refuses before starting when no German voice is installed, and says so', async () => {
    voices = [voice('Samantha', 'en-US')];
    installSpeech();
    const speech = await load();

    const result = speech.speakScript('Ein Text.', 1, 'Anna');

    expect(result.ok ? null : result.error.code).toBe('tts-no-voice');
    expect(spoken).toEqual([]);
    expect(toastErrors).toEqual(['No German voice installed']);
  });

  it('refuses before starting when the browser has no speech synthesis', async () => {
    const speech = await load();

    const result = speech.speakScript('Ein Text.', 1, 'Anna');

    expect(result.ok ? null : result.error.code).toBe('tts-unsupported');
    expect(toastErrors).toEqual(['This browser has no speech synthesis']);
  });
});

describe('the German voice list', () => {
  it('keeps only German voices, and notifies only when that set changes', async () => {
    installSpeech();
    const speech = await load();
    expect(speech.getGermanVoices().map(item => item.name)).toEqual(['Anna', 'Markus']);

    const listener = vi.fn();
    const unsubscribe = speech.subscribeToVoices(listener);
    const before = speech.getGermanVoices();

    /* Same German voices, a new English one: same array, no notification. */
    voices = [...voices, voice('Daniel', 'en-GB')];
    speech.subscribeToVoices(() => undefined)();
    expect(speech.getGermanVoices()).toBe(before);
    expect(listener).not.toHaveBeenCalled();

    voices = [voice('Anna', 'de-DE')];
    speech.subscribeToVoices(() => undefined)();
    expect(listener).toHaveBeenCalledTimes(1);
    expect(speech.getGermanVoices().map(item => item.name)).toEqual(['Anna']);

    unsubscribe();
    voices = [];
    speech.subscribeToVoices(() => undefined)();
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('treats a voice list that throws as no voices', async () => {
    installSpeech();
    const speech = await load();
    Object.defineProperty(window.speechSynthesis, 'getVoices', {
      value: () => {
        throw new Error('not allowed');
      }
    });

    speech.subscribeToVoices(() => undefined)();

    expect(speech.getGermanVoices()).toEqual([]);
  });
});

describe('rateForExam and audioForKey', () => {
  const exam = A2B1_EXAMS[0];
  if (!exam) throw new Error('no A2·B1 exam');
  const paper = TRAINERS.a2b1.paper;

  it('reads easier papers more slowly, then scales by the speed setting', async () => {
    const speech = await load();
    const settings = { ttsRate: 1 } as Settings;
    const at = (difficulty: typeof exam.difficulty): number =>
      speech.rateForExam(paper, { ...exam, difficulty }, settings);

    expect(at('easy')).toBeCloseTo(0.88 * paper.listeningRate);
    expect(at('medium')).toBeCloseTo(0.94 * paper.listeningRate);
    expect(at('b1')).toBeCloseTo(paper.listeningRate);
    expect(
      speech.rateForExam(paper, { ...exam, difficulty: 'b1' }, { ttsRate: 0.5 } as Settings)
    ).toBeCloseTo(0.5 * paper.listeningRate);
  });

  it('finds the clip for every listening key, and nothing for an unknown one', async () => {
    const speech = await load();
    const { hoeren } = exam;

    expect(speech.audioForKey(exam, 'h4')).toBe(hoeren.teil4.audio);
    expect(speech.audioForKey(exam, 'h5')).toBe(hoeren.teil5.audio);
    expect(speech.audioForKey(exam, 'h1.0')).toBe(hoeren.teil1.items[0]?.audio);
    expect(speech.audioForKey(exam, 'h2.1')).toBe(hoeren.teil2.items[1]?.audio);
    expect(speech.audioForKey(exam, 'h3.2')).toBe(hoeren.teil3.items[2]?.audio);
    expect(speech.audioForKey(exam, 'h1.99')).toBe('');
    expect(speech.audioForKey(exam, 'l1.0')).toBe('');
  });
});
