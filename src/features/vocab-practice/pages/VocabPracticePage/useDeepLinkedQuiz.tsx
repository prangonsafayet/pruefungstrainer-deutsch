import { useEffect, useRef } from 'react';

import { useSearchParams } from 'react-router-dom';

import { STUDY_CATEGORIES } from '@shared/config/studyCategories.ts';
import { type StudyCategory } from '@shared/types/vocab.ts';

const isCategory = (value: string | null): value is StudyCategory =>
  value !== null && (STUDY_CATEGORIES as readonly string[]).includes(value);

/**
 * A "drill it" link lands on the practice page as `?tab=quiz&category=…`; this starts that
 * quiz once, on arrival. Any other query is left for the page to read.
 */
export const useDeepLinkedQuiz = (startQuiz: (category: StudyCategory) => void): void => {
  const [params] = useSearchParams();
  const started = useRef(false);
  const wantedTab = params.get('tab');
  const wantedCategory = params.get('category');

  useEffect(() => {
    if (started.current || wantedTab !== 'quiz' || !isCategory(wantedCategory)) return;
    started.current = true;
    startQuiz(wantedCategory);
  }, [wantedTab, wantedCategory, startQuiz]);
};
