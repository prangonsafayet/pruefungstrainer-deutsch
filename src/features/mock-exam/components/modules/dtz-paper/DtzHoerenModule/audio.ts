import { type DtzExam } from '@shared/types/dtzExam.ts';
import { type AudioScript } from '@shared/types/exam.ts';

/** The play key of Hören Teil 4's worked example. */
export const DTZ_BEISPIEL_AUDIO_KEY = 'h4.bsp';

/** Resolves the audio script for a listening key: `h1.0`–`h4.2`, or the Teil 4 Beispiel. */
export const dtzAudioForKey = (exam: DtzExam, key: string): AudioScript => {
  const { teil1, teil2, teil3, teil4 } = exam.hoeren;
  if (key === DTZ_BEISPIEL_AUDIO_KEY) return teil4.beispiel.audio;
  const [part, itemIndex] = key.split('.');
  const index = Number(itemIndex);
  switch (part) {
    case 'h1':
      return teil1.items[index]?.audio ?? '';
    case 'h2':
      return teil2.items[index]?.audio ?? '';
    case 'h3':
      return teil3.gespraeche[index]?.audio ?? '';
    case 'h4':
      return teil4.aussagen[index]?.audio ?? '';
    default:
      return '';
  }
};
