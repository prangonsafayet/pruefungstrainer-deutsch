/**
 * Whether a path is an exam sitting in progress — the runner route every trainer mounts at
 * `<base>/exam/:examId/:mode`. The shell goes distraction-free there: no main nav, no
 * trainer switcher, nothing that invites leaving mid-module. Results and review are not
 * sittings and keep the full chrome.
 */
export const isExamRunPath = (pathname: string): boolean => /(?:^|\/)exam\/[^/]+\/[^/]+\/?$/.test(pathname);
